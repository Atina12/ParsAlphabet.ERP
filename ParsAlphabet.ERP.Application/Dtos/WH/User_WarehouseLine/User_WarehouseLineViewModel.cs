namespace ParsAlphabet.ERP.Application.Dtos.WH.User_WarehouseLine;

public class WarehouseUserLineGetPage
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string FullName => IdAndTitle(Id, Name);
    public byte RoleId { get; set; }
    public string RoleName { get; set; }
    public string Role => IdAndTitle(RoleId, RoleName);
    public short ZoneId { get; set; }
    public string ZoneName { get; set; }
    public string ZoneIdName => IdAndTitle(ZoneId, ZoneName);
    public int BinId { get; set; }
    public string BinName { get; set; }
    public string BinIdName => IdAndTitle(BinId, BinName);
}

public class WarehouseUserLineAssignList
{
    public List<WarehouseUserLineGetPage> Assigns { get; set; }
}

public class WarehouseUserLineAssign
{
    public int CompanyId { get; set; }
    public short WarehouseId { get; set; }
    public short ZoneId { get; set; }
    public short BinId { get; set; }
    public List<ID> Assign { get; set; }
}

public class WarehouseUserLineGetRecord
{
    public int WarehouseId { get; set; }
    public int UserId { get; set; }
    public bool IsActive => UserId != 0 && WarehouseId != 0;
}

public class Get_WarehouseUserLine
{
    public int WarehouseId { get; set; }
    public int UserId { get; set; }
}