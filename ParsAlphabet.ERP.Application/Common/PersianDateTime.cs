using System.Globalization;

namespace ParsAlphabet.ERP.Application.Common;

public static class PersianDateTime
{
    public static string GetShamsiDate(string MiladiDate)
    {
        long shdate;
        string shdate_s;
        var yy = Convert.ToInt32(MiladiDate.Substring(0, 4));
        var mm = Convert.ToInt32(MiladiDate.Substring(5, 2));
        var dd = Convert.ToInt32(MiladiDate.Substring(8, 2));
        var pcal = new PersianCalendar();
        var myDate = new DateTime(yy, mm, dd);
        yy = pcal.GetYear(myDate);
        mm = pcal.GetMonth(myDate);
        dd = pcal.GetDayOfMonth(myDate);
        shdate = yy * 10000 + mm * 100 + dd;
        shdate_s = shdate.ToString().Substring(0, 4) + "/" + shdate.ToString().Substring(4, 2) + "/" +
                   shdate.ToString().Substring(6, 2);
        return shdate_s;
    }

    public static string ShamsiToMiladi(string ShamsiDate)
    {
        ShamsiDate = ShamsiDate.Replace("/", "");
        if (ShamsiDate.Length < 8)
            return "";

        var year = Convert.ToInt32(ShamsiDate.Substring(0, 4));
        var month = Convert.ToInt32(ShamsiDate.Substring(4, 2));
        var day = Convert.ToInt32(ShamsiDate.Substring(6, 2));
        var p = new PersianCalendar();
        var mdate = p.ToDateTime(year, month, day, 0, 0, 0, 0);
        var yy = mdate.Year.ToString().Trim();
        var mm = mdate.Month.ToString().Trim();
        var dd = mdate.Day.ToString().Trim();
        if (mm.Length < 2)
            mm = "0" + mm;
        if (dd.Length < 2)
            dd = "0" + dd;
        return yy + "/" + mm + "/" + dd;
    }

    public static int GetYear(string ShamsiDate)
    {
        return Convert.ToInt32(ShamsiDate.Substring(0, 4));
    }

    public static int GetMonth(string ShamsiDate)
    {
        return Convert.ToInt32(ShamsiDate.Substring(5, 2));
    }

    public static int GetDay(string ShamsiDate)
    {
        return Convert.ToInt32(ShamsiDate.Substring(8, 2));
    }

    public static bool IsKabise(int ShamsiYear)
    {
        var p = new PersianCalendar();
        return p.IsLeapYear(ShamsiYear);
    }

    public static int GetDayofWeek(string ShamsiDate)
    {
        var yy = Convert.ToInt32(ShamsiDate.Substring(0, 4));
        var mm = Convert.ToInt32(ShamsiDate.Substring(5, 2));
        var dd = Convert.ToInt32(ShamsiDate.Substring(8, 2));
        var p = new PersianCalendar();
        var myDate = p.ToDateTime(yy, mm, dd, 0, 0, 0, 0);
        var outval = (int)p.GetDayOfWeek(myDate);
        if (outval < 6)
            outval = outval + 2;
        else
            outval = outval - 5;
        return outval;
    }

    public static int GetFirstDayofMonthDayofWeek(string ShamsiDate)
    {
        var yy = Convert.ToInt32(ShamsiDate.Substring(0, 4));
        var mm = Convert.ToInt32(ShamsiDate.Substring(5, 2));
        var dd = 1;
        var p = new PersianCalendar();
        var myDate = p.ToDateTime(yy, mm, dd, 0, 0, 0, 0);
        var outval = (int)myDate.DayOfWeek;
        if (outval < 6)
            outval = outval + 2;
        else
            outval = outval - 5;
        return outval;
    }

