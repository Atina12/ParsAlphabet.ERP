using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ParseAlphabet.ERP.Web.Modules._Dashboard
{
    [Route("Test")]
    public class TestController : Controller
    {
        // 1️⃣ بدون هیچ محدودیتی
        // GET /Test
        [HttpGet("")]
        public IActionResult Index()
        {
            return Content("OK - Public access");
        }

        // 2️⃣ فقط لاگین (Authorize استاندارد)
        // GET /Test/auth
        [HttpGet("auth")]
        [Authorize]
        public IActionResult AuthOnly()
        {
            return Content("OK - Authorize (logged in)");
        }

        // 3️⃣ لاگین + Permission کاستوم شما
        // GET /Test/custom
        [HttpGet("custom")]
        [Authenticate(Operation.VIW, "Dashboard")]
        public IActionResult CustomAuth()
        {
            return Content("OK - Custom Authenticate (permission granted)");
        }
    }
}
