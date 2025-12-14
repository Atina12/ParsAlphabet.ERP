using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.SM.SaleOrderLine;
using ParsAlphabet.ERP.Application.Dtos.WF.StageStepConfig;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Application.Interfaces.SM.SaleOrderLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYear;
using ParsAlphabet.ERP.Infrastructure.Implantation.PU.VendorItems;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM.ReturnReason;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM.SaleOrderLIneBase;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.SM.SaleOrderLine;

public class SaleOrderLineRepository : SaleOrderLineBase, ISaleOrderLineRepository
{
    private readonly ICompanyRepository _CompanyRepository;
    private readonly FiscalYearRepository _fiscalYearRepository;
    private readonly ReturnReasonRepository _ReturnReasonRepository;
    private readonly StageActionRepository _stageActionRepository;

    public SaleOrderLineRepository(
        IConfiguration config,
        IHttpContextAccessor accessor,
        ICompanyRepository CompanyRepository,
        ReturnReasonRepository ReturnReasonRepository,
        VendorItemsRepository vendorItemsRepository,
        FiscalYearRepository fiscalYearRepository,
        StageActionRepository stageActionRepository) :
        base(config,
            stageActionRepository,
            vendorItemsRepository,
            fiscalYearRepository)
    {
        _CompanyRepository = CompanyRepository;
        _ReturnReasonRepository = ReturnReasonRepository;
        _stageActionRepository = stageActionRepository;
        _fiscalYearRepository = fiscalYearRepository;
    }

