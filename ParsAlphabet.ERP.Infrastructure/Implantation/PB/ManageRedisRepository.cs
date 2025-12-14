using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos._Home;
using ParsAlphabet.ERP.Application.Dtos.MC.Attender;
using ParsAlphabet.ERP.Application.Dtos.Report;
using ParsAlphabet.ERP.Application.Interfaces.Redis;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.PB;

public class ManageRedisRepository :
    BaseRepository<MyDropDownViewModel2, int, string>,
    IBaseRepository<MyDropDownViewModel2, int, string>
{
    private readonly IRedisService _redisService;

    public ManageRedisRepository(IConfiguration config, IRedisService redisService) : base(config)
    {
        _redisService = redisService;
    }

    public async Task UpDatedropDownCacheByType(DropDownCache dropDownCache, byte? InsurerTypeId = 0)
    {
        var cacheName = GetDropDownCacheName(dropDownCache);
        var expirationTime = DateTimeOffset.Now.AddHours(10.0);

        if (dropDownCache == DropDownCache.Attender || dropDownCache == DropDownCache.AttenderParaClinic)
        {
            var listAttender = await GetAttenderDataListByCacheType(dropDownCache);
            _redisService.SetData(cacheName, listAttender, expirationTime);
        }
        else
        {
            var list = await GetDataListByCacheType(dropDownCache, InsurerTypeId);
            _redisService.SetData(cacheName, list, expirationTime);
        }
    }

    public async Task UpdateAttenderDropDownCacheByType(DropDownCache dropDownCache)
    {
        var cacheName = GetDropDownCacheName(dropDownCache);
        var expirationTime = DateTimeOffset.Now.AddHours(10.0);
        var list = await GetAttenderDataListByCacheType(dropDownCache);

        _redisService.SetData(cacheName, list, expirationTime);
    }

    public async Task<List<AttenderDropDownList>> GetAttenderDataListByCacheType(DropDownCache dropDownCache)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_DropDownCache_GetList]";
            var resultJson = await conn.ExecuteScalarAsync<string>(sQuery, new
            {
                DropDownCache = dropDownCache,
                CurrentDate = DateTime.Now
            }, commandType: CommandType.StoredProcedure);

            var result = JsonConvert.DeserializeObject<List<AttenderDropDownList>>(resultJson);

            return result;
        }
    }

    public async Task<List<MyDropDownViewModel2>> GetDataListByCacheType(DropDownCache dropDownCache,
        byte? referralTypeId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_DropDownCache_GetList]";
            var resultJson = await conn.ExecuteScalarAsync<string>(sQuery, new
            {
                DropDownCache = dropDownCache,
                CurrentDate = DateTime.Now
            }, commandType: CommandType.StoredProcedure);

            var result = JsonConvert.DeserializeObject<List<MyDropDownViewModel2>>(resultJson);

            if (dropDownCache == DropDownCache.InsurerLine && referralTypeId != 0 &&
                (referralTypeId == 5 || referralTypeId == 6))
            {
                if (referralTypeId == 5)
                    result = result.Where(x => x.Name.StartsWith("8000")).AsList();
                else if (referralTypeId == 6)
                    result = result.Where(x => x.Name.StartsWith("8001")).AsList();

                return result;
            }

            return result;
        }
    }

    public async Task<bool> UpdateCacheNavigation(byte roleId)
    {
        try
        {
            var navigation = await GetDataNavigationByUserId(roleId);

            var expirationTime = DateTimeOffset.Now.AddHours(10.0);
            _redisService.SetData($"MasterNavigation_Role{roleId}", navigation, expirationTime);

            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    public async Task<List<Navigation>> Get_UpdateCacheNavigation(byte roleId)
    {
        try
        {
            var cacheNavigation = _redisService.GetData<List<Navigation>>($"MasterNavigation_Role{roleId}");

            if (cacheNavigation.NotNull())
                return cacheNavigation;
            await UpdateCacheNavigation(roleId);
            cacheNavigation = await GetDataNavigationByUserId(roleId);


            return cacheNavigation;
        }
        catch (Exception)
        {
            return await GetDataNavigationByUserId(roleId);
            ;
        }
    }

    public async Task<List<Navigation>> GetDataNavigationByUserId(byte roleId)
    {
        var result = new List<Navigation>();
        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_Navigation_GetListByRoleId";
            conn.Open();
            var list = (await conn.QueryAsync<Navigation>(sQuery, new
            {
                RoleId = roleId
            }, commandType: CommandType.StoredProcedure)).ToList();

            foreach (var item in list.Where(q => q.ParentId == 0).OrderBy(q => q.SortOrder))
            {
                var menu = new Navigation
                {
                    Id = item.Id,
                    Title = item.Title,
                    IconName = item.IconName,
                    SortOrder = item.SortOrder,
                    LinkAddress = item.LinkAddress
                };
                menu.Level = 1;
                menu = GetNavigationRecursive(menu, list, item.Id);
                if (menu.Children.Count != 0)
                    result.Add(menu);
            }

            return result;
        }
    }

    private Navigation GetNavigationRecursive(Navigation parentMenu, List<Navigation> menus, int parentId)
    {
        foreach (var item in menus.Where(q => q.ParentId == parentId).OrderBy(q => q.SortOrder))
        {
            var menu = new Navigation
            {
                Id = item.Id,
                Title = item.Title,
                IconName = item.IconName,
                SortOrder = item.SortOrder,
                Show = item.Show,
                LinkAddress = item.LinkAddress
            };
            menu.Level = parentMenu.Level + 1;
            if (menus.Any(q => q.ParentId == item.Id)) menu = GetNavigationRecursive(menu, menus, item.Id);
            if (menu.Children.Count == 0)
            {
                if (menu.Show)
                    parentMenu.Children.Add(menu);
            }
            else
            {
                parentMenu.Children.Add(menu);
            }
        }

        return parentMenu;
    }

    public List<GetReportParameter> GetDataReportParameters(int userId)
    {
        return _redisService.GetData<List<GetReportParameter>>($"ReportParameters{userId}");
    }

    public bool SetDataReportParameters(int userId, List<GetReportParameter> cache)
    {
        try
        {
            var expirationTime = DateTimeOffset.Now.AddDays(100.0);
            _redisService.SetData($"ReportParameters{userId}", cache, expirationTime);

            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    public bool RemoveDataReportParameters(int userId)
    {
        try
        {
            var expirationTime = DateTimeOffset.Now.AddDays(100.0);
            _redisService.RemoveData($"ReportParameters{userId}");

            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }
}