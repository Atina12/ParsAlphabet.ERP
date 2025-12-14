using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.GN.Role;
using ParsAlphabet.ERP.Infrastructure.Implantation.PB;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.GN.Role;

public class RoleRepository :
    BaseRepository<RoleModel, int, string>,
    IBaseRepository<RoleModel, int, string>
{
    private readonly ManageRedisRepository _manageRedisRepository;

    public RoleRepository(IConfiguration config, ManageRedisRepository manageRedisRepository)
        : base(config)
    {
        _manageRedisRepository = manageRedisRepository;
    }

    public new GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 6
                },
                new()
                {
                    Id = "name", Title = "عنوان", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 40
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 6,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 48 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" },
                new() { Name = "sep1", Title = "", ClassName = "", IconName = "", IsSeparator = true },
                new()
                {
                    Name = "authen", Title = "دسترسی صفحات", ClassName = "btn blue_outline_1",
                    IconName = "fa fa-user-lock"
                },
                new()
                {
                    Name = "workflowAuthen", Title = "دسترسی جریان کار", ClassName = "btn blue_outline_1",
                    IconName = "fa fa-user-lock"
                },
                new()
                {
                    Name = "roleBrancPermission", Title = "دسترسی شعب", ClassName = "btn blue_outline_1",
                    IconName = "fa fa-user-lock"
                },
                new()
                {
                    Name = "roleFiscalYearPermission", Title = "دسترسی سال مالی", ClassName = "btn blue_outline_1",
                    IconName = "fa fa-user-lock"
                }
            }
        };

        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                GetColumns().DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };

        var getPage = await GetPage(model);

        result.Rows = from p in getPage.Data
            select new
            {
                p.Id,
                p.Name,
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };
        return result;
    }

    public async Task<MyResultPage<List<RoleGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<RoleGetPage>>();
        result.Data = new List<RoleGetPage>();


        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "name")
                ? model.Filters.FirstOrDefault(x => x.Name == "name").Value
                : null);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_Role_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<RoleGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        return result;
    }


    public async Task<MyResultPage<List<GetAuthenViewModel>>> GetAuthenItems(GetAuthenModel model)
    {
        var result = new MyResultPage<List<GetAuthenViewModel>>();
        result.Data = new List<GetAuthenViewModel>();
        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_Role_Authenticate_GetRecord";
            conn.Open();
            var list = (await conn.QueryAsync<GetAuthenViewModel>(sQuery, new { model.RoleId, model.Language },
                commandType: CommandType.StoredProcedure)).ToList();

            foreach (var item in list.Where(q => q.ParentId == 0).OrderBy(q => q.SortOrder))
            {
                var menu = new GetAuthenViewModel
                {
                    Id = item.Id,
                    Title = item.Title,
                    SortOrder = item.SortOrder,
                    ControllerName = item.ControllerName,
                    Auth_VIW = item.Auth_VIW,
                    Auth_VIWALL = item.Auth_VIWALL,
                    Auth_INS = item.Auth_INS,
                    Auth_UPD = item.Auth_UPD,
                    Auth_DEL = item.Auth_DEL,
                    Auth_PRN = item.Auth_PRN,
                    Auth_FIL = item.Auth_FIL
                };
                menu.Level = 1;
                menu = GetAuthenItemsRecursive(menu, list, item.Id);

                result.Data.Add(menu);
            }

            return result;
        }
    }

    private GetAuthenViewModel GetAuthenItemsRecursive(GetAuthenViewModel parentMenu, List<GetAuthenViewModel> menus,
        int parentId)
    {
        foreach (var item in menus.Where(q => q.ParentId == parentId).OrderBy(q => q.SortOrder))
        {
            var menu = new GetAuthenViewModel
            {
                Id = item.Id,
                Title = item.Title,
                SortOrder = item.SortOrder,
                ControllerName = item.ControllerName,
                Auth_VIW = item.Auth_VIW,
                Auth_VIWALL = item.Auth_VIWALL,
                Auth_DIS = item.Auth_DIS,
                Auth_INS = item.Auth_INS,
                Auth_UPD = item.Auth_UPD,
                Auth_DEL = item.Auth_DEL,
                Auth_PRN = item.Auth_PRN,
                Auth_FIL = item.Auth_FIL
            };
            menu.Level = parentMenu.Level + 1;
            if (menus.Any(q => q.ParentId == item.Id)) menu = GetAuthenItemsRecursive(menu, menus, item.Id);
            parentMenu.Children.Add(menu);
            parentMenu.ChildCount = parentMenu.Children.Count;
        }

        return parentMenu;
    }


    public async Task<MyResultQuery> SetAuthenItems(SetAuthenModel model)
    {
        var result = new MyResultQuery();

        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_Role_Authenticate_Ins";
            conn.Open();

            await conn.ExecuteAsync(sQuery, new
            {
                model.RoleId,
                ItemsJson =
                    model.RoleNavigation.ListHasRow() ? JsonConvert.SerializeObject(model.RoleNavigation) : null,
                model.UserId
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = true;

        await _manageRedisRepository.UpdateCacheNavigation(model.RoleId);

        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(byte isActive)
    {
        var filter = "";

        if (isActive != 2)
            filter += $" isActive={isActive}";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "gn.Role",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetAllDataDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "gn.Role"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<byte> GetRoleId(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<byte>(sQuery,
                new
                {
                    TableName = "gn.[User]",
                    ColumnName = "RoleId",
                    Filter = $"Id={id}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }
}