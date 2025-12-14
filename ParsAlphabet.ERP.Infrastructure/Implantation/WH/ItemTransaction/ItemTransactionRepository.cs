using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.WH.ItemTransaction;
using ParsAlphabet.ERP.Application.Dtos.WH.ItemTransactionLine;
using ParsAlphabet.ERP.Application.Dtos.WH.WarehouseTransaction;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.RoleWorkflowPermission;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemTransaction;

public class ItemTransactionRepository :
    BaseRepository<WarehouseTransactionModel, int, string>,
    IBaseRepository<WarehouseTransactionModel, int, string>
{
    public readonly IHttpContextAccessor _accessor;
    private readonly ILoginRepository _loginRepository;
    private readonly RoleWorklfowPermissionRepository _roleWorklfowPermissionRepository;

    public ItemTransactionRepository(
        IConfiguration config, IHttpContextAccessor accessor,
        ILoginRepository loginRepository,
        RoleWorklfowPermissionRepository roleWorklfowPermissionRepository
    ) : base(config)
    {
        _accessor = accessor;
        _loginRepository = loginRepository;
        _roleWorklfowPermissionRepository = roleWorklfowPermissionRepository;
    }


    public GetColumnsViewModel GetColumns(int companyId)
    {
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
                    IsFilterParameter = true, FilterType = "number", Width = 5
                },
                new()
                {
                    Id = "requestId", Title = "شناسه مرجع", IsPrimary = true, Type = (int)SqlDbType.Int,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "number", Width = 4
                },
                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 50, IsPrimary = true,
                    IsDtParameter = true, IsFilterParameter = true,
                    FilterType = "select2", FilterTypeApi = "/api/GN/BranchApi/getdropdown", Width = 6
                },

                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true,
                    FilterType = "select2", FilterTypeApi = "/api/WF/WorkflowApi/getdropdown/0/11/3,4,8,11", Width = 9
                },

                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 50, IsPrimary = true,
                    IsDtParameter = true, IsFilterParameter = true,
                    FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageApi/getstagedropdownbyworkflowid/null/null/11/3,4,8,11/2/2", Width = 8
                },


                new()
                {
                    Id = "transactionDatePersian", Title = " تاریخ برگه ", IsPrimary = true,
                    Type = (int)SqlDbType.VarChar, Size = 20, IsDtParameter = true, IsFilterParameter = true,
                    FilterType = "doublepersiandate", Width = 6
                },
                new()
                {
                    Id = "no", Title = "شماره برگه", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 5
                },
                new()
                {
                    Id = "journalId", Title = "شناسه سند حسابداری ", IsPrimary = true, Type = (int)SqlDbType.Int,
                    IsDtParameter = true, Width = 6
                },

                new()
                {
                    Id = "warehouse", Title = "انبار", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true,
                    FilterType = "select2", FilterTypeApi = "/api/WH/WarehouseApi/getalldatadropdown", Width = 10
                },

                new()
                {
                    Id = "accountDetail", Title = "تفصیل", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 9
                },
                new()
                {
                    Id = "documentType", Title = "نوع سند", Type = (int)SqlDbType.NVarChar, IsPrimary = true,
                    IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.VarChar, Size = 20,
                    IsDtParameter = true, Width = 4
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
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageActionApi/getdropdown/11/2/3,4,8,11,14,15,16", Width = 6
                },


                new()
                {
                    Id = "bySystem", Title = "سیستمی", IsPrimary = true, Type = (int)SqlDbType.Bit, Size = 1,
                    IsDtParameter = true, Align = "center", Width = 4
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 4 },

                new() { Id = "workflowId", IsPrimary = true },
                new() { Id = "stageId", IsPrimary = true },
                new() { Id = "branchId", IsPrimary = true },
                new() { Id = "actionId", IsPrimary = true },
                new() { Id = "stageClassId", IsPrimary = true },
                new() { Id = "isDataEntry", IsPrimary = true },
                new() { Id = "isQuantityWarehouse", IsPrimary = true },
                new() { Id = "inOut", IsPrimary = true },
                new() { Id = "parentWorkflowCategoryId", IsPrimary = true }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "displaySimpleQuntity", Title = "نمایش - تعدادی", ClassName = "",
                    IconName = "far fa-file-alt"
                },
                new() { Name = "displaySimple", Title = "نمایش - ریالی", ClassName = "", IconName = "far fa-file-alt" },

                new()
                {
                    Name = "printQuantity", Title = "چاپ - تعدادی", ClassName = "btn blue_1", IconName = "fa fa-print"
                },
                new()
                {
                    Name = "printAmount", Title = "چاپ - ریالی", ClassName = "btn blue_1", IconName = "fa fa-print"
                },
                new() { Name = "sep1", Title = "", IsSeparator = true },

                new()
                {
                    Name = "editItemTransaction", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green",
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
                    Name = "itemTransactionDetailSimple", Title = "تخصیص متغیرها", ClassName = "",
                    IconName = "fa fa-list color-green",
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "bySystem", FieldValue = "true", Operator = "!=" } }
                },
                new()
                {
                    Name = "showStepLogsItemTransaction", Title = "گام ها", ClassName = "",
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
                p.Warehouse,
                p.AccountDetail,
                p.DocumentType,
                p.CreateDateTimePersian,
                p.CreateUser,
                p.ActionIdName,
                BySystem = p.BySystem ? "بلی" : "خیر"
            };
        return result;
    }

    public async Task<MyResultPage<List<ItemTransactionGetPage>>> GetPage(NewGetPageViewModel model, int userId,
        byte roleId)
    {
        var result = new MyResultPage<List<ItemTransactionGetPage>>
        {
            Data = new List<ItemTransactionGetPage>()
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

        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("StageId",
            model.Filters.Any(x => x.Name == "stage")
                ? model.Filters.FirstOrDefault(x => x.Name == "stage").Value
                : null);
        parameters.Add("WorkflowId",
            model.Filters.Any(x => x.Name == "workflow")
                ? model.Filters.FirstOrDefault(x => x.Name == "workflow").Value
                : null);
        parameters.Add("BranchId",
            model.Filters.Any(x => x.Name == "branch")
                ? model.Filters.FirstOrDefault(x => x.Name == "branch").Value
                : null);
        parameters.Add("RequestId",
            model.Filters.Any(x => x.Name == "requestId")
                ? model.Filters.FirstOrDefault(x => x.Name == "requestId").Value
                : null);
        parameters.Add("WarehouseId",
            model.Filters.Any(x => x.Name == "warehouse")
                ? model.Filters.FirstOrDefault(x => x.Name == "warehouse").Value
                : null);
        parameters.Add("ActionId",
            model.Filters.Any(x => x.Name == "actionIdName")
                ? model.Filters.FirstOrDefault(x => x.Name == "actionIdName").Value
                : null);
        parameters.Add("No",
            model.Filters.Any(x => x.Name == "no") ? model.Filters.FirstOrDefault(x => x.Name == "no").Value : null);
        parameters.Add("FromTransactionDate", fromTransactionDateMiladi);
        parameters.Add("ToTransactionDate", toTransactionDateMiladi);
        parameters.Add("RoleId", roleId);

        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "ItemTransactionApi",
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
            var sQuery = "[wh].[Spc_ItemTransaction_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<ItemTransactionGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<List<MyDropDownViewModel>> RequestItemType_GetDropDown(long itemTransactionId, long requestId,
        int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_Transaction_SelectItemTypeRequest]";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TransactionId = itemTransactionId,
                    RequestId = requestId,
                    CompanyId = companyId
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<ParentIdMyDropdownViewModel>> Request_GetDropDown(short branchId, short workflowId,
        int companyId, short stageId, long? requestId, long? id)
    {
        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_MidSystem_SelectRequestsByStageId]";
            conn.Open();

            var result = (await conn.QueryAsync<ParentIdMyDropdownViewModel>(sQuery,
                new
                {
                    BranchId = branchId,
                    WorkFlowId = workflowId,
                    CompanyId = companyId,
                    StageId = stageId,
                    ObjectId = id,
                    ParentId = requestId == null ? 0 : requestId,
                    AmountOrQuantity = 0
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<bool> CheckExist(WarehouseExistViewModel model, int userId, byte roleId)
    {
        var filter = "";
        //بررسی دسترسی براساس نقش و جریان کار و مرحله
        var hasPermission =
            await _roleWorklfowPermissionRepository.CheckRoleWorkflowPermissionByHeaderId(model.Id, 11, roleId);
        if (hasPermission == 1)
        {
            var checkAuthenticate = new CheckAuthenticateViewModel
            {
                ControllerName = "ItemTransactionApi",
                OprType = "VIWALL",
                UserId = userId
            };


            var checkAccessViewAll = await _loginRepository.GetAuthenticate(checkAuthenticate);

            filter =
                $"Id={model.Id} AND companyId={model.CompanyId}  AND stageId in (SELECT Id FROM wf.Stage s WHERE s.WorkflowCategoryId=11  AND s.IsActive=1 AND StageClassId in(3,4,8,11,14,15,16))";

            if (!checkAccessViewAll.Successfull)

                filter += $" AND CreateUserId={userId}";

            if (model.BySystem != 2)
                filter += " AND BySystem=0";
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
                TableName = "wh.ItemTransaction",
                ColumnName = "Id",
                Filter = filter
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result > 0;
        }
    }
}