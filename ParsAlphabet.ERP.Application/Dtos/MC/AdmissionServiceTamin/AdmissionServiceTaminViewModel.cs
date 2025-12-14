using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.Admission;
using ParsAlphabet.ERP.Application.Dtos.MC.Patient;

namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionServiceTamin;

public class AdmissionServiceTaminDisplay
{
    public int Id { get; set; }
    public string RequestEPrescriptionId { get; set; }
    public string RegisterPrescriptionId { get; set; }
    public int? ReasonForEncounterId { get; set; }
    public string ReasonForEncounterName { get; set; }
    public string ReasonForEncounterCode { get; set; }
    public int CashId { get; set; }
    public byte BookingTypeId { get; set; }
    public byte? RegisterTaminResult { get; set; }
    public string RegisterTaminDateTime { get; set; }
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2} {3}:{4}");
    public string CreateMonthPersian => CreateDateTime.ToPersianDateString("{1}");
    public byte? ReferralTypeId { get; set; }
    public string ReferralTypeName { get; set; }
    public string BasicInsurerNo { get; set; }
    public DateTime? BasicInsurerExpirationDate { get; set; }

    public string BasicInsurerExpirationDatePersian
    {
        get => BasicInsurerExpirationDate.ToPersianDateStringNull("{0}/{1}/{2}");
        set
        {
            var str = value.ToMiladiDateTime();
            BasicInsurerExpirationDate = str == null ? null : str.Value;
        }
    }

    public string BasicInsurerBookletPageNo { get; set; }

    public short StageId { get; set; }
    public string StageName { get; set; }
    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public int AttenderId { get; set; }
    public string AttenderFullName { get; set; }
    public int AttenderMscId { get; set; }
    public int AttenderMscTypeId { get; set; }

    public int PatientId { get; set; }

    //-----------PatientJSON---------------
    [JsonIgnore] public string PatientJSON { get; set; }

    public AdmissionPatientDisplay AdmissionServiceTaminPaitent =>
        JsonConvert.DeserializeObject<AdmissionPatientDisplay>(PatientJSON);

    public int ServiceTypeId { get; set; }
    public string ParaClinicTypeCode { get; set; }
    public int BasicInsurerId { get; set; }
    public string BasicInsurerName { get; set; }
    public int BasicInsurerLineId { get; set; }
    public string BasicInsurerLineName { get; set; }
    public int? CompInsurerId { get; set; }
    public string CompInsurerName { get; set; }
    public int? CompInsurerLineId { get; set; }
    public string CompInsurerLineName { get; set; }
    public short? ThirdPartyInsurerId { get; set; }
    public string ThirdPartyInsurerName { get; set; }
    public short? DiscountInsurerId { get; set; }
    public string DiscountInsurerName { get; set; }
    public int? ReferringDoctorId { get; set; }
    public string ReferringDoctorName { get; set; }
    public string ReferringDoctorMsc { get; set; }
    public short ReserveNo { get; set; }
    public int AdmissionNo { get; set; }
    public byte ReserveShift { get; set; }
    public DateTime ReserveDate { get; set; }
    public string ReserveDatePersian => ReserveDate.ToPersianDateString("{0}/{1}/{2}");
    public string ReserveTime => ReserveDate.ToPersianDateString("{3}:{4}:{5}");
    public DateTime InboundDateTime { get; set; }
    public short InboundUserId { get; set; }
    public byte GenderId { get; set; }
    public string GenderName { get; set; }
    public int ReturnId { get; set; }
    public byte StateId { get; set; }
    public string StateName { get; set; }
    public string LastState => $"{StateId} - {StateName}";
    public int CompanyId { get; set; }

    public string ProvinceName { get; set; }
    public string ParaclinicTypeCodeName { get; set; }
    public string PatientNationalCode { get; set; }
    public string NationalCode { get; set; }
    public string MobileNo { get; set; }
    public string Address { get; set; }
    public string PatientFatherFirstName { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTime BirthDate { get; set; }
    public short CountryId { get; set; }
    public string CountryName { get; set; }
    public string IdCardNumber { get; set; }
    public string PostalCode { get; set; }
    public string JobTitle { get; set; }
    public byte MaritalStatusId { get; set; }
    public string MaritalStatusName { get; set; }
    public byte EducationLevelId { get; set; }
    public string EducationLevelName { get; set; }
    public string PhoneNo { get; set; }
    public int ReserveShiftId { get; set; }
    public string AttenderMSC { get; set; }
    public string AttenderName { get; set; }
    public string AttenderSpeciality { get; set; }
    public DateTime PrescriptionDate { get; set; }
    public string PrescriptionDatePersian => PrescriptionDate.ToPersianDateString("{0}/{1}/{2}");
    public string Comments { get; set; }
    public string PatientMobile { get; set; }
    public string ReferReason { get; set; }
    public string InqueryID { get; set; }
    public string HID { get; set; }
    public bool? HIDOnline { get; set; }
    public string ReferredHID { get; set; }
    public DateTime UpdateHIDDateTime { get; set; }
    public string UpdateHIDResult { get; set; }
    public string SaveBillCompositionUID { get; set; }
    public int? ReferralID { get; set; }

    public int? ServiceLaboratoryGroupId { get; set; } = 0;
    public string ServiceLaboratoryGroupName { get; set; } = "";
    public string ServiceLaboratoryGroup => $"{ServiceLaboratoryGroupId} - {ServiceLaboratoryGroupName}";
    public string DiagnosisCode { get; set; } = "";
    public string DiagnosisComment { get; set; } = "";

    //------------AdmissionLine---------------
    [JsonIgnore] public string JsonStrAdmLine { get; set; }

    public List<AdmissionServiceTaminLineDisplay> AdmissionServiceLineTamin =>
        JsonConvert.DeserializeObject<List<AdmissionServiceTaminLineDisplay>>(JsonStrAdmLine);

    public string JsonStrDiagnosisLine { get; set; }

    public List<AdmissionDiagnosisLineDisplay> AdmissionDiagnosisLine =>
        JsonConvert.DeserializeObject<List<AdmissionDiagnosisLineDisplay>>(JsonStrDiagnosisLine);
}

