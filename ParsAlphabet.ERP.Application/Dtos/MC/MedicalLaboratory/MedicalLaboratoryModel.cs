using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ParsAlphabet.ERP.Application.Dtos.MC.MedicalLaboratory;

/// <summary>
///     کلاس اصلی آزمایش
/// </summary>
public class MedicalLaboratoryHeader : CompanyViewModel
{
    public int Id { get; set; }
    public string Opr => Id == 0 ? "Ins" : "Upd";
    public int AdmissionId { get; set; }
    public int LifeCycleStateId { get; set; }
    public bool IsQueriable { get; set; }
    public int ReferringDoctorId { get; set; }
    public int CreateUserId { get; set; }
    public string RelatedHID { get; set; }
    public DateTime CreateDate { get; set; } = DateTime.Now;
}

/// <summary>
///     آزمایش
/// </summary>
public class MedicalLaboratory : MedicalLaboratoryHeader
{
    public List<MedicalLaboratoryAbuseHistoryLineList> MedicalLaboratoryAbuseHistoryLineList { get; set; }
    public List<MedicalLaboratoryRequest> MedicalLaboratoryRequests { get; set; }
    public List<MedicalLaboratoryDiagnosis> MedicalLaboratoryDiagnosises { get; set; }
    public List<Pathology> Pathology { get; set; }
    public List<PathologyDiagnosis> PathologyDiagnosis { get; set; }
}

public class Pathology
{
    public string ClinicalInformation { get; set; }
    public string MicroscopicExamination { get; set; }
    public string MacroscopicExamination { get; set; }
    public List<PathologyDiagnosis> PathologyDiagnosis { get; set; } = new();
}

public class PathologyDiagnosis
{
    public int DiagnosisStatusId { get; set; }
    public string DiagnosisStatusName { get; set; }

    public string DiagnosisCode { get; set; }
    public int DiagnosisId { get; set; }
    public string DiagnosisName { get; set; }

    public string Description { get; set; }
    public int Morphology { get; set; }
    public string MorphologyName { get; set; }
    public string MorphologyCode { get; set; }
    public int MorphologyDifferentiationId { get; set; }
    public string MorphologyDifferentiationName { get; set; }
    public string MorphologyDifferentiationCode { get; set; }
    public int TopographyId { get; set; }
    public string TopographyName { get; set; }
    public string TopographyCode { get; set; }
    public int TopographyLateralityId { get; set; }
    public string TopographyLateralityName { get; set; }
    public string TopographyLateralityCode { get; set; }
}

public class MedicalLaboratoryAbuseHistoryLineList
{
    public int Id { get; set; }

    public int MedicalLaboratoryId { get; set; }
    public double AbuseDuration { get; set; }
    public short AbuseDurationUnitId { get; set; }
    public short SubstanceTypeId { get; set; }
    public double AmountOfAbuseDosage { get; set; }
    public short AmountOfAbuseUnitId { get; set; }
    public DateTime? StartDate { get; set; }

    [NotMapped]
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

    [NotMapped]
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

/// <summary>
///     نمونه درخواستی
/// </summary>
public class MedicalLaboratoryRequest
{
    public string Opr => IsAdded ? "Ins" : "Upd";

    public int Id { get; set; }
    public int MedicalLaboratoryId { get; set; }
    public string SpecimenCode { get; set; }
    public DateTime? SpecimenDateTime { get; set; }

    [NotMapped]
    public string SpecimenDateTimePersian
    {
        get => SpecimenDateTime.ToPersianDateStringNull("{0}/{1}/{2} {3}:{4}");

        set
        {
            var str2 = value.ToMiladiDateTime();
            SpecimenDateTime = str2 == null ? null : str2.Value;
        }
    }

    public short SpecimenTypeId { get; set; }
    public short AdequacyForTestingId { get; set; }
    public short CollectionProcedureId { get; set; }
    public string SpecimenIdentifier { get; set; }
    public short SpecimenTissueTypeId { get; set; }
    public bool IsAdded { get; set; }
    public bool IsRemoved { get; set; }

