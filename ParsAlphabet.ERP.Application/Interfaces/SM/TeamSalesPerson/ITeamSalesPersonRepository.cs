using ParsAlphabet.ERP.Application.Dtos.SM.TeamSalesPerson;

namespace ParsAlphabet.ERP.Application.Interfaces.SM.TeamSalesPerson;

public interface ITeamSalesPersonRepository
{
    GetColumnsViewModel GetColumns();
    Task<MyResultPage<List<TeamSalesPersonGetPage>>> GetPage(GetPageViewModel model);
    Task<MyResultPage<TeamSalesPersonGetRecord>> GetRecordById(int teamId, int employeeId);
    Task<MyResultQuery> Insert(TeamSalesPersonModel model);
    Task<MyResultQuery> Update(TeamSalesPersonModel model);
    Task<List<MyDropDownViewModel>> GetDropDown();
}