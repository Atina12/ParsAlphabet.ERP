using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.HR.StandardTimeSheet;

[DisplayName("StandardTimeSheet")]
public class StandardTimeSheetModel : CompanyViewModel
{
    public int Id { get; set; }

    [Display(Name = "نام")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }

    public int DepartmentId { get; set; }

    public bool IsActive { get; set; }

    [Display(Name = "سال مالی")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public short FiscalYearId { get; set; }

    public int CreateUserId { get; set; }
    public DateTime CreateDateTime { get; set; } = DateTime.Now;
    public string Description { get; set; }
}