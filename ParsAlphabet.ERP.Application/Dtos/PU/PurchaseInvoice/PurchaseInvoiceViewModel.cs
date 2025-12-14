namespace ParsAlphabet.ERP.Application.Dtos.PU.PurchaseInvoice;

public class PurchaseInvoiceGetPage
{
    public int Id { get; set; }
    public int RequestId { get; set; }
    public int JournalId { get; set; }
    public int OrderNo { get; set; }
    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);
    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);
    public byte StageClassId { get; set; }
    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);
    public int CreateUserId { get; set; }
    public string UserFullName { get; set; }
    public string UserName => IdAndTitle(CreateUserId, UserFullName);
    public long ReturnReasonId { get; set; }
    public string ReturnReasonName { get; set; }
    public string ReturnReason => IdAndTitle(ReturnReasonId, ReturnReasonName);
    public DateTime OrderDate { get; set; }
    public string OrderDatePersian => OrderDate.ToPersianDateString("{0}/{1}/{2}");
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();
    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);
    public byte IsDataEntry { get; set; }
    public short NoSeriesId { get; set; }
    public string NoSeriesName { get; set; }
    public string NoSeries => IdAndTitle(NoSeriesId, NoSeriesName);

    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }
    public string AccountDetail => IdAndTitle(AccountDetailId, AccountDetailName);

    public int ParentWorkflowCategoryId { get; set; }
    public string ParentWorkflowCategoryName { get; set; }
    public string ParentWorkflowCategory => IdAndTitle(ParentWorkflowCategoryId, ParentWorkflowCategoryName);
}

public class PurchaseInvoiceRequestGLSGL
{
    public int AccountGLId { get; set; }
    public string AccountGLName { get; set; }
    public int AccountSGLId { get; set; }
    public string AccountSGLName { get; set; }
    public string RequestName { get; set; }
    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }
    public byte DocumentTypeId { get; set; }
    public string DocumentTypeName { get; set; }
    public DateTime PersonOrderDate { get; set; }
    public string PersonOrderDatePersian => PersonOrderDate.ToPersianDateString("{0}/{1}/{2}");
    public string Note { get; set; }
}

public class PurchaseInvoiceGetRecord
{
    public int Id { get; set; }

    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);
    public string StageName { get; set; }
    public short StageId { get; set; }


    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public DateTime OrderDate { get; set; }
    public string OrderDatePersian => OrderDate.ToPersianDateString("{0}/{1}/{2}");

    public short ReturnReasonId { get; set; }
    public string ReturnReasonName { get; set; }
    public string Note { get; set; }
    public int AccountGLId { get; set; }
    public string AccountGLName { get; set; }
    public int AccountSGLId { get; set; }
    public string AccountSGLName { get; set; }
    public short NoSeriesId { get; set; }
    public string NoSeriesName { get; set; }

    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }
    public byte InOut { get; set; }
    public string InOutName => InOut == 1 ? "1-بدهکار" : "2-بستانکار";
    public byte ActionId { get; set; }
    public byte Priority { get; set; }
    public byte IsDataEntry { get; set; }
    public bool IsRequest { get; set; }
    public int TreasurySubjectId { get; set; }
    public string TreasurySubjectName { get; set; }

    public byte DocumentTypeId { get; set; }
    public string DocumentTypeName { get; set; }
    public int IsLine { get; set; }
    public int CategoryItemId { get; set; }
    public string CategoryName { get; set; }
    public string CategoryItemName => IdAndTitle(CategoryItemId, CategoryName);

    public long? RequestId { get; set; }
    public string RequestName => $"{OrderDatePersian} - {AccountDetailId} - {AccountDetailName}";

    public int ParentWorkflowCategoryId { get; set; }
    public string ParentWorkflowCategoryName { get; set; }

    public string ParentWorkflowCategory => IdAndTitle(ParentWorkflowCategoryId, ParentWorkflowCategoryName);
}

public class PurchaseInvoiceParentIdMyDropdownViewModel
{
    public int Id { get; set; }

    public string Name
    {
        get
        {
            if (AccountDetailId != 0)
                return
                    $"{PersonOrderDatePersian} , {AccountDetailId} - {AccountDetailName} , {WorkflowCategoryId} - {WorkflowCategoryName}";
            return $"{PersonOrderDatePersian} , {WorkflowCategoryId} - {WorkflowCategoryName}";
        }
    }

    public DateTime DocumentDate { get; set; }
    public string PersonOrderDatePersian => DocumentDate.ToPersianDateString("{0}/{1}/{2}");
    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }
    public int WorkflowCategoryId { get; set; }
    public string WorkflowCategoryName { get; set; }
    public decimal BalanceHeaderAmount { get; set; }
}

public class HeaderPurchasePostingGroup : CompanyViewModel
{
    public int Id { get; set; }
    public short BranchId { get; set; }
    public int WorkflowId { get; set; }
    public byte WorkflowCategoryId { get; set; }
    public short StageId { get; set; }
    public int TreasurySubjectId { get; set; }
    public byte DocumentTypeId { get; set; }
    public int AccountGLId { get; set; }
    public int AccountSGLId { get; set; }
    public int AccountDetailId { get; set; }
    public string DocumentTypeName { get; set; }
    public DateTime DocumentDate { get; set; }
    public string DocumentDatePersian => DocumentDate.ToPersianDateString("{0}/{1}/{2}");
    public short IsFiscal { get; set; }
    public bool IsPosted { get; set; }
    public byte CurrentStepId { get; set; }
}