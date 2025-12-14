using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.WF.Workflow;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WF.Workflow;

public class WorkflowRepository :
    BaseRepository<WorkflowModel, int, string>,
    IBaseRepository<WorkflowModel, int, string>
{
    public readonly IHttpContextAccessor _accessor;

    public WorkflowRepository(IConfiguration config, IHttpContextAccessor accessor) : base(config)
    {
        _accessor = accessor;
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(string branchId, string workflowCategoryId,
        string stageClassId, byte roleId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_Workflow_GetList]";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    WorkflowCategoryId = workflowCategoryId,
                    StageClassId = stageClassId,
                    BranchId = branchId == "null" ? null : branchId,
                    RoleId = roleId
                }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> AdmissionWorkflowGetDropDown(short branchId, byte itemTypeId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_AdmissionWorkflow_ByItemType]";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    BranchId = branchId,
                    ItemTypeId = itemTypeId
                }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }

    public async Task<GetRequestDataByWorkflowCategory> GetRequestGLSGLByWorkflowCategory(short workflowCategoryId,
        int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_GetRequestData_ByWorkflowCategory]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<GetRequestDataByWorkflowCategory>(sQuery, new
            {
                WorkflowCategoryId = workflowCategoryId,
                IdentityId = id,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }


    public async Task<string> GetName(int workflowId)
    {
        if (workflowId == 0)
            return null;

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<string>(sQuery,
                new
                {
                    TableName = "wf.Workflow",
                    ColumnNameList = "Name",
                    Filter = $"Id = {workflowId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }
}