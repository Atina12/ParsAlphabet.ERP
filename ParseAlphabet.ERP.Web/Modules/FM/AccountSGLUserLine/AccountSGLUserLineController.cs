using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FM.AccountSGLUserLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.AccountSGLUserLine;

namespace ParseAlphabet.ERP.Web.Modules.FM.AccountSGLUserLine;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class AccountSGLUserLineApiController : ControllerBase
{
    private readonly AccountSGLUserLineRepository _accountSglUserLineRepository;

    public AccountSGLUserLineApiController(AccountSGLUserLineRepository accountSglUserLineRepository)
    {
        _accountSglUserLineRepository = accountSglUserLineRepository;
    }


    [HttpPost]
    [Route("getfilterusersdiassign")]
    public GetColumnsViewModel GetFilterParametersDiAssign()
    {
        return _accountSglUserLineRepository.GetColumnsDiAssign();
    }

    [HttpPost]
    [Route("getfilterusersassign")]
    public GetColumnsViewModel GetFilterParametersAssign()
    {
        return _accountSglUserLineRepository.GetColumnsAssign();
    }

    [HttpPost]
    [Route("getPageDiAssign")]
    [Authenticate(Operation.VIW, "AccountSGLUser")]
    public async Task<MyResultPage<AccountSGLUserLineAssignList>> GetPageDiAssign([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _accountSglUserLineRepository.GetPageDiAssigns(model);
    }

    [HttpPost]
    [Route("getPageAssign")]
    [Authenticate(Operation.VIW, "AccountSGLUser")]
    public async Task<MyResultPage<AccountSGLUserLineAssignList>> GetPageAssign(
        [FromBody] NewGetPageViewModel pageViewModel)
    {
        pageViewModel.CompanyId = UserClaims.GetCompanyId();
        return await _accountSglUserLineRepository.GetPageAssign(pageViewModel);
    }

    [HttpPost]
    [Route("checkaccess")]
    public async Task<bool> CheckAccessAccountSGLUser([FromBody] Get_AccountSGLUserLine model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.UserId = UserClaims.GetUserId();
        ;
        return await _accountSglUserLineRepository.CheckAccessGLSGLUser(model);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "AccountSGLUser")]
    public async Task<MyResultQuery> Insert([FromBody] AccountSGLUserLineAssign model)
    {
        var UserId = Convert.ToInt16(User.FindFirstValue("UserId"));
        model.CompanyId = UserClaims.GetCompanyId();
        return await _accountSglUserLineRepository.AccountSGLUserAssign(model, UserId);
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "AccountSGLUser")]
    public async Task<MyResultQuery> Delete([FromBody] AccountSGLUserLineAssign model)
    {
        var UserId = Convert.ToInt16(User.FindFirstValue("UserId"));
        model.CompanyId = UserClaims.GetCompanyId();
        return await _accountSglUserLineRepository.AccountSGLUserDiAssign(model, UserId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "AccountSGLUser")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _accountSglUserLineRepository.Csv(model);
    }
}

[Route("FM")]
[Authorize]
public class AccountSGLUserLineController : Controller
{
    [Route("[controller]/{id}/{userFullName}")]
    [Authenticate(Operation.VIW, "AccountSGLUser")]
    [HttpGet]
    public ActionResult Index(int id, string userFullName)
    {
        return PartialView(Views.FM.AccountSGLUserLine);
    }
}