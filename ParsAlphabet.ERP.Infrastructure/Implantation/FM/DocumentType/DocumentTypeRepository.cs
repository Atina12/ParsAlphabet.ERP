using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.FM.DocumentType;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.DocumentType;

public class DocumentTypeRepository :
    BaseRepository<DocumentTypeModel, int, string>,
    IBaseRepository<DocumentTypeModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;

    public DocumentTypeRepository(IConfiguration config, IHttpContextAccessor accessor)
        : base(config)
    {
        _accessor = accessor;
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
                    IsFilterParameter = true, FilterType = "number", Width = 8
                },
                new()
                {
                    Id = "name", Title = "نام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 15
                },
                new() { Id = "workflowCategoryName", Title = "دسته بندی جریان کار", IsDtParameter = true, Width = 15 },
                new()
                {
                    Id = "bySystem", Title = "سیستمی", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 6,
                    Align = "center"
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 6,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", IsDtParameter = true, Width = 50 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green",
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "bySystem", FieldValue = "true", Operator = "!=" } }
                },
                new()
                {
                    Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon",
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "bySystem", FieldValue = "true", Operator = "!=" } }
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
                p.WorkflowCategoryName,
                BySystem = p.BySystem ? "بلی" : "خیر",
                IsActive = p.IsActive ? "فعال" : "غیر فعال"
            };
        return result;
    }

    public async Task<MyResultPage<List<DocumentTypeGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<DocumentTypeGetPage>>();
        result.Data = new List<DocumentTypeGetPage>();

        if (model.Filters == null) model.Filters = new List<FormKeyValue>();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("name",
            model.Filters.Any(x => x.Name == "name")
                ? model.Filters.FirstOrDefault(x => x.Name == "name").Value
                : null);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "fm.Spc_DocumentType_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<DocumentTypeGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultQuery> Insert(DocumentTypeModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_DocumentType_InsUpd]";
            conn.Open();

            MyClaim.Init(_accessor);
            await conn.ExecuteAsync(sQuery, new
            {
                MyClaim.IsSecondLang,
                Opr = "Ins",
                Id = 0,
                model.Name,
                model.WorkflowCategoryId,
                model.IsActive
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = true;
        return result;
    }

    public async Task<MyResultQuery> Update(DocumentTypeModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_DocumentType_InsUpd]";
            conn.Open();

            MyClaim.Init(_accessor);

            await conn.ExecuteAsync(sQuery, new
            {
                MyClaim.IsSecondLang,
                Opr = "Upd",
                model.Id,
                model.Name,
                model.WorkflowCategoryId,
                model.IsActive
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = true;
        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(byte bySystem)
    {
        var filter = "";

        if (bySystem != 2) filter += $" BySystem={bySystem}";


        MyClaim.Init(_accessor);
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    TableName = "fm.DocumentType",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetDropDownBySystem()
    {
        MyClaim.Init(_accessor);
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    TableName = "fm.DocumentType"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetActiveDropDown()
    {
        MyClaim.Init(_accessor);
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    TableName = "fm.DocumentType",
                    Filter = "BySystem=0 AND IsActive=1"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetDropDownPostingGroup()
    {
        MyClaim.Init(_accessor);
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    TableName = "fm.DocumentType",
                    Filter = " Id NOT IN(1,2,3)"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }


    public async Task<List<MyDropDownViewModel>> GetDropDownByWorkflowCategoryId(byte workflowCategoryId)
    {
        MyClaim.Init(_accessor);
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    TableName = "fm.DocumentType",
                    Filter = $"WorkflowCategoryId={workflowCategoryId}"
                }, commandType: CommandType.StoredProcedure);
            return result.ToList();
        }
    }
}