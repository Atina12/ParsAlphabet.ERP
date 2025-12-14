namespace ParsAlphabet.ERP.Application.Dtos.HR.StandardTimeSheetPerMonth;

public class StandardTimeSheetPerMonthModel : CompanyViewModel
{
    public int Id { get; set; }
    public short StandardTimeSheetId { get; set; }
    public byte MonthId { get; set; }
    public short StandardMonthWorkingHours { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime { get; set; } = DateTime.Now;
}