    public static string MonthName(int MonthNo)
    {
        var outval = "";
        switch (MonthNo)
        {
            case 1:
                outval = "حمل";
                break;
            case 2:
                outval = "ثور";
                break;
            case 3:
                outval = "جوزا";
                break;
            case 4:
                outval = "سرطان";
                break;
            case 5:
                outval = "اسد";
                break;
            case 6:
                outval = "سنبله";
                break;
            case 7:
                outval = "میزان";
                break;
            case 8:
                outval = "قوس";
                break;
            case 9:
                outval = "عقرب";
                break;
            case 10:
                outval = "جدی";
                break;
            case 11:
                outval = "دلو";
                break;
            case 12:
                outval = "حوت";
                break;
        }

        return outval;
    }

    public static string DayOfWeekName(int DayOfWeekNo)
    {
        var outval = "";
        switch (DayOfWeekNo)
        {
            case 1:
                outval = "شنبه";
                break;
            case 2:
                outval = "یکشنبه";
                break;
            case 3:
                outval = "دوشنبه";
                break;
            case 4:
                outval = "سه شنبه";
                break;
            case 5:
                outval = "چهارشنبه";
                break;
            case 6:
                outval = "پنج شنبه";
                break;
            case 7:
                outval = "جمعه";
                break;
        }

        return outval;
    }

    public static string GetTodayWithTime()
    {
        return DateTime.Now.ToPersianDateString();
    }

    public static string GetCurrentTime()
    {
        return DateTime.Now.ToPersianDateString("{3}:{4}:{5}");
    }

    public static string GetToday()
    {
        var pc = new PersianCalendar();

        var year = pc.GetYear(DateTime.Now);
        var month = pc.GetMonth(DateTime.Now).ToString("00");
        var day = pc.GetDayOfMonth(DateTime.Now).ToString("00");
        var today = $"{year}/{month}/{day}";
        return today;
    }

    public static string DateAddCurrentDate(double count)
    {
        var pc = new PersianCalendar();

        var datetime = DateTime.Now.AddDays(count);

        var year = pc.GetYear(datetime);
        var month = pc.GetMonth(datetime).ToString("00");
        var day = pc.GetDayOfMonth(datetime).ToString("00");
        var today = $"{year}/{month}/{day}";
        return today;
    }

    public static string GetCurrentMonth()
    {
        var pc = new PersianCalendar();

        var month = pc.GetMonth(DateTime.Now).ToString("00");
        return month;
    }

    public static string GetCurrentYear()
    {
        var pc = new PersianCalendar();
        var year = pc.GetYear(DateTime.Now);
        return year.ToString();
    }

    public static string GetFirstDayOfCurrentYear(DateTime? date)
    {
        if (date == null)
            date = DateTime.Now;

        var pc = new PersianCalendar();
        var firstDayYear = $"{pc.GetYear(date.Value)}/01/01";
        return firstDayYear;
    }

    public static string GetLastDayOfCurrentYear(DateTime? date)
    {
        if (date == null)
            date = DateTime.Now;

        var pc = new PersianCalendar();

        var year = pc.GetYear(date.Value);

        var lastDay = pc.GetDaysInMonth(year, 12);
        var lastDayYear = $"{year}/12/{lastDay}";
        return lastDayYear;
    }

    public static string GetFirstDayOfCurrentMonth()
    {
        var pc = new PersianCalendar();

        var year = pc.GetYear(DateTime.Now);
        var month = pc.GetMonth(DateTime.Now).ToString("00");

        var firstDayCurrentMonth = $"{year}/{month}/01";
        return firstDayCurrentMonth;
    }

    public static string GetLastDayOfCurrentMonth(int month)
    {
        var pc = new PersianCalendar();

        var year = pc.GetYear(DateTime.Now);
        var lastDay = pc.GetDaysInMonth(year, month).ToString("00");
        var lastDayCurrentMonth = lastDay;
        //var lastDayCurrentMonth = $"{year}/{month.ToString("00")}/{lastDay}";
        return lastDayCurrentMonth;
    }
}