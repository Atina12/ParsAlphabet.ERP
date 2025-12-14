using ParsAlphabet.ERP.Application.Dtos.WH.Report.ItemTransactionTrialBalancesReport;

namespace ParsAlphabet.ERP.Application.Interfaces.WF.Report.ItemTransactionTrialBalancesReport;

public interface IItemTransactionTrialBalancesReportRepository
{
    GetColumnsViewModel LevelWarhouseGetColumns(bool displayRemaining, bool quantity);
    GetColumnsViewModel LevelZoneGetColumns(bool displayRemaining, bool quantity);
    GetColumnsViewModel LevelBinGetColumns(bool displayRemaining, bool quantity);
    GetColumnsViewModel NoteWarhouseColumns(bool displayRemaining, bool quantity);
    GetColumnsViewModel NoteZoneColumns(bool displayRemaining, bool quantity);
    GetColumnsViewModel NoteBinColumns(bool displayRemaining, bool quantity);

    Task<ReportViewModel<List<ItemTransactionTrialBalancesReportPreviewModel>>>
        ItemTransactionTrialBalancesReportPreview(GetItemTransactionTrialBalancesReport model, byte roleId,
            bool displayCsv);

    Task<ItemTransactionReportSum> ItemTransactionTrialBalancesReportSum(GetItemTransactionTrialBalancesReport model,
        byte roleId);

    Task<MemoryStream> ItemTransactionTrialBalancesReportCsv(GetItemTransactionTrialBalancesReport model, byte roleId);

    Task<List<GetItemTransactionTrialBalanceHeaderTreeViewModel>> GetItemTransactionTrialBalanceReportJsonForTree(
        GetItemTransactionTrialBalancesReport model, byte roleId);

    Tuple<DateTime?, DateTime?> GenerateDateRange(DateTime fromDate2);
}