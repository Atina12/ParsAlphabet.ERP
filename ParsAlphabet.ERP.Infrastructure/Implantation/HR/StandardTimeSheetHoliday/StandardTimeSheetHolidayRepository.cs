using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.HR.StandardTimeSheetHoliday;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.HR.StandardTimeSheetHoliday;

public class StandardTimeSheetHolidayRepository :
    BaseRepository<StandardTimeSheetHolidayModel, int, string>,
    IBaseRepository<StandardTimeSheetHolidayModel, int, string>
{
    public StandardTimeSheetHolidayRepository(IConfiguration config) : base(config)
    {
    }

    public async Task<List<StandardTimeSheetHolidayGetPage>> GetStandardTimeSheetHolidayPage(int headerId,
        string monthId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[hr].Spc_StandardTimeSheetHoliday_GetPage";
            conn.Open();
            var result = (await conn.QueryAsync<StandardTimeSheetHolidayGetPage>(sQuery, new
            {
                HeaderId = headerId,
                MonthId = monthId
            }, commandType: CommandType.StoredProcedure)).ToList();

            return result;
        }
    }

    public async Task<MyResultStatus> Save(StandardTimeSheetHolidayModel model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[hr].Spc_StandardTimeSheetHoliday_InsUpd";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.Id,
                model.HeaderId,
                model.HolidayDate,
                model.MonthId,
                model.DayId,
                model.CreateUserId,
                model.CreateDateTime
            }, commandType: CommandType.StoredProcedure);


            result.Successfull = result.Status == 100;
            result.DateTime = model.CreateDateTime;
            return result;
        }
    }
}