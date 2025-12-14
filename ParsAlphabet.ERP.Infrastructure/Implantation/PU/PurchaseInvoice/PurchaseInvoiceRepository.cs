using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseInvoice;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseOrder;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Application.Interfaces.PU.PurchaseInvoice;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.Currency;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYear;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.RoleWorkflowPermission;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.Stage;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageActionLog;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.PU.PurchaseInvoice;

public class PurchaseInvoiceRepository : IPurchaseInvoiceRepository
{
    private readonly ICompanyRepository _companyRepository;
    private readonly IConfiguration _config;
    private readonly CurrencyRepository _currencyRepository;
    private readonly FiscalYearRepository _fiscalYearRepository;
    private readonly ILoginRepository _loginRepository;
    private readonly RoleWorklfowPermissionRepository _roleWorklfowPermissionRepository;

    private readonly StageActionLogRepository _stageActionLogRepository;
    private readonly StageActionRepository _stageActionRepository;
    private readonly StageRepository _stageRepository;

    public PurchaseInvoiceRepository(
        IConfiguration config,
        StageActionRepository stageActionRepository,
        StageActionLogRepository stageActionLogRepository,
        FiscalYearRepository fiscalYearRepository,
        ICompanyRepository companyRepository,
        CurrencyRepository currencyRepository,
        StageRepository stageRepository,
        ILoginRepository loginRepository,
        RoleWorklfowPermissionRepository roleWorklfowPermissionRepository)
    {
        _config = config;
        _stageActionRepository = stageActionRepository;
        _stageActionLogRepository = stageActionLogRepository;
        _companyRepository = companyRepository;
        _currencyRepository = currencyRepository;
        _fiscalYearRepository = fiscalYearRepository;
        _loginRepository = loginRepository;
        _roleWorklfowPermissionRepository = roleWorklfowPermissionRepository;
        _stageRepository = stageRepository;
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
                    Id = "requestId", Title = "شناسه مرجع", IsPrimary = true, Type = (int)SqlDbType.Int,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "number", Width = 5
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
                    FilterType = "select2", FilterTypeApi = "/api/WF/WorkflowApi/getdropdown/0/1/2,3,7", Width = 9
                },

                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true,
                    FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageApi/getstagedropdownbyworkflowid/null/null/1/2,3,7/2/2", Width = 12
                },

                new()
                {
                    Id = "orderDatePersian", Title = "تاریخ برگه", IsPrimary = true, Type = (int)SqlDbType.NVarChar,
                    Size = 10, IsDtParameter = true, IsFilterParameter = true, Width = 9,
                    FilterType = "doublepersiandate"
                },
                new()
                {
                    Id = "orderNo", Title = "شماره برگه", IsPrimary = true, Type = (int)SqlDbType.Int,
                    IsDtParameter = true, FilterType = "number", Width = 5
                },

                new()
                {
                    Id = "journalId", Title = "شناسه سند حسابداری", IsPrimary = true, Type = (int)SqlDbType.Int,
                    IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "accountDetail", Title = "نام حساب تفصیل", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "returnReason", Title = "دلیل برگشت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "userName", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 8, FilterType = "select2",
                    FilterTypeApi = "api/GN/UserApi/getdropdown/2/false/false"
                },

                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageActionApi/getdropdown/1/2/2,3,7", Width = 5
                },

                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 7 },

                new() { Id = "isDataEntry", IsPrimary = true },
                new() { Id = "workflowId", IsPrimary = true },
                new() { Id = "stageId", IsPrimary = true },
                new() { Id = "stageClassId", IsPrimary = true },
                new() { Id = "branchId", IsPrimary = true },
                new() { Id = "actionId", IsPrimary = true },
                new() { Id = "parentWorkflowCategoryId", IsPrimary = true }
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
                    Name = "editPersonInvoice", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green"
                },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" },
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
                    Name = "showStepLogsPurchaseInvoiceCartable", Title = "گام ها", ClassName = "",
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
                p.OrderDatePersian,
                p.OrderNo,
                p.JournalId,
                p.AccountDetailName,
                p.ReturnReasonName,
                p.CreateDateTimePersian,
                p.UserName,
                p.ActionName
            };
        return result;
    }

    public async Task<MyResultPage<List<PurchaseInvoiceGetPage>>> GetPage(NewGetPageViewModel model, int userId,
        byte roleId)
    {
        var result = new MyResultPage<List<PurchaseInvoiceGetPage>>
        {
            Data = new List<PurchaseInvoiceGetPage>()
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
        parameters.Add("WorkflowId",
            model.Filters.Any(x => x.Name == "workflow")
                ? model.Filters.FirstOrDefault(x => x.Name == "workflow").Value
                : null);
        parameters.Add("StageId",
            model.Filters.Any(x => x.Name == "stage")
                ? model.Filters.FirstOrDefault(x => x.Name == "stage").Value
                : null);
        parameters.Add("RequestId",
            model.Filters.Any(x => x.Name == "requestId")
                ? model.Filters.FirstOrDefault(x => x.Name == "requestId").Value
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
            ControllerName = "PurchaseInvoiceApi",
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
            var sQuery = "pu.Spc_PurchaseInvoice_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<PurchaseInvoiceGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<List<MyDropDownViewModel>> RequestItemType_GetDropDown(long requestId, int companyId,
        byte currentWorkflowCategoryId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pu].[Spc_PurchaseInvoice_Request_ItemType_List]";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    RequestId = requestId,
                    CompanyId = companyId,
                    CurrentWorkflowCategoryId = currentWorkflowCategoryId
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<PurchaseInvoiceParentIdMyDropdownViewModel>> PurchaseInvoiceRequest_GetDropDown(
        short branchId, short workflowId, int companyId, short stageId, long? requestId, long? purchaseOrderId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_MidSystem_SelectRequestsByStageId]";
            conn.Open();

            var result = (await conn.QueryAsync<PurchaseInvoiceParentIdMyDropdownViewModel>(sQuery,
                new
                {
                    BranchId = branchId,
                    WorkflowId = workflowId,
                    CompanyId = companyId,
                    StageId = stageId,
                    ObjectId = purchaseOrderId,
                    ParentId = requestId == null ? 0 : requestId,
                    AmountOrQuantity = 0
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<PurchaseInvoiceRequestGLSGL> GetRequestPurchaseInvoiceGLSGL(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pu.Spc_PurchaseOrderRequest_GetGLSGL";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<PurchaseInvoiceRequestGLSGL>(sQuery, new
            {
                PurchaseOrderId = id,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<MyResultPage<PurchaseInvoiceGetRecord>> GetRecordById(int id, int companyId)
    {
        var result = new MyResultPage<PurchaseInvoiceGetRecord>
        {
            Data = new PurchaseInvoiceGetRecord()
        };
        using (var conn = Connection)
        {
            var sQuery = "[pu].[Spc_PurchaseOrder_GetRecord]";
            result.Data = await conn.QueryFirstOrDefaultAsync<PurchaseInvoiceGetRecord>(sQuery, new
            {
                Id = id,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<long> GetPersonVendorId(long id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<long>(sQuery,
                new
                {
                    TableName = "pu.PurchaseOrder",
                    ColumnName = "PersonId",
                    Filter = $"Id={id}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<MyResultQuery> Insert(PurchaseInvoiceModel model, byte roleId)
    {
        var result = new MyResultQuery();

        var PurchaseOrderViewModel = new PurchaseOrderViewModel
        {
            DocumentDate = model.OrderDate
        };
        var validationError = await Validate(PurchaseOrderViewModel, model.CompanyId, OperationType.Insert, roleId);

        if (validationError.Count > 0)
            return new MyResultQuery
            {
                Status = -98,
                Successfull = false,
                ValidationErrors = validationError
            };


        var getStageAction = new GetAction();
        getStageAction.CompanyId = model.CompanyId;
        getStageAction.StageId = model.StageId;
        getStageAction.Priority = 1;
        getStageAction.WorkflowId = model.WorkflowId;
        var stageAction = await _stageActionRepository.GetAction(getStageAction);

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
                    model.WorkflowId,
                    model.PersonGroupTypeId,
                    model.OrderDate,
                    model.ReturnReasonId,
                    model.TreasurySubjectId,
                    model.Note,
                    CreateUserId = model.UserId,
                    model.CreateDateTime,
                    model.CompanyId,
                    model.ActionId,
                    model.AccountGLId,
                    model.AccountSGLId,
                    model.NoSeriesId,
                    model.AccountDetailId,
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
            result.Successfull = false;
            var stage = await _stageRepository.GetName(model.StageId);
            result.StatusMessage = $"{stage} دسترسی ندارید ";
        }

        return result;
    }

    public async Task<MyResultStatus> Update(PurchaseInvoiceModel model, byte roleId)
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
                model.WorkflowId,
                model.OrderDate,
                model.ReturnReasonId,
                model.TreasurySubjectId,
                model.Note,
                CreateUserId = model.UserId,
                model.CreateDateTime,
                model.CompanyId,
                model.AccountGLId,
                model.AccountSGLId,
                model.NoSeriesId,
                model.AccountDetailId,
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
                ControllerName = "PurchaseInvoiceApi",
                OprType = "VIWALL",
                UserId = userId
            };


            // check access VIWALL
            var checkAccessViewAll = await _loginRepository.GetAuthenticate(checkAuthenticate);
            filter =
                $"Id={id} AND CompanyId={companyId} AND StageId IN(SELECT s.Id FROM wf.Stage s WHERE s.WorkflowCategoryId=1 AND s.StageClassId<>1)";

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

    public async Task<List<MyDropDownViewModel>> NoSeriesNameWhitStage_GetDropDown(short StageId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_Purchase_Stage_NoSeries_List]";

            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery, new
            {
                StageId
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result.AsList();
        }
    }

    public virtual async Task<MyResultStatus> Delete(int id, int companyId, byte roleId)
    {
        var result = new MyResultStatus();
        var purchaseOrder = GetPurchaseOrderInfo(id, companyId).Result;

        var purchaseOrderViewModel = new PurchaseOrderViewModel
        {
            DocumentDate = purchaseOrder.DocumentDate,
            StageId = purchaseOrder.StageId,
            ActionId = purchaseOrder.ActionId,
            WorkflowId = purchaseOrder.WorkflowId
        };
        var validationError = await Validate(purchaseOrderViewModel, companyId, OperationType.Delete, roleId);

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
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
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
                ColumnName = "Id,StageId,ActionId,DocumentDate",
                Filter = $"Id={id} AND CompanyId={companyId} "
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }


    public async Task<List<HeaderPurchasePostingGroup>> GetHeaderPurchasePostingGroup(List<ID> Ids, int companyId)
    {
        var headerList = new List<HeaderPurchasePostingGroup>();

        using (var conn = Connection)
        {
            var sQuery = "[pu].[Spc_PurchaseHeader_PostingGroup_GetList]";
            conn.Open();
            headerList = (await conn.QueryAsync<HeaderPurchasePostingGroup>(
                sQuery, new
                {
                    IdsJSON = JsonConvert.SerializeObject(Ids),
                    CompanyId = companyId
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return headerList;
    }

    public async Task<string> GetOrderDatePersian(long id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<string>(sQuery, new
            {
                TableName = "pu.PurchaseOrder",
                ColumnName = "FORMAT(DocumentDate,'yyyy/MM/dd','fa')",
                Filter = $"Id={id} AND CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
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
}