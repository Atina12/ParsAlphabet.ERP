using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.WH.WarehouseTransaction;
using ParsAlphabet.ERP.Application.Dtos.WH.WarehouseTransactionLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYear;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WH.WarehouseTransactionLine;

public class WarehouseTransactionLineRepository :
    BaseRepository<WarehouseTransactionModel, int, string>,
    IBaseRepository<WarehouseTransactionModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;
    private readonly FiscalYearRepository _fiscalYearRepository;

    public WarehouseTransactionLineRepository(
        IConfiguration config,
        IHttpContextAccessor accessor,
        FiscalYearRepository fiscalYearRepository
    ) : base(config)
    {
        _accessor = accessor;
        _fiscalYearRepository = fiscalYearRepository;
    }


    public async Task<WarehouseTransactionLineSum> GetLineSum(NewGetPageViewModel model)
    {
        int? p_id = null, p_zoneId = null, p_binId = null, p_itemId = null, p_itemTypeId = null, p_createUserId = null;
        var isDefaultCurrency = Convert.ToBoolean(Convert.ToInt32(model.Form_KeyValue[1]?.ToString()));

        switch (model.FieldItem)
        {
            case "id":
                p_id = Convert.ToInt32(model.FieldValue);
                break;
            case "zone":
                p_zoneId = Convert.ToInt32(model.FieldValue);
                break;
            case "bin":
                p_binId = Convert.ToInt32(model.FieldValue);
                break;
            case "item":
                p_itemId = Convert.ToInt32(model.FieldValue);
                break;
            case "itemType":
                p_itemTypeId = Convert.ToInt32(model.FieldValue);
                break;
            case "createUserId":
                p_createUserId = Convert.ToInt32(model.FieldValue);
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("Id", p_id);
        parameters.Add("HeaderId", Convert.ToInt64(model.Form_KeyValue[0]?.ToString()));
        parameters.Add("ZoneId", p_zoneId);
        parameters.Add("BinId", p_binId);
        parameters.Add("ItemTypeId", p_itemTypeId);
        parameters.Add("ItemId", p_itemId);
        parameters.Add("CreateUserId", p_createUserId);

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_ItemTransactionLine_Sum]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<WarehouseTransactionLineSum>(sQuery, parameters,
                commandType: CommandType.StoredProcedure);

            return result;
        }
    }

    public async Task<MyResultPage<WarehouseTransactionLineGetReccord>> GetRecordById(GetWarehouseTransactionLine model)
    {
        var result = new MyResultPage<WarehouseTransactionLineGetReccord>
        {
            Data = new WarehouseTransactionLineGetReccord()
        };

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();
            MyClaim.Init(_accessor);

            result.Data = await conn.QueryFirstOrDefaultAsync<WarehouseTransactionLineGetReccord>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    TableName = "wh.ItemTransactionLine",
                    IdColumnName = "Id",
                    ColumnNameList = "*",
                    IdList = "",
                    Filter = $"Id={model.Id}",
                    OrderBy = ""
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        return result;
    }

    public async Task<int> Get_ItemTransactionQuantitySum(int id)
    {
        var sumResult = 0;
        using (var conn = Connection)
        {
            var sQuery = $"SELECT SUM(Quantity) SumQuantity FROM wh.ItemTransactionLine WHERE HeaderId = {id}";
            conn.Open();

            sumResult = await conn.ExecuteScalarAsync<int>(sQuery, commandType: CommandType.Text);

            conn.Close();
        }

        return sumResult;
    }

    public async Task<TransactionLineDetailViewModel> ExistByItemId(WarehouseTransactionLineModel model,
        OperationType operationType)
    {
        var filter = operationType == OperationType.Update ? $"AND itl.Id != {model.Id}  " : "";
        var result = new TransactionLineDetailViewModel();
        using (var conn = Connection)
        {
            var sQuery = "wh.Spc_CheckExist_ItemTransactionLineDetail";
            conn.Open();

            result = await conn.QueryFirstOrDefaultAsync<TransactionLineDetailViewModel>(sQuery, new
            {
                model.HeaderId,
                model.ItemId,
                model.ItemTypeId,
                model.UnitId,
                SubUnitId = model.IdSubUnit > 0 ? model.SubUnitId : null,
                model.Ratio,
                model.AttributeIds,
                model.ZoneId,
                model.BinId,
                model.CompanyId,
                Filter = filter
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
            return result;
        }
    }


    public async Task<List<string>> ValidateSaveItemTransactionLine(WarehouseTransactionLineModel model,
        bool validBeforeSave, bool isPostingGroup)
    {
        var error = new List<string>();
        var operationType = model.Id == 0 ? OperationType.Insert : OperationType.Update;

        if (model == null)
        {
            error.Add("درخواست معتبر نمی باشد");
            return error;
        }

        await Task.Run(async () =>
        {
            if (operationType == OperationType.Insert || operationType == OperationType.Update)
            {
                if (model.IsQuantity && model.Amount == 0)
                    error.Add($" برای آیتم {model.ItemId} مبلغ را تعیین نمایید! ");

                //بررسی تکراری نبودن آیتم
                var existItem = await ExistByItemId(model, operationType);
                if (existItem != null && existItem.ItemId > 0)
                {
                    var errorname = "";
                    //کالا/خدمت با شناسه های ذکر شده قبلا ثبت شده است، مجاز به ثبت تکراری نیستید
                    if (model.ItemTypeId == 1)
                        errorname = string.Format("{0}{1}{2}{3}{4}{5}{6}", existItem.ItemNameIds, "   با صفات   :  ",
                            existItem.AttributeName, "  و واحد شمارش :  ", existItem.UnitNames, "  و ضریب :  ",
                            existItem.Ratio);
                    else
                        errorname = existItem.ItemNameIds;

                    error.Add(string.Join(",", 2));
                    error.Add(string.Join(",", errorname));
                }

                decimal itemTransactionSumQuantity = await Get_ItemTransactionQuantitySum(model.HeaderId);
                if (operationType == OperationType.Insert)
                {
                    itemTransactionSumQuantity += model.Quantity;
                }
                else
                {
                    var oldLineItem = await GetRecordById(new GetWarehouseTransactionLine { Id = model.Id });
                    itemTransactionSumQuantity -= oldLineItem.Data.Quantity;
                    itemTransactionSumQuantity += model.Quantity;
                }


                #region بررسی وضعیت دوره مالی

                var itemTransaction = GetItemTransactionInfo(model.HeaderId, model.CompanyId);
                var date = itemTransaction.Result;
                var resultCheckFiscalYear = await _fiscalYearRepository.GetFicalYearStatusByDate(date, model.CompanyId);
                if (!resultCheckFiscalYear.Successfull)
                    error.Add(resultCheckFiscalYear.StatusMessage);

                #endregion
            }
        });

        return error;
    }


    public async Task<List<string>> ValidateSaveItemRequestLine(WarehouseTransactionLineModel model)
    {
        var error = new List<string>();
        var operationType = model.Id == 0 ? OperationType.Insert : OperationType.Update;

        if (model == null)
        {
            error.Add("درخواست معتبر نمی باشد");
            return error;
        }

        await Task.Run(async () =>
        {
            if (operationType == OperationType.Insert || operationType == OperationType.Update)
            {
                if (model.IsQuantity && model.Amount == 0)
                    error.Add($" برای آیتم {model.ItemId} مبلغ را تعیین نمایید! ");

                //بررسی تکراری نبودن آیتم
                var existItem = await ExistByItemId(model, operationType);
                if (existItem != null && existItem.ItemId > 0)
                {
                    var errorname = "";
                    //کالا/خدمت با شناسه های ذکر شده قبلا ثبت شده است، مجاز به ثبت تکراری نیستید
                    if (model.ItemTypeId == 1)
                        errorname = string.Format("{0}{1}{2}{3}{4}{5}{6}{7}", existItem.ItemNameIds, "   با صفات   :  ",
                            existItem.AttributeName, "  و واحد شمارش :  ", existItem.UnitNames, "  و ضریب :  ",
                            existItem.Ratio, "تکراری است");
                    else
                        errorname = existItem.ItemNameIds;

                    error.Add(string.Join(",", errorname));
                }

                decimal itemTransactionSumQuantity = await Get_ItemTransactionQuantitySum(model.HeaderId);
                if (operationType == OperationType.Insert)
                {
                    itemTransactionSumQuantity += model.Quantity;
                }
                else
                {
                    var oldLineItem = await GetRecordById(new GetWarehouseTransactionLine { Id = model.Id });
                    itemTransactionSumQuantity -= oldLineItem.Data.Quantity;
                    itemTransactionSumQuantity += model.Quantity;
                }


                #region بررسی وضعیت دوره مالی

                var resultCheckFiscalYear =
                    await _fiscalYearRepository.GetFicalYearStatusByDate(model.HeaderDocumentDate, model.CompanyId);
                if (!resultCheckFiscalYear.Successfull)
                    error.Add(resultCheckFiscalYear.StatusMessage);

                #endregion
            }
        });

        return error;
    }

    public async Task<DateTime> GetItemTransactionInfo(int Id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<DateTime>(
                sQuery, new
                {
                    TableName = "wh.ItemTransaction",
                    ColumnName = "DocumentDate",
                    Filter = $"Id={Id} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }

    public async Task<List<WarehouseTransactionLinePostingGroup>> GetWarehouseTransactionLineListForPost(
        List<ID> itemTransactionIds, byte WorkflowCategoryId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_ItemTransactionLine_PostingGroup_GetList]";
            conn.Open();

            var result = (await conn.QueryAsync<WarehouseTransactionLinePostingGroup>(sQuery,
                new
                {
                    IdsJSON = JsonConvert.SerializeObject(itemTransactionIds),
                    WorkflowCategoryId,
                    CompanyId = companyId
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }
}