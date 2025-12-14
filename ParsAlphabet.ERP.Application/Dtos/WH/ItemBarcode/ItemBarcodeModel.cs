using System.ComponentModel;

namespace ParsAlphabet.ERP.Application.Dtos.WH.ItemBarcode;

[DisplayName("ItemBarcode")]
public class ItemBarcodeModel
{
    public short Id { get; set; }
    public int ItemId { get; set; }
    public string AttributeIds { get; set; }
    public string Barcode { get; set; }
    public int CreateUserId { get; set; }
    public DateTime? CreateDateTime { get; set; }
}