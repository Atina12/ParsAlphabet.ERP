using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.WH.Report.ItemTransactionTrialBalancesReport;
using ParsAlphabet.ERP.Application.Interfaces.WF.Report.ItemTransactionTrialBalancesReport;
using static ParsAlphabet.ERP.Application.Enums.Enum;

namespace ParseAlphabet.ERP.Web.Modules.WH.Report.ItemTransactionTrialBalancesReport;

[Route("api/WH/[controller]")]
[ApiController]
[Authorize]
public class ItemTransactionTrialBalancesReportApiController(
    IItemTransactionTrialBalancesReportRepository itemTransactionTrialBalancesReportRepository)
    : ControllerBase
{
    [HttpPost]
    [Route("repitemtransactionlevelwarehousegetcolumns")]
    [Authenticate(Operation.VIW, "")]
    public GetColumnsViewModel LevelWarhouseGetColumns()
    {
        return itemTransactionTrialBalancesReportRepository.LevelWarhouseGetColumns(false, true);
    }

    [HttpPost]
    [Route("repitemtransactionlevelzonegetcolumns")]
    [Authenticate(Operation.VIW, "")]
    public GetColumnsViewModel LevelZoneGetColumns()
    {
        return itemTransactionTrialBalancesReportRepository.LevelZoneGetColumns(false, true);
    }

    [HttpPost]
    [Route("repitemtransactionlevelbingetcolumns")]
    [Authenticate(Operation.VIW, "")]
    public GetColumnsViewModel LevelBinGetColumns()
    {
        return itemTransactionTrialBalancesReportRepository.LevelBinGetColumns(false, true);
    }

    [HttpPost]
    [Route("repitemtransactionnotewarehousecolumns")]
    [Authenticate(Operation.VIW, "")]
    public GetColumnsViewModel NotWarehouseGetColumns()
    {
        return itemTransactionTrialBalancesReportRepository.NoteWarhouseColumns(false, true);
    }

    [HttpPost]
    [Route("repitemtransactionnotezonecolumns")]
    [Authenticate(Operation.VIW, "")]
    public GetColumnsViewModel NotZoneGetColumns()
    {
        return itemTransactionTrialBalancesReportRepository.NoteZoneColumns(false, true);
    }

    [HttpPost]
    [Route("repitemtransactionnotebincolumns")]
    [Authenticate(Operation.VIW, "")]
    public GetColumnsViewModel NotBinGetColumns()
    {
        return itemTransactionTrialBalancesReportRepository.NoteBinColumns(false, true);
    }

    [HttpPost]
    [Route("repitemtransactiontrialbalancepreview")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ReportViewModel<List<ItemTransactionTrialBalancesReportPreviewModel>>> PurchaseOrderReportPreview(
        [FromBody] GetItemTransactionTrialBalancesReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        var roleId = UserClaims.GetRoleId();
        ;
        return await itemTransactionTrialBalancesReportRepository.ItemTransactionTrialBalancesReportPreview(model,
            roleId, false);
    }

    [HttpPost]
    [Route("repitemtransactiontrialbalancesum")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ItemTransactionReportSum> ItemTransactionTrialBalancesReportSum(
        [FromBody] GetItemTransactionTrialBalancesReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await itemTransactionTrialBalancesReportRepository.ItemTransactionTrialBalancesReportSum(model, roleId);
    }


    [HttpPost]
    [Route("getItemTransactionTrialBalanceReportJsonForTree")]
    [Authenticate(Operation.VIW, "")]
    public async Task<List<GetItemTransactionTrialBalanceHeaderTreeViewModel>> GetJournalTrialReportJsonForTree(
        [FromBody] GetItemTransactionTrialBalancesReport model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await itemTransactionTrialBalancesReportRepository.GetItemTransactionTrialBalanceReportJsonForTree(
            model, roleId);
    }

    [Route("repitemtransactiontrialbalancecsv")]
    [Authenticate(Operation.PRN, "")]
    [HttpGet]
    public async Task<ActionResult> AttenderComissionExportCSV(string stringedModel)
    {
        var fileDownloadName = "";
        var model = JsonConvert.DeserializeObject<GetItemTransactionTrialBalancesReport>(stringedModel);

        model.CompanyId = UserClaims.GetCompanyId();

        var roleId = UserClaims.GetRoleId();
        ;

        var resultCsv =
            await itemTransactionTrialBalancesReportRepository.ItemTransactionTrialBalancesReportCsv(model, roleId);

        switch (model.ReportType)
        {
            case ReportItemTransactionTrialBalanceType.LevelWarhouse:
                fileDownloadName = "تراز انبار.csv";
                break;
            case ReportItemTransactionTrialBalanceType.LevelWarhouseZone:
                fileDownloadName = "تراز انبار بخش.csv";
                break;
            case ReportItemTransactionTrialBalanceType.LevelWarhouseZoneBin:
                fileDownloadName = "تراز انبار بخش پالت.csv";
                break;
            case ReportItemTransactionTrialBalanceType.NoteWarhouse:
                fileDownloadName = "کاردکس انبار.csv";
                break;
            case ReportItemTransactionTrialBalanceType.NoteWarhouseZone:
                fileDownloadName = "کاردکس انبار بخش.csv";
                break;
            case ReportItemTransactionTrialBalanceType.NoteWarhouseZoneBin:
                fileDownloadName = "کاردکس انبار بخش پالت.csv";
                break;
        }

        return new FileStreamResult(resultCsv, "text/csv")
        {
            FileDownloadName = fileDownloadName
        };
    }

    [HttpPost]
    [Route("getDateRange")]
    [Authenticate(Operation.VIW, "")]
    public Tuple<DateTime?, DateTime?> GetDateRange([FromBody] string persianDate)
    {
        var date = persianDate.ToMiladiDateTime().Value;
        return itemTransactionTrialBalancesReportRepository.GenerateDateRange(date);
    }
}

[Route("WH")]
[Authorize]
public class ItemTransactionTrialBalancesReportController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Index()
    {
        return View(Views.WH.Report.ItemTransactionTrialBalancesReport);
    }
}