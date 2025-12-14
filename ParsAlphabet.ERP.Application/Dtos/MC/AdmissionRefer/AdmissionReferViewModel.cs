using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionRefer;

public class AdmissionReferGetPage
{
    public int Id { get; set; }
    public byte AdmissionReferId { get; set; }
    public int AdmissionReferTypeId { get; set; }
    public string AdmissionReferTypeName { get; set; }
    public string AdmissionReferType => IdAndTitle(AdmissionReferTypeId, AdmissionReferTypeName);
    public string ReferredDateTimePersian { get; set; }
    public string LifeCycleName { get; set; }
    public int ReferredTypeId { get; set; }
    public string ReferredTypeName { get; set; }
    public string ReferredType => IdAndTitle(ReferredTypeId, ReferredTypeName);
    public string ReferredReasonName { get; set; }
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

public class AdmissionReferSendGetPage
{
    public int Id { get; set; }
    public int AdmissionId { get; set; }
    public string ReferDateTimePersian { get; set; }
    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string Patient => IdAndTitle(PatientId, PatientFullName);

    public string PatientNationalCode { get; set; }
    public int ReferringDoctorId { get; set; }
    public string ReferringDoctorFullName { get; set; }
    public string ReferringDoctor => IdAndTitle(ReferringDoctorId, ReferringDoctorFullName);

    public string ReferredReasonName { get; set; }
    public int ReferredTypeId { get; set; }
    public string ReferredTypeName { get; set; }
    public string ReferredType => IdAndTitle(ReferredTypeId, ReferredTypeName);
    public string ReferredDescription { get; set; }
    public bool AdmissionRefer { get; set; }
    public byte SentResult { get; set; }
    public string SentResultName { get; set; }
    public bool GetFeedbackResult { get; set; }
    public string GetFeedbackResultName { get; set; }
    public string HID { get; set; }
}

public class AdmissionReferSendFeedBackPage
{
    public int Id { get; set; }
    public int AdmissionId { get; set; }
    public string ReferDateTimePersian { get; set; }
    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string Patient => IdAndTitle(PatientId, PatientFullName);

    public string PatientNationalCode { get; set; }
    public int ReferringDoctorId { get; set; }
    public string ReferringDoctorFullName { get; set; }
    public string ReferringDoctor => IdAndTitle(ReferringDoctorId, ReferringDoctorFullName);

    public string ReferredReasonName { get; set; }

    public int ReferredTypeId { get; set; }
    public string ReferredTypeName { get; set; }
    public string ReferredType => IdAndTitle(ReferredTypeId, ReferredTypeName);

    public string ReferredDescription { get; set; }
    public bool AdmissionFeedback { get; set; }
    public short GetResult { get; set; }
    public string GetResultName { get; set; }
    public string HID { get; set; }
}

public class AdmissionReferAbuseHistoryLineListViewModel
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public float AbuseDuration { get; set; }
    public short AbuseDurationUnitId { get; set; }
    public string AbuseDurationUnitName { get; set; }
    public string AbuseDurationUnitDescription { get; set; }
    public short SubstanceTypeId { get; set; }
    public string SubstanceTypeName { get; set; }
    public string SubstanceTypeCode { get; set; }
    public float AmountOfAbuseDosage { get; set; }
    public string AmountOfAbuseName { get; set; }
    public string AmountOfAbuseCode { get; set; }
    public short AmountOfAbuseUnitId { get; set; }
    public string AmountOfAbuseUnitName { get; set; }
    public string AmountOfAbuseUnitDescription { get; set; }
    public string AmountOfAbuseUnitCode { get; set; }
    public DateTime? StartDate { get; set; }

    public string StartDatePersian
    {
        get => StartDate.ToPersianDateStringNull("{0}/{1}/{2}");

        set
        {
            var str = value.ToMiladiDateTime();
            StartDate = str == null ? null : str.Value;
        }
    }

    public DateTime? QuitDate { get; set; }

    public string QuitDatePersian
    {
        get => QuitDate.ToPersianDateStringNull("{0}/{1}/{2}");

        set
        {
            var str = value.ToMiladiDateTime();
            QuitDate = str == null ? null : str.Value;
        }
    }
}

public class AdmissionReferAdverseReactionLineListViewModel
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

