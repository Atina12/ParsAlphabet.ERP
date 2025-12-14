using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WH.ItemAttribute;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemAttribute;
using Enum = ParsAlphabet.ERP.Application.Enums.Enum;

namespace ParseAlphabet.ERP.Web.Modules.WH.ItemAttribute;

[Route("api/WH/[controller]")]
[ApiController]
[Authorize]
public class ItemAttributeApiController(ItemAttributeRepository itemAttributeRepository) : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<ItemAttributeGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        return await itemAttributeRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<ItemAttributeGetRecorde>> GetRecordById([FromBody] int keyvalue)
    {
        var result = new MyResultPage<ItemAttributeGetRecorde>
        {
            Data = await itemAttributeRepository.GetRecordById<ItemAttributeGetRecorde>(keyvalue, false, "wh")
        };
        return result;
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return itemAttributeRepository.GetColumns();
    }


    [HttpGet]
    [Route("getdropdown_attributetype")]
    public List<MyDropDownViewModel> AttributeTypeGetDropDown()
    {
        var AttributeTypes = System.Enum.GetValues(typeof(Enum.AttributeType)).Cast<Enum.AttributeType>();
        var result = AttributeTypes.Select(a => new MyDropDownViewModel
            { Id = Convert.ToByte(a), Name = a.AttributeTypeDisplayName() }).ToList();
        return result;
    }

    [HttpGet]
    [Route("attributeitem_getdropdown/{itemCategoryIds}")]
    public async Task<List<MyDropDownViewModel2>> AttributeItem_GetDropDown(string itemCategoryIds)
    {
        var companyId = UserClaims.GetCompanyId();
        return await itemAttributeRepository.AttributeItem_GetDropDown(itemCategoryIds, companyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await itemAttributeRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown_sex")]
    public List<MyDropDownViewModel2> SexGetDropDown()
    {
        var Sexs = System.Enum.GetValues(typeof(Enum.Sex)).Cast<Enum.Sex>();
        var result = Sexs.Select(a => new MyDropDownViewModel2 { Id = a.SexDisplayName(), Name = a.SexDisplayName() })
            .ToList();
        return result;
    }

    [HttpPost]
    [Route("getrecordbyid_itemattributeline")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<ItemAttributeGetRecord>> GetRecordByIdItemAttributeLine([FromBody] int keyvalue)
    {
        var companyId = UserClaims.GetCompanyId();
        return await itemAttributeRepository.GetRecordByIdItemAttributeLine(keyvalue, companyId);
    }

    [HttpPost]
    [Route("getrecorditemattributeline")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ItemAttributeLineGetRecord> GetRecordItemAttributeLine([FromBody] int keyvalue)
    {
        return await itemAttributeRepository.GetRecordItemAttributeLine(keyvalue);
    }


    [HttpPost]
    [Route("insertitemattributeline")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> InsertItemAttributeLine([FromBody] ItemAttributeLineModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var result = await itemAttributeRepository.ItemAttributeLineSave(model);
        return result;
    }

    [HttpPost]
    [Route("updateitemattributeline")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultStatus> UpdateItemSubUnit([FromBody] ItemAttributeLineModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var result = await itemAttributeRepository.ItemAttributeLineUpdate(model);
        return result;
    }

    [HttpPost]
    [Route("deleteitemattributeline")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultStatus> DeleteItemSubUnit([FromBody] int keyvalue)
    {
        var result = await itemAttributeRepository.ItemAttributeLineDelete(keyvalue);
        return result;
    }
}

[Route("WH")]
[Authorize]
public class ItemAttributeController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.WH.ItemAttribute);
    }
}