    public async Task<MyResultPage<SaleOrderLineGetpage>> Display(GetPageViewModel model)
    {
        var result = new MyResultPage<SaleOrderLineGetpage>
        {
            Data = new SaleOrderLineGetpage()
        };

        var directPaging = Convert.ToInt32(model.Form_KeyValue[2]?.ToString());
        var paginationParameters = new DynamicParameters();
        long personOrderIdFromPagination = 0;
        if (directPaging > 0)
        {
            paginationParameters.Add("TableName", "sm.SaleOrder");
            paginationParameters.Add("IdColumnName", "Id");
            paginationParameters.Add("IdColumnValue", Convert.ToInt32(model.Form_KeyValue[0]?.ToString()));
            paginationParameters.Add("FilterParam",
                " AND StageId IN(SELECT Id FROM wf.Stage WHERE StageClassId=1 AND WorkflowCategoryId=3)");
            paginationParameters.Add("Direction", directPaging);

            using (var conn = Connection)
            {
                var sQuery = "[pb].[Spc_Tables_NextPrev]";
                conn.Open();
                personOrderIdFromPagination = await conn.ExecuteScalarAsync<long>(sQuery, paginationParameters,
                    commandType: CommandType.StoredProcedure);
            }
        }

        var personOrderId = personOrderIdFromPagination == 0
            ? long.Parse(model.Form_KeyValue[0]?.ToString())
            : personOrderIdFromPagination;
        var parameters = new DynamicParameters();
        var isDefaultCurrency = Convert.ToBoolean(Convert.ToInt32(model.Form_KeyValue[1]?.ToString()));

        parameters.Add("Id", personOrderId);
        result.Columns = GetHeaderColumns(model.CompanyId);

        using (var conn = Connection)
        {
            var sQuery = "[sm].[Spc_SaleOrder_Display]";
            conn.Open();

            result.Data =
                (await conn.QueryAsync<SaleOrderLineGetpage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).FirstOrDefault();
        }

        if (result.Data != null)
        {
            var getPersonOrderAction = new GetAction();
            getPersonOrderAction.CompanyId = model.CompanyId;
            getPersonOrderAction.StageId = result.Data.StageId;
            getPersonOrderAction.ActionId = result.Data.ActionId;

            var stageAction = await _stageActionRepository.GetAction(getPersonOrderAction);
            if (stageAction != null)
            {
                result.Data.IsDataEntry = Convert.ToInt32(stageAction.IsDataEntry);
                result.Data.IsRequest = stageAction.IsRequest;
            }

            result.Data.JsonOrderLineList = new MyResultStageStepConfigPage<List<SaleOrderLines>>();
            if (!string.IsNullOrEmpty(result.Data.JsonOrderLine))
            {
                result.Data.JsonOrderLineList.Data =
                    JsonConvert.DeserializeObject<List<SaleOrderLines>>(result.Data.JsonOrderLine);
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
                result.Data.JsonOrderLineList.HeaderColumns = GetSaleOrderLineSimpleElement();
            else
                result.Data.JsonOrderLineList.HeaderColumns = GetSaleOrderLineAdvanceElement();
        }
        else
        {
            result.Data = new SaleOrderLineGetpage();
            result.Data.JsonOrderLineList = new MyResultStageStepConfigPage<List<SaleOrderLines>>();
            result.Data.JsonOrderLineList.Columns = new GetStageStepConfigColumnsViewModel();
            result.Data.JsonOrderLineList.Columns.HeaderType = "outline";
            result.Data.JsonOrderLineList.Columns.Title = "لیست گردش";
        }

        return result;
    }


    public async Task<MyResultStageStepConfigPage<List<SaleOrderLines>>> GetSaleOrderLinePage(NewGetPageViewModel model)
    {
        var result = new MyResultStageStepConfigPage<List<SaleOrderLines>>
        {
            Data = new List<SaleOrderLines>()
        };

        int? p_itemTypeId = null;
        var isDefaultCurrency = Convert.ToBoolean(Convert.ToInt32(model.Form_KeyValue[1]?.ToString()));
        var p_itemName = "";
        int? p_quantity = null;
        int? p_price = null;

        switch (model.FieldItem)
        {
            case "item":
                p_itemName = model.FieldValue;
                break;
            case "itemType":
                p_itemTypeId = Convert.ToInt32(model.FieldValue);
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id");
        parameters.Add("HeaderId", model.Form_KeyValue[0]?.ToString());
        parameters.Add("ItemTypeId", p_itemTypeId);
        parameters.Add("ItemName", string.IsNullOrEmpty(p_itemName) ? null : p_itemName);
        parameters.Add("Quantity", p_quantity);
        parameters.Add("Price", p_price);

        if (!isDefaultCurrency)
            result.Columns =
                await GetSaleOrderLineAdvanceColumns(model.CompanyId,
                    Convert.ToInt16(model.Form_KeyValue[4]?.ToString()));
        else
            result.Columns =
                await GetSaleOrderLineSimpleColumns(model.CompanyId,
                    Convert.ToInt16(model.Form_KeyValue[4]?.ToString()));

        using (var conn = Connection)
        {
            var sQuery = "sm.Spc_SaleOrderLine_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<SaleOrderLines>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        return result;
    }

    public async Task<MyResultPage<SaleOrderLineGetpage>> GetHeader(GetPageViewModel model)
    {
        var result = new MyResultPage<SaleOrderLineGetpage>
        {
            Data = new SaleOrderLineGetpage()
        };

        var parameters = new DynamicParameters();
        parameters.Add("Id", model.Form_KeyValue[0]?.ToString());
        result.Columns = GetHeaderColumns(model.CompanyId);

        using (var conn = Connection)
        {
            var sQuery = "[sm].[Spc_SaleOrder_Display]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<SaleOrderLineGetpage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).FirstOrDefault();
        }

        if (result.Data != null)
        {
            var getPurchaseOrderAction = new GetAction();
            getPurchaseOrderAction.CompanyId = model.CompanyId;
            getPurchaseOrderAction.StageId = result.Data.StageId;
            getPurchaseOrderAction.ActionId = result.Data.ActionId;

            var stageAction = await _stageActionRepository.GetAction(getPurchaseOrderAction);
            if (stageAction != null)
            {
                result.Data.IsDataEntry = Convert.ToInt32(stageAction.IsDataEntry);
                result.Data.IsRequest = stageAction.IsRequest;
            }
        }

        return result;
    }

    public async Task<bool> GetOrderLineCount(int Id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<bool>(sQuery,
                new
                {
                    TableName = "sm.SaleOrderLine",
                    ColumnName = "HeaderId",
                    Filter = $"HeaderId={Id}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model)
    {
        var result = new CSVViewModel<IEnumerable>();
        var columns = new GetStageStepConfigColumnsViewModel();
        var isDefaultCurrency = Convert.ToBoolean(Convert.ToInt32(model.Form_KeyValue[1]?.ToString()));
        var getPage = await GetSalesOrderLinePage(model);
        if (!isDefaultCurrency)
        {
            columns = await GetSaleOrderLineAdvanceColumns(model.CompanyId,
                Convert.ToInt16(model.Form_KeyValue[4]?.ToString()));

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
                    p.CreateDateTimePersian
                };
        }
        else
        {
            columns = await GetSaleOrderLineSimpleColumns(model.CompanyId,
                Convert.ToInt16(model.Form_KeyValue[4]?.ToString()));


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
                    p.Price,
                    p.GrossAmount,
                    p.DiscountAmount,
                    p.NetAmount,
                    p.VatAmount,
                    p.NetAmountPlusVat,
                    PriceIncludingVAT = p.PriceIncludingVAT ? "بلی" : "خیر",
                    p.CreateUserFullName,
                    p.CreateDateTimePersian
                };
        }

        var csvColumns = string.Join(",",
            columns.DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title));

        result.Columns = csvColumns;
        return result;
    }

    public async Task<MyResultPage<SaleOrderLineGetRecord>> GetRecordByIds(int id, int companyId)
    {
        var result = new MyResultPage<SaleOrderLineGetRecord>
        {
            Data = new SaleOrderLineGetRecord()
        };

        using (var conn = Connection)
        {
            var sQuery = "[sm].[Spc_SaleOrderLine_GetRecord]";
            result.Data = await conn.QueryFirstOrDefaultAsync<SaleOrderLineGetRecord>(sQuery, new
            {
                Id = id,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<MyResultStatus> Insert(SaleOrderLineModel model, int companyId)
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
            var sQuery = "[sm].[Spc_SaleOrderLine_Ins]";
            conn.Open();
            var outPut = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                model.Id,
                model.HeaderId,
                model.BranchId,
                model.ItemTypeId,
                model.ItemId,
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
                model.VatId,
                model.VatPer,
                model.NetAmountPlusVAT,
                model.AllowInvoiceDiscount,
                model.PriceIncludingVAT,
                model.CreateUserId,
                model.CreateDateTime,
                model.InOut,
                model.UnitId,
                SubUnitId = model.IdSubUnit == 0 ? null : model.IdSubUnit,
                model.Ratio,
                model.TotalQuantity,
                model.AttributeIds
            }, commandType: CommandType.StoredProcedure);
            result.Successfull = outPut > 0;
            result.Status = outPut > 0 ? 100 : -99;
        }

        return result;
    }

    public async Task<MyResultStatus> Update(SaleOrderLineModel model, int companyId)
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
            var sQuery = "[sm].[Spc_SaleOrderLine_Upd]";
            conn.Open();
            var outPut = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                model.Id,
                model.HeaderId,
                model.BranchId,
                model.ItemTypeId,
                model.ItemId,
                model.CurrencyId,
                model.Quantity,
                model.Price,
                ExchangeRate = model.ExchangeRate == 0 ? 1 : model.ExchangeRate,
                model.GrossAmount,
                model.DiscountType,
                model.DiscountValue,
                model.DiscountAmount,
                model.NetAmount,
                model.VatId,
                model.VatPer,
                model.VATAmount,
                model.NetAmountPlusVAT,
                model.AllowInvoiceDiscount,
                model.PriceIncludingVAT,
                model.CreateUserId,
                CreateDateTime = DateTime.Now,
                model.InOut,
                model.UnitId,
                SubUnitId = model.IdSubUnit,
                model.Ratio,
                model.TotalQuantity,
                model.AttributeIds
            }, commandType: CommandType.StoredProcedure);
            result.Successfull = outPut > 0;
            result.Status = outPut > 0 ? 100 : -99;
        }

