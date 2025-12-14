namespace ParsAlphabet.ERP.Application.Dtos.FM.TreasuryReport;

public class GetTreasurySearchReport : PaginationReport
{
    public DateTime? FromTreasuryDate => FromTreasuryDatePersian.ToMiladiDateTime();
    public string FromTreasuryDatePersian { get; set; }
    public DateTime? ToTreasuryDate => ToTreasuryDatePersian.ToMiladiDateTime();
    public string ToTreasuryDatePersian { get; set; }
    public string BranchId { get; set; }
    public long? WorkflowId { get; set; }

    public int? CreateUserId { get; set; }
    public short? StageId { get; set; }
    public long? CurrencyId { get; set; }
    public byte? FundTypeId { get; set; }
    public int? TreasurySubjectId { get; set; }
    public short? BankId { get; set; }
    public bool LastStep { get; set; }
    public byte? ActionId { get; set; }
    public byte? InOut { get; set; }
    public int? CashFlowCategoryId { get; set; }
    public short? NoSeriesId { get; set; }
    public int? AccountDetailId { get; set; }
}

public class TreasurySumReport
{
    public decimal ExchangeRate { get; set; }
    public decimal AmountReceive { get; set; }
    public decimal AmountPay { get; set; }
}

public class GetTreasuryBankAccountReport : PaginationReport
{
    public DateTime? FromTreasuryDate => FromTreasuryDatePersian.ToMiladiDateTime();
    public string FromTreasuryDatePersian { get; set; }
    public DateTime? ToTreasuryDate => ToTreasuryDatePersian.ToMiladiDateTime();
    public string ToTreasuryDatePersian { get; set; }
    public string BranchId { get; set; }
    public int? WorkflowId { get; set; }
    public int? BankId { get; set; }
    public long? BankAccountId { get; set; }
    public byte? CurrencyId { get; set; }
    public byte? FundTypeId { get; set; }
    public short? StageId { get; set; }
    public byte? ActionId { get; set; }
}

public class TreasuryBankAccountReportSum
{
    public long ExchangeRate { get; set; }
    public long AmountReceive { get; set; }
    public long AmountPay { get; set; }
}

public class TreasurySearchReport
{
    public int Id { get; set; }
    public int TreasuryId { get; set; }
    public int RequestId { get; set; }
    public short StageId { get; set; }
    public byte StageClassId { get; set; }

    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);

    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);
    public string CreateDateTimePersian { get; set; }
    public string TreasuryDateTimePersian { get; set; }
    public byte FundTypeId { get; set; }
    public string FundTypeName { get; set; }
    public string FundType => FundTypeId == 0 ? " " : $"{FundTypeId} - {FundTypeName}";
    public byte InOut { get; set; }
    public string InOutIdName => InOut == 1 ? "1-دریافت" : "2-پرداخت";


    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => $"{BranchId} - {BranchName}";
    public string TransitNo { get; set; }
    public int BondSerialNo { get; set; }

    public short BankId { get; set; }
    public long DocumentNo { get; set; }
    public string BankName { get; set; }
    public string Bank => BankId == 0 ? " " : $"{BankId} - {BankName}";
    public int BankAccountId { get; set; }
    public string BankAccountName { get; set; }
    public string BankAccount => BankAccountId == 0 ? " " : $"{BankAccountName} / {BankName}";
    public byte CurrencyId { get; set; }
    public string CurrencyName { get; set; }
    public string Currency => $"{CurrencyId} - {CurrencyName}";
    public int AccountGlId { get; set; }

    public int AccountSGLId { get; set; }

    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }
    public string AccountDetail => IdAndTitle(AccountDetailId, AccountDetailName);
    public long ExchangeRate { get; set; }
    public long AmountReceive { get; set; }
    public long AmountPay { get; set; }
    public short CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string User => CreateUserId == 0 ? " " : $"{CreateUserId} - {CreateUserFullName}";
    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string Action => $"{ActionId} - {ActionName}";
    public int TreasurySubjectId { get; set; }
    public string TreasurySubjectName { get; set; }
    public string TreasurySubject => IdAndTitle(TreasurySubjectId, TreasurySubjectName);
    public string Description { get; set; }
}

public class TreasuryBankAccountReports
{
    public int Id { get; set; }
    public int TreasuryId { get; set; }
    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);
    public int RequestId { get; set; }
    public short StageId { get; set; }
    public byte StageClassId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);
    public string CreateDateTimePersian { get; set; }
    public string TreasuryDatePersian { get; set; }
    public byte FundTypeId { get; set; }
    public string FundTypeName { get; set; }
    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public short BankId { get; set; }
    public string BankName { get; set; }
    public int BankAccountId { get; set; }
    public string BankAccountName { get; set; }
    public byte CurrencyId { get; set; }
    public string CurrencyName { get; set; }
    public string BondSerialNo { get; set; }
    public int TransitNo { get; set; }
    public string DocumentNo { get; set; }
    public long ExchangeRate { get; set; }
    public long AmountReceive { get; set; }
    public long AmountPay { get; set; }
    public string SayadNumber { get; set; }
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);
    public string User => IdAndTitle(CreateUserId, CreateUserFullName);
    public string Currency => IdAndTitle(CurrencyId, CurrencyName);
    public string Bank => IdAndTitle(BankId, BankName);
    public string FundType => IdAndTitle(FundTypeId, FundTypeName);
    public string BankAccount => IdAndTitle(BankAccountId, BankAccountName);
    public byte CurrentInOut { get; set; }
    public string InOutIdName => CurrentInOut == 1 ? "1-دریافت" : "2 - پرداخت";

    public byte ActionId { get; set; }
    public string Action { get; set; }
    public string ActionName => IdAndTitle(ActionId, Action);

    public string Description { get; set; }
}