using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ParseAlphabet.ERP.Web.Modules.MC.AdmissionKPI;
//[Route("api/MC/KPI/[controller]")]
//[ApiController]
//[Authorize]
//public class AdmissionKPIApi : ControllerBase
//{

//}

[Route("MC/KPI")]
[Authorize]
public class AdmissionKPIController : Controller
{
    [Route("[controller]")]
    [HttpGet]
    public IActionResult Index()
    {
        return PartialView(Views.MC.Kpi.Index);
    }
}