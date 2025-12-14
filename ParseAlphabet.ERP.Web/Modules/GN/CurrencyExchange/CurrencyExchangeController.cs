using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.GN.CurrencyExchange;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.CurrencyExchange;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.Role;

namespace ParseAlphabet.ERP.Web.Modules.GN.CurrencyExchange;

[Route("api/GN/[controller]")]
[ApiController]
[Authorize]
public class CurrencyExchangeApiController : ControllerBase
{
    private readonly CurrencyExchangeRepository _CurrencyExchangeRepository;

    public CurrencyExchangeApiController(CurrencyExchangeRepository CurrencyExchangeRepository,
        RoleRepository RoleRepository)
    {
        _CurrencyExchangeRepository = CurrencyExchangeRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<CurrencyExchangeGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _CurrencyExchangeRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<CurrencyExchangeGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        return new MyResultPage<CurrencyExchangeGetRecord>
        {
            Data = await _CurrencyExchangeRepository.GetRecordById<CurrencyExchangeGetRecord>(keyvalue, false, "gn")
        };
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] CurrencyExchangeModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _CurrencyExchangeRepository.Insert(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] CurrencyExchangeModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _CurrencyExchangeRepository.Update(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _CurrencyExchangeRepository.Delete(keyvalue, "gn", companyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _CurrencyExchangeRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<List<MyDropDownViewModel>> GetDropDown(string? term)
    {
        return await _CurrencyExchangeRepository.GetDropDown(term);
    }
}

[Route("GN")]
[Authorize]
public class CurrencyExchangeController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.GN.CurrencyExchange);
    }
}