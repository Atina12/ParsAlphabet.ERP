using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.FM.TreasuryBond;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.TreasuryBond;

public class TreasuryBondRepository :
    BaseRepository<TreasuryBondModel, int, string>,
    IBaseRepository<TreasuryBondModel, int, string>
{
    public TreasuryBondRepository(IConfiguration config)
        : base(config)
    {
    }

    public new GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, Width = 8, IsDtParameter = true,
                    IsFilterParameter = false, FilterType = "number"
                },
                new()
                {
                    Id = "bankAccountId", Title = "حساب بانکی", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/FM/BankAccountApi/getalldatadropdown_bankCategoryId/1"
                },
                new()
                {
                    Id = "bankAccountName", Title = "حساب بانکی", Type = (int)SqlDbType.NVarChar, Width = 15,
                    IsDtParameter = true
                },
                new()
                {
                    Id = "rowNumber", Title = "شماره سطر", Type = (int)SqlDbType.TinyInt, Width = 8,
                    IsDtParameter = true
                },
                new()
                {
                    Id = "bondSerialNo", Title = "شماره سریال چک", Type = (int)SqlDbType.NVarChar, Size = 10,
                    Width = 15, IsDtParameter = true, IsFilterParameter = true, FilterType = "strnumber"
                },
                new()
                {
                    Id = "bondNo", Title = "شماره چک", Type = (int)SqlDbType.Int, Width = 15, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "strnumber"
                },
                new()
                {
                    Id = "bondCountNo", Title = "تعداد برگ چک", Type = (int)SqlDbType.SmallInt, IsDtParameter = true,
                    Width = 6, Align = "center"
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Width = 6, IsDtParameter = true,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 28 }
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
                p.BankAccountName,
                p.RowNumber,
                p.BondSerialNo,
                p.BondNo,
                p.BondCountNo,
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };
        return result;
    }

    public async Task<MyResultPage<List<TreasuryBondGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<TreasuryBondGetPage>>();
        result.Data = new List<TreasuryBondGetPage>();


        if (model.Filters == null) model.Filters = new List<FormKeyValue>();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("BankAccountId ",
            model.Filters.Any(x => x.Name == "bankAccountId")
                ? model.Filters.FirstOrDefault(x => x.Name == "bankAccountId").Value
                : null);
        parameters.Add("BondSerialNo",
            model.Filters.Any(x => x.Name == "bondSerialNo")
                ? model.Filters.FirstOrDefault(x => x.Name == "bondSerialNo").Value
                : null);
        parameters.Add("BondNo",
            model.Filters.Any(x => x.Name == "bondNo")
                ? model.Filters.FirstOrDefault(x => x.Name == "bondNo").Value
                : null);

        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "fm.Spc_TreasuryBond_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<TreasuryBondGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }
}