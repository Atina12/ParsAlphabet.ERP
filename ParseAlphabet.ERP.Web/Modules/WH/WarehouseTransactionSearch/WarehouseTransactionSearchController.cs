using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WH.WarehouseTransactionSearch;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.WarehouseTransactionSearch;

namespace ParseAlphabet.ERP.Web.Modules.WH.WarehouseTransactionSearch;

[Route("api/WH/[controller]")]
[ApiController]
[Authorize]
public class WarehouseTransactionSearchApiController(
    WarehouseTransactionSearchRepository warehouseTransactionSearchRepository)
    : ControllerBase
{
    [HttpPost]
    [Route("getwarehousetransactionquicksearch")]
    public async Task<MyResultPage<List<GetWarehouseTransactionQuickSearch>>> GetWarehouseTransactionrQuickSearch(
        [FromBody] WarehouseTransactionQuickSearch model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await warehouseTransactionSearchRepository.GetWarehouseTransactionQuickSearch(model, roleId);
    }

    [HttpPost]
    [Route("getwarehousetransactionquicksearchtype")]
    public async Task<MyResultPage<List<GetWarehouseTransactionQuickSearchType>>>
        GetWarehouseTransactionQuickSearchType([FromBody] WarehouseTransactionQuickSearchtype model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var result = await warehouseTransactionSearchRepository.GetWarehouseTransactionQuickSearchType(model);
        return result;
    }
}

[Route("WH/[controller]")]
[Authorize]
public class WarehouseTransactionSearchController : Controller
{
    [Route("quicksearchrequest")]
    [Authenticate(Operation.VIW, "ItemRequest")]
    [HttpGet]
    public IActionResult WarehouseRequestSearch()
    {
        return PartialView(Views.WH.Search.WarehouseTransactionQuickSearch);
    }

    [Route("quicksearchtransaction")]
    [Authenticate(Operation.VIW, "ItemTransaction")]
    [HttpGet]
    public IActionResult WarehouseTransactionSearch()
    {
        return PartialView(Views.WH.Search.WarehouseTransactionQuickSearch);
    }
}