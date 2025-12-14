using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.FM.CostCenterLine;
using ParsAlphabet.ERP.Application.Interfaces.FM;
using ParsAlphabet.ERP.Application.Interfaces.FM.CostCenterLine;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.CostCenterLine;

public class CostCenterLineRepository : ICostCenterLineRepository
{
    private readonly IConfiguration _config;
    private readonly IFinanceRepository _fm;

    public CostCenterLineRepository(IConfiguration config, IFinanceRepository fm)
    {
        _config = config;
        _fm = fm;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            IsEditable = false,
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.TinyInt, IsDtParameter = true,
                    IsFilterParameter = true, Width = 6
                },
                new()
                {
                    Id = "name", Title = "نام", IsPrimary = false, Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 35
                }
            }
        };

        return list;
    }

    public GetColumnsViewModel GetColumns2()
    {
        var list = new GetColumnsViewModel
        {
            IsEditable = true,
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.TinyInt, IsDtParameter = true,
                    IsFilterParameter = true, Width = 6
                },
                new()
                {
                    Id = "name", Title = "نام", IsPrimary = false, Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "costObject", Title = "موضوع/نوع (هزینه)", IsPrimary = false, Type = (int)SqlDbType.NVarChar,
                    Size = 50, IsDtParameter = true, Width = 20
                },
                new()
                {
                    Id = "stage", Title = "مرحله", IsPrimary = false, Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "allocationPercentage", Title = "درصد", IsPrimary = false, Type = (int)SqlDbType.NVarChar,
                    Size = 50, IsDtParameter = true, Width = 5
                },
                new() { Id = "costRelationId", IsPrimary = true },
                new() { Id = "stageId", IsPrimary = true },
                new() { Id = "allocationPercentage", IsPrimary = true }
            }
        };

        return list;
    }

    public virtual async Task<MyResultQuery> DeleteByCostCenterId(int id)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecordWithFilter";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery,
                new { TableName = "fm.CostCenterLine", Filter = $"HeaderId = {id}" },
                commandType: CommandType.StoredProcedure);
            result.ValidationErrors = new List<string>();
            conn.Close();
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultPage<CostCenterDAssignList>> GetCostCenterLineDiAssign(NewGetPageViewModel model)
    {
        var result = new MyResultPage<CostCenterDAssignList>
        {
            Data = new CostCenterDAssignList()
        };

        int? p_id = null;
        string p_entityName = null;

        switch (model.FieldItem)
        {
            case "id":
                p_id = Convert.ToInt32(model.FieldValue);
                break;
            case "name":
                p_entityName = model.FieldValue;
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("HeaderId", model.Form_KeyValue[0]?.ToString());
        parameters.Add("ItemTypeId", model.Form_KeyValue[1]?.ToString());
        parameters.Add("StageId", model.Form_KeyValue[2]?.ToString());
        parameters.Add("ItemCategoryId", p_id);
        parameters.Add("ItemCategoryName", p_entityName);
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_CostCenterLine_diAssign]";
            conn.Open();
            result.Data.Assigns =
                (await conn.QueryAsync<CostCenterLineDAssignGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultPage<CostCenterAssignList>> GetCostCenterLineAssign(NewGetPageViewModel model)
    {
        var result = new MyResultPage<CostCenterAssignList>
        {
            Data = new CostCenterAssignList()
        };

        int? p_id = null;
        string p_entityName = null;

        switch (model.FieldItem)
        {
            case "id":
                p_id = Convert.ToInt32(model.FieldValue);
                break;
            case "name":
                p_entityName = model.FieldValue;
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("HeaderId", model.Form_KeyValue[0]?.ToString());
        parameters.Add("ItemTypeId", model.Form_KeyValue[1]?.ToString());
        parameters.Add("StageId", model.Form_KeyValue[2]?.ToString());
        parameters.Add("ItemCategoryId", p_id);
        parameters.Add("ItemCategoryName", p_entityName);
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumns2();

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_CostCenterLine_Assign]";
            conn.Open();
            result.Data.Assigns =
                (await conn.QueryAsync<CostCenterLineAssignGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultQuery> CostCenterLineAssign(CostCenterLineAssign model)
    {
        var ItemCategoryIds = model.Assign.Select(a => a.Id).ToList();
        var result = new MyResultQuery();

        using (var conn = Connection)
        {
            var sQuery = "fm.Spc_CostCenterLine_InsDel";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Ins",
                model.HeaderId,
                model.CostRelationId,
                model.StageId,
                model.AllocationPercentage,
                ItemCategoryIds = string.Join(',', ItemCategoryIds),
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
        }


        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultQuery> CostCenterLineDiAssign(CostCenterLineAssign model)
    {
        var ItemCategoryIds = model.Assign.Select(a => a.Id).ToList();
        var result = new MyResultQuery();

        using (var conn = Connection)
        {
            var sQuery = "fm.Spc_CostCenterLine_InsDel";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Del",
                model.HeaderId,
                model.CostRelationId,
                model.StageId,
                model.AllocationPercentage,
                ItemCategoryIds = string.Join(',', ItemCategoryIds),
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }


    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                GetColumns2().DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };
        var getPage = await GetCostCenterLineAssign(model);
        result.Rows = from p in getPage.Data.Assigns
            select new
            {
                p.Id,
                p.Name,
                p.CostObjectName
            };
        return result;
    }
}