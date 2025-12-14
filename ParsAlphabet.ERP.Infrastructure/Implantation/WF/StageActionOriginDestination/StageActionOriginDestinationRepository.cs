using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.WF.StageActionOriginDestination;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageActionOriginDestination;

public class StageActionOriginDestinationRepository :
    BaseRepository<StageActionOriginDestinationModel, int, string>,
    IBaseRepository<StageActionOriginDestinationModel, int, string>
{
    public StageActionOriginDestinationRepository(IConfiguration config) : base(config)
    {
    }

    public async Task<MyResultStatus> Insert(StageActionOriginDestinationModel model)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_StageActionOriginDestination_Ins]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, model,
                commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<WorkflowStageViewModel> GetWorkflowStage(int workflowId, short stageId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<WorkflowStageViewModel>(sQuery,
                new
                {
                    TableName = "wf.WorkflowStage",
                    Filter = $"WorkflowId={workflowId} AND StageId={stageId}"
                }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }
}