using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos._Setup;
using ParsAlphabet.ERP.Application.Interfaces._Setup;

namespace ParseAlphabet.ERP.Web.Modules._Setup;

[Route("api/[controller]")]
[ApiController]
public class SetupApiController : ControllerBase
{
    private readonly ISetupRepository _SetupRepository;

    public SetupApiController(ISetupRepository SetupRepository)
    {
        _SetupRepository = SetupRepository;
    }

    [HttpPost]
    [Route("getsetupinfo")]
    public async Task<SetupInfo> GetSetupInfo()
    {
        return await _SetupRepository.GetSetupInfo();
    }

    [HttpPost]
    [Route("getrefreshkiosk")]
    public async Task<bool> GetRefreshKiosk()
    {
        return await _SetupRepository.GetRefreshKiosk();
    }

    [HttpPost]
    [Route("updaterefreshkiosk")]
    public async Task UpdateRefreshKiosk()
    {
        await _SetupRepository.UpdateRefreshKiosk();
    }

    [HttpGet]
    [Route("country_getdropdown")]
    public async Task<List<MyDropDownViewModel>> Country_GetDropDown()
    {
        return await _SetupRepository.Country_GetDropDown();
    }

    [HttpGet]
    [Route("city_getdropdown")]
    public async Task<List<MyDropDownViewModel>> City_GetDropDown()
    {
        return await _SetupRepository.City_GetDropDown();
    }

    [HttpGet]
    [Route("maritalstatus_getdropdown")]
    public async Task<List<MyDropDownViewModel>> MaritalStatus_GetDropDown()
    {
        return await _SetupRepository.MaritalStatus_GetDropDown();
    }

    [HttpGet]
    [Route("getdropdown")]
    public List<MyDropDownViewModel> GetDropDown()
    {
        return _SetupRepository.GetDropDown();
    }

    [HttpPost]
    [Route("comparetime")]
    public int CompareTime([FromBody] CompareDate model)
    {
        return string.Compare(model.Date1, model.Date2);
    }
}

public class SetupController : Controller
{
    private readonly ISetupRepository _SetupRepository;

    public SetupController(ISetupRepository SetupRepository)
    {
        _SetupRepository = SetupRepository;
    }

    [HttpGet]
    public async Task<IActionResult> CorpLogo()
    {
        var corpInfo = await _SetupRepository.GetSetupInfo();
        return File(corpInfo.Logo, "image/png");
    }

    [HttpGet]
    public IActionResult ShowMyIp()
    {
        var identity = User.Identities.FirstOrDefault(c => c.NameClaimType == "Login");
        if (identity != null)
        {
            var ipaddr = User.FindFirstValue("IpAddress");
            ViewData["IpAddress"] = ipaddr;
        }

        return PartialView(Views.Setup.ShowMyIp);
    }
}