using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.SM.SalesPerson;
using ParsAlphabet.ERP.Application.Interfaces.SM.SalesPerson;

namespace ParseAlphabet.ERP.Web.Modules.SM.SalesPerson;

[Route("api/SM/[controller]")]
[ApiController]
[Authorize]
public class SalesPersonInvoiceApiController(IPersonInvoiceRepository salesPersonRepository) : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<PersonInvoiceGetPage>>> GetPage([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await salesPersonRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<PersonInvoiceGetRecord>> GetRecordById([FromBody] int id)
    {
        return await salesPersonRepository.GetRecordById(id);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return salesPersonRepository.GetColumns();
    }

    //[HttpPost]
    //[Route("allocationfilter")]
    //public GetColumnsViewModel GetFilterParametersAllocation()
    //{
    //    return _PersonInvoiceRepository.AllocationColumns();
    //}

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] PersonInvoiceModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            var userid = Convert.ToInt32(User.FindFirstValue("UserId"));
            return await salesPersonRepository.Insert(model, userid);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] PersonInvoiceModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            var userid = Convert.ToInt32(User.FindFirstValue("UserId"));
            return await salesPersonRepository.Update(model, userid);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultStatus> Delete([FromBody] PersonInvoiceModel model)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await salesPersonRepository.Delete($"Id={model.Id}", CompanyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await salesPersonRepository.Csv(model);
    }

    //[HttpGet]
    //[Route("getdropdown")]
    //public async Task<List<MyDropDownViewModel>> GetDropDown()
    //{
    //    return await _PersonInvoiceRepository.GetDropDown();
    //}
}

[Route("SM")]
[Authorize]
public class SalesPersonInvoiceController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.SM.PersonInvoice);
    }
}