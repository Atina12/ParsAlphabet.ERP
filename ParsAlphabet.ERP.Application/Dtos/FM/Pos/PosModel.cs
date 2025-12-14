using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.FM.Pos;

[DisplayName("Pos")]
public class PosModel : CompanyViewModel
{
    public int Id { get; set; }

    [Display(Name = "نام دستگاه")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }

    [Display(Name = "حساب بانکی")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    public int BankAccountId { get; set; }

    [Display(Name = "شماره پایانه دستگاه")]
    //[StringLength(10, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string TerminalNo { get; set; }

    public bool IsPcPos { get; set; }

    [Display(Name = "آی پی سیستم صندوق")]
    // [Required(ErrorMessage = "{0} را وارد کنید")]
    //[StringLength(15, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Cashier_IpAddress { get; set; }

    public byte PosProviderId { get; set; }

    public bool IsActive { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";
}