using ParsAlphabet.ERP.Application.Dtos.WF.StageAction;

namespace ParsAlphabet.ERP.Application.Dtos.FM.TreasuryRequest;

public class TreasuryRequestGetPage
{
    public int Id { get; set; }
    public int No { get; set; }
    public int JournalId { get; set; }
    public byte StageClassId { get; set; }
    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);
    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);
    public int TreasurySubjectId { get; set; }
    public string TreasurySubjectName { get; set; }
    public string TreasurySubject => IdAndTitle(TreasurySubjectId, TreasurySubjectName);
    public short NoSeriesId { get; set; }
    public string NoSeriesName { get; set; }
    public string NoSeries => IdAndTitle(NoSeriesId, NoSeriesName);
    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }
    public string AccountDetail => IdAndTitle(AccountDetailId, AccountDetailName);
    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);
    public DateTime TransactionDate { get; set; }
    public string TransactionDatePersian => TransactionDate.ToPersianDateString("{0}/{1}/{2}");
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2} {3}:{4}");
    public int CreateUserId { get; set; }
    public string CreateUserName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserName);
    public string Status { get; set; }
    public string StatusName { get; set; }
    public int TreasuryFlowTypeId { get; set; }
    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);
    public byte IsDataEntry { get; set; }
    public byte CurrentInOut { get; set; }
    public bool BySystem { get; set; }
}

public class TreasuryRequestResult : MyResultQuery
{
    public int Output { get; set; }
}

public class TreasuryRequestResultStatus : MyResultStatus
{
    public int Output { get; set; }
}

public class TreasuryRequestLineDifference
{
    public byte CurrentInOut { get; set; }
    public decimal Amount { get; set; }
}

public class CurrentTreasuryRequestStageAction : StageActionGetRecord
{
    public int TreasuryId { get; set; }
    public int ParentId { get; set; }
    public short BranchId { get; set; }
}

public class TreasuryRequestGetRecord
{
    public int Id { get; set; }
    public short BranchId { get; set; }
    public DateTime? TransactionDate { get; set; }
    public string TransactionDatePersian => TransactionDate.ToPersianDateStringNull("{0}/{1}/{2}");
    public short StageId { get; set; }
    public byte? CurrencyId { get; set; }
    public DateTime? CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateStringNull("{0}/{1}/{2}");
    public int CreateUserId { get; set; }
    public int TreasurySubjectId { get; set; }
    public string TreasurySubjectName { get; set; }
    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }
    public int AccountGLId { get; set; }
    public string AccountGLName { get; set; }
    public string AccountGL => IdAndTitle(AccountGLId, AccountGLName);
    public int AccountSGLId { get; set; }
    public string AccountSGLName { get; set; }
    public string AccountSGL => IdAndTitle(AccountSGLId, AccountSGLName);
    public short NoSeriesId { get; set; }
    public string NoSeriesName { get; set; }
    public byte Status { get; set; }
    public string Note { get; set; }
    public byte Priority { get; set; }
    public bool IsRequest { get; set; }
    public int IsDataEntry { get; set; }
    public bool IsTreasurySubject { get; set; }
    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ParentTreasuryDatePersian { get; set; }
    public byte AccountDetailRequired { get; set; }

    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);
}

public class TreasuryRequestStepLogList
{
    public int TreasuryId { get; set; }
    public DateTime CreateDateTime { get; set; }
    public string StepDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2} {3}:{4}");
    public int ActionUserId { get; set; }
    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string UserFullName { get; set; }
    public string Action => IdAndTitle(ActionId, ActionName);
    public string User => IdAndTitle(ActionUserId, UserFullName);
}

public class TreasuryRequestInfo
{
    public int Id { get; set; }
    public short StageId { get; set; }
    public byte ActionId { get; set; }
    public DateTime DocumentDate { get; set; }
    public int WorkflowId { get; set; }
    public byte Inout { get; set; }
    public byte ParentWorkflowCategoryId { get; set; }
}