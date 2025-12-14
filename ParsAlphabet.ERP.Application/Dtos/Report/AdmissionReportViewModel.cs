namespace ParsAlphabet.ERP.Application.Dtos.Report;

#region AdmissionService

public class GetAdmissionReport : PaginationReport
{
    public int? Id { get; set; }
    public int? AdmissionMasterId { get; set; }
    public string BranchId { get; set; }
    public int? PatientId { get; set; }
    public string FromDatePersian { get; set; }
    public DateTime? FromDate => FromDatePersian.ToMiladiDateTime();
    public string ToDatePersian { get; set; }
    public DateTime? ToDate => ToDatePersian.ToMiladiDateTime();
    public string FromReserveDatePersian { get; set; }
    public DateTime? FromReserveDate => FromReserveDatePersian.ToMiladiDateTime();
    public string ToReserveDatePersian { get; set; }
    public DateTime? ToReserveDate => ToReserveDatePersian.ToMiladiDateTime();
    public object UserId { get; set; }
    public string BasicInsurerId { get; set; }
    public string BasicInsurerLineId { get; set; }
    public string CompInsurerId { get; set; }
    public string CompInsurerLineId { get; set; }
    public string ThirdPartyInsurerId { get; set; }
    public string DiscountInsurerId { get; set; }
    public string AttenderId { get; set; }
    public string ReferringDoctorId { get; set; }
    public string DepartmentIds { get; set; }
    public string SpecialityId { get; set; }
    public string ServiceTypeId { get; set; }
    public string ServiceId { get; set; }
    public string StageId { get; set; }
    public string WorkflowId { get; set; }
    public string ActionId { get; set; }
}

public class AdmissionServiceReport
{
    public int Id { get; set; }
    public int AdmissionMasterId { get; set; }

    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);

    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);

    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);

    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);

    public string CreateTimePersian { get; set; }
    public string CreateDatePersian { get; set; }
    public string ReserveDatePersian { get; set; }

    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string Patient => IdAndTitle(PatientId, PatientFullName);
    public string PatientNationalCode { get; set; }


    public long AttenderId { get; set; }
    public string AttenderFullName { get; set; }
    public string Attender => IdAndTitle(AttenderId, AttenderFullName);

    public long ReferringDoctorId { get; set; }
    public string ReferringDoctorFullName { get; set; }
    public string ReferringDoctor => IdAndTitle(ReferringDoctorId, ReferringDoctorFullName);
    public string BasicInsurerNo { get; set; }
    public string BasicInsurerExpirationDatePersian { get; set; }
    public string BasicInsurerBookletPageNo { get; set; }
    public string PrescriptionDatePersian { get; set; }

    public int ServiceId { get; set; }
    public string ServiceName { get; set; }
    public int ServiceNationalCode { get; set; }
    public string Service => IdAndTitle(ServiceId, ServiceName);


    public int Quantity { get; set; }

    public decimal ServiceActualAmount { get; set; }
    public decimal ServiceAmount { get; set; }
    public decimal AttenderPercentage { get; set; }
    public decimal AttenderGrossAmount { get; set; }
    public decimal RevenueAmount { get; set; }

    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; }
    public string Department => IdAndTitle(DepartmentId, DepartmentName);

    public string ServiceTypeName { get; set; }
    public string ServiceType => IdAndTitle(ServiceTypeId, ServiceTypeName);
    public decimal ServicePrice { get; set; }

    public int BasicInsurerId { get; set; }
    public string BasicInsurerName { get; set; }
    public string BasicInsurer => IdAndTitle(BasicInsurerId, BasicInsurerName);

    public short BasicInsurerLineId { get; set; }
    public string BasicInsurerLineName { get; set; }
    public string BasicInsurerLine => IdAndTitle(BasicInsurerLineId, BasicInsurerLineName);


    public int CompInsurerId { get; set; }
    public string CompInsurerName { get; set; }
    public string CompInsurer => IdAndTitle(CompInsurerId, CompInsurerName);

    public int CompInsurerLineId { get; set; }
    public string CompInsurerLineName { get; set; }
    public string CompInsurerLine => IdAndTitle(CompInsurerLineId, CompInsurerLineName);

    public int ThirdPartyInsurerId { get; set; }
    public string ThirdPartyInsurerName { get; set; }
    public string ThirdPartyInsurer => IdAndTitle(ThirdPartyInsurerId, ThirdPartyInsurerName);

    public int DiscountInsurerId { get; set; }
    public string DiscountInsurerName { get; set; }
    public string DiscountInsurer => IdAndTitle(DiscountInsurerId, DiscountInsurerName);


    public decimal BasicPrice { get; set; }
    public decimal BasicShareAmount { get; set; }
    public decimal PatientShareAmount { get; set; }

    public decimal CompShareAmount { get; set; }
    public decimal ThirdPartyAmount { get; set; }
    public decimal DiscountAmount { get; set; }

    public decimal NetAmount { get; set; }
    public int CreateUserId { get; set; }
    public string UserFullName { get; set; }
    public string User => IdAndTitle(CreateUserId, UserFullName);

    //-------------------admissionTamin---------------------
    public string RequestEPrescriptionId { get; set; }
    public string RegisterPrescriptionId { get; set; }
    public int ServiceTypeId { get; set; }
    public string ParaClinicTypeCode { get; set; }
    public string ProvinceName { get; set; }
    public string ParaclinicTypeCodeName { get; set; }

    public string ParaclinicTypeName =>
        ParaClinicTypeCode == "0" ? "" : $"{ParaClinicTypeCode} - {ParaclinicTypeCodeName}";

    public string AttenderMSC { get; set; }

    public string AttenderName { get; set; }

    //public string AttenderFullName => (AttenderId == 0 ? "" : $"{AttenderId} - {AttenderName}");
    public string AttenderSpeciality { get; set; }
    public string Comments { get; set; }
    public string PatientMobile { get; set; }
    public string ReferReason { get; set; }
    public int ServiceLaboratoryGroupId { get; set; } = 0;
    public string DiagnosisCode { get; set; } = "";
    public string DiagnosisComment { get; set; } = "";
    public byte? RegisterTaminResult { get; set; }
    public DateTime? RegisterTaminDateTime { get; set; }
    public string RegisterTaminDateTimePersian => RegisterTaminDateTime.ToPersianDateStringNull("{0}/{1}/{2}");
    public byte DeleteTaminResult { get; set; }
    public DateTime? DeleteTaminDateTime { get; set; }
    public string DeleteTaminDateTimePersian => DeleteTaminDateTime.ToPersianDateStringNull("{0}/{1}/{2}");
}

