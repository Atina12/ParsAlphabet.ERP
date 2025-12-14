using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.HR.PayrollTaxBracket;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.HR.PayrollTaxBracket;

public class PayrollTaxBracketRepository :
    BaseRepository<PayrollTaxBracketModel, int, string>,
    IBaseRepository<PayrollTaxBracketModel, int, string>
{
    public PayrollTaxBracketRepository(IConfiguration config)
        : base(config)
    {
    }

    #region Header

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
                    IsFilterParameter = true, IsPrimary = true, Width = 22
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
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" },
                new()
                {
                    Name = "addpayrolltaxbracket", Title = "افزودن آیتم", ClassName = "",
                    IconName = "fas fa-plus color-blue"
                }
            }
        };
        return list;
    }

    public async Task<MyResultPage<List<PayrollTaxBracketGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<PayrollTaxBracketGetPage>>();
        result.Data = new List<PayrollTaxBracketGetPage>();


        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "name")
                ? model.Filters.FirstOrDefault(x => x.Name == "name").Value
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
            var sQuery = "[hr].[Spc_PayrollTaxBracket_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<PayrollTaxBracketGetPage>(sQuery, parameters,
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
                p.Name,
                p.FiscalYear,
                p.UserFullName,
                p.CreateDateTimePersian,
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };
        return result;
    }

    public async Task<MyResultPage<PayrollTaxBracketGetRecord>> GetRecordById(int id, int companyId)
    {
        var result = new MyResultPage<PayrollTaxBracketGetRecord>();
        result.Data = new PayrollTaxBracketGetRecord();

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            conn.Open();
            result.Data = await conn.QueryFirstOrDefaultAsync<PayrollTaxBracketGetRecord>(sQuery, new
            {
                TableName = "hr.PayrollTaxBracket",
                Filter = $"Id={id} AND CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultQuery> InsertOrUpdate(PayrollTaxBracketModel model)
    {
        var result = new MyResultQuery();

        var validationError = await CheckValidation(model);

        if (validationError.Count > 0)
            return new MyResultQuery
            {
                Status = -98,
                Successfull = false,
                ValidationErrors = validationError
            };
        using (var conn = Connection)
        {
            var sQuery = "[hr].[Spc_PayrollTaxBracket_InsUpd]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Id = model.Id > 0 ? model.Id : 0,
                model.FiscalYearId,
                model.Name,
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

    public async Task<List<string>> CheckValidation(PayrollTaxBracketModel model)
    {
        var errors = new List<string>();

        if (model == null)
        {
            errors.Add("مقادیر معتبر نمی باشد");
        }

        else
        {
            var checkExist = await CheckExist(model);

            if (checkExist)
                errors.Add("سال مالی  موردنظر قبلا به ثبت رسیده است");
        }

        return errors;
    }

    public async Task<bool> CheckExist(PayrollTaxBracketModel model)
    {
        var filter = "";
        if (model.Id == 0)
            filter = $"FiscalYearId=N'{model.FiscalYearId}' AND CompanyId={model.CompanyId}";
        else
            filter = $"FiscalYearId=N'{model.FiscalYearId}' AND ( Id<>{model.Id}) AND CompanyId={model.CompanyId}";
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "hr.PayrollTaxBracket",
                ColumnName = "Id",
                Filter = filter
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result > 0;
        }
    }

    public async Task<MyResultStatus> Delete(int keyvalue, int companyId)
    {
        var result = new MyResultStatus();
        var output = 0;
        var isDeleted = await ValidationDelete(keyvalue, companyId);
        if (isDeleted)
            return new MyResultStatus
            {
                Status = -98,
                StatusMessage = "کسور مورد نظر در تعریف کالا و خدمات استفاده شده ،است امکان حذف ندارید"
            };

        using (var conn = Connection)
        {
            conn.Open();
            var sQuery = "[hr].[Spc_PayrollTaxBracket_Delete]";
            output = await conn.QueryFirstOrDefaultAsync<int>(
                sQuery, new
                {
                    Id = keyvalue
                }, commandType: CommandType.StoredProcedure);

            conn.Close();
        }

        result.Successfull = output > 0;
        result.Status = result.Successfull ? 100 : -100;
        result.StatusMessage = !result.Successfull ? "عملیات حذف با مشکل مواجه شد" : "";

        return result;
    }

    public async Task<bool> ValidationDelete(int id, int companyId)
    {
        var filter = $"PayrollTaxId=N'{id}' AND CompanyId={companyId}";

        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "wh.Item",
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
                    TableName = "hr.PayrollTaxBracket",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    #endregion

    #region Line

    public async Task<MyResultPage<PayrollTaxBracketLineListGetRecord>> GetPayrollTaxBracketLineList(int id,
        int companyId)
    {
        var result = new MyResultPage<PayrollTaxBracketLineListGetRecord>();
        result.Data = new PayrollTaxBracketLineListGetRecord();

        using (var conn = Connection)
        {
            var sQuery = "[Hr].[Spc_PayrollTaxBracket_GetList]";
            conn.Open();

            result.Data = await conn.QueryFirstOrDefaultAsync<PayrollTaxBracketLineListGetRecord>(sQuery, new
            {
                Id = id,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }


        return result;
    }

    public async Task<PayrollTaxBracketLineList> GetPayrollTaxBracketLineRecord(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<PayrollTaxBracketLineList>(sQuery, new
            {
                TableName = "hr.PayrollTaxBracketLine",
                Filter = $"Id={id}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
            return result;
        }
    }

    public async Task<List<string>> CheckValidationLine(PayrollTaxBracketLineModel model)
    {
        var errors = new List<string>();

        if (model == null)
            errors.Add("مقادیر معتبر نمی باشد");

        else
            await Task.Run(async () =>
            {
                if (model.EndAmount < model.StartAmount) errors.Add("مبلغ پایان نمی تواند از مبلغ شروع کمتر باشد");

                var resultCheckAmount = await CheckPayrollTaxBracketLine_Range(model.Id, model.HeaderId,
                    model.StartAmount, model.EndAmount, model.CompanyId);

                if (resultCheckAmount > 0) errors.Add("نقطه ی شروع و پایان محدوده ی  وارد شده وجود دارد");

                var validationDelete = await ExistCheck_PayrollTaxBracketLine(model, OperationType.Insert);

                if (validationDelete > 0)
                    errors.Add("سطر با این اطلاعات قبلا ثبت شده است");
            });

        return errors;
    }

    public async Task<int> CheckPayrollTaxBracketLine_Range(short id, short headerId, long startAmount, long endAmount,
        int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[hr].[Spc_PayrollTaxBracketLine_Range]";

            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                HeaderId = headerId,
                Id = id,
                StartAmount = startAmount,
                EndAmount = endAmount,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<MyResultQuery> PayrollTaxBracketLineSave(PayrollTaxBracketLineModel model)
    {
        var result = new MyResultQuery();

        var validationError = await CheckValidationLine(model);

        if (validationError.Count > 0)
            return new MyResultQuery
            {
                Status = -98,
                Successfull = false,
                ValidationErrors = validationError
            };

        using (var conn = Connection)
        {
            var sQuery = "[hr].[Spc_PayrollTaxBracketLine_InsUpd]";

            conn.Open();
            var outPut = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                model.Id,
                model.HeaderId,
                model.RowNumber,
                model.StartAmount,
                model.EndAmount,
                model.TaxPercentage,
                model.CreateDateTime,
                model.CreateUserId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Id = outPut;
            result.Successfull = outPut > 0 ? true : false;
            result.Status = outPut > 0 ? 100 : -100;
            result.StatusMessage = "عملیات ثبت  با موفقیت انجام پذیرفت";
        }

        return result;
    }

    public async Task<MyResultStatus> PayrollTaxBracketLineDelete(PayrollTaxBracketLineModel model)
    {
        var result = new MyResultStatus();
        var validationDelete = await ExistCheck_PayrollTaxBracketLine(model, OperationType.Delete);
        if (validationDelete > 0)
        {
            result.Successfull = false;
            result.StatusMessage = "اابتدا سطرهای قبلی را حذف نمایید";
        }
        else
        {
            using (var conn = Connection)
            {
                var sQuery = "pb.Spc_Tables_DelRecordWithFilter";
                conn.Open();
                result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(
                    sQuery, new
                    {
                        TableName = "hr.PayrollTaxBracketLine",
                        Filter = $"HeaderId = N'{model.HeaderId}'  AND RowNumber = N'{model.RowNumber}'  "
                    }, commandType: CommandType.StoredProcedure);


                conn.Close();
            }

            result.Successfull = result.Status == 100;
            result.StatusMessage = " حذف با موفقیت انجام شد";
        }

        return result;
    }

    public async Task<long> ExistCheck_PayrollTaxBracketLine(PayrollTaxBracketLineModel model,
        OperationType operationType)
    {
        var filter = "";
        if (operationType == OperationType.Insert)
            filter =
                $" HeaderId={model.HeaderId}  AND StartAmount= {model.StartAmount} AND EndAmount= {model.EndAmount} AND TaxPercentage= {model.TaxPercentage}";
        else
            filter = $" HeaderId={model.HeaderId}  AND RowNumber > {model.RowNumber}";
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<long>(sQuery, new
            {
                TableName = "hr.PayrollTaxBracketLine",
                ColumnName = "Id",
                Filter = filter,
                OrderBy = ""
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<decimal> GetNewStartAmount(int headerId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";

            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "hr.PayrollTaxBracketLine",
                ColumnName = "ISNULL(max(EndAmount),0)+1",
                Filter = $"HeaderId={headerId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    #endregion
}