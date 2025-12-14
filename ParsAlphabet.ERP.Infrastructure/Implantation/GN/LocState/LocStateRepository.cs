using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.GN.LocState;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.GN.LocState;

public class LocStateRepository :
    BaseRepository<LocStateModel, int, string>,
    IBaseRepository<LocStateModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;

    public LocStateRepository(IConfiguration config,
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
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 6, FilterType = "number"
                },
                new()
                {
                    Id = "name", Title = "نام ولایت", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
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

    public async Task<MyResultPage<List<LocStateGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<LocStateGetPage>>();
        result.Data = new List<LocStateGetPage>();


        MyClaim.Init(_accessor);

        var parameters = new DynamicParameters();
        parameters.Add("IsSecondLang", MyClaim.IsSecondLang);
        parameters.Add("TableName", "gn.LocState");
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "name")
                ? model.Filters.FirstOrDefault(x => x.Name == "name").Value
                : null);
        result.Columns = GetColumns();

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<LocStateGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        return result;
    }

    public async Task<MyResultPage<LocStateGetRecord>> GetRecordById(int id)
    {
        var result = new MyResultPage<LocStateGetRecord>();
        result.Data = new LocStateGetRecord();
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            result.Data = await conn.QueryFirstOrDefaultAsync<LocStateGetRecord>(sQuery, new
            {
                TableName = "gn.LocState",
                Filter = $"Id={id}"
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    //public async Task<MyResultQuery> Insert(LocStateModel model)
    //{
    //    MyResultQuery result = new MyResultQuery();
    //    using (IDbConnection conn = Connection)
    //    {
    //        string sQuery = "pb.Spc_Tables_InsUpd";
    //        conn.Open();
    //        await conn.ExecuteAsync(sQuery, new
    //        {
    //            TableName = "gn.LocState",
    //            Opr = "Ins",
    //            Id = 0,
    //            model.Name,
    //        }, commandType: CommandType.StoredProcedure);
    //    }
    //    result.Successfull = true;
    //    return result;
    //}

    //public async Task<MyResultQuery> Update(LocStateModel model)
    //{
    //    MyResultQuery result = new MyResultQuery();
    //    using (IDbConnection conn = Connection)
    //    {
    //        string sQuery = "pb.Spc_Tables_InsUpd";
    //        conn.Open();
    //        await conn.ExecuteAsync(sQuery, new
    //        {
    //            TableName = "gn.LocState",
    //            Opr = "Upd",
    //            model.Id,
    //            model.Name,
    //        }, commandType: CommandType.StoredProcedure);
    //    }
    //    result.Successfull = true;
    //    return result;
    //}

    public async Task<MyResultStatus> Delete(int keyvalue)
    {
        var result = new MyResultStatus();
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecord";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                TableName = "gn.LocState",
                RecordId = keyvalue
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(string term)
    {
        var filter = string.Empty;

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "gn.LocState",
                    IdColumnName = "",
                    TitleColumnName = "Name",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }
}