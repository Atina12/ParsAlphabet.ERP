using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WF.StageFundItemType;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageFundItemType;

namespace ParseAlphabet.ERP.Web.Modules.FM.TreasuryStageFundItemType;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class TreasuryStageFundItemTypeApiController : ControllerBase
{
    private readonly StageFundItemTypeRepository _stageFundItemTypeRepository;

    public TreasuryStageFundItemTypeApiController(StageFundItemTypeRepository stageFundItemTypeRepository)
    {
        _stageFundItemTypeRepository = stageFundItemTypeRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<StageFundItemTypeGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        return await _stageFundItemTypeRepository.GetPage(model);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _stageFundItemTypeRepository.Csv(model);
    }
}

[Route("FM")]
[Authorize]
public class TreasuryStageFundItemTypeController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Index()
    {
        return PartialView(Views.FM.TreasuryStageFundItemTypeIndex);
    }
}