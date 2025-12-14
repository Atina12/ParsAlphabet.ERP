namespace ParsAlphabet.ERP.Application.Dtos.GN.FiscalYearLine;

public class FiscalYearLineGetPage
{
    public int Id { get; set; }
    public byte MonthId { get; set; }
    public string MonthName { get; set; }
    public string StartDatePersian { get; set; }
    public string EndDatePersian { get; set; }
    public bool Locked { get; set; }
}

public class FiscalYearLineGetRecord
{
    public byte HeaderId { get; set; }
    public byte MonthId { get; set; }
    public DateTime StartDate { get; set; }
    public string StartDatePersian => StartDate.ToPersianDateString("{0}/{1}/{2}");
    public DateTime EndDate { get; set; }
    public string EndDatePersian => EndDate.ToPersianDateString("{0}/{1}/{2}");
    public bool Locked { get; set; }
}

public class Get_FiscalYearLine
{
    public byte HeaderId { get; set; }
    public byte MonthId { get; set; }
}