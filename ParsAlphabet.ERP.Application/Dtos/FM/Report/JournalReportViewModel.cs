using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.FM.Report;

public class GetJournalSearchReport : PaginationReport
{
    public short? BranchId { get; set; }
    public byte? DocumentTypeId { get; set; }
    public byte? CurrencyId { get; set; }
    public byte? ActionId { get; set; }

    public int? CreateUserId { get; set; }
    public string Description { get; set; }
    public int? FromAccountGLId { get; set; }
    public int? ToAccountGLId { get; set; }
    public int? FromAccountSGLId { get; set; }
    public int? ToAccountSGLId { get; set; }
    public int? FromAccountDetailId { get; set; }
    public int? ToAccountDetailId { get; set; }
    public byte? FromCostObjectId { get; set; }
    public byte? ToCostObjectId { get; set; }
    public int? FromDocumentNo { get; set; }
    public int? ToDocumentNo { get; set; }
    public int? FromJournalId { get; set; }
    public int? ToJournalId { get; set; }
    public long? FromAmountDebit { get; set; }
    public long? ToAmountDebit { get; set; }
    public long? FromAmountCredit { get; set; }
    public long? ToAmountCredit { get; set; }
    public int? BySystem { get; set; }
    public string FromDocumentDatePersian { get; set; }
    public DateTime FromDocumentDate => FromDocumentDatePersian.ToMiladiDateTime().Value;
    public string ToDocumentDatePersian { get; set; }
    public DateTime ToDocumentDate => ToDocumentDatePersian.ToMiladiDateTime().Value;

    [NotMapped] public byte RoleId { get; set; }
}

public class GetJournalHeaderTreeViewModel
{
    public GetJournalHeaderTreeViewModel()
    {
        Children = new List<GetJournalHeaderTreeViewModel>();
    }

    public int Id { get; set; }
    public string Name { get; set; }
    public List<GetJournalHeaderTreeViewModel> Children { get; set; }
    public int Level { get; set; }
    public int ChildCount { get; set; }
}

public class GetJournaltrialSearchReport : PaginationReport
{
    public short? BranchId { get; set; }
    public byte? DocumentTypeId { get; set; }
    public byte? CurrencyId { get; set; }
    public byte? ActionId { get; set; }
    public int? CreateUserId { get; set; }
    public byte ColumnType { get; set; }

    [NotMapped] public ReportType ReportType { get; set; }

    [NotMapped] public MainReportType MainReportType { get; set; }

    [NotMapped] public long AffectedDebitSum { get; set; }

    [NotMapped] public long AffectedCreditSum { get; set; }

    [NotMapped] public long AffectedRemainingSum { get; set; }

    public DateTime? FromDocumentDate { get; set; }
    public DateTime? ToDocumentDate { get; set; }

    public DateTime? FromDocumentDate1 { get; set; }
    public DateTime? ToDocumentDate1 { get; set; }

    public int? FromJournalId { get; set; }
    public int? ToJournalId { get; set; }
    public int? FromDocumentNo { get; set; }
    public int? ToDocumentNo { get; set; }
    public int? FromAccountGLId { get; set; }
    public int? ToAccountGLId { get; set; }
    public int? FromAccountSGLId { get; set; }
    public int? ToAccountSGLId { get; set; }
    public int? FromAccountDetailId { get; set; }
    public int? ToAccountDetailId { get; set; }
    public byte OpeningJournal { get; set; }
    public byte EndingJournal { get; set; }
    public byte TemporaryJournal { get; set; }

    public string TrialBalanceType =>
        Convert.ToByte(ReportType)
            .ToString(); // MainReportType == MainReportType.Note ? "14" : string.Concat(Convert.ToByte(MainReportType).ToString(), Convert.ToByte(ReportType).ToString());

    public byte RoleId { get; set; }
}

public class GetNewsPaperAccountDetailReport : CompanyViewModel
{
    public short? BranchId { get; set; }
    public byte? DocumentTypeId { get; set; }
    public byte? CurrencyId { get; set; }
    public short? Status { get; set; }
    public int? CreateUserId { get; set; }
    public byte ColumnType { get; set; }

    [NotMapped] public ReportType ReportType { get; set; }

    [NotMapped] public MainReportType MainReportType { get; set; }

