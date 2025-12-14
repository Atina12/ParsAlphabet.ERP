using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos._History;

namespace ParsAlphabet.ERP.Infrastructure.Implantation._History;

public class HistoryRepository :
    BaseRepository<HistoryModel, int, string>,
    IBaseRepository<HistoryModel, int, string>
{
    public HistoryRepository(IConfiguration config) : base(config)
    {
    }

    public async Task<MyResultStatus> Insert(HistoryModel model)
    {
        var result = new MyResultStatus();
        model.Description = model.Description.Replace(" ", "");
        try
        {
            using (var conn = Connection)
            {
                var sQuery = "[gn].[Spc_History_Ins]";
                conn.Open();
                result = await conn.QueryFirstAsync<MyResultStatus>(sQuery, model,
                    commandType: CommandType.StoredProcedure);
            }

            result.Successfull = result.Status == 100;
            return result;
        }
        catch (Exception ex)
        {
            result.Status = 99;
            result.Successfull = false;
            result.StatusMessage = ex.ToString();
            return result;
        }
    }
}