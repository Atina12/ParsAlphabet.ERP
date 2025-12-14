using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.SM.SaleOrderLine;

namespace ParsAlphabet.ERP.Application.Interfaces.SM.SaleOrderLine;

public interface ISaleOrderLineRepository
{
    Task<MyResultPage<SaleOrderLineGetpage>> Display(GetPageViewModel model);
    Task<MyResultStageStepConfigPage<List<SaleOrderLines>>> GetSaleOrderLinePage(NewGetPageViewModel model);
    Task<MyResultPage<SaleOrderLineGetpage>> GetHeader(GetPageViewModel model);
    Task<bool> GetOrderLineCount(int Id);
    Task<MyResultStatus> Insert(SaleOrderLineModel model, int companyId);
    Task<MyResultPage<SaleOrderLineGetRecord>> GetRecordByIds(int id, int companyId);
    Task<MyResultStatus> Update(SaleOrderLineModel model, int companyId);
    Task<MyResultStatus> DeleteOrderLine(SaleOrderLineModel model, int companyId);
    Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model);
}