using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.GN.PersonAccount;
using ParsAlphabet.ERP.Application.Interfaces.GN.PersonAccount;

namespace ParseAlphabet.ERP.Web.Modules.HR.EmployeeAccount;

[Route("api/HR/[controller]")]
[ApiController]
[Authorize]
public class EmployeeAccountApiController : ControllerBase
{
    private readonly IPersonAccountRepository _PersonAccountRepository;

    public EmployeeAccountApiController(IPersonAccountRepository PersonAccountRepository)
    {
        _PersonAccountRepository = PersonAccountRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "Employee")]
    public async Task<MyResultPage<List<PersonAccountGetPage>>> GetPage(NewGetPageViewModel pageViewModel)
    {
        pageViewModel.CompanyId = UserClaims.GetCompanyId();

        return await _PersonAccountRepository.GetPage(pageViewModel);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    public async Task<MyResultPage<PersonAccountGetRecord>> GetRecordBy_PersonAccount([FromBody] int keyvalue)
    {
        var companyId = UserClaims.GetCompanyId();

        return await _PersonAccountRepository.GetRecordById(keyvalue, companyId);
    }

    [HttpPost]
    [Route("getfilteritems/{personTypeId}")]
    public GetColumnsViewModel GetFilterParameters([FromBody] byte personTypeId)
    {
        return _PersonAccountRepository.GetColumns(personTypeId);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] PersonAccountModel model)
    {
        return await _PersonAccountRepository.Insert(model);
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] PersonAccountModel model)
    {
        return await _PersonAccountRepository.Update(model);
    }


    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _PersonAccountRepository.Delete(keyvalue, companyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        return await _PersonAccountRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<List<MyDropDownViewModel>> GetDropDown()
    {
        return await _PersonAccountRepository.GetDropDown();
    }
}

[Route("HR")]
[Authorize]
public class EmployeeAccountController : Controller
{
    [Route("[controller]")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.HR.EmployeeAccount);
    }
}