using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.FM.TreasuryRequest;

public class TreasuryRequestModel : CompanyViewModel
{
    [Display(Name = "شعبه")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, short.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public short BranchId { get; set; }

    public int No { get; set; }
    public long? Id { get; set; }
    public int? TreasurySubjectId { get; set; }
    public byte? DocumentTypeId { get; set; }
    public long? CreateUserId { get; set; }
    public string Note { get; set; }
    public int WorkflowId { get; set; } = 0;
    public bool CreateBySystem { get; set; }

    [Display(Name = "شناسه مرحله")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, int.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public short StageId { get; set; }

    public int? AccountGLId { get; set; }
    public long? AccountSGLId { get; set; }
    public int? AccountDetailId { get; set; }
    public short? NoSeriesId { get; set; }
    public int CurrentInout { get; set; }
    public DateTime TransactionDate { get; set; }
    public DateTime TreasuryDate { get; set; }
    public byte? ActionId { get; set; }

    [Display(Name = "تاریخ برگه")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public string TransactionDatePersian
    {
        set
        {
            var str = value.ToMiladiDateTime();

            TreasuryDate = (DateTime)(str == null ? (DateTime?)null : str.Value);
        }
    }

    [Display(Name = "تاریخ برگه")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public string HeaderTransactionDatePersian
    {
        set
        {
            var str = value.ToMiladiDateTime();

            TransactionDate = (DateTime)(str == null ? (DateTime?)null : str.Value);
        }
    }


    //----------------UpdateViewModel---------------------------
    public long JournalId { get; set; }
    public long ParentId { get; set; }
    public long RequestId { get; set; }
    public DateTime? CreateDatetime { get; set; }
    public int ParentWorkflowCategoryId { get; set; }
}

public class TreasuryRequestModelUpdateInline : CompanyViewModel
{
    public long Id { get; set; }
    public int TreasurySubjectId { get; set; }
    public int CreateUserId { get; set; }
    public DateTime TreasuryDate => HeaderTransactionDatePersian.ToMiladiDateTime().Value;

    [Display(Name = "تاریخ برگه")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public string HeaderTransactionDatePersian { get; set; }

    public int AccountDetailId { get; set; }
    public long NoSeriesId { get; set; }
    public string Note { get; set; }
}