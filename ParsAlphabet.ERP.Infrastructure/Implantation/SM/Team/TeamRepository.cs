using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.SM.Team;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.SM.Team;

public class TeamRepository :
    BaseRepository<TeamModel, int, string>,
    IBaseRepository<TeamModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;

    public TeamRepository(IConfiguration config, IHttpContextAccessor accessor)
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
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.SmallInt, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 6
                },
                new()
                {
                    Id = "name", Title = "نام", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "commissionBaseName", Title = "مبنای محاسبه کمیسیون", Type = (int)SqlDbType.NVarChar,
                    Size = 50, IsDtParameter = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "commissionMethodName", Title = "روش محاسبه کمیسیون", Type = (int)SqlDbType.NVarChar,
                    Size = 50, IsDtParameter = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 6,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" },
                new() { Name = "sep1", Title = "", ClassName = "", IconName = "", IsSeparator = true },
                new() { Name = "teamSalesPerson", Title = "تخصیص تیم", ClassName = "btn blue_outline_1", IconName = "" }
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
                p.CommissionBaseName,
                p.CommissionMethodName,
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };

        return csvStream = await csvGenerator.GenerateCsv(Rows, Columns.Split(',').ToList());
    }

    public async Task<MyResultPage<List<TeamGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<TeamGetPage>>();
        result.Data = new List<TeamGetPage>();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "name")
                ? model.Filters.FirstOrDefault(x => x.Name == "name").Value
                : null);
        parameters.Add("CommissionBaseName",
            model.Filters.Any(x => x.Name == "commissionBaseName")
                ? model.Filters.FirstOrDefault(x => x.Name == "commissionBaseName").Value
                : null);
        parameters.Add("CommissionMethodName",
            model.Filters.Any(x => x.Name == "commissionMethodName")
                ? model.Filters.FirstOrDefault(x => x.Name == "commissionMethodName").Value
                : null);
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "sm.Spc_Team_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<TeamGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        return result;
    }
}