using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.SM.Customer;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM.Customer;

namespace ParseAlphabet.ERP.Web.Modules.SM.Customer;

[Route("api/SM/[controller]")]
[ApiController]
[Authorize]
public class CustomerApiController(CustomerRepository CustomerRepository) : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<CustomerGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await CustomerRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<CustomerGetRecordForm>> GetRecordById([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await CustomerRepository.GetRecordById(keyvalue, CompanyId);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return CustomerRepository.GetColumns();
    }

    [HttpPost]
    [Route("allocationfilter")]
    public GetColumnsViewModel GetFilterParametersAllocation()
    {
        return CustomerRepository.AllocationColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] CustomerSave model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await CustomerRepository.Insert(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] CustomerSave model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await CustomerRepository.Update(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }


    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int id)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await CustomerRepository.Delete(id, CompanyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await CustomerRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<List<MyDropDownViewModel>> GetDropDown()
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await CustomerRepository.GetDropDown(CompanyId);
    }

    [HttpGet]
    [Route("getalldatadropdown")]
    public async Task<List<MyDropDownViewModel>> GetAllDataDropDown()
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await CustomerRepository.GetAllDataDropDown(CompanyId);
    }

    [HttpGet]
    [Route("getdropdownbygroupid/{groupIds}")]
    public async Task<List<MyDropDownViewModel>> GetDropDownByGroupId(string groupIds)
    {
        var companyId = UserClaims.GetCompanyId();
        return await CustomerRepository.GetDropDownByGroupId(groupIds);
    }

    [HttpPost]
    [Route("getnationalcode")]
    public async Task<bool> CheckNationalCode([FromBody] MyDropDownViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await CustomerRepository.ExistNationalCode(model);
    }
}

[Route("SM")]
[Authorize]
public class CustomerController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Index()
    {
        return PartialView(Views.SM.Customer);
    }
}