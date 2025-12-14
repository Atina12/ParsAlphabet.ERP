using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionRefer;

namespace ParsAlphabet.ERP.Application.Dtos.MC.DeathCertificate;

public class DeathCertificateGetPage
{
    public int Id { get; set; }
    public int AdmissionId { get; set; }
    public int PatientId { get; set; }
    public string PatientNationalCode { get; set; }
    public string PatientFullName { get; set; }
    public string CreateDateTimePersian { get; set; }
    public string FisrtName { get; set; }
    public string LastName { get; set; }
    public string NationalId { get; set; }
    public string FullName { get; set; }
    public byte GenderId { get; set; }
    public int BurialAttesterId { get; set; }
    public string BurialAttesterName { get; set; }
    public string BurialAttester => IdAndTitle(BurialAttesterId, BurialAttesterName);
    public int IndividualRegisterId { get; set; }
    public string IndividualRegisterName { get; set; }
    public string IndividualRegister => IdAndTitle(IndividualRegisterId, IndividualRegisterName);
    public string IssueDatePersian { get; set; }
    public string SerialNumber { get; set; }
    public string DeathDateTimePersian { get; set; }
    public string DeathLocationName { get; set; }
    public string HouseholdHeadNationalCode { get; set; }
    public string SourceofDeathNotificationName { get; set; }
    public bool IsCompSent { get; set; }
    public string IsCompSentName => IsCompSent ? "ارسال شده" : "ارسال نشده";
}

public class DeathCertificateSendGetPage
{
    public int Id { get; set; }
    public int AdmissionId { get; set; }
    public string PatientNationalCode { get; set; }
    public string PatientFullName { get; set; }
    public string SerialNumber { get; set; }
    public string DeathDateTimePersian { get; set; }
    public string DeathLocationName { get; set; }
    public string HouseholdHeadNationalCode { get; set; }
    public string SourceofDeathNotificationName { get; set; }
    public string CreateDateTimePersian { get; set; }
    public string FullName { get; set; }
    public string NationalId { get; set; }
    public int ReferringDoctorId { get; set; }
    public string ReferringDoctorFullName { get; set; }
    public bool DeathCertificate { get; set; }
    public int BurialAttesterId { get; set; }
    public string BurialAttesterName { get; set; }
    public string BurialAttester => IdAndTitle(BurialAttesterId, BurialAttesterName);
    public int IndividualRegisterId { get; set; }
    public string IndividualRegisterName { get; set; }
    public string IndividualRegister => IdAndTitle(IndividualRegisterId, IndividualRegisterName);

    public byte SentResult { get; set; }

    public string SentResultName { get; set; }
    //public bool GetFeedbackResult { get; set; }
    //public string GetFeedbackResultName { get; set; }
}

public class DeathCertificateCauseLineList
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public int StatusId { get; set; }
    public string DeathCauseStatusName { get; set; }
    public int CauseId { get; set; }
    public string CauseName { get; set; }
    public string CauseCode { get; set; }
    public double DurationDeath { get; set; }
    public string DurationDeathUnitName { get; set; }
    public string DurationDeathUnitId { get; set; }
    public string DurationDeathUnitDescription { get; set; }
}

public class DeathCertificateInfantDeliveryLineList
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public double InfantWeight { get; set; }
    public string InfantWeightUnitName { get; set; }
    public byte InfantWeightUnitId { get; set; }
    public int DeliveryNumber { get; set; }
    public int DeliveryPriority { get; set; }
    public short DeliveryAgentId { get; set; }
    public string DeliveryAgentCode { get; set; }
    public string DeliveryAgentName { get; set; }
    public short DeliveryLocationId { get; set; }
    public string DeathLocationName { get; set; }
    public string MotherNationalCode { get; set; }
    public string MotherFirstName { get; set; }
    public string MotherLastName { get; set; }
    public byte MotherGenderId { get; set; }
    public string MotherBirthDate { get; set; }
    public string MotherBirthDatePersian { get; set; }
    public string MotherMobileNumber { get; set; }
}

