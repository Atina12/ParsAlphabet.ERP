using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.FM.NewTreasury;
using ParsAlphabet.ERP.Application.Dtos.FM.NewTreasuryLine;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces.FM.NewTreasury;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.Currency;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYear;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.RoleWorkflowPermission;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.Stage;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.NewTreasury;

public class NewTreasuryRepository : INewTreasuryRepository
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

    public NewTreasuryRepository(
        IConfiguration config,
        IHttpContextAccessor accessor,
        ICompanyRepository companyRepository,
        StageActionRepository stageActionRepository,
        FiscalYearRepository fiscalYearRepository,
        CurrencyRepository currencyRepository,
        StageRepository stageRepository,
        ILoginRepository loginRepository,
        RoleWorklfowPermissionRepository roleWorklfowPermissionRepository)
    {
        _accessor = accessor;
        _config = config;
        _companyRepository = companyRepository;
        _currencyRepository = currencyRepository;
        _stageActionRepository = stageActionRepository;
        _fiscalYearRepository = fiscalYearRepository;
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
                    Id = "requestId", Title = "شناسه مرجع", IsPrimary = true, Type = (int)SqlDbType.Int,
                    IsDtParameter = true, Width = 6, IsFilterParameter = true, FilterType = "number"
                },
                new()
                {
                    Id = "branchId", Title = "شعبه", IsPrimary = true, Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsFilterParameter = true, FilterType = "select2", FilterTypeApi = "/api/GN/BranchApi/getdropdown",
                    Width = 5
                },
                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 5
                },
                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 8, IsFilterParameter = true,
                    FilterType = "select2", FilterTypeApi = "/api/WF/WorkflowApi/getdropdown/0/6/3"
                },

                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 8, IsFilterParameter = true,
                    FilterType = "select2", FilterTypeApi = "/api/WF/StageApi/getdropdown/6/3/2/1"
                },

                new() { Id = "workflowId", IsPrimary = true },

                new() { Id = "stageId", IsPrimary = true },

                new()
                {
                    Id = "transactionDatePersian", Title = " تاریخ برگه ", Type = (int)SqlDbType.Date, Size = 20,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "doublepersiandate", Width = 5
                },
                new()
                {
                    Id = "no", Title = "شماره برگه", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    FilterType = "number", Width = 4
                },
                new()
                {
                    Id = "journalId", Title = "شناسه سند حسابداری", IsPrimary = true, Type = (int)SqlDbType.Int,
                    IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "treasurySubject", Title = "موضوع دریافت / پرداخت", Type = (int)SqlDbType.Int,
                    IsDtParameter = true, IsFilterParameter = true, Width = 9,
                    FilterType = "select2",
                    FilterTypeApi = "/api/FM/TreasurySubjectApi/gettreasurysubjectbystageid/0/6/3", InputType = "number"
                },
                new()
                {
                    Id = "noSeries", Title = "گروه تفصیل", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    IsFilterParameter = true, Width = 6, FilterType = "select2",
                    FilterTypeApi = "/api/GN/NoSeriesLineApi/getdropdown_noseries", InputType = "number"
                },
                new()
                {
                    Id = "accountDetail", Title = "نام حساب تفصیل", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, IsFilterParameter = true, Width = 6
                },
                new()
                {
                    Id = "documentType", Title = "نوع سند", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 5
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.VarChar, Size = 20,
                    IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "createUser", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 6, FilterType = "select2",
                    FilterTypeApi = "api/GN/UserApi/getdropdown/2/false/false"
                },

                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true,
                    FilterType = "select2", FilterTypeApi = "/api/WF/StageActionApi/getdropdown/6/2/1,3", Width = 4
                },

                new()
                {
                    Id = "bySystem", Title = "سیستمی", IsPrimary = true, Type = (int)SqlDbType.Bit, Size = 1,
                    IsDtParameter = true, Width = 4
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 5 },
                new() { Id = "actionId", IsPrimary = true },
                new() { Id = "stageClassId", IsPrimary = true, Type = (int)SqlDbType.TinyInt },
                new() { Id = "isDataEntry", IsPrimary = true },
                new() { Id = "currentInOut", IsPrimary = true },
                new() { Id = "parentworkflowcategoryId", IsPrimary = true }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "displaySimple", Title = $"نمایش ({defaultCurrencyName})", ClassName = "",
                    IconName = "far fa-file-alt"
                },
                new() { Name = "displayAdvance", Title = "نمایش (ارزی)", ClassName = "", IconName = "far fa-file-alt" },
                new()
                {
                    Name = "print", Title = "چاپ - برگه", ClassName = "btn blue_1", IconName = "fa fa-print",
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "stageClassId", FieldValue = "3", Operator = "==" } }
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
                    Name = "edittreasury", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green",
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "bySystem", FieldValue = "true", Operator = "!=" } }
                },
                new()
                {
                    Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon",
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "bySystem", FieldValue = "true", Operator = "!=" } }
                },
                new() { Name = "sep1", Title = "", IsSeparator = true },
                new()
                {
                    Name = "treasuryDetailSimple", Title = $"تخصیص متغیرها ({defaultCurrencyName})", ClassName = "",
                    IconName = "fa fa-list color-green",
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "bySystem", FieldValue = "true", Operator = "!=" } }
                },
                new()
                {
                    Name = "treasuryDetailAdvance", Title = "تخصیص متغیرها (ارزی)", ClassName = "",
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
                p.RequestId,
                p.Branch,
                p.Workflow,
                p.Stage,
                p.TransactionDatePersian,
                p.No,
                p.JournalId,
                p.TreasurySubject,
                p.NoSeries,
                p.AccountDetail,
                p.DocumentType,
                p.CreateDateTimePersian,
                p.CreateUser,
                p.ActionIdName,
                BySystem = p.BySystem ? "بلی" : "خیر"
            };
        return result;
    }

    public async Task<MyResultPage<List<NewTreasuryGetPage>>> GetPage(NewGetPageViewModel model, int userId,
        byte roleId)
    {
        var result = new MyResultPage<List<NewTreasuryGetPage>>
        {
            Data = new List<NewTreasuryGetPage>()
        };


        var fromTreasuryDateMiladi = (DateTime?)null;
        var toTreasuryDateMiladi = (DateTime?)null;

        if (model.Filters == null) model.Filters = new List<FormKeyValue>();

        if (model.Filters.Any(x => x.Name == "transactionDatePersian"))
        {
            fromTreasuryDateMiladi =
                model.Filters.FirstOrDefault(x => x.Name == "transactionDatePersian").Value.Split('-')[0]
                    .ToMiladiDateTime();
            toTreasuryDateMiladi =
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
        parameters.Add("RequestId",
            model.Filters.Any(x => x.Name == "requestId")
                ? model.Filters.FirstOrDefault(x => x.Name == "requestId").Value
                : null);
        parameters.Add("FromTreasuryDate", fromTreasuryDateMiladi);
        parameters.Add("ToTreasuryDate", toTreasuryDateMiladi);
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
            ControllerName = "NewTreasuryApi",
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
                if (int.Parse(model.Form_KeyValue[1]?.ToString()) != 0 && model.Filters.Any(x => x.Name == "createUser"))
                    parameters.Add("CreateUserId",
                        model.Filters.Any(x => x.Name == "createUser")
                            ? model.Filters.FirstOrDefault(x => x.Name == "createUser").Value
                            : null);
                else
                    parameters.Add("CreateUserId", int.Parse(model.Form_KeyValue[1]?.ToString()));
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
            var sQuery = "[fm].[Spc_Treasury_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<NewTreasuryGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultPage<NewTreasuryGetRecord>> GetRecordById(long id, int companyId)
    {
        var result = new MyResultPage<NewTreasuryGetRecord>
        {
            Data = new NewTreasuryGetRecord()
        };

        var parameters = new DynamicParameters();
        parameters.Add("Id", id);
        parameters.Add("CompanyId", companyId);
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_Treasury_GetRecord]";
            result.Data = await conn.QueryFirstOrDefaultAsync<NewTreasuryGetRecord>(sQuery, parameters,
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
            result.Data.IsRequest = stageStep.IsRequest;
        }

        return result;
    }

    public async Task<NewTreasuryResult> Insert(NewTreasuryModel model, byte roleId)
    {
        var result = new NewTreasuryResult();
        var validationError = await ValidateSaveNewTreasury(model, OperationType.Insert);

        if (validationError.Count > 0)
            return new NewTreasuryResult
            {
                Status = -98,
                Successfull = false,
                ValidationErrors = validationError
            };


        model.CreateDatetime = DateTime.Now;

        var getPersonAction = new GetAction();
        getPersonAction.CompanyId = model.CompanyId;
        getPersonAction.StageId = model.StageId;
        getPersonAction.Priority = 1;
        getPersonAction.WorkflowId = model.WorkflowId;
        var stageAction = await _stageActionRepository.GetAction(getPersonAction);
        model.ActionId = stageAction.ActionId;

        var curentInOut = await _stageRepository.GetInOut(model.StageId);

        int? parentWorkflowCategoryId = null;
        var hasPermission = await _roleWorklfowPermissionRepository.CheckRoleWorkflowPermission(model.WorkflowId,
            model.BranchId, model.StageId, stageAction.ActionId, roleId);

        if (hasPermission == 1)
        {
            using (var conn = Connection)
            {
                var sQuery = "[fm].[Spc_Treasury_InsUpd]";
                conn.Open();
                var output = await conn.ExecuteScalarAsync<int>(sQuery, new
                {
                    Opr = "Ins",
                    Id = 0,
                    RequestId = model.ParentId,
                    model.CreateDatetime,
                    model.JournalId,
                    model.TreasurySubjectId,
                    model.DocumentTypeId,
                    model.CreateUserId,
                    Note = model.Note.ConvertArabicAlphabet(),
                    model.WorkflowId,
                    model.CreateBySystem,
                    model.BranchId,
                    model.StageId,
                    model.TreasuryDate,
                    model.CompanyId,
                    model.AccountGLId,
                    model.AccountSGLId,
                    model.NoSeriesId,
                    model.AccountDetailId,
                    CurrentInOut = curentInOut,
                    model.ActionId,
                    ParentWorkflowCategoryId = model.ParentWorkflowCategoryId > 0
                        ? model.ParentWorkflowCategoryId
                        : parentWorkflowCategoryId
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
                        RequestActionId = model.ActionId,
                        IdentityId = int.Parse(result.Id.ToString()),
                        StageId = model.StageId,
                        CompanyId = model.CompanyId,
                        UserId = (int)model.CreateUserId,
                        WorkflowId = model.WorkflowId,
                        WorkflowCategoryId = model.ParentWorkflowCategoryId
                    };
                    await UpdateTreasuryStep(updateStepModel, OperationType.Insert);
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

    public async Task<NewTreasuryResult> Update(NewTreasuryModel model)
    {
        var validationError = await ValidateSaveNewTreasury(model, OperationType.Insert);

        if (validationError.Count > 0)
            return new NewTreasuryResult
            {
                Status = -98,
                Successfull = false,
                ValidationErrors = validationError
            };


        var curentInOut = await _stageRepository.GetInOut(model.StageId);
        int? parentWorkflowCategoryId = null;
        var result = new NewTreasuryResult();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_Treasury_InsUpd]";
            conn.Open();
            var output = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                Opr = "Upd",
                model.Id,
                RequestId = model.ParentId,
                model.CreateDatetime,
                model.JournalId,
                model.TreasurySubjectId,
                model.DocumentTypeId,
                model.CreateUserId,
                Note = model.Note.ConvertArabicAlphabet(),
                model.WorkflowId,
                model.CreateBySystem,
                model.BranchId,
                model.StageId,
                model.TreasuryDate,
                model.CompanyId,
                model.AccountGLId,
                model.AccountSGLId,
                model.NoSeriesId,
                model.AccountDetailId,
                CurrentInOut = curentInOut,
                model.ActionId,
                ParentWorkflowCategoryId = model.ParentWorkflowCategoryId > 0
                    ? model.ParentWorkflowCategoryId
                    : parentWorkflowCategoryId
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

    public async Task<NewTreasuryResult> UpdateInLine(NewTreasuryModelUpdateInline model)
    {
        var validationError = await ValidateSaveNewTreasuryUpdateInline(model, OperationType.Insert);

        if (validationError.Count > 0)
            return new NewTreasuryResult
            {
                Status = -98,
                Successfull = false,
                ValidationErrors = validationError
            };

        var result = new NewTreasuryResult();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_Treasury_UpdateInline]";
            conn.Open();
            var output = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TreasuryId = model.Id,
                model.TreasurySubjectId,
                ParentId = model.RequestId,
                model.TreasuryDate,
                model.AccountGLId,
                model.AccountSGLId,
                model.AccountDetailId,
                model.NoSeriesId,
                model.DocumentTypeId,
                Note = model.Note.ConvertArabicAlphabet(),
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

    public async Task<NewTreasuryResult> Delete(int id, int companyId, byte roleId)
    {
        var result = new NewTreasuryResult();

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
            result = await conn.QueryFirstOrDefaultAsync<NewTreasuryResult>(
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

    public async Task<List<MyDropDownViewModel>> RequestFundType_GetDropDown(long treasuryId, int workflowId,
        long requestId, int listType, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_Treasury_SelectFundType_Parent]";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    Id = treasuryId,
                    WorkflowId = workflowId,
                    RequestId = requestId,
                    CompanyId = companyId,
                    ListType = listType
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<ParentIdMyDropdownViewModel>> TreasuryRequest_GetDropDown(short branchId, short workflowId,
        int companyId, short stageId, long? requestId, long? treasuryId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_MidSystem_SelectRequestsByStageId]";
            conn.Open();

            var result = (await conn.QueryAsync<ParentIdMyDropdownViewModel>(sQuery,
                new
                {
                    BranchId = branchId,
                    WorkflowId = workflowId,
                    CompanyId = companyId,
                    StageId = stageId,
                    ObjectId = treasuryId,
                    ParentId = requestId,
                    AmountOrQuantity = 1
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> TreasuryStageDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "wf.Stage",
                    IdColumnName = "Id",
                    TitleColumnName = "Name",
                    Filter = "WorkflowCategoryId=6 AND IsActive=1"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<int> GetJournalIdByTreasuryId(long treasuryId, short stageId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_GetJournalId_By_IdentityIdStageId]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    IdentityId = treasuryId,
                    StageId = stageId
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }


    public async Task UpdateActionId(long treasuryId, byte actionId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_UpdItem_Number";
            conn.Open();
            var updateLastAction = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                TableName = "fm.treasury",
                ColumnName = "actionid",
                Value = actionId,
                Filter = $"Id={treasuryId}"
            }, commandType: CommandType.StoredProcedure);
        }
    }

    public async Task<NewTreasuryResultStatus> UpdateTreasuryStep(UpdateAction model, OperationType operationType)
    {
        var validateResult = new List<string>();

        if (operationType == OperationType.Update)
            validateResult = await ValidateUpdateStep(model, OperationType.Insert);

        var result = new NewTreasuryResultStatus();
        if (validateResult.ListHasRow())
        {
            var resultValidate = new NewTreasuryResultStatus();
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
                var updateLastAction = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
                {
                    TableName = "fm.treasury",
                    ColumnName = "actionid",
                    Value = model.RequestActionId,
                    Filter = $"Id={model.IdentityId}"
                }, commandType: CommandType.StoredProcedure);

                var updateLastActionTreasuryLine = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
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

    public async Task<List<string>> ValidateUpdateStep(UpdateAction model, OperationType operationType)
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

                //قبلی Action  مقدار 
                treasuryAction.StageId = model.StageId;
                treasuryAction.ActionId = model.RequestActionId;
                treasuryAction.WorkflowId = model.WorkflowId;
                var requestTreasuryStageAction = await _stageActionRepository.GetAction(treasuryAction);

                //فعلی Action مقدار 
                var currentActionId = await GetActionIdByIdentityId(model.IdentityId, 6);
                treasuryAction.StageId = model.StageId;
                treasuryAction.ActionId = currentActionId;
                treasuryAction.WorkflowId = model.WorkflowId;
                var currentTreasuryStageAction = await _stageActionRepository.GetAction(treasuryAction);
                var expectedPriority = 0;

                if (requestTreasuryStageAction != null)
                {
                    //Action مقایسه دو 
                    if (currentTreasuryStageAction.Priority < requestTreasuryStageAction.Priority)
                        expectedPriority = currentTreasuryStageAction.Priority + 1;
                    else if (currentTreasuryStageAction.Priority > requestTreasuryStageAction.Priority)
                        expectedPriority = currentTreasuryStageAction.Priority - 1;

                    if (expectedPriority != 0 && expectedPriority != requestTreasuryStageAction.Priority)
                        error.Add("گام درخواست شده معتبر نمی باشد");
                }

                #endregion

                #region برگه جاری دارای لاین هست یا نیست

                if (treasuryLines == 0 && requestTreasuryStageAction.IsLastConfirmHeader)
                    error.Add("برگه دارای سطر نمی باشد مجاز به تغییر گام نمی باشید");

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


                #region برگه جاری دارای درخواست است => isRequest==1

                if (currentTreasuryStageAction.IsRequest)
                {
                    #region آیا درخواست برگه جاری در وضعیت تایید نشده است

                    var requestList = await GetRequest(model.IdentityId, model.CompanyId);
                    var requestItm = await GetRequestItem(requestList.RequestId, requestList.ParentWorkflowCategoryId,
                        model.CompanyId);
                    var requestActionId =
                        await GetActionIdByIdentityId(requestList.RequestId, requestList.ParentWorkflowCategoryId);
                    treasuryAction.StageId = requestItm != null ? requestItm.StageId : model.StageId;
                    treasuryAction.ActionId = requestActionId;
                    treasuryAction.WorkflowId = model.WorkflowId;
                    requestTreasuryStageAction = await _stageActionRepository.GetAction(treasuryAction);


                    if (!requestTreasuryStageAction.IsLastConfirmHeader)
                        error.Add(
                            $"درخواست شماره {requestList.RequestId} در وضعیت تایید نشده است، مجاز به تغییر گام نمی باشید");

                    #endregion
                }

                #endregion

                else
                {
                    if (!requestTreasuryStageAction.IsLastConfirmHeader)
                    {
                        #region برگه جاری مرجع است؟

                        var target = await GetCurrentTreasuryAction(model.IdentityId, model.ParentWorkflowCategoryId,
                            model.CompanyId, 1);
                        target = target.Where(x => x.isLastConfirmHeader).ToList();

                        if (target.ListHasRow())
                            if (target.Count > 0)
                            {
                                var stringIds = target.Select(x => x.Id).AsList();
                                error.Add(
                                    "شناسه های خزانه متصل به این درخواست در حالت تائید شده می باشد  ، مجاز به تغییر گام نمی باشید :");
                                error.Add(string.Join(',', stringIds));
                            }

                        #endregion
                    }
                }


                #region بررسی وضعیت دوره مالی

                var treasury = GetRecordById(model.IdentityId, model.CompanyId).Result.Data;
                var resultCheckFiscalYear =
                    await _fiscalYearRepository.GetFicalYearStatusByDate(treasury.TransactionDate, model.CompanyId);
                if (!resultCheckFiscalYear.Successfull)
                    error.Add(resultCheckFiscalYear.StatusMessage);

                #endregion
            }
        });

        return error;
    }

    public async Task<TreasuryRequestViewModel> GetRequest(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetTable]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<TreasuryRequestViewModel>(sQuery, new
            {
                TableName = "fm.treasury",
                ColumnNameList = "RequestId,ParentWorkflowCategoryId",
                Filter = $"Id={id} AND companyId={companyId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<MyResultDataQuery<List<NewTreasuryStepLogList>>> GetTreasuryStepList(int treasuryId,
        int companyId)
    {
        var result = new MyResultDataQuery<List<NewTreasuryStepLogList>>
        {
            Data = new List<NewTreasuryStepLogList>()
        };

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasuryActionLog_SelectTreasuryActionLog]";
            conn.Open();
            result.Data = (await conn.QueryAsync<NewTreasuryStepLogList>(sQuery, new
            {
                TreasuryId = treasuryId
            }, commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }


    public async Task<MyDropDownViewModel> GetTreasuryRequestTreasurySubject(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasuryRequest_TreasurySubject]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<MyDropDownViewModel>(sQuery, new
            {
                RequestId = id
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<bool> CheckExist(TreasuryExistViewModel model, int userId, byte roleId)
    {
        var filter = "";
        //بررسی دسترسی براساس نقش و جریان کار و مرحله
        var hasPermission =
            await _roleWorklfowPermissionRepository.CheckRoleWorkflowPermissionByHeaderId(model.Id, 6, roleId);

        if (hasPermission == 1)
        {
            var checkAuthenticate = new CheckAuthenticateViewModel
            {
                ControllerName = "NewTreasuryApi",
                OprType = "VIWALL",
                UserId = userId
            };


            var checkAccessViewAll = await _loginRepository.GetAuthenticate(checkAuthenticate);


            filter =
                $"Id={model.Id} AND companyId={model.CompanyId}  AND stageId in (SELECT Id FROM wf.Stage s WHERE s.WorkflowCategoryId=6  AND s.IsActive=1 AND StageClassId=3)";

            if (!checkAccessViewAll.Successfull)

                filter += $" AND CreateUserId={userId}";

            if (model.BySystem != 2)
                filter += $" AND CreateBySystem={model.BySystem}";
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
                TableName = "fm.Treasury",
                ColumnName = "Id",
                Filter = filter
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result > 0;
        }
    }


    public async Task<List<string>> ValidateDeleteStep(long id, int companyId, OperationType operationType, byte roleId)
    {
        var error = new List<string>();

        if (id == 0 || companyId == 0)
            error.Add("اطلاعات ورودی معتبر نمی باشد");
        else
            await Task.Run(async () =>
            {
                if (operationType == OperationType.Delete)
                {
                    var treasury = GetRecordById(id, companyId).Result.Data;

                    #region بررسی حذف با نقش و جریان کار و مرحله

                    var hasPermission = await _roleWorklfowPermissionRepository.CheckRoleWorkflowPermission(
                        treasury.WorkflowId, treasury.BranchId, treasury.StageId, treasury.ActionId, roleId);
                    if (hasPermission == 0)
                    {
                        var stage = await _stageRepository.GetName(treasury.StageId);
                        error.Add($"{stage} دسترسی ندارید ");
                    }

                    #endregion

                    var getTreasuryAction = new GetAction
                    {
                        CompanyId = companyId,
                        StageId = treasury.StageId,
                        ActionId = treasury.ActionId,
                        WorkflowId = treasury.WorkflowId
                    };

                    var treasuryStageAction = _stageActionRepository.GetAction(getTreasuryAction).Result;

                    // 1 - check IsDeleteHeader with StageId & MaxStepId
                    if (!treasuryStageAction.IsDeleteHeader)
                        error.Add("مجاز به حذف برگه خزانه در این مرحله و گام نمی باشید");


                    #region آیا شماره چک در گردش هست یا نه

                    if (treasuryStageAction.IsMaxStepReviewed)
                    {
                        var treasuryChecks = await GetTreasuryCheckLineByTreasuryId(id);

                        if (treasuryChecks.Any())
                            foreach (var item in treasuryChecks)
                            {
                                var treasuryCheck = item;
                                if (treasuryCheck != null)
                                {
                                    if (treasuryCheck.MaxStep > treasuryCheck.Step)
                                        error.Add(
                                            $"شماره چک {treasuryCheck.SayadNumber} دارای گردش می باشد، مجاز به حذف نمی باشید");
                                    else if (treasuryCheck.MaxStep < treasuryCheck.Step)
                                        error.Add("خطا در حذف اطلاعات، به مدیر سیستم اطلاعات دهید");
                                }
                            }
                    }

                    #endregion

                    #region بررسی وضعیت دوره مالی

                    var resultCheckFiscalYear =
                        await _fiscalYearRepository.GetFicalYearStatusByDate(treasury.TransactionDate, companyId);
                    if (!resultCheckFiscalYear.Successfull)
                        error.Add(resultCheckFiscalYear.StatusMessage);

                    #endregion
                }
            });
        return error;
    }

    public async Task<List<CurrentTreasuryStageAction>> GetCurrentTreasuryAction(long id, byte ParentWorkflowCategoryId,
        int companyId, byte getType)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_Get_TreasuryActionConfig]";
            conn.Open();

            var result = await conn.QueryAsync<CurrentTreasuryStageAction>(sQuery, new
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


    public async Task<List<HeaderTreasuryPostingGroup>> GetHeaderTreasuryPostingGroup(List<ID> Ids, int companyId)
    {
        var headerList = new List<HeaderTreasuryPostingGroup>();

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasuryHeader_PostingGroup_GetList]";
            conn.Open();
            headerList = (await conn.QueryAsync<HeaderTreasuryPostingGroup>(sQuery, new
            {
                IdsJSON = JsonConvert.SerializeObject(Ids),
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return headerList;
    }

    public async Task<bool> CheckRequestIsLastConfirmHeader(int requestId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_CheckRequest_IsLastConfirmHeader]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                RequestId = requestId
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result > 0;
        }
    }

    public async Task<List<string>> ValidateSaveNewTreasury(NewTreasuryModel model, OperationType operationType)
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

    public async Task<List<string>> ValidateSaveNewTreasuryUpdateInline(NewTreasuryModelUpdateInline model,
        OperationType operationType)
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


    public async Task<List<NewTreasuryLines>> GetTreasuryCheckLineByTreasuryId(long treasuryId)
    {
        var result = new List<NewTreasuryLines>();

        using (var conn = Connection)
        {
            conn.Open();
            var checkQuery = "[fm].[Spc_TreasuryCheckLineByTreasuryId]";

            result.AddRange((await conn.QueryAsync<NewTreasuryLines>(checkQuery, new
            {
                HeaderId = treasuryId
            }, commandType: CommandType.StoredProcedure)).ToList());

            conn.Close();

            return result;
        }
    }


    public async Task<byte?> GetTreasuryInfo(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<byte>(sQuery, new
            {
                TableName = "fm.Treasury",
                ColumnName = "ParentWorkflowCategoryId",
                Filter = $"Id={id} AND CompanyId={companyId} "
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<byte> GetActionIdByIdentityId(int IdentityId, int workflowCategory)
    {
        var TableName = "";
        switch (workflowCategory)
        {
            case 1:
                TableName = "pu.PurchaseOrder";
                break;
            case 6:
                TableName = "fm.treasury";
                break;
        }

        using (var conn = Connection)
        {
            byte result = 0;
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            result = await conn.QueryFirstOrDefaultAsync<byte>(sQuery, new
            {
                TableName,
                ColumnName = "actionid",
                Filter = $"Id={IdentityId}",
                OrderBy = ""
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<NewTreasuryGetRecord> GetRequestItem(int id, int workflowId, int companyId)
    {
        var TableName = "";
        switch (workflowId)
        {
            case 1:
                TableName = "pu.PurchaseOrder";
                break;
            case 6:
                TableName = "fm.treasury";
                break;
        }

        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetTable]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<NewTreasuryGetRecord>(sQuery, new
            {
                TableName,
                ColumnNameList = "RequestId AS RequestId,stageId AS StageId",
                Filter = $"Id={id} AND companyId={companyId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }


    public async Task<List<TreasuryLineDifference>> GetTreasuryLineDifferenceInOutByTreasuryId(int treasuryId)
    {
        var result = new List<TreasuryLineDifference>();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasuryLine_Difference]";
            conn.Open();

            result = (await conn.QueryAsync<TreasuryLineDifference>(sQuery, new
            {
                HeaderId = treasuryId
            }, commandType: CommandType.StoredProcedure)).ToList();

            conn.Close();

            var res = result.GroupBy(a => a.CurrentInOut).ToList();

            //if (res.Count() > 1)
            return result;
            //else
            //    return new List<TreasuryLineDifference>();
        }
    }
}