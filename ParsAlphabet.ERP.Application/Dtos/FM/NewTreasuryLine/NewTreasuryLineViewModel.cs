namespace ParsAlphabet.ERP.Application.Dtos.FM.NewTreasuryLine;

public class NewTreasuryLineDisplay
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
    public string AccountSGL => IdAndTitle(AccountSGLId, AccountSGLName);
    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }
    public string AccountDetail => IdAndTitle(AccountDetailId, AccountDetailName);
    public string DocumentTypeName { get; set; }
    public byte DocumentTypeId { get; set; }
    public string DocumentType => IdAndTitle(DocumentTypeId, DocumentTypeName);
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
    public bool IsEqualToParentRequest { get; set; }
    public bool IsTreasurySubject { get; set; }
    public MyResultStageStepConfigPage<List<TreasuryLines>> JsonTreasuryLineList { get; set; }
    public string JsonTreasuryLine { get; internal set; }
    public byte StageClassId { get; set; }
    public byte CurrentInOut { get; set; }
    public byte AccountDetailRequired { get; set; }


    public int ParentWorkflowCategoryId { get; set; }
    public string ParentWorkflowCategoryName { get; set; }
    public string ParentWorkflowCategory => IdAndTitle(ParentWorkflowCategoryId, ParentWorkflowCategoryName);

    public short NoSeriesId { get; set; }
    public string NoSeriesName { get; set; }
    public string NoSeries => IdAndTitle(NoSeriesId, NoSeriesName);

    public int RequestRemainedAmount { get; set; }
    public string RequestRemainedAmountName => RequestRemainedAmount > 0 ? "دارد" : "ندارد";
    public DateTime? ParentCreateDateTime { get; set; }
    public string ParentDocumentDatePersian => ParentCreateDateTime.ToPersianDateStringNull("{0}/{1}/{2}");

    public byte IsMultiple { get; set; }

    public string IsMultipleName => IsMultiple > 0 ? "دارد" : "ندارد";
}

public class TreasuryLineGetRecord : CompanyViewModel
{
    public int Id { get; set; }
    public int BondStepId { get; set; }

    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);
    public short StageId { get; set; }
    public long HeaderId { get; set; }
    public int ParentId { get; set; }
    public short RowNumber { get; set; }
    public byte? CurrencyId { get; set; }
    public byte InOut { get; set; }
    public byte FundTypeId { get; set; }
    public short? BankId { get; set; }
    public int? BankAccountId { get; set; }
    public long? TransitNo { get; set; }
    public string SayadNumber { get; set; }
    public long? DocumentNo { get; set; }
    public decimal Amount { get; set; }
    public decimal BalanceAmount { get; set; }
    public int ExchangeRate { get; set; }
    public decimal? AmountExchange { get; set; }
    public int? TreasuryDetailId { get; set; }
    public short? BondBranchNo { get; set; }
    public string BondBranchName { get; set; }
    public string BondSerialNo { get; set; }
    public long CheckSerial { get; set; }
    public DateTime? BondDueDate { get; set; }

    public string BondDueDatePersian
    {
        get => BondDueDate.ToPersianDateStringNull("{0}/{1}/{2}");
        set
        {
            var str = value.ToMiladiDateTime();
            BondDueDate = str == null ? null : str.Value;
        }
    }

    public string BondIssuer { get; set; }
    public short? BankIssuerId { get; set; }
    public string BankAccountIssuer { get; set; }

    public int CreateUserId { get; set; }
    public DateTime CreateDateTime { get; set; }

    public int ParentWorkflowCategoryId { get; set; }
}

public class NewTreasuryLines
{
    public int Id { get; set; }
    public short BranchId { get; set; }
    public byte FundTypeId { get; set; }
    public string FundTypeName { get; set; }
    public string FundType => IdAndTitle(FundTypeId, FundTypeName);
    public long TransitNo { get; set; }

    public long DocumentNo { get; set; }
    public long ExchangeRate { get; set; }

