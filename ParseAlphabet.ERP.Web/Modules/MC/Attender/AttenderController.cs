using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ParsAlphabet.Central.ObjectModel.Requests;
using ParsAlphabet.ERP.Application.Dtos._History;
using ParsAlphabet.ERP.Application.Dtos.MC.Attender;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.Central;
using ParsAlphabet.ERP.Infrastructure.Implantation._History;
using ParsAlphabet.ERP.Infrastructure.Implantation.HR.OrganizationalDepartment;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Attender;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Speciality;

namespace ParseAlphabet.ERP.Web.Modules.MC.Attender;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class AttenderApiController : ControllerBase
{
    private readonly IHttpContextAccessor _accessor;
    private readonly AttenderRepository _attenderRepository;
    private readonly IAttenderServiceCentral _centralAttenderService;
    private readonly HistoryRepository _history;
    private readonly OrganizationalDepartmentRepository _organizationalDepartmentRepository;
    private readonly SpecialityRepository _specialityRepository;

    public AttenderApiController(AttenderRepository attenderRepository,
        OrganizationalDepartmentRepository organizationalDepartmentRepository,
        IHttpContextAccessor accessor, HistoryRepository history,
        SpecialityRepository specialityRepository,
        IAttenderServiceCentral centralAttenderService
    )
    {
        _attenderRepository = attenderRepository;
        _organizationalDepartmentRepository = organizationalDepartmentRepository;
        _specialityRepository = specialityRepository;
        _accessor = accessor;
        _history = history;
        _centralAttenderService = centralAttenderService;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<AttenderGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        return await _attenderRepository.GetPage(model, "attender");
    }

