using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.SM.SaleOrder;
using ParsAlphabet.ERP.Application.Dtos.SM.SaleOrderLine;
using ParsAlphabet.ERP.Application.Dtos.SM.SaleOrderLog;
using ParsAlphabet.ERP.Application.Interfaces.SM.SaleOrderLog;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYear;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.SM.SaleOrderLog;

public class SaleOrderLogRepository : ISaleOrderLogRepository
{
    private readonly IConfiguration _config;
    private readonly FiscalYearRepository _fiscalYearRepository;
    private readonly StageActionRepository _stageActionRepository;

    public SaleOrderLogRepository(IConfiguration config,
        StageActionRepository stageActionRepository,
        FiscalYearRepository fiscalYearRepository)
    {
        _config = config;
        _stageActionRepository = stageActionRepository;
        _fiscalYearRepository = fiscalYearRepository;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public async Task<List<string>> ValidateDeleteStep(SaleOrderViewModel model, int companyId,
        OperationType operationType)
    {
        var error = new List<string>();

        if (model.Id == 0 || companyId == 0)
            error.Add("اطلاعات ورودی معتبر نمی باشد");
        else
            await Task.Run(async () =>
            {
                if (operationType == OperationType.Delete)
                {
                    var getTreasuryAction = new GetAction
                    {
                        CompanyId = companyId,
                        StageId = model.StageId,
                        ActionId = model.ActionId
                    };

                    var personOrderStageAction = _stageActionRepository.GetAction(getTreasuryAction).Result;

                    // 1 - check IsDeleteHeader with StageId & MaxStepId
                    if (!personOrderStageAction.IsDeleteHeader)
                        error.Add("مجاز به حذف برگه در این مرحله و گام نمی باشید");

                    #region برگه جاری مرجع است؟

                    var target = await GetCurrentSalePersonAction(model.Id, companyId, 1);
                    if (target != null) error.Add("برگه جاری مرجع می باشد، مجاز به حذف نمی باشید");

                    #endregion

                    #region بررسی وضعیت دوره مالی

                    var resultCheckFiscalYear =
                        await _fiscalYearRepository.GetFicalYearStatusByDate(model.OrderDate, companyId);

                    if (!resultCheckFiscalYear.Successfull)
                        error.Add(resultCheckFiscalYear.StatusMessage);

                    #endregion
                }
            });
        return error;
    }


    public async Task<MyResultDataQuery<List<SaleOrderStepLogList>>> GetSaleOrderStepList(int orderId, int companyId)
    {
        var result = new MyResultDataQuery<List<SaleOrderStepLogList>>
        {
            Data = new List<SaleOrderStepLogList>()
        };

        using (var conn = Connection)
        {
            var sQuery = "sm.Spc_SaleOrderActionLog_GetList";
            conn.Open();
            result.Data = (await conn.QueryAsync<SaleOrderStepLogList>(sQuery, new
            {
                SaleOrderId = orderId
            }, commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<SaleOrderResultStatus> UpdateSaleOrderLog(UpdateAction model, OperationType operationType)
    {
        var validateResult = new List<string>();

        if (operationType == OperationType.Update)
            validateResult = await ValidateUpdateLog(model, OperationType.Update);

        var result = new SaleOrderResultStatus();
        if (validateResult.ListHasRow())
        {
            var resultValidate = new SaleOrderResultStatus();
            resultValidate.Successfull = false;
            resultValidate.ValidationErrors = validateResult;
            return resultValidate;
        }

        using (var conn = Connection)
        {
            var sQuery = "sm.Spc_SaleOrderActionLog_Ins";
            conn.Open();

            var output = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    SaleOrderId = model.IdentityId,
                    model.UserId,
                    ActionId = model.RequestActionId,
                    model.StageId,
                    CreateDate = DateTime.Now
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
                var updateActionId = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
                {
                    TableName = "sm.SaleOrder",
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

    public async Task<List<string>> ValidateUpdateLog(UpdateAction model, OperationType operationType)
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
                var saleOrderLines = await GetSaleOrderLineBySaleOrderId(model.IdentityId);

                #region آیا گام درخواستی، معتبر است یا نه

                var saleOrderAction = new GetAction();

                saleOrderAction.StageId = model.StageId;
                saleOrderAction.ActionId = model.RequestActionId;
                var requestPersonOrderStageAction = await _stageActionRepository.GetAction(saleOrderAction);

                var currentActionId = await GetActionIdByIdentityId(model.IdentityId);
                saleOrderAction.StageId = model.StageId;
                saleOrderAction.ActionId = currentActionId;
                var currentPersonOrderStageAction = await _stageActionRepository.GetAction(saleOrderAction);
                var expectedPriority = 0;

                if (currentPersonOrderStageAction.Priority < requestPersonOrderStageAction.Priority)
                    expectedPriority = currentPersonOrderStageAction.Priority + 1;
                else if (currentPersonOrderStageAction.Priority > requestPersonOrderStageAction.Priority)
                    expectedPriority = currentPersonOrderStageAction.Priority - 1;

                if (expectedPriority != 0 && expectedPriority != requestPersonOrderStageAction.Priority)
                    error.Add("گام درخواست شده معتبر نمی باشد");

                #endregion

                #region برگه جاری دارای لاین هست یا نیست

                if (saleOrderLines.Count() == 0 && requestPersonOrderStageAction.IsLastConfirmHeader)
                    error.Add("برگه دارای سطر نمی باشد مجاز به تغییر گام نمی باشید");

                #endregion بررسی جمع قیمت سطرهای برگه جاری با درخواستش برای صورتحساب

                var IsPersonInvoiceLine = await GetSaleOrderWhitStageId(model.StageId);
                if (IsPersonInvoiceLine == 2)
                {
                    #region جمع قیمت سطرهای برگه جاری با درخواستش همخوانی دارد یا نه

                    var DifferenceInOutLines = await GetSaleOrderLineDifferenceInOutByOrderId(model.IdentityId);
                    if (DifferenceInOutLines.Any())
                    {
                        var SumPersonOrderLine =
                            Math.Abs(
                                DifferenceInOutLines.Where(a => a.InOut == 1).Sum(a => CalcSaleOrderLineAmount(a)) -
                                Math.Abs(DifferenceInOutLines.Where(a => a.InOut == 2)
                                    .Sum(a => CalcSaleOrderLineAmount(a))));
                        if (SumPersonOrderLine != 0)
                            error.Add("جمع سطرها همخوانی ندارد ، مجاز به تغییر گام نمی باشید");
                    }

                    #endregion
                }


                #region برگه جاری دارای درخواست است => isRequest==1

                if (currentPersonOrderStageAction.IsRequest)
                {
                    #region آیا درخواست برگه جاری در وضعیت تایید نشده است

                    var requestId = await GetRequest(model.IdentityId, model.CompanyId);
                    if (requestId > 0)
                    {
                        var StageId = await GetRequestStageId(requestId, model.CompanyId);
                        var requestActionId = await GetActionIdByIdentityId(requestId);
                        saleOrderAction.StageId = StageId;
                        saleOrderAction.ActionId = requestActionId;
                        requestPersonOrderStageAction = await _stageActionRepository.GetAction(saleOrderAction);


                        if (!requestPersonOrderStageAction.IsLastConfirmHeader)
                            error.Add(
                                $"درخواست با شناسه {requestId} در وضعیت تایید نشده است، مجاز به تغییر گام نمی باشید");

                        #endregion

                        #region سطرهای برگه جاری با درخواست همخوانی دارد یا نه

                        if (expectedPriority != 0)
                        {
                            var differenceRequesyAndPersonOrder =
                                await GetOrderAndRequestDifferenceAmount(requestId, model.IdentityId, model.CompanyId);

                            if (differenceRequesyAndPersonOrder > 0)
                                error.Add("سطرهای برگه جاری با درخواست یکسان نیست");
                        }

                        #endregion
                    }
                }

                #endregion

                #region درصورت مرجع بودن برگه جاری آیا وضعیت برگه مرجع تایید شده یا خیر

                var targetAction = await GetCurrentSalePersonAction(model.IdentityId, model.CompanyId, 1);
                if (targetAction.NotNull())
                    if (targetAction.isLastConfirmHeader)
                        error.Add(
                            $"این برگه در برگه {targetAction.Id} (برگه مرجع - تائید شده) استفاده شده و امکان تغییر وجود ندارد");

                #endregion
            }
        });

        return error;
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
                TableName = "sm.SaleOrder",
                ColumnName = "ActionId",
                Filter = $"Id={identityId}",
                OrderBy = ""
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }


    public async Task<StageActionGetRecord> GetCurrentSalePersonAction(long id, int companyId, byte getType)
    {
        using (var conn = Connection)
        {
            var sQuery = "[sm].[Spc_Get_SaleOrderActionConfig]";

            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<StageActionGetRecord>(sQuery, new
            {
                SaleOrderId = id,
                CompanyId = companyId,
                GetType = getType
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<List<SaleOrderLines>> GetSaleOrderLineBySaleOrderId(long orderId)
    {
        var result = new List<SaleOrderLines>();

        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetTable]";
            conn.Open();
            result.AddRange((await conn.QueryAsync<SaleOrderLines>(sQuery, new
            {
                TableName = "sm.SaleOrderLine",
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

    public async Task<int> GetSaleOrderWhitStageId(short stageId)
    {
        using (var conn = Connection)
        {
            var result = 0;
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            result = await conn.QueryFirstOrDefaultAsync<int>(sQuery, new
            {
                TableName = "wf.stage",
                ColumnName = "StageClassId",
                Filter = $"Id={stageId}",
                OrderBy = ""
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<List<SaleOrderLines>> GetSaleOrderLineDifferenceInOutByOrderId(int orderId)
    {
        var result = new List<SaleOrderLines>();
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetTable]";
            conn.Open();

            result.AddRange((await conn.QueryAsync<SaleOrderLines>(sQuery, new
            {
                TableName = "sm.SaleOrderLine",
                ColumnNameList = @"
		                               InOut,
		                               Price,
		                               Quantity,
		                               ExchangeRate,
		                               DiscountType,
		                               DiscountAmount,
		                               DiscountValue AS DiscountPercent",
                Filter = $"HeaderId={orderId}"
            }, commandType: CommandType.StoredProcedure)).ToList());

            conn.Close();

            var res = result.GroupBy(a => a.InOut).ToList();
            if (res.Count() > 1)
                return result;
            return new List<SaleOrderLines>();
        }
    }


    public decimal CalcSaleOrderLineAmount(SaleOrderLines item)
    {
        var sum = Convert.ToDecimal(item.Quantity) * (item.Price * item.ExchangeRate - item.DiscountType);
        return sum == 2
            ? item.DiscountAmount
            : item.DiscountValue / 100 * Convert.ToDecimal(item.Quantity) * item.Price * item.ExchangeRate;
    }

    public async Task<int> GetRequest(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int?>(sQuery, new
            {
                TableName = "sm.SaleOrder",
                ColumnName = "RequestId",
                Filter = $"Id={id} AND CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result ?? 0;
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
                TableName = "sm.SaleOrder",
                ColumnName = "StageId",
                Filter = $"Id={id} AND CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<int> GetOrderAndRequestDifferenceAmount(int requestId, int saleOrderId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[sm].[Spc_CheckPurchase_SaleOrderAndRequest_DifferenceAmount]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                RequestId = requestId,
                SaleOrderId = saleOrderId,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }
}