using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.GN.Currency;

[DisplayName("Currency")]
public class CurrencyModel
{
    public int Id { get; set; }

    [Display(Name = "نام")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(30, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }

    public bool IsActive { get; set; }
    public byte QuantityRounding { get; set; }


    [NotMapped] public string TableName { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";
}