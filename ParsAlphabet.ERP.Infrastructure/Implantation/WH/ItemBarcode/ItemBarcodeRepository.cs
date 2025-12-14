using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.WH.ItemBarcode;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemBarcode;

public class ItemBarcodeRepository :
    BaseRepository<ItemBarcodeModel, int, string>,
    IBaseRepository<ItemBarcodeModel, int, string>
{
    public ItemBarcodeRepository(IConfiguration config) : base(config)
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
                new() { Id = "itemId", Title = "کد کالا ", IsPrimary = true },
                new() { Id = "itemName", Title = "کد کالا ", IsPrimary = true },
                new()
                {
                    Id = "item", Title = "آیتم ", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 10, FilterType = "select2",
                    FilterTypeApi = "/api/WH/ItemApi/getalldatadropdown"
                },
                new()
                {
                    Id = "attributeNames", Title = " صفات کالا ", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "barcode", Title = " بارکد ", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 20
                },
                new() { Id = "attributeIds", IsPrimary = true },
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


    public async Task<MyResultPage<List<ItemBarcodeGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<ItemBarcodeGetPage>>
        {
            Data = new List<ItemBarcodeGetPage>()
        };

        if (model.Filters == null) model.Filters = new List<FormKeyValue>();
        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("itemId",
            model.Filters.Any(x => x.Name == "item")
                ? model.Filters.FirstOrDefault(x => x.Name == "item").Value
                : null);
        parameters.Add("attributeIds",
            model.Filters.Any(x => x.Name == "attributeIds")
                ? model.Filters.FirstOrDefault(x => x.Name == "attributeIds").Value
                : null);

        parameters.Add("barcode",
            model.Filters.Any(x => x.Name == "barcode")
                ? model.Filters.FirstOrDefault(x => x.Name == "barcode").Value
                : null);


        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "wh.Spc_ItemBarcode_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<ItemBarcodeGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }


        return result;
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
                p.Item,
                p.AttributeNames,
                p.Barcode
            };
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

    public async Task<string> GetBarcode(string Barcode)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "wh.ItemBarcode",
                    ColumnName = "Barcode",
                    Filter = $"Barcode={Barcode}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<MyResultPage<ItemBarcodeGetRecord>> GetRecordById(int id)
    {
        var result = new MyResultPage<ItemBarcodeGetRecord>
        {
            Data = new ItemBarcodeGetRecord()
        };
        using (var con = Connection)
        {
            var sQuery = "[wh].[Spc_ItemBarcode_GetRecord]";
            result.Data = await con.QueryFirstOrDefaultAsync<ItemBarcodeGetRecord>(sQuery, new
            {
                Id = id
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
                ColumnName = "(SELECT Name FROM wh.ItemBarcode WHERE Id = categoryId) AS Name",
                Filter = $"id={itemId} And companyid={companyId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<bool> ExistBarcode(string Barcode)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "wh.ItemBarcode",
                    ColumnName = "Barcode",
                    Filter = $"Barcode='{Barcode}' "
                }, commandType: CommandType.StoredProcedure);

            return string.IsNullOrEmpty(result);
        }
    }

    public async Task<bool> ExistBarcodeEdit(string Barcode, int Id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "wh.ItemBarcode",
                    ColumnName = "Barcode",
                    Filter = $"Barcode='{Barcode}' AND Id!={Id}"
                }, commandType: CommandType.StoredProcedure);

            return string.IsNullOrEmpty(result);
        }
    }

    public async Task<List<string>> ValidationBarcode(ItemBarcodeModel model)
    {
        var error = new List<string>();

        if (model.Barcode != "" && model.Barcode != null)
        {
            // بررسی تکراری نبودن  بارکد
            var checkDuplicateBarcode = await ExistBarcode(model);
            if (!checkDuplicateBarcode)
                error.Add(" بارکد وارد شده تکراری است");
        }

        return error;
    }

    public async Task<bool> ExistBarcode(ItemBarcodeModel model)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";

            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "wh.ItemBarcode",
                ColumnName = "Id",
                Filter = $"barcode='{model.Barcode}'  AND Id<>{model.Id}",
                OrderBy = ""
            }, commandType: CommandType.StoredProcedure);

            return result == 0;
        }
    }
}