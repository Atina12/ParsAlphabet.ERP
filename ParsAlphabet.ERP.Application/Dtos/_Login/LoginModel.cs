namespace ParsAlphabet.ERP.Application.Dtos._Login;

public class UserInfo
{
    public int UserId { get; set; }
    public byte RoleId { get; set; }
    public string Username { get; set; }
    public string Fullname { get; set; }
    public byte[] Picture { get; set; }
    public bool Login { get; set; }
    public string Language { get; set; }
    public string MobileNo { get; set; }
    public bool LayoutIsRtl { get; set; }
    public string PasswordSalt { get; set; }
    public short LocCityId { get; set; }
    public string LocCityName { get; set; }
    public string ActivationCode { get; set; }
}

public class UserImage
{
    public string Fullname { get; set; }
    public byte[] Picture { get; set; }
}

public class UserLogin
{
    public string Username { get; set; }
    public string Password { get; set; }
    public bool SuccessLogin { get; set; } = false;
    public bool IsActive { get; set; }
    public int UserId { get; set; }
}

public class UserLanguage
{
    public int Id { get; set; }
    public string Code { get; set; }
    public string Name { get; set; }
    public string FlagName { get; set; }
    public bool IsRtl { get; set; }
    public bool IsActive { get; set; }
}