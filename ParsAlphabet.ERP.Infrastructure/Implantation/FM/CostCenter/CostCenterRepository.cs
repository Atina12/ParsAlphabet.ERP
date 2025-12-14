using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.FM.CostCenter;
using ParsAlphabet.ERP.Application.Interfaces.FM;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.CostCenter;

public class CostCenterRepository :
    BaseRepository<CostCenterModel, int, string>,
    IBaseRepository<CostCenterModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;
    private readonly IFinanceRepository _fm;

    public CostCenterRepository(IConfiguration config,
        IHttpContextAccessor accessor,
        IFinanceRepository fm
    )
        : base(config)
    {
        _accessor = accessor;
        _fm = fm;
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
                    Id = "name", Title = "نام", Type = (int)SqlDbType.NVarChar, Size = 50, Width = 15,
                    IsDtParameter = true, IsFilterParameter = true, IsPrimary = true
                },
                new()
                {
                    Id = "costDriverName", Title = "محرک هزینه", Type = (int)SqlDbType.NVarChar, Size = 50, Width = 15,
                    IsDtParameter = true, IsFilterParameter = true
                },
                new()
                {
                    Id = "costCategoryName", Title = "دسته بندی", Type = (int)SqlDbType.NVarChar, Size = 50, Width = 15,
                    IsDtParameter = true, IsFilterParameter = true
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 1, IsDtParameter = true,
                    Width = 6, Align = "center"
                },
                new()
                {
                    Id = "isDetail", Title = "تفصیل", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 6,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 35 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new()
                {
                    Name = "accountDetail", Title = "ایجاد تفصیل", ClassName = "", IconName = "fas fa-plus color-blue"
                },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" },
                new() { Name = "sep1", Title = "", ClassName = "", IconName = "", IsSeparator = true },
                new()
                {
                    Name = "costcenterline", Title = "تخصیص متغیرها", ClassName = "",
                    IconName = "fa fa-list color-deep-blue"
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
                p.CostDriverName,
                p.CostCategoryName,
                IsActive = p.IsActive ? "فعال" : "غیرفعال",
                IsDetail = p.IsDetail ? "دارد" : "ندارد"
            };
        return result;
    }

    public async Task<MyResultPage<List<CostCenterGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<CostCenterGetPage>>();
        result.Data = new List<CostCenterGetPage>();

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
        parameters.Add("CostDriverName",
            model.Filters.Any(x => x.Name == "costDriverName")
                ? model.Filters.FirstOrDefault(x => x.Name == "costDriverName").Value
                : null);
        parameters.Add("CostCategoryName",
            model.Filters.Any(x => x.Name == "costCategoryName")
                ? model.Filters.FirstOrDefault(x => x.Name == "costCategoryName").Value
                : null);
        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);


        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_CostCenter_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<CostCenterGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        return result;
    }

    public async Task<MyResultPage<CostCenterGetRecord>> GetRecordById(int id, int companyId)
    {
        var result = new MyResultPage<CostCenterGetRecord>
        {
            Data = new CostCenterGetRecord()
        };
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            conn.Open();
            result.Data = await conn.QueryFirstOrDefaultAsync<CostCenterGetRecord>(sQuery, new
            {
                TableName = "fm.CostCenter",
                Filter = $"Id={id} AND CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);
        }

        #region ویرایش تفضیل :accountDetailCostCenterList

        var accountDetailViewModel = new
        {
            result.Data.CostDriverId,
            CostDriverName = result.Data.CostDriverId > 0 ? await _fm.CostDriver_GetName(result.Data.CostDriverId) : ""
        };
        result.Data.JsonAccountDetailList = JsonConvert.SerializeObject(accountDetailViewModel);

        #endregion

        result.Data.CostDriverTypeId = await _fm.GetCostDriverTypeId(result.Data.CostDriverId);

        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(string term, int companyId, byte? isActive)
    {
        var filter = "1=1 AND ";
        if (isActive != 0 && isActive != null)
            filter += $"ISNULL(IsActive,0)={(isActive == 2 ? 0 : 1)} AND ";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fm.CostCenter",
                    Filter = filter +
                             $"CompanyId={companyId} AND ( Id='{(int.TryParse(term, out _) ? term : "0")}' OR Name Like N'%{term}%' )"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<bool> GetIsActive(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<bool>(sQuery,
                new
                {
                    TableName = "fm.CostCenter",
                    ColumnName = "IsActive",
                    Filter = $"Id={id} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<string> GetName(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "fm.CostCenter",
                    ColumnName = "Name",
                    Filter = $"Id={id} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    /// <summary>
    ///     دریافت شناسه مرکز زینه برای تفصیل خرید و انبار
    /// </summary>
    /// <param name="id"></param>
    /// <param name="companyId"></param>
    /// <returns></returns>
    public async Task<int> GetHeaderId(short stageId, int itemId, byte itemTypeId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_CostCenterLine_GetHeader]";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    StageId = stageId,
                    ItemId = itemId,
                    ItemTypeId = itemTypeId
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<bool> CheckExist(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "fm.CostCenter",
                    ColumnName = "Id",
                    Filter = $"Id={id} AND CompanyId={companyId} AND IsActive=1"
                }, commandType: CommandType.StoredProcedure);
            return result == 0;
        }
    }
}