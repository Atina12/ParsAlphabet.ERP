using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseOrder;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.Currency;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYear;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.RoleWorkflowPermission;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.Stage;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageActionLog;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.PU.PurchaseOrder;

public class PurchaseOrderRepository :
    BaseRepository<PurchaseOrderModel, int, string>,
    IBaseRepository<PurchaseOrderModel, int, string>
{
    private readonly ICompanyRepository _companyRepository;
    private readonly CurrencyRepository _currencyRepository;
    private readonly FiscalYearRepository _fiscalYearRepository;
    private readonly ILoginRepository _loginRepository;
    private readonly RoleWorklfowPermissionRepository _roleWorklfowPermissionRepository;
    private readonly StageActionLogRepository _stageActionLogRepository;
    private readonly StageActionRepository _stageActionRepository;
    private readonly StageRepository _stageRepository;

    public PurchaseOrderRepository(IConfiguration config,
        StageActionRepository stageActionRepository,
        StageActionLogRepository stageActionLogRepository,
        FiscalYearRepository fiscalYearRepository,
        ICompanyRepository companyRepository,
        CurrencyRepository currencyRepository,
        ILoginRepository loginRepository,
        StageRepository stageRepository,
        RoleWorklfowPermissionRepository roleWorklfowPermissionRepository
    ) : base(config)
    {
        _fiscalYearRepository = fiscalYearRepository;
        _stageActionRepository = stageActionRepository;
        _companyRepository = companyRepository;
        _currencyRepository = currencyRepository;
        _stageActionLogRepository = stageActionLogRepository;
        _loginRepository = loginRepository;
        _roleWorklfowPermissionRepository = roleWorklfowPermissionRepository;
        _stageRepository = stageRepository;
    }

    public GetColumnsViewModel GetColumns(int companyId)
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
                    IsFilterParameter = true, Width = 5, FilterType = "number"
                },

                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 8, FilterType = "select2",
                    FilterTypeApi = "/api/GN/BranchApi/getdropdown"
                },
                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true,
                    FilterType = "select2", FilterTypeApi = "/api/WF/WorkflowApi/getdropdown/0/1/1", Width = 14
                },

                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true,
                    FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageApi/getstagedropdownbyworkflowid/null/null/1/1/2/2", Width = 11
                },

                new()
                {
                    Id = "orderDatePersian", Title = "تاریخ برگه", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsPrimary = true, IsDtParameter = true, IsFilterParameter = true, Width = 7,
                    FilterType = "doublepersiandate"
                },
                new()
                {
                    Id = "orderNo", Title = "شماره برگه", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "treasurySubject", Title = "موضوع", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "accountDetail", Title = "نام حساب تفصیل", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
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

                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 7 },

                new() { Id = "isDataEntry", IsPrimary = true },
                new() { Id = "workflowId", IsPrimary = true },
                new() { Id = "stageId", IsPrimary = true },
                new() { Id = "actionId", IsPrimary = true },
                new() { Id = "orderDate", IsPrimary = true },
                new() { Id = "branchId", IsPrimary = true }
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
                    Name = "editPersonOrders", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green"
                },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" },
                new() { Name = "sep1", Title = "", IsSeparator = true },
                new()
                {
                    Name = "orderDetailSimple", Title = $"تخصیص متغیر ({defaultCurrencyName})", ClassName = "",
                    IconName = "fa fa-list color-green"
                },
                new()
                {
                    Name = "orderDetailAdvance", Title = "تخصیص متغیر (ارزی)", ClassName = "",
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

    public GetColumnsViewModel AllocationColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 5
                },
                new()
                {
                    Id = "partnerTypeName", Title = "شخصیت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = false, Width = 5
                },
                new()
                {
                    Id = "genderName", Title = "جنسیت", Type = (int)SqlDbType.VarChar, Size = 30, IsDtParameter = true,
                    Width = 6
                },
                new()
                {
                    Id = "fullName", Title = "نام ", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "mobileNo", Title = "شماره موبایل", Type = (int)SqlDbType.VarChar, Size = 11,
                    IsDtParameter = true, IsFilterParameter = true, Width = 7
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
                p.OrderDatePersian,
                p.OrderNo,
                p.TreasurySubject,
                p.AccountDetail,
                p.CreateDateTimePersian,
                p.UserName,
                p.ActionName
            };
        return result;
    }

    public async Task<MyResultPage<List<PurchaseOrderGetPage>>> GetPage(NewGetPageViewModel model, int userId,
        byte roleId)
    {
        var result = new MyResultPage<List<PurchaseOrderGetPage>>
        {
            Data = new List<PurchaseOrderGetPage>()
        };

        var fromOrderDate = (DateTime?)null;
        var toOrderDate = (DateTime?)null;

        if (model.Filters.Any(x => x.Name == "orderDatePersian"))
        {
            fromOrderDate = model.Filters.FirstOrDefault(x => x.Name == "orderDatePersian").Value.Split('-')[0]
                .ToMiladiDateTime();
            toOrderDate = model.Filters.FirstOrDefault(x => x.Name == "orderDatePersian").Value.Split('-')[1]
                .ToMiladiDateTime();
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("BranchId",
            model.Filters.Any(x => x.Name == "branch")
                ? model.Filters.FirstOrDefault(x => x.Name == "branch").Value
                : null);
        parameters.Add("StageId",
            model.Filters.Any(x => x.Name == "stage")
                ? model.Filters.FirstOrDefault(x => x.Name == "stage").Value
                : null);
        parameters.Add("WorkflowId",
            model.Filters.Any(x => x.Name == "workflow")
                ? model.Filters.FirstOrDefault(x => x.Name == "workflow").Value
                : null);

        parameters.Add("ActionId",
            model.Filters.Any(x => x.Name == "actionIdName")
                ? model.Filters.FirstOrDefault(x => x.Name == "actionIdName").Value
                : null);
        parameters.Add("FromOrderDate", fromOrderDate);
        parameters.Add("ToOrderDate", toOrderDate);
        parameters.Add("CompanyId", model.CompanyId);

        parameters.Add("RoleId", roleId);

        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "PurchaseOrderApi",
            OprType = "VIWALL",
            UserId = userId
        };


        var checkAccessViewAll = await _loginRepository.GetAuthenticate(checkAuthenticate);

        if (int.Parse(model.Form_KeyValue[1]?.ToString()) == 0)
        {
            if (!checkAccessViewAll.Successfull)
                parameters.Add("CreateUserId", 0);
            else
                parameters.Add("CreateUserId",
                    model.Filters.Any(x => x.Name == "userName")
                        ? model.Filters.FirstOrDefault(x => x.Name == "userName").Value
                        : null);
        }

        else
        {
            if (checkAccessViewAll.Successfull)
            {
                if (int.Parse(model.Form_KeyValue[1]?.ToString()) != 0 && model.Filters.Any(x => x.Name == "userName"))
                    parameters.Add("CreateUserId",
                        model.Filters.Any(x => x.Name == "userName")
                            ? model.Filters.FirstOrDefault(x => x.Name == "userName").Value
                            : null);

                else
                    parameters.Add("CreateUserId", int.Parse(model.Form_KeyValue[1]?.ToString()));
            }
            else
            {
                if (int.Parse(model.Form_KeyValue[1]?.ToString()) != 0 && model.Filters.Any(x => x.Name == "userName"))
                    if (model.Filters.FirstOrDefault(x => x.Name == "userName").Value == userId.ToString())
                        parameters.Add("CreateUserId", model.Filters.FirstOrDefault(x => x.Name == "userName").Value);
                    else
                        parameters.Add("CreateUserId", 0);

                else
                    parameters.Add("CreateUserId", int.Parse(model.Form_KeyValue[1]?.ToString()));
            }
        }


        result.Columns = GetColumns(model.CompanyId);

        using (var conn = Connection)
        {
            var sQuery = "pu.Spc_PurchaseOrder_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<PurchaseOrderGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultPage<PurchaseOrderGetRecord>> GetRecordById(int id, int companyId)
    {
        var result = new MyResultPage<PurchaseOrderGetRecord>
        {
            Data = new PurchaseOrderGetRecord()
        };
        using (var conn = Connection)
        {
            var sQuery = "[pu].[Spc_PurchaseOrder_GetRecord]";
            result.Data = await conn.QueryFirstOrDefaultAsync<PurchaseOrderGetRecord>(sQuery, new
            {
                Id = id,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<List<string>> Validate(PurchaseOrderViewModel model, int companyId, OperationType operationType,
        byte roleId)
    {
        var error = new List<string>();

        if (model == null)
        {
            error.Add("درخواست معتبر نمی باشد");
            return error;
        }

        await Task.Run(async () =>
        {
            #region بررسی حذف با نقش و جریان کار و مرحله

            if (operationType == OperationType.Delete)
            {
                var hasPermission =
                    await _roleWorklfowPermissionRepository.CheckRoleWorkflowPermission(model.WorkflowId,
                        model.BranchId, model.StageId, model.ActionId, roleId);
                if (hasPermission == 0)
                {
                    var stage = await _stageRepository.GetName(model.StageId);
                    error.Add($"{stage} دسترسی ندارید ");
                }
            }

            #endregion

            #region بررسی وضعیت دوره مالی

            var resultCheckFiscalYear =
                await _fiscalYearRepository.GetFicalYearStatusByDate(model.DocumentDate, companyId);

            if (!resultCheckFiscalYear.Successfull)
                error.Add(resultCheckFiscalYear.StatusMessage);

            #endregion
        });

        return error;
    }

    public async Task<List<StageActionGetRecord>> GetCurrentPurchaseOrderAction(long id, int companyId, byte getType)
    {
        using (var conn = Connection)
        {
            var sQuery = "pu.Spc_Get_PurchaseOrderActionConfig";
            conn.Open();

            var result = await conn.QueryAsync<StageActionGetRecord>(sQuery, new
            {
                identityId = id,
                CompanyId = companyId,
                GetType = getType
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result.AsList();
        }
    }


    public async Task<MyResultQuery> Insert(PurchaseOrderModel model, byte roleId)
    {
        var result = new MyResultQuery();

        var purchaseOrderViewModel = new PurchaseOrderViewModel
        {
            DocumentDate = model.OrderDate
        };
        var validationError = await Validate(purchaseOrderViewModel, model.CompanyId, OperationType.Insert, roleId);


        if (validationError.Count > 0)
            return new MyResultQuery
            {
                Status = -98,
                Successfull = false,
                ValidationErrors = validationError
            };


        var getPurchaseOrderAction = new GetAction();
        getPurchaseOrderAction.CompanyId = model.CompanyId;
        getPurchaseOrderAction.StageId = model.StageId;

        getPurchaseOrderAction.Priority = 1;
        getPurchaseOrderAction.WorkflowId = model.WorkflowId;
        var stageAction = await _stageActionRepository.GetAction(getPurchaseOrderAction);


        var hasPermission = await _roleWorklfowPermissionRepository.CheckRoleWorkflowPermission(model.WorkflowId,
            model.BranchId, model.StageId, stageAction.ActionId, roleId);

        if (hasPermission == 1)
        {
            model.ActionId = stageAction.ActionId;
            model.PersonGroupTypeId = GetPersonGroupTypeId(model.NoSeriesId);


            using (var conn = Connection)
            {
                var sQuery = "pu.Spc_PurchaseOrder_Ins";
                conn.Open();
                var outPut = await conn.QueryFirstOrDefaultAsync<int>(sQuery, new
                {
                    model.Id,
                    model.StageId,
                    model.BranchId,
                    model.PersonGroupTypeId,
                    model.OrderDate,
                    model.ReturnReasonId,
                    model.TreasurySubjectId,
                    model.Note,
                    CreateUserId = model.UserId,
                    model.CreateDateTime,
                    model.CompanyId,
                    model.WorkflowId,
                    model.ActionId,
                    model.AccountGLId,
                    model.AccountSGLId,
                    NoSeriesId = model.NoSeriesId == 0 ? null : model.NoSeriesId,
                    AccountDetailId = model.AccountDetailId == 0 ? null : model.AccountDetailId,
                    model.IsOrderQuantity,
                    model.ParentWorkflowCategoryId,
                    model.InOut,
                    DocumentTypeId = model.DocumentTypeId == 0 ? null : model.DocumentTypeId,
                    model.RequestId
                }, commandType: CommandType.StoredProcedure);

                result.Successfull = outPut > 0 ? true : false;
                result.Id = outPut;

                if (result.Successfull)
                {
                    var updateStepModel = new UpdateAction
                    {
                        RequestActionId = model.ActionId,
                        IdentityId = int.Parse(result.Id.ToString()),
                        StageId = model.StageId,
                        WorkflowId = model.WorkflowId,
                        WorkflowCategoryId = 1,
                        CompanyId = model.CompanyId,
                        UserId = model.UserId
                    };

                    await _stageActionLogRepository.StageActionLogInsert(updateStepModel);
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

    public async Task<MyResultStatus> Update(PurchaseOrderModel model, byte roleId)
    {
        var PurchaseOrderViewModel = new PurchaseOrderViewModel
        {
            DocumentDate = model.OrderDate
        };
        var validationError = await Validate(PurchaseOrderViewModel, model.CompanyId, OperationType.Update, roleId);


        if (validationError.Count > 0)
            return new MyResultStatus
            {
                Status = -98,
                Successfull = false,
                ValidationErrors = validationError
            };

        model.PersonGroupTypeId = GetPersonGroupTypeId(model.NoSeriesId);


        var result = new MyResultStatus();
        using (var conn = Connection)
        {
            var sQuery = "pu.Spc_PurchaseOrder_Upd";
            conn.Open();
            var outPut = await conn.QueryFirstOrDefaultAsync<int>(sQuery, new
            {
                model.Id,
                model.PersonGroupTypeId,
                model.OrderDate,
                model.ReturnReasonId,
                model.TreasurySubjectId,
                model.Note,
                CreateUserId = model.UserId,
                model.CreateDateTime,
                model.CompanyId,
                model.WorkflowId,
                model.AccountGLId,
                model.AccountSGLId,
                NoSeriesId = model.NoSeriesId == 0 ? null : model.NoSeriesId,
                AccountDetailId = model.AccountDetailId == 0 ? null : model.AccountDetailId,
                model.IsOrderQuantity,
                model.InOut,
                model.RequestId,
                model.ParentWorkflowCategoryId
            }, commandType: CommandType.StoredProcedure);
            result.Successfull = outPut > 0;
            result.Id = model.Id;
        }

        return result;
    }

    public virtual async Task<MyResultStatus> Delete(int id, int companyId, byte roleId)
    {
        var result = new MyResultStatus();
        var purchaseOrder = GetPurchaseOrderInfo(id, companyId).Result;

        var PurchaseOrderViewModel = new PurchaseOrderViewModel
        {
            DocumentDate = purchaseOrder.DocumentDate,
            StageId = purchaseOrder.StageId,
            WorkflowId = purchaseOrder.WorkflowId,
            ActionId = purchaseOrder.ActionId
        };

        var validationError = await Validate(PurchaseOrderViewModel, companyId, OperationType.Delete, roleId);

        if (validationError.Count > 0)
            return new MyResultStatus
            {
                Status = -98,
                Successfull = false,
                ValidationErrors = validationError
            };

        using (var conn = Connection)
        {
            var sQuery = "[pu].[Spc_Purchaseorder_Delete]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(
                sQuery, new
                {
                    PurchaseOrderId = id
                }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        result.ValidationErrors = result.Successfull
            ? new List<string> { "عملیات حذف با موفقیت انجام شد" }
            : new List<string> { "عملیات حذف با موفقیت انجام نشد" };

        return result;
    }

    public async Task<PurchaseOrderViewModel> GetPurchaseOrderInfo(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<PurchaseOrderViewModel>(sQuery, new
            {
                TableName = "pu.PurchaseOrder",
                ColumnName = "Id,StageId,WorkflowId,ParentWorkflowCategoryId,ActionId,DocumentDate",
                Filter = $"Id={id} AND CompanyId={companyId} "
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
            await _roleWorklfowPermissionRepository.CheckRoleWorkflowPermissionByHeaderId(id, 1, roleId);

        if (hasPermission == 1)
        {
            var checkAuthenticate = new CheckAuthenticateViewModel
            {
                ControllerName = "PurchaseOrderApi",
                OprType = "VIWALL",
                UserId = userId
            };


            // check access VIWALL
            var checkAccessViewAll = await _loginRepository.GetAuthenticate(checkAuthenticate);
            filter =
                $"Id={id} AND CompanyId={companyId} AND StageId IN(SELECT s.Id FROM wf.Stage s WHERE s.WorkflowCategoryId=1 AND s.StageClassId=1)";

            if (!checkAccessViewAll.Successfull)
                filter += $"AND CreateUserId={userId}";
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
                TableName = "pu.PurchaseOrder",
                ColumnName = "Id",
                Filter = filter
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result > 0;
        }
    }
}