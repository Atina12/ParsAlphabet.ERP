using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.CR.PersonGroup;
using ParsAlphabet.ERP.Infrastructure.Implantation.CR.PersonGroup;

namespace ParseAlphabet.ERP.Web.Modules.CR.ContactGroup;

[Route("api/CR/[controller]")]
[ApiController]
[Authorize]
public class ContactGroupApiController : ControllerBase
{
    private readonly PersonGroupRepository _PersonGroupRepository;

    public ContactGroupApiController(PersonGroupRepository PersonGroupRepository)
    {
        _PersonGroupRepository = PersonGroupRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<PersonGroupGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _PersonGroupRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<PersonGroupGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        var result = new MyResultPage<PersonGroupGetRecord>
        {
            Data = await _PersonGroupRepository.GetRecordById<PersonGroupGetRecord>(keyvalue, false, "cr")
        };
        return result;
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _PersonGroupRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] PersonGroupModel model)
    {
        if (ModelState.IsValid)
        {
            model.PersonTypeId = 4;
            model.CompanyId = UserClaims.GetCompanyId();
            return await _PersonGroupRepository.Insert(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] PersonGroupModel model)
    {
        if (ModelState.IsValid)
        {
            model.PersonTypeId = 4;
            model.CompanyId = UserClaims.GetCompanyId();
            return await _PersonGroupRepository.Update(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }


    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _PersonGroupRepository.Delete(keyvalue, "CR", CompanyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.Form_KeyValue[0] = 4;
        return await _PersonGroupRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown/{isActive?}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(byte? isActive)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _PersonGroupRepository.GetDropDownByPersonType(4, companyId, isActive);
    }
}

[Route("CR")]
[Authorize]
public class ContactGroupController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.CR.ContactGroup);
    }
}