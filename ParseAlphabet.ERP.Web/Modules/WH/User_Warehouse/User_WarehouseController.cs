using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ParseAlphabet.ERP.Web.Modules.WH.User_Warehouse;

[Route("WH")]
[Authorize]
public class User_WarehouseController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.WH.User_Warehouse);
    }
}