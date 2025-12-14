using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionCartable;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionItemCartable;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionItemCartable;

namespace ParseAlphabet.ERP.Web.Modules.MC.AdmissionItemCartable;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class AdmissionItemCartableApiController : ControllerBase
{
    private readonly AdmissionItemCartableRepository _admissionItemCartableRepository;

    public AdmissionItemCartableApiController(AdmissionItemCartableRepository admissionCartableRepository)
    {
        _admissionItemCartableRepository = admissionCartableRepository;
    }

    [HttpPost]
    [Route("getsectioncartable")]
    [Authenticate(Operation.VIW, "")]
    public async Task<List<MyDropDownViewModel>> GetSectionCartable([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await _admissionItemCartableRepository.GetSectionCartable(model, roleId);
    }


    [HttpPost]
    [Route("getcartable")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<AdmissionItemCartableGetPage>>> GetCartable(
        [FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await _admissionItemCartableRepository.GetCartable(model, roleId);
    }


    [HttpPost]
    [Route("getworklistcount")]
    [Authenticate(Operation.VIW, "")]
    public async Task<int> GetWorkListCount([FromBody] GetAdmissionItemSectionCartable model)
    {
        var roleId = UserClaims.GetRoleId();
        ;
        return await _admissionItemCartableRepository.GetWorkListCount(model, roleId);
    }

    [HttpPost]
    [Route("checkupdateactioncartable")]
    [Authenticate(Operation.VIW, "")]
    public async Task<CheckValidationUpdateActionByPriority> CheckValidationUpdateToPreviousNextAction(
        [FromBody] GetPriorityWorkflowStageAction model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await _admissionItemCartableRepository.CheckValidationUpdateToPreviousNextAction(model, roleId);
    }

    [HttpPost]
    [Route("checkupdatebulkactioncartable")]
    [Authenticate(Operation.VIW, "")]
    public async Task<List<CheckValidationUpdateActionByPriority>> CheckBulkValidationUpdateToPreviousNextAction(
        [FromBody] List<GetPriorityWorkflowStageAction> model)
    {
        var companyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        var result = (from m in model
            select new GetPriorityWorkflowStageAction
            {
                CompanyId = companyId,
                BranchId = m.BranchId,
                WorkflowId = m.WorkflowId,
                StageId = m.StageId,
                ActionId = m.ActionId,
                Direction = m.Direction
            }).ToList();

        return await _admissionItemCartableRepository.CheckBulkValidationUpdateToPreviousNextAction(result, roleId);
    }
}

[Route("MC")]
[Authorize]
public class AdmissionItemCartableController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.MC.AdmissionItemCartable);
    }
}