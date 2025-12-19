using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.AttenderTimeSheetLine;
using ParsAlphabet.ERP.Application.Dtos.MC.MedicalShiftTimeSheet;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AttenderTimeSheetLine;


namespace ParseAlphabet.ERP.Web.Modules.MC.AttenderTimeSheetLine;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class AttenderTimeSheetLineApiController(AttenderTimeSheetLineRepository attenderTimeSheetLineRepository)
    : ControllerBase
{
    [HttpPost]
    [Route("checkexistsattenderid")]
    public async Task<bool> CheckExistAttenderId([FromBody] ExistAttenderViewModel model)
    {
        return await attenderTimeSheetLineRepository.CheckExistAttenderId(model);
    }


    [HttpPost]
    [Route("getdetailmedicaltimeshift")]
    [Authenticate(Operation.VIW, "AttenderTimeSheet#Admission")]
    public async Task<MyResultPage<List<DetailListMedicalTimeShiftViewModel>>> GetDetailMedicalTimeShift(
        [FromBody] DetailMedicalTimeShiftViewModel model)
    {
        return await attenderTimeSheetLineRepository.GetDetailMedicalTimeShift(model);
    }


    [HttpPost]
    [Route("getlistattendertimesheet")]
    public async Task<MyResultPage<List<AttenderTimeSheetGetList>>> GetListAttenderTimeSheet(
        AttenderTimeSheetViewModel model)
    {
        return await attenderTimeSheetLineRepository.GetListAttenderTimeSheet(model);
    }


    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "AttenderTimeSheet")]
    public async Task<AttenderTimeSheetLineSaveResult<List<ConvertAttenderScheduleBlockFromCentral>>> Save(
        [FromBody] AttenderTimeSheetSaveViewModel model)
    {
        model.CreateUserId = UserClaims.GetUserId();
        model.CompanyId = UserClaims.GetCompanyId();
        return await attenderTimeSheetLineRepository.SaveV1(model);
    }

    [HttpPost]
    [Route("checkexistsattendertimesheet")]
    public async Task<bool> CheckExistAttenderTimeSheet([FromBody] AttenderTimeSheetLineViewModel model)
    {
        return await attenderTimeSheetLineRepository.CheckExistAttenderTimeSheet(model);
    }


    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "AttenderTimeSheet")]
    public async Task<MyResultDataStatus<List<ConvertAttenderScheduleBlockFromCentral>>> Delete(
        [FromBody] AttenderTimeSheetSaveViewModel model)
    {
        model.CreateUserId = UserClaims.GetUserId();
        ;
        model.CompanyId = UserClaims.GetCompanyId();

        return await attenderTimeSheetLineRepository.DeleteV1(model);
    }

    [HttpPost]
    [Route("getpageattendertimesheetline")]
    public async Task<MyResultPage<List<AttenderTimeSheetGetPage>>> GetPageAttenderTimeSheet(
        [FromBody] NewGetPageViewModel model)
    {
        return await attenderTimeSheetLineRepository.GetPageAttenderTimeSheet(model);
    }

    [HttpPost]
    [Route("csvgetattendertimesheetline")]
    [Authenticate(Operation.PRN, "AttenderTimeSheet")]
    public async Task<ActionResult> ExportCsvGetAttenderTimeSheetLine([FromBody] NewGetPageViewModel model)
    {
        var resultCsv = await attenderTimeSheetLineRepository.ExportCsvGetAttenderTimeSheetLine(model);

        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "" };
    }

    [HttpGet]
    [Route(
        "attendertimesheetgetproperties/{fiscalYearId?}/{branchId?}/{departmentId?}/{fromWorkDayDatePersian?}/{toWorkDayDatePersian?}/{type}/{isclosed}")]
    public async Task<IEnumerable<MyDropDownViewModel>> AttenderTimeSheetGetProperties([FromRoute] AttenderTimeSheetGetPropertiesDto dto)
    {

        try
        {

            return await attenderTimeSheetLineRepository.AttenderTimeSheetGetProperties(dto);
        }
        catch (Exception ex)
        {

            throw new Exception(ex.Message);
        }
    }

    [HttpPost]
    [Route("insertduplicate")]
    [Authenticate(Operation.INS, "AttenderTimeSheet")]
    public async Task<MyResultStatus> InsertDuplicate([FromBody] AttenderTimeSheetDuplicateViewModel model)
    {
        model.CreateUserId = UserClaims.GetUserId();
        ;
        return await attenderTimeSheetLineRepository.InsertDuplicate(model);
    }


    [HttpPost]
    [Route("getdepartmenttimeshiftid")]
    public async Task<int> GetDepartmentTimeShiftId([FromBody] int id)
    {
        return await attenderTimeSheetLineRepository.GetDepartmentTimeShiftId(id);
    }

    [HttpPost]
    [Route("getattendertimeshiftlist")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetAttenderTimeShiftList([FromBody] GetAttenderTimeShift model)
    {
        return await attenderTimeSheetLineRepository.GetAttenderTimeShiftList(model);
    }


    [HttpPost]
    [Route("getpresencedays")]
    public async Task<List<PresenceDaysViewModel>> GetPresenceDays([FromBody] PresenceDaysModel model)
    {
        return await attenderTimeSheetLineRepository.GetPresenceDays(model);
    }

    [HttpGet]
    [Route("appointmenttype_getdropdown")]
    public List<MyDropDownViewModel> AppointmentType_GetDropdown()
    {
        return attenderTimeSheetLineRepository.AppointmentType_GetDropdown();
    }


    [HttpPost]
    [Route("getattendertimesheetlist")]
    [Authenticate(Operation.VIW, "AttenderTimeSheet")]
    public async Task<IEnumerable<AttenderTimeShiftGetGroupDetailViewModel>> MedicalTimeShiftGetGroupedDetail(
        [FromBody] AttenderShiftdDetailViewModel model)
    {
        return await attenderTimeSheetLineRepository.MedicalTimeShiftGetGroupedDetail(model);
    }


    [HttpGet]
    [Route("getdropDown_offlinebookingunlimit")]
    public List<MyDropDownViewModel> GetDropDown_OfflineBookingUnLimit()
    {
        return attenderTimeSheetLineRepository.GetDropDown_OfflineBookingUnLimit();
    }

    [HttpGet]
    [Route("getdropDown_onlinebookingunlimit")]
    public List<MyDropDownViewModel> GetDropDown_OnlineBookingUnLimit()
    {
        return attenderTimeSheetLineRepository.GetDropDown_OnlineBookingUnLimit();
    }


    [HttpGet]
    [Route("getdropdowndepartmentworkdaylist/{departmentTimeShiftId}/{monthId}/{dayInWeek}/{id}/{attenderId}")]
    public async Task<IEnumerable<MyDropDownViewModel2>> GetDropdownDepartmentWorkDayList(int departmentTimeShiftId,
        byte monthId, byte dayInWeek, string? id, int attenderId)
    {
        int.TryParse(id, out int castId);
        return await attenderTimeSheetLineRepository.GetDropdownDepartmentWorkDayList(departmentTimeShiftId, monthId,
            dayInWeek, castId, attenderId);
    }
}

[Route("MC")]
[Authorize]
public class AttenderTimeSheetLineController : Controller
{
    [Route("[controller]/{attenderid}/{attendername}/{departmentid}/{departmentname}")]
    [Authenticate(Operation.VIW, "AttenderTimeSheet")]
    [HttpGet]
    public IActionResult Index()
    {
        return View(Views.MC.AttenderTimeSheetLineIndex);
    }
}