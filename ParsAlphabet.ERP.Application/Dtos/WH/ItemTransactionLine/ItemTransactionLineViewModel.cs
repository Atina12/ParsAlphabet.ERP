namespace ParsAlphabet.ERP.Application.Dtos.WH.ItemTransactionLine;

public class ItemTransactionLineDisplay
{
    public int Id { get; set; }
    public int RequestId { get; set; }
    public int RequestNo => RequestId;
    public int JournalId { get; set; }
    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);

    public int No { get; set; }
    public DateTime TransactionDate { get; set; }
    public string TransactionDatePersian => TransactionDate.ToPersianDateString("{0}/{1}/{2}");

    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);

    public int? WarehouseId { get; set; }
    public string WarehouseName { get; set; }
    public string Warehouse => IdAndTitle(WarehouseId, WarehouseName);

    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);

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
    public int IsDataEntry { get; set; }
    public bool IsEqualToParentRequest { get; set; }
    public bool IsRequest { get; set; }
    public bool BySystem { get; set; }
    public string Note { get; set; }

    public MyResultStageStepConfigPage<List<ItemTransactionLines>> JsonTransactionLineList { get; set; }
    public string JsonTransactionLine { get; internal set; }
    public int RequestRemainedAmount { get; set; }
    public string RequestRemainedAmountName => RequestRemainedAmount > 0 ? "دارد" : "ندارد";
    public int ParentWorkflowCategoryId { get; set; }
    public string ParentWorkflowCategoryName { get; set; }
    public string ParentWorkflowCategory => IdAndTitle(ParentWorkflowCategoryId, ParentWorkflowCategoryName);
    public byte InOut { get; set; }
    public string inOutName => InOut == 0 ? "" : InOut == 1 ? "1- بدهکار" : "2- بستانکار";
    public bool IsPreviousStage { get; set; }

    public byte IsMultiple { get; set; }

    public string IsMultipleName => IsMultiple > 0 ? "دارد" : "ندارد";
}

public class ItemTransactionLineGetRecord : CompanyViewModel
{
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public byte ItemTypeId { get; set; }
    public int ItemId { get; set; }
    public short StageId { get; set; }
    public short BranchId { get; set; }
    public byte ActionId { get; set; }
    public byte? CurrencyId { get; set; }
    public decimal Quantity { get; set; }
    public decimal Price { get; set; }
    public decimal Amount { get; set; }
    public short ZoneId { get; set; }
    public int BinId { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime { get; set; }
    public byte InOut { get; set; }
    public int CategoryId { get; set; }
    public short? SubUnitId { get; set; }
    public short? UnitId { get; set; }
    public short? IdSubUnit { get; set; }
    public decimal Ratio { get; set; }
    public decimal TotalQuantity { get; set; }
    public string AttributeIds { get; set; }
    public int AccountGLId { get; set; }
    public int AccountSGLId { get; set; }
    public short NoSeriesId { get; set; }
    public int AccountDetailId { get; set; }
    public string ZoneName { get; set; }
    public string ZoneIdName => IdAndTitle(ZoneId, ZoneName);
    public string BinName { get; set; }
    public string BinIdName => IdAndTitle(BinId, BinName);
    public string CategoryName { get; set; }
    public string CategoryItemName => IdAndTitle(CategoryId, CategoryName);
    public string AccountGLName { get; set; }
    public string AccountGLIdName => IdAndTitle(AccountGLId, AccountGLName);
    public string AccountSGLame { get; set; }
    public string AccountSGIdLame => IdAndTitle(AccountSGLId, AccountSGLame);
    public string AccountDetailName { get; set; }
    public string AccountDetailIdName => IdAndTitle(AccountDetailId, AccountDetailName);
    public int WorkflowId { get; set; }
    public int? WarehouseId { get; set; }
    public string WarehouseName { get; set; }
    public string Warehouse => IdAndTitle(WarehouseId, WarehouseName);
}

public class ItemTransactionLines
{
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public short StageId { get; set; }
    public byte StageClassId { get; set; }
    public int CategoryId { get; set; }
    public string CategoryName { get; set; }
    public string CategoryItemName => IdAndTitle(CategoryId, CategoryName);
    public int ItemId { get; set; }
    public string ItemName { get; set; }
    public string Item => IdAndTitle(ItemId, ItemName);

    public byte ItemTypeId { get; set; }
    public string ItemTypeName { get; set; }
    public string ItemType => IdAndTitle(ItemTypeId, ItemTypeName);

    public int? WarehouseId { get; set; }
    public string WarehouseName { get; set; }
    public string Warehouse => IdAndTitle(WarehouseId, WarehouseName);

    public short? ZoneId { get; set; }
    public string ZoneName { get; set; }
    public string Zone => IdAndTitle(ZoneId, ZoneName);

    public byte? BinId { get; set; }
    public string BinName { get; set; }
    public string Bin => IdAndTitle(BinId, BinName);

    public byte CurrencyId { get; set; }
    public string CurrencyName { get; set; }
    public string Currency => IdAndTitle(CurrencyId, CurrencyName);
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
    public short UnitId { get; set; }
    public string UnitName { get; set; }
    public short SubUnitId { get; set; }
    public string SubUnitName { get; set; }
    public string UnitNames => UnitId > 0 ? UnitName + '_' + SubUnitName : "";
    public string MyProperty { get; set; }
    public string Ratio { get; set; }
    public string AttributeIds { get; set; }
    public string AttributeName { get; set; }
    public string TotalQuantity { get; set; }
}

public class ItemTransactionRequest
{
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public short StageId { get; set; }
    public byte StageClassId { get; set; }
    public short CategoryId { get; set; }
    public string CategoryName { get; set; }
    public string CategoryItemName => CategoryId > 0 ? $" {CategoryId}-{CategoryName}" : " ";
    public int ItemId { get; set; }
    public string ItemName { get; set; }
    public string Item => $"{ItemId} - {ItemName}";

    public byte ItemTypeId { get; set; }
    public string ItemTypeName { get; set; }
    public string ItemType => $"{ItemTypeId} - {ItemTypeName}";

    public short? ZoneId { get; set; }
    public string ZoneName { get; set; }
    public string Zone => $"{ZoneId} - {ZoneName}";

    public byte? BinId { get; set; }
    public string BinName { get; set; }
    public string Bin => $"{BinId} - {BinName}";

    public byte CurrencyId { get; set; }
    public string CurrencyName { get; set; }
    public string Currency => $"{CurrencyId} - {CurrencyName}";
    public byte InOut { get; set; }
    public string InOutName => InOut == 1 ? "1 - ورود" : "2 - خروج";
    public decimal RequestQuantity { get; set; }
    public decimal Quantity { get; set; }
    public int ExchangeRate { get; set; }
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

    public decimal Ratio { get; set; }
    public string AttributeIds { get; set; }
    public string AttributeName { get; set; }
    public decimal TotalQuantity { get; set; }
    public bool IsQuantity { get; set; }
    public List<GetStageStepConfigColumnsViewModel> Columns { get; set; }
}

public class WarehouseExistViewModel : CompanyViewModel
{
    public int Id { get; set; }
    public byte BySystem { get; set; }
}