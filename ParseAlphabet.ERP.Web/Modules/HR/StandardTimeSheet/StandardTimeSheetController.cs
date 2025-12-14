using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.HR.StandardTimeSheet;
using ParsAlphabet.ERP.Infrastructure.Implantation.HR.StandardTimeSheet;
using static ParsAlphabet.ERP.Application.Enums.Enum;


namespace ParseAlphabet.ERP.Web.Modules.HR.StandardTimeSheet;

[Route("api/HR/[controller]")]
[ApiController]
[Authorize]
public class StandardTimeSheetApiController : ControllerBase
{
    private readonly IHttpContextAccessor _accessor;
    private readonly StandardTimeSheetRepository _employeeStandardTimeSheetRepository;

    public StandardTimeSheetApiController(StandardTimeSheetRepository employeeStandardTimeSheetRepository,
        IHttpContextAccessor accessor)
    {
        _employeeStandardTimeSheetRepository = employeeStandardTimeSheetRepository;
        _accessor = accessor;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<StandardTimeSheetGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        // post
        model.CompanyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;

        if (model.Form_KeyValue[2]?.ToString() == "my")
            model.Form_KeyValue[3] = User.FindFirstValue("UserId");

        return await _employeeStandardTimeSheetRepository.GetPage(model, userId, roleId);
    }

    [HttpGet]
    [Route("display/{id}/{headerPagination}")]
    [Authenticate(Operation.VIW, "")]
    public async Task<List<StandardTimeSheetMonth>> Display(int id, int headerPagination)
    {
        return await _employeeStandardTimeSheetRepository.Display(id, headerPagination);
    }


    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<StandardTimeSheetGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        // post
        var CompanyId = UserClaims.GetCompanyId();
        return await _employeeStandardTimeSheetRepository.GetRecordById(keyvalue, CompanyId);
    }

    [HttpPost]
    [Route("getinfo")]
    public async Task<StandardTimeSheetInfo> GetInfo([FromBody] int id)
    {
        // post
        var CompanyId = UserClaims.GetCompanyId();
        return await _employeeStandardTimeSheetRepository.GetInfo(id, CompanyId);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        // post
        return _employeeStandardTimeSheetRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> Insert([FromBody] StandardTimeSheetModel model)
    {
        if (ModelState.IsValid)
        {
            MyClaim.Init(_accessor);
            model.CompanyId = UserClaims.GetCompanyId();
            model.CreateUserId = UserClaims.GetUserId();
            ;
            return await _employeeStandardTimeSheetRepository.InsertUpdate(model, OperationType.Insert);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("duplicate")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> Duplicate([FromBody] StandardTimeSheetDuplicate model)
    {
        if (ModelState.IsValid)
        {
            model.CreateUserId = UserClaims.GetUserId();
            ;
            return await _employeeStandardTimeSheetRepository.Duplicate(model);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultStatus> Update([FromBody] StandardTimeSheetModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.CreateUserId = UserClaims.GetUserId();
            ;
            return await _employeeStandardTimeSheetRepository.InsertUpdate(model, OperationType.Update);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("updateinline")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultStatus> UpdateInline([FromBody] StandardTimeSheetModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.CreateUserId = short.Parse(User.FindFirstValue("UserId"));
            return await _employeeStandardTimeSheetRepository.InsertUpdate(model, OperationType.Update);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _employeeStandardTimeSheetRepository.Delete(keyvalue, "hr", CompanyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;

        if (model.Form_KeyValue[2]?.ToString() == "my")
            model.Form_KeyValue[3] = User.FindFirstValue("UserId");

        return await _employeeStandardTimeSheetRepository.Csv(model, userId, roleId);
    }

    [HttpPost]
    [Route("checkexist")]
    public async Task<bool> CheckExistStandardTimeSheetId([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _employeeStandardTimeSheetRepository.CheckExist(id, companyId);
    }

    [HttpGet]
    [Route("calculationBasedTypegetDropDown")]
    public async Task<IEnumerable<MyDropDownViewModel>> CalculationBasedTypegetDropDown()
    {
        return await _employeeStandardTimeSheetRepository.CalculationBasedTypegetDropDown();
    }

    [HttpGet]
    [Route("getdropdown/{departmentId}")]
    public async Task<List<MyDropDownViewModel>> GetDropdown(short departmentId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _employeeStandardTimeSheetRepository.GetDropDownByDepartmentId(departmentId, companyId);
    }


    [HttpGet]
    [Route("getdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropdown()
    {
        var companyId = UserClaims.GetCompanyId();
        return await _employeeStandardTimeSheetRepository.GetDropDown(companyId);
    }
}

[Route("HR")]
[Authorize]
public class StandardTimeSheetController : Controller
{
    [Route("[controller]")]
    [HttpGet]
    [Authenticate(Operation.VIW, "")]
    public ActionResult Index()
    {
        return PartialView(Views.HR.StandardTimeSheet);
    }

    [Route("[controller]/employeeStandardTimeSheetDisplay/{headerId}")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Display(int headerId)
    {
        return PartialView(Views.HR.StandardTimeSheetDisplay);
    }
}