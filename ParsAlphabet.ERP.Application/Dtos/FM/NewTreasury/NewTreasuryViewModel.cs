using ParsAlphabet.ERP.Application.Dtos.WF.StageAction;

namespace ParsAlphabet.ERP.Application.Dtos.FM.NewTreasury;

public class NewTreasuryGetPage
{
    public int Id { get; set; }
    public int No { get; set; }
    public int JournalId { get; set; }
    public byte StageClassId { get; set; }

    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);

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

    public byte DocumentTypeId { get; set; }
    public string DocumentTypeName { get; set; }
    public string DocumentType => IdAndTitle(DocumentTypeId, DocumentTypeName);

    public int ParentworkflowcategoryId { get; set; }

    public DateTime TransactionDate { get; set; }
    public string TransactionDatePersian => TransactionDate.ToPersianDateString("{0}/{1}/{2}");
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2} {3}:{4}");
    public int CreateUserId { get; set; }
    public string CreateUserName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserName);


    public int RequestId { get; set; }

    public byte ActionId { get; set; }
    public string ActionName { get; set; }

    public string ActionIdName => IdAndTitle(ActionId, ActionName);
    public byte IsDataEntry { get; set; }

    public bool BySystem { get; set; }


    public DateTime? ParentDocumentDate { get; set; }
    public string ParentDocumentDatePersian => ParentDocumentDate.ToPersianDateStringNull("{0}/{1}/{2}");
}

public class NewTreasuryGetRecord
{
    public int Id { get; set; }

    public int No { get; set; }

    public int JournalId { get; set; }
    public int WorkflowId { get; set; }

    public string WorkflowName { get; set; }

    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);


    public short StageId { get; set; }

    public string StageName { get; set; }

    public string Stage => IdAndTitle(StageId, StageName);


    public int TreasurySubjectId { get; set; }
    public string TreasurySubjectName { get; set; }


    public int AccountGLId { get; set; }
    public string AccountGLName { get; set; }


    public int AccountSGLId { get; set; }
    public string AccountSGLName { get; set; }

    public byte AccountDetailRequired { get; set; }

    public short NoSeriesId { get; set; }
    public string NoSeriesName { get; set; }
    public string NoSeries => IdAndTitle(NoSeriesId, NoSeriesName);

    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }


    public byte DocumentTypeId { get; set; }
    public string DocumentTypeName { get; set; }


    public short BranchId { get; set; }

    public string BranchName { get; set; }


    public DateTime? TransactionDate { get; set; }
    public string TransactionDatePersian => TransactionDate.ToPersianDateStringNull("{0}/{1}/{2}");


    public DateTime? CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateStringNull("{0}/{1}/{2}");
    public int CreateUserId { get; set; }
    public string CreateUserName { get; set; }

    public int RequestId { get; set; }
    public string Note { get; set; }
    public byte ActionId { get; set; }
    public string ActionName { get; set; }


    public byte Status { get; set; }
    public byte? CurrencyId { get; set; }

    public byte StageClassId { get; set; }
    public int IsDataEntry { get; set; }
    public string PreviousStageActionId { get; set; }

    public byte InOut { get; set; }
    public int BySystem { get; set; }
    public byte Priority { get; set; }
    public bool IsRequest { get; set; }

    public bool IsTreasurySubject { get; set; }

    public DateTime? ParentCreateDateTime { get; set; }
    public string ParentDocumentDatePersian => ParentCreateDateTime.ToPersianDateStringNull("{0}/{1}/{2}");


    public int ParentworkflowcategoryId { get; set; }
    public string ParentWorkflowCategoryName { get; set; }
}

public class NewTreasuryStepLogList
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

public class NewTreasuryResult : MyResultQuery
{
    public int Output { get; set; }
}

public class NewTreasuryResultStatus : MyResultStatus
{
    public int Output { get; set; }
}

public class GetCurrentTreasuryAction
{
    public int TreasuryId { get; set; }
    public new byte GetType { get; set; }
}

