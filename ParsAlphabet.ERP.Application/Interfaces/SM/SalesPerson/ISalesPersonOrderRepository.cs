using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.SM.SalesPerson;

namespace ParsAlphabet.ERP.Application.Interfaces.SM.SalesPerson;

public interface ISalesPersonOrderRepository
{
    Task<MyResultPage<List<SalesPersonOrderGetPage>>> GetPage(GetPageViewModel model);
    Task<MyResultPage<SalesPersonOrderGetRecord>> GetRecordById(int id);
    Task<MyResultQuery> Insert(SalesPersonOrderModel model);
    Task<MyResultStatus> Update(SalesPersonOrderModel model);
    Task<MyResultQuery> UpdateInLine(SalesPersonOrderModel model);
    Task<MyResultStatus> Delete(int keyvalue, int CompanyId);
    GetColumnsViewModel GetColumns();
    GetColumnsViewModel AllocationColumns();
    Task<CSVViewModel<IEnumerable>> Csv(GetPageViewModel model);
    Task<List<MyDropDownViewModel>> GetDropDown(int CompanyId);
    Task<bool> GetFixedAssetClassId(GetSalesPersonOrder model);
}