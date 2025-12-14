using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.WH.Item;
using ParsAlphabet.ERP.Application.Dtos.WH.ItemRequest;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.Currency;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemRequestCartable;

public class ItemRequestCartableRepository :
    BaseRepository<ItemModel, int, string>,
    IBaseRepository<ItemModel, int, string>
{
    private readonly ICompanyRepository _companyRepository;
    private readonly CurrencyRepository _currencyRepository;
    private readonly ILoginRepository _loginRepository;

    public ItemRequestCartableRepository(IConfiguration config, ICompanyRepository companyRepository,
        CurrencyRepository currencyRepository, ILoginRepository loginRepository) : base(config)
    {
        _companyRepository = companyRepository;
        _currencyRepository = currencyRepository;
        _loginRepository = loginRepository;
    }


    public GetColumnsViewModel GetColumnItemRequestCartable(int companyId)
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
                    IsFilterParameter = true, FilterType = "number", Width = 6
                },

                new()
                {
                    Id = "branch", Title = "شعبه", IsPrimary = true, Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/GN/BranchApi/getdropdown", Width = 8
                },

                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/WorkflowApi/getdropdown/0/11/1", Width = 8
                },


                new()
                {
                    Id = "warehouse", Title = "انبار", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WH/WarehouseApi/getalldatadropdown", Width = 8
                },

                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 8
                },


                new()
                {
                    Id = "transactionDatePersian", Title = " تاریخ برگه ", IsPrimary = true,
                    Type = (int)SqlDbType.VarChar, Size = 20, IsDtParameter = true, IsFilterParameter = true,
                    FilterType = "doublepersiandate", Width = 7
                },
                new()
                {
                    Id = "no", Title = "شماره برگه", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 6
                },
                new()
                {
                    Id = "noSeries", Title = "گروه تفصیل", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "accountDetail", Title = "تفصیل", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },

                new()
                {
                    Id = "createUser", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 7, FilterType = "select2",
                    FilterTypeApi = "api/GN/UserApi/getdropdown/2/false/false"
                },

                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ وزمان ثبت", Type = (int)SqlDbType.VarChar, Size = 20,
                    IsDtParameter = true, Width = 6
                },

                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageActionApi/getdropdown/11/2/1", Width = 6
                },


                new()
                {
                    Id = "bySystem", Title = "سیستمی", IsPrimary = true, Type = (int)SqlDbType.Bit, Size = 1,
                    IsDtParameter = true, Align = "center", Width = 6
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 6 },
                new() { Id = "workflowId", IsPrimary = true },
                new() { Id = "stageId", IsPrimary = true },
                new() { Id = "branchId", IsPrimary = true },
                new() { Id = "actionId", IsPrimary = true },
                new() { Id = "stageClassId", IsPrimary = true },
                new() { Id = "isDataEntry", IsPrimary = true },
                new() { Id = "inOut", IsPrimary = true }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "displaySimple", Title = "نمایش", ClassName = "", IconName = "far fa-file-alt" },
                new()
                {
                    Name = "printRequestQuantity", Title = "چاپ - تعدادی", ClassName = "btn blue_1",
                    IconName = "fa fa-print"
                },
                new() { Name = "sep1", Title = "", IsSeparator = true },
                new()
                {
                    Name = "editItemRequest", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green",
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "bySystem", FieldValue = "true", Operator = "!=" } }
                },
                new()
                {
                    Name = "deleteItemRequest", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon",
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "bySystem", FieldValue = "true", Operator = "!=" } }
                },
                new() { Name = "sep1", Title = "", IsSeparator = true },
                new()
                {
                    Name = "itemTransactionDetailSimple", Title = "تخصیص متغیرها", ClassName = "",
                    IconName = "fa fa-list color-green",
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "bySystem", FieldValue = "true", Operator = "!=" } }
                },
                new()
                {
                    Name = "showStepLogsItemRequset", Title = "گام ها", ClassName = "",
                    IconName = "fas fa-history color-green"
                }
            }
        };
        return list;
    }

    public async Task<MyResultPage<List<ItemRequestGetPage>>> ItemRequestCartableGetPage(NewGetPageViewModel model,
        int userId)
    {
        var result = new MyResultPage<List<ItemRequestGetPage>>
        {
            Data = new List<ItemRequestGetPage>()
        };

        var fromTransactionDateMiladi = (DateTime?)null;
        var toTransactionDateMiladi = (DateTime?)null;


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
        parameters.Add("ItemtransactionId",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("BranchId",
            model.Filters.Any(x => x.Name == "branch")
                ? model.Filters.FirstOrDefault(x => x.Name == "branch").Value
                : null);
        parameters.Add("WorkflowId",
            model.Filters.Any(x => x.Name == "workflow")
                ? model.Filters.FirstOrDefault(x => x.Name == "workflow").Value
                : null);
        parameters.Add("WarehouseId",
            model.Filters.Any(x => x.Name == "warehouse")
                ? model.Filters.FirstOrDefault(x => x.Name == "warehouse").Value
                : null);
        parameters.Add("No",
            model.Filters.Any(x => x.Name == "no") ? model.Filters.FirstOrDefault(x => x.Name == "no").Value : null);
        parameters.Add("FromTransactionDate", fromTransactionDateMiladi);
        parameters.Add("ToTransactionDate", toTransactionDateMiladi);
        parameters.Add("ActionId",
            model.Filters.Any(x => x.Name == "actionIdName")
                ? model.Filters.FirstOrDefault(x => x.Name == "actionIdName").Value
                : null);

        if (int.Parse(model.Form_KeyValue[0]?.ToString()) != 0)
            parameters.Add("StageId", int.Parse(model.Form_KeyValue[0]?.ToString()));
        else
            parameters.Add("StageId");

        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "ItemRequestCartableApi",
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


        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumnItemRequestCartable(model.CompanyId);

        using (var conn = Connection)
        {
            var sQuery = "[WH].[Spc_ItemTransaction_PostingGroupCartable]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<ItemRequestGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }


    public async Task<List<MyDropDownViewModel>> ItemTransactionCartableSection(int stageClassId, int companyId,
        int? userId, byte roleId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_ItemTransactionCartableSection]";
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