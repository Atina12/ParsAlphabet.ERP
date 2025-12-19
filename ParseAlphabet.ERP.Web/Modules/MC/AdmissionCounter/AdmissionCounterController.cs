using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionCounter;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionCounter;

namespace ParseAlphabet.ERP.Web.Modules.MC.AdmissionCounter;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class AdmissionCounterApiController : ControllerBase
{
    private readonly IAdmissionCounterRepository _admissionCounterRepository;


    public AdmissionCounterApiController(IAdmissionCounterRepository admissionCashierRepository,
        IHttpContextAccessor accessor)
    {
        _admissionCounterRepository = admissionCashierRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<AdmissionCounterGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _admissionCounterRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<AdmissionCounterGetRecord>> GetRecordById([FromBody] short keyvalue)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _admissionCounterRepository.GetRecordById(keyvalue, companyId);
    }

    [HttpPost]
    [Route("getrecordbyuserid")]
    public async Task<MyResultPage<AdmissionCounterGetRecord>> GetRecordByUserId()
    {
        var companyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;
        return await _admissionCounterRepository.GetRecordByUserId(userId, companyId);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _admissionCounterRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] AdmissionCounterModel model)
    {
        if (ModelState.IsValid)
        {
            var companyId = UserClaims.GetCompanyId();

            model.CompanyId = companyId;

            return await _admissionCounterRepository.Insert(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] AdmissionCounterModel model)
    {
        if (ModelState.IsValid)
            return await _admissionCounterRepository.Update(model);
        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _admissionCounterRepository.Delete(keyvalue, companyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _admissionCounterRepository.Csv(model);
    }

    [HttpPost]
    [Route("cashierexist")]
    public async Task<bool> CheckExistCashier([FromBody] MyDropDownViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var exist = await _admissionCounterRepository.CheckExistCashier(model);
        return exist;
    }


    [HttpPost]
    [Route("counteruserexist")]
    public async Task<bool> CounterUserExist([FromBody] MyDropDownViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var exist = await _admissionCounterRepository.CheckExistCounterUser(model);
        return exist;
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown()
    {
        var companyId = UserClaims.GetCompanyId();
        var result = await _admissionCounterRepository.GetDropDown(companyId);

        return result;
    }

    [HttpGet]
    [Route("admissioncounterposdropdown")]
    public async Task<IEnumerable<AdmissionCounterPosDropDown>> AdmissionCounterPosGetDropDown()
    {
        var userId = UserClaims.GetUserId();
        var result = await _admissionCounterRepository.AdmissionCounterPosGetDropDown(userId);

        return result;
    }
}

[Route("MC")]
[Authorize]
public class AdmissionCounterController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.MC.AdmissionCounter);
    }
}