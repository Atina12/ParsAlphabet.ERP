namespace ParsAlphabet.ERP.Application.Dtos.MC.AdmissionCartable;

public class PatientReservedDateModel
{
    public Guid FromAttenderScheduleBlockId { get; set; }
    public Guid ToAttenderScheduleBlockId { get; set; }
    public int ReserveUserId { get; set; }
    public DateTime ReserveDateTime => DateTime.Now;
}

public class PatientReservedMoveModel
{
    public string FromAttenderScheduleBlockIds { get; set; }
    public string FromWorkDayDate { get; set; }
    public string ToWorkDayDate { get; set; }
    public int? DepartmentTimeShiftId { get; set; }
    public int AttenderId { get; set; }
    public TimeSpan StartTime { get; set; }
    public byte IsOnline { get; set; }

    public int ReserveUserId { get; set; }
    public DateTime ReserveDateTime => DateTime.Now;
}

public class PatientReservedShiftModel
{
    public Guid FromAttenderScheduleBlockIds { get; set; }
    public short ShiftNo { get; set; }
    public int ReserveUserId { get; set; }
    public DateTime ReserveDateTime => DateTime.Now;
}