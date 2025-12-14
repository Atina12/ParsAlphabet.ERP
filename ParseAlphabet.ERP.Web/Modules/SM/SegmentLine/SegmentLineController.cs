using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.SM.SegmentLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM.SegmentLine;

namespace ParseAlphabet.ERP.Web.Modules.SM.SegmentLine;

[Route("api/SM/[controller]")]
[ApiController]
[Authorize]
public class SegmentLineApiController(SegmentLineRepository segmentLineRepository) : ControllerBase
{
    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetAssignParameters()
    {
        return segmentLineRepository.GetColumns();
    }

    [HttpPost]
    [Route("getsegmentlinediassign")]
    [Authenticate(Operation.VIW, "Segment")]
    public async Task<MyResultPage<SegmentLineGetPage>> GetSegmentLineDiAssign(
        [FromBody] GetPageViewModel pageViewModel)
    {
        pageViewModel.CompanyId = UserClaims.GetCompanyId();
        return await segmentLineRepository.GetSegmentLineDiAssign(pageViewModel);
    }

    [HttpPost]
    [Route("getsegmentlineassign")]
    [Authenticate(Operation.VIW, "Segment")]
    public async Task<MyResultPage<SegmentLineGetPage>> GetSegmentLineAssign([FromBody] GetPageViewModel pageViewModel)
    {
        pageViewModel.CompanyId = UserClaims.GetCompanyId();
        return await segmentLineRepository.GetSegmentLineAssign(pageViewModel);
    }

    [HttpPost]
    [Route("segmentlineassign")]
    [Authenticate(Operation.VIW, "Segment")]
    public async Task<MyResultQuery> SegmentLineAssign([FromBody] SegmentLineAssign ViewModel)
    {
        ViewModel.CompanyId = UserClaims.GetCompanyId();
        return await segmentLineRepository.SegmentLineAssign(ViewModel);
    }

    [HttpPost]
    [Route("segmentlinediassign")]
    [Authenticate(Operation.VIW, "Segment")]
    public async Task<MyResultQuery> SegmentLineDiAssign([FromBody] SegmentLineAssign ViewModel)
    {
        ViewModel.CompanyId = UserClaims.GetCompanyId();
        return await segmentLineRepository.SegmentLineDiAssign(ViewModel);
    }
}

[Route("SM")]
public class SegmentLineController : Controller
{
    [Route("[controller]/{Id}")]
    [HttpGet]
    public ActionResult Index(int Id)
    {
        return PartialView(Views.SM.SegmentLine);
    }
}