namespace ParsAlphabet.ERP.Application.Dtos.FM.CostCenterLine;

public class AssignCostCenterLine
{
    public short Id { get; set; }
}

public class CostCenterLineAssign : CompanyViewModel
{
    public int HeaderId { get; set; }
    public short CostRelationId { get; set; }
    public short StageId { get; set; }
    public short AllocationPercentage { get; set; }
    public List<AssignCostCenterLine> Assign { get; set; }
}

public class CostCenterDAssignList
{
    public List<CostCenterLineDAssignGetPage> Assigns { get; set; }
}

public class CostCenterLineDAssignGetPage
{
    public int Id { get; set; }
    public string Name { get; set; }
}

public class CostCenterAssignList
{
    public List<CostCenterLineAssignGetPage> Assigns { get; set; }
}

public class CostCenterLineAssignGetPage
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int CostCenterLineId { get; set; }
    public int HeaderId { get; set; }
    public byte AllocationPercentage { get; set; }
    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);
    public int CostRelationId { get; set; }
    public int CostObjectId { get; set; }
    public bool IsAllocated { get; set; }
    public string Allocated => IsAllocated ? "تسهیم شده" : "تسهیم نشده";
    public string CostObjectName { get; set; }
    public string CostObject => IdAndTitle(CostObjectId, $"{CostObjectName} - {Allocated}");
}

public class CostCenterLineGetRecord
{
    public short HeaderId { get; set; }
    public byte EntityTypeId { get; set; }
    public int EntityId { get; set; }
    public byte CostObjectId { get; set; }
    public byte AllocationPer { get; set; }
}

public class Entitys
{
    public int EntityId { get; set; }
    public byte EntityTypeId { get; set; }
    public string Name { get; set; }
    public byte CostObjectId { get; set; }
    public byte AllocationPer { get; set; }
}

public class CostCenterLine
{
    public short HeaderId { get; set; }
    public int EntityId { get; set; }
    public byte EntityTypeId { get; set; }
    public byte CostObjectId { get; set; }
    public byte AllocationPer { get; set; }
}

public class Get_CostCenterLine : CompanyViewModel
{
    public short HeaderId { get; set; }
    public int EntityId { get; set; }
    public byte EntityTypeId { get; set; }
}