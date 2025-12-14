namespace ParsAlphabet.ERP.Application.Dtos.WH.ItemRequestLine;

public class ItemRequestLineDisplay
{
    public int Id { get; set; }
    public int RequestId { get; set; }
    public int RequestNo => RequestId;
    public int ItemTransactionId { get; set; }
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
    public byte DocumentTypeId { get; set; }
    public string DocumentTypeName { get; set; }
    public string DocumentType => IdAndTitle(DocumentTypeId, DocumentTypeName);


    public int AccountGLId { get; set; }
    public string AccountGLName { get; set; }
    public string AccountGL => IdAndTitle(AccountGLId, AccountGLName);

    public int AccountSGLId { get; set; }
    public string AccountSGLName { get; set; }
    public string AccountSGL => IdAndTitle(AccountSGLId, AccountSGLName);
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
    public int IsDataEntry { get; set; }
    public bool IsPreviousStage { get; set; }
    public bool IsQuantityWarehouse { get; set; }
    public bool BySystem { get; set; }
    public string Note { get; set; }

    public MyResultStageStepConfigPage<List<ItemRequestLines>> JsonTransactionLineList { get; set; }
    public string JsonTransactionLine { get; internal set; }

    public byte InOut { get; set; }

    public string InOutName => InOut == 1 ? "1 - ورود" : "2 - خروج";
}

public class ItemRequestLineGetRecord : CompanyViewModel
{
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public byte ItemTypeId { get; set; }
    public int ItemId { get; set; }
    public byte? CurrencyId { get; set; }
    public decimal Quantity { get; set; }
    public decimal Price { get; set; }
    public int ExchangeRate { get; set; }
    public decimal Amount { get; set; }
    public decimal DecimalAmount { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime { get; set; }
    public byte InOut { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; }
    public string CategoryItemName => IdAndTitle(CategoryId, CategoryName);
    public string SubUnitId { get; set; }
    public short UnitId { get; set; }
    public decimal Ratio { get; set; }
    public decimal TotalQuantity { get; set; }
    public string AttributeIds { get; set; }
}

public class ItemRequestLines
{
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public short StageId { get; set; }
    public byte StageClassId { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; }
    public string CategoryItemName => CategoryId > 0 ? $" {CategoryId}-{CategoryName}" : " ";
    public int ItemId { get; set; }
    public string ItemName { get; set; }
    public string Item => $"{ItemId} - {ItemName}";
    public byte ItemTypeId { get; set; }
    public string ItemTypeName { get; set; }
    public string ItemType => $"{ItemTypeId} - {ItemTypeName}";
    public byte CurrencyId { get; set; }
    public string CurrencyName { get; set; }
    public string Currency => $"{CurrencyId} - {CurrencyName}";
    public byte InOut { get; set; }
    public string InOutName => InOut == 1 ? "1 - ورود" : "2 - خروج";
    public string Quantity { get; set; }
    public long ExchangeRate { get; set; }
    public decimal Price { get; set; }
    public decimal Amount { get; set; }
    public decimal DisplayAmount => InOut == 1 ? Amount : Amount * -1;
    public decimal AmountExchangeRate => ExchangeRate > 1 ? DisplayAmount * ExchangeRate : DisplayAmount;
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2} {3}:{4}");
    public string CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserFullName);
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

public class ItemRequestLineResult : MyResultQuery
{
    public int Output { get; set; }
}

public class GetItemRequestLineRecordByIds
{
    public int Id { get; set; }
}

public class DeleteRequestLineViewModel
{
    public DateTime HeaderDocumentDate { get; set; }
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public int WorkflowId { get; set; }
    public short StageId { get; set; }
    public short BranchId { get; set; }
}