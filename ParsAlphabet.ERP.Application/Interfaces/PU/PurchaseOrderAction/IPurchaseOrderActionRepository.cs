using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseOrder;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseOrderAction;
using ParsAlphabet.ERP.Application.Dtos.WF.StageActionLog;

namespace ParsAlphabet.ERP.Application.Interfaces.PU.PurchaseOrderAction;

public interface IPurchaseOrderActionRepository
{
    Task<MyResultDataQuery<List<PurchaseOrderActionLogList>>>
        GetPurchaseOrderStepList(int personOrderId, int companyId);

    Task<PurchaseOrderResultStatus> UpdatePurchaseOrderStep(UpdateAction model, OperationType operationType);
    Task<PurchaseOrderValidateStepResultStatus> ValidateUpdateStep(UpdateAction model, OperationType operationType);
    Task<List<string>> ValidateDeleteStep(PurchaseOrderViewModel model);
    Task<UpdateInvoicePrice> UpdateInvoicePrice(int id, int UserId, int CompanyId);
    Task<MyResultPage<List<PurchaseOrderCheckIsAllocatedViewModel>>> GetPurchaseOrderCheckIsAllocated(int requestid);
    Task<UpdateRequestPrice> UpdateRequestPrice(int Id, int UserId);

    Task<int> CheckisUnitCostCalculated(int id);
    Task<MyResultPage<List<PurchaseOrderNotLastConfirmHeaderViewModel>>> GetPurchaseOrderNotLastConfirmHeader(int id);
    Task<UpdateRequestPrice> ReturnRequestPrice(int id, int UserId);
    Task<UpdateInvoicePrice> ReturnInvoicePrice(int id, int UserId, int companyId);

    Task<CSVViewModel<IEnumerable>> CsvLastConfirmHeader(NewGetPageViewModel model);
}