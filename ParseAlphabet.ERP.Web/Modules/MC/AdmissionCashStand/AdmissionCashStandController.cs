using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionCashStand;
using ParsAlphabet.ERP.Application.Interfaces._ErrorLog;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionCashStand;

namespace ParseAlphabet.ERP.Web.Modules.MC.AdmissionCashStand;

[Route("api/MC/[controller]")]
[ApiController]
[EnableCors("CashStandOrigin")]
public class AdmissionCashStandApiController(
    IAdmissionCashStandRepository admissionCashStandRepository,
    IHttpContextAccessor accessor,
    ICompanyRepository companyRepository,
    IErrorLogRepository errorLogRepository)
    : ControllerBase
{
    private readonly IHttpContextAccessor _accessor = accessor;

    [HttpPost]
    [Route("GetServicePatientInfo")]
    public async Task<AdmissionStandPatientInfo> GetServicePatientInfo([FromBody] long admissionId)
    {
        return await admissionCashStandRepository.GetServicePatientInfo(admissionId);
    }

    [HttpPost]
    [Route("GetSalePatientInfo")]
    public async Task<AdmissionStandPatientInfo> GetSalePatientInfo([FromBody] long admissionId)
    {
        return await admissionCashStandRepository.GetSalePatientInfo(admissionId);
    }

    [HttpPost]
    [Route("SaveAdmissionCashStand")]
    public async Task<MyResultStatus> SaveAdmissionCashStand([FromBody] AdmissionCashStandModel model)
    {
        var companyId = 1;
        var userId = 1;
        var defaultCurrencyId = await companyRepository.GetDefaultCurrency(1);
        var resultSave =
            await admissionCashStandRepository.SaveAdmissionCashStand(model, defaultCurrencyId, userId, companyId,
                MyClaim.IpAddress);

        if (!resultSave.Successfull)
            await errorLogRepository.Insert(resultSave.ValidationErrors[0], 1, MyClaim.IpAddress,
                nameof(SaveAdmissionCashStand));

        return resultSave;
    }
}

[EnableCors("CashStandOrigin")]
public class AdmissionCashStandController : Controller
{
    private readonly IHttpContextAccessor _accessor;

    public AdmissionCashStandController(IHttpContextAccessor accessor)
    {
        _accessor = accessor;
    }

    [Route("AdmissionCashStand")]
    [CashStandAuthenticate]
    [HttpGet]
    public IActionResult Index()
    {
        MyClaim.Init(_accessor);
        ViewBag.StandIp = MyClaim.IpAddress;
        return PartialView(Views.MC.CashStand.Index);
    }

    [Route("[controller]/BadRequest")]
    [HttpGet]
    public new IActionResult BadRequest()
    {
        MyClaim.Init(_accessor);
        ViewBag.StandIp = MyClaim.IpAddress;
        return PartialView(Views.MC.CashStand.BadRequest);
    }
}