using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FM.NewTreasury;
using ParsAlphabet.ERP.Application.Dtos.WF.StageActionLog;
using ParsAlphabet.ERP.Application.Interfaces.FM.NewTreasury;
using Enum = ParsAlphabet.ERP.Application.Enums.Enum;

namespace ParseAlphabet.ERP.Web.Modules.FM.NewTreasury;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class NewTreasuryApiController : ControllerBase
{
    private readonly INewTreasuryRepository _newTreasuryRepository;

    public NewTreasuryApiController(INewTreasuryRepository newTreasuryRepository)
    {
        _newTreasuryRepository = newTreasuryRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<NewTreasuryGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        if (model.Form_KeyValue[0]?.ToString() == "my")
            model.Form_KeyValue[1] = User.FindFirstValue("UserId");

        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;
        return await _newTreasuryRepository.GetPage(model, userId, roleId);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<NewTreasuryGetRecord>> GetRecordById([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();

        return await _newTreasuryRepository.GetRecordById(id, companyId);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] NewTreasuryModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.CreateUserId = UserClaims.GetUserId();
            ;
            var roleId = UserClaims.GetRoleId();
            ;
            return await _newTreasuryRepository.Insert(model, roleId);
        }

        return ModelState.ToMyResultQuery<int>();
    }


    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] NewTreasuryModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.CreateUserId = UserClaims.GetUserId();
            ;
            return await _newTreasuryRepository.Update(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("updateinline")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> UpdateInline([FromBody] NewTreasuryModelUpdateInline model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.CreateUserId = UserClaims.GetUserId();
            ;
            return await _newTreasuryRepository.UpdateInLine(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<NewTreasuryResult> Delete([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await _newTreasuryRepository.Delete(id, companyId, roleId);
    }


    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        if (model.Form_KeyValue[0]?.ToString() == "my")
            model.Form_KeyValue[1] = User.FindFirstValue("UserId");

        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;
        return await _newTreasuryRepository.Csv(model, userId, roleId);
    }


    [HttpGet]
    [Route("requestfundtypegetdropdown/{treasuryId}/{workflowId}/{requestId}/{listType}")]
    public async Task<IEnumerable<MyDropDownViewModel>> RequestFundType_GetDropDown(long treasuryId, int workflowId,
        long requestId, int listType)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _newTreasuryRepository.RequestFundType_GetDropDown(treasuryId, workflowId, requestId, listType,
            companyId);
    }

    [HttpGet]
    [Route("treasuryrequest_getdropdown/{branchId}/{workflowId}/{stageId}/{requestId?}/{treasuryId?}")]
    public async Task<List<ParentIdMyDropdownViewModel>> TreasuryRequest_GetDropDown(short branchId, short workflowId,
        short stageId, long? requestId, long? treasuryId)
    {
        var companyId = UserClaims.GetCompanyId();

        return await _newTreasuryRepository.TreasuryRequest_GetDropDown(branchId, workflowId, companyId, stageId,
            requestId, treasuryId);
    }


    [HttpPost]
    [Route("updatestep")]
    public async Task<NewTreasuryResultStatus> UpdateStep([FromBody] UpdateAction model)
    {
        model.UserId = UserClaims.GetUserId();
        ;
        model.CompanyId = UserClaims.GetCompanyId();

        return await _newTreasuryRepository.UpdateTreasuryStep(model, Enum.OperationType.Update);
    }

    [HttpPost]
    [Route("gettreasurysteplist")]
    public async Task<MyResultDataQuery<List<NewTreasuryStepLogList>>> GetTreasuryStepList([FromBody] int treasuryId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _newTreasuryRepository.GetTreasuryStepList(treasuryId, companyId);
    }

    [HttpPost]
    [Route("getrequesttreasurytreasurysubject")]
    public async Task<MyDropDownViewModel> GetTreasuryRequestTreasurySubject([FromBody] int requestId)
    {
        return await _newTreasuryRepository.GetTreasuryRequestTreasurySubject(requestId);
    }

    [HttpPost]
    [Route("checkexist")]
    public async Task<bool> TreasuryCheckExist([FromBody] TreasuryExistViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;
        return await _newTreasuryRepository.CheckExist(model, userId, roleId);
    }

    [HttpPost]
    [Route("requestislastconfirmheader")]
    public async Task<bool> CheckRequestIsLastConfirmHeader([FromBody] int requestId)
    {
        return await _newTreasuryRepository.CheckRequestIsLastConfirmHeader(requestId);
    }


    [HttpPost]
    [Route("validateupdatestep")]
    public async Task<List<string>> ValidateUpdateStep([FromBody] UpdateAction model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.UserId = UserClaims.GetUserId();
        ;

        var result = await _newTreasuryRepository.ValidateUpdateStep(model, Enum.OperationType.Update);

        return result;
    }
}

[Route("FM")]
[Authorize]
public class NewTreasuryController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.FM.NewTreasury);
    }
}