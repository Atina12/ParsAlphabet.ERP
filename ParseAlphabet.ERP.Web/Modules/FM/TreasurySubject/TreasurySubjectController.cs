using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FM.TreasurySubject;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.TreasurySubject;

namespace ParseAlphabet.ERP.Web.Modules.FM.TreasurySubject;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class TreasurySubjectApiController : ControllerBase
{
    private readonly IHttpContextAccessor _accessor;
    private readonly TreasurySubjectRepository _treasurySubjectRepository;

    public TreasurySubjectApiController(TreasurySubjectRepository AccountSGLRepository, IHttpContextAccessor accessor)
    {
        _treasurySubjectRepository = AccountSGLRepository;
        _accessor = accessor;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<TreasurySubjectGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _treasurySubjectRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<TreasurySubjectGetRecord> GetRecordById([FromBody] short keyvalue)
    {
        return await _treasurySubjectRepository.GetRecordTreasurySubject(keyvalue);
    }

    [HttpPost]
    [Route("getcashflowcategoryid")]
    public async Task<byte> GetCashFlowCategoryId([FromBody] short keyvalue)
    {
        var companyId = UserClaims.GetCompanyId();

        return await _treasurySubjectRepository.GetCashFlowCategoryId(keyvalue, companyId);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _treasurySubjectRepository.GetColumns();
    }

    [HttpPost]
    [Route("save")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> Insert([FromBody] TreasurySubjectModel model)
    {
        if (ModelState.IsValid)
        {
            MyClaim.Init(_accessor);
            model.IsSecondLang = MyClaim.IsSecondLang;
            model.CompanyId = UserClaims.GetCompanyId();
            return await _treasurySubjectRepository.Save(model);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var companyId = UserClaims.GetCompanyId();
        var resultDelete = await _treasurySubjectRepository.DeleteByTreasurySubjectId(keyvalue);
        if (resultDelete.Successfull) resultDelete = await _treasurySubjectRepository.Delete(keyvalue, "fm", companyId);

        return resultDelete;
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _treasurySubjectRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown/{isActive?}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(byte? isActive)
    {
        var companyId = UserClaims.GetCompanyId();
        var filter = isActive != 2 ? $" IsActive={isActive}" : "";
        return await _treasurySubjectRepository.GetDropDown("fm", $" CompanyId={companyId} AND {filter}");
    }

    [HttpPost]
    [Route("glsglinfo")]
    public async Task<TreasurySubjectAccountGLSGL> GetTreasurySubjectGLSGLInfo([FromBody] GetTreasurySubjectGLSGL model)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _treasurySubjectRepository.GetAccountGLSGLInfo(model, companyId);
    }

    [HttpPost]
    [Route("getstageid")]
    public async Task<short> GetStageId([FromBody] int id)
    {
        return await _treasurySubjectRepository.GetStageId(id, 3);
    }

    [HttpGet]
    [Route("gettreasurysubjectbystageid/{stageId}/{workflowCategoryId}/{stageClassId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetTreasurySubjectByStageId(short stageId,
        byte WorkflowCategoryId, byte stageClassId)
    {
        return await _treasurySubjectRepository.GetTreasurySubjectByStageDropDown(stageId, WorkflowCategoryId,
            stageClassId);
    }
}

[Route("FM")]
[Authorize]
public class TreasurySubjectController : Controller
{
    [Route("[controller]")]
    [HttpGet]
    [Authenticate(Operation.VIW, "")]
    public ActionResult Index()
    {
        return PartialView(Views.FM.TreasurySubject);
    }
}