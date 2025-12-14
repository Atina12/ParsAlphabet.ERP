using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseInvoiceLine;

namespace ParsAlphabet.ERP.Application.Interfaces.PU.PurchaseInvoiceLine;

public interface IPurchaseInvoiceLineRepository
{
    GetColumnsViewModel GetHeaderColumns(int CompanyId, short stageId);
    Task<GetStageStepConfigColumnsViewModel> GetInvoiceLineSimpleColumns(int companyId, short stageId, int workflowId);
    GetStageStepConfigColumnsViewModel GetInvoiceLineSimpleElement();
    Task<GetStageStepConfigColumnsViewModel> GetInvoiceLineAdvanceColumns(int companyId, short stageId, int workflowId);
    GetStageStepConfigColumnsViewModel GetInvoiceLineAdvanceElement();

    Task<MyResultPage<PurchaseInvoiceLineGetPage>> Display(GetPageViewModel model, int userId, byte roleId);
    Task<int> ExistPurchaseLine(int id);
    Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model);
    Task<MyResultStageStepConfigPage<List<PurchaseInvoiceLines>>> GetInvoiceLinePage(NewGetPageViewModel model);
    Task<MyResultPage<PurchaseInvoiceLineGetRecord>> GetRecordByIds(int id, int companyId);

    Task<MyResultStatus> DeleteInvoiceLine(PurchaseInvoiceLineModel model, int companyid);
    Task<MyResultStatus> Save(PurchaseInvoiceLineModel model);
    Task<MyResultPage<PurchaseInvoiceLineGetPage>> GetHeader(GetPageViewModel model);

    Task<MyResultStageStepConfigPage<List<PurchaseInvoiceRequestLine>>> GetPurchaseInvoiceLineRequest(
        GetPageViewModel model, int companyId);

    Task<MyResultStatus> InsertPreviousStageLinests(List<SaveRequestLine> model, int companyId, int userId);
    Task<MyResultStatus> ValidationBeforeSave(PurchaseInvoiceLineModel model, OperationType operation, int companyId);

    Task<List<PurchaseLinePostingGroup>> GetPurchaseLineListForPost(List<ID> purchaseIds, int companyId);
    Task<PurchaseRequestViewModel> GetPurchaseRequestInfo(int id);

    Task<PurchaseOrderSum> GetLineSum(NewGetPageViewModel model);
}