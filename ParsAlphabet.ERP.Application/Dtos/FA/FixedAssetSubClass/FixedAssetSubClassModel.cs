using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.FA.FixedAssetSubClass;

[DisplayName("FixedAssetSubClass")]
public class FixedAssetSubClassModel
{
    public int Id { get; set; }

    [Display(Name = "طبقه بندی")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public int FixedAssetClassId { get; set; }

    [Display(Name = "طبقه بندی فرعی")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public string Name { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";
}