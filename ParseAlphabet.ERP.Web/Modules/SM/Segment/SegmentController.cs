using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.SM.Segment;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM.Segment;

namespace ParseAlphabet.ERP.Web.Modules.SM.Segment;

[Route("api/SM/[controller]")]
[ApiController]
[Authorize]
public class SegmentApiController(SegmentRepository segmentRepository) : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<SegmentGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await segmentRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<SegmentGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        return await segmentRepository.GetRecordById(keyvalue);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return segmentRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] SegmentModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await segmentRepository.Insert(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] SegmentModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await segmentRepository.Update(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }


    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        return await segmentRepository.Delete(keyvalue);
    }

    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    [HttpGet]
    public async Task<ActionResult> ServiceReportExportCsv(string stringedModel)
    {
        var model = JsonConvert.DeserializeObject<NewGetPageViewModel>(stringedModel);
        model.CompanyId = UserClaims.GetCompanyId();
        var resultCsv = await segmentRepository.CSV(model);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "خدمات.csv" };
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<List<MyDropDownViewModel>> GetDropDown()
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await segmentRepository.GetDropDown(CompanyId);
    }

    [HttpGet]
    [Route("isactive/{id}")]
    public async Task<bool> GetIsActive(int id)
    {
        return await segmentRepository.GetIsActive(id);
    }
}

[Route("SM")]
[Authorize]
public class SegmentController : Controller
{
    [Route("[controller]")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.SM.Segment);
    }
}