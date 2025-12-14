using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionRefer;

namespace ParsAlphabet.ERP.Application.Dtos.MC.Dental;

public class DentalGetPage
{
    public int Id { get; set; }

    //public string AdmissionDentalTypeName { get; set; }
    public string DentalDateTimePersian { get; set; }
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
}

public class NextDentalId
{
    public int DentalId { get; set; }
    public int HeaderPagination { get; set; }
}

public class DentalSendGetPage
{
    public int Id { get; set; }
    public int AdmissionId { get; set; }
    public string DentalDateTimePersian { get; set; }
    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string Patient => IdAndTitle(PatientId, PatientFullName);
    public string PatientNationalCode { get; set; }
    public int ReferringDoctorId { get; set; }
    public string ReferringDoctorFullName { get; set; }
    public string ReferringDoctor => IdAndTitle(ReferringDoctorId, ReferringDoctorFullName);

    public bool AdmissionDental { get; set; }
    public byte SentResult { get; set; }

    public string SentResultName { get; set; }
    //public bool GetFeedbackResult { get; set; }
    //public string GetFeedbackResultName { get; set; }
}

public class DentalAdverseReactionLineList
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public int ReactionId { get; set; }
    public string ReactionName { get; set; }
    public string ReactionCode { get; set; }
    public int ReactionCategoryId { get; set; }
    public string ReactionCategoryName { get; set; }
    public string ReactionCategoryCode { get; set; }
    public byte DiagnosisSeverityId { get; set; }
    public string DiagnosisSeverityName { get; set; }

    [Display(Name = "توضیح")]
    [StringLength(100, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Description { get; set; }

    public short CausativeAgentId { get; set; }
    public string CausativeAgentName { get; set; }
    public string CausativeAgentCode { get; set; }
    public short CausativeAgentCategoryId { get; set; }
    public string CausativeAgentCategoryName { get; set; }
    public string CausativeAgentCategoryCode { get; set; }
}

public class DentalDiagnosisLineList
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public byte StatusId { get; set; }
    public string DiagnosisStatusName { get; set; }
    public int DiagnosisReasonId { get; set; }
    public string DiagnosisReasonName { get; set; }
    public string DiagnosisReasonCode { get; set; }
    public short ServerityId { get; set; }
    public string SeverityName { get; set; }
    public string Comment { get; set; }
    public string CreateDatePersian { get; set; }
    public string CreateTime { get; set; }
    public DateTime? DiagnosisDateTime { get; set; }

    [NotMapped]
    public string DiagnosisDateTimePersian
    {
        get => DiagnosisDateTime.ToPersianDateStringNull("{0}/{1}/{2} {3}:{4}");
        set
        {
            var str = value.ToMiladiDateTime();
            DiagnosisDateTime = str == null ? null : str.Value;
        }
    }
}

public class DentalToothLineList
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public bool IsMissing { get; set; }
    public short PartId { get; set; }
    public string PartName { get; set; }
    public int PartCode { get; set; }
    public int SegmentId { get; set; }
    public string SegmentName { get; set; }
    public string SegmentCode { get; set; }
    public short ToothId { get; set; }
    public string ToothName { get; set; }
    public string ToothCode { get; set; }

    [Display(Name = "توضیح")]
    [StringLength(300, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Comment { get; set; }

    public bool HasDiaganosis { get; set; }
    public bool HasTreatment { get; set; }
}

public class DentalToothLineDetailList
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public byte DetailRowNumber { get; set; }
    public byte StatusId { get; set; }
    public string DiagnosisStatusName { get; set; }
    public int DiagnosisReasonId { get; set; }
    public string DiagnosisReasonName { get; set; }
    public string DiagnosisReasonCode { get; set; }
    public short ServerityId { get; set; }
    public string SeverityName { get; set; }
    public string Comment { get; set; }
    public string CreateDatePersian { get; set; }
    public string CreateTime { get; set; }
    public DateTime? DiagnosisDateTime { get; set; }

    [NotMapped]
    public string DiagnosisDateTimePersian
    {
        get => DiagnosisDateTime.ToPersianDateStringNull("{0}/{1}/{2} {3}:{4}");
        set
        {
            var str = value.ToMiladiDateTime();
            DiagnosisDateTime = str == null ? null : str.Value;
        }
    }
}

public class DentalTreatmentLineDetail
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public byte DetailRowNumber { get; set; }
    public short ServiceId { get; set; }
    public string ServiceName { get; set; }
    public string ServiceTypeId { get; set; }
    public string ServiceTypeName { get; set; }
    public double ServiceCount { get; set; }
    public short ServiceCountUnitId { get; set; }
    public string ServiceCountUnitName { get; set; }
    public string ServiceCode { get; set; }
    public string ServiceCodeName { get; set; }
    public DateTime? StartDateTime { get; set; }

    [NotMapped]
    public string StartDateTimePersian
    {
        get => StartDateTime.ToPersianDateStringNull("{0}/{1}/{2} {3}:{4}");
        set
        {
            var str = value.ToMiladiDateTime();
            StartDateTime = str == null ? null : str.Value;
        }
    }

    public DateTime? EndDateTime { get; set; }

    [NotMapped]
    public string EndDateTimePersian
    {
        get => EndDateTime.ToPersianDateStringNull("{0}/{1}/{2} {3}:{4}");
        set
        {
            var str = value.ToMiladiDateTime();
            EndDateTime = str == null ? null : str.Value;
        }
    }

    public double BasicInsuranceContribution { get; set; }
    public double PatientContribution { get; set; }
    public double TotalCharge { get; set; }
}

