namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionCashStand;

public class AdmissionCashStandModel
{
    public int AdmissionId { get; set; }
    public short AdmissionStageId { get; set; }
    public int AdmissionWorkflowId { get; set; }
    public byte AdmissionActionId { get; set; }

    public short StageId { get; set; }
    public int WorkflowId { get; set; }
    public byte ActionId { get; set; }

    public int AdmissionPatientId { get; set; }
    public decimal NetAmount { get; set; }
    public int ExchangeRate { get; set; }
    public string TerminalNo { get; set; }
    public string AccountNo { get; set; }
    public string RefNo { get; set; }

    public DateTime CreateDateTime =>
        CreateDateTimePersian != null ? CreateDateTimePersian.ToMiladiDateTime().Value : DateTime.Now;

    public string CreateDateTimePersian { get; set; }
    public short PosId { get; set; }
    public short BranchId { get; set; }
}

public class AdmissionStandPatientInfo
{
    public int AdmissionId { get; set; }
    public int AdmissionWorkflowId { get; set; }
    public short AdmissionStageId { get; set; }
    public byte AdmissionActionId { get; set; }
    public byte MedicalRevenue { get; set; }
    public string PatientName { get; set; }
    public decimal PayAmount { get; set; }
}