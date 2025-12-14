using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.SM.CustomerSalesPrice;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM.CustomerSalesPrice;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.Item;

namespace ParseAlphabet.ERP.Web.Modules.SM.CustomerSalesPrice;

[Route("api/SM/[controller]")]
[ApiController]
[Authorize]
public class CustomerSalesPriceApiController(
    ItemRepository itemRepository,
    CustomerSalesPriceRepository CustomerSalesPriceRepository)
    : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<CustomerSalesPriceGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await CustomerSalesPriceRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<CustomerSalesPriceGetRecord>> GetRecordById([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await CustomerSalesPriceRepository.GetRecordById(id, companyId);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return CustomerSalesPriceRepository.GetColumns();
    }

    [HttpPost]
    [Route("save")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] CustomerSalesPriceModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await CustomerSalesPriceRepository.Save(model);
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await CustomerSalesPriceRepository.Delete($"Id={id} AND CompanyId={companyId}", "sm");
    }


    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await CustomerSalesPriceRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown()
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await CustomerSalesPriceRepository.GetDropDown("sm", $"IsActive = {1} AND CompanyId={CompanyId}");
    }

    [HttpPost]
    [Route("getitemId")]
    public async Task<bool> GetItemId([FromBody] GetCustomerSalesPriceItemId model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await CustomerSalesPriceRepository.ExistItemId(model);
    }

    [HttpGet]
    [Route("getitemsale/{type}")]
    public async Task<List<MyDropDownViewModel>> GetItemSaleList(byte type)
    {
        var companyId = UserClaims.GetCompanyId();
        return await CustomerSalesPriceRepository.ItemSaleList(type, companyId);
    }

    [HttpGet]
    [Route("customergroupbysalesPrice/{itemId}")]
    [Authenticate(Operation.VIW, "")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetCustomerGroupSalesPrice_DropDown(int itemId)
    {
        var companyId = UserClaims.GetCompanyId();
        var itemTypeId = await itemRepository.GetItemType(itemId, companyId);

        var customerSalesPriceId = await CustomerSalesPriceRepository.GetId(itemId, itemTypeId, companyId);

        return await CustomerSalesPriceRepository.GetCustomerGroupBySalesPriceId(customerSalesPriceId, companyId);
    }

    [HttpPost]
    [Route("getpricingmodel")]
    public async Task<byte> GetPricingModel([FromBody] int itemId)
    {
        var companyId = UserClaims.GetCompanyId();
        var itemTypeId = await itemRepository.GetItemType(itemId, companyId);
        return await CustomerSalesPriceRepository.GetPricingModelId(itemId, itemTypeId, companyId);
    }
}

[Route("SM")]
[Authorize]
public class CustomerSalesPriceController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.SM.CustomerSalesPrice);
    }
}