public class AdmissionReferalFamilyHisotryLineListViewModel
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public int ConditionId { get; set; }
    public string ConditionName { get; set; }
    public string ConditionCode { get; set; }
    public short RelatedPersonId { get; set; }
    public string RelatedPersonName { get; set; }
    public string RelatedPersonCode { get; set; }
    public bool IsCauseofDeath { get; set; }

    [Display(Name = "توضیح")]
    [StringLength(100, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Description { get; set; }
}

public class AdmissionReferBloodPressureLineListViewModel
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public float SystolicBP { get; set; }
    public float DiastolicBP { get; set; }
    public short PositionId { get; set; }
    public string PositionName { get; set; }
    public string PositionCode { get; set; }
    public DateTime? ObservationDateTime { get; set; }

    public string ObservationDateTimePersian
    {
        get => ObservationDateTime.ToPersianDateStringNull();
        set
        {
            var str = value.ToMiladiDateTime();
            ObservationDateTime = str == null ? null : str.Value;
        }
    }
}

public class AdmissionReferCareActionLineListViewModel
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public DateTime? StartDateTime { get; set; }

    public string StartDateTimePersian
    {
        get => StartDateTime.ToPersianDateStringNull();

        set
        {
            var str = value.ToMiladiDateTime();
            StartDateTime = str == null ? null : str.Value;
            var startTimeVal = value == null ? "" : value.Split(" ")[1];
            StartTime = startTimeVal;
        }
    }

    public DateTime? EndDateTime { get; set; }

    public string EndDateTimePersian
    {
        get => EndDateTime.ToPersianDateStringNull();

        set
        {
            var str = value.ToMiladiDateTime();
            EndDateTime = str == null ? null : str.Value;
            var endTimeVal = value == null ? "" : value.Split(" ")[1];
            EndTime = endTimeVal;
        }
    }

    public short ActionNameId { get; set; }
    public string StartTime { get; set; }
    public string EndTime { get; set; }
    public string ActionName { get; set; }
    public int ActionCode { get; set; }

    [Display(Name = "توضیح")]
    [StringLength(100, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string ActionDescription { get; set; }

    public float TimeTaken { get; set; }
    public short TimeTakenUnitId { get; set; }
    public string TimeTakenUnitName { get; set; }
    public string TimeTakenUnitDescription { get; set; }
}

public class AdmissionReferClinicFindingLineListViewModel
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public float? AgeOfOnset { get; set; }
    public bool NillSignificant { get; set; }
    public float OnsetDurationToPresent { get; set; }
    public short OnsetDurationToPresentUnitId { get; set; }
    public string OnsetDurationToPresentUnitName { get; set; }
    public string OnsetDurationToPresentUnitDescription { get; set; }
    public int FindingId { get; set; }
    public string FindingName { get; set; }
    public string FindingCode { get; set; }
    public short SeverityId { get; set; }
    public string SeverityName { get; set; }
    public DateTime? OnSetDateTime { get; set; }

    [NotMapped]
    public string OnSetDateTimePersian
    {
        get => OnSetDateTime.ToPersianDateStringNull();
        set
        {
            var str = value.ToMiladiDateTime();
            OnSetDateTime = str == null ? null : str.Value;
        }
    }

    public string Description { get; set; }
}

public class AdmissionReferDrugHistoryLineListViewModel
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public short MedicationId { get; set; }
    public string MedicationName { get; set; }
    public string MedicationCode { get; set; }
    public short RouteId { get; set; }
    public string RouteName { get; set; }
    public string RouteCode { get; set; }
}

