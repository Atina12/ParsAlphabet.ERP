using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.HR.Employee;

[DisplayName("Employee")]
public class EmployeeModel : CompanyViewModel
{
    public int Id { get; set; }
    public byte MaritalStatusId { get; set; }

    [Display(Name = "نام")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string FirstName { get; set; }

    [Display(Name = " تخلص")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string LastName { get; set; }

    public string FullName { get; set; }

    [Display(Name = "نام جستجو")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string SearchName { get; set; }

    [Display(Name = "جنسیت")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public byte GenderId { get; set; }

    [Display(Name = "نمبر تذکره")]
    [AfghanTazkira(ErrorMessage = "{0} معتبر نمی باشد")]
    public string NationalCode { get; set; }

    public short? LocCountryId { get; set; }
    public short? LocStateId { get; set; }
    public short? LocCityId { get; set; }

    [Display(Name = "نمبر خانه (Postal Code)")]
    [RegularExpression(@"\b(?!(\d)\1{3})[13-9]{4}[1346-9][013-9]{5}\b",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string PostalCode { get; set; }

    public string Address { get; set; }

    [Display(Name = "شماره تلفن ")]
    [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string PhoneNo { get; set; }

    [Display(Name = "شماره موبایل")]
    [RegularExpression(@"09(0[1-2]|1[0-9]|3[0-9]|2[0-1])-?[0-9]{3}-?[0-9]{4}",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string MobileNo { get; set; }

    [Display(Name = "ایمیل")]
    [RegularExpression(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string Email { get; set; }

    public string InsurNo { get; set; }
    public DateTime? IdDate { get; set; }

    public string IdDatePersian
    {
        set
        {
            var str = value.ToMiladiDateTime();

            IdDate = str == null ? null : str.Value;
        }
    }

    public bool IsActive { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";
}