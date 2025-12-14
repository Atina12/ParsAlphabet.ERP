using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.SM.SaleOrder;

namespace ParsAlphabet.ERP.Application.Interfaces.SM.SaleOrder;

public interface ISaleOrderRepository
{
    Task<MyResultPage<List<SaleOrderGetPage>>> GetPage(NewGetPageViewModel model);
    Task<MyResultPage<SaleOrderGetRecord>> GetRecordById(int Id, int companyId);
    Task<MyResultQuery> Insert(SaleOrderModel model);
    Task<MyResultStatus> Update(SaleOrderModel model);
    Task<MyResultStatus> Delete(int Id, int companyId);
    Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model);
    Task<bool> CheckExist(int id, int companyId);
}