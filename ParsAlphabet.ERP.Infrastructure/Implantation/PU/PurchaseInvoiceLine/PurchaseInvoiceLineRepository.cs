using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.FM.PostingGroup;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseInvoiceLine;
using ParsAlphabet.ERP.Application.Dtos.WF.StageFundItemType;
using ParsAlphabet.ERP.Application.Dtos.WF.StageStepConfig;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces.FM.PostingGroup;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Application.Interfaces.PU.PurchaseInvoiceLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.AccountDetail;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.CostCenter;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYear;
using ParsAlphabet.ERP.Infrastructure.Implantation.PU.VendorItems;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageFundItemType;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageStepConfig;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.PU.PurchaseInvoiceLine;

public class PurchaseInvoiceLineRepository : PurchaseOrderLineBase.PurchaseOrderLineBase, IPurchaseInvoiceLineRepository
{
    private readonly AccountDetailRepository _accountDetailRepository;
    private readonly ICompanyRepository _companyRepository;
    private readonly CostCenterRepository _costCenterRepository;
    private readonly FiscalYearRepository _fiscalYearRepository;
    private readonly ILoginRepository _loginRepository;
    private readonly IMapper _mapper;
    private readonly IPostingGroupRepository _postingGroupRepository;
    private readonly StageActionRepository _stageActionRepository;
    private readonly StageFundItemTypeRepository _stageFundItemTypeRepository;
    private readonly StageStepConfigRepository _stageStepConfigRepository;

    public PurchaseInvoiceLineRepository(
        IConfiguration config,
        IPostingGroupRepository postingGroupRepository,
        StageActionRepository stageActionRepository,
        StageStepConfigRepository stageStepConfigRepository,
        ICompanyRepository CompanyRepository,
        VendorItemsRepository vendorItemsRepository,
        FiscalYearRepository fiscalYearRepository,
        CostCenterRepository costCenterRepository,
        StageFundItemTypeRepository stageFundItemTypeRepository,
        AccountDetailRepository accountDetailRepository,
        ILoginRepository loginRepository,
        IMapper mapper) : base(config, stageActionRepository, vendorItemsRepository, postingGroupRepository,
        fiscalYearRepository)
    {
        _companyRepository = CompanyRepository;
        _stageActionRepository = stageActionRepository;
        _stageStepConfigRepository = stageStepConfigRepository;
        _postingGroupRepository = postingGroupRepository;
        _fiscalYearRepository = fiscalYearRepository;
        _stageFundItemTypeRepository = stageFundItemTypeRepository;
        _costCenterRepository = costCenterRepository;
        _accountDetailRepository = accountDetailRepository;
        _loginRepository = loginRepository;
        _mapper = mapper;
    }


    public async Task<MyResultStageStepConfigPage<List<PurchaseInvoiceLines>>> GetInvoiceLinePage(
        NewGetPageViewModel model)
    {
        var result = new MyResultStageStepConfigPage<List<PurchaseInvoiceLines>>
        {
            Data = new List<PurchaseInvoiceLines>()
        };

        int? p_itemTypeId = null, p_itemId = null;

        var isDefaultCurrency = model.Form_KeyValue[1]?.ToString() != "NaN"
            ? Convert.ToBoolean(Convert.ToInt32(model.Form_KeyValue[1]?.ToString()))
            : true;

        int? p_quantity = null, p_itemCategoryId = null, p_unitId = null, p_price = null;
        string p_attributeIds = null;
        switch (model.FieldItem)
        {
            case "itemType":
                p_itemTypeId = Convert.ToInt32(model.FieldValue);
                break;
            case "item":
                p_itemId = Convert.ToInt32(model.FieldValue);
                break;
            case "categoryItemName":
                p_itemCategoryId = Convert.ToInt32(model.FieldValue);
                break;
            case "unitNames":
                p_unitId = Convert.ToInt32(model.FieldValue);
                break;
            case "attributeName":
                p_attributeIds = model.FieldValue;
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id");
        parameters.Add("HeaderId", model.Form_KeyValue[0]?.ToString());
        parameters.Add("ItemTypeId", p_itemTypeId);
        parameters.Add("ItemId", p_itemId);
        parameters.Add("ItemCategoryId", p_itemCategoryId);
        parameters.Add("UnitId", p_unitId);
        parameters.Add("AttributeIds", p_attributeIds);
        parameters.Add("Quantity", p_quantity);
        parameters.Add("Price", p_price);

        var stageId = model.Form_KeyValue.Length > 3 ? Convert.ToInt16(model.Form_KeyValue[4]?.ToString()) : 0;

        var workflowId = model.Form_KeyValue.Length > 4 ? Convert.ToInt16(model.Form_KeyValue[5]?.ToString()) : 0;


        if (!isDefaultCurrency)
            result.Columns = await GetInvoiceLineAdvanceColumns(model.CompanyId, Convert.ToInt16(stageId),
                Convert.ToInt32(workflowId));
        else
            result.Columns = await GetInvoiceLineSimpleColumns(model.CompanyId, Convert.ToInt16(stageId),
                Convert.ToInt32(workflowId));

        using (var conn = Connection)
        {
            var sQuery = "pu.Spc_PurchaseOrderLine_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<PurchaseInvoiceLines>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }


        var postLine = _postingGroupRepository.GetAllDataDropDown((int)PostingGroupType.BranchPurchase);

        for (var i = 0; i < postLine.Result.Count(); i++)
        {
            var current = postLine.Result[i];

            result.Columns.DataColumns.Add(new DataStageStepConfigColumnsViewModel
            {
                Id = $"accountGLName_{current.Id}", Title = $"{current.Name}/کل", Width = 5, IsDisplayItem = true
            });
            result.Columns.DataColumns.Add(new DataStageStepConfigColumnsViewModel
            {
                Id = $"accountSGLName_{current.Id}", Title = $"{current.Name}/معین", Width = 5, IsDisplayItem = true
            });
            result.Columns.DataColumns.Add(new DataStageStepConfigColumnsViewModel
            {
                Id = $"accountDetailName_{current.Id}", Title = $"{current.Name}/تفصیل", Width = 5, IsDisplayItem = true
            });
        }

        if (result.Data.ListHasRow())
        {
            var columnsHasSum = result.Columns.DataColumns.Where(c => !c.CalculateSum).Select(v => v.Id).ToList();

            foreach (var item in columnsHasSum)
            {
                var col = result.Columns.DataColumns.Where(x => x.Id == item).SingleOrDefault();

                var sum = result.Data.Sum(s => decimal.Parse(GetPropValue(s, item).ToString()));
                col.SumValue = sum;
            }
        }

        return result;
    }

    public async Task<MyResultPage<PurchaseInvoiceLineGetRecord>> GetRecordByIds(int id, int companyId)
    {
        var result = new MyResultPage<PurchaseInvoiceLineGetRecord>
        {
            Data = new PurchaseInvoiceLineGetRecord()
        };

        using (var conn = Connection)
        {
            var sQuery = "[pu].[Spc_PurchaseOrderLine_GetRecord]";
            result.Data = await conn.QueryFirstOrDefaultAsync<PurchaseInvoiceLineGetRecord>(sQuery, new
            {
                Id = id,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);
        }


        if (result.Data.NotNull() && result.Data.StageClassId == 7)
        {
            var accountDetail = await GetPurchaseInvoiceAcountDetailByObjectId(result.Data.HeaderId, result.Data.Id);

            if (accountDetail.NotNull())
            {
                result.Data.AccountDetailId = accountDetail.Id;
                result.Data.AccountDetailName = accountDetail.Name;
            }
        }

        return result;
    }

    public async Task<MyResultStatus> ValidationBeforeSave(PurchaseInvoiceLineModel model, OperationType operationType,
        int companyId)
    {
        model.Ratio = model.Ratio == 0 ? 1 : model.Ratio;
        var result = new MyResultStatus();

        #region CheckPurchaseInvoicePostingGroup

        var res = new MyResultPage<List<PostingGroupbyTypeLineModel>>
        {
            Data = new List<PostingGroupbyTypeLineModel>()
        };


        var getPostingGroupModel = new GetPostingGroup
        {
            StageId = model.StageId,
            ItemCategoryId = model.CategoryId,

            ItemTypeId = model.ItemTypeId,
            PostingGroupTypeId = PostingGroupType.BranchPurchase,
            BranchId = model.BranchId,
            HeaderId = 0
        };

        res.Data = await _postingGroupRepository.GetPostingGroupByTypeLine(getPostingGroupModel);

        for (var d = 0; d < res.Data.Count(); d++)
        {
            if (model.StageClassId != 7)
            {
                //  هم چک شود stageClass  علاوه بر چک شدن نوع کد  کل دائمی باید   
                if (res.Data[d].IncomeBalanceId == (byte)IncomeBalance.Permenant &&
                    model.StageClassId == (byte)StageClassType.PurchaceInvoice)
                {
                    res.Data[d].AccountDetailId = model.HeaderAccountDetailId;
                    res.Data[d].NoSeriesId = model.HeaderNoSeriesId;
                }
                else
                {
                    res.Data[d].AccountDetailId =
                        await _costCenterRepository.GetHeaderId(model.StageId, model.ItemId, model.ItemTypeId);
                    res.Data[d].NoSeriesId = (byte)NoSeries.CostCenter; //مرکزهزینه
                }
            }
            else
            {
                if (res.Data[d].PostingGroupTypeLineId == 13 || res.Data[d].PostingGroupTypeLineId == 19 ||
                    res.Data[d].PostingGroupTypeLineId == 14 || res.Data[d].PostingGroupTypeLineId == 21)
                {
                    if (model.AccountDetailId == 0)
                    {
                        result.Successfull = false;
                        result.Status = -100;
                        result.StatusMessage = "تفضیل را انتخاب کنید";
                        result.ValidationErrors.Add(result.StatusMessage);
                        return result;
                    }

                    res.Data[d].AccountDetailId = model.AccountDetailId;
                    res.Data[d].NoSeriesId =
                        _accountDetailRepository.GetNoSeries(model.AccountDetailId, companyId).Result;
                }
                else
                {
                    res.Data[d].AccountDetailId = model.VatAccountDetailId;
                    res.Data[d].NoSeriesId = model.VatNoSeriesId;
                }
            }

            res.Data[d].IsLast = false;
            res.Data[d].CategoryId = model.CategoryId;
        }


        var getAction = new GetStageAction();
        getAction.CompanyId = companyId;
        getAction.StageId = model.StageId;
        getAction.WorkflowId = model.WorkflowId;

        var stageAction = await _stageActionRepository.GetStageActionWithParam(getAction);
        var IsQuantityPurchase = false;

        if (stageAction != null) IsQuantityPurchase = stageAction.Any(s => s.IsQuantityPurchase);

        if (!IsQuantityPurchase)
        {
            var grossAmountPoint = Math.Truncate(model.GrossAmount);
            if (res.Data.Any(x => x.PostingGroupTypeLineId == 13) && grossAmountPoint == 0)
            {
                var portinggrouptypeLineGrossAmount = res.Data.FirstOrDefault(p => p.PostingGroupTypeLineId == 13);
                res.Data.Remove(portinggrouptypeLineGrossAmount);
            }

            var decimalGrossAmountPoint = model.GrossAmount - grossAmountPoint;
            if (res.Data.Any(x => x.PostingGroupTypeLineId == 19) && decimalGrossAmountPoint == 0)
            {
                var portinggrouptypeLineDecimalGrossAmount =
                    res.Data.FirstOrDefault(p => p.PostingGroupTypeLineId == 19);
                res.Data.Remove(portinggrouptypeLineDecimalGrossAmount);
            }


            var discountValue = Math.Truncate(model.DiscountAmount);
            if (res.Data.Any(x => x.PostingGroupTypeLineId == 14) && discountValue == 0)
            {
                var portinggrouptypeLineDiscountValue = res.Data.FirstOrDefault(p => p.PostingGroupTypeLineId == 14);
                res.Data.Remove(portinggrouptypeLineDiscountValue);
            }

            var decimalDiscountValue = model.DiscountAmount - discountValue;
            if (res.Data.Any(x => x.PostingGroupTypeLineId == 20) && decimalDiscountValue == 0)
            {
                var portinggrouptypeLineDecimalDiscountValue =
                    res.Data.FirstOrDefault(p => p.PostingGroupTypeLineId == 20);
                res.Data.Remove(portinggrouptypeLineDecimalDiscountValue);
            }

            var vatAmount = Math.Truncate(model.VATAmount);
            if (res.Data.Any(x => x.PostingGroupTypeLineId == 15) && model.VATAmount == 0)
            {
                var portinggrouptypeLineVATAmount = res.Data.FirstOrDefault(p => p.PostingGroupTypeLineId == 15);
                res.Data.Remove(portinggrouptypeLineVATAmount);
            }

            var decimalVATAmount = model.VATAmount - vatAmount;
            if (res.Data.Any(x => x.PostingGroupTypeLineId == 21) && decimalVATAmount == 0)
            {
                var portinggrouptypeLineDecimalVATAmount = res.Data.FirstOrDefault(p => p.PostingGroupTypeLineId == 21);
                res.Data.Remove(portinggrouptypeLineDecimalVATAmount);
            }
        }


        var purchaseInvoicePosting = res.Data;
        model.PersonInvoicePostingGroup = purchaseInvoicePosting;

        var insertprevious = false;
        var validateResult = new List<string>();
        validateResult = await ValidatePreviousStageLinests(model, res.Data, operationType, companyId,
            IsQuantityPurchase, insertprevious);

        if (validateResult.ListHasRow())
        {
            var resultValidate = new MyResultStatus();
            resultValidate.Successfull = false;
            resultValidate.ValidationErrors = validateResult;
            return resultValidate;
        }

        result.Successfull = true;
        result.Status = 100;

        #endregion

        return result;
    }


    public async Task<MyResultStatus> Save(PurchaseInvoiceLineModel model)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "pu.Spc_PurchaseInvoiceLine_InsUpd";
            conn.Open();
            var outPut = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                model.Id,
                model.HeaderId,
                model.BranchId,
                model.ItemTypeId,
                model.ItemId,
                model.CategoryId,
                model.CurrencyId,
                model.Quantity,
                model.Price,
                ExchangeRate = model.ExchangeRate == 0 ? 1 : model.ExchangeRate,
                model.GrossAmount,
                model.DiscountValue,
                model.DiscountType,
                model.DiscountAmount,
                model.NetAmount,
                VatId = model.VatId > 0 ? model.VatId : 0,
                VatPer = model.VatPer > 0 ? model.VatPer : 0,
                model.VATAmount,
                model.NetAmountPlusVAT,
                model.AllowInvoiceDiscount,
                model.PriceIncludingVAT,
                model.CreateUserId,
                CreateDateTime = DateTime.Now,
                model.InOut,
                UnitId = model.UnitId == 0 ? null : model.UnitId,
                SubUnitId = model.IdSubUnit == 0 ? null : model.SubUnitId,
                model.Ratio,
                model.TotalQuantity,
                model.AttributeIds,
                ObjectPostingGroupJson = JsonConvert.SerializeObject(model.PersonInvoicePostingGroup)
            }, commandType: CommandType.StoredProcedure);
            conn.Close();


            result.Successfull = outPut > 0;
            result.Status = outPut > 0 ? 100 : -99;
        }

