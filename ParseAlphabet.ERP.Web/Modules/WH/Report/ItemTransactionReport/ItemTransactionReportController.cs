using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.WH.Report.ItemTransactionReport;
using ParsAlphabet.ERP.Application.Interfaces.WF.Report.ItemTransactionReport;

namespace ParseAlphabet.ERP.Web.Modules.WH.Report.ItemTransactionReport;

[Route("api/WH/[controller]")]
[ApiController]
[Authorize]
public class ItemTransactionReportApiController(IItemTransactionReportRepository iItemTransactionReportRepository)
    : Controller
{
    [HttpPost]
    [Route("repitemtransactioncolumns")]
    [Authenticate(Operation.VIW, "")]
    public GetColumnsViewModel PurchaseOrderReportGetColumns()
    {
        return iItemTransactionReportRepository.ItemTransactionReportGetColumns();
    }

    [HttpPost]
    [Route("repitemtransactionpreview")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ReportViewModel<List<ItemTransactioneReportPreviewModel>>> PurchaseOrderReportPreview(
        [FromBody] GetItemTransactionReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await iItemTransactionReportRepository.ItemTransactionReportPreview(model, roleId);
    }

    [HttpPost]
    [Route("repitemtransactionpreviewsum")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ItemtransactionReportSum> ItemTransactionReportPreviewSum(
        [FromBody] GetItemTransactionReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await iItemTransactionReportRepository.ItemTransactionReportPreviewSum(model, roleId);
    }


    [Route("repitemtransactioncsv")]
    [Authenticate(Operation.PRN, "")]
    [HttpGet]
    public async Task<ActionResult> AttenderComissionExportCSV(string stringedModel)
    {
        var model = JsonConvert.DeserializeObject<GetItemTransactionReport>(stringedModel);
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        var resultCsv = await iItemTransactionReportRepository.ItemTransactionReportCsv(model, roleId);

        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "گزارش جستجوی انبار.csv" };
    }
}

[Route("WH")]
[Authorize]
public class ItemTransactionReportController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Index()
    {
        return View(Views.WH.Report.ItemTransactionReport);
    }
}