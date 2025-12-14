using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.GN.Currency;
using ParsAlphabet.ERP.Application.Dtos.PB;
using ParsAlphabet.ERP.Application.Interfaces.PB;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.Company;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.Currency;

namespace ParseAlphabet.ERP.Web.Modules.GN.Currency;

[Route("api/GN/[controller]")]
[ApiController]
[Authorize]
public class CurrencyApiController : ControllerBase
{
    private readonly IHttpContextAccessor _accessor;

    private readonly CompanyRepository _companyRepository;
    private readonly CurrencyRepository _CurrencyRepository;
    private readonly IPublicRepository _publicRepository;

    public CurrencyApiController(CurrencyRepository CurrencyRepository, CompanyRepository companyRepository,
        IHttpContextAccessor accessor, IPublicRepository publicRepository)
    {
        _CurrencyRepository = CurrencyRepository;
        _companyRepository = companyRepository;
        _publicRepository = publicRepository;
        _accessor = accessor;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<CurrencyGetPage>>> GetPage([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _CurrencyRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<CurrencyGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        return await _CurrencyRepository.GetRecordById(keyvalue);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _CurrencyRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> Insert([FromBody] CurrencyModel model)
    {
        var result = new MyResultStatus();
        var CompanyId = UserClaims.GetCompanyId();
        var BranchCount = await _companyRepository.GetUBranchCount(CompanyId);

        var CurrencyActiveCount = await _CurrencyRepository.GetCurencyhCount(CompanyId);
        if (BranchCount > CurrencyActiveCount)
        {
            result.Successfull = false;
            result.StatusMessage = "مجاز به ثبت شعبه جدید نمی باشید";
            return result;
        }


        if (ModelState.IsValid)
            return await _CurrencyRepository.Insert(model);

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultStatus> Update([FromBody] CurrencyModel model)
    {
        if (ModelState.IsValid)
            return await _CurrencyRepository.Update(model);

        return ModelState.ToMyResultStatus<int>();
    }


    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultStatus> Delete([FromBody] int keyvalue)
    {
        return await _CurrencyRepository.Delete(keyvalue);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] GetPageViewModel model)
    {
        return await _CurrencyRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown()
    {
        return await _CurrencyRepository.GetDropDown("IsActive = 1");
    }

    [HttpPost]
    [Route("search")]
    public async Task<MyResultDataStatus<IEnumerable<MyDropDownViewModel2>>> SearchAccountSGL(
        [FromBody] GetPublicSearch model)
    {
        var filter = "";

        if ((int.TryParse(model.Items[0].ToString(), out _) ? int.Parse(model.Items[0].ToString()) : 0) != 0)
            filter +=
                $" AND Id={(int.TryParse(model.Items[0].ToString(), out _) ? int.Parse(model.Items[0].ToString()) : 0)}";

        if (model.Items[1].ToString().Trim() != string.Empty)
            filter += $" AND Name LIKE N'%{model.Items[1]}%'";

        MyClaim.Init(_accessor);

        var searchModel = new PublicSearch
        {
            IsSecondLang = MyClaim.IsSecondLang,
            CompanyId = UserClaims.GetCompanyId(),
            TableName = "gn.Currency",
            IdColumnName = "Id",
            TitleColumnName = "Name",
            Filter = filter
        };

        var result = await _publicRepository.Search(searchModel);
        return result;
    }


    [HttpPost]
    [Route("getnumOfRud")]
    public async Task<byte> GetNumOfRud([FromBody] int id)
    {
        return await _CurrencyRepository.GetNumOfRud(id);
    }
}

[Route("GN")]
[Authorize]
public class CurrencyController : Controller
{
    [Route("[controller]")]
    [HttpGet]
    [Authenticate(Operation.VIW, "")]
    public ActionResult Index()
    {
        return PartialView(Views.GN.Currency);
    }
}