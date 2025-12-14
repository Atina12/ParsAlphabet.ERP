using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.FM.AccountCategory;

[DisplayName("AccountCategory")]
public class AccountCategoryModel : CompanyViewModel
{
    public int Id { get; set; }

    [Display(Name = "نام")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }

    public byte IncomeBalanceId { get; set; }
    public bool IsActive { get; set; }

    public string Opr => Id == 0 ? "Ins" : "Upd";
}