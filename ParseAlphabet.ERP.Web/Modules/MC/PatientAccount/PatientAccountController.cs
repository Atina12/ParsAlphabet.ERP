using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.PatientAccount;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.PatientAccount;
using static ParsAlphabet.ERP.Application.Dtos.MC.PatientAccount.PatientAccountViewModel;

namespace ParseAlphabet.ERP.Web.Modules.MC.PatientAccount;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class PatientAccountApiController : ControllerBase
{
    private readonly PatientAccountRepository _patientAccountRepository;

    public PatientAccountApiController(PatientAccountRepository patientAccountRepository)
    {
        _patientAccountRepository = patientAccountRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<PatientAccountGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _patientAccountRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<PatientAccountGetRecord>> GetRecordById([FromBody] int id)
    {
        return await _patientAccountRepository.GetRecordById(id);
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Update([FromBody] PatientAccountModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _patientAccountRepository.Update(model);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _patientAccountRepository.Csv(model);
    }
}

[Route("MC")]
[Authorize]
public class PatientAccountController : Controller
{
    [Route("[controller]")]
    [HttpGet]
    public IActionResult Index()
    {
        return PartialView(Views.MC.PatientAccount);
    }
}