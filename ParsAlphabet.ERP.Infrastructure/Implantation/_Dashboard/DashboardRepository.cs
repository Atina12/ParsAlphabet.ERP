using System.Data;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Interfaces._Dashboard;

namespace ParsAlphabet.ERP.Infrastructure.Implantation._Dashboard;

public class DashboardRepository : IDashboardRepository
{
    private readonly IConfiguration _config;

    public DashboardRepository(IConfiguration config)
    {
        _config = config;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    //public async Task<List<DashboardWeather>> GetWeather(string cityname)
    //{
    //    var result = new List<DashboardWeather>();
    //    WeatherApi.Parsijoo weather = new WeatherApi.Parsijoo();
    //    string xml = await weather.GetCurrent(cityname);
    //    if (xml != "")
    //    {
    //        XmlDocument xdoc = new XmlDocument();
    //        xdoc.LoadXml(xml);
    //        XmlNodeList xnl = xdoc.SelectNodes("/main/sadana-services/weather-service/day");
    //        int i = 0;
    //        foreach (XmlNode node in xnl)
    //        {
    //            DashboardWeather wdr = new DashboardWeather();
    //            foreach (XmlNode chnode in node.ChildNodes)
    //            {
    //                switch (chnode.Name)
    //                {
    //                    case "city-name":
    //                        wdr.CityName = chnode.InnerText;
    //                        break;
    //                    case "day-name":
    //                        wdr.DayName = chnode.InnerText;
    //                        wdr.DayName = wdr.DayName.Replace("یک شنبه", "۱شنبه");
    //                        wdr.DayName = wdr.DayName.Replace("دوشنبه", "۲شنبه");
    //                        wdr.DayName = wdr.DayName.Replace("سه شنبه", "۳شنبه");
    //                        wdr.DayName = wdr.DayName.Replace("چهارشنبه", "۴شنبه");
    //                        wdr.DayName = wdr.DayName.Replace("پنج شنبه", "۵شنبه");
    //                        break;
    //                    case "status":
    //                        wdr.Status = chnode.InnerText;
    //                        break;
    //                    case "temp":
    //                        wdr.Temperature = chnode.InnerText;
    //                        break;
    //                    case "min-temp":
    //                        wdr.TemperatureMin = chnode.InnerText;
    //                        break;
    //                    case "max-temp":
    //                        wdr.TemperatureMax = chnode.InnerText;
    //                        break;
    //                    case "symbol":
    //                        wdr.IconName = chnode.InnerText;
    //                        break;
    //                }
    //            }
    //            result.Add(wdr);
    //            i++;
    //            if (i == 5)
    //                break;
    //        }
    //    }
    //    else
    //        result = null;
    //    return result;
    //}
    //public async Task<DashboardCalendar> GetCalendar(int pYear, int pMonth)
    //{
    //    var result = new DashboardCalendar();
    //    using (IDbConnection conn = Connection)
    //    {
    //        string sQuery = "select convert(varchar, getdate(), 111) as Date, convert(varchar, getdate(), 8) as Time ";
    //        conn.Open();
    //        var model = await conn.QueryFirstOrDefaultAsync<ServerDateTime>(sQuery);
    //        string shdate = PersianDateTime.GetShamsiDate(model.Date);
    //        int tYear = PersianDateTime.GetYear(shdate);
    //        int tMonth = PersianDateTime.GetMonth(shdate);
    //        int tDay = PersianDateTime.GetDay(shdate);

    //        if (pYear == 0 && pMonth == 0)
    //        {
    //            result.Year = tYear;
    //            result.Month = tMonth;
    //            result.Day = tDay;
    //        }
    //        else
    //        {
    //            if (pYear == tYear && pMonth == tMonth)
    //            {
    //                result.Year = tYear;
    //                result.Month = tMonth;
    //                result.Day = tDay;
    //            }
    //            else
    //            {
    //                shdate = pYear.ToString() + "/" + (pMonth.ToString().Length == 1 ? "0" + pMonth.ToString() : pMonth.ToString()) + "/01";
    //                result.Year = pYear;
    //                result.Month = pMonth;
    //                result.Day = 0;
    //            }
    //        }
    //        result.MonthName = PersianDateTime.MonthName(PersianDateTime.GetMonth(shdate));
    //        result.DayOfWeek = PersianDateTime.GetDayofWeek(shdate);
    //        result.DayOfWeekName = PersianDateTime.DayOfWeekName(result.DayOfWeek);
    //        result.FirstDayOfMonthDayOfWeek = PersianDateTime.GetFirstDayofMonthDayofWeek(shdate);
    //        result.IsKabiseYear = PersianDateTime.IsKabise(result.Year);
    //        if (result.Month <= 6)
    //            result.MonthDaysCount = 31;
    //        else
    //            if (result.Month <= 11)
    //            result.MonthDaysCount = 30;
    //        else
    //            if (result.IsKabiseYear)
    //            result.MonthDaysCount = 30;
    //        else
    //            result.MonthDaysCount = 29;
    //    }
    //    using (IDbConnection conn = Connection)
    //    {
    //        //string filter = "Year=" + result.Year.ToString() + " and Month=" + result.Month.ToString();
    //        //string sQuery1 = "pb.Spc_Tables_GetTable";
    //        string sQuery1 = "SELECT * FROM gn.HoliDays hd WHERE Year=@Year and Month=@Month";
    //        conn.Open();
    //        var result1 = await conn.QueryAsync<CalendarHoliDays>(sQuery1,
    //            new
    //            {
    //                result.Year,
    //                result.Month
    //            });

    //        result.MonthHoliDays = new int[result1.Count()];

    //        for (int i = 0; i < result1.Count(); i++)
    //        {
    //            result.MonthHoliDays[i] = result1.ElementAt(i).Day;
    //        }
    //    }
    //    return result;
    //}
}