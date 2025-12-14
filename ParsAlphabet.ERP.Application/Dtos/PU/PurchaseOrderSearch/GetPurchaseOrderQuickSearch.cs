using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.PU.PurchaseOrderSearch;

public class GetPurchaseOrderQuickSearch
{
    public long PurchaseOrderId { get; set; }
    public long Id { get; set; }
    public byte ItemTypeId { get; set; }
    public string ItemTypeName { get; set; }
    public string ItemType => IdAndTitle(ItemTypeId, ItemTypeName);

    public int ExchangeRate { get; set; }
    public decimal GrossAmount { get; set; }
    public decimal Amount => GrossAmount * ExchangeRate;
    public DateTime CreateDateTime { get; set; }
    public string createDateTimePersian => CreateDateTime.ToPersianDateString();
}

public class PurchaseOrderQuickSearch : PaginationReport
{
    [Required] public string ToDatePersian { get; set; }

    [Required] public string FromDatePersian { get; set; }

    public byte? ItemTypeId { get; set; }
    public int? FromPrice { get; set; }
    public int? ToPrice { get; set; }
}

public class GetPurchaseOrderQuickSearchType
{
    public long Id { get; set; }
    public long HeaderId { get; set; }
    public int RequestId { get; set; }
    public short StageId { get; set; }
    public int WorkflowId { get; set; }
    public byte StageClassId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);
    public int CreateUserId { get; set; }
    public string UserFullName { get; set; }
    public string createUser => IdAndTitle(CreateUserId, UserFullName);
    public DateTime CreateDateTime { get; set; }
    public string createDateTimePersian => CreateDateTime.ToPersianDateString();
    public int AccountGLId { get; set; }
    public string AccountGLName { get; set; }
    public string AccountGL => IdAndTitle(AccountGLId, AccountGLName);
    public int AccountSGLId { get; set; }
    public string AccountSGLName { get; set; }
    public string AccountSGL => IdAndTitle(AccountSGLId, AccountSGLName);
    public short NoSeriesId { get; set; }
    public string NoseriesName { get; set; }
    public string Noseries => IdAndTitle(NoSeriesId, NoseriesName);
    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }
    public string AccountDetail => IdAndTitle(AccountDetailId, AccountDetailName);
}

public class PurchaseOrderQuickSearchtype : PaginationReport
{
    public long Id { get; set; }
}