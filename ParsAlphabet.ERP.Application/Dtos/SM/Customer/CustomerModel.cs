using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.SM.Customer;

[DisplayName("Customer")]
public class CustomerModel : CompanyViewModel
{
    public int Id { get; set; }
    public short? GroupId { get; set; }
    public byte? IndustryId { get; set; }
    public short PersonGroupId { get; set; }
    public bool? VATInclude { get; set; }
    public byte VATAreaId { get; set; }
    public bool? VATEnable { get; set; }

    [Display(Name = "کد اقتصادی")]
    [StringLength(11, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string TaxCode { get; set; }

    public bool? IsActive { get; set; }

    //[Display(Name = "نام ")]
    //[StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string FullName { get; set; }

    [Display(Name = "نام جستجو")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string SearchName { get; set; }

    [Display(Name = "نوع شخصیت")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public byte PartnerTypeId { get; set; }

    //[Display(Name = "جنسیت")]
    //[Required(ErrorMessage = "{0} را وارد کنید")]
    public byte? GenderId { get; set; }

    //[Display(Name = "نمبر تذکره")]
    //[IRNationalCode(ErrorMessage = "{0} معتبر نمی باشد")]
    public string NationalCode { get; set; }

    [Display(Name = "کشور")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, short.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]

    public short LocCountryId { get; set; }

    public short? LocStateId { get; set; }
    public short? LocCityId { get; set; }

    [Display(Name = "نمبر خانه (Postal Code)")]
    [RegularExpression(@"^\b(?!(\d)\1{3})[13-9]{4}[1346-9][013-9]{5}\b$",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string PostalCode { get; set; }

    [Display(Name = "آدرس ")]
    [StringLength(100, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد ")]
    public string Address { get; set; }

    [Display(Name = "عنوان شغلی")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string JobTitle { get; set; }


    [Display(Name = "شماره تلفن ")]
    [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string PhoneNo { get; set; }

    [Display(Name = "شماره موبایل")]
    [RegularExpression(@"09(0[1-3]|1[0-9]|3[0-9]|2[0-1])-?[0-9]{3}-?[0-9]{4}(\[\?%&=]*)?",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string MobileNo { get; set; }

    [Display(Name = "ایمیل")]
    [RegularExpression(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string Email { get; set; }

    [Display(Name = "آدرس وب سایت")]
    [RegularExpression(@"^(http|http(s)?://)?([\w-]+\.)+[\w-]+[.com|.in|.org]+(\[\?%&=]*)?",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string WebSite { get; set; }

    public string IdNumber { get; set; }
    public DateTime? IdDate { get; set; }

    public string IdDatePersian
    {
        set
        {
            var str = value.ToMiladiDateTime();

            IdDate = str == null ? null : str.Value;
        }
    }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";
}