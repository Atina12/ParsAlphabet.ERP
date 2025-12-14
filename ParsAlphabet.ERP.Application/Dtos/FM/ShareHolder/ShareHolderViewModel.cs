using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.FM.ShareHolder;

public class ShareHolderGetPage
{
    public int Id { get; set; }
    public string ShareHolderFullName { get; set; }
    public string PersonTitleName { get; set; }

    public string FullName => PersonTitleName.IsNullOrEmptyOrWhiteSpace()
        ? ShareHolderFullName
        : $"{PersonTitleName} {ShareHolderFullName}";

    public string AgentFullName { get; set; }
    public byte PartnerTypeId { get; set; }
    public string PartnerTypeName => PartnerTypeId == 1 ? "1 - حقیقی" : "2 - حقوقی";
    public string NationalCode { get; set; }
    public string PhoneNo { get; set; }
    public string MobileNo { get; set; }
    public int ShareHolderGroupId { get; set; }
    public string ShareHolderGroupName { get; set; }
    public string ShareHolderGroup => IdAndTitle(ShareHolderGroupId, ShareHolderGroupName);
    public string JobTitle { get; set; }
    public string TaxCode { get; set; }
    public bool VATEnable { get; set; }
    public bool VATInclude { get; set; }
    public bool IsActive { get; set; }
    public int DetailId { get; set; }
    public bool IsDetail => DetailId != 0;
}

public class ShareHolderGetRecord
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
}

public class ShareHolderGetRecordForm
{
    public int Id { get; set; }
    public byte IndustryIdSh { get; set; }
    public byte ShareHolderGroupIdSh { get; set; }
    public string FirstNameSh { get; set; }
    public string LastNameSh { get; set; }
    public string FullNameSh => $"{FirstNameSh} {LastNameSh}";
    public string AgentFullNameSh { get; set; }
    public byte? PartnerTypeIdSh { get; set; }
    public byte? GenderIdSh { get; set; }
    public string NationalCodeSh { get; set; }
    public short? LocCountryIdSh { get; set; }
    public short? LocStateIdSh { get; set; }
    public short? LocCityIdSh { get; set; }
    public string PostalCodeSh { get; set; }
    public string AddressSh { get; set; }
    public string PhoneNoSh { get; set; }
    public string MobileNoSh { get; set; }
    public string EmailSh { get; set; }
    public string WebSiteSh { get; set; }
    public string JobTitleSh { get; set; }
    public string BrandNameSh { get; set; }
    public byte PersonTitleIdSh { get; set; }
    public string IdNumberSh { get; set; }
    public DateTime? IdDateSh { get; set; }
    public string IdDatePersianSh => IdDateSh.ToPersianDateStringNull("{0}/{1}/{2}");
    public bool? VATIncludeSh { get; set; }
    public byte VATAreaIdSh { get; set; }
    public bool? VATEnableSh { get; set; }
    public string TaxCodeSh { get; set; }
    public bool? IsActiveSh { get; set; }
    public string JsonAccountDetailList { get; set; }
}

[DisplayName("ShareHolder")]
public class SaveShareHolder : CompanyViewModel
{
    public int Id { get; set; }

    [Display(Name = "صنعت")] public byte? IndustryIdSh { get; set; }

    public short ShareHolderGroupIdSh { get; set; }

    public string FirstNameSh { get; set; }

    public string LastNameSh { get; set; }

    [Display(Name = "نام حساب")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string AgentFullNameSh { get; set; }

    [Display(Name = "عنوان شغلی")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string JobTitleSh { get; set; }

    [Display(Name = "برند")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string BrandNameSh { get; set; }


    [Display(Name = "حقیقی/حقوقی")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    [Range(1, byte.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public byte PartnerTypeIdSh { get; set; }

    public byte? GenderIdSh { get; set; }

    public string NationalCodeSh { get; set; }

    [Display(Name = "کشور")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    [Range(1, short.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public short LocCountryIdSh { get; set; }

    [Display(Name = "ولایت")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    [Range(1, short.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public short LocStateIdSh { get; set; }

    [Display(Name = "شهر")]
    [Required(ErrorMessage = "{0} را انتخاب کنید")]
    [Range(1, short.MaxValue, ErrorMessage = "مقدار انتخاب شده برای {0} معتبر نمی باشد")]
    public short LocCityIdSh { get; set; }

    [Display(Name = "نمبر خانه (Postal Code)")]
    [RegularExpression(@"\b(?!(\d)\1{3})[13-9]{4}[1346-9][013-9]{5}\b",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string PostalCodeSh { get; set; }

    [Display(Name = "آدرس")]
    [StringLength(100, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string AddressSh { get; set; }

    [Display(Name = "شماره تلفن ثابت ")]
    [RegularExpression(@"^\(?([0-9]{3})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string PhoneNoSh { get; set; }

    [Display(Name = "شماره موبایل")]
    [RegularExpression(@"09(0[1-3]|1[0-9]|3[0-9]|2[0-1])-?[0-9]{3}-?[0-9]{4}",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string MobileNoSh { get; set; }

    [Display(Name = "ایمیل")]
    [RegularExpression(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string EmailSh { get; set; }

    [Display(Name = "آدرس وب سایت")]
    [RegularExpression(@"^(http|http(s)?://)?([\w-]+\.)+[\w-]+[.com|.in|.org]+(\[\?%&=]*)?",
        ErrorMessage = "لطفا {0} را به صورت صحیح وارد نمایید")]
    public string WebSiteSh { get; set; }

    public string IdNumberSh { get; set; }

    public DateTime? IdDateSh { get; set; }

    public string IdDatePersianSh
    {
        set
        {
            var str = value.ToMiladiDateTime();

            IdDateSh = str == null ? null : str.Value;
        }
    }

    public bool? VATIncludeSh { get; set; }

    [Display(Name = "VATمنطقه")] public byte VATAreaIdSh { get; set; }

    public byte PersonTitleIdSh { get; set; }

    public bool? VATEnableSh { get; set; }

    public string TaxCodeSh { get; set; }

    public bool? IsActiveSh { get; set; }

    [NotMapped] public string Opr => Id == 0 ? "Ins" : "Upd";

    public string AccountDetailContactJson { get; set; }
}