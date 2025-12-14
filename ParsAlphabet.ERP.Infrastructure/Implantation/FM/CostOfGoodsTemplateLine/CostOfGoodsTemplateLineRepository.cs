using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.FM.CostOfGoodsTemplateLine;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.CostOfGoodsTemplateLine;

public class CostOfGoodsTemplateLineRepository :
    BaseRepository<CostOfGoodsTemplateLineModel, int, string>,
    IBaseRepository<CostOfGoodsTemplateLineModel, int, string>
{
    public CostOfGoodsTemplateLineRepository(IConfiguration config) : base(config)
    {
    }

    public async Task<List<CostOfGoodsTemplateLineGetPage>> GetPage(int headerId)
    {
        var parameters = new DynamicParameters();
        parameters.Add("HeaderId", headerId);

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_CostOfGoodsTemplateLine_GetPage]";
            conn.Open();
            var result =
                (await conn.QueryAsync<CostOfGoodsTemplateLineGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<CostOfGoodsTemplateLineGetRecord> GetRecordById(int Id)
    {
        using (var conn = Connection)
        {
            conn.Open();
            var sQuery = "[fm].[Spc_CostOfGoodsTemplateLine_GetRecord]";
            var result = await conn.QueryFirstOrDefaultAsync<CostOfGoodsTemplateLineGetRecord>(sQuery, new
            {
                Id
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<MyResultStatus> Insert(CostOfGoodsTemplateLineModel model)
    {
        var result = new MyResultStatus();
        string validateResult;
        validateResult = await Validate(model);

        if (validateResult.Length > 0)
        {
            result.Successfull = false;
            result.StatusMessage = validateResult;
            return result;
        }

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_CostOfGoodsTemplateLine_InsUpd]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.Opr,
                model.Id,
                model.HeaderId,
                model.ItemCategoryId,
                model.ItemTypeId,
                model.CostObjectId,
                model.IsAllocated
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultQuery> Delete(int id)
    {
        var result = new MyResultQuery();

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecordWithFilter";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                TableName = "fm.CostOfGoodsTemplateLine",
                Filter = $"Id = {id}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<List<CostRelationDropDown>> GetCostRelationDropDown(byte? isActive = 1, byte? itemtypeId = 0)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_CostRelation_GetList]";
            conn.Open();
            var result = (await conn.QueryAsync<CostRelationDropDown>(sQuery,
                new
                {
                    isActive,
                    ItemTypeId = itemtypeId
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }


    public async Task<List<MyDropDownViewModel>> GetCostItemTypeDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "gn.ItemType",
                    TitleColumnName = "Name",
                    Filter = "Id IN(SELECT cr.ItemTypeId FROM fm.CostRelation cr)"
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetCostObjectDropDown(byte itemtypeId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fm.CostObject",
                    TitleColumnName = "Name",
                    Filter = $"Id IN(SELECT cr.CostObjectId FROM fm.CostRelation cr where  ItemTypeId={itemtypeId})"
                }, commandType: CommandType.StoredProcedure)).ToList();

            conn.Close();
            return result;
        }
    }


    public async Task<int> GetAllocatName(CostobjectAllocateModel model)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "fm.CostRelation",
                    ColumnName = "IsAllocated",
                    Filter = $"itemTypeId={model.ItemTypeId} AND CostObjectId={model.CostRelationId}"
                }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<int> GetItemTypeIdByCategoryId(short? categoryIdl, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "[wh].[ItemCategory]",
                    ColumnName = "ItemTypeId",
                    Filter = $" Id={categoryIdl} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetitemCategoryDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "wh.ItemCategory",
                    IdColumnName = "Id",
                    TitleColumnName = "Name"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }


    public async Task<string> Validate(CostOfGoodsTemplateLineModel model)
    {
        var error = "";
        if (model == null)
        {
            error = "درخواست معتبر نمی باشد";
            return error;
        }

        await Task.Run(async () =>
        {
            var existItem = await ExistItemId(model);
            if (existItem)
                error = $" آیتم با دسته بندی: {model.ItemCategoryId} قبلا ثبت شده است، مجاز به ثبت تکراری نیستید";
        });
        return error;
    }


    public async Task<bool> ExistItemId(CostOfGoodsTemplateLineModel model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<bool>(sQuery, new
            {
                TableName = "fm.CostOfGoodsTemplateLine",
                ColumnName = "Id",
                Filter = $"HeaderId={model.HeaderId} AND ItemCategoryId={model.ItemCategoryId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }
}