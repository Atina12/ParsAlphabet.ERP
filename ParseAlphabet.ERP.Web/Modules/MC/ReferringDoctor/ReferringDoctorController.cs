using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.ReferringDoctor;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.ReferringDoctor;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Speciality;

namespace ParseAlphabet.ERP.Web.Modules.MC.ReferringDoctor;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class ReferringDoctorApiController : ControllerBase
{
    private readonly ReferringDoctorRepository _referringDoctorRepository;
    private readonly SpecialityRepository _specialityRepository;

    public ReferringDoctorApiController(ReferringDoctorRepository ReferringDoctorRepository,
        SpecialityRepository specialityRepository)
    {
        _specialityRepository = specialityRepository;
        _referringDoctorRepository = ReferringDoctorRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<ReferringDoctorGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        return await _referringDoctorRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<ReferringDoctorGetRecord>> GetRecordById([FromBody] short keyvalue)
    {
        var result = await _referringDoctorRepository.GetRecordById<ReferringDoctorGetRecord>(keyvalue, false, "mc");

        result.SpecialityName = await _specialityRepository.GetSpecialityName(result.SpecialityId);

        return new MyResultPage<ReferringDoctorGetRecord>
        {
            Data = result
        };
    }

    [HttpPost]
    [Route("getreferringdoctormsc")]
    public async Task<MyDropDownViewModel> GetMSC([FromBody] short keyvalue)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _referringDoctorRepository.GetReferringDoctorMsc(keyvalue, companyId);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _referringDoctorRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> Insert([FromBody] ReferringDoctorModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _referringDoctorRepository.Insert(model);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultStatus> Update([FromBody] ReferringDoctorModel model)
    {
        if (ModelState.IsValid)
            return await _referringDoctorRepository.Update(model);
        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] short keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _referringDoctorRepository.Delete(keyvalue, "mc", CompanyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _referringDoctorRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown/{isActive}")]
    public async Task<List<MyDropDownViewModel>> GetDropDown(string? term, byte? isActive = 1)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _referringDoctorRepository.GetDropDown(term, companyId, isActive);
    }
}

[Route("MC")]
[Authorize]
public class ReferringDoctorController : Controller
{
    private readonly ReferringDoctorRepository _ReferringDoctorRepository;

    public ReferringDoctorController(ReferringDoctorRepository ReferringDoctorRepository)
    {
        _ReferringDoctorRepository = ReferringDoctorRepository;
    }

    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return View(Views.MC.ReferringDoctor);
    }
}