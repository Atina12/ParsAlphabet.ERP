namespace ParsAlphabet.ERP.Application.Dtos.FM.JournalStageAction;

public class JournalStageActionModel : CompanyViewModel
{
    public int Id { get; set; }
    public long JournalStageActionId { get; set; }
    public long StageId { get; set; }
    public byte ActionId { get; set; }
    public long? WorkflowId => 0;
    public bool IsRequest { get; set; }
    public bool IsTreasurySubject { get; set; }
    public bool IsDeleteHeader { get; set; }
    public bool IsDeleteLine { get; set; }
    public bool IsMaxStePreviewed { get; set; }
    public bool IsLastConfirmHeader { get; set; }
    public bool IsPostedGroup { get; set; }
    public byte IsDataEntry { get; set; }
    public bool IsFiscalYear => true;
    public byte Priority { get; set; }
    public bool IsBank { get; set; }
}

public class LogicJson
{
    public bool IsRequest { get; set; }
    public bool IsTreasurySubject { get; set; }
    public bool IsDeleteHeader { get; set; }
    public bool IsDeleteLine { get; set; }
    public bool IsMaxStePreviewed { get; set; }
    public bool IsLastConfirmHeader { get; set; }
    public bool IsPostedGroup { get; set; }
    public int IsDataEntry { get; set; }
    public bool IsFiscalYear { get; set; }
    public int Priority { get; set; }
    public bool IsBank { get; set; }
    public int Companyid { get; set; }
}