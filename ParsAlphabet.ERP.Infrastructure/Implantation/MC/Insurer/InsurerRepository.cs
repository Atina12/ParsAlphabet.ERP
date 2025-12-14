using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Interfaces.MC.Insurer;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.Insurer;

public class InsurerRepository : IInsurerRepository
{
    private readonly IConfiguration _config;

    public InsurerRepository(IConfiguration config)
    {
        _config = config;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public async Task<byte> GetInsurerIdByBoxId(string boxId, int CompanyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<byte>(sQuery,
                new
                {
                    TableName = "mc.InsurerLine",
                    ColumnName = "Id",
                    Filter = $"InsuranceBoxTerminologyId='{boxId}' AND CompanyId={CompanyId}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }
}