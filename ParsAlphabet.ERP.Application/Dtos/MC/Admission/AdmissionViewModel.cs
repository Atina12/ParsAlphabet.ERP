using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionCash;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionDiagnosis;

namespace ParsAlphabet.ERP.Application.Dtos.MC.Admission;

public class AdmissionGetPage
{
    public int Id { get; set; }
    public int? CentralId { get; set; }
    public int? AdmissionMasterId { get; set; }
    public int? AdmissionMasterWorkflowCategoryId { get; set; }
    public int AttenderId { get; set; }
    public string AttenderName { get; set; }
    public string Attender => IdAndTitle(AttenderId, AttenderName);

    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);

    public byte MedicalRevenue { get; set; }

    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);

    public byte? ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);
    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);

    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();

    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string Patient => IdAndTitle(PatientId, PatientFullName);
    public string PatientNationalCode { get; set; }

    public int? ReserveShiftId { get; set; }
    public string ReserveShiftName { get; set; }
    public string ReserveShift => IdAndTitle(ReserveShiftId, ReserveShiftName);

    public int? AdmissionNo { get; set; }

    public DateTime ReserveDate { get; set; }
    public string ReserveDatePersian => ReserveDate.ToPersianDateString("{0}/{1}/{2}");
    public int ReserveNo { get; set; }


    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string User => IdAndTitle(CreateUserId, CreateUserFullName);

    public decimal AdmissionAmount { get; set; }
    public decimal CashAmount { get; set; }
    public bool Conflict => AdmissionAmount != CashAmount;
}

public class GetCalAdmissionPrice : CompanyViewModel
{
    public int ServiceId { get; set; }
    public short Qty { get; set; }
    public short BasicInsurerLineId { get; set; }
    public short? CompInsurerLineId { get; set; }
    public int? ThirdPartyId { get; set; }
    public int? DiscountInsurerId { get; set; }
    public int AttenderId { get; set; }
    public byte HealthClaim { get; set; }
    public byte MedicalSubjectId { get; set; }
}

public class CalAdmissionPrice
{
    public decimal BasicPrice { get; set; }
    public decimal BasicServicePrice { get; set; }
    public decimal BasicServiceAmount { get; set; }
    public decimal BasicShareAmount { get; set; }
    public byte BasicPercentage { get; set; }
    public byte BasicCalculationMethodId { get; set; }


    public decimal CompPrice { get; set; } // DISPLAY NONE
    public decimal CompServicePrice { get; set; } // DISPLAY NONE
    public decimal CompShareAmount { get; set; }
    public byte CompPercentage { get; set; }
    public byte CompCalculationMethodId { get; set; }

    public decimal ThirdPartyPrice { get; set; } // DISPLAY NONE
    public decimal ThirdPartyServicePrice { get; set; } // DISPLAY NONE
    public decimal ThirdPartyAmount { get; set; }
    public byte ThirdPartyPercentage { get; set; }
    public byte ThirdPartyCalculationMethodId { get; set; }

    public decimal DiscountPrice { get; set; } // DISPLAY NONE
    public decimal DiscountServicePrice { get; set; } // DISPLAY NONE
    public decimal DiscountAmount { get; set; }
    public byte DiscountPercentage { get; set; }
    public byte DiscountCalculationMethodId { get; set; }

    public decimal PatientShareAmount { get; set; }
    public decimal NetAmount { get; set; }

    public decimal PatientShareAmountAfterBasicInsurer { get; set; }
    public decimal BasicComplementShareAmount { get; set; }

    public decimal AttenderCommissionAmount { get; set; } = 0; // DISPLAY NONE
    public byte AttenderTaxPercentage { get; set; }
    public byte AttenderCommissionType { get; set; }
    public int AttenderCommissionValue { get; set; }
    public int AttenderCommissionPrice { get; set; }

    public int Status { get; set; }
    public string StatusMessage { get; set; }
}

public class GeneratedReserve
{
    public Guid ScheduleBlockId { get; set; }
    public short ReserveNo { get; set; }
    public string ReserveTime { get; set; }
    public int Status { get; set; }
    public string StatusMessage { get; set; }
}

public class GetGeneratedReserve
{
    public int AttenderId { get; set; }
    public int DepartmentTimeShiftId { get; set; }
 
    public bool IsOnline { get; set; }
}

