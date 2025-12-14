using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.WH.ItemUnit;

[DisplayName("ItemUnit")]
public class ItemUnitModel
{
    public int Id { get; set; }

    [Display(Name = "واحد شمارش")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }

    [NotMapped] public int CompanyId { get; set; }

    public bool IsActive { get; set; }
}