using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.GN.LocState;
using ParsAlphabet.ERP.Application.Dtos.PB;
using ParsAlphabet.ERP.Application.Interfaces.PB;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.LocState;

namespace ParseAlphabet.ERP.Web.Modules.GN.LocState;

[Route("api/GN/[controller]")]
[ApiController]
[Authorize]
public class LocStateApiController : ControllerBase
{
    private readonly IHttpContextAccessor _accessor;
    private readonly LocStateRepository _LocStateRepository;
    private readonly IPublicRepository _publicRepository;

    public LocStateApiController(LocStateRepository LocStateRepository, IHttpContextAccessor accessor,
        IPublicRepository publicRepository)
    {
        _LocStateRepository = LocStateRepository;
        _accessor = accessor;
        _publicRepository = publicRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<LocStateGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        return await _LocStateRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<LocStateGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        return await _LocStateRepository.GetRecordById(keyvalue);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _LocStateRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] LocStateModel model)
    {
        if (ModelState.IsValid)
        {
            model.TableName = "gn.LocState";
            model.IsSecondLang = MyClaim.IsSecondLang;
            model.CompanyId = UserClaims.GetCompanyId();
            return await _LocStateRepository.Insert(model, "pb", true);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] LocStateModel model)
    {
        if (ModelState.IsValid)
        {
            model.TableName = "gn.LocState";
            model.IsSecondLang = MyClaim.IsSecondLang;
            model.CompanyId = UserClaims.GetCompanyId();
            return await _LocStateRepository.Update(model, "pb", true);
        }

        return ModelState.ToMyResultQuery<int>();
    }


    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultStatus> Delete([FromBody] int keyvalue)
    {
        return await _LocStateRepository.Delete(keyvalue);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        return await _LocStateRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<List<MyDropDownViewModel>> GetDropDown(string? term)
    {
        return await _LocStateRepository.GetDropDown(term);
    }

    [HttpPost]
    [Route("search")]
    public async Task<MyResultDataStatus<IEnumerable<MyDropDownViewModel2>>> SearchLocState(
        [FromBody] GetPublicSearch model)
    {
        var filter = "1=1";

        if (int.Parse(model.Items[0].ToString()) != 0)
            filter += $" AND (Id={int.Parse(model.Items[0].ToString())})";

        if (model.Items[1].ToString().Trim() != string.Empty)
            filter += $" AND (Name LIKE N'%{model.Items[1]}%')";

        MyClaim.Init(_accessor);

        var searchModel = new PublicSearch
        {
            IsSecondLang = MyClaim.IsSecondLang,
            CompanyId = int.Parse(User.FindFirstValue("CompanyId")),
            TableName = "gn.LocState",
            IdColumnName = "Id",
            TitleColumnName = "Name",
            Filter = filter
        };

        var result = await _publicRepository.Search(searchModel);
        return result;
    }
}

[Route("GN")]
[Authorize]
public class LocStateController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.GN.LocState);
    }
}