namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionMasterCartable;

public class AdmissionMasterCartableGetPage
{
    public int Id { get; set; }

    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);

    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);

    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);


    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string Patient => IdAndTitle(PatientId, PatientFullName);
    public string PatientNationalCode { get; set; }
    public decimal AdmissionMasterAmount { get; set; }
    public decimal CashAmount { get; set; }

    public decimal PayableAmount { get; set; }
    public bool Conflict => PayableAmount != 0;
}

public class AdmissionMasterSectionCartable
{
    public int? Id { get; set; }
    public short? StageId { get; set; }
    public int? WorkflowId { get; set; }
    public int? PatientId { get; set; }
    public short? BranchId { get; set; }
    public byte ActionId { get; set; }
    public string FromWorkDayDatePersian { get; set; }
    public DateTime? FromWorkDayDate => FromWorkDayDatePersian.ToMiladiDateTime();
    public string ToWorkDayDatePersian { get; set; }
    public DateTime? ToWorkDayDate => ToWorkDayDatePersian.ToMiladiDateTime();

    public byte? IsSettled { get; set; }
}