using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.GN.Company;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;

namespace ParseAlphabet.ERP.Web.Modules.GN.Company;

[Route("api/[controller]")]
[ApiController]
public class CompanyApiController : ControllerBase
{
    private readonly ICompanyRepository _CompanyRepository;

    public CompanyApiController(ICompanyRepository CompanyRepository)
    {
        _CompanyRepository = CompanyRepository;
    }

    [HttpPost]
    [Route("getcompanyinfo")]
    public async Task<CompanyInfo> GetCompanyInfo()
    {
        return await _CompanyRepository.GetCompanyInfo();
    }

    [HttpPost]
    [Route("getdefaultcurrency")]
    public async Task<byte> GetDefaultCurrency()
    {
        var companyId = UserClaims.GetCompanyId();
        return await _CompanyRepository.GetDefaultCurrency(companyId);
    }
}

public class CompanyController : Controller
{
    private readonly ICompanyRepository _CompanyRepository;

    public CompanyController(ICompanyRepository CompanyRepository)
    {
        _CompanyRepository = CompanyRepository;
    }

    //[HttpGet]
    //public async Task<IActionResult> CorpLogo()
    //{
    //    //var corpInfo = await _CompanyRepository.GetCompanyInfo();
    //    //return File(corpInfo.CorpLogo, "image/png");
    //}

    //public IActionResult ShowMyIp()
    //{
    //    var identity = User.Identities.FirstOrDefault(c => c.NameClaimType == "Login");
    //    if (identity != null)
    //    {
    //        string ipaddr = User.FindFirstValue("IpAddress");
    //        ViewData["IpAddress"] = ipaddr;
    //    }

    //    //return PartialView(Views.Company.ShowMyIp);
    //}
}