using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.PB;
using ParsAlphabet.ERP.Application.Interfaces.PB;
using ParsAlphabet.ERP.Infrastructure.Implantation.PB;
using static ParsAlphabet.ERP.Application.Enums.Enum;

namespace ParseAlphabet.ERP.Web.Modules.PB;

[Route("api/PB/[controller]")]
[Authorize]
[ApiController]
public class PublicApiController(PublicRepository publicRepository) : ControllerBase
{
    private readonly IPublicRepository _publicRepository = publicRepository;

    [HttpPost]
    [AllowAnonymous]
    [Route("getmiladidate")]
    public string GetMiladiDate([FromBody] string persianDate)
    {
        return !string.IsNullOrEmpty(persianDate) ? persianDate.ToMiladiDateTime().Value.ToShortDateString() : "";
    }

    [HttpGet]
    [AllowAnonymous]
    [Route("getuserId")]
    public int GetCurrentUserId()
    {
        var userId = User != null ? int.Parse(User.FindFirstValue("UserId")) : 0;
        return userId;
    }

    [HttpPost]
    [AllowAnonymous]
    [Route("getmiladidatetime")]
    public string GetMiladiDateTime([FromBody] Persian_Date model)
    {
        if (string.IsNullOrEmpty(model.Time)) return model.Date.ToMiladiDateTime().ToString();

        if (model.isFrom)
            return Convert.ToDateTime($"{PersianDateTime.ShamsiToMiladi(model.Date)} {model.Time}:00.000")
                .ToString("yyyy/MM/dd HH:mm:ss.fff");
        return Convert.ToDateTime($"{PersianDateTime.ShamsiToMiladi(model.Date)} {model.Time}:59.999")
            .ToString("yyyy/MM/dd HH:mm:ss.fff");
    }

    [HttpPost]
    [AllowAnonymous]
    [Route("gettoday")]
    public string GetToday()
    {
        return PersianDateTime.GetToday();
    }

    [HttpPost]
    [AllowAnonymous]
    [Route("getcurrentmonth")]
    public string GetCurrentMonth()
    {
        return PersianDateTime.GetCurrentMonth();
    }

    [HttpPost]
    [AllowAnonymous]
    [Route("getcurrentyear")]
    public string GetCurrentYear()
    {
        return PersianDateTime.GetCurrentYear();
    }

    [HttpPost]
    [AllowAnonymous]
    [Route("pingip")]
    public bool PingIP([FromBody] string ip)
    {
        var pingIp = new NetTcp();
        var hasReplay = pingIp.PingIp(ip);
        return hasReplay;
    }

    [HttpPost]
    [AllowAnonymous]
    [Route("getlastdayyear")]
    public string GetLastDayOfYear()
    {
        return PersianDateTime.GetLastDayOfCurrentYear(null);
    }

    [HttpPost]
    [AllowAnonymous]
    [Route("getlastdayofcurrentmonth")]
    public string GetLastDayOfCurrentMonth([FromBody] int month)
    {
        return PersianDateTime.GetLastDayOfCurrentMonth(month);
    }

    [HttpGet]
    [AllowAnonymous]
    [Route("getcurrentdatetime")]
    public string GetCurrentDateTime()
    {
        var dateTime = DateTime.Now.ToString("yyyy/MM/dd HH:mm:ss");
        return dateTime;
    }

    [HttpPost]
    [AllowAnonymous]
    [Route("getdatediff")]
    public double GetDateDifference([FromBody] PersianDateRange model)
    {
        double difference;
        if (model.DatePart == DatePart.MiliSecond)
            difference = (model.FromDate - model.ToDate).HasValue
                ? (model.FromDate - model.ToDate).Value.TotalMilliseconds
                : 0;
        else if (model.DatePart == DatePart.Second)
            difference = (model.FromDate - model.ToDate).HasValue
                ? (model.FromDate - model.ToDate).Value.TotalSeconds
                : 0;
        else if (model.DatePart == DatePart.Minute)
            difference = (model.FromDate - model.ToDate).HasValue
                ? (model.FromDate - model.ToDate).Value.TotalMinutes
                : 0;
        else if (model.DatePart == DatePart.Hour)
            difference = (model.FromDate - model.ToDate).HasValue
                ? (model.FromDate - model.ToDate).Value.TotalHours
                : 0;
        else
            difference = (model.FromDate - model.ToDate).HasValue ? (model.FromDate - model.ToDate).Value.TotalDays : 0;

        return difference;
    }

    [HttpGet]
    [Route("monthgetdropdown/{id?}")]
    public List<MyDropDownViewModel> MounthGetDropDown(string id=null)
    {
        object parseMonthId = id == "null" ? null : id;

        var result = _publicRepository.MonthGetDropDown((int?)parseMonthId);
        return result;
    }

    [HttpGet]
    [Route("getpagerowscount/{href}/{take}")]
    public int GetPageRowsCount(string href, short take)
    {
        var userId = UserClaims.GetUserId();
        ;


        var modelTake = new TakeRowsCountByPage
        {
            Href = href,
            PageRowsCount = take,
            UserId = userId
        };

        var result = _publicRepository.GetPageRowsCount(modelTake);
        return result;
    }


    [HttpGet]
    [Route("setpagerowscount/{href}/{take}")]
    public bool SetPageRowsCount(string href, short take)
    {
        var userId = UserClaims.GetUserId();
        ;


        var modelTake = new TakeRowsCountByPage
        {
            Href = href,
            PageRowsCount = take,
            UserId = userId
        };

        var result = _publicRepository.SetTakeRowsCountByPage(modelTake);
        return result;
    }

    [HttpGet]
    [Route("getdropdowndays")]
    public List<MyDropDownViewModel> DaysGetDropDown()
    {
        return GetDaysDisplayName();
    }
}

[Route("PB")]
[Authorize]
public class PublicController : Controller
{
    [Route("[controller]/pageHeaderLine")]
    [HttpGet]
    public IActionResult PageHeaderLine()
    {
        return View(Views.Public.PageHeaderLine);
    }

    [Route("[controller]/pageHeaderLineV1")]
    [HttpGet]
    public IActionResult PageHeaderLineV1()
    {
        return View(Views.Public.PageHeaderLineV1);
    }

    [Route("[controller]/pageHeaderLineDet")]
    [HttpGet]
    public IActionResult PageHeaderLineDet()
    {
        return View(Views.Public.PageHeaderLineDet);
    }

    [Route("[controller]/pagetable")]
    [HttpGet]
    public IActionResult PageTable()
    {
        return View(Views.Public.PageTable);
    }


    [Route("[controller]/newpagetable")]
    [HttpGet]
    public IActionResult NewPageTable()
    {
        return View(Views.Public.NewPageTable);
    }

    [Route("[controller]/newpagetablev1")]
    [HttpGet]
    public IActionResult NewPageTableV1()
    {
        return View(Views.Public.NewPageTableV1);
    }
}