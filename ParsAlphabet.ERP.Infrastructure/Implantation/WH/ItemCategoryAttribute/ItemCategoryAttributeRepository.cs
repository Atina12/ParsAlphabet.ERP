using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.WH.ItemCategoryAttribute;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemCategoryAttribute;

public class ItemCategoryAttributeRepository :
    BaseRepository<ItemCategoryAttributeModel, int, string>,
    IBaseRepository<ItemCategoryAttributeModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;

    public ItemCategoryAttributeRepository(IConfiguration config, IHttpContextAccessor accessor)
        : base(config)
    {
        _accessor = accessor;
    }


    public async Task<IEnumerable<object>> GetListBaseItemAttribute(string itemCategoryIds, int companyId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("ItemCategoryIds", itemCategoryIds);
        //parameters.Add("ItemCategoryIds", itemCategoryIds == "null" ? 0 : Int32.Parse(itemCategoryIds));
        parameters.Add("CompanyId", companyId);
        //parameters.Add("Status", dbType: DbType.Int32, direction: ParameterDirection.Output);
        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_BaseItemAttribute_GetList]";
            var result = await conn.QueryAsync<object>(sQuery, parameters, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<MyResultPage<List<ItemAttributeList>>> GetListItemAttributeLine(int id, int companyId)
    {
        var result = new MyResultPage<List<ItemAttributeList>>
        {
            Data = new List<ItemAttributeList>()
        };

        var parameters = new DynamicParameters();
        parameters.Add("ItemCategoryId", id);
        parameters.Add("CompanyId", companyId);

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_ItemAttributeLine_GetList]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<ItemAttributeList>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
            conn.Close();
        }


        return result;
    }


    public async Task<MyResultQuery> ItemCategoryAttributeLineSave(ItemCategoryAttributeAssign model, int CreateUserId)
    {
        var result = new MyResultQuery();

        var validateResult = "";
        validateResult = await ValidationItemCategoryAttributeLine(model);
        if (validateResult.Length > 0)
        {
            result.Successfull = false;
            result.StatusMessage = validateResult;
            return result;
        }

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_ItemCategoryAttributes_InsUpd]";
            conn.Open();
            var outPut = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                Opr = "Ins",
                model.ItemCategoryId,
                model.ItemAttributeLineIds,
                CreateUserId,
                CreateDateTime = DateTime.Now
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            result.Id = outPut;
            result.Successfull = outPut > 0 ? true : false;
            result.Status = outPut > 0 ? 100 : -99;
            result.StatusMessage = "عملیات ثبت  با موفقیت انجام پذیرفت";
        }

        return result;
    }

    public async Task<string> ValidationItemCategoryAttributeLine(ItemCategoryAttributeAssign model)
    {
        var error = "";
        if (model == null)
        {
            error = "درخواست معتبر نمی باشد";
            return error;
        }

        await Task.Run(async () =>
        {
            var existItem = await ExistByItemCategoryAttributeLineId(model);
            if (existItem) error = "این صفت/ویژگی برای دسته بندی فوق قبلا ثبت شده است، مجاز به ثبت تکراری نیستید";
        });

        return error;
    }

    public async Task<bool> ExistByItemCategoryAttributeLineId(ItemCategoryAttributeAssign model)
    {
        long existResult = 0;

        var filter = "1=1";

        filter =
            $"ItemCategoryId = N'{model.ItemCategoryId}'  AND ItemAttributeLineIds in ('{model.ItemAttributeLineIds}') ";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();

            existResult = await conn.ExecuteScalarAsync<long>(sQuery, new
            {
                TableName = "wh.ItemCategoryAttribute",
                ColumnName = "Id",
                Filter = filter,
                OrderBy = ""
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
        }

        return existResult > 0;
    }

    public async Task<MyResultQuery> ItemCategoryAttributeLineDelete(ItemCategoryAttributeAssign model,
        int CreateUserId)
    {
        var result = new MyResultQuery();
        var validationDelete = await CheckExist_Attribute(model.ItemCategoryId, model.ItemAttributeLineIds, 1);
        if (validationDelete > 0)
        {
            result.Successfull = false;
            result.StatusMessage = "ویژگی استفاده شده است، مجاز به حذف نیستید";
        }
        else
        {
            using (var conn = Connection)
            {
                var sQuery = "[wh].[Spc_ItemCategoryAttributes_InsUpd]";
                conn.Open();
                result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
                {
                    Opr = "Del",
                    model.ItemCategoryId,
                    model.ItemAttributeLineIds,
                    CreateUserId,
                    CreateDateTime = DateTime.Now
                }, commandType: CommandType.StoredProcedure);
                conn.Close();
            }

            result.Successfull = result.Status == 100;
        }

        return result;
    }

    public async Task<int> CheckExist_ItemCategoryAttributeLine(int id)
    {
        var resultCheckExist = 0;
        using (var conn = Connection)
        {
            var sQuery = "[pu].[Spc_CheckExist_PurchaseOrder_ItemAttribute]";
            resultCheckExist = await conn.QueryFirstOrDefaultAsync<int>(sQuery, new
            {
                Id = id
            }, commandType: CommandType.StoredProcedure);
        }

        return resultCheckExist;
    }

    public async Task<int> CheckExist_Attribute(int? id, string attribute, byte type)
    {
        var resultCheckExist = 0;
        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_CheckExist_Attribute]";
            resultCheckExist = await conn.QueryFirstOrDefaultAsync<int>(sQuery, new
            {
                AttributeId = attribute,
                CategoryId = id,
                Type = type
            }, commandType: CommandType.StoredProcedure);
        }

        return resultCheckExist;
    }
}