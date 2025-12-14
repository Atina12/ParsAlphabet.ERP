using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.WH.ItemCategoryAttribute;

[DisplayName("ItemCategoryAttribute")]
public class ItemCategoryAttributeModel : CompanyViewModel
{
    public short Id { get; set; }
    public short ItemCategoryId { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime { get; set; }
    public string ItemAttributeLineIds { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";
}