namespace ParsAlphabet.ERP.Application.Dtos.FM.JournalStageAction;

public class GetJournalStageStepByPriority : CompanyViewModel
{
    public short StageId { get; set; }
    public int WorkFlowId { get; set; }
    public byte ActionId { get; set; }
    public bool Starter { get; set; }
}

public class JournalStageActionGetRecord
{
    public long Id { get; set; }
    public long StageId { get; set; }
    public string StageName { get; set; }
    public byte ActionId { get; set; }
    public long TreasuryStageActionId { get; set; }
    public long? WorkflowId { get; set; }
    public bool IsRequest { get; set; }
    public bool IsTreasurySubject { get; set; }
    public bool IsDeleteHeader { get; set; }
    public bool IsDeleteLine { get; set; }
    public bool IsMaxStePreviewed { get; set; }
    public bool isLastConfirmHeader { get; set; }
    public bool IsPostedGroup { get; set; }

    public string IsDataEntry
    {
        get => IsDataEntry;
        set
        {
            if (value == "0")
                IsDataEntry = "ندارد";
            else if (value == "1")
                IsDataEntry = "دارد";
            else
                IsDataEntry = "انتخاب";
        }
    }

    public bool IsFiscalYear => true;
    public int Priority { get; set; }
    public bool IsBank { get; set; }
    public long Fk_stageid { get; set; }
    public long Fk_actionid { get; set; }
    public string PreviousStageActionId { get; set; }
}