using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseOrder;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseOrderAction;
using ParsAlphabet.ERP.Application.Dtos.WF.StageActionLog;
using ParsAlphabet.ERP.Application.Interfaces.PU.PurchaseOrderAction;
using static ParsAlphabet.ERP.Application.Enums.Enum;

namespace ParseAlphabet.ERP.Web.Modules.PU.PurchaseOrderAction;

[Route("api/PU/[controller]")]
[ApiController]
[Authorize]
public class PurchaseOrderActionApiController(IPurchaseOrderActionRepository purchaseOrderActionRepository)
    : ControllerBase
{
    [HttpPost]
    [Route("getpurchaseordersteplist")]
    public async Task<MyResultDataQuery<List<PurchaseOrderActionLogList>>> GetPurchaseOrderStepList(
        [FromBody] int purchaseOrderId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await purchaseOrderActionRepository.GetPurchaseOrderStepList(purchaseOrderId, companyId);
    }

    [HttpPost]
    [Route("updatestep")]
    public async Task<PurchaseOrderResultStatus> UpdateStep([FromBody] UpdateAction model)
    {
        model.UserId = UserClaims.GetUserId();
        ;
        model.CompanyId = UserClaims.GetCompanyId();

        return await purchaseOrderActionRepository.UpdatePurchaseOrderStep(model, OperationType.Update);
    }


    [HttpPost]
    [Route("validateupdatestep")]
    public async Task<PurchaseOrderValidateStepResultStatus> ValidateUpdateStep([FromBody] UpdateAction model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await purchaseOrderActionRepository.ValidateUpdateStep(model, OperationType.Update);
    }


    [HttpPost]
    [Route("validatedeletestep")]
    public async Task<List<string>> ValidateDeleteStep([FromBody] PurchaseOrderViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await purchaseOrderActionRepository.ValidateDeleteStep(model);
    }

    [HttpPost]
    [Route("checkisunitcostcalculated")]
    public async Task<int> CheckisUnitCostCalculated([FromBody] int id)
    {
        return await purchaseOrderActionRepository.CheckisUnitCostCalculated(id);
    }

    [HttpPost]
    [Route("getnolastconfirmheader")]
    public async Task<MyResultPage<List<PurchaseOrderNotLastConfirmHeaderViewModel>>>
        GetPurchaseOrderNotLastConfirmHeader([FromBody] int id)
    {
        return await purchaseOrderActionRepository.GetPurchaseOrderNotLastConfirmHeader(id);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "PurchaseOrder")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = Convert.ToInt32(User.FindFirstValue("CompanyId"));

        return await purchaseOrderActionRepository.CsvLastConfirmHeader(model);
    }


    //ریالی کردن برگه سفارش خرید
    [HttpPost]
    [Route("updaterequestprice")]
    public async Task<UpdateRequestPrice> UpdateRequestPrice([FromBody] int id)
    {
        var UserId = UserClaims.GetUserId();
        ;
        return await purchaseOrderActionRepository.UpdateRequestPrice(id, UserId);
    }


    // بررسی دسته بندی های درخواست که بهای تمام شده ندارند قبل از ویرایش گام محاسبه ی بهای تمام شده صورتحساب
    [HttpPost]
    [Route("purchaseordercheckisallocated")]
    public async Task<MyResultPage<List<PurchaseOrderCheckIsAllocatedViewModel>>> GetPurchaseOrderCheckIsAllocated(
        [FromBody] int requestid)
    {
        return await purchaseOrderActionRepository.GetPurchaseOrderCheckIsAllocated(requestid);
    }

    //محاسبه بهای تمام شده صورتحساب
    [HttpPost]
    [Route("updateinvoiceprice")]
    public async Task<UpdateInvoicePrice> UpdateInvoicePrice([FromBody] int id)
    {
        var UserId = UserClaims.GetUserId();
        ;
        var CompanyId = UserClaims.GetCompanyId();
        return await purchaseOrderActionRepository.UpdateInvoicePrice(id, UserId, CompanyId);
    }


    // برگشت از ریالی کردن برگه سفارش خرید
    [HttpPost]
    [Route("returnrequestprice")]
    public async Task<UpdateRequestPrice> ReturnRequestPrice([FromBody] int id)
    {
        var UserId = UserClaims.GetUserId();
        ;
        return await purchaseOrderActionRepository.ReturnRequestPrice(id, UserId);
    }

    //برگشت از محاسبه بهای تمام شده صورتحساب 
    [HttpPost]
    [Route("returninvoiceprice")]
    public async Task<UpdateInvoicePrice> ReturnInvoicePrice([FromBody] int id)
    {
        var UserId = UserClaims.GetUserId();
        ;
        var CompanyId = UserClaims.GetCompanyId();
        return await purchaseOrderActionRepository.ReturnInvoicePrice(id, UserId, CompanyId);
    }
}