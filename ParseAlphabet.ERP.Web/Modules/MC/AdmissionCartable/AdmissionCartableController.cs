using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionCartable;
using ParsAlphabet.ERP.Infrastructure.Implantation._History;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionCartable;

namespace ParseAlphabet.ERP.Web.Modules.MC.AdmissionCartable;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class AdmissionCartableApiController(
    AdmissionCartableRepository admissionCartableRepository,
    HistoryRepository history)
    : ControllerBase
{
    private readonly HistoryRepository _history = history;

    [HttpPost]
    [Route("getsectioncartable")]
    [Authenticate(Operation.VIW, "")]
    public async Task<List<MyDropDownViewModel>> GetSectionCartable([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await admissionCartableRepository.GetSectionCartable(model, roleId);
    }


    [HttpPost]
    [Route("getcartable")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<AdmissionCartableGetPage>>> GetCartable([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await admissionCartableRepository.GetCartable(model, roleId);
    }


    [HttpPost]
    [Route("getworklistheader")]
    [Authenticate(Operation.VIW, "")]
    public async Task<List<WorkListHeader>> GetWorkListHeader([FromBody] GetSectionCartable model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await admissionCartableRepository.GetWorkListHeader(model);
    }

    [HttpPost]
    [Route("getworklistline")]
    [Authenticate(Operation.VIW, "")]
    public async Task<List<WorkListLine>> GetWorkListLine([FromBody] GetSectionCartable model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await admissionCartableRepository.GetWorkListLine(model);
    }

    [HttpPost]
    [Route("getworklistcount")]
    [Authenticate(Operation.VIW, "")]
    public async Task<int> GetWorkListCount([FromBody] GetSectionCartable model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await admissionCartableRepository.GetWorkListCount(model, roleId);
    }

    [HttpPost]
    [Route("getadmissionworkflowstageaction")]
    [Authenticate(Operation.VIW, "")]
    public async Task<List<AdmissionWorkflowStageAction>> GetAdmissionWorkflowStageAction(
        [FromBody] GetAdmissionWorkflowStageAction model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await admissionCartableRepository.GetAdmissionWorkflowStageAction(model);
    }

    [HttpPost]
    [Route("getadmissionworkflowstageactiondetail")]
    [Authenticate(Operation.VIW, "")]
    public async Task<object> GetAdmissionWorkflowStageActionDetail([FromBody] GetAdmissionWorkflowStageAction model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await admissionCartableRepository.GetAdmissionWorkflowStageActionDetail(model);
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
        return await admissionCartableRepository.CheckValidationUpdateToPreviousNextAction(model, roleId);
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

        return await admissionCartableRepository.CheckBulkValidationUpdateToPreviousNextAction(result, roleId);
    }
}

[Route("MC")]
[Authorize]
public class AdmissionCartableController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.MC.AdmissionCartable);
    }
}