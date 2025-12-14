using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.FM.CostOfGoodsTemplate;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.CostOfGoodsTemplate;

public class CostOfGoodsTemplateRepository :
    BaseRepository<CostOfGoodsTemplateModel, int, string>,
    IBaseRepository<CostOfGoodsTemplateModel, int, string>
{
    public CostOfGoodsTemplateRepository(IConfiguration config) : base(config)
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
                    Id = "costOfGoodsTemplateId", Title = "شناسه", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = true, Width = 15, IsPrimary = true, IsFilterParameter = true, FilterType = "number"
                },
                new()
                {
                    Id = "costOfGoodsTemplateName", Title = "عنوان", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15, IsPrimary = true, IsFilterParameter = true
                },
                new() { Id = "stageId", IsPrimary = true },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 15, IsPrimary = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/FM/CostOfGoodsTemplateApi/getstagedropdown"
                },
                new() { Id = "costDriverId", IsPrimary = true },
                new()
                {
                    Id = "costDriver", Title = "محرک هزینه", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15, IsPrimary = true, IsFilterParameter = true,
                    FilterType = "select2", FilterTypeApi = "/api/FM/CostOfGoodsTemplateApi/getcostdriverdropdown"
                },
                new()
                {
                    Id = "description", Title = "توضیحات", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15, IsPrimary = true
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 50, IsDtParameter = true,
                    Width = 15, IsPrimary = true
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 54 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" },
                new() { Name = "sep1", Title = "", ClassName = "", IconName = "", IsSeparator = true },
                new() { Name = "additem", Title = "تخصیص متغیر", ClassName = "", IconName = "fas fa-plus color-blue" }
            }
        };

        return list;
    }

    public async Task<MyResultPage<List<CostOfGoodsTemplateGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<CostOfGoodsTemplateGetPage>>
        {
            Data = new List<CostOfGoodsTemplateGetPage>()
        };


        if (model.Filters == null) model.Filters = new List<FormKeyValue>();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "costOfGoodsTemplateId")
                ? model.Filters.FirstOrDefault(x => x.Name == "costOfGoodsTemplateId").Value
                : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "costOfGoodsTemplateName")
                ? model.Filters.FirstOrDefault(x => x.Name == "costOfGoodsTemplateName").Value
                : null);
        parameters.Add("StageId",
            model.Filters.Any(x => x.Name == "stage")
                ? model.Filters.FirstOrDefault(x => x.Name == "stage").Value
                : null);
        parameters.Add("CostDriverId",
            model.Filters.Any(x => x.Name == "costDriver")
                ? model.Filters.FirstOrDefault(x => x.Name == "costDriver").Value
                : null);
        parameters.Add("CompanyId", model.CompanyId);


        result.Columns = GetColumns();


        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_CostOfGoodsTemplate_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<CostOfGoodsTemplateGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model)
    {
        //var formType = model.Form_KeyValue[0]?.ToString().ToString();

        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                GetColumns().DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };
        var getPage = await GetPage(model);
        result.Rows = from p in getPage.Data
            select new
            {
                p.CostOfGoodsTemplateId,
                p.CostOfGoodsTemplateName,
                p.StageName,
                p.CostDriverName,
                p.Description,
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };
        return result;
    }

    public async Task<CostOfGoodsTemplateGetRecord> GetRecordById(int Id)
    {
        using (var conn = Connection)
        {
            conn.Open();
            var sQuery = "pb.Spc_Tables_GetRecord";
            var result = await conn.QueryFirstOrDefaultAsync<CostOfGoodsTemplateGetRecord>(sQuery, new
            {
                TableName = "fm.CostOfGoodsTemplate",
                Filter = $"Id={Id}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<MyResultStatus> Insert(CostOfGoodsTemplateModel model)
    {
        #region validation

        var validationError = await Validation(model, model.CompanyId);

        if (validationError.Count > 0)
            return new MyResultStatus
            {
                Status = -98,
                Successfull = false,
                ValidationErrors = validationError
            };

        #endregion

        var result = new MyResultStatus();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_CostOfGoodsTemplate_InsUpd]";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                model.Opr,
                model.Id,
                model.Name,
                model.StageId,
                model.CostDriverId,
                model.IsActive,
                model.Description,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = true;

        return result;
    }

    public async Task<List<string>> Validation(CostOfGoodsTemplateModel model, int CompanyId)
    {
        var error = new List<string>();

        var checkingResult = await ExistByStageId(model, CompanyId);

        if (checkingResult)
            error.Add(" مجاز به ثبت مبانی با مرحله تکراری نمی باشید ");

        return error;
    }

    public async Task<bool> ExistByStageId(CostOfGoodsTemplateModel model, int CompanyId)
    {
        var filter = "";
        if (model.Id == 0)
            filter = $" StageId ={model.StageId} AND CompanyId={CompanyId}";
        else
            filter = $" StageId ={model.StageId} AND CompanyId={CompanyId} AND Id<>{model.Id} ";


        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";

            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "fm.CostOfGoodsTemplate ",
                ColumnName = "Id",
                Filter = filter,
                OrderBy = ""
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
            return result > 0;
        }
    }

    public async Task<MyResultQuery> Delete(int id, int companyId)
    {
        var result = new MyResultQuery();

        var resultDeleteLine = await DeleteLine(id);

        if (!resultDeleteLine.Successfull)
            return resultDeleteLine;


        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecordWithFilter";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                TableName = "fm.CostOfGoodsTemplate",
                Filter = $"Id = {id} AND CompanyId = {companyId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultQuery> DeleteLine(int id)
    {
        var result = new MyResultQuery();

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecordWithFilter";

            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                TableName = "fm.CostOfGoodsTemplateLine",
                Filter = $"HeaderId={id}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
        }

        result.Successfull = result.Status == 100;

        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetCostDriverDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fm.CostDriver",
                    IdColumnName = "Id",
                    TitleColumnName = "Name",
                    Filter = "WorkflowCategoryId=1"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetStageDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "wf.Stage",
                    IdColumnName = "Id",
                    TitleColumnName = "Name",
                    Filter = "WorkflowCategoryId=1 and StageClassId=1"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }
}