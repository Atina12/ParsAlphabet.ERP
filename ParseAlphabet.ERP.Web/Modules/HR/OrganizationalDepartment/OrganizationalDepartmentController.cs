using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.HR.OrganizationalDepartment;
using ParsAlphabet.ERP.Infrastructure.Implantation.HR.OrganizationalDepartment;

namespace ParseAlphabet.ERP.Web.Modules.HR.OrganizationalDepartment;

[Route("api/HR/[controller]")]
[ApiController]
[Authorize]
public class OrganizationalDepartmentApiController : ControllerBase
{
    private readonly OrganizationalDepartmentRepository _OrganizationalDepartmentRepository;

    public OrganizationalDepartmentApiController(OrganizationalDepartmentRepository OrganizationalDepartmentRepository)
    {
        _OrganizationalDepartmentRepository = OrganizationalDepartmentRepository;
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<OrganizationalDepartmentGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        var result = new MyResultPage<OrganizationalDepartmentGetRecord>
        {
            Data = await _OrganizationalDepartmentRepository.GetRecordById<OrganizationalDepartmentGetRecord>(keyvalue,
                false, "hr")
        };
        return result;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<OrganizationalDepartmentGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _OrganizationalDepartmentRepository.GetPage(model);
    }


    [HttpGet]
    [Route("getdropdown/{isActive?}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(byte? isActive = 1)
    {
        return await _OrganizationalDepartmentRepository.OrganizationalDepartment_GetDropDown(isActive);
    }


    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] OrganizationalDepartmentModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _OrganizationalDepartmentRepository.Insert(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] OrganizationalDepartmentModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _OrganizationalDepartmentRepository.Update(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int kevalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _OrganizationalDepartmentRepository.Delete(kevalue, "hr", CompanyId);
    }

    [HttpPost]
    [Route("getfilteritem")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _OrganizationalDepartmentRepository.GetColumns();
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _OrganizationalDepartmentRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown()
    {
        var companyId = UserClaims.GetCompanyId();
        return await _OrganizationalDepartmentRepository.GetDropDown(companyId);
    }
}

[Route("HR")]
[Authorize]
public class OrganizationalDepartmentController : Controller
{
    [Route("[controller]")]
    [HttpGet]
    [Authenticate(Operation.VIW, "")]
    public ActionResult Index()
    {
        return PartialView(Views.HR.OrganizationalDepartment);
    }
}