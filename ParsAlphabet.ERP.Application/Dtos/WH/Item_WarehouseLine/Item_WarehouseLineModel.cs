using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.WH.Item_WarehouseLine;

[DisplayName("Item_Warehouse")]
public class Item_WarehouseLineModel : CompanyViewModel
{
    public short UserId { get; set; }
    public int? WarehouseId { get; set; }
    public bool IsActive { get; set; }

    [NotMapped] public string Opr => UserId == 0 ? "Ins" : "Upd";
}