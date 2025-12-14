using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WF;
using ParsAlphabet.ERP.Application.Interfaces.WF;

namespace ParseAlphabet.ERP.Web.Modules.WF;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class WFApiController(IWFRepository wFRepository) : ControllerBase
{
    [HttpGet]
    [Route("inout_getdropdown")]
    public List<MyDropDownViewModel> InOut_GetDropDown()
    {
        return wFRepository.InOut_GetDropDown();
    }

    [HttpGet]
    [Route("stageclassdropdown/{workflowCategoryId}")]
    public async Task<List<MyDropDownViewModel>> StageClassDropDown(byte workflowCategoryId)
    {
        return await wFRepository.StageClassDropDown(workflowCategoryId);
    }

    [HttpGet]
    [Route("WorkflowCategory_getdropdown")]
    public async Task<List<MyDropDownViewModel>> WorkFlowCategory_GetDropDown()
    {
        return await wFRepository.WorkFlowCategory_GetDropDown();
    }

    [HttpGet]
    [Route("stagefundtype_getdropdown/{stageId}")]
    public async Task<List<MyDropDownViewModel>> StageFundType_GetDropDown(short stageId)
    {
        return await wFRepository.StageFundType_GetDropDown(stageId);
    }

    [HttpGet]
    [Route("treasurysubjectstage/{stageId}")]
    public async Task<MyResultPage<TreasurySubjectStage>> GetTreasurySubjectStage(short stageId)
    {
        return await wFRepository.GetTreasurySubjectStage(stageId);
    }

    [HttpGet]
    [Route("stagehaspreviousid/{stageId}")]
    public async Task<MyResultPage<int>> CheckStageHasPreviousId(short stageId)
    {
        return await wFRepository.CheckStageHasPreviousId(stageId);
    }

    [HttpPost]
    [Route("postgrouplinefooter")]
    public async Task<List<PostGroupLineFooter>> GetPostGroupLineFooter([FromBody] PostGroupFooterModel model)
    {
        var companyId = UserClaims.GetCompanyId();
        return await wFRepository.GetPostGroupLineFooter(model, companyId);
    }


    [HttpPost]
    [Route("checkheaderbalance")]
    public async Task<MyResultPage<HeaderBalanceRemaining>> HeaderBalance(
        [FromBody] GetHeaderBalanceRemainingViewModel model)
    {
        return await wFRepository.HeaderBalance(model);
    }
}