using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.GN.NoSeriesLine;
using ParsAlphabet.ERP.Application.Interfaces.GN.NoSeriesLine;

namespace ParseAlphabet.ERP.Web.Modules.GN.NoSeriesLine;

[Route("api/GN/[controller]")]
[ApiController]
[Authorize]
public class NoSeriesLineApiController : ControllerBase
{
    private readonly INoSeriesLineRepository _NoSeriesLineRepository;

    public NoSeriesLineApiController(INoSeriesLineRepository NoSeriesLineRepository)
    {
        _NoSeriesLineRepository = NoSeriesLineRepository;
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _NoSeriesLineRepository.Csv(model);
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<NoSeriesLineGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _NoSeriesLineRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<NoSeriesLineGetRecord>> GetRecordById([FromBody] NoSeriesLineModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _NoSeriesLineRepository.GetRecordById(model.LineNo, model.HeaderId, model.CompanyId);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _NoSeriesLineRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] NoSeriesLineModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _NoSeriesLineRepository.Insert(model);
        }

        return ModelState.ToMyResultQuery<MyResultQuery>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] NoSeriesLineModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _NoSeriesLineRepository.Update(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] NoSeriesLineModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _NoSeriesLineRepository.Delete(model.LineNo, model.HeaderId, model.CompanyId);
    }

    [HttpGet]
    [Route("getdropdown_noseries")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown()
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _NoSeriesLineRepository.GetDropDownNoSeries(CompanyId);
    }


    [HttpGet]
    [Route("getdropdown_noseriesbyworkflowId/{workflowCategoryId}/{accountGlId}/{accountSGLId}")]
    public async Task<List<MyDropDownViewModel>> GetDropDownNoSeriesByWorkflowId(int workflowCategoryId,
        int accountGlId, int accountSGLId)
    {
        return await _NoSeriesLineRepository.GetDropDownNoSeriesByWorkflowId(workflowCategoryId, accountGlId,
            accountSGLId);
    }

    [HttpPost]
    [Route("getnoseriesid")]
    public async Task<int> GetNoSeriesId([FromBody] string tableName)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _NoSeriesLineRepository.GetNoSeriesId(tableName, CompanyId);
    }

    [HttpGet]
    [Route("getdropdown_bankId/{bankId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDownByBankId(short bankId)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _NoSeriesLineRepository.GetDropDownBankAccount(bankId, CompanyId);
    }

    [HttpGet]
    [Route("getdropdown_bankCategoryId/{bankCategoryId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDownByBankCategoryId(short bankCategoryId)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _NoSeriesLineRepository.GetDropDownByBankCategoryId(bankCategoryId, CompanyId);
    }

    [HttpGet]
    [Route("getdropdown_nextstage/{workflowCategoryId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDownByNextStage(byte workflowCategoryId)
    {
        return await _NoSeriesLineRepository.GetDropDownByNextStage(workflowCategoryId);
    }


    [HttpGet]
    [Route("getdropdown_noseriesbyglsgl/{accountGlId}/{accountSGLId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDownByGlSgl(int accountGlId, int accountSGLId)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _NoSeriesLineRepository.GetDropDownByGlSgl(accountGlId, accountSGLId);
    }


    [Route("noserieslistnextstage/{stageId}/{branchId}")]
    [HttpGet]
    public async Task<List<MyDropDownViewModel>> GetNextStageActionNoseries(short stageId, short branchId)
    {
        return await _NoSeriesLineRepository.GetNextStageActionNoseries(stageId, branchId);
    }
}

[Route("GN")]
[Authorize]
public class NoSeriesLineController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.GN.NoSeriesLine);
    }
}