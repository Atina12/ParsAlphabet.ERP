using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.GN.LocCountry;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.LocCountry;

namespace ParseAlphabet.ERP.Web.Modules.GN.LocCountry;

[Route("api/GN/[controller]")]
[ApiController]
[Authorize]
public class LocCountryApiController : ControllerBase
{
    private readonly LocCountryRepository _LocCountryRepository;

    public LocCountryApiController(LocCountryRepository LocCountryRepository)
    {
        _LocCountryRepository = LocCountryRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<LocCountryGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _LocCountryRepository.GetPage(model);
    }

    //[HttpPost]
    //[Route("getrecordbyid")]
    //[Authenticate(Operation.VIW, "")]
    //public async Task<MyResultPage<LocCountryGetRecord>> GetRecordById([FromBody]int keyvalue)
    //{
    //    var result = new MyResultPage<LocCountryGetRecord>
    //    {
    //        Data = await _LocCountryRepository.GetRecordById<LocCountryGetRecord>(keyvalue, false, "gn"),
    //    };
    //    return result;
    //}
    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<LocCountryGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        return await _LocCountryRepository.GetRecordById(keyvalue);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _LocCountryRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] LocCountryModel model)
    {
        model.TableName = "gn.LocCountry";
        model.IsSecondLang = MyClaim.IsSecondLang;
        model.CompanyId = UserClaims.GetCompanyId();
        return await _LocCountryRepository.Insert(model, "pb", true);
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] LocCountryModel model)
    {
        model.TableName = "gn.LocCountry";
        model.IsSecondLang = MyClaim.IsSecondLang;
        model.CompanyId = UserClaims.GetCompanyId();
        return await _LocCountryRepository.Update(model, "pb", true);
    }


    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultStatus> Delete([FromBody] int keyvalue)
    {
        return await _LocCountryRepository.Delete(keyvalue);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        return await _LocCountryRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<List<MyDropDownViewModel>> GetDropDown()
    {
        return await _LocCountryRepository.GetDropDown();
    }
}

[Route("GN")]
[Authorize]
public class LocCountryController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.GN.LocCountry);
    }
}