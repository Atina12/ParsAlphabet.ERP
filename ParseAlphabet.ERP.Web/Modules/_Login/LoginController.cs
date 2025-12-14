using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos._Login;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces._Setup;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.User;

namespace ParseAlphabet.ERP.Web.Modules._Login;

[Route("api/[controller]/[action]")]
[ApiController]
public class LoginApiController : ControllerBase
{
    private readonly ILoginRepository _loginRepository;

    //private readonly CentralTokenRepository _centralTokenRepository;


    //private readonly Microsoft.Extensions.Configuration.IConfiguration _config;

    //private static Dictionary<string, DateTime> cancelledTokens = new Dictionary<string, DateTime>();

    public LoginApiController(ILoginRepository loginRepository,
        UserRepository userRepository,
        ISetupRepository setupRepository,
        //CentralTokenRepository centralTokenRepository,
        IHttpContextAccessor accessor,
        ICompanyRepository companyRepository,
        IConfiguration config)
    {
        _loginRepository = loginRepository;

        //_centralTokenRepository = centralTokenRepository;
    }


    //[AllowAnonymous]
    //[HttpPost]
    //[Route("Login")]
    //public async Task<MyResultQuery> Login([FromBody] UserLoginViewModel model)
    //{
    //    IActionResult response = Unauthorized();

    //    var resultQuery = new MyResultQuery();

    //    MyClaim.Init(_accessor);

    //    string passwordsalt = "";
    //    string passwordhash = "";
    //    try
    //    {
    //        passwordsalt = await _loginRepository.GetPasswordSaltByUsername(model.UserName);
    //        passwordhash = Password.GetHash(model.Password, passwordsalt);
    //    }
    //    catch (Exception)
    //    {
    //        resultQuery.Successfull = false;
    //        resultQuery.StatusMessage = "error_db";
    //        return resultQuery;
    //    }

    //    var result = await _loginRepository.Login(model.UserName, passwordhash);
    //    if (result.UserId == 0 || result.UserId == 1)
    //    {
    //        resultQuery.Successfull = false;
    //        resultQuery.StatusMessage = "error_incorrect";
    //        return resultQuery;
    //    }
    //    if (result.IsActive == false)
    //    {
    //        resultQuery.Successfull = false;
    //        resultQuery.StatusMessage = "error_active";
    //        return resultQuery;
    //    }
    //    if (result.SuccessLogin == true)
    //    {

    //        var user = await _loginRepository.GetUserInfoByUserId(result.UserId);
    //        if (user != null)
    //        {

    //            var tokenString = GenerateJSONWebToken(user);
    //            resultQuery.Successfull = true;
    //            resultQuery.StatusMessage = "Success";
    //            return resultQuery;

    //        }
    //    }
    //        resultQuery.Successfull = false;
    //        resultQuery.StatusMessage = "error_incorrect";
    //        return resultQuery;

    //}

    //    private bool GenerateJSONWebToken(UserInfo userInfo)
    //    {
    //     string ipaddress = MyClaim.IpAddress;
    //    var setupInfo =  _setupRepository.GetSetupInfo().Result;
    //    string ciswcfurl = setupInfo.CIS_WCF_Url.ToString();
    //    var companyId = 1;
    //    var defaultCurrencyId =  _companyRepository.GetDefaultCurrency(companyId).Result;
    //    var idn1 = User.Identities.FirstOrDefault(c => c.NameClaimType == "Login");
    //    if (idn1 != null)
    //    {
    //        idn1.RemoveClaim(idn1.FindFirst("UserId"));
    //        idn1.RemoveClaim(idn1.FindFirst("RoleId"));
    //        idn1.RemoveClaim(idn1.FindFirst("Username"));
    //        idn1.RemoveClaim(idn1.FindFirst("FullName"));
    //        idn1.RemoveClaim(idn1.FindFirst("Language"));
    //        idn1.RemoveClaim(idn1.FindFirst("IsSecondLang"));
    //        idn1.RemoveClaim(idn1.FindFirst("MobileNo"));
    //        idn1.RemoveClaim(idn1.FindFirst("LayoutIsRtl"));
    //        idn1.RemoveClaim(idn1.FindFirst("PasswordSalt"));
    //        idn1.RemoveClaim(idn1.FindFirst("LocCityId"));
    //        idn1.RemoveClaim(idn1.FindFirst("LocCityName"));
    //        idn1.RemoveClaim(idn1.FindFirst("IpAddress"));
    //        idn1.RemoveClaim(idn1.FindFirst("CIS_WCF_Url"));
    //        idn1.RemoveClaim(idn1.FindFirst("CompanyId"));
    //        idn1.RemoveClaim(idn1.FindFirst("DefaultCurrencyId"));