public class AdmissionDiagnosisLineDisplay
{
    public int AdmissionId { get; set; }
    public byte RowNumber { get; set; }
    public byte StatusId { get; set; }
    public string StatusName { get; set; }
    public int DiagnosisResonId { get; set; }
    public string DiagnosisReasonName { get; set; }
    public byte ServerityId { get; set; }
    public string ServerityName { get; set; }
    public string Comment { get; set; }
    public DateTime CreateDateTime { get; set; }
}

public class AdmissionServiceTaminLineDisplay
{
    public int Id { get; set; }
    public byte Qty { get; set; }
    public decimal BasicShareAmount { get; set; }
    public decimal CompShareAmount { get; set; }
    public decimal ThirdPartyAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal PatientShareAmount { get; set; }
    public int AdmissionTaminId { get; set; }
    public byte ItemTypeId { get; set; }
    public int ServiceId { get; set; }
    public string ServiceName { get; set; }
    public string ServiceTarefCode { get; set; }
    public string LaboratoryGroupCode { get; set; }

    public int TaminServicePrice { get; set; }
    public int TaminServiceFreePrice { get; set; }
    public int TaminServiceTechPrice { get; set; }

    public bool Is2K { get; set; } = false;
    public bool Spiral { get; set; }
    public short Quantity { get; set; }
    public decimal ServicePrice { get; set; }
    public decimal BasicPrice { get; set; }
    public decimal BasicServicePrice { get; set; }
    public byte BasicPercentage { get; set; }
    public byte BasicCalculationMethodId { get; set; }

