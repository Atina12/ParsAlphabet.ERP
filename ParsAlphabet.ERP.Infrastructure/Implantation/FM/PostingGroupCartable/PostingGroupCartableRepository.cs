using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.FM.NewTreasury;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces.FM.PostingGroupCartable;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.Currency;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.Stage;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.PostingGroupCartable;

public class PostingGroupCartableRepository : IPostingGroupCartableRepository
{
    private readonly ICompanyRepository _companyRepository;
    private readonly IConfiguration _config;
    private readonly CurrencyRepository _currencyRepository;
    private readonly ILoginRepository _loginRepository;
    private readonly StageRepository _stageRepository;

    public PostingGroupCartableRepository(IConfiguration config,
        ICompanyRepository companyRepository,
        CurrencyRepository currencyRepository,
        StageRepository stageRepository,
        ILoginRepository loginRepository)
    {
        _config = config;
        _companyRepository = companyRepository;
        _currencyRepository = currencyRepository;
        _stageRepository = stageRepository;
        _loginRepository = loginRepository;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public GetColumnsViewModel GetColumnsTreasuryCartable(int companyId)
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
                    IsFilterParameter = true, FilterType = "number", Width = 3
                },
                new()
                {
                    Id = "requestId", Title = "شناسه مرجع", IsPrimary = true, Type = (int)SqlDbType.Int,
                    IsDtParameter = true, Width = 5, IsFilterParameter = true, FilterType = "number"
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
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 11
                },
                new() { Id = "workflowId", IsPrimary = true },

                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.Int, Size = 50, IsDtParameter = true,
                    Width = 5, IsFilterParameter = true,
                    FilterType = "select2", FilterTypeApi = "/api/WF/WorkflowApi/getdropdown/0/6/3"
                },

                new()
                {
                    Id = "stageId", Title = "مرحله", IsPrimary = true, Type = (int)SqlDbType.NVarChar, Size = 50,
                    FilterType = "select2", FilterTypeApi = "/api/WF/StageApi/getdropdown/6/0/2/1"
                },
                new()
                {
                    Id = "transactionDatePersian", Title = " تاریخ برگه ", Type = (int)SqlDbType.VarChar, Size = 20,
                    IsDtParameter = true, FilterType = "persiandate", Width = 5
                },
                new()
                {
                    Id = "no", Title = "شماره برگه", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 5
                },
                new()
                {
                    Id = "journalId", Title = "شناسه سند حسابداری", IsPrimary = true, Type = (int)SqlDbType.Int,
                    IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "treasurySubject", Title = "موضوع دریافت / پرداخت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 12
                },
                new()
                {
                    Id = "noSeriesId", Title = "گروه تفضیل", Type = (int)SqlDbType.SmallInt, Width = 6, Editable = true,
                    IsReadOnly = true, InputType = "select",
                    Inputs = null, IsSelect2 = true, Select2Title = "noSeriesName", FillType = "back", IsPrimary = true
                },
                new()
                {
                    Id = "noSeries", Title = "گروه تفضیل", IsPrimary = true, Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "accountDetail", Title = "نام حساب تفصیل", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 12
                },
                new()
                {
                    Id = "documentType", Title = "نوع سند", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 8
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.VarChar, Size = 20,
                    IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "createUser", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 7, FilterType = "select2",
                    FilterTypeApi = "api/GN/UserApi/getdropdown/2/false/false"
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
                    IsDtParameter = true, Width = 4
                },
                new() { Id = "actionId", IsPrimary = true },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 5 },
                new() { Id = "isDataEntry", IsPrimary = true },
                new() { Id = "stageClassId", IsPrimary = true, Type = (int)SqlDbType.TinyInt },
                new() { Id = "isDataEntry", IsPrimary = true },
                new() { Id = "currentInOut", IsPrimary = true },
                new() { Id = "parentworkflowcategoryId", IsPrimary = true }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "displaySimpleTreasury", Title = $"نمایش ({defaultCurrencyName})", ClassName = "",
                    IconName = "far fa-file-alt"
                },
                new()
                {
                    Name = "displayAdvanceTreasury", Title = "نمایش (ارزی)", ClassName = "",
                    IconName = "far fa-file-alt"
                },
                new()
                {
                    Name = "printTreasury", Title = "چاپ - برگه", ClassName = "btn blue_1", IconName = "fa fa-print",
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "stageClassId", FieldValue = "3", Operator = "==" } }
                },
                new()
                {
                    Name = "printRequestTreasury", Title = "چاپ - درخواست", ClassName = "btn blue_1",
                    IconName = "fa fa-print",
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "stageClassId", FieldValue = "1", Operator = "==" } }
                },
                new() { Name = "sep1", Title = "", IsSeparator = true },
                new()
                {
                    Name = "edittr", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green",
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

    public async Task<MyResultPage<List<TreasuryCartableGetPage>>> PostingGroupTreasuryCartableSectionGetPage(
        NewGetPageViewModel model, int userId, byte roleId)
    {
        var result = new MyResultPage<List<TreasuryCartableGetPage>>
        {
            Data = new List<TreasuryCartableGetPage>()
        };
        var parameters = new DynamicParameters();


        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "PostingGroupCartableApi",
            OprType = "VIWALL",
            UserId = userId
        };


        var checkAccessViewAll = await _loginRepository.GetAuthenticate(checkAuthenticate);

        if (int.Parse(model.Form_KeyValue[0]?.ToString()) != 56)
        {
            if (int.Parse(model.Form_KeyValue[0]?.ToString()) != 0)
                parameters.Add("StageId", int.Parse(model.Form_KeyValue[0]?.ToString()));


            if (int.Parse(model.Form_KeyValue[3]?.ToString()) != 0)
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
                    if (int.Parse(model.Form_KeyValue[3]?.ToString()) != 0 &&
                        model.Filters.Any(x => x.Name == "createUser"))
                        if (model.Filters.FirstOrDefault(x => x.Name == "createUser").Value == userId.ToString())
                            parameters.Add("CreateUserId",
                                model.Filters.FirstOrDefault(x => x.Name == "createUser").Value);
                        else
                            parameters.Add("CreateUserId", 0);

                    else
                        parameters.Add("CreateUserId", int.Parse(model.Form_KeyValue[3]?.ToString()));
                }
            }
            else
            {
                if (!checkAccessViewAll.Successfull)
                    parameters.Add("CreateUserId", 0);
                else
                    parameters.Add("CreateUserId",
                        model.Filters.Any(x => x.Name == "createUser")
                            ? model.Filters.FirstOrDefault(x => x.Name == "createUser").Value
                            : null);
            }

            parameters.Add("TreasuryId",
                model.Filters.Any(x => x.Name == "id")
                    ? model.Filters.FirstOrDefault(x => x.Name == "id").Value
                    : null);
            parameters.Add("RequestId",
                model.Filters.Any(x => x.Name == "requestId")
                    ? model.Filters.FirstOrDefault(x => x.Name == "requestId").Value
                    : null);
            parameters.Add("BranchId",
                model.Filters.Any(x => x.Name == "branchId")
                    ? model.Filters.FirstOrDefault(x => x.Name == "branchId").Value
                    : null);
            parameters.Add("TreasuryNo",
                model.Filters.Any(x => x.Name == "no")
                    ? model.Filters.FirstOrDefault(x => x.Name == "no").Value
                    : null);
            parameters.Add("ActionId",
                model.Filters.Any(x => x.Name == "actionIdName")
                    ? model.Filters.FirstOrDefault(x => x.Name == "actionIdName").Value
                    : null);
            parameters.Add("WorkflowId",
                model.Filters.Any(x => x.Name == "workflow")
                    ? model.Filters.FirstOrDefault(x => x.Name == "workflow").Value
                    : null);
            parameters.Add("CompanyId", model.CompanyId);
            parameters.Add("PageNo", model.PageNo);
            parameters.Add("PageRowsCount", model.PageRowsCount);
            parameters.Add("RoleId", roleId);

            result.Columns = GetColumnsTreasuryCartable(model.CompanyId);
        }

        else
        {
            var fromDocumentDateMiladi = (DateTime?)null;
            var toDocumentDateMiladi = (DateTime?)null;

            if (model.Filters.Any(x => x.Name == "documentDatePersian"))
            {
                fromDocumentDateMiladi =
                    model.Filters.FirstOrDefault(x => x.Name == "documentDatePersian").Value.Split('-')[0]
                        .ToMiladiDateTime();
                toDocumentDateMiladi =
                    model.Filters.FirstOrDefault(x => x.Name == "documentDatePersian").Value.Split('-')[1]
                        .ToMiladiDateTime();
            }


            parameters.Add("PageNo", model.PageNo);
            parameters.Add("PageRowsCount", model.PageRowsCount);
            parameters.Add("Id",
                model.Filters.Any(x => x.Name == "id")
                    ? model.Filters.FirstOrDefault(x => x.Name == "id").Value
                    : null);
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
            parameters.Add("ActionId",
                model.Filters.Any(x => x.Name == "actionIdName")
                    ? model.Filters.FirstOrDefault(x => x.Name == "actionIdName").Value
                    : null);
            parameters.Add("RoleId", roleId);

            if (model.CompanyId == 0)
                parameters.Add("CompanyId");
            else
                parameters.Add("CompanyId", model.CompanyId);

            if (int.Parse(model.Form_KeyValue[3]?.ToString()) == 0)
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
                    if (int.Parse(model.Form_KeyValue[3]?.ToString()) != 0 &&
                        model.Filters.Any(x => x.Name == "createUser"))
                        parameters.Add("CreateUserId", 0);

                    else
                        parameters.Add("CreateUserId", int.Parse(model.Form_KeyValue[3]?.ToString()));
                }
            }


            result.Columns = GetColumnsJournalCartable(model.CompanyId);
        }

        var sQuery = "";
        using (var conn = Connection)
        {
            if (int.Parse(model.Form_KeyValue[0]?.ToString()) != 56)
                sQuery = "[fm].[Spc_Treasury_PostingGroupCartable]";
            else
                sQuery = "[fm].[Spc_Journal_PostingGroupCartable]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<TreasuryCartableGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }


    public async Task<List<MyDropDownViewModel>> PostingGroupCartableSection(int stageClassId, int companyId,
        int? userId, byte roleId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_Treasury_PostingGroupCartable_Section]";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    StageClassId = stageClassId,
                    CompanyId = companyId,
                    UserId = userId,
                    RoleId = roleId
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public GetColumnsViewModel GetColumnsJournalCartable(int companyId)
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
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.SmallDateTime, IsDtParameter = true, Width = 5
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
                    Width = 8, IsCommaSep = true
                },
                new()
                {
                    Id = "sumAmountCredit", Title = " بستانکار", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 8, IsCommaSep = true
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 10,
                    Width = 9, IsDtParameter = true, IsFilterParameter = true, FilterType = "doublepersiandate"
                },

                new()
                {
                    Id = "createUser", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 7, FilterType = "select2",
                    FilterTypeApi = "api/GN/UserApi/getdropdown/2/false/false"
                },

                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true,
                    FilterType = "select2", FilterTypeApi = "/api/WF/StageActionApi/getdropdown/2/1/3",
                    Align = "center", Width = 6
                },
                new()
                {
                    Id = "bySystem", Title = "سیستمی", IsPrimary = true, Type = (int)SqlDbType.Bit, Size = 1,
                    IsDtParameter = true, Align = "center", Width = 6
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 6 },
                new() { Id = "parentworkflowcategoryId", IsPrimary = true }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "displaySimpleJournal", Title = $"نمایش ({defaultCurrencyName})", ClassName = "",
                    IconName = "far fa-file-alt"
                },
                new()
                {
                    Name = "displayAdvanceJournal", Title = "نمایش (ارزی)", ClassName = "", IconName = "far fa-file-alt"
                },
                new() { Name = "printJournal", Title = "چاپ", ClassName = "btn blue_1", IconName = "fa fa-print" },
                new()
                {
                    Name = "importExcelJournal", Title = "انتقال اطلاعات / اکسل", ClassName = "",
                    IconName = "fa fa-file-excel color-green",
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "lineCheckExist", FieldValue = "true", Operator = "==" } }
                },
                new() { Name = "sep1", Title = "", IsSeparator = true },
                new()
                {
                    Name = "editjo", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green",
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "bySystem", FieldValue = "true", Operator = "!=" } }
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
}