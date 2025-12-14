using System.Data;
using Microsoft.Extensions.Configuration;

namespace ParsAlphabet.ERP.Infrastructure;

public class ConnectionString(IConfiguration configuration)
{
    public IDbConnection Connection => new SqlConnection(configuration.GetConnectionString("DefaultConnection"));
}