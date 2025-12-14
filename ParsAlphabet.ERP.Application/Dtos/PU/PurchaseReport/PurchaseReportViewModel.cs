namespace ParsAlphabet.ERP.Application.Dtos.PU.PurchaseReport;

public class PurchaseReportDetailModel
{
    public int Id { get; set; }
}

public class GetPurchaseOrderSearchReport : PaginationReport
{
    public short? BranchId { get; set; }
    public string WorkflowId { get; set; }
    public string StageId { get; set; }
    public string ActionId { get; set; }
    public string CurrencyId { get; set; }
    public int? CreateUserId { get; set; }
    public byte? ItemTypeId { get; set; }
    public string ItemId { get; set; }
    public string AttributeIds { get; set; }
    public string UnitId { get; set; }
    public short? NoSeriesId { get; set; }
    public string PersonGroupId { get; set; }
    public string AccountDetailId { get; set; }
    public string FromCreateDate { get; set; }
    public string ToCreateDate { get; set; }
}

public class PurchaseReportPreviewModel
{
    public int Id { get; set; }
    public long RequestId { get; set; }

    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);

    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);

    public short WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);


    public string CreateDatePersian { get; set; }
    public string CreateTime { get; set; }
    public byte ItemTypeId { get; set; }
    public string ItemTypeName { get; set; }
    public string ItemType => IdAndTitle(ItemTypeId, ItemTypeName);
    public int ItemId { get; set; }
    public string ItemName { get; set; }
    public string Item => IdAndTitle(ItemId, ItemName);

    public decimal Quantity { get; set; }
    public decimal Ratio { get; set; }
    public decimal TotalQuantity { get; set; }
    public decimal Price { get; set; }

    public decimal ExchangeRate { get; set; }
    public decimal GrossAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal NetAmount { get; set; }
    public decimal VatAmount { get; set; }
    public decimal NetAmountPlusVat { get; set; }
    public string CreateDateTimePersian { get; set; }
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserFullName);

    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string Action => IdAndTitle(ActionId, ActionName);

    public int UnitId { get; set; }
    public string UnitName { get; set; }
    public string Unit => IdAndTitle(UnitId, UnitName);
    public string AttributeIds { get; set; }
    public string AttributeName { get; set; }


    public decimal TotalAvgGrossAmount { get; set; }
    public decimal TotalAvgDiscountAmount { get; set; }
    public decimal TotalAvgNetAmount { get; set; }
    public decimal TotalAvgVATAmount { get; set; }
    public decimal TotalAvgFinalAmount { get; set; }
}

public class SumPurchaseReportPreview
{
    public decimal TotalQuantity { get; set; }
    public decimal ExchangeRate { get; set; }
    public decimal GrossAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal NetAmount { get; set; }
    public decimal VATAmount { get; set; }
    public decimal NetAmountPlusVat { get; set; }

    public decimal TotalAvgGrossAmount { get; set; }
    public decimal TotalAvgDiscountAmount { get; set; }
    public decimal TotalAvgNetAmount { get; set; }
    public decimal TotalAvgVATAmount { get; set; }
    public decimal TotalAvgFinalAmount { get; set; }
}