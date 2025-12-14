using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.ReportImaging;
using ParsAlphabet.ERP.Application.Interfaces.MC.ReportImaging;

namespace ParseAlphabet.ERP.Web.Modules.MC.ReportImaging;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class ImagingReportApiController : ControllerBase
{
    private readonly IImagingReportRepository _imagingReportRepository;

    public ImagingReportApiController(
        IImagingReportRepository imagingReportRepository)
    {
        _imagingReportRepository = imagingReportRepository;
    }

    [HttpPost]
    [Route("repimagingcolumns")]
    public GetColumnsViewModel ImagingColumns()
    {
        return _imagingReportRepository.ImagingReportGetColumns();
    }

    [HttpPost]
    [Route("repimaging")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ReportViewModel<List<ImagingReport>>> ImagingReport([FromBody] ImagingReportInputModel model)
    {
        return await _imagingReportRepository.ImagingReportPreview(model);
    }

    [HttpPost]
    [Route("repimagingsum")]
    [Authenticate(Operation.VIW, "")]
    public async Task<SumImagingReport> SumImagingReport([FromBody] ImagingReportInputModel model)
    {
        return await _imagingReportRepository.ImagingReportSumTotal(model);
    }

    [Route("repimagingcsv")]
    [Authenticate(Operation.PRN, "")]
    [HttpGet]
    public async Task<ActionResult> ExportCsvImaging(string stringedModel)
    {
        var model = JsonConvert.DeserializeObject<ImagingReportInputModel>(stringedModel);

        var resultCsv = await _imagingReportRepository.ImagingReportCSV(model);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "گزارش تصویربرداری.csv" };
    }

    [HttpGet]
    [Route("generatepdf")]
    [Authenticate(Operation.VIW, "")]
    public async Task<FileContentResult> Createpdf(string stringedModel)
    {
        var model = JsonConvert.DeserializeObject<ImagingReportInputModel>(stringedModel);

        var userId = UserClaims.GetUserId();
        ;
        var result = await _imagingReportRepository.GenerateImagePDF(model, userId);

        var File = new FileContentResult(result, "application/zip");
        return File;
    }
}

[Route("MC/[controller]")]
[Authorize]
public class ImagingReportController : Controller
{
    [Route("ImagingReportPreview")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult ImagingReportPreview()
    {
        return PartialView(Views.MC.ReportImaging.RepImaging);
    }
}