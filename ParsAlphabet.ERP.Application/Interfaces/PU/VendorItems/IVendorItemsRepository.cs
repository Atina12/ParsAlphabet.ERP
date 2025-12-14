using ParsAlphabet.ERP.Application.Dtos.PU.VendorItems;

namespace ParsAlphabet.ERP.Application.Interfaces.PU.VendorItems;

public interface IVendorItemsRepository
{
    GetColumnsViewModel GetColumns();
    Task<MyResultPage<VendorItemsGetRecord>> GetRecordById(int vendorId, int itemId);
    Task<MyResultQuery> Insert(VendorItemsModel model);
    Task<MyResultQuery> Update(VendorItemsModel model);
    Task<List<MyDropDownViewModel>> GetDropDown();
    Task<List<MyDropDownViewModel>> GetVendorItemList(int vendorId, int itemId, byte itemTypeId);
}