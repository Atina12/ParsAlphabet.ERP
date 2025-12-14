using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseOrder;
using ParsAlphabet.ERP.Infrastructure.Implantation.PU.PurchaseOrderCartable;

namespace ParseAlphabet.ERP.Web.Modules.PU.PurchaseOrderCartable;

[Route("api/PU/[controller]")]
[ApiController]
[Authorize]
public class PurchaseOrderCartableApiController : ControllerBase
{
    private readonly PurchaseOrderCartableRepository _purchaseOrderCartableRepository;

    public PurchaseOrderCartableApiController(PurchaseOrderCartableRepository purchaseOrderCartableRepository)
    {
        _purchaseOrderCartableRepository = purchaseOrderCartableRepository;
    }

    [HttpGet]
    [Route("purchaseordercartablesection/{stageClassId}/{byUser}")]
    public async Task<List<MyDropDownViewModel>> PurchaseOrderCartableSection(int stageClassId, string byUser)
    {
        var companyId = UserClaims.GetCompanyId();

        int? userId = null;

        if (byUser == "my")
            userId = UserClaims.GetUserId();
        ;

        var roleId = UserClaims.GetRoleId();
        ;

        return await _purchaseOrderCartableRepository.PurchaseOrderGroupCartableSection(stageClassId, companyId, userId,
            roleId);
    }


    [HttpPost]
    [Route("getpageorderscartable")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<PurchaseOrderGetPage>>> GetPagePurchaseOrderCartable(
        [FromBody] NewGetPageViewModel model)
    {
        if (model.Form_KeyValue[2]?.ToString() == "my")
            model.Form_KeyValue[3] = User.FindFirstValue("UserId");
        else
            model.Form_KeyValue[3] = 0;
        model.CompanyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;

        var roleId = UserClaims.GetRoleId();
        ;

        return await _purchaseOrderCartableRepository.PurchaseOrderCartableGetPage(model, userId, roleId);
    }
}

[Route("PU")]
[Authorize]
public class PurchaseOrderCartableController : Controller
{
    [Route("[controller]/{stageId?}")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index(short? stageId)
    {
        return View(Views.PU.PurchaseOrderCartable.Index);
    }
}