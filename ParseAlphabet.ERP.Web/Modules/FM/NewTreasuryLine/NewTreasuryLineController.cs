using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FM.NewTreasury;
using ParsAlphabet.ERP.Application.Dtos.FM.NewTreasuryLine;
using ParsAlphabet.ERP.Application.Interfaces.FM.NewTreasury;
using ParsAlphabet.ERP.Application.Interfaces.FM.NewTreasuryLine;

namespace ParseAlphabet.ERP.Web.Modules.FM.NewTreasuryLine;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class NewTreasuryLineApiController : ControllerBase
{
    private readonly INewTreasuryLineRepository _newTreasuryLineRepository;
    private readonly INewTreasuryRepository _newTreasuryRepository;

    public NewTreasuryLineApiController(INewTreasuryLineRepository NewTreasuryLineRepository,
        INewTreasuryRepository newTreasuryRepository)
    {
        _newTreasuryLineRepository = NewTreasuryLineRepository;
        _newTreasuryRepository = newTreasuryRepository;
    }

    [HttpPost]
    [Route("display")]
    [Authenticate(Operation.DIS, "NewTreasury")]
    public async Task<MyResultPage<NewTreasuryLineDisplay>> Display([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;

        return await _newTreasuryLineRepository.Display(model, userId, roleId);
    }

    [HttpPost]
    [Route("csvline")]
    [Authenticate(Operation.PRN, "NewTreasury")]
    public async Task<CSVViewModel<IEnumerable>> GetCSV([FromBody] NewGetPageViewModel model)
    {
        var treasuryId = int.Parse(model.Form_KeyValue[0]?.ToString());
        model.CompanyId = UserClaims.GetCompanyId();

        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;
        var treasuryViewModel = new TreasuryExistViewModel
        {
            BySystem = 2,
            Id = treasuryId,
            CompanyId = model.CompanyId
        };
        var treasuryExist = await _newTreasuryRepository.CheckExist(treasuryViewModel, userId, roleId);

        if (treasuryExist)
            return await _newTreasuryLineRepository.TreasuryLineCSV(model);
        return new CSVViewModel<IEnumerable>
        {
            Columns = null,
            Rows = null
        };
    }

    [HttpPost]
    [Route("getheader")]
    [Authenticate(Operation.VIW, "NewTreasury")]
    public async Task<MyResultPage<NewTreasuryLineDisplay>> GetHeader([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _newTreasuryLineRepository.GetHeader(model);
    }

    [HttpPost]
    [Route("gettreasurylinepage")]
    [Authenticate(Operation.VIW, "NewTreasury")]
    public async Task<MyResultStageStepConfigPage<List<NewTreasuryLines>>> GetTreasuryLinePage(
        [FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _newTreasuryLineRepository.GetPage(model);
    }

    [HttpPost]
    [Route("treasurylinesum")]
    [Authenticate(Operation.VIW, "NewTreasury")]
    public async Task<NewTreasuryLineSum> GetTreasuryLineSum([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _newTreasuryLineRepository.GetTreasuryLineSum(model);
    }


    [HttpPost]
    [Route("getrecordbyids")]
    [Authenticate(Operation.VIW, "NewTreasury")]
    public async Task<MyResultPage<NewTreasuryLineGetReccord>> GetRecordById([FromBody] GetTreasuryLine model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _newTreasuryLineRepository.GetRecordById(model);
    }

    [HttpPost]
    [Route("insertTreasuryLine")]
    [Authenticate(Operation.INS, "NewTreasury")]
    public async Task<MyResultStatus> InsertTreasuryLine([FromBody] NewTreasuryLineModel model)
    {
        if (ModelState.IsValid)
        {
            model.CreateUserId = UserClaims.GetUserId();
            ;
            var companyId = UserClaims.GetCompanyId();

            var result = await _newTreasuryLineRepository.ValidationBeforeSave(model, companyId);
            if (result.Successfull)
                return await _newTreasuryLineRepository.Save(model, companyId);
            return result;
        }

        return ModelState.ToMyResultStatus<int>();
    }


    [HttpPost]
    [Route("insertpreviousstagelines")]
    [Authenticate(Operation.INS, "NewTreasury")]
    public async Task<MyResultStatus> InsertPreviousStageLinests([FromBody] List<TreasuryLineGetRecord> modelList,
        [FromRoute] bool isDefaultCurrency)
    {
        var createUserId = Convert.ToInt16(User.FindFirstValue("UserId"));
        var companyId = UserClaims.GetCompanyId();


        return await _newTreasuryLineRepository.InsertPreviousStageLinests(modelList, companyId, createUserId,
            isDefaultCurrency);
    }

    [HttpPost]
    [Route("updateTreasuryLine")]
    [Authenticate(Operation.UPD, "NewTreasury")]
    public async Task<MyResultStatus> UpdateTreasuryLine([FromBody] NewTreasuryLineModel model)
    {
        model.CreateUserId = Convert.ToInt16(User.FindFirstValue("UserId"));
        var companyId = UserClaims.GetCompanyId();
        var result = await _newTreasuryLineRepository.ValidationBeforeSave(model, companyId);
        if (result.Successfull)
            return await _newTreasuryLineRepository.Save(model, companyId);

        return result;
    }

    [HttpPost]
    [Route("deleteTreasuryLine")]
    [Authenticate(Operation.DEL, "NewTreasury")]
    public async Task<MyResultStatus> DeleteTreasuryLine([FromBody] GetTreasuryLine model)
    {
        var companyId = UserClaims.GetCompanyId();

        return await _newTreasuryLineRepository.Delete(model, companyId);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _newTreasuryLineRepository.GetTreasuryHeaderColumns(0);
    }

    [HttpPost]
    [Route("getTreasuryCheckBankInfo")]
    public async Task<NewTreasuryLines> GetTreasuryCheckBankInfo([FromBody] int treasuryId)
    {
        return await _newTreasuryLineRepository.GetTreasuryCheckBankInfo(treasuryId);
    }

    [HttpPost]
    [Route("getaccountdetail")]
    public async Task<List<MyDropDownViewModel>> GetAccountDetail([FromBody] GetAccountDetail model)
    {
        return await _newTreasuryLineRepository.GetAccountDetail(model);
    }

    [HttpPost]
    [Route("gettreasuryrequest")]
    [Authenticate(Operation.VIW, "NewTreasury")]
    public async Task<MyResultStageStepConfigPage<ParsAlphabet.ERP.Application.Dtos.FM.NewTreasuryLine.TreasuryRequest>>
        GetTreasuryLineRequest([FromBody] GetPageViewModel model)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _newTreasuryLineRepository.GetTreasuryLineRequest(model, companyId);
    }

    [HttpPost]
    [Route("getTreasuryLineCount")]
    public async Task<int> GetTreasuryLineCount([FromBody] int id)
    {
        return await _newTreasuryLineRepository.ExistTreasuryLine(id);
    }
}

[Route("FM")]
[Authorize]
public class NewTreasuryLineController : Controller
{
    [Route("[controller]/{id}/{isDefaultCurrency}")]
    [Authenticate(Operation.VIW, "NewTreasury")]
    [HttpGet]
    public ActionResult Index(int id, int isDefaultCurrency)
    {
        return PartialView(Views.FM.NewTreasuryLine);
        //return PartialView(Views.FM.NewTreasuryLineV1);
    }

    [Route("[controller]/display/{id}/{requestId}/{isDefaultCurrency}/{stageId}/{workflowId}")]
    [Authenticate(Operation.DIS, "NewTreasury")]
    [HttpGet]
    public ActionResult Display(int id, int requestId, int isDefaultCurrency, short stageId, int workflowId)
    {
        return PartialView(Views.FM.NewTreasuryDisplay);
    }
}