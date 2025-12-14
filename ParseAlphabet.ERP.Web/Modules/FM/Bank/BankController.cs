using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FM.Bank;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.Bank;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.BankAccount;

namespace ParseAlphabet.ERP.Web.Modules.FM.Bank;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
//[CustomAuthorization]
public class BankApiController : ControllerBase
{
    private readonly IHttpContextAccessor _accessor;
    private readonly BankAccountRepository _bankAccountRepository;
    private readonly BankRepository _bankRepository;

    public BankApiController(BankRepository bankRepository, IHttpContextAccessor accessor,
        BankAccountRepository bankAccountRepository)
    {
        _bankRepository = bankRepository;
        _accessor = accessor;
        _bankAccountRepository = bankAccountRepository;
    }


    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<BankGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        // post
        model.CompanyId = UserClaims.GetCompanyId();
        return await _bankRepository.GetPage(model);
    }


    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<BankGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        // post
        var CompanyId = UserClaims.GetCompanyId();
        return await _bankRepository.GetRecordById(keyvalue, CompanyId);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] BankModel model)
    {
        if (ModelState.IsValid)
        {
            MyClaim.Init(_accessor);
            model.CompanyId = UserClaims.GetCompanyId();
            return await _bankRepository.Insert(model, "fm");
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] BankModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var bankAccounts = await _bankAccountRepository.GetDropDown(model.Id, model.CompanyId);
        if (bankAccounts.Count > 0 && !model.IsActive)
            return new MyResultQuery
            {
                Successfull = false,
                StatusMessage = $"بانک مورد نظر دارای {bankAccounts.Count} حساب بانکی است، مجاز به غیر فعال کردن نیستید"
            };

        if (ModelState.IsValid)
            return await _bankRepository.Update(model, "fm");
        return ModelState.ToMyResultQuery<int>();
    }


    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _bankRepository.Delete(keyvalue, "fm", CompanyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _bankRepository.Csv(model);
    }

    [Authorize]
    [HttpGet]
    [Route("getdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown()
    {
        var companyId = UserClaims.GetCompanyId();
        return await _bankRepository.GetDropDown(companyId);
    }

    [HttpGet]
    [Route("getdropdownisactive")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDownIsActive()
    {
        var companyId = UserClaims.GetCompanyId();
        return await _bankRepository.GetDropDownIsActive(companyId);
    }

    [HttpGet]
    [Route("getdropdownhasaccount")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDownHasAccount()
    {
        var companyId = UserClaims.GetCompanyId();
        return await _bankRepository.GetDropDownHasBankAccount(companyId);
    }
}

[Route("FM")]
[Authorize]
public class BankController : Controller
{
    [Route("[controller]")]
    [HttpGet]
    [Authenticate("VIW", "")]
    public ActionResult Index()
    {
        return PartialView(Views.FM.Bank);
    }
}