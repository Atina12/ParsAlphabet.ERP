namespace ParseAlphabet.ERP.Web.Modules._Dashboard;

public class DashboardWeather
{
    public string CityName { get; set; }
    public string DayName { get; set; }
    public string Temperature { get; set; }
    public string TemperatureMin { get; set; }
    public string TemperatureMax { get; set; }
    public string Status { get; set; }
    public string IconName { get; set; }
}

public class DashboardCalendar
{
    public int Year { get; set; }
    public int Month { get; set; }
    public int Day { get; set; }
    public int MonthDaysCount { get; set; }
    public string MonthName { get; set; }
    public int DayOfWeek { get; set; }
    public string DayOfWeekName { get; set; }
    public int FirstDayOfMonthDayOfWeek { get; set; }
    public bool IsKabiseYear { get; set; }
    public int[] MonthHoliDays { get; set; }
}

public class CalendarHoliDays
{
    public int Year { get; set; }
    public int Month { get; set; }
    public int Day { get; set; }
}