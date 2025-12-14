namespace ParsAlphabet.ERP.Application.Dtos.MC.MedicalShiftTimeSheet;

public class MedicalShiftTimeSheetModel
{
    public string WorkDayDatePersian { get; set; }
    public DateTime WorkDayDate => WorkDayDatePersian.ToMiladiDateTime().Value;
    public short YearId { get; set; }
    public string MonthId { get; set; }
    public string DayId { get; set; }
    public string DayOfWeek { get; set; }
    public string StartTime { get; set; }
    public string EndTime { get; set; }
    public int MedicalTimeShiftId { get; set; }
    public int DepartmentTimeShiftLineId { get; set; }
    public int StandardTimeSheetId { get; set; }
    public bool SelectShift { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime => DateTime.Now;
}