public class SumAdmissionServiceReport
{
    public int Quantity { get; set; }
    public decimal BasicShareAmount { get; set; }
    public decimal CompShareAmount { get; set; }
    public decimal ThirdPartyAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal NetAmount { get; set; }
}

#endregion

#region AdmissionSale

public class GetAdmissionSaleReport : PaginationReport
{
    public string BranchId { get; set; }
    public string StageId { get; set; }
    public string WorkflowId { get; set; }
    public string ActionId { get; set; }
    public string CategoryId { get; set; }
    public string BasicInsurerId { get; set; }
    public string BasicInsurerLineId { get; set; }

    public string CompInsurerId { get; set; }
    public string CompInsurerLineId { get; set; }

    public string ThirdPartyInsurerId { get; set; }
    public string DiscountInsurerId { get; set; }
    public string PatientId { get; set; }

    public string PatientNationalCode { get; set; }
    public int? FromId { get; set; }
    public int? ToId { get; set; }

    public int? FromAdmissionMasterId { get; set; }
    public int? ToAdmissionMasterId { get; set; }


    public string ItemId { get; set; }
    public string ContractTypeId { get; set; }
    public string VendorId { get; set; }
    public string UserId { get; set; }

    public string FromCreateDateTimePersian { get; set; }
    public DateTime? FromDate => FromCreateDateTimePersian.ToMiladiDateTime();
    public string ToCreateDateTimePersian { get; set; }
    public DateTime? ToDate => ToCreateDateTimePersian.ToMiladiDateTime();
}

