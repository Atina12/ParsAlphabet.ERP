using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.GN.CentralToken;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.GN.CentralToken;

public class CentralTokenRepository :
    BaseRepository<CentralTokenModel, int, string>,
    IBaseRepository<CentralTokenModel, int, string>
{
    public CentralTokenRepository(IConfiguration config) : base(config)
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


    public async Task<MyResultStatus> Insert(CentralTokenModel model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_CentalToken_Ins]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery,
                new
                {
                    model.TokenId,
                    model.CreateDateTime,
                    model.ExpirationDateTime
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = result.Status == 100;

            return result;
        }
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
}