using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.PU.VendorItems;

[DisplayName("VendorItems")]
public class VendorItemsModel
{
    public int VendorId { get; set; }
    public int ItemId { get; set; }
    public bool IsActive { get; set; }

    [NotMapped] public string Opr => VendorId == 0 ? "Ins" : "Upd";
}