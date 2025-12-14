using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.SM.Team;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM.Team;

namespace ParseAlphabet.ERP.Web.Modules.SM.Team;

[Route("api/SM/[controller]")]
[ApiController]
[Authorize]
public class TeamApiController(TeamRepository TeamRepository, IHttpContextAccessor accessor)
    : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<TeamGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await TeamRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<TeamGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        var result = new MyResultPage<TeamGetRecord>
        {
            Data = await TeamRepository.GetRecordById<TeamGetRecord>(keyvalue, false, "sm")
        };
        return result;
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return TeamRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] TeamModel model)
    {
        if (ModelState.IsValid)
        {
            MyClaim.Init(accessor);
            model.IsSecondLang = MyClaim.IsSecondLang;
            model.CompanyId = UserClaims.GetCompanyId();
            return await TeamRepository.Insert(model, "sm");
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] TeamModel model)
    {
        if (ModelState.IsValid)
        {
            MyClaim.Init(accessor);
            model.IsSecondLang = MyClaim.IsSecondLang;
            model.CompanyId = UserClaims.GetCompanyId();
            return await TeamRepository.Update(model, "sm");
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await TeamRepository.Delete(keyvalue, "sm", CompanyId);
    }

    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    [HttpGet]
    public async Task<ActionResult> Csv(string stringedModel)
    {
        var model = JsonConvert.DeserializeObject<NewGetPageViewModel>(stringedModel);
        model.CompanyId = UserClaims.GetCompanyId();
        var resultCsv = await TeamRepository.CSV(model);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "تیم فروش.csv" };
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown()
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await TeamRepository.GetDropDown("sm", $"IsActive = {1} AND CompanyId={CompanyId}");
    }
}

[Route("SM")]
[Authorize]
public class TeamController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.SM.Team);
    }
}