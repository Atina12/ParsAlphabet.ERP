using ParsAlphabet.ERP.Application.Dtos._Login;

namespace ParsAlphabet.ERP.Application.Interfaces._Login;

public interface ILoginRepository
{
    Task<UserInfo> GetUserInfoByUserId(int userid);
    Task<UserImage> GetUserImageByUserId(int userid);
    Task<List<UserLanguage>> GetUserLanguages(string curlanguage);
    Task<UserLogin> Login(string username, string password);
    Task<bool> ChangeLanguage(int userid, string langcode);
    Task<bool> SetActivationCode(string username, string actcode);
    Task<bool> GetLayoutIsRtl(string langcode);
    Task<string> GetMobileNoByUsername(string username);
    Task<int> GetUserIdByUsername(string username);
    Task<string> GetActCodeByUsername(string username);
    Task<string> GetPasswordSaltByUsername(string username);
    Task<MyResultQuery> GetAuthenticate(CheckAuthenticateViewModel checkAuthenticate);
    Task<MyResultQuery> CheckLogin(UserLoginViewModel model);
    Task<MyResultQuery> SendForgotSms(ForgetPassViewModel model);
    Task<MyResultQuery> CheckAutorize(CheckAuthenticateViewModel checkAuthorize);
    Task<MyResultQuery> ChangePassword(ChangePasswordViewModel model);
}