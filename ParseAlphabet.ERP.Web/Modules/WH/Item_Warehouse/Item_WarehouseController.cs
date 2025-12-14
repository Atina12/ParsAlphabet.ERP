using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.Item_Warehouse;

namespace ParseAlphabet.ERP.Web.Modules.WH.Item_Warehouse;

[Route("api/WH/[controller]")]
[ApiController]
[Authorize]
public class Item_WarehouseApiController(Item_WarehouseRepository itemWarehouseRepository) : ControllerBase
{
    [HttpGet]
    [Route("getdropdown/{warehouseId}/{itemTypeId}")]
    public async Task<List<MyDropDownViewModel>> GetDropDown(int warehouseId, byte itemTypeId)
    {
        var userId = UserClaims.GetUserId();
        ;
        var companyId = UserClaims.GetCompanyId();
        return await itemWarehouseRepository.GetDropDown(warehouseId, itemTypeId, userId, companyId);
    }
}

[Route("WH")]
[Authorize]
public class Item_WarehouseController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.WH.Item_Warehouse);
    }
}