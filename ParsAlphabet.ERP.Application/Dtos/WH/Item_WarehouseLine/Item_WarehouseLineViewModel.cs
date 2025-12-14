namespace ParsAlphabet.ERP.Application.Dtos.WH.Item_WarehouseLine;

public class WarehouseItemLineGetPage
{
    public int Id { get; set; }
    public string Name { get; set; }
    public byte ItemTypeId { get; set; }
    public string ItemTypeName { get; set; }
    public string ItemType => IdAndTitle(ItemTypeId, ItemTypeName);
    public short ZoneId { get; set; }
    public string ZoneName { get; set; }
    public string ZoneIdName => IdAndTitle(ZoneId, ZoneName);
    public int BinId { get; set; }
    public string BinName { get; set; }
    public string BinIdName => IdAndTitle(BinId, BinName);
    public int CreateuserId { get; set; }
    public string FullName { get; set; }
    public string UserFullName => IdAndTitle(CreateuserId, FullName);

    public DateTime? CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateStringNull("{0}/{1}/{2}");
}

public class WarehouseItemLineAssignList
{
    public List<WarehouseItemLineGetPage> Assigns { get; set; }
}

public class WarehouseItemLineAssign
{
    public int CompanyId { get; set; }
    public short WarehouseId { get; set; }
    public short ItemtypeId { get; set; }
    public short ZoneId { get; set; }
    public short BinId { get; set; }
    public int CreateUserId { get; set; }
    public List<ID> Assign { get; set; }
}

public class WarehouseItemLineGetRecord
{
    public int? WarehouseId { get; set; }
    public int ItemId { get; set; }
    public bool IsActive => ItemId != 0 && WarehouseId != 0;
}

public class Get_WarehouseItemLine
{
    public int? WarehouseId { get; set; }
    public int? ItemId { get; set; }
}