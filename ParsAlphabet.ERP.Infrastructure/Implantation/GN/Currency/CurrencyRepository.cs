using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.GN.Currency;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.GN.Currency;

public class CurrencyRepository :
    BaseRepository<CurrencyModel, int, string>,
    IBaseRepository<CurrencyModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;

    public CurrencyRepository(IConfiguration config,
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
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.TinyInt, Width = 6, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number"
                },
                new()
                {
                    Id = "name", Title = "نام", Type = (int)SqlDbType.NVarChar, Size = 30, Width = 40,
                    IsDtParameter = true, IsFilterParameter = true
                },
                new()
                {
                    Id = "quantityRounding", Title = "تعداد رندینگ", Type = (int)SqlDbType.Int, Size = 30, Width = 10,
                    IsDtParameter = true, IsFilterParameter = true
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 5,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 54 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" }
                //new GetActionColumnViewModel{Name="delete",Title="حذف",ClassName="",IconName="fa fa-trash color-maroon"}
            }
        };

        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(GetPageViewModel model)
    {
        model.PageNo = 0;
        model.PageRowsCount = 100;
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
                p.QuantityRounding
            };
        return result;
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(string filter = "")
    {
        using (var conn = Connection)
        {
            var result = new List<MyDropDownViewModel>();
            conn.Open();
            result = (await conn.QueryAsync<MyDropDownViewModel>("pb.Spc_Tables_GetList",
                new { TableName = "gn.Currency", Filter = filter }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<MyResultPage<List<CurrencyGetPage>>> GetPage(GetPageViewModel model)
    {
        var result = new MyResultPage<List<CurrencyGetPage>>();
        result.Data = new List<CurrencyGetPage>();
        model.PageNo = 0;
        model.PageRowsCount = 100;
        MyClaim.Init(_accessor);

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
            var sQuery = "gn.Spc_Currency_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<CurrencyGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        return result;
    }

    public async Task<MyResultPage<CurrencyGetRecord>> GetRecordById(int id)
    {
        var result = new MyResultPage<CurrencyGetRecord>();
        result.Data = new CurrencyGetRecord();
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            conn.Open();
            result.Data = await conn.QueryFirstOrDefaultAsync<CurrencyGetRecord>(sQuery, new
            {
                TableName = "gn.Currency",
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
                TableName = "gn.Currency",
                RecordId = keyvalue
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<string> GetName(byte id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<string>(sQuery, new
            {
                TableName = "gn.Currency",
                ColumnName = "Name",
                Filter = $"Id={id}"
            }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }

    public async Task<MyResultStatus> Insert(CurrencyModel model)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_Currency_InsUpd]";
            conn.Open();

            var outPut = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                Opr = model.Id == 0 ? "Ins" : "Upd",
                model.Id,
                model.Name,
                model.QuantityRounding
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = outPut > 0 ? true : false;
            result.Status = outPut > 0 ? 100 : -99;
            result.StatusMessage = "عملیات با موفقیت انجام پذیرفت";
        }

        return result;
    }

    public async Task<MyResultStatus> Update(CurrencyModel model)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_Currency_InsUpd]";
            conn.Open();

            var outPut = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                Opr = model.Id == 0 ? "Ins" : "Upd",
                model.Id,
                model.Name,
                model.QuantityRounding,
                model.IsActive
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = outPut > 0 ? true : false;
            result.Status = outPut > 0 ? 100 : -99;
            result.StatusMessage = "عملیات با موفقیت انجام پذیرفت";
        }

        return result;
    }


    public async Task<byte> GetNumOfRud(int currencyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<byte>(sQuery, new
            {
                TableName = "gn.Currency",
                ColumnName = "QuantityRounding",
                Filter = $"Id={currencyId}"
            }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }

    public async Task<int> GetCurencyhCount(int CompanyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "gn.currency",
                    ColumnName = "Count(Id)",
                    Filter = "IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }
}