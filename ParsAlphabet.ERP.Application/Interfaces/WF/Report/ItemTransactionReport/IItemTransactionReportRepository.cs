using ParsAlphabet.ERP.Application.Dtos.WH.Report.ItemTransactionReport;

namespace ParsAlphabet.ERP.Application.Interfaces.WF.Report.ItemTransactionReport;

public interface IItemTransactionReportRepository
{
    GetColumnsViewModel ItemTransactionReportGetColumns();

    Task<ReportViewModel<List<ItemTransactioneReportPreviewModel>>> ItemTransactionReportPreview(
        GetItemTransactionReport model, byte roleId);

    Task<ItemtransactionReportSum> ItemTransactionReportPreviewSum(GetItemTransactionReport model, byte roleId);
    Task<MemoryStream> ItemTransactionReportCsv(GetItemTransactionReport model, byte roleId);
}