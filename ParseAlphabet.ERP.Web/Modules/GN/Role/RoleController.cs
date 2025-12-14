using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.GN.Role;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.Role;

namespace ParseAlphabet.ERP.Web.Modules.GN.Role;

[Route("api/GN/[controller]")]
[ApiController]
[Authorize]
public class RoleApiController : ControllerBase
{
    private readonly RoleRepository _RoleRepository;

    public RoleApiController(RoleRepository RoleRepository)
    {
        _RoleRepository = RoleRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<RoleGetPage>>> GetPage([FromBody] NewGetPageViewModel pageViewModel)
    {
        pageViewModel.CompanyId = UserClaims.GetCompanyId();
        return await _RoleRepository.GetPage(pageViewModel);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<RoleGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        return new MyResultPage<RoleGetRecord>
        {
            Data = await _RoleRepository.GetRecordById<RoleGetRecord>(keyvalue, false, "gn")
        };
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _RoleRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] RoleModel model)
    {
        if (ModelState.IsValid)
            return await _RoleRepository.Insert(model, "gn");
        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] RoleModel model)
    {
        if (ModelState.IsValid)
            return await _RoleRepository.Update(model, "gn");
        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _RoleRepository.Delete(keyvalue, "gn", companyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        return await _RoleRepository.Csv(model);
    }

    [HttpPost]
    [Route("getauthenitems")]
    public async Task<MyResultPage<List<GetAuthenViewModel>>> GetAuthenItems([FromBody] GetAuthenModel model)
    {
        model.Language = User.FindFirstValue("Language");
        return await _RoleRepository.GetAuthenItems(model);
    }

    [HttpPost]
    [Route("setauthenitems")]
    public async Task<MyResultQuery> SetAuthenItems([FromBody] SetAuthenModel model)
    {
        model.UserId = UserClaims.GetUserId();
        ;
        return await _RoleRepository.SetAuthenItems(model);
    }

    [HttpGet]
    [Route("getdropdown/{isActive}")]
    [Authenticate(Operation.VIW, "")]
    public async Task<List<MyDropDownViewModel>> GetDropDown(byte isActive = 2)
    {
        return await _RoleRepository.GetDropDown(isActive);
    }

    [HttpGet]
    [Route("getalldatadropdown")]
    [Authenticate(Operation.VIW, "")]
    public async Task<List<MyDropDownViewModel>> GetAllDataDropDown()
    {
        return await _RoleRepository.GetAllDataDropDown();
    }
}

[Route("GN")]
[Authorize]
public class RoleController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.GN.Role);
    }
}