using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WF.StageActionLog;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageActionLog;

namespace ParseAlphabet.ERP.Web.Modules.WF.StageActionLog;

[Route("api/WF/[controller]")]
[ApiController]
[Authorize]
public class StageActionLogApiController(StageActionLogRepository stageActionLogRepository) : ControllerBase
{
    [HttpGet]
    [Route("getsteplist/{transactionId}/{stageId}/{workflowId}")]
    public async Task<MyResultDataQuery<List<StepLogList>>> GetStepList(long transactionId, short stageId,
        int workflowId)
    {
        return await stageActionLogRepository.GetStepList(transactionId, stageId, workflowId);
    }

    [HttpPost]
    [Route("insertlog")]
    public async Task<MyResultStatus> InsertLog([FromBody] UpdateAction model)
    {
        model.UserId = UserClaims.GetUserId();
        ;
        model.CompanyId = UserClaims.GetCompanyId();

        return await stageActionLogRepository.StageActionLogInsert(model);
    }
}