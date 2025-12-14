using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WH.WarehouseStageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.WarehouseStageAction;

namespace ParseAlphabet.ERP.Web.Modules.WH.WarehouseStageAction;

[Route("api/WH/[controller]")]
[ApiController]
[Authorize]
public class WarehouseStageActionApiController(WarehouseStageActionRepository treasuryStageAction) : ControllerBase
{
    [HttpPost]
    [Route("getwarehousestageaction")]
    public async Task<WarehouseStageActionLogicModel> GetWarehouseAction([FromBody] long id)
    {
        return await treasuryStageAction.GetWarehouseAction(id);
    }
}

[Route("WH")]
[Authorize]
public class WarehouseStageActionController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.WH.WarehouseStageAction);
    }
}