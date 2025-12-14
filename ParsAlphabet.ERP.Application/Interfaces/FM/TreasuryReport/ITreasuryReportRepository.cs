using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.FM.TreasuryReport;

namespace ParsAlphabet.ERP.Application.Interfaces.FM.TreasuryReport;

public interface ITreasuryReportRepository
{
    GetColumnsViewModel TreasuryFundingReportGetColumns();
    Task<TreasurySumReport> TreasuryServiceFundSumTotal(GetTreasurySearchReport model, byte roleId);
    GetColumnsViewModel TreasuryBankAccountReportGetColumns();
    Task<CSVViewModel<IEnumerable>> TreasuryFundingReportCsv(GetTreasurySearchReport model, byte roleId);

    Task<ReportViewModel<List<TreasurySearchReport>>> TreasuryFundingReportPreview(GetTreasurySearchReport model,
        byte roleId);

    Task<ReportViewModel<List<TreasuryBankAccountReports>>> TreasurySearchBankAccountReportPreview(
        GetTreasuryBankAccountReport model, byte roleId);

    Task<TreasuryBankAccountReportSum> TreasuryServiceBankAccountSumTotal(GetTreasuryBankAccountReport model,
        byte roleId);

    Task<CSVViewModel<IEnumerable>> TreasuryBankAcoountRepportCSV(GetTreasuryBankAccountReport model, byte roleId);
}