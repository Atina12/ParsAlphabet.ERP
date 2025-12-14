using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.FM.TreasuryRequestLine;

public class TreasuryRequestLineModel : CompanyViewModel
{
    public int Id { get; set; }
    public int TreasuryId { get; set; }
    public int HeaderId { get; set; }
    public short StageId { get; set; }
    public byte? CurrencyId { get; set; }
    public short RowNumber { get; set; }

    [Display(Name = "نوع گردش")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    [Range(1, byte.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public byte InOut { get; set; }

    [Display(Name = "نوع وجه")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    [Range(1, byte.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public byte FundTypeId { get; set; }

    [Display(Name = "نام بانک")] public short? BankId { get; set; }

    [Display(Name = "حساب")] public int? BankAccountId { get; set; }

    [Display(Name = "شماره شناسه")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    public long TransitNo { get; set; }

    [Display(Name = "شماره سند")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    public long DocumentNo { get; set; }

    public int CreateUserId { get; set; }
    public DateTime? CreateDateTime { get; set; } = DateTime.Now;

    public decimal Amount { get; set; }
    public decimal? ExchangeRate { get; set; }

    public decimal? AmountExchange { get; set; }
    public int? TreasuryDetailId { get; set; }
    public short? BondBranchNo { get; set; }
    public string BondBranchName { get; set; }
    public long BondSerialNo { get; set; }
    public string BondIssuer { get; set; }
    public string BankAccountIssuer { get; set; }

    public int AccountGLId { get; set; }
    public int AccountSGLId { get; set; }
    public int AccountDetailId { get; set; }
    public int? AccountDetailTreasuryId { get; set; }
    public int ParentId { get; set; }
    public int Step { get; set; }
    public string SayadNumber { get; set; }
    public long CheckSerial { get; set; }
    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string BondDueDatePersian { get; set; }
    public DateTime? BondDueDate => BondDueDatePersian.ToMiladiDateTime();
    public string CheckIssuer { get; set; }
    public long BankIssuerId { get; set; }
    public int LastStage { get; set; }
    public long Actionid { get; set; }


    public int WorkflowId { get; set; }
}

public class PreviousStageTreasuryRequestLineModel
{
    public int Id { get; set; }
    public short StageId { get; set; }
    public int HeaderId { get; set; }
    public byte? CurrencyId { get; set; }
    public byte InOut { get; set; }
    public byte FundTypeId { get; set; }
    public int? BankAccountId { get; set; }
    public long? TransitNo { get; set; }
    public int? DocumentNo { get; set; }
    public decimal Amount { get; set; }
    public decimal? AmountExchange { get; set; }
    public int CompanyId { get; set; }
    public int ExchangeRate { get; set; }
    public short? BankId { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime { get; set; }
    public int? TreasuryDetailId { get; set; }
    public short? BondBranchNo { get; set; }
    public string BondBranchName { get; set; }
    public string BondSerialNo { get; set; }
    public DateTime? BondDueDate { get; set; }
    public string BondDueDatePersian => BondDueDate.ToPersianDateStringNull("{0}/{1}/{2}");
    public string BondIssuer { get; set; }
    public short? BankIssuerId { get; set; }
    public string BankAccountIssuer { get; set; }
}