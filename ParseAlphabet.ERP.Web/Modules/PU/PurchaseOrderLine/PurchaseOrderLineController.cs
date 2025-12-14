using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseOrderLine;
using ParsAlphabet.ERP.Application.Interfaces.PU.PurchaseOrderLine;

namespace ParseAlphabet.ERP.Web.Modules.PU.PurchaseOrderLine;

[Route("api/PU/[controller]")]
[ApiController]
[Authorize]
public class PurchaseOrderLineApiController(IPurchaseOrderLineRepository purchaseOrderLineRepository) : ControllerBase
{
    #region personOrder

    [HttpPost]
    [Route("display")]
    [Authenticate(Operation.DIS, "PurchaseOrder")]
    public async Task<MyResultPage<PurchaseOrderLineGetPage>> GetPage([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;
        return await purchaseOrderLineRepository.Display(model, userId, roleId);
    }

    #endregion


    [HttpPost]
    [Route("getorderlinepage")]
    [Authenticate(Operation.VIW, "PurchaseOrder")]
    public async Task<MyResultStageStepConfigPage<List<PurchaseOrderLines>>> GetOrderLinePage(
        [FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        return await purchaseOrderLineRepository.GetPurchaseOrderLinePage(model);
    }

    [HttpPost]
    [Route("getrecordbyids")]
    [Authenticate(Operation.VIW, "PurchaseOrder")]
    public async Task<MyResultPage<PurchaseOrderLineGetRecord>> GetRecordByIds([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await purchaseOrderLineRepository.GetRecordByIds(id, companyId);
    }

    [HttpPost]
    [Route("insertOrderLine")]
    [Authenticate(Operation.INS, "PurchaseOrder")]
    public async Task<MyResultStatus> InsertOrderLine([FromBody] PurchaseOrderLineModel model)
    {
        if (ModelState.IsValid)
        {
            model.CreateUserId = UserClaims.GetUserId();
            ;
            model.CurrencyId = model.CurrencyId == 0
                ? byte.Parse(User.FindFirstValue("DefaultCurrencyId"))
                : model.CurrencyId;
            var companyId = UserClaims.GetCompanyId();
            return await purchaseOrderLineRepository.Insert(model, companyId);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("updateorderLine")]
    [Authenticate(Operation.UPD, "PurchaseOrder")]
    public async Task<MyResultStatus> UpdateOrderLine([FromBody] PurchaseOrderLineModel model)
    {
        if (ModelState.IsValid)
        {
            var companyId = UserClaims.GetCompanyId();
            model.CurrencyId = model.CurrencyId == 0
                ? byte.Parse(User.FindFirstValue("DefaultCurrencyId"))
                : model.CurrencyId;
            model.CreateUserId = UserClaims.GetUserId();
            ;
            return await purchaseOrderLineRepository.Update(model, companyId);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("deleteOrderLine")]
    [Authenticate(Operation.DEL, "PurchaseOrder")]
    public async Task<MyResultStatus> DeleteOrderLine([FromBody] PurchaseOrderLineDelete model)
    {
        var companyId = UserClaims.GetCompanyId();
        model.UserId = UserClaims.GetUserId();
        ;
        return await purchaseOrderLineRepository.DeleteOrderLine(model, companyId);
    }


    #region other

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        var companyId = Convert.ToInt32(User.FindFirstValue("CompanyId"));
        return purchaseOrderLineRepository.GetHeaderColumns(companyId);
    }

    [HttpPost]
    [Route("getorderlinefilteritems")]
    public async Task<GetStageStepConfigColumnsViewModel> GetOrderLineFilterParameters()
    {
        var companyId = UserClaims.GetCompanyId();

        return await purchaseOrderLineRepository.GetPurchaseOrderLineSimpleColumns(companyId, 0, 8);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "PurchaseOrder")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        return await purchaseOrderLineRepository.Csv(model);
    }


    [HttpPost]
    [Route("getheader")]
    [Authenticate(Operation.VIW, "PurchaseOrder")]
    public async Task<MyResultPage<PurchaseOrderLineGetPage>> GetHeader([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await purchaseOrderLineRepository.GetHeader(model);
    }

    [HttpPost]
    [Route("getPurchasePersonLineQuantity")]
    public async Task<int> GetOrderLineCount([FromBody] int id)
    {
        return await purchaseOrderLineRepository.GetOrderLineCount(id);
    }

    [HttpPost]
    [Route("getLineSum")]
    public async Task<PurchaseOrderSum> GetItemRequestLineSum([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await purchaseOrderLineRepository.GetLineSum(model);
    }

    #endregion
}

[Route("PU")]
[Authorize]
public class PurchaseOrderLineController : Controller
{
    [Route("[controller]/{id}/{isDefaultCurrency}")]
    [Authenticate(Operation.VIW, "PurchaseOrder")]
    [HttpGet]
    public ActionResult Index(int id, int isDefaultCurrency)
    {
        return PartialView(Views.PU.PurchaseOrderLine);
    }

    [Route("[controller]/display/{id}/{isDefaultCurrency}/{stageId}/{workflowId}")]
    [Authenticate(Operation.DIS, "PurchaseOrder")]
    [HttpGet]
    public ActionResult Display(int id, int isDefaultCurrency, short stageId, int workflowId)
    {
        return PartialView(Views.PU.PurchaseOrderDisplay);
    }
}