    //        var newclaim1 = new Claim("UserId", userInfo.UserId.ToString());
    //        idn1.AddClaim(newclaim1);

    //        var newclaim01 = new Claim("RoleId", userInfo.RoleId.ToString());
    //        idn1.AddClaim(newclaim01);

    //        var newclaim2 = new Claim("Username", userInfo.Username);
    //        idn1.AddClaim(newclaim2);
    //        var newclaim3 = new Claim("FullName", userInfo.Fullname);
    //        idn1.AddClaim(newclaim3);
    //        var newclaim4 = new Claim("Language", userInfo.Language);
    //        idn1.AddClaim(newclaim4);
    //        var newclaim5 = new Claim("IsSecondLang", "false");
    //        idn1.AddClaim(newclaim5);
    //        var newclaim6 = new Claim("MobileNo", userInfo.MobileNo);
    //        idn1.AddClaim(newclaim6);
    //        var newclaim7 = new Claim("LayoutIsRtl", userInfo.LayoutIsRtl.ToString());
    //        idn1.AddClaim(newclaim7);
    //        var newclaim8 = new Claim("PasswordSalt", userInfo.PasswordSalt);
    //        idn1.AddClaim(newclaim8);
    //        var newclaim9 = new Claim("LocCityId", userInfo.LocCityId.ToString());
    //        idn1.AddClaim(newclaim9);
    //        var newclaim10 = new Claim("LocCityName", userInfo.LocCityName);
    //        idn1.AddClaim(newclaim10);
    //        var newclaim11 = new Claim("IpAddress", ipaddress);
    //        idn1.AddClaim(newclaim11);
    //        var newclaim14 = new Claim("CIS_WCF_Url", ciswcfurl);
    //        idn1.AddClaim(newclaim14);
    //        var newclaim15 = new Claim("CompanyId", companyId.ToString(), ClaimValueTypes.Integer32);
    //        idn1.AddClaim(newclaim15);
    //        var newclaim16 = new Claim("DefaultCurrencyId", defaultCurrencyId.ToString(), ClaimValueTypes.Integer32);
    //        idn1.AddClaim(newclaim16);
    //    }
    //    else
    //    {
    //        var idn2 = new ClaimsIdentity(new[] {
    //                new Claim("UserId", userInfo.UserId.ToString()),
    //                new Claim("RoleId", userInfo.RoleId.ToString()),
    //                new Claim("Username", userInfo.Username),
    //                new Claim("FullName", userInfo.Fullname),
    //                new Claim("Language", userInfo.Language),
    //                new Claim("IsSecondLang", "false"),
    //                new Claim("MobileNo", userInfo.MobileNo),
    //                new Claim("LayoutIsRtl", userInfo.LayoutIsRtl.ToString()),
    //                new Claim("PasswordSalt", userInfo.PasswordSalt),
    //                new Claim("LocCityId", userInfo.LocCityId.ToString()),
    //                new Claim("LocCityName", userInfo.LocCityName),
    //                new Claim("IpAddress", ipaddress),
    //                new Claim("CIS_WCF_Url", ciswcfurl),
    //                new Claim("CompanyId", companyId.ToString(), ClaimValueTypes.Integer32),
    //                new Claim("DefaultCurrencyId", defaultCurrencyId.ToString(), ClaimValueTypes.Integer32),
    //                }, CookieAuthenticationDefaults.AuthenticationScheme, "Login", "");
    //        HttpContext.User.AddIdentity(idn2);
    //    }

