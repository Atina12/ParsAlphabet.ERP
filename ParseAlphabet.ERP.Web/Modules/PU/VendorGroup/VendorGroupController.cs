using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.CR.PersonGroup;
using ParsAlphabet.ERP.Infrastructure.Implantation.CR.PersonGroup;

namespace ParseAlphabet.ERP.Web.Modules.PU.VendorGroup;

[Route("api/PU/[controller]")]
[ApiController]
[Authorize]
public class VendorGroupApiController(PersonGroupRepository personGroupRepository) : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<PersonGroupGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await personGroupRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<PersonGroupGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        var result = new MyResultPage<PersonGroupGetRecord>
        {
            Data = await personGroupRepository.GetRecordById<PersonGroupGetRecord>(keyvalue, false, "cr")
        };
        return result;
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return personGroupRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] PersonGroupModel model)
    {
        if (ModelState.IsValid)
        {
            model.PersonTypeId = 2;
            model.CompanyId = UserClaims.GetCompanyId();
            return await personGroupRepository.Insert(model);
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
            model.PersonTypeId = 2;
            model.CompanyId = UserClaims.GetCompanyId();
            return await personGroupRepository.Update(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }


    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultStatus> Delete([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await personGroupRepository.Delete(keyvalue, CompanyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.Form_KeyValue[0] = 2;
        return await personGroupRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown/{isActive?}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(byte? isActive)
    {
        var companyId = UserClaims.GetCompanyId();
        return await personGroupRepository.GetDropDownByPersonType(2, companyId, isActive);
    }
}

[Route("PU")]
[Authorize]
public class VendorGroupController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.PU.VendorGroup);
    }
}