using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.CR.Contact;

[DisplayName("Contact")]
public class ContactModel : CompanyViewModel
{
    public int Id { get; set; }
    public short PersonGroupId { get; set; }
    public byte? IndustryId { get; set; }
    public bool? VATInclude { get; set; }

    [Display(Name = "VATمنطقه")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public byte VATAreaId { get; set; }

    public bool? VATEnable { get; set; }

    [Display(Name = "کد اقتصادی")]
    [StringLength(16, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string TaxCode { get; set; }

    public bool? IsActive { get; set; }

    //[Display(Name = "نام")]
    //[Required(ErrorMessage = "{0} را وارد کنید")]
    //[StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string FirstName { get; set; }

    // [Display(Name = " تخلص")]
    // [Required(ErrorMessage = "{0} را وارد کنید")]
    // [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string LastName { get; set; }
    public string AgentFullName { get; set; }
    public string FullName { get; set; }

    [Display(Name = "نام جستجو")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string SearchName { get; set; }

    public byte? PartnerTypeId { get; set; }

    //[Display(Name = "جنسیت")]
    //[Required(ErrorMessage = "{0} را وارد کنید")]
    public byte? GenderId { get; set; }

    [Display(Name = "نمبر تذکره")]
    [AfghanTazkira(ErrorMessage = "{0} معتبر نمی باشد")]
    public string NationalCode { get; set; }

    [Display(Name = "کشور")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, short.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public short LocCountryId { get; set; }

    public short? LocStateId { get; set; }
    public short? LocCityId { get; set; }
    public string BrandName { get; set; }
    public string JobTitle { get; set; }
    public short PersonTitleId { get; set; }

    [Display(Name = "نمبر خانه (Postal Code)")]
    [RegularExpression(@"\b(?!(\d)\1{3})[13-9]{4}[1346-9][013-9]{5}\b",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string PostalCode { get; set; }

    [Display(Name = "آدرس ")]
    [StringLength(100, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد ")]
    public string Address { get; set; }

    [Display(Name = "شماره تلفن ")]
    [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string PhoneNo { get; set; }

    [Display(Name = "شماره موبایل")]
    [RegularExpression(@"09(0[1-3]|1[0-9]|3[0-9]|2[0-1])-?[0-9]{3}-?[0-9]{4}",
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

    // [Display(Name ="شماره")]
    // [StringLength(11, ErrorMessage = "حداکثر {1} رقم وارد کنید")]
    public string IdNumber { get; set; }

    public DateTime? IdDate { get; set; }

    // [Display(Name = "تاریخ")]
    // [RegularExpression(@"^$|^([1۱][۰-۹ 0-9]{3}[/\/]([0 ۰][۱-۶ 1-6])[/\/]([0 ۰][۱-۹ 1-9]|[۱۲12][۰-۹ 0-9]|[3۳][01۰۱])|[1۱][۰-۹ 0-9]{3}[/\/]([۰0][۷-۹ 7-9]|[1۱][۰۱۲012])[/\/]([۰0][1-9 ۱-۹]|[12۱۲][0-9 ۰-۹]|(30|۳۰)))$", ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string IdDatePersian
    {
        set
        {
            var str = value.ToMiladiDateTime();

            IdDate = str == null ? null : str.Value;
        }
    }

    public string AccountDetailContactJson { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";
}

//public class ContactAttribute
//{
//    public static Dictionary<string, string> GetAuthors()
//    {
//        Dictionary<string, string> _dict = new Dictionary<string, string>();

//        PropertyInfo[] props = typeof(ContactModel).GetProperties();
//        foreach (PropertyInfo prop in props)
//        {
//            object[] attrs = prop.GetCustomAttributes(true);
//            foreach (object attr in attrs)
//            {
//                DisplayAttribute attribute = attr as DisplayAttribute;

//                if (attribute != null)
//                {
//                    string propName = prop.Name;
//                    string auth = attribute.Name;

//                    _dict.Add(propName, auth);
//                }
//            }
//        }

//        return _dict;
//    }

//    public class CustomDisplayAttribute : Attribute
//    {
//        private readonly string _value;
//        public CustomDisplayAttribute(string name, string value)
//        {
//            Name = name;
//            _value = value;
//        }

//        public string Name { get; private set; }
//        public string Value { get; private set; }
//    }

//    public static object GetPropValue(object src, string propName)
//    {
//        return src.GetType().GetProperty(propName).GetValue(src, null);
//    }
//}