public class AdmissionSaleReport
{
    public int Id { get; set; }
    public int AdmissionMasterId { get; set; }
    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);

    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);

    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);

    public string CreateDateTimePersian { get; set; }

    public int ItemId { get; set; }
    public string ItemName { get; set; }
    public string Item => IdAndTitle(ItemId, ItemName);
    public string AttributeIds { get; set; }
    public string AttributeName { get; set; }

    public short ItemCategoryId { get; set; }
    public string ItemCategoryName { get; set; }
    public string ItemCategory => IdAndTitle(ItemCategoryId, ItemCategoryName);

    public int UnitId { get; set; }
    public string UnitName { get; set; }
    public string ItemUnit => IdAndTitle(UnitId, UnitName);

    public long ContractTypeId { get; set; }
    public string ContractTypeName { get; set; }
    public string ContractType => IdAndTitle(ContractTypeId, ContractTypeName);

    public long VendorId { get; set; }
    public string VendorFullName { get; set; }
    public string Vendor => ContractTypeId == 1 ? CompanyName : IdAndTitle(VendorId, VendorFullName);

    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string Patient => IdAndTitle(PatientId, PatientFullName);
    public string PatientNationalCode { get; set; }
    public short Quantity { get; set; }
    public decimal ItemActualAmount { get; set; }

    public int BasicInsurerId { get; set; }
    public string BasicInsurerName { get; set; }
    public string BasicInsurer => IdAndTitle(BasicInsurerId, BasicInsurerName);

    public short BasicInsurerLineId { get; set; }
    public string BasicInsurerLineName { get; set; }
    public string BasicInsurerLine => IdAndTitle(BasicInsurerLineId, BasicInsurerLineName);


    public int CompInsurerId { get; set; }
    public string CompInsurerName { get; set; }
    public string CompInsurer => IdAndTitle(CompInsurerId, CompInsurerName);

    public int CompInsurerLineId { get; set; }
    public string CompInsurerLineName { get; set; }
    public string CompInsurerLine => IdAndTitle(CompInsurerLineId, CompInsurerLineName);

    public int ThirdPartyInsurerId { get; set; }
    public string ThirdPartyInsurerName { get; set; }
    public string ThirdPartyInsurer => IdAndTitle(ThirdPartyInsurerId, ThirdPartyInsurerName);

    public int DiscountInsurerId { get; set; }
    public string DiscountInsurerName { get; set; }
    public string DiscountInsurer => IdAndTitle(DiscountInsurerId, DiscountInsurerName);

    public decimal BasicShareAmount { get; set; }
    public decimal PatientShareAmount { get; set; }
    public decimal CompShareAmount { get; set; }
    public decimal ThirdPartyAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal NetAmount { get; set; }
    public decimal VendorCommissionAmount { get; set; }

    public decimal RevenueAmount { get; set; }


    public int CreateUserId { get; set; }
    public string UserFullName { get; set; }
    public string User => IdAndTitle(CreateUserId, UserFullName);

    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);

    public string CompanyName { get; set; }
}

public class SumAdmissionSaleReport
{
    public int Quantity { get; set; }
    public decimal ItemActualAmount { get; set; }
    public decimal BasicShareAmount { get; set; }
    public decimal CompShareAmount { get; set; }
    public decimal ThirdPartyAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal NetAmount { get; set; }
    public decimal VendorCommissionAmount { get; set; }
    public decimal RevenueAmount { get; set; }
}

#endregion

public class GetAdmissionInsuranceSummary : PaginationReport
{
    public string BranchIds { get; set; }
    public string WorkflowIds { get; set; }
    public string StageIds { get; set; }
    public string ActionIds { get; set; }
    public string BasicInsurerIds { get; set; }
    public string BasicInsurerLineIds { get; set; }
    public string CompInsurerIds { get; set; }
    public string CompInsurerLineIds { get; set; }
    public string ThirdPartyInsurerIds { get; set; }
    public string DiscountInsurerIds { get; set; }
    public string ServiceTypeIds { get; set; }
    public string FromReserveDatePersian { get; set; }
    public DateTime FromReserveDate => FromReserveDatePersian.ToMiladiDateTime().Value;
    public string ToReserveDatePersian { get; set; }
    public DateTime ToReserveDate => ToReserveDatePersian.ToMiladiDateTime().Value;

    public byte? IsBasicShareAmount { get; set; }
    public byte? IsCompShareAmount { get; set; }

    public short? ConfirmedBasicSharePrice { get; set; }
    public short? ConfirmedCompSharePrice { get; set; }
    public string OrderBy { get; set; } = "1";
    public byte OrderByDestination { get; set; }
    public byte Type { get; set; }
}

public class AdmissionInsuranceSummary : PaginationReport
{
    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);

    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);

    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);

    public short LineCount { get; set; }
    public short AdmissionCount { get; set; }
    public decimal ServiceActualAmount { get; set; }

    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);
}

public class AdmissionInsuranceSummaryBasicShareAmount : AdmissionInsuranceSummary
{
    public int BasicInsurerId { get; set; }
    public string BasicInsurerName { get; set; }
    public string BasicInsurer => IdAndTitle(BasicInsurerId, BasicInsurerName);
    public decimal BasicShareAmount { get; set; }
    public decimal NotConfirmedBasicShareAmount { get; set; }
    public decimal NetBasicInsurerShareAmount { get; set; }
}

public class AdmissionInsuranceSummaryBasicShareAmountByServiceType : AdmissionInsuranceSummaryBasicShareAmount
{
    public short ServiceTypeId { get; set; }
    public string ServiceTypeName { get; set; }
    public string ServiceType => IdAndTitle(ServiceTypeId, ServiceTypeName);
}

public class AdmissionInsuranceSummaryCompShareAmount : AdmissionInsuranceSummary
{
    public int CompInsurerId { get; set; }
    public string CompInsurerName { get; set; }
    public string CompInsurer => IdAndTitle(CompInsurerId, CompInsurerName);
    public decimal CompShareAmount { get; set; }
    public decimal NotConfirmedCompShareAmount { get; set; }
    public decimal NetCompInsurerShareAmount { get; set; }
}

