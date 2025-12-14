using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.HR.StandardTimeSheetPerMonth;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.HR.StandardTimeSheetPerMonth;

public class StandardTimeSheetPerMonthRepository :
    BaseRepository<StandardTimeSheetPerMonthModel, int, string>,
    IBaseRepository<StandardTimeSheetPerMonthModel, int, string>
{
    public StandardTimeSheetPerMonthRepository(IConfiguration config) : base(config)
    {
    }

    public async Task<MyResultStatus> Save(StandardTimeSheetPerMonthModel model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[hr].[Spc_StandardTimeSheetPerMonth_InsUpd]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.Id,
                model.StandardTimeSheetId,
                model.MonthId,
                model.StandardMonthWorkingHours,
                model.CreateUserId,
                model.CreateDateTime
            }, commandType: CommandType.StoredProcedure);

            result.Successfull = result.Status == 100;
            return result;
        }
    }

    public async Task<List<StandardTimeSheetPerMonthGetRecord>> GetStandardTimeSheetPerMonth(int standardTimeSheetId,
        byte? monthId)
    {
        using (var conn = Connection)
        {
            var sQuery = "hr.Spc_StandardTimeSheetPerMonth_Get";
            conn.Open();
            var result = await conn.QueryAsync<StandardTimeSheetPerMonthGetRecord>(sQuery, new
            {
                StandardTimeSheetId = standardTimeSheetId,
                MonthId = monthId
            }, commandType: CommandType.StoredProcedure);

            return result.AsList();
        }
    }
}