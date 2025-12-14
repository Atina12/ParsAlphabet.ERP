namespace ParsAlphabet.ERP.Application.Dtos.FM.CostCenter;

public class CostCenterGetPage
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string CostDriverName { get; set; }
    public string CostCategoryName { get; set; }
    public bool IsActive { get; set; }
    public int DetailId { get; set; }
    public bool IsDetail => DetailId != 0;
}

public class CostCenterGetRecord
{
    public int Id { get; set; }
    public string Name { get; set; }
    public byte CostDriverTypeId { get; set; }
    public byte CostDriverId { get; set; }
    public byte CostCategoryId { get; set; }
    public bool IsActive { get; set; }
    public string JsonAccountDetailList { get; set; }
}

public class GetCostCenterDropdown
{
    public byte EntityTypeId { get; set; }
    public short EntityId { get; set; }
}