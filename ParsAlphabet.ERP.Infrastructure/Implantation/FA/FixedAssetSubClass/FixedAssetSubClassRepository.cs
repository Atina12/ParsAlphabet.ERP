using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.FA.FixedAssetSubClass;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FA.FixedAssetSubClass;

public class FixedAssetSubClassRepository :
    BaseRepository<FixedAssetSubClassModel, int, string>,
    IBaseRepository<FixedAssetSubClassModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;

    public FixedAssetSubClassRepository(IConfiguration config, IHttpContextAccessor accessor)
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
                    IsFilterParameter = true, Width = 6, FilterType = "number"
                },
                new()
                {
                    Id = "name", Title = "نام طبقه بندی فرعی", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 20
                },
                new()
                {
                    Id = "fixedAssetClassId", Title = "شناسه طبقه بندی", Type = (int)SqlDbType.Int,
                    IsDtParameter = true, IsFilterParameter = false, Width = 6
                },
                new()
                {
                    Id = "fixedAssetClassName", Title = "نام طبقه بندی", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 20
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 9 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" }
            }
        };

        return list;
    }

    public async Task<MemoryStream> CSV(NewGetPageViewModel model)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var Columns = string.Join(',',
            GetColumns().DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title));
        var getPage = await GetPage(model);

        var Rows = from p in getPage.Data
            select new
            {
                p.Id,
                p.Name,
                p.FixedAssetClassId,
                p.FixedAssetClassName
            };

        return csvStream = await csvGenerator.GenerateCsv(Rows, Columns.Split(',').ToList());
    }

    public async Task<MyResultPage<List<FixedAssetSubClassGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<FixedAssetSubClassGetPage>>();
        result.Data = new List<FixedAssetSubClassGetPage>();

        var parameters = new DynamicParameters();

        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "name")
                ? model.Filters.FirstOrDefault(x => x.Name == "name").Value
                : null);
        parameters.Add("FixedAssetClassName",
            model.Filters.Any(x => x.Name == "fixedAssetClassName")
                ? model.Filters.FirstOrDefault(x => x.Name == "fixedAssetClassName").Value
                : null);


        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "fa.Spc_FixedAssetSubClass_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<FixedAssetSubClassGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<int> GetFixedAssetClassId(int fixedAssetClassId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<short>(sQuery,
                new
                {
                    TableName = "fa.FixedAssetSubClass",
                    ColumnName = "FixedAssetClassId",
                    Filter = $"Id={fixedAssetClassId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<string> GetSubClassName(short id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "fa.FixedAssetSubClass",
                    ColumnName = "Name",
                    Filter = $"Id={id}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> SubClassId_GetDropDown(short fixedAssetClassId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fa.FixedAssetSubClass",
                    Filter = $"FixedAssetClassId={fixedAssetClassId}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }
}