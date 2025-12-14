namespace ParsAlphabet.ERP.Application.Dtos.FM.TreasuryRequestLine;

public class TreasuryRequestLineDisplay
{
    public int Id { get; set; }
    public int No { get; set; }
    public int JournalId { get; set; }
    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);

    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);
    public int TreasurySubjectId { get; set; }
    public string TreasurySubjectName { get; set; }
    public string TreasurySubject => IdAndTitle(TreasurySubjectId, TreasurySubjectName);

    public int AccountGLId { get; set; }
    public string AccountGLName { get; set; }
    public string AccountGL => IdAndTitle(AccountGLId, AccountGLName);

    public int AccountSGLId { get; set; }
    public string AccountSGLName { get; set; }
    public string AccountSG => IdAndTitle(AccountSGLId, AccountSGLName);

    public short NoSeriesId { get; set; }
    public string NoSeriesName { get; set; }
    public string NoSeries => IdAndTitle(NoSeriesId, NoSeriesName);

    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }
    public string AccountDetail => IdAndTitle(AccountDetailId, AccountDetailName);

    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);
    public DateTime TransactionDate { get; set; }
    public string HeaderTransactionDatePersian => TransactionDate.ToPersianDateString("{0}/{1}/{2}");
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2} {3}:{4}");
    public int CreateUserId { get; set; }
    public string CreateUserName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserName);
    public int RequestId { get; set; }
    public bool IsPreviousStage { get; set; }
    public int RequestNo => RequestId;
    public string Note { get; set; }

    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);
    public int TreasuryFlowTypeId { get; set; }
    public int IsDataEntry { get; set; }
    public bool IsBank { get; set; }
    public bool IsRequest { get; set; }
    public bool IsTreasurySubject { get; set; }
    public MyResultStageStepConfigPage<List<TreasuryRequestLine>> JsonTreasuryRequestLineList { get; set; }
    public string JsonTreasuryLine { get; internal set; }
    public byte StageClassId { get; set; }

    public byte CurrentInOut { get; set; }

    public byte AccountDetailRequired { get; set; }
}

public class TreasuryRequestLine
{
    public int Id { get; set; }
    public short BranchId { get; set; }

    public byte FundTypeId { get; set; }
    public string FundTypeName { get; set; }
    public string FundType => IdAndTitle(FundTypeId, FundTypeName);

    public long ExchangeRate { get; set; }

    public decimal Amount { get; set; }

    public decimal ExchangeAmount { get; set; }

    public decimal DisplayAmount => Inout == 1 ? ExchangeAmount : ExchangeAmount * -1;
    public decimal AmountExchangeRate => ExchangeRate > 1 ? DisplayAmount : DisplayAmount * ExchangeRate;
    public byte Inout { get; set; }
    public string InOutName => Inout == 1 ? "1 - دریافت" : "2 - پرداخت";

    public string CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }

    public int BankAccountId { get; set; }
    public string BankAccountName { get; set; }
    public string BankAccount => IdAndTitle(BankAccountId, BankAccountName);
    public short BankId { get; set; }
    public string BankName { get; set; }
    public string Bank => IdAndTitle(BankId, BankName);
    public byte CurrencyId { get; set; }
    public string CurrencyName { get; set; }
    public string Currency => IdAndTitle(CurrencyId, CurrencyName);
    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }
    public string AccountDetail => IdAndTitle(AccountDetailId, AccountDetailName);

    public int Step { get; set; }

    public int TreasuryLineDetailId { get; set; }

    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2} {3}:{4}");
}

public class TreasuryRequestLineSum
{
    public long ExchangeRate { get; set; }
    public double Amount { get; set; }
    public double DisplayAmount => Amount;
    public double AmountExchangeRate { get; set; }
}

public class GetTreasuryRequestLine : CompanyViewModel
{
    public int Id { get; set; }
    public int TreasuryId { get; set; }
    public int HeaderId { get; set; }
    public short StageId { get; set; }
    public byte CurrencyId { get; set; }
    public byte FundTypeId { get; set; }
    public bool IsDefaultCurrency { get; set; }
    public int WorkflowId { get; set; }
}

public class TreasuryRequestLineResult : MyResultQuery
{
    public int Output { get; set; }
}

public class TreasuryRequestLineGetReccord
{
    public int Id { get; set; }

    public byte FundTypeId { get; set; }
    public string FundTypeName { get; set; }
    public string FundType => $"{FundTypeId}- {FundTypeName}";

    public short BranchId { get; set; }

    public long ExchangeRate { get; set; }
    public decimal FinalAmount { get; set; }
    public decimal Amount { get; set; }
    public int CreatorUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string User => IdAndTitle(CreatorUserId, CreateUserFullName);

    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2} {3}:{4}");

    public byte InOut { get; set; }

    public int BankAccountId { get; set; }
    public string BankAccountName { get; set; }

    public short BankId { get; set; }
    public string BankName { get; set; }

    public byte CurrencyId { get; set; }
    public string CurrencyName { get; set; }


    public decimal AmountExchange { get; set; }
}