using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WH.ItemTransactionLine;
using ParsAlphabet.ERP.Application.Dtos.WH.WarehouseTransactionLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemTransaction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemTransactionLine;
using Enum = ParsAlphabet.ERP.Application.Enums.Enum;

namespace ParseAlphabet.ERP.Web.Modules.WH.ItemTransactionLine;

[Route("api/WH/[controller]")]
[ApiController]
[Authorize]
public class ItemTransactionLineApiController(
    ItemTransactionLineRepository itemTransactionLineRepository,
    ItemTransactionRepository itemTransactionRepository)
    : ControllerBase
{
    [HttpPost]
    [Route("getheader")]
    [Authenticate(Operation.VIW, "ItemTransaction")]
    public async Task<MyResultPage<ItemTransactionLineDisplay>> GetHeader([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await itemTransactionLineRepository.GetHeader(model);
    }


    [HttpPost]
    [Route("display")]
    [Authenticate(Operation.DIS, "ItemTransaction")]
    public async Task<MyResultPage<ItemTransactionLineDisplay>> Display([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        var roleId = UserClaims.GetRoleId();
        return await itemTransactionLineRepository.Display(model, userId, roleId);
    }


    [HttpPost]
    [Route("getrecordbyids")]
    [Authenticate(Operation.VIW, "ItemTransaction")]
    public async Task<MyResultPage<ItemTransactionLineGetRecord>> GetRecordByIds([FromBody] int Id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await itemTransactionLineRepository.GetRecordByIds(Id, companyId);
    }


    [HttpPost]
    [Route("csvline")]
    [Authenticate(Operation.PRN, "ItemTransaction")]
    public async Task<CSVViewModel<IEnumerable>> GetCSV([FromBody] NewGetPageViewModel model)
    {
        var id = int.Parse(model.Form_KeyValue[0]?.ToString());
        model.CompanyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;
        var bySystem = model.Form_KeyValue.Length > 3 ? model.Form_KeyValue[3] : 2;
        var roleId = UserClaims.GetRoleId();
        ;
        var warehouseViewModel = new WarehouseExistViewModel
        {
            BySystem = Convert.ToByte(bySystem),
            Id = id,
            CompanyId = model.CompanyId
        };
        var itemExist = await itemTransactionRepository.CheckExist(warehouseViewModel, userId, roleId);

        if (itemExist)
            return await itemTransactionLineRepository.ItemTransactionLineCSV(model,
                Convert.ToInt16(model.Form_KeyValue[0]));
        return new CSVViewModel<IEnumerable>
        {
            Columns = null,
            Rows = null
        };
    }


    [HttpPost]
    [Route("getitemTransactionlinepage")]
    [Authenticate(Operation.VIW, "ItemTransaction")]
    public async Task<MyResultStageStepConfigPage<List<ItemTransactionLines>>> GetItemTransactionLinePage(
        [FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await itemTransactionLineRepository.GetPage(model);
    }


    [HttpPost]
    [Route("insertItemTransactionLine")]
    [Authenticate(Operation.INS, "ItemTransaction")]
    public async Task<MyResultStatus> InsertItemTransactionLine([FromBody] WarehouseTransactionLineModel model)
    {
        if (ModelState.IsValid)
        {
            model.CreateUserId = UserClaims.GetUserId();
            ;
            model.CompanyId = UserClaims.GetCompanyId();
            var result = await itemTransactionLineRepository.ValidationBeforeSave(model, Enum.OperationType.Insert);
            if (result.Successfull)
                return await itemTransactionLineRepository.Save(model);

            return result;
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("insertpreviousstagelines")]
    [Authenticate(Operation.INS, "ItemTransaction")]
    public async Task<MyResultStatus> InsertPreviousStageLinests(
        [FromBody] List<WarehouseTransactionLineGetReccord> modelList, [FromRoute] bool isDefaultCurrency)
    {
        var createUserId = Convert.ToInt16(User.FindFirstValue("UserId"));
        var companyId = UserClaims.GetCompanyId();
        return await itemTransactionLineRepository.InsertPreviousStageLinests(modelList, companyId, createUserId,
            isDefaultCurrency);
    }


    [HttpPost]
    [Route("updateItemTransactionLine")]
    [Authenticate(Operation.UPD, "ItemTransaction")]
    public async Task<MyResultStatus> UpdateItemTransactionLine([FromBody] WarehouseTransactionLineModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.CreateUserId = Convert.ToInt16(User.FindFirstValue("UserId"));

        var result = await itemTransactionLineRepository.ValidationBeforeSave(model, Enum.OperationType.Update);
        if (result.Successfull)
            return await itemTransactionLineRepository.Save(model);

        return result;
    }


    [HttpPost]
    [Route("deleteItemTransactionLine")]
    [Authenticate(Operation.DEL, "ItemTransaction")]
    public async Task<MyResultStatus> DeleteItemRequestLine([FromBody] GetWarehouseTransactionLine model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await itemTransactionLineRepository.Delete(model);
    }


    [HttpPost]
    [Route("getrequestfilteritems")]
    public async Task<GetStageStepConfigColumnsViewModel> GetRequestFilterParameters([FromBody] short stageId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await itemTransactionLineRepository.GetRequestSimpleColumns(companyId, stageId, 0, 0);
    }

    [HttpPost]
    [Route("getitemtransactionrequest")]
    public async Task<MyResultStageStepConfigPage<List<ItemTransactionRequest>>> GetItemTransactionRequest(
        [FromBody] GetPageViewModel model)
    {
        var companyId = UserClaims.GetCompanyId();
        return await itemTransactionLineRepository.GetItemTransactionLineRequest(model, companyId);
    }


    [HttpGet]
    [Route("inout_getdropdown")]
    public List<MyDropDownViewModel> InOut_GetDropDown()
    {
        return itemTransactionLineRepository.InOut_GetDropDown();
    }


    [HttpPost]
    [Route("postgroupfooter")]
    public async Task<MyResultPage<ItemTransactionLineGetRecord>> GetItemTransactionLineLineFooter([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await itemTransactionLineRepository.GetItemTransactionLineLineFooter(id, companyId);
    }


    [HttpPost]
    [Route("getItemTransactionlineCount")]
    public async Task<int> GetItemTransactionlineCount([FromBody] int id)
    {
        return await itemTransactionLineRepository.ExistItemTransactionLine(id);
    }
}

[Route("WH")]
[Authorize]
public class ItemTransactionLineController : Controller
{
    [Route("[controller]/{id}/{isDefaultCurrency}/{isQuntity}")]
    [Authenticate(Operation.VIW, "ItemTransaction")]
    [HttpGet]
    public ActionResult Index(int id, int isDefaultCurrency, int isQuntity = 0)
    {
        return PartialView(Views.WH.ItemTransactionLine);
    }

    [Route("[controller]/display/{id}/{isDefaultCurrency}/{stageId}/{workflowId}/{isQuntity}")]
    [Authenticate(Operation.DIS, "ItemTransaction")]
    [HttpGet]
    public ActionResult Display(int id, int isDefaultCurrency, short stageId, int workflowId, int isQuntity = 0)
    {
        return PartialView(Views.WH.ItemTransactionDisplay);
    }
}