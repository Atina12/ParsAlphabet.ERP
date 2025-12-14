using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.FM.NewTreasury;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces.FM.TreasuryRequestCartable;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.Currency;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.TreasuryRequestCartable;

public class TreasuryRequestCartableRepository : ITreasuryRequestCartableRepository
{
    private readonly ICompanyRepository _companyRepository;
    private readonly IConfiguration _config;
    private readonly CurrencyRepository _currencyRepository;
    private readonly ILoginRepository _loginRepository;

    public TreasuryRequestCartableRepository(IConfiguration config,
        ICompanyRepository companyRepository,
        CurrencyRepository currencyRepository,
        ILoginRepository loginRepository)
    {
        _config = config;
        _companyRepository = companyRepository;
        _currencyRepository = currencyRepository;
        _loginRepository = loginRepository;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public GetColumnsViewModel GetColumnsTreasuryRequestCartable(int companyId)
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
                    Id = "branchId", IsPrimary = true, Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 50,
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
                    IsFilterParameter = true,
                    FilterType = "select2", FilterTypeApi = "/api/WF/WorkflowApi/getdropdown/0/6/1", Width = 5
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
                new() { Id = "currentInOut", IsPrimary = true }
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
                    Name = "editTreasuryRequest", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green",
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

    public async Task<MyResultPage<List<TreasuryCartableGetPage>>> TreasuryRequestCartableSectionGetPage(
        NewGetPageViewModel model, int userId, byte roleId)
    {
        var result = new MyResultPage<List<TreasuryCartableGetPage>>
        {
            Data = new List<TreasuryCartableGetPage>()
        };
        var parameters = new DynamicParameters();


        if (int.Parse(model.Form_KeyValue[0]?.ToString()) != 0)
            parameters.Add("StageId", int.Parse(model.Form_KeyValue[0]?.ToString()));


        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "TreasuryRequestCartableApi",
            OprType = "VIWALL",
            UserId = userId
        };


        var checkAccessViewAll = await _loginRepository.GetAuthenticate(checkAuthenticate);

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
                if (int.Parse(model.Form_KeyValue[3]?.ToString()) != 0 && model.Filters.Any(x => x.Name == "createUser"))
                    if (model.Filters.FirstOrDefault(x => x.Name == "createUser").Value == userId.ToString())
                        parameters.Add("CreateUserId", model.Filters.FirstOrDefault(x => x.Name == "createUser").Value);
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
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("RequestId",
            model.Filters.Any(x => x.Name == "requestId")
                ? model.Filters.FirstOrDefault(x => x.Name == "requestId").Value
                : null);
        parameters.Add("BranchId",
            model.Filters.Any(x => x.Name == "branchId")
                ? model.Filters.FirstOrDefault(x => x.Name == "branchId").Value
                : null);
        parameters.Add("TreasuryNo",
            model.Filters.Any(x => x.Name == "no") ? model.Filters.FirstOrDefault(x => x.Name == "no").Value : null);
        parameters.Add("WorkflowId",
            model.Filters.Any(x => x.Name == "workflow")
                ? model.Filters.FirstOrDefault(x => x.Name == "workflow").Value
                : null);
        parameters.Add("ActionId",
            model.Filters.Any(x => x.Name == "actionIdName")
                ? model.Filters.FirstOrDefault(x => x.Name == "actionIdName").Value
                : null);
        parameters.Add("CompanyId", model.CompanyId);
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("RoleId", roleId);
        result.Columns = GetColumnsTreasuryRequestCartable(model.CompanyId);

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_Treasury_PostingGroupCartable]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<TreasuryCartableGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<List<MyDropDownViewModel>> TreasuryRequestCartableSection(int stageClassId, int companyId,
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
}