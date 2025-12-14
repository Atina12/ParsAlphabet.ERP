namespace ParsAlphabet.ERP.Application.Dtos.FM.TreasuryStageAction;

public class TreasuryStageActionLogicModel
{
    public bool IsRequest { get; set; }
    public int IsDataEntry { get; set; }
    public bool IsBank { get; set; }
    public bool TreasuryIsPreviousStage { get; set; }
    public long RequestId { get; set; }
    public bool RequestIsLastConfirmHeader { get; set; }
    public int WorkflowId { get; set; }
}