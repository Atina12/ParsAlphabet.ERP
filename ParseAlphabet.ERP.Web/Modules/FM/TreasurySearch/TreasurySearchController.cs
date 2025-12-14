using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FM.TreasurySearch;

namespace ParseAlphabet.ERP.Web.Modules.FM.TreasurySearch;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class TreasurySearchApiController : ControllerBase
{
    private readonly ITreasurySearchRepository _treasurySearch;

    public TreasurySearchApiController(ITreasurySearchRepository treasurySearch)
    {
        _treasurySearch = treasurySearch;
    }

    [HttpPost]
    [Route("gettreasuryquicksearch")]
    public async Task<MyResultPage<List<GetTreasuryQuickSearch>>> GetTreasuryQuickSearch(
        [FromBody] TreasuryQuickSearch model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await _treasurySearch.GetTreasuryQuickSearch(model, roleId);
    }

    [HttpPost]
    [Route("gettreasuryquicksearchtype")]
    public async Task<MyResultPage<List<GetTreasuryQuickSearchType>>> GetTreasuryQuickSearchType(
        [FromBody] TreasuryQuickSearchtype model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var result = await _treasurySearch.GetTreasuryQuickSearchType(model);
        return result;
    }
}

[Route("FM/[controller]")]
[Authorize]
public class TreasurySearchController : Controller
{
    [Route("quicksearchrequest")]
    [Authenticate(Operation.VIW, "TreasuryRequest")]
    [HttpGet]
    public IActionResult TreasuryRequestQuickSearch()
    {
        return PartialView(Views.FM.Search.TreasuryQuickSearch);
    }

    [Route("quicksearchtreasury")]
    [Authenticate(Operation.VIW, "NewTreasury")]
    [HttpGet]
    public IActionResult TreasuryQuickSearch()
    {
        return PartialView(Views.FM.Search.TreasuryQuickSearch);
    }
}