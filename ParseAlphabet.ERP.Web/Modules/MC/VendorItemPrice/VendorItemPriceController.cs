using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ParseAlphabet.ERP.Web.Modules.MC.VendorItemPrice;

[Route("MC")]
[Authorize]
public class VendorItemPriceController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.MC.VendorItemPrice);
    }
}