    //        var claims = new[] {
    //        new Claim("UserId", userInfo.UserId.ToString()),
    //                new Claim("RoleId", userInfo.RoleId.ToString()),
    //                new Claim("Username", userInfo.Username),
    //                new Claim("FullName", userInfo.Fullname),
    //                new Claim("Language", userInfo.Language),
    //                new Claim("IsSecondLang", "false"),
    //                new Claim("MobileNo", userInfo.MobileNo),
    //                new Claim("LayoutIsRtl", userInfo.LayoutIsRtl.ToString()),
    //                new Claim("PasswordSalt", userInfo.PasswordSalt),
    //                new Claim("LocCityId", userInfo.LocCityId.ToString()),
    //                new Claim("LocCityName", userInfo.LocCityName),
    //                new Claim("IpAddress", ipaddress),
    //                new Claim("CIS_WCF_Url", ciswcfurl),
    //                new Claim("CompanyId", companyId.ToString(), ClaimValueTypes.Integer32),
    //                new Claim("DefaultCurrencyId", defaultCurrencyId.ToString(), ClaimValueTypes.Integer32),
    //    };

    //    CentralPropertiesModel centralPropertiesModel;
    //    var Connection = _config.GetConnectionString("DefaultConnection");

    //    using (IDbConnection conn = new SqlConnection(Connection))
    //    {
    //        string sQuery = "pb.Spc_Tables_GetRecord";
    //        conn.Open();
    //        centralPropertiesModel = conn.QueryFirstOrDefault<CentralPropertiesModel>(sQuery,
    //            new
    //            {
    //                TableName = "gn.CentralProperties",
    //                @IsSecondLang = 1,
    //                Filter = $"ValidIssuer='{ _config["Jwt:Issuer"]}'"
    //            }, commandType: CommandType.StoredProcedure);
    //    }

    //    var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(centralPropertiesModel.IssuerSigningKey));
    //    var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

    //    var token = new JwtSecurityToken(centralPropertiesModel.ValidIssuer, centralPropertiesModel.ValidAudience,
    //        claims,
    //        expires: DateTime.Now.AddMinutes(30),
    //        signingCredentials: credentials);

    //    string UserToken=new JwtSecurityTokenHandler().WriteToken(token);

    //    CentralTokenModel centralTokenModel = new CentralTokenModel( );

    //    centralTokenModel.CentralId = centralPropertiesModel.IssuerSigningKey;
    //    centralTokenModel.TokenId = UserToken;
    //    centralTokenModel.ExpirationDateTime = DateTime.Now.AddMinutes(30);
    //    centralTokenModel.CreateDateTime = DateTime.Now;

    //    var result= _centralTokenRepository.Insert(centralTokenModel);
    //    if (result.IsCompletedSuccessfully==true)
    //    {
    //        return true;
    //    }

    //   return  false;

    //}

    [AllowAnonymous]
    [HttpGet]
    [Route("logout")]
    public bool Logout()
    {
        if (User.Identity.IsAuthenticated)
        {
            var issuer = ((ClaimsIdentity)User.Identity).Claims.FirstOrDefault(s => s.Type == "iss")?.Value;
            var Audience = ((ClaimsIdentity)User.Identity).Claims.FirstOrDefault(s => s.Type == "aud")?.Value;
            var Expiration =
                long.Parse(((ClaimsIdentity)User.Identity).Claims.FirstOrDefault(s => s.Type == "exp")?.Value);
            var x = DateTime.Now.Ticks;
            if (Expiration < x) return false;
        }

        return true;
    }


    [AllowAnonymous]
    [HttpPost]
    public async Task<MyResultQuery> CheckLogin([FromBody] UserLoginViewModel model)
    {
        return await _loginRepository.CheckLogin(model);
    }


    //[HttpPost]
    //[Route("extlogin")]
    //public async Task<MyResultDataStatus<ExternalLoginModel>> ExternalLogin([FromBody] UserLoginViewModel model)
    //{
    //    var resultQuery = new MyResultDataStatus<ExternalLoginModel>();

