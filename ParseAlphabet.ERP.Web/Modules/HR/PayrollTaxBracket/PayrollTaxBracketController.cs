using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.HR.PayrollTaxBracket;
using ParsAlphabet.ERP.Infrastructure.Implantation.HR.PayrollTaxBracket;

namespace ParseAlphabet.ERP.Web.Modules.HR.PayrollTaxBracket;

[Route("api/HR/[controller]")]
[ApiController]
[Authorize]
public class PayrollTaxBracketApiController : ControllerBase
{
    private readonly PayrollTaxBracketRepository _payrollTaxBracketRepository;

    public PayrollTaxBracketApiController(PayrollTaxBracketRepository PayrollTaxBracketRepository)
    {
        _payrollTaxBracketRepository = PayrollTaxBracketRepository;
    }


    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "PayrollTaxBracket")]
    public async Task<MyResultPage<List<PayrollTaxBracketGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        if (model.Form_KeyValue[0]?.ToString() == "myadm")
            model.Form_KeyValue[1] = User.FindFirstValue("UserId");
        model.CompanyId = UserClaims.GetCompanyId();
        return await _payrollTaxBracketRepository.GetPage(model);
    }


    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "PayrollTaxBracket")]
    public async Task<MyResultPage<PayrollTaxBracketGetRecord>> GetRecordById([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _payrollTaxBracketRepository.GetRecordById(id, companyId);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "PayrollTaxBracket")]
    public async Task<MyResultQuery> Insert([FromBody] PayrollTaxBracketModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.CreateUserId = Convert.ToInt32(User.FindFirstValue("UserId"));
            return await _payrollTaxBracketRepository.InsertOrUpdate(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "PayrollTaxBracket")]
    public async Task<MyResultQuery> Update([FromBody] PayrollTaxBracketModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.CreateUserId = Convert.ToInt32(User.FindFirstValue("UserId"));
            return await _payrollTaxBracketRepository.InsertOrUpdate(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }


    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "PayrollTaxBracket")]
    public async Task<MyResultStatus> Delete([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _payrollTaxBracketRepository.Delete(keyvalue, CompanyId);
    }


    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "PayrollTaxBracket")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        if (model.Form_KeyValue[0]?.ToString() == "myadm")
            model.Form_KeyValue[1] = User.FindFirstValue("UserId");
        model.CompanyId = UserClaims.GetCompanyId();
        return await _payrollTaxBracketRepository.Csv(model);
    }


    [HttpGet]
    [Route("getdropdown")]
    public async Task<List<MyDropDownViewModel>> GetDropDown(string? term = "")
    {
        var companyId = UserClaims.GetCompanyId();
        return await _payrollTaxBracketRepository.GetAllDataDropDown(term, companyId);
    }

    [HttpGet]
    [Route("payrolltaxbracketlinelist/{keyvalue}")]
    public async Task<MyResultPage<PayrollTaxBracketLineListGetRecord>> PayrollTaxBracketLineList(int keyvalue)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _payrollTaxBracketRepository.GetPayrollTaxBracketLineList(keyvalue, companyId);
    }

    [HttpGet]
    [Route("getlinerecordbyid/{id}")]
    public async Task<PayrollTaxBracketLineList> GetLineRecordById(int id)
    {
        return await _payrollTaxBracketRepository.GetPayrollTaxBracketLineRecord(id);
    }


    [HttpPost]
    [Route("insertpayrolltaxbracketline")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> InsertPayrollTaxBracketLine([FromBody] PayrollTaxBracketLineModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.CreateUserId = UserClaims.GetUserId();
        ;
        var result = await _payrollTaxBracketRepository.PayrollTaxBracketLineSave(model);
        return result;
    }

    [HttpPost]
    [Route("updatepayrolltaxbracketline")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> UpdatePayrollTaxBracketLine([FromBody] PayrollTaxBracketLineModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.CreateUserId = UserClaims.GetUserId();
        ;
        var result = await _payrollTaxBracketRepository.PayrollTaxBracketLineSave(model);
        return result;
    }

    [HttpPost]
    [Route("deletepayrolltaxbracketline")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultStatus> DeletePayrollTaxBracketLine([FromBody] PayrollTaxBracketLineModel model)
    {
        var result = await _payrollTaxBracketRepository.PayrollTaxBracketLineDelete(model);
        return result;
    }

    [HttpPost]
    [Route("getnewstartamount")]
    public async Task<decimal> GetStartAmount([FromBody] int id)
    {
        return await _payrollTaxBracketRepository.GetNewStartAmount(id);
    }
}

[Route("HR")]
[Authorize]
public class PayrollTaxBracketController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "PayrollTaxBracket")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.HR.PayrollTaxBracket);
    }
}