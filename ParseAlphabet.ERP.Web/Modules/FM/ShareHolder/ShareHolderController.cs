using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FM.ShareHolder;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.ShareHolder;

namespace ParseAlphabet.ERP.Web.Modules.FM.ShareHolder;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class ShareHolderApiController : ControllerBase
{
    private readonly ShareHolderRepository _shareHolderRepository;

    public ShareHolderApiController(ShareHolderRepository ShareHolderRepository)
    {
        _shareHolderRepository = ShareHolderRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<ShareHolderGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _shareHolderRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<ShareHolderGetRecordForm>> GetRecordById([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _shareHolderRepository.GetRecordById(keyvalue, CompanyId);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] SaveShareHolder model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _shareHolderRepository.Insert(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] SaveShareHolder model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _shareHolderRepository.Update(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int id)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _shareHolderRepository.Delete(id, CompanyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _shareHolderRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<List<MyDropDownViewModel>> GetDropDown(string? term)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _shareHolderRepository.GetDropDown(term, companyId);
    }

    [HttpGet]
    [Route("shareHolderAccountDetailDropdown")]
    public async Task<List<MyDropDownViewModel>> ShareHolderAccountDetailDropdown()
    {
        var companyId = UserClaims.GetCompanyId();
        return await _shareHolderRepository.ShareHolderAccountDetailGetDropDown(companyId);
    }


    [HttpPost]
    [Route("getnationalcode")]
    public async Task<bool> GetNationalCode([FromBody] MyDropDownViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _shareHolderRepository.ExistNationalCode(model);
    }
}

[Route("FM")]
[Authorize]
public class ShareHolderController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.FM.ShareHolder);
    }
}