    //    MyClaim.Init(_accessor);

    //    string passwordsalt = "";
    //    string passwordhash = "";
    //    try
    //    {
    //        passwordsalt = await _loginRepository.GetPasswordSaltByUsername(model.UserName);
    //        passwordhash = Password.GetHash(model.Password, passwordsalt);
    //    }
    //    catch (Exception)
    //    {
    //        resultQuery.Successfull = false;
    //        resultQuery.StatusMessage = "error_db";
    //        return resultQuery;
    //    }

    //    var result = await _loginRepository.Login(model.UserName, passwordhash);
    //    if (result.UserId == 0 || result.UserId == 1)
    //    {
    //        resultQuery.Successfull = false;
    //        resultQuery.StatusMessage = "error_incorrect";
    //        return resultQuery;
    //    }
    //    else if (!result.IsActive)
    //    {
    //        resultQuery.Successfull = false;
    //        resultQuery.StatusMessage = "error_active";
    //        return resultQuery;
    //    }
    //    if (result.SuccessLogin)
    //    {

    //        var token = JwtHelper.GetJwtToken(
    //            model.UserName,
    //            "C4A",
    //            "http://localhost:2499/",
    //            "BookingWebsla",
    //            TimeSpan.FromHours(3),
    //            new[]
    //            {
    //            new Claim("UserState", model.UserName)
    //            });

    //        var identity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme, ClaimTypes.Name, ClaimTypes.Role);
    //        identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, model.UserName));
    //        identity.AddClaim(new Claim(ClaimTypes.Name, model.UserName));
    //        var principal = new ClaimsPrincipal(identity);

    //        await HttpContext.SignInAsync(
    //              CookieAuthenticationDefaults.AuthenticationScheme,
    //              principal,
    //              new AuthenticationProperties
    //              {
    //                  IsPersistent = true,
    //                  AllowRefresh = true,
    //                  ExpiresUtc = DateTime.UtcNow.AddDays(1)
    //              });

    //        resultQuery.Successfull = true;
    //        resultQuery.Status = 100;

    //        resultQuery.Data.Token= new JwtSecurityTokenHandler().WriteToken(token);
    //        resultQuery.Data.ExpireDateTime = token.ValidTo;
    //        resultQuery.Data.DisplayName = model.UserName;
    //    }


    //    resultQuery.Successfull = false;
    //    resultQuery.StatusMessage = "error_incorrect";
    //    return resultQuery;
    //}

    //[AllowAnonymous]
    //[HttpGet]
    //[Route("api/logout")]
    //public bool Logout()
    //{
    //    // Cookie Signout
    //    //await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

    //    if (User.Identity.IsAuthenticated)
    //        ExpireToken();

    //    return true;
    //}

    //[AllowAnonymous]
    //[HttpGet]
    //[Route("api/isauthenticated")]
    //public bool IsAuthenthenticated()
    //{
    //    if (!User.Identity.IsAuthenticated || IsTokenExpired())
    //        return false;

    //    return true;
    //}

    //private void ExpireToken()
    //{
    //    string id = ((ClaimsIdentity)User.Identity).Claims.FirstOrDefault(s => s.Type == "jti")?.Value;
    //    if (id != null)
    //        cancelledTokens.Add(id, DateTime.UtcNow.AddMinutes(App.Configuration.JwtToken.TokenTimeoutMinutes));

    //    RemoveExpiredTokens();
    //}

    //private bool IsTokenExpired()
    //{
    //    string id = ((ClaimsIdentity)User.Identity).Claims.FirstOrDefault(s => s.Type == "jti")?.Value;
    //    if (id == null) return false;

    //    if (cancelledTokens.ContainsKey(id))
    //        return true;

    //    return false;
    //}

    [HttpPost]
    public async Task<MyResultQuery> SendForgotSms([FromBody] ForgetPassViewModel model)
    {
        return await _loginRepository.SendForgotSms(model);
    }

