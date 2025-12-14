using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.WH.WBin;

[DisplayName("Bin")]
public class BinModel : CompanyViewModel
{
    public short Id { get; set; }

    [Display(Name = "نام پالت")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public string Name { get; set; }

    [Display(Name = "انبار")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, int.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public int? WarehouseId { get; set; }

    [Display(Name = "بخش‌های انبار")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, short.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public short ZoneId { get; set; }

    [Display(Name = "دسته‌بندی")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, short.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public byte CategoryId { get; set; }

    [Display(Name = "شناسه پالت")] public string BinRankId { get; set; }

    public bool NegativeInventory { get; set; }
    public bool IsActive { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";
}