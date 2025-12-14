using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.FM.CostCenter;

[DisplayName("CostCenter")]
public class CostCenterModel : CompanyViewModel
{
    public bool IsSecondLang { get; set; }

    public int Id { get; set; }

    [Display(Name = "نام")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }

    [Display(Name = "محرک هزینه")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    [Range(1, byte.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public byte CostDriverId { get; set; }

    [Display(Name = "دسته بندی")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    [Range(1, byte.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public byte CostCategoryId { get; set; }

    public bool IsActive { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";

    public string JsonAccountDetailList { get; set; }
}