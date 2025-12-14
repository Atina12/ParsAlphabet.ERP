using Newtonsoft.Json;

namespace ParsAlphabet.ERP.Application.Dtos.HR.StandardTimeSheet;

public class StandardTimeSheetGetPage : CompanyViewModel
{
    public short Id { get; set; }
    public string Name { get; set; }

    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; }
    public string Department => IdAndTitle(DepartmentId, DepartmentName);

    public short FiscalYearId { get; set; }
    public string FiscalYearName { get; set; }
    public string FiscalYear => IdAndTitle(FiscalYearId, FiscalYearName);

    public DateTime StartDate { get; set; }
    public string StartDatePersian => StartDate.ToPersianDateString("{0}/{1}/{2}");

    public DateTime EndDate { get; set; }
    public string EndDatePersian => EndDate.ToPersianDateString("{0}/{1}/{2}");

    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();

    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public string CreateUser => IdAndTitle(CreateUserId, CreateUserFullName);

    public bool IsActive { get; set; }
}

public class StandardTimeSheetGetRecord : CompanyViewModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int FiscalYearId { get; set; }
    public int DepartmentId { get; set; }
    public int CreateUserId { get; set; }
    public DateTime StartDate { get; set; }
    public string StartDatePersian => StartDate.ToPersianDateString("{0}/{1}/{2}");
    public DateTime EndDate { get; set; }
    public string EndDatePersian => EndDate.ToPersianDateString("{0}/{1}/{2}");
    public DateTime CreateDateTime { get; set; }
    public string CreateDatetimePersian => CreateDateTime.ToPersianDateString("{0}/{1}/{2}");
    public string Description { get; set; }
    public bool IsActive { get; set; }
}

public class StandardTimeSheetDisplay
{
    public int DepartmentId { get; set; }
    public byte Id { get; set; }
    public string Name { get; set; }
    public string Days { get; set; }
    public List<StandardTimeSheetDays> DayList => JsonConvert.DeserializeObject<List<StandardTimeSheetDays>>(Days);
}

public class StandardTimeSheetMonth
{
    public int StandardTimeSheetId { get; set; }
    public short DepartmentId { get; set; }
    public byte Id { get; set; }
    public string Name { get; set; }
    public string DaysJson { get; set; }
    public List<StandardTimeSheetDays> DayList => JsonConvert.DeserializeObject<List<StandardTimeSheetDays>>(DaysJson);

    public string MonthJson { get; set; }
    public StandardTimeSheetPerMonth Month => JsonConvert.DeserializeObject<StandardTimeSheetPerMonth>(MonthJson);
}

public class StandardTimeSheetDays
{
    public string DayId { get; set; }
    public string MonthId { get; set; }
    public short FiscalYear { get; set; }
    public bool IsHoliday { get; set; }

    public byte DayOfWeek
    {
        get
        {
            var shamsiDate = $"{FiscalYear}/{MonthId}/{DayId}";
            var miladiDate = shamsiDate.ToMiladiDateTime().Value;

            var dayOfWeek = (byte)miladiDate.DayOfWeek;
            var dayWeekId = Convert.ToByte(dayOfWeek < 6 ? dayOfWeek + 1 : dayOfWeek - 6);

            return dayWeekId;
        }
    }
}

public class StandardTimeSheetPerMonth
{
    public short FiscalYear { get; set; }
    public string MonthId { get; set; }
    public short StandardMonthWorkingHours { get; set; }
    public int CreateUserId { get; set; }
    public string CreateUserFullName { get; set; }
    public DateTime CreateDateTime { get; set; }
    public string CreateDateTimePersian => CreateDateTime.ToPersianDateString();
}

public class StandardTimeSheetDuplicate
{
    public int FromTimeSheetId { get; set; }
    public string FromMonthId { get; set; }
    public int ToTimeSheetId { get; set; }
    public string ToMonthId { get; set; }
    public int CreateUserId { get; set; }
    public DateTime CreateDateTime => DateTime.Now;
    public byte Type { get; set; }
}

public class StandardTimeSheetInfo
{
    public int Id { get; set; }
    public int DepartmentId { get; set; }
    public string Name { get; set; }
    public int FiscalYearId { get; set; }
    public string FiscalYearName { get; set; }
    public DateTime StartDate { get; set; }
    public string StartDatePersian => StartDate.ToPersianDateString("{0}/{1}/{2}");
    public DateTime EndDate { get; set; }
    public string EndDatePersian => EndDate.ToPersianDateString("{0}/{1}/{2}");
    public int HolidayCount { get; set; }
    public int ShiftCount { get; set; }
}