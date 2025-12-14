using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FA.FixedAsset;
using ParsAlphabet.ERP.Infrastructure.Implantation.FA.FixedAsset;

namespace ParseAlphabet.ERP.Web.Modules.FA.FixedAsset;

[Route("api/FA/[controller]")]
[ApiController]
[Authorize]
public class FixedAssetApiController : ControllerBase
{
    private readonly FixedAssetRepository _FixedAssetRepository;

    public FixedAssetApiController(FixedAssetRepository FixedAssetRepository)
    {
        _FixedAssetRepository = FixedAssetRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<FixedAssetGetPage>>> GetPage([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _FixedAssetRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getPageDiAssignFixedAsset")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<FixedAssetAssignList>> GetPageDiAssignFixedAsset([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _FixedAssetRepository.GetPageDiAssignFixedAsset(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<FixedAssetGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        return await _FixedAssetRepository.GetRecordById(keyvalue);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _FixedAssetRepository.GetColumns();
    }

    [HttpPost]
    [Route("getfilteritemVendorFixedAsset")]
    public GetColumnsViewModel GetfilteritemVendorFixedAsset()
    {
        return _FixedAssetRepository.GetColumnsVendorFixedAsset();
    }

    //[HttpGet]
    //[Route("getitemvat/{itemId}")]
    //public async Task<string> GetItemVat(int itemId)
    //{
    //    var companyId = UserClaims.GetCompanyId();
    //    return await _FixedAssetRepository.GetItemVat(itemId, companyId);
    //}


    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> Insert([FromBody] FixedAssetModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _FixedAssetRepository.Save(model);
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultStatus> Update([FromBody] FixedAssetModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _FixedAssetRepository.Save(model);
    }


    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _FixedAssetRepository.Delete(id, "fa", companyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _FixedAssetRepository.Csv(model);
    }

    [HttpGet]
    [Route("getDropDownByType/{id?}")]
    public async Task<List<MyDropDownViewModel>> GetDropDownByType(int? id)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _FixedAssetRepository.GetDropDownByType(id, CompanyId);
    }

    [HttpPost]
    [Route("getcategory")]
    public async Task<MyDropDownViewModel> GetFixedAssetCategory([FromBody] int id)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _FixedAssetRepository.GetFixedAssetCategoryId(id, CompanyId);
    }
}

[Route("FA")]
[Authorize]
public class FixedAssetController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.FA.FixedAsset);
    }
}