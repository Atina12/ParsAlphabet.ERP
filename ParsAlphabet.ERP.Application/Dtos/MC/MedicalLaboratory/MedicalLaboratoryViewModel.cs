using Newtonsoft.Json;

namespace ParsAlphabet.ERP.Application.Dtos.MC.MedicalLaboratory;

public class MedicalLaboratoryGetPage
{
    public int Id { get; set; }

    //public string AdmissionMedicalLaboratoryTypeName { get; set; }
    public string MedicalLaboratoryDateTimePersian { get; set; }
    public string LifeCycleName { get; set; }
    public int AdmissionId { get; set; }
    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string Patient => IdAndTitle(PatientId, PatientFullName);
    public long AttenderId { get; set; }
    public string AttenderFullName { get; set; }
    public string Attender => IdAndTitle(AttenderId, AttenderFullName);
    public bool IsCompSent { get; set; }
    public string IsCompSentName => IsCompSent ? "ارسال شده" : "ارسال نشده";
    public DateTime SentDateTime { get; set; }

    public string SentDateTimePersian => SentDateTime != null ? SentDateTime.ToPersianDateString() : "";
    //public int ThirdPartyId { get; set; }
    //public string ThirdPartyName { get; set; }
}

public class GetMedicalLaboratory
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserFullName { get; set; }
    public int PatientId { get; set; }
    public int AdmissionId { get; set; }
    public bool ISQueriable { get; set; }
    public int ReferringDoctorId { get; set; }
    public string CompositionUID { get; set; }
    public string MessageUID { get; set; }
    public string PersonUID { get; set; }
    public string MedicalLaboratoryCreateDatePersian { get; set; }
    public string MedicalLaboratoryCreateTime { get; set; }
    public string MedicalLaboratoryDescription { get; set; }
    public int AttenderId { get; set; }
    public string AttenderMSCId { get; set; }
    public byte AttenderMSCTypeId { get; set; }
    public string AttenderRoleName { get; set; }
    public string AttenderRoleCode { get; set; }
    public string AttenderSpecialtyId { get; set; }
    public string AttenderSpecialtyName { get; set; }
    public string AdmissionHID { get; set; }
    public string AttenderFirstName { get; set; }
    public string AttenderLastName { get; set; }
    public string AttenderFullName { get; set; }
    public string ReferringMSCId { get; set; }
    public string AdmissionCreateDatePersian { get; set; }
    public string AdmissionCreateTime { get; set; }
    public string PatientFirstName { get; set; }
    public string PatientLastName { get; set; }
    public string PatientFullName { get; set; }
    public string PatientNationalCode { get; set; }
    public string PatientPhoneNo { get; set; }
    public string PatientFatherFirstName { get; set; }
    public string PatientPostalCode { get; set; }
    public string PatientMaritalStatusId { get; set; }
    public string PatientIdCardNumber { get; set; }
    public string PatientJobTitle { get; set; }

    public byte PatientEducationLevelId { get; set; }
    public string PatientEducationLevelName { get; set; }
    public string PatientMobileNo { get; set; }
    public string PatientAddress { get; set; }
    public short PatientGenderId { get; set; }
    public string PatientBirthDate { get; set; }
    public string PatientNationalityId { get; set; }
    public string ReasonForEncounterCode { get; set; }
    public string ReasonForEncounterName { get; set; }

    public string BasicInsurerCode { get; set; }
    public string InsurNo { get; set; }
    public string InsurExpDatePersian { get; set; }
    public int InsurPageNo { get; set; }
    public int BasicInsurerId { get; set; }
    public string BasicInsurerName { get; set; }
    public string InsuranceBoxCode { get; set; }
    public string InsuranceBoxName { get; set; }
    public string CompInsuranceBoxCode { get; set; }
    public string CompInsuranceBoxName { get; set; }
    public bool SentStatus { get; set; }
    public string RelatedHID { get; set; }
    public int ThirdPartyId { get; set; }
    public string ThirdPartyName { get; set; }

    public string MedicalLaboratoryAbuseHistoryLineJSON
    {
        set => MedicalLaboratoryAbuseHistoryLines =
            JsonConvert.DeserializeObject<List<MedicalLaboratoryAbuseHistoryLineList>>(value);
    }

    public List<MedicalLaboratoryAbuseHistoryLineList> MedicalLaboratoryAbuseHistoryLines { get; set; }

    public string MedicalLaboratoryRequestJSON
    {
        set => MedicalLaboratoryRequests = value == ""
            ? new List<MedicalLaboratoryRequest>()
            : JsonConvert.DeserializeObject<List<MedicalLaboratoryRequest>>(value);
    }

    public List<MedicalLaboratoryRequest> MedicalLaboratoryRequests { get; set; }

    //public string MedicalLaboratoryProtocolJSON
    //{

    //  //  set => MedicalLaboratoryProtocol = value == "" ? new List<LaboratoryProtocolViewModel>() : JsonConvert.DeserializeObject<List<LaboratoryProtocolViewModel>>(value);
    //}
    // public List<LaboratoryProtocolViewModel> MedicalLaboratoryProtocol { get; set; }


    public string MedicalLaboratoryDiagnosisJSON
    {
        set => MedicalLaboratoryDiagnosises = value == ""
            ? new List<MedicalLaboratoryDiagnosis>()
            : JsonConvert.DeserializeObject<List<MedicalLaboratoryDiagnosis>>(value);
    }

    public List<MedicalLaboratoryDiagnosis> MedicalLaboratoryDiagnosises { get; set; }
    public List<Pathology> Pathology { get; set; }
    public List<PathologyDiagnosis> PathologyDiagnosis { get; set; }

    public string MedicalLaboratoryPathologyJSON
    {
        set => MedicalLaboratoryPathology =
            value == "" ? new List<Pathology>() : JsonConvert.DeserializeObject<List<Pathology>>(value);
    }

    public List<Pathology> MedicalLaboratoryPathology { get; set; }
}

public class NextMedicalLaboratoryId
{
    public int LabId { get; set; }
    public int HeaderPagination { get; set; }
}

public class ResultTypeDetail
{
    public bool testResultBoolean { get; set; }
    public int testResultUnitId { get; set; }
    public string testResultUnitName { get; set; }
    public int testResultIdQuantity { get; set; }
    public int testResultCount { get; set; }
    public int testResultTypeId { get; set; }
    public string testResultTypeName { get; set; }
    public int testResultDenominator { get; set; }
    public int testResultNumerator { get; set; }
    public int testResultOrdinal { get; set; }
    public string testResultCodedName { get; set; }
    public int testResultCoded { get; set; }
}

public class MedicalLaboratoryItemDropDown
{
    public int Id { get; set; }
    public string Name { get; set; }
}

public class MedicalLaboratorySendGetPage
{
    public int Id { get; set; }
    public int AdmissionId { get; set; }
    public string MedicalLaboratoryDateTimePersian { get; set; }
    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string Patient => IdAndTitle(PatientId, PatientFullName);

    public string PatientNationalCode { get; set; }
    public int ReferringDoctorId { get; set; }
    public string ReferringDoctorFullName { get; set; }
    public string ReferringDoctor => IdAndTitle(ReferringDoctorId, ReferringDoctorFullName);
    public bool AdmissionMedicalLaboratory { get; set; }
    public byte SentResult { get; set; }
    public string SentResultName { get; set; }
    public DateTime SentDateTime { get; set; }
    public string SentDateTimePersian => SentDateTime != null ? SentDateTime.ToPersianDateString() : "";
}