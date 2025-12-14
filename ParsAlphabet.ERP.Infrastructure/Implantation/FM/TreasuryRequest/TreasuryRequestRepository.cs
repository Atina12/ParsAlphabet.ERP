using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.FM.TreasuryRequest;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces.FM.TreasuryRequest;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.Currency;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYear;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.RoleWorkflowPermission;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.Stage;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.TreasuryRequest;

public class TreasuryRequestRepository : ITreasuryRequestRepository
{
    public readonly IHttpContextAccessor _accessor;
    private readonly ICompanyRepository _companyRepository;
    private readonly IConfiguration _config;
    private readonly CurrencyRepository _currencyRepository;
    private readonly FiscalYearRepository _fiscalYearRepository;
    private readonly ILoginRepository _loginRepository;
    private readonly RoleWorklfowPermissionRepository _roleWorklfowPermissionRepository;
    private readonly StageActionRepository _stageActionRepository;
    private readonly StageRepository _stageRepository;

    public TreasuryRequestRepository(
        IConfiguration config,
        IHttpContextAccessor accessor,
        ICompanyRepository companyRepository,
        CurrencyRepository currencyRepository,
        FiscalYearRepository fiscalYearRepository,
        StageActionRepository stageActionRepository,
        StageRepository stageRepository,
        ILoginRepository loginRepository,
        RoleWorklfowPermissionRepository roleWorklfowPermissionRepository
    )
    {
        _accessor = accessor;
        _config = config;
        _companyRepository = companyRepository;
        _currencyRepository = currencyRepository;
        _fiscalYearRepository = fiscalYearRepository;
        _stageActionRepository = stageActionRepository;
        _stageRepository = stageRepository;
        _loginRepository = loginRepository;
        _roleWorklfowPermissionRepository = roleWorklfowPermissionRepository;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));


    public GetColumnsViewModel GetColumns(int companyId)
    {
        var defaultCurrencyId = _companyRepository.GetDefaultCurrency(companyId).Result;
        var defaultCurrencyName = _currencyRepository.GetName(defaultCurrencyId).Result;

        var list = new GetColumnsViewModel
        {
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "actionId", FieldValue = "2", Operator = "==" } },
            AnswerCondition = "color:#da1717",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 4
                },
                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 5,
                    FilterType = "select2", FilterTypeApi = "/api/GN/BranchApi/getdropdown"
                },

                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true,
                    FilterType = "select2", FilterTypeApi = "/api/WF/WorkflowApi/getdropdown/0/6/1", Width = 10
                },

                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true,
                    FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageApi/getstagedropdownbyworkflowid/null/null/6/1/2/2", Width = 10
                },

                new()
                {
                    Id = "transactionDatePersian", Title = " تاریخ برگه ", IsPrimary = true, Type = (int)SqlDbType.Date,
                    Size = 20, IsDtParameter = true, IsFilterParameter = true, FilterType = "doublepersiandate",
                    Width = 6
                },
                new()
                {
                    Id = "no", Title = "شماره برگه", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 4
                },
                new()
                {
                    Id = "treasurySubject", Title = "موضوع دریافت / پرداخت", Type = (int)SqlDbType.Int,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10,
                    FilterType = "select2",
                    FilterTypeApi = "/api/FM/TreasurySubjectApi/gettreasurysubjectbystageid/0/6/1", InputType = "number"
                },

                new()
                {
                    Id = "noSeries", Title = "گروه تفصیل", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    IsFilterParameter = true, Width = 8, FilterType = "select2",
                    FilterTypeApi = "/api/GN/NoSeriesLineApi/getdropdown_noseries", InputType = "number"
                },
                new()
                {
                    Id = "accountDetail", Title = "نام حساب تفصیل", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, IsFilterParameter = true, Width = 8
                },
                new()
                {
                    Id = "createUser", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 6, FilterType = "select2",
                    FilterTypeApi = "api/GN/UserApi/getdropdown/2/false/false"
                },

                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.Date, Size = 20,
                    IsDtParameter = true, Width = 5
                },

                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageActionApi/getdropdown/6/2/1", Width = 5
                },

                new()
                {
                    Id = "bySystem", Title = "سیستمی", IsPrimary = true, Type = (int)SqlDbType.Bit, Size = 1,
                    IsDtParameter = true, Width = 3
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 5 },
                new() { Id = "actionId", IsPrimary = true },
                new() { Id = "stageClassId", IsPrimary = true, Type = (int)SqlDbType.TinyInt },
                new() { Id = "isDataEntry", IsPrimary = true },
                new() { Id = "currentInOut", IsPrimary = true },
                new() { Id = "workflowId", IsPrimary = true },
                new() { Id = "stageId", IsPrimary = true },
                new() { Id = "branchId", IsPrimary = true }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "displayTreasuryRequestSimple", Title = $"نمایش ({defaultCurrencyName})", ClassName = "",
                    IconName = "far fa-file-alt"
                },
                new()
                {
                    Name = "displayTreasuryRequestAdvance", Title = "نمایش (ارزی)", ClassName = "",
                    IconName = "far fa-file-alt"
                },
                new()
                {
                    Name = "printRequest", Title = "چاپ - درخواست", ClassName = "btn blue_1", IconName = "fa fa-print",
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "stageClassId", FieldValue = "1", Operator = "==" } }
                },
                new() { Name = "sep1", Title = "", IsSeparator = true },
                new()
                {
                    Name = "editTreasuryRequest", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green",
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "bySystem", FieldValue = "true", Operator = "!=" } }
                },
                new()
                {
                    Name = "deleteTreasuryRequest", Title = "حذف", ClassName = "",
                    IconName = "fa fa-trash color-maroon",
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "bySystem", FieldValue = "true", Operator = "!=" } }
                },
                new() { Name = "sep1", Title = "", IsSeparator = true },
                new()
                {
                    Name = "treasuryRequestDetailSimple", Title = $"تخصیص متغیرها ({defaultCurrencyName})",
                    ClassName = "", IconName = "fa fa-list color-green",
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "bySystem", FieldValue = "true", Operator = "!=" } }
                },
                new()
                {
                    Name = "treasuryRequestDetailAdvance", Title = "تخصیص متغیرها (ارزی)", ClassName = "",
                    IconName = "fa fa-list color-green",
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "bySystem", FieldValue = "true", Operator = "!=" } }
                },
                new()
                {
                    Name = "showStepLogsTreasury", Title = "گام ها", ClassName = "",
                    IconName = "fas fa-history color-green"
                }
            }
        };
        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model, int userId, byte roleId)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                GetColumns(model.CompanyId).DataColumns.Where(x => x.IsDtParameter && x.Id != "action")
                    .Select(z => z.Title))
        };
        var getPage = await GetPage(model, userId, roleId);
        result.Rows = from p in getPage.Data
            select new
            {
                p.Id,
                p.Branch,
                p.Workflow,
                p.Stage,
                p.TransactionDatePersian,
                p.No,
                p.TreasurySubject,
                p.NoSeries,
                p.AccountDetail,
                p.CreateUser,
                p.CreateDateTimePersian,
                p.ActionIdName,
                BySystem = p.BySystem ? "بلی" : "خیر"
            };
        return result;
    }

    public async Task<MyResultPage<List<TreasuryRequestGetPage>>> GetPage(NewGetPageViewModel model, int userId,
        byte roleId)

    {
        var result = new MyResultPage<List<TreasuryRequestGetPage>>
        {
            Data = new List<TreasuryRequestGetPage>()
        };

        var fromTransactionDateMiladi = (DateTime?)null;
        var toTransactionDateMiladi = (DateTime?)null;

        if (model.Filters == null) model.Filters = new List<FormKeyValue>();

        if (model.Filters.Any(x => x.Name == "transactionDatePersian"))
        {
            fromTransactionDateMiladi =
                model.Filters.FirstOrDefault(x => x.Name == "transactionDatePersian").Value.Split('-')[0]
                    .ToMiladiDateTime();
            toTransactionDateMiladi =
                model.Filters.FirstOrDefault(x => x.Name == "transactionDatePersian").Value.Split('-')[1]
                    .ToMiladiDateTime();
        }


        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("BranchId",
            model.Filters.Any(x => x.Name == "branchId")
                ? model.Filters.FirstOrDefault(x => x.Name == "branchId").Value
                : null);
        parameters.Add("StageId",
            model.Filters.Any(x => x.Name == "stage")
                ? model.Filters.FirstOrDefault(x => x.Name == "stage").Value
                : null);
        parameters.Add("TreasuryId",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("FromTreasuryDate", fromTransactionDateMiladi);
        parameters.Add("ToTreasuryDate", toTransactionDateMiladi);
        parameters.Add("ActionId",
            model.Filters.Any(x => x.Name == "actionIdName")
                ? model.Filters.FirstOrDefault(x => x.Name == "actionIdName").Value
                : null);
        parameters.Add("TreasurySubject",
            model.Filters.Any(x => x.Name == "treasurySubject")
                ? model.Filters.FirstOrDefault(x => x.Name == "treasurySubject").Value
                : null);
        parameters.Add("AccountDetail",
            model.Filters.Any(x => x.Name == "accountDetail")
                ? model.Filters.FirstOrDefault(x => x.Name == "accountDetail").Value
                : null);
        parameters.Add("NoSeriesId",
            model.Filters.Any(x => x.Name == "noSeries")
                ? model.Filters.FirstOrDefault(x => x.Name == "noSeries").Value
                : null);
        parameters.Add("WorkflowId",
            model.Filters.Any(x => x.Name == "workflow")
                ? model.Filters.FirstOrDefault(x => x.Name == "workflow").Value
                : null);
        parameters.Add("RoleId", roleId);

        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "TreasuryRequestApi",
            OprType = "VIWALL",
            UserId = userId
        };


        var checkAccessViewAll = await _loginRepository.GetAuthenticate(checkAuthenticate);


        if (model.Form_KeyValue[1]?.ToString() == null)
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
                    if (int.Parse(model.Form_KeyValue[1]?.ToString()) != 0 &&
                        model.Filters.Any(x => x.Name == "createUser"))
                        parameters.Add("CreateUserId",
                            model.Filters.Any(x => x.Name == "createUser")
                                ? model.Filters.FirstOrDefault(x => x.Name == "createUser").Value
                                : null);

                    else
                        parameters.Add("CreateUserId", int.Parse(model.Form_KeyValue[1]?.ToString()));
                }
            }
            else
            {
                if (int.Parse(model.Form_KeyValue[1]?.ToString()) != 0 && model.Filters.Any(x => x.Name == "createUser"))
                    if (model.Filters.FirstOrDefault(x => x.Name == "createUser").Value == userId.ToString())
                        parameters.Add("CreateUserId", model.Filters.FirstOrDefault(x => x.Name == "createUser").Value);
                    else
                        parameters.Add("CreateUserId", 0);

                else
                    parameters.Add("CreateUserId", int.Parse(model.Form_KeyValue[1]?.ToString()));
            }
        }


        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumns(model.CompanyId);
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasuryRequest_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<TreasuryRequestGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultPage<TreasuryRequestGetRecord>> GetRecordById(int id, int companyId, byte roleId)
    {
        var result = new MyResultPage<TreasuryRequestGetRecord>
        {
            Data = new TreasuryRequestGetRecord()
        };

        var parameters = new DynamicParameters();
        parameters.Add("TreasuryId", id);
        parameters.Add("CompanyId", companyId);
        parameters.Add("PageNo");
        parameters.Add("PageRowsCount");
        parameters.Add("BranchId");
        parameters.Add("StageId");
        parameters.Add("FromTreasuryDate");
        parameters.Add("ToTreasuryDate");
        parameters.Add("RoleId", roleId);

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasuryRequest_GetPage]";
            result.Data = await conn.QueryFirstOrDefaultAsync<TreasuryRequestGetRecord>(sQuery, parameters,
                commandType: CommandType.StoredProcedure);
        }

        if (result.Data != null)
        {
            var getTreasuryAction = new GetAction();
            getTreasuryAction.CompanyId = companyId;
            getTreasuryAction.StageId = result.Data.StageId;
            getTreasuryAction.ActionId = result.Data.ActionId;
            getTreasuryAction.WorkflowId = result.Data.WorkflowId;
            var stageStep = await _stageActionRepository.GetAction(getTreasuryAction);

            result.Data.Priority = stageStep.Priority;
            result.Data.IsDataEntry = stageStep.IsDataEntry;
            result.Data.IsTreasurySubject = stageStep.IsTreasurySubject;
        }

        return result;
    }

    public async Task<TreasuryRequestResult> Insert(TreasuryRequestModel model, byte roleId)
    {
        var result = new TreasuryRequestResult();

        var validationError = await ValidateSaveTreasuryRequest(model);

        if (validationError.Count > 0)
            return new TreasuryRequestResult
            {
                Status = -98,
                Successfull = false,
                ValidationErrors = validationError
            };


        model.CreateDatetime = DateTime.Now;
        model.DocumentTypeId = null;

        var getPersonAction = new GetAction();
        getPersonAction.CompanyId = model.CompanyId;
        getPersonAction.StageId = model.StageId;
        getPersonAction.Priority = 1;
        getPersonAction.WorkflowId = model.WorkflowId;
        var stageAction = await _stageActionRepository.GetAction(getPersonAction);
        model.ActionId = stageAction.ActionId;
        var hasPermission = await _roleWorklfowPermissionRepository.CheckRoleWorkflowPermission(model.WorkflowId,
            model.BranchId, model.StageId, stageAction.ActionId, roleId);

        if (hasPermission == 1)
        {
            using (var conn = Connection)
            {
                var sQuery = "[fm].[Spc_TreasuryRequest_InsUpd]";
                conn.Open();
                var output = await conn.ExecuteScalarAsync<int>(sQuery, new
                {
                    model.Id,
                    model.BranchId,
                    model.TreasurySubjectId,
                    model.DocumentTypeId,
                    model.CreateUserId,
                    Note = model.Note.ConvertArabicAlphabet(),
                    model.CompanyId,
                    model.WorkflowId,
                    model.CreateBySystem,
                    model.StageId,
                    model.NoSeriesId,
                    model.AccountDetailId,
                    model.CurrentInout,
                    model.TreasuryDate,
                    ParentWorkflowCategoryId = 0,
                    model.ActionId
                }, commandType: CommandType.StoredProcedure);
                conn.Close();

                result.Id = output;
                result.Successfull = result.Id > 0;
                result.Status = result.Successfull ? 100 : -100;
                result.StatusMessage = "عملیات با موفقیت انجام پذیرفت";

                if (result.Successfull)
                {
                    var updateStepModel = new UpdateAction
                    {
                        RequestActionId = 2,
                        IdentityId = int.Parse(result.Id.ToString()),
                        StageId = model.StageId,
                        CompanyId = model.CompanyId,
                        UserId = (int)model.CreateUserId,
                        WorkflowId = model.WorkflowId
                    };
                    await UpdateTreasuryRequestStep(updateStepModel, OperationType.Insert, roleId);
                }
            }
        }
        else
        {
            var stage = await _stageRepository.GetName(model.StageId);
            result.Successfull = false;
            result.StatusMessage = $"{stage} دسترسی ندارید ";
        }

        return result;
    }

    public async Task<TreasuryRequestResult> Update(TreasuryRequestModel model)
    {
        var validationError = await ValidateSaveTreasuryRequest(model);

        if (validationError.Count > 0)
            return new TreasuryRequestResult
            {
                Status = -98,
                Successfull = false,
                ValidationErrors = validationError
            };


        model.DocumentTypeId = null;
        var result = new TreasuryRequestResult();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasuryRequest_InsUpd]";
            conn.Open();
            var output = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                model.Id,
                model.BranchId,
                model.TreasurySubjectId,
                model.DocumentTypeId,
                model.CreateUserId,
                Note = model.Note.ConvertArabicAlphabet(),
                model.CompanyId,
                model.WorkflowId,
                model.CreateBySystem,
                model.StageId,
                model.NoSeriesId,
                model.AccountDetailId,
                model.CurrentInout,
                model.TreasuryDate,
                model.ActionId,
                ParentWorkflowCategoryId = 0
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            output = (int)(output > 0 ? model.Id : output);
            result.Id = output;
            result.Successfull = result.Id > 0;
            result.Status = result.Successfull ? 100 : -100;
            result.StatusMessage = "عملیات با موفقیت انجام پذیرفت";
        }

        return result;
    }

    public async Task<TreasuryRequestResult> Delete(int id, int companyId, byte roleId)
    {
        var result = new TreasuryRequestResult();

        var validationError = await ValidateDeleteStep(id, companyId, OperationType.Delete, roleId);
        if (validationError.Count > 0)
        {
            result.Successfull = false;
            result.ValidationErrors = validationError;
            return result;
        }

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_Treasury_DeleteTreasury]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<TreasuryRequestResult>(
                sQuery, new
                {
                    Id = id,
                    CompanyId = companyId
                }, commandType: CommandType.StoredProcedure);
        }


        result.Successfull = result.Output != 0;
        result.Status = result.Successfull ? 100 : -100;
        result.ValidationErrors = result.Successfull
            ? new List<string> { "عملیات حذف با موفقیت انجام شد" }
            : new List<string> { "عملیات حذف با خطا مواجه شد" };
        return result;
    }

    public async Task<string> GetTransactionDatePersian(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<string>(sQuery, new
            {
                TableName = "fm.treasury",
                ColumnName = "FORMAT(DocumentDate,'yyyy/MM/dd','fa')",
                Filter =
                    $"Id={id} AND companyId={companyId}  AND stageId in (SELECT Id FROM wf.Stage s WHERE s.WorkflowCategoryId=6 AND s.StageClassId=1 AND s.IsActive=1)"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<bool> CheckExist(int id, int companyId, int userId, byte roleId)
    {
        var filter = "";
        //بررسی دسترسی براساس نقش و جریان کار و مرحله
        var hasPermission =
            await _roleWorklfowPermissionRepository.CheckRoleWorkflowPermissionByHeaderId(id, 6, roleId);

        if (hasPermission == 1)
        {
            var checkAuthenticate = new CheckAuthenticateViewModel
            {
                ControllerName = "TreasuryRequestApi",
                OprType = "VIWALL",
                UserId = userId
            };


            var checkAccessViewAll = await _loginRepository.GetAuthenticate(checkAuthenticate);
            filter =
                $"Id={id} AND companyId={companyId} AND stageId in (SELECT Id FROM wf.Stage s WHERE s.WorkflowCategoryId=6 AND s.StageClassId=1 AND s.IsActive=1)";

            if (!checkAccessViewAll.Successfull)

                filter += $" AND CreateUserId={userId}";
        }
        else
        {
            filter = "Id = 0";
        }

        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "fm.treasury",
                ColumnName = "Id",
                Filter = filter
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result > 0;
        }
    }

    public async Task<TreasuryRequestResult> UpdateInLine(TreasuryRequestModelUpdateInline model)
    {
        #region چک کردن  وضعیت دوره مالی

        var validationError = await ValidateSaveNewTreasuryRequestUpdateInline(model);

        if (validationError.Count > 0)
            return new TreasuryRequestResult
            {
                Status = -98,
                Successfull = false,
                ValidationErrors = validationError
            };

        #endregion

        var result = new TreasuryRequestResult();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasuryRequest_UpdateInline]";
            conn.Open();
            var output = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TreasuryId = model.Id,
                model.TreasurySubjectId,
                model.TreasuryDate,
                model.AccountDetailId,
                model.NoSeriesId,
                Note = model.Note.ConvertArabicAlphabet(),
                model.CreateUserId,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            output = (int)(output > 0 ? model.Id : output);
            result.Id = output;
            result.Successfull = result.Id > 0;
            result.Status = result.Successfull ? 100 : -100;
            result.StatusMessage = "عملیات با موفقیت انجام پذیرفت";
        }

        return result;
    }

    public async Task<TreasuryRequestResultStatus> UpdateTreasuryRequestStep(UpdateAction model,
        OperationType operationType, byte roleId)
    {
        var validateResult = new List<string>();

        if (operationType == OperationType.Update)
            validateResult = await ValidateUpdateStep(model, OperationType.Insert, roleId);

        var result = new TreasuryRequestResultStatus();
        if (validateResult.ListHasRow())
        {
            var resultValidate = new TreasuryRequestResultStatus();
            resultValidate.Successfull = false;
            resultValidate.ValidationErrors = validateResult;
            return resultValidate;
        }

        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_StageActionLog_Ins]";
            conn.Open();

            var output = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TransactionId = model.IdentityId,
                    model.WorkflowCategoryId,
                    model.WorkflowId,
                    model.StageId,
                    ActionId = model.RequestActionId,
                    model.UserId,
                    CreateDateTime = model.StepDateTime,
                    model.CompanyId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            result.Id = output;
        }

        result.Successfull = result.Id > 0;
        result.Status = result.Successfull ? 100 : -100;
        result.ValidationErrors.Add(result.StatusMessage);

        if (result.Successfull)
        {
            using (var conn = Connection)
            {
                var sQuery = "pb.Spc_Tables_UpdItem_Number";
                conn.Open();
                var updateAction = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
                {
                    TableName = "fm.treasury",
                    ColumnName = "actionid",
                    Value = model.RequestActionId,
                    Filter = $"Id={model.IdentityId}"
                }, commandType: CommandType.StoredProcedure);

                var updateActionTreasuryLine = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
                {
                    TableName = "fm.TreasuryLine",
                    ColumnName = "actionid",
                    Value = model.RequestActionId,
                    Filter = $"HeaderId={model.IdentityId}"
                }, commandType: CommandType.StoredProcedure);


                conn.Close();
            }

            result.StatusMessage = "تغییرات با موفقیت انجام شد";
        }

        return result;
    }

    public async Task<List<string>> ValidateUpdateStep(UpdateAction model, OperationType operationType, byte roleId)
    {
        var error = new List<string>();

        if (model == null)
        {
            error.Add("درخواست معتبر نمی باشد");
            return error;
        }

        await Task.Run(async () =>
        {
            if (operationType == OperationType.Insert || operationType == OperationType.Update)
            {
                var treasuryLines = await GetTreasuryLineByTreasuryId(model.IdentityId);

                #region آیا گام درخواستی، معتبر است یا نه

                var treasuryAction = new GetAction();

                treasuryAction.StageId = model.StageId;
                treasuryAction.ActionId = model.RequestActionId;
                treasuryAction.WorkflowId = model.WorkflowId;
                var requestTreasuryStageAction = await _stageActionRepository.GetAction(treasuryAction);

                #region برگه جاری دارای لاین هست یا نیست

                if (treasuryLines == 0 && requestTreasuryStageAction.IsLastConfirmHeader)
                    error.Add("برگه دارای سطر نمی باشد مجاز به تغییر گام نمی باشید");

                #endregion

                var currentActionId = await GetActionIdByIdentityId(model.IdentityId);
                treasuryAction.StageId = model.StageId;
                treasuryAction.ActionId = currentActionId;
                treasuryAction.WorkflowId = model.WorkflowId;
                var currentTreasuryStageAction = await _stageActionRepository.GetAction(treasuryAction);
                var expectedPriority = 0;

                if (currentTreasuryStageAction.Priority < requestTreasuryStageAction.Priority)
                    expectedPriority = currentTreasuryStageAction.Priority + 1;
                else if (currentTreasuryStageAction.Priority > requestTreasuryStageAction.Priority)
                    expectedPriority = currentTreasuryStageAction.Priority - 1;

                if (expectedPriority != 0 && expectedPriority != requestTreasuryStageAction.Priority)
                    error.Add("گام درخواست شده معتبر نمی باشد");

                #endregion


                var treasuryStage = await _stageRepository.GetStageById(model.StageId);

                if (treasuryStage.InOut == 3)
                {
                    #region جمع قیمت سطرهای برگه جاری با inout=3 همخوانی دارد یا نه

                    var DifferenceInOutLines = await GetTreasuryLineDifferenceInOutByTreasuryId(model.IdentityId);
                    if (DifferenceInOutLines.Any())
                    {
                        var SumTreasuryLine =
                            Math.Abs(DifferenceInOutLines.Where(a => a.CurrentInOut == 1).Sum(a => a.Amount)) -
                            Math.Abs(DifferenceInOutLines.Where(a => a.CurrentInOut == 2).Sum(a => a.Amount));
                        var sd = Math.Abs(DifferenceInOutLines.Sum(a => a.Amount));
                        if (SumTreasuryLine != 0)
                            error.Add("جمع سطرها همخوانی ندارد ، مجاز به تغییر گام نمی باشید");
                    }

                    #endregion
                }


                #region درصورت مرجع بودن برگه درخواست آیا وضعیت برگه تایید شده یا خیر

                var targetAction = await GetCurrentTreasuryAction(model.IdentityId, 6, model.CompanyId, 1);
                targetAction = targetAction.Where(x => x.isLastConfirmHeader).ToList();

                if (targetAction.ListHasRow())
                    if (targetAction.Count > 0)
                    {
                        var stringIds = targetAction.Select(x => x.Id).AsList();
                        error.Add(
                            "شناسه های خزانه متصل به این درخواست در حالت تائید شده می باشد  ، مجاز به تغییر گام نمی باشید :");
                        error.Add(string.Join(',', stringIds));
                    }

                #endregion


                #region بررسی وضعیت دوره مالی

                var treasury = await GetRecordById(model.IdentityId, model.CompanyId, roleId);

                var resultCheckFiscalYear =
                    await _fiscalYearRepository.GetFicalYearStatusByDate(treasury.Data.TransactionDate,
                        model.CompanyId);
                if (!resultCheckFiscalYear.Successfull)
                    error.Add(resultCheckFiscalYear.StatusMessage);

                #endregion
            }
        });

        return error;
    }

    public async Task<MyResultDataQuery<List<TreasuryRequestStepLogList>>> GetTreasuryStepList(int treasuryId,
        int companyId)
    {
        var result = new MyResultDataQuery<List<TreasuryRequestStepLogList>>
        {
            Data = new List<TreasuryRequestStepLogList>()
        };

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasuryActionLog_SelectTreasuryActionLog]";
            conn.Open();
            result.Data = (await conn.QueryAsync<TreasuryRequestStepLogList>(sQuery, new
            {
                TreasuryId = treasuryId
            }, commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<TreasuryRequestInfo> GetTreasuryRequestInfo(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<TreasuryRequestInfo>(sQuery, new
            {
                TableName = "fm.Treasury",
                ColumnName = "Id,StageId,ActionId,DocumentDate,WorkflowId,ParentWorkflowCategoryId,InOut",
                Filter = $"Id={id} AND CompanyId={companyId} "
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<List<string>> ValidateSaveTreasuryRequest(TreasuryRequestModel model)
    {
        var error = new List<string>();

        if (model == null)
        {
            error.Add("مقادیر معتبر نمی باشد");
            return error;
        }

        await Task.Run(async () =>
        {
            #region بررسی وضعیت دوره مالی

            var resultCheckFiscalYear =
                await _fiscalYearRepository.GetFicalYearStatusByDate(model.TreasuryDate, model.CompanyId);
            if (!resultCheckFiscalYear.Successfull)
                error.Add(resultCheckFiscalYear.StatusMessage);

            #endregion
        });
        return error;
    }

    public async Task<int> GetTreasuryLineByTreasuryId(long HeaderId)
    {
        using (var conn = Connection)
        {
            var result = 0;
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            result = await conn.QueryFirstOrDefaultAsync<int>(sQuery, new
            {
                TableName = "fm.TreasuryLine",
                ColumnName = "Count(HeaderId) count",
                Filter = $"HeaderId={HeaderId}",
                OrderBy = ""
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<byte> GetActionIdByIdentityId(int IdentityId)
    {
        using (var conn = Connection)
        {
            byte result = 0;
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            result = await conn.QueryFirstOrDefaultAsync<byte>(sQuery, new
            {
                TableName = "fm.treasury",
                ColumnName = "actionid",
                Filter = $"Id={IdentityId}",
                OrderBy = ""
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<List<TreasuryRequestLineDifference>> GetTreasuryLineDifferenceInOutByTreasuryId(int treasuryId)
    {
        var result = new List<TreasuryRequestLineDifference>();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasuryLine_Difference]";
            conn.Open();

            result = (await conn.QueryAsync<TreasuryRequestLineDifference>(sQuery, new
            {
                HeaderId = treasuryId
            }, commandType: CommandType.StoredProcedure)).ToList();

            conn.Close();

            var res = result.GroupBy(a => a.CurrentInOut).ToList();

            return result;
        }
    }

    public async Task<List<CurrentTreasuryRequestStageAction>> GetCurrentTreasuryAction(long id,
        byte ParentWorkflowCategoryId, int companyId, byte getType)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_Get_TreasuryActionConfig]";
            conn.Open();

            var result = await conn.QueryAsync<CurrentTreasuryRequestStageAction>(sQuery, new
            {
                identityId = id,
                ParentWorkflowCategoryId,
                CompanyId = companyId,
                GetType = getType
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result.AsList();
        }
    }

    public async Task<List<string>> ValidateDeleteStep(int id, int companyId, OperationType operationType, byte roleId)
    {
        var error = new List<string>();

        if (id == 0 || companyId == 0)
            error.Add("اطلاعات ورودی معتبر نمی باشد");
        else
            await Task.Run(async () =>
            {
                if (operationType == OperationType.Delete)
                {
                    var treasury = await GetRecordById(id, companyId, roleId);

                    #region بررسی حذف با نقش و جریان کار و مرحله

                    var hasPermission = await _roleWorklfowPermissionRepository.CheckRoleWorkflowPermission(
                        treasury.Data.WorkflowId, treasury.Data.BranchId, treasury.Data.StageId, treasury.Data.ActionId,
                        roleId);
                    if (hasPermission == 0)
                    {
                        var stage = await _stageRepository.GetName(treasury.Data.StageId);
                        error.Add($"{stage} دسترسی ندارید ");
                    }

                    #endregion

                    var getTreasuryAction = new GetAction
                    {
                        CompanyId = companyId,
                        StageId = treasury.Data.StageId,
                        ActionId = treasury.Data.ActionId,
                        WorkflowId = treasury.Data.WorkflowId
                    };

                    var treasuryStageAction = _stageActionRepository.GetAction(getTreasuryAction).Result;

                    // 1 - check IsDeleteHeader with StageId 
                    if (!treasuryStageAction.IsDeleteHeader)
                        error.Add("مجاز به حذف برگه خزانه در این مرحله و گام نمی باشید");

                    #region برگه جاری مرجع است؟

                    var target = await GetCurrentTreasuryAction(id, 6, companyId, 1);
                    if (target.ListHasRow()) error.Add("برگه جاری مرجع می باشد، مجاز به حذف نمی باشید");

                    #endregion


                    #region بررسی وضعیت دوره مالی

                    var resultCheckFiscalYear =
                        await _fiscalYearRepository.GetFicalYearStatusByDate(treasury.Data.TransactionDate, companyId);
                    if (!resultCheckFiscalYear.Successfull)
                        error.Add(resultCheckFiscalYear.StatusMessage);

                    #endregion
                }
            });
        return error;
    }

    public async Task<List<string>> ValidateSaveNewTreasuryRequestUpdateInline(TreasuryRequestModelUpdateInline model)
    {
        var error = new List<string>();

        if (model == null)
        {
            error.Add("مقادیر معتبر نمی باشد");
            return error;
        }

        await Task.Run(async () =>
        {
            #region بررسی وضعیت دوره مالی

            var resultCheckFiscalYear =
                await _fiscalYearRepository.GetFicalYearStatusByDate(model.TreasuryDate, model.CompanyId);
            if (!resultCheckFiscalYear.Successfull)
                error.Add(resultCheckFiscalYear.StatusMessage);

            #endregion
        });
        return error;
    }
}