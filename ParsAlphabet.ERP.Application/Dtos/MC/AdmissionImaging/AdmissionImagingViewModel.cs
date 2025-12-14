namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionImaging;

public class AdmissionImagingGetRecord
{
    public int Id { get; set; }
    public int AdmissionId { get; set; }
    public int AdmissionMasterId { get; set; }

    public int AttenderId { get; set; }
    public string AttenderFullName { get; set; }
    public string MscAttender { get; set; }
    public byte AttenderGenderId { get; set; }

    public byte ActionId { get; set; }

    public short StageId { get; set; }
    public int WorkflowId { get; set; }
    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string PatientNationalCode { get; set; }
    public DateTime? PatientBirthDate { get; set; }
    public string PatientBirthDatePersian => PatientBirthDate.ToPersianDateStringNull();
    public string Content { get; set; }
    public DateTime CreateDateTime { get; set; }
    public string CreateDatePersian => CreateDateTime.ToPersianDateString();

    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }

    public DateTime AdmissionDateTime { get; set; }
    public string AdmissionDateTimePersian { get; set; }

    public int CompanyId { get; set; }
    public string CompanyName { get; set; }

    public int BasicInsurerId { get; set; }
    public string BasicInsurerName { get; set; }
    public short BasicInsurerLineId { get; set; }
    public string BasicInsurerLineName { get; set; }
    public int CompInsurerId { get; set; }
    public string CompInsurerName { get; set; }
    public int CompInsurerLineId { get; set; }
    public string CompInsurerLineName { get; set; }
    public int ThirdPartyId { get; set; }
    public string ThirdPartyName { get; set; }

    public int DiscountId { get; set; }
    public string DiscountName { get; set; }
    public string BasicInsurerNo { get; set; }
    public short ReferringDoctorId { get; set; }
    public string ReferringDoctorName { get; set; }

    public DateTime? BasicInsurerExpirationDate { get; set; }

    public string BasicInsurerExpirationDatePersian =>
        BasicInsurerExpirationDate.ToPersianDateStringNull("{0}/{1}/{2}");

    public DateTime PrescriptionDate { get; set; }
    public string PrescriptionDatePersian { get; set; }
}

public class NextAdmissionImagingModel
{
    public int AdmissionImagingId { get; set; }
    public int HeaderPagination { get; set; }
}

public class AdmissionImagingDelete
{
    public int AdmissionId { get; set; }
    public int AdmissionWorkflowId { get; set; }
    public int AdmissionStageId { get; set; }

    public int Id { get; set; }
    public int WorkflowId { get; set; }
    public int StageId { get; set; }
}

public class AdmissionImagingCheckPermissionViewModel : CompanyViewModel
{
    public int Id { get; set; }
    public byte RoleId { get; set; }
    public int WorkflowId { get; set; }
    public short BranchId { get; set; }
    public short StageId { get; set; }
    public byte ActionId { get; set; }
}