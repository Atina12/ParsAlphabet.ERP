using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WH.ItemRequestLine;
using ParsAlphabet.ERP.Application.Dtos.WH.WarehouseTransactionLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemRequest;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemRequestLine;

namespace ParseAlphabet.ERP.Web.Modules.WH.ItemRequestLine;

[Route("api/WH/[controller]")]
[ApiController]
[Authorize]
public class ItemRequestLineApiController(
    ItemRequestLineRepository ItemRequestLineRepository,
    ItemRequestRepository itemRequestRepository)
    : ControllerBase
{
    private readonly ItemRequestRepository _itemRequestRepository = itemRequestRepository;

    [HttpPost]
    [Route("getheader")]
    [Authenticate(Operation.VIW, "ItemRequest")]
    public async Task<MyResultPage<ItemRequestLineDisplay>> GetHeader([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await ItemRequestLineRepository.GetHeader(model);
    }


    [HttpPost]
    [Route("display")]
    [Authenticate(Operation.DIS, "ItemRequest")]
    public async Task<MyResultPage<ItemRequestLineDisplay>> Display([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
       
        var roleId = UserClaims.GetRoleId();
        ;

        return await ItemRequestLineRepository.Display(model, userId, roleId);
    }


    [HttpPost]
    [Route("getrecordbyids")]
    [Authenticate(Operation.VIW, "ItemRequest")]
    public async Task<MyResultPage<ItemRequestLineGetRecord>> GetRecordByIds(
        [FromBody] GetItemRequestLineRecordByIds model)
    {
        var companyId = UserClaims.GetCompanyId();
        return await ItemRequestLineRepository.GetRecordByIds(model, companyId);
    }

    [HttpPost]
    [Route("getitemRequestlinepage")]
    [Authenticate(Operation.VIW, "ItemRequest")]
    public async Task<MyResultStageStepConfigPage<List<ItemRequestLines>>> GetItemRequestLinePage(
        [FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await ItemRequestLineRepository.GetPage(model);
    }


    [HttpPost]
    [Route("insertItemRequestLine")]
    [Authenticate(Operation.INS, "ItemRequest")]
    public async Task<ItemRequestLineResult> InsertRequestLine([FromBody] WarehouseTransactionLineModel model)
    {
        model.CreateUserId = UserClaims.GetUserId();
        ;
        model.CompanyId = UserClaims.GetCompanyId();
        return await ItemRequestLineRepository.Save(model);
    }

    [HttpPost]
    [Route("updateItemRequestLine")]
    [Authenticate(Operation.UPD, "ItemRequest")]
    public async Task<ItemRequestLineResult> UpdateTreasuryLine([FromBody] WarehouseTransactionLineModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.CreateUserId = Convert.ToInt16(User.FindFirstValue("UserId"));
        return await ItemRequestLineRepository.Save(model);
    }


    [HttpPost]
    [Route("deleteItemRequestLine")]
    [Authenticate(Operation.DEL, "ItemRequest")]
    public async Task<MyResultStatus> DeleteItemRequestLine([FromBody] DeleteRequestLineViewModel model)
    {
        var companyId = UserClaims.GetCompanyId();
        return await ItemRequestLineRepository.DeleteItemRequestLine(model, companyId);
    }


    [HttpPost]
    [Route("getItemTransactionCount")]
    public async Task<int> GetItemTransactionCount([FromBody] int id)
    {
        return await ItemRequestLineRepository.ExistItemTransactionLine(id);
    }

    [HttpPost]
    [Route("csvline")]
    [Authenticate(Operation.PRN, "ItemRequest")]
    public async Task<CSVViewModel<IEnumerable>> GetCSV([FromBody] NewGetPageViewModel model)
    {
        var id = int.Parse(model.Form_KeyValue[0]?.ToString());
        model.CompanyId = UserClaims.GetCompanyId();

        var itemExist = await ItemRequestLineRepository.CheckExist(id, model.CompanyId);

        if (itemExist)
            return await ItemRequestLineRepository.ItemRequestLineCSV(model, Convert.ToInt16(model.Form_KeyValue[0]));
        return new CSVViewModel<IEnumerable>
        {
            Columns = null,
            Rows = null
        };
    }
}

[Route("WH")]
[Authorize]
public class ItemRequestLineController : Controller
{
    [Route("[controller]/{id}/{isDefaultCurrency}")]
    [Authenticate(Operation.VIW, "ItemRequest")]
    [HttpGet]
    public ActionResult Index(int id, int isDefaultCurrency)
    {
        return PartialView(Views.WH.ItemRequestLine);
    }

    [Route("[controller]/display/{id}/{isDefaultCurrency}/{stageId}/{workflowId}")]
    [Authenticate(Operation.DIS, "ItemRequest")]
    [HttpGet]
    public ActionResult Display(int id, int isDefaultCurrency, short stageId, int workflowId)
    {
        return PartialView(Views.WH.ItemRequestDisplay);
    }
}