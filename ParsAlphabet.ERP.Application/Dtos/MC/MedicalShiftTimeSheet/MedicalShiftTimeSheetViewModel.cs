namespace ParsAlphabet.ERP.Application.Dtos.MC.MedicalShiftTimeSheet;

public class GetMonthDayMedicalShiftTimeSheet
{
    public int StandardTimeSheetId { get; set; }
    public short YearId { get; set; }
    public string MonthId { get; set; }
    public string MonthDestination { get; set; }
    public int CreateUserId { get; set; }
}

public class MonthDayMedicalShiftTimeSheet
{
    public int MedicalTimeShiftId { get; set; }
    public int StandardTimeSheetId { get; set; }
    public int DepartmentTimeShiftLineId { get; set; }
    public short YearId { get; set; }
    public string MonthId { get; set; }
    public string DayId { get; set; }

    public string StartTime { get; set; }
    public string EndTime { get; set; }

    public string WorkDayDatePersian => $"{YearId}/{MonthId}/{DayId}";
    public DateTime WorkDayDate => WorkDayDatePersian.ToMiladiDateTime().Value;
}

public class SaveResultMedicalShiftTimeSheet : MyResultStatus
{
    public int MedicalTimeShiftId { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();
}