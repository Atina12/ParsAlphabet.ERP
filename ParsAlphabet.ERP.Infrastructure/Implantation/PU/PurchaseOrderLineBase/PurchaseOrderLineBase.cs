using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.FM.PostingGroup;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseInvoiceLine;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseOrderLine;
using ParsAlphabet.ERP.Application.Interfaces.FM.PostingGroup;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYear;
using ParsAlphabet.ERP.Infrastructure.Implantation.PU.VendorItems;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.PU.PurchaseOrderLineBase;

public abstract class PurchaseOrderLineBase
{
    private readonly IConfiguration _config;
    private readonly FiscalYearRepository _fiscalYearRepository;
    private readonly IPostingGroupRepository _postingGroupRepository;
    private readonly VendorItemsRepository _vendorItemsRepository;

    public PurchaseOrderLineBase(IConfiguration config,
        StageActionRepository stageActionRepository,
        VendorItemsRepository vendorItemsRepository,
        IPostingGroupRepository postingGroupRepository,
        FiscalYearRepository fiscalYearRepository
    )
    {
        _config = config;
        _vendorItemsRepository = vendorItemsRepository;
        _postingGroupRepository = postingGroupRepository;
        _fiscalYearRepository = fiscalYearRepository;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));


    public async Task<PurchaseOrderLineDetailModel> ExistByItemId(PurchaseOrderLineModel model,
        OperationType operationType, int companyId)
    {
        var filter = operationType == OperationType.Update ? $"AND pol.Id != {model.Id}  " : "";
        var result = new PurchaseOrderLineDetailModel();
        using (var conn = Connection)
        {
            var sQuery = "pu.Spc_CheckExist_PurchaseOrderLineDetail";
            conn.Open();

            result = await conn.QueryFirstOrDefaultAsync<PurchaseOrderLineDetailModel>(sQuery, new
            {
                model.HeaderId,
                model.ItemId,
                model.ItemTypeId,
                model.UnitId,
                SubUnitId = model.IdSubUnit > 0 ? model.SubUnitId : null,
                model.Ratio,
                model.AttributeIds,
                CompanyId = companyId,
                Filter = filter
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
            return result;
        }
    }


    public async Task<List<string>> ValidatePreviousStageLinests(PurchaseInvoiceLineModel model,
        List<PostingGroupbyTypeLineModel> data, OperationType operationType, int companyid, bool IsQuantityPurchase,
        bool insertprevious)
    {
        var error = new List<string>();
        var isAssignItemId = false;
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
                #region بررسی تکراری نبودن هزینه ی حمل

                if (model.ItemTypeId == 3 && model.HeaderId > 0 && !insertprevious)
                {
                    var countItemtypeId = GetItemTypIdByHeaderId(model.ItemTypeId, model.HeaderId);
                    if (countItemtypeId.Id > 0)
                        error.Add(
                            string.Join(",", "هزینه ی حمل فوق در سفارش خرید ثبت شده است امکان ثبت مجدد را ندارید"));
                }

                #endregion

                #region بررسی تکراری نبودن آیتم

                var existItem = await ExistByItemId(model, operationType, companyid);
                if (existItem != null && existItem.ItemId > 0)
                {
                    //کالا/خدمت با شناسه های ذکر شده قبلا ثبت شده است، مجاز به ثبت تکراری نیستید

                    var errorname = "";


                    if (insertprevious) // ثبت از افزودن از درخواست
                    {
                        if (model.ItemTypeId == 1)
                            errorname = string.Format("{0}{1}{2}{3}{4}{5}{6}", existItem.ItemNameIds,
                                "   با صفات   :  ", existItem.AttributeName, "  و واحد شمارش :  ", existItem.UnitNames,
                                "  و ضریب :  ", existItem.Ratio);
                        else
                            errorname = existItem.ItemNameIds;

                        error.Add(string.Join(",", "2"));
                        error.Add(string.Join(",", errorname));
                    }

                    else // ثبت از لاین
                    {
                        if (model.ItemTypeId == 1)
                            errorname = string.Format("{0}{1}{2}{3}{4}{5}{6}{7}",
                                "کالا/خدمت با شناسه های ذکر شده قبلا ثبت شده است، مجاز به ثبت تکراری نیستید",
                                existItem.ItemNameIds, "   با صفات   :  ", existItem.AttributeName,
                                "  و واحد شمارش :  ", existItem.UnitNames, "  و ضریب :  ", existItem.Ratio);
                        else
                            errorname = existItem.ItemNameIds;

                        error.Add(string.Join(",", errorname));
                    }
                }

                else
                {
                    if (insertprevious) // ثبت از افزودن از درخواست
                    {
                        var itemlist = "";

                        if (model.NetAmountPlusVAT == 0)
                        {
                            itemlist = string.Format("{0}", model.ItemId + "-" + model.ItemName);
                            error.Add(string.Join(",", "3"));
                            error.Add(string.Join(",", itemlist));
                        }

                        if (model.DiscountType > 0 && model.DiscountValue == 0)
                        {
                            itemlist = string.Format("{0}", model.ItemId + "-" + model.ItemName);
                            error.Add(string.Join(",", "4"));
                            error.Add(string.Join(",", itemlist));
                        }
                    }

                    else
                    {
                        if (model.NetAmountPlusVAT == 0)

                            error.Add(string.Format("{0}{1}{2}", "برای آیتم :", model.ItemId + "-" + model.ItemName,
                                " مبلغ با ارزش افزوده  نمی تواند صفر باشد  "));

                        if (model.DiscountType > 0 && model.DiscountValue == 0)
                            error.Add(string.Format("{0}{1}{2}", "برای آیتم :", model.ItemId + "-" + model.ItemName,
                                " تخفیف را مشخص نمایید   "));
                    }
                }

                #endregion

                #region بررسی  اینکه آیتم به تامین کننده اختصاص داده شده یا نه

                var assignItem = await _vendorItemsRepository.GetAssignVendorItemsId(model.ItemId, model.ItemTypeId,
                    model.HeaderAccountDetailId);
                if (!assignItem)
                    isAssignItemId = true;

                if (isAssignItemId)
                {
                    if (insertprevious)
                        error.Add(string.Join(",", "1"));

                    error.Add(string.Join(",", model.ItemId));
                }

                #endregion

                #region بررسی کدینگ حسابداری

                if (data.Count == 0)
                {
                    error.Add(
                        $" برای کالا{model.ItemId + "_" + model.ItemName}: با دسته بندی {model.CategoryId + "_" + model.CategoryName} کدینگ حسابداری تعریف نشده است ");
                }
                else
                {
                    var postLine =
                        await _postingGroupRepository.GetAllDataDropDown((int)PostingGroupType.BranchPurchase);

                    var GrossAmount = Math.Truncate(model.GrossAmount);
                    var decimalGrossAmountPoint = model.GrossAmount - Math.Truncate(model.GrossAmount);

                    var DiscountValue = Math.Truncate(model.DiscountAmount);
                    var decimalDiscountValue = model.DiscountAmount - Math.Truncate(model.DiscountAmount);


                    var VATAmount = Math.Truncate(model.VATAmount);
                    var decimalVATAmount = model.VATAmount - Math.Truncate(model.VATAmount);

                    for (var j = 0; j < postLine.Count; j++)
                    {
                        var strError = "";
                        strError = string.Format("{0}{1}{2}{3}{4}{5}", postLine[j].Name, " : ( برای کالا  :  ",
                            model.ItemId + "_" + model.ItemName, "  با دسته بندی : ",
                            model.CategoryId + "_" + model.CategoryName, " کدینگ حسابداری تعریف نشده است ) ");

                        var PostingGroup = data.FirstOrDefault(x => x.PostingGroupTypeLineId == postLine[j].Id);
                        var PostingGroupFlg = PostingGroup != null ? true : false;

                        if (PostingGroupFlg)
                        {
                            switch (postLine[j].Id)
                            {
                                case 13: //  بهای خرید -صحیح 
                                    if (!IsQuantityPurchase)
                                    {
                                        if (GrossAmount == 0)
                                            error.Add($"{postLine[j].Name} : برای کالا  مبلغ را تعیین نمایید! ");

                                        if (GrossAmount > 0 && (PostingGroup.AccountGLId == 0 ||
                                                                PostingGroup.AccountSGLId == 0))
                                            error.Add(strError);
                                    }

                                    break;
                                case 19: //  بهای خرید - اعشار 
                                    if (!IsQuantityPurchase)
                                        if (decimalGrossAmountPoint > 0 && (PostingGroup.AccountGLId == 0 ||
                                                                            PostingGroup.AccountSGLId == 0))
                                            error.Add(strError);
                                    break;

                                case 14: //تخفیف خرید - صحیح 
                                    if (!IsQuantityPurchase)
                                        if (DiscountValue > 0 && (PostingGroup.AccountGLId == 0 ||
                                                                  PostingGroup.AccountSGLId == 0))
                                            error.Add(strError);
                                    break;
                                case 20: //تخفیف خرید - اعشار 
                                    if (!IsQuantityPurchase)
                                        if (decimalDiscountValue > 0 && (PostingGroup.AccountGLId == 0 ||
                                                                         PostingGroup.AccountSGLId == 0))
                                            error.Add(strError);
                                    break;
                                case 15: //مالیات بر ارزش افزوده خرید
                                    if (!IsQuantityPurchase)
                                        if (VATAmount > 0)
                                        {
                                            if (PostingGroup.AccountGLId == 0 || PostingGroup.AccountSGLId == 0)
                                                error.Add(strError);
                                            else if (PostingGroup.AccountDetailId == 0)
                                                error.Add(
                                                    $"{postLine[j].Name} : برای کالا با دسته بندی : {PostingGroup.CategoryName} تفصیل تعریف نشده است ");
                                        }

                                    break;
                                case 21: //مالیات بر ارزش افزوده خرید - اعشار 
                                    if (!IsQuantityPurchase)
                                        if (decimalVATAmount > 0)
                                        {
                                            if (PostingGroup.AccountGLId == 0 || PostingGroup.AccountSGLId == 0)
                                                error.Add(strError);
                                            else if (PostingGroup.AccountDetailId == 0)
                                                error.Add(
                                                    $"{postLine[j].Name} : برای کالا با دسته بندی : {PostingGroup.CategoryName} تفصیل تعریف نشده است ");
                                        }

                                    break;
                            }
                        }
                        else
                        {
                            if (!IsQuantityPurchase)
                            {
                                if (postLine[j].Id == 13 && GrossAmount > 0) //  بهای خرید -صحیح 
                                    error.Add(strError);
                                if (postLine[j].Id == 19 && decimalGrossAmountPoint > 0) //  بهای خرید - اعشار 
                                    error.Add(strError);

                                else if (postLine[j].Id == 14 && DiscountValue > 0) //تخفیف خرید - صحیح 
                                    error.Add(strError);
                                else if (postLine[j].Id == 20 && decimalDiscountValue > 0) //تخفیف خرید - اعشار 
                                    error.Add(strError);


                                else if (postLine[j].Id == 15 && VATAmount > 0) //مالیات بر ارزش افزوده خرید
                                    error.Add(strError);
                                else if (postLine[j].Id == 21 &&
                                         decimalVATAmount > 0) //مالیات بر ارزش افزوده خرید - اعشار 
                                    error.Add(strError);
                            }
                        }
                    }
                }

                #endregion

                #region بررسی وضعیت دوره مالی

                var date = model.OrderDate;
                var resultCheckFiscalYear = await _fiscalYearRepository.GetFicalYearStatusByDate(date, companyid);
                if (!resultCheckFiscalYear.Successfull)

                    error.Add(resultCheckFiscalYear.StatusMessage);

                #endregion
            }
        });
        return error;
    }

    public async Task<PurchaseOrderLineDetailViewModel> ExistByItemId(PurchaseInvoiceLineModel model,
        OperationType operationType, int companyId)
    {
        var filter = operationType == OperationType.Update ? $"AND pol.Id != {model.Id}  " : "";

        using (var conn = Connection)
        {
            var sQuery = "pu.Spc_CheckExist_PurchaseOrderLineDetail";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<PurchaseOrderLineDetailViewModel>(sQuery, new
            {
                model.HeaderId,
                model.ItemId,
                model.ItemTypeId,
                model.UnitId,
                SubUnitId = model.IdSubUnit > 0 ? model.SubUnitId : null,
                model.Ratio,
                model.AttributeIds,
                CompanyId = companyId,
                Filter = filter
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
            return result;
        }
    }


    public async Task<int> GetTargetId(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "pu.PurchaseOrder",
                ColumnName = "Id",
                Filter = $"RequestId={id} AND CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<int> GetItemTypIdByHeaderId(int itemTypeId, int headerId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "pu.PurchaseOrderLine",
                ColumnName = "count(Id) Id",
                Filter = $"HeaderId={headerId} AND ItemTypeId={itemTypeId}"
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
                TableName = "pu.PurchaseOrder",
                ColumnName = "ActionId",
                Filter = $"Id={IdentityId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }
}