using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.WF.Stage;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.Stage;

namespace ParseAlphabet.ERP.Web.Modules.PU.PurchaseOrderStage;

[Route("api/PU/[controller]")]
[ApiController]
[Authorize]
public class PurchaseOrderStageApiController(StageRepository stageRepository) : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<StageGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await stageRepository.GetPage(model);
    }

    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    [HttpGet]
    public async Task<ActionResult> Csv(string stringedModel)
    {
        var model = JsonConvert.DeserializeObject<NewGetPageViewModel>(stringedModel);
        model.CompanyId = UserClaims.GetCompanyId();
        var resultCsv = await stageRepository.CSV(model);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "مراحل خرید.csv" };
    }
}

[Route("PU")]
[Authorize]
public class PurchaseOrderStageController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Index()
    {
        return PartialView(Views.PU.PurchaseOrderStage);
    }
}