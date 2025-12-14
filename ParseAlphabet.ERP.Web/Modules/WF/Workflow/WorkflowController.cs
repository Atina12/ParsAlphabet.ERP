using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WF.Workflow;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.Workflow;

namespace ParseAlphabet.ERP.Web.Modules.WF.Workflow;

[Route("api/WF/[controller]")]
[ApiController]
[Authorize]
public class WorkflowApiController(WorkflowRepository workflowRepository) : ControllerBase
{
    [HttpGet]
    [Route("getdropdown/{branchId}/{workflowCategoryId}/{stageClassId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(string branchId, string workflowCategoryId,
        string stageClassId)
    {
        var roleId = UserClaims.GetRoleId();
        ;
        return await workflowRepository.GetDropDown(branchId, workflowCategoryId, stageClassId, roleId);
    }

    [HttpGet]
    [Route("admissionworkflowgetdropdown/{branchId}/{itemTypeId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> AdmissionWorkflowGetDropDown(short branchId, byte itemTypeId)
    {
        return await workflowRepository.AdmissionWorkflowGetDropDown(branchId, itemTypeId);
    }

    [HttpGet]
    [Route("getrequestglsglbyworkflowcategory/{workflowCategoryId}/{identityId}")]
    public async Task<GetRequestDataByWorkflowCategory> GetTreasuryRequestGLSGL(short workflowCategoryId,
        int identityId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await workflowRepository.GetRequestGLSGLByWorkflowCategory(workflowCategoryId, identityId, companyId);
    }
}