public class AdmissionInsuranceSummaryCompShareAmountByServiceType : AdmissionInsuranceSummaryCompShareAmount
{
    public short ServiceTypeId { get; set; }
    public string ServiceTypeName { get; set; }
    public string ServiceType => IdAndTitle(ServiceTypeId, ServiceTypeName);
}

public class AdmissionInsuranceSummaryThirdPartyAmount : AdmissionInsuranceSummary
{
    public int ThirdPartyInsurerId { get; set; }
    public string ThirdPartyInsurerName { get; set; }
    public string ThirdPartyInsurer => IdAndTitle(ThirdPartyInsurerId, ThirdPartyInsurerName);
    public decimal ThirdPartyAmount { get; set; }
}

public class AdmissionInsuranceSummaryThirdPartyAmountByServiceType : AdmissionInsuranceSummaryThirdPartyAmount
{
    public short ServiceTypeId { get; set; }
    public string ServiceTypeName { get; set; }
    public string ServiceType => IdAndTitle(ServiceTypeId, ServiceTypeName);
}

public class AdmissionInsuranceSummaryDiscountAmount : AdmissionInsuranceSummary
{
    public int DiscountInsurerId { get; set; }
    public string DiscountInsurerName { get; set; }
    public string DiscountInsurer => IdAndTitle(DiscountInsurerId, DiscountInsurerName);
    public decimal DiscountAmount { get; set; }
}

public class AdmissionInsuranceSummaryDiscountAmountByServiceType : AdmissionInsuranceSummaryDiscountAmount
{
    public short ServiceTypeId { get; set; }
    public string ServiceTypeName { get; set; }
    public string ServiceType => IdAndTitle(ServiceTypeId, ServiceTypeName);
}

public class AdmissionInsuranceSummaryNetAmount : AdmissionInsuranceSummary
{
    public decimal NetAmount { get; set; }
    public decimal NotConfirmedBasicShareAmount { get; set; }
}

public class AdmissionInsuranceSummaryNetAmountByServiceType : AdmissionInsuranceSummaryNetAmount
{
    public short ServiceTypeId { get; set; }
    public string ServiceTypeName { get; set; }
    public string ServiceType => IdAndTitle(ServiceTypeId, ServiceTypeName);
}

public class AdmissionInsuranceSummarySum
{
    public int LineCount { get; set; }
    public int AdmissionCount { get; set; }
    public decimal ServiceActualAmount { get; set; }

    public decimal BasicShareAmount { get; set; }
    public decimal NotConfirmedBasicShareAmount { get; set; }
    public decimal NetBasicInsurerShareAmount { get; set; }

    public decimal CompShareAmount { get; set; }
    public decimal NotConfirmedCompShareAmount { get; set; }
    public decimal NetCompInsurerShareAmount { get; set; }

    public decimal ThirdPartyAmount { get; set; }
    public decimal DiscountAmount { get; set; }

    public decimal NetAmount { get; set; }
}

public class GetServiceTariffReport : PaginationReport
{
    public string ServiceTypeId { get; set; }
    public int? FromServiceId { get; set; }
    public int? ToServiceId { get; set; }
    public int? InsurerId { get; set; }
    public int? InsurerLineId { get; set; }
    public bool? ServiceActive { get; set; }
    public byte InsurerTypeId { get; set; }
    public int? FromNationalCode { get; set; }
    public int? ToNationalCode { get; set; }
}

public class ServiceTariff
{
    public string ServiceTypeName { get; set; }
    public string ServiceTypeCode { get; set; }
    public int ServiceId { get; set; }
    public string ServiceName { get; set; }
    public string Service => IdAndTitle(ServiceId, ServiceName);
    public float ServicePrice { get; set; }
    public float ServicePrice_IPD { get; set; }
    public string ServiceCode { get; set; }
    public int BasicInsurerId { get; set; }
    public string BasicInsurerName { get; set; }
    public string BasicInsurer => IdAndTitle(BasicInsurerId, BasicInsurerName);
    public string BasicInsurerCode { get; set; }
    public string BasicInsuranceBoxCode { get; set; }
    public long BasicInsuranceBoxId { get; set; }
    public string BasicInsuranceBoxName { get; set; }
    public string BasicInsuranceBox => IdAndTitle(BasicInsuranceBoxId, BasicInsuranceBoxName);
    public string BasicPriceTypeName { get; set; }
    public string BasicPriceTypeDesc { get; set; }
    public float BasicPrice { get; set; }
    public float BasicSharePer { get; set; }
    public int CompInsurerId { get; set; }
    public string CompInsurerName { get; set; }
    public string CompInsurer => IdAndTitle(CompInsurerId, CompInsurerName);
    public string CompInsurerCode { get; set; }
    public string CompInsuranceBoxCode { get; set; }
    public long CompInsuranceBoxId { get; set; }
    public string CompInsuranceBoxName { get; set; }
    public string CompInsuranceBox => IdAndTitle(CompInsuranceBoxId, CompInsuranceBoxName);
    public int CompPriceType { get; set; }
    public string CompPriceTypeDesc { get; set; }
    public float CompPrice { get; set; }
    public float CompSharePer { get; set; }
    public int ThridPartyId { get; set; }
    public string ThirdPartyName { get; set; }
    public string ThirdParty => IdAndTitle(ThridPartyId, ThirdPartyName);
    public int ThirdPartyDiscountPer { get; set; }
    public bool ServiceActive { get; set; }
}

