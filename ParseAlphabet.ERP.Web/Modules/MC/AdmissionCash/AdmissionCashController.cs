using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionCash;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionCash;

namespace ParseAlphabet.ERP.Web.Modules.MC.AdmissionCash;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class AdmissionCashApiController(AdmissionCashRepository admissionCashRepository) : ControllerBase
{
    [HttpPost]
    [Route("admissioncashdisplay")]
    public async Task<MyResultDataQuery<AdmissionReuestAndPayment>> AdmissionCashDisplay([FromBody] int id)
    {
        var userId = UserClaims.GetUserId();
        ;
        return await admissionCashRepository.AdmissionCashDisplay(id, userId);
    }

    [HttpPost]
    [Route("admissioncashsearch")]
    public async Task<MyResultPage<List<AdmissionCashRequest>>> AdmissionCashSearch(
        [FromBody] AdmissionCashRequestSearchModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;

        return await admissionCashRepository.AdmissionCashSearch(model, roleId);
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<AdmissionCashGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        if (model.Form_KeyValue[0]?.ToString() == "mycash")
            model.Form_KeyValue[1] = User.FindFirstValue("UserId");

        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;
        return await admissionCashRepository.GetPage(model, userId, roleId);
    }

    [HttpPost]
    [Route("getdetailcash")]
    [Authenticate(Operation.VIW, "")]
    public async Task<List<DetailAdmissionCash>> GetDetailCash(DetailCash model)
    {
        return await admissionCashRepository.GetDetailAdmissionCash(model);
    }


    [HttpPost]
    [Route("summarycashfundtype")]
    [Authenticate(Operation.VIW, "")]
    public async Task<IEnumerable<AdmissionCashGrouByFundType>> GetAdmissionCashGroupByFundType(
       GetAdmissionCashGrouByFundType model)
    {
        model.UserId = model.UserId == 0 ? int.Parse(User.FindFirstValue("UserId")) : model.UserId;
        return await admissionCashRepository.GetAdmissionCashGroupByFundType(model);
    }

    [HttpPost]
    [Route("exportcashsummeryusercsv")]
    [Authenticate(Operation.VIW, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCashSummeryUserCsv(
        [FromBody] GetAdmissionCashGrouByFundType model)
    {
        model.UserId = model.UserId == 0 ? int.Parse(User.FindFirstValue("UserId")) : model.UserId;

        return await admissionCashRepository.ExportCashSummeryUserCsv(model);
    }

    [HttpPost]
    [Route("getadmissioncashpaymentinfo")]
    [AllowAnonymous]
    public async Task<MyResultDataStatus<AdmissionPaymentCashInfo>> GetAdmissionType(
        [FromBody] GetAdmissionPaymentCashInfo model)
    {
        try
        {
            var result = await admissionCashRepository.GetAdmissionPaymentCashInfo(model);

            return new MyResultDataStatus<AdmissionPaymentCashInfo>
            {
                Successfull = true,
                ValidationErrors = null,
                Data = result
            };
        }
        catch (Exception ex)
        {
            return new MyResultDataStatus<AdmissionPaymentCashInfo>
            {
                Successfull = false,
                ValidationErrors = new List<string> { ex.ToString() },
                Data = null
            };
        }
    }
}

[Route("MC")]
[Authorize]
public class AdmissionCashController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Index()
    {
        return PartialView(Views.MC.AdmissionCash);
    }

    [Route("[controller]/form/{admissionMasterId?}/{admissionMasterType?}")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Form(int? admissionMasterId, byte? admissionMasterType)
    {
        return PartialView(Views.MC.AdmissionCashForm);
    }

    [Route("[controller]/updatecash/{id?}")]
    [HttpGet]
    [Authenticate(Operation.VIW, "")]
    public IActionResult UpdateCash(int? id)
    {
        return PartialView(Views.MC.AdmissionCashUpd);
    }


    [Route("[controller]/display/{id}")]
    [HttpGet]
    [Authenticate(Operation.VIW, "")]
    public IActionResult Display(int id)
    {
        return PartialView(Views.MC.AdmissionCashDisplay);
    }
}