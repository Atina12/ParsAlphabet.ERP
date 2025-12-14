using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.CR.PersonGroup;

[DisplayName("PersonGroup")]
public class PersonGroupModel : CompanyViewModel
{
    public bool IsSecondLang { get; set; }
    public byte Id { get; set; }

    [Display(Name = "نام")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(100, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }

    public byte PersonTypeId { get; set; }
    public bool IsActive { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";
}