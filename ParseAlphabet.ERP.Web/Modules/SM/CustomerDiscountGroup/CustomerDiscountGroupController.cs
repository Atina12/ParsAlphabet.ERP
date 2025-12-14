using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.SM.CustomerDiscountGroup;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM.CustomerDiscountGroup;

namespace ParseAlphabet.ERP.Web.Modules.SM.CustomerDiscountGroup;

[Route("api/SM/[controller]")]
[ApiController]
[Authorize]
public class CustomerDiscountGroupApiController(CustomerDiscountGroupRepository CustomerDiscountGroupRepository)
    : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<CustomerDiscountGroupGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await CustomerDiscountGroupRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<CustomerDiscountGroupGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        var result = new MyResultPage<CustomerDiscountGroupGetRecord>
        {
            Data = await CustomerDiscountGroupRepository.GetRecordById<CustomerDiscountGroupGetRecord>(keyvalue, false,
                "sm")
        };
        return result;
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return CustomerDiscountGroupRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] CustomerDiscountGroupModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await CustomerDiscountGroupRepository.InsertUpdate(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] CustomerDiscountGroupModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await CustomerDiscountGroupRepository.InsertUpdate(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }


    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await CustomerDiscountGroupRepository.Delete(keyvalue, "sm", CompanyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await CustomerDiscountGroupRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown()
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await CustomerDiscountGroupRepository.GetDropDown("sm", $"IsActive = {1} AND CompanyId={CompanyId}");
    }

    [HttpPost]
    [Route("getlist")]
    public async Task<IEnumerable<CustomerDiscountGroupGetPage>> GetList()
    {
        var companyId = UserClaims.GetCompanyId();
        return await CustomerDiscountGroupRepository.GetList(companyId);
    }
}

[Route("SM")]
[Authorize]
public class CustomerDiscountGroupController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.SM.CustomerDiscountGroup);
    }
}