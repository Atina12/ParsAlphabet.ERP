using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WH.WBin;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.WBin;

namespace ParseAlphabet.ERP.Web.Modules.WH.WBin;

[Route("api/WH/[controller]")]
[ApiController]
[Authorize]
public class WBinApiController(BinRepository WBinRepository) : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<BinGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await WBinRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<BinGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        var result = new MyResultPage<BinGetRecord>
        {
            Data = await WBinRepository.GetRecordById<BinGetRecord>(keyvalue, false, "wh")
        };
        return result;
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return WBinRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] BinModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await WBinRepository.Insert(model, "wh");
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] BinModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await WBinRepository.Update(model, "wh");
        }

        return ModelState.ToMyResultQuery<int>();
    }


    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int id)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await WBinRepository.Delete(id, "wh", CompanyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await WBinRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown()
    {
        var companyId = UserClaims.GetCompanyId();
        return await WBinRepository.GetDropDown("wh", $" CompanyId = {companyId} ");
    }

    [HttpGet]
    [Route("getdropdownbywarehouse/{warehouseId}/{zoneId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDownByWarehouse(string warehouseId, string zoneId)
    {
        var filter = "";
        var companyId = UserClaims.GetCompanyId();
        if (zoneId != "null")
            filter = $" CompanyId = {companyId} AND WarehouseId in({warehouseId}) AND ZoneId in({zoneId}) ";
        else
            filter = $" CompanyId = {companyId} AND WarehouseId in({warehouseId})";

        var result = await WBinRepository.GetDropDown("wh", filter);
        return result;
    }

    [HttpGet]
    [Route("getdropdownbyitem/{warehouseId}/{itemtypeId}/{itemId}/{zoneId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(int warehouseId, int itemtypeId, int itemId,
        int zoneId)
    {
        var userId = UserClaims.GetUserId();
        ;
        var companyId = UserClaims.GetCompanyId();
        return await WBinRepository.GetDropDown(warehouseId, itemtypeId, itemId, zoneId, userId, companyId);
    }

    [HttpGet]
    [Route("checkExistBinByRankId/{binRankId}")]
    public async Task<int> CheckExistBinByRankId(string binRankId)
    {
        return await WBinRepository.CheckExistBinByRankId(binRankId);
    }
}

[Route("WH")]
[Authorize]
public class WBinController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.WH.Bin);
    }
}