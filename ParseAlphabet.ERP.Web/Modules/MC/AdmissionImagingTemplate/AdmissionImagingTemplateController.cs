using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionImagingTemplate;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionImagingTemplate;

namespace ParseAlphabet.ERP.Web.Modules.MC.AdmissionImagingTemplate;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class AdmissionImagingTemplateApiController(
    AdmissionImagingTemplateRepository admissionImagingTemplateRepository)
    : Controller
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<AdmissionImagingTemplateGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.Form_KeyValue[0] = UserClaims.GetUserId();
        ;
        return await admissionImagingTemplateRepository.GetPage(model);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> Insert([FromBody] AdmissionImagingTemplateModel model)
    {
        if (ModelState.IsValid)
        {
            var companyId = UserClaims.GetCompanyId();
            //model.UserId = UserClaims.GetUserId();;

            model.CompanyId = companyId;
            return await admissionImagingTemplateRepository.Save(model);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.INS, "")]
    public async Task<AdmissionImagingTemplateGetRecord> GetRecordById([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await admissionImagingTemplateRepository.GetRecordById(id, companyId);
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await admissionImagingTemplateRepository.Delete(keyvalue, CompanyId);
    }

    [HttpGet]
    [Route("dropdown")]
    public async Task<List<MyDropDownViewModel>> GetDropDown()
    {
        var companyId = UserClaims.GetCompanyId();
        var userId = UserClaims.GetUserId();
        ;

        return await admissionImagingTemplateRepository.GetDropDownByUserId(userId, companyId);
    }

    [HttpGet]
    [Route("getTemplate/{id}")]
    public async Task<string> GetSubject(int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await admissionImagingTemplateRepository.GetTemplateById(id, companyId);
    }
}

[Route("MC")]
[Authorize]
public class AdmissionImagingTemplate : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.MC.AdmissionImagingTemplate);
    }

    [Route("[controller]/form/{id?}")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Form(int? id)
    {
        return PartialView(Views.MC.AdmissionImagingTemplateForm);
    }

    [Route("[controller]/display/{id}")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public IActionResult Display(int id)
    {
        return PartialView(Views.MC.AdmissionImagingTemplateDisplay);
    }
}