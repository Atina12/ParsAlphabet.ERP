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
public class SalesPersonOrderApiController(ISalesPersonOrderRepository SalesPersonRepository) : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<SalesPersonOrderGetPage>>> GetPage([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await SalesPersonRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<SalesPersonOrderGetRecord>> GetRecordById([FromBody] int id)
    {
        return await SalesPersonRepository.GetRecordById(id);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return SalesPersonRepository.GetColumns();
    }

    [HttpPost]
    [Route("allocationfilter")]
    public GetColumnsViewModel GetFilterParametersAllocation()
    {
        return SalesPersonRepository.AllocationColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] SalesPersonOrderModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.UserId = Convert.ToInt16(User.FindFirstValue("UserId"));
            return await SalesPersonRepository.Insert(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultStatus> Update([FromBody] SalesPersonOrderModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.UserId = Convert.ToInt16(User.FindFirstValue("UserId"));
            return await SalesPersonRepository.Update(model);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultStatus> Delete([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await SalesPersonRepository.Delete(keyvalue, CompanyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await SalesPersonRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<List<MyDropDownViewModel>> GetDropDown()
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await SalesPersonRepository.GetDropDown(CompanyId);
    }
}

[Route("SM")]
[Authorize]
public class SalesPersonOrderController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.SM.SalesPersonOrder);
    }
}