    [HttpPost]
    [Route("sendcentralattender")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> SendCentralAttender([FromBody] int id)
    {
        var userId = UserClaims.GetUserId();
        ;
        return await _attenderRepository.SendCentralAttender(id, userId);
    }

    [HttpPost]
    [Route("getpageattendercommission")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<AttenderGetPage>>> GetPageAttenderForService(
        [FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        return await _attenderRepository.GetPage(model, "attendercommission");
    }

    [HttpPost]
    [Route("getpageattenderforassistant")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<AttenderGetPage>>> GetPageAttenderForAttender(
        [FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        return await _attenderRepository.GetPage(model, "attenderassistant");
    }

    [HttpPost]
    [Route("getpageattendertimesheet")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<AttenderGetPage>>> GetPageAttenderTimeSheet(
        [FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        return await _attenderRepository.GetPage(model, "attendertimesheet");
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<ScheduleAttenderGetRecord>> GetRecordById([FromBody] short keyvalue)
    {
        var attender = await _attenderRepository.GetRecordById<ScheduleAttenderGetRecord>(keyvalue, false, "mc");

        attender.SpecialityName = await _specialityRepository.GetSpecialityName(attender.SpecialityId);


        #region accountDetailAttenderList

        var accountDetailViewModel = new
        {
            attender.IdNumber,
            FullName = attender.FullName != "" || attender.FullName != null ? attender.FullName : "",
            NationalCode = attender.NationalCode != null ? attender.NationalCode : "",
            attender.DepartmentId,
            ServiceCenterName = attender.DepartmentId > 0
                ? await _organizationalDepartmentRepository.GetDepartmentName(attender.DepartmentId)
                : ""
        };
        attender.JsonAccountDetailList = JsonConvert.SerializeObject(accountDetailViewModel);

        #endregion

        return new MyResultPage<ScheduleAttenderGetRecord>
        {
            Data = attender
        };
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _attenderRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> Insert([FromBody] AttenderModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.CreateUserId = UserClaims.GetCompanyId();

            #region History

            var userId = UserClaims.GetUserId();
            ;

            MyClaim.Init(_accessor);
            var ipAdrress = MyClaim.IpAddress;

            var userAgent = new UserAgent(Request.Headers["User-Agent"]);
            var historyModel = new HistoryModel
            {
                ControllerName = nameof(AttenderApiController),
                ActionName = nameof(Insert),
                Browser = userAgent.Browser.NameAndVersion,
                CompanyId = model.CompanyId,
                Description =
                    $"UserId:{userId}_AttenderId:${model.Id}_AttenderFullName:{model.FirstName + " " + model.LastName}_NationalCode:{model.NationalCode}_MSC:{model.MSC}",
                UserId = userId,
                IpAddress = ipAdrress,
                OperatingSystem = userAgent.OS.NameAndVersion
            };
            var resultHistory = await _history.Insert(historyModel);

            #endregion

            return await _attenderRepository.Insert(model);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultStatus> Update([FromBody] AttenderModel model)
    {
        var result = new MyResultDataStatus<Tuple<MyResultStatus, HttpResult<ResultQuery>>>();

        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.CreateUserId = UserClaims.GetCompanyId();

            #region History

            var userId = UserClaims.GetUserId();
            ;

            MyClaim.Init(_accessor);
            var ipAdrress = MyClaim.IpAddress;

            var userAgent = new UserAgent(Request.Headers["User-Agent"]);
            var historyModel = new HistoryModel
            {
                ControllerName = nameof(AttenderApiController),
                ActionName = nameof(Update),
                Browser = userAgent.Browser.NameAndVersion,
                CompanyId = model.CompanyId,
                Description =
                    $"UserId:{userId}_AttenderId:${model.Id}_AttenderFullName:${model.FirstName + " " + model.LastName}_NationalCode:{model.NationalCode}_MSC:{model.MSC}",
                UserId = userId,
                IpAddress = ipAdrress,
                OperatingSystem = userAgent.OS.NameAndVersion
            };
            var resultHistory = await _history.Insert(historyModel);

            #endregion

            return await _attenderRepository.Update(model);
        }

        return ModelState.ToMyResultStatus<int>();
    }


    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _attenderRepository.Delete(keyvalue, CompanyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _attenderRepository.Csv(model, "attender");
    }

    [HttpGet]
    [Route("getdropdown/{isActive?}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(string? term, byte? isActive = 1)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _attenderRepository.GetDropDown(term, companyId, isActive);
    }

    [HttpGet]
    [Route("getattenderbooking/{branchId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetAttenderBookingDropDown(short branchId)
    {
        var result = await _attenderRepository.GetAttenderBookingDropDown(branchId);
        return result;
    }

    [HttpGet]
    [Route("getattenderbookingparaclinic/{branchId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetAttenderBookingParaClinicDropDown(short branchId)
    {
        var result = await _attenderRepository.GetAttenderBookingParaClinicDropDown(branchId);
        return result;
    }

    [HttpPost]
    [Route("getattenderlist")]
    public async Task<List<MyDropDownViewModel>> GetAttenderList([FromBody] string ids)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _attenderRepository.GetAttenderList(ids, CompanyId);
    }

    [HttpGet]
    [Route("getattenderlistbydepartmentids/{departmentIds}")]
    public async Task<List<MyDropDownViewModel>> GetAttenderListByDepartmentIds(string departmentIds)
    {
        return await _attenderRepository.GetAttenderListByDepartmentIds(departmentIds);
    }


    [HttpPost]
    [Route("getnationalcode")]
    public async Task<bool> GetNationalCode([FromBody] CheckAttenderNationalCode model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _attenderRepository.GetNationalCode(model);
    }

    [HttpPost]
    [Route("getattendermsc")]
    public async Task<MyDropDownViewModel> GetAttenderMSC([FromBody] int id)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _attenderRepository.GetAttenderMsc(id, CompanyId);
    }

    [HttpPost]
    [Route("getadmissionattenderschedulefilteritems")]
    public GetColumnsViewModel GetAdmissionAttenderScheduleFilterParameters()
    {
        return _attenderRepository.GetAdmissionAttenderScheduleColumns();
    }

    [HttpPost]
    [Route("getadmissionattenderschedulepage")]
    public async Task<MyResultPage<List<AdmissionAttenderScheduleGetPage>>> GetAdmissionAttenderSchedulePage(
        [FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        return await _attenderRepository.GetAdmissionAttenderSchedulePage(model);
    }

    [HttpPost]
    [Route("getattenderadmissionlist")]
    public async Task<List<AttenderAdmissionDropDown>> GetAttenderAdmission(
        [FromBody] GetAttenderAdmissionDropDown model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _attenderRepository.GetAttenderAdmissionDropdown(model);
    }

    [HttpGet]
    [Route("getdropdownprescriptiontype")]
    public async Task<List<MyDropDownViewModel>> GetDropDownPrescriptionType()
    {
        return await _attenderRepository.GetDropDownPrescriptionType();
    }

    [HttpGet]
    [Route("getTemplateByAttender")]
    public async Task<List<MyDropDownViewModel>> GetDropDownAttenderByAcceptableParaclinic()
    {
        var companyId = UserClaims.GetCompanyId();
        return await _attenderRepository.GetDropDownAttenderByAcceptableParaclinic(companyId);
    }

    [HttpPost]
    [Route("getattender")]
    public async Task<AttenderViewModel> GetAttenderId(GetAttenderViewModel model)
    {
        return await _attenderRepository.GetAttenderId(model);
    }
}

[Route("MC")]
[Authorize]
public class AttenderController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return View(Views.MC.Attender);
    }

    [Route("[controller]/admissionattenderschedule")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult AdmissionAttenderSchedule()
    {
        return View(Views.MC.AdmissionAttenderSchedulePage);
    }
}