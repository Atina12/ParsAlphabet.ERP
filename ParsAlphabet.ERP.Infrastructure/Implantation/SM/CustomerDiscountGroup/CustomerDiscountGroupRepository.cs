using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.SM.CustomerDiscountGroup;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.SM.CustomerDiscountGroup;

public class CustomerDiscountGroupRepository :
    BaseRepository<CustomerDiscountGroupModel, int, string>,
    IBaseRepository<CustomerDiscountGroupModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;

    public CustomerDiscountGroupRepository(IConfiguration config, IHttpContextAccessor accessor)
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
                    Id = "personGroup", Title = "گروه مشتریان", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 40, FilterType = "select2",
                    FilterTypeApi = "/api/SM/CustomerGroupApi/getdropdown"
                },
                new()
                {
                    Id = "minQuantity", Title = "حداقل تعداد", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 8
                },
                new()
                {
                    Id = "minQuantitySale", Title = "حداقل تعداد فروش", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "priceType", Title = "مبنای نرخ", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 8
                },
                new()
                {
                    Id = "price", Title = "نرخ", Type = (int)SqlDbType.Money, IsDtParameter = true, Width = 8,
                    IsCommaSep = true
                },
                new()
                {
                    Id = "lastModifiedDateTimePersian", Title = "آخرین ویرایش", Type = (int)SqlDbType.NVarChar,
                    Size = 50, IsDtParameter = true, Width = 12
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 5,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 14 }
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
                p.PersonGroup,
                p.MinQuantity,
                p.MinQuantitySale,
                p.PriceType,
                p.Price,
                p.LastModifiedDateTimePersian,
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };
        return result;
    }

    public async Task<MyResultPage<List<CustomerDiscountGroupGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<CustomerDiscountGroupGetPage>>
        {
            Data = new List<CustomerDiscountGroupGetPage>()
        };

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("PersonGroup",
            model.Filters.Any(x => x.Name == "personGroup")
                ? model.Filters.FirstOrDefault(x => x.Name == "personGroup").Value
                : null);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "sm.Spc_CustomerDiscountGroup_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<CustomerDiscountGroupGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultQuery> InsertUpdate(CustomerDiscountGroupModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "sm.Spc_CustomerDiscountGroup_InsUpd";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                model.Id,
                model.PersonGroupId,
                model.MinQuantity,
                model.MinQuantitySale,
                model.PriceTypeId,
                model.Price,
                model.LastModifiedDateTime,
                model.IsActive,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<IEnumerable<CustomerDiscountGroupGetPage>> GetList(int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "sm.Spc_CustomerDiscountGroup_GetList";
            conn.Open();
            var result = await conn.QueryAsync<CustomerDiscountGroupGetPage>(sQuery,
                new
                {
                    CompanyId = companyId
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }
}