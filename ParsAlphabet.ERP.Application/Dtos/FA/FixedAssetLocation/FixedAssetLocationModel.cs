using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.FA.FixedAssetLocation;

[DisplayName("FixedAssetLocation")]
public class FixedAssetLocationModel : CompanyViewModel
{
    public int Id { get; set; }

    [Display(Name = "نام")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }
}