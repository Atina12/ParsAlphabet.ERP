using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.FA.FixedAssetSubClass;
using ParsAlphabet.ERP.Infrastructure.Implantation.FA.FixedAssetSubClass;

namespace ParseAlphabet.ERP.Web.Modules.FA.FixedAssetSubClass;

[Route("api/FA/[controller]")]
[ApiController]
[Authorize]
public class FixedAssetSubClassApiController : ControllerBase
{
    private readonly FixedAssetSubClassRepository _fixedAssetSubClassRepository;

    public FixedAssetSubClassApiController(FixedAssetSubClassRepository FixedAssetSubClassRepository)
    {
        _fixedAssetSubClassRepository = FixedAssetSubClassRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<FixedAssetSubClassGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        return await _fixedAssetSubClassRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<FixedAssetSubClassGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        return new MyResultPage<FixedAssetSubClassGetRecord>
        {
            Data = await _fixedAssetSubClassRepository.GetRecordById<FixedAssetSubClassGetRecord>(keyvalue, false, "fa")
        };
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _fixedAssetSubClassRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] FixedAssetSubClassModel model)
    {
        if (ModelState.IsValid)
            return await _fixedAssetSubClassRepository.Insert(model, "fa");
        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] FixedAssetSubClassModel model)
    {
        if (ModelState.IsValid)
            return await _fixedAssetSubClassRepository.Update(model, "fa");
        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _fixedAssetSubClassRepository.Delete(id, "fa", companyId);
    }

    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    [HttpGet]
    public async Task<ActionResult> ServiceReportExportCsv(string stringedModel)
    {
        var model = JsonConvert.DeserializeObject<NewGetPageViewModel>(stringedModel);
        model.CompanyId = UserClaims.GetCompanyId();
        var resultCsv = await _fixedAssetSubClassRepository.CSV(model);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "طبقه بندی فرعی.csv" };
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown()
    {
        return await _fixedAssetSubClassRepository.GetDropDown("fa");
    }

    [HttpGet]
    [Route("subclassidgetdropdown/{fixedAssetClassId}")]
    public async Task<List<MyDropDownViewModel>> SubClassId_GetDropDown(short fixedAssetClassId)
    {
        return await _fixedAssetSubClassRepository.SubClassId_GetDropDown(fixedAssetClassId);
    }
}

[Route("FA")]
[Authorize]
public class FixedAssetSubClassController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.FA.FixedAssetSubClass);
    }
}