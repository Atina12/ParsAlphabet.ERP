namespace ParsAlphabet.ERP.Application.Dtos._Login;

public class UserLoginViewModel
{
    public string UserName { get; set; }
    public string Password { get; set; }
    public bool RememberPass { get; set; }
}

public class ForgetPassViewModel
{
    public string UserName { get; set; }
    public string MobileNo { get; set; }
}

public class CheckActivationViewModel
{
    public string UserName { get; set; }
    public string ActCode { get; set; }
}

public class ChangePasswordViewModel
{
    public string UserName { get; set; }
    public string NewPassword { get; set; }
}

public class CheckAuthenticateViewModel
{
    public int UserId { get; set; }
    public string ControllerName { get; set; }
    public string OprType { get; set; }
}

public class ExternalLoginModel
{
    public string Token { get; set; }
    public DateTime ExpireDateTime { get; set; }
    public string DisplayName { get; set; }
}

public class CentralPropertiesModel
{
    public int Id { get; set; }
    public int CompanyId { get; set; }
    public string ValidIssuer { get; set; }
    public bool ValidateIssuer { get; set; }
    public string ValidAudience { get; set; }
    public bool ValidateAudience { get; set; }
    public string IssuerSigningKey { get; set; }
    public bool ValidateIssuerSigningKey { get; set; }
    public bool ValidateLifetime { get; set; }
    public TimeSpan ClockSkew { get; set; }
}