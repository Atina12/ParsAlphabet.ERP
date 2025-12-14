namespace ParsAlphabet.ERP.Application.Dtos.NewDtos.AdmissionServiceRepositoryDto;

public class AdmissionGetPageDto
{
    public int Id { get; set; }
    public int? CentralId { get; set; }
    public int? AdmissionMasterId { get; set; }
    public int? AdmissionMasterWorkflowCategoryId { get; set; }
    public int? AttenderId { get; set; }
    public string AttenderName { get; set; }
    public int BranchId { get; set; }
    public string BranchName { get; set; }
    public int? MedicalRevenue { get; set; }
    public short StageId { get; set; }
    public string StageName { get; set; }
    public byte? ActionId { get; set; }
    public string ActionName { get; set; }
    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public DateTime CreateDateTime { get; set; }
    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string PatientNationalCode { get; set; }
    public int? ReserveShiftId { get; set; }
    public string ReserveShiftName { get; set; }
    public int? AdmissionNo { get; set; }
    public DateOnly? ReserveDate { get; set; }
    public short ReserveNo { get; set; }
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public decimal AdmissionAmount { get; set; }
    public decimal CashAmount { get; set; }
}

public class AdmissionGetPageFilter
{
    public int? Id { get; set; }
    public int? AdmissionMasterId { get; set; }
    public int? PatientId { get; set; }
    public int? AttenderId { get; set; }
    public DateTime? FromCreateDate { get; set; }
    public DateTime? ToCreateDate { get; set; }
    public DateTime? FromReserveDate { get; set; }
    public DateTime? ToReserveDate { get; set; }
    public short? StageId { get; set; }
    public byte? ActionId { get; set; }
    public int? WorkflowId { get; set; }
    public int? CreateUserId { get; set; }
    public byte? RoleId { get; set; }
    public byte CompanyId { get; set; } = 1;
}

public class AdmissionGetPageRequest
{
    public int? PageNo { get; set; } = 0;
    public int? PageRowsCount { get; set; } = 50;
    public AdmissionGetPageFilter Filters { get; set; } = new AdmissionGetPageFilter();
}
