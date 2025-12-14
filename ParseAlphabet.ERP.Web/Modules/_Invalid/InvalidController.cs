using Microsoft.AspNetCore.Mvc;

namespace ParseAlphabet.ERP.Web.Modules._Invalid;

[Route("Invalid")]
public class InvalidController : Controller
{
    [HttpGet]
    public IActionResult Page404()
    {
        return View(Views.Invalid.Page404);
    }
}