using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.FM.VAT;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.VAT;

public class VATRepository :
    BaseRepository<VATModel, int, string>,
    IBaseRepository<VATModel, int, string>
{
    public VATRepository(IConfiguration config) : base(config)
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
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, Width = 5, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number"
                },
                new()
                {
                    Id = "name", Title = "نام", Type = (int)SqlDbType.NVarChar, Size = 20, IsDtParameter = true,
                    IsFilterParameter = true, Width = 15
                },
                new()
                {
                    Id = "noSeriesIdName", Title = "گروه تفضیل", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10, FilterType = "select2",
                    FilterTypeApi = "/api/GN/NoSeriesLineApi/getdropdown_noseries"
                },
                new()
                {
                    Id = "accountDetailIdName", Title = " تفضیل", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 25
                },
                new()
                {
                    Id = "vatType", Title = "نوع مالیات", Type = (int)SqlDbType.NVarChar, Size = 20,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "vatPer", Title = "درصد مالیات", Type = (int)SqlDbType.TinyInt, Width = 5, IsDtParameter = true
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 1, IsDtParameter = true,
                    Align = "center", Width = 5
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 30 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "editVat", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
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
                p.NoSeriesIdName,
                p.AccountDetailIdName,
                p.VATType,
                p.VATPer,
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };
        return result;
    }

    public async Task<MyResultPage<List<VATGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<VATGetPage>>();
        result.Data = new List<VATGetPage>();
        if (model.Filters == null) model.Filters = new List<FormKeyValue>();
        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "name")
                ? model.Filters.FirstOrDefault(x => x.Name == "name").Value
                : null);
        parameters.Add("NoSeriesIdName",
            model.Filters.Any(x => x.Name == "noSeriesIdName")
                ? model.Filters.FirstOrDefault(x => x.Name == "noSeriesIdName").Value
                : null);

        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);


        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_VAT_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<VATGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        return result;
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(DateTime date, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "fm.Spc_VAT_GetList";
            conn.Open();

            var result = await conn.QueryAsync<VatDropDownViewModel>(sQuery, commandType: CommandType.StoredProcedure);

            var dropDownResult = from v in result
                select new MyDropDownViewModel
                {
                    Id = v.Id,
                    Name = v.Name + (v.VatTypeId == 2
                        ? $" - : {v.VatTypeName} - {v.Percentage}%"
                        : $" - : {v.VatTypeName} - {v.Percentage}%")
                };

            return dropDownResult;
        }
    }


    public async Task<bool> CheckExist(VATModel model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "fm.VAT",
                ColumnName = "Id",
                Filter = $"VATTypeId={model.VATTypeId} AND companyId={model.CompanyId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result > 0;
        }
    }
}