using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WF.StageFundItemType;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageFundItemType;

namespace ParseAlphabet.ERP.Web.Modules.WF.StageFundItemType;

[Route("api/WF/[controller]")]
[ApiController]
[Authorize]
public class StageFundItemTypeApiController(StageFundItemTypeRepository stageFundItemTypeRepository) : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    public async Task<MyResultPage<List<StageFundItemTypeGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        return await stageFundItemTypeRepository.GetPage(model);
    }

    [HttpPost]
    [Route("csv")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await stageFundItemTypeRepository.Csv(model);
    }


    [HttpGet]
    [Route("stagefunditemtype_getdropdown/{stageId}/{workFlowCategoryId?}")]
    public async Task<List<MyDropDownViewModel>> GetFundTypeListByStageIdAndWorkFlowCategoryId(string stageId,
        short? workFlowCategoryId)
    {
        return await stageFundItemTypeRepository.GetFundTypeListByStageIdAndWorkFlowCategoryId(stageId,
            workFlowCategoryId);
    }


    [HttpPost]
    [Route("getstagefunditemtypeinout")]
    public async Task<byte> GetStagefundItemTypeInout([FromBody] GetStageFundItemTypeInOut model)
    {
        return await stageFundItemTypeRepository.GetInOutId(model);
    }

    [HttpGet]
    [Route("getPreviousStageFundItemTypeListByStageId/{workflowId}/{stageId}/{actionId}")]
    public async Task<List<StageFundItemTypeDropDown>> GetPreviousStageFundItemTypeListByStageId(int workflowId,
        short stageId, byte actionId)
    {
        return await stageFundItemTypeRepository.GetPreviousStageFundItemTypeListByStageId(workflowId, stageId,
            actionId);
    }


    [HttpPost]
    [Route("gethasstagefunditemtype/{stageId}")]
    public async Task<bool> GetHasStageFundItemType(short stageId)
    {
        return await stageFundItemTypeRepository.GetHasStageFundItemType(stageId);
    }
}