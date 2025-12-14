using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.WH.WarehouseStageAction;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WH.WarehouseStageAction;

public class WarehouseStageActionRepository

{
    private readonly IConfiguration _config;

    public WarehouseStageActionRepository(IConfiguration config)
    {
        _config = config;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public async Task<WarehouseStageActionLogicModel> GetWarehouseAction(long itemTransactionId)
    {
        var sQuery = "[WH].[Spc_Transaction_GetLogic]";
        using (var conn = Connection)
        {
            conn.Open();
            var result = await Connection.QueryFirstOrDefaultAsync<WarehouseStageActionLogicModel>(sQuery,
                new
                {
                    ItemTransactionId = itemTransactionId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }
}