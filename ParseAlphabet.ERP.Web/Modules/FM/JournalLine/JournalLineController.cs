using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FM.JournalLine;
using ParsAlphabet.ERP.Application.Interfaces.FM;
using ParsAlphabet.ERP.Application.Interfaces.FM.JournalLine;

namespace ParseAlphabet.ERP.Web.Modules.FM.JournalLine;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class JournalLineApiController : ControllerBase
{
    private readonly IFinanceRepository _financeRepository;
    private readonly IJournalLineRepository _journalLineRepository;

    public JournalLineApiController(IJournalLineRepository journalLineRepository, IFinanceRepository financeRepository)
    {
        _journalLineRepository = journalLineRepository;
        _financeRepository = financeRepository;
    }


    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.DIS, "Journal")]
    public async Task<MyResultPage<JournalLineGetPage>> GetPage([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;
        return await _journalLineRepository.Display(model, userId);
    }

    [HttpPost]
    [Route("getheader")]
    [Authenticate(Operation.DIS, "Journal")]
    public async Task<MyResultPage<JournalLineGetPage>> GetHeader([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;
        return await _journalLineRepository.Display(model, userId);
    }

    [HttpPost]
    [Route("csvline")]
    [Authenticate(Operation.PRN, "Journal")]
    public async Task<CSVViewModel<IEnumerable>> GetCsv([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _journalLineRepository.Csv(model);
    }

    [HttpPost]
    [Route("getjournallinepage")]
    [Authenticate(Operation.VIW, "Journal")]
    public async Task<MyResultPage<List<JournalLines>>> GetJournalLinePage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        return await _journalLineRepository.GetJournalLinePage(model);
    }

    [HttpPost]
    [Route("journallinesum")]
    [Authenticate(Operation.VIW, "Journal")]
    public async Task<JournalLineSum> GetJournalLineSum([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        return await _journalLineRepository.GetJournalLineSum(model);
    }

    [HttpPost]
    [Route("getrecordbyids")]
    [Authenticate(Operation.VIW, "Journal")]
    public async Task<MyResultPage<JournalLineGetRecord>> GetRecordById([FromBody] GetJournalLine model)
    {
        return await _journalLineRepository.GetRecordByIds(model.Id);
    }

    [HttpPost]
    [Route("journallinefooter")]
    [Authenticate(Operation.VIW, "Journal")]
    public async Task<JournalLineFooter> GetJournalLineFooter([FromBody] int? id=null)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _journalLineRepository.GetJournalLineFooter(companyId, id);
    }

    [HttpPost]
    [Route("insertJournalLine")]
    [Authenticate(Operation.INS, "Journal")]
    public async Task<MyResultQuery> InsertJournalLine([FromBody] JournalLineSingleSave model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();

            if (model.AccountDetailId > 0)
                model.NoSeriesId =
                    await _financeRepository.GetNoSeriesIdAccountDetail(model.AccountDetailId, model.CompanyId);
            else
                model.NoSeriesId = 0;

            model.CreateUserId = UserClaims.GetUserId();
            ;
            return await _journalLineRepository.Insert(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("updateJournalLine")]
    [Authenticate(Operation.UPD, "Journal")]
    public async Task<MyResultQuery> UpdateJournalLine([FromBody] JournalLineSingleSave model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        if (model.AccountDetailId > 0)
            model.NoSeriesId =
                await _financeRepository.GetNoSeriesIdAccountDetail(model.AccountDetailId, model.CompanyId);
        else
            model.NoSeriesId = 0;

        return await _journalLineRepository.Update(model);
    }

    [HttpPost]
    [Route("deleteJournalLine")]
    [Authenticate(Operation.DEL, "Journal")]
    public async Task<MyResultStatus> DeleteJournalLine([FromBody] GetJournalLine model)
    {
        var companyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;
        return await _journalLineRepository.DeleteJournalLine(model, companyId, userId);
    }


    [HttpPost]
    [Route("haspostgroup")]
    public async Task<List<int>> GetIdentitiesJournal([FromBody] GetJournalPostGroup model)
    {
        return await _journalLineRepository.GetIdentitiesJournal(model);
    }

    [HttpPost]
    [Route("undopostgroup")]
    public async Task<MyResultStatus> UndoPostGroup([FromBody] List<GetJournalPostGroup> model)
    {
        var userId = UserClaims.GetUserId();
        ;

        model.ForEach(x => { x.UserId = userId; });


        return await _journalLineRepository.UndoJournalPostGroupLine(model);
    }

    [HttpPost]
    [Route("getaccountdetail")]
    public async Task<List<MyDropDownViewModel>> GetAccountDetail([FromBody] GetAccountDetail model)
    {
        return await _journalLineRepository.GetAccountDetail(model);
    }

    [HttpPost]
    [Route("getjournallineimportexcelcolumns")]
    public GetColumnsViewModel GetJournalLineImportExcelColumns()
    {
        return _journalLineRepository.GetJournalLineImportExcelColumns();
    }

    [HttpPost]
    [Route("AddBulkJournalLine")]
    [Authenticate(Operation.INS, "Journal")]
    public async Task<MyResultDataQuery<MyResultStatus>> InsertExcelJournalLine([FromBody] ExcelJournalLineModel model)
    {
        var userId = UserClaims.GetUserId();
        ;
        var companyId = UserClaims.GetCompanyId();
        var defaultCurrencyId = int.Parse(User.FindFirstValue("DefaultCurrencyId"));

        return await _journalLineRepository.ImportExcellJournalLine(model, userId, defaultCurrencyId, companyId);
    }
}

[Route("FM")]
[Authorize]
public class JournalLineController : Controller
{
    [Route("[controller]/{id}/{stageId}/{fromType}")]
    [CheckRequest]
    [Authenticate(Operation.VIW, "Journal")]
    [HttpGet]
    public ActionResult Index(int id, short stageId, int fromType)
    {
        return PartialView(Views.FM.JournalLine);
    }
}