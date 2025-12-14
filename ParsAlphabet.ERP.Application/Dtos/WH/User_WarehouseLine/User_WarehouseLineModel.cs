using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.WH.User_WarehouseLine;

[DisplayName("User_Warehouse")]
public class User_WarehouseLineModel : CompanyViewModel
{
    public short UserId { get; set; }
    public int WarehouseId { get; set; }
    public bool IsActive { get; set; }

    [NotMapped] public string Opr => UserId == 0 ? "Ins" : "Upd";
}