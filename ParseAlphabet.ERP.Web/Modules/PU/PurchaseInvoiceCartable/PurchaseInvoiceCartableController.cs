using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseInvoice;
using ParsAlphabet.ERP.Infrastructure.Implantation.PU.PurchaseInvoiceCartable;

namespace ParseAlphabet.ERP.Web.Modules.PU.PurchaseInvoiceCartable;

[Route("api/PU/[controller]")]
[ApiController]
[Authorize]
public class PurchaseInvoiceCartableApiController : ControllerBase
{
    private readonly PurchaseInvoiceCartableRepository _purchaseInvoiceCartableRepository;

    public PurchaseInvoiceCartableApiController(PurchaseInvoiceCartableRepository purchaseInvoiceCartableRepository)
    {
        _purchaseInvoiceCartableRepository = purchaseInvoiceCartableRepository;
    }

    [HttpGet]
    [Route("purchaseinvoicecartablesection/{stageClassId}/{byUser}")]
    public async Task<List<MyDropDownViewModel>> PurchaseInvoiceCartableSection(string stageClassId, string byUser)
    {
        var companyId = UserClaims.GetCompanyId();

        int? userId = null;

        if (byUser == "my")
            userId = UserClaims.GetUserId();
        ;

        var roleId = UserClaims.GetRoleId();
        ;

        return await _purchaseInvoiceCartableRepository.PurchaseInvoiceGroupCartableSection(stageClassId, companyId,
            userId, roleId);
    }


    [HttpPost]
    [Route("getpageinvoicecartable")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<PurchaseInvoiceGetPage>>> GetPagePurchaseInvoiceCartable(
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

        return await _purchaseInvoiceCartableRepository.PurchaseInvoiceCartableGetPage(model, userId, roleId);
    }
}

[Route("PU")]
[Authorize]
public class PurchaseInvoiceCartableController : Controller
{
    [Route("[controller]/{stageId?}")]
    [HttpGet]
    [Authenticate(Operation.VIW, "")]
    public ActionResult Index(short? stageId)
    {
        return View(Views.PU.PurchaseInvoiceCartable.Index);
    }
}