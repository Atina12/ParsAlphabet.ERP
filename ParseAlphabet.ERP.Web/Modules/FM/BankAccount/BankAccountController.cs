using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FM.BankAccount;
using ParsAlphabet.ERP.Application.Dtos.PB;
using ParsAlphabet.ERP.Application.Interfaces.PB;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.BankAccount;

namespace ParseAlphabet.ERP.Web.Modules.FM.BankAccount;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class BankAccountApiController : ControllerBase
{
    private readonly IHttpContextAccessor _accessor;
    private readonly BankAccountRepository _BankAccountRepository;
    private readonly IPublicRepository _publicRepository;


    public BankAccountApiController(BankAccountRepository BankAccountRepository, IHttpContextAccessor accessor,
        IPublicRepository publicRepository)
    {
        _BankAccountRepository = BankAccountRepository;
        _accessor = accessor;
        _publicRepository = publicRepository;
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _BankAccountRepository.Csv(model);
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<BankAccountGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _BankAccountRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<BankAccountGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _BankAccountRepository.GetRecordById(keyvalue, CompanyId);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] BankAccountModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _BankAccountRepository.Insert(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] BankAccountModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _BankAccountRepository.Update(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _BankAccountRepository.Delete(keyvalue, "fm", CompanyId);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown()
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _BankAccountRepository.GetDropDown(0, CompanyId);
    }

    [HttpGet]
    [Route("getdropdown_bankId/{bankId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDownByBankId(int bankId)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _BankAccountRepository.GetDropDown(bankId, CompanyId);
    }

    [HttpGet]
    [Route("accountdetailgetdropdown_bankId/{bankId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetAccountDetailDropDownByBankId(int bankId)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _BankAccountRepository.AccountDetailGetDropDown(bankId, CompanyId);
    }

    [HttpGet]
    [Route("getdropdown_bankCategoryId/{bankCategoryId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDownByBankCategoryId(short bankCategoryId)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _BankAccountRepository.GetDropDownByBankCategoryId(bankCategoryId, CompanyId);
    }

    [HttpGet]
    [Route("getalldatadropdown_bankCategoryId/{bankCategoryId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetAllDataDropDownByBankCategoryId(short bankCategoryId)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _BankAccountRepository.GetAllDataDropDownByBankCategoryId(bankCategoryId, CompanyId);
    }

    [HttpPost]
    [Route("search")]
    public async Task<MyResultDataStatus<IEnumerable<MyDropDownViewModel2>>> SearchBankAccount(
        [FromBody] GetPublicSearch model)
    {
        var filter = $"CompanyId={int.Parse(User.FindFirstValue("CompanyId"))}";
        var result = new MyResultDataStatus<IEnumerable<MyDropDownViewModel2>>();
        if (model.Items[2] != null)
        {
            if (int.Parse(model.Items[0].ToString()) != 0)
                filter += $" AND Id={int.Parse(model.Items[0].ToString())}";

            if (model.Items[1].ToString().Trim() != string.Empty)
                filter += $" AND Name LIKE N'%{model.Items[1]}%'";

            if ((int.TryParse(model.Items[2].ToString(), out _) ? int.Parse(model.Items[2].ToString()) : 0) != 0)
                filter +=
                    $" AND BankId={(int.TryParse(model.Items[2].ToString(), out _) ? int.Parse(model.Items[2].ToString()) : 0)}";

            MyClaim.Init(_accessor);

            var searchModel = new PublicSearch
            {
                IsSecondLang = MyClaim.IsSecondLang,
                CompanyId = int.Parse(User.FindFirstValue("CompanyId")),
                TableName = "fm.BankAccount",
                IdColumnName = "Id",
                TitleColumnName = "Name",
                Filter = filter
            };

            result = await _publicRepository.Search(searchModel);
        }

        return result;
    }
}

[Route("FM")]
[Authorize]
public class BankAccountController : Controller
{
    [Route("[controller]")]
    [HttpGet]
    [Authenticate("VIW", "")]
    public ActionResult Index()
    {
        return PartialView(Views.FM.BankAccount);
    }
}