using System.Collections;
using System.Security.Claims;
using CIS.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.GN.FavoriteDescription;
using ParsAlphabet.ERP.Application.Dtos.PB;
using ParsAlphabet.ERP.Application.Interfaces.PB;

namespace ParseAlphabet.ERP.Web.Modules.FM.JournalDescription;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class JournalDescriptionApiController : ControllerBase
{
    private readonly IHttpContextAccessor _accessor;
    private readonly IFavoriteDescriptionRepository _favoriteDescriptionRepository;
    private readonly IPublicRepository _publicRepository;


    public JournalDescriptionApiController(IFavoriteDescriptionRepository favoriteDescriptionRepository,
        IHttpContextAccessor accessor, IPublicRepository publicRepository)
    {
        _favoriteDescriptionRepository = favoriteDescriptionRepository;
        _accessor = accessor;
        _publicRepository = publicRepository;
    }


    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<FavoriteDescriptionGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;
        return await _favoriteDescriptionRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<FavoriteDescriptionGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _favoriteDescriptionRepository.GetRecordById(keyvalue, CompanyId);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] FavoriteDescriptionModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _favoriteDescriptionRepository.Insert(model);
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
            return await _favoriteDescriptionRepository.Update(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        return await _favoriteDescriptionRepository.Delete(keyvalue);
    }

    [HttpGet]
    [Route("getdropdownbyuserid")]
    public async Task<List<MyDropDownViewModel>> GetDropDownByUserId()
    {
        var userId = UserClaims.GetUserId();
        ;
        var companyId = UserClaims.GetCompanyId();
        return await _favoriteDescriptionRepository.GetDropDownByUserId(userId, companyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;
        return await _favoriteDescriptionRepository.Csv(model);
    }

    [HttpPost]
    [Route("searchold")]
    public async Task<MyResultDataStatus<IEnumerable<MyDropDownViewModel2>>> SearchFavoriteDescriptionOld(
        [FromBody] GetPublicSearch model)
    {
      return await _favoriteDescriptionRepository.SearchFavoriteDescriptionOld(model);
    }

    [HttpPost]
    [Route("search")]
    public async Task<MyResultDataStatus<IEnumerable<MyDropDownViewModel2>>> SearchFavoriteDescription(
        [FromBody] GetPublicSearch model)
    {
      return await _favoriteDescriptionRepository.SearchFavoriteDescription(model);
    }
}

[Route("FM")]
[Authorize]
public class JournalDescriptionController : Controller
{
    [Route("[controller]")]
    [HttpGet]
    [Authenticate(Operation.VIW, "")]
    public ActionResult Index()
    {
        return PartialView(Views.FM.JournalDescription);
    }
}