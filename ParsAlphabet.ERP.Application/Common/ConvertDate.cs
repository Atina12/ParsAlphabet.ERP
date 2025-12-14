using System.Globalization;

namespace ParsAlphabet.ERP.Application.Common;

public static class ConvertDate
{
    public static string ToPersianDateString(this DateTime enDate, string format = "{0}/{1}/{2} {3}:{4}:{5}")
    {
        try
        {
            var pc = new PersianCalendar();
            return string.Format(
                format,
                pc.GetYear(enDate).ToString("0000"),
                pc.GetMonth(enDate).ToString("00"),
                pc.GetDayOfMonth(enDate).ToString("00"),
                pc.GetHour(enDate).ToString("00"),
                pc.GetMinute(enDate).ToString("00"),
                pc.GetSecond(enDate).ToString("00"),
                pc.GetMilliseconds(enDate).ToString("0000"));
        }
        catch
        {
            return string.Empty;
        }
    }
    public static string ToPersianDateString(this DateOnly enDate, string format = "{0}/{1}/{2}")
    {
        try
        {
            var pc = new PersianCalendar();
            var dateTime = enDate.ToDateTime(TimeOnly.MinValue); // تبدیل به DateTime (با ساعت 00:00:00)

            return string.Format(
                format,
                pc.GetYear(dateTime).ToString("0000"),
                pc.GetMonth(dateTime).ToString("00"),
                pc.GetDayOfMonth(dateTime).ToString("00")
            );
        }
        catch
        {
            return string.Empty;
        }
    }


    public static string ToPersianDateStringNull(this DateTime? enDate, string format = "{0}/{1}/{2} {3}:{4}:{5}")
    {
        try
        {
            var pc = new PersianCalendar();


            if (!enDate.HasValue)
                return string.Empty;
            return string.Format(
                format,
                pc.GetYear(enDate.Value).ToString("0000"),
                pc.GetMonth(enDate.Value).ToString("00"),
                pc.GetDayOfMonth(enDate.Value).ToString("00"),
                pc.GetHour(enDate.Value).ToString("00"),
                pc.GetMinute(enDate.Value).ToString("00"),
                pc.GetSecond(enDate.Value).ToString("00"),
                pc.GetMilliseconds(enDate.Value).ToString("0000"));
        }
        catch
        {
            return string.Empty;
        }
    }

    public static DateTime? ToMiladiDateTime(this string persianDate)
    {
        try
        {
            if (persianDate.IsEmpty())
                return null;
            var pc = new PersianCalendar();

            var NightDay = persianDate.Contains("ب.ظ") | persianDate.Contains("PM");
            persianDate = persianDate.Replace("ق.ظ", string.Empty).Replace("ب.ظ", string.Empty)
                .Replace("AM", string.Empty).Replace("PM", string.Empty).Trim();

            var date = persianDate.Split('/', ':', ' ').Select(s => Convert.ToInt32(s.Trim(' '))).ToArray();

            var datetime = pc.ToDateTime(date.GetInt(0), date.GetInt(1), 1, 0, 0, 0, 0);

            var daysInMonth = DateTime.DaysInMonth(datetime.Year, datetime.Month);

            var lastDay = DaysOfMonth313029(date.GetInt(0), date.GetInt(1), date.GetInt(2));

            if (lastDay == 30 || lastDay == 29)
            {
                var day = date.GetInt(2);
                if (day > lastDay)
                    return pc.ToDateTime(
                        date.GetInt(0),
                        date.GetInt(1),
                        lastDay,
                        date.GetInt(3) + (NightDay ? 12 : 0),
                        date.GetInt(4),
                        date.GetInt(5),
                        0);
            }

            return pc.ToDateTime(
                date.GetInt(0),
                date.GetInt(1),
                date.GetInt(2),
                date.GetInt(3) + (NightDay ? 12 : 0),
                date.GetInt(4),
                date.GetInt(5),
                0);
        }
        catch (Exception)
        {
            return null;
        }
    }

    private static int GetInt(this int[] date, int index)
    {
        return index < date.Count() ? date[index] : 0;
    }

    public static bool IsEmpty(this string input)
    {
        return string.IsNullOrEmpty(input) || string.IsNullOrWhiteSpace(input);
    }


    public static int DaysOfMonth313029(int year, int month, int day)
    {
        var halfYear1 = new List<int> { 1, 2, 3, 4, 5, 6 };
        var halfYear2 = new List<int> { 7, 8, 9, 10, 11 };


        if (halfYear1.Any(x => x == month)) return 31;

        if (halfYear2.Any(x => x == month)) return 30;

        var pc = new PersianCalendar();
        var datetime = pc.ToDateTime(year, month, day, 0, 0, 0, 0);

        if (DateTime.IsLeapYear(datetime.Year))
            return 30;
        return 29;
    }
}