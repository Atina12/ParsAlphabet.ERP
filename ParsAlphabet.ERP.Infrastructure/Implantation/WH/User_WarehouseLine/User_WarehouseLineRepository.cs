using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.WH.User_WarehouseLine;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WH.User_WarehouseLine;

public class User_WarehouseLineRepository :
    BaseRepository<User_WarehouseLineModel, int, string>,
    IBaseRepository<User_WarehouseLineModel, int, string>
{
    public User_WarehouseLineRepository(IConfiguration config)
        : base(config)
    {
    }

    public GetColumnsViewModel GetColumnsDiAssign()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 6
                },
                new()
                {
                    Id = "userId", Title = "کاربر", Type = (int)SqlDbType.Int, IsFilterParameter = true, Width = 7,
                    FilterType = "select2", FilterTypeApi = "/api/GN/UserApi/getdropdown/1/false"
                },
                new()
                {
                    Id = "fullName", Title = "کاربر ", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    Width = 20
                },
                new()
                {
                    Id = "roleId", Title = "نقش ", Type = (int)SqlDbType.TinyInt, IsFilterParameter = true, Width = 20,
                    FilterType = "select2", FilterTypeApi = "/api/GN/RoleApi/getdropdown/1"
                },
                new()
                {
                    Id = "roleName", Title = "نقش ", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    Width = 20
                }
            }
        };

        return list;
    }

    public GetColumnsViewModel GetColumnsAssign()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 6
                },
                new()
                {
                    Id = "userId", Title = "کاربر", Type = (int)SqlDbType.Int, IsFilterParameter = true, Width = 7,
                    FilterType = "select2", FilterTypeApi = "/api/GN/UserApi/getdropdown/1/false"
                },
                new()
                {
                    Id = "fullName", Title = "کاربر ", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    Width = 20
                },
                new()
                {
                    Id = "roleId", Title = "نقش ", Type = (int)SqlDbType.TinyInt, IsFilterParameter = true, Width = 20,
                    FilterType = "select2", FilterTypeApi = "/api/GN/RoleApi/getdropdown/1"
                },
                new()
                {
                    Id = "roleName", Title = "نقش ", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    Width = 20
                },
                new()
                {
                    Id = "zoneIdName", Title = "بخش ", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    Width = 13
                },
                new()
                {
                    Id = "binIdName", Title = "پالت ", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    Width = 13
                }
            }
        };

        return list;
    }

    public async Task<MyResultPage<WarehouseUserLineAssignList>> GetPageDiAssigns(NewGetPageViewModel model)
    {
        var result = new MyResultPage<WarehouseUserLineAssignList>();
        result.Data = new WarehouseUserLineAssignList();

        int? p_warehouseId = Convert.ToInt32(model.Form_KeyValue[0]?.ToString());
        int? p_userId = null;
        byte? p_roleId = null;
        int? p_zoneId = Convert.ToInt32(model.Form_KeyValue[1]?.ToString());
        int? p_binId = Convert.ToInt32(model.Form_KeyValue[2]?.ToString());

        switch (model.FieldItem)
        {
            case "id":
                p_userId = Convert.ToInt32(model.FieldValue);
                break;
            case "userId":
                p_userId = Convert.ToInt32(model.FieldValue);
                break;
            case "roleId":
                p_roleId = Convert.ToByte(model.FieldValue);
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("WarehouseId", p_warehouseId);
        parameters.Add("UserId", p_userId);
        parameters.Add("RoleId", p_roleId);
        parameters.Add("ZoneId", p_zoneId == 0 ? null : p_zoneId);
        parameters.Add("BinId", p_binId == 0 ? null : p_binId);
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumnsDiAssign();

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_User_Warehouse_DiAssign]";
            conn.Open();
            result.Data.Assigns =
                (await conn.QueryAsync<WarehouseUserLineGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultPage<WarehouseUserLineAssignList>> GetPageAssign(NewGetPageViewModel model)
    {
        var result = new MyResultPage<WarehouseUserLineAssignList>();
        result.Data = new WarehouseUserLineAssignList();

        int? p_warehouseId = Convert.ToInt32(model.Form_KeyValue[0]?.ToString());
        int? p_userId = null;
        byte? p_roleId = null;
        string p_Name = string.Empty, p_roleName = string.Empty;
        int? p_zoneId = Convert.ToInt32(model.Form_KeyValue[1]?.ToString());
        int? p_binId = Convert.ToInt32(model.Form_KeyValue[2]?.ToString());
        switch (model.FieldItem)
        {
            case "id":
                p_userId = Convert.ToInt32(model.FieldValue);
                break;
            case "userId":
                p_userId = Convert.ToInt32(model.FieldValue);
                break;
            case "roleId":
                p_roleId = Convert.ToByte(model.FieldValue);
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("WarehouseId", p_warehouseId);
        parameters.Add("UserId", p_userId);
        parameters.Add("RoleId", p_roleId);
        parameters.Add("ZoneId", p_zoneId == 0 ? null : p_zoneId);
        parameters.Add("BinId", p_binId == 0 ? null : p_binId);

        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumnsAssign();

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_User_Warehouse_Assign]";
            conn.Open();
            result.Data.Assigns =
                (await conn.QueryAsync<WarehouseUserLineGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultQuery> WarehouseUserAssign(WarehouseUserLineAssign model)
    {
        var result = new MyResultQuery();

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_User_Warehouse_Save]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Ins",
                model.WarehouseId,
                UserIds = string.Join(",", model.Assign.Select(a => a.Id).ToList()),
                model.ZoneId,
                model.BinId,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultQuery> WarehouseUserDiAssign(WarehouseUserLineAssign model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_User_Warehouse_Save]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Del",
                model.WarehouseId,
                UserIds = string.Join(",", model.Assign.Select(a => a.Id).ToList()),
                model.ZoneId,
                model.BinId,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultPage<WarehouseUserLineGetRecord>> GetRecordById(int warehouseId, int userId)
    {
        var result = new MyResultPage<WarehouseUserLineGetRecord>
        {
            Data = new WarehouseUserLineGetRecord()
        };
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            conn.Open();
            result.Data = await conn.QueryFirstOrDefaultAsync<WarehouseUserLineGetRecord>(sQuery, new
            {
                TableName = "wh.User_Warehouse",
                Filter = $"WarehouseId = {warehouseId} and userId={userId}"
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Data != null;
        return result;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                GetColumnsAssign().DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };
        var getPage = await GetPageAssign(model);
        result.Rows = from p in getPage.Data.Assigns
            select new
            {
                p.Id,
                p.FullName,
                p.Role,
                p.ZoneIdName,
                p.BinIdName
            };
        return result;
    }
}