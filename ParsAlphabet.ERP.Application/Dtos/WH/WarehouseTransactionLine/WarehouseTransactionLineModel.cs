using ParsAlphabet.ERP.Application.Dtos.FM.PostingGroup;

namespace ParsAlphabet.ERP.Application.Dtos.WH.WarehouseTransactionLine;

public class WarehouseTransactionLineModel : CompanyViewModel
{
    public int Id { get; set; }
    public int Rownumber { get; set; }
    public int HeaderId { get; set; }
    public int HeaderAccountDetailId { get; set; }
    public short HeaderNoSeriesId { get; set; }
    public byte? CurrencyId { get; set; }
    public byte ItemTypeId { get; set; }
    public int ItemId { get; set; }
    public short StageId { get; set; }
    public short BranchId { get; set; }

    public long ActionId { get; set; }
    public bool IsDefaultCurrency { get; set; }

    public decimal Quantity { get; set; }

    public decimal Price { get; set; }
    public int ExchangeRate { get; set; }
    public decimal Amount { get; set; }
    public short ZoneId { get; set; }
    public int BinId { get; set; }

    public int CreateUserId { get; set; }
    public DateTime CreateDateTime { get; set; } = DateTime.Now;
    public byte InOut { get; set; }
    public byte HeaderInOut { get; set; }
    public int CategoryId { get; set; }

    public short? SubUnitId { get; set; }

    public short? UnitId { get; set; }

    public decimal Ratio { get; set; }
    public decimal TotalQuantity { get; set; }

    public string AttributeIds { get; set; }

    public int AccountGLId { get; set; }
    public int AccountSGLId { get; set; }
    public short NoSeriesId { get; set; }
    public int AccountDetailId { get; set; }

    public short? IdSubUnit { get; set; }
    public bool IsQuantity { get; set; }

    public int? WarehouseId { get; set; }
    public int WorkflowId { get; set; }
    public int WorkflowCategoryId { get; set; }

    public List<PostingGroupbyTypeLineModel> ItemTransactionPostingGroup { get; set; }

    public List<PostingGroupbyTypeLineModel> PostingList { get; set; }
    public DateTime HeaderDocumentDate { get; set; }

    public byte StageClassId { get; set; }
}

public class WarehouseTransactionLineSum
{
    public string Amount { get; set; }
    public string DisplayAmount => Amount;
    public string Quantity { get; set; }
    public string TotalQuantity { get; set; }
}

public class GetWarehouseTransactionLine : CompanyViewModel
{
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public bool IsDefaultCurrency { get; set; }
    public short StageId { get; set; }
    public byte StageClassId { get; set; }
    public int WorkflowId { get; set; }
    public int? WarehouseId { get; set; }
    public short ZoneId { get; set; }
    public int BinId { get; set; }
    public byte InOut { get; set; }
    public byte HeaderInOut { get; set; }
    public decimal TotalQuantity { get; set; }
    public int ItemId { get; set; }
    public short? UnitId { get; set; }
    public short? SubUnitId { get; set; }
    public string AttributeIds { get; set; }
    public decimal Ratio { get; set; }
    public DateTime HeaderDocumentDate { get; set; }
}

public class WarehouseTransactionLineGetReccord
{
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public short BranchId { get; set; }
    public short StageId { get; set; }
    public short CategoryId { get; set; }
    public int AccountDetailId { get; set; }
    public int RequestId { get; set; }
    public int HeaderAccountDetailId { get; set; }
    public short HeaderNoseriesId { get; set; }
    public byte ItemTypeId { get; set; }
    public int ItemId { get; set; }
    public short ZoneId { get; set; }
    public short BinId { get; set; }
    public decimal Price { get; set; }
    public decimal Ratio { get; set; }
    public decimal Amount { get; set; }
    public decimal Quantity { get; set; }
    public decimal TotalQuantity { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2} {3}:{4}");
    public byte HeaderInOut { get; set; }
    public byte InOut { get; set; }
    public int? WarehouseId { get; set; }
    public bool IsQuantity { get; set; }
    public int WorkflowCategoryId { get; set; }
    public int WorkflowId { get; set; }
    public short? UnitId { get; set; }
    public short? SubUnitId { get; set; }

    public short? IdSubUnit { get; set; }
    public string AttributeIds { get; set; }
    public DateTime HeaderDocumentDate { get; set; }

    public byte CurrencyId { get; set; }

    public byte StageClassId { get; set; }
}

public class TransactionLineDetailViewModel
{
    public int UnitId { get; set; }
    public string UnitName { get; set; }
    public string SubUnitName { get; set; }
    public string UnitNames => UnitId > 0 ? UnitName + '_' + SubUnitName : "";
    public string Ratio { get; set; }
    public string AttributeName { get; set; }
    public string ItemName { get; set; }
    public int ItemTransactionLineId { get; set; }
    public int ItemId { get; set; }
    public string ItemNameIds => ItemId > 0 ? IdAndTitle(ItemId, ItemName) : "";
}

public class WarehouseTransactionLinePostingGroup
{
    public int HeaderId { get; set; }
    public int ItemTransactionLineId { get; set; }
    public short ItemCategoryId { get; set; }
    public short BranchId { get; set; }
    public short StageId { get; set; }
    public byte AccountNatureTypeId { get; set; }
    public byte FundTypeId { get; set; }
    public int AccountGLId { get; set; }
    public int AccountSGLId { get; set; }
    public short NoseriesId { get; set; }
    public int AccountDetailId { get; set; }
    public decimal Amount { get; set; }
    public string Description { get; set; }
    public long ExchangeRate { get; set; }
    public byte CurrencyId { get; set; }
}

public class CheckLockViewModel
{
    public int FiscalYearLineId { get; set; }
    public short BranchId { get; set; }
}