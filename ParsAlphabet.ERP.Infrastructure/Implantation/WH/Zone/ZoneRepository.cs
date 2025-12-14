using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.WH.Zone;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WH.Zone;

public class ZoneRepository :
    BaseRepository<ZoneModel, int, string>,
    IBaseRepository<ZoneModel, int, string>
{
    public ZoneRepository(IConfiguration config)
        : base(config)
    {
    }

    public new GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, Size = 0, IsDtParameter = true,
                    IsFilterParameter = true, Width = 5, FilterType = "number"
                },
                new()
                {
                    Id = "name", Title = "نام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 20
                },
                new()
                {
                    Id = "warehouse", Title = "انبار", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 20
                },
                new()
                {
                    Id = "zoneRankId", Title = "شناسه بخش", Type = (int)SqlDbType.VarChar, Size = 0,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 1, IsDtParameter = true,
                    Width = 6, Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 44 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" }
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
                p.Warehouse,
                p.ZoneRankId,
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };
        return result;
    }

    public async Task<int> CheckExistZoneByRankId(string binRankId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "wh.Zone",
                    ColumnName = "Id",
                    Filter = $"ZoneRankId='{binRankId}'"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<MyResultPage<List<ZoneGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<ZoneGetPage>>();
        result.Data = new List<ZoneGetPage>();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "name")
                ? model.Filters.FirstOrDefault(x => x.Name == "name").Value
                : null);
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "wh.Spc_Zone_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<ZoneGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(int warehouseId, int itemTypeId, int itemId, int userId,
        int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "wh.Spc_Zone_Dropdown";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    WarehouseId = warehouseId,
                    ItemTypeid = itemTypeId,
                    ItemId = itemId,
                    UserId = userId,
                    CompanyId = companyId
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<string> GetName(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<string>(sQuery, new
            {
                TableName = "wh.Zone",
                ColumnName = "Name",
                Filter = $"Id={id}"
            }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }
}