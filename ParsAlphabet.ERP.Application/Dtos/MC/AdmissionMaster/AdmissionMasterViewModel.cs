namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionMaster;

public class AdmissionMasterGetPage
{
    public int Id { get; set; }

    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string Patient => IdAndTitle(PatientId, PatientFullName);

    public string PatientNationalCode { get; set; }

    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);

    public short WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);

    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);
    public byte AdmissionMasterWorkflowCategoryId { get; set; }
    public short ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);

    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string User => IdAndTitle(CreateUserId, CreateUserFullName);

    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();

    public decimal MasterAmount { get; set; }
    public decimal CashAmount { get; set; }
}

public class AdmissionMasterGetAdmission
{
    public int Id { get; set; }
    public int? CentralId { get; set; }
    public int AdmissionMasterId { get; set; }
    public int AttenderId { get; set; }
    public string AttenderName { get; set; }

    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);

    public byte MedicalRevenue { get; set; }

    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);

    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);

    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);

    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();

    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string PatientNationalCode { get; set; }

    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserFullName);
    public decimal AdmissionAmount { get; set; }


    public short MasterStageId { get; set; }
    public string MasterStageName { get; set; }
    public string MasterStage => IdAndTitle(MasterStageId, MasterStageName);

    public byte MasterActionId { get; set; }
    public string MasterActionName { get; set; }
    public string MasterActionIdName => IdAndTitle(MasterActionId, MasterActionName);

    public int MasterWorkflowId { get; set; }
    public string MasterWorkflowName { get; set; }
    public string MasterWorkflow => IdAndTitle(MasterWorkflowId, MasterWorkflowName);

    public int MasterCreateUserId { get; set; }
    public string MasterCreateUserFullName { get; set; }
    public string MasterCreateUser => IdAndTitle(CreateUserId, CreateUserFullName);

    public DateTime MasterCreateDateTime { get; set; }
    public string MasterCreateDateTimePersian => MasterCreateDateTime.ToPersianDateString();

    public Guid AttenderScheduleBlockId { get; set; }
    public int ReserveShiftId { get; set; }
    public string ReserveShiftName { get; set; }

    public int? AdmissionNo { get; set; }
    public DateTime? ReserveDate { get; set; }
    public string ReserveDatePersian => ReserveDate.ToPersianDateStringNull("{0}/{1}/{2}");

    public string ReserveTime { get; set; }
}

public class AdmissionCashByAdmissionMaster
{
    public int Id { get; set; }
    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }

    public short StageId { get; set; }
    public string StageName { get; set; }


    public byte ActionId { get; set; }
    public string ActionName { get; set; }


    public short BranchId { get; set; }
    public string BranchName { get; set; }


    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserFullName);

    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();

    public decimal CashAmount { get; set; }
}

public class AdmissionMasterPayAmount
{
    public decimal AdmissionMasterAmount { get; set; }
    public decimal CashAmount { get; set; }
    public decimal Revenue3Amount { get; set; }
    public decimal Revenue2Amount { get; set; }
}