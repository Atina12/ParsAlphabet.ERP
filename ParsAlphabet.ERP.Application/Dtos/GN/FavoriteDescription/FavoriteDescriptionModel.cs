using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.GN.FavoriteDescription;

[DisplayName("FavoriteDescription")]
public class FavoriteDescriptionModel : CompanyViewModel
{
    public int Id { get; set; }

    [Display(Name = "توضیحات")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(120, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Description { get; set; }

    public bool IsActive { get; set; }
    public short StageId { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";
}