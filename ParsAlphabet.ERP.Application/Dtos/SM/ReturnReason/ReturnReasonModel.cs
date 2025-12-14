using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.SM.ReturnReason;

[DisplayName("ReturnReason")]
public class ReturnReasonModel : CompanyViewModel
{
    public bool IsSecondLang { get; set; }
    public byte Id { get; set; }

    [Display(Name = "علت مرجوعی")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }

    public bool IsActive { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";
}