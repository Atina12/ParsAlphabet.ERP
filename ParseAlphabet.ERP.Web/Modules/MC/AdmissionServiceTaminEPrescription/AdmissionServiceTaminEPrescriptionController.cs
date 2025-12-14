using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ParseAlphabet.ERP.Web.Modules.MC.AdmissionServiceTaminEPrescription;

[Route("MC")]
[Authorize]
public class AdmissionServiceTaminEPrescriptionController : Controller
{
    [Route("[controller]/form/{id?}")]
    [Authenticate(Operation.VIW, "Admission")]
    [HttpGet]
    public IActionResult Form(int? id)
    {
        return PartialView(Views.MC.AdmissionServiceTaminEPrescriptionForm);
    }
}