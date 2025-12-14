using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.GN.PersonAccount;
using ParsAlphabet.ERP.Application.Interfaces.GN.PersonAccount;

namespace ParseAlphabet.ERP.Web.Modules.GN.PersonAccount;

[Route("api/GN/[controller]")]
[ApiController]
[Authorize]
public class PersonAccountApiController : ControllerBase
{
    private readonly IPersonAccountRepository _PersonAccountRepository;

    public PersonAccountApiController(IPersonAccountRepository PersonAccountRepository)
    {
        _PersonAccountRepository = PersonAccountRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<PersonAccountGetPage>>> GetPage([FromBody] NewGetPageViewModel pageViewModel)
    {
        return await _PersonAccountRepository.GetPage(pageViewModel);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    public async Task<MyResultPage<PersonAccountGetRecord>> GetRecordBy_PersonAccount([FromBody] int keyvalue)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _PersonAccountRepository.GetRecordById(keyvalue, companyId);
    }

    [HttpPost]
    [Route("getfilteritems/{personTypeId}")]
    public GetColumnsViewModel GetFilterParameters([FromBody] byte personTypeId)
    {
        return _PersonAccountRepository.GetColumns(personTypeId);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] PersonAccountModel model)
    {
        return await _PersonAccountRepository.Insert(model);
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] PersonAccountModel model)
    {
        return await _PersonAccountRepository.Update(model);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<List<MyDropDownViewModel>> GetDropDown()
    {
        return await _PersonAccountRepository.GetDropDown();
    }
}