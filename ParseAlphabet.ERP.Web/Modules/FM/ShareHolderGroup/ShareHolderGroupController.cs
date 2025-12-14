using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.CR.PersonGroup;
using ParsAlphabet.ERP.Infrastructure.Implantation.CR.PersonGroup;

namespace ParseAlphabet.ERP.Web.Modules.FM.ShareHolderGroup;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class ShareHolderGroupApiController : ControllerBase
{
    private readonly PersonGroupRepository _PersonGroupRepository;

    public ShareHolderGroupApiController(PersonGroupRepository PersonGroupRepository)
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
            model.PersonTypeId = 5;
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
            model.PersonTypeId = 5;
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
        return await _PersonGroupRepository.Delete(keyvalue, "cr", CompanyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.Form_KeyValue[0] = 5;
        return await _PersonGroupRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown/{isActive?}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(byte? isActive)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _PersonGroupRepository.GetDropDownByPersonType(5, companyId, isActive);
    }
}

[Route("FM")]
[Authorize]
public class ShareHolderGroupController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.FM.ShareHolderGroup);
    }
}