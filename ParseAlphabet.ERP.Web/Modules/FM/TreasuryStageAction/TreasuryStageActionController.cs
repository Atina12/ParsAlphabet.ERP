using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FM.TreasuryStageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.TreasuryStageAction;

namespace ParseAlphabet.ERP.Web.Modules.FM.TreasuryStageAction;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class TreasuryStageActionApiController : ControllerBase
{
    private readonly TreasuryStageActionRepository _treasuryStageAction;

    public TreasuryStageActionApiController(TreasuryStageActionRepository treasuryStageAction)
    {
        _treasuryStageAction = treasuryStageAction;
    }

    [HttpPost]
    [Route("GetTreasuryStageActionByTreasury")]
    public async Task<TreasuryStageActionLogicModel> GetTreasuryActionByTreasury([FromBody] int treasuryId)
    {
        return await _treasuryStageAction.GetTreasuryActionByTreasury(treasuryId);
    }
}

[Route("FM")]
[Authorize]
public class TreasuryStageActionController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.FM.TreasuryStageAction);
    }
}