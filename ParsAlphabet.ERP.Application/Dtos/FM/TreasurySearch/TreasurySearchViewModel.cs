using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.FM.TreasurySearch;

public class GetTreasuryQuickSearch
{
    public long TreasuryId { get; set; }
    public byte FundTypeId { get; set; }
    public string FundTypeName { get; set; }
    public string FundType => IdAndTitle(FundTypeId, FundTypeName);
    public string DocumentNo { get; set; }
    public string BondSerialNo { get; set; }
    public short BankId { get; set; }
    public string BankName { get; set; }
    public string Bank => IdAndTitle(BankId, BankName);
    public int ExchangeRate { get; set; }
    public decimal FinalAmount { get; set; }
    public decimal Amount => FinalAmount * ExchangeRate;
    public DateTime CreateDateTime { get; set; }
    public string createDateTimePersian => CreateDateTime.ToPersianDateString();
    public DateTime? DueDate { get; set; }
    public string DueDatePersain => DueDate.ToPersianDateStringNull("{0}/{1}/{2}");
}

public class TreasuryQuickSearch : PaginationReport
{
    [Required] public string ToDatePersian { get; set; }

    [Required] public string FromDatePersian { get; set; }

    public int? FundtypeId { get; set; }
    public long? Serial { get; set; }
    public short? BankId { get; set; }
    public int? FromPrice { get; set; }
    public int? ToPrice { get; set; }
}

public class GetTreasuryQuickSearchType
{
    public int TreasuryId { get; set; }
    public int RequestId { get; set; }
    public int WorkflowId { get; set; }
    public long StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);
    public short? BankId { get; set; }
    public string BankName { get; set; }
    public string Bank => IdAndTitle(BankId, BankName);
    public long? BankAccountId { get; set; }
    public string BankAccountName { get; set; }
    public string BankAccount => IdAndTitle(BankAccountId, BankAccountName);
    public long DocumentNo { get; set; }
    public long BondSerialNo { get; set; }
    public long TransitNo { get; set; }
    public string SayadNumber { get; set; }
    public int? AccountGLId { get; set; }
    public long? AccountSGLId { get; set; }
    public int? AccountDetailId { get; set; }

    public DateTime CreateDateTime { get; set; }
    public string InsertDatePersian => CreateDateTime.ToPersianDateString();
    public int CreateUserId { get; set; }
    public string UserFullName { get; set; }
    public string CreateUserFullName => IdAndTitle(CreateUserId, UserFullName);
    public byte StageClassId { get; set; }
}

public class TreasuryQuickSearchtype : PaginationReport
{
    public long DocumentNo { get; set; }
    public long BondSerialNo { get; set; }
    public short BankId { get; set; }
}