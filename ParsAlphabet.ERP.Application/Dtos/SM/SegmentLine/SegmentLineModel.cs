namespace ParsAlphabet.ERP.Application.Dtos.SM.SegmentLine;

public class SegmentLineModel
{
    public short HeaderId { get; set; }
    public byte EntityTypeId { get; set; }
    public short EntityId { get; set; }
    public byte CostObjectId { get; set; }
    public byte AllocationPer { get; set; }
}