using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.MC.ServiceItemPricing;

public class ServiceItemPricingModel : CompanyViewModel
{
    public int Id { get; set; }

    public int ItemId { get; set; }

    public byte ItemTypeId { get; set; }

    public byte InsurerTypeId { get; set; }

    public int MedicalSubjectId { get; set; }

    public byte PricingModelId { get; set; }

    [Display(Name = "نرخ شروع")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public decimal BeginPrice { get; set; }

    [Display(Name = "نرخ پایان")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public decimal EndPrice { get; set; }

    public bool IsActive { get; set; }

    public int CreateUserId { get; set; }

    public DateTime CreateDateTime { get; set; } = DateTime.Now;
}