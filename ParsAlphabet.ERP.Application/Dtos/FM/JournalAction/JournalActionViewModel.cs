namespace ParsAlphabet.ERP.Application.Dtos.FM.JournalAction;

public class GetJournalAction : CompanyViewModel
{
    public short StageId { get; set; }
    public int WorkflowId { get; set; }
    public byte ActionId { get; set; }
    public byte Priority { get; set; }
}