public class GetServiceAttenderTariffReport : PaginationReport
{
    //public bool SelectedServices { get; set; }
    public int? AttenderId { get; set; }
    public int? FromServiceId { get; set; }
    public int? ToServiceId { get; set; }
    public string ServiceTypeId { get; set; }
    public short? DepartmentId { get; set; }
    public int? FromCode { get; set; }
    public int? ToCode { get; set; }
    public bool IsActive { get; set; }
}

public class ServiceAttenderTariff
{
    public string DepartmentName { get; set; }
    public string Department => IdAndTitle(DepartmentId, DepartmentName);
    public string NationalCode { get; set; }
    public long SpecialityId { get; set; }
    public string SpecialityName { get; set; }
    public string Speciality => IdAndTitle(SpecialityId, SpecialityName);
    public string MobileNo { get; set; }
    public byte MSC_TypeId { get; set; }
    public int TerminologyId { get; set; }
    public decimal Price { get; set; }
    public decimal Price_IPD { get; set; }
    public int AttenderId { get; set; }
    public string FullName { get; set; }
    public string Attender => IdAndTitle(AttenderId, FullName);
    public int DepartmentId { get; set; }
    public int Code { get; set; }
    public byte CommissInputType { get; set; }
    public string CommissInputTypeDesc { get; set; }
    public int CommissPrice { get; set; }
    public byte AttenderTaxPer { get; set; }
}

public class GetAttenderCommission : PaginationReport
{
    public string BranchId { get; set; }
    public string WorkflowId { get; set; }
    public string StageId { get; set; }
    public string ActionId { get; set; }
    public int? AttenderId { get; set; }
    public DateTime? FromDate => FromDatePersian.ToMiladiDateTime();
    public string FromDatePersian { get; set; }
    public DateTime? ToDate => ToDatePersian.ToMiladiDateTime();
    public string ToDatePersian { get; set; }
    public string DepartmentIds { get; set; }
}

public class GetAdmissionCashReport : PaginationReport
{
    public string ActionId { get; set; }
    public string StageId { get; set; }
    public string WorkflowId { get; set; }

    public string BranchId { get; set; }

    //public short? CounterId { get; set; }
    public short? CurrencyId { get; set; }
    public string FundTypeId { get; set; }
    public string PosIds { get; set; }
    public int? DetailAccountId { get; set; }
    public int? FromAdmissionMasterId { get; set; }
    public int? ToAdmissionMasterId { get; set; }
    public int? FromCashId { get; set; }

    public int? ToCashId { get; set; }

    //public string FromCreateDateTimePersian { get; set; }
    public string FromTime { get; set; }
    public string FromDate { get; set; }

    //public string ToCreateDateTimePersian { get; set; }
    public string ToTime { get; set; }

    public string ToDate { get; set; }

    public int? UserId { get; set; }
    public byte Type { get; set; }
}

public class AdmissionCashReport
{
    public int AdmissionMasterId { get; set; }

    public int CashId { get; set; }

    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);

    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);

    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);

    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);
    public string CashCreateDateTimeLineHeaderPersian { get; set; }
    public int CashUserId { get; set; }
    public string CashUserFullName { get; set; }
    public string CashUser => IdAndTitle(CashUserId, CashUserFullName);

    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string Patient => IdAndTitle(PatientId, PatientFullName);
    public string PatientNationalCode { get; set; }
    public byte FundTypeId { get; set; }
    public string FundTypeName { get; set; }
    public string FundType => IdAndTitle(FundTypeId, FundTypeName);
    public short PosId { get; set; }
    public string PosName { get; set; }
    public string Pos => IdAndTitle(PosId, PosName);
    public string AccountNo { get; set; }
    public byte CurrencyId { get; set; }
    public string CurrencyName { get; set; }
    public string Currency => IdAndTitle(CurrencyId, CurrencyName);
    public int DetailAccountId { get; set; }
    public string DetailAccountName { get; set; }
    public string DetailAccount => IdAndTitle(DetailAccountId, DetailAccountName);
    public decimal ExchangeRate { get; set; }
    public decimal Amount { get; set; }
    public string RefNo { get; set; }
    public string TerminalNo { get; set; }
}

