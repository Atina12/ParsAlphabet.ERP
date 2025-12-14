using System.Web;

namespace ParsAlphabet.ERP.Application.Dtos.MC.ReportImaging;

public class ImagingReportInputModel : PaginationReport
{
    public int? Id { get; set; }
    public int? BranchIds { get; set; }
    public string WorkflowIds { get; set; }
    public string StageIds { get; set; }
    public int? AdmissionId { get; set; }
    public int? AdmissionMasterId { get; set; }
    public string PatientIds { get; set; }
    public string PatientNationalCode { get; set; }
    public string BasicInsurerIds { get; set; }
    public string BasicInsurerLineIds { get; set; }
    public string CompInsurerIds { get; set; }
    public string CompInsurerLineIds { get; set; }
    public string ThirdPartyInsurerIds { get; set; }
    public string DiscountInsurerIds { get; set; }
    public string FromCreateDatePersian { get; set; }
    public DateTime? FromCreateDate => FromCreateDatePersian.ToMiladiDateTime();
    public string ToCreateDatePersian { get; set; }
    public DateTime? ToCreateDate => ToCreateDatePersian.ToMiladiDateTime();
    public string ActionIds { get; set; }
    public int? CreateUserId { get; set; }
    public string AttenderIds { get; set; }
    public string DepartmentIds { get; set; }
    public string SpecialtyIds { get; set; }
    public string ServiceTypeIds { get; set; }
    public string ServiceIds { get; set; }
}

public class ImagingReport
{
    public int Id { get; set; }
    public int AdmissionMasterId { get; set; }
    public int AdmissionId { get; set; }

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

    public int ServiceTypeId { get; set; }
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
    public string CreateUserFullName { get; set; }
    public string User => IdAndTitle(CreateUserId, CreateUserFullName);
}

public class SumImagingReport
{
    public int Quantity { get; set; }
    public decimal ServiceActualAmount { get; set; }
    public decimal BasicShareAmount { get; set; }
    public decimal CompShareAmount { get; set; }
    public decimal ThirdPartyAmount { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal NetAmount { get; set; }
}

public class AdmissionImagingPrint
{
    public int Id { get; set; }
    public int AdmissionId { get; set; }
    public int AdmissionMasterId { get; set; }
    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string PatientNationalCode { get; set; }
    public DateTime? PatientBirthDate { get; set; }
    public string PatientBirthDatePersian => PatientBirthDate.ToPersianDateStringNull();
    public string Content { get; set; }
    public string DecodedContent => HttpUtility.HtmlDecode(Content);
    public DateTime CreateDateTime { get; set; }
    public string CreateDatePersian => CreateDateTime.ToPersianDateString();
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public DateTime AdmissionDateTime { get; set; }
    public string AdmissionDateTimePersian => AdmissionDateTime.ToPersianDateString("{0}/{1}/{2}");
    public int CompanyId { get; set; }
    public string CompanyName { get; set; }
    public short ReferringDoctorId { get; set; }
    public string ReferringDoctorName { get; set; }
    public DateTime PrescriptionDate { get; set; }
    public string PrescriptionDatePersian => PrescriptionDate.ToPersianDateString("{0}/{1}/{2}");
}