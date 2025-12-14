using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.FA.FixedAsset;
using ParsAlphabet.ERP.Application.Interfaces.FA;
using ParsAlphabet.ERP.Infrastructure.Implantation.FA.FixedAssetSubClass;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FA.FixedAsset;

public class FixedAssetRepository :
    BaseRepository<FixedAssetModel, int, string>,
    IBaseRepository<FixedAssetModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;

    private readonly IFARepository _FARepository;
    private readonly FixedAssetSubClassRepository _fixedAssetSubClassRepository;

    public FixedAssetRepository(
        IConfiguration config,
        IHttpContextAccessor accessor,
        FixedAssetSubClassRepository FixedAssetSubClassRepository,
        IFARepository FARepository) : base(config)
    {
        _accessor = accessor;
        _fixedAssetSubClassRepository = FixedAssetSubClassRepository;
        _FARepository = FARepository;
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
                    Id = "name", Title = "نام دارایی", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "underMaintenance", Title = "در حال تعمیر", Type = (int)SqlDbType.Bit, Size = 1,
                    IsDtParameter = true, Width = 4, Align = "center"
                },
                new()
                {
                    Id = "technicalCode", Title = "کدفنی", Type = (int)SqlDbType.VarChar, Size = 15,
                    IsDtParameter = true, IsFilterParameter = true, Width = 7
                },
                new()
                {
                    Id = "depreciationStartDatePersian", Title = "تاریخ شروع استهلاک", Type = (int)SqlDbType.NVarChar,
                    Size = 10, IsDtParameter = true, IsFilterParameter = true, FilterType = "persiandate", Width = 6
                },
                new()
                {
                    Id = "depreciationEndDatePersian", Title = "تاریخ پایان استهلاک", Type = (int)SqlDbType.NVarChar,
                    Size = 10, IsDtParameter = true, IsFilterParameter = true, FilterType = "persiandate", Width = 6
                },
                new()
                {
                    Id = "subClassName", Title = "طبقه فرعی", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "depreciationMethod", Title = "روش استهلاک", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 9
                },
                new()
                {
                    Id = "depreciationEnable", Title = "محاسبه استهلاک", Type = (int)SqlDbType.Bit, Size = 1,
                    IsDtParameter = true, Width = 4, Align = "center"
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 6,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 8 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" }
            }
        };

        return list;
    }

    public GetColumnsViewModel GetColumnsVendorFixedAsset()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 6
                },
                new()
                {
                    Id = "categoryName", Title = "دسته بندی", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "name", Title = "نام دارایی", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "subClassName", Title = "طبقه فرعی", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "depreciationStartDate", Title = "تاریخ شروع استهلاک", Type = (int)SqlDbType.NVarChar,
                    Size = 10, IsDtParameter = true, IsFilterParameter = true, Width = 6
                },
                new()
                {
                    Id = "depreciationEndDate", Title = "تاریخ پایان استهلاک", Type = (int)SqlDbType.NVarChar,
                    Size = 10, IsDtParameter = true, IsFilterParameter = true, Width = 6
                }
            }
        };

        return list;
    }

    public GetColumnsViewModel AllocationColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 5
                },
                new()
                {
                    Id = "name", Title = "نام دارایی", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 15
                }
            }
        };

        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(GetPageViewModel model)
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
                UnderMaintenance = p.UnderMaintenance ? "بلی" : "خیر",
                p.TechnicalCode,
                p.DepreciationStartDatePersian,
                p.DepreciationEndDatePersian,
                p.SubClassName,
                p.DepreciationMethod,
                DepreciationEnable = p.DepreciationEnable ? "دارد" : "ندارد",
                IsActive = p.IsActive ? "بلی" : "خیر"
            };
        return result;
    }

    public async Task<MyResultPage<List<FixedAssetGetPage>>> GetPage(GetPageViewModel model)
    {
        var result = new MyResultPage<List<FixedAssetGetPage>>
        {
            Data = new List<FixedAssetGetPage>()
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
        parameters.Add("TechnicalCode",
            model.Filters.Any(x => x.Name == "technicalCode")
                ? model.Filters.FirstOrDefault(x => x.Name == "technicalCode").Value
                : null);
        parameters.Add("FixedAssetSubClassName",
            model.Filters.Any(x => x.Name == "fixedAssetSubClassName")
                ? model.Filters.FirstOrDefault(x => x.Name == "fixedAssetSubClassName").Value
                : null);
        parameters.Add("DepreciationStartDate",
            model.Filters.Any(x => x.Name == "depreciationStartDatePersian")
                ? model.Filters.FirstOrDefault(x => x.Name == "depreciationStartDatePersian").Value.ToMiladiDateTime()
                : null);
        parameters.Add("DepreciationEndDate",
            model.Filters.Any(x => x.Name == "depreciationEndDatePersian")
                ? model.Filters.FirstOrDefault(x => x.Name == "depreciationEndDatePersian").Value.ToMiladiDateTime()
                : null);
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "fa.Spc_FixedAsset_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<FixedAssetGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        return result;
    }

    public async Task<MyResultPage<FixedAssetAssignList>> GetPageDiAssignFixedAsset(GetPageViewModel model)
    {
        var result = new MyResultPage<FixedAssetAssignList>
        {
            Data = new FixedAssetAssignList()
        };

        var totalRecord = 0;
        var p_id = 0;
        string p_name = "", p_technicalCode = "", p_fixedAssetCategoryName = "";
        string p_fixedAssetSubClassName = "", p_depreciationStartDate = "", p_depreciationEndDate = "";

        switch (model.FieldItem)
        {
            case "id":
                p_id = Convert.ToInt32(model.FieldValue);
                break;
            case "name":
                p_name = model.FieldValue;
                break;
            case "technicalCode":
                p_technicalCode = model.FieldValue;
                break;
            case "fixedAssetCategoryName":
                p_fixedAssetCategoryName = model.FieldValue;
                break;
            case "fixedAssetSubClassName":
                p_fixedAssetSubClassName = model.FieldValue;
                break;
            case "depreciationStartDatePersian":
                p_depreciationStartDate = model.FieldValue;
                break;
            case "depreciationEndDatePersian":
                p_depreciationEndDate = model.FieldValue;
                break;
        }

        MyClaim.Init(_accessor);

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id", p_id);
        parameters.Add("Name", p_name);
        parameters.Add("TechnicalCode", p_technicalCode);
        parameters.Add("FixedAssetCategoryName", p_fixedAssetCategoryName);
        parameters.Add("FixedAssetSubClassName", p_fixedAssetSubClassName);
        parameters.Add("DepreciationStartDate", p_depreciationStartDate);
        parameters.Add("DepreciationEndDate", p_depreciationEndDate);
        parameters.Add("CompanyId", model.CompanyId);
        parameters.Add("TotalRecord", dbType: DbType.Int32, direction: ParameterDirection.Output);

        result.Columns = GetColumnsVendorFixedAsset();

        using (var conn = Connection)
        {
            var sQuery = "fa.Spc_FixedAsset_GetPage";
            conn.Open();
            result.Data.Assigns =
                (await conn.QueryAsync<FixedAssetGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        totalRecord = parameters.Get<int>("TotalRecord");

        if (result.Data.Assigns.Count != 0 && model.PageRowsCount != 0)
        {
            result.CurrentPage = model.PageNo;
            result.TotalRecordCount = totalRecord;
            if (result.TotalRecordCount % model.PageRowsCount == 0)
                result.MaxPageCount = Convert.ToInt32(result.TotalRecordCount / model.PageRowsCount);
            else
                result.MaxPageCount = Convert.ToInt32(result.TotalRecordCount / model.PageRowsCount) + 1;
            result.PageStartRow = (model.PageNo - 1) * model.PageRowsCount + 1;
            result.PageEndRow = result.PageStartRow + result.Data.Assigns.Count - 1;
        }

        return result;
    }

    public async Task<MyResultPage<FixedAssetGetRecord>> GetRecordById(int id)
    {
        var result = new MyResultPage<FixedAssetGetRecord>();
        result.Data = new FixedAssetGetRecord();
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            conn.Open();
            result.Data = await conn.QueryFirstOrDefaultAsync<FixedAssetGetRecord>(sQuery, new
            {
                TableName = "fa.FixedAsset",
                Filter = $"Id={id}"
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Data == null;

        result.Data.FixedAssetSubClasstName =
            await _fixedAssetSubClassRepository.GetSubClassName(result.Data.FixedAssetSubClassId);
        result.Data.FixedAssetClassId =
            await _fixedAssetSubClassRepository.GetFixedAssetClassId(result.Data.FixedAssetSubClassId);
        result.Data.FixedAssetClassName = await _FARepository.GetFixedAssetClassName(result.Data.FixedAssetClassId);

        return result;
    }

    public async Task<MyResultStatus> Save(FixedAssetModel model)
    {
        var result = new MyResultStatus();
        using (var conn = Connection)
        {
            var sQuery = "fa.Spc_FixedAsset_InsUpd";
            conn.Open();

            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.Id,
                model.ItemId,
                model.MainAssetComponent,
                model.FixedAssetId,
                model.FixedAssetSubClassId,
                model.TechnicalCode,
                model.DepreciationMethodId,
                model.DepreciationStartDate,
                model.DepreciationEndDate,
                model.UnderMaintenance,
                model.DepreciationPeriodType,
                model.DepreciationPeriod,
                model.DepreciationEnable,
                model.IsActive,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDownByType(int? id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fa.FixedAsset",
                    Filter = $"MainAssetComponent={1} AND IsActive = {1} AND CompanyId={companyId} "
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<MyDropDownViewModel> GetFixedAssetCategoryId(int id, int companyId)
    {
        var category = new MyDropDownViewModel();

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<short>(sQuery, new
            {
                TableName = "fa.FixedAsset",
                ColumnName = "FixedAssetCategoryId",
                Filter = $"Id={id} AND CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return category;
        }
    }

    public async Task<string> GetFixedAssetName(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "fa.FixedAsset",
                    ColumnName = "Name",
                    Filter = $"Id={id} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }
}