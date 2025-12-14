using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FM.TreasuryReport;
using ParsAlphabet.ERP.Application.Interfaces.FM.TreasuryReport;

namespace ParseAlphabet.ERP.Web.Modules.FM.TreasuryReport;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class TreasuryReportApiController : ControllerBase
{
    private readonly ITreasuryReportRepository _treasuryReportRepository;

    public TreasuryReportApiController(ITreasuryReportRepository treasuryReportRepository)
    {
        _treasuryReportRepository = treasuryReportRepository;
    }

    #region FundingReport

    [HttpPost]
    [Route("reptreasurycashcolumns")]
    [Authenticate(Operation.VIW, "")]
    public GetColumnsViewModel TreasuryCashReportGetColumns()
    {
        return _treasuryReportRepository.TreasuryFundingReportGetColumns();
    }


    [HttpPost]
    [Route("reptreasurysearchcsv")]
    [Authenticate(Operation.VIW, "")]
    public async Task<CSVViewModel<IEnumerable>> TreasurySearchReportCSV([FromBody] GetTreasurySearchReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await _treasuryReportRepository.TreasuryFundingReportCsv(model, roleId);
    }


    [HttpPost]
    [Route("treasuryfundreportpreview")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ReportViewModel<List<TreasurySearchReport>>> TreasuryFundReportPreview(
        [FromBody] GetTreasurySearchReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await _treasuryReportRepository.TreasuryFundingReportPreview(model, roleId);
    }


    [HttpPost]
    [Route("reptreasuryfundsum")]
    [Authenticate(Operation.VIW, "")]
    public async Task<TreasurySumReport> SumTreasuryFundReport([FromBody] GetTreasurySearchReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await _treasuryReportRepository.TreasuryServiceFundSumTotal(model, roleId);
    }

    #endregion

    #region TreasuryBankAccount

    [HttpPost]
    [Route("reptreasurybankaccountcolumns")]
    [Authenticate(Operation.VIW, "")]
    public GetColumnsViewModel TreasuryBankAccountReportGetColumns()
    {
        return _treasuryReportRepository.TreasuryBankAccountReportGetColumns();
    }


    [HttpPost]
    [Route("reptreasurybankaccountpreview")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ReportViewModel<List<TreasuryBankAccountReports>>> TreasurySearchBankAccountReportPreview(
        [FromBody] GetTreasuryBankAccountReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await _treasuryReportRepository.TreasurySearchBankAccountReportPreview(model, roleId);
    }

    [HttpPost]
    [Route("reptreasurybankaccountcsv")]
    [Authenticate(Operation.VIW, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsvBankAccount([FromBody] GetTreasuryBankAccountReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await _treasuryReportRepository.TreasuryBankAcoountRepportCSV(model, roleId);
    }

    [HttpPost]
    [Route("treasurysumreportpreview")]
    public async Task<TreasuryBankAccountReportSum> TreasurySumReportPreview(
        [FromBody] GetTreasuryBankAccountReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await _treasuryReportRepository.TreasuryServiceBankAccountSumTotal(model, roleId);
    }

    #endregion
}

[Route("FM/[controller]")]
[Authorize]
public class TreasuryReportController : Controller
{
    [Route("treasurycash")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult TreasuryCashReport()
    {
        return PartialView(Views.FM.Report.TreasuryCash);
    }

    [Route("treasurybankaccount")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult TreasuryBankAccountReport()
    {
        return PartialView(Views.FM.Report.TreasuryBankAccount);
    }
}