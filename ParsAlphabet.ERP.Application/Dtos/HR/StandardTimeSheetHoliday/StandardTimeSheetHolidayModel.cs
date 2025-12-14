namespace ParsAlphabet.ERP.Application.Dtos.HR.StandardTimeSheetHoliday;

public class StandardTimeSheetHolidayModel : CompanyViewModel
{
    public int Id { get; set; }
    public int HeaderId { get; set; }
    public string HolidayDatePersian { get; set; }
    public DateTime? HolidayDate => HolidayDatePersian.ToMiladiDateTime();
    public byte MonthId { get; set; }
    public byte DayId { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime { get; set; } = DateTime.Now;
}