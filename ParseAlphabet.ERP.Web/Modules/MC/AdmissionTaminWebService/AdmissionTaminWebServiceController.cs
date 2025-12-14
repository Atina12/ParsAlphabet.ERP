using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionTaminWebService;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionTaminWebService;

namespace ParseAlphabet.ERP.Web.Modules.MC.AdmissionTaminWebService;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class AdmissionTaminWebServiceApiController : ControllerBase
{
    private readonly AdmissionTaminWebServiceRepository _admissionTaminWebServiceRepository;

    public AdmissionTaminWebServiceApiController(AdmissionTaminWebServiceRepository admissionTaminWebServiceRepository)
    {
        _admissionTaminWebServiceRepository = admissionTaminWebServiceRepository;
    }

    [HttpPost]
    [Route("getfiltereprescription")]
    public GetColumnsViewModel GetFilterParameterReturns()
    {
        return _admissionTaminWebServiceRepository.GetColumns();
    }

    [HttpPost]
    [Route("getfilterrequestprescription")]
    public GetColumnsViewModel GetFilterTaminPrescription()
    {
        return _admissionTaminWebServiceRepository.PrescriptionTaminGetColumn();
    }

    [HttpPost]
    [Route("requesteprescriptiontamin")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<PrescriptionTaminWebServiceViewModel>>> GetPagePrescription(
        [FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _admissionTaminWebServiceRepository.GetPagePrescription(model);
    }

    [HttpPost]
    [Route("getpageeprescription")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<AdmissionTaminWebServiceViewModel>>> GetPage(
        [FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _admissionTaminWebServiceRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getpagereturneprescription")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<AdmissionTaminWebServiceViewModel>>> GetPageReturn(
        [FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _admissionTaminWebServiceRepository.GetPageReturn(model);
    }
}

[Route("MC")]
[Authorize]
public class AdmissionTaminWebServiceController : Controller
{
    [Authenticate(Operation.VIW, "")]
    [Route("[controller]")]
    [HttpGet]
    public IActionResult Index()
    {
        return PartialView(Views.MC.AdmissionTaminWebService);
    }
}