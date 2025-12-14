using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.HR.PayrollTaxBracket;

public class PayrollTaxBracketLineModel : CompanyViewModel
{
    public short Id { get; set; }
    public short HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public long StartAmount { get; set; }
    public long EndAmount { get; set; }
    public byte TaxPercentage { get; set; }

    [Display(Name = "تاریخ و زمان ثبت")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [DataType(DataType.DateTime)]
    public DateTime CreateDateTime { get; set; } = DateTime.Now;

    public int CreateUserId { get; set; }
}