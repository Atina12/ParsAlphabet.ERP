using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseOrder;
using ParsAlphabet.ERP.Infrastructure.Implantation.PU.PurchaseOrder;

namespace ParseAlphabet.ERP.Web.Modules.PU.PurchaseOrder;

[Route("api/PU/[controller]")]
[ApiController]
[Authorize]
public class PurchaseOrderApiController(PurchaseOrderRepository purchaseRepository) : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "PurchaseOrder")]
    public async Task<MyResultPage<List<PurchaseOrderGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = Convert.ToInt32(User.FindFirstValue("CompanyId"));
        if (model.Form_KeyValue[0]?.ToString() == "myadm")
            model.Form_KeyValue[1] = User.FindFirstValue("UserId");

        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;
        return await purchaseRepository.GetPage(model, userId, roleId);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "PurchaseOrder")]
    public async Task<MyResultPage<PurchaseOrderGetRecord>> GetRecordById([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await purchaseRepository.GetRecordById(id, companyId);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        var companyId = Convert.ToInt32(User.FindFirstValue("CompanyId"));
        return purchaseRepository.GetColumns(companyId);
    }

    [HttpPost]
    [Route("allocationfilter")]
    public GetColumnsViewModel GetFilterParametersAllocation()
    {
        return purchaseRepository.AllocationColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "PurchaseOrder")]
    public async Task<MyResultQuery> Insert([FromBody] PurchaseOrderModel model)
    {
        if (ModelState.IsValid)
        {
            model.UserId = Convert.ToInt16(User.FindFirstValue("UserId"));
            model.CompanyId = Convert.ToInt32(User.FindFirstValue("CompanyId"));
            var roleId = UserClaims.GetRoleId();
            ;
            return await purchaseRepository.Insert(model, roleId);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "PurchaseOrder")]
    public async Task<MyResultStatus> Update([FromBody] PurchaseOrderModel model)
    {
        if (ModelState.IsValid)
        {
            model.UserId = Convert.ToInt16(User.FindFirstValue("UserId"));
            model.CompanyId = Convert.ToInt32(User.FindFirstValue("CompanyId"));
            var roleId = UserClaims.GetRoleId();
            ;
            return await purchaseRepository.Update(model, roleId);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "PurchaseOrder")]
    public async Task<MyResultStatus> Delete([FromBody] int keyvalue)
    {
        var companyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await purchaseRepository.Delete(keyvalue, companyId, roleId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "PurchaseOrder")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = Convert.ToInt32(User.FindFirstValue("CompanyId"));
        if (model.Form_KeyValue[0]?.ToString() == "myadm")
            model.Form_KeyValue[1] = User.FindFirstValue("UserId");

        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;
        return await purchaseRepository.Csv(model, userId, roleId);
    }

    [HttpPost]
    [Route("checkexist")]
    public async Task<bool> PurchaseOrderCheckExist([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;
        return await purchaseRepository.CheckExist(id, companyId, userId, roleId);
    }

    [HttpPost]
    [Route("getinfo")]
    public async Task<PurchaseOrderViewModel> GetPurchaseInfo([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await purchaseRepository.GetPurchaseOrderInfo(id, companyId);
    }
}

[Route("PU")]
[Authorize]
public class PurchaseOrderController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "PurchaseOrder")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.PU.PurchaseOrder);
    }
}