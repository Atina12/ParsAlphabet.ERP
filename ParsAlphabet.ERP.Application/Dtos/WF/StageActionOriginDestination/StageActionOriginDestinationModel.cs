namespace ParsAlphabet.ERP.Application.Dtos.WF.StageActionOriginDestination;

public class StageActionOriginDestinationModel
{
    public int OriginTransactionId { get; set; }
    public int OriginWorkflowId { get; set; }
    public int OriginStageId { get; set; }
    public int OriginWorkflowCategoryId { get; set; }
    public int DestinationTransactionId { get; set; }
    public int DestinationWorkflowId { get; set; }
    public int DestinationStageId { get; set; }
    public int DestinationWorkflowCategoryId { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime { get; set; } = DateTime.Now;
}