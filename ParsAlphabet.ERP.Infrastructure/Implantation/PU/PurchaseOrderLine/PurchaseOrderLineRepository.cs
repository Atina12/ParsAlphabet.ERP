using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseOrderLine;
using ParsAlphabet.ERP.Application.Dtos.WF.StageStepConfig;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces.FM.PostingGroup;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Application.Interfaces.PU.PurchaseOrderLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYear;
using ParsAlphabet.ERP.Infrastructure.Implantation.PU.PurchaseOrder;
using ParsAlphabet.ERP.Infrastructure.Implantation.PU.VendorItems;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageFundItemType;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.PU.PurchaseOrderLine;

public class PurchaseOrderLineRepository : PurchaseOrderLineBase.PurchaseOrderLineBase, IPurchaseOrderLineRepository
{
    private readonly ICompanyRepository _CompanyRepository;
    private readonly FiscalYearRepository _fiscalYearRepository;
    private readonly ILoginRepository _loginRepository;
    private readonly PurchaseOrderRepository _purchaseOrderRepository;
    private readonly StageActionRepository _stageActionRepository;
    private readonly StageFundItemTypeRepository _stageFundItemTypeRepository;

    public PurchaseOrderLineRepository(
        IConfiguration config,
        IHttpContextAccessor accessor,
        ICompanyRepository CompanyRepository,
        VendorItemsRepository vendorItemsRepository,
        FiscalYearRepository fiscalYearRepository,
        StageActionRepository stageActionRepository,
        PurchaseOrderRepository purchaseOrderRepository,
        IPostingGroupRepository postingGroupRepository,
        StageFundItemTypeRepository stageFundItemTypeRepository,
        ILoginRepository loginRepository
    ) :
        base(config, stageActionRepository, vendorItemsRepository, postingGroupRepository, fiscalYearRepository)
    {
        _CompanyRepository = CompanyRepository;
        _stageActionRepository = stageActionRepository;
        _purchaseOrderRepository = purchaseOrderRepository;
        _fiscalYearRepository = fiscalYearRepository;
        _stageFundItemTypeRepository = stageFundItemTypeRepository;
        _loginRepository = loginRepository;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model)
    {
        var result = new CSVViewModel<IEnumerable>();
        var columns = new GetStageStepConfigColumnsViewModel();
        var isDefaultCurrency = model.Form_KeyValue[1]?.ToString() != "NaN"
            ? Convert.ToBoolean(Convert.ToInt32(model.Form_KeyValue[1]?.ToString()))
            : true;
        var stageId = Convert.ToInt16(model.Form_KeyValue[4]?.ToString());
        var workflowId = Convert.ToInt32(model.Form_KeyValue[5]?.ToString());
        var getPage = await GetPurchaseOrderLinePage(model);
        if (!isDefaultCurrency)
        {
            columns = await GetPurchaseOrderLineAdvanceColumns(model.CompanyId, stageId, workflowId);

            if (getPage.Data.Count > 0 && getPage.Data[0].Price == 1)
                result.Rows = from p in getPage.Data
                    select new
                    {
                        p.Id,
                        p.ItemType,
                        p.Item,
                        p.CategoryItemName,
                        p.AttributeName,
                        p.UnitNames,
                        InOutName = p.InOut > 0 ? p.InOutName : "_",
                        p.Ratio,
                        p.Quantity,
                        p.TotalQuantity,
                        p.CurrencyName,
                        p.CreateUserFullName,
                        p.CreateDateTimePersian,
                        BySystem = p.BySystem ? "بلی" : "خیر"
                    };
            else
                result.Rows = from p in getPage.Data
                    select new
                    {
                        p.Id,
                        p.ItemType,
                        p.Item,
                        p.CategoryItemName,
                        p.AttributeName,
                        p.UnitNames,
                        InOutName = p.InOut > 0 ? p.InOutName : "_",
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
            columns = await GetPurchaseOrderLineSimpleColumns(model.CompanyId, stageId, workflowId);

            if (getPage.Data.Count > 0 && getPage.Data[0].Price == 1)
                result.Rows = from p in getPage.Data
                    select new
                    {
                        p.Id,
                        p.ItemType,
                        p.Item,
                        p.CategoryItemName,
                        p.AttributeName,
                        p.UnitNames,
                        InOutName = p.InOut > 0 ? p.InOutName : "_",
                        p.TotalQuantity,
                        p.CreateUserFullName,
                        p.CreateDateTimePersian,
                        BySystem = p.BySystem ? "بلی" : "خیر"
                    };
            else
                result.Rows = from p in getPage.Data
                    select new
                    {
                        p.Id,
                        p.ItemType,
                        p.Item,
                        p.CategoryItemName,
                        p.AttributeName,
                        p.UnitNames,
                        InOutName = p.InOut > 0 ? p.InOutName : "_",
                        p.TotalQuantity,
                        p.Price,
                        p.GrossAmount,
                        p.DiscountAmount,
                        p.NetAmount,
                        p.VatAmount,
                        p.NetAmountPlusVat,
                        p.CreateUserFullName,
                        p.CreateDateTimePersian,
                        BySystem = p.BySystem ? "بلی" : "خیر"
                    };
        }

        var csvColumns = string.Join(",",
            columns.DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title));

        result.Columns = csvColumns;
        return result;
    }

