using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WH.ItemTransaction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemTransactionCartable;

namespace ParseAlphabet.ERP.Web.Modules.WH.ItemTransactionCartable;

[Route("api/WH/[controller]")]
[ApiController]
[Authorize]
public class ItemTransactionCartableApiController : ControllerBase
{
    private readonly ItemTransactionCartableRepository _itemTransactionCartableRepository;

    public ItemTransactionCartableApiController(ItemTransactionCartableRepository itemTransactionCartableRepository)
    {
        _itemTransactionCartableRepository = itemTransactionCartableRepository;
    }

    [HttpGet]
    [Route("itemtransactioncartablesection/{stageClassId}/{byUser}")]
    [Authenticate(Operation.VIW, "")]
    public async Task<List<MyDropDownViewModel>> ItemTransactionCartableSection(string stageClassId, string byUser)
    {
        var companyId = UserClaims.GetCompanyId();

        int? userId = null;

        if (byUser == "my")
            userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;
        return await _itemTransactionCartableRepository.ItemTransactionCartableSection(stageClassId, companyId, userId,
            roleId);
    }


    [HttpPost]
    [Route("getpageitemtransactioncartable")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<ItemTransactionGetPage>>> GetPageItemTransactionCartable(
        [FromBody] NewGetPageViewModel model)
    {
        if (model.Form_KeyValue[2]?.ToString() == "my")
            model.Form_KeyValue[3] = User.FindFirstValue("UserId");
        else
            model.Form_KeyValue[3] = 0;
        model.CompanyId = UserClaims.GetCompanyId();

        var userId = UserClaims.GetUserId();
        ;
        return await _itemTransactionCartableRepository.ItemTransactionCartableGetPage(model, userId);
    }
}

[Route("WH")]
[Authorize]
public class ItemTransactionCartableController : Controller
{
    [Route("[controller]/{stageId?}")]
    [HttpGet]
    [Authenticate(Operation.VIW, "")]
    public ActionResult Index(short? stageId)
    {
        return View(Views.WH.ItemTransactionCartable.Index);
    }
}