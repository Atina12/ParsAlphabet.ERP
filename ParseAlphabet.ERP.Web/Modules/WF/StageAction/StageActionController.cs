using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.WF.StageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;

namespace ParseAlphabet.ERP.Web.Modules.WF.StageAction;

[Route("api/WF/[controller]")]
[ApiController]
[Authorize]
public class StageActionApiController(StageActionRepository stageActionRepository) : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    public async Task<MyResultPage<List<StageActionGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        return await stageActionRepository.GetPage(model);
    }

    [HttpGet]
    [Route("csv")]
    public async Task<ActionResult> Csv(string stringedModel)
    {
        var model = JsonConvert.DeserializeObject<NewGetPageViewModel>(stringedModel);
        model.CompanyId = int.Parse(User.FindFirstValue("CompanyId"));
        var resultCsv = await stageActionRepository.CSV(model);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "مراحل انبار.csv" };
    }

    [HttpPost]
    [Route("getaction")]
    public async Task<ActionModel> GetAction([FromBody] GetAction model)
    {
        model.CompanyId = int.Parse(User.FindFirstValue("CompanyId"));
        return await stageActionRepository.GetAction(model);
    }

    [HttpGet]
    [Route(
        "getdropdownactionlistbystage/{stageId}/{workflowId}/{isActive?}/{bySystem?}/{branchId?}/{workflowCategoryId}/{includePriority}/{stageClassId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetActionListByStageId
    ([FromRoute] GetActionListByStageDto dto)
    {
        var roleId = UserClaims.GetRoleId();
        var companyId = UserClaims.GetCompanyId();
        return await stageActionRepository.GetActionListByStageId(dto,roleId,companyId);
    }

    [HttpGet]
    [Route("getdropdown/{workflowCategoryId}/{isActive}/{stageClassId}/{branchId?}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(string workflowCategoryId, byte isActive,
        string stageClassId = null)
    {
        var CompanyId = int.Parse(User.FindFirstValue("CompanyId"));
        var roleId = byte.Parse(User.FindFirstValue("RoleId"));
        return await stageActionRepository.GetDropDown(CompanyId, workflowCategoryId, isActive, stageClassId, roleId);
    }

    [HttpPost]
    [Route("getparentrequeststagestepactionbyid")]
    public async Task<ParentRequestStageActionLogicModel> GetParentRequestStageStepActionById(
        [FromBody] GetParentRequestLogicByWorkflowCategory model)
    {
        return await stageActionRepository.GetParentRequestStageStepActionById(model);
    }

    [HttpPost]
    [Route("getactionid")]
    public async Task<int> GetActionId([FromBody] GetActionViewModel model)
    {
        return await stageActionRepository.GetActionId(model);
    }

    [HttpPost]
    [Route("getmultiplesettlement")]
    public async Task<bool> GetMultipleSettlement([FromBody] GetActionViewModel model)
    {
        return await stageActionRepository.GetMultipleSettlement(model);
    }

    [HttpPost]
    [Route("getstageactiongetnext")]
    public async Task<bool> GetStageActionGetNext([FromBody] GetNextStageActionViewModel model)
    {
        return await stageActionRepository.GetStageActionGetNext(model);
    }
}