    public decimal BasicSharePrice { get; set; }
    public decimal CompPrice { get; set; }
    public decimal CompSharePrice { get; set; }
    public decimal CompServicePrice { get; set; }
    public byte CompPercentage { get; set; }
    public byte CompCalculationMethodId { get; set; }
    public decimal ThirdPartyPrice { get; set; }
    public decimal ThirdPartyServicePrice { get; set; }
    public byte ThirdPartyPercentage { get; set; }
    public byte ThirdPartyCalculationMethodId { get; set; }
    public decimal DiscountPrice { get; set; }
    public decimal DiscountServicePrice { get; set; }
    public byte DiscountPercentage { get; set; }
    public byte DiscountCalculationMethodId { get; set; }
    public byte HealthInsuranceClaim { get; set; }
    public decimal NetAmount { get; set; }
    public decimal AttenderSharePrice { get; set; }
    public byte AttenderTaxPer { get; set; }
    public byte AttenderCommissionType { get; set; }
    public decimal AttenderCommissionValue { get; set; }
    public decimal AttenderCommissionAmount { get; set; }
    public byte AttenderTaxPercentage { get; set; }
    public int AttenderCommissionPer { get; set; }
    public decimal PatientSharePrice { get; set; }
    public decimal Discount { get; set; }
    public short ThirdPartyId { get; set; }
    public string ThirdPartyName { get; set; }
}

public class PrescriptionTaminInfo
{
    public int PrescriptionId { get; set; }
    public string PatientNationalCode { get; set; }
    public string PatientMobile { get; set; }
    public string TaminPrescriptionCategoryId { get; set; }
    public DateTime PrescriptionDate { get; set; }
    public string PrescriptionDatePersian => PrescriptionDate.ToPersianDateString("{0}/{1}/{2}");
    public string AttenderMSC { get; set; }
    public string AttenderMobileNo { get; set; }
    public string AttenderNationalCode { get; set; }
    public DateTime ExpireDate { get; set; }
    public string ExpireDatePersian => ExpireDate.ToPersianDateString("{0}/{1}/{2}");
    public string Comment { get; set; }
    public string RequestEPrescriptionId { get; set; }

    public int WorkflowId { get; set; }
    public short StageId { get; set; }

    //----------------PrescriptionLine
    [JsonIgnore] public string PrescriptionInfoLineJson { get; set; }

    public List<PrescriptionTaminInfoLine> PrescriptionServiceLineTamin =>
        JsonConvert.DeserializeObject<List<PrescriptionTaminInfoLine>>(PrescriptionInfoLineJson);
}

public class PrescriptionTaminInfoLine
{
    public int ServiceId { get; set; }
    public string ParaclinicTareffGroupId { get; set; }
    public string TaminPrescriptionTypeId { get; set; }
    public string ServiceCode { get; set; }
    public int ServiceQuantity { get; set; }
    public string illnessId { get; set; }
    public string planId { get; set; }
    public int DrugAmountId { get; set; }
    public int DrugInstructionId { get; set; }
    public int Repeat { get; set; }
    public DateTime DoDate { get; set; }
    public string Dose { get; set; }
    public string NoteDetailsEprscId { get; set; }
    public byte SendResult { get; set; }
}

public class GetCalAdmissionTaminPrice : CompanyViewModel
{
    public List<ServiceTaminCalPrice> Services { get; set; }
    public short BasicInsurerLineId { get; set; }
    public short? CompInsurerLineId { get; set; }
    public int? ThirdPartyId { get; set; }
    public int? DiscountInsurerId { get; set; }
    public int AttenderId { get; set; }
    public byte MedicalSubjectId { get; set; }
}

public class ServiceTaminCalPrice
{
    public string ServiceTaminCode { get; set; }
    public int Qty { get; set; }
}

public class GetInsurerAttenderServiceTamin
{
    public int AttenderId { get; set; }
    public byte MedicalSubjectId { get; set; }
    public List<string> TaminCode { get; set; }
}

public class InsurerAttenderServiceTamin
{
    public string TaminTarefCode { get; set; }
    public bool IsInsurer { get; set; }
    public bool IsAttender { get; set; }
    public bool NotDefine { get; set; }
}

public class CalAdmissionTaminPrice : CalAdmissionPrice
{
    public int ServiceId { get; set; }
    public string ServiceName { get; set; }
    public int Qty { get; set; }
}

public class TaminRegisterIdParaclinic
{
    public int Id { get; set; }
    public string RegisterPrescriptionId { get; set; }
    public string ParaClinicTypeCode { get; set; }
}