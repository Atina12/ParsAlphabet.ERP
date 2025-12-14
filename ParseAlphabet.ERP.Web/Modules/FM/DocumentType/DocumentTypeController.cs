using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FM.DocumentType;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.DocumentType;

namespace ParseAlphabet.ERP.Web.Modules.FM.DocumentType;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class DocumentTypeApiController : ControllerBase
{
    private readonly IHttpContextAccessor _accessor;
    private readonly DocumentTypeRepository _documentTypeRepository;

    public DocumentTypeApiController(DocumentTypeRepository documentTypeRepository, IHttpContextAccessor accessor)
    {
        _documentTypeRepository = documentTypeRepository;
        _accessor = accessor;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<DocumentTypeGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        return await _documentTypeRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<DocumentTypeGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        return new MyResultPage<DocumentTypeGetRecord>
        {
            Data = await _documentTypeRepository.GetRecordById<DocumentTypeGetRecord>(keyvalue, false, "fm")
        };
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] DocumentTypeModel model)
    {
        if (ModelState.IsValid)
        {
            MyClaim.Init(_accessor);
            model.IsSecondLang = MyClaim.IsSecondLang;
            return await _documentTypeRepository.Insert(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] DocumentTypeModel model)
    {
        if (ModelState.IsValid)
        {
            var documentType =
                await _documentTypeRepository.GetRecordById<DocumentTypeGetRecord>(model.Id, false, "fm");

            if (documentType.BySystem)
                return new MyResultQuery
                {
                    Successfull = false,
                    ValidationErrors = new List<string> { "امکان ویرایش نوع سند سیستمی وجود ندارد" }
                };


            MyClaim.Init(_accessor);
            model.IsSecondLang = MyClaim.IsSecondLang;
            return await _documentTypeRepository.Update(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _documentTypeRepository.Delete(keyvalue, "fm", companyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        return await _documentTypeRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdownbysystem")]
    public async Task<IEnumerable<MyDropDownViewModel>> DocumentTypeBySystem_GetDropDown()
    {
        return await _documentTypeRepository.GetDropDownBySystem();
    }

    [HttpGet]
    [Route("getdropdown/{bySystem}")]
    public async Task<IEnumerable<MyDropDownViewModel>> DocumentType_GetDropDown(byte bySystem = 2)
    {
        return await _documentTypeRepository.GetDropDown(bySystem);
    }

    [HttpGet]
    [Route("getactivedropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> ActiveDocumentType_GetDropDown()
    {
        return await _documentTypeRepository.GetActiveDropDown();
    }

    [HttpGet]
    [Route("getdropdown_postinggroup")]
    public async Task<IEnumerable<MyDropDownViewModel>> DocumentTypePostingGroup_GetDropDown()
    {
        return await _documentTypeRepository.GetDropDownPostingGroup();
    }
}

[Route("FM")]
[Authorize]
public class DocumentTypeController : Controller
{
    [Route("[controller]")]
    [HttpGet]
    [Authenticate(Operation.VIW, "")]
    public ActionResult Index()
    {
        return PartialView(Views.FM.DocumentType);
    }
}