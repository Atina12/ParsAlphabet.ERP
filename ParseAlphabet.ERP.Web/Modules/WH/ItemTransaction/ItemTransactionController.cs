using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WH.ItemTransaction;
using ParsAlphabet.ERP.Application.Dtos.WH.ItemTransactionLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemTransaction;

namespace ParseAlphabet.ERP.Web.Modules.WH.ItemTransaction;

[Route("api/WH/[controller]")]
[ApiController]
[Authorize]
public class ItemTransactionApiController(ItemTransactionRepository itemTransactionRepository) : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "ItemTransaction")]
    public async Task<MyResultPage<List<ItemTransactionGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        if (model.Form_KeyValue[0]?.ToString() == "my")
            model.Form_KeyValue[1] = User.FindFirstValue("UserId");

        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;
        return await itemTransactionRepository.GetPage(model, userId, roleId);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return itemTransactionRepository.GetColumns();
    }


    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "ItemTransaction")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        if (model.Form_KeyValue[0]?.ToString() == "my")
            model.Form_KeyValue[1] = User.FindFirstValue("UserId");

        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;

        return await itemTransactionRepository.Csv(model, userId, roleId);
    }


    [HttpGet]
    [Route("requestitemtypegetdropdown/{itemTransactionId}/{requestId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> RequestFundType_GetDropDown(long itemTransactionId,
        long requestId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await itemTransactionRepository.RequestItemType_GetDropDown(itemTransactionId, requestId, companyId);
    }

    [HttpGet]
    [Route("request_getdropdown/{branchId}/{workflowId}/{stageId}/{requestId?}/{id?}")]
    public async Task<List<ParentIdMyDropdownViewModel>> Request_GetDropDown(short branchId, short workflowId,
        short stageId, long? requestId, long? id)
    {
        var companyId = UserClaims.GetCompanyId();

        return await itemTransactionRepository.Request_GetDropDown(branchId, workflowId, companyId, stageId, requestId,
            id);
    }


    [HttpPost]
    [Route("checkexist")]
    public async Task<bool> TreasuryCheckExist([FromBody] WarehouseExistViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;
        return await itemTransactionRepository.CheckExist(model, userId, roleId);
    }
}

[Route("WH")]
[Authorize]
public class ItemTransactionController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "ItemTransaction")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.WH.ItemTransaction);
    }
}