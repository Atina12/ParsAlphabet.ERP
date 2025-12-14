namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionCartable;

public class GetSectionCartable : CompanyViewModel
{
    public short? StageId { get; set; }
    public int? WorkflowId { get; set; }
    public short? BranchId { get; set; }
    public int? Id { get; set; }
    public int? AdmissionMasterId { get; set; }
    public int? AttenderId { get; set; }
    public int? ServiceId { get; set; }
    public int? PatientId { get; set; }
    public byte ActionId { get; set; }
    public string FromWorkDayDatePersian { get; set; }
    public DateTime? FromWorkDayDate => FromWorkDayDatePersian.ToMiladiDateTime();
    public string ToWorkDayDatePersian { get; set; }
    public DateTime? ToWorkDayDate => ToWorkDayDatePersian.ToMiladiDateTime();
    public byte? IsSettled { get; set; }
}

public class AdmissionCartableGetPage
{
    public int Id { get; set; }
    public int? CentralId { get; set; }
    public int AdmissionMasterId { get; set; }
    public short BranchId { get; set; }
    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);

    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);
    public byte AdmissionWorkflowCategoryId { get; set; }

    public DateTime ReserveDate { get; set; }
    public string ReserveDatePersian => ReserveDate.ToPersianDateString("{0}/{1}/{2}");
    public int ReserveShiftId { get; set; }
    public int AdmissionNo { get; set; }
    public string AdmissionReserveNo => $"{ReserveShiftId} - {AdmissionNo}";

    public int AttenderId { get; set; }
    public string AttenderFullName { get; set; }
    public string Attender => IdAndTitle(AttenderId, AttenderFullName);

    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string Patient => IdAndTitle(PatientId, PatientFullName);
    public string PatientNationalCode { get; set; }
    public string BasicInsurerNo { get; set; }
    public byte DepartmentId { get; set; }
    public string DepartmentName { get; set; }
    public string Department => IdAndTitle(DepartmentId, DepartmentName);
    public byte MedicalRevenue { get; set; }
    public int LineCount { get; set; }

    public decimal AdmissionAmount { get; set; }
    public decimal CashAmount { get; set; }

    public decimal PayableAmount { get; set; }
    public bool Conflict => PayableAmount != 0;
}

public class PatientReservedList
{
    public int AdmissionId { get; set; }
    public Guid AttenderScheduleBlockId { get; set; }
    public TimeSpan ReserveTime { get; set; }
    public DateTime ReserveDate { get; set; }
    public string ReserveDatePersian => ReserveDate.ToPersianDateString("{0}/{1}/{2}");

    public int ReserveShiftId { get; set; }
    public string ReserveShiftName { get; set; }
    public int ReserveNo { get; set; }
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();
    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string Patient => IdAndTitle(PatientId, PatientFullName);
    public string PatientNationalCode { get; set; }
}

public class PatientMovelist
{
    public Guid AttenderScheduleBlockId { get; set; }
    public int MedicalTimeShiftId { get; set; }
    public string ShiftName { get; set; }
    public string Shift => IdAndTitle(MedicalTimeShiftId, ShiftName);

    public DateTime AppointmentDate { get; set; }
    public string AppointmentDatePersian => AppointmentDate.ToPersianDateString("{0}/{1}/{2}");


    public byte DayInWeek { get; set; }
    public string DayName => GetDayName(DayOfWeekToShamsi(DayInWeek));
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public string Time => StartTime + " - " + EndTime;

    public int ReserveNo { get; set; }
    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string Patient => IdAndTitle(PatientId, PatientFullName);
    public string NationalCode { get; set; }
    public int AdmissionId { get; set; }
    public DateTime AdmissionDateTime { get; set; }
    public string AdmissionDatePersian => AdmissionDateTime.ToPersianDateString("{0}/{1}/{2}");


    public bool HasPatient { get; set; }
}

public class WorkListHeader
{
    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public int Count { get; set; }
}

public class WorkListLine
{
    public int Id { get; set; }
    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string PatientNationalCode { get; set; }
    public int LineCount { get; set; }
}

public class GetAdmissionWorkflowStageAction : CompanyViewModel
{
    public int TransactionId { get; set; }
    public object WorkflowId { get; set; }
    
    public object StageId { get; set; }
    
}

public class AdmissionWorkflowStageAction
{
    public int TransactionId { get; set; }
    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public short StageId { get; set; }
    public string StageName { get; set; }
    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
}

public class GetPriorityWorkflowStageAction : CompanyViewModel
{
    public Direction Direction { get; set; }
    public int AdmissionId { get; set; }
    public short BranchId { get; set; }
    public int WorkflowId { get; set; }
    public short StageId { get; set; }
    public byte ActionId { get; set; }
}

public class CheckValidationUpdateActionByPriority : MyResultStatus
{
    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public short BranchId { get; set; }
    public short StageId { get; set; }
    public string StageName { get; set; }
    public List<MyDropDownViewModel> ActionList { get; set; }
}