using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WH.ItemRequest;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemRequestCartable;

namespace ParseAlphabet.ERP.Web.Modules.WH.ItemRequestCartable;

[Route("api/WH/[controller]")]
[ApiController]
[Authorize]
public class ItemRequestCartableApiController : ControllerBase
{
    private readonly ItemRequestCartableRepository _itemRequestCartableRepository;

    public ItemRequestCartableApiController(ItemRequestCartableRepository itemRequestCartableRepository)
    {
        _itemRequestCartableRepository = itemRequestCartableRepository;
    }

    [HttpGet]
    [Route("itemrequestcartablesection/{stageClassId}/{byUser}")]
    public async Task<List<MyDropDownViewModel>> ItemRequestCartableSection(int stageClassId, string byUser)
    {
        var companyId = UserClaims.GetCompanyId();

        int? userId = null;

        if (byUser == "my")
            userId = UserClaims.GetUserId();
        ;

        var roleId = UserClaims.GetRoleId();
        ;
        return await _itemRequestCartableRepository.ItemTransactionCartableSection(stageClassId, companyId, userId,
            roleId);
    }


    [HttpPost]
    [Route("getpageitemrequestcartable")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<ItemRequestGetPage>>> GetPageItemRequestCartable(
        [FromBody] NewGetPageViewModel model)
    {
        if (model.Form_KeyValue[2]?.ToString() == "my")
            model.Form_KeyValue[3] = User.FindFirstValue("UserId");
        else
            model.Form_KeyValue[3] = 0;
        model.CompanyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;

        return await _itemRequestCartableRepository.ItemRequestCartableGetPage(model, userId);
    }
}

[Route("WH")]
[Authorize]
public class ItemRequestCartableController : Controller
{
    [Route("[controller]/{stageId?}")]
    [HttpGet]
    [Authenticate(Operation.VIW, "")]
    public ActionResult Index(short? stageId)
    {
        return View(Views.WH.ItemRequestCartable.Index);
    }
}