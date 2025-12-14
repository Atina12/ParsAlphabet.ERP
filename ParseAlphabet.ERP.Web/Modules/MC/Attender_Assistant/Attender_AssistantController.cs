using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.Attender_Assistant;
using ParsAlphabet.ERP.Application.Interfaces.MC.Attender_Assistant;

namespace ParseAlphabet.ERP.Web.Modules.MC.Attender_Assistant;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class Attender_AssistantApiController : ControllerBase
{
    private readonly IAttender_AssistantRepository _assistantRepository;

    public Attender_AssistantApiController(IAttender_AssistantRepository assistantRepository)
    {
        _assistantRepository = assistantRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<AttenderAssistantGetPage>>> GetPage(
        [FromBody] NewGetPageViewModel pageViewModel)
    {
        pageViewModel.CompanyId = UserClaims.GetCompanyId();
        return await _assistantRepository.GetPage(pageViewModel);
    }

    [HttpPost]
    [Route("getpageassistant")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<AssistantAttenderGetPage>>> GetPageAssistant(
        [FromBody] NewGetPageViewModel pageViewModel)
    {
        pageViewModel.CompanyId = UserClaims.GetCompanyId();
        return await _assistantRepository.GetPageAssistant(pageViewModel);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    public Task<MyResultPage<Attender_AssistantGetRecord>> GetRecordBy_Attender_Assistant(
        [FromBody] Get_Attender_Assistant model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return _assistantRepository.GetRecordBy_Attender_Assistant(model);
    }

    [HttpPost]
    [Route("getfilteritems/formtype")]
    public GetColumnsViewModel GetFilterParameters(string formType)
    {
        return _assistantRepository.GetColumns(formType);
    }

    [HttpPost]
    [Route("save")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] Attender_AssistantModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await _assistantRepository.Save(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model, string formType)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _assistantRepository.Csv(model, formType);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<List<MyDropDownViewModel>> GetDropDown()
    {
        var userId = UserClaims.GetUserId();
        ;
        var CompanyId = UserClaims.GetCompanyId();
        return await _assistantRepository.GetDropDown(userId, CompanyId);
    }
}

[Route("MC")]
[Authorize]
public class Attender_AssistantController : Controller
{
    [Route("[controller]")]
    [HttpGet]
    [Authenticate(Operation.VIW, "")]
    public ActionResult Index()
    {
        return PartialView(Views.MC.AttenderAssistant);
    }

    [Route("[controller]/prescription")]
    [HttpGet]
    [Authenticate(Operation.VIW, "")]
    public ActionResult AttenderPrescriptionIndex()
    {
        return PartialView(Views.MC.AttenderPrescription);
    }

    [Route("[controller]/dental")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult AttenderDentalIndex()
    {
        return PartialView(Views.MC.AttenderDental);
    }

    [Route("[controller]/laboratory")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult AttenderMedicalLaboratoryIndex()
    {
        return PartialView(Views.MC.AttenderMedicalLaboratory);
    }
}