public class AdmissionReferDrugOrderedLineListViewModel
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public DateTime? AdministrationDateTime { get; set; }

    public string AdministrationDateTimePersian
    {
        get => AdministrationDateTime.ToPersianDateStringNull();
        set
        {
            var str = value.ToMiladiDateTime();
            AdministrationDateTime = str == null ? null : str.Value;
        }
    }

    [Display(Name = "نام ژنریک دارو")]
    [StringLength(50, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]

    public string DrugGenericName { get; set; }

    public short ProductId { get; set; }
    public string ProductName { get; set; }
    public string ProductCode { get; set; }
    public double Dosage { get; set; }
    public short DosageUnitId { get; set; }
    public string DosageUnitName { get; set; }
    public string DosageUnitDescription { get; set; }
    public short FrequencyId { get; set; }
    public string FrequencyName { get; set; }
    public string FrequencyCode { get; set; }
    public short RouteId { get; set; }
    public string RouteName { get; set; }
    public string RouteCode { get; set; }
    public float LongTerm { get; set; }
    public short LongTermUnitId { get; set; }
    public string LongTermUnitName { get; set; }
    public string LongTermUnitDescription { get; set; }

    [Display(Name = "توضیح")]
    [StringLength(100, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Description { get; set; }

    public int TotalNumber { get; set; }
}

public class AdmissionReferHeightWeightLineListViewModel
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public float Height { get; set; }
    public float Weight { get; set; }
    public DateTime? ObservationDateTime { get; set; }

    public string ObservationDateTimePersian
    {
        get => ObservationDateTime.ToPersianDateStringNull();
        set
        {
            var str = value.ToMiladiDateTime();
            ObservationDateTime = str == null ? null : str.Value;
        }
    }
}

public class AdmissionReferMedicalHistoryLineListViewModel
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public int ConditionId { get; set; }
    public string ConditionName { get; set; }
    public string ConditionCode { get; set; }
    public int AgeOfOnset { get; set; }
    public string DateOfOnsetPersian { get; set; }
    public float OnsetDurationToPresent { get; set; }
    public short OnsetDurationToPresentUnitId { get; set; }
    public string OnsetDurationToPresentUnitName { get; set; }
    public string OnsetDurationToPresentUnitDescription { get; set; }

    [Display(Name = "توضیح")]
    [StringLength(100, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Description { get; set; }
}

public class AdmissionReferPulseLineListViewModel
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public bool IsPulsePresent { get; set; }
    public float PulseRate { get; set; }

    [Display(Name = "توضیح معاینه")]
    [StringLength(100, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]

    public string ClinicalDescription { get; set; }

    public short PositionId { get; set; }
    public string PositionName { get; set; }
    public string PositionCode { get; set; }

    public short MethodId { get; set; }
    public string MethodName { get; set; }
    public string MethodCode { get; set; }
    public DateTime? ObservationDateTime { get; set; }

    public string ObservationDateTimePersian
    {
        get => ObservationDateTime.ToPersianDateStringNull();
        set
        {
            var str = value.ToMiladiDateTime();
            ObservationDateTime = str == null ? null : str.Value;
        }
    }

    public int LocationOfMeasurmentId { get; set; }
    public string LocationOfMeasurmentName { get; set; }
    public string LocationOfMeasurmentCode { get; set; }
    public int CharacterId { get; set; }
    public string CharacterName { get; set; }
    public string CharacterCode { get; set; }
    public int RegularityId { get; set; }
    public string RegularityName { get; set; }
    public string RegularityCode { get; set; }
    public int VolumeId { get; set; }
    public string VolumeName { get; set; }
    public string VolumeCode { get; set; }
}

public class AdmissionReferVitalSignsLineListViewModel
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public float PulseRate { get; set; }
    public float RespiratoryRate { get; set; }
    public float Temperature { get; set; }
    public DateTime? ObservationDateTime { get; set; }

    public string ObservationDateTimePersian
    {
        get => ObservationDateTime.ToPersianDateStringNull();
        set
        {
            var str = value.ToMiladiDateTime();
            ObservationDateTime = str == null ? null : str.Value;
        }
    }

    public int TemperatureLocationId { get; set; }
    public string TemperatureLocationName { get; set; }
    public string TemperatureLocationCode { get; set; }
}

public class AdmissionReferWaistHipLineListViewModel
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public float WaistCircumference { get; set; }
    public float HipCircumference { get; set; }
    public DateTime? ObservationDateTime { get; set; }

    public string ObservationDateTimePersian
    {
        get => ObservationDateTime.ToPersianDateStringNull();
        set
        {
            var str = value.ToMiladiDateTime();
            ObservationDateTime = str == null ? null : str.Value;
        }
    }
}

public class AdmissionDiagnosisLineListViewModel
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
}

