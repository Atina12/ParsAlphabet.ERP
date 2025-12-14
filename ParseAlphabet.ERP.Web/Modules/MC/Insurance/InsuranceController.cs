using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.Insurance;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Insurance;
using Enum = ParsAlphabet.ERP.Application.Enums.Enum;

namespace ParseAlphabet.ERP.Web.Modules.MC.Insurance;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class InsuranceApiController(InsuranceRepository insuranceRepository) : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<InsuranceGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await insuranceRepository.GetPage(model);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await insuranceRepository.Csv(model);
    }

    [HttpGet]
    [Route("getinsurerterminologydropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetInsurerTerminology(string? term)
    {
        return await insuranceRepository.GetInsurerTerminology(term);
    }

    [HttpGet]
    [Route("getinsurerdropdown/{insurerTypeId}/{isActive}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetInsurerDropDown(byte insurerTypeId, byte isActive = 2)
    {
        return await insuranceRepository.GetInsuranceDropdown(insurerTypeId, isActive);
    }


    [HttpGet]
    [Route("getinsuranceboxterminologydropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetInsuranceBoxTerminology(string? term = "")
    {
        return await insuranceRepository.GetInsuranceBoxTerminology(term);
    }

    [HttpGet]
    [Route("getinsurertypedropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetInsurerType()
    {
        return await insuranceRepository.GetInsurerType();
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<InsuranceGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        return await insuranceRepository.GetRecordById(keyvalue);
    }

    [HttpPost]
    [Route("getinsurerlinerecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<InsurerLineGetRecord> GetInsurerLineRecordById([FromBody] int keyvalue)
    {
        return await insuranceRepository.GetInsurerLineRecordById(keyvalue);
    }

    [HttpPost]
    [Route("save")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> SaveInsurance([FromBody] InsuranceModel model)
    {
        model.CompanyId = short.Parse(User.FindFirstValue("CompanyId"));
        model.CreateUserId = short.Parse(User.FindFirstValue("UserId"));

        var result = await insuranceRepository.Save(model);

        return result;
    }

    [HttpGet]
    [Route("getinsurerlistbytype/{insurerTypeId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetInsurerListByType(string insurerTypeId)
    {
        return await insuranceRepository.GetInsurerListByType(insurerTypeId);
    }

    [HttpGet]
    [Route("getinsurerline/{insurerId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetInsurerLine(int insurerId)
    {
        var companyId = short.Parse(User.FindFirstValue("CompanyId"));

        return await insuranceRepository.GetInsurerLine(insurerId, companyId);
    }

    [HttpGet]
    [Route("getlistbytypeid/{insurerTypeId}/{freeType?}/{isActive?}/{bothType?}")]
    public async Task<List<MyDropDownViewModel>> GetListByTypeId(int insurerTypeId, bool freeType = true,
        byte? isActive = 1, bool bothType = true)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await insuranceRepository.GetListByTypeId(insurerTypeId, CompanyId, freeType, isActive, bothType);
    }

    [HttpGet]
    [Route("getinsurerlinelistbyinsurerid/{insurerId}/{isActive?}")]
    public async Task<List<MyDropDownViewModel>> GetListByTypeId(string insurerId, byte? isActive = 1)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await insuranceRepository.GetInsurerLineByIds(insurerId, isActive);
    }

    [HttpPost]
    [Route("getinsurerinfo")]
    public async Task<InsurerCode> GetInsurerInfo([FromBody] GetInsuranceCode model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await insuranceRepository.GetInsurerInfo(model);
    }

    [HttpGet]
    [Route("getinsurancelistbytype/{dropDownCache}/{referralTypeId}")]
    public async Task<List<MyDropDownViewModel2>> GetInsuranceListByType(Enum.DropDownCache dropDownCache,
        byte referralTypeId)
    {
        return await insuranceRepository.GetDropDownInsuranceListByType(dropDownCache, referralTypeId);
    }
}

[Route("MC")]
[Authorize]
public class InsuranceController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.MC.Insurance);
    }
}