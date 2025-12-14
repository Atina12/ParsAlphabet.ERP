using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.ReportControl;
using ParsAlphabet.ERP.Application.Interfaces.MC.ReportControl;

namespace ParseAlphabet.ERP.Web.Modules.MC.ReportControl;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class ReportControlApiController : ControllerBase
{
    private readonly IReportControlRepository _reportControlRepository;

    public ReportControlApiController(IReportControlRepository reportControlRepository)
    {
        _reportControlRepository = reportControlRepository;
    }

    [HttpPost]
    [Route("servicecontrolcolumns")]
    public GetColumnsViewModel ServiceControlColumns()
    {
        return _reportControlRepository.ServiceControlGetColumns();
    }

    [HttpPost]
    [Route("servicecontrolgetpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ReportViewModel<List<ServiceControl>>> ServiceControlGetPage([FromBody] GetServiceControl model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _reportControlRepository.ServiceControlGetPage(model);
    }

    [HttpPost]
    [Route("servicecontrolcsv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ServiceControlCsv([FromBody] GetServiceControl model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _reportControlRepository.ServiceControlCsv(model);
    }

    [HttpPost]
    [Route("insurercontrolcolumns")]
    public GetColumnsViewModel InsurerControlColumns()
    {
        return _reportControlRepository.InsurerControlGetColumns(1);
    }

    [HttpPost]
    [Route("insurercontrolgetpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ReportViewModel<List<InsurerControl>>> InsurerControlGetPage([FromBody] GetServiceControl model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _reportControlRepository.InsurerControlGetPage(model);
    }

    [HttpPost]
    [Route("insurercontrolcsv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> InsurereControlCsv([FromBody] GetServiceControl model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _reportControlRepository.InsurerControlCsv(model);
    }

    [HttpPost]
    [Route("attendercontrolcolumns")]
    public GetColumnsViewModel AttenderControlColumns()
    {
        return _reportControlRepository.AttenderControlGetColumns(1);
    }

    [HttpPost]
    [Route("attendercontrolgetpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ReportViewModel<List<AttenderControl>>> AttenderControlGetPage(
        [FromBody] GetAttenderControl model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _reportControlRepository.AttenderControlGetPage(model);
    }

    [HttpPost]
    [Route("attendercontrolcsv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> AttenderControlCsv([FromBody] GetAttenderControl model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _reportControlRepository.AttenderControlCsv(model);
    }
}

[Route("MC/[controller]")]
[Authorize]
public class ReportControlController : Controller
{
    [Route("ServiceControl")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult ServiceControl()
    {
        return PartialView(Views.MC.ReportControl.ServiceControl);
    }

    [Route("InsurerControl")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult InsurerControl()
    {
        return PartialView(Views.MC.ReportControl.InsurerControl);
    }

    [Route("AttenderControl")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult AttenderControl()
    {
        return PartialView(Views.MC.ReportControl.AttenderControl);
    }
}