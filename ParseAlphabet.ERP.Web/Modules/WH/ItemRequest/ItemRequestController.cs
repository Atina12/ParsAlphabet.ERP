using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WH.ItemRequest;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemRequest;

namespace ParseAlphabet.ERP.Web.Modules.WH.ItemRequest;

[Route("api/WH/[controller]")]
[ApiController]
[Authorize]
public class ItemRequestApiController(ItemRequestRepository itemTransactionRepository) : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<ItemRequestGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
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
    [Authenticate(Operation.PRN, "")]
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


    [HttpPost]
    [Route("checkexist")]
    public async Task<bool> TreasuryCheckExist([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;
        return await itemTransactionRepository.CheckExist(id, companyId, userId, roleId);
    }

    [HttpPost]
    [Route("requestislastconfirmheader")]
    public async Task<bool> CheckRequestIsLastConfirmHeader([FromBody] int requestId)
    {
        return await itemTransactionRepository.CheckRequestIsLastConfirmHeader(requestId);
    }
}

[Route("WH")]
[Authorize]
public class ItemRequestController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.WH.ItemRequest);
    }
}