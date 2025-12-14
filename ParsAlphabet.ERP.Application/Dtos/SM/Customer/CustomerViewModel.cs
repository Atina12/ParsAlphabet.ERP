using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.SM.Customer;

public class CustomerGetPage
{
    public int Id { get; set; }
    public string CustomerFullName { get; set; }
    public string PersonTitleName { get; set; }

    public string FullName => PersonTitleName.IsNullOrEmptyOrWhiteSpace()
        ? CustomerFullName
        : $"{PersonTitleName} {CustomerFullName}";

    public string AgentFullName { get; set; }
    public byte PartnerTypeId { get; set; }
    public string PartnerTypeName => PartnerTypeId == 1 ? "1 - حقیقی" : "2 - حقوقی";
    public string NationalCode { get; set; }
    public string PhoneNo { get; set; }
    public string MobileNo { get; set; }
    public string TaxCode { get; set; }
    public bool VATInclude { get; set; }
    public bool VATEnable { get; set; }
    public bool IsActive { get; set; }
    public string PersonGroupId { get; set; }
    public string PersonGroupName { get; set; }
    public string CustomerGroup => $"{PersonGroupId} - {PersonGroupName}";
    public string JobTitle { get; set; }
    public string BrandName { get; set; }
    public int DetailId { get; set; }
    public bool IsDetail => DetailId != 0;
    public int InsurerId { get; set; }
    public string InsurerName { get; set; }
    public string Insurer => IdAndTitle(InsurerId, InsurerName);
    public string InsuranceNo { get; set; }
}

public class CustomerGetRecord
{
    public int Id { get; set; }
    public byte IndustryId { get; set; }
    public byte PersonGroupId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string AgentFullName { get; set; }
    public byte? PartnerTypeId { get; set; }
    public byte? GenderId { get; set; }
    public string NationalCode { get; set; }
    public short? LocCountryId { get; set; }
    public short? LocStateId { get; set; }
    public short? LocCityId { get; set; }
    public string PostalCode { get; set; }
    public string Address { get; set; }
    public string PhoneNo { get; set; }
    public string MobileNo { get; set; }
    public string Email { get; set; }
    public string WebSite { get; set; }
    public string JobTitle { get; set; }
    public string BrandName { get; set; }
    public byte PersonTitleId { get; set; }

    public string IdNumber { get; set; }
    public DateTime? IdDate { get; set; }
    public string IdDatePersian => IdDate.ToPersianDateStringNull("{0}/{1}/{2}");
    public bool? VATInclude { get; set; }
    public byte VATAreaId { get; set; }
    public bool? VATEnable { get; set; }
    public string TaxCode { get; set; }
    public short? GroupId { get; set; }
    public bool? IsActive { get; set; }
    public int InsurerId { get; set; }
    public string InsuranceNo { get; set; }
}

public class CustomerGetRecordForm
{
    public int Id { get; set; }
    public byte IndustryIdCu { get; set; }
    public byte PersonGroupIdCu { get; set; }
    public string FirstNameCu { get; set; }
    public string LastNameCu { get; set; }
    public string FullNameCu => $"{FirstNameCu} {LastNameCu}";
    public string AgentFullNameCu { get; set; }
    public byte? PartnerTypeIdCu { get; set; }
    public byte? GenderIdCu { get; set; }
    public string NationalCodeCu { get; set; }
    public short? LocCountryIdCu { get; set; }
    public short? LocStateIdCu { get; set; }
    public short? LocCityIdCu { get; set; }
    public string PostalCodeCu { get; set; }
    public string AddressCu { get; set; }
    public string PhoneNoCu { get; set; }
    public string MobileNoCu { get; set; }
    public string EmailCu { get; set; }
    public string WebSiteCu { get; set; }
    public string JobTitleCu { get; set; }
    public string BrandNameCu { get; set; }
    public byte PersonTitleIdCu { get; set; }
    public string IdNumberCu { get; set; }
    public DateTime? IdDateCu { get; set; }
    public string IdDatePersianCu => IdDateCu.ToPersianDateStringNull("{0}/{1}/{2}");
    public bool? VATIncludeCu { get; set; }
    public byte VATAreaIdCu { get; set; }
    public bool? VATEnableCu { get; set; }
    public string TaxCodeCu { get; set; }
    public short? GroupIdCu { get; set; }
    public bool? IsActiveCu { get; set; }
    public int InsurerIdCu { get; set; }
    public string InsuranceNoCu { get; set; }
    public string JsonAccountDetailList { get; set; }
}

