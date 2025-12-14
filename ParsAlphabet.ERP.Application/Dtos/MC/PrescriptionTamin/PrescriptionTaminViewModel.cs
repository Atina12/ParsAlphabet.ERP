using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.Admission;

namespace ParsAlphabet.ERP.Application.Dtos.MC.PrescriptionTamin;

public class NewGetPrescriptionTaminPage : NewGetPageViewModel
{
    public int AttenderId { get; set; }
}

public class PrescriptionTaminGetPage
{
    public int Id { get; set; }
    public int AdmissionId { get; set; }
    public int AdmissionWorkflowId { get; set; }
    public short AdmissionStageId { get; set; }
    public int AdmissionMasterId { get; set; }
    public int ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);
    public int StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);
    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);

    public int BranchId { get; set; }
    public string BranchName { get; set; }
    public string Branch => IdAndTitle(BranchId, BranchName);

    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string Patient => $"{PatientId} - {PatientFullName}";
    public string PatientNationalCode { get; set; }
    public int AttenderId { get; set; }
    public string AttenderFullName { get; set; }
    public string Attender => $"{AttenderId} - {AttenderFullName}";

    public byte TaminPrescriptionCategoryId { get; set; }
    public string TaminPrescriptionCategoryName { get; set; }
    public string TaminPrescriptionCategory => $"{TaminPrescriptionCategoryId} - {TaminPrescriptionCategoryName}";

    public DateTime PrescriptionDate { get; set; }
    public string PrescriptionDatePersian => PrescriptionDate.ToPersianDateString("{0}/{1}/{2}");

    public DateTime ExpireDate { get; set; }
    public string ExpireDatePersian => ExpireDate.ToPersianDateString("{0}/{1}/{2}");

    public string TrackingCode { get; set; }

    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string CreateUser => $"{CreateUserId} - {CreateUserFullName}";

    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();


    public string RequestEPrescriptionId { get; set; }

    public bool flg =>
        CreateDateTime.ToShortDateString() == DateTime.Now.ToShortDateString() || RequestEPrescriptionId == "0"
            ? true
            : false;

    public bool IsSent { get; set; }
    public bool SendResult { get; set; }
    public byte SendResultStatus { get; set; }

    public string SendResultName
    {
        get
        {
            if (SendResultStatus == 0)
                return "ارسال نشده";
            if (SendResultStatus == 1)
                return "ارسال موفق";
            if (SendResultStatus == 3)
                return "ویرایش موفق";
            if (SendResultStatus == 4)
                return "حذف موفق";
            if (SendResultStatus == 5)
                return "ارسال مجدد";
            return "ارسال ناموفق";
        }
    }
}

public class ServicePrescriptionByType : MyDropDownViewModel
{
    public string Code { get; set; }
    public byte Type { get; set; }
}

public class GetPrescriptionTamin
{
    public int Id { get; set; }
    public int AdmissionServiceTaminId { get; set; }
    public int BasicInsurerId { get; set; }
    public string BasicInsrerName { get; set; }
    public int BasicInsuranceBoxId { get; set; }
    public string BasicInsuranceBoxName { get; set; }
    public int ComInsuranceBoxId { get; set; }
    public string CompInsuranceBoxName { get; set; }
    public int AttenderId { get; set; }
    public string AttenderFullName { get; set; }
    public string AttenderMsc { get; set; }
    public string AttenderMobileNo { get; set; }
    public string AttenderNationalCode { get; set; }
    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string PatientNationalCode { get; set; }
    public string PatientMobileNo { get; set; }
    public DateTime PrescriptionDate { get; set; }
    public string PrescriptionDatePersian => PrescriptionDate.ToPersianDateString("{0}/{1}/{2}");
    public string Comment { get; set; }
    public DateTime ExpireDate { get; set; }
    public string ExpireDatePersian => ExpireDate.ToPersianDateString("{0}/{1}/{2}");
    public int TaminPrescriptionCategoryId { get; set; }
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();
    public string PrescriptionLineJson { get; set; }

    public List<GetPrescriptionLine> PrescriptionLines =>
        JsonConvert.DeserializeObject<List<GetPrescriptionLine>>(PrescriptionLineJson);

    public int ThirdPartyId { get; set; }
    public string ThirdPartyName { get; set; }
    public string ThirdParty => $"{Convert.ToInt32(ThirdPartyId)} - {ThirdPartyName}";
    public string RequestEPrescriptionId { get; set; }
    public string OTPCode { get; set; }

    public int WorkflowId { get; set; }
    public short StageId { get; set; }
}

public class GetPrescriptionLine
{
    public int Id { get; set; }
    public int PrescriptionId { get; set; }
    public int ServiceId { get; set; }
    public string ServiceName { get; set; }
    public string TaminPrescriptionTypeId { get; set; }
    public string ServiceCode { get; set; }
    public string ServiceWsCode { get; set; }
    public string ServiceGenericCode { get; set; }

