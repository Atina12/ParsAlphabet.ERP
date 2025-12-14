using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.FM.TreasuryBond;

[DisplayName("TreasuryBond")]
public class TreasuryBondModel : CompanyViewModel
{
    public int Id { get; set; }


    [Display(Name = "حساب بانکی")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, int.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public int BankAccountId { get; set; }

    [Display(Name = "سریال چک")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(10, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string BondSerialNo { get; set; }

    [Display(Name = "شماره چک")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public long BondNo { get; set; }

    [Display(Name = "تعداد برگ")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, 100, ErrorMessage = "مقدار وارد شده برای {0} معتبر نمی باشد")]
    public short BondCountNo { get; set; }

    public bool IsActive { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";
}