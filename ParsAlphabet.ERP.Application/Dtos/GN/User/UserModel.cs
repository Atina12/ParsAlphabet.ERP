using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.GN.User;

public class UserModel : CompanyViewModel
{
    public int Id { get; set; }

    [Display(Name = "نام")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string FirstName { get; set; }

    [Display(Name = " تخلص")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string LastName { get; set; }

    [Display(Name = "نمبر تذکره")]
    [AfghanTazkira(ErrorMessage = "{0} معتبر نمی باشد")]
    public string NationalCode { get; set; }

    [Display(Name = "ایمیل")]
    [RegularExpression(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string Email { get; set; }

    [Display(Name = "شماره موبایل")]
    [RegularExpression(@"09(0[1-2]|1[0-9]|3[0-9]|2[0-1])-?[0-9]{3}-?[0-9]{4}",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string MobileNo { get; set; }

    [Display(Name = "نام کاربری")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Username { get; set; }

    [Display(Name = "نقش")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public byte? RoleId { get; set; }

    [Display(Name = "رمز عبور")] public string Password { get; set; }

    public string PasswordHash { get; set; }
    public string PasswordSalt { get; set; }
    public byte[] Picture { get; set; }
    public string Picture_base64 { get; set; }
    public bool? IsActive { get; set; }
}