public class SumAdmissionCashReport
{
    public long Amount { get; set; }
    public long ExchangeRate { get; set; }
}

public class AttenderCommission
{
    public int Id { get; set; }
    public int AdmissionMasterId { get; set; }
    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);

    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);

    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);

    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);

    public DateTime? ReserveDate { get; set; }
    public string ReserveDatePersian => ReserveDate.ToPersianDateStringNull("{0}/{1}/{2}");

    public int AttenderId { get; set; }
    public string AttenderFullName { get; set; }
    public string Attender => IdAndTitle(AttenderId, AttenderFullName);

    public string ServiceCode { get; set; }
    public int ServiceId { get; set; }
    public string ServiceName { get; set; }
    public string Service => IdAndTitle(ServiceId, ServiceName);


    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();


    public long DepartmentId { get; set; }
    public string DepartmentName { get; set; }
    public string Department => IdAndTitle(DepartmentId, DepartmentName);

    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string Patient => IdAndTitle(PatientId, PatientFullName);
    public string PatientNationalCode { get; set; }

    public int Qty { get; set; }
    public decimal ServiceActualAmount { get; set; }
    public string AttenderCommissionType { get; set; }
    public decimal AttenderCommissionAmount { get; set; }
    public decimal AttenderPatientGrossAmount { get; set; }
    public decimal AttenderInsurerGrossAmount { get; set; }
    public decimal AttenderGrossAmount { get; set; }
    public decimal AttenderTaxAmount { get; set; }

    public decimal AttenderNetAmount { get; set; }
    public decimal GrossRevenueAmount { get; set; }

    public decimal CompanyBasicShareReimbursementAmount { get; set; }
    public decimal CompanyCompShareReimbursementAmount { get; set; }
    public decimal CompanyReimbursementAmount { get; set; }

    public decimal NetRevenueAmount { get; set; }

    public decimal PenaltyAmount { get; set; }
}

public class AttenderSummeryCommission
{
    public long DepartmentId { get; set; }
    public string DepartmentName { get; set; }
    public string Department => IdAndTitle(DepartmentId, DepartmentName);
    public int AttenderId { get; set; }
    public string AttenderFullName { get; set; }
    public string Attender => IdAndTitle(AttenderId, AttenderFullName);
    public string ServiceCode { get; set; }
    public int ServiceId { get; set; }
    public string ServiceName { get; set; }
    public string Service => IdAndTitle(ServiceId, ServiceName);
    public int Qty { get; set; }
    public decimal ServiceActualAmount { get; set; }
    public string AttenderCommissionType { get; set; }
    public decimal AttenderCommissionAmount { get; set; }
    public decimal AttenderTaxAmount { get; set; }
    public decimal AttenderNetAmount { get; set; }
    public decimal GrossRevenueAmount { get; set; }
    public decimal PenaltyAmount { get; set; }
    public decimal CompanyBasicShareReimbursementAmount { get; set; }
    public decimal CompanyCompShareReimbursementAmount { get; set; }
    public decimal CompanyReimbursementAmount { get; set; }
    public decimal NetRevenueAmount { get; set; }
    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);
}

public class SumAttenderCommission
{
    public int Qty { get; set; }
    public decimal ServiceActualAmount { get; set; }
    public decimal AttenderCommissionAmount { get; set; }
    public decimal AttenderGrossAmount { get; set; }
    public decimal AttenderPatientGrossAmount { get; set; }
    public decimal AttenderInsurerGrossAmount { get; set; }
    public decimal AttenderTaxAmount { get; set; }

    public decimal AttenderNetAmount { get; set; }
    public decimal GrossRevenueAmount { get; set; }
    public decimal CompanyBasicShareReimbursementAmount { get; set; }
    public decimal CompanyCompShareReimbursementAmount { get; set; }
    public decimal CompanyReimbursementAmount { get; set; }
    public decimal NetRevenueAmount { get; set; }
    public decimal PenaltyAmount { get; set; }
}

public class GetAdmissionCashClose : PaginationReport
{
    public short BranchId { get; set; }
    public DateTime? FromWorkDayDate { get; set; }

    public string FromWorkDayDatePersian
    {
        get => FromWorkDayDate.ToPersianDateStringNull("{0}/{1}/{2}");
        set
        {
            var str = value.ToMiladiDateTime();
            FromWorkDayDate = str == null ? null : str.Value;
        }
    }

    public DateTime? ToWorkDayDate { get; set; }

    public string ToWorkDayDatePersian
    {
        get => ToWorkDayDate.ToPersianDateStringNull("{0}/{1}/{2}");
        set
        {
            var str = value.ToMiladiDateTime();
            ToWorkDayDate = str == null ? null : str.Value;
        }
    }

