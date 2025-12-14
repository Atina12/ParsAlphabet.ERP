using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.SM.ReturnReason;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM.ReturnReason;

namespace ParseAlphabet.ERP.Web.Modules.SM.ReturnReason;

[Route("api/SM/[controller]")]
[ApiController]
[Authorize]
public class ReturnReasonApiController(ReturnReasonRepository ReturnReasonRepository, IHttpContextAccessor accessor)
    : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<ReturnReasonGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await ReturnReasonRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<ReturnReasonGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        return new MyResultPage<ReturnReasonGetRecord>
        {
            Data = await ReturnReasonRepository.GetRecordById<ReturnReasonGetRecord>(keyvalue, false, "sm")
        };
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return ReturnReasonRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] ReturnReasonModel model)
    {
        if (ModelState.IsValid)
        {
            MyClaim.Init(accessor);
            model.IsSecondLang = MyClaim.IsSecondLang;
            model.CompanyId = UserClaims.GetCompanyId();
            return await ReturnReasonRepository.Insert(model, "sm");
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] ReturnReasonModel model)
    {
        if (ModelState.IsValid)
        {
            MyClaim.Init(accessor);
            model.IsSecondLang = MyClaim.IsSecondLang;
            model.CompanyId = UserClaims.GetCompanyId();
            return await ReturnReasonRepository.Update(model, "sm");
        }

        return ModelState.ToMyResultQuery<int>();
    }


    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await ReturnReasonRepository.Delete(keyvalue, "sm", CompanyId);
    }

    [HttpGet]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<ActionResult> ExportCsv(string stringedModel)
    {
        var model = JsonConvert.DeserializeObject<NewGetPageViewModel>(stringedModel);
        model.CompanyId = UserClaims.GetCompanyId();
        var resultCsv = await ReturnReasonRepository.CSV(model);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "علل مرجوعی.csv" };
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown()
    {
        MyClaim.Init(accessor);
        var CompanyId = UserClaims.GetCompanyId();
        return await ReturnReasonRepository.GetDropDown("sm", $"IsActive = {1} AND CompanyId={CompanyId}",
            MyClaim.IsSecondLang);
    }
}

[Route("SM")]
[Authorize]
public class ReturnReasonController : Controller
{
    [Route("[controller]")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.SM.ReturnReason);
    }
}