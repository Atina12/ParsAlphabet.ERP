using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.GN.LocCountry;

public class LocCountryModel : CompanyViewModel
{
    [DisplayName("LocCountry")] public int Id { get; set; }

    [Display(Name = "نام کشور")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }

    [NotMapped] public string TableName { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";

    public bool IsSecondLang { get; set; }
}