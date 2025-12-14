using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Interfaces.GN;

namespace ParseAlphabet.ERP.Web.Modules.GN;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class GNApiController : ControllerBase
{
    private readonly IGNRepository _GNRepository;

    public GNApiController(IGNRepository GNRepository)
    {
        _GNRepository = GNRepository;
    }

    [HttpGet]
    [Route("pricingmodlgetdropdown")]
    public async Task<List<MyDropDownViewModel>> PricingModel_GetDropDown()
    {
        return await _GNRepository.PricingModel_GetDropDown();
    }

    [HttpGet]
    [Route("pricetypegetdropdown")]
    public async Task<List<MyDropDownViewModel>> PriceType_GetDropDown()
    {
        return await _GNRepository.PriceType_GetDropDown();
    }


    [HttpGet]
    [Route("industryGroup_GetDropDown")]
    public async Task<List<MyDropDownViewModel>> IndustryGroup_GetDropDown()
    {
        return await _GNRepository.IndustryGroup_GetDropDown();
    }

    [HttpGet]
    [Route("personGroupType_GetDropDown")]
    public async Task<List<MyDropDownViewModel>> PersonGroupType_GetDropDown()
    {
        return await _GNRepository.PersonGroupType_GetDropDown();
    }

    [HttpGet]
    [Route("personTitle_GetDropDown/{partnerType}")]
    public async Task<List<MyDropDownViewModel>> PersonTitle_GetDropDown(byte partnerType)
    {
        return await _GNRepository.PersonTitle_GetDropDown(partnerType);
    }

    [HttpGet]
    [Route("notify_GetDropDown")]
    public async Task<List<MyDropDownViewModel>> Notify_GetDropDown()
    {
        return await _GNRepository.Notify_GetDropDown();
    }

    [HttpGet]
    [Route("noseries_getdropdown")]
    public async Task<List<MyDropDownViewModel>> NoSeries_GetDropDown()
    {
        return await _GNRepository.NoSeries_GetDropDown();
    }

    [HttpGet]
    [Route("noseries_getname/{id}")]
    public async Task<string> NoSeries_GetName(int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _GNRepository.NoSeries_GetName(id, companyId);
    }

    [HttpGet]
    [Route("noseries_vendoritems_getdropdown")]
    public async Task<List<MyDropDownViewModel>> NoSeries_VendorItems_GetDropDown()
    {
        return await _GNRepository.NoSeries_VendorItems_GetDropDown();
    }

    [HttpGet]
    [Route("todaypersiandate")]
    public string GetTodayShamsiDate()
    {
        return DateTime.Now.ToPersianDateString("{0}/{1}/{2}");
    }

    [HttpPost]
    [Route("getfiscalyearlineidbypersiandate")]
    public async Task<string> GetFiscalYearLineIdByPersianDate([FromBody] string PersianDate)
    {
        return await _GNRepository.GetFiscalYearLineIdByPersianDate(PersianDate);
    }

    [HttpGet]
    [Route("gettaxtype")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetTaxType()
    {
        return await _GNRepository.GetTaxType();
    }

    [HttpGet]
    [Route("getroleid")]
    public byte GetRoleId()
    {
        return UserClaims.GetRoleId();
        ;
    }
}