using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.SM.SaleOrderLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYear;
using ParsAlphabet.ERP.Infrastructure.Implantation.PU.VendorItems;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.SM.SaleOrderLIneBase;

public abstract class SaleOrderLineBase
{
    private readonly IConfiguration _config;
    private readonly FiscalYearRepository _fiscalYearRepository;
    private readonly StageActionRepository _stageActionRepository;
    private readonly VendorItemsRepository _vendorItemsRepository;

    public SaleOrderLineBase(IConfiguration config,
        StageActionRepository stageActionRepository,
        VendorItemsRepository vendorItemsRepository,
        FiscalYearRepository fiscalYearRepository
    )
    {
        _config = config;
        _stageActionRepository = stageActionRepository;
        _vendorItemsRepository = vendorItemsRepository;
        _fiscalYearRepository = fiscalYearRepository;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public async Task<List<string>> Validate(SaleOrderLineModel model, OperationType operationType, int companyid)
    {
        var error = new List<string>();

        if (model == null)
        {
            error.Add(string.Join(",", 0));
            error.Add("درخواست معتبر نمی باشد");
            return error;
        }

        await Task.Run(async () =>
        {
            if (operationType == OperationType.Insert || operationType == OperationType.Update)
            {
                var existItem = await ExistByItemId(model, operationType, companyid);
                if (existItem != null && existItem.ItemId > 0)
                    error.Add(
                        $"کالا/خدمت با شماره {existItem.ItemNameIds} قبلا ثبت شده است، مجاز به ثبت تکراری نیستید");

                #region بررسی وضعیت دوره مالی

                var resultCheckFiscalYear =
                    await _fiscalYearRepository.GetFicalYearStatusByDate(model.OrderDate, companyid);

                if (!resultCheckFiscalYear.Successfull)
                    error.Add(resultCheckFiscalYear.StatusMessage);

                #endregion
            }
        });
        return error;
    }

    public async Task<SaleOrderLineDetailModel> ExistByItemId(SaleOrderLineModel model, OperationType operationType,
        int companyId)
    {
        var filter = operationType == OperationType.Update ? $"AND sol.Id != {model.Id}  " : "";
        var result = new SaleOrderLineDetailModel();
        using (var conn = Connection)
        {
            var sQuery = "[sm].[Spc_CheckExist_SaleOrderLineDetail]";
            conn.Open();

            result = await conn.QueryFirstOrDefaultAsync<SaleOrderLineDetailModel>(sQuery, new
            {
                model.HeaderId,
                model.ItemId,
                model.ItemTypeId,
                model.UnitId,
                SubUnitId = model.IdSubUnit > 0 ? model.IdSubUnit : null,
                model.Ratio,
                model.AttributeIds,
                CompanyId = companyId,
                Filter = filter
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
            return result;
        }
    }

    public async Task<byte> GetActionIdByIdentityId(int IdentityId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<byte>(sQuery, new
            {
                TableName = "sm.SaleOrder",
                ColumnName = "ActionId",
                Filter = $"Id={IdentityId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    //public async Task<List<string>> ValidatePreviousStageLinests(PurchaseInvoiceLineModel model, OperationType operationType, int companyid)

    //{
    //    List<string> error = new List<string>();
    //    bool isAssignItemId = false;
    //    if (model == null)
    //    {
    //        error.Add(string.Join(",", 0));
    //        error.Add("درخواست معتبر نمی باشد");
    //        return error;
    //    }

    //    else
    //    {
    //        await Task.Run(async () =>
    //        {
    //            if (operationType == OperationType.Insert || operationType == OperationType.Update)
    //            {

    //                if (model.IsQuantity && (model.GrossAmount == 0 || model.VATAmount == 0|| model.NetAmountPlusVAT == 0 ))
    //                {
    //                    error.Add($" برای آیتم {model.ItemId}_{model.ItemName} با  دسته بندی {model.CategoryName}مبلغ تعیین کنید  ");
    //                }
    //                if (model.VATAmount < 0  || model.NetAmountPlusVAT < 0 )
    //                {
    //                    error.Add($" برای آیتم {model.ItemId}_{model.ItemName} با  دسته بندی {model.CategoryName}امکان ذخیره سازی مبلغ منفی وجود ندارد ");
    //                }
    //                if (model.DiscountType > 0  && (model.NetAmount < 0 || model.NetAmount == 0))
    //                {
    //                    error.Add($" برای آیتم {model.ItemId}_{model.ItemName} با  دسته بندی {model.CategoryName}مبلغ تخفیف باید بزرگتر از صفر باشد ");
    //                }
    //                //بررسی تکراری نبودن آیتم
    //                var existItem = await ExistByItemId(model, operationType, companyid);
    //                if (existItem != null && existItem.ItemId > 0)
    //                {
    //                    string errorname = "";
    //                    //کالا/خدمت با شناسه های ذکر شده قبلا ثبت شده است، مجاز به ثبت تکراری نیستید
    //                    if (model.ItemTypeId == 1)
    //                        errorname = string.Format("{0}{1}{2}{3}{4}{5}{6}", existItem.ItemNameIds, "   با صفات   :  ", existItem.AttributeName, "  و واحد شمارش :  ", existItem.UnitNames, "  و ضریب :  ", existItem.Ratio);
    //                    else
    //                        errorname = existItem.ItemNameIds;

    //                    error.Add(string.Join(",", 2));
    //                    error.Add(string.Join(",", errorname));
    //                }


    //                //بررسی  اینکه آیتم به تامین کننده اختصاص داده شده یا نه
    //                var assignItem = await _vendorItemsRepository.GetAssignVendorItemsId(model.ItemId, model.ItemTypeId, model.HeaderAccountDetailId);
    //                if (!assignItem)
    //                    isAssignItemId = true;

    //                if (isAssignItemId)
    //                {
    //                    error.Add(string.Join(",", 1));
    //                    error.Add(string.Join(",", model.ItemId));

    //                }

    //            }
    //        });
    //    }
    //    return error;
    //}

    //public async Task<PersonOrderLineDetailViewModel> ExistByItemId(PurchaseInvoiceLineModel model, OperationType operationType, int companyId)
    //{

    //    var filter = operationType == OperationType.Update ? $"AND pol.Id != {model.Id}  " : "";
    //    var result = new PersonOrderLineDetailViewModel();
    //    using (IDbConnection conn = Connection)
    //    {
    //        string sQuery = "pu.Spc_CheckExist_PurchaseOrderLineDetail";
    //        conn.Open();

    //        result = await conn.QueryFirstOrDefaultAsync<PersonOrderLineDetailViewModel>(sQuery, new
    //        {
    //            model.HeaderId,
    //            model.ItemId,
    //            model.ItemTypeId,
    //            model.UnitId,
    //            SubUnitId = model.IdSubUnit > 0 ? model.IdSubUnit : null,
    //            model.Ratio,
    //            model.AttributeIds,
    //            CompanyId = companyId,
    //            Filter = filter,
    //        }, commandType: CommandType.StoredProcedure);

    //        conn.Close();
    //        return result;
    //    }

    //}

    //public async Task<List<string>> ValidateDeletePersonOrderLine(PurchaseInvoiceLineModel model, int companyId)
    //{
    //    List<string> error = new List<string>();

    //    if (model == null)
    //    {
    //        error.Add("درخواست معتبر نمی باشد");
    //        return error;
    //    }
    //    else
    //    {
    //        await Task.Run(async () =>
    //        {
    //            #region برگه جاری مجوز حذف دارد؟
    //            var personOrderAction = new GetAction();

    //            var currentActionId = await GetActionIdByIdentityId(model.HeaderId);
    //            personOrderAction.StageId = model.StageId;
    //            personOrderAction.ActionId = currentActionId;
    //            var currentTreasuryStageAct = await _stageActionRepository.GetAction(personOrderAction);

    //            if (!currentTreasuryStageAct.IsDeleteLine)
    //            {
    //                error.Add("مجاز به حذف سطر در این گام نمی باشید");
    //            }
    //            #endregion

    //            #region برگه جاری مرجع است؟ 

    //            var targetId = await GetTargetId(model.HeaderId, companyId);
    //            if (targetId > 0)
    //            {
    //                error.Add($"برگه جاری مرجع می باشد، مجاز به حذف نمی باشید");
    //            }

    //            #endregion

    //            #region بررسی وضعیت دوره مالی

    //            var resultCheckFiscalYear = await _fiscalYearRepository.GetFicalYearStatusByDate(model.CreateDateTime, companyId);

    //            if (!resultCheckFiscalYear.Successfull)
    //                error.Add(resultCheckFiscalYear.StatusMessage);
    //            #endregion

    //        });
    //    }

    //    return error;

    //}

    //public async Task<int> GetTargetId(int id, int companyId)
    //{
    //    using (IDbConnection conn = Connection)
    //    {
    //        string sQuery = "[pb].[Spc_Tables_GetItem]";
    //        conn.Open();

    //        var result = await conn.ExecuteScalarAsync<int>(sQuery, new
    //        {
    //            TableName = "pu.PurchaseOrder",
    //            ColumnName = "Id",
    //            Filter = $"RequestId={id} AND CompanyId={companyId}"
    //        }, commandType: CommandType.StoredProcedure);

    //        conn.Close();

    //        return result;
    //    }
    //}
}