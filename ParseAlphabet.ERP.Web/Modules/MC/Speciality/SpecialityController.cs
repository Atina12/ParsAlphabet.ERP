using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.Speciality;
using ParsAlphabet.ERP.Application.Interfaces.MC;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Speciality;

namespace ParseAlphabet.ERP.Web.Modules.MC.Speciality;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class SpecialityApiController(
    SpecialityRepository SpecialityRepository,
    IAdmissionsRepository admissionsRepository)
    : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<SpecialityGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        return await SpecialityRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<SpecialityGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        var result = new MyResultPage<SpecialityGetRecord>
        {
            Data = await SpecialityRepository.GetRecordById<SpecialityGetRecord>(keyvalue, false, "mc")
        };

        result.Data.TerminologyName = await admissionsRepository.GetThrSpecialityName(result.Data.TerminologyId);

        return result;
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return SpecialityRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] SpecialityModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();

            return await SpecialityRepository.Insert(model, "mc");
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] SpecialityModel model)
    {
        if (ModelState.IsValid)
            return await SpecialityRepository.Update(model, "mc");
        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await SpecialityRepository.Delete(keyvalue, "mc", CompanyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await SpecialityRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown/{isActive?}")]
    public async Task<List<MyDropDownViewModel>> GetDropDown(string? term, byte? isActive)
    {
        var companyId = UserClaims.GetCompanyId();
        return await SpecialityRepository.GetDropDown(term, isActive, companyId);
    }

    [HttpPost]
    [Route("checkterminologyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<bool> CheckTerminologyId([FromBody] CheckExistSpeciality model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await SpecialityRepository.CheckTerminologyId(model);
    }


    //[HttpPost]
    //[Route("getservicename")]
    //public async Task<string> GetServiceName([FromBody]int id)
    //{
    //    return await _ServiceRepository.GetServiceName(id);
    //}
}

[Route("MC")]
[Authorize]
public class SpecialityController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.MC.Speciality);
    }
}