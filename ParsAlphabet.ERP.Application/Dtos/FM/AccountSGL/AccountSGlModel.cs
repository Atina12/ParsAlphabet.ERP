using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.FM.AccountSGL;

[DisplayName("AccountSGL")]
public class AccountSGLModel : CompanyViewModel
{
    public bool IsSecondLang { get; set; }

    [Display(Name = "ماهیت حساب")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    [Range(1, int.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public int GLId { get; set; }

    [Display(Name = "کد معین")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, int.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public int Id { get; set; }

    [Display(Name = "گروه حساب ها")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public short AccountCategoryId { get; set; }

    [Display(Name = "نام معین")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(100, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }

    public bool IsActive { get; set; }

    public byte AccountDetailRequired { get; set; }

    public List<ID> Ids { get; set; }

    [Display(Name = "ارز")] public List<ID> CurrencyIds { get; set; }

    [NotMapped] public string Opr { get; set; }
}

public class AccountGlSglModel
{
    public int AccountGlId { get; set; }
    public int AccountSglId { get; set; }
}