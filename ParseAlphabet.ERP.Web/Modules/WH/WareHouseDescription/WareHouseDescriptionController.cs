using System.Collections;
using System.Security.Claims;
using CIS.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.GN.FavoriteDescription;
using ParsAlphabet.ERP.Application.Dtos.PB;
using ParsAlphabet.ERP.Application.Interfaces.PB;

namespace ParseAlphabet.ERP.Web.Modules.WH.WareHouseDescription;

[Route("api/WH/[controller]")]
[ApiController]
[Authorize]
public class WareHouseDescriptionApiController(
    IFavoriteDescriptionRepository favoriteDescriptionRepository,
    IHttpContextAccessor accessor,
    IPublicRepository publicRepository)
    : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<FavoriteDescriptionGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;
        return await favoriteDescriptionRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<FavoriteDescriptionGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await favoriteDescriptionRepository.GetRecordById(keyvalue, CompanyId);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] FavoriteDescriptionModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await favoriteDescriptionRepository.Insert(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] FavoriteDescriptionModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await favoriteDescriptionRepository.Update(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        return await favoriteDescriptionRepository.Delete(keyvalue);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        var workFlowCategoryId = "11";
        return favoriteDescriptionRepository.GetColumns(workFlowCategoryId);
    }


    [HttpGet]
    [Route("getdropdownbyuserid")]
    public async Task<List<MyDropDownViewModel>> GetDropDownByUserId()
    {
        var userId = UserClaims.GetUserId();
        ;
        var companyId = UserClaims.GetCompanyId();
        return await favoriteDescriptionRepository.GetDropDownByUserId(userId, companyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;
        return await favoriteDescriptionRepository.Csv(model);
    }

    [HttpPost]
    [Route("searchold")]
    public async Task<MyResultDataStatus<IEnumerable<MyDropDownViewModel2>>> SearchFavoriteDescriptionOld(
        [FromBody] GetPublicSearch model)
    {
        var filter = $"CompanyId={int.Parse(User.FindFirstValue("CompanyId"))} AND IsActive=1";

        if (int.Parse(model.Items[0].ToString()) != 0)
            filter += $" AND Id={int.Parse(model.Items[0].ToString())}";

        if (model.Items[1].ToString().Trim() != string.Empty)
            filter += $" AND Description LIKE N'%{model.Items[1]}%'";

        MyClaim.Init(accessor);

        var searchModel = new PublicSearch
        {
            IsSecondLang = MyClaim.IsSecondLang,
            CompanyId = int.Parse(User.FindFirstValue("CompanyId")),
            TableName = "gn.FavoriteDescription",
            IdColumnName = "Id",
            TitleColumnName = "Description",
            Filter = filter
        };

        var result = await publicRepository.Search(searchModel);
        return result;
    }

    [HttpPost]
    [Route("search")]
    public async Task<MyResultDataStatus<IEnumerable<MyDropDownViewModel2>>> SearchFavoriteDescription(
        [FromBody] GetPublicSearch model)
    {
        var filter = $"CompanyId={int.Parse(User.FindFirstValue("CompanyId"))} AND IsActive=1";

        if (model.Form_KeyValue != null && model.Form_KeyValue.Length > 0)
            filter += $" AND StageId = {Convert.ToInt32(model.Form_KeyValue[0])}";

        if (model.Parameters.Any(x => x.Name == "id"))
        {
            var id = model.Parameters.Where(x => x.Name == "id").Select(x => x.Value).FirstOrDefault();
            if (id != "")
                filter += $" AND Id={id}";
        }

        if (model.Parameters.Any(x => x.Name == "name"))
            if (model.Parameters.Where(x => x.Name == "name").Select(x => x.Value).FirstOrDefault() != "")
                filter +=
                    $" AND Description LIKE N'%{model.Parameters.Where(x => x.Name == "name").Select(x => x.Value).FirstOrDefault()}%'";

        MyClaim.Init(accessor);

        var searchModel = new PublicSearch
        {
            IsSecondLang = MyClaim.IsSecondLang,
            CompanyId = int.Parse(User.FindFirstValue("CompanyId")),
            TableName = "gn.FavoriteDescription",
            IdColumnName = "Id",
            TitleColumnName = "Description",
            Filter = filter
        };

        var result = await publicRepository.Search(searchModel);
        return result;
    }
}

[Route("WH")]
[Authorize]
public class WareHouseDescriptionController : Controller
{
    [Route("[controller]")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.WH.WareHouseDescription);
    }
}