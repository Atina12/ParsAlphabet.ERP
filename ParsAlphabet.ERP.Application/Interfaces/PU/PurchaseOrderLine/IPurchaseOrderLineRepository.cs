using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseOrderLine;

namespace ParsAlphabet.ERP.Application.Interfaces.PU.PurchaseOrderLine;

public interface IPurchaseOrderLineRepository
{
    GetColumnsViewModel GetHeaderColumns(int CompanyId);

    Task<GetStageStepConfigColumnsViewModel> GetPurchaseOrderLineSimpleColumns(int companyId, short stageId,
        int workflowId);

    GetStageStepConfigColumnsViewModel GetPurchaseOrderLineSimpleElement();

    Task<GetStageStepConfigColumnsViewModel> GetPurchaseOrderLineAdvanceColumns(int companyId, short stageId,
        int workflowId);

    GetStageStepConfigColumnsViewModel GetPurchaseOrderLineAdvanceElement();
    Task<MyResultPage<PurchaseOrderLineGetPage>> Display(GetPageViewModel model, int userId, byte roleId);
    Task<MyResultStageStepConfigPage<List<PurchaseOrderLines>>> GetPurchaseOrderLinePage(NewGetPageViewModel model);
    Task<MyResultPage<PurchaseOrderLineGetRecord>> GetRecordByIds(int id, int companyId);
    Task<MyResultStatus> Insert(PurchaseOrderLineModel model, int companyId);
    Task<MyResultStatus> Update(PurchaseOrderLineModel model, int companyId);
    Task<MyResultStatus> DeleteOrderLine(PurchaseOrderLineDelete model, int companyId);
    Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model);
    Task<MyResultPage<PurchaseOrderLineGetPage>> GetHeader(GetPageViewModel model);
    Task<int> GetOrderLineCount(int Id);
    Task<PurchaseOrderSum> GetLineSum(NewGetPageViewModel model);
}