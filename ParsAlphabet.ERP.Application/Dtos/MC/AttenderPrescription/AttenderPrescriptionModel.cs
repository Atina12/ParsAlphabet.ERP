using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.MC.AttenderPrescription;

public class AttenderPrescriptionModel : CompanyViewModel
{
    [Display(Name = "معالح")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public int AttenderId { get; set; }

    public int UserId { get; set; }
    public bool IsActive { get; set; }
}