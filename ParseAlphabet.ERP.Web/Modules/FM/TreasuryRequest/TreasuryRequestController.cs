using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FM.TreasuryRequest;
using ParsAlphabet.ERP.Application.Dtos.WF.StageActionLog;
using ParsAlphabet.ERP.Application.Interfaces.FM.TreasuryRequest;
using Enum = ParsAlphabet.ERP.Application.Enums.Enum;


namespace ParseAlphabet.ERP.Web.Modules.FM.TreasuryRequest;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class TreasuryRequestApiController : ControllerBase
{
    private readonly ITreasuryRequestRepository _treasuryRequestRepository;

    public TreasuryRequestApiController(ITreasuryRequestRepository treasuryRequestRepository)
    {
        _treasuryRequestRepository = treasuryRequestRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<TreasuryRequestGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        if (model.Form_KeyValue[0]?.ToString() == "my")
            model.Form_KeyValue[1] = User.FindFirstValue("UserId");

        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;
        return await _treasuryRequestRepository.GetPage(model, userId, roleId);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<TreasuryRequestGetRecord>> GetRecordById([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await _treasuryRequestRepository.GetRecordById(id, companyId, roleId);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] TreasuryRequestModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.CreateUserId = UserClaims.GetUserId();
            ;
            var roleId = UserClaims.GetRoleId();
            ;
            return await _treasuryRequestRepository.Insert(model, roleId);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] TreasuryRequestModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.CreateUserId = UserClaims.GetUserId();
            ;
            return await _treasuryRequestRepository.Update(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<TreasuryRequestResult> Delete([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await _treasuryRequestRepository.Delete(id, companyId, roleId);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        var companyId = UserClaims.GetCompanyId();
        return _treasuryRequestRepository.GetColumns(companyId);
    }


    [HttpPost]
    [Route("updateinline")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> UpdateInline([FromBody] TreasuryRequestModelUpdateInline model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.CreateUserId = UserClaims.GetUserId();
            ;
            return await _treasuryRequestRepository.UpdateInLine(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }


    [HttpPost]
    [Route("checkexist")]
    public async Task<bool> TreasuryRequestCheckExist([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;
        return await _treasuryRequestRepository.CheckExist(id, companyId, userId, roleId);
    }

    [HttpPost]
    [Route("gettransactionDate")]
    public async Task<string> GetTransactionDate([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _treasuryRequestRepository.GetTransactionDatePersian(id, companyId);
    }

    [HttpPost]
    [Route("gettreasuryrequeststeplist")]
    public async Task<MyResultDataQuery<List<TreasuryRequestStepLogList>>> GetTreasuryRequestStepList(
        [FromBody] int treasuryId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _treasuryRequestRepository.GetTreasuryStepList(treasuryId, companyId);
    }

    [HttpPost]
    [Route("updatestep")]
    public async Task<TreasuryRequestResultStatus> UpdateStep([FromBody] UpdateAction model)
    {
        model.UserId = UserClaims.GetUserId();
        ;
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await _treasuryRequestRepository.UpdateTreasuryRequestStep(model, Enum.OperationType.Update, roleId);
    }

    [HttpPost]
    [Route("validateupdatestep")]
    public async Task<List<string>> ValidateUpdateStep([FromBody] UpdateAction model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.UserId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;
        var result = await _treasuryRequestRepository.ValidateUpdateStep(model, Enum.OperationType.Update, roleId);

        return result;
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
        return await _treasuryRequestRepository.Csv(model, userId, roleId);
    }

    [HttpPost]
    [Route("getinfo")]
    public async Task<TreasuryRequestInfo> GetItemTransactionInfo([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _treasuryRequestRepository.GetTreasuryRequestInfo(id, companyId);
    }
}

[Route("FM")]
[Authorize]
public class TreasuryRequestController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.FM.TreasuryRequest);
    }
}