public class CurrentTreasuryStageAction : StageActionGetRecord
{
    public int TreasuryId { get; set; }
    public int RequestId { get; set; }
    public short BranchId { get; set; }
}

public class ParentIdMyDropdownViewModel
{
    public int Id { get; set; }

    public string Name
    {
        get
        {
            if (AccountDetailId != 0)
                return
                    $"{TreasuryDatePersian} , {AccountDetailId} - {AccountDetailName} , {WorkflowCategoryId} - {WorkflowCategoryName}";
            return $"{TreasuryDatePersian} , {WorkflowCategoryId} - {WorkflowCategoryName}";
        }
    }

    public DateTime DocumentDate { get; set; }
    public string TreasuryDatePersian => DocumentDate.ToPersianDateString("{0}/{1}/{2}");
    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }
    public int WorkflowCategoryId { get; set; }
    public string WorkflowCategoryName { get; set; }
    public decimal BalanceHeaderAmount { get; set; }
}

public class TreasuryCartableGetPage
{
    public int Id { get; set; }
    public int RequestId { get; set; }
    public int JournalId { get; set; }
    public int No { get; set; }

    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);

    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);
    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => $"{BranchId} - {BranchName}";
    public DateTime TransactionDate { get; set; }
    public string TransactionDatePersian => TransactionDate.ToPersianDateString("{0}/{1}/{2}");
    public short TreasurySubjectId { get; set; }
    public string TreasurySubjectName { get; set; }
    public string TreasurySubject => IdAndTitle(TreasurySubjectId, TreasurySubjectName);

    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2} {3}:{4}");
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserFullName);

    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);
    public short NoSeriesId { get; set; }
    public string NoSeriesName { get; set; }
    public string NoSeries => IdAndTitle(NoSeriesId, NoSeriesName);
    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }
    public string AccountDetail => IdAndTitle(AccountDetailId, AccountDetailName);

    public byte DocumentTypeId { get; set; }
    public string DocumentTypeName { get; set; }
    public string DocumentType => IdAndTitle(DocumentTypeId, DocumentTypeName);
    public bool BySystem { get; set; }
    public byte IsDataEntry { get; set; }
    public byte StageClassId { get; set; }
    public byte CurrentInOut { get; set; }
    public int DocumentNo { get; set; }
    public DateTime DocumentDate { get; set; }
    public string DocumentDatePersian { get; set; }
    public long SumAmountDebit { get; set; }
    public long SumAmountCredit { get; set; }

    public int ParentworkflowcategoryId { get; set; }
}

public class HeaderTreasuryPostingGroup : CompanyViewModel
{
    public int Id { get; set; }
    public short BranchId { get; set; }
    public int WorkflowId { get; set; }
    public short StageId { get; set; }
    public int TreasurySubjectId { get; set; }
    public byte DocumentTypeId { get; set; }
    public int AccountGLId { get; set; }
    public int AccountSGLId { get; set; }
    public int AccountDetailId { get; set; }
    public string DocumentTypeName { get; set; }
    public DateTime TransactionDate { get; set; }
    public string TransactionDatePersian => TransactionDate.ToPersianDateString("{0}/{1}/{2}");
    public short IsFiscal { get; set; }
    public bool IsPosted { get; set; }
    public byte CurrentStepId { get; set; }
}

public class TreasuryPostedGroup
{
    public int TreasuryId { get; set; }
    public short StageId { get; set; }
    public int WorkflowId { get; set; }
}

public class PurchaseOrderPostedGroup
{
    public int PurchaseOrderId { get; set; }
    public short StageId { get; set; }
}

public class WarehousePostedGroup
{
    public int ItemTransactionId { get; set; }
    public short StageId { get; set; }
    public int WorkflowId { get; set; }
    public DateTime DocumentDate { get; set; }
}

public class TreasuryExistViewModel : CompanyViewModel
{
    public int Id { get; set; }
    public byte BySystem { get; set; }
}