public class GetDeathCertificate
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int AdmissionId { get; set; }
    public string BasicInsurerName { get; set; }
    public string BasicInsuranceBoxName { get; set; }
    public string CompInsuranceBoxName { get; set; }

    public string HID { get; set; }
    public string HIDOnline { get; set; }
    public string InsurNo { get; set; }
    public string InsurExpDatePersian { get; set; }
    public string InsurPageNo { get; set; }

    public string UserFullName { get; set; }
    public string CreateDatePersian { get; set; }
    public int PatientId { get; set; }

    public string FullName { get; set; }
    public string PatientFirstName { get; set; }
    public string PatientLastName { get; set; }
    public short PatientGenderId { get; set; }

    public string PatientGenderName { get; set; }

    //public string PatientMobileNo { get; set; }
    //public string PatientAddress { get; set; }
    public string NationalCode { get; set; }

    public string JobTitle { get; set; }
    public byte EducationLevelId { get; set; }
    public string EducationLevelName { get; set; }
    public string FatherFirstName { get; set; }
    public byte MaritalStatusId { get; set; }
    public string MaritalStatusName { get; set; }
    public string PostalCode { get; set; }
    public string BirthDate { get; set; }
    public string IdCardNumber { get; set; }

    public string PatientMobileNo { get; set; }

    public string PatientAddress { get; set; }

    //public short PatientGenderId { get; set; }
    public string PatientBirthDate { get; set; }
    public string PatientPhoneNo { get; set; }

    public int CountryId { get; set; }
    public string CountryName { get; set; }
    public int CountryDivisionEstateId { get; set; }
    public string CountryDivisionEstateCode { get; set; }
    public string CountryDivisionEstateName { get; set; }
    public int CountryDivisionCityId { get; set; }
    public string CountryDivisionCityCode { get; set; }
    public string CountryDivisionCityName { get; set; }


    public string IssueDatePersian { get; set; }
    public string SerialNumber { get; set; }
    public string CompositionUID { get; set; }
    public string MessageUID { get; set; }
    public string PersonUID { get; set; }
    public string DeathDateTimePersian { get; set; }
    public string DeathTimePersian { get; set; }
    public string Comment { get; set; }
    public string DeathLocationId { get; set; }
    public string DeathLocationName { get; set; }
    public string HouseholdHeadNationalCode { get; set; }
    public int SourceOfNotificationId { get; set; }
    public string SourceofDeathNotificationName { get; set; }
    public int BurialAttesterId { get; set; }
    public int IndividualRegisterId { get; set; }
    public string BurialAttesterMSCId { get; set; }
    public byte BurialAttesterMSCTypeId { get; set; }
    public string BurialAttesterRoleName { get; set; }
    public string BurialAttesterRoleCode { get; set; }
    public string BurialAttesterSpecialtyId { get; set; }
    public string BurialAttesterSpecialtyName { get; set; }
    public string BurialAttesterFirstName { get; set; }
    public string BurialAttesterLastName { get; set; }
    public string BurialAttesterFullName { get; set; }
    public string IndividualRegisterMSCId { get; set; }
    public byte IndividualRegisterMSCTypeId { get; set; }
    public string IndividualRegisterRoleName { get; set; }
    public string IndividualRegisterRoleCode { get; set; }
    public string IndividualRegisterSpecialtyId { get; set; }
    public string IndividualRegisterSpecialtyName { get; set; }
    public string IndividualRegisterFirstName { get; set; }
    public string IndividualRegisterLastName { get; set; }
    public string IndividualRegisterFullName { get; set; }
    public string FirstName { get; set; }

    public string LastName { get; set; }

    //  public string FullName { get; set; }
    public string NationalId { get; set; }

    public short GenderId { get; set; }

    //   public string BirthDate { get; set; }
    public string BirthDatePersian { get; set; }
    public string PatientNationalityId { get; set; }
    public string BasicInsurerCode { get; set; }
    public bool SentStatus { get; set; }
    public string RelatedHID { get; set; }


    public string DeathCauseLineJSON
    {
        set => DeathCauseLines = JsonConvert.DeserializeObject<List<DeathCertificateCauseLineList>>(value);
    }

    public List<DeathCertificateCauseLineList> DeathCauseLines { get; set; }

    public string DeathInfantDeliveryLineJSON
    {
        set => DeathInfantDeliveryLines =
            JsonConvert.DeserializeObject<List<DeathCertificateInfantDeliveryLineList>>(value);
    }

    public List<DeathCertificateInfantDeliveryLineList> DeathInfantDeliveryLines { get; set; }


    public string DeathMedicalHistoryLineJSON
    {
        set => DeathMedicalHistoryLines =
            JsonConvert.DeserializeObject<List<AdmissionReferMedicalHistoryLineListViewModel>>(value);
    }

    public List<AdmissionReferMedicalHistoryLineListViewModel> DeathMedicalHistoryLines { get; set; }
}

public class NextDeathCertificatId
{
    public int DeathCertificateId { get; set; }
    public int HeaderPagination { get; set; }
}

public class DeathCertificateItemDropDown
{
    public int Id { get; set; }
    public string Name { get; set; }
}