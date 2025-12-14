using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FM.CostOfGoodsTemplateLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.CostOfGoodsTemplateLine;

namespace ParseAlphabet.ERP.Web.Modules.FM.CostOfGoodsTemplateLine;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class CostOfGoodsTemplateLineApiController : ControllerBase
{
    private readonly CostOfGoodsTemplateLineRepository _costOfGoodsTemplateLineRepository;

    public CostOfGoodsTemplateLineApiController(CostOfGoodsTemplateLineRepository costOfGoodsTemplateLineRepository)
    {
        _costOfGoodsTemplateLineRepository = costOfGoodsTemplateLineRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "CostOfGoodsTemplate")]
    public async Task<List<CostOfGoodsTemplateLineGetPage>> GetPage([FromBody] int headerId)
    {
        return await _costOfGoodsTemplateLineRepository.GetPage(headerId);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "CostOfGoodsTemplate")]
    public async Task<CostOfGoodsTemplateLineGetRecord> GetRecordById([FromBody] int id)
    {
        return await _costOfGoodsTemplateLineRepository.GetRecordById(id);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "CostOfGoodsTemplate")]
    public async Task<MyResultStatus> Insert([FromBody] CostOfGoodsTemplateLineModel model)
    {
        return await _costOfGoodsTemplateLineRepository.Insert(model);
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "CostOfGoodsTemplate")]
    public async Task<MyResultStatus> Update([FromBody] CostOfGoodsTemplateLineModel model)
    {
        return await _costOfGoodsTemplateLineRepository.Insert(model);
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "CostOfGoodsTemplate")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        return await _costOfGoodsTemplateLineRepository.Delete(keyvalue);
    }

    [HttpGet]
    [Route("getcostrelationdropdown/{isActive}/{itemtypeId?}")]
    public async Task<IEnumerable<CostRelationDropDown>> GetCostRelationDropDown(byte? isActive = 1,
        byte? itemtypeId = 0)
    {
        return await _costOfGoodsTemplateLineRepository.GetCostRelationDropDown(isActive, itemtypeId);
    }

    [HttpGet]
    [Route("getcostitemtypedropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetCostItemTypeDropDown()
    {
        return await _costOfGoodsTemplateLineRepository.GetCostItemTypeDropDown();
    }

    [HttpGet]
    [Route("getcostobjectdropdown/{itemtypeId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetCostObjectDropDown(byte itemtypeId)
    {
        return await _costOfGoodsTemplateLineRepository.GetCostObjectDropDown(itemtypeId);
    }

    [HttpPost]
    [Route("getallocatname")]
    public async Task<int> GetAllocatName([FromBody] CostobjectAllocateModel model)
    {
        return await _costOfGoodsTemplateLineRepository.GetAllocatName(model);
    }

    [HttpPost]
    [Route("getitemtypeidbycategoryid")]
    public async Task<int> GetItemTypeIdByCategoryId([FromBody] short categoryId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _costOfGoodsTemplateLineRepository.GetItemTypeIdByCategoryId(categoryId, companyId);
    }

    [HttpGet]
    [Route("getitemcategorydropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetitemCategoryDropDown()
    {
        return await _costOfGoodsTemplateLineRepository.GetitemCategoryDropDown();
    }
}

[Route("FM")]
[Authorize]
public class CostOfGoodsTemplateLineController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "CostOfGoodsTemplate")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.FM.CostOfGoodsTemplateLine);
    }
}