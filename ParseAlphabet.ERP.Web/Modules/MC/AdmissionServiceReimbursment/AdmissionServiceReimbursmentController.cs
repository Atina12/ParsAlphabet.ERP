using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionServiceReimbursment;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionServiceReimbursment;

namespace ParseAlphabet.ERP.Web.Modules.MC.AdmissionServiceReimbursment;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class AdmissionServiceReimbursmentApiController : ControllerBase
{
    private readonly AdmissionServiceReimbursmentRepository _admissionServiceReimbursmentRepository;

    public AdmissionServiceReimbursmentApiController(
        AdmissionServiceReimbursmentRepository admissionServiceReimbursmentRepository)
    {
        _admissionServiceReimbursmentRepository = admissionServiceReimbursmentRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<AdmissionServiceLineReimbursementGetPage>>> GetPage(
        [FromBody] NewGetAdmissionServiceReimbursmentGetPage model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;

        return await _admissionServiceReimbursmentRepository.GetPage(model, roleId);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _admissionServiceReimbursmentRepository.GetColumns();
    }

    [HttpPost]
    [Route("save")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultStatus> Save([FromBody] SaveAdmissionReimbursement model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();

            return await _admissionServiceReimbursmentRepository.Save(model);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("getadmissioninsurerinfo")]
    public async Task<MyResultPage<ReimburesmentInsurerInfo>> GetInsuranceById([FromBody] int admissionId)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _admissionServiceReimbursmentRepository.GetInsuranceByAdmissionId(admissionId, CompanyId);
    }

    [HttpPost]
    [Route("deletefromadmission")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultStatus> DeleteFromAdmission([FromBody] DeleteAdmissionServiceLineReimbursement model)
    {
        return await _admissionServiceReimbursmentRepository.DeleteLine(model);
    }
}

[Route("MC")]
[Authorize]
public class AdmissionServiceReimbursmentController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.MC.AdmissionServiceReimbursment);
    }
}