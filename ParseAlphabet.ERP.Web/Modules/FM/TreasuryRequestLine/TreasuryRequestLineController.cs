using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FM.TreasuryRequestLine;
using ParsAlphabet.ERP.Application.Interfaces.FM.TreasuryRequest;
using ParsAlphabet.ERP.Application.Interfaces.FM.TreasuryRequestLine;

namespace ParseAlphabet.ERP.Web.Modules.FM.TreasuryRequestLine;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class TreasuryRequestLineApiController : ControllerBase
{
    private readonly ITreasuryRequestLineRepository _treasuryRequestLineRepository;
    private readonly ITreasuryRequestRepository _treasuryRequestRepository;

    public TreasuryRequestLineApiController(ITreasuryRequestLineRepository TreasuryRequestLineRepository,
        ITreasuryRequestRepository TreasuryRequestRepository)
    {
        _treasuryRequestLineRepository = TreasuryRequestLineRepository;
        _treasuryRequestRepository = TreasuryRequestRepository;
    }

    [HttpPost]
    [Route("display")]
    [Authenticate(Operation.DIS, "TreasuryRequest")]
    public async Task<MyResultPage<TreasuryRequestLineDisplay>> Display([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;
        return await _treasuryRequestLineRepository.Display(model, userId, roleId);
    }


    [HttpPost]
    [Route("getheader")]
    [Authenticate(Operation.VIW, "TreasuryRequest")]
    public async Task<MyResultPage<TreasuryRequestLineDisplay>> GetHeader([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await _treasuryRequestLineRepository.GetHeader(model, roleId);
    }


    [HttpPost]
    [Route("gettreasuryrequestlinepage")]
    [Authenticate(Operation.VIW, "TreasuryRequest")]
    public async
        Task<MyResultStageStepConfigPage<
            List<ParsAlphabet.ERP.Application.Dtos.FM.TreasuryRequestLine.TreasuryRequestLine>>>
        GetTreasuryRequestLinePage(
            [FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _treasuryRequestLineRepository.GetPage(model);
    }

    [HttpPost]
    [Route("treasuryrequestlinesum")]
    [Authenticate(Operation.VIW, "TreasuryRequest")]
    public async Task<TreasuryRequestLineSum> GetTreasuryRequestLineSum([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _treasuryRequestLineRepository.GetTreasuryRequestLineSum(model);
    }


    [HttpPost]
    [Route("deletetreasuryrequestLine")]
    [Authenticate(Operation.DEL, "TreasuryRequest")]
    public async Task<MyResultStatus> DeleteTreasuryRequestLine([FromBody] GetTreasuryRequestLine model)
    {
        var companyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await _treasuryRequestLineRepository.Delete(model, companyId, roleId);
    }


    [HttpPost]
    [Route("inserttreasuryrequestLine")]
    [Authenticate(Operation.INS, "TreasuryRequest")]
    public async Task<TreasuryRequestLineResult> InsertTreasuryLine([FromBody] TreasuryRequestLineModel model)
    {
        if (ModelState.IsValid)
        {
            model.CreateUserId = UserClaims.GetUserId();
            ;
            model.CompanyId = UserClaims.GetCompanyId();
            var roleId = UserClaims.GetRoleId();
            ;
            return await _treasuryRequestLineRepository.Save(model, roleId);
        }

        return (TreasuryRequestLineResult)ModelState.ToMyResultQuery<int>();
    }


    [HttpPost]
    [Route("getrecordbyids")]
    [Authenticate(Operation.VIW, "TreasuryRequest")]
    public async Task<MyResultPage<TreasuryRequestLineGetReccord>> GetRecordById(
        [FromBody] GetTreasuryRequestLine model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _treasuryRequestLineRepository.GetRecordById(model);
    }


    [HttpPost]
    [Route("updatetreasuryrequsetLine")]
    [Authenticate(Operation.UPD, "TreasuryRequest")]
    public async Task<TreasuryRequestLineResult> UpdateTreasuryLine([FromBody] TreasuryRequestLineModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.CreateUserId = Convert.ToInt16(User.FindFirstValue("UserId"));
        var roleId = UserClaims.GetRoleId();
        ;
        return await _treasuryRequestLineRepository.Save(model, roleId);
    }


    [HttpPost]
    [Route("csvline")]
    [Authenticate(Operation.PRN, "TreasuryRequest")]
    public async Task<CSVViewModel<IEnumerable>> GetCSV([FromBody] NewGetPageViewModel model)
    {
        var treasuryId = int.Parse(model.Form_KeyValue[0]?.ToString());
        model.CompanyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;
        var treasuryExist = await _treasuryRequestRepository.CheckExist(treasuryId, model.CompanyId, userId, roleId);

        if (treasuryExist)
            return await _treasuryRequestLineRepository.TreasuryRequestLineCSV(model);
        return new CSVViewModel<IEnumerable>
        {
            Columns = null,
            Rows = null
        };
    }
}

[Route("FM")]
[Authorize]
public class TreasuryRequestLineController : Controller
{
    [Route("[controller]/{id}/{isDefaultCurrency}")]
    [Authenticate(Operation.VIW, "TreasuryRequest")]
    [HttpGet]
    public ActionResult Index(int id, int isDefaultCurrency)
    {
        return PartialView(Views.FM.TreasuryRequestLine);
    }

    [Route("[controller]/display/{id}/{isDefaultCurrency}/{stageId}/{workflowId}")]
    [Authenticate(Operation.DIS, "TreasuryRequest")]
    [HttpGet]
    public ActionResult Display(int id, int isDefaultCurrency, short stageId, int workflowId)
    {
        return PartialView(Views.FM.TreasuryRequestDisplay);
    }
}