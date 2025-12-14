using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.GN.PersonAccount;

public class PersonAccountModel : CompanyViewModel
{
    public long Id { get; set; }
    public int PersonId { get; set; }

    [Display(Name = "شخصیت")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public short PersonTypeId { get; set; }

    [Display(Name = "نام بانک")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public short BankId { get; set; }

    [Display(Name = "شماره حساب")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(20, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string AccountNo { get; set; }

    [Display(Name = "شماره کارت")]
    [StringLength(19, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string CardNo { get; set; }

    [Display(Name = "شماره شبا")]
    [StringLength(32, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string ShebaNo { get; set; }

    public bool IsActive { get; set; }
    public bool IsDefualt { get; set; }
}