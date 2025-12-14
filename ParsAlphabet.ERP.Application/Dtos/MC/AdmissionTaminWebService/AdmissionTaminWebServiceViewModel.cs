namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionTaminWebService;

public class AdmissionTaminWebServiceViewModel
{
    public int Id { get; set; }
    public string RequestEPrescriptionId { get; set; }
    public int AttenderId { get; set; }
    public string AttenderFullName { get; set; }
    public string Attender => $"{AttenderId} - {AttenderFullName}";
    public int PatientId { get; set; }
    public string PatientFullName { get; set; }
    public string Patient => $"{PatientId} - {PatientFullName}";
    public string PatientNationalCode { get; set; }
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string CreateUser => $"{CreateUserId} - {CreateUserFullName}";
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();
    public byte StateId { get; set; }
    public string StateName { get; set; }
    public string State => $"{StateId} - {StateName}";
    public DateTime StateDateTime { get; set; }
    public string StateDateTimePersian => StateDateTime.ToPersianDateString();

    public string RegisterPrescriptionId { get; set; }
    public string InqueryID { get; set; }

    public bool SendEPrescription { get; set; }
    public byte SendEPrescriptionResult { get; set; }

    public string SendEPrescriptionResultName
    {
        get
        {
            if (SendEPrescriptionResult == 0)
                return "ارسال نشده";
            if (SendEPrescriptionResult == 1)
                return "ارسال موفق";
            return "ارسال ناموفق";
        }
    }

    public DateTime? SendEPrescriptionDateTime { get; set; }
    public string SendEPrescriptionDateTimePersian => SendEPrescriptionDateTime.ToPersianDateStringNull();
    public byte DeleteEPrescriptionResult { get; set; }

    public string DeleteEPrescriptionResultName
    {
        get
        {
            if (DeleteEPrescriptionResult == 0)
                return "ارسال نشده";
            if (DeleteEPrescriptionResult == 1)
                return "ارسال موفق";
            return "ارسال ناموفق";
        }
    }

    public DateTime? DeleteEPrescriptionDateTime { get; set; }
    public string DeleteEPrescriptionDateTimePersian => DeleteEPrescriptionDateTime.ToPersianDateStringNull();
    public string ParaClinicTypeName { get; set; }
    public string ParaclinicTypeCode { get; set; }
    public string ParaclinicType => $"{ParaclinicTypeCode} - {ParaClinicTypeName}";

    public short WorkflowId { get; set; }
    public string WorkflowName { get; set; }
    public string Workflow => IdAndTitle(WorkflowId, WorkflowName);

    public short StageId { get; set; }
    public string StageName { get; set; }
    public string Stage => IdAndTitle(StageId, StageName);

    public byte ActionId { get; set; }
    public string ActionName { get; set; }
    public string ActionIdName => IdAndTitle(ActionId, ActionName);
}

public class UpdateAdmissionTaminResult
{
    public int AdmissionTaminId { get; set; }
    public string RegisterPrescriptionId { get; set; }
    public byte RegisterTaminResult { get; set; }
    public string RegisterTaminDatePersian { get; set; }

    public DateTime? RegisterTaminDateTime { get; set; } =
        DateTime.Now; //=> RegisterTaminDatePersian.ToMiladiDateTime();
}

public class DeleteAdmissionTaminResult
{
    public int AdmissionTaminId { get; set; }
    public byte DeleteTaminResult { get; set; }
    public DateTime DeleteTaminDateTime { get; set; } = DateTime.Now;
}