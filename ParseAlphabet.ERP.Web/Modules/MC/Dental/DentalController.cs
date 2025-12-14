using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionWebService;
using ParsAlphabet.ERP.Application.Dtos.MC.Dental;
using ParsAlphabet.ERP.Application.Interfaces._ErrorLog;
using ParsAlphabet.ERP.Application.Interfaces._Setup;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Application.Interfaces.MC;
using ParsAlphabet.ERP.Application.Interfaces.MC.Dental;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Admission;
using ParseAlphabet.ERP.Web.WebServices.CIS;
using static ParseAlphabet.ERP.Web.WebServices.CIS.BindingCisApiServices;

namespace ParseAlphabet.ERP.Web.Modules.MC.Dental;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class DentalApiController(
    IDentalRepository admissionDentalRepository,

    AdmissionServiceRepository admissionRepository
   )
    : ControllerBase
{
    private readonly AdmissionServiceRepository _admissionRepository = admissionRepository;


    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return admissionDentalRepository.GetColumns();
    }


    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<DentalGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        if (model.Form_KeyValue[0]?.ToString() == "myDental")
            model.Form_KeyValue[1] = User.FindFirstValue("UserId");
        else
            model.Form_KeyValue[1] = null;

        var userId = UserClaims.GetUserId();
        ;
        return await admissionDentalRepository.GetPage(model, userId);
    }

    [HttpPost]
    [Route("save")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> SaveAdmissionDental([FromBody] AdmissionDental model)
    {
        var result = new MyResultStatus();

        model.CompanyId = short.Parse(User.FindFirstValue("CompanyId"));
        //model.DentalringDoctorId = 0; //await _attenderPrescriptionRepository.GetAttenderIdByUserId(short.Parse(User.FindFirstValue("UserId")),model.CompanyId);
        model.CreateUserId = short.Parse(User.FindFirstValue("UserId"));
        result = await admissionDentalRepository.SaveDental(model);

        return result;
    }


    [HttpPost]
    [Route("get")]
    [Authenticate(Operation.VIW, "")]
    public async Task<GetDental> GetAdmissionDental([FromBody] NextDentalId model)
    {
        var dentalId = 0;
        var headerPagination = 0;
        if (model != null)
        {
            dentalId = model.DentalId;
            headerPagination = model.HeaderPagination;
        }

        return await admissionDentalRepository.GetAdmissionDental(dentalId, headerPagination);
    }

    [HttpPost]
    [Route("checkexist")]
    [Authenticate(Operation.DEL, "")]
    public async Task<bool> PrescriptionCheckExist([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await admissionDentalRepository.CheckExist(id, companyId);
    }

    [HttpPost]
    [Route("savedentalcaserecord")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultDataQuery<List<Cis_Result>>> SaveDentalCaseRecord([FromBody] List<int> dentalIds)
    {
        return await admissionDentalRepository.SaveDentalCaseRecord(dentalIds);
    }


    [HttpGet]
    [Route("getlifecyclestateiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetLifeCycleStateId()
    {
        return await admissionDentalRepository.LifeCycleStateId();
    }


    [HttpGet]
    [Route("getabusedurationunitiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetAbuseDurationUnitId()
    {
        return await admissionDentalRepository.AbuseDurationUnitId();
    }

    [HttpGet]
    [Route("getsubstancetypeiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetSubstanceTypeId()
    {
        return await admissionDentalRepository.SubstanceTypeId();
    }


    [HttpGet]
    [Route("getamountofabuseunitiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetAmountOfAbuseIdId()
    {
        return await admissionDentalRepository.AmountOfAbuseUnitId();
    }

    [HttpGet]
    [Route("getservicetypedropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> ServiceTypeId()
    {
        return await admissionDentalRepository.ServiceTypeId();
    }

    [HttpGet]
    [Route("getreactioncategoryiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetReactionCategoryId(string? term)
    {
        return await admissionDentalRepository.ReactionCategoryId(term);
    }

    [HttpGet]
    [Route("getdiagnosisseverityiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDiagnosisSeverityId()
    {
        return await admissionDentalRepository.DiagnosisSeverityId();
    }

    [HttpGet]
    [Route("getcausativeagentiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetCausativeAgentId(string? term)
    {
        return await admissionDentalRepository.CausativeAgentId(term);
    }

    [HttpGet]
    [Route("getcausativeagentcategoryiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetCausativeAgentCategoryId(string? term)
    {
        return await admissionDentalRepository.CausativeAgentCategoryId(term);
    }

    [HttpGet]
    [Route("getconditioniddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetConditionId(string? term)
    {
        return await admissionDentalRepository.ConditionId(term);
    }

    [HttpGet]
    [Route("getrelatedpersoniddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetRelatedPersonId()
    {
        return await admissionDentalRepository.RelatedPersonId();
    }

    [HttpGet]
    [Route("getpositioniddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetPositionId()
    {
        return await admissionDentalRepository.PositionId();
    }

    [HttpGet]
    [Route("getactionnameiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetActionNameId(string? term)
    {
        return await admissionDentalRepository.ActionNameId(term);
    }

    [HttpGet]
    [Route("gettimetakenunitiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetTimeTakenUnitId()
    {
        return await admissionDentalRepository.TimeTakenUnitId();
    }

    [HttpGet]
    [Route("getonsetdurationtopresentunitidclinicaldropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetOnSetDurationToPresentUnitId()
    {
        return await admissionDentalRepository.OnSetDurationToPresentUnitId_Clinical();
    }

    [HttpGet]
    [Route("getfindingdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetFinding(string? term)
    {
        return await admissionDentalRepository.Finding(term);
    }

    [HttpGet]
    [Route("getseverityiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetSeverityId(string? term)
    {
        return await admissionDentalRepository.SeverityId(term);
    }

    [HttpGet]
    [Route("geterxiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetMedicationId(string? term)
    {
        return await admissionDentalRepository.ErxId(term);
    }

    [HttpGet]
    [Route("getrouteiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetRouteId(string? term)
    {
        return await admissionDentalRepository.RouteId(term);
    }

    [HttpGet]
    [Route("getdosageunitiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDosageUnitId(string? term)
    {
        return await admissionDentalRepository.DosageUnitId(term);
    }

    [HttpGet]
    [Route("getfrequencyiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetFrequencyId()
    {
        return await admissionDentalRepository.FrequencyId();
    }

    [HttpGet]
    [Route("getlongtermunitiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetLongTermUnitId()
    {
        return await admissionDentalRepository.LongTermUnitId();
    }

    [HttpGet]
    [Route("diagnosisreasonid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<IEnumerable<MyDropDownViewModel>> DiagnosisReasonId(string? term)
    {
        return await admissionDentalRepository.DiagnosisReasonId(term);
    }


    [HttpGet]
    [Route("getonsetdurationtopresentunitidmedicaldropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetOnsetDurationToPresentUnitId()
    {
        return await admissionDentalRepository.OnsetDurationToPresentUnitId_MedicalHistory();
    }

    [HttpGet]
    [Route("getmethodiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetMethodId(string? term)
    {
        return await admissionDentalRepository.MethodId(term);
    }


    [HttpGet]
    [Route("getlateralityiddropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetLaterality()
    {
        return await admissionDentalRepository.LateralityId();
    }

    [HttpGet]
    [Route("gettoothnamedropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetToothName(string? term)
    {
        return await admissionDentalRepository.GetToothName(term);
    }

    [HttpGet]
    [Route("gettoothpartdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetToothPart(string? term)
    {
        return await admissionDentalRepository.GetToothPart(term);
    }

    [HttpGet]
    [Route("gettoothsegmentdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetToothSegment(string? term)
    {
        return await admissionDentalRepository.GetToothSegment(term);
    }

    [HttpGet]
    [Route("gettreatmentservicedropdown/{admissionId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetTreatmentService(int? admissionId)
    {
        return await admissionDentalRepository.GetTreatmentService(admissionId);
    }

    [HttpGet]
    [Route("gettreatmentserviceunitdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetTreatmentServiceCountUnit()
    {
        return await admissionDentalRepository.GetTreatmentServiceCountUnit();
    }

    //[HttpPost]
    //[Route("dentalsendgetfilteritems")]
    //public GetColumnsViewModel AdmissionDentalSendGetFilterParameters()    => _admissionDentalRepository.GetColumnsDentalSend();

    [HttpPost]
    [Route("dentalsendgetpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<DentalSendGetPage>>> DentalSend_GetPage([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await admissionDentalRepository.DentalSend_GetPage(model);
    }

    [HttpPost]
    [Route("getfilteritemdentalsend")]
    public GetColumnsViewModel GetColumnsDentalSend()
    {
        return admissionDentalRepository.GetColumnsDentalSend();
    }


    //    [HttpPost]
    //    [Route("getactiveDentalid")]
    //    [Authenticate(Operation.VIW, "Admission")]
    //    public async Task<MyResultDataStatus<GetActiveDentalId_Result>> GetActiveDentalralId([FromBody] string nationalCode)
    //    {
    //        var key3 = new WCF_SENA(_errorLogRepository, _accessor, _configuration, _setupRepository);
    //        var resultActiveDentalral = await key3.GetActiveDentalIDByNationalCode(nationalCode);

    //        if (resultActiveDentalral.Data != null)
    //        {
    //            if (resultActiveDentalral.Data.DentalralIds != null)
    //            {
    //                var activeDentalralGrouped = resultActiveDentalral.Data.DentalralIds.GroupBy(h => new { h.Id, h.Assigner })
    //                                            .Select(i => i.FirstOrDefault()).ToArray();
    //                resultActiveDentalral.Data.DentalralIds = activeDentalralGrouped;
    //            }
    //        }

    //        return resultActiveDental;
    //    }
    //}
}

[Route("MC")]
[Authorize]
public class DentalController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return View(Views.MC.Dental);
    }


    [Route("[controller]/getform/{id?}")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult form(int? id)
    {
        return PartialView(Views.MC.DentalForm);
    }


    [Route("[controller]/display/{id}")]
    [CheckRequest]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Display(int id)
    {
        return PartialView(Views.MC.DentalDisplay);
    }
}