    [HttpPost]
    public async Task<MyResultQuery> CheckActivationCode([FromBody] CheckActivationViewModel model)
    {
        var resultQuery = new MyResultQuery();

        var t_actcode = await _loginRepository.GetActCodeByUsername(model.UserName);

        if (t_actcode != model.ActCode)
            resultQuery.StatusMessage = "error_incorrect";

        resultQuery.StatusMessage = "success";
        return resultQuery;
    }

    [HttpPost]
    public async Task<MyResultQuery> ChangePassword([FromBody] ChangePasswordViewModel model)
    {
        return await _loginRepository.ChangePassword(model);
    }

    [HttpPost]
    public async Task<MyResultQuery> CheckAuthorize([FromBody] CheckAuthenticateViewModel checkAuthorize)
    {
        return await _loginRepository.CheckAutorize(checkAuthorize);
    }
}

public class LoginController : Controller
{
    private readonly IHttpClientFactory _httpClient;

    private readonly ILoginRepository _loginRepository;

    //private readonly ICentralTokenService _centralTokenService;
    public LoginController(ILoginRepository loginRepository, IHttpClientFactory httpClient
        //, ICentralTokenService centralTokenService
    )
    {
        _loginRepository = loginRepository;
        _httpClient = httpClient;
        //_centralTokenService = centralTokenService;
    }

    [HttpGet]
    public IActionResult ForgotPassword()
    {
        return View(Views.Login.ForgotPassword);
    }

    [HttpGet]
    public IActionResult GetActivationCode(string id)
    {
        ViewData["Username"] = id;
        return View(Views.Login.GetActivationCode);
    }

    [HttpGet]
    public IActionResult ResetPassword(string id)
    {
        ViewData["Username"] = id;
        return View(Views.Login.ResetPassword);
    }

    [HttpGet]
    public IActionResult LoginIndex(string opr)
    {
        //decimal serviceAmount = 1 * 56800;

        //TimeSpan reserveTime = new TimeSpan(19, 30, 00);
        //var reserveDateTime = Convert.ToDateTime(DateTime.Now.Date.ToShortDateString() + " " + reserveTime.ToString());

        //var resss = Sms.SendSMS("09155650510", "پیامک تست111");
        //var result = _centralTokenService.GetTokenModel();

        //int i1 = 1;
        //long i2 = 2;
        //short i3 = 3;
        //byte i4 = 4;
        //decimal i6 = 4999;
        //double i7 = 7.555;
        //string i5 = "5";

        //var a1 =IdAndTitle(i1, "sadcsa");
        //var a2 =IdAndTitle(i2, "dsadsaf");
        //var a3 =IdAndTitle(i3, "asef");
        //var a4 =IdAndTitle(i4, "iman");
        //var a5 =IdAndTitle(i5, "ali");
        //var a6 =IdAndTitle(i6, "hasan");
        //var a7 =IdAndTitle(i7, "reza");
        //var ft = 3333;
        //var tcp = new NetTcp();
        //var result = tcp.PingIp("192.168.1.10");
        //var client = new HttpClientRequest(_httpClient);

        // HTTPPOST SAMPLE
        //var beh = new CallBehPardakht();
        //var payment = new Payment();
        //payment.ServiceCode = "1";
        //payment.Amount = "10000000";
        //payment.PayerId = "55649";
        //payment.PcId = "1234";
        //payment.MerchantMsg = "";
        //payment.MerchantadditionalData = "";
        //var resultRequest = client.OnPost(beh.baseUrl, beh.apiUrl, JsonConvert.SerializeObject(payment), "application/json").Result;
        //var resultpcPos = JsonConvert.DeserializeObject<ResultPcPos>(resultRequest);

        // HTTPGET SAMPLE
        //var apiUrl = CallRequestMethod.LabApiUrl + CallRequestMethod.getlistApi;
        //var result = client.OnGet(apiUrl, "", "application/json").Result;

        //var sendResult = Sms.SendSMS("09155650510","این پیام از سیستم cis ارسال شده");

        var identity = User.Identities.FirstOrDefault(c => c.NameClaimType == "Login");
        if (identity != null) return RedirectToAction("HomeIndex", "Home");

        ViewBag.Opr = opr;
        return View(Views.Login.LoginIndex);
    }
}