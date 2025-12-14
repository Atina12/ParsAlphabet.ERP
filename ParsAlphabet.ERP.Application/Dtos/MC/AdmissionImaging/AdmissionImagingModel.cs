using System.ComponentModel;

namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionImaging;

[DisplayName("AdmissionImaging")]
public class AdmissionImagingModel : CompanyViewModel
{
    public int Id { get; set; }
    public short BranchId { get; set; }
    public int WorkflowId { get; set; }
    public short StageId { get; set; }
    public byte ActionId { get; set; }
    public int AdmissionId { get; set; }
    public int AdmissionWorkflowId { get; set; }
    public short AdmissionStageId { get; set; }
    public byte AdmissionWorkflowCategoryId { get; set; }
    public int AttenderId { get; set; }
    public int PatientId { get; set; }
    public string Content { get; set; }
    public DateTime CreateDateTime => DateTime.Now;
    public int CreateUserId { get; set; }
    public int BasicInsurerId { get; set; }
    public short BasicInsurerLineId { get; set; }
    public int CompInsurerId { get; set; }
    public int CompInsurerLineId { get; set; }
    public short ThirdPartyId { get; set; }
    public short DiscountId { get; set; }
    public string HID { get; set; }
    public string BasicInsurerExpirationDatePersian { get; set; }
    public DateTime? BasicInsurerExpirationDate => BasicInsurerExpirationDatePersian.ToMiladiDateTime();

    public string BasicInsurerNo { get; set; }
    public List<ID> Templates { get; set; }
}

public class AdmissionImagingGetPage
{
    public int Id { get; set; }
    public int AdmissionMasterId { get; set; }
    public int AdmissionId { get; set; }
    public int AdmissionWorkflowId { get; set; }
    public short AdmissionStageId { get; set; }

    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);

    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);


    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);


    public int AttenderId { get; set; }
    public string AttenderFullName { get; set; }
    public string Attender => IdAndTitle(AttenderId, AttenderFullName);


    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string Patient => IdAndTitle(PatientId, PatientFullName);
    public string PatientNationalCode { get; set; }


    public int ReferringDoctorId { get; set; }
    public string ReferringDoctorName { get; set; }
    public string ReferringDoctor => IdAndTitle(ReferringDoctorId, ReferringDoctorName);


    public DateTime? PrescriptionDate { get; set; }
    public string PrescriptionDatePersian => PrescriptionDate.ToPersianDateStringNull("{0}/{1}/{2}");

    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();

    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string User => IdAndTitle(CreateUserId, CreateUserFullName);
}