    public int CreateUserId { get; set; }
}

public class AdmissionCashClose
{
    public string TypeName { get; set; }
    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);
    public int CashierId { get; set; }
    public string CashierName { get; set; }
    public string Cashier => IdAndTitle(CashierId, CashierName);
    public byte InOutId { get; set; }
    public string InOutName { get; set; }
    public string InOut => IdAndTitle(InOutId, InOutName);

    public byte FundTypeId { get; set; }
    public string FundTypeName { get; set; }
    public string FundType => IdAndTitle(FundTypeId, FundTypeName);

    public int DetailAccountId { get; set; }
    public string DetailAccountName { get; set; }
    public string DetailAccount => IdAndTitle(DetailAccountId, DetailAccountName);
    public float AnnouncementAmount { get; set; }
    public float RealAmount { get; set; }
}

public class GetAdmissionUserSaleService : PaginationReport
{
    public byte ItemTypeId { get; set; }
    public string BranchId { get; set; }
    public string FromDatePersian { get; set; }
    public DateTime? FromDate => FromDatePersian.ToMiladiDateTime();
    public string ToDatePersian { get; set; }
    public DateTime? ToDate => ToDatePersian.ToMiladiDateTime();
    public string AttenderId { get; set; }
    public object DepartmentId { get; set; }
    public string ActionId { get; set; }
    public string StageId { get; set; }
    public string WorkflowId { get; set; }
    public string VendorId { get; set; }
    public string UserId { get; set; }
}

public class AdmissionUserReportPreview
{
    public int Id { get; set; }
    public int AdmissionMasterId { get; set; }
    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string Patient => IdAndTitle(PatientId, PatientFullName);
    public int CreateUserId { get; set; }
    public string UserFullName { get; set; }
    public string User => IdAndTitle(CreateUserId, UserFullName);
    public string StateName { get; set; }
    public string SaleTypeName { get; set; }
    public string CreateDatePersian { get; set; }
}

public class AdmissionServiceUserReportPreview : AdmissionUserReportPreview
{
    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);
    public string NationalCode { get; set; }
    public long AttenderId { get; set; }
    public string AttenderFullName { get; set; }
    public string Attender => IdAndTitle(AttenderId, AttenderFullName);
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; }
    public string Department => IdAndTitle(DepartmentId, DepartmentName);
    public string ReserveDatePersian { get; set; }
    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);
    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);
    public short WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);
    public decimal ServiceActualAmount { get; set; }
    public decimal BasicShareAmount { get; set; }
    public decimal CompShareAmount { get; set; }
    public decimal ThirdPartyAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal NetAmount { get; set; }
}

public class AdmissionSaleUserReportPreview : AdmissionUserReportPreview
{
    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);
    public string NationalCode { get; set; }
    public int VendorId { get; set; }
    public string VendorFullName { get; set; }
    public string Vendor => IdAndTitle(VendorId, VendorFullName);
    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);
    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);
    public short WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);
    public long ItemActualAmount { get; set; }
    public long BasicShareAmount { get; set; }
    public long CompShareAmount { get; set; }
    public long ThirdPartyAmount { get; set; }
    public long DiscountAmount { get; set; }
    public long NetAmount { get; set; }
    public int ItemPrice { get; set; }
}

public class SumAdmissionSaleUser
{
    public long ItemActualAmount { get; set; }
    public long ServiceActualAmount { get; set; }
    public long BasicShareAmount { get; set; }
    public long CompShareAmount { get; set; }
    public long ThirdPartyAmount { get; set; }
    public long DiscountAmount { get; set; }
    public long NetAmount { get; set; }
}

public class GetAdmissionInsurerReportPreview : PaginationReport
{
    public string FromReserveDatePersian { get; set; }
    public DateTime? FromReserveDate => FromReserveDatePersian.ToMiladiDateTime();
    public string ToReserveDatePersian { get; set; }
    public DateTime? ToReserveDate => ToReserveDatePersian.ToMiladiDateTime();
    public string WorkflowIds { get; set; }
    public string StageIds { get; set; }
    public string ActionIds { get; set; }
    public string BasicInsurerIds { get; set; }
    public string BasicInsurerLineIds { get; set; }
    public string CompInsurerIds { get; set; }
    public string CompInsurerLineIds { get; set; }
    public string ThirdPartyInsurerIds { get; set; }
    public string DiscountInsurerIds { get; set; }

