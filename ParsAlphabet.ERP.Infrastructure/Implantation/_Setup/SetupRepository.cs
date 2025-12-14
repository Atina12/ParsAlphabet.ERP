using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos._Setup;
using ParsAlphabet.ERP.Application.Interfaces._Setup;
using ParsAlphabet.ERP.Application.Interfaces.Redis;

namespace ParsAlphabet.ERP.Infrastructure.Implantation._Setup;

public class SetupRepository : ISetupRepository
{
    private readonly IConfiguration _config;
    private readonly IRedisService _redisService;


    public SetupRepository(IConfiguration config, IRedisService redisService)
    {
        _config = config;
        _redisService = redisService;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public async Task<SetupInfo> GetSetupInfo()
    {
        var cacheSetup = new SetupInfo();

        try
        {
            cacheSetup = _redisService.GetData<SetupInfo>("SetupCIS");

            if (cacheSetup.NotNull())
                return cacheSetup;

            cacheSetup = await GetDataSetupInfo();

            var expirationTime = DateTimeOffset.Now.AddHours(10.0);
            _redisService.SetData("SetupCIS", cacheSetup, expirationTime);
        }
        catch (Exception)
        {
            cacheSetup = await GetDataSetupInfo();
        }

        return cacheSetup;
    }

    public async Task<string> GetCisWcfUrl()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<string>(sQuery, new
            {
                TableName = "gn.Setup",
                ColumnName = "CIS_WCF_Url",
                Filter = ""
            }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }

    public async Task<string> GetCisWcfSystemId()
    {
        var systemId = "";

        try
        {
            systemId = _redisService.GetData<string>("SystemIdCIS");

            if (systemId.NotNull())
                return systemId;

            systemId = await GetSystemId();

            var expirationTime = DateTimeOffset.Now.AddHours(10.0);
            _redisService.SetData("SystemIdCIS", systemId, expirationTime);
        }
        catch (Exception)
        {
            systemId = await GetSystemId();
        }

        return systemId;
    }

    public async Task<bool> GetRefreshKiosk()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<bool>(sQuery, new
            {
                TableName = "gn.Setup",
                ColumnName = "RefreshKiosk",
                Filter = ""
            }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }

    public async Task UpdateRefreshKiosk()
    {
        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_Setup_RefreshKiosk]";
            conn.Open();

            var result = await conn.ExecuteAsync(sQuery, commandType: CommandType.StoredProcedure);
            conn.Close();
        }
    }

    public async Task<List<MyDropDownViewModel>> Country_GetDropDown()
    {
        var cacheCountry = new List<MyDropDownViewModel>();

        try
        {
            cacheCountry = _redisService.GetData<List<MyDropDownViewModel>>("countryCISList");

            if (cacheCountry.NotNull())
                return cacheCountry;

            cacheCountry = await GetDataCountry_GetDropDown();

            var expirationTime = DateTimeOffset.Now.AddHours(10.0);
            _redisService.SetData("countryCISList", cacheCountry, expirationTime);
        }
        catch (Exception)
        {
            cacheCountry = await GetDataCountry_GetDropDown();
        }

        return cacheCountry;
    }

    public async Task<List<MyDropDownViewModel>> City_GetDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "gn.LocCity"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> MaritalStatus_GetDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "hr.MaritalStatus"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public List<MyDropDownViewModel> GetDropDown()
    {
        var modelList = new List<MyDropDownViewModel>();

        for (byte i = 1; i < 8; i++)
        {
            var model = new MyDropDownViewModel
            {
                Id = i,
                Name = PersianDateTime.DayOfWeekName(i)
            };

            modelList.Add(model);
        }

        return modelList;
    }

    public async Task<SetupInfo> GetDataSetupInfo()
    {
        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_Setup_GetInfo";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<SetupInfo>(
                sQuery,
                commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<CompanyInfo> GetCompanyInfo()
    {
        var result = new CompanyInfo();
        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_Company_GetInfo";
            conn.Open();

            result = await conn.QueryFirstOrDefaultAsync<CompanyInfo>(
                sQuery,
                commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<string> GetSystemId()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<string>(sQuery, new
            {
                TableName = "gn.Setup",
                ColumnName = "CIS_WCF_SystemId",
                Filter = ""
            }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetDataCountry_GetDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "gn.LocCountry"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }
}