    public decimal FinalAmount { get; set; }
    public decimal DisplayAmount => InOut == 1 ? FinalAmount : FinalAmount * -1;

    public decimal Amount { get; set; }
    public decimal ReceivedAmount => InOut == 1 ? Amount : Amount * -1;


    public string CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }

    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2} {3}:{4}");


    public byte InOut { get; set; }
    public string InOutName => InOut == 1 ? "1 - دریافت" : "2 - پرداخت";

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

    public string SayadNumber { get; set; }
    public long CheckSerial { get; set; }

    //BondBranchNo
    public short? CheckBranchNo { get; set; }
    public string CheckBranchName { get; set; }

    public string CheckIssuer { get; set; }
    public string CheckBankAccountIssuer { get; set; }

    public long CheckBankIssuerId { get; set; }
    public string IssuerBankName { get; set; }
    public string BankIssuer => IdAndTitle(CheckBankIssuerId, IssuerBankName);

    public DateTime CheckDueDate { get; set; }
    public string CheckDueDatePersian => CheckDueDate.ToPersianDateString("{0}/{1}/{2}");

    public int Step { get; set; }

    public int TreasuryLineDetailId { get; set; }

    public int MaxStep { get; set; }

    public long BondSerialNo => CheckSerial;
}

public class NewTreasuryLineSum
{
    public long ExchangeRate { get; set; }
    public double Amount { get; set; }
    public double DisplayAmount => Amount;
    public double AmountExchangeRate { get; set; }
    public double ReceivedAmount => AmountExchangeRate;
}

public class NewTreasuryLineGetReccord
{
    public long Id { get; set; }
    public byte FundTypeId { get; set; }
    public string FundTypeName { get; set; }
    public string FundType => IdAndTitle(FundTypeId, FundTypeName);

    public string SayadNumber { get; set; }

    public long DocumentNo { get; set; }

    //public long CheckSerial { get; set; }
    public long BondSerialNo { get; set; }
    public long BondBranchNo { get; set; }
    public string BondBranchName { get; set; }
    public string Branch => IdAndTitle(BondBranchNo, BondBranchName);


    public string BondIssuer { get; set; }
    public int BankAccountId { get; set; }
    public string BankAccountName { get; set; }

    public short BankId { get; set; }
    public string BankName { get; set; }

    public string BankAccountIssuer { get; set; }


    public short BankIssuerId { get; set; }
    public string IssuerBankName { get; set; }
    public string BondDueDatePersian { get; set; }
    public DateTime? BondDueDate => BondDueDatePersian.ToMiladiDateTime();
    public int ExchangeRate { get; set; }

    public decimal FinalAmount { get; set; }

    public decimal Amount { get; set; }

    public int CreatorUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string User => IdAndTitle(CreatorUserId, CreateUserFullName);

    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2} {3}:{4}");


    public byte InOut { get; set; }

    public byte CheckStep { get; set; }
    public byte CurrencyId { get; set; }
    public string CurrencyName { get; set; }
    public short BranchId { get; set; }

    public long CheckDetailId { get; set; }
    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }
    public byte Step { get; set; }
    public decimal AmountExchange { get; set; }
}

public class TreasuryLines
{
    public int Id { get; set; }
    public int TreasuryId { get; set; }
    public int HeaderId { get; set; }
    public int RowNumber { get; set; }
    public byte InOut { get; set; }
    public string InOutName { get; set; }
    public byte FundTypeId { get; set; }
    public string FundTypeName { get; set; }
    public short BankId { get; set; }
    public string BankName { get; set; }
    public int BankAccountId { get; set; }
    public string BankAccountName { get; set; }
    public string bankIssuerName { get; set; }
    public string bankAccountIssuer { get; set; }
    public long TransitNo { get; set; }
    public long DocumentNo { get; set; }
    public string BondSerialNo { get; set; }
    public byte CurrencyId { get; set; }
    public string CurrencyName { get; set; }
    public short StageId { get; set; }
    public short BranchId { get; set; }
    public DateTime? BondDueDate { get; set; }
    public string BondDueDatePersian => BondDueDate.ToPersianDateStringNull("{0}/{1}/{2}");
    public decimal Amount { get; set; }
    public long ExchangeRate => InOut == 1 ? ExchangeRateValue : -ExchangeRateValue;
    public long ExchangeRateValue { get; set; }
    public decimal AmountExchange => Amount * ExchangeRateValue;
    public string CreateUserFullName { get; set; }
    public string ModifiedUserFullName { get; set; }
    public DateTime? CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateStringNull("{0}/{1}/{2} {3}:{4}");
}

