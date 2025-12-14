using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.GN.FiscalYearLine;
using ParsAlphabet.ERP.Application.Interfaces.GN.FiscalYearLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYear;

namespace ParseAlphabet.ERP.Web.Modules.GN.FiscalYearLine;

[Route("api/GN/[controller]")]
[ApiController]
[Authorize]
public class FiscalYearLineApiController : ControllerBase
{
    private readonly IFiscalYearLineRepository _FiscalYearLineRepository;
    private readonly FiscalYearRepository _FiscalYearRepository;

    public FiscalYearLineApiController(IFiscalYearLineRepository FiscalYearLineRepository,
        FiscalYearRepository FiscalYearRepository)
    {
        _FiscalYearLineRepository = FiscalYearLineRepository;
        _FiscalYearRepository = FiscalYearRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "FiscalYear")]
    public async Task<MyResultPage<List<FiscalYearLineGetPage>>> GetPage([FromBody] NewGetPageViewModel pageViewModel)
    {
        return await _FiscalYearLineRepository.GetPage(pageViewModel);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "FiscalYear")]
    public async Task<MyResultPage<FiscalYearLineGetRecord>> GetRecordBy_FiscalYearLine(
        [FromBody] Get_FiscalYearLine model)
    {
        return await _FiscalYearLineRepository.GetRecordBy_FiscalYearLine(model.HeaderId, model.MonthId);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _FiscalYearLineRepository.GetColumns();
    }

    [HttpPost]
    [Route("save")]
    [Authenticate(Operation.INS, "FiscalYear")]
    public Task<MyResultQuery> Save(FiscalYearLineModel model)
    {
        if (_FiscalYearLineRepository.GetRecordBy_FiscalYearLine(model.HeaderId, model.MonthId).Result.Successfull)
            return _FiscalYearLineRepository.Insert(model);
        return _FiscalYearLineRepository.Update(model);
    }
}