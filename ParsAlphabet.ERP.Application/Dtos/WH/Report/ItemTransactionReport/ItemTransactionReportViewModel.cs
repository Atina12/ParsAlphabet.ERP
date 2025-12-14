namespace ParsAlphabet.ERP.Application.Dtos.WH.Report.ItemTransactionReport;

public class ItemTransactioneReportPreviewModel
{
    public int Id { get; set; }
    public int RequestId { get; set; }
    public int ItemTransactionLineId { get; set; }

    public DateTime? DocumentDate { get; set; }

    public string DocumentDatePersian => DocumentDate.ToPersianDateStringNull("{0}/{1}/{2}");
    public int? WarehouseId { get; set; }
    public string WarehouseName { get; set; }
    public string Warehouse => IdAndTitle(WarehouseId, WarehouseName);

    public short ZoneId { get; set; }
    public string ZoneName { get; set; }
    public string Zone => IdAndTitle(ZoneId, ZoneName);


    public int BinId { get; set; }
    public string BinName { get; set; }
    public string Bin => IdAndTitle(BinId, BinName);


    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);


    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);

    public int ItemId { get; set; }
    public string ItemName { get; set; }
    public string Item => IdAndTitle(ItemId, ItemName);
    public string AttributeIds { get; set; }
    public string AttributeNames { get; set; }
    public string Attribute => IdAndTitle(AttributeIds, AttributeNames);
    public List<AttributeIdModel> AttributeIdList { get; set; }
    public int UnitId { get; set; }
    public string UnitName { get; set; }
    public string Unit => IdAndTitle(UnitId, UnitName);

    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }
    public string AccountDetail => IdAndTitle(AccountDetailId, AccountDetailName);

    public long DebitQuantity { get; set; }
    public decimal DebitAmount { get; set; }
    public long CreditQuantity { get; set; }
    public decimal CreditAmount { get; set; }

    public bool BySystem { get; set; }
    public DateTime? CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateStringNull("{0}/{1}/{2}");

    public int ItemTransactionLineCreateUserId { get; set; }
    public string ItemTransactionLineCreateUserFullName { get; set; }

    public string ItemTransactionLineCreateUser =>
        IdAndTitle(ItemTransactionLineCreateUserId, ItemTransactionLineCreateUserFullName);


    public int ItemTransactionCreateUserId { get; set; }
    public string ItemTransactionCreateUserFullName { get; set; }

    public string ItemTransactionCreateUser =>
        IdAndTitle(ItemTransactionCreateUserId, ItemTransactionCreateUserFullName);


    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string Actions => IdAndTitle(ActionId, ActionName);
}

public class AttributeIdModel
{
    public string AttributeIds { get; set; }
}

public class GetItemTransactionReport : PaginationReport
{
    public string FromDocumentDatePersian { get; set; }
    public DateTime FromDocumentDate => FromDocumentDatePersian.ToMiladiDateTime().Value;
    public string ToDocumentDatePersian { get; set; }
    public DateTime ToDocumentDate => ToDocumentDatePersian.ToMiladiDateTime().Value;
    public string BranchId { get; set; }
    public string WarehouseId { get; set; }
    public string ZoneId { get; set; }
    public string BinId { get; set; }
    public string ItemCategoryId { get; set; }
    public string WorkflowId { get; set; }
    public string StageId { get; set; }
    public string ActionId { get; set; }
    public string ItemTypeId { get; set; }
    public string ItemIds { get; set; }
    public List<AttributeIdModel> AttributeIdList { get; set; }
    public int? HeaderCreateUserId { get; set; }
    public string UnitIds { get; set; }
}

public class ItemtransactionReportSum
{
    public long DebitQuantity { get; set; }
    public decimal DebitAmount { get; set; }
    public long CreditQuantity { get; set; }
    public decimal CreditAmount { get; set; }
}