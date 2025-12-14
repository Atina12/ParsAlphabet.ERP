using System.ComponentModel.DataAnnotations;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionDiagnosis;

namespace ParsAlphabet.ERP.Application.Dtos.MC.Prescription;

public class GetPrescription : CompanyViewModel
{
    public int FromPrescriptionId { get; set; }
    public int PrescriptionDrugId { get; set; }
    public int PrescriptionImageId { get; set; }
    public int PrescriptionLabId { get; set; }
    public DateTime CreateDateTime { get; set; } = DateTime.Now;
    public string CreateDatePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2}");
    public string CreateTime => CreateDateTime.ToString("HH:mm");

    public bool SendWebService { get; set; } = false;

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "شناسه پذیرش مشخص نشده")]
    public int AdmissionId { get; set; }

    public byte RepeatCount { get; set; }

    public int CreateUserId { get; set; }

    public DateTime ExpiryDate { get; set; }

    public string ExpiryDatePersian
    {
        get => ExpiryDate.ToPersianDateString("{0}/{1}/{2}");
        set
        {
            var str = value.ToMiladiDateTime();
            ExpiryDate = str.Value;
        }
    }

    public string ReasonEncounter { get; set; }

    public short DiagnosisStatus { get; set; } = -99;
    public List<AdmissionDiagnosisModel> PrescriptionDiagnoses { get; set; }


    public short DrugStatus { get; set; } = -99;
    public List<PrescriptionDrugLine> PrescriptionDrugLineList { get; set; }
    public List<PrescriptionDrugLineDetail> PrescriptionDrugLineDetailList { get; set; }

    public short ImageStatus { get; set; } = -99;
    public List<PrescriptionImageLine> PrescriptionImageLineList { get; set; }
    public List<PrescriptionImageLineDetail> PrescriptionImageLineDetailList { get; set; }

    public short LabStatus { get; set; } = -99;
    public List<PrescriptionLabLine> PrescriptionLabLineList { get; set; }

    public short PriorityId { get; set; }
    public string Note { get; set; }
    public short IntentId { get; set; }
    public string IntentName { get; set; }
    public string IntentCode { get; set; }
    public short SpecimenTissueTypeId { get; set; }
    public byte AdequacyForTestingId { get; set; }

    public short CollectionProcedureId { get; set; }

    //public DateTime CollectionDateTime => CollectionDateTimePersian.ToMiladiDateTime().Value;
    //public string CollectionDateTimePersian { get; set; }
    public DateTime? CollectionDateTime { get; set; }

    public string CollectionDateTimePersian
    {
        set
        {
            var str = value.ToMiladiDateTime();
            CollectionDateTime = str == null ? null : str.Value;
        }
    }

    public string SpecimenIdentifier { get; set; }
}

public class PrescriptionDrugLine
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public short ProductId { get; set; }
    public short AsNeedId { get; set; }
    public double Dosage { get; set; }
    public short DosageUnitId { get; set; }
    public short FrequencyId { get; set; }
    public short RouteId { get; set; }
    public short MethodId { get; set; }
    public short PriorityId { get; set; }
    public int ReasonId { get; set; }
    public short BodySiteId { get; set; }
    public string Description { get; set; }
    public string PatientInstruction { get; set; }
    public bool IsCompounded { get; set; }
    public short TotalNumber { get; set; }
    public short TotalNumberUnitId { get; set; }
    public short MaxNumber { get; set; }
}

public class PrescriptionDrugLineDetail
{
    public int HeaderID { get; set; }
    public byte RowNumber { get; set; }
    public byte DetailRowNumber { get; set; }
    public short ProductId { get; set; }
    public short Qty { get; set; }
    public short QtyMax { get; set; }
    public short UnitId { get; set; }
    public byte RoleId { get; set; }
}

public class PrescriptionImageLine
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public int ServiceId { get; set; }
    public short BodySiteId { get; set; }
    public short LateralityId { get; set; }
    public string Note { get; set; }
    public string PatientInstruction { get; set; }
}

public class PrescriptionImageLineDetail
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public byte DetailRowNumber { get; set; }
    public int ServiceId { get; set; }
    public short LateralityId { get; set; }
}

public class PrescriptionLabLine
{
    public int HeaderId { get; set; }
    public byte RowNumber { get; set; }
    public int ServiceId { get; set; }
    public bool DoNotPerform { get; set; }
    public short AsNeedId { get; set; }
    public int ReasonId { get; set; }
    public short BodySiteId { get; set; }
    public string Note { get; set; }
    public string PatientInstruction { get; set; }
}