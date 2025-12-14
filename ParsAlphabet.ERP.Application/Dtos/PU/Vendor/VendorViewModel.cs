using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.PU.Vendor;

public class VendorGetPage
{
    public int Id { get; set; }
    public string VendorFullName { get; set; }
    public string PersonTitleName { get; set; }
    public string AgentFullName { get; set; }
    public byte PartnerTypeId { get; set; }
    public string PartnerTypeName => PartnerTypeId == 1 ? "1 - حقیقی" : "2 - حقوقی";
    public string NationalCode { get; set; }
    public string PhoneNo { get; set; }
    public string MobileNo { get; set; }
    public int VendorGroupId { get; set; }
    public string VendorGroupName { get; set; }
    public string VendorGroup => IdAndTitle(VendorGroupId, VendorGroupName);
    public string JobTitle { get; set; }
    public string TaxCode { get; set; }
    public bool VATEnable { get; set; }
    public bool VATInclude { get; set; }
    public bool IsActive { get; set; }
    public int DetailId { get; set; }
    public bool IsDetail => DetailId != 0;
    public int InsurerId { get; set; }
    public string InsurerName { get; set; }
    public string Insurer => IdAndTitle(InsurerId, InsurerName);
    public string InsuranceNo { get; set; }
    public string BrandName { get; set; }
}

public class VendorGetRecord
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
    public byte personTitleId { get; set; }
    public string IdNumber { get; set; }
    public DateTime? IdDate { get; set; }
    public string IdDatePersian => IdDate.ToPersianDateStringNull("{0}/{1}/{2}");
    public bool? VATInclude { get; set; }
    public byte VATAreaId { get; set; }
    public bool? VATEnable { get; set; }
    public string TaxCode { get; set; }
    public bool? IsActive { get; set; }

    public int InsurerId { get; set; }
    public string InsuranceNo { get; set; }
}

public class VendorGetRecordForm
{
    public int Id { get; set; }
    public byte IndustryIdVe { get; set; }
    public byte VendorGroupIdVe { get; set; }
    public string FirstNameVe { get; set; }
    public string LastNameVe { get; set; }
    public string FullNameVe => $"{FirstNameVe} {LastNameVe}";
    public string AgentFullNameVe { get; set; }
    public byte? PartnerTypeIdVe { get; set; }
    public byte? GenderIdVe { get; set; }
    public string NationalCodeVe { get; set; }
    public short? LocCountryIdVe { get; set; }
    public short? LocStateIdVe { get; set; }
    public short? LocCityIdVe { get; set; }
    public string PostalCodeVe { get; set; }
    public string AddressVe { get; set; }
    public string PhoneNoVe { get; set; }
    public string MobileNoVe { get; set; }
    public string EmailVe { get; set; }
    public string WebSiteVe { get; set; }
    public string JobTitleVe { get; set; }
    public string BrandNameVe { get; set; }
    public byte PersonTitleIdVe { get; set; }
    public string IdNumberVe { get; set; }
    public DateTime? IdDateVe { get; set; }
    public string IdDatePersianVe => IdDateVe.ToPersianDateStringNull("{0}/{1}/{2}");
    public bool? VATIncludeVe { get; set; }
    public byte VATAreaIdVe { get; set; }
    public bool? VATEnableVe { get; set; }
    public string TaxCodeVe { get; set; }
    public bool? IsActiveVe { get; set; }

    public int InsurerIdVe { get; set; }
    public string InsuranceNoVe { get; set; }

    public string JsonAccountDetailList { get; set; }
}

[DisplayName("Vendor")]
public class SaveVendor : CompanyViewModel
{
    public int Id { get; set; }

    [Display(Name = "صنعت")] public byte? IndustryIdVe { get; set; }


    public short VendorGroupIdVe { get; set; }

    public string FirstNameVe { get; set; }

    public string LastNameVe { get; set; }

    [Display(Name = "نام حساب")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string AgentFullNameVe { get; set; }

    [Display(Name = "عنوان شغلی")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string JobTitleVe { get; set; }

    [Display(Name = "برند")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string BrandNameVe { get; set; }


    [Display(Name = "حقیقی/حقوقی")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    [Range(1, byte.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public byte PartnerTypeIdVe { get; set; }

    public byte? GenderIdVe { get; set; }

    public string NationalCodeVe { get; set; }

    [Display(Name = "کشور")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    [Range(1, short.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public short LocCountryIdVe { get; set; }

    [Display(Name = "ولایت")] public short? LocStateIdVe { get; set; }

    [Display(Name = "شهر")] public short? LocCityIdVe { get; set; }

    [Display(Name = "نمبر خانه (Postal Code)")]
    [RegularExpression(@"\b(?!(\d)\1{3})[13-9]{4}[1346-9][013-9]{5}\b",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string PostalCodeVe { get; set; }

    [Display(Name = "آدرس")]
    [StringLength(100, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string AddressVe { get; set; }

    [Display(Name = "شماره تلفن ثابت ")]
    [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string PhoneNoVe { get; set; }

    [Display(Name = "شماره موبایل")]
    [RegularExpression(@"09(0[1-3]|1[0-9]|3[0-9]|2[0-1])-?[0-9]{3}-?[0-9]{4}",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string MobileNoVe { get; set; }

    [Display(Name = "ایمیل")]
    [RegularExpression(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string EmailVe { get; set; }

    [Display(Name = "آدرس وب سایت")]
    [RegularExpression(@"^(http|http(s)?://)?([\w-]+\.)+[\w-]+[.com|.in|.org]+(\[\?%&=]*)?",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string WebSiteVe { get; set; }

    public string IdNumberVe { get; set; }

    public DateTime? IdDateVe { get; set; }

    public string IdDatePersianVe
    {
        set
        {
            var str = value.ToMiladiDateTime();

            IdDateVe = str == null ? null : str.Value;
        }
    }

    public bool? VATIncludeVe { get; set; }

    [Display(Name = "VATمنطقه")] public byte VATAreaIdVe { get; set; }

    public byte? PersonTitleIdVe { get; set; }

    public bool? VATEnableVe { get; set; }

    public string TaxCodeVe { get; set; }

    public bool? IsActiveVe { get; set; }

    public int? InsurerIdVe { get; set; }
    public string InsuranceNoVe { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";
}