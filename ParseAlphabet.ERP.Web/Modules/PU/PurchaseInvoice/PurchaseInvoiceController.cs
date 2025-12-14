using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseInvoice;
using ParsAlphabet.ERP.Application.Interfaces.PU.PurchaseInvoice;

namespace ParseAlphabet.ERP.Web.Modules.PU.PurchaseInvoice;

[Route("api/PU/[controller]")]
[ApiController]
[Authorize]
public class PurchaseInvoiceApiController(IPurchaseInvoiceRepository PurchasePersonInvoiceRepository) : ControllerBase
{
    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "PurchaseInvoice")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        if (model.Form_KeyValue[0]?.ToString() == "myadm")
            model.Form_KeyValue[1] = User.FindFirstValue("UserId");

        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;
        return await PurchasePersonInvoiceRepository.Csv(model, userId, roleId);
    }

    [HttpGet]
    [Route("requestitemtypegetdropdown/{requestId}/{currentWorkflowCategoryId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> RequestFundType_GetDropDown(long requestId,
        byte currentWorkflowCategoryId = 1)
    {
        var companyId = UserClaims.GetCompanyId();
        return await PurchasePersonInvoiceRepository.RequestItemType_GetDropDown(requestId, companyId,
            currentWorkflowCategoryId);
    }

    [HttpGet]
    [Route("personinvoicerequest_getdropdown/{branchId}/{workflowId}/{stageId}/{requestId?}/{purchaseOrderId?}")]
    public async Task<List<PurchaseInvoiceParentIdMyDropdownViewModel>> PersonInvoiceRequest_GetDropDown(short branchId,
        short workflowId, short stageId, long? requestId, long? purchaseOrderId)
    {
        var companyId = UserClaims.GetCompanyId();

        return await PurchasePersonInvoiceRepository.PurchaseInvoiceRequest_GetDropDown(branchId, workflowId, companyId,
            stageId, requestId, purchaseOrderId);
    }

    [HttpPost]
    [Route("getpersoninvoicerequestglsgl")]
    public async Task<PurchaseInvoiceRequestGLSGL> GetPersonInvoiceRequestGLSGL([FromBody] int personOrderId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await PurchasePersonInvoiceRepository.GetRequestPurchaseInvoiceGLSGL(personOrderId, companyId);
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "PurchaseInvoice")]
    public async Task<MyResultPage<List<PurchaseInvoiceGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        if (model.Form_KeyValue[0]?.ToString() == "myadm")
            model.Form_KeyValue[1] = User.FindFirstValue("UserId");

        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;

        return await PurchasePersonInvoiceRepository.GetPage(model, userId, roleId);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "PurchaseInvoice")]
    public async Task<MyResultPage<PurchaseInvoiceGetRecord>> GetRecordById([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await PurchasePersonInvoiceRepository.GetRecordById(id, companyId);
    }


    [HttpGet]
    [Route("getPersonVendorId/{personId}")]
    [Authenticate(Operation.VIW, "PurchaseInvoice")]
    public async Task<long> GetPersonVendorId(long personId)
    {
        return await PurchasePersonInvoiceRepository.GetPersonVendorId(personId);
    }


    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        var companyId = UserClaims.GetCompanyId();
        return PurchasePersonInvoiceRepository.GetColumns(companyId);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "PurchaseInvoice")]
    public async Task<MyResultQuery> Insert([FromBody] PurchaseInvoiceModel model)
    {
        if (ModelState.IsValid)
        {
            model.UserId = Convert.ToInt32(User.FindFirstValue("UserId"));
            model.CompanyId = UserClaims.GetCompanyId();
            var roleId = UserClaims.GetRoleId();
            ;
            return await PurchasePersonInvoiceRepository.Insert(model, roleId);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "PurchaseInvoice")]
    public async Task<MyResultStatus> Update([FromBody] PurchaseInvoiceModel model)
    {
        if (ModelState.IsValid)
        {
            model.UserId = Convert.ToInt32(User.FindFirstValue("UserId"));
            model.CompanyId = UserClaims.GetCompanyId();
            var roleId = UserClaims.GetRoleId();
            ;
            return await PurchasePersonInvoiceRepository.Update(model, roleId);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "PurchaseInvoice")]
    public async Task<MyResultStatus> Delete([FromBody] int keyvalue)
    {
        var companyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await PurchasePersonInvoiceRepository.Delete(keyvalue, companyId, roleId);
    }

    [HttpPost]
    [Route("checkexist")]
    public async Task<bool> PersonIncoiveCheckExist([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await PurchasePersonInvoiceRepository.CheckExist(id, companyId, userId, roleId);
    }

    [HttpGet]
    [Route("noseriesnamewhitstage_getname/{stageId}")]
    public async Task<List<MyDropDownViewModel>> Noseriesnamewhitstage_GetName(short stageId)
    {
        return await PurchasePersonInvoiceRepository.NoSeriesNameWhitStage_GetDropDown(stageId);
    }
}

[Route("PU")]
[Authorize]
public class PurchaseInvoiceController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.PU.PurchaseInvoice);
    }
}