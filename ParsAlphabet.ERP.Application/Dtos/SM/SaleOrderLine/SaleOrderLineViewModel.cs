namespace ParsAlphabet.ERP.Application.Dtos.SM.SaleOrderLine;

public class SaleOrderLineGetpage

{
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public int OrderNo { get; set; }
    public short RowNumber { get; set; }
    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => $"{StageId} - {StageName}";

    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => $"{ActionId} - {ActionName}";

    public int RequestId { get; set; }
    public int RequestNo => RequestId;
    public int InvoiceId { get; set; }
    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => $"{BranchId} - {BranchName}";

    public byte CurrencyId { get; set; }
    public int PersonId { get; set; }
    public string PersonName { get; set; }
    public string Person => PersonId != 0 ? $"{PersonId} - {PersonName}" : "";
    public int EmployeeId { get; set; }
    public DateTime? OrderDate { get; set; }
    public string OrderDatePersian => OrderDate.ToPersianDateStringNull("{0}/{1}/{2}");
    public byte ReturnReasonId { get; set; }
    public string ReturnReasonName { get; set; }
    public string ReturnReason => ReturnReasonId != 0 ? $"{ReturnReasonId} - {ReturnReasonName}" : "";
    public string Note { get; set; }
    public int UserId { get; set; }
    public int VatPer { get; set; }

    public string UserFullName { get; set; }
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian { get; set; }
    public decimal GrossAmount { get; set; }
    public byte Status { get; set; }
    public bool OfficialInvoice { get; set; }
    public string JsonOrderLine { get; set; }
    public int IsDataEntry { get; set; }
    public bool IsRequest { get; set; }
    public bool IsPreviousStage { get; set; }
    public long DocumentTypeId { get; set; }
    public string DocumentTypeName { get; set; }
    public string DocumentType => IdAndTitle(DocumentTypeId, DocumentTypeName);
    public int AccountGLId { get; set; }
    public string AccountGLName { get; set; }
    public string AccountGL => AccountGLId == 0 ? "" : $"{AccountGLId} - {AccountGLName}";
    public int AccountSGLId { get; set; }
    public string AccountSGLName { get; set; }
    public string AccountSGL => AccountSGLId == 0 ? "" : $"{AccountSGLId} - {AccountSGLName}";
    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }
    public string AccountDetail => AccountDetailId == 0 ? "" : $"{AccountDetailId} - {AccountDetailName}";
    public bool AccountDetailVatInclude { get; set; }
    public bool AccountDetailVatEnable { get; set; }
    public short NoSeriesId { get; set; }
    public string NoSeriesName { get; set; }
    public string NoSeries => NoSeriesId == 0 ? "" : $"{NoSeriesId} - {NoSeriesName}";
    public byte InOut { get; set; }
    public string inOutName => InOut == 0 ? "" : InOut == 1 ? "1- بدهکار" : "2- بستانکار";

    public MyResultStageStepConfigPage<List<SaleOrderLines>> JsonOrderLineList { get; set; }
}

public class SaleOrderLines
{
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public short RowNumber { get; set; }
    public short StageId { get; set; }
    public int PersonId { get; set; }
    public byte ItemTypeId { get; set; }
    public string ItemTypeName { get; set; }
    public string ItemType => $"{ItemTypeId} - {ItemTypeName}";
    public int CategoryId { get; set; }
    public string CategoryName { get; set; }
    public string CategoryItemName => CategoryId > 0 ? $" {CategoryId}-{CategoryName}" : " ";
    public int ItemId { get; set; }
    public string ItemName { get; set; }
    public string Item => $"{ItemId} - {ItemName}";
    public DateTime? OrderDate { get; set; }
    public string OrderDatePersian { get; set; }
    public string Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal DisplayPrice => InOut == 1 ? Price : Price * -1;
    public decimal MinPrice { get; set; }
    public decimal MaxPrice { get; set; }
    public byte VATPer { get; set; }
    public bool PriceIncludingVAT { get; set; }
    public bool IsQuantity { get; set; }
    public bool AllowInvoiceDisc { get; set; }
    public decimal ExchangeRate { get; set; }
    public decimal GrossAmount { get; set; }
    public decimal DisplayGrossAmount => InOut == 1 ? GrossAmount : GrossAmount * -1;
    public short DiscountType { get; set; }
    public string DiscountTypeIdName => DiscountType == 0 ? "" : DiscountType == 1 ? "1 - درصد" : "2 - مبلغ";
    public decimal DiscountValue { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal DisplayDiscountAmount => InOut == 1 ? DiscountAmount : DiscountAmount * -1;
    public decimal NetAmount { get; set; }
    public decimal DisplayNetAmount => InOut == 1 ? NetAmount : NetAmount * -1;
    public decimal VatAmount { get; set; }
    public decimal DisplayVatAmount => InOut == 1 ? VatAmount : VatAmount * -1;
    public decimal NetAmountPlusVat { get; set; }
    public decimal DisplayNetAmountPlusVat => InOut == 1 ? NetAmountPlusVat : NetAmountPlusVat * -1;
    public short Status { get; set; }
    public string CurrencyName { get; set; }
    public byte CurrencyId { get; set; }
    public string Currency => $"{CurrencyId} - {CurrencyName}";
    public string StatusMessage { get; set; }
    public byte InOut { get; set; }
    public string InOutName => InOut == 0 ? "" : InOut == 1 ? "1- بدهکار" : "2- بستانکار";
    public string CreateUserFullName { get; set; }
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();
    public int UnitId { get; set; }
    public string UnitName { get; set; }
    public int SubUnitId { get; set; }
    public string SubUnitName { get; set; }
    public string UnitNames => UnitId > 0 ? UnitName + '_' + SubUnitName : "";
    public string MyProperty { get; set; }
    public string Ratio { get; set; }
    public string AttributeIds { get; set; }
    public string AttributeName { get; set; }
    public string TotalQuantity { get; set; }
}

public class SaleOrderLineGetRecord
{
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public short BranchId { get; set; }
    public int ItemTypeName { get; set; }
    public byte ItemTypeId { get; set; }
    public string ItemId { get; set; }
    public byte CurrencyId { get; set; }
    public decimal Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal ExchangeRate { get; set; }
    public decimal GrossAmount { get; set; }
    public decimal DiscountValue { get; set; }
    public decimal DiscountType { get; set; }
    public decimal NetAmount { get; set; }
    public byte VATPer { get; set; }
    public decimal VATAmount { get; set; }
    public decimal NetAmountPlusVAT { get; set; }
    public bool AllowInvoicePrice { get; set; }
    public bool PriceIncludingVAT { get; set; }
    public byte InOut { get; set; }
    public string InOutName => InOut == 0 ? "" : InOut == 1 ? "1- بدهکار" : "2- بستانکار";
    public int CategoryId { get; set; }
    public string CategoryName { get; set; }
    public string CategoryItemName => IdAndTitle(CategoryId, CategoryName);
    public string SubUnitId { get; set; }
    public short UnitId { get; set; }
    public decimal Ratio { get; set; }
    public decimal TotalQuantity { get; set; }
    public string AttributeIds { get; set; }

    public short StageId { get; set; }
    public short RowNumber { get; set; }
    public DateTime? OrderDate { get; set; }
    public string OrderDatePersian => OrderDate.ToPersianDateStringNull("{0}/{1}/{2}");
}