        return result;
    }

    public async Task<MyResultStatus> DeleteInvoiceLine(PurchaseInvoiceLineModel model, int companyId)
    {
        var result = new MyResultStatus();
        var validateResult = await ValidateDeletePurchaseOrderLine(model, companyId);

        if (validateResult.ListHasRow())
        {
            result.Successfull = false;
            result.ValidationErrors = validateResult;
            return result;
        }

        var sQuery = "";
        var output = 0;
        sQuery = "[pu].[Spc_PurchaseOrderLine_Delete]";
        using (var conn = Connection)
        {
            conn.Open();
            output = await conn.QueryFirstOrDefaultAsync<int>(
                sQuery, new
                {
                    PurchaseOrderLineId = model.Id,
                    model.HeaderId,
                    UserId = model.CreateUserId
                }, commandType: CommandType.StoredProcedure);

            conn.Close();
        }

        result.Successfull = output > 0;
        result.Status = result.Successfull ? 100 : -100;
        result.StatusMessage = !result.Successfull ? "عملیات حذف با مشکل مواجه شد" : "";

        return result;
    }

    public async Task<MyResultStatus> InsertPreviousStageLinests(List<SaveRequestLine> modelList, int companyId,
        int userId)
    {
        var result = new MyResultStatus();
        var resultErrors = new List<MyResultStatus>();
        var validationErrors = new MyResultDataQuery<MyResultStatus>();
        var validateResult = new List<string>();

        var stageId = modelList.Select(x => x.StageId).Distinct().SingleOrDefault();

        var fundItemTypeIdList = await _stageFundItemTypeRepository.GetFundItemTypeId(stageId);

        var fundItemTypeIdModel = modelList.Select(x => x.ItemTypeId).Distinct().ToList();

        var fundItemTypeExceptList = fundItemTypeIdModel.Except(fundItemTypeIdList);


        if (fundItemTypeExceptList.Count() > 0)
        {
            var strErorr = "";
            for (var i = 0; i < fundItemTypeExceptList.ToList().Count(); i++)
                strErorr += fundItemTypeExceptList.ToList()[i].ToString() + ',';

            result.Successfull = false;
            result.Status = -100;
            result.StatusMessage =
                $"نوع آیتم انتخابی درخواست با شناسه های : ({strErorr.Remove(strErorr.Length - 1, 1)}) داخل برگه ی مقصد وجود ندارد";
            result.ValidationErrors.Add(result.StatusMessage);
            return result;
        }


        var newPurchaseInvoiceLineList = new List<PurchaseInvoiceLineModel>();
        foreach (var item in modelList)
        {
            var newPurchaseInvoiceLine = new PurchaseInvoiceLineModel();
            var getRecordItem = await GetRecordByIds(item.Id, companyId);


            newPurchaseInvoiceLine = _mapper.Map<PurchaseInvoiceLineModel>(getRecordItem.Data);


            newPurchaseInvoiceLine.Id = 0;
            newPurchaseInvoiceLine.HeaderId = item.PersonOrderId;
            newPurchaseInvoiceLine.CreateUserId = userId;
            newPurchaseInvoiceLine.StageId = item.StageId;
            newPurchaseInvoiceLine.CategoryId = item.CategoryId;
            newPurchaseInvoiceLine.IsQuantity = item.IsQuantity;
            newPurchaseInvoiceLine.GrossAmount = item.GrossAmount;
            newPurchaseInvoiceLine.VatId = item.VatId > 0 ? item.VatId : null;
            newPurchaseInvoiceLine.VatNoSeriesId = item.VatNoSeriesId;
            newPurchaseInvoiceLine.VatAccountDetailId = item.VatAccountDetailId;
            newPurchaseInvoiceLine.HeaderAccountDetailId = item.HeaderAccountDetailId;
            newPurchaseInvoiceLine.HeaderNoSeriesId = item.HeaderNoSeriesId;
            newPurchaseInvoiceLine.NetAmount = item.NetAmount;
            newPurchaseInvoiceLine.NetAmountPlusVAT = item.NetAmountPlusVat;
            newPurchaseInvoiceLine.Price = item.Price;
            newPurchaseInvoiceLine.Quantity = item.Quantity;
            newPurchaseInvoiceLine.TotalQuantity = item.TotalQuantity;
            newPurchaseInvoiceLine.VATAmount = item.VatAmount;
            newPurchaseInvoiceLine.DiscountType = item.DiscountType;
            newPurchaseInvoiceLine.PriceIncludingVAT = item.PriceIncludingVAT;
            newPurchaseInvoiceLine.DiscountValue = item.DiscountValue;
            newPurchaseInvoiceLine.DiscountAmount = item.DiscountAmount;
            newPurchaseInvoiceLine.VatPer = newPurchaseInvoiceLine.VatPer > 0 ? newPurchaseInvoiceLine.VatPer : null;
            newPurchaseInvoiceLine.Ratio = newPurchaseInvoiceLine.Ratio > 0 ? newPurchaseInvoiceLine.Ratio : null;
            newPurchaseInvoiceLine.AttributeIds =
                newPurchaseInvoiceLine.AttributeIds != "" ? newPurchaseInvoiceLine.AttributeIds : "";


            var modelStage = new GetStageFundItemTypeInOut
            {
                FundItemTypeId = newPurchaseInvoiceLine.ItemTypeId,
                StageId = item.StageId
            };
            newPurchaseInvoiceLine.InOut = Convert.ToByte(await _stageFundItemTypeRepository.GetInOutId(modelStage));

            var res = new MyResultPage<List<PostingGroupbyTypeLineModel>>
            {
                Data = new List<PostingGroupbyTypeLineModel>()
            };


            var getPostingGroupModel = new GetPostingGroup
            {
                StageId = newPurchaseInvoiceLine.StageId,
                ItemCategoryId = newPurchaseInvoiceLine.CategoryId,
                ItemTypeId = newPurchaseInvoiceLine.ItemTypeId,
                PostingGroupTypeId = PostingGroupType.BranchPurchase,
                BranchId = newPurchaseInvoiceLine.BranchId,
                HeaderId = 0
            };

            res.Data = await _postingGroupRepository.GetPostingGroupByTypeLine(getPostingGroupModel);

            res.Data = res.Data.OrderByDescending(x => x.PostingGroupTypeId).ThenBy(x => x.PostingGroupTypeLineId)
                .ToList();


            for (var d = 0; d < res.Data.Count(); d++)
            {
                //  هم چک شود stageClass  علاوه بر چک شدن نوع کد  کل دائمی باید   
                if (res.Data[d].IncomeBalanceId == (byte)IncomeBalance.Permenant &&
                    item.StageClassId == (byte)StageClassType.PurchaceInvoice)

                {
                    if (newPurchaseInvoiceLine.HeaderAccountDetailId == 0)
                    {
                        res.Data[d].AccountDetailId = 0;
                        res.Data[d].NoSeriesId = 0;
                    }
                    else
                    {
                        res.Data[d].AccountDetailId = newPurchaseInvoiceLine.HeaderAccountDetailId;
                        res.Data[d].NoSeriesId = newPurchaseInvoiceLine.HeaderNoSeriesId;
                    }
                }

                else
                {
                    var costCenterId = await _costCenterRepository.GetHeaderId(newPurchaseInvoiceLine.StageId,
                        newPurchaseInvoiceLine.ItemId, newPurchaseInvoiceLine.ItemTypeId);
                    if (costCenterId == 0)
                    {
                        res.Data[d].AccountDetailId = 0;
                        res.Data[d].NoSeriesId = 0;
                    }
                    else
                    {
                        res.Data[d].AccountDetailId = costCenterId;
                        res.Data[d].NoSeriesId = (byte)NoSeries.CostCenter; //مرکزهزینه
                    }
                }

                res.Data[d].IsLast = false;
                res.Data[d].CategoryId = item.CategoryId;
            }

            var purchaseInvoicePosting = res.Data;

            newPurchaseInvoiceLine.PersonInvoicePostingGroup = purchaseInvoicePosting;

            var getAction = new GetStageAction();
            getAction.CompanyId = companyId;
            getAction.StageId = newPurchaseInvoiceLine.StageId;
            getAction.WorkflowId = item.WorkflowId;

            var stageAction = await _stageActionRepository.GetStageActionWithParam(getAction);
            var IsQuantityPurchase = false;

            if (stageAction != null) IsQuantityPurchase = stageAction.Any(s => s.IsQuantityPurchase);

            var insertprevious = true;
            validateResult = await ValidatePreviousStageLinests(newPurchaseInvoiceLine, res.Data, OperationType.Insert,
                companyId, IsQuantityPurchase, insertprevious);

            if (validateResult.ListHasRow())
            {
                result.Successfull = false;
                result.Status = -100;

                for (var i = 0; i < validateResult.Count; i++) result.ValidationErrors.Add(validateResult[i]);
            }
            else
            {
                newPurchaseInvoiceLineList.Add(newPurchaseInvoiceLine);
            }
        }

        if (result.ValidationErrors.Count > 0)
            return result;


        for (var i = 0; i < newPurchaseInvoiceLineList.Count; i++)
        {
            result = await Save(newPurchaseInvoiceLineList[i]);

            if (!result.Successfull) return result;
        }


        if (result.ValidationErrors.Count == 0)
            result.StatusMessage = "عملیات با موفقیت انجام شد";


        return result;
    }

    public async Task<MyResultStageStepConfigPage<List<PurchaseInvoiceRequestLine>>> GetPurchaseInvoiceLineRequest(
        GetPageViewModel model, int companyId)
    {
        var result = new MyResultStageStepConfigPage<List<PurchaseInvoiceRequestLine>>
        {
            Data = new List<PurchaseInvoiceRequestLine>()
        };

        var getResult = new MyResultStageStepConfigPage<List<PurchaseInvoiceRequestLine>>
        {
            Data = new List<PurchaseInvoiceRequestLine>()
        };

        var requestId = Convert.ToInt32(model.Form_KeyValue[0]?.ToString());
        var itemTypeId = Convert.ToByte(model.Form_KeyValue[1]?.ToString());
        var isDefaultCurrency = model.Form_KeyValue[2] == null
            ? true
            : Convert.ToBoolean(Convert.ToInt32(model.Form_KeyValue[2]).ToString());
        var stageId = Convert.ToInt16(model.Form_KeyValue[3]?.ToString());
        var workflowId = Convert.ToInt16(model.Form_KeyValue[7]?.ToString());
        var parentworFlowId = Convert.ToByte(model.Form_KeyValue[8]?.ToString());
        var workflowCategoryId = Convert.ToByte(model.Form_KeyValue[10]?.ToString());
        var accountDetailId = Convert.ToInt32(model.Form_KeyValue[11]?.ToString());
        var parameters = new DynamicParameters();

        int? p_itemId = null, p_itemCategoryId = null, p_unitId = null, p_zoneId = null, p_binId = null;
        string p_attributeNameId = null;
        if (workflowCategoryId == 1) // درخواست خرید در صورتحساب خرید استفاده شده
        {
            switch (model.FieldItem)
            {
                case "item":
                    p_itemId = Convert.ToInt32(model.FieldValue);
                    break;
                case "categoryItemName":
                    p_itemCategoryId = Convert.ToInt32(model.FieldValue);
                    break;
                case "unitNames":
                    p_unitId = Convert.ToInt32(model.FieldValue);
                    break;

                case "attributeName":
                    p_attributeNameId = model.FieldValue;
                    break;
            }

            parameters.Add("PageNo", model.PageNo);
            parameters.Add("PageRowsCount", model.PageRowsCount);
            parameters.Add("CompanyId", companyId);
            parameters.Add("RequestId", requestId);
            parameters.Add("ItemTypeId", itemTypeId);
            parameters.Add("ItemId", p_itemId);
            parameters.Add("ItemCategoryId", p_itemCategoryId);
            parameters.Add("UnitId", p_unitId);
            parameters.Add("AttributeIds", p_attributeNameId);
        }

        else if (workflowCategoryId == 11) // درخواست خرید در انبار استفاده شده
        {
            switch (model.FieldItem)
            {
                case "zone":
                    p_zoneId = Convert.ToInt32(model.FieldValue);
                    break;
                case "bin":
                    p_binId = Convert.ToInt32(model.FieldValue);
                    break;
                case "itemId":
                    p_itemId = Convert.ToInt32(model.FieldValue);
                    break;
                case "categoryItemName":
                    p_itemCategoryId = Convert.ToInt32(model.FieldValue);
                    break;
                case "unitNames":
                    p_unitId = Convert.ToInt32(model.FieldValue);
                    break;
                case "attributeName":
                    p_attributeNameId = model.FieldValue;
                    break;
            }

            parameters.Add("PageNo", model.PageNo);
            parameters.Add("PageRowsCount", model.PageRowsCount);
            parameters.Add("CompanyId", companyId);
            parameters.Add("RequestId", requestId);
            parameters.Add("ItemTypeId", itemTypeId);
            parameters.Add("ItemId");
            parameters.Add("ItemCategoryId", p_itemCategoryId);
            parameters.Add("UnitId", p_unitId);
            parameters.Add("AttributeIds", p_attributeNameId);
            parameters.Add("ZoneId");
            parameters.Add("BinId");
            parameters.Add("ParentWorkflowCategoryId", parentworFlowId);
        }


        using (var conn = Connection)
        {
            var sQuery = workflowCategoryId == 1
                ? "[pu].[Spc_PurchaseOrder_RequestLineByStageId]"
                : "[wh].[Spc_ItemTransaction_RequestLineByStageId]";
            conn.Open();
            getResult.Data =
                (await conn.QueryAsync<PurchaseInvoiceRequestLine>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        if (workflowCategoryId == 11)
            //ItemTypeId =1 کالا
            //ItemTypeId =4 دارایی ثابت
            getResult.Data = getResult.Data.Where(x => x.ItemTypeId.ToString() == "1" || x.ItemTypeId.ToString() == "4")
                .ToList();

        if (isDefaultCurrency)
        {
            var getrequestLogic = new GetParentRequestLogicByWorkflowCategory
            {
                RequestId = requestId,
                WorkflowCategoryId = parentworFlowId
            };


            var requestStageAction = await _stageActionRepository.GetParentRequestStageStepActionById(getrequestLogic);


            getResult.Columns = await GetRequestLineSimpleColumns(stageId, workflowId, workflowCategoryId,
                accountDetailId, itemTypeId, requestStageAction);
            getResult.Columns.DataColumns = getResult.Columns.DataColumns
                .Where(a => a.Id != "currencyId" && a.Id != "currencyName" && a.Id != "exchangeRate").ToList();
            getResult.Columns.IsEditable = true;
            getResult.Columns.IsSelectable = true;
        }
        else
        {
            getResult.Columns = await GetRequestLineAdvanceColumns(stageId, workflowId, parentworFlowId);
        }

        if (getResult.Data.ListHasRow())
        {
            var itemTypes = getResult.Data.Select(f => f.ItemTypeId).Distinct().ToList();

            var itemTypeIds = new List<ID>();
            foreach (var itm in itemTypes) itemTypeIds.Add(new ID { Id = itm });

            if (itemTypes.ListHasRow())
                for (var y = 0; y < itemTypes.Count; y++)
                {
                    var stageStepConfigColumn = new GetStageStepConfigColumnsViewModel();
                    var itemtype = itemTypes[y];

                    var stageSteConfig = new MyResultDataQuery<StageStepConfigModel>();
                    stageSteConfig.Data = new StageStepConfigModel
                    {
                        HeaderFields = new List<StageStepHeaderColumn>
                        {
                            new()
                            {
                                FieldId = "stageId"
                            },
                            new()
                            {
                                FieldId = "workFlowId"
                            }
                        },
                        LineFields = new List<StageStepLineColumn>
                            { new() { FieldId = "itemTypeId", TableName = "pu.PurchaseOrderLine" } }
                    };

                    stageSteConfig.Data.HeaderFields[0].FieldValue = stageId.ToString();
                    stageSteConfig.Data.HeaderFields[1].FieldValue = workflowId.ToString();
                    stageSteConfig.Data.LineFields.FirstOrDefault().FieldValue = itemtype.ToString();

                    var newColumns = new GetStageStepConfigColumnsViewModel();
                    newColumns.DataColumns = new List<DataStageStepConfigColumnsViewModel>();
                    newColumns.StageStepConfig = stageSteConfig.Data;
                    foreach (var item in getResult.Columns.DataColumns)
                    {
                        var itm = _mapper.Map<DataStageStepConfigColumnsViewModel>(item);
                        newColumns.DataColumns.Add(itm);
                    }

                    var resultConfig = await _stageStepConfigRepository.GetStageStepConfigColumn(newColumns, true);
                    if (isDefaultCurrency)
                        resultConfig.Data = resultConfig.Data.Where(a =>
                            a.Id != "currencyId" && a.Id != "currencyName" && a.Id != "exchangeRate").ToList();

                    stageStepConfigColumn.DataColumns = new List<DataStageStepConfigColumnsViewModel>();
                    foreach (var item in resultConfig.Data)
                    {
                        var itm = _mapper.Map<DataStageStepConfigColumnsViewModel>(item);
                        stageStepConfigColumn.DataColumns.Add(itm);
                    }

                    stageStepConfigColumn.IdentityId = itemtype;
                    stageStepConfigColumn.IsEditable = true;
                    stageStepConfigColumn.IsSelectable = true;
                    getResult.Columns.DataColumns = stageStepConfigColumn.DataColumns;
                }
        }

        if (workflowCategoryId == 1)
        {
            var queryPurchaseInvoice = (
                from p in getResult.Data
                select new PurchaseInvoiceRequestLine
                {
                    Id = p.Id,

                    ItemTypeId = p.ItemTypeId,
                    ItemTypeName = p.ItemTypeName,

                    ItemId = p.ItemId,
                    ItemName = p.ItemName,

                    CategoryId = p.CategoryId,
                    CategoryName = p.CategoryName,

                    AttributeIds = p.AttributeIds,
                    AttributeName = p.AttributeName,

                    UnitId = p.UnitId,
                    UnitName = p.UnitName,

                    SubUnitId = p.SubUnitId,
                    SubUnitName = p.SubUnitName,

                    InOut = p.InOut,

                    IsQuantity = p.IsQuantity,

                    IsNegativeQuntity = p.Quantity < 0 ? true : false,

                    CurrencyId = p.CurrencyId,
                    CurrencyName = p.CurrencyName,
                    ExchangeRate = p.ExchangeRate,

                    VatAccountDetailId = p.VatAccountDetailId,
                    VatId = p.VatId,
                    VatNoSeriesId = p.VatNoSeriesId,
                    VATPer = p.VATPer,

                    PriceIncludingVAT = p.PriceIncludingVAT,

                    RequestQuantity = p.RequestQuantity,
                    Quantity = Math.Abs(p.Quantity),
                    Ratio = p.Ratio,
                    TotalQuantity = Math.Abs(p.TotalQuantity),
                    Price = p.Price,
                    GrossAmount = Math.Abs(p.TotalQuantity * p.Price),
                    DiscountType = p.DiscountType,
                    DiscountTypeName = p.DiscountTypeName,
                    DiscountValue = Math.Round(
                        p.DiscountType == 1
                            ? decimal.Parse(p.DiscountValue.ToString())
                            : decimal.Parse(p.DiscountAmount.ToString()) /
                              (decimal.Parse(p.RequestQuantity.ToString()) * decimal.Parse(p.Ratio.ToString())) *
                              decimal.Parse(p.TotalQuantity.ToString()), 3),
                    DiscountAmount = Math.Round(
                        p.DiscountType == 1
                            ? decimal.Parse(p.GrossAmount.ToString()) *
                              (decimal.Parse(p.DiscountValue.ToString()) / decimal.Parse("100"))
                            : decimal.Parse(p.DiscountAmount.ToString()) /
                              (decimal.Parse(p.RequestQuantity.ToString()) * decimal.Parse(p.Ratio.ToString())) *
                              decimal.Parse(p.TotalQuantity.ToString()), 3),
                    NetAmount = Math.Round(
                        decimal.Parse(p.TotalQuantity.ToString()) * decimal.Parse(p.Price.ToString()) -
                        (p.DiscountType == 1
                            ? decimal.Parse(p.GrossAmount.ToString()) *
                              (decimal.Parse(p.DiscountValue.ToString()) / decimal.Parse("100"))
                            : decimal.Parse(p.DiscountAmount.ToString()) /
                              (decimal.Parse(p.RequestQuantity.ToString()) * decimal.Parse(p.Ratio.ToString())) *
                              decimal.Parse(p.TotalQuantity.ToString())), 3),
                    VatAmount = Math.Round(
                        decimal.Parse(p.VATPer.ToString()) / decimal.Parse("100") *
                        (decimal.Parse(p.TotalQuantity.ToString()) * decimal.Parse(p.Price.ToString()) - Math.Round(
                            p.DiscountType == 1
                                ? decimal.Parse(p.GrossAmount.ToString()) *
                                  (decimal.Parse(p.DiscountValue.ToString()) / decimal.Parse("100"))
                                : decimal.Parse(p.DiscountAmount.ToString()) /
                                  (decimal.Parse(p.RequestQuantity.ToString()) * decimal.Parse(p.Ratio.ToString())) *
                                  decimal.Parse(p.TotalQuantity.ToString()), 3)), 3),
                    NetAmountPlusVat = Math.Round(decimal.Parse(p.VATPer.ToString()) / decimal.Parse("100") *
                                                  (decimal.Parse(p.TotalQuantity.ToString()) *
                                                      decimal.Parse(p.Price.ToString()) - (p.DiscountType == 1
                                                          ? decimal.Parse(p.GrossAmount.ToString()) *
                                                            (decimal.Parse(p.DiscountValue.ToString()) /
                                                             decimal.Parse("100"))
                                                          : decimal.Parse(p.DiscountAmount.ToString()) /
                                                            (decimal.Parse(p.RequestQuantity.ToString()) *
                                                             decimal.Parse(p.Ratio.ToString())) *
                                                            decimal.Parse(p.TotalQuantity.ToString()))) +
                                                  (decimal.Parse(p.TotalQuantity.ToString()) *
                                                      decimal.Parse(p.Price.ToString()) - (p.DiscountType == 1
                                                          ? decimal.Parse(p.GrossAmount.ToString()) *
                                                            (decimal.Parse(p.DiscountValue.ToString()) /
                                                             decimal.Parse("100"))
                                                          : decimal.Parse(p.DiscountAmount.ToString()) /
                                                            (decimal.Parse(p.RequestQuantity.ToString()) *
                                                             decimal.Parse(p.Ratio.ToString())) *
                                                            decimal.Parse(p.TotalQuantity.ToString()))), 3)
                }
            ).ToList();


            getResult.Data = new List<PurchaseInvoiceRequestLine>();
            getResult.Data = queryPurchaseInvoice;
            result = getResult;
        }
        else
        {
            result = getResult;
        }

        return result;
    }

    public async Task<int> ExistPurchaseLine(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "pu.PurchaseOrderLine",
                    ColumnName = "Count(*) as count",
                    Filter = $"HeaderId='{id}'"
                }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }

    public async Task<List<PurchaseLinePostingGroup>> GetPurchaseLineListForPost(List<ID> ids, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pu].[Spc_PurchaseLine_PostingGroup_GetList]";
            conn.Open();

            var result = (await conn.QueryAsync<PurchaseLinePostingGroup>(sQuery,
                new
                {
                    IdsJSON = JsonConvert.SerializeObject(ids),
                    CompanyId = companyId
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<PurchaseRequestViewModel> GetPurchaseRequestInfo(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<PurchaseRequestViewModel>(sQuery, new
            {
                TableName = "pu.PurchaseOrderLine",
                ColumnName =
                    $"Id,(SELECT TOP 1 TotalQuantity FROM pu.PurchaseOrderLineDetail WHERE PurchaseOrderLineId={id}) As TotalQuantity,DiscountAmount,GrossAmount",
                Filter = $"Id={id}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }


    public async Task<PurchaseOrderSum> GetLineSum(NewGetPageViewModel model)
    {
        int? p_itemTypeId = null,
            p_itemId = null,
            p_quantity = null,
            p_itemCategoryId = null,
            p_unitId = null,
            p_price = null;
        string p_attributeIds = null;
        switch (model.FieldItem)
        {
            case "item":
                p_itemId = Convert.ToInt32(model.FieldValue);
                break;
            case "itemType":
                p_itemTypeId = Convert.ToInt32(model.FieldValue);
                break;
            case "categoryItemName":
                p_itemCategoryId = Convert.ToInt32(model.FieldValue);
                break;
            case "unitNames":
                p_unitId = Convert.ToInt32(model.FieldValue);
                break;
            case "attributeName":
                p_attributeIds = model.FieldValue;
                break;
        }

        var parameters = new DynamicParameters();

        parameters.Add("Id");
        parameters.Add("HeaderId", model.Form_KeyValue[0]?.ToString());
        parameters.Add("ItemTypeId", p_itemTypeId);
        parameters.Add("ItemId", p_itemId);
        parameters.Add("ItemCategoryId", p_itemCategoryId);
        parameters.Add("UnitId", p_unitId);
        parameters.Add("AttributeIds", p_attributeIds);
        parameters.Add("Quantity", p_quantity);
        parameters.Add("Price", p_price);
        parameters.Add("CompanyId", model.CompanyId);
        using (var conn = Connection)
        {
            var sQuery = "[pu].[Spc_PurchaseOrderLine_Sum]";
            conn.Open();
            var result =
                await conn.QueryFirstOrDefaultAsync<PurchaseOrderSum>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure);

            return result;
        }
    }


    public async Task<MyDropDownViewModel> GetPurchaseInvoiceAcountDetailByObjectId(int objectDocumentId,
        int objectDocumentLineId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_ObjectDocumentPostingGroup_GetRecord]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<MyDropDownViewModel>(sQuery, new
            {
                ObjectDocumentId = objectDocumentId,
                ObjectDocumentLineId = objectDocumentLineId,
                PostingGroupTypeId = 13,
                PostingGroupTypeLineId = 13
            }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }

    public async Task<List<string>> ValidateDeletePurchaseOrderLine(PurchaseInvoiceLineModel model, int companyId)
    {
        var error = new List<string>();

        if (model == null)
        {
            error.Add("درخواست معتبر نمی باشد");
            return error;
        }

        await Task.Run(async () =>
        {
            #region برگه جاری مجوز حذف دارد؟

            var purchaseOrderAction = new GetAction();

            var currentActionId = await GetActionIdByIdentityId(model.HeaderId);
            purchaseOrderAction.StageId = model.StageId;
            purchaseOrderAction.ActionId = currentActionId;
            purchaseOrderAction.WorkflowId = model.WorkflowId;
            var currentStageAction = await _stageActionRepository.GetAction(purchaseOrderAction);

            if (!currentStageAction.IsDeleteLine) error.Add("مجاز به حذف سطر در این گام نمی باشید");

            #endregion

            #region برگه جاری مرجع است؟

            var targetId = await GetTargetId(model.HeaderId, companyId);
            if (targetId > 0) error.Add("برگه جاری مرجع می باشد، مجاز به حذف نمی باشید");

            #endregion

            #region بررسی وضعیت دوره مالی

            var resultCheckFiscalYear =
                await _fiscalYearRepository.GetFicalYearStatusByDate(model.OrderDate, companyId);

            if (!resultCheckFiscalYear.Successfull)
                error.Add(resultCheckFiscalYear.StatusMessage);

            #endregion
        });

        return error;
    }

    #region Purchase Invoice

    public GetColumnsViewModel GetHeaderColumns(int CompanyId, short stageId)
    {
        var list = new GetColumnsViewModel
        {
            Title = "مشخصات صورتحساب",
            Classes = "group-box-green",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, Size = 50, IsPrimary = true,
                    IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "requestNo", Title = "شناسه مرجع", Type = (int)SqlDbType.TinyInt, HasLink = true,
                    IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "orderDatePersian", Title = "تاریخ برگه", IsPrimary = true, Type = (int)SqlDbType.VarChar,
                    Size = 20, IsDtParameter = true, Width = 6
                },

                new()
                {
                    Id = "orderNo", Title = "شماره برگه", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 8
                },
                new()
                {
                    Id = "journalId", Title = "شناسه سند", Type = (int)SqlDbType.TinyInt, IsDtParameter = true,
                    Width = 8
                },
                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    Width = 15
                },
                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 15
                },

                new()
                {
                    Id = "parentWorkflowCategory", Title = "دسته بندی درخواست", Type = (int)SqlDbType.NVarChar,
                    Size = 50, IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "requestRemainedAmountName", Title = "مانده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10, ClassName = "difference-input", IsCommaSep = true
                },
                new()
                {
                    Id = "isMultipleName", Title = "ارتباط یک به چند با درخواست", Type = (int)SqlDbType.NVarChar,
                    Size = 50, IsDtParameter = false, Width = 15, ClassName = "difference-input", IsCommaSep = true
                },

                new()
                {
                    Id = "inOutName", Title = "ماهیت حساب", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 12
                },

                new()
                {
                    Id = "accountGL", Title = "حساب کل", IsPrimary = true, Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "accountSGL", Title = "حساب معین", IsPrimary = true, Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "accountDetail", Title = " حساب تفضیل", IsPrimary = true, Type = (int)SqlDbType.NVarChar,
                    Size = 50, IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "actionIdName", Title = "گام مرحله", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 15
                },
                new()
                {
                    Id = "note", Title = "توضیحات", Type = (int)SqlDbType.NVarChar, Size = 100, IsPrimary = true,
                    IsDtParameter = true, Width = 20
                },

                new() { Id = "documentType", IsPrimary = true },
                new() { Id = "treasurySubjectId", IsPrimary = true },
                new() { Id = "isDataEntry", IsPrimary = true },
                new() { Id = "accountDetailVatInclude", IsPrimary = true },
                new() { Id = "accountDetailVatEnable", IsPrimary = true },
                new() { Id = "branchId", IsPrimary = true },
                new() { Id = "actionId", IsPrimary = true },
                new() { Id = "isEqualToParentRequest", IsPrimary = true },
                new() { Id = "parentWorkflowCategoryId", IsPrimary = true },
                new() { Id = "parentDocumentDatePersian", IsPrimary = true },
                new() { Id = "personGroupTypeId", IsPrimary = true },
                new() { Id = "returnReasonId", IsPrimary = true },
                new() { Id = "requestId", IsPrimary = true },
                new() { Id = "accountGLId", IsPrimary = true },
                new() { Id = "accountGLName", IsPrimary = true },
                new() { Id = "accountSGLId", IsPrimary = true },
                new() { Id = "accountSGLName", IsPrimary = true },
                new() { Id = "noSeriesId", IsPrimary = true },
                new() { Id = "accountDetailId", IsPrimary = true },
                new() { Id = "accountDetailName", IsPrimary = true },
                new() { Id = "documentTypeId", IsPrimary = true },
                new() { Id = "orderDate", IsPrimary = true },
                new() { Id = "isRequest", IsPrimary = true },
                new() { Id = "stageId", IsPrimary = true },
                new() { Id = "workflowId", IsPrimary = true },
                new() { Id = "stageClassId", IsPrimary = true },
                new() { Id = "isPreviousStage", IsPrimary = true },
                new() { Id = "isQuantityPurchase", IsPrimary = true }
            }
        };

        return list;
    }

    public async Task<MyResultPage<PurchaseInvoiceLineGetPage>> GetHeader(GetPageViewModel model)
    {
        var result = new MyResultPage<PurchaseInvoiceLineGetPage>
        {
            Data = new PurchaseInvoiceLineGetPage()
        };

        var parameters = new DynamicParameters();
        parameters.Add("Id", model.Form_KeyValue[0]?.ToString());
        parameters.Add("AmountOrQuantity", 0);

        using (var conn = Connection)
        {
            var sQuery = "pu.Spc_PurchaseInvoice_Display";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<PurchaseInvoiceLineGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).FirstOrDefault();
        }

        if (result.Data != null)
        {
            result.Data.IsPreviousStage =
                await _stageFundItemTypeRepository.GetHasStagePrevious(result.Data.StageId, result.Data.WorkflowId);

            var getPerchaseOrderAction = new GetAction();
            getPerchaseOrderAction.CompanyId = model.CompanyId;
            getPerchaseOrderAction.StageId = result.Data.StageId;
            getPerchaseOrderAction.ActionId = result.Data.ActionId;
            getPerchaseOrderAction.WorkflowId = result.Data.WorkflowId;

            var stageAction = await _stageActionRepository.GetAction(getPerchaseOrderAction);
            if (stageAction != null)
            {
                result.Data.IsDataEntry = Convert.ToInt32(stageAction.IsDataEntry);
                result.Data.IsRequest = stageAction.IsRequest;
                result.Data.IsTreasurySubject = stageAction.IsTreasurySubject;
                result.Data.IsEqualToParentRequest = result.Data.ParentWorkflowCategoryId == 1 ? true : false;
                result.Data.IsQuantityPurchase = stageAction.IsQuantityPurchase;
            }
        }

        var stageId = result.Data.StageId;
        result.Columns = GetHeaderColumns(model.CompanyId, stageId);
        return result;
    }

    public async Task<GetStageStepConfigColumnsViewModel> GetRequestLineSimpleColumns(int stageId, int workflowId,
        int parentworFlowId, int accountDetailId, byte itemTypeId,
        ParentRequestStageActionLogicModel requestStageAction)
    {
        var isQuantityPurchase = requestStageAction.IsQuantityPurchase;
        var isDisplayItem = parentworFlowId == 1 ? true : false;

        var list = new GetStageStepConfigColumnsViewModel
        {
            Title = "لیست گردش درخواست",
            IsSelectable = true,
            Classes = "group-box-orange",
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "isNegativeQuntity", FieldValue = "true", Operator = "==" } },
            AnswerCondition = "color:#da1717",
            ActionType = "inline",
            HeaderType = "outline",
            IsEditable = true,
            DataColumns = new List<DataStageStepConfigColumnsViewModel>
            {
                new()
                {
                    Id = "id", IsPrimary = true, Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 5
                },
                new() { Id = "headerId", Title = "شناسه هدر", Type = (int)SqlDbType.Int, Width = 5 },
                new() { Id = "stageId", Title = "گام سفارش", Type = (int)SqlDbType.SmallInt, Width = 3 },
                new() { Id = "currencyId", Title = "ارز", Type = (int)SqlDbType.TinyInt, Width = 5 },
                new()
                {
                    Id = "itemType", Title = "نوع آیتم", Type = (int)SqlDbType.NVarChar, Size = 30,
                    IsDtParameter = true, Width = 5
                },


                new() { Id = "inOutName", Title = "ماهیت حساب", IsPrimary = true },
                new()
                {
                    Id = "item", Title = "آیتم", Type = (int)SqlDbType.NVarChar, Size = 30, IsDtParameter = true,
                    Width = 17, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = $"api/PU/VendorItemsApi/getvendoritemslist/{accountDetailId}/{itemTypeId}"
                },
                new()
                {
                    Id = "categoryItemName", Title = "دسته بندی کالا", IsPrimary = true, IsFilterParameter = true,
                    FilterType = "select2", FilterTypeApi = $"api/WH/ItemCategoryApi/getdropdownbytype/{itemTypeId}"
                },
                new()
                {
                    Id = "attributeName", Title = "صفات کالا", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 5, PublicColumn = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "api/WH/ItemAttributeApi/attributeitem_getdropdown/null"
                },
                new()
                {
                    Id = "unitNames", Title = "واحد شمارش", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 4, PublicColumn = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "api/WH/ItemUnitApi/getdropdown"
                },

                new()
                {
                    Id = "ratio", Title = "ضریب", Type = (int)SqlDbType.Decimal, IsDtParameter = true, Width = 4,
                    PublicColumn = true, IsPrimary = true
                },

                new()
                {
                    Id = "zoneId", Title = "بخش", Type = (int)SqlDbType.Int, IsDtParameter = !isDisplayItem,
                    IsFilterParameter = false, Width = 15, Editable = true, InputType = "select2"
                },

                new()
                {
                    Id = "binId", Title = "پالت", Type = (int)SqlDbType.Int, IsDtParameter = !isDisplayItem,
                    IsFilterParameter = false, Width = 15, Editable = true, InputType = "select2"
                },

                new()
                {
                    Id = "requestQuantity", Title = "تعداد درخواست", Type = (int)SqlDbType.Decimal,
                    IsDtParameter = true, Width = 5, PublicColumn = true
                },

                new()
                {
                    Id = "quantity", Title = "تعداد", Type = (int)SqlDbType.Decimal, Size = 30, IsPrimary = true,
                    IsDtParameter = true,
                    IsReadOnly = isDisplayItem, Editable = true, HasSumValue = true, Width = 6, IsCommaSep = true,
                    MaxLength = 9, InputType = "decimal", PublicColumn = true,
                    InputMask = new InputMask { Mask = "'mask':'9{1,5}.9{1,3}'" }
                },


                new()
                {
                    Id = "totalQuantity", Title = "تعداد کل", Type = (int)SqlDbType.Decimal, Size = 30,
                    IsPrimary = true, IsDtParameter = true, Width = 5,
                    HasSumValue = true, IsReadOnly = false, Editable = false, InputType = "decimal"
                },

                new()
                {
                    Id = "price", Title = "نرخ", Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = isDisplayItem,
                    IsCommaSep = true, IsReadOnly = isQuantityPurchase, Editable = true,
                    HasSumValue = false, Width = 7, InputType = "money", MaxLength = 15
                },

                new()
                {
                    Id = "grossAmount", Title = "مبلغ", Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true,
                    IsCommaSep = true, Width = 8, IsReadOnly = false, Editable = true, InputType = "money",
                    HasSumValue = true
                },
                new()
                {
                    Id = "discountType", Title = "نوع تخفیف", Type = (int)SqlDbType.NVarChar,
                    IsReadOnly = isQuantityPurchase, Editable = true, Size = 30, IsDtParameter = true, Width = 6,
                    InputType = "select",
                    Inputs = new List<MyDropDownViewModel>
                        { new() { Id = 1, Name = "درصد" }, new() { Id = 2, Name = "مبلغ" } },
                    IsSelect2 = true, PleaseChoose = true
                },
                new()
                {
                    Id = "discountValue", Title = "تخفیف", Type = (int)SqlDbType.Int, IsReadOnly = isQuantityPurchase,
                    Editable = true, Size = 100, IsCommaSep = true, InputType = "money", HasSumValue = true,
                    IsDtParameter = true, Width = 8, HeaderReadOnly = true
                },
                new()
                {
                    Id = "discountAmount", Title = "مبلغ  تخفیف", Type = (int)SqlDbType.Int, Size = 100,
                    IsCommaSep = true, InputType = "money", IsDtParameter = true, Width = 8, HasSumValue = true,
                    IsReadOnly = false
                },

                new()
                {
                    Id = "netAmount", Title = "مبلغ پس از تخفیف", Type = (int)SqlDbType.Int, Size = 100,
                    IsCommaSep = true, InputType = "money", IsDtParameter = true, Width = 8, HasSumValue = true,
                    IsReadOnly = false
                },
                new()
                {
                    Id = "vatAmount", Title = "مبلغ مالیات بر ارزش افزوده", Type = (int)SqlDbType.Int, Size = 20,
                    IsDtParameter = true, HasSumValue = true, IsCommaSep = true, InputType = "money", Width = 8,
                    IsReadOnly = false
                },
                new()
                {
                    Id = "netAmountPlusVat", Title = "مبلغ با ارزش افزوده", Type = (int)SqlDbType.Int, Size = 20,
                    IsDtParameter = true, IsCommaSep = true, Width = 8, InputType = "money", HasSumValue = true,
                    IsReadOnly = false
                },
                new()
                {
                    Id = "priceIncludingVAT", Title = "قیمت مصرف کننده", Type = (int)SqlDbType.Bit, Size = 11,
                    IsDtParameter = isDisplayItem, Width = 5, InputType = "checkbox", IsPrimary = true,
                    IsReadOnly = false
                },
                new()
                {
                    Id = "vatPer", Title = "درصد ارزش افزوده", Type = (int)SqlDbType.Int, Size = 20, Width = 5,
                    IsDisplayNone = true, IsPrimary = true, IsReadOnly = true
                },
                new()
                {
                    Id = "orderDate", Title = "تاریخ سفارش", Type = (int)SqlDbType.NVarChar, Size = 10, Width = 10,
                    IsDisplayNone = true
                },
                new()
                {
                    Id = "exchangeRate", Title = "نرخ تسعیر", Type = (int)SqlDbType.Int, Size = 11, IsCommaSep = true,
                    Width = 7, InputType = "money", HeaderReadOnly = true
                },
                new() { Id = "vatAccountDetailId", IsPrimary = true },
                new() { Id = "vatNoSeriesId", IsPrimary = true },
                new() { Id = "vatId", IsPrimary = true },
                new() { Id = "itemTypeId", IsPrimary = true },
                new() { Id = "itemId", IsPrimary = true },
                new() { Id = "categoryId", IsPrimary = true },
                new() { Id = "attributeIds", IsPrimary = true },
                new() { Id = "unitId", IsPrimary = true },
                new() { Id = "subUnitId", IsPrimary = true },
                new() { Id = "inOut", IsPrimary = true },
                new() { Id = "isNegativeQuntity", IsPrimary = true },
                new() { Id = "currencyId", IsPrimary = true, PublicColumn = true }
            }
        };


        #region getStageStepConfig

        var config = new List<StageStepConfigGetColumn>();
        var stageStepParameters = new DynamicParameters();
        stageStepParameters.Add("StageId", stageId);
        stageStepParameters.Add("WorkflowId", workflowId);
        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_StageStepConfig_GetColumn]";
            conn.Open();
            config = (await conn.QueryAsync<StageStepConfigGetColumn>(sQuery, stageStepParameters,
                commandType: CommandType.StoredProcedure)).ToList();
        }

        list.DataColumns.ForEach(item =>
        {
            if (!config.Where(a => a.Name.ToLower() == item.Id.ToLower() || a.AliasName.ToLower() == item.Id.ToLower())
                    .Any() && item.Id != "action" && !item.IsPrimary && !item.PublicColumn)
                item.IsDtParameter = false;
        });

        #endregion

        return list;
    }

    public async Task<GetStageStepConfigColumnsViewModel> GetRequestLineAdvanceColumns(short stageId, int workflowId,
        int parentworFlowId)
    {
        var list = new GetStageStepConfigColumnsViewModel
        {
            Title = "لیست گردش",
            IsSelectable = true,
            Classes = "group-box-orange",
            ActionType = "inline",
            HeaderType = "outline",
            DataColumns = new List<DataStageStepConfigColumnsViewModel>
            {
                new()
                {
                    Id = "id", IsPrimary = true, Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 5
                },
                new()
                {
                    Id = "headerId", IsPrimary = true, Title = "شناسه هدر", Type = (int)SqlDbType.Int,
                    IsDtParameter = false, Width = 5
                },
                new()
                {
                    Id = "stageId", IsPrimary = true, Title = "شناسه", Type = (int)SqlDbType.SmallInt,
                    IsDtParameter = false, Width = 3
                },
                new()
                {
                    Id = "item", Title = "آیتم", Type = (int)SqlDbType.NVarChar, Size = 30, IsDtParameter = true,
                    IsFilterParameter = true, Width = 15
                },
                new()
                {
                    Id = "itemType", Title = "نوع آیتم", Type = (int)SqlDbType.NVarChar, Size = 30,
                    IsDtParameter = true, IsFilterParameter = true, Width = 5
                },
                new()
                {
                    Id = "categoryItemName", IsPrimary = true, Title = "دسته بندی کالا/خدمات",
                    Type = (int)SqlDbType.Int, Width = 5
                },
                new()
                {
                    Id = "inOutName", Title = "ماهیت حساب", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 5
                },
                new()
                {
                    Id = "attributeName", Title = "صفات کالا", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 5, PublicColumn = true
                },
                new()
                {
                    Id = "unitNames", Title = "واحد شمارش", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 4, PublicColumn = true
                },
                new()
                {
                    Id = "ratio", Title = "ضریب", Type = (int)SqlDbType.Decimal, IsDtParameter = true, Width = 4,
                    PublicColumn = true, IsPrimary = true
                },
                new()
                {
                    Id = "remainedAmount", Title = "مانده", Type = (int)SqlDbType.Decimal, IsDtParameter = true,
                    Width = 5, PublicColumn = true
                },

                new()
                {
                    Id = "quantity", Title = "تعداد", Type = (int)SqlDbType.Decimal, Size = 100, IsPrimary = true,
                    IsDtParameter = true, HasSumValue = true, Width = 6, IsCommaSep = true, InputType = "decimal",
                    InputMask = new InputMask { Mask = "'mask':'9{1,5}.9{1,3}'" }
                },
                new()
                {
                    Id = "totalQuantity", Title = "تعداد کل", Type = (int)SqlDbType.Decimal, Size = 30,
                    IsDtParameter = true, IsReadOnly = true, Width = 5, HasSumValue = true, IsCommaSep = true,
                    InputType = "decimal", InputMask = new InputMask { Mask = "'mask':'9{1,5}.9{1,3}'" }
                },

                new()
                {
                    Id = "currency", Title = "نوع ارز", Type = (int)SqlDbType.TinyInt, PublicColumn = true,
                    IsDtParameter = true, Width = 4, IsSelect2 = true
                },
                new()
                {
                    Id = "exchangeRate", Title = "نرخ تسعیر", Type = (int)SqlDbType.Int, Size = 11,
                    IsDtParameter = true, IsCommaSep = true, Width = 4, InputType = "decimal", IsReadOnly = true
                },
                new()
                {
                    Id = "price", Title = "نرخ", Type = (int)SqlDbType.Decimal, Size = 11, IsDtParameter = true,
                    IsCommaSep = true, HasSumValue = false, Width = 4,
                    InputType = "money", MaxLength = 15, Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-min", Value1 = "1" },
                        new() { ValidationName = "data-parsley-max", Value1 = "999999999999" }
                    }
                },
                new()
                {
                    Id = "grossAmount", Title = "مبلغ", Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true,
                    IsCommaSep = true, Width = 5, InputType = "money", HasSumValue = true, HeaderReadOnly = true
                },
                new()
                {
                    Id = "discountType", Title = "نوع تخفیف", Type = (int)SqlDbType.NVarChar, Size = 30,
                    IsDtParameter = true, Width = 4, InputType = "select",
                    Inputs = new List<MyDropDownViewModel>
                        { new() { Id = 1, Name = "درصد تخفیف" }, new() { Id = 2, Name = "مبلغ تخفیف" } },
                    IsSelect2 = true, PleaseChoose = true
                },
                new()
                {
                    Id = "discountValue", Title = "تخفیف", Type = (int)SqlDbType.Int, Size = 100, IsCommaSep = true,
                    InputType = "money", HasSumValue = true, IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "netAmount", Title = "مبلغ پس از تخفیف", Type = (int)SqlDbType.Int, Size = 100,
                    IsCommaSep = true, InputType = "money", IsDtParameter = true, Width = 6, HasSumValue = true,
                    IsReadOnly = true
                },
                new()
                {
                    Id = "vatAmount", Title = "مبلغ مالیات بر ارزش افزوده", Type = (int)SqlDbType.Int, Size = 20,
                    IsDtParameter = true, HasSumValue = true, IsCommaSep = true, InputType = "money", Width = 5,
                    IsReadOnly = true
                },
                new()
                {
                    Id = "netAmountPlusVat", Title = "مبلغ با ارزش افزوده", Type = (int)SqlDbType.Int, Size = 20,
                    IsDtParameter = true, IsCommaSep = true, Width = 6, InputType = "money", HasSumValue = true,
                    IsReadOnly = true
                },


                new()
                {
                    Id = "priceIncludingVAT", Title = "قیمت مصرف کننده", Type = (int)SqlDbType.Bit, Size = 11,
                    IsDtParameter = true, Width = 6, InputType = "checkbox", HeaderReadOnly = true
                },
                new()
                {
                    Id = "vatPer", Title = "درصد ارزش افزوده", Type = (int)SqlDbType.Int, Size = 20, Width = 5,
                    IsDisplayNone = true
                },
                new()
                {
                    Id = "orderDate", Title = "تاریخ سفارش", Type = (int)SqlDbType.NVarChar, Size = 10, Width = 10,
                    IsDisplayNone = true
                },
                new() { Id = "vatAccountDetailId", IsPrimary = true },
                new() { Id = "vatNoSeriesId", IsPrimary = true },
                new() { Id = "vatId", IsPrimary = true },
                new() { Id = "itemTypeId", IsPrimary = true },
                new() { Id = "itemId", IsPrimary = true }
            }
        };

        #region getStageStepConfig

        var config = new List<StageStepConfigGetColumn>();
        var stageStepParameters = new DynamicParameters();
        stageStepParameters.Add("StageId", stageId);
        stageStepParameters.Add("WorkflowId", workflowId);
        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_StageStepConfig_GetColumn]";
            conn.Open();
            config = (await conn.QueryAsync<StageStepConfigGetColumn>(sQuery, stageStepParameters,
                commandType: CommandType.StoredProcedure)).ToList();
        }

        list.DataColumns.ForEach(item =>
        {
            if (!config.Where(a => a.Name.ToLower() == item.Id.ToLower() || a.AliasName.ToLower() == item.Id.ToLower())
                    .Any() && item.Id != "action" && !item.IsPrimary && !item.PublicColumn)
                item.IsDtParameter = false;
        });

        #endregion

        list.DataColumns.ColumnWidthNormalization();


        return list;
    }

    public async Task<GetStageStepConfigColumnsViewModel> GetInvoiceLineSimpleColumns(int companyId, short stageId,
        int workflowId)
    {
        var list = new GetStageStepConfigColumnsViewModel
        {
            Title = "لیست گردش",
            Classes = "group-box-orange",
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "inOut", FieldValue = "2", Operator = "==" } },
            AnswerCondition = "color:#da1717",
            ElseAnswerCondition = "",
            ActionType = "inline",
            HeaderType = "outline",
            DataColumns = new List<DataStageStepConfigColumnsViewModel>
            {
                new()
                {
                    Id = "id", IsPrimary = true, Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 3
                },
                new()
                {
                    Id = "itemType", Title = "نوع آیتم", Type = (int)SqlDbType.NVarChar, Size = 30,
                    IsDtParameter = true, IsFilterParameter = true, Width = 4, FilterType = "select2",
                    FilterTypeApi = ""
                },
                new()
                {
                    Id = "item", IsPrimary = true, Title = "آیتم", Type = (int)SqlDbType.NVarChar, Size = 30,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10, FilterType = "select2",
                    FilterTypeApi = ""
                },
                new()
                {
                    Id = "categoryItemName", Title = "دسته بندی کالا", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 6, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = ""
                },
                new()
                {
                    Id = "attributeName", Title = "صفات کالا", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 6, PublicColumn = true, IsFilterParameter = true, FilterType = "select2", FilterTypeApi = ""
                },
                new()
                {
                    Id = "unitNames", Title = "واحد شمارش", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 4, PublicColumn = true, IsFilterParameter = true, FilterType = "select2", FilterTypeApi = ""
                },
                new()
                {
                    Id = "inOutName", Title = "ماهیت حساب", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 4
                },
                new()
                {
                    Id = "totalQuantity", Title = "تعداد کل", Type = (int)SqlDbType.Decimal, Size = 100,
                    PublicColumn = true, IsDtParameter = true, HasSumValue = true, Width = 4, InputType = "decimal"
                },
                new()
                {
                    Id = "price", Title = "نرخ", Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true,
                    IsCommaSep = true, HasSumValue = false, Width = 5, InputType = "money"
                },
                new()
                {
                    Id = "grossAmount", Title = "مبلغ", Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true,
                    IsCommaSep = true, Width = 6, InputType = "money", HasSumValue = true, HeaderReadOnly = true
                },
                new()
                {
                    Id = "discountTypeIdName", Title = "نوع تخفیف", Type = (int)SqlDbType.Int, Size = 100,
                    IsCommaSep = true, InputType = "money", HasSumValue = true, IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "discountAmount", Title = "تخفیف", Type = (int)SqlDbType.Int, Size = 100, IsCommaSep = true,
                    InputType = "money", HasSumValue = true, IsDtParameter = true, Width = 4, HeaderReadOnly = true
                },
                new()
                {
                    Id = "netAmount", Title = "مبلغ پس از تخفیف", Type = (int)SqlDbType.Int, Size = 100,
                    IsCommaSep = true, InputType = "money", IsDtParameter = true, Width = 4, HasSumValue = true,
                    HeaderReadOnly = true
                },
                new()
                {
                    Id = "vatAmount", Title = "مبلغ مالیات بر ارزش افزوده", Type = (int)SqlDbType.Int, Size = 20,
                    IsDtParameter = true, HasSumValue = true, IsCommaSep = true, InputType = "money", Width = 4,
                    HeaderReadOnly = true
                },
                new()
                {
                    Id = "netAmountPlusVat", Title = "مبلغ با ارزش افزوده", Type = (int)SqlDbType.Int, Size = 20,
                    IsDtParameter = true, IsCommaSep = true, Width = 4, InputType = "money", HasSumValue = true,
                    HeaderReadOnly = true
                },
                new()
                {
                    Id = "vatPer", Title = "درصد ارزش افزوده", Type = (int)SqlDbType.Int, Size = 20, Width = 5,
                    IsDisplayNone = true
                },
                new()
                {
                    Id = "orderDate", Title = "تاریخ سفارش", Type = (int)SqlDbType.NVarChar, Size = 10, Width = 5,
                    IsDisplayNone = true
                },
                new()
                {
                    Id = "exchangeRate", Title = "نرخ تسعیر", Type = (int)SqlDbType.Int, Size = 11, IsCommaSep = true,
                    InputType = "money", HeaderReadOnly = true
                },
                new()
                {
                    Id = "createUserFullName", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar,
                    PublicColumn = true, IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "createUserId", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int, PublicColumn = true
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ و زمان ثبت", Type = (int)SqlDbType.VarChar,
                    PublicColumn = true, IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "bySystem", Title = "سیستمی", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 3,
                    Align = "center", PublicColumn = true
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 6 },
                new() { Id = "headerId", IsPrimary = true },
                new() { Id = "stageId", IsPrimary = true }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "editPerson", Title = "ویرایش", ClassName = "btn green_outline_1 ml-1",
                    IconName = "fa fa-edit"
                },
                new()
                {
                    Name = "delete", Title = "حذف", ClassName = "btn maroon_outline ml-1", IconName = "fa fa-trash"
                }
            }
        };

        #region getStageStepConfig

        var config = new List<StageStepConfigGetColumn>();
        var stageStepParameters = new DynamicParameters();
        stageStepParameters.Add("StageId", stageId);
        stageStepParameters.Add("WorkflowId", workflowId);
        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_StageStepConfig_GetColumn]";
            conn.Open();
            config = (await conn.QueryAsync<StageStepConfigGetColumn>(sQuery, stageStepParameters,
                commandType: CommandType.StoredProcedure)).ToList();
        }

        list.DataColumns.ForEach(item =>
        {
            if (!config.Where(a => a.Name.ToLower() == item.Id.ToLower() || a.AliasName.ToLower() == item.Id.ToLower())
                    .Any() && item.Id != "action" && !item.IsPrimary && !item.PublicColumn)
                item.IsDtParameter = false;
        });

        #endregion

        return list;
    }


    public GetStageStepConfigColumnsViewModel GetInvoiceLineSimpleElement()
    {
        var list = new GetStageStepConfigColumnsViewModel
        {
            HasStageStepConfig = true,
            StageStepConfig = new StageStepConfigModel
            {
                HeaderFields = new List<StageStepHeaderColumn>
                {
                    new()
                    {
                        FieldId = "stageId"
                    },
                    new()
                    {
                        FieldId = "workFlowId"
                    }
                },
                LineFields = new List<StageStepLineColumn>
                    { new() { FieldId = "itemTypeId", TableName = "pu.PurchaseOrderLine" } }
            },
            DataColumns = new List<DataStageStepConfigColumnsViewModel>
            {
                new() { Id = "id", IsPrimary = false, Title = "شناسه", Type = (int)SqlDbType.Int, Width = 5 },
                new()
                {
                    Id = "headerId", IsPrimary = true, Title = "شناسه هدر", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = false, Width = 5
                },
                new()
                {
                    Id = "stageId", IsPrimary = true, Title = "شناسه", Type = (int)SqlDbType.SmallInt,
                    IsDtParameter = false, Width = 5
                },
                new()
                {
                    Id = "itemTypeId", Title = "نوع آیتم", Type = (int)SqlDbType.NVarChar, Size = 30,
                    IsDtParameter = true, Width = 2, InputType = "select", IsSelect2 = true, IsFocus = true
                },
                new()
                {
                    Id = "itemId", IsPrimary = true, Title = "آیتم", Type = (int)SqlDbType.NVarChar, Size = 30,
                    IsDtParameter = true, Width = 4, IsFilterParameter = true,
                    InputType = "select", Inputs = null, IsSelect2 = true,
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "required" }
                    }
                },
                new()
                {
                    Id = "categoryItemId", Title = "دسته بندی کالا", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 2
                },


                new()
                {
                    Id = "attributeIds", Title = "صفات کالا", Type = (int)SqlDbType.NVarChar, Size = 30,
                    IsDtParameter = true, Width = 4,
                    InputType = "select", IsSelect2 = true, IsFocus = true,
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "required" }
                    }
                },

                new()
                {
                    Id = "subUnitId", Title = "واحد شمارش", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 2, InputType = "select", IsSelect2 = true, IsFocus = true,
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "required" }
                    }
                },

                new()
                {
                    Id = "quantity", Title = "تعداد", Type = (int)SqlDbType.Decimal, Size = 100, IsPrimary = true,
                    IsDtParameter = true, HasSumValue = true, Width = 2, MaxLength = 9, InputType = "decimal",
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-min", Value1 = "1" },
                        new() { ValidationName = "data-parsley-max", Value1 = "99999.999" }
                    },
                    IsCommaSep = true, InputMask = new InputMask { Mask = "'mask':'9{1,5}.9{1,3}'" }
                },

                new()
                {
                    Id = "totalQuantity", Title = "تعداد کل", Type = (int)SqlDbType.Int, Size = 100,
                    IsDtParameter = true, Width = 2, MaxLength = 17, HeaderReadOnly = true
                },

                new()
                {
                    Id = "price", Title = "نرخ", Type = (int)SqlDbType.Decimal, Size = 11, IsDtParameter = true,
                    IsFilterParameter = true, IsCommaSep = true, Width = 2,
                    InputType = "money", MaxLength = 15,
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-min", Value1 = "1" },
                        new() { ValidationName = "data-parsley-max", Value1 = "999999999999" }
                    }
                },

                new()
                {
                    Id = "grossAmount", Title = "مبلغ", Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true,
                    IsFilterParameter = true, IsCommaSep = true, Width = 2, InputType = "money", HasSumValue = true,
                    HeaderReadOnly = true,
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "data-parsley-min", Value1 = "1" },
                        new() { ValidationName = "data-parsley-max", Value1 = "999999999999999" }
                    }
                },
                new()
                {
                    Id = "orderDatePersian", Title = "تاریخ سفارش", IsPrimary = true, Type = (int)SqlDbType.VarChar,
                    Size = 10, IsDisplayNone = true, Width = 2, InputType = "datepersian",
                    InputMask = new InputMask { Mask = "'mask':'9999/99/99'" }
                },

                new()
                {
                    Id = "discountType", Title = "نوع تخفیف", Type = (int)SqlDbType.NVarChar, Size = 30,
                    IsDtParameter = true, Width = 2, InputType = "select",
                    Inputs = new List<MyDropDownViewModel>
                        { new() { Id = 1, Name = "درصد" }, new() { Id = 2, Name = "مبلغ" } },
                    IsSelect2 = true, PleaseChoose = true
                },

                new()
                {
                    Id = "discountValue", Title = "تخفیف", Type = (int)SqlDbType.Int, Size = 100, PublicColumn = true,
                    IsCommaSep = true, InputType = "money", IsDtParameter = true, Width = 2, HeaderReadOnly = true
                },

                new()
                {
                    Id = "netAmount", Title = "مبلغ پس از تخفیف", Type = (int)SqlDbType.Int, Size = 100,
                    IsCommaSep = true, InputType = "money", IsDtParameter = true, Width = 2, HasSumValue = true,
                    HeaderReadOnly = true
                },

                new()
                {
                    Id = "vatPer", IsPrimary = true, Title = "درصد مالیات برارزش افزوده", Type = (int)SqlDbType.Int,
                    Size = 20, IsDtParameter = true, Width = 2, InputType = "number", HeaderReadOnly = true
                },

                new()
                {
                    Id = "vatAmount", Title = "مبلغ مالیات بر ارزش افزوده", Type = (int)SqlDbType.Int, Size = 20,
                    IsDtParameter = true, IsCommaSep = true, InputType = "money",
                    IsFilterParameter = true, Width = 2, HeaderReadOnly = true
                },

                new()
                {
                    Id = "netAmountPlusVAT", Title = "مبلغ با ارزش افزوده", Type = (int)SqlDbType.Int, Size = 20,
                    IsDtParameter = true, IsFilterParameter = true,
                    IsCommaSep = true, Width = 2, InputType = "money", HasSumValue = true, HeaderReadOnly = true
                },

                new()
                {
                    Id = "accountDetailId", Title = "تفضیل", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 2, InputType = "select", IsSelect2 = true, IsFocus = true,
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-selectvalzero" }
                    }
                },
                new()
                {
                    Id = "priceIncludingVAT", Title = "قیمت مصرف کننده", Type = (int)SqlDbType.Bit, Size = 11,
                    IsDtParameter = true, IsFilterParameter = true, Width = 2, InputType = "checkbox"
                },

                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "headerLineInsUp", Title = "افزودن", ClassName = "btn btn-light border-blue",
                    IconName = "fa fa-arrow-down"
                }
            }
        };

        return list;
    }

    public async Task<GetStageStepConfigColumnsViewModel> GetInvoiceLineAdvanceColumns(int companyId, short stageId,
        int workflowId)
    {
        var list = new GetStageStepConfigColumnsViewModel
        {
            Title = "لیست گردش",
            Classes = "group-box-orange",
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "inOut", FieldValue = "2", Operator = "==" } },
            AnswerCondition = "color:#da1717",
            ElseAnswerCondition = "",
            ActionType = "inline",
            HeaderType = "outline",
            DataColumns = new List<DataStageStepConfigColumnsViewModel>
            {
                new()
                {
                    Id = "id", IsPrimary = true, Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 4
                },
                new() { Id = "headerId", IsPrimary = true, Title = "شناسه هدر", Type = (int)SqlDbType.Int },
                new() { Id = "stageId", IsPrimary = true, Title = "شناسه", Type = (int)SqlDbType.SmallInt },
                new()
                {
                    Id = "itemType", Title = "نوع آیتم", Type = (int)SqlDbType.NVarChar, Size = 30,
                    IsDtParameter = true, IsFilterParameter = true, Width = 4, FilterType = "select2",
                    FilterTypeApi = ""
                },

                new()
                {
                    Id = "item", Title = "آیتم", Type = (int)SqlDbType.NVarChar, Size = 30, IsDtParameter = true,
                    IsFilterParameter = true, Width = 12
                },
                new()
                {
                    Id = "categoryItemName", Title = "دسته بندی کالا", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "attributeName", Title = "صفات کالا", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 5, PublicColumn = true
                },
                new()
                {
                    Id = "unitNames", Title = "واحد شمارش", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 4, PublicColumn = true
                },
                new()
                {
                    Id = "inOutName", Title = "ماهیت حساب", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 4
                },
                new()
                {
                    Id = "ratio", Title = "ضریب", Type = (int)SqlDbType.Decimal, IsDtParameter = true, Width = 3,
                    PublicColumn = true, IsPrimary = true
                },


                new()
                {
                    Id = "quantity", Title = "تعداد ", Type = (int)SqlDbType.Decimal, Size = 100, PublicColumn = true,
                    IsDtParameter = true, HasSumValue = true, Width = 4, InputType = "decimal"
                },
                new()
                {
                    Id = "totalQuantity", Title = "تعداد کل", Type = (int)SqlDbType.Decimal, Size = 100,
                    PublicColumn = true, IsDtParameter = true, HasSumValue = true, Width = 4, InputType = "decimal"
                },

                new()
                {
                    Id = "currency", Title = "نوع ارز", Type = (int)SqlDbType.TinyInt, PublicColumn = true,
                    IsDtParameter = true, Width = 3, IsSelect2 = true
                },
                new()
                {
                    Id = "exchangeRate", Title = "نرخ تسعیر", Type = (int)SqlDbType.Int, Size = 11,
                    IsDtParameter = true, IsCommaSep = true, Width = 3, InputType = "money", HeaderReadOnly = true
                },
                new()
                {
                    Id = "price", Title = "نرخ", Type = (int)SqlDbType.Decimal, Size = 11, IsDtParameter = true,
                    IsCommaSep = true, HasSumValue = false, Width = 3,
                    InputType = "money",
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-min", Value1 = "1" },
                        new() { ValidationName = "data-parsley-max", Value1 = "999999999999" }
                    }
                },
                new()
                {
                    Id = "grossAmount", Title = "مبلغ", Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true,
                    IsCommaSep = true, Width = 3, InputType = "money", HasSumValue = true, HeaderReadOnly = true
                },
                new()
                {
                    Id = "discountTypeIdName", Title = "نوع تخفیف", Type = (int)SqlDbType.Int, Size = 100,
                    IsCommaSep = true, InputType = "money", HasSumValue = true, IsDtParameter = true, Width = 3
                },
                new()
                {
                    Id = "discountValue", Title = "تخفیف", Type = (int)SqlDbType.Int, Size = 100, IsCommaSep = true,
                    InputType = "money", HasSumValue = true, IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "netAmount", Title = "مبلغ پس از تخفیف", Type = (int)SqlDbType.Decimal, Size = 100,
                    IsCommaSep = true, InputType = "money", IsDtParameter = true, Width = 4, HasSumValue = true,
                    HeaderReadOnly = true
                },
                new()
                {
                    Id = "vatAmount", Title = "مبلغ مالیات بر ارزش افزوده", Type = (int)SqlDbType.Int, Size = 20,
                    IsDtParameter = true, HasSumValue = true, IsCommaSep = true, InputType = "money", Width = 4,
                    HeaderReadOnly = true
                },
                new()
                {
                    Id = "netAmountPlusVat", Title = "مبلغ با ارزش افزوده", Type = (int)SqlDbType.Int, Size = 20,
                    IsDtParameter = true, IsCommaSep = true, Width = 4, InputType = "money", HasSumValue = true,
                    HeaderReadOnly = true
                },
                new()
                {
                    Id = "priceIncludingVAT", Title = "قیمت مصرف کننده", Type = (int)SqlDbType.Bit, Size = 11,
                    IsDtParameter = true, Width = 4, InputType = "checkbox", HeaderReadOnly = true
                },
                new()
                {
                    Id = "vatPer", Title = "درصد ارزش افزوده", Type = (int)SqlDbType.Int, Size = 20,
                    IsDisplayNone = true
                },
                new()
                {
                    Id = "orderDate", Title = "تاریخ سفارش", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDisplayNone = true
                },
                new()
                {
                    Id = "createUserFullName", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar,
                    PublicColumn = true, IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "createUserId", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int, PublicColumn = true
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ و زمان ثبت", Type = (int)SqlDbType.VarChar,
                    PublicColumn = true, IsDtParameter = true, Width = 4
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 7 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "editPerson", Title = "ویرایش", ClassName = "btn green_outline_1 ml-1",
                    IconName = "fa fa-edit"
                },
                new()
                {
                    Name = "delete", Title = "حذف", ClassName = "btn maroon_outline ml-1", IconName = "fa fa-trash"
                }
            }
        };

        #region getStageStepConfig

        var config = new List<StageStepConfigGetColumn>();
        var stageStepParameters = new DynamicParameters();
        stageStepParameters.Add("StageId", stageId);
        stageStepParameters.Add("WorkflowId", workflowId);
        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_StageStepConfig_GetColumn]";
            conn.Open();
            config = (await conn.QueryAsync<StageStepConfigGetColumn>(sQuery, stageStepParameters,
                commandType: CommandType.StoredProcedure)).ToList();
        }

        list.DataColumns.ForEach(item =>
        {
            if (!config.Where(a => a.Name.ToLower() == item.Id.ToLower() || a.AliasName.ToLower() == item.Id.ToLower())
                    .Any() && item.Id != "action" && !item.IsPrimary && !item.PublicColumn)
                item.IsDtParameter = false;
        });

        list.DataColumns.ColumnWidthNormalization();

        #endregion

        return list;
    }

    public GetStageStepConfigColumnsViewModel GetInvoiceLineAdvanceElement()
    {
        var list = new GetStageStepConfigColumnsViewModel
        {
            HasStageStepConfig = true,
            StageStepConfig = new StageStepConfigModel
            {
                HeaderFields = new List<StageStepHeaderColumn>
                {
                    new()
                    {
                        FieldId = "stageId"
                    },
                    new()
                    {
                        FieldId = "workFlowId"
                    }
                },
                LineFields = new List<StageStepLineColumn>
                    { new() { FieldId = "itemTypeId", TableName = "pu.PurchaseOrderLine" } }
            },
            DataColumns = new List<DataStageStepConfigColumnsViewModel>
            {
                new() { Id = "id", IsPrimary = true, Title = "شناسه", Type = (int)SqlDbType.Int, Width = 5 },
                new()
                {
                    Id = "headerId", IsPrimary = true, Title = "شناسه هدر", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = false, Width = 5
                },
                new()
                {
                    Id = "stageId", IsPrimary = true, Title = "شناسه", Type = (int)SqlDbType.SmallInt,
                    IsDtParameter = false, Width = 5
                },
                new()
                {
                    Id = "itemTypeId", Title = "نوع آیتم", Type = (int)SqlDbType.NVarChar, Size = 30,
                    IsDtParameter = true, Width = 2, InputType = "select", IsSelect2 = true, IsFocus = true
                },
                new()
                {
                    Id = "itemId", IsPrimary = true, Title = "آیتم", Type = (int)SqlDbType.NVarChar, Size = 30,
                    IsDtParameter = true, Width = 4, IsFilterParameter = true,
                    InputType = "select", Inputs = null, IsSelect2 = true,
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "required" }
                    }
                },
                new()
                {
                    Id = "categoryItemId", Title = "دسته بندی کالا", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, IsNotFocusSelect = true, Width = 2,
                    InputType = "select", Inputs = null, IsSelect2 = true
                },
                new()
                {
                    Id = "attributeIds", Title = "صفات کالا", Type = (int)SqlDbType.NVarChar, Size = 30,
                    IsDtParameter = true, Width = 4,
                    InputType = "select", IsSelect2 = true, IsFocus = true,
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "required" }
                    }
                },

                new()
                {
                    Id = "subUnitId", Title = "واحد شمارش", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 2, InputType = "select", IsSelect2 = true, IsFocus = true,
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "required" }
                    }
                },
                new()
                {
                    Id = "quantity", Title = "تعداد", Type = (int)SqlDbType.Decimal, Size = 100, IsPrimary = true,
                    IsDtParameter = true, HasSumValue = true, Width = 2, MaxLength = 9, InputType = "decimal",
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-min", Value1 = "1" },
                        new() { ValidationName = "data-parsley-max", Value1 = "99999.999" }
                    },
                    IsCommaSep = true, InputMask = new InputMask { Mask = "'mask':'9{1,5}.9{1,3}'" }
                },

                new()
                {
                    Id = "totalQuantity", Title = "تعداد کل", Type = (int)SqlDbType.Decimal, Size = 100,
                    IsDtParameter = true, Width = 2, MaxLength = 17, HeaderReadOnly = true
                },


                new()
                {
                    Id = "currencyId", Title = "نوع ارز", IsDtParameter = true, Width = 2, InputType = "select",
                    IsSelect2 = true,
                    Validations = new List<FormPlate1.Validation> { new() { ValidationName = "required" } },
                    PleaseChoose = true,
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = "/api/GN/CurrencyApi/getdropdown"
                    }
                },
                new()
                {
                    Id = "exchangeRate", Title = "نرخ تسعیر", Type = (int)SqlDbType.Int, Size = 11,
                    IsFilterParameter = true, IsCommaSep = true, Width = 2, InputType = "money", IsDtParameter = true
                },
                new()
                {
                    Id = "price", Title = "نرخ", Type = (int)SqlDbType.Decimal, Size = 11, IsDtParameter = true,
                    IsFilterParameter = true, IsCommaSep = true, Width = 2,
                    InputType = "money",
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-min", Value1 = "1" },
                        new() { ValidationName = "data-parsley-max", Value1 = "999999999999" }
                    },
                    MaxLength = 15
                },

                new()
                {
                    Id = "grossAmount", Title = "مبلغ", Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true,
                    IsFilterParameter = true, IsCommaSep = true, Width = 2, InputType = "money", HasSumValue = true,
                    HeaderReadOnly = true,
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "data-parsley-min", Value1 = "1" },
                        new() { ValidationName = "data-parsley-max", Value1 = "99999999999999" }
                    }
                },
                new()
                {
                    Id = "orderDatePersian", Title = "تاریخ سفارش", IsPrimary = true, Type = (int)SqlDbType.VarChar,
                    Size = 10, IsDisplayNone = true, Width = 2, InputType = "datepersian",
                    InputMask = new InputMask { Mask = "'mask':'9999/99/99'" }
                },
                new()
                {
                    Id = "discountType", Title = "نوع تخفیف", Type = (int)SqlDbType.NVarChar, Size = 30,
                    IsDtParameter = true, Width = 2, InputType = "select",
                    Inputs = new List<MyDropDownViewModel>
                        { new() { Id = 1, Name = "درصد تخفیف" }, new() { Id = 2, Name = "مبلغ تخفیف" } },
                    IsSelect2 = true, PleaseChoose = true
                },


                new()
                {
                    Id = "discountValue", Title = "تخفیف", Type = (int)SqlDbType.Int, Size = 100, PublicColumn = true,
                    IsCommaSep = true, InputType = "money", IsDtParameter = true, Width = 2
                },
                new()
                {
                    Id = "netAmount", Title = "مبلغ پس از تخفیف", Type = (int)SqlDbType.Int, Size = 100,
                    IsCommaSep = true, InputType = "money", IsDtParameter = true, Width = 2, HasSumValue = true,
                    HeaderReadOnly = true
                },
                new()
                {
                    Id = "vatPer", IsPrimary = true, Title = "درصد مالیات برارزش افزوده", Type = (int)SqlDbType.Int,
                    Size = 20, IsDtParameter = true, Width = 2, InputType = "number", HeaderReadOnly = true
                },
                new()
                {
                    Id = "vatAmount", Title = "مبلغ مالیات بر ارزش افزوده", Type = (int)SqlDbType.Int, Size = 20,
                    IsDtParameter = true, IsCommaSep = true, InputType = "money", IsFilterParameter = true, Width = 2,
                    HeaderReadOnly = true
                },
                new()
                {
                    Id = "netAmountPlusVAT", Title = "مبلغ با ارزش افزوده", Type = (int)SqlDbType.Int, Size = 20,
                    IsDtParameter = true, IsFilterParameter = true, IsCommaSep = true, Width = 2, InputType = "money",
                    HasSumValue = true, HeaderReadOnly = true
                },
                new()
                {
                    Id = "priceIncludingVAT", Title = "قیمت مصرف کننده", Type = (int)SqlDbType.Bit, Size = 11,
                    IsDtParameter = true, IsFilterParameter = true, Width = 2, InputType = "checkbox",
                    HeaderReadOnly = true
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "headerLineInsUp", Title = "افزودن", ClassName = "btn btn-light border-blue",
                    IconName = "fa fa-arrow-down"
                }
            }
        };

        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model)
    {
        //model.PageNo = 0;
        //model.PageRowsCount = 0;

        var result = new CSVViewModel<IEnumerable>();
        var columns = new GetStageStepConfigColumnsViewModel();
        var isDefaultCurrency = model.Form_KeyValue[1]?.ToString() != "NaN"
            ? Convert.ToBoolean(Convert.ToInt32(model.Form_KeyValue[1]?.ToString()))
            : true;
        var getPage = await GetInvoiceLinePage(model);

        if (!isDefaultCurrency)
        {
            columns = await GetInvoiceLineAdvanceColumns(model.CompanyId,
                Convert.ToInt16(model.Form_KeyValue[4]?.ToString()),
                Convert.ToInt32(model.Form_KeyValue[5]?.ToString()));
            result.Rows = from p in getPage.Data
                select new
                {
                    p.Id,
                    p.ItemType,
                    p.Item,
                    p.CategoryItemName,
                    p.AttributeName,
                    p.UnitName,
                    p.Ratio,
                    p.Quantity,
                    p.TotalQuantity,
                    p.CurrencyName,
                    p.ExchangeRate,
                    p.Price,
                    p.GrossAmount,
                    p.DiscountAmount,
                    p.NetAmount,
                    p.VatAmount,
                    p.NetAmountPlusVat,
                    PriceIncludingVAT = p.PriceIncludingVAT ? "بلی" : "خیر",
                    p.CreateUserFullName,
                    p.CreateDateTimePersian,
                    BySystem = p.BySystem ? "بلی" : "خیر"
                };
        }
        else
        {
            columns = await GetInvoiceLineSimpleColumns(model.CompanyId,
                Convert.ToInt16(model.Form_KeyValue[4]?.ToString()),
                Convert.ToInt32(model.Form_KeyValue[5]?.ToString()));
            result.Rows = from p in getPage.Data
                select new
                {
                    p.Id,
                    p.ItemType,
                    p.Item,
                    p.CategoryItemName,
                    p.AttributeName,
                    p.UnitName,
                    p.InOutName,
                    p.TotalQuantity,
                    p.Price,
                    p.GrossAmount,
                    p.DiscountAmount,
                    p.NetAmount,
                    p.VatAmount,
                    p.NetAmountPlusVat,
                    p.CreateUserFullName,
                    p.CreateDateTimePersian
                };
        }

        var csvColumns = string.Join(",",
            columns.DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title));

        result.Columns = csvColumns;
        return result;
    }

    public async Task<MyResultPage<PurchaseInvoiceLineGetPage>> Display(GetPageViewModel model, int userId, byte roleId)
    {
        var result = new MyResultPage<PurchaseInvoiceLineGetPage>
        {
            Data = new PurchaseInvoiceLineGetPage()
        };

        var directPaging = model.Form_KeyValue.Length >= 3 ? Convert.ToInt32((model.Form_KeyValue[2]).ToString()) : 0;
        var paginationParameters = new DynamicParameters();
        var purchaseOrderIdFromPagination = 0;

        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "PurchaseInvoiceApi",
            OprType = "VIWALL",
            UserId = userId
        };


        // check access VIWALL
        var checkAccessViewAll = await _loginRepository.GetAuthenticate(checkAuthenticate);

        if (directPaging > 0)
        {
            paginationParameters.Add("TableName", "[pu].[PurchaseOrder]");
            paginationParameters.Add("IdColumnName", "[pu].[PurchaseOrder].Id");
            paginationParameters.Add("IdColumnValue", Convert.ToInt32(model.Form_KeyValue[0]?.ToString()));
            paginationParameters.Add("RoleId", roleId);
            var filter = string.Empty;

            if (checkAccessViewAll.Successfull)
                filter =
                    " AND [pu].[PurchaseOrder].StageId IN(SELECT Id FROM wf.Stage WHERE StageClassId IN(2,7) AND WorkflowCategoryId=1)";
            else
                filter =
                    $" AND [pu].[PurchaseOrder].StageId IN(SELECT Id FROM wf.Stage WHERE StageClassId IN(2,7) AND WorkflowCategoryId=1) AND [pu].[PurchaseOrder].CreateUserId={userId} ";

            paginationParameters.Add("FilterParam", filter);
            paginationParameters.Add("Direction", directPaging);

            using (var conn = Connection)
            {
                var sQuery = "[pb].[Spc_Tables_NextPrev]";
                conn.Open();
                purchaseOrderIdFromPagination = await conn.ExecuteScalarAsync<int>(sQuery, paginationParameters,
                    commandType: CommandType.StoredProcedure);
                conn.Close();
            }
        }

        var purchaseOrderId = purchaseOrderIdFromPagination == 0
            ? Convert.ToInt32(model.Form_KeyValue[0]?.ToString())
            : purchaseOrderIdFromPagination;

        var parameters = new DynamicParameters();

        parameters.Add("Id", purchaseOrderId);


        var isDefaultCurrency = model.Form_KeyValue[1]?.ToString() != "NaN"
            ? Convert.ToBoolean(Convert.ToInt32(model.Form_KeyValue[1]?.ToString()))
            : true;


        parameters.Add("AmountOrQuantity", 0);

        using (var conn = Connection)
        {
            var sQuery = "pu.Spc_PurchaseInvoice_Display";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<PurchaseInvoiceLineGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).FirstOrDefault();
        }

        if (result.Data != null)
        {
            result.Data.IsPreviousStage =
                await _stageFundItemTypeRepository.GetHasStagePrevious(result.Data.StageId, result.Data.WorkflowId);


            var getPurchaseOrderAction = new GetAction();
            getPurchaseOrderAction.CompanyId = model.CompanyId;
            getPurchaseOrderAction.StageId = result.Data.StageId;
            getPurchaseOrderAction.ActionId = result.Data.ActionId;
            getPurchaseOrderAction.WorkflowId = result.Data.WorkflowId;

            var stageAction = await _stageActionRepository.GetAction(getPurchaseOrderAction);
            if (stageAction != null)
            {
                result.Data.IsDataEntry = Convert.ToInt32(stageAction.IsDataEntry);
                result.Data.IsRequest = stageAction.IsRequest;
                result.Data.IsTreasurySubject = stageAction.IsTreasurySubject;
                result.Data.IsEqualToParentRequest = result.Data.ParentWorkflowCategoryId == 1 ? true : false;
                result.Data.IsQuantityPurchase = stageAction.IsQuantityPurchase;
            }

            result.Data.JsonOrderLineList = new MyResultStageStepConfigPage<List<PurchaseInvoiceLines>>();
            if (!string.IsNullOrEmpty(result.Data.JsonOrderLine))
            {
                result.Data.JsonOrderLineList.Data =
                    JsonConvert.DeserializeObject<List<PurchaseInvoiceLines>>(result.Data.JsonOrderLine);
                result.Data.JsonOrderLineList.CurrentPage = model.PageNo;
                result.Data.JsonOrderLineList.TotalRecordCount = result.Data.JsonOrderLineList.Data.Count();
                if (result.Data.JsonOrderLineList.TotalRecordCount % 15 == 0)
                    result.Data.JsonOrderLineList.MaxPageCount =
                        Convert.ToInt32(result.Data.JsonOrderLineList.TotalRecordCount / 15);
                else
                    result.Data.JsonOrderLineList.MaxPageCount =
                        Convert.ToInt32(result.Data.JsonOrderLineList.TotalRecordCount / 15) + 1;
                result.Data.JsonOrderLineList.PageStartRow = (model.PageNo - 1) * model.PageRowsCount + 1;
                result.Data.JsonOrderLineList.PageEndRow = result.Data.JsonOrderLineList.PageStartRow +
                    result.Data.JsonOrderLineList.Data.Count - 1;
            }

            var companyModel = await _companyRepository.GetCompanyInfo();
            if (companyModel.DefaultCurrencyId != result.Data.CurrencyId &&
                !string.IsNullOrEmpty(result.Data.JsonOrderLine))
            {
                var exchangeRate = result.Data.JsonOrderLineList.Columns.DataColumns.Where(a => a.Id == "exchangeRate")
                    .FirstOrDefault();
                exchangeRate.IsDtParameter = true;
            }

            result.Data.JsonOrderLineList.Columns = new GetStageStepConfigColumnsViewModel();
            result.Data.JsonOrderLineList.Columns.HeaderType = "outline";
            result.Data.JsonOrderLineList.Columns.Title = "لیست گردش";

            if (isDefaultCurrency)
                result.Data.JsonOrderLineList.HeaderColumns = GetInvoiceLineSimpleElement();
            else
                result.Data.JsonOrderLineList.HeaderColumns = GetInvoiceLineAdvanceElement();
            var stageId = result.Data.StageId;
            result.Columns = GetHeaderColumns(model.CompanyId, stageId);
        }
        else
        {
            result.Columns = GetHeaderColumns(model.CompanyId, 0);
        }

        return result;
    }

    #endregion
}