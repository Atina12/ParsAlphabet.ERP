using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageActionLog;

public class StageActionLogRepository :
    BaseRepository<StageActionLogModel, long, string>,
    IBaseRepository<StageActionLogModel, long, string>
{
    public StageActionLogRepository(
        IConfiguration config) : base(config)
    {
    }

    public async Task<MyResultDataQuery<List<StepLogList>>> GetStepList(long transactionId, short stageId,
        int workflowId)
    {
        var result = new MyResultDataQuery<List<StepLogList>>
        {
            Data = new List<StepLogList>()
        };

        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_StageActionLog_GetList]";
            conn.Open();
            result.Data = (await conn.QueryAsync<StepLogList>(sQuery, new
            {
                TransactionId = transactionId,
                WorkflowId = workflowId,
                StageId = stageId
            }, commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultStatus> StageActionLogInsert(UpdateAction model)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_StageActionLog_Ins]";
            conn.Open();

            var output = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TransactionId = model.IdentityId,
                    WorkFlowCategoryId = model.WorkflowCategoryId,
                    model.WorkflowId,
                    model.StageId,
                    ActionId = model.RequestActionId,
                    model.UserId,
                    CreateDateTime = model.StepDateTime,
                    model.CompanyId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            result.Successfull = output == 100;
            result.Status = output;
            result.StatusMessage = result.Successfull ? "با موفقیت ایجاد شد" : "مشکلی در انجام عملیات وجود دارد";
        }

        return result;
    }
}