        return result;
    }

    public virtual async Task<MyResultStatus> DeleteOrderLine(SaleOrderLineModel model, int companyId)
    {
        var result = new MyResultStatus();
        var validateResult = await ValidateDeleteSaleOrderLine(model, companyId);
        var sQuery = "";
        var output = 0;
        if (validateResult.ListHasRow())
        {
            result.Successfull = false;
            result.ValidationErrors = validateResult;
            return result;
        }

        sQuery = "[sm].[Spc_OrderOrderLine_Delete]";
        using (var conn = Connection)
        {
            conn.Open();
            output = await conn.QueryFirstOrDefaultAsync<int>(
                sQuery, new
                {
                    SaleOrderLineId = model.Id,
                    model.HeaderId
                }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = output > 0;
        result.Status = result.Successfull ? 100 : -100;
        result.StatusMessage = !result.Successfull ? "عملیات حذف با مشکل مواجه شد" : "";
        return result;
    }


    public GetColumnsViewModel GetHeaderColumns(int CompanyId)
    {
        var list = new GetColumnsViewModel
        {
            Title = " مشخصات سفارش فروش ",
            Classes = "group-box-green",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, Size = 50, IsPrimary = true,
                    IsDtParameter = true, IsFilterParameter = false, Width = 3, Editable = false
                },
                new()
                {
                    Id = "invoiceId", Title = "شناسه صورتحساب", Type = (int)SqlDbType.TinyInt, HasLink = true,
                    IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    Width = 5
                },
                new()
                {
                    Id = "orderNo", Title = "شماره برگه", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 6
                },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "inOutName", Title = "ماهیت حساب", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 6
                },
                new()
                {
                    Id = "noSeries", Title = "گروه تفصیل", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 6
                },
                new()
                {
                    Id = "accountDetail", Title = "تفصیل", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 6
                },
                new()
                {
                    Id = "returnReason", Title = "دلیل برگشت", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 6
                },
                new()
                {
                    Id = "actionIdName", Title = "گام مرحله", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 6
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
                new() { Id = "stageId", Title = "مرحله", IsPrimary = true, Type = (int)SqlDbType.Int, Width = 10 },
                //new DataColumnsViewModel { Id = "personGroupTypeId", IsPrimary = true},
                //Editable Columns
                new()
                {
                    Id = "noSeriesId", Title = "گروه تفصیل", IsPrimary = true, Type = (int)SqlDbType.Int, Size = 100,
                    InputOrder = 1, IsFilterParameter = true, Width = 6, Editable = true, IsFocus = true,
                    InputType = "select", FillType = "front", Inputs = new List<MyDropDownViewModel>(), IsSelect2 = true
                },
                new()
                {
                    Id = "accountDetailId", Title = "تفصیل", IsPrimary = true, Type = (int)SqlDbType.Int, Size = 100,
                    InputOrder = 2, IsFilterParameter = true, Width = 6, Editable = true, IsFocus = true,
                    InputType = "select", FillType = "front", Inputs = new List<MyDropDownViewModel>(), IsSelect2 = true
                },
                new()
                {
                    Id = "orderDatePersian", Title = "تاریخ برگه", Type = (int)SqlDbType.VarChar, Size = 20,
                    InputOrder = 3, IsDtParameter = true, IsFilterParameter = true, Width = 6, Editable = true,
                    InputType = "datepicker", InputMask = new InputMask { Mask = "'mask':'9999/99/99'" }
                },
                new()
                {
                    Id = "returnReasonId", Title = "دلیل برگشت", IsPrimary = true, FillType = "front",
                    Type = (int)SqlDbType.NVarChar, Size = 100, InputOrder = 5, Width = 12, Editable = true,
                    InputType = "select", Inputs = _ReturnReasonRepository.GetDropDown("sm").Result.ToList()
                },
                new()
                {
                    Id = "note", Title = "توضیحات", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    InputOrder = 6, IsNotFocusSelect = true, Width = 12, Editable = true
                },

                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 8 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "header_update", Title = "ویرایش", ClassName = "btn green_outline_1 ml-1",
                    IconName = "fa fa-pen"
                }
            }
        };

        return list;
    }


    public async Task<MyResultStageStepConfigPage<List<SaleOrderLines>>> GetSalesOrderLinePage(
        NewGetPageViewModel model)
    {
        var result = new MyResultStageStepConfigPage<List<SaleOrderLines>>
        {
            Data = new List<SaleOrderLines>()
        };

        int? p_itemTypeId = null;
        var isDefaultCurrency = Convert.ToBoolean(Convert.ToInt32(model.Form_KeyValue[1]?.ToString()));
        var p_itemName = "";
        int? p_quantity = null;
        int? p_price = null;

        switch (model.FieldItem)
        {
            case "item":
                p_itemName = model.FieldValue;
                break;
            case "itemType":
                p_itemTypeId = Convert.ToInt32(model.FieldValue);
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id");
        parameters.Add("HeaderId", model.Form_KeyValue[0]?.ToString());
        parameters.Add("ItemTypeId", p_itemTypeId);
        parameters.Add("ItemName", string.IsNullOrEmpty(p_itemName) ? null : p_itemName);
        parameters.Add("Quantity", p_quantity);
        parameters.Add("Price", p_price);

        if (!isDefaultCurrency)
            result.Columns = await GetSaleOrderLineAdvanceColumns(model.CompanyId,
                Convert.ToInt16(Convert.ToInt32(model.Form_KeyValue[4]?.ToString())));
        else
            result.Columns = await GetSaleOrderLineSimpleColumns(model.CompanyId,
                Convert.ToInt16(Convert.ToInt32(model.Form_KeyValue[4]?.ToString())));

        using (var conn = Connection)
        {
            var sQuery = "sm.Spc_SaleOrderLine_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<SaleOrderLines>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }


        return result;
    }

    public async Task<GetStageStepConfigColumnsViewModel> GetSaleOrderLineSimpleColumns(int companyId, short stageId)
    {
        var list = new GetStageStepConfigColumnsViewModel
        {
            Title = "لیست گردش",
            Classes = "group-box-orange",
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "inOut", FieldValue = "1", Operator = "==" } },
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
                    IsFilterParameter = true, Width = 14
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
                    HasSumValue = true, Width = 3, InputType = "decimal", PublicColumn = true
                },
                new()
                {
                    Id = "totalQuantity", Title = "تعداد کل", Type = (int)SqlDbType.Decimal, Size = 100,
                    IsDtParameter = true, HasSumValue = true, Width = 4, InputType = "decimal", PublicColumn = true
                },

                new()
                {
                    Id = "price", Title = "نرخ", Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true,
                    IsCommaSep = true, HasSumValue = true, Width = 4, InputType = "money"
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
                    IsDtParameter = true, HasSumValue = true, IsCommaSep = true, Width = 4, InputType = "money",
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
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 6 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "editSaleOrder", Title = "ویرایش", ClassName = "btn green_outline_1 ml-1",
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

    public GetStageStepConfigColumnsViewModel GetSaleOrderLineSimpleElement()
    {
        var list = new GetStageStepConfigColumnsViewModel
        {
            HasStageStepConfig = true,
            StageStepConfig = new StageStepConfigModel
            {
                HeaderFields = new List<StageStepHeaderColumn> { new() { FieldId = "stageId" } },
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
                    IsDtParameter = true, Width = 4, InputType = "select", IsSelect2 = true, IsFocus = true
                },

                new()
                {
                    Id = "subUnitId", Title = "واحد شمارش", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 2, InputType = "select", IsSelect2 = true, IsFocus = true
                },
                new()
                {
                    Id = "quantity", Title = "تعداد", Type = (int)SqlDbType.Int, Size = 100, IsPrimary = true,
                    IsDtParameter = true, IsFilterParameter = true, Width = 2, IsCommaSep = true, InputType = "number",
                    MaxLength = 8,
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-min", Value1 = "1" },
                        new() { ValidationName = "data-parsley-max", Value1 = "999999999" }
                    }
                },

                new()
                {
                    Id = "totalQuantity", Title = "تعداد کل", Type = (int)SqlDbType.Int, Size = 100,
                    IsDtParameter = true, Width = 2, MaxLength = 9, HeaderReadOnly = true
                },

                new()
                {
                    Id = "price", Title = "نرخ", Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true,
                    IsFilterParameter = true, IsCommaSep = true, Width = 2, InputType = "money",
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-min", Value1 = "1" },
                        new() { ValidationName = "data-parsley-max", Value1 = "999999999" }
                    },
                    MinValue = 0, MaxValue = 0, MaxLength = 11
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

    public async Task<GetStageStepConfigColumnsViewModel> GetSaleOrderLineAdvanceColumns(int companyId, short stageId)
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
                    IsCommaSep = true, HasSumValue = true, Width = 4, InputType = "money"
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
                    Name = "editSaleOrder", Title = "ویرایش", ClassName = "btn green_outline_1 ml-1",
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

    public GetStageStepConfigColumnsViewModel GetSaleOrderLineAdvanceElement()
    {
        var list = new GetStageStepConfigColumnsViewModel
        {
            HasStageStepConfig = true,
            StageStepConfig = new StageStepConfigModel
            {
                HeaderFields = new List<StageStepHeaderColumn> { new() { FieldId = "stageId" } },
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
                    IsDtParameter = true, Width = 4, InputType = "select", IsSelect2 = true, IsFocus = true
                },

                new()
                {
                    Id = "subUnitId", Title = "واحد شمارش", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 2, InputType = "select", IsSelect2 = true, IsFocus = true
                },
                new()
                {
                    Id = "quantity", Title = "تعداد", Type = (int)SqlDbType.Int, Size = 100, IsPrimary = true,
                    IsDtParameter = true, IsFilterParameter = true, Width = 2, IsCommaSep = true, InputType = "decimal",
                    MaxLength = 8,
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-min", Value1 = "1" },
                        new() { ValidationName = "data-parsley-max", Value1 = "999999999" }
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
                    Id = "price", Title = "نرخ", Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true,
                    IsFilterParameter = true, IsCommaSep = true, Width = 2, InputType = "money",
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-min", Value1 = "1" },
                        new() { ValidationName = "data-parsley-max", Value1 = "999999999" }
                    },
                    MinValue = 0, MaxValue = 0, MaxLength = 11
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

    public async Task<List<string>> ValidateDeleteSaleOrderLine(SaleOrderLineModel model, int companyId)
    {
        var error = new List<string>();

        if (model == null)
        {
            error.Add("درخواست معتبر نمی باشد");
            return error;
        }

        #region برگه جاری مجوز حذف دارد؟

        var personOrderAction = new GetAction();

        var currentActionId = await GetActionIdByIdentityId(model.HeaderId);
        personOrderAction.StageId = model.StageId;
        personOrderAction.ActionId = currentActionId;
        var currentTreasuryStageAct = await _stageActionRepository.GetAction(personOrderAction);

        if (!currentTreasuryStageAct.IsDeleteLine) error.Add("مجاز به حذف سطر در این گام نمی باشید");

        #endregion

        #region بررسی وضعیت دوره مالی

        var resultCheckFiscalYear = await _fiscalYearRepository.GetFicalYearStatusByDate(model.OrderDate, companyId);

        if (!resultCheckFiscalYear.Successfull)
            error.Add(resultCheckFiscalYear.StatusMessage);

        #endregion

        return error;
    }

    #region PersonOrder

    #endregion
}