namespace ParsAlphabet.ERP.Application.Dtos.MC.MedicalShiftTimeSheet;

public class ConvertAttenderScheduleBlockFromCentral
{
    public Guid AttenderScheduleBlockId { get; set; }
    public int PatientIdCentral { get; set; }
    public int PatientId { get; set; }
    public string PatientFullNameCentral { get; set; }
    public string PatientFullName { get; set; }
    public string PatientNationalCodeCentral { get; set; }
    public string PatientNationalCode { get; set; }
    public int AdmissionIdCentral { get; set; }
    public int AdmissionId { get; set; }
    public DateTime ReserveDateTimeCentral { get; set; }
    public string ReserveDateTimeCentralPersian => ReserveDateTimeCentral.ToPersianDateString("{0}/{1}/{2}");
    public DateTime ReserveDateTime { get; set; }
    public string ReserveDateTimePersian => ReserveDateTime.ToPersianDateString("{0}/{1}/{2}");
    public int AttenderId { get; set; }
    public string AttenderFullName { get; set; }
}