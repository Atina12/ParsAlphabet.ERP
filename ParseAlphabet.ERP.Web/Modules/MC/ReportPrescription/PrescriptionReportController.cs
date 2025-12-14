using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.ReportPrescription;
using ParsAlphabet.ERP.Application.Interfaces.MC.ReportPrescription;

namespace ParseAlphabet.ERP.Web.Modules.MC.ReportPrescription;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class PrescriptionReportApiController(IPrescriptionReportRepository prescriptionReportRepository)
    : ControllerBase
{
    [HttpPost]
    [Route("prescriptionreportgetcolumn")]
    public GetColumnsViewModel PrescriptionReportGetColumn()
    {
        return prescriptionReportRepository.RepPrescriptionServiceGetColumn();
    }


    [HttpPost]
    [Route("repdentalgetpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ReportViewModel<List<object>>> RepDentalGetPage([FromBody] GetPrescriptionReportViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await prescriptionReportRepository.PrescriptionReportPreview(model);
    }

    [HttpPost]
    [Route("repdentalcsv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] GetPrescriptionReportViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await prescriptionReportRepository.PrescriptionReportCSV(model);
    }
}

[Route("MC/[controller]")]
[Authorize]
public class PrescriptionReportController : Controller
{
    [Route("PrescriptionReportPreview")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult PrescriptionReportPreview()
    {
        return PartialView(Views.MC.ReportPrescription.RepPerscription);
    }
}