    public string AttenderIds { get; set; }
    public string ReferringDoctorIds { get; set; }
    public string SpecialityIds { get; set; }
    public string DepartmentIds { get; set; }
    public string ServiceTypeIds { get; set; }
    public string ServiceIds { get; set; }
    public short? ConfirmedBasicSharePrice { get; set; }
    public short? ConfirmedCompSharePrice { get; set; }
    public short? ConfirmedThirdPartyPrice { get; set; }
    public string ConfirmedBySystems { get; set; }
    public string OrderBy { get; set; } = "1";
    public byte OrderByDestination { get; set; }
    public byte? IsBasicShareAmount { get; set; }
    public byte? IsCompShareAmount { get; set; }
    public byte? IsThirdPartyAmount { get; set; }
    public byte? IsDiscountAmount { get; set; }
    public byte IsFile { get; set; }
}

public class AdmissionInsurerReportPreview : CompanyViewModel
{
    public int RowNumber { get; set; }
    public int RowNumberAdmission { get; set; }
    public int Id { get; set; }
    public int AdmissionMasterId { get; set; }
    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);

    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);

    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);


    public int PatientId { get; set; }
    public string PatientName { get; set; }
    public string Patient => IdAndTitle(PatientId, PatientName);

    public string NationalCode { get; set; }

    public int ReferringDoctorId { get; set; }
    public string ReferringDoctorFullName { get; set; }
    public string ReferringDoctor => IdAndTitle(ReferringDoctorId, ReferringDoctorFullName);

    public int AttenderId { get; set; }
    public string AttenderName { get; set; }
    public string Attender => IdAndTitle(AttenderId, AttenderName);

    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; }
    public string Department => IdAndTitle(DepartmentId, DepartmentName);

    public string PrescriptionDatePersian { get; set; }
    public string ReserveDatePersian { get; set; }
    public string CreateDatePersian { get; set; }
    public string BasicInsurerExpirationDatePersian { get; set; }

    public string BasicInsurerNo { get; set; }
    public byte GenderId { get; set; }
    public string BasicInsurerBookletPageNo { get; set; }
    public string MSC { get; set; }
    public string HID { get; set; }

    public int BasicInsurerId { get; set; }
    public string BasicInsurerName { get; set; }
    public string BasicInsurer => IdAndTitle(BasicInsurerId, BasicInsurerName);

    public short BasicInsurerLineId { get; set; }
    public string BasicInsurerLineName { get; set; }
    public string BasicInsurerLine => IdAndTitle(BasicInsurerLineId, BasicInsurerLineName);

    public int CompInsurerId { get; set; }
    public string CompInsurerName { get; set; }
    public string CompInsurer => IdAndTitle(CompInsurerId, CompInsurerName);

    public int CompInsurerLineId { get; set; }
    public string CompInsurerLineName { get; set; }
    public string CompInsurerLine => IdAndTitle(CompInsurerLineId, CompInsurerLineName);


    public int ThirdPartyInsurerId { get; set; }
    public string ThirdPartyInsurerName { get; set; }
    public string ThirdPartyInsurer => IdAndTitle(ThirdPartyInsurerId, ThirdPartyInsurerName);

    public int DiscountInsurerId { get; set; }
    public string DiscountInsurerName { get; set; }
    public string DiscountInsurer => IdAndTitle(DiscountInsurerId, DiscountInsurerName);

    public int ServiceTypeId { get; set; }
    public string ServiceTypeName { get; set; }
    public string ServiceType => IdAndTitle(ServiceTypeId, ServiceTypeName);

    public int ServiceId { get; set; }
    public int Code { get; set; }
    public string ServiceName { get; set; }
    public string Service => IdAndTitle(ServiceId, ServiceName);

    public short Qty { get; set; }
    public int ServiceActualAmount { get; set; }
    public int PatientShareAmount { get; set; }
    public int BasicShareAmount { get; set; }
    public int CompShareAmount { get; set; }
    public int ThirdPartyAmount { get; set; }
    public int DiscountAmount { get; set; }
    public int NetAmount { get; set; }

    public AdmissionReimbursmentEnumerator ConfirmedBySystem { get; set; }
    public string ConfirmedBySystemName => ConfirmedBySystem.AdmissionReimbursmentDisplayName();
    public int ConfirmedBasicSharePrice { get; set; }
    public int ConfirmedCompSharePrice { get; set; }
}

public class SumAdmissionInsurerReportPreview
{
    public int Qty { get; set; }
    public long ServiceActualAmount { get; set; }
    public long BasicShareAmount { get; set; }
    public long CompShareAmount { get; set; }
    public long ThirdPartyAmount { get; set; }
    public long DiscountAmount { get; set; }
    public long NetAmount { get; set; }
    public long ConfirmedBasicSharePrice { get; set; }
    public long ConfirmedCompSharePrice { get; set; }
}

public class GetReportParameter
{
    public int UserId { get; set; }
    public string KeyParameter { get; set; } = Guid.NewGuid().ToString().Replace("-", "");
    public ParametersReport ReportType { get; set; }
    public object Parameters { get; set; }
}