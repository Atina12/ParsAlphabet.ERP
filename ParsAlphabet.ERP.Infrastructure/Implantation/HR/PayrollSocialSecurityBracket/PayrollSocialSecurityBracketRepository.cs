using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.HR.PayrollSocialSecurityBracket;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.HR.PayrollSocialSecurityBracket;

public class PayrollSocialSecurityBracketRepository :
    BaseRepository<PayrollSocialSecurityBracketModel, int, string>,
    IBaseRepository<PayrollSocialSecurityBracketModel, int, string>
{
    public PayrollSocialSecurityBracketRepository(IConfiguration config)
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
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, IsPrimary = true, FilterType = "number", Width = 6
                },
                new()
                {
                    Id = "fiscalYear", Title = "سال مالی", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsPrimary = true, Width = 10
                },
                new()
                {
                    Id = "name", Title = "نام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsPrimary = true, Width = 10
                },
                new()
                {
                    Id = "workshopCode", Title = "کد کارگاه", Type = (int)SqlDbType.SmallInt, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 7
                },
                new()
                {
                    Id = "workshopName", Title = "نام کارگاه", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 12
                },
                new()
                {
                    Id = "contractNo", Title = "ردیف پیمان", Type = (int)SqlDbType.SmallInt, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "number", Width = 6
                },
                new()
                {
                    Id = "socialSecurityTypeName", Title = "نوع بیمه", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "employerSCPercentage", Title = "درصد بیمه پرسنل", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "employeeSCPercentage", Title = "درصد بیمه کارفرما", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "unEmploymentSCPercentage", Title = "درصد بیمه بیکاری", Type = (int)SqlDbType.NVarChar,
                    Size = 50, IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "maxPensionableAmount", Title = "سقف بیمه", Type = (int)SqlDbType.Int, Size = 50,
                    IsCommaSep = true, IsDtParameter = true, Width = 10, InputType = "money"
                },
                new()
                {
                    Id = "userFullName", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ و زمان ثبت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 1, IsDtParameter = true,
                    Align = "center", Width = 10
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 18 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" }
            }
        };
        return list;
    }

    public async Task<MyResultPage<List<PayrollSocialSecurityBracketGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<PayrollSocialSecurityBracketGetPage>>();
        result.Data = new List<PayrollSocialSecurityBracketGetPage>();


        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("WorkshopCode",
            model.Filters.Any(x => x.Name == "workshopCode")
                ? model.Filters.FirstOrDefault(x => x.Name == "workshopCode").Value
                : null);
        parameters.Add("WorkshopName",
            model.Filters.Any(x => x.Name == "workshopName")
                ? model.Filters.FirstOrDefault(x => x.Name == "workshopName").Value
                : null);
        parameters.Add("ContractNo",
            model.Filters.Any(x => x.Name == "contractNo")
                ? model.Filters.FirstOrDefault(x => x.Name == "contractNo").Value
                : null);


        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);


        if (model.Form_KeyValue[1]?.ToString() == null)
            parameters.Add("CreateUserId");
        else
            parameters.Add("CreateUserId", int.Parse(model.Form_KeyValue[1]?.ToString()));

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "[hr].[Spc_PayrollSocialSecurityBracket_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<PayrollSocialSecurityBracketGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
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
                p.FiscalYear,
                p.Name,
                p.WorkshopCode,
                p.WorkshopName,
                p.ContractNo,
                p.SocialSecurityTypeName,
                p.EmployerSCPercentage,
                p.EmployeeSCPercentage,
                p.UnEmploymentSCPercentage,
                p.MaxPensionableAmount,
                p.UserFullName,
                p.CreateDateTimePersian,
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };
        return result;
    }

    public async Task<MyResultPage<PayrollSocialSecurityBracketGetRecord>> GetRecordById(int id, int companyId)
    {
        var result = new MyResultPage<PayrollSocialSecurityBracketGetRecord>();
        result.Data = new PayrollSocialSecurityBracketGetRecord();

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            conn.Open();
            result.Data = await conn.QueryFirstOrDefaultAsync<PayrollSocialSecurityBracketGetRecord>(sQuery, new
            {
                TableName = "hr.PayrollSocialSecurityBracket",
                Filter = $"Id={id} AND CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<MyResultQuery> InsertOrUpdate(PayrollSocialSecurityBracketModel model)
    {
        var result = new MyResultQuery();

        var errorValidation = await Validate(model);
        if (errorValidation.Count > 0)
            return new MyResultQuery
            {
                Successfull = false,
                ValidationErrors = errorValidation
            };
        using (var conn = Connection)
        {
            var sQuery = "hr.Spc_PayrollSocialSecurityBracket_InsUpd";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Id = model.Id > 0 ? model.Id : 0,
                model.FiscalYearId,
                model.Name,
                model.InsurerId,
                model.WorkshopCode,
                model.WorkshopName,
                model.ContractNo,
                model.SocialSecurityTypeId,
                model.EmployerSCPercentage,
                model.EmployeeSCPercentage,
                model.UnEmploymentSCPercentage,
                model.MaxPensionableAmount,
                model.CreateDateTime,
                model.CreateUserId,
                model.IsActive,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }


        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<List<string>> Validate(PayrollSocialSecurityBracketModel model)
    {
        var error = new List<string>();

        if (model == null)
        {
            error.Add("مقادیر معتبر نمی باشد");
        }

        else
        {
            var checkExist = await CheckExist(model);

            if (checkExist)
                error.Add("سال مالی موردنظر قبلا به ثبت رسیده است");

            if (model.EmployeeSCPercentage == 0 && model.EmployerSCPercentage == 0 &&
                model.UnEmploymentSCPercentage == 0)
                error.Add("درصد بیمه را انتخاب نمایید !");
            if (model.EmployeeSCPercentage + model.EmployerSCPercentage + model.UnEmploymentSCPercentage > 99)
                error.Add("جمع درصد های  بیمه بزرگتر از 99 نمی تواند باشد !");
        }

        return error;
    }

    public async Task<bool> CheckExist(PayrollSocialSecurityBracketModel model)
    {
        var filter = "";
        if (model.Id == 0)
            filter = $"FiscalYearId='{model.FiscalYearId}' AND CompanyId={model.CompanyId}";
        else
            filter = $"FiscalYearId='{model.FiscalYearId}' AND ( Id<>{model.Id}) AND CompanyId={model.CompanyId}";
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "hr.PayrollSocialSecurityBracket",
                ColumnName = "Id",
                Filter = filter
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result > 0;
        }
    }


    public async Task<List<MyDropDownViewModel>> GetAllDataDropDown(string term, int companyId)
    {
        var filter = string.Empty;

        if (term.Trim().Length != 0)
            filter =
                $" CompanyId={companyId} AND IsActive=1 AND Id='{(int.TryParse(term, out _) ? term : "0")}' OR Name Like N'%{term}%'";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "hr.PayrollSocialSecurityBracket",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }
}