using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.WF.Stage;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.Stage;

namespace ParseAlphabet.ERP.Web.Modules.FM.TreasuryStage;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class TreasuryStageApiController : ControllerBase
{
    private readonly StageRepository _stageRepository;

    public TreasuryStageApiController(StageRepository stageRepository)
    {
        _stageRepository = stageRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<StageGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _stageRepository.GetPage(model);
    }

    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    [HttpGet]
    public async Task<ActionResult> Csv(string stringedModel)
    {
        var model = JsonConvert.DeserializeObject<NewGetPageViewModel>(stringedModel);
        model.CompanyId = UserClaims.GetCompanyId();
        var resultCsv = await _stageRepository.CSV(model);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "مراحل خزانه.csv" };
    }
}

[Route("FM")]
[Authorize]
public class TreasuryStageController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Index()
    {
        return PartialView(Views.FM.TreasuryStage);
    }
}