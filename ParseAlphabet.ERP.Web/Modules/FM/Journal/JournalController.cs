using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FM;
using ParsAlphabet.ERP.Application.Dtos.FM.Journal;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.Journal;

namespace ParseAlphabet.ERP.Web.Modules.FM.Journal;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class JournalApiController : ControllerBase
{
    private readonly JournalRepository _journalRepository;

    public JournalApiController(
        JournalRepository journalRepository)
    {
        _journalRepository = journalRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<JournalGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        var userId = UserClaims.GetUserId();
        ;
        model.CompanyId = UserClaims.GetCompanyId();

        if (model.Form_KeyValue[2]?.ToString() == "my")
            model.Form_KeyValue[3] = User.FindFirstValue("UserId");

        var roleId = UserClaims.GetRoleId();
        ;

        return await _journalRepository.GetPage(model, userId, roleId);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<JournalGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        return new MyResultPage<JournalGetRecord>
        {
            Data = await _journalRepository.GetRecordById<JournalGetRecord>(keyvalue, false, "fm")
        };
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> Insert([FromBody] JournalModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.CreateUserId = Convert.ToInt16(User.FindFirstValue("UserId"));
            var roleId = UserClaims.GetRoleId();
            ;
            return await _journalRepository.Insert(model, roleId);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultStatus> Update([FromBody] JournalModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.ModifiedUserId = Convert.ToInt16(User.FindFirstValue("UserId"));
            var roleId = UserClaims.GetRoleId();
            ;
            return await _journalRepository.Update(model, roleId);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("updateinline")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> UpdateInline([FromBody] UpdateJournalInline model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.ModifiedUserId = Convert.ToInt16(User.FindFirstValue("UserId"));
            return await _journalRepository.UpdateInLine(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _journalRepository.Delete(keyvalue, companyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        if (model.Form_KeyValue[2]?.ToString() == "my")
            model.Form_KeyValue[3] = User.FindFirstValue("UserId");

        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;
        return await _journalRepository.Csv(model, userId, roleId);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown()
    {
        var companyId = UserClaims.GetCompanyId();
        return await _journalRepository.GetDropDown("fm", $"CompanyId={companyId}");
    }


    [HttpGet]
    [Route("getdropdown_documentnolist")]
    public async Task<IEnumerable<JournalDocumentMyDropDownViewModel>> GetJournalDocumentNoGetList()
    {
        var companyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await _journalRepository.GetJournalDocumentNoGetList(companyId, roleId);
    }

    [HttpPost]
    [Route("journaldocumentinfo")]
    public async Task<JournalDocumentInfo> GetJournalDocumentInfo([FromBody] int journalId)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _journalRepository.GetJournalDocumentInfo(journalId, CompanyId);
    }

    [HttpPost]
    [Route("journalduplicate")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> JournalDuplicate([FromBody] JournalDuplicate model)
    {
        model.UserId = UserClaims.GetUserId();
        ;
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await _journalRepository.JournalDuplicate(model, roleId);
    }


    [HttpPost]
    [Route("getbysystem")]
    public async Task<bool> GetJournalBySystem([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _journalRepository.GetJournalBySystem(id, companyId);
    }

    [HttpPost]
    [Route("checkexist")]
    public async Task<bool> CheckExistJournalId([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        int userId = Convert.ToInt16(User.FindFirstValue("UserId"));
        return await _journalRepository.CheckExist(id, companyId, userId);
    }

    [HttpPost]
    [Route("getjournalsteplist")]
    public async Task<MyResultDataQuery<List<FinancialStepList>>> GetTreasuryStepList([FromBody] int journalId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _journalRepository.GetJournalStepList(journalId, companyId);
    }

    [HttpPost]
    [Route("updatestep")]
    public async Task<MyResultStatus> UpdateStep([FromBody] UpdateFinanacialStep model)
    {
        model.UserId = UserClaims.GetUserId();
        ;
        model.CompanyId = UserClaims.GetCompanyId();

        if (model.RequestStepId == 13)
            return new MyResultStatus
            {
                Status = 100,
                Successfull = true,
                StatusMessage = "عملیات با موفقیت انجام شد"
            };

        return await _journalRepository.UpdateJournalStep(model);
    }
}

[Route("FM")]
[Authorize]
public class JournalController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.FM.Journal);
    }

    [Route("[controller]/journaldisplay/{id}/{stageId}/{fromType}")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Display(int id, short stageId, int fromType)
    {
        return PartialView(Views.FM.JournalDisplay);
    }
}