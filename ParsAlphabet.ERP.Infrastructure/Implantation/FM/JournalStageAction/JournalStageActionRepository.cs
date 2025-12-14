using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.FM.JournalStageAction;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.JournalStageAction;

public class JournalStageActionRepository :
    BaseRepository<JournalStageActionModel, int, string>,
    IBaseRepository<JournalStageActionModel, int, string>
{
    public readonly IHttpContextAccessor _accessor;

    public JournalStageActionRepository(IConfiguration config, IHttpContextAccessor accessor) : base(config)
    {
        _accessor = accessor;
    }

    public async Task<byte> GetStageStepStartEnd(GetJournalStageStepByPriority model, string filterParam = "")
    {
        var orderBy = $" Priority {(model.Starter ? " ASC" : " DESC")}";
        var filter = $"CompanyId ={model.CompanyId}";

        if (!string.IsNullOrEmpty(filterParam))
        {
            if (model.StageId != 0)
                filter += $" AND StageId={model.StageId}";

            if (model.WorkFlowId != 0)
                filter += $" AND WorkFlowId={model.WorkFlowId}";

            if (model.ActionId != 0)
                filter += $" AND ActionId={model.ActionId}";

            filter += $" {filterParam}";
        }
        else
        {
            filter += filterParam;
        }

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<byte>(sQuery, new
            {
                TableName = "wf.StageAction",
                ColumnName = "ActionId",
                Filter = filter,
                OrderBy = orderBy
            }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetActionListByStageId(short stageId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_JournalAction_GetList_ByStageId]";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery, new
            {
                StageId = stageId,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }

    public async Task<byte> GetActionIdByPriority(int workflowId, short stageId, byte priority, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<byte>(sQuery, new
            {
                TableName = "wf.StageAction",
                ColumnName = "ActionId",
                Filter =
                    $"WorkflowId={workflowId} AND StageId={stageId} AND Priority ='{priority}'  AND CompanyId ='{companyId}'",
                OrderBy = ""
            }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }


    public async Task<byte> GetActionIsLastConfirmHeader(short stageId, int workflowId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<byte>(sQuery, new
            {
                TableName = "wf.StageAction",
                ColumnName = "ActionId",
                Filter =
                    $"WorkflowId={workflowId} AND StageId={stageId} AND IsLastConfirmHeader=1  AND CompanyId='{companyId}'",
                OrderBy = ""
            }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }
}