namespace ParsAlphabet.ERP.Application.Dtos.FM.JournalAction;

public class JournalActionModel
{
    public int TreasuryActionId { get; set; }
    public short StageId { get; set; }
    public byte ActionId { get; set; }
    public bool IsDeleteLine { get; set; }
}