using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WH.ItemCategory;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemCategory;

namespace ParseAlphabet.ERP.Web.Modules.WH.ItemCategory;

[Route("api/WH/[controller]")]
[ApiController]
[Authorize]
public class ItemCategoryApiController(
    ItemCategoryRepository ItemCategoryRepository,
    IHttpContextAccessor accessor)
    : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<ItemCategoryGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await ItemCategoryRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<ItemCategoryGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        var comapnyId = UserClaims.GetCompanyId();
        return await ItemCategoryRepository.GetRecordById(keyvalue, comapnyId);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return ItemCategoryRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] ItemCategoryModel model)
    {
        if (ModelState.IsValid)
        {
            MyClaim.Init(accessor);
            model.IsSecondLang = MyClaim.IsSecondLang;
            model.CompanyId = UserClaims.GetCompanyId();
            return await ItemCategoryRepository.Insert(model, "wh");
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] ItemCategoryModel model)
    {
        if (ModelState.IsValid)
        {
            MyClaim.Init(accessor);
            model.IsSecondLang = MyClaim.IsSecondLang;
            model.CompanyId = UserClaims.GetCompanyId();
            return await ItemCategoryRepository.Update(model, "wh");
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int id)
    {
        var CompanyId = UserClaims.GetCompanyId();
        var result = await ItemCategoryRepository.ValidationDelete(id);
        if (result.Successfull == false) return result;
        return await ItemCategoryRepository.Delete(id, "wh", CompanyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await ItemCategoryRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdownbytype/{type}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDownByItemType(byte type)
    {
        var companyId = UserClaims.GetCompanyId();

        var filter = "IsActive = 1 AND";

        if (type == 0)
            filter += $" CompanyId={companyId}";
        else
            filter += $" CompanyId={companyId} AND ItemTypeId={type}";


        return await ItemCategoryRepository.GetDropDown("wh", filter);
    }

    [HttpGet]
    [Route("getalldatadropdownbytype/{type}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetAllDataDropDownByItemType(string type)
    {
        var companyId = UserClaims.GetCompanyId();

        var filter = "";

        if (type == "0")
            filter += $" CompanyId={companyId}";
        else
            filter += $" CompanyId={companyId} AND ItemTypeId IN({type})";


        return await ItemCategoryRepository.GetDropDown("wh", filter);
    }


    [HttpGet]
    [Route("getcategorynamebyitemid/{itemid}")]
    public async Task<string> GetCategorynameByItemId(int itemId)
    {
        var companyId = UserClaims.GetCompanyId();

        return await ItemCategoryRepository.GetCategorynameByItemId(itemId, companyId);
    }


    [HttpGet]
    [Route("getcategorybyitemid/{id}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropCategorynameByItemId(int id)
    {
        var companyId = UserClaims.GetCompanyId();

        var filter = "IsActive = 1 AND";

        if (id == 0)
            filter += $" CompanyId={companyId}";
        else
            filter += $" CompanyId={companyId} AND Id={id}";


        return await ItemCategoryRepository.GetDropDown("wh", filter);
    }

    [HttpGet]
    [Route("getlistitemattribute")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetItemAttributeList()
    {
        return await ItemCategoryRepository.GetItemAttributeList();
    }

    [HttpGet]
    [Route("getitemcategoryattribute/{itemCategoryId}")]
    public async Task<bool> CheckAttribute(int itemCategoryId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await ItemCategoryRepository.ExistAttribute(itemCategoryId, companyId);
    }
}

[Route("WH")]
[Authorize]
public class ItemCategoryController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.WH.ItemCategory);
    }
}