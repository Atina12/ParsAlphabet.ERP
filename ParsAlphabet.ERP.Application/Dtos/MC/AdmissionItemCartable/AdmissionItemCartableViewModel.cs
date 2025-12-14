namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionItemCartable;

public class GetAdmissionItemSectionCartable
{
    public short? StageId { get; set; }
    public int? WorkflowId { get; set; }
    public short? BranchId { get; set; }
    public int? Id { get; set; }
    public int? AdmissionMasterId { get; set; }
    public int? VendorId { get; set; }
    public int? ItemId { get; set; }
    public int? PatientId { get; set; }
    public byte ActionId { get; set; }
    public short? ContractTypeId { get; set; }
    public string FromWorkDayDatePersian { get; set; }
    public DateTime? FromWorkDayDate => FromWorkDayDatePersian.ToMiladiDateTime();
    public string ToWorkDayDatePersian { get; set; }
    public DateTime? ToWorkDayDate => ToWorkDayDatePersian.ToMiladiDateTime();

    public byte? IsSettled { get; set; }
}

public class AdmissionItemCartableGetPage
{
    public int Id { get; set; }
    public int AdmissionMasterId { get; set; }

    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);

    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);

    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);
    public byte AdmissionWorkflowCategoryId { get; set; }

    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string Patient => IdAndTitle(PatientId, PatientFullName);
    public string PatientNationalCode { get; set; }

    public byte MedicalRevenue { get; set; }
    public int LineCount { get; set; }

    public decimal AdmissionAmount { get; set; }
    public decimal CashAmount { get; set; }

    public decimal PayableAmount { get; set; }
    public bool Conflict => PayableAmount != 0;
}