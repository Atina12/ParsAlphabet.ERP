using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.FM.CostCenterLine;

public class CostCenterLineModel : CompanyViewModel
{
    public short HeaderId { get; set; }

    public byte EntityTypeId { get; set; }

    public short EntityId { get; set; }

    [Display(Name = "موضوع هزینه")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    [Range(1, byte.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public byte CostObjectId { get; set; }

    [Display(Name = "درصد تخصیص")]
    [Percentage(ErrorMessage = "{0} معتبر نمی باشد")]
    public byte AllocationPer { get; set; }
}