public class ReserveItem
{
    public Guid ScheduleBlockId { get; set; }
    public short ReserveNo { get; set; }
    public string ReserveTime { get; set; }
    public bool IsOnline { get; set; }
    public byte ReserveState { get; set; }
    public string ReserveStateName => ReserveState == 1 ? "رزرو شده" : "آزاد";
    public string PatientFullName { get; set; }
    public string AdmissionId { get; set; }
}

public class GetReservedItem : CompanyViewModel
{
    public int AttenderId { get; set; }
    public int DepartmentTimeShiftId { get; set; }
    public short BranchId { get; set; }
    public string AppointmentDatePersian { get; set; }
    public DateTime AppointmentDate => AppointmentDatePersian.ToMiladiDateTime().Value;
    public bool IsOnline { get; set; }


    public int WeekDay { get; set; }
    public int ShiftNo { get; set; }
    public string ReserveDate { get; set; }
}

public class AttenderWeekSchedule
{
    public byte WeekDay { get; set; }
    public string WeekDayName { get; set; }
    public string ShamsiDate { get; set; }
    public bool IsActive { get; set; }
    public bool IsToday { get; set; }
}

public class GetAttenderWeekSchedule : CompanyViewModel
{
    public int AttenderId { get; set; }
    public string BaseDate { get; set; }
    public string FuncType { get; set; }
}

public class AdmissionDisplay
{
    public int Id { get; set; }
    public int? AdmissionMasterId { get; set; }

    public byte AdmissionMasterActionId { get; set; }
    public string AdmissionMasterActionName { get; set; }

    public short AdmissionMasterStageId { get; set; }
    public string AdmissionMasterStageName { get; set; }

    public short AdmissionMasterWorkflowId { get; set; }
    public string AdmissionMasterWorkflowName { get; set; }

