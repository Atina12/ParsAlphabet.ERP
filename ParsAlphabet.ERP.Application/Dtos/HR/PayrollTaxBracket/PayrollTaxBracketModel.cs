using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.HR.PayrollTaxBracket;

[DisplayName("PayrollTaxBracket")]
public class PayrollTaxBracketModel : CompanyViewModel
{
    public short Id { get; set; }

    [Display(Name = "سال مالی")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public short FiscalYearId { get; set; }

    [Display(Name = "نام")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }

    [Display(Name = "تاریخ و زمان ثبت")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [DataType(DataType.DateTime)]
    public DateTime CreateDateTime { get; set; } = DateTime.Now;

    public int CreateUserId { get; set; }
    public bool IsActive { get; set; }
}