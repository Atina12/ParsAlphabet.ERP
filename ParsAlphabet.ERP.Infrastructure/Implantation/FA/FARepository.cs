using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Interfaces.FA;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FA;

public class FARepository : IFARepository
{
    private readonly IHttpContextAccessor _accessor;
    private readonly IConfiguration _config;

    public FARepository(IConfiguration config, IHttpContextAccessor accessor)
    {
        _config = config;
        _accessor = accessor;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));


    public async Task<List<MyDropDownViewModel>> ClassId_GetDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fa.FixedAssetClass"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> DepreciationMethod_GetDropDown()
    {
        using (var conn = Connection)
        {
            MyClaim.Init(_accessor);
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    TableName = "fa.DepreciationMethod"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<string> GetFixedAssetClassName(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "fa.FixedAssetClass",
                    ColumnName = "Name",
                    Filter = $"Id={id}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }
}