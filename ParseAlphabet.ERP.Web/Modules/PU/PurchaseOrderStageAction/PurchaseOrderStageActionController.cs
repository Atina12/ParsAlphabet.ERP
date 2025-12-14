using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Infrastructure.Implantation.PU.PurchaseOrderStageAction;

namespace ParseAlphabet.ERP.Web.Modules.PU.PurchaseOrderStageAction;

[Route("api/PU/[controller]")]
[ApiController]
[Authorize]
public class PurchaseOrderStageActionApiController(PurchaseOrderStageActionRepository purchaseOrderStageAction)
    : ControllerBase
{
    private readonly PurchaseOrderStageActionRepository _purchaseOrderStageAction = purchaseOrderStageAction;
}

[Route("PU")]
[Authorize]
public class PurchaseOrderStageActionController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.PU.PurchaseOrderStageAction);
    }
}