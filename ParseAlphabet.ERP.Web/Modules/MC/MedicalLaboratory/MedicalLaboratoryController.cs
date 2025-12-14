using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionWebService;
using ParsAlphabet.ERP.Application.Dtos.MC.MedicalLaboratory;
using ParsAlphabet.ERP.Application.Interfaces._ErrorLog;
using ParsAlphabet.ERP.Application.Interfaces._Setup;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Application.Interfaces.MC;
using ParsAlphabet.ERP.Application.Interfaces.MC.MedicalLaboratory;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Admission;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Insurance;
using ParseAlphabet.ERP.Web.WebServices.CIS;
using static ParseAlphabet.ERP.Web.WebServices.CIS.BindingCisApiServices;

namespace ParseAlphabet.ERP.Web.Modules.MC.MedicalLaboratory;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class MedicalLaboratoryApiController : ControllerBase
{
    private readonly IHttpContextAccessor _accessor;
    private readonly AdmissionServiceRepository _admissionRepository;
    private readonly IAdmissionsRepository _admissionsRepository;
    private readonly IHttpClientFactory _clientFactory;
    private readonly ICompanyRepository _companyRepository;
    private readonly IConfiguration _configuration;
    private readonly IErrorLogRepository _errorLogRepository;
    private readonly InsuranceRepository _insuranceRepository;
    private readonly IMedicalLaboratoryRepository _medicalLaboratoryRepository;
    private readonly ISetupRepository _setupRepository;

