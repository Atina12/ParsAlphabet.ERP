using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.HR.StandardTimeSheet;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYear;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.HR.StandardTimeSheet;

public class StandardTimeSheetRepository :
    BaseRepository<StandardTimeSheetModel, int, string>,
    IBaseRepository<StandardTimeSheetModel, int, string>
{
    private readonly FiscalYearRepository _fiscalYearRepository;
    private readonly ILoginRepository _loginRepository;

    public StandardTimeSheetRepository(IConfiguration config,
        ILoginRepository loginRepository, FiscalYearRepository fiscalYearRepository
    ) : base(config)
    {
        _loginRepository = loginRepository;
        _fiscalYearRepository = fiscalYearRepository;
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
                    IsFilterParameter = true, IsPrimary = true, FilterType = "number", Width = 6
                },
                new()
                {
                    Id = "fiscalYear", IsPrimary = true, Title = "سال مالی", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/GN/FiscalYearApi/getdropdown", Width = 12
                },
                new()
                {
                    Id = "department", IsPrimary = true, Title = "دپارتمان", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/HR/OrganizationalDepartmentApi/getdropdown/2", Width = 15
                },
                new()
                {
                    Id = "name", Title = "نام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, IsPrimary = true, Width = 16
                },
                new()
                {
                    Id = "startDatePersian", Title = "تاریخ شروع", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "endDatePersian", Title = "تاریخ پایان", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 8
                },
                new()
                {
                    Id = "createUser", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/GN/UserApi/getdropdown/2", Width = 12
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 1, IsDtParameter = true,
                    Align = "center", Width = 7
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 },

                new() { Id = "departmentId", IsPrimary = true }
            }
        };

        list.Buttons = new List<GetActionColumnViewModel>
        {
            new() { Name = "display", Title = "نمایش", ClassName = "", IconName = "far fa-file-alt" },
            new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
            new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" },
            new() { Name = "sep1", Title = "", ClassName = "", IconName = "", IsSeparator = true },
            new()
            {
                Name = "standardTimeSheetHoliday", Title = "ثبت تعطیلات", ClassName = "",
                IconName = "fas fa-calendar-alt color-green"
            },
            new()
            {
                Name = "standardTimeSheetPerMonth", Title = "ساعت کار موظف ماهانه", ClassName = "",
                IconName = "fas fa-calendar-alt color-green"
            }
        };

        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model, int userId, byte roleId)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                GetColumns().DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };
        var getPage = await GetPage(model, userId, roleId);
        result.Rows = from p in getPage.Data
            select new
            {
                p.Id,
                p.FiscalYear,
                p.Department,
                p.Name,
                p.StartDatePersian,
                p.EndDatePersian,
                p.CreateDateTimePersian,
                p.CreateUser,
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };
        return result;
    }

    public async Task<MyResultPage<List<StandardTimeSheetGetPage>>> GetPage(NewGetPageViewModel model, int userId,
        byte roleId)
    {
        var result = new MyResultPage<List<StandardTimeSheetGetPage>>();
        result.Data = new List<StandardTimeSheetGetPage>();

        var parameters = new DynamicParameters();

        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "name")
                ? model.Filters.FirstOrDefault(x => x.Name == "name").Value
                : null);

        parameters.Add("FiscalYearId",
            model.Filters.Any(x => x.Name == "fiscalYear")
                ? model.Filters.FirstOrDefault(x => x.Name == "fiscalYear").Value
                : null);
        parameters.Add("DepartmentId",
            model.Filters.Any(x => x.Name == "department")
                ? model.Filters.FirstOrDefault(x => x.Name == "department").Value
                : null);

        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "StandardTimeSheetApi",
            OprType = "VIWALL",
            UserId = userId
        };


        var checkAccessViewAll = await _loginRepository.GetAuthenticate(checkAuthenticate);


        if (model.Form_KeyValue[3]?.ToString() == null)
        {
            if (!checkAccessViewAll.Successfull)
                parameters.Add("CreateUserId", 0);
            else
                parameters.Add("CreateUserId",
                    model.Filters.Any(x => x.Name == "createUser")
                        ? model.Filters.FirstOrDefault(x => x.Name == "createUser").Value
                        : null);
        }

        else
        {
            if (checkAccessViewAll.Successfull)
            {
                {
                    if (int.Parse(model.Form_KeyValue[3]?.ToString()) != 0 &&
                        model.Filters.Any(x => x.Name == "createUser"))
                        parameters.Add("CreateUserId",
                            model.Filters.Any(x => x.Name == "createUser")
                                ? model.Filters.FirstOrDefault(x => x.Name == "createUser").Value
                                : null);

                    else
                        parameters.Add("CreateUserId", int.Parse(model.Form_KeyValue[3]?.ToString()));
                }
            }
            else
            {
                if (int.Parse(model.Form_KeyValue[3]?.ToString()) != 0 && model.Filters.Any(x => x.Name == "createUser"))
                    if (model.Filters.FirstOrDefault(x => x.Name == "createUser").Value == userId.ToString())
                        parameters.Add("CreateUserId", model.Filters.FirstOrDefault(x => x.Name == "createUser").Value);
                    else
                        parameters.Add("CreateUserId", 0);

                else
                    parameters.Add("CreateUserId", int.Parse(model.Form_KeyValue[3]?.ToString()));
            }
        }


        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "[hr].[Spc_StandardTimeSheet_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<StandardTimeSheetGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultPage<StandardTimeSheetGetRecord>> GetRecordById(int id, int companyId)
    {
        var result = new MyResultPage<StandardTimeSheetGetRecord>();
        result.Data = new StandardTimeSheetGetRecord();
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            conn.Open();
            result.Data = await conn.QueryFirstOrDefaultAsync<StandardTimeSheetGetRecord>(sQuery, new
            {
                TableName = "hr.StandardTimeSheet",
                Filter = $"Id={id} AND CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<List<StandardTimeSheetMonth>> Display(int id, int headerPagination)
    {
        if (headerPagination > 0)
        {
            var paginationParameters = new DynamicParameters();

            paginationParameters.Add("TableName", "hr.StandardTimeSheet");
            paginationParameters.Add("IdColumnName", "Id");
            paginationParameters.Add("IdColumnValue", id);
            paginationParameters.Add("Direction", headerPagination);

            using (var conn = Connection)
            {
                var sQuery = "[pb].[Spc_Tables_NextPrev]";

                conn.Open();

                var headerPaginationId = await conn.ExecuteScalarAsync<int>(sQuery, paginationParameters,
                    commandType: CommandType.StoredProcedure);

                conn.Close();

                if (headerPaginationId != 0)
                    id = headerPaginationId;
            }
        }

        using (var conn = Connection)
        {
            var sQuery = "[hr].[Spc_StandardTimeSheet_Display]";
            conn.Open();

            var result = await conn.QueryAsync<StandardTimeSheetMonth>(sQuery, new
            {
                StandardTimeSheetId = id
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            result = from s in result
                select new StandardTimeSheetMonth
                {
                    StandardTimeSheetId = id,
                    DepartmentId = s.DepartmentId,
                    Id = s.Id,
                    DaysJson = s.DaysJson,
                    MonthJson = s.MonthJson,
                    Name = s.Name
                };

            return result.AsList();
        }
    }

    public async Task<StandardTimeSheetInfo> GetInfo(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[hr].[Spc_StandardTimeSheet_Info]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<StandardTimeSheetInfo>(sQuery, new
            {
                StandardTimeSheetId = id,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }

    public virtual async Task<MyResultStatus> InsertUpdate(StandardTimeSheetModel model, OperationType operationType)
    {
        var validationError = await Validate(model, operationType);

        if (validationError.Count > 0)
            return new MyResultStatus
            {
                Status = -98,
                Successfull = false,
                ValidationErrors = validationError
            };


        var result = new MyResultStatus();
        using (var conn = Connection)
        {
            var sQuery = "hr.Spc_StandardTimeSheet_InsUpd";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.Id,
                Name = Extensions.ConvertArabicAlphabet(model.Name),
                model.FiscalYearId,
                model.DepartmentId,
                model.IsActive,
                model.CreateUserId,
                model.CreateDateTime,
                Description = Extensions.ConvertArabicAlphabet(model.Description),
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public virtual async Task<MyResultStatus> Duplicate(StandardTimeSheetDuplicate model)
    {
        var result = new MyResultStatus();

        var errorValidation = ValidateDuplicate(model);

        if (errorValidation.Count > 0)
            return new MyResultStatus
            {
                Successfull = false,
                ValidationErrors = errorValidation
            };


        using (var conn = Connection)
        {
            var sQuery = "[hr].[Spc_StandardTimeSheetDuplicate]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.FromTimeSheetId,
                model.ToTimeSheetId,
                model.FromMonthId,
                model.ToMonthId,
                model.CreateUserId,
                model.CreateDateTime,
                model.Type
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<IEnumerable<MyDropDownViewModel>> CalculationBasedTypegetDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "hr.CalculationBasedType"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public List<string> ValidateDuplicate(StandardTimeSheetDuplicate model)
    {
        var errors = new List<string>();

        if (model.FromTimeSheetId == 0 || model.ToTimeSheetId == 0)
            errors.Add("مقادیر ورودی معتبر نمی باشد");

        if (model.FromTimeSheetId == model.ToTimeSheetId && model.FromMonthId != "0" && model.ToMonthId != "0")
            if (model.FromMonthId == model.ToMonthId)
                errors.Add("ماه مبدا و مقصد نمی تواند یکسان باشد");

        return errors;
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "hr.StandardTimeSheet",
                    Filter = $"CompanyId={companyId} and IsActive=1"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetTimeSheetInfo(int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "hr.StandardTimeSheet",
                    Filter = $"CompanyId={companyId} and IsActive=1"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<bool> CheckExist(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "hr.StandardTimeSheet",
                ColumnName = "Id",
                Filter = $"Id={id} AND CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result > 0;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetDropDownByDepartmentId(short departmentId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    IsSecondLang = false,
                    TableName = "hr.StandardTimeSheet",
                    Filter = $"DepartmentId={departmentId} AND CompanyId={companyId} And IsActive=1"
                }, commandType: CommandType.StoredProcedure)).ToList();

            return result;
        }
    }


    public async Task<List<string>> Validate(StandardTimeSheetModel model, OperationType operationType)
    {
        var error = new List<string>();

        if (model == null)
        {
            error.Add("درخواست معتبر نمی باشد");
            return error;
        }

        await Task.Run(async () =>
        {
            if (operationType == OperationType.Insert)
            {
                var departmentId = CheckExistDepartmentId(model.DepartmentId, model.FiscalYearId).Result;
                if (departmentId)
                    error.Add("برای دپارتمان انتخابی  قبلا تقویم ثبت شده است");
            }

            #region بررسی وضعیت دوره مالی

            var resultCheckFiscalYear = await _fiscalYearRepository.CheckIsClosedtFiscalYearId(model.FiscalYearId);

            if (resultCheckFiscalYear)
                error.Add("دوره مالی بسته شده");

            #endregion
        });

        return error;
    }


    public async Task<bool> CheckExistDepartmentId(int departmentId, int FiscalYearId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "hr.StandardTimeSheet",
                ColumnName = "Id",
                Filter = $"DepartmentId={departmentId} and FiscalYearId={FiscalYearId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result > 0;
        }
    }
}