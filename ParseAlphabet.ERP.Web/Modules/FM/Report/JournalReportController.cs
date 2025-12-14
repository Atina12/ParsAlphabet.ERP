using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FM.Report;
using ParsAlphabet.ERP.Application.Interfaces.FM.Report;

namespace ParseAlphabet.ERP.Web.Modules.FM.Report;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class JournalReportApiController : ControllerBase
{
    private readonly IJournalReportRepository _journalReportRepository;

    public JournalReportApiController(IJournalReportRepository journalReportRepository)
    {
        _journalReportRepository = journalReportRepository;
    }

    [HttpPost]
    [Route("repjournalsearchcolumns")]
    [Authenticate(Operation.VIW, "")]
    public GetColumnsViewModel JournalSearchReportGetColumns()
    {
        return _journalReportRepository.JournalSearchReportGetColumns();
    }

    [HttpPost]
    [Route("accountglcolumns")]
    [Authenticate(Operation.VIW, "")]
    public GetColumnsViewModel AccountGlGetColumns()
    {
        return _journalReportRepository.LevelSGlGetColumns(false, false);
    }

    [HttpPost]
    [Route("accountdetailcolumns")]
    [Authenticate(Operation.VIW, "")]
    public GetColumnsViewModel AccountDetailGetColumns()
    {
        return _journalReportRepository.LevelAccountDetailGetColumns(false, false);
    }

    [HttpPost]
    [Route("getDateRange")]
    [Authenticate(Operation.VIW, "")]
    public Tuple<DateTime?, DateTime?> GetDateRange([FromBody] string persianDate)
    {
        var date = persianDate.ToMiladiDateTime().Value;
        return _journalReportRepository.GenerateDateRange(date);
    }

    [HttpPost]
    [Route("repjournalsearchcsv")]
    [Authenticate(Operation.VIW, "")]
    public async Task<CSVViewModel<IEnumerable>> JournalSearchReportCSV([FromBody] GetJournalSearchReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.RoleId = UserClaims.GetRoleId();
        ;
        return await _journalReportRepository.JournalSearchReportCsv(model);
    }

    [HttpPost]
    [Route("repjournalsearchpreview")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ReportViewModel<List<JournalSearchReport>>> JournalSearchReportPreview(
        [FromBody] GetJournalSearchReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.RoleId = UserClaims.GetRoleId();
        ;
        return await _journalReportRepository.JournalSearchReportPreview(model);
    }

    [HttpPost]
    [Route("repjournalsearchpreviewsum")]
    [Authenticate(Operation.VIW, "")]
    public async Task<JournalSearchReportSum> JournalSearchReportPreviewSum([FromBody] GetJournalSearchReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.RoleId = UserClaims.GetRoleId();
        ;
        return await _journalReportRepository.JournalSearchReportPreviewSum(model);
    }

    [HttpPost]
    [Route("repjournaltrialpreviewsum")]
    [Authenticate(Operation.VIW, "")]
    public async Task<JournalSearchReportSum> JournalTrialReportPreviewSum([FromBody] GetJournaltrialSearchReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.RoleId = UserClaims.GetRoleId();
        ;
        return await _journalReportRepository.JournalTrialSearchReportPreviewSum(model);
    }

    [HttpPost]
    [Route("levelGlGetColumns")]
    [Authenticate(Operation.VIW, "")]
    public GetColumnsViewModel LevelGlGetColumns()
    {
        return _journalReportRepository.LevelGlGetColumns(false);
    }

    [HttpPost]
    [Route("JournalDetailReportPreview")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ReportViewModel<List<JournalDetailReport>>> JournalDetailReportPreview(
        [FromBody] GetJournaltrialSearchReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.RoleId = UserClaims.GetRoleId();
        ;

        return await _journalReportRepository.JournalDetailReportPreview(model);
    }

    [HttpPost]
    [Route("getjournaltrialreportJsonForTree")]
    [Authenticate(Operation.VIW, "")]
    public async Task<List<GetJournalHeaderTreeViewModel>> GetJournalTrialReportJsonForTree(
        [FromBody] GetJournalTreeReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _journalReportRepository.GetJournalTrialReportJsonForTree(model);
    }

    [HttpPost]
    [Route("levelglcsv")]
    [Authenticate(Operation.VIW, "")]
    public async Task<FileResult> LevelGlCSV([FromBody] GetJournaltrialSearchReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.RoleId = UserClaims.GetRoleId();
        ;
        var resultCsv = await _journalReportRepository.LevelGlCsv(model);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "تراز کل.csv" };
    }

    [HttpPost]
    [Route("levelsglcsv")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ActionResult> LevelSglCsv([FromBody] GetJournaltrialSearchReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.RoleId = UserClaims.GetRoleId();
        ;
        var resultCsv = await _journalReportRepository.LevelSglCsv(model);

        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "تراز معین.csv" };
    }

    [HttpPost]
    [Route("levelaccountdetailcsv")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ActionResult> LevelAccountDetailCsv([FromBody] GetJournaltrialSearchReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.RoleId = UserClaims.GetRoleId();
        ;
        var resultCsv = await _journalReportRepository.LevelAccountDetailCsv(model);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "تراز تفصیل.csv" };
    }

    [HttpPost]
    [Route("noteglcsv")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ActionResult> NoteGlCsv([FromBody] GetJournaltrialSearchReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.RoleId = UserClaims.GetRoleId();
        ;
        var resultCsv = await _journalReportRepository.NoteGlCsv(model);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "دفتر کل.csv" };
    }

    [HttpPost]
    [Route("notesglcsv")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ActionResult> NoteSglCsv([FromBody] GetJournaltrialSearchReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.RoleId = UserClaims.GetRoleId();
        ;
        var resultCsv = await _journalReportRepository.NoteSglCsv(model);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "دفتر معین.csv" };
    }

    [HttpPost]
    [Route("noteaccountdetailcsv")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ActionResult> NoteAccountDetailCsv([FromBody] GetJournaltrialSearchReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.RoleId = UserClaims.GetRoleId();
        ;
        var resultCsv = await _journalReportRepository.NoteAccountDetailCsv(model);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "دفتر تفصیل.csv" };
    }

    [HttpPost]
    [Route("notenewspapercsv")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ActionResult> NoteNewsPaperCsv([FromBody] GetJournaltrialSearchReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.RoleId = UserClaims.GetRoleId();
        ;
        var resultCsv = await _journalReportRepository.NoteNewsPaperCsv(model);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "دفتر روزنامه.csv" };
    }
}

[Route("FM/[controller]")]
[Authorize]
public class JournalReportController : Controller
{
    [Route("journalvouchersearch")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult JournalVoucherSearch()
    {
        return PartialView(Views.FM.Report.JournalVoucherSearch);
    }

    [Route("Journaltrialbalance")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult JournalTrialBalance()
    {
        return PartialView(Views.FM.Report.JournalTrialBalance);
    }
}