    public short AdmissionMasterWorkflowCategoryId { get; set; }
    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);
    public short WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);

    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string Action => IdAndTitle(ActionId, ActionName);

    public byte MedicalSubjectId { get; set; }

    public int ReasonForEncounterId { get; set; }
    public string ReasonForEncounterName { get; set; }
    public string ReasonForEncounterCode { get; set; }
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();
    public byte BookingTypeId { get; set; }
    public byte ReferralTypeId { get; set; }
    public string ReferralTypeName { get; set; }
    public string BasicInsurerNo { get; set; }
    public DateTime? BasicInsurerExpirationDate { get; set; }

    public string BasicInsurerExpirationDatePersian =>
        BasicInsurerExpirationDate.ToPersianDateStringNull("{0}/{1}/{2}");

    public DateTime? PrescriptionDate { get; set; }
    public string PrescriptionDatePersian => PrescriptionDate.ToPersianDateStringNull("{0}/{1}/{2}");
    public string BasicInsurerBookletPageNo { get; set; }
    public int BasicInsurerId { get; set; }
    public string BasicInsurerName { get; set; }
    public string BasicInsurerLineId { get; set; }
    public string BasicInsurerLineName { get; set; }
    public int CompInsurerId { get; set; }
    public string CompInsurerName { get; set; }
    public int CompInsurerLineId { get; set; }
    public string CompInsurerLineName { get; set; }
    public int ThirdPartyInsurerId { get; set; }
    public string ThirdPartyInsurerName { get; set; }
    public int DiscountInsurerId { get; set; }
    public string DiscountInsurerName { get; set; }
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string PatientFatherFirstName { get; set; }
    public int PatientId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string PatientFullName => IdAndTitle(FirstName, LastName);

    public string Patient => IdAndTitle(PatientId, PatientFullName);
    public DateTime? BirthDate { get; set; }
    public string BirthDatePersian => BirthDate.ToPersianDateStringNull("{0}/{1}/{2}");
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
    public byte GenderId { get; set; }
    public string GenderName { get; set; }
    public string NationalCode { get; set; }
    public string MobileNo { get; set; }
    public string Address { get; set; }
    public string Description { get; set; }
    public string ResponsibleNationalCode { get; set; }
    public string RelationType { get; set; }
    public string Covered { get; set; }
    public string RecommendationMessage { get; set; }

    public Guid AttenderScheduleBlockId { get; set; }
    public int ReserveShiftId { get; set; }
    public string ReserveShiftName { get; set; }
    public short ReserveNo { get; set; }
    public int AdmissionNo { get; set; }

    public TimeSpan ReserveTime { get; set; }

    public DateTime ReserveDate { get; set; }
    public string ReserveDatePersian => ReserveDate.ToPersianDateString("{0}/{1}/{2}");
    public int AttenderId { get; set; }
    public string AttenderFullName { get; set; }
    public int ReferringDoctorId { get; set; }
    public string ReferringDoctorName { get; set; }
    public string ReferringDoctorMsc { get; set; }
    public string InqueryID { get; set; }

    public string HID { get; set; }
    public bool HIDOnline { get; set; }
    public string ReferredHID { get; set; }
    public DateTime? UpdateHIDDateTime { get; set; }
    public byte UpdateHIDResult { get; set; }
    public string SaveBillCompositionUID { get; set; }
    public string ReferralID { get; set; }

    public string RequestEPrescriptionId { get; set; }
    public string RegisterPrescriptionId { get; set; }

    public byte? RegisterTaminResult { get; set; }
    public string RegisterTaminDateTime { get; set; }

    public string AttenderMSC { get; set; }
    public string AttenderName { get; set; }
    public string AttenderSpeciality { get; set; }

    public string AttenderMscId { get; set; }
    public int AttenderMscTypeId { get; set; }

    public int ServiceTypeId { get; set; }
    public string ParaClinicTypeCode { get; set; }

    public string ProvinceName { get; set; }
    public string ParaclinicTypeCodeName { get; set; }
    public string PatientNationalCode { get; set; }

    public string Comments { get; set; }
    public string PatientMobile { get; set; }
    public string ReferReason { get; set; }

    public int ServiceLaboratoryGroupId { get; set; } = 0;
    public string ServiceLaboratoryGroupName { get; set; } = "";
    public string ServiceLaboratoryGroup => $"{ServiceLaboratoryGroupId} - {ServiceLaboratoryGroupName}";
    public string DiagnosisCode { get; set; } = "";
    public string DiagnosisComment { get; set; } = "";

    public decimal AdmissionPenaltyAmount { get; set; }
    public string JsonStrAdmLine { get; set; }

    public List<AdmissionLineServiceDisplay> AdmissionLineList =>
        JsonConvert.DeserializeObject<List<AdmissionLineServiceDisplay>>(JsonStrAdmLine);

    public string JsonStrDiagnosisLine
    {
        set => AdmissionDiagnosisList = JsonConvert.DeserializeObject<List<AdmissionDiagnosisLineList>>(value);
    }

    public List<AdmissionDiagnosisLineList> AdmissionDiagnosisList { get; set; }

    public int CashId { get; set; }
}

public class AdmissionLineServiceDisplay
{
    public short Qty { get; set; }
    public int ServiceId { get; set; }
    public string ServiceName { get; set; }
    public int? RvuCode { get; set; }
    public string CdtCode { get; set; }
    public string TaminCode { get; set; }

    public decimal BasicShareAmount { get; set; }
    public decimal CompShareAmount { get; set; }
    public decimal ThirdPartyAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal PatientShareAmount { get; set; }
    public decimal NetAmount { get; set; }
    public byte HealthInsuranceClaim { get; set; }
    public byte AttenderCommissionType { get; set; }
    public decimal AttenderCommissionValue { get; set; }
    public decimal AttenderCommissionPrice { get; set; }
    public decimal AttenderCommissionAmount { get; set; }
    public byte AttenderTaxPercentage { get; set; }
    public decimal BasicPrice { get; set; }
    public decimal BasicServicePrice { get; set; }
 

    public decimal? BasicPercentage { get; set; } // تغییر از decimal به decimal?
    public decimal? BasicCalculationMethodId { get; set; } // این هم احتمالاً مشکل خواهد داشت

    public decimal? CompPercentage { get; set; }
    public decimal? CompCalculationMethodId { get; set; }

    public decimal? ThirdPartyPercentage { get; set; }
    public decimal? ThirdPartyCalculationMethodId { get; set; }

    public decimal? DiscountPercentage { get; set; }
    public decimal? DiscountCalculationMethodId { get; set; }

    public decimal CompPrice { get; set; }
    public decimal CompServicePrice { get; set; }
    public decimal ThirdPartyPrice { get; set; }
    public decimal ThirdPartyServicePrice { get; set; }
    public decimal DiscountPrice { get; set; }
    public decimal DiscountServicePrice { get; set; }
}

