using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WF.StageActionOriginDestination;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageActionOriginDestination;

namespace ParseAlphabet.ERP.Web.Modules.WF.StageActionOriginDestination;

[Route("api/WF/[controller]")]
[ApiController]
[Authorize]
public class StageActionOriginDestinationApiController(
    StageActionOriginDestinationRepository stageActionOriginDestinationRepository)
    : ControllerBase
{
    [HttpPost]
    [Route("insert")]
    public async Task<MyResultStatus> Insert([FromBody] StageActionOriginDestinationModel model)
    {
        model.CreateUserId = UserClaims.GetUserId();
        ;
        return await stageActionOriginDestinationRepository.Insert(model);
    }


    [HttpGet]
    [Route("getworkflowstage/{workflowId}/{stageId}")]
    [AllowAnonymous]
    public async Task<WorkflowStageViewModel> GetAdmissionTypeId(int workflowId, short stageId)
    {
        return await stageActionOriginDestinationRepository.GetWorkflowStage(workflowId, stageId);
    }
}