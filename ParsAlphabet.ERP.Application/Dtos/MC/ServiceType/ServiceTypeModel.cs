using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.MC.ServiceType;

[DisplayName("ServiceType")]
public class ServiceTypeModel
{
    public int Id { get; set; }

    [Display(Name = "عنوان گروه")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }

    [Display(Name = "عنوان اختصاری")]
    [StringLength(15, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string NickName { get; set; }

    public string TerminologyId { get; set; }

    public bool IsActive { get; set; }

    public bool IsDental { get; set; }

    public short CostCenterId { get; set; }

    [NotMapped] public string Opr => string.IsNullOrEmpty(Id.ToString()) ? "Ins" : "Upd";
}