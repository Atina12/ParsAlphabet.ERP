using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionStageActionLog;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionStageActionLog;

public class AdmissionStageActionLogRepository :
    BaseRepository<AdmissionStageActionLogModel, int, string>,
    IBaseRepository<AdmissionStageActionLogModel, int, string>
{
    public AdmissionStageActionLogRepository(IConfiguration config)
        : base(config)
    {
    }

    public async Task<MyResultStatus> Insert(AdmissionStageActionLogModel model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionActionLog_InsertActionLog]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.AdmissionId,
                model.StageId,
                model.InsertDate,
                model.UserId,
                model.ActionId
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            result.Successfull = result.Status == 100;

            if (result.Successfull)
                result.StatusMessage = "ثبت با موفقیت انجام شد";
            else
                result.StatusMessage = "ثبت با خطا مواجه شد";

            return result;
        }
    }
}