public class GetSearchAdmission : Pagination
{
    public int? Id { get; set; }
    public int? WorkflowId { get; set; }
    public short? StageId { get; set; }
    public byte? ActionId { get; set; }
    public string ReserveDatePersian { get; set; }
    public DateTime? ReserveDate => ReserveDatePersian.ToMiladiDateTime();
    public string CreateDatePersian { get; set; }
    public DateTime? CreateDate => CreateDatePersian.ToMiladiDateTime();
    public string PatientFullName { get; set; }
    public string PatientNationalCode { get; set; }
    public int UserId { get; set; }
    public int? AttenderId { get; set; }
    public string HeaderTableName { get; set; }
}

public class GetAdmissionSearch : CompanyViewModel
{
    public int Id { get; set; }
    public DateTime? CreateDate { get; set; }

    public string CreateDatePersian
    {
        get => CreateDate.ToPersianDateStringNull("{0}/{1}/{2}");

        set
        {
            var str = value.ToMiladiDateTime();

            CreateDate = str == null ? null : str.Value;
        }
    }

    public string PatientFullName { get; set; }
    public string PatientNationalCode { get; set; }
    public int? AttenderId { get; set; }
    public byte StateId { get; set; }
    public int? WorkflowId { get; set; }
    public short? StageId { get; set; }
    public byte? ActionId { get; set; }
    public byte AdmissionTypeId { get; set; }
    public int ThirdPartyId { get; set; }
    public string ThirdPartyName { get; set; }
    public int ReferringDoctorId { get; set; }
    public string ReferringDoctorName { get; set; }
    public DateTime PrescriptionDate { get; set; }

    public string PrescriptionDatePersian => PrescriptionDate.ToPersianDateString("{0}/{1}/{2}");
}

public class AdmissionSearch : CompanyViewModel
{
    public int ReasonForEncounterId { get; set; }
    public string ReasonForEncounterCode { get; set; }
    public string ReasonForEncounterName { get; set; }
    public byte AdmissionTypeId { get; set; }
    public string AdmissionId { get; set; }
    public string AdmissionDate { get; set; }
    public string AdmissionTime { get; set; }
    public string AdmissionHID { get; set; }
    public string ReferredHID { get; set; }
    public string ReferralId { get; set; }
    public byte PatientReferralTypeId { get; set; }
    public int PatientId { get; set; }
    public string PatientFirstName { get; set; }
    public string PatientLastName { get; set; }
    public string PatientFullName { get; set; }
    public string PatientNationalCode { get; set; }
    public string PatientIdCardNumber { get; set; }
    public string PatientGenderId { get; set; }
    public string PatientBirthDate { get; set; }
    public string PatientNationalityId { get; set; }
    public string PatientMobileNo { get; set; }
    public string PatientAddress { get; set; }
    public string PatientPostalCode { get; set; }
    public byte PatientMaritalStatusId { get; set; }
    public byte PatientEducationLevelId { get; set; }
    public string PatientEducationLevelName { get; set; }
    public string PatientFatherFirstName { get; set; }
    public string PatientJobTitle { get; set; }
    public string PatientHomeTel { get; set; }


    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);

    public short BranchId { get; set; }
    public short WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);

    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);


    public int AttenderId { get; set; }
    public string AttenderMSCId { get; set; }
    public byte AttenderMSCTypeId { get; set; }
    public string AttenderRoleName { get; set; }
    public string AttenderRoleCode { get; set; }
    public int AttenderSpecialtyId { get; set; }
    public string AttenderSpecialtyName { get; set; }
    public bool HIDOnline { get; set; }
    public string AttenderFirstName { get; set; }
    public string AttenderLastName { get; set; }
    public string AttenderFullName { get; set; }
    public byte AttenderGenderId { get; set; }
    public string ReferringMSCId { get; set; }
    public byte ReferringMSCTypeId { get; set; }
    public string ReferringFirstName { get; set; }
    public string ReferringLastName { get; set; }
    public string ReferringFullName { get; set; }
    public string BasicInsurerCode { get; set; }
    public string BasicInsurerNo { get; set; }
    public string BasicInsurerExpirationDatePersian { get; set; }
    public int InsurPageNo { get; set; }
    public int BasicInsurerId { get; set; }
    public string BasicInsurerName { get; set; }
    public short BasicInsurerLineId { get; set; }
    public string BasicInsurerLineCode { get; set; }
    public string BasicInsurerLineName { get; set; }
    public int CompInsurerId { get; set; }
    public string CompInsurerCode { get; set; }
    public string CompInsurerName { get; set; }
    public short CompInsurerLineId { get; set; }
    public string CompInsurerLineCode { get; set; }
    public string CompInsurerLineName { get; set; }
    public int ThirdPartyInsurerId { get; set; }
    public string ThirdPartyInsurerName { get; set; }
    public string ThirdParty => $"{Convert.ToString(ThirdPartyInsurerId)} - {ThirdPartyInsurerName}";
    public int DiscountInsurerId { get; set; }
    public string DiscountInsurerName { get; set; }
    public string DiscountInsurer => $"{Convert.ToString(DiscountInsurerId)} - {DiscountInsurerName}";
    public DateTime? EliminateHIDDateTime { get; set; }
    public string EliminateHIDDateTimePersian => EliminateHIDDateTime.ToPersianDateStringNull();
    public string EliminateHIDResult { get; set; }
    public string PersonUID { get; set; }
    public DateTime? SaveBillDateTime { get; set; }
    public string SaveBillDateTimePersian => SaveBillDateTime.ToPersianDateStringNull();
    public string SaveBillCompositionUID { get; set; }
    public string SaveBillMessageUID { get; set; }
    public string SaveBillResult { get; set; }
    public DateTime? RembDateTime { get; set; }
    public string RembDateTimePersian => RembDateTime.ToPersianDateStringNull();
    public string RembCompositionUID { get; set; }
    public string RembMessageUID { get; set; }
    public string RembResult { get; set; }
    public int ReferringDoctorId { get; set; }
    public string ReferringDoctorName { get; set; }
    public DateTime? PrescriptionDate { get; set; }
    public string PrescriptionDatePersian => PrescriptionDate.ToPersianDateStringNull("{0}/{1}/{2}");
}

