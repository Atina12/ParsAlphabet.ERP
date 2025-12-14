using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WH.Zone;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.Zone;

namespace ParseAlphabet.ERP.Web.Modules.WH.Zone;

[Route("api/WH/[controller]")]
[ApiController]
[Authorize]
public class ZoneApiController(ZoneRepository zoneRepository) : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<ZoneGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await zoneRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<ZoneGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        var result = new MyResultPage<ZoneGetRecord>
        {
            Data = await zoneRepository.GetRecordById<ZoneGetRecord>(keyvalue, false, "wh")
        };
        return result;
    }

    [HttpGet]
    [Route("checkExistZoneByRankId/{zoneRankId}")]
    public async Task<int> CheckExistZoneByRankId(string zoneRankId)
    {
        return await zoneRepository.CheckExistZoneByRankId(zoneRankId);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return zoneRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] ZoneModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await zoneRepository.Insert(model, "wh");
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] ZoneModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await zoneRepository.Update(model, "wh");
        }

        return ModelState.ToMyResultQuery<int>();
    }


    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int id)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await zoneRepository.Delete(id, "wh", CompanyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await zoneRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown()
    {
        var companyId = UserClaims.GetCompanyId();
        return await zoneRepository.GetDropDown("wh", $"IsActive = {1} AND CompanyId = {companyId} ");
    }


    [HttpGet]
    [Route("getdropdownbywarehouse/{warehouseId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(string warehouseId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await zoneRepository.GetDropDown("wh",
            $"IsActive = {1} AND CompanyId = {companyId} AND WarehouseId in ({warehouseId})");
    }

    [HttpGet]
    [Route("getdropdownbyitem/{warehouseId}/{itemtypeId}/{itemId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(int warehouseId, int itemtypeId, int itemId)
    {
        var userId = UserClaims.GetUserId();
        ;
        var companyId = UserClaims.GetCompanyId();
        return await zoneRepository.GetDropDown(warehouseId, itemtypeId, itemId, userId, companyId);
    }

    [HttpGet]
    [Route("getalldatadropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetAllDataDropDown()
    {
        var companyId = UserClaims.GetCompanyId();
        return await zoneRepository.GetDropDown("wh", $"CompanyId = {companyId} ");
    }
}

[Route("WH")]
[Authorize]
public class ZoneController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.WH.Zone);
    }
}