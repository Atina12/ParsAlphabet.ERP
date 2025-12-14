using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.HR.Employee;
using ParsAlphabet.ERP.Infrastructure.Implantation.HR.Employee;

namespace ParseAlphabet.ERP.Web.Modules.HR.Employee;

[Route("api/HR/[controller]")]
[ApiController]
[Authorize]
public class EmployeeApiController : ControllerBase
{
    private readonly EmployeeRepository _employeeRepository;

    public EmployeeApiController(EmployeeRepository EmployeeRepository)
    {
        _employeeRepository = EmployeeRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<EmployeeGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _employeeRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<EmployeeGetRecordForm>> GetRecordById([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _employeeRepository.GetRecordById(keyvalue, CompanyId);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _employeeRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] SaveEmployee model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _employeeRepository.Insert(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] SaveEmployee model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _employeeRepository.Update(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _employeeRepository.Delete(keyvalue, CompanyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _employeeRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<List<MyDropDownViewModel>> GetDropDown(string? term)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _employeeRepository.GetDropDown(term, companyId);
    }

    [HttpGet]
    [Route("getalldatadropdown")]
    public async Task<List<MyDropDownViewModel>> GetAllDataDropDown(string? term)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _employeeRepository.GetAllDataDropDown(term, companyId);
    }

    [HttpGet]
    [Route("getdropdownbygroupid/{groupIds}")]
    public async Task<List<MyDropDownViewModel>> GetDropDownByGroupId(string groupIds)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _employeeRepository.GetDropDownByGroupId(groupIds);
    }

    [HttpGet]
    [Route("educationlevel")]
    public async Task<List<MyDropDownViewModel>> MaritalStatusGetDropDown()
    {
        return await _employeeRepository.EducationLevel_GetDropDown();
    }

    [HttpPost]
    [Route("getnationalcode")]
    public async Task<bool> GetNationalCode([FromBody] MyDropDownViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _employeeRepository.ExistNationalCode(model);
    }
}

[Route("HR")]
[Authorize]
public class EmployeeController : Controller
{
    [Route("Employee")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Index()
    {
        return PartialView(Views.HR.Employee);
    }
}