public class VerifyHID
{
    public int Id { get; set; }
    public string HID { get; set; }
    public string StatusId { get; set; }
    public string Status { get; set; }
}

public class HidInfo
{
    public int Id { get; set; }
    public string Hid { get; set; }
    public string BasicInsurerCode { get; set; }
}

public class AdmissionServiceLineGetList
{
    public int ServiceId { get; set; }
    public string ServiceName { get; set; }
    public int ServiceCode { get; set; }
}

public class GetChartAdmission : CompanyViewModel
{
    public short Type { get; set; }
    public DateTime Date { get; set; } = DateTime.Now;
}

public class ChartAdmission
{
    public long SalesAmount { get; set; }
    public long ReturnAmount { get; set; }
    public int SalesQty { get; set; }
    public int ReturnQty { get; set; }
    public string CashName { get; set; }
    public int CashId { get; set; }
}

public class DataChartAdmission
{
    public List<ChartAdmission> ChartList { get; set; } = new();
    public long MaxAmount { get; set; }
}

public class GetAdmissionFilterByInsurerThirdPartyState : CompanyViewModel
{
    public byte Type { get; set; }
    public string BasicInsurerIds { get; set; }
    public string CompInsurerIds { get; set; }
    public DateTime FromReserveDate { get; set; }

    public string FromReserveDatePersian
    {
        get => FromReserveDate.ToPersianDateString("{0}/{1}/{2} {3}:{4}");
        set
        {
            var str = value.ToMiladiDateTime();
            FromReserveDate = str.Value;
        }
    }

    public DateTime ToReserveDate { get; set; }

    public string ToReserveDatePersian
    {
        get => ToReserveDate.ToPersianDateString("{0}/{1}/{2} {3}:{4}");
        set
        {
            var str = value.ToMiladiDateTime();
            ToReserveDate = str.Value;
        }
    }
}

public class GetAdmissionDropDownListByDate
{
    public string JsonBasicInsurer { get; set; }

    public List<MyDropDownViewModel> BasicInsurerList
        => JsonConvert.DeserializeObject<List<MyDropDownViewModel>>(JsonBasicInsurer);

    public string JsonCompInsurer { get; set; }

    public List<MyDropDownViewModel> CompInsurerList
        => JsonConvert.DeserializeObject<List<MyDropDownViewModel>>(JsonCompInsurer);

