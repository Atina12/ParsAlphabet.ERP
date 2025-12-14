using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.GN.PersonAccount;
using ParsAlphabet.ERP.Application.Interfaces.GN.PersonAccount;

namespace ParseAlphabet.ERP.Web.Modules.SM.CustomerAccount;

[Route("api/SM/[controller]")]
[ApiController]
[Authorize]
public class CustomerAccountApiController(IPersonAccountRepository personAccountRepository) : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<PersonAccountGetPage>>> GetPage([FromBody] NewGetPageViewModel pageViewModel)
    {
        return await personAccountRepository.GetPage(pageViewModel);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    public async Task<MyResultPage<PersonAccountGetRecord>> GetRecordBy_PersonAccount([FromBody] int keyvalue)
    {
        var companyId = UserClaims.GetCompanyId();
        return await personAccountRepository.GetRecordById(keyvalue, companyId);
    }

    [HttpPost]
    [Route("getfilteritems/{personTypeId}")]
    public GetColumnsViewModel GetFilterParameters([FromBody] byte personTypeId)
    {
        return personAccountRepository.GetColumns(personTypeId);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] PersonAccountModel model)
    {
        return await personAccountRepository.Insert(model);
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] PersonAccountModel model)
    {
        return await personAccountRepository.Update(model);
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var companyId = UserClaims.GetCompanyId();
        return await personAccountRepository.Delete(keyvalue, companyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        return await personAccountRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<List<MyDropDownViewModel>> GetDropDown()
    {
        return await personAccountRepository.GetDropDown();
    }
}

[Route("SM")]
[Authorize]
public class CustomerAccountController : Controller
{
    [Route("[controller]")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.SM.CustomerAccount);
    }
}