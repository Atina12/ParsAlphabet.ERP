using System.Data;
using Dapper;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos._Home;
using ParsAlphabet.ERP.Application.Dtos.MC.Attender;
using ParsAlphabet.ERP.Application.Dtos.Report;
using ParsAlphabet.ERP.Application.Interfaces;
using ParsAlphabet.ERP.Application.Interfaces.Redis;
using ParsAlphabet.ERP.Infrastructure.Implantation;
using Enum = ParsAlphabet.ERP.Application.Enums.Enum;

namespace ParseAlphabet.ERP.Web.Modules.PB;

public class ManageRedisRepository(IConfiguration config, IRedisService redisService) :
    BaseRepository<MyDropDownViewModel2, int, string>(config),
    IBaseRepository<MyDropDownViewModel2, int, string>
{
    public async Task UpDatedropDownCacheByType(Enum.DropDownCache dropDownCache, byte? InsurerTypeId = 0)
    {
        var cacheName = GetDropDownCacheName(dropDownCache);
        var expirationTime = DateTimeOffset.Now.AddHours(10.0);

        if (dropDownCache == Enum.DropDownCache.Attender || dropDownCache == Enum.DropDownCache.AttenderParaClinic)
        {
            var listAttender = await GetAttenderDataListByCacheType(dropDownCache);
            redisService.SetData(cacheName, listAttender, expirationTime);
        }
        else
        {
            var list = await GetDataListByCacheType(dropDownCache, InsurerTypeId);
            redisService.SetData(cacheName, list, expirationTime);
        }
    }

    public async Task UpdateAttenderDropDownCacheByType(Enum.DropDownCache dropDownCache)
    {
        var cacheName = GetDropDownCacheName(dropDownCache);
        var expirationTime = DateTimeOffset.Now.AddHours(10.0);
        var list = await GetAttenderDataListByCacheType(dropDownCache);

        redisService.SetData(cacheName, list, expirationTime);
    }

    public async Task<List<AttenderDropDownList>> GetAttenderDataListByCacheType(Enum.DropDownCache dropDownCache)
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

    public async Task<List<MyDropDownViewModel2>> GetDataListByCacheType(Enum.DropDownCache dropDownCache,
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

            if (dropDownCache == Enum.DropDownCache.InsurerLine && referralTypeId != 0 &&
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
            redisService.SetData($"MasterNavigation_Role{roleId}", navigation, expirationTime);

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
            var cacheNavigation = redisService.GetData<List<Navigation>>($"MasterNavigation_Role{roleId}");

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
        return redisService.GetData<List<GetReportParameter>>($"ReportParameters{userId}");
    }

    public bool SetDataReportParameters(int userId, List<GetReportParameter> cache)
    {
        try
        {
            var expirationTime = DateTimeOffset.Now.AddDays(100.0);
            redisService.SetData($"ReportParameters{userId}", cache, expirationTime);

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
            redisService.RemoveData($"ReportParameters{userId}");

            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }
}