    public GetColumnsViewModel GetHeaderColumns(int CompanyId)
    {
        var list = new GetColumnsViewModel
        {
            Title = "مشخصات سفارش خرید",
            Classes = "group-box-green",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, Size = 50, IsPrimary = true,
                    IsDtParameter = true, IsFilterParameter = false, Width = 8, Editable = false
                },
                new()
                {
                    Id = "orderDatePersian", Title = "تاریخ برگه", IsPrimary = true, Type = (int)SqlDbType.VarChar,
                    Size = 20, InputOrder = 4, IsDtParameter = true, IsFilterParameter = true,
                    Width = 8, Editable = true, InputType = "datepicker",
                    Validations = new List<FormPlate1.Validation>
                        { new() { ValidationName = "data-parsley-shamsidate" } },
                    InputMask = new InputMask { Mask = "'mask':'9999/99/99'" }
                },

                new()
                {
                    Id = "orderNo", Title = "شماره برگه", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 8
                },
                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    Width = 15
                },
                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 15
                },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "inOutName", Title = "ماهیت حساب", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 15
                },
                new()
                {
                    Id = "accountDetail", Title = "تفصیل", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 15
                },

                new()
                {
                    Id = "actionIdName", Title = "گام مرحله", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 15
                },
                new() { Id = "isDataEntry", IsPrimary = true },
                new() { Id = "accountDetailVatInclude", IsPrimary = true },
                new() { Id = "accountDetailVatEnable", IsPrimary = true },
                new()
                {
                    Id = "branchId", Title = "شعبه", Type = (int)SqlDbType.Int, Size = 100, IsPrimary = true, Width = 5,
                    InputType = "select", Inputs = new List<MyDropDownViewModel>(), IsSelect2 = true
                },
                new() { Id = "actionId", IsPrimary = true },
                new() { Id = "stageId", Title = "مرحله", IsPrimary = true },
                new() { Id = "workflowId", Title = "جریان کار", IsPrimary = true },
                new() { Id = "inOut", Title = "lhidj", IsPrimary = true },
                new() { Id = "personGroupTypeId", IsPrimary = true },
                new() { Id = "accountGLId", IsPrimary = true },
                new() { Id = "accountSGLId", IsPrimary = true },
                new() { Id = "treasurySubjectId", IsPrimary = true },
                new() { Id = "isQuantityPurchase", IsPrimary = true },
                new() { Id = "orderDate", IsPrimary = true },

                //Editable Columns
                new()
                {
                    Id = "treasurySubjectId", Title = "موضوع", IsPrimary = true, Type = (int)SqlDbType.Int, Size = 100,
                    InputOrder = 1, IsFilterParameter = true, Width = 12, Editable = true, IsFocus = true,
                    InputType = "select", FillType = "front", Inputs = new List<MyDropDownViewModel>(), IsSelect2 = true
                },
                new()
                {
                    Id = "noSeriesId", Title = " گروه تفضیل", IsPrimary = true, Type = (int)SqlDbType.Int, Size = 100,
                    InputOrder = 2, IsFilterParameter = true, Width = 6, Editable = true, IsFocus = true,
                    InputType = "select", FillType = "front", Inputs = new List<MyDropDownViewModel>(), IsSelect2 = true
                },
                new()
                {
                    Id = "accountDetailId", Title = "تفصیل", IsPrimary = true, Type = (int)SqlDbType.Int, Size = 100,
                    InputOrder = 3, IsFilterParameter = true, Width = 6, Editable = true, IsFocus = true,
                    InputType = "select", FillType = "front", Inputs = new List<MyDropDownViewModel>(), IsSelect2 = true
                },
                new()
                {
                    Id = "note", Title = "توضیحات", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    InputOrder = 6, IsNotFocusSelect = true, Width = 20, Editable = true
                }
            }
        };

        return list;
    }

    public async Task<MyResultPage<PurchaseOrderLineGetPage>> Display(GetPageViewModel model, int userId, byte roleId)
    {
        var result = new MyResultPage<PurchaseOrderLineGetPage>
        {
            Data = new PurchaseOrderLineGetPage()
        };

        var directPaging = model.Form_KeyValue.Length >= 3 ? Convert.ToInt32(model.Form_KeyValue[2]?.ToString()) : 0;
        var paginationParameters = new DynamicParameters();
        var purchaseOrderIdFromPagination = 0;

        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "PurchaseOrderApi",
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
                    " AND [pu].[PurchaseOrder].StageId IN(SELECT Id FROM wf.Stage WHERE StageClassId=1 AND WorkflowCategoryId=1) ";
            else
                filter =
                    $" AND [pu].[PurchaseOrder].StageId IN(SELECT Id FROM wf.Stage WHERE StageClassId=1 AND WorkflowCategoryId=1) AND [pu].[PurchaseOrder].CreateUserId={userId} ";

            paginationParameters.Add("FilterParam", filter);

            paginationParameters.Add("Direction", directPaging);

            using (var conn = Connection)
            {
                var sQuery = "[pb].[Spc_Tables_NextPrev]";
                conn.Open();
                purchaseOrderIdFromPagination = await conn.ExecuteScalarAsync<int>(sQuery, paginationParameters,
                    commandType: CommandType.StoredProcedure);
            }
        }


        var parameters = new DynamicParameters();
        var isDefaultCurrency = model.Form_KeyValue[1]?.ToString() != "NaN"
            ? Convert.ToBoolean(Convert.ToInt32(model.Form_KeyValue[1]?.ToString()))
            : true;

        var purchaseOrderId = purchaseOrderIdFromPagination == 0
            ? Convert.ToInt32(model.Form_KeyValue[0]?.ToString())
            : purchaseOrderIdFromPagination;


        parameters.Add("Id", purchaseOrderId);


        result.Columns = GetHeaderColumns(model.CompanyId);

        using (var conn = Connection)
        {
            var sQuery = "[pu].[Spc_PurchaseOrder_Display]";
            conn.Open();

            result.Data =
                (await conn.QueryAsync<PurchaseOrderLineGetPage>(sQuery, parameters,
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
                result.Data.IsQuantityPurchase = stageAction.IsQuantityPurchase;
            }

            result.Data.JsonOrderLineList = new MyResultStageStepConfigPage<List<PurchaseOrderLines>>();
            if (!string.IsNullOrEmpty(result.Data.JsonOrderLine))
            {
                result.Data.JsonOrderLineList.Data =
                    JsonConvert.DeserializeObject<List<PurchaseOrderLines>>(result.Data.JsonOrderLine);
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

            var companyModel = await _CompanyRepository.GetCompanyInfo();
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
                result.Data.JsonOrderLineList.HeaderColumns = GetPurchaseOrderLineSimpleElement();
            else
                result.Data.JsonOrderLineList.HeaderColumns = GetPurchaseOrderLineAdvanceElement();
        }
        else
        {
            result.Data = new PurchaseOrderLineGetPage();
            result.Data.JsonOrderLineList = new MyResultStageStepConfigPage<List<PurchaseOrderLines>>();
            result.Data.JsonOrderLineList.Columns = new GetStageStepConfigColumnsViewModel();
            result.Data.JsonOrderLineList.Columns.HeaderType = "outline";
            result.Data.JsonOrderLineList.Columns.Title = "لیست گردش";
        }

        return result;
    }

    public async Task<MyResultPage<PurchaseOrderLineGetPage>> GetHeader(GetPageViewModel model)
    {
        var result = new MyResultPage<PurchaseOrderLineGetPage>
        {
            Data = new PurchaseOrderLineGetPage()
        };

        var parameters = new DynamicParameters();
        parameters.Add("Id", model.Form_KeyValue[0]?.ToString());
        result.Columns = GetHeaderColumns(model.CompanyId);

        using (var conn = Connection)
        {
            var sQuery = "[pu].[Spc_PurchaseOrder_Display]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<PurchaseOrderLineGetPage>(sQuery, parameters,
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
                result.Data.IsQuantityPurchase = stageAction.IsQuantityPurchase;
            }
        }

        return result;
    }

    public async Task<MyResultStageStepConfigPage<List<PurchaseOrderLines>>> GetPurchaseOrderLinePage(
        NewGetPageViewModel model)
    {
        var result = new MyResultStageStepConfigPage<List<PurchaseOrderLines>>
        {
            Data = new List<PurchaseOrderLines>()
        };

        int? p_itemTypeId = null, p_itemId = null;
        var isDefaultCurrency = model.Form_KeyValue[1]?.ToString() != "NaN"
            ? Convert.ToBoolean(Convert.ToInt32(model.Form_KeyValue[1]?.ToString()))
            : true;

        int? p_quantity = null, p_itemCategoryId = null, p_unitId = null, p_price = null;
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
            result.Columns = await GetPurchaseOrderLineAdvanceColumns(model.CompanyId, Convert.ToInt16(stageId),
                Convert.ToInt32(workflowId));
        else
            result.Columns = await GetPurchaseOrderLineSimpleColumns(model.CompanyId, Convert.ToInt16(stageId),
                Convert.ToInt32(workflowId));
        using (var conn = Connection)
        {
            var sQuery = "pu.Spc_PurchaseOrderLine_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<PurchaseOrderLines>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        if (result.Data.ListHasRow())
        {
            var columnsHasSum = result.Columns.DataColumns.Where(c => !c.CalculateSum).Select(v => v.Id).ToList();

            foreach (var item in columnsHasSum)
            {
                var col = result.Columns.DataColumns.Where(x => x.Id == item).SingleOrDefault();

                var sumTreasury = result.Data.Sum(s => decimal.Parse(GetPropValue(s, item).ToString()));
                col.SumValue = sumTreasury;
            }
        }

        return result;
    }

    public async Task<GetStageStepConfigColumnsViewModel> GetPurchaseOrderLineSimpleColumns(int companyId,
        short stageId, int workflowId)
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
                new() { Id = "currencyId", Title = "ارز شناسه", Type = (int)SqlDbType.TinyInt },
                new()
                {
                    Id = "itemType", Title = "نوع آیتم", Type = (int)SqlDbType.NVarChar, Size = 30,
                    IsDtParameter = true, IsFilterParameter = true, Width = 4, FilterType = "select2",
                    FilterTypeApi = ""
                },
                new()
                {
                    Id = "item", Title = "آیتم", Type = (int)SqlDbType.NVarChar, Size = 30, IsDtParameter = true,
                    IsFilterParameter = true, Width = 12, FilterType = "select2", FilterTypeApi = ""
                },
                new()
                {
                    Id = "categoryItemName", Title = "دسته بندی کالا", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 5, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = ""
                },
                new()
                {
                    Id = "attributeName", Title = "صفات کالا", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 5, PublicColumn = true, IsFilterParameter = true, FilterType = "select2", FilterTypeApi = ""
                },
                new()
                {
                    Id = "unitNames", Title = "واحد شمارش", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 4, PublicColumn = true, IsFilterParameter = true, FilterType = "select2", FilterTypeApi = ""
                },
                new()
                {
                    Id = "inOutName", Title = "ماهیت حساب", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 4, PublicColumn = true
                },
                new()
                {
                    Id = "totalQuantity", Title = "تعداد کل", Type = (int)SqlDbType.Decimal, Size = 100,
                    IsDtParameter = true, HasSumValue = true, Width = 5, InputType = "decimal", PublicColumn = true
                },
                new()
                {
                    Id = "price", Title = "نرخ", Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true,
                    IsCommaSep = true, HasSumValue = false, Width = 5, InputType = "money"
                },
                new()
                {
                    Id = "grossAmount", Title = "مبلغ", Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true,
                    IsCommaSep = true, Width = 5, InputType = "money", HasSumValue = true, HeaderReadOnly = true
                },
                new()
                {
                    Id = "discountTypeIdName", Title = "نوع تخفیف", Type = (int)SqlDbType.Int, Size = 100,
                    IsCommaSep = true, InputType = "money", HasSumValue = true, IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "discountAmount", Title = "تخفیف", Type = (int)SqlDbType.Int, Size = 100, IsCommaSep = true,
                    InputType = "money", HasSumValue = true, IsDtParameter = true, Width = 5, HeaderReadOnly = true
                },
                new()
                {
                    Id = "netAmount", Title = "مبلغ پس از تخفیف", Type = (int)SqlDbType.Int, Size = 100,
                    IsCommaSep = true, InputType = "money", IsDtParameter = true, Width = 5, HasSumValue = true,
                    HeaderReadOnly = true
                },
                new()
                {
                    Id = "vatAmount", Title = "مبلغ مالیات بر ارزش افزوده", Type = (int)SqlDbType.Int, Size = 20,
                    IsDtParameter = true, HasSumValue = true, IsCommaSep = true, Width = 5, InputType = "money",
                    HeaderReadOnly = true
                },
                new()
                {
                    Id = "netAmountPlusVat", Title = "مبلغ با ارزش افزوده", Type = (int)SqlDbType.Int, Size = 20,
                    IsDtParameter = true, HasSumValue = true, IsCommaSep = true, Width = 5, InputType = "money",
                    HeaderReadOnly = true
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
                    Id = "bySystem", Title = "سیستمی", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 4,
                    Align = "center", PublicColumn = true
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 }
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
                },
                new()
                {
                    Name = "averagePrices", Title = "نرخ های میانگین", ClassName = "btn blue_1 ",
                    IconName = "fa fa-list "
                }
            }
        };

        #region getStageStepConfig

        var config = new List<StageStepConfigGetColumn>();
        var stageStepParameters = new DynamicParameters();
        stageStepParameters.Add("StageId", stageId);
        stageStepParameters.Add("WorkflowId", workflowId);
        using (var conn =
               Connection)
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

    public GetStageStepConfigColumnsViewModel GetPurchaseOrderLineSimpleElement()
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
                    Id = "workflowId", IsPrimary = true, Title = "جریان کار", Type = (int)SqlDbType.Int,
                    IsDtParameter = false, Width = 5
                },
                new()
                {
                    Id = "itemTypeId", Title = "نوع آیتم", Type = (int)SqlDbType.NVarChar, Size = 30,
                    IsDtParameter = true, Width = 2, InputType = "select", IsSelect2 = true, IsFocus = true
                },

                new()
                {
                    Id = "itemId", Title = "آیتم", Type = (int)SqlDbType.NVarChar, Size = 30, IsDtParameter = true,
                    Width = 4, IsFilterParameter = true, InputType = "select",
                    Inputs = null, IsSelect2 = true,
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
                    IsDtParameter = true, Width = 4, InputType = "select", IsSelect2 = true, IsFocus = true,
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
                    IsDtParameter = true, IsFilterParameter = true,
                    Width = 2, IsCommaSep = true, InputType = "decimal", MaxLength = 9,
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-min", Value1 = "1" },
                        new() { ValidationName = "data-parsley-max", Value1 = "99999.999" }
                    },
                    InputMask = new InputMask { Mask = "'mask':'9{1,5}.9{1,3}'" }
                },


                new()
                {
                    Id = "totalQuantity", Title = "تعداد کل", Type = (int)SqlDbType.Int, Size = 100,
                    IsDtParameter = true, Width = 2, MaxLength = 9, HeaderReadOnly = true
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
                    Id = "grossAmount", Title = "مبلغ", Type = (int)SqlDbType.Decimal, Size = 11, IsDtParameter = true,
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
                        { new() { Id = 1, Name = "درصد" }, new() { Id = 2, Name = "مبلغ" } },
                    IsSelect2 = true, PleaseChoose = true
                },
                new()
                {
                    Id = "discountValue", Title = "تخفیف", Type = (int)SqlDbType.Int, Size = 100, IsCommaSep = true,
                    InputType = "money", IsDtParameter = true, Width = 2, HeaderReadOnly = true
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

    public async Task<GetStageStepConfigColumnsViewModel> GetPurchaseOrderLineAdvanceColumns(int companyId,
        short stageId, int workflowId)
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
                    Width = 5
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
                    IsDtParameter = true, Width = 5
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
                    Width = 4, PublicColumn = true
                },
                new()
                {
                    Id = "ratio", Title = "ضریب", Type = (int)SqlDbType.Decimal, IsDtParameter = true, Width = 2,
                    PublicColumn = true
                },
                new()
                {
                    Id = "quantity", Title = "تعداد", Type = (int)SqlDbType.Decimal, Size = 100, IsDtParameter = true,
                    HasSumValue = true, Width = 2, InputType = "decimal",
                    InputMask = new InputMask { Mask = "'mask':'9{1,5}.9{1,3}'" }, MaxLength = 9,
                    Validations = new List<FormPlate1.Validation>
                        { new() { ValidationName = "data-parsley-max", Value1 = "50" } }
                },
                new()
                {
                    Id = "totalQuantity", Title = "تعداد کل", Type = (int)SqlDbType.Decimal, Size = 100,
                    PublicColumn = true, IsDtParameter = true, HasSumValue = true, Width = 3, InputType = "decimal",
                    Validations = new List<FormPlate1.Validation>
                        { new() { ValidationName = "data-parsley-max", Value1 = "50" } }
                },
                new()
                {
                    Id = "currency", Title = "نوع ارز", Type = (int)SqlDbType.TinyInt, PublicColumn = true,
                    IsDtParameter = true, Width = 4, IsSelect2 = true
                },
                new()
                {
                    Id = "exchangeRate", Title = "نرخ تسعیر", Type = (int)SqlDbType.Int, Size = 11,
                    IsDtParameter = true, IsCommaSep = true, Width = 4, InputType = "money", HeaderReadOnly = true
                },
                new()
                {
                    Id = "price", Title = "نرخ", Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true,
                    IsCommaSep = true, HasSumValue = false, Width = 4, InputType = "money"
                },
                new()
                {
                    Id = "grossAmount", Title = "مبلغ", Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true,
                    IsCommaSep = true, Width = 4, InputType = "money", HasSumValue = true, HeaderReadOnly = true
                },
                new()
                {
                    Id = "discountTypeIdName", Title = "نوع تخفیف", Type = (int)SqlDbType.Int, Size = 100,
                    IsCommaSep = true, InputType = "money", HasSumValue = true, IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "discountAmount", Title = "تخفیف", Type = (int)SqlDbType.Int, Size = 100, IsCommaSep = true,
                    InputType = "money", HasSumValue = true, IsDtParameter = true, Width = 4
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
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 5 }
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
                },
                new()
                {
                    Name = "averagePrices", Title = "نرخ های میانگین", ClassName = "btn blue_1 ",
                    IconName = "fa fa-list "
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

    public GetStageStepConfigColumnsViewModel GetPurchaseOrderLineAdvanceElement()
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
                    Id = "itemId", Title = "آیتم", Type = (int)SqlDbType.NVarChar, Size = 30, IsDtParameter = true,
                    Width = 4, IsFilterParameter = true, InputType = "select",
                    Inputs = null, IsSelect2 = true,
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
                    IsDtParameter = true, Width = 4, InputType = "select", IsSelect2 = true, IsFocus = true,
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
                    Id = "quantity", Title = "تعداد", Type = (int)SqlDbType.Int, Size = 100, IsPrimary = true,
                    IsDtParameter = true, IsFilterParameter = true, Width = 2, IsCommaSep = true, InputType = "decimal",
                    MaxLength = 9,
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-min", Value1 = "1" },
                        new() { ValidationName = "data-parsley-max", Value1 = "99999.999" }
                    },
                    InputMask = new InputMask { Mask = "'mask':'9{1,5}.9{1,3}'" }
                },

                new()
                {
                    Id = "totalQuantity", Title = "تعداد کل", Type = (int)SqlDbType.Int, Size = 100,
                    IsDtParameter = true, Width = 2, MaxLength = 9, HeaderReadOnly = true
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
                    IsFilterParameter = true, IsCommaSep = true, Width = 2, MaxLength = 15,
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
                    IsFilterParameter = true, IsCommaSep = true, Width = 2, InputType = "money", HasSumValue = true,
                    HeaderReadOnly = true,
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "data-parsley-min", Value1 = "1" },
                        new() { ValidationName = "data-parsley-max", Value1 = "999999999999" }
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
                    Id = "discountValue", Title = "تخفیف", Type = (int)SqlDbType.Int, Size = 100, IsCommaSep = true,
                    InputType = "money", IsDtParameter = true, Width = 2
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

    public async Task<MyResultPage<PurchaseOrderLineGetRecord>> GetRecordByIds(int id, int companyId)
    {
        var result = new MyResultPage<PurchaseOrderLineGetRecord>
        {
            Data = new PurchaseOrderLineGetRecord()
        };

        using (var conn = Connection)
        {
            var sQuery = "[pu].[Spc_PurchaseOrderLine_GetRecord]";
            result.Data = await conn.QueryFirstOrDefaultAsync<PurchaseOrderLineGetRecord>(sQuery, new
            {
                Id = id,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<MyResultStatus> Insert(PurchaseOrderLineModel model, int companyId)
    {
        var validateResult = new List<string>();
        model.Ratio = model.Ratio == 0 ? 1 : model.Ratio;
        validateResult = await Validate(model, OperationType.Insert, companyId);

        if (validateResult.ListHasRow())
        {
            var resultValidate = new MyResultStatus();
            resultValidate.Successfull = false;
            resultValidate.ValidationErrors = validateResult;
            return resultValidate;
        }

        var result = new MyResultStatus();


        using (var conn = Connection)
        {
            var sQuery = "pu.Spc_PurchaseOrderLine_Ins";
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
                model.DiscountType,
                model.DiscountValue,
                model.DiscountAmount,
                model.NetAmount,
                model.VATAmount,
                VatId = model.VatId > 0 ? model.VatId : 0,
                VatPer = model.VatPer > 0 ? model.VatPer : 0,
                model.NetAmountPlusVAT,
                model.AllowInvoiceDiscount,
                model.PriceIncludingVAT,
                model.CreateUserId,
                model.CreateDateTime,
                model.InOut,
                UnitId = model.UnitId == 0 ? null : model.UnitId,
                SubUnitId = model.IdSubUnit == 0 ? null : model.SubUnitId,
                model.Ratio,
                model.TotalQuantity,
                model.AttributeIds
            }, commandType: CommandType.StoredProcedure);
            result.Successfull = outPut > 0;
            result.Status = outPut > 0 ? 100 : -99;
        }

        return result;
    }

    public async Task<MyResultStatus> Update(PurchaseOrderLineModel model, int companyId)
    {
        var validateResult = new List<string>();

        validateResult = await Validate(model, OperationType.Update, companyId);

        if (validateResult.ListHasRow())
        {
            var resultValidate = new MyResultStatus();
            resultValidate.Successfull = false;
            resultValidate.ValidationErrors = validateResult;
            return resultValidate;
        }

        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "pu.Spc_PurchaseOrderLine_Upd";
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
                model.DiscountType,
                model.DiscountValue,
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
                model.AttributeIds
            }, commandType: CommandType.StoredProcedure);
            result.Successfull = outPut > 0;
            result.Status = outPut > 0 ? 100 : -99;
        }

        return result;
    }

    public virtual async Task<MyResultStatus> DeleteOrderLine(PurchaseOrderLineDelete model, int companyId)
    {
        var result = new MyResultStatus();
        var validateResult = await ValidateDeletePurchaseOrderLine(model, companyId);
        var sQuery = "";
        var output = 0;
        if (validateResult.ListHasRow())
        {
            result.Successfull = false;
            result.ValidationErrors = validateResult;
            return result;
        }

        sQuery = "[pu].[Spc_PurchaseOrderLine_Delete]";
        using (var conn = Connection)
        {
            conn.Open();
            output = await conn.QueryFirstOrDefaultAsync<int>(
                sQuery, new
                {
                    PurchaseOrderLineId = model.Id,
                    model.HeaderId,
                    model.UserId
                }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = output > 0;
        result.Status = result.Successfull ? 100 : -100;
        result.StatusMessage = !result.Successfull ? "عملیات حذف با مشکل مواجه شد" : "";
        return result;
    }

    public async Task<int> GetOrderLineCount(int Id)
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
                    Filter = $"HeaderId={Id}"
                }, commandType: CommandType.StoredProcedure);
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

    public async Task<List<string>> Validate(PurchaseOrderLineModel model, OperationType operationType, int companyid)
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
                    error.Add($"آیتم {existItem.ItemId} قبلا ثبت شده است، مجاز به ثبت تکراری نیستید");

                #region بررسی وضعیت دوره مالی

                var purchaseOrder = _purchaseOrderRepository.GetRecordById(model.HeaderId, companyid).Result.Data;

                var resultCheckFiscalYear =
                    await _fiscalYearRepository.GetFicalYearStatusByDate(purchaseOrder.OrderDate, companyid);

                if (!resultCheckFiscalYear.Successfull)
                    error.Add(resultCheckFiscalYear.StatusMessage);

                #endregion

                if (model.NetAmountPlusVAT == 0)
                    error.Add("مبلغ با ارزش افزوده نمی تواند صفر باشد");

                if (model.DiscountType > 0 && model.DiscountValue == 0)
                    error.Add("تخفیف را وارد کنید");
            }
        });
        return error;
    }

    public async Task<List<string>> ValidateDeletePurchaseOrderLine(PurchaseOrderLineDelete model, int companyId)
    {
        var error = new List<string>();

        if (model == null)
        {
            error.Add("درخواست معتبر نمی باشد");
            return error;
        }

        #region برگه جاری مجوز حذف دارد؟

        var purchaseOrderAction = new GetAction();

        var currentActionId = await GetActionIdByIdentityId(model.HeaderId);
        purchaseOrderAction.StageId = model.StageId;
        purchaseOrderAction.ActionId = currentActionId;
        purchaseOrderAction.WorkflowId = model.WorkflowId;
        var currentTreasuryStageAct = await _stageActionRepository.GetAction(purchaseOrderAction);

        if (!currentTreasuryStageAct.IsDeleteLine) error.Add("مجاز به حذف سطر در این گام نمی باشید");

        #endregion

        #region بررسی وضعیت دوره مالی

        var purchaseOrder = _purchaseOrderRepository.GetRecordById(model.HeaderId, companyId).Result.Data;
        var resultCheckFiscalYear =
            await _fiscalYearRepository.GetFicalYearStatusByDate(purchaseOrder.OrderDate, companyId);

        if (!resultCheckFiscalYear.Successfull)
            error.Add(resultCheckFiscalYear.StatusMessage);

        #endregion

        return error;
    }
}