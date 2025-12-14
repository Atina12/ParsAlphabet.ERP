using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.MC.Insurer;

public class InsurerModel : CompanyViewModel
{
    public short Id { get; set; }

    [Display(Name = "نام بیمه")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Name { get; set; }

    public byte InsurerTypeId { get; set; }

    //public string InsuranceBoxId { get; set; }
    public bool IsActive { get; set; }
    public string JsonAccountDetailList { get; set; }
}