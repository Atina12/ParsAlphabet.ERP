using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.AttenderServicePriceLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AttenderServicePriceLine;

namespace ParseAlphabet.ERP.Web.Modules.MC.AttenderServicePriceLine;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class AttenderServicePriceLineApiController : ControllerBase
{
    private readonly AttenderServicePriceLineRepository _attenderServicePriceLineRepository;

    public AttenderServicePriceLineApiController(AttenderServicePriceLineRepository attenderServicePriceLineRepository)
    {
        _attenderServicePriceLineRepository = attenderServicePriceLineRepository;
    }


    [HttpPost]
    [Route("getfilterdiassign")]
    [Authenticate(Operation.VIW, "AttenderServicePrice")]
    public GetColumnsViewModel GetFilterParametersDiAssign()
    {
        return _attenderServicePriceLineRepository.GetColumnsDiAssign();
    }

    [HttpPost]
    [Route("getfilterassign")]
    [Authenticate(Operation.VIW, "AttenderServicePrice")]
    public GetColumnsViewModel GetFilterParametersAssign()
    {
        return _attenderServicePriceLineRepository.GetColumnsAssign();
    }

    [HttpPost]
    [Route("getpagediassign")]
    [Authenticate(Operation.VIW, "AttenderServicePrice")]
    public async Task<MyResultPage<AttenderServicePriceDiAssignGetPage>> GetPageDiAssign(
        [FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _attenderServicePriceLineRepository.GetPageDiAssigns(model);
    }

    [HttpPost]
    [Route("getpageassign")]
    [Authenticate(Operation.VIW, "AttenderServicePrice")]
    public async Task<MyResultPage<AttenderServicePriceAssignGetPage>> GetPageAssign(
        [FromBody] NewGetPageViewModel pageViewModel)
    {
        pageViewModel.CompanyId = UserClaims.GetCompanyId();
        return await _attenderServicePriceLineRepository.GetPageAssigns(pageViewModel);
    }

    [HttpPost]
    [Route("getpageattendersendhistorygetpage")]
    [Authenticate(Operation.VIW, "AttenderServicePrice")]
    public async Task<MyResultPage<List<AttenderServiceSendHistoryGetpage>>> GetPageAttenderServiceSendHistory(
        [FromBody] NewGetPageViewModel pageViewModel)
    {
        return await _attenderServicePriceLineRepository.GetPageAttenderServiceSendHistory(pageViewModel);
    }

    [HttpPost]
    [Route("sendcentralattenderservice")]
    [Authenticate(Operation.INS, "AttenderServicePrice")]
    public async Task<MyResultStatus> SendCentralAttenderService([FromBody] int id)
    {
        var userId = UserClaims.GetUserId();
        ;
        return await _attenderServicePriceLineRepository.SendCentralAttenderService(id, userId);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "AttenderServicePrice")]
    public async Task<MyResultQuery> Insert([FromBody] AttenderServicePriceLineModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.CreateUserId = UserClaims.GetUserId();
        ;
        return await _attenderServicePriceLineRepository.AttenderServicePriceAssign(model);
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "AttenderServicePrice")]
    public async Task<MyResultQuery> Delete([FromBody] AttenderServicePriceLineModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _attenderServicePriceLineRepository.AttenderServicePriceDiAssign(model);
    }

    [HttpPost]
    [Route("csv")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _attenderServicePriceLineRepository.Csv(model);
    }

    [HttpPost]
    [Route("attenderduplicate")]
    [Authenticate(Operation.INS, "AttenderServicePrice")]
    public async Task<int> AttenderDuplicate([FromBody] AttenderDuplicate model)
    {
        model.CreateUserId = UserClaims.GetUserId();
        ;
        return await _attenderServicePriceLineRepository.AttenderDuplicate(model);
    }

    [HttpPost]
    [Route("attenderservicelist")]
    public async Task<List<AttenderServiceList>> AttenderServiceList([FromBody] int attenderId)
    {
        return await _attenderServicePriceLineRepository.AttenderServiceGetList(attenderId);
    }

    [Route("csvattenderservicelist/{attenderId}")]
    [Authenticate(Operation.PRN, "AttenderServicePrice")]
    [HttpGet]
    public async Task<ActionResult> AttenderServiceReportExportCsv(int attenderId)
    {
        var resultCsv = await _attenderServicePriceLineRepository.CSVAttenderServiceList(attenderId);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = $"خدمات معالج_{attenderId}.csv" };
    }

    [HttpGet]
    [Route("getdropdown/{attenderId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(int attenderid)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _attenderServicePriceLineRepository.GetDropDown(attenderid, CompanyId);
    }

    [HttpGet]
    [Route("getpropertiesdropdown/{attenderid}/{medicalsubjectid}/{attendermarginbracketid}/{type}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetPropertiesDropdown(int attenderid, byte? medicalsubjectid,
        int? attendermarginbracketid, byte type)
    {
        return await _attenderServicePriceLineRepository.GetPropertiesDropdown(attenderid, medicalsubjectid,
            attendermarginbracketid, type);
    }
}

[Route("MC")]
[Authorize]
public class AttenderServicePriceLineController : Controller
{
    [Route("[controller]/{attenderId}/{attenderFullName}/{departmentId}")]
    [Authenticate(Operation.VIW, "AttenderServicePrice")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.MC.AttenderServicePriceLine);
    }
}