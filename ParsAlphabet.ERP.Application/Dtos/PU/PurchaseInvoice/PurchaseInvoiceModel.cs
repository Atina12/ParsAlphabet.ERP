using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.PU.PurchaseInvoice;

public class PurchaseInvoiceModel : CompanyViewModel
{
    public int Id { get; set; }
    public int InvoiceId { get; set; }

    [Display(Name = "نوع صورت حساب")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public byte InvoiceTypeId { get; set; }

    public short BranchId { get; set; }
    public byte? CurrencyId { get; set; }
    public DateTime InvoiceDate { get; set; }

    public string InvoiceDatePersian
    {
        set
        {
            var str = value.ToMiladiDateTime();

            InvoiceDate = str.Value;
        }
    }

    public byte? PersonTypeId { get; set; }
    public int? PersonId { get; set; }
    public int? EmployeeId { get; set; }
    public byte? ReturnReasonId { get; set; }

    [Display(Name = "توضیحات")]
    [StringLength(1000, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Note { get; set; }

    public DateTime CreateDateTime => DateTime.Now;
    public int UserId { get; set; }
    public byte Status { get; set; }
    public object PersonOrderRelationshipList { get; set; }

    public short StageId { get; set; }
    public long? TreasurySubjectId { get; set; }
    public int? OrderNo { get; set; }
    public byte? PersonGroupTypeId { get; set; }
    public bool IsOrderQuantity { get; set; }

    public DateTime OrderDate { get; set; }

    public string OrderDatePersian
    {
        set
        {
            var str = value.ToMiladiDateTime();

            OrderDate = str.Value;
        }
    }

    public byte ActionId { get; set; }
    public int? DocumentTypeId { get; set; }
    public int? AccountGLId { get; set; }
    public int? AccountSGLId { get; set; }
    public short? NoSeriesId { get; set; }
    public int? AccountDetailId { get; set; }
    public long? RequestId { get; set; }
    public byte InOut { get; set; }
    public int WorkflowId { get; set; }
    public int ParentWorkflowCategoryId { get; set; }
}

public class PurchaseInvoiceResultStatus : MyResultStatus
{
    public int Output { get; set; }
}