[DisplayName("Customer")]
public class CustomerSave : CompanyViewModel
{
    public int Id { get; set; }
    public short? GroupIdCu { get; set; }
    public byte? IndustryIdCu { get; set; }
    public short PersonGroupIdCu { get; set; }
    public bool? VATIncludeCu { get; set; }
    public byte VATAreaIdCu { get; set; }
    public bool? VATEnableCu { get; set; }

    [Display(Name = "کد اقتصادی")]
    [StringLength(11, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string TaxCodeCu { get; set; }

    public bool? IsActiveCu { get; set; }

    public string FirstNameCu { get; set; }
    public string LastNameCu { get; set; }
    public string FullNameCu { get; set; }

    [Display(Name = "نام جستجو")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string AgentFullNameCu { get; set; }

    [Display(Name = "نوع شخصیت")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public byte PartnerTypeIdCu { get; set; }

    public byte? GenderIdCu { get; set; }

    public string NationalCodeCu { get; set; }
    public short? LocCountryIdCu { get; set; }
    public short? LocStateIdCu { get; set; }
    public short? LocCityIdCu { get; set; }

    [Display(Name = "نمبر خانه (Postal Code)")]
    [RegularExpression(@"^\b(?!(\d)\1{3})[13-9]{4}[1346-9][013-9]{5}\b$",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string PostalCodeCu { get; set; }

    [Display(Name = "آدرس ")]
    [StringLength(100, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد ")]
    public string AddressCu { get; set; }

    [Display(Name = "عنوان شغلی")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string JobTitleCu { get; set; }

    [Display(Name = "عنوان")] public byte PersonTitleIdCu { get; set; }

    public string BrandNameCu { get; set; }


    [Display(Name = "شماره تلفن ")]
    [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string PhoneNoCu { get; set; }

    [Display(Name = "شماره موبایل")]
    [RegularExpression(@"09(0[1-3]|1[0-9]|3[0-9]|2[0-1])-?[0-9]{3}-?[0-9]{4}(\[\?%&=]*)?",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string MobileNoCu { get; set; }

    [Display(Name = "ایمیل")]
    [RegularExpression(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string EmailCu { get; set; }

    [Display(Name = "آدرس وب سایت")]
    [RegularExpression(@"^(http|http(s)?://)?([\w-]+\.)+[\w-]+[.com|.in|.org]+(\[\?%&=]*)?",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string WebSiteCu { get; set; }

    public string IdNumberCu { get; set; }
    public DateTime? IdDateCu { get; set; }

    public string IdDatePersianCu
    {
        set
        {
            var str = value.ToMiladiDateTime();

            IdDateCu = str == null ? null : str.Value;
        }
    }

    public int InsurerIdCu { get; set; }
    public string InsuranceNoCu { get; set; }
    public MyResultStageStepConfigPage<List<AccountDetailCustomerViewModel>> JsonAccountDetailList { get; set; }


    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";
}

public class AccountDetailCustomerViewModel
{
    public string Barand { get; set; }
    public byte PartnerTypeId { get; set; }
    public string PartnerTypeName { get; set; }
    public bool? VATInclude { get; set; }
    public bool? VATEnable { get; set; }
    public string NationalCode { get; set; }
    public byte PersonGroupId { get; set; }
    public string PersonGroupName { get; set; }
}