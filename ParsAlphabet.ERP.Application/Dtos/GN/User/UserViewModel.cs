namespace ParsAlphabet.ERP.Application.Dtos.GN.User;

public class UserGetPage
{
    public int Id { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public string MobileNo { get; set; }
    public string Username { get; set; }
    public byte[] Picture { get; set; }
    public byte RoleId { get; set; }
    public string Role { get; set; }
    public string RoleName => IdAndTitle(RoleId, Role);
    public bool IsActive { get; set; }
}

public class UserGetRecord
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string NationalCode { get; set; }
    public byte? RoleId { get; set; }
    public string Email { get; set; }
    public string MobileNo { get; set; }
    public string Username { get; set; }
    public byte[] Picture { get; set; }
    public string Password { get; set; }
    public string PasswordHalt { get; set; }
    public string PasswordHash { get; set; }
    public bool IsActive { get; set; }
}

public class UserChangePassword
{
    public int Id { get; set; }
    public string Password { get; set; }
}

public class GetUserByNationalCode
    : CompanyViewModel
{
    public int Id { get; set; }
    public string NationalCode { get; set; }
}

public class Profile
{
    public int UserId { get; set; }
    public string RoleName { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string NationalCode { get; set; }
    public string Email { get; set; }
    public string MobileNo { get; set; }
    public string UserName { get; set; }
    public string FullName { get; set; }
    public byte[] Picture { get; set; }
    public string Language { get; set; }
    public string CityName { get; set; }

    public string Browser { get; set; }
    public string OperatingSystem { get; set; }
    public string Ip { get; set; }
}

public class UpdateProfile
{
    public string Password { get; set; }
    public string PasswordHash { get; set; }

    public string PasswordSalt { get; set; }
    //public byte[] Picture { get; set; }
    //public string Picture_base64 { get; set; }
}