public class GetDental
{
    public int Id { get; set; }
    public byte LifeCycleStateId { get; set; }
    public string LifeCycleStateCode { get; set; }
    public string LifeCycleStateName { get; set; }

    public int UserId { get; set; }
    public string UserFullName { get; set; }
    public int PatientId { get; set; }

    public int AdmissionId { get; set; }
    public bool ISQueriable { get; set; }
    public int ReferringDoctorId { get; set; }
    public string CompositionUID { get; set; }
    public string MessageUID { get; set; }
    public string PersonUID { get; set; }
    public string DentalCreateDatePersian { get; set; }
    public string DentalCreateTime { get; set; }
    public string DentalDescription { get; set; }
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
    public string PatientMobileNo { get; set; }
    public string PatientAddress { get; set; }
    public short PatientGenderId { get; set; }
    public string PatientBirthDate { get; set; }
    public string PatientNationalityId { get; set; }
    public string PatientPhoneNo { get; set; }
    public string PatientFatherFirstName { get; set; }
    public string PatientPostalCode { get; set; }
    public byte PatientMaritalStatusId { get; set; }
    public string PatientMaritalStatusName { get; set; }

    public byte PatientEducationLevelId { get; set; }
    public string PatientEducationLevelName { get; set; }

    public string PatientIdCardNumber { get; set; }
    public string PatientJobTitle { get; set; }
    public string BasicInsurerCode { get; set; }
    public string InsurNo { get; set; }
    public string BasicInsurerExpirationDatePersian { get; set; }
    public int InsurPageNo { get; set; }
    public int BasicInsurerId { get; set; }
    public string BasicInsurerName { get; set; }
    public string InsurerLineCode { get; set; }
    public string InsurerLineName { get; set; }
    public string CompInsurerName { get; set; }
    public string CompInsurerCode { get; set; }
    public string CompInsurerLineCode { get; set; }
    public string CompInsurerLineName { get; set; }
    public bool SentStatus { get; set; }
    public string RelatedHID { get; set; }

    //AdmissionReferAbuseHistoryLineList
    public string DentalAbuseHistoryLineJSON
    {
        set => DentalAbuseHistoryLines =
            JsonConvert.DeserializeObject<List<AdmissionReferAbuseHistoryLineListViewModel>>(value);
    }

    public List<AdmissionReferAbuseHistoryLineListViewModel> DentalAbuseHistoryLines { get; set; }

    public string DentalAdverseReactionLineJSON
    {
        set => DentalAdverseReactionLines = JsonConvert.DeserializeObject<List<DentalAdverseReactionLineList>>(value);
    }

    public List<DentalAdverseReactionLineList> DentalAdverseReactionLines { get; set; }

    public string DentalToothLineListJSON
    {
        set => DentalToothLines = JsonConvert.DeserializeObject<List<DentalToothLineList>>(value);
    }

    public List<DentalToothLineList> DentalToothLines { get; set; }

    public string DentalToothLineDetailListJSON
    {
        set => DentalToothLineDetails = JsonConvert.DeserializeObject<List<DentalToothLineDetailList>>(value);
    }

    public List<DentalToothLineDetailList> DentalToothLineDetails { get; set; }

    public string DentalTreatmentLineDetailJSON
    {
        set => DentalTreatmentLineDetails = JsonConvert.DeserializeObject<List<DentalTreatmentLineDetail>>(value);
    }

    public List<DentalTreatmentLineDetail> DentalTreatmentLineDetails { get; set; }


    public string DentalFamilyHisotryLineJSON
    {
        set => DentalFamilyHisotryLines =
            JsonConvert.DeserializeObject<List<AdmissionReferalFamilyHisotryLineListViewModel>>(value);
    }

    public List<AdmissionReferalFamilyHisotryLineListViewModel> DentalFamilyHisotryLines { get; set; }

    public string DentalDrugHistoryLineJSON
    {
        set => DentalDrugHistoryLines =
            JsonConvert.DeserializeObject<List<AdmissionReferDrugHistoryLineListViewModel>>(value);
    }

    public List<AdmissionReferDrugHistoryLineListViewModel> DentalDrugHistoryLines { get; set; }

    public string DentalDrugOrderedLineJSON
    {
        set => DentalDrugOrderedLines =
            JsonConvert.DeserializeObject<List<AdmissionReferDrugOrderedLineListViewModel>>(value);
    }

    public List<AdmissionReferDrugOrderedLineListViewModel> DentalDrugOrderedLines { get; set; }

    public string DentalMedicalHistoryLineJSON
    {
        set => DentalMedicalHistoryLines =
            JsonConvert.DeserializeObject<List<AdmissionReferMedicalHistoryLineListViewModel>>(value);
    }

    public List<AdmissionReferMedicalHistoryLineListViewModel> DentalMedicalHistoryLines { get; set; }

    public string DentalDiagnosisLineJSON
    {
        set => AdmissionDiagnosisLines = JsonConvert.DeserializeObject<List<DentalDiagnosisLineList>>(value);
    }

    public List<DentalDiagnosisLineList> AdmissionDiagnosisLines { get; set; }
}

public class DentalItemDropDown
{
    public int Id { get; set; }
    public string Name { get; set; }
}