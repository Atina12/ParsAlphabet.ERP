using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionWebService;
using ParsAlphabet.ERP.Application.Dtos.MC.DeathCertificate;
using ParsAlphabet.ERP.Application.Interfaces._ErrorLog;
using ParsAlphabet.ERP.Application.Interfaces._Setup;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Application.Interfaces.MC;
using ParsAlphabet.ERP.Application.Interfaces.MC.DeathCertificate1;
using ParseAlphabet.ERP.Web.WebServices.CIS;
using static ParseAlphabet.ERP.Web.WebServices.CIS.BindingCisApiServices;

namespace ParseAlphabet.ERP.Web.Modules.MC.DeathCertificate;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class DeathCertificateApiController : ControllerBase
{
    private readonly IHttpContextAccessor _accessor;
    private readonly IAdmissionsRepository _admissionsRepository;
    private readonly IHttpClientFactory _clientFactory;
    private readonly ICompanyRepository _companyRepository;
    private readonly IConfiguration _configuration;
    private readonly IDeathCertificateRepository _deathCertificateRepository;
    private readonly IErrorLogRepository _errorLogRepository;
    private readonly ISetupRepository _setupRepository;

    public DeathCertificateApiController(
        IDeathCertificateRepository deathCertificateRepository,
        IAdmissionsRepository admissionsRepository,
        IErrorLogRepository errorLogRepository,
        IHttpContextAccessor accessor,
        IConfiguration configuration,
        ISetupRepository setupRepository,
        ICompanyRepository companyRepository,
        IHttpClientFactory clientFactory)
    {
        _setupRepository = setupRepository;
        _errorLogRepository = errorLogRepository;
        _accessor = accessor;
        _configuration = configuration;
        _deathCertificateRepository = deathCertificateRepository;
        _admissionsRepository = admissionsRepository;
        _companyRepository = companyRepository;
        _clientFactory = clientFactory;
    }


    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _deathCertificateRepository.GetColumns();
    }

    [HttpPost]
    [Route("get")]
    [Authenticate(Operation.VIW, "")]
    public async Task<GetDeathCertificate> GetDeathCertificate([FromBody] NextDeathCertificatId model)
    {
        var deathId = 0;
        var headerPagination = 0;

        if (model != null)
        {
            headerPagination = model.HeaderPagination;
            deathId = model.DeathCertificateId;
        }

        return await _deathCertificateRepository.GetDeathCertificate(deathId, headerPagination);
    }


    [HttpPost]
    [Route("checkexist")]
    [Authenticate(Operation.VIW, "")]
    public async Task<bool> DeathCertificateCheckExist([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _deathCertificateRepository.CheckExist(id, companyId);
    }


    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<DeathCertificateGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        if (model.Form_KeyValue[0]?.ToString() == "myDeath")
            model.Form_KeyValue[1] = User.FindFirstValue("UserId");
        else
            model.Form_KeyValue[1] = null;

        var userId = UserClaims.GetUserId();
        ;
        return await _deathCertificateRepository.GetPage(model, userId);
    }


    [HttpPost]
    [Route("save")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> SaveDeathCertificate(
        [FromBody] ParsAlphabet.ERP.Application.Dtos.MC.DeathCertificate.DeathCertificate model)
    {
        var result = new MyResultStatus();

        model.CompanyId = short.Parse(User.FindFirstValue("CompanyId"));

        model.CreateUserId = short.Parse(User.FindFirstValue("UserId"));
        result = await _deathCertificateRepository.SaveDeathCertificate(model);

        return result;
    }


    [HttpPost]
    [Route("savedeathcertificaterecord")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultDataQuery<List<Cis_Result>>> SaveDeathCertificateRecord(
        [FromBody] List<int> DeathCertificateIds)
    {
        var keyA3 = new CisApiServices(_errorLogRepository, _accessor, _configuration, _clientFactory);
        var result = new MyResultDataQuery<List<Cis_Result>>();
        result.Data = new List<Cis_Result>();
        var keyA3Binding = new BindingDeathCertificateModel_MedicalSepas(_companyRepository, _setupRepository,
            _deathCertificateRepository, _admissionsRepository);
        var userId = UserClaims.GetUserId();
        ;

        foreach (var AdmissionId in DeathCertificateIds)
        {
            var admissionBinded = await keyA3Binding.SendDeathCertificateBinding(AdmissionId);
            var resultSendDeathCertificate = await keyA3.SaveDeathCetificateRecord(admissionBinded);
            if (resultSendDeathCertificate.Data != null)
                await _deathCertificateRepository.UpdateDeathWcfUpdate(AdmissionId,
                    resultSendDeathCertificate.Data.CompositionUID, resultSendDeathCertificate.Data.MessageUID,
                    resultSendDeathCertificate.Data.patientUID, resultSendDeathCertificate.Successfull, userId);

            if (!string.IsNullOrEmpty(resultSendDeathCertificate.Data.ErrorMessage))
            {
                result.Data.Add(new Cis_Result
                {
                    Id = AdmissionId,
                    AdmissionHid = AdmissionId.ToString(),
                    ErrorMessage = resultSendDeathCertificate.Data.ErrorMessage
                });
                result.Successfull = resultSendDeathCertificate.Successfull;
            }
            else if (string.IsNullOrEmpty(resultSendDeathCertificate.Data.CompositionUID) ||
                     string.IsNullOrEmpty(resultSendDeathCertificate.Data.MessageUID) ||
                     string.IsNullOrEmpty(resultSendDeathCertificate.Data.patientUID))
            {
                var isNullCount = 0;
                var errorMessage = "";

                if (string.IsNullOrEmpty(resultSendDeathCertificate.Data.CompositionUID))
                {
                    isNullCount += 1;
                    if (errorMessage != "")
                        errorMessage += ", CompositionUID";
                    else
                        errorMessage += "CompositionUID";
                }

                if (string.IsNullOrEmpty(resultSendDeathCertificate.Data.MessageUID))
                {
                    isNullCount += 1;
                    if (errorMessage != "")
                        errorMessage += ", MessageUID";
                    else
                        errorMessage += "MessageUID";
                }

                if (string.IsNullOrEmpty(resultSendDeathCertificate.Data.patientUID))
                {
                    isNullCount += 1;
                    if (errorMessage != "")
                        errorMessage += ", patientUID";
                    else
                        errorMessage += "patientUID";
                }

                if (isNullCount == 1)
                    errorMessage = "شناسه " + errorMessage;
                else
                    errorMessage = "شناسه های " + errorMessage;

                result.Data.Add(new Cis_Result
                {
                    Id = AdmissionId,
                    AdmissionHid = AdmissionId.ToString(),
                    ErrorMessage = errorMessage
                });
                result.Successfull = false;
            }
        }

        return result;
    }


    [HttpGet]
    [Route("getdeathlocationiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDeathLocationId()
    {
        return await _deathCertificateRepository.GetDeathLocationId();
    }


    [HttpGet]
    [Route("getsourceofdeathnotificationdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetSourceofDeathNotification()
    {
        return await _deathCertificateRepository.GetSourceofDeathNotification();
    }


    [HttpGet]
    [Route("getinfantweightdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetInfantWeight()
    {
        return await _deathCertificateRepository.GetInfantWeight();
    }

    [HttpGet]
    [Route("getcauseiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetCauseId(string? term)
    {
        return await _deathCertificateRepository.GetCauseId(term);
    }

    [HttpGet]
    [Route("countrydivisions")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetCountryDivisions(string? term)
    {
        return await _deathCertificateRepository.GetCountryDivisions(term);
    }

    [HttpGet]
    [Route("getdeliveryagentdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDeliveryAgent()
    {
        return await _deathCertificateRepository.GetDeliveryAgent();
    }

    [HttpGet]
    [Route("getdeliverylocationdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDeliveryLocation()
    {
        return await _deathCertificateRepository.GetDeliveryLocation();
    }


    [HttpGet]
    [Route("getconditioniddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetConditionId(string? term)
    {
        return await _deathCertificateRepository.ConditionId(term);
    }


    [HttpGet]
    [Route("getdosageunitiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDosageUnitId(string? term)
    {
        return await _deathCertificateRepository.DosageUnitId(term);
    }


    [HttpGet]
    [Route("getonsetdurationtopresentunitidmedicaldropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetOnsetDurationToPresentUnitId()
    {
        return await _deathCertificateRepository.OnsetDurationToPresentUnitId_MedicalHistory();
    }

    [HttpGet]
    [Route("getdurationdeathdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDurationDeath()
    {
        return await _deathCertificateRepository.GetDurationDeath();
    }

    [HttpGet]
    [Route("getdeathcausestatusdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDeathCauseStatus()
    {
        return await _deathCertificateRepository.GetDeathCauseStatus();
    }


    [HttpPost]
    [Route("deathcertificatesendgetpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<DeathCertificateSendGetPage>>> DeathCertificateSend_GetPage(
        [FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _deathCertificateRepository.DeathCertificateSend_GetPage(model);
    }

    [HttpPost]
    [Route("getfilteritemdeathcertificatesend")]
    public GetColumnsViewModel GetColumnsDeathCertificateSend()
    {
        return _deathCertificateRepository.GetColumnsDeathCertificateSend();
    }
}

[Route("MC")]
[Authorize]
public class DeathCertificateController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return View(Views.MC.DeathCertificate);
    }


    [Route("[controller]/getform/{id?}")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult form(int? id)
    {
        return PartialView(Views.MC.DeathCertificateForm);
    }


    [Route("[controller]/display/{id}")]
    [CheckRequest]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Display(int id)
    {
        return PartialView(Views.MC.DeathCertificateDisplay);
    }
}