public class GetAdmissionRefer
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserFullName { get; set; }
    public int PatientId { get; set; }

    public int AdmissionId { get; set; }
    public int AdmissionReferTypeId { get; set; }
    public bool ISQueriable { get; set; }
    public int ReferringDoctorId { get; set; }
    public int AdmitingDoctorId { get; set; }
    public string AdmitingDoctorName { get; set; }
    public string AdmitingDoctorFirstName { get; set; }
    public string AdmitingDoctorLastName { get; set; }
    public string AdmitingDoctorFullName { get; set; }
    public string AdmitingDoctorMsc { get; set; }
    public byte AdmitingDoctorMscTypeId { get; set; }
    public string AdmitingDoctorMscId { get; set; }
    public int AdmitingSpecialtyId { get; set; }
    public string AdmitingSpecialtyName { get; set; }
    public byte ReferredReasonId { get; set; }
    public string ReferredReasonName { get; set; }
    public string ReferredReasonTypeName { get; set; }
    public byte ReferredTypeId { get; set; }
    public DateTime SentDateTime { get; set; }
    public string SentDateTimePersian => SentDateTime.ToPersianDateString();
    public string CompositionUID { get; set; }
    public string MessageUID { get; set; }
    public string PersonUID { get; set; }
    public string ReferredCreateDatePersian { get; set; }
    public string ReferredCreateTime { get; set; }
    public string ReferredDescription { get; set; }
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

    public string FollowUpDateTimePersian
    {
        get => FollowUpDateTime.ToPersianDateStringNull();

        set
        {
            var str = value.ToMiladiDateTime();
            FollowUpDateTime = str == null ? null : str.Value;
        }
    }

    public DateTime? FollowUpDateTime { get; set; }
    public short FollowUpNextEncounter { get; set; }
    public short FollowUpNextEncounterUnitId { get; set; }
    public string FollowUpNextEncounterUnitName { get; set; }
    public byte FollowUpNextEncounterType { get; set; }
    public string FollowUpNextEncounterTypeName { get; set; }
    public string FollowUpDescription { get; set; }

    public string AdmissionReferAbuseHistoryLineJSON
    {
        set => AdmissionReferAbuseHistoryLines =
            JsonConvert.DeserializeObject<List<AdmissionReferAbuseHistoryLineListViewModel>>(value);
    }

    public List<AdmissionReferAbuseHistoryLineListViewModel> AdmissionReferAbuseHistoryLines { get; set; }

    public string AdmissionReferAdverseReactionLineJSON
    {
        set => AdmissionReferAdverseReactionLines =
            JsonConvert.DeserializeObject<List<AdmissionReferAdverseReactionLineListViewModel>>(value);
    }

    public List<AdmissionReferAdverseReactionLineListViewModel> AdmissionReferAdverseReactionLines { get; set; }

    public string AdmissionReferalFamilyHisotryLineJSON
    {
        set => AdmissionReferalFamilyHisotryLines =
            JsonConvert.DeserializeObject<List<AdmissionReferalFamilyHisotryLineListViewModel>>(value);
    }

    public List<AdmissionReferalFamilyHisotryLineListViewModel> AdmissionReferalFamilyHisotryLines { get; set; }

    public string AdmissionReferBloodPressureLineJSON
    {
        set => AdmissionReferBloodPressureLines =
            JsonConvert.DeserializeObject<List<AdmissionReferBloodPressureLineListViewModel>>(value);
    }

    public List<AdmissionReferBloodPressureLineListViewModel> AdmissionReferBloodPressureLines { get; set; }

    public string AdmissionReferCareActionLineJSON
    {
        set => AdmissionReferCareActionLines =
            JsonConvert.DeserializeObject<List<AdmissionReferCareActionLineListViewModel>>(value);
    }

    public List<AdmissionReferCareActionLineListViewModel> AdmissionReferCareActionLines { get; set; }

    public string AdmissionReferClinicFindingLineJson
    {
        set => AdmissionReferClinicFindingLines =
            JsonConvert.DeserializeObject<List<AdmissionReferClinicFindingLineListViewModel>>(value);
    }

    public List<AdmissionReferClinicFindingLineListViewModel> AdmissionReferClinicFindingLines { get; set; }

    public string AdmissionReferDrugHistoryLineJson
    {
        set => AdmissionReferDrugHistoryLines =
            JsonConvert.DeserializeObject<List<AdmissionReferDrugHistoryLineListViewModel>>(value);
    }

    public List<AdmissionReferDrugHistoryLineListViewModel> AdmissionReferDrugHistoryLines { get; set; }

    public string AdmissionReferDrugOrderedLineJson
    {
        set => AdmissionReferDrugOrderedLines =
            JsonConvert.DeserializeObject<List<AdmissionReferDrugOrderedLineListViewModel>>(value);
    }

    public List<AdmissionReferDrugOrderedLineListViewModel> AdmissionReferDrugOrderedLines { get; set; }

    public string AdmissionReferHeightWeightLineJson
    {
        set => AdmissionReferHeightWeightLines =
            JsonConvert.DeserializeObject<List<AdmissionReferHeightWeightLineListViewModel>>(value);
    }

    public List<AdmissionReferHeightWeightLineListViewModel> AdmissionReferHeightWeightLines { get; set; }

    public string AdmissionReferMedicalHistoryLineJson
    {
        set => AdmissionReferMedicalHistoryLines =
            JsonConvert.DeserializeObject<List<AdmissionReferMedicalHistoryLineListViewModel>>(value);
    }

    public List<AdmissionReferMedicalHistoryLineListViewModel> AdmissionReferMedicalHistoryLines { get; set; }

    public string AdmissionReferPulseLineJson
    {
        set => AdmissionReferPulseLines =
            JsonConvert.DeserializeObject<List<AdmissionReferPulseLineListViewModel>>(value);
    }

    public List<AdmissionReferPulseLineListViewModel> AdmissionReferPulseLines { get; set; }

    public string AdmissionReferVitalSignsLineJson
    {
        set => AdmissionReferVitalSignsLines =
            JsonConvert.DeserializeObject<List<AdmissionReferVitalSignsLineListViewModel>>(value);
    }

    public List<AdmissionReferVitalSignsLineListViewModel> AdmissionReferVitalSignsLines { get; set; }

    public string AdmissionReferWaistHipLineJson
    {
        set => AdmissionReferWaistHipLines =
            JsonConvert.DeserializeObject<List<AdmissionReferWaistHipLineListViewModel>>(value);
    }

    public List<AdmissionReferWaistHipLineListViewModel> AdmissionReferWaistHipLines { get; set; }

    public string AdmissionDiagnosisLineJSON
    {
        set => AdmissionDiagnosisLines =
            JsonConvert.DeserializeObject<List<AdmissionDiagnosisLineListViewModel>>(value);
    }

    public List<AdmissionDiagnosisLineListViewModel> AdmissionDiagnosisLines { get; set; }
}

