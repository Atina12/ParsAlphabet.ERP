using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WH.ItemUnit;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemUnit;

namespace ParseAlphabet.ERP.Web.Modules.WH.ItemUnit;

[Route("api/WH/[controller]")]
[ApiController]
[Authorize]
public class ItemUnitApiController(ItemUnitRepository itemUnitRepository) : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<ItemUnitGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await itemUnitRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<ItemUnitModel>> GetRecordById([FromBody] int keyvalue)
    {
        var result = new MyResultPage<ItemUnitModel>
        {
            Data = await itemUnitRepository.GetRecordById<ItemUnitModel>(keyvalue, false, "wh")
        };
        return result;
    }


    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return itemUnitRepository.GetColumns();
    }


    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> Insert([FromBody] ItemUnitModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await itemUnitRepository.Insert(model);
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultStatus> Update([FromBody] ItemUnitModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await itemUnitRepository.Update(model);
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultStatus> Delete([FromBody] int id)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await itemUnitRepository.Delete(id, CompanyId);
    }

    [HttpGet]
    [Route("getrecordbyid_itemsubunit/{keyvalue}/{itemId?}")]
    public async Task<MyResultPage<ItemUnitGetRecord>> GetRecordByIdItemSubUnit(int keyvalue, int itemId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await itemUnitRepository.GetRecordByIdItemSubUnit(keyvalue, itemId, companyId);
    }

    [HttpGet]
    [Route("subunitgetrecord/{id}/{unitId}/{ratio}")]
    public async Task<ItemSubUnitGetRecord> SubUnitGetRecord(int id, int unitId, decimal ratio)
    {
        var companyId = UserClaims.GetCompanyId();
        return await itemUnitRepository.GetRecordItemSubUnitById(id, unitId, ratio);
    }


    [HttpPost]
    [Route("insertsubitem")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> InsertItemSubUnit([FromBody] ItemSubUnitModel model)
    {
        var result = await itemUnitRepository.ItemSubUnitSave(model);
        return result;
    }

    [HttpPost]
    [Route("updatesubitem")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultStatus> UpdateItemSubUnit([FromBody] ItemSubUnitModel model)
    {
        var result = await itemUnitRepository.ItemSubUnitUpdate(model);
        return result;
    }

    [HttpPost]
    [Route("deletesubitem")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultStatus> DeleteItemSubUnit([FromBody] ItemSubUnitModel model)
    {
        var result = await itemUnitRepository.ItemSubUnitDelete(model);
        return result;
    }


    [HttpGet]
    [Route("unititem_getdropdown/{unitId}/{itemId}")]
    public async Task<List<MyDropDownViewModel2>> UnitItem_GetDropDown(string unitId, int itemId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await itemUnitRepository.UnitItem_GetDropDown(unitId, itemId, companyId);
    }

    [HttpGet]
    [Route("getratio/{subUnitId}")]
    public async Task<ItemUnitDetailInfo> GetRatio(int subUnitId)
    {
        return await itemUnitRepository.GetRatio(subUnitId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await itemUnitRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown()
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await itemUnitRepository.GetDropDown("wh", $"CompanyId={CompanyId} AND IsActive = 1");
    }


    [HttpGet]
    [Route("subunitgetdropdown/{unitId}")]
    public async Task<List<MyDropDownViewModel>> SubUnitGetDropDown(string unitId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await itemUnitRepository.SubUnitGetDropDown(unitId, companyId);
    }

    [HttpGet]
    [Route("unitgetdropdown")]
    public async Task<List<MyDropDownViewModel>> UnitGetDropDown()
    {
        var companyId = UserClaims.GetCompanyId();
        return await itemUnitRepository.UnitGetDropDown(companyId);
    }
}

[Route("WH")]
[Authorize]
public class ItemUnitController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.WH.ItemUnit);
    }
}