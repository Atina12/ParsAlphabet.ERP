using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.WH.Report.ItemTransactionTrialBalancesReport;

public class ItemTransactionTrialBalancesReportPreviewModel
{
    public int Id { get; set; }
    public int? WarehouseId { get; set; }
    public string WarehouseName { get; set; }
    public string Warehouse => IdAndTitle(WarehouseId, WarehouseName);
    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);

    public int ItemId { get; set; }
    public string ItemName { get; set; }
    public string Item => IdAndTitle(ItemId, ItemName);

    public short ItemCategoryId { get; set; }
    public string ItemCategoryName { get; set; }
    public string ItemCategory => IdAndTitle(ItemCategoryId, ItemCategoryName);

    public string AttributeIds { get; set; }
    public string AttributeNames { get; set; }
    public string Attribute => IdAndTitle(AttributeIds, AttributeNames);

    public string AttributeIdList { get; set; }
    public int UnitId { get; set; }
    public string UnitName { get; set; }
    public string Unit => IdAndTitle(UnitId, UnitName);

    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }
    public string AccountDetail => IdAndTitle(AccountDetailId, AccountDetailName);

    public decimal QuantityBegining { get; set; }
    public decimal QuantityDebit { get; set; }
    public decimal QuantityCredit { get; set; }
    public decimal QuantityRemaining { get; set; }
    public decimal AmountBegining { get; set; }
    public decimal AmountDebit { get; set; }
    public decimal AmountCredit { get; set; }
    public decimal AmountRemaining { get; set; }

    public decimal AmountRemain { get; set; }
    public DateTime? DocumentDate { get; set; }
    public string DocumentDatePersian => DocumentDate.ToPersianDateStringNull("{0}/{1}/{2}");
    public int BinId { get; set; }
    public string BinName { get; set; }
    public string Bin => IdAndTitle(BinId, BinName);
    public short ZoneId { get; set; }
    public string ZoneName { get; set; }
    public string Zone => IdAndTitle(ZoneId, ZoneName);

    public byte InOut { get; set; }

    public string Description { get; set; }

    public int No { get; set; }

    public byte IsRemaining { get; set; }
}

public class AttributeIdModel
{
    public string AttributeIds { get; set; }
}

public class GetItemTransactionTrialBalancesReport : PaginationReport
{
    public byte ColumnType { get; set; }
    public string BranchId { get; set; }
    public string WarehouseId { get; set; }
    public string ZoneId { get; set; }
    public string BinId { get; set; }

    [NotMapped] public ReportItemTransactionTrialBalanceType ReportType { get; set; }

    public string ItemCategoryId { get; set; }
    public string WorkflowId { get; set; }
    public string StageId { get; set; }
    public byte? ActionId { get; set; }
    public int? HeaderCreateUserId { get; set; }
    public string ItemTypeId { get; set; }
    public string ItemIds { get; set; }
    public string AttributeIdList { get; set; }
    public string UnitIds { get; set; }
    public string SubUnitIds { get; set; }
    public string FromDocumentDatePersian { get; set; }
    public DateTime? FromDocumentDate => FromDocumentDatePersian.ToMiladiDateTime().Value;
    public string ToDocumentDatePersian { get; set; }
    public DateTime? ToDocumentDate => ToDocumentDatePersian.ToMiladiDateTime().Value;

    public DateTime? FromDocumentDate1 { get; set; }
    public DateTime? ToDocumentDate1 { get; set; }

    [NotMapped] public decimal AffectedQuantityBeginingSum { get; set; }

    [NotMapped] public decimal AffectedQuantityDebitSum { get; set; }

    [NotMapped] public decimal AffectedQuantityCreditSum { get; set; }

    [NotMapped] public decimal AffectedQuantityRemainingSum { get; set; }


    [NotMapped] public decimal AffectedAmountBeginingSum { get; set; }

    [NotMapped] public decimal AffectedAmountDebitSum { get; set; }

    [NotMapped] public decimal AffectedAmountCreditSum { get; set; }

    [NotMapped] public decimal AffectedAmountRemainingSum { get; set; }

    [NotMapped] public decimal AffectedAmountRemainSum { get; set; }
}

public class ItemTransactionReportSum
{
    public decimal QuantityBegining { get; set; }
    public decimal QuantityDebit { get; set; }
    public decimal QuantityCredit { get; set; }
    public decimal QuantityRemaining { get; set; }

    public decimal AmountBegining { get; set; }
    public decimal AmountDebit { get; set; }
    public decimal AmountCredit { get; set; }
    public decimal AmountRemaining { get; set; }

    public decimal AmountRemain { get; set; }
}

public class GetItemTransactionTrialBalanceHeaderTreeViewModel
{
    public GetItemTransactionTrialBalanceHeaderTreeViewModel()
    {
        Children = new List<GetItemTransactionTrialBalanceHeaderTreeViewModel>();
    }

    public int Id { get; set; }
    public string Name { get; set; }
    public int WarehouseId { get; set; }
    public string WareHouseName { get; set; }
    public short ZoneId { get; set; }
    public string ZoneName { get; set; }
    public int BinId { get; set; }
    public string BinName { get; set; }
    public int ItemId { get; set; }
    public string ItemName { get; set; }

    public string AttributeIds { get; set; }
    public string AttributeNames { get; set; }
    public string Attribute => AttributeIds + '-' + AttributeNames;
    public int UnitId { get; set; }
    public string UnitName { get; set; }
    public string Unit => IdAndTitle(UnitId, UnitName);
    public List<GetItemTransactionTrialBalanceHeaderTreeViewModel> Children { get; set; }
    public int Level { get; set; }
    public int ChildCount { get; set; }
}