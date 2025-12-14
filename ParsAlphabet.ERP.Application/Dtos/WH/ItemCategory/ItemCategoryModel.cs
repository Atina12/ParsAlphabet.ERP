using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.WH.ItemCategory;

[DisplayName("ItemCategory")]
public class ItemCategoryModel : CompanyViewModel
{
    public bool IsSecondLang { get; set; }
    public short Id { get; set; }

    [Display(Name = "نام ")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }

    public bool IsActive { get; set; }

    [Display(Name = "دسته بندی ")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, byte.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]

    public byte ItemTypeId { get; set; }

    public string ItemAttributeIds { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";
}