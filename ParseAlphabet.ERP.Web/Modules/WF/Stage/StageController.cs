using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WF.Stage;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.Stage;

namespace ParseAlphabet.ERP.Web.Modules.WF.Stage;

[Route("api/WF/[controller]")]
[ApiController]
[Authorize]
public class StageApiController(StageRepository stageRepository) : ControllerBase
{
    [HttpGet]
    [Route("getdropdown/{formName}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(string formName)
    {
        return await stageRepository.GetDropDown(formName);
    }

    [HttpGet]
    [Route("getStageQuantity/{id}")]
    public async Task<bool> GetStageClassDropDown(int id)
    {
        return await stageRepository.GetStageQuantity(id);
    }

    [HttpGet]
    [Route("getStageClassDropDown/{workFlowCategoryId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetStageClassDropDown(short workFlowCategoryId)
    {
        return await stageRepository.GetStageClassDropDown(workFlowCategoryId);
    }


    [HttpGet]
    [Route("getdropdownbyworkflowcategoryid/{workflowCategoryId}/{bySystem}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDownByWorkflowCategoryId(string workflowCategoryId,
        byte bySystem)
    {
        return await stageRepository.GetDropDownByWorkflowCategoryId(workflowCategoryId, bySystem);
    }

    [HttpGet]
    [Route("admissionstagegetdropdown/{workflowId}/{itemTypeId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> AdmissionStageGetDropDown(int workflowId, byte itemTypeId)
    {
        return await stageRepository.AdmissionStageGetDropDown(workflowId, itemTypeId);
    }


    [HttpGet]
    [Route("getpostinggrouptype/{id}")]
    public async Task<byte> GetPostingGroupType(int id)
    {
        return await stageRepository.GetPostingGroupType(id);
    }

    [HttpGet]
    [Route("getdropdownhastreasurysubject")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDownHasTreasurySubject()
    {
        return await stageRepository.GetDropDownStageHasTreasurySubject();
    }

    [HttpPost]
    [Route("getdocumenttype")]
    public async Task<StageDocumentType> GetTreasuryStageDocumentType([FromBody] short stageId)
    {
        return await stageRepository.GetStageDocumentType(stageId);
    }

    [HttpPost]
    [Route("getinout")]
    public async Task<byte> GetInOut([FromBody] int id)
    {
        return await stageRepository.GetInOut(id);
    }

    [HttpGet]
    [Route(
        "getstagedropdownbyworkflowid/{branchId?}/{workflowId?}/{workFlowCategoryId}/{stageClassId}/{bySystem}/{isActive}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetStageDropDownByWorkFlowId(string branchId, string workflowId,
        string workFlowCategoryId, string stageClassId, byte bySystem, byte isActive)
    {
        var roleId = UserClaims.GetRoleId();;
        return await stageRepository.GetStageDropDownByWorkFlowId(branchId, workflowId, workFlowCategoryId,
            stageClassId, bySystem, isActive, roleId);
    }


    [HttpGet]
    [Route("getdropdown/{workFlowCategoryId}/{stageClassId}/{bySystem}/{isActive}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetTreasuryStageDocumentType(string workFlowCategoryId,
        byte stageClassId, byte bySystem, byte isActive)
    {
        return await stageRepository.GetStageDropDown(workFlowCategoryId, stageClassId, bySystem, isActive);
    }

    [HttpGet]
    [Route("getalldropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetAllDropDown()
    {
        return await stageRepository.GetAllDropDowna();
    }
}