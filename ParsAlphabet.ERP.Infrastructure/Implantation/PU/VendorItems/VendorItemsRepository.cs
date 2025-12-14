using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.PU.VendorItems;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.PU.VendorItems;

public class VendorItemsRepository :
    BaseRepository<VendorItemsModel, int, string>,
    IBaseRepository<VendorItemsModel, int, string>
{
    public VendorItemsRepository(IConfiguration config)
        : base(config)
    {
        //_config = config;
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
                    IsFilterParameter = true, Width = 7
                },
                new()
                {
                    Id = "name", Title = "نام ", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 32
                },
                new()
                {
                    Id = "categoryDiAssign", Title = "دسته بندی کالا ", Type = (int)SqlDbType.NVarChar, Size = 100,
                    Width = 27, IsFilterParameter = true, FilterType = "select2", FilterTypeApi = ""
                },
                new()
                {
                    Id = "category", Title = "دسته بندی کالا ", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 27
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت ", Type = (int)SqlDbType.Bit, Size = 100, IsDtParameter = true,
                    Width = 10
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
                    IsFilterParameter = true, Width = 5
                },
                new()
                {
                    Id = "name", Title = "نام ", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 15
                },
                new()
                {
                    Id = "categoryAssign", Title = "دسته بندی کالا ", Type = (int)SqlDbType.NVarChar, Size = 100,
                    Width = 24, IsFilterParameter = true, FilterType = "select2", FilterTypeApi = ""
                },
                new()
                {
                    Id = "category", Title = "دسته بندی کالا ", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 24
                },
                new()
                {
                    Id = "createUser", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 14
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت ", Type = (int)SqlDbType.Bit, Size = 100, IsDtParameter = true,
                    Width = 8
                }
            }
        };

        return list;
    }

    public async Task<MyResultPage<VendorItemAssignList>> GetPageDiAssigns(GetPageViewModel model)
    {
        var result = new MyResultPage<VendorItemAssignList>();
        result.Data = new VendorItemAssignList();

        int? p_itemId = null;
        var p_idenTityId = Convert.ToInt32(model.Form_KeyValue[1]?.ToString());
        var p_ItemTypeId = Convert.ToInt32(model.Form_KeyValue[0]?.ToString());
        var p_NoSeriesId = Convert.ToInt16((model.Form_KeyValue[2])?.ToString());
        int? p_CategoryId = null;
        var p_itemName = string.Empty;

        switch (model.FieldItem)
        {
            case "name":
                p_itemName = model.FieldValue;
                break;
            case "id":
                p_itemId = Convert.ToInt32(model.FieldValue);
                break;
            case "categoryDiAssign":
                p_CategoryId = Convert.ToInt32(model.FieldValue);
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("IdentityId", p_idenTityId);
        parameters.Add("NoSeriesId", p_NoSeriesId);
        parameters.Add("ItemTypeId", p_ItemTypeId);
        parameters.Add("CategoryId", p_CategoryId);
        parameters.Add("ItemId", p_itemId);
        parameters.Add("ItemName", p_itemName == "" ? null : p_itemName);

        result.Columns = GetColumnsDiAssign();

        using (var conn = Connection)
        {
            var sQuery = "[pu].[Spc_VendorItems_DiAssign]";
            conn.Open();
            result.Data.Assigns =
                (await conn.QueryAsync<VendorItemsGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultPage<VendorItemAssignList>> GetPageAssign(GetPageViewModel model)
    {
        var result = new MyResultPage<VendorItemAssignList>();
        result.Data = new VendorItemAssignList();

        int? p_itemId = null;
        var p_identityId = Convert.ToInt32(model.Form_KeyValue[1]?.ToString());
        var p_ItemTypeId = Convert.ToInt32(model.Form_KeyValue[0]?.ToString());
        var p_NoSeriesId = Convert.ToInt32(model.Form_KeyValue[2]?.ToString());
        int? p_ItemCategoryId = null;
        var p_itemName = string.Empty;

        switch (model.FieldItem)
        {
            case "name":
                p_itemName = model.FieldValue;
                break;
            case "id":
                p_itemId = Convert.ToInt32(model.FieldValue);
                break;
            case "categoryAssign":
                p_ItemCategoryId = Convert.ToInt32(model.FieldValue);
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("IdentityId", p_identityId);
        parameters.Add("NoSeriesId", p_NoSeriesId);
        parameters.Add("ItemTypeId", p_ItemTypeId);
        parameters.Add("CategoryId", p_ItemCategoryId);
        parameters.Add("ItemId", p_itemId);
        parameters.Add("ItemName", p_itemName == "" ? null : p_itemName);

        result.Columns = GetColumnsAssign();

        using (var conn = Connection)
        {
            var sQuery = "[pu].[Spc_VendorItems_Assign]";
            conn.Open();
            result.Data.Assigns =
                (await conn.QueryAsync<VendorItemsGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultQuery> VendorItemAssign(VendorItemAssign model, int userId)
    {
        var result = new MyResultQuery();

        using (var conn = Connection)
        {
            var sQuery = "[pu].[Spc_VendorItems_InsUpd]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Ins",
                model.IdentityId,
                model.PersonGroupTypeId,
                model.ItemTypeId,
                model.NoSeriesId,
                ItemIds = JsonConvert.SerializeObject(model.Assign),
                IsActive = 1,
                CreateUserId = userId,
                CreateDateTime = DateTime.Now
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultQuery> VendorItemDiAssign(VendorItemAssign model, int userId)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "[pu].[Spc_VendorItems_InsUpd]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Del",
                model.IdentityId,
                model.PersonGroupTypeId,
                model.ItemTypeId,
                model.NoSeriesId,
                ItemIds = JsonConvert.SerializeObject(model.Assign),
                IsActive = 0,
                CreateUserId = userId,
                CreateDateTime = DateTime.Now
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultPage<VendorItemsGetRecord>> GetRecordById(int VendorId, int itemId)
    {
        var result = new MyResultPage<VendorItemsGetRecord>
        {
            Data = new VendorItemsGetRecord()
        };
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            conn.Open();
            result.Data = await conn.QueryFirstOrDefaultAsync<VendorItemsGetRecord>(sQuery, new
            {
                TableName = "pu.VendorItems",
                Filter = $"VendorId = {VendorId} and itemId={itemId}"
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Data != null;
        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetVendorItemList(int identityId, int itemTypeId, byte? itemId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pu].[Spc_VendorItem_GetList]";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    IdentityId = identityId,
                    ItemId = itemId,
                    ItemTypeId = itemTypeId
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }


    public async Task<bool> GetAssignVendorItemsId(int itemId, byte ItemTypeId, int HeaderAccountDetailId)
    {
        long existResult = 0;
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            existResult = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "pu.VendorItems",
                ColumnName = "IdentityId",
                Filter = $" ItemId={itemId} AND  ItemTypeId={ItemTypeId} AND IdentityId={HeaderAccountDetailId} "
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
        }

        return existResult > 0;
    }


    public async Task<bool> CheckExistVendorItemsId(int itemId)
    {
        var existResult = 0;
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            existResult = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "pu.VendorItems",
                ColumnName = "IdentityId",
                Filter = $" ItemId={itemId} "
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
        }

        return existResult > 0 ? true : false;
    }

    public async Task<List<GetlistItemVendorViewModel>> GetlistItemVendor(int itemId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pu].[Spc_VendorItems_ItemAssign]";
            conn.Open();

            var result = (await conn.QueryAsync<GetlistItemVendorViewModel>(sQuery,
                new
                {
                    itemId,
                    CompanyId = companyId
                }, commandType: CommandType.StoredProcedure)).ToList();

            conn.Close();

            return result;
        }
    }
}