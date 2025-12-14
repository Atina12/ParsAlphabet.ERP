using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.ReportDental;
using ParsAlphabet.ERP.Application.Interfaces.MC.ReportDental;

namespace ParseAlphabet.ERP.Web.Modules.MC.ReportDental;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class DentalReportApiController : ControllerBase
{
    private readonly IDentalReportRepository _dentalReportRepository;

    public DentalReportApiController(IDentalReportRepository dentalReportRepository)
    {
        _dentalReportRepository = dentalReportRepository;
    }

    [HttpPost]
    [Route("repdentalcolumns")]
    public GetColumnsViewModel RepDentalColumns()
    {
        return _dentalReportRepository.DentalReportGetColumns();
    }

    [HttpPost]
    [Route("repdentalgetpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ReportViewModel<List<object>>> RepDentalGetPage([FromBody] GetDentalReportViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _dentalReportRepository.DentalReportPreview(model);
    }

    [HttpPost]
    [Route("repdentalcsv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] GetDentalReportViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _dentalReportRepository.DentalReportCSV(model);
    }
}

[Route("MC/[controller]")]
[Authorize]
public class DentalReportController : Controller
{
    [Route("DentalReportPreview")]
    [HttpGet]
    public IActionResult DentalReportPreview()
    {
        return PartialView(Views.MC.ReportDental.RepDental);
    }
}