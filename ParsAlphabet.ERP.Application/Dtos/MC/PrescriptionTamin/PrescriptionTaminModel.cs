using System.ComponentModel.DataAnnotations;

namespace ParsAlphabet.ERP.Application.Dtos.MC.PrescriptionTamin;

public class SavePrescriptionTamin : CompanyViewModel
{
    public List<PrescriptionTaminModel> Prescriptions { get; set; }
    public int CreateUserId { get; set; }

    [Display(Name = "پذیرش")]
    [Required(ErrorMessage = "{0} انتخاب نشده")]
    [Range(1, int.MaxValue, ErrorMessage = "{0} انتخاب شده ، معتبر نیم باشد")]
    public int AdmissionServiceTaminId { get; set; }

    [Display(Name = "طبیب")]
    [Required(ErrorMessage = "{0} انتخاب نشده")]
    [Range(1, int.MaxValue, ErrorMessage = "{0} انتخاب شده ، معتبر نیم باشد")]
    public int AttenderId { get; set; }

    [Display(Name = "مراجعه کننده")]
    [Required(ErrorMessage = "{0} انتخاب نشده")]
    [Range(1, int.MaxValue, ErrorMessage = "{0} انتخاب شده ، معتبر نمی باشد")]
    public int PatientId { get; set; }

    public DateTime PrescriptionDate { get; set; } = DateTime.Now;
    public string Comment { get; set; }
    public DateTime ExpireDate => ExpireDatePersian.ToMiladiDateTime().Value;
    public string ExpireDatePersian { get; set; }
    public int AdmissionTaminWorkflowId { get; set; }
    public short AdmissionTaminStageId { get; set; }
    public int WorkflowId { get; set; }
    public short StageId { get; set; }
    public string OTPCode { get; set; }
    public byte? SendResult { get; set; }
    public DateTime? SendDateTime { get; set; }
}

public class PrescriptionTaminModel
{
    public int Id { get; set; }
    public int TaminPrescriptionCategoryId { get; set; }
    public DateTime CreateDateTime { get; set; } = DateTime.Now;
    public string TrackingCode { get; set; }
    public string RequestEPrescriptionId { get; set; }
    public string OTPCode { get; set; }
    public List<PrescriptionTaminLineModel> Lines { get; set; }
}

public class PrescriptionTaminLineModel
{
    public int Id { get; set; }
    public int PrescriptionId { get; set; }
    public int ServiceId { get; set; }
    public int Quantity { get; set; }
    public int DrugAmountId { get; set; }
    public string DrugAmountCode { get; set; }
    public string Dose { get; set; }
    public int Repeat { get; set; }

    public DateTime DoDate => DoDatePersian != null && DoDatePersian != ""
        ? DoDatePersian.ToMiladiDateTime().Value
        : DateTime.Now;

    public string DoDatePersian { get; set; }
    public int DrugInstructionId { get; set; }
    public string DrugInstructionCode { get; set; }
    public byte DrugUsageId { get; set; }
    public string DrugUsageCode { get; set; }
    public string ServiceTypeId { get; set; }
    public string ServiceCode { get; set; }
    public string ParaclinicTareffGroupId { get; set; }
    public short ParentOrganId { get; set; }
    public short OrganId { get; set; }
    public byte PlanId { get; set; }
    public string PlanCode { get; set; }
    public byte IllnessId { get; set; }
    public byte? SendResult { get; set; }
    public DateTime? SendDateTime { get; set; }
    public string NoteDetailsEprscId { get; set; }
}

public class TaminPrescriptionType
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string TaminPrescriptionCategoryId { get; set; }
}

public class PrescriptionTaminInfo_Mid
{
    public string MSC { get; set; }
    public string RequestEPrescriptionId { get; set; }
    public string TrackingCode { get; set; }
    public DateTime SendDateTime { get; set; }
    public string OTPCode { get; set; }
}