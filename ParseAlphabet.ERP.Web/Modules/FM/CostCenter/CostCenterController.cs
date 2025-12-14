using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.FM.CostCenter;
using ParsAlphabet.ERP.Application.Dtos.PB;
using ParsAlphabet.ERP.Application.Interfaces.FM;
using ParsAlphabet.ERP.Application.Interfaces.FM.CostCenterLine;
using ParsAlphabet.ERP.Application.Interfaces.PB;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.CostCenter;

namespace ParseAlphabet.ERP.Web.Modules.FM.CostCenter;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class CostCenterApiController : ControllerBase
{
    private readonly IHttpContextAccessor _accessor;
    private readonly ICostCenterLineRepository _costCenterLineRepository;
    private readonly CostCenterRepository _costCenterRepository;
    private readonly IFinanceRepository _fm;
    private readonly IPublicRepository _publicRepository;

    public CostCenterApiController(CostCenterRepository CostCenterRepository,
        ICostCenterLineRepository CostCenterLineRepository,
        IHttpContextAccessor accessor, IPublicRepository publicRepository, IFinanceRepository fm)
    {
        _costCenterRepository = CostCenterRepository;
        _costCenterLineRepository = CostCenterLineRepository;
        _accessor = accessor;
        _publicRepository = publicRepository;
        _fm = fm;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<CostCenterGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _costCenterRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<CostCenterGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _costCenterRepository.GetRecordById(keyvalue, CompanyId);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] CostCenterModel model)
    {
        if (ModelState.IsValid)
        {
            MyClaim.Init(_accessor);
            model.IsSecondLang = MyClaim.IsSecondLang;
            model.CompanyId = UserClaims.GetCompanyId();

            #region ویرایش تفضیل :accountDetailCostCenterList

            var accountDetailViewModel = new
            {
                model.CostDriverId,
                CostDriverName = model.CostDriverId > 0 ? await _fm.CostDriver_GetName(model.CostDriverId) : ""
            };
            model.JsonAccountDetailList = JsonConvert.SerializeObject(accountDetailViewModel);

            #endregion

            return await _costCenterRepository.Insert(model, "fm");
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] CostCenterModel model)
    {
        if (ModelState.IsValid)
        {
            MyClaim.Init(_accessor);
            model.IsSecondLang = MyClaim.IsSecondLang;
            model.CompanyId = UserClaims.GetCompanyId();

            #region ویرایش تفضیل :accountDetailCostCenterList

            var accountDetailViewModel = new
            {
                model.CostDriverId,
                CostDriverName = model.CostDriverId > 0 ? await _fm.CostDriver_GetName(model.CostDriverId) : ""
            };
            model.JsonAccountDetailList = JsonConvert.SerializeObject(accountDetailViewModel);

            #endregion

            return await _costCenterRepository.Update(model, "fm");
        }

        return ModelState.ToMyResultQuery<int>();
    }


    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var companyId = int.Parse(User.FindFirst("CompanyId")?.Value);
        var result = await _costCenterRepository.Delete($"Id={keyvalue} AND CompanyId={companyId}", "fm");
        if (result.Successfull) await _costCenterLineRepository.DeleteByCostCenterId(keyvalue);
        return result;
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _costCenterRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown/{isActive?}")]
    public async Task<List<MyDropDownViewModel>> GetDropDown(string? term, byte? isActive)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _costCenterRepository.GetDropDown(term, companyId, isActive);
    }

    [HttpGet]
    [Route("isactive/{id}")]
    public async Task<bool> GetIsActive(int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _costCenterRepository.GetIsActive(id, companyId);
    }

    [HttpPost]
    [Route("getname")]
    public async Task<string> GetCostCenterName([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _costCenterRepository.GetName(id, companyId);
    }

    [HttpPost]
    [Route("search")]
    public async Task<MyResultDataStatus<IEnumerable<MyDropDownViewModel2>>> SearchAccountDetail(
        [FromBody] GetPublicSearch model)
    {
        var companyId = UserClaims.GetCompanyId();

        var filter = $"CompanyId={companyId}";

        if (model.Items.Length > 4 && Convert.ToByte(model.Items[4]) != 0)
            filter += $" AND ISNULL(IsActive,0) = {(Convert.ToByte(model.Items[4]) == 2 ? 0 : 1)}";

        if ((int.TryParse(model.Items[0].ToString(), out _) ? int.Parse(model.Items[0].ToString()) : 0) != 0)
            filter +=
                $" AND Id={(int.TryParse(model.Items[0].ToString(), out _) ? int.Parse(model.Items[0].ToString()) : 0)}";

        if (model.Items[1].ToString().Trim() != string.Empty)
            filter += $" AND Name LIKE N'%{model.Items[1]}%'";

        if ((int.TryParse(model.Items[2].ToString(), out _) ? int.Parse(model.Items[2].ToString()) : 0) != 0 &&
            (int.TryParse(model.Items[3].ToString(), out _) ? int.Parse(model.Items[3].ToString()) : 0) != 0)
            filter += $@" AND Id IN(SELECT CostCenterId 
                                        FROM fm.AccountSGLCostCenter 
                                        WHERE AccountGLId={(int.TryParse(model.Items[2].ToString(), out _) ? int.Parse(model.Items[2].ToString()) : 0)} 
                                                   AND AccountSGLId={(int.TryParse(model.Items[3].ToString(), out _) ? int.Parse(model.Items[3].ToString()) : 0)} 
                                                   AND CompanyId={companyId})";

        MyClaim.Init(_accessor);

        var searchModel = new PublicSearch
        {
            IsSecondLang = MyClaim.IsSecondLang,
            CompanyId = int.Parse(User.FindFirstValue("CompanyId")),
            TableName = "fm.CostCenter",
            IdColumnName = "Id",
            TitleColumnName = "Name",
            Filter = filter
        };

        var result = await _publicRepository.Search(searchModel);
        return result;
    }

    [HttpPost]
    [Route("checkexistcostcenterid")]
    public async Task<bool> CheckExistCostCenter([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _costCenterRepository.CheckExist(id, companyId);
    }
}

[Route("FM")]
[Authorize]
public class CostCenterController : Controller
{
    [Route("[controller]")]
    [HttpGet]
    [Authenticate("VIW", "")]
    public ActionResult Index()
    {
        return PartialView(Views.FM.CostCenter);
    }
}