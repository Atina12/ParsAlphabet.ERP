using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Interfaces._Dashboard;

namespace ParseAlphabet.ERP.Web.Modules._Dashboard;

[Route("api/[controller]")]
[Authorize]
[ApiController]
public class DashboardApiController : ControllerBase
{
    private readonly IDashboardRepository _dashboardRepository;

    public DashboardApiController(IDashboardRepository dashboardRepository)
    {
        _dashboardRepository = dashboardRepository;
    }

    //[HttpPost]
    //[Route("get_weather/{cityname}")]
    //public Task<List<DashboardWeather>> GetWeather(string cityname)
    //{
    //    return _dashboardRepository.GetWeather(cityname);
    //}

    //[HttpPost]
    //[Route("get_calendar")]
    //public async Task<DashboardCalendar> GetCalendar([FromBody] ShamsiDateTime model)
    //{
    //    return await _dashboardRepository.GetCalendar(model.Year, model.Month);
    //}
}

[Authorize]
public class DashboardController : Controller
{
    [HttpGet]
    public IActionResult DashboardIndex()
    {
        return View(Views.Dashboard.DashboardIndex);
    }
}