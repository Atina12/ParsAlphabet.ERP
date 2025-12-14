using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionClose;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionClose;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionCounter;

namespace ParseAlphabet.ERP.Web.Modules.MC.AdmissionClose;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class AdmissionCloseApiController(
    IAdmissionCloseRepository admissionCloseRepository,
    IAdmissionCounterRepository admissionCashierRepository,
    IHttpContextAccessor accessor)
    : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<AdmissionCloseGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        if (model.Form_KeyValue[0]?.ToString() == "myadm")
            model.Form_KeyValue[1] = User.FindFirstValue("UserId");

        var userId = UserClaims.GetUserId();
        ;
        return await admissionCloseRepository.GetPage(model, userId);
    }

    [HttpPost]
    [Route("checkexist")]
    public async Task<bool> CheckExistAdmissionClose([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;
        return await admissionCloseRepository.CheckExist(id, companyId, userId);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return admissionCloseRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> AdmissionCloseInsert([FromBody] GetAdmissionCloseWorkday model)
    {
        model.UserId = Convert.ToInt32(User.FindFirstValue("UserId"));

        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();

            return await admissionCloseRepository.AdmissionCloseInsert(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("calculate")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultDataQuery<List<AdmissionCloseWorkDay>>> AdmissionCloseCalculate(
        [FromBody] GetAdmissionCloseWorkday model)
    {
        model.UserId = Convert.ToInt32(User.FindFirstValue("UserId"));

        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            var userId = Convert.ToInt32(User.FindFirstValue("UserId"));
            var result = await admissionCloseRepository.AdmissionCloseCalculate(model, userId);
            result.Successfull = result.Data != null;

            return result;
        }

        return ModelState.ToMyResultDataQuery<List<AdmissionCloseWorkDay>>();
    }

    [HttpPost]
    [Route("displaysummary")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultDataQuery<List<AdmissionCloseWorkDay>>> AdmissionCloseDisplay(
        [FromBody] GetAdmissionCloseWorkday model)
    {
        var result = new MyResultDataQuery<List<AdmissionCloseWorkDay>>();
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            var userId = Convert.ToInt32(User.FindFirstValue("UserId"));

            result.Data = await admissionCloseRepository.AdmissionCloseLineDisplay(model, userId);

            result.Successfull = result.Data != null;

            return result;
        }

        return ModelState.ToMyResultDataQuery<List<AdmissionCloseWorkDay>>();
    }

    [HttpPost]
    [Route("announcementcloseLinedetail")]
    [Authenticate(Operation.VIW, "")]
    public async Task<IEnumerable<AnnouncementDetailCloseLine>> GetAnnouncementCloseLineDetail(
        [FromBody] GetCloseLine model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await admissionCloseRepository.GetAnnouncementAdmissionCloseLine(model);
    }

    [HttpPost]
    [Route("realcloseLinedetail")]
    [Authenticate(Operation.VIW, "")]
    public async Task<IEnumerable<RealDetailCloseLine>> GetRealCloseLineDetail(
        [FromBody] GetRealAnnouncementDetail model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await admissionCloseRepository.GetRealAdmissionCloseLine(model);
    }

    [HttpPost]
    [Route("summarysettlement")]
    [Authenticate(Operation.VIW, "")]
    public async Task<SettlementResult> CheckSummarySettlement([FromBody] GetSettlement model)
    {
        return await admissionCloseRepository.CheckSettlementSummary(model);
    }

    [HttpPost]
    [Route("summarysum")]
    [Authenticate(Operation.VIW, "")]
    public async Task<decimal> SummarySum([FromBody] int headerId)
    {
        return await admissionCloseRepository.GetSumAdmissionClose(headerId);
    }

    [HttpPost]
    [Route("gettreasuryid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<long> GetTreasuryId([FromBody] int headerId)
    {
        return await admissionCloseRepository.GetTreasuryId(headerId);
    }

    [HttpPost]
    [Route("announcementSettlement")]
    [Authenticate(Operation.VIW, "")]
    public async Task<SettlementResult> CheckAnnouncementSettlement([FromBody] GetSettlement model)
    {
        return await admissionCloseRepository.CheckSettlementAnnouncement(model);
    }

    [HttpPost]
    [Route("save")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> AdmissionCloseLineSave([FromBody] AdmissionCloseLineSave model)
    {
        return await admissionCloseRepository.AdmissionCloseLineSave(model);
    }

    [HttpPost]
    [Route("documentinsert")]
    [Authenticate(Operation.INS, "")]
    public async Task<AdmissionCloseInsertResult> AdmissionCloseDocumentInsert([FromBody] GetCloseLine model)
    {
        model.UserId = UserClaims.GetUserId();
        ;
        model.CompanyId = UserClaims.GetCompanyId();
        return await admissionCloseRepository.AdmissionCloseDocumentInsert(model);
    }

    [HttpPost]
    [Route("admissioncashdifference")]
    [Authenticate(Operation.VIW, "")]
    public async Task<List<AdmissionCashDifference>> AdmissionCashDifference([FromBody] GetAdmissionCloseWorkday model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await admissionCloseRepository.AdmissionCashDifference(model);
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultStatus> AdmissionCoseLineDelete([FromBody] int id)
    {
        return await admissionCloseRepository.RemoveRealLine(id);
    }

    [HttpPost]
    [Route("deleteheader")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultStatus> Delete([FromBody] int keyvalue)
    {
        return await admissionCloseRepository.Delete(keyvalue);
    }


    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        if (model.Form_KeyValue[0]?.ToString() == "myadm")
            model.Form_KeyValue[1] = User.FindFirstValue("UserId");

        var userId = UserClaims.GetUserId();
        ;
        return await admissionCloseRepository.Csv(model, userId);
    }

    [HttpPost]
    [Route("differencecsv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportDifferenceCsv([FromBody] GetAdmissionCloseWorkday model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await admissionCloseRepository.DifferenceCsv(model);
    }

    [HttpPost]
    [Route("admissionclosesearch")]
    public async Task<MyResultPage<List<AdmissionCloseRequest>>> AdmissionCloseSearch(
        [FromBody] AdmissionCloseRequestSearchModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await admissionCloseRepository.AdmissionCloseSearch(model);
    }

    [HttpPost]
    [Route("admissionclosecsv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportAdmissionCloseCsv([FromBody] int id)
    {
        return await admissionCloseRepository.AdmissionCloseCSV(id);
    }

    //changed
    [HttpPost]
    [Route("workdaystatus")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultStatus> GetWorkDayDateStatus([FromBody] string workDayDatePersian)
    {
        MyClaim.Init(accessor);
        var companyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;
        var admissionCashier = await admissionCashierRepository.GetRecordByUserId(userId, companyId);
        return await admissionCloseRepository.GetWorkDayStatus(workDayDatePersian, admissionCashier.Data.BranchId);
    }
}

[Route("MC")]
[Authorize]
public class AdmissionCloseController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [CheckRequest]
    [HttpGet]
    public IActionResult Index()
    {
        return PartialView(Views.MC.AdmissionClose);
    }

    [Route("[controller]/form/{id?}/{branchId}")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Form(int? id, short branchId)
    {
        return PartialView(Views.MC.AdmissionCloseForm);
    }
}