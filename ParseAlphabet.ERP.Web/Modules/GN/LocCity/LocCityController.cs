using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.GN.LocCity;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.LocCity;

namespace ParseAlphabet.ERP.Web.Modules.GN.LocCity;

[Route("api/GN/[controller]")]
[ApiController]
[Authorize]
public class LocCityApiController : ControllerBase
{
    private readonly LocCityRepository _locCityRepository;

    public LocCityApiController(LocCityRepository LocCityRepository)
    {
        _locCityRepository = LocCityRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<LocCityGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _locCityRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<LocCityGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        return new MyResultPage<LocCityGetRecord>
        {
            Data = await _locCityRepository.GetRecordById<LocCityGetRecord>(keyvalue, false, "gn")
        };
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _locCityRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] LocCityModel model)
    {
        if (ModelState.IsValid)
            return await _locCityRepository.Insert(model, "gn");
        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] LocCityModel model)
    {
        if (ModelState.IsValid)
            return await _locCityRepository.Update(model, "gn");
        return ModelState.ToMyResultQuery<int>();
    }


    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _locCityRepository.Delete(keyvalue, "gn", companyId);
    }


    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    [HttpGet]
    public async Task<ActionResult> Csv(string stringedModel)
    {
        var model = JsonConvert.DeserializeObject<NewGetPageViewModel>(stringedModel);
        model.CompanyId = UserClaims.GetCompanyId();
        var resultCsv = await _locCityRepository.CSV(model);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "شهر.csv" };
    }

    [HttpGet]
    [Route("getdropdown/{stateId}")]
    public async Task<List<MyDropDownViewModel>> GetDropDown(short stateId)
    {
        return await _locCityRepository.GetDropDown(stateId);
    }
}

[Route("GN")]
[Authorize]
public class LocCityController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.GN.LocCity);
    }
}