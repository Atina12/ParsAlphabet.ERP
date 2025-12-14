using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.FM.AccountCategory;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.AccountCategory;

public class AccountCategoryRepository :
    BaseRepository<AccountCategoryModel, int, string>,
    IBaseRepository<AccountCategoryModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;

    public AccountCategoryRepository(IConfiguration config,
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
                    Id = "name", Title = "نام", Type = (int)SqlDbType.NVarChar, Size = 50, Width = 20,
                    IsDtParameter = true, IsFilterParameter = true
                },
                new()
                {
                    Id = "incomeBalance", Title = "نوع حساب", Type = (int)SqlDbType.NVarChar, Size = 20, Width = 8,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/FMApi/incomebalancetype_getdropdown"
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 20, Width = 6,
                    IsDtParameter = true, IsFilterParameter = true, Align = "center", FilterType = "select2",
                    FilterTypeApi = "/api/FM/AccountCategoryApi/getdropdown_isactive"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 58 }
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
                p.Name,
                p.IncomeBalanceName,
                IsActive = p.IsActive ? "فعال" : "غیر فعال"
            };
        return result;
    }

    public async Task<MyResultPage<List<AccountCategoryGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<AccountCategoryGetPage>>();
        result.Data = new List<AccountCategoryGetPage>();

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
        parameters.Add("InComeBalanceId",
            model.Filters.Any(x => x.Name == "incomeBalance")
                ? model.Filters.FirstOrDefault(x => x.Name == "incomeBalance").Value
                : null);
        parameters.Add("IsActive",
            model.Filters.Any(x => x.Name == "isActive")
                ? model.Filters.FirstOrDefault(x => x.Name == "isActive").Value
                : null);
        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_AccountCategory_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<AccountCategoryGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultPage<AccountCategoryGetRecord>> GetRecordById(int id)
    {
        var result = new MyResultPage<AccountCategoryGetRecord>();
        result.Data = new AccountCategoryGetRecord();
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            conn.Open();
            result.Data = await conn.QueryFirstOrDefaultAsync<AccountCategoryGetRecord>(sQuery, new
            {
                TableName = "fm.AccountCategory",
                Filter = $"Id={id}"
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<MyResultQuery> Insert(AccountCategoryModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_AccountCategory_InsUpd]";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                model.Opr,
                model.Id,
                model.Name,
                model.IncomeBalanceId,
                model.CompanyId,
                model.IsActive
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = true;
        return result;
    }

    public async Task<MyResultQuery> Update(AccountCategoryModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_AccountCategory_InsUpd]";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                model.Opr,
                model.Id,
                model.Name,
                model.IncomeBalanceId,
                model.CompanyId,
                model.IsActive
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = true;
        return result;
    }

    public async Task<MyResultQuery> Delete(int keyvalue)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecord";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                TableName = "fm.AccountCategory",
                RecordId = keyvalue
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = true;
        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fm.AccountCategory",
                    Filter = $"CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetActiveDropDown(int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fm.AccountCategory",
                    Filter = $"CompanyId={companyId} AND IsActive=1"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<MyDropDownViewModel> GetIncomeBalanceType(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();
            MyClaim.Init(_accessor);

            var result = await conn.QueryFirstOrDefaultAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    TableName = "fm.AccountCategory",
                    IdColumnName = "Id",
                    ColumnNameList =
                        $"IncomeBalanceId Id,(SELECT CASE WHEN {(MyClaim.IsSecondLang ? 1 : 0)}=0 THEN Name ELSE NameEng END FROM fm.IncomeBalanceType WHERE Id=IncomeBalanceId) AS Name",
                    IdList = "",
                    Filter = $"Id={id}",
                    OrderBy = ""
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public List<MyDropDownViewModel> GetDropDown_IsActive()
    {
        return new List<MyDropDownViewModel>
        {
            new() { Id = 1, Name = "فعال" },
            new() { Id = 2, Name = "غیر فعال" }
        };
    }
}