using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.SM.CustomerDiscountGroup;

[DisplayName("CustomerDiscountGroup")]
public class CustomerDiscountGroupModel : CompanyViewModel
{
    public int Id { get; set; }

    [Display(Name = "گروه مشتریان")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public short PersonGroupId { get; set; }

    public string Name { get; set; }

    public int? MinQuantity { get; set; }
    public int? MinQuantitySale { get; set; }
    public byte? PriceTypeId { get; set; }
    public decimal? Price { get; set; }
    public DateTime LastModifiedDateTime { get; set; } = DateTime.Now;
    public bool? IsActive { get; set; }
}

public class CustomerDiscountGroupGetRecord
{
    public int Id { get; set; }
    public short? PersonGroupId { get; set; }
    public int MinQuantity { get; set; }
    public int MinQuantitySale { get; set; }
    public byte PriceTypeId { get; set; }
    public decimal Price { get; set; }
    public DateTime LastModifiedDateTime { get; set; } = DateTime.Now;
    public bool IsActive { get; set; }
}