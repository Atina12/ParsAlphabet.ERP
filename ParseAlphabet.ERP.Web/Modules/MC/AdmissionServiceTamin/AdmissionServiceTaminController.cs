using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionServiceTamin;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionServiceTamin;

namespace ParseAlphabet.ERP.Web.Modules.MC.AdmissionServiceTamin;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class AdmissionServiceTaminApiController : ControllerBase
{
    private readonly IAdmissionServiceTaminRepository _admissionServiceTaminRepository;

    public AdmissionServiceTaminApiController(IAdmissionServiceTaminRepository admissionServiceTaminRepository)
    {
        _admissionServiceTaminRepository = admissionServiceTaminRepository;
    }

    [HttpPost]
    [Route("getattenderinsurerservice")]
    [Authenticate(Operation.VIW, "Admission")]
    public async Task<List<InsurerAttenderServiceTamin>> GetInsurerAttenderService(
        [FromBody] GetInsurerAttenderServiceTamin model)
    {
        var admissionTamin = await _admissionServiceTaminRepository.GetInsurerAttenderService(model);
        return admissionTamin;
    }

    [HttpPost]
    [Route("getpriceservicetamin")]
    [Authenticate(Operation.VIW, "Admission")]
    public async Task<MyResultDataStatus<List<CalAdmissionTaminPrice>>> GetServicePrice(
        [FromBody] GetCalAdmissionTaminPrice model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var admissionTamin = await _admissionServiceTaminRepository.CalAdmissionTaminPrice(model);
        return admissionTamin;
    }

    [HttpGet]
    [Route("checkexisteprescriptionId/{eprescriptionId}/{taminId}")]
    [Authenticate(Operation.VIW, "Admission")]
    public async Task<int> CheckExistEPrescriptionId(string eprescriptionId, int taminId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _admissionServiceTaminRepository.GetRequestEPrescriptionId(eprescriptionId, taminId, companyId);
    }

    [HttpGet]
    [Route("checkacceptableparatype/{paraTypecodes}")]
    [Authenticate(Operation.VIW, "Admission")]
    public async Task<bool> CheckExistEPrescriptionId(string paraTypecodes)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _admissionServiceTaminRepository.CheckParaclinicTypeIsAcceptable(paraTypecodes);
    }
}

[Route("MC")]
[Authorize]
public class AdmissionServiceTaminController : Controller
{
    [Route("[controller]/form/{id?}")]
    [Authenticate(Operation.VIW, "Admission")]
    [HttpGet]
    public IActionResult AdmissionTaminForm(int? id)
    {
        return PartialView(Views.MC.AdmissionServiceTaminForm);
    }

    [Route("[controller]/newform/{id?}")]
    [Authenticate(Operation.VIW, "Admission")]
    [HttpGet]
    public IActionResult NewForm(int? id)
    {
        return PartialView(Views.MC.NewAdmissionServiceTaminForm);
    }
}