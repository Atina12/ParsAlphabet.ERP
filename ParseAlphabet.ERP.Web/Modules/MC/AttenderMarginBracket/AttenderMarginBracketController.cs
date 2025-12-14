using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.AttenderMarginBracket;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AttenderMarginBracket;

namespace ParseAlphabet.ERP.Web.Modules.MC.AttenderMarginBracket;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class AttenderMarginBracketApiController(AttenderMarginBracketRepository attenderMarginBracketRepository)
    : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<AttenderMarginBracketGetPage>>> GetPage(
        [FromBody] NewGetPageViewModel pageViewModel)
    {
        pageViewModel.CompanyId = UserClaims.GetCompanyId();
        return await attenderMarginBracketRepository.GetPage(pageViewModel);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<AttenderMarginBracketGetRecord> GetRecordById([FromBody] int id)
    {
        return await attenderMarginBracketRepository.GetRecordById(id);
    }

    [HttpPost]
    [Route("save")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> Insert([FromBody] AttenderMarginBracketModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.CreateUserId = UserClaims.GetUserId();
            ;
            return await attenderMarginBracketRepository.Insert(model);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await attenderMarginBracketRepository.Delete(keyvalue, CompanyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await attenderMarginBracketRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<List<MyDropDownViewModel>> GetDropDown(string? term)
    {
        var companyId = UserClaims.GetCompanyId();
        return await attenderMarginBracketRepository.GetDropDown(term, companyId);
    }

    [HttpGet]
    [Route("getmarginbracketdropdown/{isActive}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetMarginBracket([FromRoute] byte isActive = 2)
    {
        return await attenderMarginBracketRepository.GetAttenderMarginBracketDropDown(isActive);
    }
}

[Route("MC")]
[Authorize]
public class AttenderMarginBracketController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.MC.AttenderMarginBracket);
    }
}