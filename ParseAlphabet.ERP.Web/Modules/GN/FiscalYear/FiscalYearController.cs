using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.GN.FiscalYear;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYear;

namespace ParseAlphabet.ERP.Web.Modules.GN.FiscalYear;

[Route("api/GN/[controller]")]
[ApiController]
[Authorize]
public class FiscalYearApiController : ControllerBase
{
    private readonly FiscalYearRepository _FiscalYearRepository;

    public FiscalYearApiController(FiscalYearRepository FiscalYearRepository)
    {
        _FiscalYearRepository = FiscalYearRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<FiscalYearGetPage>>> GetPage([FromBody] NewGetPageViewModel pageViewModel)
    {
        pageViewModel.CompanyId = UserClaims.GetCompanyId();
        return await _FiscalYearRepository.GetPage(pageViewModel);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<FiscalYearGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        return new MyResultPage<FiscalYearGetRecord>
        {
            Data = await _FiscalYearRepository.GetRecordById<FiscalYearGetRecord>(keyvalue, false, "gn")
        };
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> Insert([FromBody] FiscalYearModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _FiscalYearRepository.Insert(model);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultStatus> Update([FromBody] FiscalYearModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _FiscalYearRepository.Update(model);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _FiscalYearRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown/{isclose?}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(byte? isclose)
    {
        return await _FiscalYearRepository.GetDropDown(isclose);
    }

    [HttpPost]
    [Route("getdaterange")]
    public async Task<FiscalYearDateRange> GetDateRange([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _FiscalYearRepository.GetFicalYearDateRange(id, companyId);
    }
}

[Route("GN")]
[Authorize]
public class FiscalYearController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.GN.FiscalYear);
    }
}