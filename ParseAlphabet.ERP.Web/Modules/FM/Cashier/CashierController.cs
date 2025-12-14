using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FM.Cahier;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.Cashier;

namespace ParseAlphabet.ERP.Web.Modules.FM.Cashier;

[Route("api/FM/[controller]")]
[ApiController]
public class CashierApiController : ControllerBase
{
    private readonly CashierRepository _cashierRepository;

    public CashierApiController(CashierRepository bankRepository)
    {
        _cashierRepository = bankRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<CashierGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _cashierRepository.GetPage(model);
    }


    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<CashierGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _cashierRepository.GetRecordById(keyvalue, CompanyId);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] CashierModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _cashierRepository.Insert(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] CashierModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _cashierRepository.Update(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }


    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _cashierRepository.Delete(keyvalue, CompanyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _cashierRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown/{branchId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(short branchId)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _cashierRepository.GetDropDown(CompanyId, branchId);
    }

    [HttpGet]
    [Route("getdropdowncashstand/{branchId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDownCashStand(short branchId)
    {
        return await _cashierRepository.GetDropDownCashStand(branchId);
    }

    [HttpGet]
    [Route("getdropdown_pos")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDownPos()
    {
        return await _cashierRepository.GetDropDownPos();
    }

    [HttpPost]
    [Route("checkexistip")]
    public async Task<bool> CheckExistIp([FromBody] MyDropDownViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _cashierRepository.CheckExistIP(model);
    }
}

[Route("FM")]
[Authorize]
public class CashierController : Controller
{
    [Route("[controller]")]
    [HttpGet]
    [Authenticate("VIW", "")]
    public ActionResult Index()
    {
        return PartialView(Views.FM.Cashier);
    }
}