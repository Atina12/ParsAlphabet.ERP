namespace ParsAlphabet.ERP.Application.Dtos.SM.SegmentLine;

public class AssignSegmentLine
{
    public int Id { get; set; }
}

public class SegmentLineAssign : CompanyViewModel
{
    public int Id { get; set; }
    public int PersonGroupTypeId { get; set; }
    public List<AssignSegmentLine> Assign { get; set; }
}

public class SegmentLineGetPage
{
    public string Name { get; set; }
    public string NameEng { get; set; }
    public DateTime CreateDateTime { get; set; }
    public string Note { get; set; }
    public bool IsActive { get; set; }
    public string PersonsAssign { get; set; }
    public string PersonsdiAssign { get; set; }
    public List<Persons> Assigns { get; set; }
}

public class Persons
{
    public int PersonId { get; set; }
    public int PersonGroupType { get; set; }
    public string Name { get; set; }
}

public class SegmentLineGetRecord
{
    public short HeaderId { get; set; }
    public byte EntityTypeId { get; set; }
    public short EntityId { get; set; }
    public byte CostObjectId { get; set; }
    public byte AllocationPer { get; set; }
}