public class GetTreasuryLine : CompanyViewModel
{
    public int Id { get; set; }
    public int TreasuryId { get; set; }
    public int HeaderId { get; set; }
    public short StageId { get; set; }
    public byte CurrencyId { get; set; }
    public byte FundTypeId { get; set; }
    public bool IsDefaultCurrency { get; set; }
}

public class GetAccountDetail
{
    public int AccountGLId { get; set; }
    public int AccountSGLId { get; set; }
}

public class TreasuryRequest
{
    public List<NewRequestTreasuryLines> Requests { get; set; }
    public List<GetStageStepConfigColumnsViewModel> Columns { get; set; }
}

public class TreasuryLinePostingGroup
{
    public long TreasuryId { get; set; }
    public short StageId { get; set; }
    public short BranchId { get; set; }
    public int TreasuryLineId { get; set; }
    public byte FundTypeId { get; set; }
    public int BankAccountId { get; set; }
    public int AccountGLId { get; set; }
    public int AccountSGLId { get; set; }
    public short NoseriesId { get; set; }
    public int AccountDetailId { get; set; }
    public string Description { get; set; }
    public decimal Amount { get; set; }
    public long ExchangeRate { get; set; }
    public byte AccountNatureTypeId { get; set; }
    public byte CurrencyId { get; set; }
}

public class NewRequestTreasuryLines
{
    public long HeaderId { get; set; }
    public byte FundTypeId { get; set; }
    public long Id { get; set; }
    public long TreasuryDetailId { get; set; }
    public byte CurrencyId { get; set; }
    public string CurrencyName { get; set; }
    public byte InOutId { get; set; }
    public string InOut { get; set; }
    public double ExchangeRate { get; set; }
    public decimal Amount { get; set; }
    public decimal AmountExchange => Amount * Convert.ToDecimal(ExchangeRate);
    public decimal BalanceAmount { get; set; }
    public DateTime TreasuryDate { get; set; }
    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }
    public int BankAccountId { get; set; }
    public string BankAccountName { get; set; }
    public string BankAccount => IdAndTitle(BankAccountId, BankAccountName);
    public long? BondSerialNo { get; set; }
    public long? DocumentNo { get; set; }
    public string BankAccountIssuer { get; set; }
    public short IssuerBankId { get; set; }
    public string IssuerBankName { get; set; }
    public string BankIssuer => IssuerBankId != 0 ? IssuerBankId + " - " + IssuerBankName : "";
    public long? BondBranchNo { get; set; }
    public string BondBranchName { get; set; }
    public string BondIssuer { get; set; }
    public DateTime? BondDueDate { get; set; }
    public string BondDueDatePersian { get; set; }
    public string SayadNumber { get; set; }
    public short? BankId { get; set; }
    public string BankName { get; set; }
    public string CreateUserFullName { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian { get; set; }

    public long TreasuryId { get; set; }

    public long CheckBranchId { get; set; }
}

public class NewRequestTreasuryCash : NewRequestTreasuryLines
{
    public NewRequestTreasuryCash(
        long treasuryCashId,
        byte cashFundTypeId,
        byte cashCurrencyId,
        string cashCurrencyName,
        byte cashInOut,
        int cashCreateUserId,
        DateTime cashCreateDateTime,
        string cashCreateUserFullName,
        decimal requestAmount,
        decimal amount,
        int exchangeRate)
    {
        Id = treasuryCashId;
        FundTypeId = cashFundTypeId;
        CurrencyId = cashCurrencyId;
        CurrencyName = cashCurrencyName;
        InOutId = cashInOut;
        InOut = InOutId == 1 ? "1 - دریافت" : "2 - پرداخت";
        Amount = amount;
        BalanceAmount = requestAmount;
        ExchangeRate = exchangeRate;
        CreateUserId = cashCreateUserId;
        CreateUserFullName = IdAndTitle(cashCreateUserId, cashCreateUserFullName);
        CreateDateTime = cashCreateDateTime;
        CreateDateTimePersian = CreateDateTime.ToPersianDateString();
    }

