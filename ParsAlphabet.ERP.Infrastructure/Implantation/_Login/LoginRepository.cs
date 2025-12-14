using System.Data;
using System.Security.Claims;
using Dapper;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces._Setup;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.User;

namespace ParsAlphabet.ERP.Infrastructure.Implantation._Login;

public class LoginRepository(
    IConfiguration config,
    IHttpContextAccessor httpContext,
    UserRepository userRepository,
    ISetupRepository setupRepository,
    ICompanyRepository companyRepository) : ILoginRepository
{
    public IDbConnection Connection => new SqlConnection(config.GetConnectionString("DefaultConnection"));

    public async Task<UserInfo> GetUserInfoByUserId(int userid)
    {
        var result = new UserInfo();
        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_User_GetInfoByUserId";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<UserInfo>(sQuery,
                new
                {
                    UserId = userid
                }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<UserImage> GetUserImageByUserId(int userid)
    {
        var result = new UserImage();
        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_User_GetInfoByUserId";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<UserImage>(sQuery,
                new
                {
                    UserId = userid
                }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<UserLogin> Login(string username, string passwordhash)
    {
        var result = new UserLogin();

        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_User_Login";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<UserLogin>(sQuery,
                new
                {
                    Username = username,
                    passwordhash
                }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<bool> ChangeLanguage(int userid, string languagecode)
    {
        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_User_ChangeLanguage";
            conn.Open();
            var model = await conn.QueryFirstOrDefaultAsync(sQuery,
                new
                {
                    userid,
                    languagecode
                }, commandType: CommandType.StoredProcedure);
            return true;
        }
    }

    public async Task<bool> SetActivationCode(string username, string actcode)
    {
        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_User_SetActivationCode";
            conn.Open();
            var model = await conn.ExecuteAsync(sQuery,
                new
                {
                    UserName = username,
                    ActCode = actcode
                }, commandType: CommandType.StoredProcedure);
            return true;
        }
    }

    public async Task<bool> GetLayoutIsRtl(string languageCode)
    {
        var outval = false;
        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_UserLanguage_IsRtl";
            conn.Open();
            outval = await conn.QueryFirstOrDefaultAsync<bool>(sQuery,
                new { languageCode }, commandType: CommandType.StoredProcedure);
        }

        return outval;
    }

    public async Task<string> GetMobileNoByUsername(string username)
    {
        var model = new UserInfo();
        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_User_GetInfoByUserName";
            conn.Open();
            model = await conn.QueryFirstOrDefaultAsync<UserInfo>(sQuery,
                new
                {
                    username
                }, commandType: CommandType.StoredProcedure);
        }

        if (model != null)
            return model.MobileNo;
        return "";
    }

    public async Task<int> GetUserIdByUsername(string username)
    {
        var model = new UserInfo();
        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_User_GetInfoByUserName";
            conn.Open();
            model = await conn.QueryFirstOrDefaultAsync<UserInfo>(sQuery,
                new
                {
                    Username = username
                }, commandType: CommandType.StoredProcedure);
        }

        if (model != null)
            return model.UserId;
        return 0;
    }

    public async Task<string> GetActCodeByUsername(string username)
    {
        var model = new UserInfo();
        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_User_GetInfoByUserName";
            conn.Open();
            model = await conn.QueryFirstOrDefaultAsync<UserInfo>(sQuery,
                new
                {
                    Username = username
                }, commandType: CommandType.StoredProcedure);
        }

        if (model != null)
            return model.ActivationCode;
        return "";
    }

    public async Task<string> GetPasswordSaltByUsername(string username)
    {
        var model = new UserInfo();
        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_User_GetInfoByUserName";
            conn.Open();
            model = await conn.QueryFirstOrDefaultAsync<UserInfo>(sQuery,
                new
                {
                    Username = username
                }, commandType: CommandType.StoredProcedure);
        }

        if (model != null)
            return model.PasswordSalt;
        return "";
    }

    public async Task<List<UserLanguage>> GetUserLanguages(string curlanguage)
    {
        var result = new List<UserLanguage>();
        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_User_GetLanguages";
            conn.Open();
            var list = (await conn.QueryAsync<UserLanguage>(sQuery, commandType: CommandType.StoredProcedure)).ToList();
            foreach (var item in list)
                if (item.Code == curlanguage)
                    item.IsActive = true;
            return list;
        }
    }

    public async Task<MyResultQuery> GetAuthenticate(CheckAuthenticateViewModel checkAuthorize)
    {
        checkAuthorize.OprType = checkAuthorize.OprType.ToLower();

        AuthenticateOperationType operationTypeId = 0;
        switch (checkAuthorize.OprType)
        {
            case "viw":
                operationTypeId = AuthenticateOperationType.VIW;
                break;
            case "viwall":
                operationTypeId = AuthenticateOperationType.VIWALL;
                break;
            case "dis":
                operationTypeId = AuthenticateOperationType.DIS;
                break;
            case "ins":
                operationTypeId = AuthenticateOperationType.INS;
                break;
            case "upd":
                operationTypeId = AuthenticateOperationType.UPD;
                break;
            case "del":
                operationTypeId = AuthenticateOperationType.DEL;
                break;
            case "prn":
                operationTypeId = AuthenticateOperationType.PRN;
                break;
            case "fil":
                operationTypeId = AuthenticateOperationType.FIL;
                break;
        }

        var controllerName = string.Empty;

        if (checkAuthorize.NotNull() && checkAuthorize.ControllerName.NotNull())
            controllerName = checkAuthorize.ControllerName.Trim();

        var controllerNameValues = controllerName.Split('#');

        var controllerNameList = controllerNameValues.Select(c => new { ControllerName = c }).ToList();


        var filterModel = new
        {
            checkAuthorize.UserId,
            ControllerNameJSON = JsonConvert.SerializeObject(controllerNameList),
            OperationTypeId = operationTypeId
        };

        var resultQuery = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_User_Authenticate";
            conn.Open();
            var result =
                await conn.ExecuteScalarAsync<bool>(sQuery, filterModel, commandType: CommandType.StoredProcedure);

            resultQuery.Successfull = result;
            return resultQuery;
        }
    }

    public async Task<MyResultQuery> CheckLogin(UserLoginViewModel model)
    {
        var resultQuery = new MyResultQuery();

        MyClaim.Init(httpContext);

        var passwordsalt = "";
        var passwordhash = "";
        try
        {
            passwordsalt = await GetPasswordSaltByUsername(model.UserName);
            passwordhash = Password.GetHash(model.Password, passwordsalt);
        }
        catch (Exception)
        {
            resultQuery.Successfull = false;
            resultQuery.StatusMessage = "error_db";
            return resultQuery;
        }


        var result = await Login(model.UserName, passwordhash);
        if (result.UserId == 0 || result.UserId == 1)
        {
            resultQuery.Successfull = false;
            resultQuery.StatusMessage = "error_incorrect";
            return resultQuery;
        }

        if (result.IsActive == false)
        {
            resultQuery.Successfull = false;
            resultQuery.StatusMessage = "error_active";
            return resultQuery;
        }

        if (result.SuccessLogin)
        {
            var result1 = await GetUserInfoByUserId(result.UserId);
            {
                var ipaddress = MyClaim.IpAddress;
                var setupInfo = await setupRepository.GetSetupInfo();
                var ciswcfurl = setupInfo.CIS_WCF_Url;
                var companyId = 1;
                var defaultCurrencyId = await companyRepository.GetDefaultCurrency(companyId);
                var idn1 = httpContext.HttpContext?.User.Identities.FirstOrDefault(c => c.NameClaimType == "Login");
                var multiDevice = bool.Parse(config["LoginSettings:multiDevice"] ?? "false");
                if (idn1 != null && !multiDevice)
                {
                    idn1.RemoveClaim(idn1.FindFirst("UserId"));
                    idn1.RemoveClaim(idn1.FindFirst("RoleId"));
                    idn1.RemoveClaim(idn1.FindFirst("Username"));
                    idn1.RemoveClaim(idn1.FindFirst("FullName"));
                    idn1.RemoveClaim(idn1.FindFirst("Language"));
                    idn1.RemoveClaim(idn1.FindFirst("IsSecondLang"));
                    idn1.RemoveClaim(idn1.FindFirst("MobileNo"));
                    idn1.RemoveClaim(idn1.FindFirst("LayoutIsRtl"));
                    idn1.RemoveClaim(idn1.FindFirst("PasswordSalt"));
                    idn1.RemoveClaim(idn1.FindFirst("LocCityId"));
                    idn1.RemoveClaim(idn1.FindFirst("LocCityName"));
                    idn1.RemoveClaim(idn1.FindFirst("IpAddress"));
                    idn1.RemoveClaim(idn1.FindFirst("CIS_WCF_Url"));
                    idn1.RemoveClaim(idn1.FindFirst("CompanyId"));
                    idn1.RemoveClaim(idn1.FindFirst("DefaultCurrencyId"));

                    var newclaim1 = new Claim("UserId", result1.UserId.ToString());
                    idn1.AddClaim(newclaim1);

                    var newclaim01 = new Claim("RoleId", result1.RoleId.ToString());
                    idn1.AddClaim(newclaim01);

                    var newclaim2 = new Claim("Username", result1.Username);
                    idn1.AddClaim(newclaim2);
                    var newclaim3 = new Claim("FullName", result1.Fullname);
                    idn1.AddClaim(newclaim3);
                    var newclaim4 = new Claim("Language", result1.Language);
                    idn1.AddClaim(newclaim4);
                    var newclaim5 = new Claim("IsSecondLang", "false");
                    idn1.AddClaim(newclaim5);
                    var newclaim6 = new Claim("MobileNo", result1.MobileNo);
                    idn1.AddClaim(newclaim6);
                    var newclaim7 = new Claim("LayoutIsRtl", result1.LayoutIsRtl.ToString());
                    idn1.AddClaim(newclaim7);
                    var newclaim8 = new Claim("PasswordSalt", result1.PasswordSalt);
                    idn1.AddClaim(newclaim8);
                    var newclaim9 = new Claim("LocCityId", result1.LocCityId.ToString());
                    idn1.AddClaim(newclaim9);
                    var newclaim10 = new Claim("LocCityName", result1.LocCityName);
                    idn1.AddClaim(newclaim10);
                    var newclaim11 = new Claim("IpAddress", ipaddress);
                    idn1.AddClaim(newclaim11);

                    var newclaim14 = new Claim("CIS_WCF_Url", ciswcfurl);
                    idn1.AddClaim(newclaim14);
                    var newclaim15 = new Claim("CompanyId", companyId.ToString(), ClaimValueTypes.Integer32);
                    idn1.AddClaim(newclaim15);

                    var newclaim16 = new Claim("DefaultCurrencyId", defaultCurrencyId.ToString(),
                        ClaimValueTypes.Integer32);
                    idn1.AddClaim(newclaim16);
                }
                else
                {
                    var idn2 = new ClaimsIdentity(new[]
                    {
                        new Claim("UserId", result1.UserId.ToString()),
                        new Claim("RoleId", result1.RoleId.ToString()),
                        new Claim("Username", result1.Username),
                        new Claim("FullName", result1.Fullname),
                        new Claim("Language", result1.Language),
                        new Claim("IsSecondLang", "false"),
                        new Claim("MobileNo", result1.MobileNo),
                        new Claim("LayoutIsRtl", result1.LayoutIsRtl.ToString()),
                        new Claim("PasswordSalt", result1.PasswordSalt),
                        new Claim("LocCityId", result1.LocCityId.ToString()),
                        new Claim("LocCityName", result1.LocCityName),
                        new Claim("IpAddress", ipaddress),
                        new Claim("CIS_WCF_Url", ciswcfurl),
                        new Claim("CompanyId", companyId.ToString(), ClaimValueTypes.Integer32),
                        new Claim("DefaultCurrencyId", defaultCurrencyId.ToString(), ClaimValueTypes.Integer32)
                    }, CookieAuthenticationDefaults.AuthenticationScheme, "Login", "");

                    httpContext.HttpContext?.User.AddIdentity(idn2);
                    DateTimeOffset? expireTime = model.RememberPass ? DateTimeOffset.UtcNow.AddDays(30) : null;
                    var principal = new ClaimsPrincipal(idn2);
                    var properties = new AuthenticationProperties
                    {
                        IsPersistent = model.RememberPass,
                        ExpiresUtc = expireTime
                    };
                    await httpContext.HttpContext?.SignInAsync(principal, properties)!;
                }

                var userId = UserClaims.GetUserId();
                await userRepository.UserSetONOFF(true, userId, companyId);

                resultQuery.Successfull = true;
                resultQuery.StatusMessage = "success";
                return resultQuery;
            }
        }

        resultQuery.Successfull = false;
        resultQuery.StatusMessage = "error_incorrect";
        return resultQuery;
    }

    public async Task<MyResultQuery> CheckAutorize(CheckAuthenticateViewModel checkAuthorize)
    {
        var resultQuery = new MyResultQuery();
        checkAuthorize.UserId = Convert.ToInt32(httpContext.HttpContext?.User.FindFirstValue("UserId"));
        if (checkAuthorize.UserId != 0) return await GetAuthenticate(checkAuthorize);
        resultQuery.Successfull = false;
        resultQuery.StatusMessage = "LoginExpired";
        return resultQuery;
    }

    public async Task<MyResultQuery> SendForgotSms(ForgetPassViewModel model)
    {
        var resultQuery = new MyResultQuery();

        var tMobileno = await GetMobileNoByUsername(model.UserName);

        if (tMobileno != model.MobileNo)
        {
            resultQuery.StatusMessage = "error_incorrect";
            return resultQuery;
        }

        var t_actcode = ActivationCode.RandomNumber(10000, 99999).ToString();
        var sw = await SetActivationCode(model.UserName, t_actcode);
        if (!sw)
        {
            resultQuery.StatusMessage = "error_gencode";
            return resultQuery;
        }

        sw = Sms.SendSMS(model.MobileNo, "کد اعتبار سنجی " + t_actcode + " جهت بازنشانی رمز عبور .");

        if (!sw)
        {
            resultQuery.StatusMessage = "error_sendsms";
            return resultQuery;
        }

        resultQuery.StatusMessage = "success";
        return resultQuery;
    }

    public async Task<MyResultQuery> ChangePassword(ChangePasswordViewModel model)
    {
        var resultQuery = new MyResultQuery();

        var result = GetUserIdByUsername(model.UserName);
        var t_userid = result.Result;
        var salt = Password.GetRandomSalt();
        var hash = Password.GetHash(model.NewPassword, salt);
        await userRepository.ChangePassword(t_userid, hash, salt);

        resultQuery.StatusMessage = t_userid == 0 ? "error_nouserid" : "success";

        return resultQuery;
    }
}