using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseOrder;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.Currency;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.PU.PurchaseOrderCartable;

public class PurchaseOrderCartableRepository :
    BaseRepository<PurchaseOrderModel, int, string>,
    IBaseRepository<PurchaseOrderModel, int, string>
{
    private readonly ICompanyRepository _companyRepository;
    private readonly CurrencyRepository _currencyRepository;
    private readonly ILoginRepository _loginRepository;

    public PurchaseOrderCartableRepository(IConfiguration config,
        ICompanyRepository companyRepository,
        CurrencyRepository currencyRepository,
        ILoginRepository loginRepository) : base(config)
    {
        _companyRepository = companyRepository;
        _currencyRepository = currencyRepository;
        _loginRepository = loginRepository;
    }


    public async Task<List<MyDropDownViewModel>> PurchaseOrderGroupCartableSection(int stageClassId, int companyId,
        int? userId, byte roleId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pu.Spc_PurchaseOrder_Cartable_Section";
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

    public GetColumnsViewModel GetColumnPurchaseOrderGroupCartable(int companyId)
    {
        var defaultCurrencyId = _companyRepository.GetDefaultCurrency(companyId).Result;
        var defaultCurrencyName = _currencyRepository.GetName(defaultCurrencyId).Result;

        var list = new GetColumnsViewModel
        {
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "isDataEntry", FieldValue = "1", Operator = "==" } },
            AnswerCondition = "color:#da1717",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", IsPrimary = true, Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 6, FilterType = "number"
                },
                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 8, FilterType = "select2",
                    FilterTypeApi = "/api/GN/BranchApi/getdropdown"
                },
                new() { Id = "workflowId", IsPrimary = true },
                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.Int, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true,
                    FilterType = "select2", FilterTypeApi = "/api/WF/WorkflowApi/getdropdown/0/1/1", Width = 8
                },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = false, Width = 8
                },
                new()
                {
                    Id = "stageId", Title = "مرحله", IsPrimary = true, Width = 6, Type = (int)SqlDbType.Int, Size = 50,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageApi/getdropdown/1/1/2/1"
                },
                new()
                {
                    Id = "treasurySubject", Title = "موضوع", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "orderDatePersian", Title = "تاریخ برگه", IsPrimary = true, Type = (int)SqlDbType.NVarChar,
                    Size = 10, IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "orderNo", Title = "شماره برگه", IsPrimary = true, Type = (int)SqlDbType.Int,
                    IsDtParameter = true, IsFilterParameter = false, FilterType = "number", Width = 6
                },
                new()
                {
                    Id = "noSeries", Title = "گروه تفصیل", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "accountDetail", Title = "نام حساب تفصیل", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new() { Id = "isDataEntry", IsPrimary = true },
                new() { Id = "actionId", IsPrimary = true },
                new() { Id = "branchId", Title = "شناسه شعبه", IsPrimary = true },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "userName", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 6, FilterType = "select2",
                    FilterTypeApi = "api/GN/UserApi/getdropdown/2/false/false"
                },

                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageActionApi/getdropdown/1/2/1", Width = 6
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 8 }
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
                    Name = "printFromPlateHeaderLine", Title = "چاپ", ClassName = "btn blue_1", IconName = "fa fa-print"
                },
                new() { Name = "sep1", Title = "", IsSeparator = true },

                new()
                {
                    Name = "editPersonOrdersCartable", Title = "ویرایش", ClassName = "",
                    IconName = "fa fa-edit color-green"
                },
                new()
                {
                    Name = "deletePersonOrdersCartable", Title = "حذف", ClassName = "",
                    IconName = "fa fa-trash color-maroon"
                },
                new() { Name = "sep1", Title = "", IsSeparator = true },
                new()
                {
                    Name = "OrderDetailSimple", Title = $"تخصیص متغیر ({defaultCurrencyName})", ClassName = "",
                    IconName = "fa fa-list color-green"
                },
                new()
                {
                    Name = "OrderDetailAdvance", Title = "تخصیص متغیر (ارزی)", ClassName = "",
                    IconName = "fa fa-list color-green"
                },
                new()
                {
                    Name = "showStepLogsPurchaseOrderCartable", Title = "گام ها", ClassName = "",
                    IconName = "fas fa-history color-green"
                }
            }
        };
        return list;
    }

    public async Task<MyResultPage<List<PurchaseOrderGetPage>>> PurchaseOrderCartableGetPage(NewGetPageViewModel model,
        int userId, byte roleId)
    {
        var result = new MyResultPage<List<PurchaseOrderGetPage>>
        {
            Data = new List<PurchaseOrderGetPage>()
        };

        var parameters = new DynamicParameters();
        if (int.Parse(model.Form_KeyValue[0]?.ToString()) != 0)
            parameters.Add("StageId", int.Parse(model.Form_KeyValue[0]?.ToString()));

        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "PurchaseOrderCartableApi",
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
                        model.Filters.Any(x => x.Name == "userName"))
                        parameters.Add("CreateUserId",
                            model.Filters.Any(x => x.Name == "userName")
                                ? model.Filters.FirstOrDefault(x => x.Name == "userName").Value
                                : null);

                    else
                        parameters.Add("CreateUserId", int.Parse(model.Form_KeyValue[3]?.ToString()));
                }
            }
            else
            {
                if (int.Parse(model.Form_KeyValue[3]?.ToString()) != 0 && model.Filters.Any(x => x.Name == "userName"))
                    if (model.Filters.FirstOrDefault(x => x.Name == "userName").Value == userId.ToString())
                        parameters.Add("CreateUserId", model.Filters.FirstOrDefault(x => x.Name == "userName").Value);
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
                    model.Filters.Any(x => x.Name == "userName")
                        ? model.Filters.FirstOrDefault(x => x.Name == "userName").Value
                        : null);
        }

        parameters.Add("PurchaseOrderId",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("BranchId",
            model.Filters.Any(x => x.Name == "branch")
                ? model.Filters.FirstOrDefault(x => x.Name == "branch").Value
                : null);
        parameters.Add("WorkflowId",
            model.Filters.Any(x => x.Name == "workflow")
                ? model.Filters.FirstOrDefault(x => x.Name == "workflow").Value
                : null);
        parameters.Add("ActionId",
            model.Filters.Any(x => x.Name == "actionIdName")
                ? model.Filters.FirstOrDefault(x => x.Name == "actionIdName").Value
                : null);
        parameters.Add("CompanyId", model.CompanyId);
        parameters.Add("RoleId", roleId);
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);


        result.Columns = GetColumnPurchaseOrderGroupCartable(model.CompanyId);

        using (var conn = Connection)
        {
            var sQuery = "[pu].[Spc_PurchaseOrder_PostingGroupCartable]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<PurchaseOrderGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }
}