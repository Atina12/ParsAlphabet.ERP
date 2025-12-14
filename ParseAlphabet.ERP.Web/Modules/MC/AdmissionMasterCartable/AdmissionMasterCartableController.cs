using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionCartable;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionMasterCartable;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionMasterCartable;

namespace ParseAlphabet.ERP.Web.Modules.MC.AdmissionMasterCartable;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class AdmissionMasterCartableApiController : ControllerBase
{
    private readonly AdmissionMasterCartableRepository _admissionMasterCartableRepository;

    public AdmissionMasterCartableApiController(AdmissionMasterCartableRepository admissionMasterCartableRepository)
    {
        _admissionMasterCartableRepository = admissionMasterCartableRepository;
    }

    [HttpPost]
    [Route("getsectioncartable")]
    [Authenticate(Operation.VIW, "")]
    public async Task<List<MyDropDownViewModel>> GetSectionCartable([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await _admissionMasterCartableRepository.GetSectionCartable(model, roleId);
    }


    [HttpPost]
    [Route("getcartable")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<AdmissionMasterCartableGetPage>>> GetCartable(
        [FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await _admissionMasterCartableRepository.GetCartable(model, roleId);
    }


    [HttpPost]
    [Route("getworklistcount")]
    [Authenticate(Operation.VIW, "")]
    public async Task<int> GetWorkListCount([FromBody] AdmissionMasterSectionCartable model)
    {
        var roleId = UserClaims.GetRoleId();
        ;
        return await _admissionMasterCartableRepository.GetWorkListCount(model, roleId);
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

        return await _admissionMasterCartableRepository.CheckBulkValidationUpdateToPreviousNextAction(result, roleId);
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
        return await _admissionMasterCartableRepository.CheckValidationUpdateToPreviousNextAction(model, roleId);
    }
}

[Route("MC")]
[Authorize]
public class AdmissionMasterCartableController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.MC.AdmissionMasterCartable);
    }
}