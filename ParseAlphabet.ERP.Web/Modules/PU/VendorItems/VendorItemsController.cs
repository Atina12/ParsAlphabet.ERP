using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.PU.VendorItems;
using ParsAlphabet.ERP.Infrastructure.Implantation.PU.VendorItems;

namespace ParseAlphabet.ERP.Web.Modules.PU.VendorItems;

[Route("api/PU/[controller]")]
[ApiController]
[Authorize]
public class VendorItemsApiController(VendorItemsRepository VendorItemsRepository) : ControllerBase
{
    [HttpPost]
    [Route("getfilteritemsdiassign")]
    public GetColumnsViewModel GetFilterParametersDiAssign()
    {
        return VendorItemsRepository.GetColumnsDiAssign();
    }

    [HttpPost]
    [Route("getfilteritemsassign")]
    public GetColumnsViewModel GetFilterParametersAssign()
    {
        return VendorItemsRepository.GetColumnsAssign();
    }

    [HttpPost]
    [Route("getPageDiAssign")]
    [Authenticate("VIW", "")]
    public async Task<MyResultPage<VendorItemAssignList>> GetPageDiAssign([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await VendorItemsRepository.GetPageDiAssigns(model);
    }

    [HttpPost]
    [Route("getPageAssign")]
    [Authenticate("VIW", "")]
    public async Task<MyResultPage<VendorItemAssignList>> GetPageAssign([FromBody] GetPageViewModel pageViewModel)
    {
        pageViewModel.CompanyId = UserClaims.GetCompanyId();
        return await VendorItemsRepository.GetPageAssign(pageViewModel);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate("VIW", "")]
    public async Task<MyResultPage<VendorItemsGetRecord>> GetRecordBy_VendorItems([FromBody] Get_VendorItems model)
    {
        return await VendorItemsRepository.GetRecordById(model.VendorId, model.ItemId);
    }


    [HttpGet]
    [Route("getdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown()
    {
        return await VendorItemsRepository.GetDropDown("pu");
    }

    [HttpGet]
    [Route("getvendoritemslist/{identityId}/{itemTypeId}/{itemId?}")]
    public async Task<List<MyDropDownViewModel>> GetVendorItemList(int identityId, int itemTypeId, byte? itemId)
    {
        return await VendorItemsRepository.GetVendorItemList(identityId, itemTypeId, itemId);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] VendorItemAssign model)
    {
        var UserId = Convert.ToInt16(User.FindFirstValue("UserId"));
        return await VendorItemsRepository.VendorItemAssign(model, UserId);
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] VendorItemAssign model)
    {
        var UserId = Convert.ToInt16(User.FindFirstValue("UserId"));
        return await VendorItemsRepository.VendorItemDiAssign(model, UserId);
    }

    [HttpPost]
    [Route("getlistitemvendor")]
    public async Task<List<GetlistItemVendorViewModel>> GetlistItemVendor([FromBody] int itemId)
    {
        var companyId = UserClaims.GetCompanyId();
        var isItemVendor = VendorItemsRepository.CheckExistVendorItemsId(itemId).Result;
        if (isItemVendor)
            return await VendorItemsRepository.GetlistItemVendor(itemId, companyId);
        return null;
    }
}

[Route("PU")]
[Authorize]
public class VendorItemsController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.PU.VendorItems);
    }
}