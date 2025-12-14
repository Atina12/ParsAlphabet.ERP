using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.SM.TeamSalesPerson;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM.Team;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM.TeamSalesPerson;

namespace ParseAlphabet.ERP.Web.Modules.SM.TeamSalesPerson;

[Route("api/SM/[controller]")]
[ApiController]
[Authorize]
public class TeamSalesPersonApiController(
    TeamSalesPersonRepository TeamSalesPersonRepository,
    TeamRepository TeamRepository)
    : ControllerBase
{
    private readonly TeamRepository _TeamRepository = TeamRepository;

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "Team")]
    public async Task<MyResultPage<List<TeamSalesPersonGetPage>>> GetPage([FromBody] GetPageViewModel pageViewModel)
    {
        pageViewModel.CompanyId = UserClaims.GetCompanyId();
        return await TeamSalesPersonRepository.GetPage(pageViewModel);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    public async Task<MyResultPage<TeamSalesPersonGetRecord>> GetRecordBy_TeamSalesPerson(
        [FromBody] Get_TeamSalesPerson model)
    {
        return await TeamSalesPersonRepository.GetRecordById(model.TeamId, model.EmployeeId);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return TeamSalesPersonRepository.GetColumns();
    }

    [HttpPost]
    [Route("save")]
    public Task<MyResultQuery> Save(TeamSalesPersonModel model)
    {
        if (TeamSalesPersonRepository.GetRecordById(model.TeamId, model.EmployeeId).Result.Successfull)
            return TeamSalesPersonRepository.Insert(model);
        return TeamSalesPersonRepository.Update(model);
    }
}