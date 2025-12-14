using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FM.AccountSGL;
using ParsAlphabet.ERP.Application.Dtos.PB;
using ParsAlphabet.ERP.Application.Interfaces.PB;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.AccountSGL;

namespace ParseAlphabet.ERP.Web.Modules.FM.AccountSGL;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class AccountSGLApiController : ControllerBase
{
    private readonly IHttpContextAccessor _accessor;
    private readonly AccountSGLRepository _accountSGLRepository;
    private readonly IPublicRepository _publicRepository;

    public AccountSGLApiController(AccountSGLRepository accountSGLRepository, IHttpContextAccessor accessor,
        IPublicRepository publicRepository)
    {
        _accountSGLRepository = accountSGLRepository;
        _publicRepository = publicRepository;
        _accessor = accessor;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<AccountSGLGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _accountSGLRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<AccountSGLGetRecord>> GetRecordBy_AccountSGL([FromBody] Get_AccountSGL model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var result = await _accountSGLRepository.GetRecordById(model.Id, model.GLId, model.CompanyId);

        result.Data.Ids = await _accountSGLRepository.GetNoSeriesIds(model.GLId, model.Id, model.CompanyId);
        result.Data.CurrencyIds = await _accountSGLRepository.GetCurrencyIds(model.GLId, model.Id, model.CompanyId);

        return result;
    }

    [HttpPost]
    [Route("getsetting")]
    public async Task<AccountSGLSetting> GetSetting([FromBody] Get_AccountSGL model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _accountSGLRepository.GetSetting(model.GLId, model.Id, model.CompanyId);
    }

    [HttpPost]
    [Route("getaccountdetailbygl")]
    public async Task<List<MyDropDownViewModel>> AccountDetailList([FromBody] Get_AccountSGL model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _accountSGLRepository.GetAccountDetailList(model, model.CompanyId);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _accountSGLRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> Insert([FromBody] AccountSGLModel model)
    {
        if (ModelState.IsValid)
        {
            MyClaim.Init(_accessor);
            model.IsSecondLang = MyClaim.IsSecondLang;
            model.Opr = "Ins";
            model.CompanyId = UserClaims.GetCompanyId();
            return await _accountSGLRepository.Insert(model);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("getlastaccountsglid")]
    public async Task<int> GetAccountCategoryName([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _accountSGLRepository.GetLastAccountSGLId(id, companyId);
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultStatus> Update([FromBody] AccountSGLModel model)
    {
        if (ModelState.IsValid)
        {
            MyClaim.Init(_accessor);
            model.IsSecondLang = MyClaim.IsSecondLang;
            model.Opr = "Upd";
            model.CompanyId = UserClaims.GetCompanyId();
            return await _accountSGLRepository.Update(model);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] AccountSGLModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        return await _accountSGLRepository.DeleteSGL(model.Id, model.CompanyId, model.GLId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _accountSGLRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown/{glId}")]
    public async Task<List<MyDropDownViewModel>> GetDropDown(int glId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _accountSGLRepository.GetDropDown(glId, companyId);
    }

    [HttpGet]
    [Route("getactivedropdown/{glId}")]
    public async Task<List<MyDropDownViewModel>> GetActiveDropDown(int glId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _accountSGLRepository.GetActiveDropDown(glId, companyId);
    }

    [HttpPost]
    [Route("getmaxid")]
    public async Task<int> GetMaxId()
    {
        var companyId = UserClaims.GetCompanyId();
        return await _accountSGLRepository.GetMaxId(companyId);
    }

    [HttpPost]
    [Route("getname")]
    public async Task<string> GetGLName([FromBody] Get_AccountSGL model)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _accountSGLRepository.GetName(model.Id, model.GLId, companyId);
    }

    [HttpPost]
    [Route("checkexistsglid")]
    public async Task<byte> CheckExistAccountSGLId([FromBody] Get_AccountSGL model)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _accountSGLRepository.CheckExistAccountSGL(model.Id, model.GLId, companyId, model.IsActive);
    }

    [HttpPost]
    [Route("search")]
    public async Task<MyResultDataStatus<IEnumerable<MyDropDownViewModel2>>> SearchAccountSGL(
        [FromBody] GetPublicSearch model)
    {
        return await _accountSGLRepository.SearchAccountSGL(model);
    }

    [HttpPost]
    [Route("accountSGLDropDownByUser")]
    public async Task<MyResultDataStatus<List<AccountSGLSearchDropDown>>> AccountSGLDropDownByUser(
        [FromBody] GetPublicSearch model)
    {
        var companyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;

        var result = await _accountSGLRepository.AccountSGLDropDownByUserId(model, userId, companyId);
        return result;
    }

    [HttpPost]
    [Route("accountsglcategorydropdown")]
    public async Task<MyResultDataStatus<List<AccountSGLSearchDropDown>>> AccountGLAccountCategory_Dropdown(
        [FromBody] GetPublicSearch model)
    {
       return await _accountSGLRepository.AccountGLAccountCategory_Dropdown(model);
    }

    [HttpPost]
    [Route("getminmax")]
    public async Task<Tuple<int, int>> GetMinIdMaxId()
    {
        var companyId = UserClaims.GetCompanyId();
        return await _accountSGLRepository.GetMinMax(companyId);
    }
}

[Route("FM")]
[Authorize]
public class AccountSGLController : Controller
{
    [Route("[controller]")]
    [HttpGet]
    [Authenticate("VIW", "")]
    public ActionResult Index()
    {
        return PartialView(Views.FM.AccountSGL);
    }
}