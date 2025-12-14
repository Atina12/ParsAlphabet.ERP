namespace ParsAlphabet.ERP.Application.Dtos.HR.StandardTimeSheetHoliday;

public class StandardTimeSheetHolidayGetPage
{
    public int? Id { get; set; }
    public short FiscalYear { get; set; }
    public byte MonthId { get; set; }
    public string DayId { get; set; }
    public byte DayOfWeek => DayOfWeek(FiscalYear, MonthId, DayId);
    public string DayName => GetDayName(DayOfWeek);
    public bool IsHoliday { get; set; }
    public int? CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserFullName);
    public DateTime? CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateStringNull();
    public byte MedicalShiftCount { get; set; }
}

public class ResultSaveStandardTimeSheetHoliday : MyResultStatus
{
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();
    public int CreateUserId { get; set; }
}