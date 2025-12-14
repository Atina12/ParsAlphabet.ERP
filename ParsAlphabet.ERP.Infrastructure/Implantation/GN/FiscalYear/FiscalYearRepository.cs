using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.GN.FiscalYear;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYear;

public class FiscalYearRepository :
    BaseRepository<FiscalYearModel, int, string>,
    IBaseRepository<FiscalYearModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;

    public FiscalYearRepository(IConfiguration config,
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
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.TinyInt, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 5
                },
                new()
                {
                    Id = "name", Title = "نام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 16
                },
                new()
                {
                    Id = "startDatePersian", Title = "تاریخ شروع ", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "endDatePersian", Title = "تاریخ پایان", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new() { Id = "closed", Title = "بستن", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 7 },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 20 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "sep1", Title = "", ClassName = "", IconName = "", IsSeparator = true },
                new()
                {
                    Name = "fiscalyearline", Title = "ماه‌های دوره مالی", ClassName = "btn blue_outline_1",
                    IconName = ""
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
                p.StartDatePersian,
                p.EndDatePersian,
                Closed = p.Closed ? "باز" : "بسته"
            };
        return result;
    }

    public async Task<MyResultPage<List<FiscalYearGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<FiscalYearGetPage>>();
        result.Data = new List<FiscalYearGetPage>();


        MyClaim.Init(_accessor);
        if (model.Filters == null) model.Filters = new List<FormKeyValue>();
        var parameters = new DynamicParameters();
        parameters.Add("IsSecondLang", MyClaim.IsSecondLang);
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
            var sQuery = "gn.Spc_FiscalYear_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<FiscalYearGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        return result;
    }

    public async Task<MyResultStatus> Insert(FiscalYearModel model)
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
            var sQuery = "gn.Spc_FiscalYear_InsUpd";
            conn.Open();
            MyClaim.Init(_accessor);
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                MyClaim.IsSecondLang,
                Opr = "Ins",
                Id = 0,
                model.Name,
                model.StartDate,
                model.EndDate,
                model.Closed,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<List<string>> Validation(FiscalYearModel model, int CompanyId)
    {
        var error = new List<string>();

        var checkingResult = await ExistYearByDataRange(model, CompanyId);

        if (checkingResult)
            error.Add(" مجاز به ثبت دوره مالی با سال تکراری نمی باشید ");

        return error;
    }

    public async Task<bool> ExistYearByDataRange(FiscalYearModel model, int CompanyId)
    {
        var filter = "";
        if (model.Id == 0)
            filter =
                $"(('{model.StartDate.ToShortDateString()}' BETWEEN  StartDate AND EndDate) OR ('{model.EndDate.ToShortDateString()}' BETWEEN StartDate AND EndDate)) OR FORMAT(cast('{model.StartDate}' as datetime),'yyyy','fa')=FORMAT(startdate,'yyyy','fa') AND CompanyId={CompanyId}";
        else
            filter =
                $"(('{model.StartDate.ToShortDateString()}' BETWEEN  StartDate AND EndDate) OR ('{model.EndDate.ToShortDateString()}' BETWEEN StartDate AND EndDate)) OR FORMAT(cast('{model.StartDate}' as datetime),'yyyy','fa')=FORMAT(startdate,'yyyy','fa') AND CompanyId={CompanyId} AND Id<>{model.Id} ";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";

            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "gn.FiscalYear",
                ColumnName = "Id",
                Filter = filter,
                OrderBy = ""
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
            return result > 0;
        }
    }

    public async Task<MyResultStatus> Update(FiscalYearModel model)
    {
        var result = new MyResultStatus();
        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_FiscalYear_InsUpd";
            conn.Open();
            MyClaim.Init(_accessor);
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                MyClaim.IsSecondLang,
                Opr = "Upd",
                model.Id,
                model.Name,
                model.StartDate,
                model.EndDate,
                model.Closed,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultStatus> GetFicalYearStatusByDate(DateTime? date, int companyId)
    {
        var result = new MyResultStatus();
        using (var conn = Connection)
        {
            var sQuery = "SELECT Status,StatusMessage FROM [fa].FuncCheckFiscalYearByDate(@Date, @CompanyId)";
            conn.Open();
            MyClaim.Init(_accessor);
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                Date = date,
                CompanyId = companyId
            });
            conn.Close();
        }

        result.Successfull = result.Status == 0 || result.Status == -99;
        return result;
    }

    //public async Task<List<FiscalYearDatePeriodViewModel>> GetFicalYearStatusByDate(DateTime? fromdate, DateTime? todate)
    //{
    //	var result = new List<FiscalYearDatePeriodViewModel>();
    //	using (IDbConnection conn = Connection)
    //	{
    //		string sQuery = "SELECT Status,StatusMessage,FiscalYearId,MonthId FROM [gn].[FuncCheckFiscalYearByDatePeriod](@FromDate, @Todate)";
    //		conn.Open();
    //		MyClaim.Init(_accessor);
    //		result = (await conn.QueryAsync<FiscalYearDatePeriodViewModel>(sQuery, new
    //		{
    //			FromDate = fromdate,
    //			ToDate = todate
    //		})).ToList();
    //		conn.Close();
    //	}
    //	return result;
    //}


    public virtual async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(byte? isclose)
    {
        var filter = "Id IN (SELECT DISTINCT fyl.HeaderId FROM gn.FiscalYearLine fyl) ";
        if (isclose != null)
            filter += $"and Closed={isclose}";

        using (var conn = Connection)
        {
            var result = new List<MyDropDownViewModel>();
            conn.Open();
            var sQuery = "pb.Spc_Tables_GetList";

            result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery, new
            {
                isSecondLang = false,
                TableName = "gn.FiscalYear",
                Filter = filter,
                OrderBy = "FORMAT(StartDate,'yyyy','fa') DESC"
            }, commandType: CommandType.StoredProcedure)).ToList();

            conn.Close();
            return result;
        }
    }

    public async Task<FiscalYearDateRange> GetFicalYearDateRange(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<FiscalYearDateRange>(sQuery, new
            {
                TableName = "gn.FiscalYear",
                IdColumnName = "Id",
                ColumnNameList = "StartDate,EndDate",
                IdList = "",
                Filter = $"Id={id} AND CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }


    public async Task<List<string>> ValidateIsClosedFiscalYearId(short? fiscalYearId)
    {
        var error = new List<string>();

        if (fiscalYearId == 0)
        {
            error.Add("درخواست معتبر نمی باشد");
            return error;
        }

        await Task.Run(async () =>
        {
            #region بررسی وضعیت دوره مالی

            var resultCheckFromFiscalYear = await CheckIsClosedtFiscalYearId(fiscalYearId);
            if (resultCheckFromFiscalYear)
                error.Add("دوره مالی  بسته شده");

            #endregion
        });

        return error;
    }


    public async Task<bool> CheckIsClosedtFiscalYearId(short? fiscalYearId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "gn.FiscalYear",
                ColumnName = "Closed",
                Filter = $"Id={fiscalYearId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result > 0;
        }
    }
}