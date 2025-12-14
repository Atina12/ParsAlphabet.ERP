using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionRefer;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionWebService;
using ParsAlphabet.ERP.Application.Interfaces._ErrorLog;
using ParsAlphabet.ERP.Application.Interfaces._Setup;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Application.Interfaces.MC;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionRefer;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Admission;
using ParsAlphabet.WebService.Api.Model.CIS;
using ParseAlphabet.ERP.Web.WebServices.CIS;
using static ParseAlphabet.ERP.Web.WebServices.CIS.BindingCisApiServices;

namespace ParseAlphabet.ERP.Web.Modules.MC.AdmissionRefer;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class AdmissionReferApiController : ControllerBase
{
    private readonly IHttpContextAccessor _accessor;
    private readonly IAdmissionReferRepository _admissionReferRepository;
    private readonly AdmissionServiceRepository _admissionRepository;
    private readonly IAdmissionsRepository _admissionsRepository;
    private readonly IHttpClientFactory _clientFactory;
    private readonly ICompanyRepository _companyRepository;
    private readonly IConfiguration _configuration;
    private readonly IErrorLogRepository _errorLogRepository;
    private readonly ISetupRepository _setupRepository;

    public AdmissionReferApiController(
        IAdmissionReferRepository admissionReferRepository,
        IAdmissionsRepository admissionsRepository,
        AdmissionServiceRepository admissionRepository,
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
        _admissionReferRepository = admissionReferRepository;
        _admissionsRepository = admissionsRepository;
        _admissionRepository = admissionRepository;
        //_attenderPrescriptionRepository = attenderPrescriptionRepository;
        _companyRepository = companyRepository;
        _clientFactory = clientFactory;
    }


    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _admissionReferRepository.GetColumns();
    }

    [HttpPost]
    [Route("admissionrefersendgetfilteritems")]
    public GetColumnsViewModel AdmissionReferSendGetFilterParameters()
    {
        return _admissionReferRepository.GetColumnsReferredSend();
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<AdmissionReferGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        if (model.Form_KeyValue[0]?.ToString() == "myRefer")
            model.Form_KeyValue[1] = User.FindFirstValue("UserId");
        else
            model.Form_KeyValue[1] = null;

        var userId = UserClaims.GetUserId();
        ;
        return await _admissionReferRepository.GetPage(model, userId);
    }

    [HttpPost]
    [Route("getfilteritemreferredsend")]
    public GetColumnsViewModel GetColumnsReferredSend()
    {
        return _admissionReferRepository.GetColumnsReferredSend();
    }

    [HttpPost]
    [Route("admissionrefersendgetpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<AdmissionReferSendGetPage>>> AdmissionReferSend_GetPage(
        [FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _admissionReferRepository.AdmissionReferSend_GetPage(model);
    }

    [HttpPost]
    [Route("admissionreferredsendfeedbackcolumns")]
    public GetColumnsViewModel AdmissionReferredSendFeedBackColumns()
    {
        return _admissionReferRepository.GetColumnFeedBackSend();
    }

    [HttpPost]
    [Route("admissionrefersendfeedbackpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<AdmissionReferSendFeedBackPage>>> AdmissionReferSendFeedBack_Page(
        [FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _admissionReferRepository.AdmissionReferSendFeedBack_GetPage(model);
    }

    //[HttpPost]
    //[Route("save")]
    //[Authenticate(Operation.INS, "")]
    //public async Task<MyResultStatus> SaveAdmissionRefer([FromBody] AdmissionRefer model)
    //{
    //    var result = new MyResultStatus();

    //    model.CompanyId = short.Parse(User.FindFirstValue("CompanyId"));
    //    //model.ReferringDoctorId = 0; //await _attenderPrescriptionRepository.GetAttenderIdByUserId(short.Parse(User.FindFirstValue("UserId")),model.CompanyId);
    //    model.CreateUserId = short.Parse(User.FindFirstValue("UserId"));
    //    result = await _admissionReferRepository.SaveAdmissionRefer(model);

    //    return result;
    //}

    //[HttpPost]
    //[Route("savefeedback")]
    //[Authenticate(Operation.INS, "")]
    //public async Task<MyResultStatus> SaveAdmissionFeedback([FromBody] AdmissionRefer model)
    //{
    //    var result = new MyResultStatus();

    //    model.CompanyId = short.Parse(User.FindFirstValue("CompanyId"));
    //    //model.ReferringDoctorId = await _attenderPrescriptionRepository.GetAttenderIdByUserId(short.Parse(User.FindFirstValue("UserId")));
    //    model.CreateUserId = short.Parse(User.FindFirstValue("UserId"));
    //    result = await _admissionReferRepository.SaveAdmissionFeedback(model);

    //    return result;
    //}

    [HttpPost]
    [Route("get")]
    [Authenticate(Operation.VIW, "")]
    public async Task<GetAdmissionRefer> GetAdmissionRefer([FromBody] int id)
    {
        return await _admissionReferRepository.GetAdmissionRefer(id);
    }

    [HttpPost]
    [Route("getfeedback")]
    [Authenticate(Operation.VIW, "")]
    public async Task<GetAdmissionFeedback> GetAdmissionFeedback([FromBody] int id)
    {
        return await _admissionReferRepository.GetAdmissionFeedback(id);
    }

    [HttpPost]
    [Route("sendreferralpatientrecord")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultDataQuery<List<ReferPatientRecord_Result>>> SendReferralPatientRecord(
        [FromBody] List<int> referIds)
    {
        return await _admissionReferRepository.SendReferralPatientRecord(referIds);
    }


    [HttpPost]
    [Route("sendfeedbackpatientrecord")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultDataQuery<List<Cis_Result>>> SendFeedBackPatientRecord([FromBody] List<int> referIds)
    {
       return await _admissionReferRepository.SendFeedBackPatientRecord(referIds);
    }

    [HttpPost]
    [Route("getfeedbackpatientrecord")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultDataStatus<GetFeedbackPatientRecord_Result>> GetFeedbackPatientRecord(
        [FromBody] int referId)
    {
      return await _admissionReferRepository.GetFeedbackPatientRecord(referId);
    }

    [HttpPost]
    [Route("getreferpatientrecord")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultDataStatus<GetReferralPatientRecord_Result>> GetReferPatientRecord(
        [FromBody] string referralId)
    {
      return await  _admissionReferRepository.GetReferPatientRecord(referralId);
    }


    [HttpPost]
    [Route("getactivereferralidbyadmission")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultDataStatus<GetActiveReferralId_Result>> GetActiveReferralIdByNationalCode(
        [FromBody] int id)
    {
        //var keyA3 = new WCF_SENA(_errorLogRepository, _accessor, _configuration, _setupRepository);

        //var admissionId = await _admissionReferRepository.GetReferAdmissionId(id);


        //var searchModel = new GetAdmissionSearch()
        //{
        //    AttenderId = 0,
        //    Id = admissionId,
        //    PatientFullName = "",
        //    PatientNationalCode = "",
        //    StateId = 0
        //};

        //searchModel.CompanyId = UserClaims.GetCompanyId();

        //var admission = await _admissionRepository.GetAdmission(searchModel);

        //var resultActiveReferralId = await keyA3.GetActiveReferralIDByNationalCode(admission.PatientNationalCode);

        //if (resultActiveReferralId.Data != null)
        //{
        //    ReferralId[] resultGrouped;

        //    if (resultActiveReferralId.Data.ReferralIds != null && resultActiveReferralId.Data.ReferralIds.Length > 0)
        //    {
        //        resultGrouped = resultActiveReferralId.Data.ReferralIds.GroupBy(h => new { h.Id, h.Assigner })
        //                                                  .Select(i => i.FirstOrDefault()).ToArray();

        //        resultActiveReferralId.Data.ReferralIds = resultGrouped;
        //    }
        //}

        //return resultActiveReferralId;
        throw new Exception();
    }

    [HttpPost]
    [Route("gettype")]
    [Authenticate(Operation.VIW, "")]
    public async Task<byte> GetReferType([FromBody] int id)
    {
        return await _admissionReferRepository.GetAdmissionReferType(id);
    }

    //[HttpPost]
    //[Route("getnextadmissionreferid")]
    //[Authenticate(Operation.VIW, "")]
    //public async Task<int> GetNextAdmissionReferId([FromBody] NextAdmissionReferId model)
    //{
    //    var admissionreferId = 0;
    //    var headerPagination = 0;
    //    if (model != null)
    //    {
    //        admissionreferId = model.AdmissionReferId;
    //        headerPagination = model.HeaderPagination;
    //    }
    //    return await _admissionReferRepository.GetNextAdmissionReferId(admissionreferId, headerPagination);
    //}

    [HttpPost]
    [Route("checkexist")]
    [Authenticate(Operation.DEL, "")]
    public async Task<bool> AdmissionReferCheckExist([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _admissionReferRepository.CheckExist(id, companyId);
    }

    [HttpGet]
    [Route("getthrfollowUpplanetypedropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetThrFollowUpPlaneType()
    {
        return await _admissionReferRepository.GetThrFollowUpPlaneType();
    }

    [HttpGet]
    [Route("getlifecyclestateiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetLifeCycleStateId()
    {
        return await _admissionReferRepository.LifeCycleStateId();
    }

    [HttpGet]
    [Route("getreferredreasoniddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetReferredReasonId()
    {
        return await _admissionReferRepository.ReferredReasonId();
    }

    [HttpGet]
    [Route("getreferredtypeiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetReferredTypeId()
    {
        return await _admissionReferRepository.ReferredTypeId();
    }

    [HttpGet]
    [Route("getabusedurationunitiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetAbuseDurationUnitId()
    {
        return await _admissionReferRepository.AbuseDurationUnitId();
    }

    [HttpGet]
    [Route("getsubstancetypeiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetSubstanceTypeId()
    {
        return await _admissionReferRepository.SubstanceTypeId();
    }


    [HttpGet]
    [Route("getamountofabuseunitiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetAmountOfAbuseIdId()
    {
        return await _admissionReferRepository.AmountOfAbuseUnitId();
    }

    [HttpGet]
    [Route("getreactioniddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetReactionId(string? term)
    {
        return await _admissionReferRepository.ReactionId(term);
    }

    [HttpGet]
    [Route("getreactioncategoryiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetReactionCategoryId(string? term)
    {
        return await _admissionReferRepository.ReactionCategoryId(term);
    }

    [HttpGet]
    [Route("getdiagnosisseverityiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDiagnosisSeverityId()
    {
        return await _admissionReferRepository.DiagnosisSeverityId();
    }

    [HttpGet]
    [Route("getcausativeagentiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetCausativeAgentId(string? term)
    {
        return await _admissionReferRepository.CausativeAgentId(term);
    }

    [HttpGet]
    [Route("getcausativeagentcategoryiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetCausativeAgentCategoryId(string? term)
    {
        return await _admissionReferRepository.CausativeAgentCategoryId(term);
    }

    [HttpGet]
    [Route("getconditioniddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetConditionId(string? term)
    {
        return await _admissionReferRepository.ConditionId(term);
    }

    [HttpGet]
    [Route("getrelatedpersoniddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetRelatedPersonId()
    {
        return await _admissionReferRepository.RelatedPersonId();
    }

    [HttpGet]
    [Route("getpositioniddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetPositionId()
    {
        return await _admissionReferRepository.PositionId();
    }

    [HttpGet]
    [Route("getactionnameiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetActionNameId(string? term)
    {
        return await _admissionReferRepository.ActionNameId(term);
    }

    [HttpGet]
    [Route("gettimetakenunitiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetTimeTakenUnitId()
    {
        return await _admissionReferRepository.TimeTakenUnitId();
    }

    [HttpGet]
    [Route("getonsetdurationtopresentunitidclinicaldropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetOnSetDurationToPresentUnitId()
    {
        return await _admissionReferRepository.OnSetDurationToPresentUnitId_Clinical();
    }

    [HttpGet]
    [Route("getfindingdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetFinding(string? term)
    {
        return await _admissionReferRepository.Finding(term);
    }

    [HttpGet]
    [Route("getseverityiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetSeverityId(string? term)
    {
        return await _admissionReferRepository.SeverityId(term);
    }

    [HttpGet]
    [Route("getpulsecharacterdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetPulseCharacter()
    {
        return await _admissionReferRepository.GetPulseCharacter();
    }

    [HttpGet]
    [Route("getlocationofmeasurmentdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetLocationOfMeasurment()
    {
        return await _admissionReferRepository.GetLocationOfMeasurment();
    }

    [HttpGet]
    [Route("getpulsevolumedropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetPulseVolume()
    {
        return await _admissionReferRepository.GetPulseVolume();
    }

    [HttpGet]
    [Route("getpulseregularitydropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetPulseRegularity()
    {
        return await _admissionReferRepository.GetPulseRegularity();
    }

    [HttpGet]
    [Route("gettemperaturelocationdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetTemperatureLocation()
    {
        return await _admissionReferRepository.GetTemperatureLocation();
    }

    [HttpGet]
    [Route("geterxiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetMedicationId(string? term)
    {
        return await _admissionReferRepository.ErxId(term);
    }

    [HttpGet]
    [Route("getrouteiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetRouteId(string? term)
    {
        return await _admissionReferRepository.RouteId(term);
    }

    [HttpGet]
    [Route("getdosageunitiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDosageUnitId(string? term)
    {
        return await _admissionReferRepository.DosageUnitId(term);
    }

    [HttpGet]
    [Route("getfrequencyiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetFrequencyId()
    {
        return await _admissionReferRepository.FrequencyId();
    }

    [HttpGet]
    [Route("getlongtermunitiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetLongTermUnitId()
    {
        return await _admissionReferRepository.LongTermUnitId();
    }

    [HttpGet]
    [Route("getonsetdurationtopresentunitidmedicaldropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetOnsetDurationToPresentUnitId()
    {
        return await _admissionReferRepository.OnsetDurationToPresentUnitId_MedicalHistory();
    }

    [HttpGet]
    [Route("getmethodiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetMethodId(string? term)
    {
        return await _admissionReferRepository.MethodId(term);
    }


    [HttpGet]
    [Route("getlateralityiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetLaterality()
    {
        return await _admissionReferRepository.LateralityId();
    }

    [HttpPost]
    [Route("getactivereferralid")]
    [Authenticate(Operation.VIW, "Admission")]
    public async Task<MyResultDataStatus<GetActiveReferralId_Result>> GetActiveReferralId(
        [FromBody] string nationalCode)
    {
        //var key3 = new WCF_SENA(_errorLogRepository, _accessor, _configuration, _setupRepository);
        //var resultActiveReferral = await key3.GetActiveReferralIDByNationalCode(nationalCode);

        //if (resultActiveReferral.Data != null)
        //{
        //    if (resultActiveReferral.Data.ReferralIds != null)
        //    {
        //        var activeReferralGrouped = resultActiveReferral.Data.ReferralIds.GroupBy(h => new { h.Id, h.Assigner })
        //                                    .Select(i => i.FirstOrDefault()).ToArray();
        //        resultActiveReferral.Data.ReferralIds = activeReferralGrouped;
        //    }
        //}

        //return resultActiveReferral;
        throw new Exception();
    }
}

[Route("MC")]
[Authorize]
public class AdmissionReferController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return View(Views.MC.AdmissionRefer);
    }

    [Route("[controller]/sendform/{id?}")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult SendFeedbackForm(int? id)
    {
        return PartialView(Views.MC.AdmissionReferSendFeedbackForm);
    }

    [Route("[controller]/getform/{id?}")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult GetReferForm(int? id)
    {
        return PartialView(Views.MC.AdmissionGetReferForm);
    }

    [Route("[controller]/displaysendrefer/{id}")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult SendFeedbackDisplay(int id)
    {
        return PartialView(Views.MC.AdmissionReferSendFeedbackDisplay);
    }

    [Route("[controller]/displaygetrefer/{id}")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult GetReferDisplay(int id)
    {
        return PartialView(Views.MC.AdmissionGetReferDisplay);
    }
}