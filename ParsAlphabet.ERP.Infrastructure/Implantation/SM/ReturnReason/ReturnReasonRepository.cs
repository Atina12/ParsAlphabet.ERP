using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.SM.ReturnReason;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.SM.ReturnReason;

public class ReturnReasonRepository :
    BaseRepository<ReturnReasonModel, int, string>,
    IBaseRepository<ReturnReasonModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;

    public ReturnReasonRepository(IConfiguration config, IHttpContextAccessor accessor)
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
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.TinyInt, Width = 7, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number"
                },
                new()
                {
                    Id = "name", Title = "علت مرجوعی", Type = (int)SqlDbType.NVarChar, Size = 50, Width = 25,
                    IsDtParameter = true, IsFilterParameter = true
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Align = "center", Type = (int)SqlDbType.Bit, Size = 1, Width = 10,
                    IsDtParameter = true
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, Width = 58, IsDtParameter = true }
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
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };

        return csvStream = await csvGenerator.GenerateCsv(Rows, Columns.Split(',').ToList());
    }

    public async Task<MyResultPage<List<ReturnReasonGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<ReturnReasonGetPage>>();
        result.Data = new List<ReturnReasonGetPage>();

        var parameters = new DynamicParameters();

        MyClaim.Init(_accessor);
        parameters.Add("IsSecondLang", MyClaim.IsSecondLang);

        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "name")
                ? model.Filters.FirstOrDefault(x => x.Name == "name").Value
                : null);

        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);


        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "sm.Spc_ReturnReason_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<ReturnReasonGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }
}