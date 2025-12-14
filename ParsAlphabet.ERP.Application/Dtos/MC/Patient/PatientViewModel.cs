using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.MC.Patient;

public class PatientGetPage
{
    public int Id { get; set; }
    public string FullName { get; set; }
    public string Gender { get; set; }
    public string CountryName { get; set; }
    public string NationalCode { get; set; }
    public string MobileNo { get; set; }
    public string PhoneNo { get; set; }
    public int DetailId { get; set; }
    public bool IsDetail => DetailId != 0;
    public bool IsActive { get; set; }
    public DateTime? BirthDate { get; set; }

    public string BirthDatePersian
    {
        get => BirthDate.ToPersianDateStringNull("{0}/{1}/{2}");
        set
        {
            var str = value.ToMiladiDateTime();
            BirthDate = str == null ? null : str.Value;
        }
    }
}

public class PatientGetRecord
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string FullName { get; set; }
    public short CountryId { get; set; }
    public byte GenderId { get; set; }
    public string NationalCode { get; set; }
    public string MobileNo { get; set; }
    public string PhoneNo { get; set; }
    public string Email { get; set; }
    public string Address { get; set; }
    public DateTime? BirthDate { get; set; }

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
    public string BankName { get; set; }
    public string AccountNo { get; set; }
    public byte AccountType { get; set; }
    public string IdCardNumber { get; set; }
    public string PostalCode { get; set; }
    public string JobTitle { get; set; }
    public string MaritalStatusId { get; set; }
    public string EducationLevelId { get; set; }
    public bool IsActive { get; set; }
    public string JsonAccountDetailList { get; set; }
}

public class GetPatientSearch : CompanyViewModel
{
    public int? InsurerLineId { get; set; }
    public short? CompInsurerLineId { get; set; }
    public int? ThirdPartyInsurerId { get; set; }
    public int? DiscountInsurerId { get; set; }

    public int? PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string PatientNationalCode { get; set; }
    public string MobileNo { get; set; }
    public DateTime CurrentDate => DateTime.Now;
    public byte IncludeUnknown { get; set; }
}

public class GetPatientSearchService : GetPatientSearch
{
    public string InsurNo { get; set; }
}

public class PatientFilter
{
    public int Id { get; set; }
    public string FullName { get; set; }
    public string NationalCode { get; set; }
}

public class PatientSearch
{
    public int Id { get; set; }
    public string NationalCode { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public byte GenderId { get; set; }
    public string GenderName { get; set; }
    public string IdCardNumber { get; set; }
    public string MobileNo { get; set; }
    public string PhoneNo { get; set; }
    public string PostalCode { get; set; }
    public string Address { get; set; }
    public DateTime? BirthDate { get; set; }
    public string BirthDatePersian => BirthDate.ToPersianDateStringNull("{0}/{1}/{2}");
    public short CountryId { get; set; }
    public string CountryName { get; set; }

    public string JobTitle { get; set; }
    public string MaritalStatusId { get; set; }
    public string FatherFirstName { get; set; }
    public string EducationLevelId { get; set; }
}

public class PatientSearchService : PatientSearch
{
    public byte PatientReferralTypeId { get; set; }
    public string PatientReferralTypeName { get; set; }
    public int BasicInsurerId { get; set; }
    public string BasicInsurerName { get; set; }
    public short BasicInsurerLineId { get; set; }
    public string BasicInsurerLineName { get; set; }
    public string BasicInsurerNo { get; set; }
    public DateTime? BasicInsurerExpirationDate { get; set; }

    public string BasicInsurerExpirationDatePersian =>
        BasicInsurerExpirationDate.ToPersianDateStringNull("{0}/{1}/{2}");

    public int CompInsurerId { get; set; }
    public string CompInsurerName { get; set; }
    public int CompInsurerLineId { get; set; }
    public string CompInsurerLineName { get; set; }
    public int ThirdPartyInsurerId { get; set; }
    public string ThirdPartyInsurerName { get; set; }

    public int DiscountInsurerId { get; set; }
    public string DiscountInsurerName { get; set; }
}

public class PatientSearchSale : PatientSearch
{
    public byte PatientReferralTypeId { get; set; }
    public string PatientReferralTypeName { get; set; }
    public string BasicInsurerNo { get; set; }
    public DateTime? BasicInsurerExpirationDate { get; set; }
    public string InsurExpDatePersian => BasicInsurerExpirationDate.ToPersianDateStringNull("{0}/{1}/{2}");
    public int BasicInsurerId { get; set; }
    public string BasicInsurerName { get; set; }
    public short BasicInsurerLineId { get; set; }
    public string BasicInsurerLineName { get; set; }
    public int CompInsurerId { get; set; }
    public string CompInsurerName { get; set; }
    public int CompInsurerLineId { get; set; }
    public string CompInsurerLineName { get; set; }
    public int ThirdPartyInsurerId { get; set; }
    public string ThirdPartyInsurerName { get; set; }
    public int DiscountInsurerId { get; set; }
    public string DiscountInsurerName { get; set; }
}

public class GetPatientNationalCode : CompanyViewModel
{
    public int Id { get; set; }
    public string NationalCode { get; set; }
}

public class AdmissionPatientDisplay
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string FullName => $"{FirstName}  {LastName}";
    public byte GenderId { get; set; }
    public string GenderName => GenderId == 1 ? "مرد" : "زن";
    public string NationalCode { get; set; }
    public string MobileNo { get; set; }
    public string PhoneNo { get; set; }
    public short CountryId { get; set; }
    public string CountryName { get; set; }
    public DateTime BirthDate { get; set; }
    public string IdCardNumber { get; set; }
    public string BirthDatePersian => BirthDate.ToPersianDateString("{0}/{1}/{2}");
    public string Address { get; set; }
    public string FatherFirstName { get; set; }
    public string PostalCode { get; set; }
    public string JobTitle { get; set; }
    public short MaritalStatusId { get; set; }
    public string MaritalStatusName { get; set; }
    public short EducationLevelId { get; set; }
    public string EducationLevelName { get; set; }
}

public class AdmissionPatient : CompanyViewModel
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string FullName => FirstName.Trim() + " " + LastName.Trim();
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

    public byte GenderId { get; set; }
    public string NationalCode { get; set; }
    public string MobileNo { get; set; }
    public string PhoneNo { get; set; }
    public short CountryId { get; set; }
    public string Address { get; set; }
    public string Description { get; set; }
    public string FatherFirstName { get; set; }
    public string IdCardNumber { get; set; }
    public string PostalCode { get; set; }
    public string JobTitle { get; set; }
    public byte MaritalStatusId { get; set; }
    public byte EducationLevelId { get; set; }
    public short? BankId { get; set; }
    public string BankAccountNo { get; set; }
    public string BankShebaNo { get; set; }
    public string BankCardNo { get; set; }
}