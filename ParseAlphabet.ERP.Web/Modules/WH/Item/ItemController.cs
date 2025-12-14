using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.WH.Item;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.Item;

namespace CIS.Controllers;

[Route("api/WH/[controller]")]
[ApiController]
[Authorize]
public class ItemApiController(ItemRepository ItemRepository) : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<ItemGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await ItemRepository.GetPage(model);
    }

    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    [HttpGet]
    public async Task<ActionResult> AdmissionCashReportExportCsv(string stringedModel)
    {
        var model = JsonConvert.DeserializeObject<NewGetPageViewModel>(stringedModel);
        model.CompanyId = UserClaims.GetCompanyId();
        var resultCsv = await ItemRepository.CSV(model);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "کالا/خدمات.csv" };
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<ItemGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        var companyId = UserClaims.GetCompanyId();
        return await ItemRepository.GetRecordByIds(keyvalue, companyId);
    }

    [HttpGet]
    [Route("getitemvat/{itemId}/{itemTypeId}")]
    public async Task<MyResultPage<ItemVatInfo>> GetItemVat(int itemId, int itemTypeId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await ItemRepository.GetItemVat(itemId, itemTypeId, companyId);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return ItemRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> Insert([FromBody] ItemViewModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await ItemRepository.InsertItem(model);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultStatus> Update([FromBody] ItemViewModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await ItemRepository.InsertItem(model);
        }

        return ModelState.ToMyResultStatus<int>();
    }


    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await ItemRepository.Delete(keyvalue, "wh", CompanyId);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<List<MyDropDownViewModel>> GetDropDown(string term = "")
    {
        var companyId = UserClaims.GetCompanyId();
        return await ItemRepository.GetDropDown(term, companyId);
    }

    [HttpGet]
    [Route("getdropdownwithitemtypeid/{itemtypeid}")]
    public async Task<List<MyDropDownViewModel>> GetDropDownWhitItemTypeId(int itemTypeId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await ItemRepository.GetDropDownWhitItemTypeId(itemTypeId, companyId);
    }

    [HttpGet]
    [Route("getdropdownitemwithitemtypeid/{itemtypeid}")]
    public async Task<List<MyDropDownViewModel>> GetDropDownItemWhitItemTypeId(string term, int itemTypeId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await ItemRepository.GetDropDownItemWhitItemTypeId(term, itemTypeId, companyId);
    }

    [HttpGet]
    [Route("getdropdownwithcategoryid/{categoryid}")]
    public async Task<List<MyDropDownViewModel>> GetDropDownWithCategoryId(string categoryId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await ItemRepository.GetDropDownWithCategoryId(categoryId, companyId);
    }

    [HttpGet]
    [Route("getalldatadropdown")]
    public async Task<List<MyDropDownViewModel>> GetAllDataDropDown(string term = "")
    {
        var companyId = UserClaims.GetCompanyId();
        return await ItemRepository.GetAllDataDropDown(term, companyId);
    }

    [HttpGet]
    [Route("itemsaledropdown")]
    public async Task<List<MyDropDownViewModel>> ItemSaleGetDropDown()
    {
        var companyId = UserClaims.GetCompanyId();
        return await ItemRepository.ItemSaleGetDropDown(companyId);
    }

    [HttpGet]
    [Route("getinfo/{id}")]
    public async Task<ItemInfo> GetCategory(int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await ItemRepository.GetCategory(id, companyId);
    }

    [HttpGet]
    [Route("getdropdownbytype/{type}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDownByItemType(byte type)
    {
        var companyId = UserClaims.GetCompanyId();
        return await ItemRepository.GetDropDown("wh", $"ItemTypeId={type} AND IsActive=1 AND CompanyId={companyId}");
    }

    [HttpPost]
    [Route("getItemCategoryId")]
    public async Task<int> GetItemCategoryId([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await ItemRepository.GetItemCategoryId(id, companyId);
    }
}

[Route("WH")]
[Authorize]
public class ItemController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.WH.Item);
    }
}