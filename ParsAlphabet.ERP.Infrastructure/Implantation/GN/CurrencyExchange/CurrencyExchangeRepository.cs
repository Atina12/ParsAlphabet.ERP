using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.GN.CurrencyExchange;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.GN.CurrencyExchange;

public class CurrencyExchangeRepository :
    BaseRepository<CurrencyExchangeModel, int, string>,
    IBaseRepository<CurrencyExchangeModel, int, string>
{
    public CurrencyExchangeRepository(IConfiguration config)
        : base(config)
    {
        //_config = config;
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
                    IsFilterParameter = true, FilterType = "number", Width = 6
                },
                new()
                {
                    Id = "currencyName", Title = "نام ارز", Type = (int)SqlDbType.NVarChar, Size = 30,
                    IsDtParameter = true, IsFilterParameter = true, Width = 15
                },
                new()
                {
                    Id = "purchaseRate", Title = "نرخ خرید", Type = (int)SqlDbType.Decimal, IsDtParameter = true,
                    IsFilterParameter = false, IsCommaSep = true, Width = 20
                },
                new()
                {
                    Id = "salesRate", Title = "نرخ فروش", Type = (int)SqlDbType.Decimal, IsDtParameter = true,
                    IsFilterParameter = false, IsCommaSep = true, Width = 20
                },
                new()
                {
                    Id = "updateDatePersian", Title = "تاریخ بروزرسانی", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = false, Width = 15
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 24 }
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
        model.PageNo = 0;
        model.PageRowsCount = 0;

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
                p.CurrencyName,
                p.PurchaseRate,
                p.SalesRate,
                p.UpdateDatePersian
            };
        return result;
    }

    public async Task<MyResultPage<List<CurrencyExchangeGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<CurrencyExchangeGetPage>>
        {
            Data = new List<CurrencyExchangeGetPage>()
        };

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("CurrencyName",
            model.Filters.Any(x => x.Name == "currencyName")
                ? model.Filters.FirstOrDefault(x => x.Name == "currencyName").Value
                : null);
        parameters.Add("UpdateDatePerisan",
            model.Filters.Any(x => x.Name == "updateDatePersian")
                ? model.Filters.FirstOrDefault(x => x.Name == "updateDatePersian").Value
                : null);
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_CurrencyExchange_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<CurrencyExchangeGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultQuery> Insert(CurrencyExchangeModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_CurrencyExchange_InsUpd";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                Opr = "Ins",
                Id = 0,
                model.CurrencyId,
                model.UpdateDate,
                model.PurchaseRate,
                model.SalesRate,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = true;
        return result;
    }

    public async Task<MyResultQuery> Update(CurrencyExchangeModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_CurrencyExchange_InsUpd ";
            conn.Open();

            await conn.ExecuteAsync(sQuery, new
            {
                Opr = "Upd",
                model.Id,
                model.CurrencyId,
                model.UpdateDate,
                model.PurchaseRate,
                model.SalesRate,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = true;
        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(string term)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "gn.Currency"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }
}