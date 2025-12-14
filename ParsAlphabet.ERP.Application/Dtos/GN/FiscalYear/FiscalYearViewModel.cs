namespace ParsAlphabet.ERP.Application.Dtos.GN.FiscalYear;

public class FiscalYearGetPage
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string StartDatePersian { get; set; }
    public string EndDatePersian { get; set; }
    public bool Closed { get; set; }
}

public class FiscalYearGetRecord
{
    public int Id { get; set; }
    public string Name { get; set; }
    public DateTime StartDate { get; set; }
    public string StartDatePersian => StartDate.ToPersianDateString("{0}/{1}/{2}");
    public DateTime EndDate { get; set; }
    public string EndDatePersian => EndDate.ToPersianDateString("{0}/{1}/{2}");
    public bool Closed { get; set; }
}

public class FiscalYearDateRange
{
    public DateTime StartDate { get; set; }
    public string StartDatePersian => StartDate.ToPersianDateString("{0}/{1}/{2}");
    public DateTime EndDate { get; set; }
    public string EndDatePersian => EndDate.ToPersianDateString("{0}/{1}/{2}");
}

public class FiscalYearDatePeriodViewModel : MyResultStatus
{
    public int FiscalYearId { get; set; }
    public byte MonthId { get; set; }
}