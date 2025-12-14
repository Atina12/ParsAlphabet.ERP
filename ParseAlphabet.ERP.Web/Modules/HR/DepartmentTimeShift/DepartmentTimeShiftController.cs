using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.HR.DepartmentTimeShift;
using ParsAlphabet.ERP.Application.Dtos.MC.MedicalShiftTimeSheet;
using ParsAlphabet.ERP.Infrastructure.Implantation.HR.DepartmentTimeShift;

namespace ParseAlphabet.ERP.Web.Modules.HR.DepartmentTimeShift;

[Route("api/HR/[controller]")]
[ApiController]
[Authorize]
public class DepartmentTimeShiftApiController : ControllerBase
{
    private readonly DepartmentTimeShiftRepository _departmentTimeShiftRepository;

    public DepartmentTimeShiftApiController(DepartmentTimeShiftRepository departmentTimeShiftRepository)
    {
        _departmentTimeShiftRepository = departmentTimeShiftRepository;
    }


    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<DepartmentTimeShiftGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _departmentTimeShiftRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<List<DepartmentTimeShiftGetRecord>> GetRecordById([FromBody] int id)
    {
        return await _departmentTimeShiftRepository.GetRecordById(id);
    }

    [HttpPost]
    [Route("linegetpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<DepartmentTimeShiftLineGetRecord>>> LineGetPage(NewGetPageViewModel model)
    {
        return await _departmentTimeShiftRepository.LineGetPage(model);
    }

    [HttpPost]
    [Route("display")]
    [Authenticate(Operation.VIW, "")]
    public async Task<List<DepartmentTimeShiftGetRecord>> Display([FromBody] int id)
    {
        return await _departmentTimeShiftRepository.GetRecordById(id);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> Insert([FromBody] DepartmentTimeShiftModel model)
    {
        model.CreateUserId = UserClaims.GetUserId();
        ;

        return await _departmentTimeShiftRepository.Insert(model);
    }

    [HttpPost]
    [Route("insertLine")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> InsertLine([FromBody] DepartmentTimeShiftLineModel model)
    {
        model.CreateUserId = UserClaims.GetUserId();
        ;

        return await _departmentTimeShiftRepository.InsertLine(model);
    }

    [HttpPost]
    [Route("deleteLine")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultDataStatus<List<ConvertAttenderScheduleBlockFromCentral>>> DeleteLine(
        [FromBody] DepartmentTimeShiftLineDelModel model)
    {
        model.UserId = UserClaims.GetUserId();
        ;

        return await _departmentTimeShiftRepository.DeleteLineV1(model);
    }

    [HttpPost]
    [Route("getrecordline")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<DepartmentTimeShiftLineGetRecord>> GetRecordLine([FromBody] int id)
    {
        return await _departmentTimeShiftRepository.GetRecordLineById(id);
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultStatus> Update([FromBody] DepartmentTimeShiftModel model)
    {
        model.ModifiedUserId = UserClaims.GetUserId();
        ;
        return await _departmentTimeShiftRepository.Update(model);
    }

    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    [HttpGet]
    public async Task<ActionResult> ExportCsv(string stringedModel)
    {
        var model = JsonConvert.DeserializeObject<NewGetPageViewModel>(stringedModel);
        model.CompanyId = UserClaims.GetCompanyId();
        var resultCsv = await _departmentTimeShiftRepository.CSV(model);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "خدمات.csv" };
    }

    [HttpGet]
    [Route("getdropdown/{departmentId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(int departmentId)
    {
        return await _departmentTimeShiftRepository.GetDropDown(departmentId);
    }


    [HttpGet]
    [Route("departmenttimeshiftgetproperties/{fiscalYearId?}/{branchId?}/{departmentId}/{type}/{isclose?}")]
    public async Task<IEnumerable<MyDropDownViewModel>> DepartmentTimeShiftGetProperties(short? fiscalYearId,
        short? branchId, string departmentId, byte type, byte? isclose)
    {
        return await _departmentTimeShiftRepository.DepartmentTimeShiftGetProperties(fiscalYearId, branchId,
            departmentId, type, isclose);
    }


    [HttpPost]
    [Route("insertduplicate")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> InsertDuplicate([FromBody] DepartmentTimeShiftDuplicateViewModel model)
    {
        model.CreateUserId = UserClaims.GetUserId();
        ;
        return await _departmentTimeShiftRepository.InsertDuplicate(model);
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultStatus> DeleteDuplicate([FromBody] int id)
    {
        return await _departmentTimeShiftRepository.DeleteDuplicate(id);
    }


    [HttpPost]
    [Route("departmenttimeshiftlinechangelock")]
    public async Task<MyResultStatus> ChangeLockDepartmentTimeShiftLine(
        [FromBody] DepartmentTimeShiftLineDelModel model)
    {
        return await _departmentTimeShiftRepository.ChangeLockDepartmentTimeShiftLine(model);
    }

    [HttpGet]
    [Route("getdropdowndepartmentshiftlist/{departmentshiftId}/{fiscalYearId}/{branchId}/{dayInWeek}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropdownDepartmentShiftList(int DepartmentShiftId,
        int FiscalYearId, short BranchId, byte DayInWeek)
    {
        return await _departmentTimeShiftRepository.GetDropdownDepartmentShiftList(DepartmentShiftId, FiscalYearId,
            BranchId, DayInWeek);
    }
}

[Route("HR")]
[Authorize]
public class DepartmentTimeShiftController : Controller
{
    [Route("[Controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Index()
    {
        return View(Views.HR.DepartmentTimeShift);
    }
}