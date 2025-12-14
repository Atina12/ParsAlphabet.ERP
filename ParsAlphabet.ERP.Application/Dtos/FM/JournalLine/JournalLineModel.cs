using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.FM.JournalLine;

public class JournalLineModel : CompanyViewModel
{
    public int Id { get; set; }

    [Display(Name = "شناسه سند")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, int.MaxValue, ErrorMessage = "مقدار وارد شده برای {0} معتبر نمی باشد")]
    public int HeaderId { get; set; }

    public int RowNumber { get; set; }

    [Display(Name = "حساب کل")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, int.MaxValue, ErrorMessage = "مقدار وارد شده برای {0} معتبر نمی باشد")]
    public int AccountGLId { get; set; }

    [Display(Name = "حساب معین")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, int.MaxValue, ErrorMessage = "مقدار وارد شده برای {0} معتبر نمی باشد")]
    public int AccountSGLId { get; set; }

    public short NoSeriesId { get; set; }
    public int AccountDetailId { get; set; }

    [Display(Name = "شرح سند")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(120, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    [MinLength(1, ErrorMessage = "مقدار وارد شده برای {0} معتبر نمی باشد")]
    public string Description { get; set; }

    public decimal Amount { get; set; }

    public long ExchangeRate { get; set; }

    public byte NatureTypeId { get; set; }

    public int CreateUserId { get; set; }
    public DateTime? CreateDateTime { get; set; } = DateTime.Now;
    public DateTime? ModifiedDateTime { get; set; } = DateTime.Now;
    public int ModifiedUserId { get; set; }
    public int? CurrencyId { get; set; }
    public int? CurrencyName { get; set; }
}

public class JournalLineSingleSave : JournalLineModel
{
    public string Opr => Id == 0 ? "Ins" : "Upd";
    public decimal AmountDebit { get; set; }
    public decimal AmountCredit { get; set; }
}

public class ExcelJournalLineModel
{
    [Display(Name = "شناسه سند")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, int.MaxValue, ErrorMessage = "مقدار وارد شده برای {0} معتبر نمی باشد")]
    public int HeaderId { get; set; }

    public int UserId { get; set; }
    public List<JournalLineSingleSave> JournalLines { get; set; }
}