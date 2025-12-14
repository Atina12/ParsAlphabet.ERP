using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.GN.IndustryGroup;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.IndustryGroup;

namespace ParseAlphabet.ERP.Web.Modules.GN.IndustryGroup;

[Route("api/GN/[controller]")]
[ApiController]
[Authorize]
public class IndustryGroupApiController : ControllerBase
{
    private readonly IHttpContextAccessor _accessor;
    private readonly IndustryGroupRepository _IndustryGroupRepository;

    public IndustryGroupApiController(IndustryGroupRepository IndustryGroupRepository,
        IHttpContextAccessor accessor)
    {
        _IndustryGroupRepository = IndustryGroupRepository;
        _accessor = accessor;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<IndustryGroupGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _IndustryGroupRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<IndustryGroupGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        var result = new MyResultPage<IndustryGroupGetRecord>
        {
            Data = await _IndustryGroupRepository.GetRecordById<IndustryGroupGetRecord>(keyvalue, false, "gn")
        };
        return result;
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _IndustryGroupRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] IndustryGroupModel model)
    {
        if (ModelState.IsValid)
        {
            MyClaim.Init(_accessor);
            model.IsSecondLang = MyClaim.IsSecondLang;
            model.CompanyId = UserClaims.GetCompanyId();
            return await _IndustryGroupRepository.Insert(model, "gn");
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] IndustryGroupModel model)
    {
        if (ModelState.IsValid)
        {
            MyClaim.Init(_accessor);
            model.IsSecondLang = MyClaim.IsSecondLang;
            model.CompanyId = UserClaims.GetCompanyId();
            return await _IndustryGroupRepository.Update(model, "gn");
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int id)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _IndustryGroupRepository.Delete(id, "gn", CompanyId);
    }

    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    [HttpGet]
    public async Task<ActionResult> Csv(string stringedModel)
    {
        var model = JsonConvert.DeserializeObject<NewGetPageViewModel>(stringedModel);
        model.CompanyId = UserClaims.GetCompanyId();
        var resultCsv = await _IndustryGroupRepository.CSV(model);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "گروه صنعت.csv" };
    }

    [HttpGet]
    [Route("getdropdownbytype/{isActive}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDownByItemType(bool isActive)
    {
        var companyId = UserClaims.GetCompanyId();

        var filter = $" CompanyId={companyId} AND IsActive={(isActive ? 1 : 0)}";


        return await _IndustryGroupRepository.GetDropDown("gn", filter);
    }
}

[Route("GN")]
[Authorize]
public class IndustryGroupController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.GN.IndustryGroup);
    }
}