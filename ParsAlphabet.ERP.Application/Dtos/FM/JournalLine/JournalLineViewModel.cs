namespace ParsAlphabet.ERP.Application.Dtos.FM.JournalLine;

public class JournalLineGetPage
{
    public int Id { get; set; }
    public string BranchName { get; set; }
    public short DocumentNo { get; set; }
    public string DocumentTypeName { get; set; }
    public string HeaderDocumentDatePersian { get; set; }
    public string CreateUserFullName { get; set; }
    public bool BySystem { get; set; }
    public string BySystemName => BySystem ? "بلی" : "خیر";
    public byte Status { get; set; }
    public string StatusName { get; set; }
    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);
    public MyResultPage<List<JournalLines>> JsonJournalLineList { get; set; }
    public string JsonJournalLine { get; internal set; }
    public short BranchId { get; set; }
    public short StageId { get; set; }
    public byte DocumentTypeId { get; set; }
    public DateTime? DocumentDate { get; set; }
    public byte CurrencyId { get; set; }
    public int HeaderId { get; set; }
    public int RowNumber { get; set; }
    public int AccountGLId { get; set; }
    public string AccountGLName { get; set; }

    public string AccountGL => IdAndTitle(AccountGLId, AccountGLName);


    public int AccountSGLId { get; set; }
    public string AccountSGLName { get; set; }

    public string AccountSG => IdAndTitle(AccountSGLId, AccountSGLName);


    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }

    public string AccountDetail => IdAndTitle(AccountDetailId, AccountDetailName);

    public decimal Amount { get; set; }
    public int ExchangeRate { get; set; }
    public byte NatureTypeId { get; set; }
    public string NatureTypeName => NatureTypeId == 1 ? "1 - بدهکار" : "2 - بستانکار";
    public int CreateUserId { get; set; }
    public int JournalLineTotalRecord { get; set; }
}

public class JournalLineGetRecord
{
    public int HeaderId { get; set; }
    public short StageId { get; set; }
    public byte CurrencyId { get; set; }
    public byte CurrencyName => CurrencyId;
    public int RowNumber { get; set; }
    public int AccountGLId { get; set; }
    public int AccountSGLId { get; set; }
    public short NoSeriesId { get; set; }
    public int AccountDetailId { get; set; }
    public byte CostObjectId { get; set; }
    public short CostCategoryId { get; set; }
    public int CostDriverId { get; set; }
    public string Description { get; set; }
    public decimal Amount { get; set; }
    public decimal ExchangeRate { get; set; }
    public byte NatureTypeId { get; set; }
    public int CreateUserId { get; set; }
    public decimal AmountDebit { get; set; }
    public decimal AmountCredit { get; set; }

    public DateTime? CreateDateTime { get; set; } = DateTime.Now;
    public DateTime? ModifiedDateTime { get; set; }
    public string ModifiedDateTimePersian => ModifiedDateTime.ToPersianDateStringNull("{0}/{1}/{2}");
    public int ModifiedUserId { get; set; }
}

public class JournalLines
{
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public short StageId { get; set; }
    public byte CurrencyId { get; set; }
    public string CurrencyName { get; set; }
    public string Currency => $"{CurrencyId} - {CurrencyName}";
    public int RowNumber { get; set; }
    public int AccountGLId { get; set; }
    public string AccountGLName { get; set; }
    public int AccountSGLId { get; set; }
    public string AccountSGLName { get; set; }
    public int AccountDetailId { get; set; }
    public string AccountDetailName { get; set; }
    public byte NatureTypeId { get; set; }
    public string NatureTypeName { get; set; }
    public int CreateUserId { get; set; }
    public string CreateUserName { get; set; }
    public decimal Amount { get; set; }
    public decimal AmountDebit { get; set; }
    public decimal AmountCredit { get; set; }
    public string Description { get; set; }
    public string IdNumber { get; set; }
    public string Brand { get; set; }
    public string AgentFullName { get; set; }
    public string NoSeriesName { get; set; }
    public short NoSeriesId { get; set; }
    public int ExchangeRate { get; set; }
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2}");
    public string VatIncludeCu { get; set; }
}

public class JournalLineSum
{
    public decimal AmountDebit { get; set; }
    public decimal AmountCredit { get; set; }
    public long ExchangeRate { get; set; }
    public decimal Amount { get; set; }
}

public class GetJournalLine
{
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public short StageId { get; set; }
    public int WorkflowId { get; set; }
    public byte CurrencyId { get; set; }
    public byte FundTypeId { get; set; }
    public bool IsDefaultCurrency { get; set; }
}

public class GetAccountDetail
{
    public int AccountGLId { get; set; }
    public int AccountSGLId { get; set; }
    public int AccountDetailId { get; set; }
}

public class JournalLineFooter
{
    public string AccountGLName { get; set; }
    public string AccountSGLName { get; set; }
    public string AccountDetailName { get; set; }
    public string AgentFullName { get; set; }
    public string Brand { get; set; }
    public string NationalCode { get; set; }
    public string JobTitle { get; set; }
    public string AccountCategoryName { get; set; }
    public string UserFullName { get; set; }
    public string CreateDateTimePersian { get; set; }
    public string CostDriverName { get; set; }
    public bool VatEnable { get; set; }
    public string VatEnableStr => VatEnable ? "دارد" : "ندارد";
    public bool VatInclude { get; set; }
    public string VatIncludeStr => VatInclude ? "می باشد" : "نمی باشد";
    public string NoSeriesName { get; set; }
    public string IdNumber { get; set; }
}

public class GetJournalPostGroup
{
    public DateTime? FromDate => FromDatePersian.ToMiladiDateTime();
    public string FromDatePersian { get; set; }

    public DateTime? ToDate => ToDatePersian.ToMiladiDateTime();
    public string ToDatePersian { get; set; }

    public int IdentityId { get; set; }
    public short StageId { get; set; }
    public int UserId { get; set; }
}

public class GetJournalLineSum
{
    public decimal Amount { get; set; }
    public byte NatureTypeId { get; set; }
}