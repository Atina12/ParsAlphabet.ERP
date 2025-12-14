using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionCounter;

[DisplayName("AdmissionCounter")]
public class AdmissionCounterModel : CompanyViewModel
{
    public int Id { get; set; }

    public byte CounterTypeId { get; set; }
    public bool IsActive { get; set; }
    public int? CashierId { get; set; }

    [Display(Name = "کاربر غرفه")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public int CounterUserId { get; set; }

    public short BranchId { get; set; }
}