    public string CashFundTypeName { get; set; }
    public int CashFundTypeid { get; set; }
    public int TreasuryCashId { get; set; }
    public int CashCurrencyId { get; set; }
    public string CashCurrencyName { get; set; }
    public int CashInout { get; set; }
    public int CashCreateUserId { get; set; }
    public string CashCreateUserFullName { get; set; }
    public DateTime CashCreateDateTime { get; set; }
}

public class NewRequestTreasuryCheck : NewRequestTreasuryLines
{
    public NewRequestTreasuryCheck(
        long treasuryId,
        DateTime treasuryDate,
        int accountDetailId,
        string accountDetailName,
        long treasuryCheckId,
        long treasuryCheckDetailId,
        byte checkFundTypeId,
        short checkBankId,
        string checkBankName,
        int checkBankAccountId,
        string checkBankAccountName,
        long checkCheckSerial,
        long checkCheckNumber,
        string checkBankAccountIssuer,
        long checkBranchNo,
        string checkBranchName,
        string bondIssuer,
        DateTime? checkDueDate,
        byte checkCurrencyId,
        string checkCurrencyName,
        int exchangeRate,
        string issuerBankName,
        short issuerBankId,
        int checkCreateUserId,
        short checkBranchId,
        string checkCreateUserFullName,
        DateTime checkCreateDateTime,
        byte? checkInOut,
        string sayadNumber,
        decimal requestAmount,
        decimal amount
    )
    {
        Id = treasuryCheckId;
        FundTypeId = checkFundTypeId;
        CurrencyId = checkCurrencyId;
        CurrencyName = checkCurrencyName;
        InOutId = checkInOut ?? 0;
        InOut = InOutId == 1 ? "1 - دریافت" : "2 - پرداخت";
        CreateUserId = checkCreateUserId;
        CreateUserFullName = IdAndTitle(checkCreateUserId, checkCreateUserFullName);
        CreateDateTime = checkCreateDateTime;
        CreateDateTimePersian = CreateDateTime.ToPersianDateString();
        BankAccountId = checkBankAccountId;
        BankAccountName = IdAndTitle(checkBankAccountId, checkBankName);
        BondSerialNo = checkCheckSerial;
        DocumentNo = checkCheckNumber;
        BankAccountIssuer = checkBankAccountIssuer;
        BondBranchNo = checkBranchNo;
        BondBranchName = checkBranchName;
        IssuerBankId = issuerBankId;
        IssuerBankName = issuerBankName;
        BondIssuer = bondIssuer;
        SayadNumber = sayadNumber;
        BankId = checkBankId;
        BankName = IdAndTitle(checkBankId, checkBankAccountName);
        TreasuryDetailId = treasuryCheckDetailId;
        BondDueDate = checkDueDate;
        BondDueDatePersian = BondDueDate.ToPersianDateStringNull("{0}/{1}/{2}");
        ExchangeRate = exchangeRate;
        Amount = amount;
        TreasuryId = treasuryId;
        TreasuryDate = treasuryDate;
        AccountDetailId = accountDetailId;
        AccountDetailName = accountDetailName;
        CheckBranchId = checkBranchId;
        BalanceAmount = requestAmount;
    }

    public long TreasuryCheckId { get; set; }

