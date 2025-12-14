using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FM.TreasuryBond;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.TreasuryBond;

namespace ParseAlphabet.ERP.Web.Modules.FM.TreasuryBond;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class TreasuryBondApiController : ControllerBase
{
    private readonly TreasuryBondRepository _TreasuryBondRepository;

    public TreasuryBondApiController(TreasuryBondRepository TreasuryBondRepository)
    {
        _TreasuryBondRepository = TreasuryBondRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<TreasuryBondGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _TreasuryBondRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<TreasuryBondGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        return new MyResultPage<TreasuryBondGetRecord>
        {
            Data = await _TreasuryBondRepository.GetRecordById<TreasuryBondGetRecord>(keyvalue, false, "fm")
        };
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _TreasuryBondRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] TreasuryBondModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _TreasuryBondRepository.Insert(model, "fm");
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] TreasuryBondModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _TreasuryBondRepository.Update(model, "fm");
        }

        return ModelState.ToMyResultQuery<int>();
    }


    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _TreasuryBondRepository.Delete(keyvalue, "fm", companyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _TreasuryBondRepository.Csv(model);
    }
}

[Route("FM")]
[Authorize]
public class TreasuryBondController : Controller
{
    [Route("[controller]")]
    [HttpGet]
    [Authenticate(Operation.VIW, "")]
    public ActionResult Index()
    {
        return PartialView(Views.FM.TreasuryBond);
    }
}