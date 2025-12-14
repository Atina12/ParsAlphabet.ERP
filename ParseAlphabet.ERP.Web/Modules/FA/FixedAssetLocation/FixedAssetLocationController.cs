using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FA.FixedAssetLocation;
using ParsAlphabet.ERP.Infrastructure.Implantation.FA.FixedAssetLocation;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.LocCity;

namespace ParseAlphabet.ERP.Web.Modules.FA.FixedAssetLocation;

[Route("api/FA/[controller]")]
[ApiController]
[Authorize]
public class FixedAssetLocationApiController : ControllerBase
{
    private readonly FixedAssetLocationRepository _FixedAssetLocationRepository;
    private readonly LocCityRepository _LocCityRepository;

    public FixedAssetLocationApiController(FixedAssetLocationRepository FixedAssetLocationRepository,
        LocCityRepository LocCityRepository)
    {
        _FixedAssetLocationRepository = FixedAssetLocationRepository;
        _LocCityRepository = LocCityRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<FixedAssetLocationGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _FixedAssetLocationRepository.GetPage(model);
    }

    //[HttpPost]
    //[Route("getrecordbyid")]
    //[Authenticate(Operation.VIW, "")]
    //public async Task<MyResultPage<FixedAssetLocationGetRecord>> GetRecordById([FromBody]int keyvalue)
    //{
    //    return new MyResultPage<FixedAssetLocationGetRecord>
    //    {
    //        Data = await _FixedAssetLocationRepository.GetRecordById<FixedAssetLocationGetRecord>(keyvalue, false, "fa"),
    //    };
    //}

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<FixedAssetLocationGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        var result = new MyResultPage<FixedAssetLocationGetRecord>
        {
            Data = await _FixedAssetLocationRepository.GetRecordById<FixedAssetLocationGetRecord>(keyvalue, false, "fa")
        };

        return result;
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _FixedAssetLocationRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] FixedAssetLocationModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        if (ModelState.IsValid)
            return await _FixedAssetLocationRepository.Insert(model, "fa");
        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] FixedAssetLocationModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _FixedAssetLocationRepository.Update(model, "fa");
        }

        return ModelState.ToMyResultQuery<int>();
    }


    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _FixedAssetLocationRepository.Delete(id, "fa", companyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _FixedAssetLocationRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown()
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _FixedAssetLocationRepository.GetDropDown("fa", $"IsActive = {1} AND companyId={CompanyId}");
    }
}

[Route("FA")]
[Authorize]
public class FixedAssetLocationController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.FA.FixedAssetLocation);
    }
}