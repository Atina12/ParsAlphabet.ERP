using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos._ErrorLog;
using ParsAlphabet.ERP.Application.Interfaces._ErrorLog;

namespace ParsAlphabet.ERP.Infrastructure.Implantation._ErrorLog;

public class ErrorLogRepository : IErrorLogRepository
{
    private readonly IConfiguration _config;

    public ErrorLogRepository(IConfiguration config)
    {
        _config = config;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public async Task<MyResultQuery> Insert(string errmessage, int userid, string ipaddress, string path)
    {
        var result = new MyResultQuery();
        try
        {
            using (var conn = Connection)
            {
                var sQuery = "gn.Spc_ErrorLog_Ins";
                conn.Open();
                await conn.QueryFirstOrDefaultAsync<ErrorLogModel>(sQuery,
                    new
                    {
                        ErrMessage = errmessage,
                        UserId = userid,
                        Path = path,
                        IpAddress = ipaddress
                    }, commandType: CommandType.StoredProcedure);
            }

            result.Successfull = true;
            return result;
        }
        catch (Exception)
        {
            return result;
        }
    }
}