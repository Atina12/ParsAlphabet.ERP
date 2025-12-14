using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Interfaces.WH;

namespace ParseAlphabet.ERP.Web.Modules.WH;

[Route("api/[controller]")]
[ApiController]
public class WHApiController : ControllerBase
{
    private readonly IWHRepository _WHRepository;

    public WHApiController(IWHRepository WHRepository)
    {
        _WHRepository = WHRepository;
    }

    [HttpGet]
    [Route("costingMethod_getdropdown")]
    public async Task<List<MyDropDownViewModel>> CostingMethod_GetDropDown()
    {
        return await _WHRepository.CostingMethod_GetDropDown();
    }

    [HttpGet]
    [Route("binCategory_getdropdown")]
    public async Task<List<MyDropDownViewModel>> BinCategory_GetDropDown()
    {
        return await _WHRepository.BinCategory_GetDropDown();
    }

    [HttpGet]
    [Route("itemtype_getdropdown/{itemTypes?}")]
    public async Task<List<MyDropDownViewModel>> ItemType_GetDropDown(string itemTypes)
    {
        return await _WHRepository.ItemTypeByType_GetDropDown(itemTypes);
    }

    [HttpGet]
    [Route("itemTypeIsItem_getDropDown")]
    public async Task<List<MyDropDownViewModel>> ItemTypeIsItem_GetDropDown()
    {
        return await _WHRepository.ItemTypeIsItem_GetDropDown();
    }

    [HttpGet]
    [Route("itemTypedropdown")]
    public async Task<List<MyDropDownViewModel>> ItemTypeDropDown()
    {
        return await _WHRepository.ItemType_GetDropDown();
    }

    [HttpGet]
    [Route("itemTypeSalesPrice_getDropDown")]
    public async Task<List<MyDropDownViewModel>> ItemTypeSalesPrice_GetDropDown()
    {
        return await _WHRepository.ItemTypeSalesPrice_GetDropDown();
    }
}