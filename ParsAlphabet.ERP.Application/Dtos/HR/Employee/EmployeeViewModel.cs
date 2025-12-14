using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

//using ExpressiveAnnotations.Attributes;


namespace ParsAlphabet.ERP.Application.Dtos.HR.Employee;

public class EmployeeGetPage
{
    public int Id { get; set; }

    //public string PersonGroupName { get; set; }
    public string MaritalStatusName { get; set; }
    public string FatherFirstName { get; set; }
    public string Gender { get; set; }
    public string FullName { get; set; }
    public string NationalCode { get; set; }
    public string MobileNo { get; set; }
    public string InsurNo { get; set; }
    public string InsurerName { get; set; }
    public bool IsActive { get; set; }
    public int DetailId { get; set; }
    public int EmployeeGroupId { get; set; }
    public string EmployeeGroupName { get; set; }
    public string EmployeeGroup => EmployeeGroupId == 0 ? "" : $"{EmployeeGroupId} - {EmployeeGroupName}";

    public bool IsDetail => DetailId != 0;
}

public class EmployeeGetRecord
{
    public int Id { get; set; }

    public byte MaritalStatusId { get; set; }

    //public int UserId { get; set; }
    //public byte PersonGroupId { get; set; }
    public string FatherFirstName { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string FullName { get; set; }
    public byte GenderId { get; set; }
    public string NationalCode { get; set; }
    public short? LocCountryId { get; set; }
    public short? LocStateId { get; set; }
    public short? LocCityId { get; set; }
    public string PostalCode { get; set; }
    public string Address { get; set; }
    public string PhoneNo { get; set; }
    public string MobileNo { get; set; }
    public string Email { get; set; }
    public string InsurNo { get; set; }
    public int InsurerId { get; set; }
    public short PersonGroupId { get; set; }

    public DateTime? IdDate { get; set; }
    public string IdDatePersian => IdDate.ToPersianDateStringNull("{0}/{1}/{2}");
    public bool IsActive { get; set; }
}

public class EmployeeGetRecordForm
{
    public int Id { get; set; }
    public byte MaritalStatusIdEm { get; set; }
    public string FirstNameEm { get; set; }
    public string FatherFirstNameEm { get; set; }
    public string LastNameEm { get; set; }
    public string FullNameEm => $"{FirstNameEm} {LastNameEm}";
    public string AgentFullNameEm { get; set; }
    public byte GenderIdEm { get; set; }
    public string NationalCodeEm { get; set; }
    public short? LocCountryIdEm { get; set; }
    public short? LocStateIdEm { get; set; }
    public short? LocCityIdEm { get; set; }
    public string PostalCodeEm { get; set; }
    public string AddressEm { get; set; }
    public string PhoneNoEm { get; set; }
    public string MobileNoEm { get; set; }
    public string EmailEm { get; set; }
    public string InsurNoEm { get; set; }
    public int? InsurerIdEm { get; set; }
    public short PersonGroupId { get; set; }
    public DateTime? IdDateEm { get; set; }
    public string IdDatePersianEm => IdDateEm.ToPersianDateStringNull("{0}/{1}/{2}");
    public bool IsActiveEm { get; set; }
    public string JsonAccountDetailList { get; set; }
}

[DisplayName("Employee")]
public class SaveEmployee : CompanyViewModel
{
    public int Id { get; set; }
    public byte MaritalStatusIdEm { get; set; }

    public string FatherFirstNameEm { get; set; }

    [Display(Name = "نام")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string FirstNameEm { get; set; }

    [Display(Name = " تخلص")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string LastNameEm { get; set; }

    public string FullNameEm { get; set; }

    [Display(Name = "جنسیت")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public byte GenderIdEm { get; set; }

    [Display(Name = "نمبر تذکره")]
    [AfghanTazkira(ErrorMessage = "{0} معتبر نمی باشد")]
    public string NationalCodeEm { get; set; }

    public short? LocCountryIdEm { get; set; }
    public short? LocStateIdEm { get; set; }
    public short? LocCityIdEm { get; set; }

    [Display(Name = "نمبر خانه (Postal Code)")]
    [RegularExpression(@"\b(?!(\d)\1{3})[13-9]{4}[1346-9][013-9]{5}\b",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]

    public string PostalCodeEm { get; set; }

    public string AddressEm { get; set; }

    [Display(Name = "شماره تلفن ")]
    [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string PhoneNoEm { get; set; }

    [Display(Name = "شماره موبایل")]
    [RegularExpression(@"09(0[1-2]|1[0-9]|3[0-9]|2[0-1])-?[0-9]{3}-?[0-9]{4}",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string MobileNoEm { get; set; }

    [Display(Name = "ایمیل")]
    [RegularExpression(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string EmailEm { get; set; }

    public DateTime? IdDateEm { get; set; }

    //[RequiredIf("InsurerId!=null",ErrorMessage = "شماره بیمه را وارد نمایید")]
    public string InsurNoEm { get; set; }

    public int? InsurerIdEm { get; set; }
    public short PersonGroupId { get; set; }

    public string IdDatePersianEm
    {
        set
        {
            var str = value.ToMiladiDateTime();

            IdDateEm = str == null ? null : str.Value;
        }
    }

    public bool IsActiveEm { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";
}