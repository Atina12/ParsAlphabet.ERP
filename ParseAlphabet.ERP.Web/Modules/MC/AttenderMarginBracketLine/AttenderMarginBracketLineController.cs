using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.AttenderMarginBracketLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AttenderMarginBracketLine;

namespace ParseAlphabet.ERP.Web.Modules.MC.AttenderMarginBracketLine;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class AttenderMarginBracketLineApiController(
    AttenderMarginBracketLineRepository attenderMarginBracketLineRepository)
    : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "AttenderMarginBracket")]
    public async Task<List<AttenderMarginBracketLineGetPage>> GetPage([FromBody] int headerId)
    {
        return await attenderMarginBracketLineRepository.GetPage(headerId);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "AttenderMarginBracket")]
    public async Task<AttenderMarginBracketLineGetRecord> GetRecordById([FromBody] int id)
    {
        return await attenderMarginBracketLineRepository.GetRecordById(id);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "AttenderMarginBracket")]
    public async Task<MyResultStatus> Insert([FromBody] AttenderMarginBracketLineModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.CreateUserId = UserClaims.GetUserId();
        ;
        return await attenderMarginBracketLineRepository.Save(model);
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "AttenderMarginBracket")]
    public async Task<MyResultStatus> Update([FromBody] AttenderMarginBracketLineModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.CreateUserId = UserClaims.GetUserId();
        ;
        return await attenderMarginBracketLineRepository.Save(model);
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "AttenderMarginBracket")]
    public async Task<MyResultQuery> Delete([FromBody] int id)
    {
        return await attenderMarginBracketLineRepository.Delete(id);
    }

    [HttpPost]
    [Route("getstartamount")]
    public async Task<decimal> GetStartAmount([FromBody] int id)
    {
        return await attenderMarginBracketLineRepository.GetNewStartAmount(id);
    }
}

[Route("MC")]
[Authorize]
public class AttenderMarginBracketLineController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "AttenderMarginBracket")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.MC.AttenderMarginBracketLine);
    }
}