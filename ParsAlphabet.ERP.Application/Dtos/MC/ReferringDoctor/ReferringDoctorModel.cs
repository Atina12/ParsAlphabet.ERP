using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.MC.ReferringDoctor;

[DisplayName("ReferringDoctor")]
public class ReferringDoctorModel : CompanyViewModel
{
    public int Id { get; set; }

    [Display(Name = "نام")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string FirstName { get; set; }

    [Display(Name = " تخلص")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string LastName { get; set; }

    [Display(Name = "جنسیت")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    [Range(1, byte.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public int? GenderId { get; set; }

    public short? SpecialityId { get; set; }
    public byte RoleId { get; set; }

    [Display(Name = "آدرس")]
    [StringLength(100, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Address { get; set; }

    [Display(Name = "شماره تلفن ")]
    [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string PhoneNo { get; set; }

    [Display(Name = "شماره موبایل")]
    [RegularExpression(@"09(0[1-3]|1[0-9]|3[0-9]|2[0-1])-?[0-9]{3}-?[0-9]{4}",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string MobileNo { get; set; }

    [Display(Name = "شماره نظام پزشکی")]
    [StringLength(10, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string MSC { get; set; }

    [NotMapped] public byte MSC_TypeId { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";

    public short? LocStateId { get; set; }
    public int? LocCityId { get; set; }
    public bool IsActive { get; set; }
}