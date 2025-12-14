namespace ParsAlphabet.ERP.Application.Dtos.WH.WarehouseStageAction;

public class WarehouseStageActionLogicModel
{
    public bool IsRequest { get; set; }
    public int IsDataEntry { get; set; }
    public bool IsBank { get; set; }
    public bool IsPreviousStage { get; set; }
    public long RequestId { get; set; }
    public bool RequestIsLastConfirmHeader { get; set; }
}