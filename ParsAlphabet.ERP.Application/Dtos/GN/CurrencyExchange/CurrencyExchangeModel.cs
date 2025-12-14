using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.GN.CurrencyExchange;

[DisplayName("CurrencyExchange")]
public class CurrencyExchangeModel : CompanyViewModel
{
    public int Id { get; set; }

    [Display(Name = "نام ارز")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, byte.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public byte CurrencyId { get; set; }

    public DateTime? UpdateDate { get; set; }

    public string UpdateDatePersian
    {
        set
        {
            var str = value.ToMiladiDateTime();
            UpdateDate = str == null ? null : str.Value;
        }
    }

    [Display(Name = "نرخ فروش")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public decimal PurchaseRate { get; set; }

    [Display(Name = "نرخ خرید")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public decimal SalesRate { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";
}