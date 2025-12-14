using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseInvoiceLine;
using ParsAlphabet.ERP.Application.Interfaces.PU.PurchaseInvoiceLine;
using static ParsAlphabet.ERP.Application.Enums.Enum;

namespace ParseAlphabet.ERP.Web.Modules.PU.PurchaseInvoiceLine;

[Route("api/PU/[controller]")]
[ApiController]
[Authorize]
public class PurchaseInvoiceLineApiController(IPurchaseInvoiceLineRepository purchaseInvoiceLineRepository)
    : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.DIS, "PurchaseInvoice")]
    public async Task<MyResultPage<PurchaseInvoiceLineGetPage>> GetPage([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;
        return await purchaseInvoiceLineRepository.Display(model, userId, roleId);
    }

    [HttpPost]
    [Route("getPurchaseLineCount")]
    public async Task<int> GetPurchaseLineCount([FromBody] int id)
    {
        return await purchaseInvoiceLineRepository.ExistPurchaseLine(id);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "PurchaseInvoice")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        return await purchaseInvoiceLineRepository.Csv(model);
    }

    [HttpPost]
    [Route("getinvoicelinepage")]
    [Authenticate(Operation.VIW, "PurchaseInvoice")]
    public async Task<MyResultStageStepConfigPage<List<PurchaseInvoiceLines>>> GetInvoiceLinePage(
        [FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await purchaseInvoiceLineRepository.GetInvoiceLinePage(model);
    }

    [HttpPost]
    [Route("getrecordbyids")]
    [Authenticate(Operation.VIW, "PurchaseInvoice")]
    public async Task<MyResultPage<PurchaseInvoiceLineGetRecord>> GetRecordById([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await purchaseInvoiceLineRepository.GetRecordByIds(id, companyId);
    }


    [HttpPost]
    [Route("insertInvoiceLine")]
    [Authenticate(Operation.INS, "PurchaseInvoice")]
    public async Task<MyResultStatus> InsertInvoiceLine([FromBody] PurchaseInvoiceLineModel model)
    {
        if (ModelState.IsValid)
        {
            model.CreateUserId = UserClaims.GetUserId();
            ;
            model.CurrencyId = model.CurrencyId == 0
                ? byte.Parse(User.FindFirstValue("DefaultCurrencyId"))
                : model.CurrencyId;
            var companyId = UserClaims.GetCompanyId();
            var result =
                await purchaseInvoiceLineRepository.ValidationBeforeSave(model, OperationType.Insert, companyId);
            if (result.Successfull)
                return await purchaseInvoiceLineRepository.Save(model);

            return result;
        }

        return ModelState.ToMyResultDataStatus<int>();
    }


    [HttpPost]
    [Route("updateInvoiceLine")]
    [Authenticate(Operation.UPD, "PurchaseInvoice")]
    public async Task<MyResultStatus> UpdateInvoiceLine([FromBody] PurchaseInvoiceLineModel model)
    {
        if (ModelState.IsValid)
        {
            var companyId = UserClaims.GetCompanyId();
            model.CurrencyId = model.CurrencyId == 0
                ? byte.Parse(User.FindFirstValue("DefaultCurrencyId"))
                : model.CurrencyId;
            model.CreateUserId = UserClaims.GetUserId();
            ;
            var result =
                await purchaseInvoiceLineRepository.ValidationBeforeSave(model, OperationType.Update, companyId);
            if (result.Successfull)
                return await purchaseInvoiceLineRepository.Save(model);

            return result;
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("deleteInvoiceLine")]
    [Authenticate(Operation.DEL, "PurchaseInvoice")]
    public async Task<MyResultStatus> DeleteInvoiceLine([FromBody] PurchaseInvoiceLineModel model)
    {
        var companyId = Convert.ToInt32(User.FindFirstValue("CompanyId"));
        return await purchaseInvoiceLineRepository.DeleteInvoiceLine(model, companyId);
    }

    [HttpPost]
    [Route("getLineSum")]
    public async Task<PurchaseOrderSum> GetItemRequestLineSum([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await purchaseInvoiceLineRepository.GetLineSum(model);
    }


    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        var companyId = Convert.ToInt32(User.FindFirstValue("CompanyId"));
        return purchaseInvoiceLineRepository.GetHeaderColumns(companyId, 0);
    }

    [HttpPost]
    [Route("getinvoicelinefilteritems")]
    public async Task<GetStageStepConfigColumnsViewModel> GetOrderLineFilterParameters()
    {
        var companyId = UserClaims.GetCompanyId();

        return await purchaseInvoiceLineRepository.GetInvoiceLineSimpleColumns(companyId, 0, 0);
    }

    [HttpPost]
    [Route("getheader")]
    [Authenticate(Operation.VIW, "PurchaseInvoice")]
    public async Task<MyResultPage<PurchaseInvoiceLineGetPage>> GetHeader([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await purchaseInvoiceLineRepository.GetHeader(model);
    }

    [HttpPost]
    [Route("getrequestfilteritems")]
    public async Task<GetStageStepConfigColumnsViewModel> GetRequestFilterParameters([FromBody] byte itemTypeId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await purchaseInvoiceLineRepository.GetInvoiceLineSimpleColumns(companyId, 0, 0);
    }

    [HttpPost]
    [Route("getpersoninvoicerequest")]
    public async Task<MyResultStageStepConfigPage<List<PurchaseInvoiceRequestLine>>> GetPurchaseInvoiceLineRequest(
        [FromBody] GetPageViewModel model)
    {
        var companyId = UserClaims.GetCompanyId();

        return await purchaseInvoiceLineRepository.GetPurchaseInvoiceLineRequest(model, companyId);
    }

    [HttpPost]
    [Route("insertpreviousstagelines")]
    [Authenticate(Operation.INS, "PurchaseInvoice")]
    public async Task<MyResultStatus> InsertPreviousStageLinests([FromBody] List<SaveRequestLine> model)
    {
        if (ModelState.IsValid)
        {
            var CompanyId = UserClaims.GetCompanyId();
            var UserId = Convert.ToInt16(User.FindFirstValue("UserId"));
            return await purchaseInvoiceLineRepository.InsertPreviousStageLinests(model, CompanyId, UserId);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("getrequestinfo")]
    public async Task<PurchaseRequestViewModel> GetPurchaseRequestInfo([FromBody] int id)
    {
        return await purchaseInvoiceLineRepository.GetPurchaseRequestInfo(id);
    }
}

[Route("PU")]
[Authorize]
public class PurchaseInvoiceLineController : Controller
{
    [Route("[controller]/{id}/{isDefaultCurrency}")]
    [HttpGet]
    [Authenticate(Operation.VIW, "PurchaseInvoice")]
    public ActionResult Index(int id, int isDefaultCurrency)
    {
        return PartialView(Views.PU.PurchaseInvoiceLine);
    }

    [Route("[controller]/display/{id}/{requestId}/{isDefaultCurrency}/{stageId}/{workflowId}")]
    [Authenticate(Operation.DIS, "PurchaseInvoice")]
    [HttpGet]
    public ActionResult Display(int id, int requestId, int isDefaultCurrency, short stageId, int workflowId)
    {
        return PartialView(Views.PU.PurchaseInvoiceDisplay);
    }
}