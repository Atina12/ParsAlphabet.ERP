using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FM.VAT;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.VAT;

namespace ParseAlphabet.ERP.Web.Modules.FM.VAT;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class VATApiController : ControllerBase
{
    private readonly VATRepository _VATRepository;

    public VATApiController(VATRepository VATRepository)
    {
        _VATRepository = VATRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<VATGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _VATRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<VATGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        return new MyResultPage<VATGetRecord>
        {
            Data = await _VATRepository.GetRecordById<VATGetRecord>(keyvalue, false, "fm")
        };
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _VATRepository.GetColumns();
    }


    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] VATModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();

            return await _VATRepository.Insert(model, "fm");
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] VATModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _VATRepository.Update(model, "fm");
        }

        return ModelState.ToMyResultQuery<int>();
    }


    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _VATRepository.Delete(keyvalue, "fm", companyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _VATRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown()
    {
        var companyId = UserClaims.GetCompanyId();
        return await _VATRepository.GetDropDown(DateTime.Now, companyId);
    }


    [HttpPost]
    [Route("checkexist")]
    public async Task<bool> VatCheckExist([FromBody] VATModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _VATRepository.CheckExist(model);
    }
}

[Route("FM")]
[Authorize]
public class VATController : Controller
{
    [Route("[controller]")]
    [HttpGet]
    [Authenticate(Operation.VIW, "")]
    public ActionResult Index()
    {
        return PartialView(Views.FM.VAT);
    }
}