using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.WH.WarehouseTransactionSearch;

public class GetWarehouseTransactionQuickSearch
{
    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);


    public int? WarehouseId { get; set; }
    public string WarehouseName { get; set; }
    public string Warehouse => IdAndTitle(WarehouseId, WarehouseName);

    public short ZoneId { get; set; }
    public string ZoneName { get; set; }
    public string Zone => IdAndTitle(ZoneId, ZoneName);


    public short BinId { get; set; }
    public string BinName { get; set; }
    public string Bin => IdAndTitle(BinId, BinName);
}

public class WarehouseTransactionQuickSearch : PaginationReport
{
    [Required] public string ToDatePersian { get; set; }

    [Required] public string FromDatePersian { get; set; }

    public byte? ItemTypeId { get; set; }

    public int? WarehouseId { get; set; }
    public int? ZoneId { get; set; }
    public int? BinId { get; set; }
    public string AtrributeId { get; set; }
}

public class GetWarehouseTransactionQuickSearchType
{
    public long Id { get; set; }
    public long HeaderId { get; set; }
    public byte StageClassId { get; set; }

    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);


    public int UnitId { get; set; }
    public string UnitName { get; set; }
    public string Unit => IdAndTitle(UnitId, UnitName);


    public decimal Ratio { get; set; }

    public decimal QuantityDebit { get; set; }

    public decimal QuantityCredit { get; set; }

    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);

    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);


    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();
}

public class WarehouseTransactionQuickSearchtype : PaginationReport
{
    public short StageId { get; set; }
    public int? WarehouseId { get; set; }
    public int ZoneId { get; set; }
    public int BinId { get; set; }
}