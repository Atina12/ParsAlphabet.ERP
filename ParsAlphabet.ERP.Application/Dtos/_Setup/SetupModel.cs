namespace ParsAlphabet.ERP.Application.Dtos._Setup;

public class SetupInfo
{
    public string Name { get; set; }
    public byte[] Logo { get; set; }
    public string LogoBase64 => Logo != null ? Convert.ToBase64String(Logo) : "";
    public string SiteBaseUrl { get; set; }
    public string SmsServicePanel { get; set; }
    public string SmsServiceNumber { get; set; }
    public string SmsServiceLogin { get; set; }
    public string SmsServicePassword { get; set; }
    public string CIS_WCF_Url { get; set; }
    public string TaminClientId { get; set; }
    public string TaminClientSecret { get; set; }
    public string CentralWebsite { get; set; }
}

public class CompanyInfo
{
    public string Name { get; set; }
    public string Address { get; set; }
    public string PostalCode { get; set; }
    public short CityId { get; set; }
    public short CountryId { get; set; }
    public byte[] Logo { get; set; }
    public string LogoBase64 => Logo != null ? Convert.ToBase64String(Logo) : "";
    public string PhoneNo { get; set; }
    public string Email { get; set; }
    public string Website { get; set; }
    public short DefaultCurrencyId { get; set; }
    public string NationCode { get; set; }
    public string TaxCode { get; set; }
    public bool VATEnable { get; set; }
    public byte IncomeTaxPer { get; set; }
}

public class ServerDateTime
{
    public DateTime DateTimeNow => DateTime.Now;
    public string Date => DateTimeNow.ToShortDateString();
    public string Time => DateTimeNow.ToString("HH:mm");
}

public class ShamsiDateTime
{
    public DateTime MiladiDateTime { get; set; } = DateTime.Now;
    public string Date { get; set; }
    public string Time { get; set; }
    public int Year { get; set; }
    public int Month { get; set; }
    public int Day { get; set; }
    public int DayOfWeek { get; set; }

    public void Init()
    {
        Date = PersianDateTime.GetShamsiDate(MiladiDateTime.ToShortDateString());
        Time = MiladiDateTime.ToString("HH:mm");
        Year = Convert.ToInt32(Date.Substring(0, 4));
        Month = Convert.ToInt32(Date.Substring(5, 2));
        Day = Convert.ToInt32(Date.Substring(8, 2));
        DayOfWeek = PersianDateTime.GetDayofWeek(Date);
    }
}

public class ErrorLog
{
    public int Id { get; set; }
    public DateTime ErrorDateTime { get; set; }
    public int ErrorCode { get; set; }
    public string ErrorMessage { get; set; }
    public int UserId { get; set; }
    public string IPAddress { get; set; }
    public string ComputerName { get; set; }
}

public class CompareDate
{
    public string Date1 { get; set; }
    public string Date2 { get; set; } = DateTime.Now.ToPersianDateString("{0}/{1}/{2}");
}