    public MedicalLaboratoryApiController(
        IMedicalLaboratoryRepository medicalLaboratoryRepository,
        IAdmissionsRepository admissionsRepository,
        AdmissionServiceRepository admissionRepository,
        IErrorLogRepository errorLogRepository,
        IHttpContextAccessor accessor,
        IConfiguration configuration,
        ISetupRepository setupRepository,
        ICompanyRepository companyRepository,
        InsuranceRepository insuranceRepository,
        IHttpClientFactory clientFactory)
    {
        _setupRepository = setupRepository;
        _errorLogRepository = errorLogRepository;
        _accessor = accessor;
        _configuration = configuration;
        _medicalLaboratoryRepository = medicalLaboratoryRepository;
        _admissionsRepository = admissionsRepository;
        _admissionRepository = admissionRepository;
        _companyRepository = companyRepository;
        _insuranceRepository = insuranceRepository;
        _clientFactory = clientFactory;
    }


    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _medicalLaboratoryRepository.GetColumns();
    }


    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<MedicalLaboratoryGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        if (model.Form_KeyValue[0]?.ToString() == "mylab")
            model.Form_KeyValue[1] = User.FindFirstValue("UserId");

        var userId = UserClaims.GetUserId();
        ;
        return await _medicalLaboratoryRepository.GetPage(model, userId);
    }

    [HttpPost]
    [Route("checkexist")]
    [Authenticate(Operation.DEL, "")]
    public async Task<bool> MedicalLaboratoryCheckExist([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _medicalLaboratoryRepository.CheckExist(id, companyId);
    }


    [HttpPost]
    [Route("save")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> SavemedicalLaboratory(
        [FromBody] ParsAlphabet.ERP.Application.Dtos.MC.MedicalLaboratory.MedicalLaboratory model)
    {
        var result = new MyResultStatus();

        model.CompanyId = short.Parse(User.FindFirstValue("CompanyId"));
        //model.MedicalLaboratoryringDoctorId = 0; //await _attenderPrescriptionRepository.GetAttenderIdByUserId(short.Parse(User.FindFirstValue("UserId")),model.CompanyId);
        model.CreateUserId = short.Parse(User.FindFirstValue("UserId"));
        result = await _medicalLaboratoryRepository.SaveMedicalLaboratory(model);

        return result;
    }


    [HttpPost]
    [Route("get")]
    [Authenticate(Operation.VIW, "")]
    public async Task<GetMedicalLaboratory> GetMedicalLaboratory([FromBody] NextMedicalLaboratoryId model)
    {
        var labId = 0;
        var headerPagination = 0;
        if (model != null)
        {
            labId = model.LabId;
            headerPagination = model.HeaderPagination;
        }

        return await _medicalLaboratoryRepository.GetMedicalLaboratory(labId, headerPagination);
    }

    [HttpPost]
    [Route("medicallaboratorysendgetpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<MedicalLaboratorySendGetPage>>> MedicalLaboratorySend_GetPage(
        [FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _medicalLaboratoryRepository.MedicalLaboratorySend_GetPage(model);
    }

    [HttpPost]
    [Route("getfilteritemmedicallaboratorysend")]
    public GetColumnsViewModel GetColumnsMedicalLaboratorySend()
    {
        return _medicalLaboratoryRepository.GetColumnsMedicalLaboratorySend();
    }


    [HttpPost]
    [Route("send")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultDataQuery<List<Cis_Result>>> SendMedicalLaboratory(
        [FromBody] List<int> medicalLaboratoryIds)
    {
        var lisRest = new CisApiServices(_errorLogRepository, _accessor, _configuration, _clientFactory);
        var result = new MyResultDataQuery<List<Cis_Result>>();
        result.Data = new List<Cis_Result>();
        var lisBinding = new BindingLIS_MedicalSepas(_companyRepository, _setupRepository, _admissionsRepository,
            _admissionRepository, _insuranceRepository);
        var userId = UserClaims.GetUserId();
        ;

        foreach (var laboratoryId in medicalLaboratoryIds)
        {
            var getLaboratory = await _medicalLaboratoryRepository.GetMedicalLaboratory(laboratoryId);
            var labBinded = await lisBinding.BindLaboratory(getLaboratory);

            var resultSendMedicalLaboratory = await lisRest.SendLaboratory(labBinded);
            var resultSendPathology = new object();

            if (string.IsNullOrEmpty(resultSendMedicalLaboratory.Data.ErrorMessage) &&
                !string.IsNullOrEmpty(resultSendMedicalLaboratory.Data.MessageUID)
                && !string.IsNullOrEmpty(resultSendMedicalLaboratory.Data.CompositionUID) &&
                !string.IsNullOrEmpty(resultSendMedicalLaboratory.Data.patientUID)
                && getLaboratory.Pathology != null)
            {
                var pathologyBinded = await lisBinding.BindPathology(getLaboratory);

                resultSendPathology = await lisRest.SendPathology(pathologyBinded);
            }

            if (resultSendMedicalLaboratory != null)
                await _medicalLaboratoryRepository.UpdateMedicalLaboratoryWcfUpdate(laboratoryId,
                    resultSendMedicalLaboratory.Data.CompositionUID, resultSendMedicalLaboratory.Data.MessageUID,
                    resultSendMedicalLaboratory.Data.patientUID,
                    !string.IsNullOrEmpty(resultSendMedicalLaboratory.Data.CompositionUID), userId);

            if (!string.IsNullOrEmpty(resultSendMedicalLaboratory.Data.ErrorMessage))
            {
                result.Data.Add(new Cis_Result
                {
                    Id = laboratoryId,
                    AdmissionHid = labBinded.Admission.HID,
                    ErrorMessage = resultSendMedicalLaboratory.Data.ErrorMessage
                });
                result.Successfull = !string.IsNullOrEmpty(resultSendMedicalLaboratory.Data.CompositionUID);
            }
            else if (string.IsNullOrEmpty(resultSendMedicalLaboratory.Data.CompositionUID) ||
                     string.IsNullOrEmpty(resultSendMedicalLaboratory.Data.MessageUID) ||
                     string.IsNullOrEmpty(resultSendMedicalLaboratory.Data.patientUID))
            {
                var isNullCount = 0;
                var errorMessage = "";

                if (string.IsNullOrEmpty(resultSendMedicalLaboratory.Data.CompositionUID))
                {
                    isNullCount += 1;
                    if (errorMessage != "")
                        errorMessage += ", CompositionUID";
                    else
                        errorMessage += "CompositionUID";
                }

                if (string.IsNullOrEmpty(resultSendMedicalLaboratory.Data.MessageUID))
                {
                    isNullCount += 1;
                    if (errorMessage != "")
                        errorMessage += ", MessageUID";
                    else
                        errorMessage += "MessageUID";
                }

                if (string.IsNullOrEmpty(resultSendMedicalLaboratory.Data.patientUID))
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
                    Id = laboratoryId,
                    AdmissionHid = labBinded.Admission.HID,
                    ErrorMessage = errorMessage
                });
                result.Successfull = false;
            }
        }

        return result;
    }


    [HttpGet]
    [Route("getspecimentypetddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> SpecimenTypeId()
    {
        return await _medicalLaboratoryRepository.SpecimenTypeId();
    }

    [HttpGet]
    [Route("getcodedtypetddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> CodedTypeId(string? term)
    {
        return await _medicalLaboratoryRepository.CodedTypeId(term);
    }

    [HttpGet]
    [Route("getcollectionprocedureiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> CollectionProcedureId()
    {
        return await _medicalLaboratoryRepository.CollectionProcedureId();
    }

    [HttpGet]
    [Route("getsnomedctmethodiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> SnomedctMethodId(string? term)
    {
        return await _medicalLaboratoryRepository.SnomedctMethodId(term);
    }


    [HttpGet]
    [Route("getlaboratorypaneliddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> LaboratoryPanelId(string? term)
    {
        return await _medicalLaboratoryRepository.LaboratoryPanelId(term);
    }


    [HttpGet]
    [Route("getresultstatusiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> ResultStatusId()
    {
        return await _medicalLaboratoryRepository.ResultStatusId();
    }

    [HttpGet]
    [Route("gettestnameiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> TestNameId(string? term)
    {
        return await _medicalLaboratoryRepository.TestNameId(term);
    }


    [HttpGet]
    [Route("getreactioncategoryiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> TestPanelId(string? term)
    {
        return await _medicalLaboratoryRepository.TestPanelId(term);
    }

    [HttpGet]
    [Route("gettestresultiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> TestResultId(string? term)
    {
        return await _medicalLaboratoryRepository.TestResultId(term);
    }

    [HttpGet]
    [Route("getagerangeiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> AgeRangeId()
    {
        return await _medicalLaboratoryRepository.AgeRangeId();
    }

    [HttpGet]
    [Route("getgestationagerangeiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GestationAgeRangeId()
    {
        return await _medicalLaboratoryRepository.GestationAgeRangeId();
    }

    [HttpGet]
    [Route("gethormonalphaseiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> HormonalPhaseId(string? term)
    {
        return await _medicalLaboratoryRepository.HormonalPhaseId();
    }


    [HttpGet]
    [Route("getreferencestatusiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> ReferenceStatusId(string? term)
    {
        return await _medicalLaboratoryRepository.ReferenceStatusId();
    }

    [HttpGet]
    [Route("getspeciesiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> SpeciesId(string? term)
    {
        return await _medicalLaboratoryRepository.SpeciesId();
    }

    [HttpGet]
    [Route("getdiagnosisreasoniddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> DiagnosisReasonId(string? term)
    {
        return await _medicalLaboratoryRepository.DiagnosisReasonId(term);
    }


    [HttpGet]
    [Route("getseverityiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> SeverityId(string? term)
    {
        return await _medicalLaboratoryRepository.SeverityId(term);
    }

    [HttpGet]
    [Route("getdiagnosisstatusiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> DiagnosisStatusId()
    {
        return await _medicalLaboratoryRepository.DiagnosisStatusId();
    }

    [HttpGet]
    [Route("getspecimenadequacyiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> SpecimenAdequacyId()
    {
        return await _medicalLaboratoryRepository.SpecimenAdequacyId();
    }

    [HttpGet]
    [Route("gettestresulttypeiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> TestResultTypeId()
    {
        return await _medicalLaboratoryRepository.TestResultTypeId();
    }

    [HttpGet]
    [Route("gettestresultunitiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> TestResultUnitId(string? term)
    {
        return await _medicalLaboratoryRepository.TestResultUnitId(term);
    }

    [HttpGet]
    [Route("gettestresultunitidresulttypedropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> TestResultUnitId_ResultType(string? term)
    {
        return await _medicalLaboratoryRepository.TestResultUnitId_ResultType(term);
    }

    [HttpGet]
    [Route("getmorphologyiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> MorphologyId(string? term)
    {
        return await _medicalLaboratoryRepository.TestResultUnitId(term);
    }

    [HttpGet]
    [Route("getmorphologydifferentiationiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> MorphologyDifferentiationId(string? term)
    {
        return await _medicalLaboratoryRepository.TestResultUnitId(term);
    }

    [HttpGet]
    [Route("gettopographyiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> TopographyId(string? term)
    {
        return await _medicalLaboratoryRepository.TestResultUnitId(term);
    }

    [HttpGet]
    [Route("gettopographylateralityiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> TopographyLateralityId()
    {
        return await _medicalLaboratoryRepository.TopographyLaterality();
    }
}

[Route("MC")]
[Authorize]
public class MedicalLaboratoryController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return View(Views.MC.MedicalLaboratory);
    }


    [Route("[controller]/getform/{id?}")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult form(int? id)
    {
        return PartialView(Views.MC.MedicalLaboratoryForm);
    }

    [Route("[controller]/display/{id}")]
    [CheckRequest]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Display(int id)
    {
        return PartialView(Views.MC.MedicalLaboratoryDisplay);
    }
}