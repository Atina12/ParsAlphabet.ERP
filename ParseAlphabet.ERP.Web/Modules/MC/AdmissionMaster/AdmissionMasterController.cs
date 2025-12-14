using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.Admission;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionMaster;
using ParsAlphabet.ERP.Application.Dtos.WF.StageActionLog;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionMaster;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionMaster;

namespace ParseAlphabet.ERP.Web.Modules.MC.AdmissionMaster;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class AdmissionMasterApiController : ControllerBase
{
    private readonly IAdmissionMasterRepository _admissionMasterRepository;

    public AdmissionMasterApiController(IAdmissionMasterRepository admissionMasterRepository)
    {
        _admissionMasterRepository = admissionMasterRepository;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<AdmissionMasterGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        if (model.Form_KeyValue[0]?.ToString() == "myadm")
            model.Form_KeyValue[1] = User.FindFirstValue("UserId");

        var userId = UserClaims.GetUserId();
        ;
        return await _admissionMasterRepository.GetPage(model, userId);
    }

    [HttpPost]
    [Route("save")]
    [Authenticate(Operation.INS, "")]
    public async Task<AdmissionResultQuery> SaveMaster([FromBody] AdmissionMasterModel model)
    {
        model.CreateUserId = short.Parse(User.FindFirstValue("UserId"));
        var roleId = UserClaims.GetRoleId();
        ;
        var result = new AdmissionResultQuery();
        var masterModel = new AdmissionCheckPermissionViewModel
        {
            Id = model.Id,
            RoleId = roleId,
            BranchId = model.BranchId,
            WorkflowId = model.WorkflowId,
            StageId = model.StageId,
            ActionId = model.ActionId,
            CompanyId = model.CompanyId
        };

        var validateAdmissionMasterResult =
            await _admissionMasterRepository.ValidateCheckAdmissionMasterPermission(masterModel);

        if (validateAdmissionMasterResult != "")
        {
            result.Successfull = false;
            result.ValidationErrors.Add(validateAdmissionMasterResult);
            return result;
        }

        result = await _admissionMasterRepository.Save(model);


        return result;
    }

    [HttpGet]
    [Route("updatelastaction/{identityId}/{requestActionId}")]
    public async Task<MyResultStatus> UpdateLastAction(int identityId, byte requestActionId)
    {
        return await _admissionMasterRepository.UpdateLastActionMaster(identityId, requestActionId);
    }


    [HttpGet]
    [Route("getmasteradmissions/{admissionMasterId}")]
    public async Task<List<AdmissionMasterGetAdmission>> GetMasterAdmissions(int admissionMasterId)
    {
        return await _admissionMasterRepository.GetMasterAdmissions(admissionMasterId);
    }

    [HttpGet]
    [Route("getadmissioncashbymaster/{admissionMasterId}")]
    public async Task<List<AdmissionCashByAdmissionMaster>> GetAdmissionCashByMaster(int admissionMasterId)
    {
        var result = await _admissionMasterRepository.GetAdmissionCashByMaster(admissionMasterId);
        return result;
    }

    [HttpGet]
    [Route("getadmissionmasteramount/{admissionMasterId}/{admissionId}")]
    public async Task<AdmissionMasterPayAmount> GetAdmissionMasterAmount(int admissionMasterId)
    {
        var result = await _admissionMasterRepository.GetAdmissionMasterAmounts(admissionMasterId);
        return result;
    }

    [HttpGet]
    [Route("getadmissionmasterbalance/{admissionMasterId}")]
    public async Task<decimal> GetAdmissionMasterBalance(int admissionMasterId)
    {
        var result = await _admissionMasterRepository.GetAdmissionMasterBalance(admissionMasterId);
        return result;
    }


    [HttpGet]
    [Route("getaction/{admissionMasterId}")]
    public async Task<byte> GetAdmissionMasterAction(int admissionMasterId)
    {
        var result = await _admissionMasterRepository.GetAdmissionMasterActionId(admissionMasterId);
        return result;
    }

    [HttpPost]
    [Route("validationadmissionmaster")]
    public async Task<List<string>> ValidationAdmissionService([FromBody] UpdateAction model)
    {
        model.UserId = UserClaims.GetUserId();
        ;
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await _admissionMasterRepository.ValidationActionLogAdmissionMaster(model, roleId);
    }
}

[Route("MC")]
[Authorize]
public class AdmissionMasterController : Controller
{
    [Route("[controller]")]
    [HttpGet]
    public IActionResult Index()
    {
        return PartialView(Views.MC.AdmissionMaster.Index);
    }

    [Route("[controller]/form/{id?}")]
    [HttpGet]
    public IActionResult Index(int? id)
    {
        return PartialView(Views.MC.AdmissionMaster.Form);
    }
}