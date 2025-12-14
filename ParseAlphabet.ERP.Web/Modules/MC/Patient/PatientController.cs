using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos._History;
using ParsAlphabet.ERP.Application.Dtos.MC.Patient;
using ParsAlphabet.ERP.Application.Interfaces._ErrorLog;
using ParsAlphabet.ERP.Application.Interfaces._Setup;
using ParsAlphabet.ERP.Infrastructure.Implantation._History;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.AccountDetail;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Patient;
using ParsAlphabet.WebService.Api.Model.CIS;
using static ParsAlphabet.ERP.Infrastructure.Implantation.WebServices.CIS.WebServiceViewModel;

namespace ParseAlphabet.ERP.Web.Modules.MC.Patient;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class PatientApiController : ControllerBase
{
    private readonly IHttpContextAccessor _accessor;
    private readonly AccountDetailRepository _accountDetailRepository;
    private readonly IConfiguration _configuration;
    private readonly IErrorLogRepository _errorLogRepository;
    private readonly HistoryRepository _history;
    private readonly PatientRepository _PatientRepository;
    private readonly ISetupRepository _setupRepository;

    public PatientApiController(PatientRepository PatientRepository,
        IErrorLogRepository errorLogRepository,
        IHttpContextAccessor accessor,
        HistoryRepository history,
        IConfiguration configuration,
        ISetupRepository setupRepository,
        AccountDetailRepository AccountDetailRepository)
    {
        _PatientRepository = PatientRepository;
        _setupRepository = setupRepository;
        _errorLogRepository = errorLogRepository;
        _accessor = accessor;
        _history = history;
        _configuration = configuration;
        _accountDetailRepository = AccountDetailRepository;
    }

    [HttpPost]
    [Route("getpersonbybirth")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultDataStatus<GetPatient_Result>> GetPersonByBirth([FromBody] GetPersonByBirth birth)
    {
        if (!ModelState.IsValid)
        {
            var res = new MyResultDataStatus<GetPatient_Result>
            {
                Data = new GetPatient_Result()
            };

            res.Successfull = false;
            res.Status = -100;
            res.StatusMessage = "سال تولد و نمبر تذکره اجبار می باشد";
        }
        //var keyA3 = new WCF_SEPAS(_errorLogRepository, _accessor, _configuration, _setupRepository);

        //var result = await keyA3.GetPersonByBirth(birth);

        //return result;
        throw new Exception();
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<PatientGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        return await _PatientRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<PatientGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _PatientRepository.GetRecordById(keyvalue, CompanyId);
    }

    [HttpPost]
    [Route("getrecordbynationalcode")]
    public async Task<PatientGetRecord> GetRecordByNationalCode([FromBody] GetPatientNationalCode model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _PatientRepository.GetRecordByNationalCode(model);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _PatientRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] PatientModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();

            model.FirstName = model.FirstName.ConvertArabicAlphabet();
            model.LastName = model.LastName.ConvertArabicAlphabet();
            model.FatherFirstName = model.FatherFirstName.ConvertArabicAlphabet();

            #region ویرایش تفضیل :accountDetailPatientList

            var FullName = model.FirstName + " " + model.LastName;
            var accountDetailViewModel = new
            {
                IdNumber = model.IdCardNumber,
                JobTitle = model.JobTitle != "" || model.JobTitle != null ? model.JobTitle : "",
                NationalCode = model.NationalCode ?? "",
                FullName = FullName
            };
            model.JsonAccountDetailList = JsonConvert.SerializeObject(accountDetailViewModel);

            #endregion

            #region History

            var userId = UserClaims.GetUserId();
            ;

            MyClaim.Init(_accessor);
            var ipAdrress = MyClaim.IpAddress;

            var userAgent = new UserAgent(Request.Headers["User-Agent"]);
            var historyModel = new HistoryModel
            {
                ControllerName = nameof(PatientApiController),
                ActionName = nameof(Insert),
                Browser = userAgent.Browser.NameAndVersion,
                CompanyId = model.CompanyId,
                Description =
                    $"UserId:{userId}_PatientId:{model.Id}_PatientFullName:${model.FirstName + " " + model.LastName}_NationalCode:${model.NationalCode}",
                UserId = userId,
                IpAddress = ipAdrress,
                OperatingSystem = userAgent.OS.NameAndVersion
            };
            var resultHistory = await _history.Insert(historyModel);

            #endregion

            return await _PatientRepository.Insert(model, "mc");
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] PatientModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();

