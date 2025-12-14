using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos._History;
using ParsAlphabet.ERP.Application.Dtos.MC.Admission;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionItem;
using ParsAlphabet.ERP.Application.Dtos.WF.StageActionLog;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionClose;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionCounter;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionMaster;
using ParsAlphabet.ERP.Infrastructure.Implantation._History;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionItem;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionMaster;

namespace ParseAlphabet.ERP.Web.Modules.MC.AdmissionItem;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class AdmissionItemApiController(
    AdmissionItemRepository admissionItemRepository,
    IAdmissionMasterRepository admissionMasterRepository,
    IAdmissionCounterRepository admissionCounter,
    IAdmissionCloseRepository admissionCloseRepository,
    HistoryRepository history,
    IHttpContextAccessor accessor)
    : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<AdmissionItemGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        if (model.Form_KeyValue[0]?.ToString() == "myadm")
            model.Form_KeyValue[1] = User.FindFirstValue("UserId");

        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;

        return await admissionItemRepository.GetPage(model, userId, roleId);
    }

    [HttpPost]
    [Route("display")]
    [Authenticate(Operation.VIW, "")]
    public async Task<AdmissionItemDisplay> Display([FromBody] int id)
    {
        return await admissionItemRepository.Display(id);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return admissionItemRepository.GetColumns();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await admissionItemRepository.Delete(keyvalue, CompanyId);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultDataQuery<AdmissionResultQuery>> Insert([FromBody] AdmissionItemModel model)
    {
        if (ModelState.IsValid)
        {
            var result = new MyResultDataQuery<AdmissionResultQuery>();
            if (model.AdmissionPatientJSON.NotNull())
                if ((model.ReferralTypeId == 1 &&
                     !model.AdmissionPatientJSON.NationalCode.IsNullOrEmptyOrWhiteSpace() &&
                     !Extensions.Validation.IsValidIranianNationalCode(model.AdmissionPatientJSON.NationalCode))
                    || (model.ReferralTypeId == 4 &&
                        !model.AdmissionPatientJSON.NationalCode.IsNullOrEmptyOrWhiteSpace() &&
                        model.AdmissionPatientJSON.NationalCode.Length != 13))
                {
                    var resultValidation = new MyResultDataQuery<AdmissionResultQuery>();
                    resultValidation.Successfull = false;
                    resultValidation.ValidationErrors = new List<string> { "نمبر تذکره معتبر نمی باشد" };
                    return resultValidation;
                }

            MyClaim.Init(accessor);
            var ipAdrress = MyClaim.IpAddress;

            model.UserId = UserClaims.GetUserId();
            ;
            model.CompanyId = UserClaims.GetCompanyId();

            var counter = await admissionCounter.GetRecordByUserId(model.UserId, model.CompanyId);
            //model.CounterId = counter.Data.Id;
            model.BranchId = counter.Data.BranchId;
            var roleId = UserClaims.GetRoleId();
            ;

            #region validateAdmissionMaster

            var masterModel = new AdmissionCheckPermissionViewModel
            {
                Id = model.AdmissionMasterId,
                RoleId = roleId,
                BranchId = model.BranchId,
                WorkflowId = model.AdmissionMasterWorkflowId,
                StageId = model.AdmissionMasterStageId,
                ActionId = model.AdmissionMasterActionId,
                CompanyId = model.CompanyId
            };

            var validateAdmissionMasterResult =
                await admissionMasterRepository.ValidateCheckAdmissionMasterPermission(masterModel);

            #endregion

            #region validateAdmissionItem

            var admissionItemModel = new AdmissionCheckPermissionViewModel
            {
                Id = model.Id,
                RoleId = roleId,
                BranchId = model.BranchId,
                WorkflowId = model.WorkflowId,
                StageId = model.StageId,
                ActionId = model.ActionId,
                CompanyId = model.CompanyId
            };

            var validateAdmissionItemResult =
                await admissionItemRepository.ValidateCheckAdmissionItemPermission(admissionItemModel);

            #endregion

            if (validateAdmissionMasterResult != "" || validateAdmissionItemResult != "")
            {
                result.Successfull = false;
                result.ValidationErrors.Add(validateAdmissionMasterResult);
                result.ValidationErrors.Add(validateAdmissionItemResult);
                result.ValidationErrors.RemoveAll(x => x == "");
                return result;
            }

            result = await admissionItemRepository.Insert(model);


            var itemIds = "";

            if (model.AdmissionItemLineList.NotNull())
                foreach (var item in model.AdmissionItemLineList)
                    itemIds += $"{item.ItemId},";
            var userAgent = new UserAgent(Request.Headers["User-Agent"]);
            var historyModel = new HistoryModel
            {
                ControllerName = nameof(AdmissionItemApiController),
                ActionName = nameof(Insert),
                Browser = userAgent.Browser.NameAndVersion,
                CompanyId = model.CompanyId,
                Description = $@"AdmissionId:{result.Data.Id}
                                    _UserId:{model.UserId}
                                    _ItemIds:{itemIds}
                                    _PatientId:{model.AdmissionPatientJSON.Id}
                                    _PatientFullName:{model.AdmissionPatientJSON.FirstName + " " + model.AdmissionPatientJSON.LastName}
                                    _PatientNationalCode:{model.AdmissionPatientJSON.NationalCode}",
                UserId = model.UserId,
                IpAddress = ipAdrress,
                OperatingSystem = userAgent.OS.NameAndVersion
            };

            var resultHistory = await history.Insert(historyModel);

            return result;
        }

        return ModelState.ToMyResultDataQuery<AdmissionResultQuery>();
    }

    [HttpPost]
    [Route("calitemprice")]
    [Authenticate(Operation.INS, "")]
    public async Task<CalculateItemPrice> ItemCalPrice([FromBody] GetCalculateItemPrice model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await admissionItemRepository.CalculateItemPrice(model);
    }

    [HttpGet]
    [Route("updatelastaction/{admissionMasterId}/{identityId}/{requestActionId}")]
    public async Task<MyResultStatus> UpdateLastAction(int admissionMasterId, int identityId, byte requestActionId)
    {
        return await admissionItemRepository.UpdateLastAction(admissionMasterId, identityId, requestActionId);
    }

    [HttpPost]
    [Route("opencash")]
    [Authenticate(Operation.VIW, "")]
    public async Task<bool> CheckOpenCash([FromBody] int id)
    {
        MyClaim.Init(accessor);

        var companyId = UserClaims.GetCompanyId();
        short branchId = 0;
        var dateTime = DateTime.Now;

        if (id != 0)
        {
            dateTime = await admissionItemRepository.GetCreateDate(id);
            branchId = await admissionItemRepository.GetBranchId(id);
        }

        return await admissionCloseRepository.CheckExistOpenCash(dateTime.ToString("yyyy/MM/dd"), branchId, companyId);
    }

    [HttpPost]
    [Route("getprintadmissionsale")]
    [AllowAnonymous]
    public async Task<List<AdmissionItemPrint>> GetPrintAdmissionItem([FromBody] int id)
    {
        return await admissionItemRepository.GetAdmissionItemPrint(id, 1);
    }

    [HttpPost]
    [Route("validationadmissionsale/{admissionMasterId}")]
    public async Task<List<string>> ValidationAdmissionItem([FromBody] UpdateAction model,
        [FromRoute] int admissionMasterId)
    {
        model.UserId = UserClaims.GetUserId();
        ;
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await admissionItemRepository.ValidationActionLogAdmissionItem(model, roleId, admissionMasterId);
    }


    [HttpGet]
    [Route("getadmissionitem")]
    [AllowAnonymous]
    public async Task<IEnumerable<MyDropDownViewModel>> GetAdmissionSaleItem(int? vendorId,
        string fromWorkDayDatePersian, string toWorkDayDatePersian)
    {
        var model = new GetAdmissionSaleItem
        {
            VendorId = vendorId,
            FromWorkDayDatePersian = fromWorkDayDatePersian,
            ToWorkDayDatePersian = toWorkDayDatePersian
        };

        return await admissionItemRepository.GetAdmissionSaleItem(model);
    }

    [HttpGet]
    [Route("deleteadmissionitem/{admissionMasterId}/{id}/{branchId}")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultStatus> DeleteAdmissionItem(int admissionMasterId, int id, short branchId)
    {
        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;

        return await admissionItemRepository.DeleteAdmissionItem(admissionMasterId, id, branchId, roleId, userId);
    }
}

[Route("MC")]
[Authorize]
public class AdmissionItemController : Controller
{
    [Route("[controller]")]
    [CheckRequest]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Index()
    {
        return PartialView(Views.MC.AdmissionItem);
    }


    [Route("[controller]/form/{id?}")]
    [CheckRequest]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Form(int? id)
    {
        return PartialView(Views.MC.AdmissionItemForm);
    }

    [Route("[controller]/display/{id}")]
    [CheckRequest]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Display(int id)
    {
        return PartialView(Views.MC.AdmissionItemDisplay);
    }
}