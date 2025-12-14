using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WF.StageFundItemType;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageFundItemType;

namespace ParseAlphabet.ERP.Web.Modules.PU.PurchaseOrderStageItemType;

[Route("api/PU/[controller]")]
[ApiController]
[Authorize]
public class PurchaseOrderStageItemTypeApiController(StageFundItemTypeRepository stageFundItemTypeRepository)
    : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    public async Task<MyResultPage<List<StageFundItemTypeGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        return await stageFundItemTypeRepository.GetPage(model);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await stageFundItemTypeRepository.Csv(model);
    }
}

[Route("PU")]
[Authorize]
public class PurchaseOrderStageItemTypeController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Index()
    {
        return PartialView(Views.PU.PurchaseOrderStageItemTypeIndex);
    }
}