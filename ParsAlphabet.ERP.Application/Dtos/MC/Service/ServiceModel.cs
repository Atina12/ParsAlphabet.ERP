using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.MC.Service;

[DisplayName("Service")]
public class ServiceModel : CompanyViewModel
{
    public int Id { get; set; }

    public int? CentralId { get; set; }

    [Display(Name = "عنوان خدمت (آفلاین)")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(100, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }

    [Display(Name = "عنوان خدمت (آنلاین)")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string OnlineName { get; set; }

    [Display(Name = "نوع سرویس")] public string ServiceTypeId { get; set; }

    public int? TerminologyId { get; set; }
    public int? TaminTerminologyId { get; set; }
    public short? CdtTerminologyId { get; set; }

    [Display(Name = "توضیحات")]
    [StringLength(200, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string PrintDescription { get; set; }

    public bool IsActive { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";

    [NotMapped] public int CreateUserId { get; set; }

    [NotMapped] public DateTime CreateDateTime { get; set; }
}