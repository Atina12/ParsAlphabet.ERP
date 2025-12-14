using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.WH.Warehouse;

[DisplayName("Warehouse")]
public class WarehouseModel : CompanyViewModel
{
    public int Id { get; set; }


    [Display(Name = "نام انبار")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }

    [Display(Name = "شعبه")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public short BranchId { get; set; }

    [Display(Name = "کشور")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, short.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]

    public short LocCountryId { get; set; }

    public short? LocStateId { get; set; }

    public short? LocCityId { get; set; }

    [Display(Name = "نمبر خانه (Postal Code)")]
    [RegularExpression(@"\b(?!(\d)\1{3})[13-9]{4}[1346-9][013-9]{5}\b",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string PostalCode { get; set; }

    [Display(Name = "آدرس ")]
    [StringLength(100, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد ")]
    public string Address { get; set; }

    public bool IsActive { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";
}