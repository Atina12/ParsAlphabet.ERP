namespace ParsAlphabet.ERP.Application.Dtos.HR.StandardTimeSheetPerMonth;

public class StandardTimeSheetPerMonthGetRecord
{
    public int Id { get; set; }
    public short StandardTimeSheetId { get; set; }
    public byte MonthId { get; set; }
    public short StandardMonthWorkingHours { get; set; }
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public DateTime CreateDateTime { get; set; } = DateTime.Now;
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();
}

public class ResultSaveStandardTimeSheetPerMonth : MyResultStatus
{
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();
    public int CreateUserId { get; set; }
}