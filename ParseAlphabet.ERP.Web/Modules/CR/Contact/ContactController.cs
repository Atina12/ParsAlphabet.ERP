using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.CR.Contact;
using ParsAlphabet.ERP.Infrastructure.Implantation.CR.Contact;

namespace ParseAlphabet.ERP.Web.Modules.CR.Contact;

[Route("api/CR/[controller]")]
[ApiController]
[Authorize]
public class ContactApiController : ControllerBase
{
    private readonly ContactRepository _ContactRepository;

    public ContactApiController(ContactRepository ContactRepository)
    {
        _ContactRepository = ContactRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<ContactGetPage>>> GetPage([FromBody] NewGetPageViewModel pageViewModel)
    {
        pageViewModel.CompanyId = UserClaims.GetCompanyId();
        return await _ContactRepository.GetPage(pageViewModel);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<ContactGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _ContactRepository.GetRecordById(keyvalue, CompanyId);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _ContactRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] ContactModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _ContactRepository.Insert(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] ContactModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _ContactRepository.Update(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _ContactRepository.Delete(keyvalue, CompanyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _ContactRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<List<MyDropDownViewModel>> GetDropDown()
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _ContactRepository.GetDropDown(CompanyId);
    }

    [HttpGet]
    [Route("getalldatadropdown")]
    public async Task<List<MyDropDownViewModel>> GetAllDataDropDown()
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _ContactRepository.GetAllDataDropDown(CompanyId);
    }

    [HttpPost]
    [Route("getnationalcode")]
    public async Task<bool> CheckNationalCode([FromBody] MyDropDownViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _ContactRepository.ExistNationalCode(model);
    }
}

[Route("CR")]
[Authorize]
public class ContactController : Controller
{
    [Route("Contact")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Index()
    {
        return View(Views.CR.Contact);
    }
}