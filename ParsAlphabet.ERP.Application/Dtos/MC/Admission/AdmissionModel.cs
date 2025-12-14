using System.ComponentModel.DataAnnotations;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionDiagnosis;
using ParsAlphabet.ERP.Application.Dtos.MC.Patient;

namespace ParsAlphabet.ERP.Application.Dtos.MC.Admission;

public class AdmissionModel : CompanyViewModel
{
    public int AdmissionMasterId { get; set; }
    public byte AdmissionMasterActionId { get; set; }
    public int PatientId { get; set; }
    public int Id { get; set; }
    public int? CentralId { get; set; }
    public int AdmissionMasterWorkflowId { get; set; }
    public short AdmissionMasterStageId { get; set; }
    public short StageId { get; set; }
    public byte ActionId { get; set; }
    public int WorkflowId { get; set; }
    public short BranchId { get; set; }
    public byte BookingTypeId { get; set; } = 2;
    public byte MedicalSubjectId { get; set; }
    public int BasicInsurerId { get; set; }
    public short BasicInsurerLineId { get; set; }
    public string BasicInsurerNo { get; set; }
    public string BasicInsurerBookletPageNo { get; set; }
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

    public int? CompInsurerId { get; set; }
    public short? CompInsurerLineId { get; set; }
    public int? ThirdPartyInsurerId { get; set; }
    public int? DiscountInsurerId { get; set; }

    public int AttenderId { get; set; }
    public Guid AttenderScheduleBlockId { get; set; }

    public int ReserveShiftId { get; set; }
    public short ReserveNo { get; set; }

    public DateTime? ReserveDate { get; set; }

    public string ReserveDatePersian
    {
        get => ReserveDate.ToPersianDateStringNull("{0}/{1}/{2} {3}:{4}");
        set
        {
            var str = value.ToMiladiDateTime();
            ReserveDate = str == null ? null : str.Value;
        }
    }

    public TimeSpan ReserveTime { get; set; }

    public int? ReferringDoctorId { get; set; }

    public byte AdmissionTypeId { get; set; }

    public int CreateUserId { get; set; }
    public DateTime CreateDateTime { get; set; } = DateTime.Now;
    public AdmissionPatient AdmissionPatient { get; set; }
    public List<AdmissionLineServiceList> AdmissionLineServiceList { get; set; }
    public List<AdmissionDiagnosisModel> AdmissionDiagnosisList { get; set; }
    public List<ExtraPropertyViewModel> AdmissionExtraPropertyList { get; set; }
}

public class HeaderArmedInsurance
{
    public string ArmedInsuranceIdentity { get; set; }
    public string CompanyName { get; set; }
    public int DataLength { get; set; }
    public string FromDate { get; set; }
    public string ToDate { get; set; }
    public string CompanyPhoneNo { get; set; }
}

public class AdmissionLineServiceList
{
    public int ServiceId { get; set; }
    public short Qty { get; set; }

    public decimal BasicServicePrice { get; set; }
    public decimal BasicPrice { get; set; }
    public byte? BasicPercentage { get; set; }
    public byte? BasicCalculationMethodId { get; set; }
    public decimal? BasicShareAmount { get; set; }

    public decimal? CompServicePrice { get; set; }
    public decimal? CompPrice { get; set; }
    public byte? CompPercentage { get; set; }
    public byte? CompCalculationMethodId { get; set; }
    public decimal? CompShareAmount { get; set; }

    public decimal? ThirdPartyServicePrice { get; set; } // DISPLAY NONE
    public decimal? ThirdPartyPrice { get; set; } // DISPLAY NONE
    public decimal? ThirdPartyAmount { get; set; }
    public byte? ThirdPartyPercentage { get; set; }
    public byte? ThirdPartyCalculationMethodId { get; set; }

    public decimal? DiscountServicePrice { get; set; } // DISPLAY NONE
    public decimal? DiscountPrice { get; set; } // DISPLAY NONE
    public decimal? DiscountAmount { get; set; }
    public byte? DiscountPercentage { get; set; }
    public byte? DiscountCalculationMethodId { get; set; }


    public decimal PatientShareAmount { get; set; }
    public decimal NetAmount { get; set; }

    public byte AttenderTaxPercentage { get; set; }
    public byte AttenderCommissionType { get; set; }
    public decimal AttenderCommissionValue { get; set; }
    public decimal AttenderCommissionAmount { get; set; }

    public byte HealthInsuranceClaim { get; set; }

    public int? PenaltyId { get; set; }
    public decimal PenaltyAmount { get; set; }
}

public class AdmissionLineCashList
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

    public int DetailAccountId { get; set; }
    public int UserId { get; set; }

    public DateTime CreateDateTime
        => CreateDateTimePersian.ToMiladiDateTime().Value;

    public string CreateDateTimePersian { get; set; }

    public int PosId { get; set; }
}

public class AdmissionResultQuery
{
    public bool Successfull { get; set; } = true;
    public int AdmissionMasterId { get; set; }
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

public class AdmissionCashLineModel : CompanyViewModel
{
    public int Id { get; set; }
    public int AdmissionMasterId { get; set; }
    public short BranchId { get; set; }
    public int WorkflowId { get; set; }
    public short StageId { get; set; }
    public byte ActionId { get; set; }
    public DateTime CreateDateTime { get; set; } = DateTime.Now;
    public int CreateUserId { get; set; }
    public List<AdmissionLineCashList> AdmissionLineCashList { get; set; }
}

public class AdmissionCheckPermissionViewModel : CompanyViewModel
{
    public int Id { get; set; }
    public byte RoleId { get; set; }
    public int WorkflowId { get; set; }
    public short BranchId { get; set; }
    public short StageId { get; set; }
    public byte ActionId { get; set; }
}