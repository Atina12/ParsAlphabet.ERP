using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ParseAlphabet.ERP.Web.Modules.FM.AccountSGLUser;

[Route("FM")]
[Authorize]
public class AccountSGLUserController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "AccountSGLUser")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.FM.AccountSGLUser);
    }
}