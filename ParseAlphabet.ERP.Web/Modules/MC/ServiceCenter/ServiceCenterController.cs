using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.ServiceCenter;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.ServiceCenter;

namespace ParseAlphabet.ERP.Web.Modules.MC.ServiceCenter;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class ServiceCenterApiController(
    ServiceCenterRepository ServiceCenterRepository,
    IHttpContextAccessor accessor)
    : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<ServiceCenterGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        return await ServiceCenterRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<ServiceCenterGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        var result = new MyResultPage<ServiceCenterGetRecord>
        {
            Data = await ServiceCenterRepository.GetRecordById<ServiceCenterGetRecord>(keyvalue, false, "mc")
        };
        return result;
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return ServiceCenterRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] ServiceCenterModel model)
    {
        if (ModelState.IsValid)
        {
            model.Opr = "Ins";
            model.CompanyId = UserClaims.GetCompanyId();

            return await ServiceCenterRepository.Insert(model, "mc");
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] ServiceCenterModel model)
    {
        if (ModelState.IsValid)
        {
            model.Opr = "Upd";
            MyClaim.Init(accessor);
            model.CompanyId = UserClaims.GetCompanyId();
            return await ServiceCenterRepository.Update(model, "mc");
        }

        return ModelState.ToMyResultQuery<int>();
    }


    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await ServiceCenterRepository.Delete($"Id={keyvalue} AND CompanyId={CompanyId}", "mc");
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await ServiceCenterRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown/{isActive}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(byte isActive = 1)
    {
        var companyId = UserClaims.GetCompanyId();
        return await ServiceCenterRepository.GetDropDown(companyId, isActive);
    }
}

[Route("MC")]
[Authorize]
public class ServiceCenterController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.MC.ServiceCenter);
    }
}