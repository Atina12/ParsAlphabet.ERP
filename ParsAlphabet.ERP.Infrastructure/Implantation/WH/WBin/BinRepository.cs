using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.WH.WBin;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WH.WBin;

public class BinRepository :
    BaseRepository<BinModel, int, string>,
    IBaseRepository<BinModel, int, string>
{
    public BinRepository(IConfiguration config)
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
                    Id = "warehouse", Title = "انبار", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "zone", Title = "بخش‌ ", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 7, FilterType = "select2",
                    FilterTypeApi = "/api/WH/ZoneApi/getalldatadropdown"
                },
                new()
                {
                    Id = "name", Title = "پالت", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 7, FilterType = "select2",
                    FilterTypeApi = "/api/WH/WBinApi/getdropdown"
                },
                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 7
                },

                new()
                {
                    Id = "locCountry", Title = "کشور", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "locState", Title = "ولایت", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "locCity", Title = "شهر", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "address", Title = "آدرس", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 15
                },
                new()
                {
                    Id = "postalCode", Title = "کدپستی", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "warehouseIsDetail", Title = "تفصیل/انبار", Type = (int)SqlDbType.Bit, Size = 1,
                    IsDtParameter = true, Width = 6, Align = "center"
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 1, IsDtParameter = true,
                    Width = 6, Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" }
            }
        };

        return list;
    }

    public async Task<int> CheckExistBinByRankId(string binRankId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "wh.Bin",
                    ColumnName = "Id",
                    Filter = $"BinRankId='{binRankId}'"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
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
                p.Warehouse,
                p.Zone,
                p.Name,
                p.Branch,
                p.LocCountry,
                p.LocState,
                p.LocCity,
                p.Address,
                p.PostalCode,
                //p.Name,
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };
        return result;
    }

    public async Task<MyResultPage<List<BinGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<BinGetPage>>();
        result.Data = new List<BinGetPage>();

        int? p_id = null;
        var p_name = "";

        switch (model.FieldItem)
        {
            case "id":
                p_id = Convert.ToInt32(model.FieldValue);
                break;
            case "name":
                p_name = model.FieldValue;
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "name")
                ? model.Filters.FirstOrDefault(x => x.Name == "name").Value
                : null);
        parameters.Add("ZoneId",
            model.Filters.Any(x => x.Name == "zone")
                ? model.Filters.FirstOrDefault(x => x.Name == "zone").Value
                : null);
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "wh.Spc_Bin_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<BinGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(int warehouseId, int itemTypeId, int itemId, int zoneId,
        int userId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "wh.Spc_Bin_Dropdown";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    WarehouseId = warehouseId,
                    ItemTypeid = itemTypeId,
                    ItemId = itemId,
                    ZoneId = zoneId,
                    UserId = userId,
                    CompanyId = companyId
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }
}