public class GetAdmissionFeedback
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string UserFullName { get; set; }
    public int PatientId { get; set; }

    public int AdmissionId { get; set; }
    public int AdmissionReferTypeId { get; set; }
    public bool ISQueriable { get; set; }
    public int ReferringDoctorId { get; set; }
    public string ReferringFirstName { get; set; }
    public string ReferringLastName { get; set; }
    public string ReferringFullName => ReferringFirstName + " " + ReferringLastName;
    public string ReferringMSCId { get; set; }
    public byte ReferringMscTypeId { get; set; }
    public string ReferringRoleName { get; set; }
    public string ReferringRoleCode { get; set; }
    public int ReferringSpecialtyId { get; set; }
    public string ReferringSpecialtyName { get; set; }
    public string CompositionUID { get; set; }
    public string MessageUID { get; set; }
    public string PersonUID { get; set; }
    public string ReferredCreateDatePersian { get; set; }
    public string ReferredCreateTime { get; set; }

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
    public string AttenderFullName => AttenderFirstName + " " + AttenderLastName;

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

    public string FollowUpDateTimePersian
    {
        get => FollowUpDateTime.ToPersianDateStringNull();

        set
        {
            var str = value.ToMiladiDateTime();
            FollowUpDateTime = str == null ? null : str.Value;
        }
    }

    public DateTime? FollowUpDateTime { get; set; }
    public short FollowUpNextEncounter { get; set; }
    public short FollowUpNextEncounterUnitId { get; set; }
    public string FollowUpNextEncounterUnitName { get; set; }
    public string FollowUpNextEncounterUnitDescription { get; set; }
    public byte FollowUpNextEncounterType { get; set; }
    public string FollowUpNextEncounterTypeName { get; set; }
    public string FollowUpDescription { get; set; }

    public string AdmissionReferAbuseHistoryLineJSON
    {
        set => AdmissionReferAbuseHistoryLines =
            JsonConvert.DeserializeObject<List<AdmissionReferAbuseHistoryLineListViewModel>>(value);
    }

    public List<AdmissionReferAbuseHistoryLineListViewModel> AdmissionReferAbuseHistoryLines { get; set; }

    public string AdmissionReferalFamilyHisotryLineJSON
    {
        set => AdmissionReferalFamilyHisotryLines =
            JsonConvert.DeserializeObject<List<AdmissionReferalFamilyHisotryLineListViewModel>>(value);
    }

    public List<AdmissionReferalFamilyHisotryLineListViewModel> AdmissionReferalFamilyHisotryLines { get; set; }

    public string AdmissionReferBloodPressureLineJSON
    {
        set => AdmissionReferBloodPressureLines =
            JsonConvert.DeserializeObject<List<AdmissionReferBloodPressureLineListViewModel>>(value);
    }

    public List<AdmissionReferBloodPressureLineListViewModel> AdmissionReferBloodPressureLines { get; set; }

    public string AdmissionReferCareActionLineJSON
    {
        set => AdmissionReferCareActionLines =
            JsonConvert.DeserializeObject<List<AdmissionReferCareActionLineListViewModel>>(value);
    }

    public List<AdmissionReferCareActionLineListViewModel> AdmissionReferCareActionLines { get; set; }

    public string AdmissionReferClinicFindingLineJson
    {
        set => AdmissionReferClinicFindingLines =
            JsonConvert.DeserializeObject<List<AdmissionReferClinicFindingLineListViewModel>>(value);
    }

    public List<AdmissionReferClinicFindingLineListViewModel> AdmissionReferClinicFindingLines { get; set; }

    public string AdmissionReferDrugHistoryLineJson
    {
        set => AdmissionReferDrugHistoryLines =
            JsonConvert.DeserializeObject<List<AdmissionReferDrugHistoryLineListViewModel>>(value);
    }

    public List<AdmissionReferDrugHistoryLineListViewModel> AdmissionReferDrugHistoryLines { get; set; }

    public string AdmissionReferDrugOrderedLineJson
    {
        set => AdmissionReferDrugOrderedLines =
            JsonConvert.DeserializeObject<List<AdmissionReferDrugOrderedLineListViewModel>>(value);
    }

    public List<AdmissionReferDrugOrderedLineListViewModel> AdmissionReferDrugOrderedLines { get; set; }

    public string AdmissionReferHeightWeightLineJson
    {
        set => AdmissionReferHeightWeightLines =
            JsonConvert.DeserializeObject<List<AdmissionReferHeightWeightLineListViewModel>>(value);
    }

    public List<AdmissionReferHeightWeightLineListViewModel> AdmissionReferHeightWeightLines { get; set; }

    public string AdmissionReferMedicalHistoryLineJson
    {
        set => AdmissionReferMedicalHistoryLines =
            JsonConvert.DeserializeObject<List<AdmissionReferMedicalHistoryLineListViewModel>>(value);
    }

    public List<AdmissionReferMedicalHistoryLineListViewModel> AdmissionReferMedicalHistoryLines { get; set; }

    public string AdmissionReferPulseLineJson
    {
        set => AdmissionReferPulseLines =
            JsonConvert.DeserializeObject<List<AdmissionReferPulseLineListViewModel>>(value);
    }

    public List<AdmissionReferPulseLineListViewModel> AdmissionReferPulseLines { get; set; }

    public string AdmissionReferVitalSignsLineJson
    {
        set => AdmissionReferVitalSignsLines =
            JsonConvert.DeserializeObject<List<AdmissionReferVitalSignsLineListViewModel>>(value);
    }

    public List<AdmissionReferVitalSignsLineListViewModel> AdmissionReferVitalSignsLines { get; set; }

    public string AdmissionReferWaistHipLineJson
    {
        set => AdmissionReferWaistHipLines =
            JsonConvert.DeserializeObject<List<AdmissionReferWaistHipLineListViewModel>>(value);
    }

    public List<AdmissionReferWaistHipLineListViewModel> AdmissionReferWaistHipLines { get; set; }

    public string AdmissionDiagnosisLineJSON
    {
        set => AdmissionDiagnosisLines =
            JsonConvert.DeserializeObject<List<AdmissionDiagnosisLineListViewModel>>(value);
    }

    public List<AdmissionDiagnosisLineListViewModel> AdmissionDiagnosisLines { get; set; }
}

public class AdmissionReferItemDropDown
{
    public int Id { get; set; }
    public string Name { get; set; }
}