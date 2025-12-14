namespace ParsAlphabet.ERP.Application.Dtos.WH.Warehouse;

public class WarehouseGetPage
{
    public int Id { get; set; }
    public string Name { get; set; }
    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);
    public string LocCountryName { get; set; }
    public string LocStateName { get; set; }
    public string LocCityName { get; set; }
    public string PostalCode { get; set; }
    public string Address { get; set; }
    public bool IsActive { get; set; }
    public int DetailId { get; set; }
    public bool IsDetail => DetailId != 0;
}

public class WarehouseGetRecord
{
    public int Id { get; set; }
    public short BranchId { get; set; }
    public string Name { get; set; }
    public short? LocCountryId { get; set; }
    public short? LocStateId { get; set; }
    public short? LocCityId { get; set; }
    public string PostalCode { get; set; }
    public string Address { get; set; }
    public string ItemTypes { get; set; }
    public bool IsActive { get; set; }
}