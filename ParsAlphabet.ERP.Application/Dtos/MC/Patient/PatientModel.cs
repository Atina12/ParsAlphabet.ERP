using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.MC.Patient;

[DisplayName("Patient")]
public class PatientModel : CompanyViewModel
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

    public int? CountryId { get; set; }

    [Display(Name = "جنسیت")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public int GenderId { get; set; }

    public string NationalCode { get; set; }

    [Display(Name = "شماره موبایل")] public string MobileNo { get; set; }

    [Display(Name = "شماره تلفن ")] public string PhoneNo { get; set; }

    public DateTime? BirthDate { get; set; }

    [NotMapped]
    public string BirthDatePersian
    {
        get => BirthDate.ToPersianDateStringNull("{0}/{1}/{2}");
        set
        {
            var str = value.ToMiladiDateTime();
            BirthDate = str == null ? null : str.Value;
        }
    }

    public string FatherFirstName { get; set; }

    public byte MaritalStatusId { get; set; }
    public byte EducationLevelId { get; set; }
    public string JobTitle { get; set; }
    public string PostalCode { get; set; }
    public string IdCardNumber { get; set; }
    public string Address { get; set; }
    public bool IsActive { get; set; }


    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";

    public string JsonAccountDetailList { get; set; }
}