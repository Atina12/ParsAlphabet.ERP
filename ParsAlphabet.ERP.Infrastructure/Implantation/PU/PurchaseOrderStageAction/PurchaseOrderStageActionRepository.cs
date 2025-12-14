using System.Data;
using Microsoft.Extensions.Configuration;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.PU.PurchaseOrderStageAction;

public class PurchaseOrderStageActionRepository

{
    private readonly IConfiguration _config;

    public PurchaseOrderStageActionRepository(IConfiguration config)
    {
        _config = config;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));
}