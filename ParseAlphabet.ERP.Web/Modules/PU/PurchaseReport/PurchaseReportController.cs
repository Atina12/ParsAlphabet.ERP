using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseReport;
using ParsAlphabet.ERP.Infrastructure.Implantation.PU.PurchaseReport;

namespace ParseAlphabet.ERP.Web.Modules.PU.PurchaseReport;

[Route("api/PU/[controller]")]
[ApiController]
[Authorize]
public class PurchaseReportApiController(PurchaseReportRepository purchaseReportRepository) : Controller
{
    [HttpPost]
    [Route("reppurchasecolumns")]
    [Authenticate(Operation.VIW, "")]
    public GetColumnsViewModel PurchaseOrderReportGetColumns()
    {
        return purchaseReportRepository.PurchaseOrderSearchReportGetColumns();
    }

    [HttpPost]
    [Route("purchasereportpreview")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ReportViewModel<List<PurchaseReportPreviewModel>>> PurchaseOrderReportPreview(
        [FromBody] GetPurchaseOrderSearchReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await purchaseReportRepository.PurchaseOrderReportPreview(model, roleId);
    }

    [HttpPost]
    [Route("purchasereportpreviewsum")]
    [Authenticate(Operation.VIW, "")]
    public async Task<SumPurchaseReportPreview> SumPurchaseOrderReportPreview(
        [FromBody] GetPurchaseOrderSearchReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await purchaseReportRepository.SumPurchaseOrderReportPreview(model, roleId);
    }


    [HttpPost]
    [Route("reppurchasecsv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] GetPurchaseOrderSearchReport model)
    {
        model.CompanyId = Convert.ToInt32(User.FindFirstValue("CompanyId"));

        var roleId = UserClaims.GetRoleId();
        ;
        return await purchaseReportRepository.Csv(model, roleId);
    }
}

[Route("PU")]
[Authorize]
public class PurchaseReportController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Index()
    {
        return View(Views.PU.Report);
    }
}