using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.FM.Journal;

[DisplayName("Journal")]
public class JournalModel : CompanyViewModel
{
    public int Id { get; set; }

    [Display(Name = "شعبه")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, short.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public short BranchId { get; set; }

    public short StageId { get; set; }

    public short? DocumentNo { get; set; }

    [Display(Name = "نوع سند")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    [Range(1, byte.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public byte DocumentTypeId { get; set; }

    public DateTime DocumentDate { get; set; }

    public string DocumentDatePersian
    {
        set
        {
            var str = value.ToMiladiDateTime();
            DocumentDate = str.Value;
        }
    }


    public DateTime? CreateDateTime { get; set; } = DateTime.Now;

    public int CreateUserId { get; set; }

    public short? ModifiedUserId { get; set; }

    public DateTime? ModifiedDateTime { get; set; } = DateTime.Now;

    public bool BySystem { get; set; } = false;
    public byte Status { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";

    public int WorkflowId { get; set; }
}

public class UpdateJournalInline : CompanyViewModel
{
    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";

    public int Id { get; set; }
    public short? DocumentNo { get; set; }

    [Display(Name = "نوع سند")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    [Range(1, byte.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public byte DocumentTypeId { get; set; }

    public DateTime DocumentDate { get; set; }

    public string HeaderDocumentDatePersian
    {
        set
        {
            var str = value.ToMiladiDateTime();
            DocumentDate = str.Value;
        }
    }

    public short? ModifiedUserId { get; set; }

    public DateTime? ModifiedDateTime { get; set; } = DateTime.Now;
    public byte? ActionId { get; set; }

    public short WorkflowId { get; set; }
}