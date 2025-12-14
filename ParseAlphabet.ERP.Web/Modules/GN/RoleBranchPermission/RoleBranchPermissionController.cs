using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.GN.RoleBranchPermission;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.RoleBranchPermission;

namespace ParseAlphabet.ERP.Web.Modules.GN.RoleBranchPermission;

[Route("api/GN/[controller]")]
[ApiController]
[Authorize]
public class RoleBranchPermissionApiController : ControllerBase
{
    private readonly RoleBranchPermissionRepository _roleBranchPermissionRepository;

    public RoleBranchPermissionApiController(RoleBranchPermissionRepository roleBranchPermissionRepository)
    {
        _roleBranchPermissionRepository = roleBranchPermissionRepository;
    }

    [HttpGet]
    [Route("rolebranchpermissiongetlist/{roleid}")]
    [Authenticate(Operation.VIW, "Role")]
    public async Task<object> RoleBranchPermissionGetList(byte RoleId)
    {
        return await _roleBranchPermissionRepository.RoleBranchPermissionetList(RoleId);
    }

    [HttpPost]
    [Route("savebranchpermission")]
    [Authenticate(Operation.INS, "Role")]
    public async Task<MyResultStatus> SaveBranchPermission([FromBody] RoleBranchPermissionModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.CreateUserId = UserClaims.GetUserId();
            ;
            return await _roleBranchPermissionRepository.Save(model);
        }

        return ModelState.ToMyResultStatus<int>();
    }
}

[Route("GN")]
[Authorize]
public class RoleBranchPermissionController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "Role")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.GN.RoleBranchPermission);
    }
}