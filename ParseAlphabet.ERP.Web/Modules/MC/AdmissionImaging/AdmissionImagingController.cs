using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionImaging;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionImaging;

namespace ParseAlphabet.ERP.Web.Modules.MC.AdmissionImaging;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class AdmissionImagingApiController(AdmissionImagingRepository admissionImagingRepository) : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    public async Task<MyResultPage<List<AdmissionImagingGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        if (model.Form_KeyValue[0]?.ToString() == "myimage")
            model.Form_KeyValue[1] = User.FindFirstValue("UserId");
        else
            model.Form_KeyValue[1] = null;

        var userId = UserClaims.GetUserId();
        var roleId = UserClaims.GetRoleId();
        return await admissionImagingRepository.GetPage(model, userId, roleId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        if (model.Form_KeyValue[1]?.ToString() == "myimage")
            model.Form_KeyValue[1] = User.FindFirstValue("UserId");
        else
            model.Form_KeyValue[1] = null;

        var userId = UserClaims.GetUserId();
        var roleId = UserClaims.GetRoleId();
        return await admissionImagingRepository.Csv(model, userId, roleId);
    }


    [HttpPost]
    [Route("save")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> Save([FromBody] AdmissionImagingModel model)
    {
        var result = new MyResultStatus();
        model.CompanyId = UserClaims.GetCompanyId();
        model.CreateUserId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;

        var admissionImagingPermissionModel = new AdmissionImagingCheckPermissionViewModel
        {
            Id = model.Id,
            RoleId = roleId,
            BranchId = model.BranchId,
            WorkflowId = model.WorkflowId,
            StageId = model.StageId,
            ActionId = model.ActionId,
            CompanyId = model.CompanyId
        };

        var validateAdmissionImagingResult =
            await admissionImagingRepository.ValidateCheckAdmissionImagingPermission(admissionImagingPermissionModel);
        if (validateAdmissionImagingResult != "")
        {
            result.Successfull = false;
            result.StatusMessage = validateAdmissionImagingResult;
            result.ValidationErrors.Add(validateAdmissionImagingResult);
            return result;
        }

        result = await admissionImagingRepository.SaveAdmissionImaging(model);


        return result;
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<AdmissionImagingGetRecord>> GetRecordById([FromBody] NextAdmissionImagingModel model)
    {
        var headerPagination = 0;
        var admissionImagingId = 0;
        if (model != null)
        {
            admissionImagingId = model.AdmissionImagingId;
            headerPagination = model.HeaderPagination;
        }

        var userId = UserClaims.GetUserId();
        ;
        return await admissionImagingRepository.GetRecordById(admissionImagingId, headerPagination, userId);
    }

    [HttpPost]
    [Route("checkexist")]
    public async Task<bool> PrescriptionCheckExist([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;
        return await admissionImagingRepository.CheckExist(id, companyId, userId);
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] AdmissionImagingDelete model)
    {
        return await admissionImagingRepository.Delete(model);
    }

    [HttpGet]
    [Route("getdropdownadmissionstage")]
    public async Task<List<MyDropDownViewModel>> DropDownAdmissionStage()
    {
        return await admissionImagingRepository.GetDropDownAdmissionStage();
    }


    [HttpGet]
    [Route("getcacheselectedattender")]
    public int? GetCacheAttenderSelected()
    {
        var userId = UserClaims.GetUserId();
       
        return admissionImagingRepository.GetCacheSelectedAttender(userId);
    }

    [HttpGet]
    [Route("setcacheselectedattender/{attenderId}")]
    public void SetCacheAttenderSelected(int attenderId)
    {
        var userId = UserClaims.GetUserId();
        ;
        admissionImagingRepository.SetCacheSelectedAttender(userId, attenderId);
    }
}

[Route("MC")]
[Authorize]
public class AdmissionImagingController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.MC.AdmissionImaging);
    }

    [Route("[controller]/form/{id?}/{stage?}")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Form(int? id)
    {
        return PartialView(Views.MC.AdmissionImagingForm);
    }

    [Route("[controller]/display/{id}")]
    [CheckRequest]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Display(int id)
    {
        return PartialView(Views.MC.AdmissionImagingDisplay);
    }
}