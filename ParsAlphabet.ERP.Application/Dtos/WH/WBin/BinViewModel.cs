namespace ParsAlphabet.ERP.Application.Dtos.WH.WBin;

public class BinGetPage
{
    public short Id { get; set; }
    public string Name { get; set; }
    public short? WarehouseId { get; set; }
    public string WarehouseName { get; set; }
    public string Warehouse => IdAndTitle(WarehouseId, WarehouseName);

    public short ZoneId { get; set; }
    public string ZoneName { get; set; }
    public string Zone => IdAndTitle(ZoneId, ZoneName);


    public short CategoryId { get; set; }
    public string CategoryName { get; set; }
    public string Category => IdAndTitle(CategoryId, CategoryName);

    public string BinRankId { get; set; }
    public bool NegativeInventory { get; set; }


    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);


    public short LocCountryId { get; set; }
    public string LocCountryName { get; set; }
    public string LocCountry => IdAndTitle(LocCountryId, LocCountryName);


    public short LocStateId { get; set; }
    public string LocStateName { get; set; }
    public string LocState => IdAndTitle(LocStateId, LocStateName);


    public short LocCityId { get; set; }
    public string LocCityName { get; set; }
    public string LocCity => IdAndTitle(LocCityId, LocCityName);

    public string Address { get; set; }
    public string PostalCode { get; set; }


    public int WarehouseDetailId { get; set; }
    public bool WarehouseIsDetail => WarehouseDetailId != 0;

    public bool IsActive { get; set; }
}

public class BinGetRecord
{
    public short Id { get; set; }
    public string Name { get; set; }
    public int? WarehouseId { get; set; }
    public short ZoneId { get; set; }
    public byte CategoryId { get; set; }
    public string BinRankId { get; set; }
    public bool NegativeInventory { get; set; }
    public bool IsActive { get; set; }
}