            model.FirstName = model.FirstName.ConvertArabicAlphabet();
            model.LastName = model.LastName.ConvertArabicAlphabet();
            model.FatherFirstName = model.FatherFirstName.ConvertArabicAlphabet();

            #region ویرایش تفضیل :accountDetailPatientList

            var FullName = model.FirstName + " " + model.LastName;
            var accountDetailViewModel = new
            {
                IdNumber = model.IdCardNumber,
                JobTitle = model.JobTitle != "" || model.JobTitle != null ? model.JobTitle : "",
                NationalCode = model.NationalCode != null ? model.NationalCode : "",
                FullName = FullName != "" || FullName != null ? FullName : ""
            };
            model.JsonAccountDetailList = JsonConvert.SerializeObject(accountDetailViewModel);

            #endregion

            #region History

            var userId = UserClaims.GetUserId();
            ;

            MyClaim.Init(_accessor);
            var ipAdrress = MyClaim.IpAddress;

            var userAgent = new UserAgent(Request.Headers["User-Agent"]);
            var historyModel = new HistoryModel
            {
                ControllerName = nameof(PatientApiController),
                ActionName = nameof(Insert),
                Browser = userAgent.Browser.NameAndVersion,
                CompanyId = model.CompanyId,
                Description =
                    $"UserId:{userId}_PatientId:{model.Id}_PatientFullName:${model.FirstName + " " + model.LastName}_NationalCode:${model.NationalCode}",
                UserId = userId,
                IpAddress = ipAdrress,
                OperatingSystem = userAgent.OS.NameAndVersion
            };
            var resultHistory = await _history.Insert(historyModel);

            #endregion

            return await _PatientRepository.Update(model, "mc");
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _PatientRepository.Delete(keyvalue, "mc", CompanyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _PatientRepository.Csv(model);
    }

    [Route("patientsearchservice")]
    [HttpPost]
    [Authenticate(Operation.VIW, "")]
    public async Task<List<PatientSearchService>> SearchPatientAdmissionService(
        [FromBody] GetPatientSearchService model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var result = await _PatientRepository.SearchPatientService(model);
        return result;
    }

    [Route("patientsearchinsurer/{patientId}")]
    [HttpGet]
    public async Task<IEnumerable<PatientSearchService>> SearchPatientInsurer(int patientId)
    {
        var companyId = UserClaims.GetCompanyId();
        var result = await _PatientRepository.SearchPatientInsurer(patientId, companyId);
        return result;
    }

    [Route("patientsearchsale")]
    [HttpPost]
    [Authenticate(Operation.VIW, "")]
    public async Task<List<PatientSearchSale>> SearchPatientAdmissionSale([FromBody] GetPatientSearch model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var result = await _PatientRepository.SearchPatientSale(model);
        return result;
    }

    [HttpGet]
    [Route("getdropdown/{isActive?}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(string? term, byte? isActive = 1)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _PatientRepository.GetDropDown(term, companyId, isActive);
    }

    [HttpGet]
    [Route("filter/{type?}")]
    public async Task<IEnumerable<MyDropDownViewModel>> FilterPatient(string? term, byte? type = 1)
    {
        return await _PatientRepository.PatientFilter(term, type);
    }

    [HttpGet]
    [Route("getdropdownwithnationalcode")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDownWithNationalCode(string? term)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _PatientRepository.GetDropDownWithNationalCode(term, companyId);
    }

    [HttpPost]
    [Route("getnationalcode")]
    public async Task<bool> GetNationalCode([FromBody] GetPatientNationalCode model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _PatientRepository.ExistNationalCode(model);
    }
}

[Route("MC")]
[Authorize]
public class PatientController : Controller
{
    [Route("[Controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.MC.Patient);
    }
}