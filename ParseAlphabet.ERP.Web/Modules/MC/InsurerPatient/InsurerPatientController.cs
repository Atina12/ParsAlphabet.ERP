using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.InsurerPatient;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.InsurerPatient;

namespace ParseAlphabet.ERP.Web.Modules.MC.InsurerPatient;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class InsurerPatientApiController(InsurerPatientRepository insurerPatientRepository) : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "Insurance")]
    public async Task<MyResultPage<List<InsurerPatientGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await insurerPatientRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "Insurance")]
    public async Task<InsurerPatientGetRecord> GetRecordById([FromBody] int keyvalue)
    {
        return await insurerPatientRepository.GetRecordById(keyvalue);
        ;
    }


    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await insurerPatientRepository.Csv(model);
    }


    [HttpPost]
    [Route("save")]
    [Authenticate(Operation.INS, "Insurance")]
    public async Task<MyResultQuery> Insert([FromBody] InsurerPatientModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.CreateUserId = UserClaims.GetUserId();
            ;
            return await insurerPatientRepository.Save(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }
}

[Route("MC")]
[Authorize]
public class InsurerPatientController : Controller
{
    [Route("[Controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.MC.Patient);
    }
}