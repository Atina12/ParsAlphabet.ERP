using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FM.AccountCategory;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.AccountCategory;

namespace ParseAlphabet.ERP.Web.Modules.FM.AccountCategory;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]

//[CustomAuthorization]
public class AccountCategoryApiController : ControllerBase
{
    private readonly AccountCategoryRepository _accountCategoryRepository;

    public AccountCategoryApiController(AccountCategoryRepository accountCategoryRepository)
    {
        _accountCategoryRepository = accountCategoryRepository;
    }


    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<AccountCategoryGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = 0; // UserClaims.GetCompanyId();
        return await _accountCategoryRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<AccountCategoryGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        var result = new MyResultPage<AccountCategoryGetRecord>
        {
            Data = await _accountCategoryRepository.GetRecordById<AccountCategoryGetRecord>(keyvalue, false, "fm")
        };
        return result;
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _accountCategoryRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] AccountCategoryModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _accountCategoryRepository.Insert(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] AccountCategoryModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _accountCategoryRepository.Update(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _accountCategoryRepository.Delete(keyvalue, "fm", companyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        return await _accountCategoryRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown()
    {
        var companyId = UserClaims.GetCompanyId();
        return await _accountCategoryRepository.GetDropDown(companyId);
    }

    [HttpGet]
    [Route("getactivedropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetActiveDropDown()
    {
        var companyId = UserClaims.GetCompanyId();
        return await _accountCategoryRepository.GetActiveDropDown(companyId);
    }

    [HttpPost]
    [Route("getincomebalance")]
    public async Task<MyDropDownViewModel> GetIncomeBalance([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();

        return await _accountCategoryRepository.GetIncomeBalanceType(id, companyId);
    }


    [HttpGet]
    [Route("getdropdown_isactive")]
    public List<MyDropDownViewModel> GetDropDown_IsActive()
    {
        return _accountCategoryRepository.GetDropDown_IsActive();
    }
}

[Route("FM")]
[Authorize]
public class AccountCategoryController : Controller
{
    [Route("[controller]")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.FM.AccountCategory);
    }
}