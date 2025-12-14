using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.SM.Segment;

public class SegmentModel : CompanyViewModel
{
    public int Id { get; set; }

    [Display(Name = "نام ")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(100, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }

    public string NameEng { get; set; }
    public DateTime CreateDateTime { get; set; }

    [Display(Name = "نام ")]
    [StringLength(2000, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Note { get; set; }

    public string UserId { get; set; }
    public bool IsActive { get; set; }
}