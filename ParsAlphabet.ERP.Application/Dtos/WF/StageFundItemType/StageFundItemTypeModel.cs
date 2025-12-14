namespace ParsAlphabet.ERP.Application.Dtos.WF.StageFundItemType;

public class StageFundItemTypeModel : CompanyViewModel
{
    public int Id { get; set; }
    public short StageId { get; set; }
    public byte FundTypeId { get; set; }
    public byte PostingGroupTypeId { get; set; }
    public byte FundItemType { get; set; }
    public byte InOut { get; set; }
    public short PreviousStageId => 0;
    public long workflowId { get; set; }
}