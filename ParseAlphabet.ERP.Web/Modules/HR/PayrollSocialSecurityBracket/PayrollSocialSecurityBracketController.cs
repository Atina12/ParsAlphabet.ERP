using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.HR.PayrollSocialSecurityBracket;
using ParsAlphabet.ERP.Infrastructure.Implantation.HR.PayrollSocialSecurityBracket;

namespace ParseAlphabet.ERP.Web.Modules.HR.PayrollSocialSecurityBracket;

[Route("api/HR/[controller]")]
[ApiController]
[Authorize]
public class PayrollSocialSecurityBracketApiController : ControllerBase
{
    private readonly PayrollSocialSecurityBracketRepository _payrollSocialSecurityBracketRepository;

    public PayrollSocialSecurityBracketApiController(
        PayrollSocialSecurityBracketRepository PayrollSocialSecurityBracketRepository)
    {
        _payrollSocialSecurityBracketRepository = PayrollSocialSecurityBracketRepository;
    }


    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "PayrollSocialSecurityBracket")]
    public async Task<MyResultPage<List<PayrollSocialSecurityBracketGetPage>>> GetPage(
        [FromBody] NewGetPageViewModel model)
    {
        if (model.Form_KeyValue[0]?.ToString() == "myadm")
            model.Form_KeyValue[1] = User.FindFirstValue("UserId");
        model.CompanyId = UserClaims.GetCompanyId();
        return await _payrollSocialSecurityBracketRepository.GetPage(model);
    }


    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "PayrollSocialSecurityBracket")]
    public async Task<MyResultPage<PayrollSocialSecurityBracketGetRecord>> GetRecordById([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _payrollSocialSecurityBracketRepository.GetRecordById(id, companyId);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "PayrollSocialSecurityBracket")]
    public async Task<MyResultQuery> Insert([FromBody] PayrollSocialSecurityBracketModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.CreateUserId = Convert.ToInt32(User.FindFirstValue("UserId"));
            return await _payrollSocialSecurityBracketRepository.InsertOrUpdate(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "PayrollSocialSecurityBracket")]
    public async Task<MyResultQuery> Update([FromBody] PayrollSocialSecurityBracketModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.CreateUserId = Convert.ToInt32(User.FindFirstValue("UserId"));
            return await _payrollSocialSecurityBracketRepository.InsertOrUpdate(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "PayrollSocialSecurityBracket")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _payrollSocialSecurityBracketRepository.Delete(keyvalue, "hr", CompanyId);
    }


    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "PayrollSocialSecurityBracket")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        if (model.Form_KeyValue[0]?.ToString() == "myadm")
            model.Form_KeyValue[1] = User.FindFirstValue("UserId");
        model.CompanyId = UserClaims.GetCompanyId();
        return await _payrollSocialSecurityBracketRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<List<MyDropDownViewModel>> GetDropDown(string? term = "")
    {
        var companyId = UserClaims.GetCompanyId();
        return await _payrollSocialSecurityBracketRepository.GetAllDataDropDown(term, companyId);
    }
}

[Route("HR")]
[Authorize]
public class PayrollSocialSecurityBracketController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "PayrollSocialSecurityBracket")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.HR.PayrollSocialSecurityBracket);
    }
}