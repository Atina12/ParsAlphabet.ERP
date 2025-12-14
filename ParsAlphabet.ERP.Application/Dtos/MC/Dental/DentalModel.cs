using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionDiagnosis;

namespace ParsAlphabet.ERP.Application.Dtos.MC.Dental;

public class DentalHeader : CompanyViewModel
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

public class AdmissionDental : DentalHeader
{
    //public List<AdmissionReferAbuseHistoryLineList> AdmissionDentalAbuseHistoryLines { get; set; }
    //public List<AdmissionReferalFamilyHisotryLineList> AdmissionDentalFamilyHisotryLines { get; set; }
    //public List<AdmissionReferDrugHistoryLineList> AdmissionDentalDrugHistoryLines { get; set; }
    //public List<AdmissionReferDrugOrderedLineList> AdmissionDentalDrugOrderedLines { get; set; }        
    //public List<AdmissionReferMedicalHistoryLineList> AdmissionDentalMedicalHistoryLines { get; set; }
    public List<AdmissionDiagnosisModel> AdmissionDentalDiagnosisLines { get; set; }
    public List<AdmissionDentalAdverseReactionLineList> AdmissionDentalAdverseReactionLines { get; set; }
    public List<AdmissionDentalToothLineList> AdmissionDentalToothLines { get; set; }
    public List<AdmissionDentalToothLineDetailList> AdmissionDentalToothLineDetails { get; set; }
    public List<AdmissionDentalTreatmentLineDetail> AdmissionDentalTreatmentLineDetails { get; set; }
}

public class AdmissionDiagnosisLineList
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public byte StatusId { get; set; }
    public int DiagnosisResonId { get; set; }
    public byte ServerityId { get; set; }
    public string Comment { get; set; }
}

public class AdmissionDentalToothLineList
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public bool IsMissing { get; set; }
    public short PartId { get; set; }
    public int SegmentId { get; set; }
    public short ToothId { get; set; }

    [Display(Name = "توضیح")]
    [StringLength(300, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Comment { get; set; }
}

public class AdmissionDentalAdverseReactionLineList
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public short CausativeAgentId { get; set; }
    public short CausativeAgentCategoryId { get; set; }
    public int ReactionId { get; set; }
    public int ReactionCategoryId { get; set; }
    public byte DiagnosisSeverityId { get; set; }

    [Display(Name = "توضیح")]
    [StringLength(100, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Description { get; set; }
}

public class AdmissionDentalToothLineDetailList
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public byte DetailRowNumber { get; set; }
    public short StatusId { get; set; }
    public int DiagnosisResonId { get; set; }
    public byte ServerityId { get; set; }

    [Display(Name = "توضیح")]
    [StringLength(300, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string Comment { get; set; }

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

public class AdmissionDentalTreatmentLineDetail
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public byte DetailRowNumber { get; set; }
    public short ServiceId { get; set; }
    public string ServiceTypeId { get; set; }
    public double ServiceCount { get; set; }
    public short ServiceCountUnitId { get; set; }
    public DateTime? StartDateTime { get; set; }

    [NotMapped]
    public string StartDateTimePersian
    {
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
        set
        {
            var str = value.ToMiladiDateTime();
            EndDateTime = str == null ? null : str.Value;
        }
    }
}