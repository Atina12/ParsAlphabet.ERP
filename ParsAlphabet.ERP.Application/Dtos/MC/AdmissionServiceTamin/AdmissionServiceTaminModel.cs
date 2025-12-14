using System.ComponentModel.DataAnnotations;
using ParsAlphabet.ERP.Application.Dtos.MC.Patient;

namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionServiceTamin;

public class AdmissionServiceTamin
{
    public string Opr => Id == 0 ? "Ins" : "Upd";
    public int Id { get; set; }


    [Display(Name = "پذیرش تامین")] public List<AdmissionTamin> AdmissionTamin { get; set; }
}

public class AdmissionTamin : CompanyViewModel
{
    public int Id { get; set; }
    public byte SaleTypeId { get; set; }
    public byte AdmissionTypeId { get; set; }
    public byte BookingTypeId { get; set; }
    public string RequestEPrescriptionId { get; set; }
    public string RegisterPrescriptionId { get; set; } = "";
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime { get; set; } = DateTime.Now;
    public short StageId { get; set; }

    [Display(Name = "طبیب")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, short.MaxValue, ErrorMessage = "{0} را وارد کنید")]
    public int AttenderId { get; set; }

    public int PatientId { get; set; }
    public int ServiceTypeId { get; set; }
    public string ParaClinicTypeCode { get; set; }
    public int BasicInsurerId { get; set; }
    public int BasicInsuranceBoxId { get; set; }
    public int? CompInsuranceBoxId { get; set; }
    public short? ThirdPartyId { get; set; }
    public int? ReferringDoctorId { get; set; }
    public short ReserveNo { get; set; }
    public int AdmissionNo { get; set; }

    [Display(Name = "شیفت")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public byte ReserveShift { get; set; }

    public DateTime ReserveDateTime { get; set; }

    public string ReserveDateTimePersian
    {
        get => ReserveDateTime.ToPersianDateString("{0}/{1}/{2} {3}:{4}");
        set => ReserveDateTime = value.ToMiladiDateTime().Value;
    }

    //public short CounterId { get; set; }
    public short BranchId { get; set; }
    public int ReturnId { get; set; }
    public byte StateId { get; set; }
    public string ProvinceName { get; set; }
    public string ParaclinicTypeCodeName { get; set; }
    public string PatientNationalCode { get; set; }
    public string AttenderMSC { get; set; }
    public string AttenderName { get; set; }
    public string AttenderSpeciality { get; set; }
    public string PrescriptionDatePersian { get; set; }
    public DateTime? PrescriptionDate => PrescriptionDatePersian.ToMiladiDateTime();
    public string InqueryID { get; set; }
    public string Comments { get; set; }
    public string PatientMobile { get; set; }
    public string ReferReason { get; set; }

    public int ServiceLaboratoryGroupId { get; set; } = 0;
    public int DiagnosisCode { get; set; } = 0;
    public string DiagnosisComment { get; set; } = "";

    [Display(Name = "مراجعه کننده")] public AdmissionPatient AdmissionTaminPatient { get; set; }

    [Display(Name = "خدمت")] public List<AdmissionTaminLine> AdmissionTaminLines { get; set; }
}

public class AdmissionTaminLine
{
    [Display(Name = "خدمت")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public int ServiceId { get; set; }

    [Display(Name = "ردیف")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    [Range(1, short.MaxValue, ErrorMessage = "مقدار {0} معتبر نمی باشد")]
    public short Qty { get; set; }

    [Display(Name = "تعرفه مرکز")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public decimal ServicePrice { get; set; }

    [Display(Name = "تعرفه بیمه اجباری")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public decimal BasicPrice { get; set; }

    [Display(Name = "سهم بیمه اجباری")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public decimal BasicSharePrice { get; set; }

    public decimal? CompPrice { get; set; }
    public decimal? CompSharePrice { get; set; }

    public short ThirdPartyId { get; set; }
    public decimal? PatientSharePrice { get; set; }
    public decimal? Discount { get; set; }

    [Display(Name = "قابل دریافت")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public decimal NetPrice { get; set; }

    [Display(Name = "سهم طبیب")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public decimal? AttenderSharePrice { get; set; }

    [Display(Name = "مالیات طبیب")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public byte AttenderTaxPer { get; set; }

    public byte AttenderCommissionType { get; set; }
    public int AttenderCommissionPer { get; set; }
}

public class AdmissionServiceTaminResultQuery
{
    public bool Successfull { get; set; } = true;
    public int Id { get; set; }
    public int PatientId { get; set; }
    public DateTime DateTime { get; set; }
    public string DateTimePersian => DateTime.ToPersianDateString("{0}/{1}/{2}");
    public string Time => DateTime.ToString("HH:mm:ss");
    public int Status { get; set; }
    public string StatusMessage { get; set; }
    public List<string> ValidationErrors { get; set; }
    public decimal CashAmount { get; set; }
    public decimal AdmissionAmount { get; set; }
}

public class AdmissionTaminLineCashList
{
    public byte RowNumber { get; set; }

    [Display(Name = "نوع")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public byte InOut { get; set; }

    [Display(Name = "وجه")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public byte FundTypeId { get; set; }

    [Display(Name = "ارز")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public byte CurrencyId { get; set; }

    [Display(Name = "مبلغ")]
    [Required(ErrorMessage = "{0} را وارد کنید")]
    public decimal Amount { get; set; }

    public decimal ExchangeRate { get; set; }
    public string AccountNo { get; set; }
    public string RefNo { get; set; }

    public string TerminalNo { get; set; }

    [Display(Name = "شماره کارت")]
    [StringLength(16, ErrorMessage = "حداکثر اندازه برای {0} {1} کاراکتر می باشد")]
    public string CardNo { get; set; }

    public byte OpenAccTypeId { get; set; }
    public int DetailAccountId { get; set; }
    public int UserId { get; set; }

    public DateTime CreateDateTime
        => CreateDateTimePersian.ToMiladiDateTime().Value;

    public string CreateDateTimePersian { get; set; }
    public int PosID { get; set; }
    public int PayAmount { get; set; }
    public bool IsAccess { get; set; }
}

public class AdmissionTaminCashDetail
{
    public byte RowNumber { get; set; }
    public byte AdmissionTypeId { get; set; }
    public int AdmissionId { get; set; }
    public decimal AdmissionAmount { get; set; }
    public int AdmissionPatientId { get; set; }
    public byte AdmissionSaleTypeId { get; set; }
}

public class AdmissionTaminCashLineModel : CompanyViewModel
{
    public string Opr => Id == 0 ? "Ins" : "Upd";

    public int Id { get; set; }
    public int AdmissionId { get; set; }
    public short StageId { get; set; }
    public int WorkflowId { get; set; }
    public short AdmissionActionId { get; set; }
    public short AdmissionStageId { get; set; }
    public int AdmissionWorkflowId { get; set; }
    public decimal AdmissionAmount { get; set; }
    public byte MedicalRevenue { get; set; }

    public DateTime CreateDateTime { get; set; } = DateTime.Now;
    public int CreateUserId { get; set; }
    public short BranchId { get; set; }
    public List<AdmissionTaminCashDetail> AdmissionLineCashList { get; set; }

    ////public int BookingTypeId { get; set; }
    ////public int AttenderId { get; set; }
}