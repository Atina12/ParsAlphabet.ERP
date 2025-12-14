using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.FM.TreasuryStageAction;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.TreasuryStageAction;

public class TreasuryStageActionRepository

{
    private readonly IConfiguration _config;

    public TreasuryStageActionRepository(IConfiguration config)
    {
        _config = config;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public async Task<TreasuryStageActionLogicModel> GetTreasuryActionByTreasury(int treasuryId)
    {
        var sQuery = "[fm].[Spc_Treasury_GetLogic]";
        using (var conn = Connection)
        {
            conn.Open();
            var result = await Connection.QueryFirstOrDefaultAsync<TreasuryStageActionLogicModel>(sQuery,
                new
                {
                    TreasuryId = treasuryId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }
}