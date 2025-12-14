using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.MC.Attender_Assistant;

public class Attender_AssistantModel : CompanyViewModel
{
    [Display(Name = "معالح")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public int AttenderId { get; set; }

    public int UserId { get; set; }
    public bool IsActive { get; set; }
}