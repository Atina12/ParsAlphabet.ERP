using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.HR.PayrollSocialSecurityBracket;

[DisplayName("PayrollSocialSecurityBracket")]
public class PayrollSocialSecurityBracketModel : CompanyViewModel
{
    public int Id { get; set; }

    [Display(Name = "سال مالی")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public short FiscalYearId { get; set; }

    [Display(Name = "نام")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }

    [Display(Name = "بیمه گر")] public int InsurerId { get; set; }

    [Display(Name = "کد گارگاه")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(15, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string WorkshopCode { get; set; }

    [Display(Name = "نام گارگاه")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string WorkshopName { get; set; }

    [Display(Name = "ردیف پیمان")] public short ContractNo { get; set; }

    [Display(Name = "نوع بیمه")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public byte SocialSecurityTypeId { get; set; }

    [Display(Name = "درصد بیمه کارفرما")] public byte EmployerSCPercentage { get; set; }

    [Display(Name = "درصد بیمه پرسنل")] public byte EmployeeSCPercentage { get; set; }

    [Display(Name = "درصد بیمه بیکاری")] public byte UnEmploymentSCPercentage { get; set; }

    [Display(Name = "سقف بیمه حقوق")] public long MaxPensionableAmount { get; set; }

    [Display(Name = "تاریخ و زمان ثبت")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [DataType(DataType.DateTime)]
    public DateTime CreateDateTime { get; set; } = DateTime.Now;

    [Display(Name = "کاربر ثبت کننده")] public int CreateUserId { get; set; }

    [Display(Name = "وضعیت")] public bool IsActive { get; set; }
}