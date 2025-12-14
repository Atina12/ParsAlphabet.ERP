namespace ParsAlphabet.ERP.Application.Dtos.WH.Zone;

public class ZoneGetPage
{
    public short Id { get; set; }
    public string Name { get; set; }
    public int WarehouseId { get; set; }
    public string WarehouseName { get; set; }
    public string Warehouse => IdAndTitle(WarehouseId, WarehouseName);
    public string ZoneRankId { get; set; }
    public bool IsActive { get; set; }
}

public class ZoneGetRecord
{
    public short Id { get; set; }
    public string Name { get; set; }
    public string NameEng { get; set; }
    public int WarehouseId { get; set; }
    public string ZoneRankId { get; set; }
    public bool IsActive { get; set; }
}