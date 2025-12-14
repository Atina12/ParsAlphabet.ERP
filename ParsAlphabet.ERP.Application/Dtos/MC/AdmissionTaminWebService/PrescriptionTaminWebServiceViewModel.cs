namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionTaminWebService;

public class PrescriptionTaminWebServiceViewModel
{
    public int Id { get; set; }
    public int AdmissionServiceTaminId { get; set; }
    public int AttenderId { get; set; }
    public string AttenderFullName { get; set; }
    public string Attender => $"{AttenderId} - {AttenderFullName}";


    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string Patient => $"{PatientId} - {PatientFullName}";
    public string PatientNationalCode { get; set; }


    public DateTime PrescriptionDate { get; set; }
    public string PrescriptionDatePersian => PrescriptionDate.ToPersianDateString("{0}/{1}/{2}");

    public DateTime ExpireDate { get; set; }
    public string ExpireDatePersian => ExpireDate.ToPersianDateString("{0}/{1}/{2}");

    public byte TaminPrescriptionCategoryId { get; set; }
    public string TaminPrescriptionCategoryName { get; set; }
    public string TaminPrescriptionCategory => $"{TaminPrescriptionCategoryId} - {TaminPrescriptionCategoryName}";

    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string CreateUser => $"{CreateUserId} - {CreateUserFullName}";

    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();

    public string TrackingCode { get; set; }
    public string RequestEPrescriptionId { get; set; }

    public bool IsSent { get; set; }
    public bool EditFlg { get; set; }
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

    public DateTime? SendDateTime { get; set; }
    public string SendDateTimePersian => SendDateTime.ToPersianDateStringNull();

    public short WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);

    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);

    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);
    public string OtpCode { get; set; }
}