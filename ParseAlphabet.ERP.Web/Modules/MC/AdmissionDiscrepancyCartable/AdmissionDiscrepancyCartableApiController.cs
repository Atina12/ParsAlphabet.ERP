using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionDiscrepancyCartable;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionDiscrepancyCartable;

namespace ParseAlphabet.ERP.Web.Modules.MC.AdmissionDiscrepancyCartable;

[Route("api/MC/[controller]")]
[ApiController]
public class AdmissionDiscrepancyCartableApiController : ControllerBase
{
    private readonly AdmissionDiscrepancyCartableRepository _repository;

    public AdmissionDiscrepancyCartableApiController(AdmissionDiscrepancyCartableRepository repository)
    {
        _repository = repository;
    }

    [HttpPost]
    [Route("summaryreport1")]
    public async Task<MyResultPage<IEnumerable<AdmissionDiscrepancySummaryViewModel1>>> AdmissionDiscrepancy1(
        [FromBody] GetAdmissionDiscrepancy model)
    {
        var claims = HttpContext.User.Claims.ToList();
        var roleId = claims.FirstOrDefault(x => x.Type == "RoleId")?.Value;
        model.CreateUserId = int.Parse(claims.FirstOrDefault(x => x.Type == "UserId")?.Value ??
                                       throw new InvalidOperationException());
        var result = await _repository.GetAdmissionDiscrepancy1(model, Convert.ToByte(roleId));
        return result;
    }

    [HttpPost]
    [Route("detailreport2")]
    public async Task<MyResultPage<IEnumerable<AdmissionDiscrepancyDetailViewModel2>>> AdmissionDiscrepancy2(
        GetAdmissionDiscrepancy model)
    {
        var roleId = UserClaims.GetRoleId();
        ;
        model.CreateUserId = UserClaims.GetUserId();
        ;

        var result = await _repository.GetAdmissionDiscrepancy2(model, Convert.ToByte(roleId));
        return result;
    }

    [HttpPost]
    [Route("cashdetailreport3")]
    public async Task<MyResultPage<IEnumerable<AdmissionDiscrepancyCashDetailViewModel3>>> AdmissionDiscrepancy3(
        GetAdmissionDiscrepancy model)
    {
        var roleId = UserClaims.GetRoleId();
        ;
        model.CreateUserId = UserClaims.GetUserId();
        ;
        var result = await _repository.GetAdmissionDiscrepancy3(model, Convert.ToByte(roleId));
        return result;
    }

    [HttpPost]
    [Route("cashdetailreport4")]
    public async Task<MyResultPage<IEnumerable<AdmissionDiscrepancyCashFundTypeSummaryViewModel4>>>
        AdmissionDiscrepancy4(GetAdmissionDiscrepancy model)
    {
        var roleId = UserClaims.GetRoleId();
        ;
        model.CreateUserId = UserClaims.GetUserId();
        ;
        var result = await _repository.GetAdmissionDiscrepancy4(model, Convert.ToByte(roleId));
        return result;
    }

    [HttpPost]
    [Route("sumdetailreport2")]
    public async Task<MyResultPage<IEnumerable<SumGetAdmissionDiscrepancy>>> SumAdmissionDiscrepancy2(
        GetAdmissionDiscrepancy model)
    {
        var roleId = UserClaims.GetRoleId();
        ;
        model.CreateUserId = UserClaims.GetUserId();
        ;
        var result = await _repository.SumGetAdmissionDiscrepancy2(model, Convert.ToByte(roleId));
        return result;
    }

    [HttpPost]
    [Route("sumcashdetailreport3")]
    public async Task<MyResultPage<IEnumerable<SumGetAdmissionDiscrepancy>>> SumAdmissionDiscrepancy3(
        GetAdmissionDiscrepancy model)
    {
        var roleId = UserClaims.GetRoleId();
        ;
        model.CreateUserId = UserClaims.GetUserId();
        ;
        var result = await _repository.SumGetAdmissionDiscrepancy3(model, Convert.ToByte(roleId));
        return result;
    }


    [Route("exportcashdetailreport2")]
    [HttpGet]
    public async Task<ActionResult> ExportCsvAdmissionDiscrepancy2(string stringedModel)
    {
        var model = JsonConvert.DeserializeObject<GetAdmissionDiscrepancy>(stringedModel);
        model.CreateUserId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;
        var resultCsv = await _repository.AdmissionDiscrepancy2Csv(model, Convert.ToByte(roleId));
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "کارتابل مغایرت.csv" };
    }

    [Route("exportcashdetailreport3")]
    [HttpGet]
    public async Task<ActionResult> ExportCsvAdmissionDiscrepancy3(string stringedModel)
    {
        var model = JsonConvert.DeserializeObject<GetAdmissionDiscrepancy>(stringedModel);
        model.CreateUserId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;
        var resultCsv = await _repository.AdmissionDiscrepancy3Csv(model, Convert.ToByte(roleId));
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "کارتابل مغایرت.csv" };
    }
}

[Route("MC")]
[Authorize]
public class AdmissionDiscrepancyCartableController : Controller
{
    [Route("[controller]")]
    [CheckRequest]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Index()
    {
        return PartialView(Views.MC.AdmissionDiscrepancyCartable);
    }
}