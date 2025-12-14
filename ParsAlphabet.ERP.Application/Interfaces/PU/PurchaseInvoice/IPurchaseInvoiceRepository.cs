using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseInvoice;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseOrder;

namespace ParsAlphabet.ERP.Application.Interfaces.PU.PurchaseInvoice;

public interface IPurchaseInvoiceRepository
{
    Task<MyResultPage<List<PurchaseInvoiceGetPage>>> GetPage(NewGetPageViewModel model, int userId, byte roleId);
    Task<MyResultPage<PurchaseInvoiceGetRecord>> GetRecordById(int id, int companyId);
    Task<long> GetPersonVendorId(long personId);
    Task<MyResultQuery> Insert(PurchaseInvoiceModel model, byte roleId);
    Task<MyResultStatus> Update(PurchaseInvoiceModel model, byte roleId);

    Task<MyResultStatus> Delete(int keyvalue, int companyId, byte roleId);
    GetColumnsViewModel GetColumns(int companyId);
    Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model, int userId, byte roleId);

    Task<List<PurchaseInvoiceParentIdMyDropdownViewModel>> PurchaseInvoiceRequest_GetDropDown(short branchId,
        short workflowId, int companyId, short stageId, long? requestId, long? purchaseOrderId);

    Task<PurchaseInvoiceRequestGLSGL> GetRequestPurchaseInvoiceGLSGL(int id, int companyId);

    Task<List<MyDropDownViewModel>> RequestItemType_GetDropDown(long requestId, int companyId,
        byte currentWorkflowCategoryId);

    Task<bool> CheckExist(int id, int companyId, int userId, byte roleId);
    Task<List<MyDropDownViewModel>> NoSeriesNameWhitStage_GetDropDown(short stageId);
    Task<PurchaseOrderViewModel> GetPurchaseOrderInfo(int id, int companyId);
    Task<List<HeaderPurchasePostingGroup>> GetHeaderPurchasePostingGroup(List<ID> Ids, int companyId);
}