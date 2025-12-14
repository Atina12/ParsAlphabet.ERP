using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.SM.SalesPerson;

public class SalesPersonOrderModel : CompanyViewModel
{
    public int Id { get; set; }

    [Display(Name = "نوع سفارش")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public short StageId { get; set; }

    [Display(Name = "شعبه")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public short BranchId { get; set; }

    [Display(Name = "واحد پول")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    public byte CurrencyId { get; set; }

    public byte? PersonTypeId { get; set; }

    public int? PersonId { get; set; }

    public short? EmployeeId { get; set; }
    public DateTime? OrderDate { get; set; }

    public string OrderDatePersian
    {
        set
        {
            var str = value.ToMiladiDateTime();

            OrderDate = str == null ? null : str.Value;
        }
    }

    public byte? ReturnReasonId { get; set; }


    [Display(Name = "توضیحات")]
    [StringLength(500, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Note { get; set; }

    public int UserId { get; set; }

    public DateTime CreateDateTime { get; set; } = DateTime.Now;

    public byte Status { get; set; }

    public bool OfficialInvoice { get; set; }
}