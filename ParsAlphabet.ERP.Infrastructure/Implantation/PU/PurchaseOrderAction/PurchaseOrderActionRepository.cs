using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.FM.NewTreasury;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseOrder;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseOrderAction;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseOrderLine;
using ParsAlphabet.ERP.Application.Interfaces.PU.PurchaseOrderAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYear;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.PU.PurchaseOrderAction;

public class PurchaseOrderActionRepository : IPurchaseOrderActionRepository
{
    private readonly IConfiguration _config;
    private readonly FiscalYearRepository _fiscalYearRepository;
    private readonly StageActionRepository _stageActionRepository;

    public PurchaseOrderActionRepository(IConfiguration config,
        StageActionRepository stageActionRepository,
        FiscalYearRepository fiscalYearRepository)
    {
        _config = config;
        _stageActionRepository = stageActionRepository;
        _fiscalYearRepository = fiscalYearRepository;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));


    public async Task<PurchaseOrderResultStatus> UpdatePurchaseOrderStep(UpdateAction model,
        OperationType operationType)
    {
        var result = new PurchaseOrderResultStatus();


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
                var updateLastActionId = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
                {
                    TableName = "pu.PurchaseOrder",
                    ColumnName = "ActionId",
                    Value = model.RequestActionId,
                    Filter = $"Id={model.IdentityId}"
                }, commandType: CommandType.StoredProcedure);

                conn.Close();
            }

            result.StatusMessage = "تغییرات با موفقیت انجام شد";
        }

        return result;
    }

    public async Task<PurchaseOrderValidateStepResultStatus> ValidateUpdateStep(UpdateAction model,
        OperationType operationType)
    {
        var result = new PurchaseOrderValidateStepResultStatus();

        var error = new List<string>();

        if (!model.NotNull())
            return new PurchaseOrderValidateStepResultStatus
            {
                Successfull = false,
                ValidationErrors = new List<string> { "درخواست معتبر نمی باشد" }
            };
        await Task.Run(async () =>
        {
            if (operationType == OperationType.Update)
            {
                #region آیا گام درخواستی، معتبر است یا نه

                //گام درخواستی
                var personOrderAction = new GetAction();
                personOrderAction.StageId = model.StageId;
                personOrderAction.ActionId = model.RequestActionId;
                personOrderAction.WorkflowId = model.WorkflowId;
                var requestPurchaseOrderStageAction = await _stageActionRepository.GetAction(personOrderAction);


                //گام جاری
                var currentActionId = await GetActionIdByIdentityId(model.IdentityId);
                personOrderAction.StageId = model.StageId;
                personOrderAction.ActionId = currentActionId;
                personOrderAction.WorkflowId = model.WorkflowId;
                var currentPurchaseOrderStageAction = await _stageActionRepository.GetAction(personOrderAction);

                var expectedPriority = 0;

                if (currentPurchaseOrderStageAction.Priority < requestPurchaseOrderStageAction.Priority)
                    expectedPriority = currentPurchaseOrderStageAction.Priority + 1;
                else if (currentPurchaseOrderStageAction.Priority > requestPurchaseOrderStageAction.Priority)
                    expectedPriority = currentPurchaseOrderStageAction.Priority - 1;

                if (expectedPriority != 0 && expectedPriority != requestPurchaseOrderStageAction.Priority)
                    error.Add("گام درخواست شده معتبر نمی باشد");

                #endregion

                #region برگه جاری دارای لاین هست یا نیست

                var personOrderLines = await GetPersonOrderLineByPersonOrderId(model.IdentityId);

                if (personOrderLines.Count() == 0 && requestPurchaseOrderStageAction.IsLastConfirmHeader)
                    error.Add("برگه دارای سطر نمی باشد مجاز به تغییر گام نمی باشید");

                #endregion


                var requestId = await CheckExistRequestId(model.IdentityId, model.CompanyId);

                if (requestId > 0)
                {
                    // آیا درخواست برگه جاری در وضعیت تایید نشده است
                    var StageId = await GetRequestStageId(requestId, model.CompanyId);
                    var requestActionId = await GetActionIdByIdentityId(requestId);
                    personOrderAction.StageId = StageId;
                    personOrderAction.ActionId = requestActionId;
                    personOrderAction.WorkflowId = model.WorkflowId;
                    var requestCurrentPurchaseOrderStageAction =
                        await _stageActionRepository.GetAction(personOrderAction);


                    if (!requestCurrentPurchaseOrderStageAction.IsLastConfirmHeader)
                    {
                        error.Add($"درخواست با شناسه {requestId} در وضعیت تایید نشده است، مجاز به تغییر گام نمی باشید");
                    }
                    else
                    {
                        //برگه ی درخواست برابر صفر باشد IsLastConfirmHeaderباید  
                        if (!requestPurchaseOrderStageAction.IsLastConfirmHeader)
                        {
                            //وضعیت درخواست برگه جاری  در گام 9 یا 10 می باشد؟ 
                            //گام 10
                            if (requestCurrentPurchaseOrderStageAction.CostofItemInvoiced)
                                error.Add(
                                    $"درخواست با شناسه {requestId}  در حالت  محاسبه بهای تمام شده صورتحساب می باشد مجاز یه تغییر گام نمی باشید");

                            //گام 9
                            else if (requestCurrentPurchaseOrderStageAction.CostofItemOrdered)
                                error.Add(
                                    $"درخواست با شناسه {requestId}  در حالت  محاسبه بهای تمام شده سفارش  می باشد مجاز یه تغییر گام نمی باشید");
                        }
                    }
                }

                else
                {
                    #region برگه جاری مرجع است؟

                    if (!requestPurchaseOrderStageAction.IsLastConfirmHeader)
                    {
                        //در خرید
                        var target = await GetCurrentPurchaseOrderAction(model.IdentityId,
                            model.ParentWorkflowCategoryId, model.CompanyId, 1);
                        target = target.Where(x => x.isLastConfirmHeader).ToList();

                        //  در انبار
                        var targetWarehouse = await GetCurrentWarehouseAction(model.IdentityId,
                            model.ParentWorkflowCategoryId, model.CompanyId, 1);
                        targetWarehouse = targetWarehouse.Where(x => x.isLastConfirmHeader).ToList();

                        //در خزانه
                        var targetTreasury = await GetCurrentTreasuryAction(model.IdentityId,
                            model.ParentWorkflowCategoryId, model.CompanyId, 1);
                        targetTreasury = targetTreasury.Where(x => x.isLastConfirmHeader).ToList();

                        if (target != null || targetWarehouse != null || targetTreasury != null)
                        {
                            if (target.Count > 0)
                            {
                                var stringIds = target.Select(x => x.Id).AsList();
                                error.Add(
                                    "شناسه های صورتحساب متصل به این درخواست در حالت تائید شده می باشد  ، مجاز به تغییر گام نمی باشید :");
                                error.Add(string.Join(',', stringIds));
                            }

                            if (targetWarehouse.Count > 0)
                            {
                                var stringIdWarehousess = targetWarehouse.Select(x => x.Id).AsList();
                                error.Add(
                                    "شناسه های انبار متصل به این درخواست در حالت تائید شده می باشد  ، مجاز به تغییر گام نمی باشید :");
                                error.Add(string.Join(',', stringIdWarehousess));
                            }

                            if (targetTreasury.Count > 0)
                            {
                                var stringIdWarehousess = targetTreasury.Select(x => x.Id).AsList();
                                error.Add(
                                    "شناسه های خزانه متصل به این درخواست در حالت تائید شده می باشد  ، مجاز به تغییر گام نمی باشید :");
                                error.Add(string.Join(',', stringIdWarehousess));
                            }
                        }
                    }

                    #endregion
                }

                #region بررسی وضعیت دوره مالی

                var resultCheckFiscalYear =
                    await _fiscalYearRepository.GetFicalYearStatusByDate(model.DocumentDate, model.CompanyId);

                if (!resultCheckFiscalYear.Successfull)
                    error.Add(resultCheckFiscalYear.StatusMessage);

                #endregion

                //خطا وجود نداشت 
                if (error.Count > 0)
                {
                    result.Successfull = false;
                    result.ValidationErrors = error;
                }
                else
                {
                    result.Successfull = true;
                    result.ValidationErrors = null;
                }
            }
        });

        return result;
    }

    public async Task<List<string>> ValidateDeleteStep(PurchaseOrderViewModel model)
    {
        var error = new List<string>();

        if (model.Id == 0)
            error.Add("اطلاعات ورودی معتبر نمی باشد");
        else
            await Task.Run(async () =>
            {
                var getPurchaseOrderAction = new GetAction
                {
                    CompanyId = model.CompanyId,
                    StageId = model.StageId,
                    ActionId = model.ActionId,
                    WorkflowId = model.WorkflowId
                };

                var personOrderStageAction = _stageActionRepository.GetAction(getPurchaseOrderAction).Result;

                // 1 - check IsDeleteHeader with StageId & MaxStepId
                if (!personOrderStageAction.IsDeleteHeader)
                    error.Add("مجاز به حذف برگه در این مرحله و گام نمی باشید");

                #region برگه جاری مرجع است؟

                if (model.StageClass == "1")
                {
                    //در خرید
                    var targetOrder = await GetCurrentPurchaseOrderAction(model.Id, model.ParentWorkflowCategoryId,
                        model.CompanyId, 1);
                    //  در انبار
                    var targetWarehouse = await GetCurrentWarehouseAction(model.Id, model.ParentWorkflowCategoryId,
                        model.CompanyId, 1);
                    //در خزانه
                    var targetTreasury =
                        await GetCurrentTreasuryAction(model.Id, model.ParentWorkflowCategoryId, model.CompanyId, 1);

                    if (targetOrder.ListHasRow() || targetWarehouse.ListHasRow() || targetTreasury.ListHasRow())
                    {
                        if (targetOrder.Count > 0)
                        {
                            var stringIds = targetOrder.Select(x => x.Id).AsList();
                            error.Add(
                                "درخواست جاری برای برگه های صورتحساب ذکر شده استفاده شده  ، مجاز به حذف نمی باشید :");
                            error.Add(string.Join(',', stringIds));
                        }

                        if (targetWarehouse.Count > 0)
                        {
                            var stringIdWarehousess = targetWarehouse.Select(x => x.Id).AsList();
                            error.Add("درخواست جاری برای اسناد انبار ذکر شده استفاده شده ، مجاز به حذف نمی باشید :");
                            error.Add(string.Join(',', stringIdWarehousess));
                        }

                        if (targetTreasury.Count > 0)
                        {
                            var stringIdTreasury = targetTreasury.Select(x => x.Id).AsList();
                            error.Add("درخواست جاری برای اسناد خزانه ذکر شده استفاده شده  ، مجاز به حذف نمی باشید :");
                            error.Add(string.Join(',', stringIdTreasury));
                        }
                    }
                }

                #endregion

                #region بررسی وضعیت دوره مالی

                var resultCheckFiscalYear =
                    await _fiscalYearRepository.GetFicalYearStatusByDate(model.DocumentDate, model.CompanyId);

                if (!resultCheckFiscalYear.Successfull)
                    error.Add(resultCheckFiscalYear.StatusMessage);

                #endregion
            });
        return error;
    }

    public async Task<MyResultDataQuery<List<PurchaseOrderActionLogList>>> GetPurchaseOrderStepList(int orderId,
        int companyId)
    {
        var result = new MyResultDataQuery<List<PurchaseOrderActionLogList>>
        {
            Data = new List<PurchaseOrderActionLogList>()
        };

        using (var conn = Connection)
        {
            var sQuery = "pu.Spc_PurchaseOrderActionLog_GetList";
            conn.Open();
            result.Data = (await conn.QueryAsync<PurchaseOrderActionLogList>(sQuery, new
            {
                PurchaseOrderId = orderId
            }, commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultPage<List<PurchaseOrderCheckIsAllocatedViewModel>>> GetPurchaseOrderCheckIsAllocated(
        int requestid)
    {
        var result = new MyResultPage<List<PurchaseOrderCheckIsAllocatedViewModel>>
        {
            Data = new List<PurchaseOrderCheckIsAllocatedViewModel>()
        };
        using (var conn = Connection)
        {
            var sQuery = "[pu].[Spc_PurchaseOrder_CheckIsAllocated]";
            conn.Open();
            result.Data = (await conn.QueryAsync<PurchaseOrderCheckIsAllocatedViewModel>(sQuery,
                new
                {
                    RequestId = requestid
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<UpdateInvoicePrice> UpdateInvoicePrice(int id, int UserId, int CompanyId)
    {
        var result = new UpdateInvoicePrice();
        using (var conn = Connection)
        {
            var sQuery = "[pu].[Spc_PurchaseOrderLine_UpdateInvoicePrice]";
            conn.Open();

            var output = await conn.QueryAsync<UpdateInvoicePrice>(sQuery,
                new
                {
                    RequestId = id,
                    UserId,
                    CreateDateTime = DateTime.Now,
                    CompanyId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Status = output.SingleOrDefault().Status == 100 ? 100 : -100;
            result.Successfull = output.SingleOrDefault().Successfull;

            result.StatusMessage = output.SingleOrDefault().StatusMessage;
        }

        return result;
    }


    public async Task<UpdateInvoicePrice> ReturnInvoicePrice(int id, int UserId, int companyId)
    {
        var result = new UpdateInvoicePrice();
        using (var conn = Connection)
        {
            var sQuery = "[pu].[Spc_PurchaseOrderLine_ReturnInvoicePrice]";
            conn.Open();

            var output = await conn.QueryAsync<UpdateInvoicePrice>(sQuery,
                new
                {
                    RequestId = id,
                    UserId,
                    CompanyId = companyId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Status = output.SingleOrDefault().Status == 100 ? 100 : -100;
            result.Successfull = output.SingleOrDefault().Successfull;

            result.StatusMessage = output.SingleOrDefault().StatusMessage;
        }

        return result;
    }

    public async Task<UpdateRequestPrice> UpdateRequestPrice(int id, int UserId)
    {
        var result = new UpdateRequestPrice();
        using (var conn = Connection)
        {
            var sQuery = "[pu].[Spc_PurchaseOrderLine_UpdateRequestPrice]";
            conn.Open();
            var output = await conn.QueryAsync<UpdateRequestPrice>(sQuery,
                new
                {
                    RequestId = id,
                    UserId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Status = output.SingleOrDefault().Status == 100 ? 100 : -100;
            result.Successfull = result.Status == 100 ? true : false;
            result.StatusMessage = output.SingleOrDefault().StatusMessage;
        }

        return result;
    }

    //9 to
    public async Task<UpdateRequestPrice> ReturnRequestPrice(int id, int UserId)
    {
        var result = new UpdateRequestPrice();
        using (var conn = Connection)
        {
            var sQuery = "[pu].[Spc_PurchaseOrderLine_ReturnRequestPrice]";
            conn.Open();
            var output = await conn.QueryAsync<UpdateRequestPrice>(sQuery,
                new
                {
                    RequestId = id,
                    UserId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Status = output.SingleOrDefault().Status == 100 ? 100 : -100;
            result.Successfull = result.Status == 100 ? true : false;
            result.StatusMessage = output.SingleOrDefault().StatusMessage;
        }

        return result;
    }


    public async Task<int> CheckisUnitCostCalculated(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pu].[Spc_PurchaseOrder_IsUnitCostCalculated]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                PurchaseOrderId = id
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }


    public async Task<MyResultPage<List<PurchaseOrderNotLastConfirmHeaderViewModel>>>
        GetPurchaseOrderNotLastConfirmHeader(int id)
    {
        var result = new MyResultPage<List<PurchaseOrderNotLastConfirmHeaderViewModel>>
        {
            Data = new List<PurchaseOrderNotLastConfirmHeaderViewModel>()
        };
        var parameters = new DynamicParameters();
        parameters.Add("PurchaseOrderId", id);
        using (var conn = Connection)
        {
            var sQuery = "[pu].[Spc_PurchaseOrder_NotLastConfirmHeader_GetList]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<PurchaseOrderNotLastConfirmHeaderViewModel>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }


    public async Task<CSVViewModel<IEnumerable>> CsvLastConfirmHeader(NewGetPageViewModel model)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = "شناسه صورتحساب,مرحله,جریان کار,گام جاری,تاریخ برگه"
        };
        var getPage = await GetPurchaseOrderNotLastConfirmHeader(int.Parse(model.Form_KeyValue[1]?.ToString()));
        result.Rows = from p in getPage.Data
            select new
            {
                p.HeaderId,
                p.Stage,
                p.Workflow,
                p.ActionName,
                p.DocumentDatePersian
            };
        return result;
    }

    public async Task<int> CheckExistRequestId(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "pu.PurchaseOrder",
                    ColumnName = "RequestId",
                    Filter = $"Id={id} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<short> GetRequestStageId(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<short>(sQuery, new
            {
                TableName = "pu.PurchaseOrder",
                ColumnName = "StageId",
                Filter = $"Id={id} AND CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<List<PurchaseOrderLines>> GetPersonOrderLineByPersonOrderId(long orderId)
    {
        var result = new List<PurchaseOrderLines>();

        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetTable]";
            conn.Open();
            result.AddRange((await conn.QueryAsync<PurchaseOrderLines>(sQuery, new
            {
                TableName = "pu.PurchaseOrderLine",
                ColumnNameList = @"InOut,
                                           GrossAmount,
                                           ExchangeRate,
                                           ItemTypeId,
                                           CurrencyId",
                Filter = $"HeaderId={orderId}"
            }, commandType: CommandType.StoredProcedure)).ToList());

            conn.Close();

            return result;
        }
    }


    public async Task<byte> GetActionIdByIdentityId(int identityId)
    {
        using (var conn = Connection)
        {
            byte result = 0;
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            result = await conn.QueryFirstOrDefaultAsync<byte>(sQuery, new
            {
                TableName = "pu.PurchaseOrder",
                ColumnName = "ActionId",
                Filter = $"Id={identityId}",
                OrderBy = ""
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<List<StageActionGetRecord>> GetCurrentPurchaseOrderAction(long id, byte ParentWorkflowCategoryId,
        int companyId, byte getType)
    {
        using (var conn = Connection)
        {
            var sQuery = "pu.Spc_Get_PurchaseOrderActionConfig";
            conn.Open();

            var result = await conn.QueryAsync<StageActionGetRecord>(sQuery, new
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

    public async Task<List<StageActionGetRecord>> GetCurrentWarehouseAction(long id, byte ParentWorkflowCategoryId,
        int companyId, byte getType)
    {
        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_Get_ItemTransactionActionConfig]";
            conn.Open();

            var result = await conn.QueryAsync<StageActionGetRecord>(sQuery, new
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
}