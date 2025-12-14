using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.GN.RoleWorkflowPermission;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.RoleWorkflowPermission;

namespace ParseAlphabet.ERP.Web.Modules.GN.RoleWorkflowPermission;

[Route("api/GN/[controller]")]
[ApiController]
[Authorize]
public class RoleWorkflowPermissionApiController : ControllerBase
{
    private readonly RoleWorklfowPermissionRepository _roleWorklfowPermissionRepository;

    public RoleWorkflowPermissionApiController(RoleWorklfowPermissionRepository roleWorklfowPermissionRepository)
    {
        _roleWorklfowPermissionRepository = roleWorklfowPermissionRepository;
    }

    [HttpGet]
    [Route("roleworkflowpermissiongetlist/{type}/{roleid}/{workflowcategoryid}/{branchid}/{workflowid}/{stageid}")]
    [Authenticate(Operation.VIW, "Role")]
    public async Task<object> RoleWorkflowPermissionGetList(byte Type, byte RoleId, byte WorkflowCategoryId,
        short BranchId, int WorkflowId, short StageId)
    {
        return await _roleWorklfowPermissionRepository.RoleWorkflowPermissionGetList(Type, RoleId, WorkflowCategoryId,
            BranchId, WorkflowId, StageId);
    }

    [HttpPost]
    [Route("save")]
    [Authenticate(Operation.INS, "Role")]
    public async Task<MyResultStatus> Save([FromBody] RoleWorklfowPermissionModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.CreateUserId = UserClaims.GetUserId();
            ;
            return await _roleWorklfowPermissionRepository.Save(model);
        }

        return ModelState.ToMyResultStatus<int>();
    }


    [HttpPost]
    [Route("roleworkflowstagesteppermission")]
    public async Task<int> GetRoleWorkflowStageStepPermission([FromBody] GetRoleWorkflowStageActionPermission model)
    {
        model.RoleId = UserClaims.GetRoleId();
        ;
        return await _roleWorklfowPermissionRepository.GetRoleWorkflowStageStepPermission(model);
    }

    [HttpPost]
    [Route("checkroleworkflowpermission/{workflowId}/{branchId}/{stageId}/{actionId}")]
    public async Task<byte> RoleWorkflowPermissionCheck(int workflowId, short branchId, short stageId, byte actionId)
    {
        var roleId = UserClaims.GetRoleId();
        ;
        return await _roleWorklfowPermissionRepository.CheckRoleWorkflowPermission(workflowId, branchId, stageId,
            actionId, roleId);
    }


    [HttpPost]
    [Route("checkroleworkflowpermissionbyheaderId/{headerId}/{workflowCategoryId}")]
    public async Task<byte> CheckRoleWorkflowPermissionByHeaderId(int headerId, byte workflowCategoryId)
    {
        var roleId = UserClaims.GetRoleId();
        ;
        return await _roleWorklfowPermissionRepository.CheckRoleWorkflowPermissionByHeaderId(headerId,
            workflowCategoryId, roleId);
    }
}

[Route("GN")]
[Authorize]
public class RoleWorkflowPermissionController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "Role")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.GN.RoleWorkflowPermission);
    }
}