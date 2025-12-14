using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos._Home;
using ParsAlphabet.ERP.Application.Dtos._Login;
using ParsAlphabet.ERP.Application.Interfaces._Home;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.User;

namespace ParseAlphabet.ERP.Web.Modules._Home;

[Route("api/[controller]")]
[Authorize]
[ApiController]
public class HomeApiController : ControllerBase
{
    private readonly IHomeRepository _homeRepository;
    private readonly ILoginRepository _loginRepository;

    public HomeApiController(IHomeRepository homeRepository,
        ILoginRepository loginRepository)
    {
        _homeRepository = homeRepository;
        _loginRepository = loginRepository;
    }

    [HttpPost]
    [Route("getuserimage")]
    public async Task<UserInfo> GetUserImage()
    {
        var userid = Convert.ToInt32(User.FindFirstValue("UserId"));
        return await _loginRepository.GetUserInfoByUserId(userid);
    }

    [HttpPost]
    [Route("getuserlanguages")]
    public async Task<List<UserLanguage>> GetUserLanguages()
    {
        var langcode = User.FindFirstValue("Language");
        return await _loginRepository.GetUserLanguages(langcode);
    }

    [HttpPost]
    [Route("getnavigation")]
    public async Task<List<Navigation>> GetNavigation()
    {
        var userid = Convert.ToInt32(User.FindFirstValue("UserId"));
        var langcode = User.FindFirstValue("Language");
        return await _homeRepository.GetNavigationByUserId(userid, langcode);
    }

    [HttpPost]
    [Route("changeuserlanguage/{langcode}")]
    public async Task<bool> ChangeUserLanguage(string langcode)
    {
        var userid = Convert.ToInt32(User.FindFirstValue("UserId"));
        return await _loginRepository.ChangeLanguage(userid, langcode);
    }
}

[Authorize]
public class HomeController(ILoginRepository loginRepository, UserRepository userRepository)
    : Controller
{
    public IActionResult ChangeLanguage(string langcode)
    {
        var userid = Convert.ToInt32(User.FindFirstValue("UserId"));
        var result = loginRepository.ChangeLanguage(userid, langcode);
        if (result.Result)
        {
            var isrtl = loginRepository.GetLayoutIsRtl(langcode).Result;
            var identity = User.Identities.FirstOrDefault(c => c.NameClaimType == "Login");
            if (identity != null)
            {
                identity.RemoveClaim(identity.FindFirst("Language"));
                identity.RemoveClaim(identity.FindFirst("LayoutIsRtl"));
                var newclaim1 = new Claim("Language", langcode);
                identity.AddClaim(newclaim1);
                var newclaim2 = new Claim("LayoutIsRtl", isrtl.ToString());
                identity.AddClaim(newclaim2);
                var login = HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme,
                    HttpContext.User);
            }
        }

        return RedirectToAction("HomeIndex");
    }

    [Route("Home")]
    [HttpGet]
    public IActionResult HomeIndex()
    {
        var identity = User.Identities.FirstOrDefault(c => c.NameClaimType == "Login");
        if (identity != null)
        {
            var userid = User.FindFirstValue("UserId");
            if (userid != null)
                return View(Views.Home.HomeIndex);
        }

        return View(Views.Login.LoginIndex);
    }


    [Route("Setting")]
    [HttpGet]
    public IActionResult SettingIndex()
    {
        var identity = User.Identities.FirstOrDefault(c => c.NameClaimType == "Login");
        if (identity != null)
        {
            var userid = User.FindFirstValue("UserId");
            if (userid != null)
                return View(Views.Home.SettingIndex);
        }

        return View(Views.Login.LoginIndex);
    }

    [Route("Profile")]
    [AllowAnonymous]
    [HttpGet]
    public IActionResult ProfileIndex()
    {
        var identity = User.Identities.FirstOrDefault(c => c.NameClaimType == "Login");
        if (identity != null)
        {
            var userid = User.FindFirstValue("UserId");
            if (userid != null)
                return View(Views.Home.ProfileIndex);
        }

        return View(Views.Login.LoginIndex);
    }

    [HttpGet]
    public async Task<IActionResult> Logout()
    {
        if (User.FindFirstValue("UserId") != null)
        {
            var userId = UserClaims.GetUserId();
            ;
            var companyId = UserClaims.GetCompanyId();
            await userRepository.UserSetONOFF(false, userId, companyId);
        }

        await HttpContext.SignOutAsync();
        return RedirectToAction("LoginIndex", "Login");
    }
}