    public string ServiceCodeName
    {
        get
        {
            if (TaminPrescriptionTypeId != "1") return $"{ServiceCode} - {ServiceName}";

            if (!ServiceGenericCode.IsNullOrEmptyOrWhiteSpace())
                return $"{ServiceWsCode} - {ServiceName}";
            return $"{ServiceCode} - {ServiceName}";
        }
    }

    public int Quantity { get; set; }
    public int DrugAmountId { get; set; }
    public string DrugAmountCode { get; set; }
    public string DrugAmountSummary { get; set; }
    public string DrugAmountLatinName { get; set; }
    public string DrugAmountConcept { get; set; }
    public string DrugAmountName => $"{DrugAmountCode} {DrugAmountSummary} {DrugAmountLatinName} - {DrugAmountConcept}";
    public int DrugInstructionId { get; set; }
    public string DrugInstructionCode { get; set; }
    public string DrugInstructionConcept { get; set; }
    public string DrugInstructionName => $"{DrugInstructionCode} - {DrugInstructionConcept}";
    public int DrugUsageId { get; set; }
    public string DrugUsageCode { get; set; }
    public string DrugUsageConcept { get; set; }
    public string DrugUsageName => $"{DrugUsageCode} - {DrugUsageConcept}";
    public string Dose { get; set; }
    public int Repeat { get; set; }
    public DateTime DoDate { get; set; }
    public string DoDatePersian => DoDate.ToPersianDateString("{0}/{1}/{2}");
    public string ParaclinicTareffGroupId { get; set; }
    public string ParGrpCodeName { get; set; }
    public short ParentOrganId { get; set; }
    public string ParentOrganName { get; set; }
    public short OrganId { get; set; }
    public string OrganName { get; set; }
    public byte PlanId { get; set; }
    public string PlanCode { get; set; }
    public string PlanName { get; set; }
    public string PlanCodeName => $"{PlanCode} / {PlanName}";
    public byte IllnessId { get; set; }
    public string IllnessName { get; set; }
    public byte? SendResult { get; set; }
    public DateTime? SendDateTime { get; set; }
    public string NoteDetailsEprscId { get; set; }
}

public class TaminPrescriptionUpdate
{
    public int PrescriptionId { get; set; }
    public string TrackingCode { get; set; }
    public string RequestEPrescriptionId { get; set; }
    public short SendResult { get; set; }
    public DateTime SendDateTime { get; set; }
    public string OTPCode { get; set; }
}

public class TaminDeleteEPrescriptionModel
{
    public List<string> Ids { get; set; }
    public string OtpCode { get; set; }
}

public class ServicePrescription
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Code { get; set; }
    public string TaminPrescriptionTypeId { get; set; }
    public string TaminPrescriptionTypeName { get; set; }
    public string Status { get; set; }
    public string PrescriptionTypeId { get; set; }
    public string BimSw { get; set; }
    public string GCode { get; set; }
    public string WsCode { get; set; }
    public string ParaclinicTareffCode { get; set; }
}

public class ServicePrescriptionMyResultStatusViewModel : MyResultStatus
{
    public string RequestEPrescriptionId { get; set; }
    public byte? ActionId { get; set; }
    public string ActionName { get; set; }
    public string Action => IdAndTitle(ActionId, ActionName);
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2}");
}

public class MyResultPrescriptionTamin : MyResultStatus
{
    public string PrescriptionServiceTypeId { get; set; }
}

public class GetDeletePrescriptionTamin
{
    public int Id { get; set; }
    public int WorkflowId { get; set; }
    public short StageId { get; set; }
    public int AdmissionId { get; set; }
    public int AdmissionWorkflowId { get; set; }
    public short AdmissionStageId { get; set; }
}

public class PrintPatientPrescriptionTaminViewModel
{
    public string CreateDatePersian { get; set; }
    public string SendDatePersian { get; set; }
    public string RequestEPrescriptionId { get; set; }
    public string TrackingCode { get; set; }
    public int WorkflowId { get; set; }
    public string WorkflowName { get; set; }

    public short StageId { get; set; }
    public string StageName { get; set; }

    public int AttenderId { get; set; }
    public string AttenderName { get; set; }
    public string MSC { get; set; }

    public int SpecialityId { get; set; }
    public string SpecialtyName { get; set; }

    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string PatientNationalCode { get; set; }

    public int AdmissionId { get; set; }
    public int AdmissionMasterId { get; set; }
    public string PrescriptionCategoryName { get; set; }
    public string Comment { get; set; }
    public int AdmissionServiceLineId { get; set; }
    public int ServiceId { get; set; }
    public string ServiceName { get; set; }
    public int Qty { get; set; }
    public short BranchId { get; set; }
    public string BranchName { get; set; }
    public string BranchAddress { get; set; }
    public string JsonBranchLine { get; set; }

    public List<BranchLineInfoPrint> BranchLineInfoList
        => JsonConvert.DeserializeObject<List<BranchLineInfoPrint>>(JsonBranchLine);
}