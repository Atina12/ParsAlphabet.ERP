using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.FM.AccountGL;

[DisplayName("AccountGL")]
public class AccountGLModel : CompanyViewModel
{
    public bool IsSecondLang { get; set; }

    public int Id { get; set; }

    [Display(Name = "نام حساب")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(100, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }

    [Display(Name = "گروه حساب")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    public short CategoryId { get; set; }

    [Display(Name = "ماهیت حساب")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    public byte NatureId { get; set; }

    public bool IsActive { get; set; }

    [NotMapped] public string Opr { get; set; }
}