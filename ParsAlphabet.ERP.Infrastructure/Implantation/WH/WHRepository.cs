using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Interfaces.WH;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WH;

public class WHRepository : IWHRepository
{
    private readonly IConfiguration _config;

    public WHRepository(IConfiguration config)
    {
        _config = config;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public async Task<List<MyDropDownViewModel>> CostingMethod_GetDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "wh.CostingMethod"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> BinCategory_GetDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "wh.BinCategory"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> ItemType_GetDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "gn.ItemType"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> ItemTypeIsItem_GetDropDown()
    {
        var filter = "IsActiveItem=1";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "gn.ItemType",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> ItemTypeSalesPrice_GetDropDown()
    {
        var filter = string.Empty;

        filter = "IsActiveSalesPrice=1";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "gn.ItemType",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> ItemTypeByType_GetDropDown(string itemTypes)
    {
        var filter = string.Empty;

        if (!itemTypes.IsNullOrEmptyOrWhiteSpace())
            filter = $"Id IN ({itemTypes})";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "gn.ItemType",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }
}