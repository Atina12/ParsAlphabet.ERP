using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Interfaces.CR;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.CR;

public class CRRepository : ICRRepository
{
    private readonly IConfiguration _config;

    public CRRepository(IConfiguration config)
    {
        _config = config;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));


    public async Task<List<MyDropDownViewModel>> PersonGroupType_GetDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "cr.PersonGroupType"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> PersonGroup_GetDropDown(byte personTypeId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "cr.PersonGroup",
                    Filter = $"PersonTypeId={personTypeId} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }
}