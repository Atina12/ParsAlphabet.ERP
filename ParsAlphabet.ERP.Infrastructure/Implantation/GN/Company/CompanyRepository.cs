using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.GN.Company;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Application.Interfaces.Redis;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.GN.Company;

public class CompanyRepository : ICompanyRepository
{
    private readonly IConfiguration _config;
    private readonly IRedisService _redisService;

    public CompanyRepository(IConfiguration config, IRedisService redisService)
    {
        _config = config;
        _redisService = redisService;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public async Task<CompanyInfo> GetCompanyInfo()
    {
        var cacheCompanyInfo = new CompanyInfo();

        try
        {
            cacheCompanyInfo = _redisService.GetData<CompanyInfo>("cacheCompanyInfo");

            if (cacheCompanyInfo.NotNull())
                return cacheCompanyInfo;

            cacheCompanyInfo = await GetDataCompanyInfo();

            var expirationTime = DateTimeOffset.Now.AddHours(10.0);
            _redisService.SetData("cacheCompanyInfo", cacheCompanyInfo, expirationTime);
        }
        catch (Exception)
        {
            cacheCompanyInfo = await GetDataCompanyInfo();
        }

        return cacheCompanyInfo;
    }

    public async Task<CompanyKeyInfo> GetCompanyKeyInfo()
    {
        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_Company_GetKeyInfo]";

            conn.Open();

            var result =
                await conn.QueryFirstOrDefaultAsync<CompanyKeyInfo>(sQuery, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }


    public async Task<byte> GetDefaultCurrency(int companyId)
    {
        byte defaultCurrency = 0;

        try
        {
            defaultCurrency = _redisService.GetData<byte>("cacheDefaultCurrency");

            if (defaultCurrency != 0)
                return defaultCurrency;

            defaultCurrency = await GetDataDefaultCurrency(companyId);

            var expirationTime = DateTimeOffset.Now.AddHours(10.0);
            _redisService.SetData("cacheDefaultCurrency", defaultCurrency, expirationTime);
        }
        catch (Exception)
        {
            defaultCurrency = await GetDataDefaultCurrency(companyId);
        }

        return defaultCurrency;
    }

    public async Task<short> GetCompanyCentralId()
    {
        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_Company_GetCentralId]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<short>(sQuery, commandType: CommandType.StoredProcedure);

            return result;
        }
    }


    public async Task<CompanyInfo> GetDataCompanyInfo()
    {
        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_Company_GetInfo";

            conn.Open();

            var result =
                await conn.QueryFirstOrDefaultAsync<CompanyInfo>(sQuery, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<byte> GetDataDefaultCurrency(int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<byte>(sQuery, new
            {
                TableName = "gn.Company",
                ColumnName = "DefaultCurrencyId",
                Filter = $"Id={companyId}"
            }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }


    public async Task<int> GetUserActiveCount(int CompanyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "gn.Company",
                    ColumnName = "UserActiveCount",
                    Filter = $"Id={CompanyId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<int> GetUBranchCount(int CompanyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "gn.Company",
                    ColumnName = "BranchCount",
                    Filter = $"Id={CompanyId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<int> GetCurrencyCount(int CompanyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "gn.Company",
                    ColumnName = "CurrencyCount",
                    Filter = $"Id={CompanyId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }
}