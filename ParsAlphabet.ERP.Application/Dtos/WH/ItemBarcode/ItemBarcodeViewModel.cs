namespace ParsAlphabet.ERP.Application.Dtos.WH.ItemBarcode;

public class ItemBarcodeGetPage
{
    public short Id { get; set; }
    public int ItemId { get; set; }
    public string ItemName { get; set; }
    public string Item => IdAndTitle(ItemId, ItemName);
    public byte ItemTypeId { get; set; }
    public string ItemTypeName { get; set; }
    public string ItemType => IdAndTitle(ItemTypeId, ItemTypeName);
    public string AttributeIds { get; set; }
    public string AttributeNames { get; set; }
    public string Attribute => IdAndTitle(AttributeIds, AttributeNames);
    public string Barcode { get; set; }
    public int CreateUserId { get; set; }
    public DateTime? CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateStringNull();
}

public class ItemBarcodeGetRecord
{
    public short Id { get; set; }
    public int ItemId { get; set; }
    public byte ItemTypeId { get; set; }
    public string ItemName { get; set; }
    public string AttributeIds { get; set; }
    public string AttributeNames { get; set; }
    public string Barcode { get; set; }
    public int CreateUserId { get; set; }
    public DateTime? CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateStringNull();
}