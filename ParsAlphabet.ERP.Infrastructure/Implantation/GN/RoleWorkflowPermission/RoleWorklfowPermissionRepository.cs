using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.GN.RoleWorkflowPermission;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.GN.RoleWorkflowPermission;

public class RoleWorklfowPermissionRepository :
    BaseRepository<RoleWorklfowPermissionModel, int, string>,
    IBaseRepository<RoleWorklfowPermissionModel, int, string>
{
    public RoleWorklfowPermissionRepository(IConfiguration config)
        : base(config)
    {
    }


    public async Task<MyResultStatus> Save(RoleWorklfowPermissionModel model)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "gn.[Spc_RoleWorkflowPermission_InsDel]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.RoleId,
                WorkflowPermissionJson = JsonConvert.SerializeObject(model.WorkflowPermissionList),
                model.CreateUserId,
                model.CreateDateTime,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;


        return result;
    }


    public async Task<object> RoleWorkflowPermissionGetList(byte Type, byte RoleId, byte WorkflowCategoryId,
        short BranchId, int WorkflowId, short StageId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_RoleWorkflowPermission_GetList]";
            conn.Open();

            var result = await conn.QueryAsync<object>(sQuery,
                new
                {
                    Type,
                    RoleId,
                    WorkflowCategoryId,
                    BranchId,
                    WorkflowId,
                    StageId
                }, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }
    }


    public async Task<int> GetRoleWorkflowStageStepPermission(GetRoleWorkflowStageActionPermission model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "gn.RoleWorkflowPermission",
                ColumnName = "Id",
                Filter =
                    $"WorkflowId={model.WorkflowId}  AND StageId={model.StageId}  AND ActionId={model.ActionId} AND RoleId={model.RoleId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }


    public async Task<byte> CheckRoleWorkflowPermission(int workflowId, short branchId, short stageId, byte actionId,
        byte roleId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_RoleWorkflowPermission_Check]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<byte>(sQuery, new
            {
                WorkflowId = workflowId,
                StageId = stageId,
                ActionId = actionId,
                RoleId = roleId,
                BranchId = branchId
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
            return result;
        }
    }

    public async Task<byte> CheckRoleWorkflowPermissionByHeaderId(int headerId, byte workflowCategoryId, byte roeId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_RoleWorkflowPermission_CheckByHeaderId]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<byte>(sQuery, new
            {
                HeaderId = headerId,
                WorkflowCategoryId = workflowCategoryId,
                RoleId = roeId
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
            return result;
        }
    }
}