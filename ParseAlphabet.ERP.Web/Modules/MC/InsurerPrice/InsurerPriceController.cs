using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ParseAlphabet.ERP.Web.Modules.MC.InsurerPrice;

[Route("MC")]
[Authorize]
public class InsurerPriceController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.MC.InsurerPrice);
    }
}