    public string JsonThirdPartyInsurer { get; set; }

    public List<MyDropDownViewModel> ThirdPartyList
        => JsonConvert.DeserializeObject<List<MyDropDownViewModel>>(JsonThirdPartyInsurer);

    public string JsonDiscountInsurer { get; set; }

    public List<MyDropDownViewModel> DiscountList
        => JsonConvert.DeserializeObject<List<MyDropDownViewModel>>(JsonDiscountInsurer);

    public string JsonAttender { get; set; }

    public List<MyDropDownViewModel> AttenderList
        => JsonConvert.DeserializeObject<List<MyDropDownViewModel>>(JsonAttender);

    public string JsonService { get; set; }

    public List<MyDropDownViewModel> ServiceList
        => JsonConvert.DeserializeObject<List<MyDropDownViewModel>>(JsonService);

    public string JsonServiceType { get; set; }

    public List<MyDropDownViewModel> ServiceTypeList
        => JsonConvert.DeserializeObject<List<MyDropDownViewModel>>(JsonServiceType);

    public string JsonDepartment { get; set; }

    public List<MyDropDownViewModel> DepartmentList
        => JsonConvert.DeserializeObject<List<MyDropDownViewModel>>(JsonDepartment);

    public string JsonSpeciality { get; set; }

    public List<MyDropDownViewModel> SpecialityList
        => JsonConvert.DeserializeObject<List<MyDropDownViewModel>>(JsonSpeciality);

    public string JsonReferringDoctor { get; set; }

    public List<MyDropDownViewModel> ReferringDoctorList
        => JsonConvert.DeserializeObject<List<MyDropDownViewModel>>(JsonReferringDoctor);

    public string JsonStage { get; set; }

    public List<MyDropDownViewModel> StageList
        => JsonConvert.DeserializeObject<List<MyDropDownViewModel>>(JsonStage);

    public string JsonAction { get; set; }

    public List<MyDropDownViewModel> ActionList
        => JsonConvert.DeserializeObject<List<MyDropDownViewModel>>(JsonAction);

    public string JsonWorkflow { get; set; }

    public List<MyDropDownViewModel> WorkflowList
        => JsonConvert.DeserializeObject<List<MyDropDownViewModel>>(JsonWorkflow);


    public string JsonBasicInsurerLine { get; set; }

    public List<MyDropDownViewModel> BasicInsurerLineList
        => JsonConvert.DeserializeObject<List<MyDropDownViewModel>>(JsonBasicInsurerLine);

    public string JsonCompInsurerLine { get; set; }

    public List<MyDropDownViewModel> CompInsurerLineList
        => JsonConvert.DeserializeObject<List<MyDropDownViewModel>>(JsonCompInsurerLine);
}

public class GetAdmissionReservedList
{
    public int Id { get; set; }
    public int ReturnId { get; set; }
    public string BranchName { get; set; }
    public byte SaleTypeId { get; set; }
    public string SaleTypeName => SaleTypeId == 1 ? "1 - فروش" : "2 - مرجوع";
    public byte StateId { get; set; }
    public string StateName { get; set; }
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2}");
    public DateTime ReserveDateTime { get; set; }
    public string ReserveDateTimePersian => ReserveDateTime.ToPersianDateString();
    public string UserFullName { get; set; }
    public string PatientFullName { get; set; }
    public string NationalCode { get; set; }
    public int AttenderId { get; set; }
    public string AttenderFullName { get; set; }
    public int AdmissionNo { get; set; }
    public int ReserveShift { get; set; }
}

public class PrintAdmission
{
    public int Id { get; set; }
    public int AdmissionMasterId { get; set; }

    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string BranchAddress { get; set; }

    public int WorkflowId { get; set; }

    public string WorkflowName { get; set; }
    public short StageId { get; set; }
    public DateTime CreateDateTime { get; set; }
    public string AlterDate => CreateDateTime.ToPersianDateString("{0}/{1}/{2}");
    public string AlterTime => CreateDateTime.ToPersianDateString("{3}:{4}:{5}");
    public int AttenderId { get; set; }
    public string AttenderFullName { get; set; }
    public string DepartmentName { get; set; }


    public DateTime? BasicInsurerExpirationDate { get; set; }

    public string BasicInsurerExpirationDatePersian =>
        BasicInsurerExpirationDate.ToPersianDateStringNull("{0}/{1}/{2}");

