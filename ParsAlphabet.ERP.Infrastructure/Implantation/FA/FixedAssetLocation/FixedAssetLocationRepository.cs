using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.FA.FixedAssetLocation;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FA.FixedAssetLocation;

public class FixedAssetLocationRepository :
    BaseRepository<FixedAssetLocationModel, int, string>,
    IBaseRepository<FixedAssetLocationModel, int, string>
{
    public FixedAssetLocationRepository(IConfiguration config)
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
                    Id = "name", Title = "نام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 20
                },
                new()
                {
                    Id = "countryName", Title = "کشور", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 20
                },
                new()
                {
                    Id = "stateName", Title = "ولایت", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 20
                },
                new()
                {
                    Id = "cityName", Title = "شهر", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 20
                },
                new()
                {
                    Id = "postalCode", Title = "نمبر خانه (Postal Code)", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 20
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 6,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 9 }
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
                p.Name,
                p.CountryName,
                p.StateName,
                p.CityName,
                p.PostalCode,
                IsActive = p.IsActive ? "بلی" : "خیر"
            };
        return result;
    }

    public async Task<MyResultPage<List<FixedAssetLocationGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<FixedAssetLocationGetPage>>
        {
            Data = new List<FixedAssetLocationGetPage>()
        };

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "name")
                ? model.Filters.FirstOrDefault(x => x.Name == "name").Value
                : null);
        parameters.Add("CountryName",
            model.Filters.Any(x => x.Name == "countryName")
                ? model.Filters.FirstOrDefault(x => x.Name == "countryName").Value
                : null);
        parameters.Add("CityName",
            model.Filters.Any(x => x.Name == "cityName")
                ? model.Filters.FirstOrDefault(x => x.Name == "cityName").Value
                : null);
        parameters.Add("PostalCode",
            model.Filters.Any(x => x.Name == "postalCode")
                ? model.Filters.FirstOrDefault(x => x.Name == "postalCode").Value
                : null);
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "fa.Spc_FixedAssetLocation_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<FixedAssetLocationGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }
}