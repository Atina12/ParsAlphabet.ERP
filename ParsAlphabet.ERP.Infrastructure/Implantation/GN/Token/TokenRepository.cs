using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.Central.ObjectModel.General.Token;
using ParsAlphabet.Central.ObjectModel.Requests;
using ParsAlphabet.ERP.Application.Interfaces.GN.Token;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.GN.Token;

public class TokenRepository : ITokenRepository
{
    private readonly IConfiguration _configuration;

    public TokenRepository(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public IDbConnection Connection => new SqlConnection(_configuration.GetConnectionString("DefaultConnection"));

    public async Task<TokenModel> GetToken(byte transactionTypeId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_TransactionToken_GetList]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<TokenModel>(sQuery, new
            {
                TransactionTypeId = transactionTypeId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<ResultQuery> InsertToken(TokenModel model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_TransactionToken_Ins]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<ResultQuery>(sQuery, new
            {
                model.Token,
                model.ExpirationDateTime,
                model.TransactionTypeId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<ResultQuery> DeleteToken(int Id)
    {
        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_TransactionToken_Del]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<ResultQuery>(sQuery, new
            {
                Id
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }
}