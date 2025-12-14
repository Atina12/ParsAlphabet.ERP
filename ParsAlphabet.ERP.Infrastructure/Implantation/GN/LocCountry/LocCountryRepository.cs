using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.GN.LocCountry;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.GN.LocCountry;

public class LocCountryRepository :
    BaseRepository<LocCountryModel, int, string>,
    IBaseRepository<LocCountryModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;

    public LocCountryRepository(IConfiguration config,
        IHttpContextAccessor accessor)
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
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.TinyInt, Width = 8, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number"
                },
                new()
                {
                    Id = "name", Title = "نام کشور", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 40
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 54 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" }
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
                p.Name
            };
        return result;
    }

    public async Task<MyResultPage<List<LocCountryGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<LocCountryGetPage>>();
        result.Data = new List<LocCountryGetPage>();

        MyClaim.Init(_accessor);

        var parameters = new DynamicParameters();
        parameters.Add("TableName", "gn.LocCountry");
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
            var sQuery = "[pb].[Spc_Tables_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<LocCountryGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        //totalRecord = parameters.Get<int>("TotalRecord");

        //if (result.Data.Count != 0 && model.PageRowsCount != 0)
        //{
        //    result.CurrentPage = model.PageNo;
        //    result.TotalRecordCount = totalRecord;
        //    if (result.TotalRecordCount % model.PageRowsCount == 0)
        //        result.MaxPageCount = Convert.ToInt32(result.TotalRecordCount / model.PageRowsCount);
        //    else
        //        result.MaxPageCount = Convert.ToInt32(result.TotalRecordCount / model.PageRowsCount) + 1;
        //    result.PageStartRow = ((model.PageNo - 1) * model.PageRowsCount) + 1;
        //    result.PageEndRow = result.PageStartRow + result.Data.Count - 1;
        //}
        return result;
    }

    public async Task<MyResultPage<LocCountryGetRecord>> GetRecordById(int id)
    {
        var result = new MyResultPage<LocCountryGetRecord>();
        result.Data = new LocCountryGetRecord();
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            result.Data = await conn.QueryFirstOrDefaultAsync<LocCountryGetRecord>(sQuery, new
            {
                TableName = "gn.LocCountry",
                Filter = $"Id={id}"
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<MyResultStatus> Delete(int keyvalue)
    {
        var result = new MyResultStatus();
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecord";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                TableName = "gn.LocCountry",
                RecordId = keyvalue
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "gn.LocCountry"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }
}