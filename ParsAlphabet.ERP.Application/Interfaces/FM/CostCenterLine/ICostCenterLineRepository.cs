using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.FM.CostCenterLine;

namespace ParsAlphabet.ERP.Application.Interfaces.FM.CostCenterLine;

public interface ICostCenterLineRepository
{
    GetColumnsViewModel GetColumns();
    GetColumnsViewModel GetColumns2();
    Task<MyResultPage<CostCenterDAssignList>> GetCostCenterLineDiAssign(NewGetPageViewModel model);
    Task<MyResultPage<CostCenterAssignList>> GetCostCenterLineAssign(NewGetPageViewModel model);
    Task<MyResultQuery> CostCenterLineAssign(CostCenterLineAssign model);
    Task<MyResultQuery> CostCenterLineDiAssign(CostCenterLineAssign model);

    Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model);
    Task<MyResultQuery> DeleteByCostCenterId(int keyValue);
}