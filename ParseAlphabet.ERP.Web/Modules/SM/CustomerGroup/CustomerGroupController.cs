using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.CR.PersonGroup;
using ParsAlphabet.ERP.Infrastructure.Implantation.CR.PersonGroup;

namespace ParseAlphabet.ERP.Web.Modules.SM.CustomerGroup;

[Route("api/SM/[controller]")]
[ApiController]
[Authorize]
public class CustomerGroupApiController(PersonGroupRepository PersonGroupRepository) : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<PersonGroupGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await PersonGroupRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<PersonGroupGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        var result = new MyResultPage<PersonGroupGetRecord>
        {
            Data = await PersonGroupRepository.GetRecordById<PersonGroupGetRecord>(keyvalue, false, "cr")
        };
        return result;
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return PersonGroupRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] PersonGroupModel model)
    {
        if (ModelState.IsValid)
        {
            model.PersonTypeId = 1;
            model.CompanyId = UserClaims.GetCompanyId();
            return await PersonGroupRepository.Insert(model);
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
            model.PersonTypeId = 1;
            model.CompanyId = UserClaims.GetCompanyId();
            return await PersonGroupRepository.Update(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }


    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await PersonGroupRepository.Delete(keyvalue, "CR", CompanyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.Form_KeyValue[0] = 1;
        return await PersonGroupRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown/{isActive?}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(byte? isActive)
    {
        var companyId = UserClaims.GetCompanyId();
        return await PersonGroupRepository.GetDropDownByPersonType(1, companyId, isActive);
    }
}

[Route("SM")]
[Authorize]
public class CustomerGroupController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.SM.CustomerGroup);
    }
}