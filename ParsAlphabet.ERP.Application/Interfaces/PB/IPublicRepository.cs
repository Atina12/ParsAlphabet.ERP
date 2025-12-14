using ParsAlphabet.ERP.Application.Dtos.PB;

namespace ParsAlphabet.ERP.Application.Interfaces.PB;

public interface IPublicRepository
{
    Task<MyResultQuery> Delete(string tableName, string filter);
    Task<MyResultDataStatus<IEnumerable<MyDropDownViewModel2>>> Search(PublicSearch model);
    Task<MyResultDataStatus<IEnumerable<MyDropDownViewModel2>>> SearchPagination(PublicSearch model);
    Task<long> GetPreveNexIdentity(GetNextPrevId model);
    List<MyDropDownViewModel> MonthGetDropDown(int? id);
    int GetPageRowsCount(TakeRowsCountByPage model);
    bool SetTakeRowsCountByPage(TakeRowsCountByPage model);
}