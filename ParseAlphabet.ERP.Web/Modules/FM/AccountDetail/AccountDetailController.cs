using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.FM.AccountDetail;
using ParsAlphabet.ERP.Application.Dtos.PB;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.AccountDetail;

namespace ParseAlphabet.ERP.Web.Modules.FM.AccountDetail;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class AccountDetailApiController : ControllerBase
{
    private readonly IHttpContextAccessor _accessor;
    private readonly AccountDetailRepository _accountDetailRepository;

    public AccountDetailApiController(AccountDetailRepository accountDetailRepository, IHttpContextAccessor accessor)
    {
        _accountDetailRepository = accountDetailRepository;
        _accessor = accessor;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<AccountDetailGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _accountDetailRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _accountDetailRepository.GetColumns();
    }

    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    [HttpGet]
    public async Task<ActionResult> Csv(string stringedModel)
    {
        var model = JsonConvert.DeserializeObject<NewGetPageViewModel>(stringedModel);
        model.CompanyId = UserClaims.GetCompanyId();
        var resultCsv = await _accountDetailRepository.CSV(model);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "کدینگ حسابداری - تفصیل.csv" };
    }

    [HttpPost]
    [Route("save")]
    public async Task<MyResultStatus> AccountDetailSave([FromBody] AccountDetailModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _accountDetailRepository.Save(model);
    }

    [HttpPost]
    [Route("searchold")]
    public async Task<MyResultDataStatus<IEnumerable<AccountDetailSearch>>> SearchAccountDetailOld(
        [FromBody] GetPublicSearch model)
    {
        var filter = $"CompanyId={int.Parse(User.FindFirstValue("CompanyId"))}";

        if (!model.Filter.IsNullOrEmptyOrWhiteSpace())
            filter += $" {model.Filter}";

        if ((int.TryParse(model.Items[0].ToString(), out _) ? int.Parse(model.Items[0].ToString()) : 0) != 0)
            filter +=
                $" AND Id={(int.TryParse(model.Items[0].ToString(), out _) ? int.Parse(model.Items[0].ToString()) : 0)}";

        if (model.Items[1].ToString().Trim() != string.Empty)
            filter += $" AND Name LIKE N'%{model.Items[1]}%'";

        if ((int.TryParse(model.Items[2].ToString(), out _) ? int.Parse(model.Items[2].ToString()) : 0) != 0 &&
            (int.TryParse(model.Items[3].ToString(), out _) ? int.Parse(model.Items[3].ToString()) : 0) != 0)
            filter +=
                $"AND NoSeriesId IN(SELECT  NoSeriesId FROM fm.AccountSGLNoSeries WHERE AccountGLId={(int.TryParse(model.Items[2].ToString(), out _) ? int.Parse(model.Items[2].ToString()) : 0)} AND AccountSGLId={(int.TryParse(model.Items[3].ToString(), out _) ? int.Parse(model.Items[3].ToString()) : 0)})";

        MyClaim.Init(_accessor);


        var searchModel = new PublicSearch
        {
            PageNo = model.PageNo,
            PageRowsCount = model.PageRowsCount,
            IsSecondLang = MyClaim.IsSecondLang,
            CompanyId = int.Parse(User.FindFirstValue("CompanyId")),
            TableName = "fm.AccountDetail",
            IdColumnName = "Id",
            ColumnNameList =
                "Id,Name,NoSeriesId,(SELECT Top 1 Name FROM gn.NoSeries nss WHERE CompanyId=1 AND Id=NoSeriesId) NoSeriesName,IsActive",
            Filter = filter,
            OrderBy = "Id ASC"
        };

        var result = await _accountDetailRepository.SearchPlugin(searchModel);
        return result;
    }


    [HttpPost]
    [Route("search")]
    public async Task<MyResultDataStatus<IEnumerable<AccountDetailSearch>>> SearchAccountDetail(
        [FromBody] GetPublicSearch model)
    {
        var searchModel = new GetAccountDetailSearch();
        searchModel.PageNo = model.PageNo;
        searchModel.PageRowsCount = model.PageRowsCount;

        searchModel.CompanyId = UserClaims.GetCompanyId();

        if (model.Parameters.Any(x => x.Name == "id"))
        {
            var id = model.Parameters.Where(x => x.Name == "id").Select(x => x.Value).FirstOrDefault();
            if (id != "")
                searchModel.Id =
                    int.Parse(model.Parameters.Where(x => x.Name == "id").Select(x => x.Value).FirstOrDefault());
            else
                searchModel.Id = null;
        }
        else
        {
            searchModel.Id = null;
        }

        if (model.Parameters.Any(x => x.Name == "accountGLId") && model.Parameters.Any(x => x.Name == "toAccountGLId"))
        {
            searchModel.FromAccountGLId = int.Parse(model.Parameters.Where(x => x.Name == "accountGLId")
                .Select(x => x.Value).FirstOrDefault());
            searchModel.ToAccountGLId = int.Parse(model.Parameters.Where(x => x.Name == "toAccountGLId")
                .Select(x => x.Value).FirstOrDefault());
        }
        else
        {
            searchModel.FromAccountGLId = int.Parse(model.Parameters.Where(x => x.Name == "accountGLId")
                .Select(x => x.Value).FirstOrDefault());
            searchModel.ToAccountGLId = int.Parse(model.Parameters.Where(x => x.Name == "accountGLId")
                .Select(x => x.Value).FirstOrDefault());
        }

        if (model.Parameters.Any(x => x.Name == "accountSGLId") &&
            model.Parameters.Any(x => x.Name == "toAccountSGLId"))
        {
            searchModel.FromAccountSGLId = int.Parse(model.Parameters.Where(x => x.Name == "accountSGLId")
                .Select(x => x.Value).FirstOrDefault());
            searchModel.ToAccountSGLId = int.Parse(model.Parameters.Where(x => x.Name == "toAccountSGLId")
                .Select(x => x.Value).FirstOrDefault());
        }
        else
        {
            searchModel.FromAccountSGLId = int.Parse(model.Parameters.Where(x => x.Name == "accountSGLId")
                .Select(x => x.Value).FirstOrDefault());
            searchModel.ToAccountSGLId = int.Parse(model.Parameters.Where(x => x.Name == "accountSGLId")
                .Select(x => x.Value).FirstOrDefault());
        }

        if (model.Parameters.Any(x => x.Name == "name"))
        {
            searchModel.Name = model.Parameters.Where(x => x.Name == "name").Select(x => x.Value).FirstOrDefault();

            if (searchModel.Name.IsNullOrEmptyOrWhiteSpace())
                searchModel.Name = null;
        }
        else
        {
            searchModel.Name = null;
        }

        if (model.Parameters.Any(x => x.Name == "noSeriesName"))
        {
            searchModel.NoSeriesName = model.Parameters.Where(x => x.Name == "noSeriesName").Select(x => x.Value)
                .FirstOrDefault();

            if (searchModel.NoSeriesName.IsNullOrEmptyOrWhiteSpace())
                searchModel.NoSeriesName = null;
        }
        else
        {
            searchModel.NoSeriesName = null;
        }

        if (model.Form_KeyValue != null && model.Form_KeyValue.Count() > 0)
            searchModel.IsActive = (bool)model.Form_KeyValue[0];

        if (model.Parameters.Any(x => x.Name == "idNumber"))
        {
            searchModel.IdNumber =
                model.Parameters.Where(x => x.Name == "idNumber").Select(x => x.Value).FirstOrDefault();

            if (searchModel.IdNumber.IsNullOrEmptyOrWhiteSpace())
                searchModel.IdNumber = null;
        }
        else
        {
            searchModel.IdNumber = null;
        }

        if (model.Parameters.Any(x => x.Name == "agentFullName"))
        {
            searchModel.AgentFullName = model.Parameters.Where(x => x.Name == "agentFullName").Select(x => x.Value)
                .FirstOrDefault();

            if (searchModel.AgentFullName.IsNullOrEmptyOrWhiteSpace())
                searchModel.AgentFullName = null;
        }
        else
        {
            searchModel.AgentFullName = null;
        }

        if (model.Parameters.Any(x => x.Name == "jobTitle"))
        {
            searchModel.JobTitle =
                model.Parameters.Where(x => x.Name == "jobTitle").Select(x => x.Value).FirstOrDefault();

            if (searchModel.JobTitle.IsNullOrEmptyOrWhiteSpace())
                searchModel.JobTitle = null;
        }
        else
        {
            searchModel.JobTitle = null;
        }

        if (model.Parameters.Any(x => x.Name == "brandName"))
        {
            searchModel.BrandName =
                model.Parameters.Where(x => x.Name == "brandName").Select(x => x.Value).FirstOrDefault();

            if (searchModel.BrandName.IsNullOrEmptyOrWhiteSpace())
                searchModel.BrandName = null;
        }
        else
        {
            searchModel.BrandName = null;
        }


        if (model.Parameters.Any(x => x.Name == "nationalCode"))
        {
            searchModel.NationalCode = model.Parameters.Where(x => x.Name == "nationalCode").Select(x => x.Value)
                .FirstOrDefault();

            if (searchModel.NationalCode.IsNullOrEmptyOrWhiteSpace())
                searchModel.NationalCode = null;
        }
        else
        {
            searchModel.NationalCode = null;
        }

        if (model.Parameters.Any(x => x.Name == "personGroupName"))
        {
            searchModel.PersonGroupName = model.Parameters.Where(x => x.Name == "personGroupName").Select(x => x.Value)
                .FirstOrDefault();

            if (searchModel.PersonGroupName.IsNullOrEmptyOrWhiteSpace())
                searchModel.PersonGroupName = null;
        }
        else
        {
            searchModel.PersonGroupName = null;
        }

        var result = await _accountDetailRepository.SearchPluginPagination(searchModel);
        return result;
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown()
    {
        var companyId = UserClaims.GetCompanyId();
        var result = await _accountDetailRepository.GetDropDown(companyId);
        return result;
    }

    [HttpGet]
    [Route("getaccountdetailbyitem/{categoryId}/{stageId}/{postingGroupTypeLineIds}/{branchId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetAccountDetailByItem(short categoryId, short stageId,
        string postingGroupTypeLineIds, short branchId)

    {
        var userId = UserClaims.GetUserId();
        ;
        var result =
            await _accountDetailRepository.GetAccountDetailByItem(categoryId, stageId, postingGroupTypeLineIds,
                branchId, userId);
        return result;
    }


    [HttpPost]
    [Route("checkexistaccountdetail/{isActive}")]
    public async Task<byte> CheckExistAccountDetail([FromBody] int id, [FromRoute] byte? isActive = 1)
    {
        var companyId = UserClaims.GetCompanyId();
        var result = await _accountDetailRepository.CheckExistAccountDetail(id, companyId, isActive);
        return result;
    }

    [HttpPost]
    [Route("getname")]
    public async Task<string> GetAccountDetailName([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _accountDetailRepository.GetName(id, companyId);
    }

    [HttpPost]
    [Route("getnameaccountDetail")]
    public async Task<string> GetAccountDetaisName([FromBody] NoSeries noSeries)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _accountDetailRepository.GetAccountDetaisNameiesName(noSeries.Id, noSeries.NoSeriesId, companyId);
    }

    [HttpGet]
    [Route("getaccountdetailnamewhitnoseries/{noSeriesId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetAccountDetaisName(short noSeriesId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _accountDetailRepository.GetAccountDetailNameWhitNoSeries(noSeriesId, companyId);
    }


    [HttpPost]
    [Route("getminmax")]
    public async Task<Tuple<int, int>> GetMinIdMaxId()
    {
        var companyId = UserClaims.GetCompanyId();
        return await _accountDetailRepository.GetMinMax(companyId);
    }


    [HttpPost]
    [Route("getbrandname")]
    public async Task<string> GetBrandName([FromBody] AcountDetail_BrandName model)
    {
        return await _accountDetailRepository.GetBrandNameByAccountDetailId(model.AccountDetailId);
    }
}

[Route("FM")]
[Authorize]
public class AccountDetailController : Controller
{
    [Route("[controller]")]
    [HttpGet]
    [Authenticate("VIW", "")]
    public ActionResult Index()
    {
        return PartialView(Views.FM.AccountDetail);
    }
}