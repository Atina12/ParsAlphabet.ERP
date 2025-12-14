using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.WH.Warehouse;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WH.Warehouse;

public class WarehouseRepository :
    BaseRepository<WarehouseModel, int, string>,
    IBaseRepository<WarehouseModel, int, string>
{
    public WarehouseRepository(IConfiguration config)
        : base(config)
    {
    }

    public GetColumnsViewModel GetColumns(int? fromValue)
    {
        var list = new GetColumnsViewModel
        {
            //ActionType = fromValue != 0 ? "inline" : "dropdown",
            ActionType = "dropdown",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, Size = 0, IsDtParameter = true,
                    IsFilterParameter = true, Width = 5, FilterType = "number"
                },
                new()
                {
                    Id = "name", Title = "نام انبار", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsPrimary = true, IsFilterParameter = true, Width = 14
                },
                new()
                {
                    Id = "branch", Title = "نام شعبه", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsFilterParameter = true, Width = 9, IsDtParameter = true
                },
                new()
                {
                    Id = "locCountryName", Title = "کشور", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "locStateName", Title = "ولایت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "locCityName", Title = "شهر", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 6
                },
                new()
                {
                    Id = "postalCode", Title = "نمبر خانه (Postal Code)", Type = (int)SqlDbType.VarChar, Size = 7, IsDtParameter = true,
                    Width = 6
                },
                new()
                {
                    Id = "address", Title = "آدرس", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    Width = 15
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 6,
                    Align = "center"
                },
                new()
                {
                    Id = "isDetail", Title = "تفصیل", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 5,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 8 }
            }
        };

        if (fromValue == 0)
            list.Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" },
                new() { Name = "sep1", Title = "", ClassName = "", IconName = "", IsSeparator = true },
                new()
                {
                    Name = "accountDetail", Title = "ایجاد تفصیل", ClassName = "", IconName = "fas fa-plus color-blue"
                }
            };
        else if (fromValue == 1)
            list.Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "accountDetail", Title = "ایجاد تفصیل", ClassName = "", IconName = "fas fa-plus color-blue"
                },
                new() { Name = "sep1", Title = "", ClassName = "", IconName = "", IsSeparator = true },
                new()
                {
                    Name = "itemwarehouse", Title = "تخصیص کالا به انبار", ClassName = "btn blue_outline_1",
                    IconName = "fa fa-list"
                }
            };
        else
            list.Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "accountDetail", Title = "ایجاد تفصیل", ClassName = "", IconName = "fas fa-plus color-blue"
                },
                new() { Name = "sep1", Title = "", ClassName = "", IconName = "", IsSeparator = true },
                new()
                {
                    Name = "userwarehouse", Title = "تخصیص کاربران به انبار", ClassName = "btn blue_outline_1",
                    IconName = "fa fa-list"
                }
            };

        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                GetColumns(model.CompanyId).DataColumns.Where(x => x.IsDtParameter && x.Id != "action")
                    .Select(z => z.Title))
        };
        var getPage = await GetPage(model);
        result.Rows = from p in getPage.Data
            select new
            {
                p.Id,
                p.Name,
                p.Branch,
                p.LocCountryName,
                p.LocStateName,
                p.LocCityName,
                p.PostalCode,
                p.Address,
                IsActive = p.IsActive ? "فعال" : "غیر فعال",
                IsDetail = p.IsDetail ? "دارد" : "ندارد"
            };
        return result;
    }

    public async Task<MyResultPage<List<WarehouseGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<WarehouseGetPage>>();
        result.Data = new List<WarehouseGetPage>();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "name")
                ? model.Filters.FirstOrDefault(x => x.Name == "name").Value
                : null);
        parameters.Add("Branch",
            model.Filters.Any(x => x.Name == "branch")
                ? model.Filters.FirstOrDefault(x => x.Name == "branch").Value
                : null);
        parameters.Add("CompanyId", model.CompanyId);

        if (model.Form_KeyValue.Length > 0)
            result.Columns = GetColumns(Convert.ToInt32(model.Form_KeyValue[0]?.ToString()));
        else
            result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "wh.Spc_Warehouse_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<WarehouseGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        return result;
    }

    public async Task<MyResultPage<WarehouseGetRecord>> GetRecordById(int id)
    {
        var result = new MyResultPage<WarehouseGetRecord>();
        result.Data = new WarehouseGetRecord();
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            result.Data = await conn.QueryFirstOrDefaultAsync<WarehouseGetRecord>(sQuery, new
            {
                TableName = "wh.Warehouse",
                Filter = $"Id={id}"
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public virtual async Task<IEnumerable<MyDropDownViewModel>> GetDropDownByUserId(int userId, string branchId)
    {
        using (var conn = Connection)
        {
            var sQuery = "wh.Spc_WarehouseList_ByUser";

            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery, new
            {
                UserId = userId,
                BranchId = branchId == "null" ? null : branchId
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

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
                TableName = "wh.Warehouse",
                ColumnName = "Name",
                Filter = $"Id={id}"
            }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }
}