    public DateTime? FromDocumentDate { get; set; }
    public DateTime? ToDocumentDate { get; set; }
    public int? FromJournalId { get; set; }
    public int? ToJournalId { get; set; }
    public int? FromDocumentNo { get; set; }
    public int? ToDocumentNo { get; set; }
    public int? FromAccountGLId { get; set; }
    public int? ToAccountGLId { get; set; }
    public int? FromAccountSGLId { get; set; }
    public int? ToAccountSGLId { get; set; }
    public int? FromAccountDetailId { get; set; }
    public int? ToAccountDetailId { get; set; }
    public byte OpeningJournal { get; set; }
    public byte EndingJournal { get; set; }
    public byte TemporaryJournal { get; set; }
}

public class GetJournalTreeReport : CompanyViewModel
{
    public short? BranchId { get; set; }
    public byte? DocumentTypeId { get; set; }
    public byte? CurrencyId { get; set; }
    public byte? ActionId { get; set; }
    public int? CreateUserId { get; set; }

    [NotMapped] public ReportType ReportType { get; set; }

    [NotMapped] public MainReportType MainReportType { get; set; }

    public DateTime? FromDocumentDate { get; set; }
    public DateTime? ToDocumentDate { get; set; }
    public int? FromJournalId { get; set; }
    public int? ToJournalId { get; set; }
    public int? FromDocumentNo { get; set; }
    public int? ToDocumentNo { get; set; }
    public int? FromAccountGLId { get; set; }
    public int? ToAccountGLId { get; set; }
    public int? FromAccountSGLId { get; set; }
    public int? ToAccountSGLId { get; set; }
    public int? FromAccountDetailId { get; set; }
    public int? ToAccountDetailId { get; set; }
    public bool OpeningJournal { get; set; }
    public bool EndingJournal { get; set; }
    public bool TemporaryJournal { get; set; }
}

public class JournalDetailReport
{
    public long NewAmountRemaining;

    public int AccountGLId { get; set; }
    public string AccountGLName { get; set; }
    public string AccountGL => IdAndTitle(AccountGLId, AccountGLName);

    public int AccountSGLId { get; set; }
    public string AccountSGLName { get; set; }
    public string AccountSGL => IdAndTitle(AccountSGLId, AccountSGLName);

    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }
    public string AccountDetail => IdAndTitle(AccountDetailId, AccountDetailName);

    public byte CurrencyId { get; set; }
    public string CurrencyName { get; set; }
    public string CurrencyIdName => IdAndTitle(CurrencyId, CurrencyName);
    public long AmountDebit { get; set; }
    public long AmountCredit { get; set; }
    public long AmountDebitOpening { get; set; }
    public long AmountCreditOpening { get; set; }
    public long AmountRemaining { get; set; }

    public string NoSeriesName { get; set; }
    public long NoSeriesId { get; set; }
    public string NoSeries => IdAndTitle(NoSeriesId, NoSeriesName);

    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => $"{ActionId} - {ActionName}";
    public string DocumentDatePersian { get; set; }

    public int journalId { get; set; }
    public string Description { get; set; }
    public string DocumentNo { get; set; }

    public string JournalNature { get; set; }

    public long DebitRemaining { get; set; }
    public long CreditRemaining { get; set; }
}

public class JournalSearchReport
{
    public int JournalId { get; set; }
    public string DocumentDatePersian { get; set; }
    public short DocumentNo { get; set; }
    public int AccountGLId { get; set; }
    public string AccountGLName { get; set; }
    public string AccountGL => IdAndTitle(AccountGLId, AccountGLName);

    public int AccountSGLId { get; set; }
    public string AccountSGLName { get; set; }
    public string AccountSGL => IdAndTitle(AccountSGLId, AccountSGLName);


    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }
    public string AccountDetail => IdAndTitle(AccountDetailId, AccountDetailName);

    public string Description { get; set; }
    public long ExchangeRate { get; set; }
    public byte CurrencyId { get; set; }
    public string CurrencyName { get; set; }
    public string Currency => IdAndTitle(CurrencyId, CurrencyName);


    public long AmountDebit { get; set; }
    public long AmountCredit { get; set; }
    public byte DocumentTypeId { get; set; }
    public string DocumentTypeName { get; set; }
    public string DocumentType => IdAndTitle(DocumentTypeId, DocumentTypeName);

    public int CreateUserId { get; set; }
    public string CreateUserName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserName);


    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();
    public bool BySystem { get; set; }
    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);
}

public class JournalSearchReportSum
{
    public long ExchangeRate { get; set; }
    public long AmountDebit { get; set; }
    public long AmountCredit { get; set; }

    public long DebitRemaining { get; set; }
    public long CreditRemaining { get; set; }

    public long AmountDebitOpening { get; set; }
    public long AmountCreditOpening { get; set; }
    public long AmountRemaining { get; set; }
}