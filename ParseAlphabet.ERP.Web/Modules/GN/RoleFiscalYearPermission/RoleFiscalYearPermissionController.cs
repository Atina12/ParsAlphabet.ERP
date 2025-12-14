using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.GN.RoleFiscalYearPermission;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.RoleFiscalYearPermission;

namespace ParseAlphabet.ERP.Web.Modules.GN.RoleFiscalYearPermission;

[Route("api/GN/[controller]")]
[ApiController]
[Authorize]
public class RoleFiscalYearPermissionApiController : ControllerBase
{
    private readonly RoleFiscalYearPermissionRepository _roleFiscalYearPermissionRepository;

    public RoleFiscalYearPermissionApiController(RoleFiscalYearPermissionRepository roleFiscalYearPermissionRepository)
    {
        _roleFiscalYearPermissionRepository = roleFiscalYearPermissionRepository;
    }

    [HttpGet]
    [Route("rolefiscalyearpermissiongetlist/{roleid}")]
    [Authenticate(Operation.VIW, "Role")]
    public async Task<object> RoleFiscalYearPermissionGetList(byte RoleId)
    {
        return await _roleFiscalYearPermissionRepository.RoleFiscalYearPermissionetList(RoleId);
    }

    [HttpPost]
    [Route("savefiscalyearpermission")]
    [Authenticate(Operation.INS, "Role")]
    public async Task<MyResultStatus> SaveFiscalYearPermission([FromBody] RoleFiscalYearPermissionModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.CreateUserId = UserClaims.GetUserId();
            ;
            return await _roleFiscalYearPermissionRepository.Save(model);
        }

        return ModelState.ToMyResultStatus<int>();
    }
}

[Route("GN")]
[Authorize]
public class RoleFiscalYearPermissionController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "Role")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.GN.RoleFiscalYearPermission);
    }
}