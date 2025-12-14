using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WH.ItemCategoryAttribute;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemCategoryAttribute;

namespace ParseAlphabet.ERP.Web.Modules.WH.ItemCategoryAttribute;

[Route("api/WH/[controller]")]
[ApiController]
[Authorize]
public class ItemCategoryAttributeApiController(
    ItemCategoryAttributeRepository itemCategoryAttributeRepository,
    IHttpContextAccessor accessor)
    : ControllerBase
{
    private readonly IHttpContextAccessor _accessor = accessor;

    [HttpPost]
    [Route("getlist_baseitemattribute")]
    public async Task<IEnumerable<object>> GetListBaseItemAttribute([FromBody] string itemCategoryIds)
    {
        var companyId = UserClaims.GetCompanyId();
        return await itemCategoryAttributeRepository.GetListBaseItemAttribute(itemCategoryIds, companyId);
    }

    [HttpPost]
    [Route("getlist_itemattributeline")]
    public async Task<MyResultPage<List<ItemAttributeList>>> GetListItemAttributeLine([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await itemCategoryAttributeRepository.GetListItemAttributeLine(id, companyId);
    }


    [HttpPost]
    [Route("insert_itemattributeline")]
    [Authenticate(Operation.INS, "ItemCategory")]
    public async Task<MyResultQuery> InsertItemCategoryAttributeLine([FromBody] ItemCategoryAttributeAssign model)
    {
        var CreateUserId = UserClaims.GetUserId();
        ;
        return await itemCategoryAttributeRepository.ItemCategoryAttributeLineSave(model, CreateUserId);
    }

    [HttpPost]
    [Route("delete_itemattributeline")]
    [Authenticate(Operation.DEL, "ItemCategory")]
    public async Task<MyResultQuery> DeleteItemCategoryAttributeLine([FromBody] ItemCategoryAttributeAssign model)
    {
        var CreateUserId = UserClaims.GetUserId();
        ;
        return await itemCategoryAttributeRepository.ItemCategoryAttributeLineDelete(model, CreateUserId);
    }
}

[Route("WH")]
[Authorize]
public class ItemCategoryAttributeController : Controller
{
    [Route("[controller]/{id}")]
    [Authenticate(Operation.VIW, "ItemCategory")]
    [HttpGet]
    public ActionResult Index(int id)
    {
        return PartialView(Views.WH.ItemCategoryAttribute);
    }
}