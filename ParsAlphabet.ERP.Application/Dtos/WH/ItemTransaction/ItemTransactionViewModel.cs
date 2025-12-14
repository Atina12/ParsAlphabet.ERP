namespace ParsAlphabet.ERP.Application.Dtos.WH.ItemTransaction;

public class ItemTransactionGetPage
{
    public int Id { get; set; }
    public int RequestId { get; set; }
    public int JournalId { get; set; }
    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);
    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);

    public int No { get; set; }
    public DateTime TransactionDate { get; set; }
    public string TransactionDatePersian => TransactionDate.ToPersianDateString("{0}/{1}/{2}");

    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);

    public int? WarehouseId { get; set; }
    public string WarehouseName { get; set; }
    public string Warehouse => IdAndTitle(WarehouseId, WarehouseName);

    public byte DocumentTypeId { get; set; }
    public string DocumentTypeName { get; set; }
    public string DocumentType => IdAndTitle(DocumentTypeId, DocumentTypeName);

    public int AccountGLId { get; set; }
    public string AccountGLName { get; set; }
    public string AccountGL => IdAndTitle(AccountGLId, AccountGLName);

    public int AccountSGLId { get; set; }
    public string AccountSGLName { get; set; }
    public string AccountSGL => IdAndTitle(AccountSGLId, AccountSGLName);

    public short NoSeriesId { get; set; }
    public string NoSeriesName { get; set; }
    public string NoSeries => NoSeriesId != 0 ? IdAndTitle(NoSeriesId, NoSeriesName) : "";

    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }
    public string AccountDetail => IdAndTitle(AccountDetailId, AccountDetailName);

    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2} {3}:{4}");

    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserFullName);


    public decimal SumQuantity { get; set; }
    public decimal SumAmount { get; set; }

    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);

    public byte StageClassId { get; set; }
    public byte IsDataEntry { get; set; }
    public bool BySystem { get; set; }
    public bool IsQuantityWarehouse { get; set; }
    public int ParentWorkflowCategoryId { get; set; }
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
                    $"{TransactionDatePersian} - {AccountDetailId} - {AccountDetailName}, {WorkflowCategoryId} - {WorkflowCategoryName}";
            return $"{TransactionDatePersian}, {WorkflowCategoryId} - {WorkflowCategoryName}";
        }
    }

    public DateTime DocumentDate { get; set; }
    public string TransactionDatePersian => DocumentDate.ToPersianDateString("{0}/{1}/{2}");
    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }
    public int WorkflowCategoryId { get; set; }
    public string WorkflowCategoryName { get; set; }
}