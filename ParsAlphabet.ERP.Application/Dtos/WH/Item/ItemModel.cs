using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.WH.Item;

[DisplayName("Item")]
public class ItemModel : CompanyViewModel
{
    public int Id { get; set; }

    [Display(Name = "نوع کالا / خدمت")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public byte ItemTypeId { get; set; }

    [Display(Name = "نام")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(100, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }

    [Display(Name = "دسته بندی")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, short.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public short CategoryId { get; set; }

    [Display(Name = "واحد شمارش")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public byte UnitId { get; set; }

    [Display(Name = "کد فنی")]
    [StringLength(20, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string TechnicalCode { get; set; }


    [Display(Name = "وزن ناخالص")]
    [RegularExpression(@"^\d*(\.|,|(\.\d{1,3})|(,\d{1,3}))?$",
        ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    [Range(0, 99999.999, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public decimal? GrossWeight { get; set; }

    [Display(Name = "وزن خالص")]
    [RegularExpression(@"^\d*(\.|,|(\.\d{1,3})|(,\d{1,3}))?$",
        ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    [Range(0, 99999.999, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public decimal? NetWeight { get; set; }

    public decimal? OrderPoint { get; set; }
    public decimal? MinOrder { get; set; }
    public decimal? MinQuantity { get; set; }

    public bool VATEnable { get; set; }

    [Display(Name = "درصد مالیات بر ارزش افزوده")]
    public byte? VATId { get; set; }

    public bool PriceIncludingVat { get; set; }
    public bool ExclusiveSupplier { get; set; }
    public bool? IsActive { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";

    public DateTime? SubscriptionFromDate => SubscriptionFromDatePersian.ToMiladiDateTime();
    public string SubscriptionFromDatePersian { get; set; }
    public DateTime? SubscriptionToDate => SubscriptionToDatePersian.ToMiladiDateTime();
    public string SubscriptionToDatePersian { get; set; }
    public bool Unlimited { get; set; }

    public short PayrollTaxId { get; set; }
    public short PayrollInsurerId { get; set; }
}