    public string InqueryID { get; set; }


    public string MSC { get; set; }
    public string PatientFullName { get; set; }
    public string PatientNationalCode { get; set; }
    public string BasicInsurerNo { get; set; }
    public int BasicInsurerId { get; set; }
    public string BasicInsurerName { get; set; }
    public string BasicInsurerLineName { get; set; }
    public string CompInsurerName { get; set; }
    public string CompInsurerLineName { get; set; }
    public string ThirdPartyInsurerName { get; set; }
    public string DiscountInsurerName { get; set; }
    public string ServiceName { get; set; }
    public string ServiceDescription { get; set; }
    public int Qty { get; set; }
    public decimal BasicServicePrice { get; set; }
    public decimal BasicServiceAmount { get; set; }
    public decimal BasicPrice { get; set; }
    public decimal BasicShareAmount { get; set; }
    public decimal CompShareAmount { get; set; }
    public decimal ThirdPartyAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal PatientShareAmount { get; set; }
    public decimal NetAmount { get; set; }
    public int ReserveShiftId { get; set; }
    public string ReserveShiftName { get; set; }

    public int AdmissionNo { get; set; }
    public DateTime ReserveDate { get; set; }
    public string ReserveDatePersian => ReserveDate.ToPersianDateString("{0}/{1}/{2}");
    public string ReserveTime { get; set; }

    public string CreateUserFullName { get; set; }
    public string AdmissionCashInfoJSON { get; set; }

    public List<AdmissionCashInfoPrint> AdmissionCashInfoList
        => JsonConvert.DeserializeObject<List<AdmissionCashInfoPrint>>(AdmissionCashInfoJSON);

    public string JsonBranchLine { get; set; }

    public List<BranchLineInfoPrint> BranchLineInfoList
        => JsonConvert.DeserializeObject<List<BranchLineInfoPrint>>(JsonBranchLine);
}

public class BranchLineInfoPrint
{
    public int BranchLineId { get; set; }
    public byte BranchLineTypeId { get; set; }
    public string BranchLineTypeName { get; set; }
    public string Value { get; set; }
}

public class AggregationPrintAdmission : PrintAdmission
{
    public int ReferringDoctorId { get; set; }
    public string ReferringDoctorFullName { get; set; }
    public DateTime PrescriptionDate { get; set; }
    public string PrescriptionDatePersian => PrescriptionDate.ToPersianDateString("{0}/{1}/{2}");
    public string PrescriptionComment { get; set; }
}

public class StandPrintAdmission
{
    public int Id { get; set; }
    public int AdmissionMasterId { get; set; }

    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string BranchAddress { get; set; }
    public string BranchPhone1 { get; set; }
    public string BranchPhone2 { get; set; }

    public int AdmissionTypeId { get; set; }
    public short StageId { get; set; }
    public int WorkflowId { get; set; }
    public DateTime AlterDate { get; set; }
    public string CreateDateTime => AlterDate.ToPersianDateString("{0}/{1}/{2}");
    public string PatientFullName { get; set; }


    public byte BranchLineTypeId { get; set; }
    public string BranchLineTypeName { get; set; }
    public string BranchLineValue { get; set; }
}

public class UpdateReferringDoctorInfo
{
    public int AdmissionServiceId { get; set; }
    public int ReferringDoctorId { get; set; }
    public string PrescriptionDatePersian { get; set; }
    public DateTime? PrescriptionDate => PrescriptionDatePersian.ToMiladiDateTime();
    public int UserId { get; set; }
}

public class AdmissionStageAction
{
    public int WorkflowId { get; set; }
    public short StageId { get; set; }
    public byte ActionId { get; set; }
}

public class AdmissionServiceGetReserveDate
{
    public int Id { get; set; }
    public Guid AttenderScheduleBlockId { get; set; }
    public string ReserveDate { get; set; }
    public string ReserveTime { get; set; }
    public short ReserveNo { get; set; }
}

public class AdmissionPatientInfo
{
    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string PatientNationalCode { get; set; }
    public string TrackingCode { get; set; }
    public bool IsReturn { get; set; }
    public string MobileNo { get; set; }
    public DateTime ReturnDateTime { get; set; }
    public string ReturnDateTimePersian => ReturnDateTime.ToPersianDateString();
}