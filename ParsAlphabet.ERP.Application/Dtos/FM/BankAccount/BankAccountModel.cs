using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.FM.BankAccount;

[DisplayName("BankAccount")]
public class BankAccountModel : CompanyViewModel
{
    public int Id { get; set; }

    [Display(Name = "بانک")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    public short BankId { get; set; }

    [Display(Name = "نام")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    [MaxLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد ")]
    public string Name { get; set; }

    public string NameEng { get; set; }

    [Display(Name = "دسته‌بندی حساب")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    public int BankAccountCategoryId { get; set; }

    [Display(Name = "کد شعبه")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    [Range(1, int.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public int BranchNo { get; set; }

    [Display(Name = "نام شعبه")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string BranchName { get; set; }

    [Display(Name = "شماره حساب")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(20, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string AccountNo { get; set; }

    [Display(Name = "کشور")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    [Range(1, short.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public short LocCountryId { get; set; }

    [Display(Name = "ولایت")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    [Range(1, short.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public short LocStateId { get; set; }

    [Display(Name = "شهر")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    [Range(1, short.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public short LocCityId { get; set; }

    [Display(Name = "آدرس")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(100, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Address { get; set; }

    public bool IsActive { get; set; }

    [Display(Name = "شماره شبا")]
    [StringLength(32, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string ShebaNo { get; set; }
}