    public List<MedicalLaboratoryRequestMethod> MedicalLaboratoryRequestMethods { get; set; }
}

/// <summary>
///     روش های انجام نمونه
/// </summary>
public class MedicalLaboratoryRequestMethod
{
    public string Opr => IsAdded ? "Ins" : "Upd";
    public int MedicalLaboratoryRequestId { get; set; }
    public int Id { get; set; }
    public int LabRequestId { get; set; }
    public short MethodId { get; set; }
    public string MethodDescription { get; set; }
    public int LaboratoryPanelId { get; set; }

    public DateTime? ProcessDateTime { get; set; }

    [NotMapped]
    public string ProcessDateTimePersian
    {
        get => ProcessDateTime.ToPersianDateStringNull("{0}/{1}/{2} {3}:{4}");

        set
        {
            var str2 = value.ToMiladiDateTime();
            ProcessDateTime = str2 == null ? null : str2.Value;
        }
    }

    public DateTime? ReceiptDateTime { get; set; }

    [NotMapped]
    public string ReceiptDateTimePersian
    {
        get => ReceiptDateTime.ToPersianDateStringNull("{0}/{1}/{2} {3}:{4}");

        set
        {
            var str2 = value.ToMiladiDateTime();
            ReceiptDateTime = str2 == null ? null : str2.Value;
        }
    }

    public DateTime? ResultDateTime { get; set; }

    [NotMapped]
    public string ResultDateTimePersian
    {
        get => ResultDateTime.ToPersianDateStringNull("{0}/{1}/{2} {3}:{4}");

        set
        {
            var str2 = value.ToMiladiDateTime();
            ResultDateTime = str2 == null ? null : str2.Value;
        }
    }

    public bool IsAdded { get; set; }
    public bool IsRemoved { get; set; }

    public List<MedicalLaboratoryResult> MedicalLaboratoryResults { get; set; }
}

/// <summary>
///     جواب های آزمایش
/// </summary>
public class MedicalLaboratoryResult
{
    public string Opr => IsAdded ? "Ins" : "Upd";
    public int MedicalLaboratoryRequestMethodId { get; set; }
    public int Id { get; set; }
    public int LabTestResultId { get; set; }
    public short ResultStatusId { get; set; }
    public short StatusId { get; set; }
    public short TestNameId { get; set; }
    public short TestPanelId { get; set; }
    public int TestSequence { get; set; }

    [Display(Name = "توضیح")]
    [StringLength(300, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Comment { get; set; }

    public bool IsAdded { get; set; }
    public bool IsRemoved { get; set; }
    public int ResultType { get; set; }
    public string ResultTypeDetail { get; set; }
    public List<MedicalLaboratoryReference> MedicalLaboratoryReferences { get; set; }
}

/// <summary>
///     مرجع های آزمایش
/// </summary>
public class MedicalLaboratoryReference
{
    public string Opr => IsAdded ? "Ins" : "Upd";
    public int MedicalLaboratoryResultId { get; set; }
    public int Id { get; set; }
    public int LabRowId { get; set; }
    public short AgeRangeId { get; set; }
    public short TestResultUnitId { get; set; }
    public string Condition { get; set; }
    public string Description { get; set; }
    public short GenderId { get; set; }
    public short GestationAgeRangeId { get; set; }
    public string HighRangeDescriptive { get; set; }
    public string LowRangeDescriptive { get; set; }
    public short HormonalPhaseId { get; set; }
    public short ReferenceStatusId { get; set; }
    public short SpeciesId { get; set; }
    public short SubSpeciesId { get; set; }
    public bool IsAdded { get; set; }
    public bool IsRemoved { get; set; }
}

/// <summary>
///     تشخیص های آزمایش
/// </summary>
public class MedicalLaboratoryDiagnosis
{
    public int MedicalLaboratoryId { get; set; }
    public int Id { get; set; }
    public byte StatusId { get; set; }
    public int DiagnosisReasonId { get; set; }
    public byte ServerityId { get; set; }
    public string Comment { get; set; }
    public bool IsAdded { get; set; }
    public bool IsRemoved { get; set; }
}