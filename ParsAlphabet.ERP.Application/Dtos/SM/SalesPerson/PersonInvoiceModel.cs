using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.SM.SalesPerson;

public class PersonInvoiceModel : CompanyViewModel
{
    public int Id { get; set; }
    public int InvoiceId { get; set; }

    [Display(Name = "نوع صورت حساب")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public byte InvoiceTypeId { get; set; }

    public short BranchId { get; set; }

    //public int OrderNo { get; set; }
    public byte? CurrencyId { get; set; }
    public DateTime? InvoiceDate { get; set; }

    public string InvoiceDatePersian
    {
        set
        {
            var str = value.ToMiladiDateTime();

            InvoiceDate = str == null ? null : str.Value;
        }
    }

    public byte? PersonTypeId { get; set; }
    public int? PersonId { get; set; }
    public int? EmployeeId { get; set; }
    public byte? ReturnReasonId { get; set; }

    [Display(Name = "توضیحات")]
    [StringLength(1000, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Note { get; set; }

    public DateTime CreateDateTime { get; set; }
    public int UserId { get; set; }
    public byte Status { get; set; }
    public bool OfficialInvoice { get; set; }
}