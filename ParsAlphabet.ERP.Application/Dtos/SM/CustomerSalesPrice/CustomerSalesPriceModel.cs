using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.SM.CustomerSalesPrice;

[DisplayName("CustomerSalesPrice")]
public class CustomerSalesPriceModel : CompanyViewModel
{
    public int Id { get; set; }

    [Display(Name = "نوع")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public byte ItemTypeId { get; set; }

    [Display(Name = "نام آیتم")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public int ItemId { get; set; }

    [Display(Name = "نوع ارز")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public byte CurrencyId { get; set; }

    public byte PricingModelId { get; set; }

    [Display(Name = "نرخ اول")]
    [Range(0, 99999999, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public decimal? MinPrice { get; set; }

    [Display(Name = "نرخ دوم")]
    [Range(0, 99999999, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public decimal? MaxPrice { get; set; }

    public bool? AllowInvoiceDisc { get; set; }

    public bool? PriceIncludingVAT { get; set; }

    public bool? IsActive { get; set; }

    [Display(Name = "نوع قرارداد")]
    [Range(1, 3, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public short ContractTypeId { get; set; }

    public byte? PriceTypeId { get; set; }
    public decimal ComissionPrice { get; set; }
    public int? VendorId { get; set; }

    public List<ID> CustomerSalesPriceDetail { get; set; } = new();

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";
}