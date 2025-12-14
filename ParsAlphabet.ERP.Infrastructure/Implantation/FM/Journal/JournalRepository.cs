using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.FM;
using ParsAlphabet.ERP.Application.Dtos.FM.Journal;
using ParsAlphabet.ERP.Application.Dtos.FM.JournalLine;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces.FM.JournalLine;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.JournalStageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.Currency;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYear;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.RoleWorkflowPermission;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.Journal;

public class JournalRepository :
    BaseRepository<JournalModel, int, string>,
    IBaseRepository<JournalModel, int, string>
{
    private readonly ICompanyRepository _companyRepository;
    private readonly CurrencyRepository _currencyRepository;
    private readonly FiscalYearRepository _fiscalYearRepository;
    private readonly IJournalLineRepository _journalLineRepository;
    private readonly JournalStageActionRepository _journalStageActionRepository;
    private readonly ILoginRepository _loginRepository;
    private readonly RoleWorklfowPermissionRepository _roleWorklfowPermissionRepository;
    private readonly StageActionRepository _stageActionRepository;

    public JournalRepository(IConfiguration config,
        ICompanyRepository companyRepository,
        CurrencyRepository currencyRepository,
        JournalStageActionRepository journalStageActionRepository,
        StageActionRepository stageActionRepository,
        IJournalLineRepository journalLineRepository,
        FiscalYearRepository fiscalYearRepository,
        ILoginRepository loginRepository,
        RoleWorklfowPermissionRepository roleWorklfowPermissionRepository
    )
        : base(config)
    {
        _companyRepository = companyRepository;
        _currencyRepository = currencyRepository;
        _journalStageActionRepository = journalStageActionRepository;
        _stageActionRepository = stageActionRepository;
        _journalLineRepository = journalLineRepository;
        _fiscalYearRepository = fiscalYearRepository;
        _loginRepository = loginRepository;
        _roleWorklfowPermissionRepository = roleWorklfowPermissionRepository;
    }

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
                    Id = "id", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, Width = 6,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "number"
                },
                new() { Id = "actionId", IsPrimary = true },
                new() { Id = "stageId", IsPrimary = true },
                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 50, Width = 7,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/GN/BranchApi/getdropdown"
                },

                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 9, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/WorkflowApi/getdropdown/0/2/3"
                },
                new()
                {
                    Id = "workflowId", Title = "جریان کار", IsPrimary = true, Type = (int)SqlDbType.NVarChar, Size = 50
                },

                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.SmallDateTime, IsDtParameter = true, Width = 9
                },
                new()
                {
                    Id = "documentDatePersian", Title = "تاریخ سند", Type = (int)SqlDbType.NVarChar, Size = 10,
                    Width = 9, IsPrimary = true, IsDtParameter = true, IsFilterParameter = true,
                    FilterType = "doublepersiandate"
                },
                new()
                {
                    Id = "documentNo", Title = "شماره سند", Type = (int)SqlDbType.SmallInt, Size = 100, Width = 7,
                    IsDtParameter = true, IsPrimary = true, IsFilterParameter = true, FilterType = "number"
                },
                new()
                {
                    Id = "documentType", Title = "نوع سند", Type = (int)SqlDbType.NVarChar, Size = 50, Width = 10,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/FM/DocumentTypeApi/getdropdown/2"
                },
                new()
                {
                    Id = "sumAmountDebit", Title = " بدهکار", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 6, IsCommaSep = true
                },
                new()
                {
                    Id = "sumAmountCredit", Title = " بستانکار", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 6, IsCommaSep = true
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 10,
                    Width = 9, IsDtParameter = true, IsFilterParameter = true, FilterType = "doublepersiandate"
                },
                new()
                {
                    Id = "user", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 8, FilterType = "select2",
                    FilterTypeApi = "api/GN/UserApi/getdropdown/2/false/false"
                },

                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageActionApi/getdropdown/2/1/3", Width = 5
                },

                new()
                {
                    Id = "bySystem", Title = "سیستمی", IsPrimary = true, Type = (int)SqlDbType.Bit, Size = 1,
                    IsDtParameter = true, Align = "center", Width = 6
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 6 }
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
                    Name = "editjournal", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green",
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "bySystem", FieldValue = "true", Operator = "!=" } }
                },
                new() { Name = "print", Title = "چاپ", ClassName = "btn blue_1", IconName = "fa fa-print" },
                new()
                {
                    Name = "importExcelJournal", Title = "انتقال اطلاعات / اکسل", ClassName = "",
                    IconName = "fa fa-file-excel color-green",
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "lineCheckExist", FieldValue = "true", Operator = "==" } }
                },
                new()
                {
                    Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon",
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "bySystem", FieldValue = "true", Operator = "!=" } }
                },
                new() { Name = "sep1", Title = "", ClassName = "", IconName = "", IsSeparator = true },
                new()
                {
                    Name = "journalDetailSimple", Title = $"تخصیص متغیرها ({defaultCurrencyName})", ClassName = "",
                    IconName = "fa fa-list color-green",
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "bySystem", FieldValue = "true", Operator = "!=" } }
                },
                new()
                {
                    Name = "journalDetailAdvance", Title = "تخصیص متغیرها (ارزی)", ClassName = "",
                    IconName = "fa fa-list color-green",
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "bySystem", FieldValue = "true", Operator = "!=" } }
                },
                new()
                {
                    Name = "showStepLogsjournal", Title = "گام ها", ClassName = "",
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
                p.DocumentDatePersian,
                p.DocumentNo,
                p.DocumentType,
                p.SumAmountDebit,
                p.SumAmountCredit,
                p.CreateDateTimePersian,
                p.User,
                p.ActionIdName,
                BySystem = p.BySystem ? "بلی" : "خیر"
            };
        return result;
    }

    public async Task<MyResultPage<List<JournalGetPage>>> GetPage(NewGetPageViewModel model, int userId, byte roleId)
    {
        var result = new MyResultPage<List<JournalGetPage>>();
        result.Data = new List<JournalGetPage>();


        var fromCreateDateMiladi = (DateTime?)null;
        var toCreateDateMiladi = (DateTime?)null;
        var fromDocumentDateMiladi = (DateTime?)null;
        var toDocumentDateMiladi = (DateTime?)null;

        if (model.Filters == null) model.Filters = new List<FormKeyValue>();

        if (model.Filters.Any(x => x.Name == "createDateTimePersian"))
        {
            fromCreateDateMiladi =
                model.Filters.FirstOrDefault(x => x.Name == "createDateTimePersian").Value.Split('-')[0]
                    .ToMiladiDateTime();
            toCreateDateMiladi =
                model.Filters.FirstOrDefault(x => x.Name == "createDateTimePersian").Value.Split('-')[1]
                    .ToMiladiDateTime();
        }

        if (model.Filters.Any(x => x.Name == "documentDatePersian"))
        {
            fromDocumentDateMiladi =
                model.Filters.FirstOrDefault(x => x.Name == "documentDatePersian").Value.Split('-')[0]
                    .ToMiladiDateTime();
            toDocumentDateMiladi =
                model.Filters.FirstOrDefault(x => x.Name == "documentDatePersian").Value.Split('-')[1]
                    .ToMiladiDateTime();
        }


        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("DocumentNo",
            model.Filters.Any(x => x.Name == "documentNo")
                ? model.Filters.FirstOrDefault(x => x.Name == "documentNo").Value
                : null);
        parameters.Add("FromDocumentDate", fromDocumentDateMiladi);
        parameters.Add("ToDocumentDate", toDocumentDateMiladi);
        parameters.Add("DocumentTypeId",
            model.Filters.Any(x => x.Name == "documentType")
                ? model.Filters.FirstOrDefault(x => x.Name == "documentType").Value
                : null);
        parameters.Add("BranchId",
            model.Filters.Any(x => x.Name == "branch")
                ? model.Filters.FirstOrDefault(x => x.Name == "branch").Value
                : null);
        parameters.Add("FromCreateDateTime", fromCreateDateMiladi);
        parameters.Add("ToCreateDateTime", toCreateDateMiladi);
        parameters.Add("ActionId",
            model.Filters.Any(x => x.Name == "actionIdName")
                ? model.Filters.FirstOrDefault(x => x.Name == "actionIdName").Value
                : null);
        parameters.Add("WorkflowId",
            model.Filters.Any(x => x.Name == "workflow")
                ? model.Filters.FirstOrDefault(x => x.Name == "workflow").Value
                : null);
        parameters.Add("RoleId", roleId);

        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);

        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "JournalApi",
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
                    model.Filters.Any(x => x.Name == "user")
                        ? model.Filters.FirstOrDefault(x => x.Name == "user").Value
                        : null);
        }
        else
        {
            if (checkAccessViewAll.Successfull)
            {
                {
                    if (int.Parse(model.Form_KeyValue[3]?.ToString()) != 0 && model.Filters.Any(x => x.Name == "user"))
                        parameters.Add("CreateUserId",
                            model.Filters.Any(x => x.Name == "user")
                                ? model.Filters.FirstOrDefault(x => x.Name == "user").Value
                                : null);

                    else
                        parameters.Add("CreateUserId", int.Parse(model.Form_KeyValue[3]?.ToString()));
                }
            }
            else
            {
                if (int.Parse(model.Form_KeyValue[3]?.ToString()) != 0 && model.Filters.Any(x => x.Name == "user"))
                    if (model.Filters.FirstOrDefault(x => x.Name == "user").Value == userId.ToString())
                        parameters.Add("CreateUserId", model.Filters.FirstOrDefault(x => x.Name == "user").Value);
                    else
                        parameters.Add("CreateUserId", 0);

                else
                    parameters.Add("CreateUserId", int.Parse(model.Form_KeyValue[3]?.ToString()));
            }
        }


        result.Columns = GetColumns(model.CompanyId);

        using (var conn = Connection)
        {
            var sQuery = "fm.Spc_Journal_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<JournalGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        return result;
    }

    public async Task<List<string>> ValidateSaveNewJournaly(short branchId, DateTime? DocumentDate, int CompanyId)
    {
        var error = new List<string>();

        var resultCheckFiscalYear = await _fiscalYearRepository.GetFicalYearStatusByDate(DocumentDate, CompanyId);
        if (!resultCheckFiscalYear.Successfull)
            error.Add(resultCheckFiscalYear.StatusMessage);

        if (branchId != 0)
        {
            var WorkFlowList = await GetWorkFlowInfo(branchId);

            if (!WorkFlowList.NotNull()) error.Add("اطلاعات جریان کار سند موجود نمی باشد ، به مدیر سیستم اطلاع دهید");
        }

        return error;
    }


    public async Task<MyResultStatus> Insert(JournalModel model, byte roleId)
    {
        var result = new MyResultStatus();
        var validationError = await ValidateSaveNewJournaly(model.BranchId, model.DocumentDate, model.CompanyId);

        if (validationError.Count > 0)
            return new MyResultStatus
            {
                Status = -98,
                Successfull = false,
                ValidationErrors = validationError
            };

        var WorkFlowList = await GetWorkFlowInfo(model.BranchId);
        model.WorkflowId = WorkFlowList.Id;

        var StageList = await GetStageIdWhitWorkFolwId(model.WorkflowId, model.BranchId.ToString(), roleId);
        model.StageId = StageList.Id;


        if (!model.BySystem)
            model.Status =
                await _journalStageActionRepository.GetActionIdByPriority(model.WorkflowId, model.StageId, 1,
                    model.CompanyId);
        else
            model.Status =
                await _journalStageActionRepository.GetActionIsLastConfirmHeader(model.StageId, model.WorkflowId,
                    model.CompanyId);

        var hasPermission = await _roleWorklfowPermissionRepository.CheckRoleWorkflowPermission(model.WorkflowId,
            model.BranchId, model.StageId, model.Status, roleId);

        if (hasPermission != 1)
        {
            result.Successfull = false;
            result.StatusMessage = "به جریان کار و مرحله دسترسی ندارید";
            return result;
        }

        using (var conn = Connection)
        {
            var sQuery = "fm.Spc_Journal_InsUpd";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                Opr = "Ins",
                Id = 0,
                model.BranchId,
                model.StageId,
                model.DocumentNo,
                model.DocumentTypeId,
                model.DocumentDate,
                model.CreateDateTime,
                model.CreateUserId,
                ActionId = model.Status,
                model.BySystem,
                model.WorkflowId,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;

        return result;
    }

    public async Task<MyResultStatus> Update(JournalModel model, byte roleId)
    {
        var result = new MyResultStatus();

        var validationError = await ValidateSaveNewJournaly(model.BranchId, model.DocumentDate, model.CompanyId);

        if (validationError.Count > 0)
            return new MyResultStatus
            {
                Status = -98,
                Successfull = false,
                ValidationErrors = validationError
            };


        var WorkFlowList = await GetWorkFlowInfo(model.BranchId);
        model.WorkflowId = WorkFlowList.Id;

        var StageList = await GetStageIdWhitWorkFolwId(model.WorkflowId, model.BranchId.ToString(), roleId);
        model.StageId = StageList.Id;

        model.Status =
            await _journalStageActionRepository.GetActionIdByPriority(model.WorkflowId, model.StageId, 1,
                model.CompanyId);

        var hasPermission = await _roleWorklfowPermissionRepository.CheckRoleWorkflowPermission(model.WorkflowId,
            model.BranchId, model.StageId, model.Status, roleId);
        if (hasPermission != 1)
        {
            result.Successfull = false;
            result.StatusMessage = "به جریان کار و مرحله دسترسی ندارید";
            return result;
        }

        using (var conn = Connection)
        {
            var sQuery = "fm.Spc_Journal_InsUpd";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                Opr = "Upd",
                model.Id,
                model.BranchId,
                model.StageId,
                model.DocumentNo,
                model.DocumentTypeId,
                model.DocumentDate,
                model.ModifiedUserId,
                ModifiedDateTime = DateTime.Now,
                ActionId = model.Status,
                model.BySystem,
                model.WorkflowId,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;

        return result;
    }

    public async Task<MyResultQuery> UpdateInLine(UpdateJournalInline model)
    {
        var validationError = await ValidateSaveNewJournaly(0, model.DocumentDate, model.CompanyId);

        if (validationError.Count > 0)
            return new MyResultQuery
            {
                Status = -98,
                Successfull = false,
                ValidationErrors = validationError
            };
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_Journal_InsUpd]";
            conn.Open();

            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "UpdInline",
                model.Id,
                model.DocumentNo,
                model.DocumentTypeId,
                model.DocumentDate,
                model.ModifiedUserId,
                model.ModifiedDateTime,
                model.ActionId,
                BySystem = 0,
                WorkflowId = 0,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<bool> CheckExist(int id, int companyId, int userId)
    {
        var filter = $"Id={id} AND CompanyId={companyId}";
        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "JournalApi",
            OprType = "VIWALL",
            UserId = userId
        };


        var checkAccessViewAll = await _loginRepository.GetAuthenticate(checkAuthenticate);
        if (!checkAccessViewAll.Successfull)

            filter += $" AND CreateUserId={userId}";

        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "fm.Journal",
                ColumnName = "Id",
                Filter = filter
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result > 0;
        }
    }

    public async Task<JournalModel> GetRecordById(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_Journal_GetRecord]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<JournalModel>(sQuery, new
            {
                JournalId = id,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<bool> GetJournalBySystem(long id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<bool>(sQuery,
                new
                {
                    TableName = "fm.Journal",
                    ColumnName = "BySystem",
                    Filter = $"Id={id} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<int> GetJournalIdByFilter(string filter)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "fm.Journal",
                    ColumnName = "Id",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<MyResultDataQuery<List<FinancialStepList>>> GetJournalStepList(int journalId, int companyId)
    {
        var result = new MyResultDataQuery<List<FinancialStepList>>
        {
            Data = new List<FinancialStepList>()
        };

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_JournalStep_List]";
            conn.Open();
            result.Data = (await conn.QueryAsync<FinancialStepList>(sQuery, new
            {
                JournalId = journalId,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultStatus> UpdateJournalStep(UpdateFinanacialStep model)
    {
        var validateResult = new List<string>();
        var result = new MyResultStatus();
        validateResult = await ValidateUpdateStep(model, OperationType.Insert);
        if (validateResult.ListHasRow())
        {
            var resultValidate = new MyResultStatus();
            resultValidate.Successfull = false;
            resultValidate.ValidationErrors = validateResult;
            return resultValidate;
        }

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_JournalStep_Confirm]";
            conn.Open();

            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery,
                new
                {
                    JournalId = model.IdentityId,
                    model.UserId,
                    model.RequestStepId,
                    model.StepDateTime,
                    model.CompanyId
                }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        result.ValidationErrors.Add(result.StatusMessage);

        if (result.Successfull)
            using (var conn = Connection)
            {
                var qry = "pb.Spc_Tables_UpdItem_Number";
                conn.Open();
                var updateStatus = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(qry, new
                {
                    TableName = "fm.Journal",
                    ColumnName = "ActionId",
                    Value = model.RequestStepId,
                    Filter = $"Id={model.IdentityId}"
                }, commandType: CommandType.StoredProcedure);


                result.StatusMessage = "تغییرات با موفقیت انجام شد";
            }

        return result;
    }

    public async Task<MyResultStatus> UpdateJournalUser(UpdateUserJournal model)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_Journal_Update_User]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(
                sQuery, new
                {
                    model.JournalId,
                    model.UserId,
                    model.CreateDateTime
                }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultStatus> InsertFinanacialStep(UpdateFinanacialStep model)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_FinanaialStep_IsSystemJournal_Ins]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(
                sQuery, new
                {
                    JournalId = model.IdentityId,
                    StageId = 56,
                    model.UserId,
                    StepId = model.RequestStepId,
                    model.StepDateTime
                }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultQuery> Delete(int id, int companyId)
    {
        var result = new MyResultQuery();
        var validationError = await ValidateDeleteStep(id, companyId, OperationType.Delete);

        if (validationError.Count > 0)
        {
            result.Successfull = false;
            result.ValidationErrors = validationError;
            return result;
        }

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecordWithFilter";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery,
                new { TableName = "fm.Journal", Filter = $"Id = {id} AND CompanyId = {companyId}" },
                commandType: CommandType.StoredProcedure);
            result.ValidationErrors = new List<string>();
            conn.Close();
        }

        result.Successfull = result.Status == 100;
        result.ValidationErrors = result.Successfull
            ? new List<string> { "عملیات حذف با موفقیت انجام شد" }
            : new List<string> { "عملیات حذف با خطا مواجه شد" };
        return result;
    }

    public async Task<List<string>> ValidateDeleteStep(int id, int companyId, OperationType operationType)
    {
        var error = new List<string>();

        if (id == 0 || companyId == 0)
            error.Add("اطلاعات ورودی معتبر نمی باشد");
        else
            await Task.Run(async () =>
            {
                if (operationType == OperationType.Delete)
                {
                    var journal = await GetRecordById(id, companyId);

                    if (journal.BySystem)
                        error.Add("مجاز به حذف برگه های سیستمی نمی باشید");

                    var getTreasuryAction = new GetAction
                    {
                        CompanyId = companyId,
                        StageId = journal.StageId,
                        ActionId = journal.Status,
                        WorkflowId = journal.WorkflowId
                    };

                    var journalStageAction = _stageActionRepository.GetAction(getTreasuryAction).Result;

                    if (!journalStageAction.IsDeleteHeader)
                        error.Add("مجاز به حذف سند در این مرحله و گام نمی باشید");

                    #region بررسی وضعیت دوره مالی

                    var resultCheckFiscalYear =
                        await _fiscalYearRepository.GetFicalYearStatusByDate(journal.DocumentDate, companyId);
                    if (!resultCheckFiscalYear.Successfull)
                        error.Add(resultCheckFiscalYear.StatusMessage);

                    #endregion
                }
            });
        return error;
    }

    public async Task<List<string>> ValidateUpdateStep(UpdateFinanacialStep model, OperationType operationType)
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
                var bySystem = await GetJournalBySystem(model.IdentityId, model.CompanyId);
                if (bySystem)
                    error.Add("مجاز به تغییر گام سندهای سیستمی نمی باشید");

                #region بررسی وضعیت دوره مالی

                var journal = await GetRecordById(int.Parse(model.IdentityId.ToString()), model.CompanyId);
                var resultCheckFiscalYear =
                    await _fiscalYearRepository.GetFicalYearStatusByDate(journal.DocumentDate, model.CompanyId);

                if (!resultCheckFiscalYear.Successfull)
                    error.Add(resultCheckFiscalYear.StatusMessage);

                #endregion
            }
        });

        return error;
    }

    public async Task<List<JournalDocumentMyDropDownViewModel>> GetJournalDocumentNoGetList(int companyId, byte roleId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_Journal_DocumentNo_GetList]";
            conn.Open();
            var result = (await conn.QueryAsync<JournalDocumentMyDropDownViewModel>(sQuery, new
            {
                RoleId = roleId,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<JournalDocumentInfo> GetJournalDocumentInfo(int journalId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_JournalDocument_Info]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<JournalDocumentInfo>(sQuery,
                new
                {
                    JournalId = journalId,
                    CompanyId = companyId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<MyResultStatus> JournalDuplicate(JournalDuplicate model, byte roleId)
    {
        var result = new MyResultStatus();

        var journal = await GetRecordById(model.FromJournalId, model.CompanyId);

        var JournalModel = new JournalModel();
        JournalModel.Id = 0;
        JournalModel.BranchId = model.BranchId;
        JournalModel.BySystem = false;
        JournalModel.CompanyId = model.CompanyId;
        JournalModel.DocumentDate = model.ToDocumentDateJournal;
        JournalModel.DocumentTypeId = model.DocumentTypeId;
        JournalModel.CreateUserId = model.UserId;
        result = await Insert(JournalModel, roleId);


        var NewGetPageViewModel = new NewGetPageViewModel();
        NewGetPageViewModel.PageNo = null;
        NewGetPageViewModel.PageRowsCount = null;
        NewGetPageViewModel.CompanyId = model.CompanyId;
        NewGetPageViewModel.Form_KeyValue = new object[] { Convert.ToInt32(model.FromJournalId), 1 };
        var resultJournalLine = await _journalLineRepository.GetJournalLinePage(NewGetPageViewModel);

        var JournalLineList = resultJournalLine.Data.Select((x, i) => new JournalLineModel
        {
            Id = 0,
            AccountDetailId = x.AccountDetailId,
            AccountGLId = x.AccountGLId,
            AccountSGLId = x.AccountSGLId,
            Amount = x.Amount,
            CompanyId = model.CompanyId,
            CreateUserId = model.UserId,
            CurrencyId = x.CurrencyId,
            Description = x.Description.ConvertArabicAlphabet(),
            ExchangeRate = x.ExchangeRate,
            HeaderId = result.Id,
            NatureTypeId = x.NatureTypeId,
            NoSeriesId = x.NoSeriesId,
            RowNumber = i + 1
        }).ToList();


        var resultBulCopy = _journalLineRepository.BulkInsertJournalLine(JournalLineList);

        var journalId = result.Id;
        var amountDebit = JournalLineList.Where(j => j.NatureTypeId == (byte)AccountNatureTypes.Debit)
            .Sum(x => x.Amount);
        var amountCredit = JournalLineList.Where(j => j.NatureTypeId == (byte)AccountNatureTypes.Credit)
            .Sum(x => x.Amount);

        await _journalLineRepository.UpdateAmountCreditDebit(journalId, model.CompanyId, amountDebit, amountCredit);

        result.Successfull = result.Status == 100;
        return result;
    }


    public async Task<WorkFlowInfo> GetWorkFlowInfo(short branchId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_Workflow_GetList]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<WorkFlowInfo>(sQuery, new
            {
                WorkflowCategoryId = 2,
                StageClassId = "3",
                BranchId = branchId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<StageInfo> GetStageIdWhitWorkFolwId(int WorkflowId, string branchId, byte roleId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_Stage_GetList_By_WorkflowId]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<StageInfo>(sQuery, new
            {
                BranchId = branchId == "null" ? null : branchId,
                WorkflowId,
                WorkflowCategoryId = 2,
                IsActive = 1,
                BySystem = 0,
                StageClassId = "3",
                RoleId = roleId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }
}