    public int CheckFundTypeid { get; set; }
    public string CheckFundTypeName { get; set; }
    public long CheckBankAccountId { get; set; }
    public string CheckBankAccountName { get; set; }
    public long CheckCheckSerial { get; set; }
    public long CheckCheckNumber { get; set; }
    public long CheckBankAccountIssuer { get; set; }
    public long CheckBranchNo { get; set; }
    public string CheckBranchName { get; set; }
    public double CheckExchangeRate { get; set; }
    public decimal CheckAmountLcy { get; set; }
    public decimal CheckAmountFcy { get; set; }
    public long CheckCurrencyId { get; set; }
    public string CheckCurrencyName { get; set; }
    public DateTime CheckDueDate { get; set; }
    public long CheckBankId { get; set; }
    public string CheckBankName { get; set; }
    public int CheckInout { get; set; }
    public int CheckCreateUserId { get; set; }
    public string CheckCreateUserFullName { get; set; }
    public DateTime CheckCreateDateTime { get; set; }
}

public class NewRequestTreasuryDraft : NewRequestTreasuryLines
{
    public NewRequestTreasuryDraft(
        long treasuryDraftId,
        byte draftFundTypeId,
        byte draftCurrencyId,
        string draftCurrencyName,
        byte draftCurrentInout,
        int draftCreateUserId,
        DateTime draftCreateDateTime,
        string draftCreateUserFullName,
        short draftBankId,
        string draftBankName,
        int draftBankAccountId,
        string draftBankAccountNo,
        decimal requestAmount,
        decimal amount,
        int exchangeRate)
    {
        Id = treasuryDraftId;
        FundTypeId = draftFundTypeId;
        CurrencyId = draftCurrencyId;
        CurrencyName = draftCurrencyName;
        InOutId = draftCurrentInout;
        InOut = InOutId == 1 ? "1 - دریافت" : "2 - پرداخت";
        Amount = amount;
        BalanceAmount = requestAmount;
        ExchangeRate = exchangeRate;
        CreateUserId = draftCreateUserId;
        CreateUserFullName = IdAndTitle(draftCreateUserId, draftCreateUserFullName);
        CreateDateTime = draftCreateDateTime;
        CreateDateTimePersian = CreateDateTime.ToPersianDateString();
        BankId = draftBankId;
        BankName = IdAndTitle(draftBankId, draftBankName);
        BankAccountId = draftBankAccountId;
        BankAccountName = IdAndTitle(draftBankAccountId, draftBankAccountNo);
    }

    public long TreasuryDraftId { get; set; }
    public int DraftFundTypeid { get; set; }
    public string DraftFundTypeName { get; set; }
    public int DraftCurrentInout { get; set; }
    public long DraftBankId { get; set; }
    public string DraftBankName { get; set; }
    public int DraftBankAccountId { get; set; }
    public string DraftBankAccountName { get; set; }
    public string DraftDocumentNo { get; set; }
    public int DraftCurrencyId { get; set; }
    public string DraftCurrencyName { get; set; }
    public decimal DraftAmountLcy { get; set; }
    public decimal DraftAmountFcy { get; set; }
    public int DraftCreateUserId { get; set; }
    public string DraftCreateUserFullName { get; set; }
    public DateTime DraftCreateDateTime { get; set; }
}

public class TreasuryLineDifference
{
    public byte CurrentInOut { get; set; }
    public decimal Amount { get; set; }
}

public class GetActionByWorkflow
{
    public long Id { get; set; }
    public byte ActionId { get; set; }
    public int WorkflowId { get; set; }
}

public class RequestActionDetail
{
    public short StageId { get; set; }
    public byte ActionId { get; set; }
    public int IsDataEntry { get; set; }
    public bool IsTreasurySubject { get; set; }
    public bool IsRequest { get; set; }
    public bool IsDeleteHeader { get; set; }
    public bool IsLastConfirmHeader { get; set; }
    public bool IsQuantityPurchase { get; set; }
    public bool IsQuantitySales { get; set; }
    public bool IsQuantityWarehouse { get; set; }
    public bool PreviousStageActionId { get; set; }
}

public class TreasuryRequestViewModel
{
    public int RequestId { get; set; }
    public int ParentWorkflowCategoryId { get; set; }
}