using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.MC.HealthIDOrder;

[DisplayName("HealthIDOrder")]
public class HealthIDOrderModel : CompanyViewModel
{
    public int Id { get; set; }

    [Display(Name = "بیمه گر")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, byte.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public int InsurerId { get; set; }

    [Display(Name = "تعداد")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    [Range(1, short.MaxValue, ErrorMessage = "محدوده {0} بین 1 تا 32768 می باشد")]
    public short Quantity { get; set; }

    public bool IsActive { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";
}