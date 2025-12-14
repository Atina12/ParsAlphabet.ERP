using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.WH.Item_WarehouseLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.Warehouse;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WH.Item_WarehouseLine;

public class Item_WarehouseLineRepository :
    BaseRepository<Item_WarehouseLineModel, int, string>,
    IBaseRepository<Item_WarehouseLineModel, int, string>
{
    private WarehouseRepository _warehouseRepository;

    public Item_WarehouseLineRepository(IConfiguration config, WarehouseRepository warehouseRepository)
        : base(config)
    {
        _warehouseRepository = warehouseRepository;
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
                    IsFilterParameter = true, Width = 6
                },
                new()
                {
                    Id = "name", Title = "نام ", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 27
                },
                new()
                {
                    Id = "itemTypeDiAssign", Title = "نوع آیتم ", Type = (int)SqlDbType.NVarChar, Size = 100, Width = 27
                },
                new()
                {
                    Id = "itemType", Title = "نوع آیتم ", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 27
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
                    IsFilterParameter = true, Width = 6
                },
                new()
                {
                    Id = "name", Title = "نام ", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 30
                },
                new()
                {
                    Id = "itemTypeAssign", Title = "نوع آیتم ", Type = (int)SqlDbType.NVarChar, Size = 100, Width = 15
                },
                new()
                {
                    Id = "itemType", Title = "نوع آیتم ", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 13
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
                },
                new()
                {
                    Id = "userFullName", Title = "کابر ثبت کننده ", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 14
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت  ", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 10
                },
                new() { Id = "zoneId", Title = "بخش ", IsPrimary = true },
                new() { Id = "binId", Title = "پالت ", IsPrimary = true }
            }
        };

        return list;
    }

    public async Task<MyResultPage<WarehouseItemLineAssignList>> GetPageDiAssigns(NewGetPageViewModel model)
    {
        var result = new MyResultPage<WarehouseItemLineAssignList>();
        result.Data = new WarehouseItemLineAssignList();

        int? p_itemId = null;
        var p_warehouseId = Convert.ToInt32(model.Form_KeyValue[0]?.ToString());
        int? p_itemTypeId = Convert.ToInt32(model.Form_KeyValue[1]?.ToString());
        int? p_zoneId = Convert.ToInt32(model.Form_KeyValue[2]?.ToString());
        int? p_binId = Convert.ToInt32(model.Form_KeyValue[3]?.ToString());
        string p_userFullName = null;

        switch (model.FieldItem)
        {
            case "name":
                p_userFullName = model.FieldValue != null ? model.FieldValue : null;
                break;
            case "id":
                p_itemId = Convert.ToInt32(model.FieldValue);
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("WarehouseId", p_warehouseId);
        parameters.Add("ZoneId", p_zoneId == 0 ? null : p_zoneId);
        parameters.Add("BinId", p_binId == 0 ? null : p_binId);
        parameters.Add("ItemId", p_itemId);
        parameters.Add("ItemName", p_userFullName ?? null);
        parameters.Add("ItemTypeId", p_itemTypeId);
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumnsDiAssign();

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_Item_Warehouse_DiAssign]";
            conn.Open();
            result.Data.Assigns =
                (await conn.QueryAsync<WarehouseItemLineGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultPage<WarehouseItemLineAssignList>> GetPageAssign(NewGetPageViewModel model)
    {
        var result = new MyResultPage<WarehouseItemLineAssignList>();
        result.Data = new WarehouseItemLineAssignList();
        int? p_itemId = null;
        var p_warehouseId = Convert.ToInt32(model.Form_KeyValue[0]?.ToString());
        int? p_itemTypeId = Convert.ToInt32(model.Form_KeyValue[1]?.ToString());
        int? p_zoneId = Convert.ToInt32(model.Form_KeyValue[2]?.ToString());
        int? p_binId = Convert.ToInt32(model.Form_KeyValue[3]?.ToString());
        string p_itemName = null;

        switch (model.FieldItem)
        {
            case "name":
                p_itemName = model.FieldValue;
                break;
            case "id":
                p_itemId = Convert.ToInt32(model.FieldValue);
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("WarehouseId", p_warehouseId);
        parameters.Add("ItemId", p_itemId);
        parameters.Add("ItemName", p_itemName ?? null);
        parameters.Add("ItemTypeId", p_itemTypeId);
        parameters.Add("ZoneId", p_zoneId == 0 ? null : p_zoneId);
        parameters.Add("BinId", p_binId == 0 ? null : p_binId);
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumnsAssign();

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_Item_Warehouse_Assign]";
            conn.Open();
            result.Data.Assigns =
                (await conn.QueryAsync<WarehouseItemLineGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultStatus> WarehouseItemAssign(WarehouseItemLineAssign model)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_Item_Warehouse_Save]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                Opr = "Ins",
                ItemIds = string.Join(",", model.Assign.Select(a => a.Id).ToList()),
                model.WarehouseId,
                model.ItemtypeId,
                model.ZoneId,
                model.BinId,
                model.CreateUserId,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultQuery> WarehouseItemDiAssign(WarehouseItemLineAssign model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_Item_Warehouse_Save]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Del",
                ItemIds = string.Join(",", model.Assign.Select(a => a.Id).ToList()),
                model.WarehouseId,
                model.ItemtypeId,
                model.ZoneId,
                model.BinId,
                model.CreateUserId,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultPage<WarehouseItemLineGetRecord>> GetRecordById(int warehouseId, int userId)
    {
        var result = new MyResultPage<WarehouseItemLineGetRecord>
        {
            Data = new WarehouseItemLineGetRecord()
        };
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            conn.Open();
            result.Data = await conn.QueryFirstOrDefaultAsync<WarehouseItemLineGetRecord>(sQuery, new
            {
                TableName = "wh.Item_Warehouse",
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
                p.Name,
                p.ItemType,
                p.ZoneIdName,
                p.BinIdName,
                p.UserFullName,
                p.CreateDateTimePersian
            };
        return result;
    }
}