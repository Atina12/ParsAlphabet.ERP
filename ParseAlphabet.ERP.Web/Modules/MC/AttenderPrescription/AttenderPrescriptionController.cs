using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.AttenderPrescription;
using ParsAlphabet.ERP.Application.Interfaces.MC.AttenderPrescription;

namespace ParseAlphabet.ERP.Web.Modules.MC.AttenderPrescription;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class AttenderPrescriptionApiController(IAttenderPrescriptionRepository assistantRepository) : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "Attender")]
    public async Task<MyResultPage<List<AttenderPrescriptionGetPage>>> GetPage(
        [FromBody] GetPageViewModel pageViewModel)
    {
        pageViewModel.CompanyId = UserClaims.GetCompanyId();
        return await assistantRepository.GetPage(pageViewModel);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "Attender")]
    public Task<MyResultPage<AttenderPrescriptionGetRecord>> GetRecordBy_AttenderPrescription(
        [FromBody] Get_AttenderPrescription model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return assistantRepository.GetRecordBy_AttenderPrescription(model);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return assistantRepository.GetColumns();
    }

    [HttpPost]
    [Route("save")]
    [Authenticate(Operation.INS, "Attender")]
    public async Task<MyResultQuery> Insert([FromBody] AttenderPrescriptionModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        if (ModelState.IsValid)
            return await assistantRepository.Save(model);
        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "Attender")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await assistantRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<List<MyDropDownViewModel>> GetDropDown()
    {
        var userId = UserClaims.GetUserId();
        ;
        var CompanyId = UserClaims.GetCompanyId();
        return await assistantRepository.GetDropDown(userId, CompanyId);
    }
}