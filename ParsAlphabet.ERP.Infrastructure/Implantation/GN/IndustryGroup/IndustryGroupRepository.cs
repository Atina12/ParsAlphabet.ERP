using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.GN.IndustryGroup;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.GN.IndustryGroup;

public class IndustryGroupRepository :
    BaseRepository<IndustryGroupModel, int, string>,
    IBaseRepository<IndustryGroupModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;

    public IndustryGroupRepository(IConfiguration config, IHttpContextAccessor accessor)
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
                    IsFilterParameter = true, Width = 5, FilterType = "number"
                },
                new()
                {
                    Id = "name", Title = "نام ", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 25
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 10,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 60 }
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
                p.IsActive
            };

        return csvStream = await csvGenerator.GenerateCsv(Rows, Columns.Split(',').ToList());
    }


    public async Task<MyResultPage<List<IndustryGroupGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<IndustryGroupGetPage>>
        {
            Data = new List<IndustryGroupGetPage>()
        };

        var parameters = new DynamicParameters();

        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "name")
                ? model.Filters.FirstOrDefault(x => x.Name == "name").Value
                : null);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_IndustryGroup_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<IndustryGroupGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<string> GetItemName(short? id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "gn.IndustryGroup",
                    ColumnName = "Name",
                    Filter = $"Id={id}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }
}