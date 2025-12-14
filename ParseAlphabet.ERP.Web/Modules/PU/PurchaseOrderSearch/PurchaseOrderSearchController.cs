using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseOrderSearch;
using ParsAlphabet.ERP.Infrastructure.Implantation.PU.PurchaseOrderSearch;

namespace ParseAlphabet.ERP.Web.Modules.PU.PurchaseOrderSearch;

[Route("api/PU/[controller]")]
[ApiController]
[Authorize]
public class PurchaseOrderSearchApiController(PurchaseOrderSearchRepository purchaseOrderSearchRepository)
    : ControllerBase
{
    [HttpPost]
    [Route("getpurchasepersonquicksearch")]
    public async Task<MyResultPage<List<GetPurchaseOrderQuickSearch>>> GetPurchaseOrderQuickSearch(
        [FromBody] PurchaseOrderQuickSearch model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await purchaseOrderSearchRepository.GetPurchaseOrderQuickSearch(model, roleId);
    }

    [HttpPost]
    [Route("getpurchasepersonquicksearchtype")]
    public async Task<MyResultPage<List<GetPurchaseOrderQuickSearchType>>> GetPurchaseOrderQuickSearchType(
        [FromBody] PurchaseOrderQuickSearchtype model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var result = await purchaseOrderSearchRepository.GetPurchaseOrderQuickSearchType(model);
        return result;
    }
}

[Route("PU/[controller]")]
[Authorize]
public class PurchaseOrderSearchController : Controller
{
    [Route("quicksearchorder")]
    [Authenticate(Operation.VIW, "PurchaseOrder")]
    [HttpGet]
    public IActionResult PurchaseOrderSearch()
    {
        return PartialView(Views.PU.Search.PurchaseOrderQuickSearch);
    }

    [Route("quicksearchinvoice")]
    [Authenticate(Operation.VIW, "PurchaseInvoice")]
    [HttpGet]
    public IActionResult PurchaseInvoiceSearch()
    {
        return PartialView(Views.PU.Search.PurchaseOrderQuickSearch);
    }
}