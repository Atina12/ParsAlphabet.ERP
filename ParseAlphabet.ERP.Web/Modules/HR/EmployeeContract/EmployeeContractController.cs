using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.HR.EmployeeContract;
using ParsAlphabet.ERP.Application.Interfaces.HR.EmployeeContract;

namespace ParseAlphabet.ERP.Web.Modules.HR.EmployeeContract;

[Route("api/HR/[controller]")]
[ApiController]
[Authorize]
public class EmployeeContractApiController : ControllerBase
{
    private readonly IEmployeeContractRepository _employeeContractRepository;

    public EmployeeContractApiController(IEmployeeContractRepository employeeContractRepository)
    {
        _employeeContractRepository = employeeContractRepository;
    }


    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<EmployeeContractGetPage>>> GetPage([FromBody] GetPageViewModel pageViewModel)
    {
        pageViewModel.CompanyId = UserClaims.GetCompanyId();
        return await _employeeContractRepository.GetPage(pageViewModel);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<EmployeeContractGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        return await _employeeContractRepository.GetRecordById(keyvalue);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _employeeContractRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] EmployeeContractModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _employeeContractRepository.Insert(model);
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] EmployeeContractModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _employeeContractRepository.Update(model);
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        return await _employeeContractRepository.Delete(keyvalue);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _employeeContractRepository.Csv(model);
    }
}

[Route("HR")]
[Authorize]
public class EmployeeContractController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Index()
    {
        return PartialView(Views.HR.EmployeeContract);
    }
}