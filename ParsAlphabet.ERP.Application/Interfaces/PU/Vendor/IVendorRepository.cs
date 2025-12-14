using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.PU.Vendor;

namespace ParsAlphabet.ERP.Application.Interfaces.PU.Vendor;

public interface IVendorRepository
{
    Task<MyResultPage<List<VendorGetPage>>> GetPage(GetPageViewModel model);
    Task<MyResultPage<VendorGetRecord>> GetRecordById(int id);
    Task<MyResultQuery> Insert(VendorModel model);
    Task<MyResultQuery> Update(VendorModel model);
    Task<MyResultQuery> Delete(int keyvalue);
    GetColumnsViewModel GetColumns();
    Task<CSVViewModel<IEnumerable>> Csv(GetPageViewModel model);
    Task<List<MyDropDownViewModel>> GetDropDown(string term);
}