using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ParseAlphabet.ERP.Web.Modules.MC.AttenderTimeSheet;

[Route("MC")]
[Authorize]
public class AttenderTimeSheetController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Index()
    {
        return View(Views.MC.AttenderTimeSheetIndex);
    }
}