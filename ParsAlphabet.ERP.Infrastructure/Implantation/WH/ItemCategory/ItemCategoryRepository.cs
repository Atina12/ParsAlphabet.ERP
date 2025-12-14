using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.WH.ItemCategory;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemCategory;

public class ItemCategoryRepository :
    BaseRepository<ItemCategoryModel, int, string>,
    IBaseRepository<ItemCategoryModel, int, string>
{
    public ItemCategoryRepository(IConfiguration config) : base(config)
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
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 6
                },
                new()
                {
                    Id = "name", Title = "نام ", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 25
                },
                new()
                {
                    Id = "itemType", Title = "کالا / خدمت ", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WHApi/itemtype_getdropdown/1,2,3,5", Width = 15
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 6,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 54 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" },
                new()
                {
                    Name = "itemAttributeLineSimple", Title = "تخصیص متغیر", ClassName = "",
                    IconName = "fa fa-list color-green",
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "statusShowLine", FieldValue = "1", Operator = "==" } }
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
                p.ItemTypeName,
                IsActive = p.IsActive ? "فعال" : "غیر فعال"
            };
        return result;
    }

    public async Task<MyResultPage<List<ItemCategoryGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<ItemCategoryGetPage>>
        {
            Data = new List<ItemCategoryGetPage>()
        };

        var parameters = new DynamicParameters();

        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "name")
                ? model.Filters.FirstOrDefault(x => x.Name == "name").Value
                : null);
        parameters.Add("ItemTypeId",
            model.Filters.Any(x => x.Name == "itemType")
                ? model.Filters.FirstOrDefault(x => x.Name == "itemType").Value
                : null);
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "wh.Spc_ItemCategory_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<ItemCategoryGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }


        return result;
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetItemAttributeList()
    {
        using (var conn = Connection)
        {
            var result = new List<MyDropDownViewModel>();
            conn.Open();
            result = (await conn.QueryAsync<MyDropDownViewModel>("pb.Spc_Tables_GetList",
                new { TableName = "wh.ItemAttribute" }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<string> GetItemName(short? id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "wh.ItemCategory",
                    ColumnName = "Name",
                    Filter = $"Id={id}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<MyResultPage<ItemCategoryGetRecord>> GetRecordById(int id, int comapnyId)
    {
        var result = new MyResultPage<ItemCategoryGetRecord>
        {
            Data = new ItemCategoryGetRecord()
        };
        using (var con = Connection)
        {
            var sQuery = "[wh].[Spc_ItemCategory_GetRecord]";
            result.Data = await con.QueryFirstOrDefaultAsync<ItemCategoryGetRecord>(sQuery, new
            {
                ItemCategoryId = id,
                ComapnyId = comapnyId
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<string> GetCategorynameByItemId(int itemId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<string>(sQuery, new
            {
                TableName = "wh.Item",
                ColumnName = "(SELECT Name FROM wh.ItemCategory WHERE Id = categoryId) AS Name",
                Filter = $"id={itemId} And companyid={companyId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<bool> ExistAttribute(int itemCategoryId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var ItemAttributeIds = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "wh.ItemCategory",
                    ColumnName = "ItemAttributeIds",
                    Filter = $"Id='{itemCategoryId}' AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);

            var result = ItemAttributeIds != null ? true : false;
            return result;
        }
    }

    public async Task<MyResultQuery> ValidationDelete(int id)
    {
        var result = new MyResultQuery();

        var validationDelete = await ExistCategory(id);

        if (validationDelete > 0)
        {
            result.Successfull = false;
            result.StatusMessage = "ویژگی استفاده شده است، مجاز به حذف نیستید";
        }

        return result;
    }

    public async Task<int> ExistCategory(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";

            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "wh.[Item]",
                ColumnName = "id",
                Filter = $"CategoryId={id}",
                OrderBy = ""
            }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }
}