using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.SM.SalesPersonLine;
using ParsAlphabet.ERP.Application.Interfaces.CR;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Application.Interfaces.SM.SalesPersonLine;
using ParsAlphabet.ERP.Application.Interfaces.WH;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.Currency;
using ParsAlphabet.ERP.Infrastructure.Implantation.HR.Employee;
using ParsAlphabet.ERP.Infrastructure.Implantation.PU.Vendor;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM.ReturnReason;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM.ShipmentMethod;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.Stage;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.Item;
using Validation = ParsAlphabet.ERP.Application.Dtos.FormPlate1.Validation;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.SM.SalesPersonLine;

public class SalesPersonOrderLineRepository : ISalesPersonOrderLineRepository
{
    private readonly IHttpContextAccessor _accessor;
    private readonly ICompanyRepository _CompanyRepository;
    private readonly IConfiguration _config;
    private readonly ICRRepository _CRRepository;
    private readonly CurrencyRepository _CurrencyRepository;
    private readonly EmployeeRepository _EmployeeRepository;
    private readonly ItemRepository _ItemRepository;
    private readonly ReturnReasonRepository _ReturnReasonRepository;
    private readonly ShipmentMethodRepository _ShipmentMethodRepository;
    private readonly StageRepository _stageRepository;
    private readonly VendorRepository _VendorRepository;
    private readonly IWHRepository _WHRepository;

    public SalesPersonOrderLineRepository(
        IConfiguration config,
        IHttpContextAccessor accessor,
        ICRRepository CRRepository,
        ICompanyRepository CompanyRepository,
        WHRepository WHRepository,
        EmployeeRepository EmployeeRepository,
        CurrencyRepository CurrencyRepository,
        ReturnReasonRepository ReturnReasonRepository,
        ItemRepository ItemRepository,
        VendorRepository VendorRepository,
        ShipmentMethodRepository ShipmentMethodRepository,
        StageRepository stageRepository)
    {
        _config = config;
        _accessor = accessor;
        _CRRepository = CRRepository;
        _CompanyRepository = CompanyRepository;
        _WHRepository = WHRepository;
        _EmployeeRepository = EmployeeRepository;
        _CurrencyRepository = CurrencyRepository;
        _ReturnReasonRepository = ReturnReasonRepository;
        _ItemRepository = ItemRepository;
        _VendorRepository = VendorRepository;
        _ShipmentMethodRepository = ShipmentMethodRepository;
        _stageRepository = stageRepository;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public async Task<CSVViewModel<IEnumerable>> Csv(GetPageViewModel model)
    {
        model.PageNo = 0;
        model.PageRowsCount = 0;

        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                GetHeaderColumns(model.CompanyId).DataColumns.Where(x => x.IsDtParameter && x.Id != "action")
                    .Select(z => z.Title))
        };

        return result;
    }

    #region PersonOrder

    public GetColumnsViewModel GetHeaderColumns(int CompanyId)
    {
        var list = new GetColumnsViewModel
        {
            Title = "مشخصات سفارش",
            Classes = "group-box-green",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, Size = 50, IsPrimary = true,
                    IsDtParameter = true, IsFilterParameter = false, Width = 2, Editable = false
                },
                new()
                {
                    Id = "currencyId", Title = "واحد پول", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = false, Width = 2, Editable = false, InputType = "select",
                    Inputs = _CurrencyRepository.GetDropDown("gn").Result.ToList()
                },
                new()
                {
                    Id = "branchId", Title = "شعبه", Type = (int)SqlDbType.Int, Size = 100, IsPrimary = true,
                    IsDtParameter = false, Width = 3, InputType = "select", Inputs = new List<MyDropDownViewModel>(),
                    IsSelect2 = true
                },
                new()
                {
                    Id = "stageId", Title = "نوع سفارش", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 3, Editable = false, InputType = "select",
                    Inputs = _stageRepository.GetDropDown("SalesPersonOrderIndex").Result.ToList()
                },
                new()
                {
                    Id = "personTypeId", Title = "نوع مشتری", Type = (int)SqlDbType.NVarChar, Size = 30,
                    IsDtParameter = true, Width = 2, Editable = true, InputType = "select",
                    Inputs = _CRRepository.PersonGroupType_GetDropDown().Result, IsSelect2 = true, IsFocus = true
                },
                new()
                {
                    Id = "personId", Title = "مشتری", Type = (int)SqlDbType.Int, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 3, Editable = true, InputType = "select",
                    Inputs = new List<MyDropDownViewModel>(), IsSelect2 = true
                },
                new()
                {
                    Id = "employeeId", Title = "کارمند", Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true,
                    IsFilterParameter = false, Width = 2, Editable = true, InputType = "select",
                    Inputs = _EmployeeRepository.GetDropDown("", CompanyId).Result, IsSelect2 = true
                },
                new()
                {
                    Id = "orderDatePersian", Title = "تاریخ سفارش", Type = (int)SqlDbType.VarChar, Size = 20,
                    IsDtParameter = true, IsFilterParameter = true, Width = 2, Editable = true,
                    InputType = "datepersian", InputMask = new InputMask { Mask = "'mask':'9999/99/99'" }
                },
                new()
                {
                    Id = "refrenceNo", Title = "شماره پیگیری", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 2, Editable = true, InputType = "number"
                },
                new()
                {
                    Id = "status", Title = "وضعیت", Type = (int)SqlDbType.TinyInt, IsDtParameter = true, Width = 2,
                    Editable = true, InputType = "select",
                    Inputs = new List<MyDropDownViewModel>
                    {
                        new() { Id = 1, Name = "باز" },
                        new() { Id = 2, Name = "بسته" },
                        new() { Id = 3, Name = "لغو" }
                    }
                },
                new()
                {
                    Id = "officialInvoice", Title = "صورتحساب رسمی", Type = (int)SqlDbType.Bit, Size = 1,
                    IsDtParameter = true, Width = 2, Align = "center", Editable = false, IsFocus = true,
                    InputType = "checkbox"
                },
                new()
                {
                    Id = "note", Title = "توضیحات", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    Width = 2, Editable = true
                },
                new()
                {
                    Id = "returnReasonId", Title = "دلیل برگشت از فروش", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 2, Editable = true, InputType = "select",
                    Inputs = _ReturnReasonRepository.GetDropDown("sm").Result.ToList()
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 12 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "header_update", Title = "ویرایش", ClassName = "btn btn-success", IconName = "fa fa-edit"
                }
            }
        };

        return list;
    }

    #endregion

    public async Task<List<MyDropDownViewModel>> GetDropDown(int CompanyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "sm.Customer",
                    TitleColumnName = "FullName",
                    CompanyId,
                    Filter = $"CompanyId={CompanyId}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    #region OrderLine

    public async Task<MyResultPage<List<PersonOrderLine>>> GetOrderLinePage(GetPageViewModel model)
    {
        var result = new MyResultPage<List<PersonOrderLine>>
        {
            Data = new List<PersonOrderLine>()
        };

        var totalRecord = 0;
        var p_currencyId = Convert.ToInt32(model.Form_KeyValue[2]?.ToString());
        var p_rowNumber = 0;
        var p_itemId = 0;
        string p_itemName = "", p_itemTypeName = "";
        var p_quantity = 0;
        var p_price = 0;

        switch (model.FieldItem)
        {
            case "rowNumber":
                p_rowNumber = Convert.ToInt32(model.FieldValue);
                break;

            case "itemId":
                p_itemId = Convert.ToInt32(model.FieldValue);
                break;
            case "itemName":
                p_itemName = model.FieldValue;
                break;
            case "itemTypeName":
                p_itemTypeName = model.FieldValue;
                break;
        }

        MyClaim.Init(_accessor);

        var parameters = new DynamicParameters();
        parameters.Add("IsSecondLang", MyClaim.IsSecondLang);
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("HeaderId", model.Form_KeyValue[0]?.ToString());
        parameters.Add("RowNumber", p_rowNumber);
        parameters.Add("ItemTypeName", p_itemTypeName);
        parameters.Add("ItemId", p_itemId);
        parameters.Add("ItemName", p_itemName);
        parameters.Add("Quantity", p_quantity);
        parameters.Add("Price", p_price);
        parameters.Add("CompanyId", model.CompanyId);
        parameters.Add("TotalRecord", dbType: DbType.Int32, direction: ParameterDirection.Output);

        result.Columns = GetOrderLineColumns();
        result.HeaderColumns = GetOrderLineHeaderColumns(model.CompanyId);

        using (var conn = Connection)
        {
            var sQuery = "sm.Spc_PersonOrderLine_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<PersonOrderLine>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        totalRecord = parameters.Get<int>("TotalRecord");

        if (result.Data.Count != 0 && model.PageRowsCount != 0)
        {
            result.CurrentPage = model.PageNo;
            result.TotalRecordCount = totalRecord;
            if (result.TotalRecordCount % model.PageRowsCount == 0)
                result.MaxPageCount = Convert.ToInt32(result.TotalRecordCount / model.PageRowsCount);
            else
                result.MaxPageCount = Convert.ToInt32(result.TotalRecordCount / model.PageRowsCount) + 1;
            result.PageStartRow = (model.PageNo - 1) * model.PageRowsCount + 1;
            result.PageEndRow = result.PageStartRow + result.Data.Count - 1;
        }

        var defaultCompanyCurrency = _CompanyRepository.GetCompanyInfo().Result.DefaultCurrencyId;
        if (defaultCompanyCurrency != p_currencyId)
        {
            var exchangeRate = result.Columns.DataColumns.Where(a => a.Id == "exchangeRate").FirstOrDefault();
            exchangeRate.IsDtParameter = true;
        }


        return result;
    }

    //public async Task<MyResultPage<List<PersonOrderLine>>> GetOrderLinePrice(List<TitleValue<long>> model,
    //    int CompanyId)
    //{
    //    var result = new MyResultPage<List<PersonOrderLine>>
    //    {
    //        Data = new List<PersonOrderLine>()
    //    };

    //    var p_itemTypeId = Convert.ToInt32(model.Where(a => a.Title == "ItemTypeId").FirstOrDefault().Value);
    //    var p_itemId = Convert.ToInt32(model.Where(a => a.Title == "ItemId").FirstOrDefault().Value);
    //    var p_currencyId = Convert.ToInt32(model.Where(a => a.Title == "CurrencyId").FirstOrDefault().Value);
    //    var p_orderTypeId = Convert.ToInt32(model.Where(a => a.Title == "OrderTypeId").FirstOrDefault().Value);
    //    var p_Quantity = Convert.ToInt32(model.Where(a => a.Title == "Quantity").FirstOrDefault().Value);
    //    var p_Price = Convert.ToDecimal(model.Where(a => a.Title == "Price").FirstOrDefault().Value);
    //    var p_DiscountAmount = Convert.ToInt32(model.Where(a => a.Title == "DiscountAmount").FirstOrDefault().Value);
    //    var p_TodayDate = DateTime.Now;

    //    var parameters = new DynamicParameters();

    //    parameters.Add("ItemTypeId", p_itemTypeId);
    //    parameters.Add("ItemId", p_itemId);
    //    parameters.Add("CurrencyId", p_currencyId);
    //    parameters.Add("OrderTypeId", p_orderTypeId);
    //    parameters.Add("Quantity", p_Quantity);
    //    parameters.Add("Price", p_Price);
    //    parameters.Add("DiscountAmount", p_DiscountAmount);
    //    parameters.Add("TodayDate", DateTime.Now);
    //    parameters.Add("CompanyId", CompanyId);

    //    result.Columns = GetOrderLineColumns();

    //    using (var conn = Connection)
    //    {
    //        var sQuery = "sm.Spc_PersonOrderLine_Prices";
    //        conn.Open();
    //        result.Data =
    //            (await conn.QueryAsync<PersonOrderLine>(sQuery, parameters, commandType: CommandType.StoredProcedure))
    //            .ToList();
    //    }

    //    return result;
    //}

    public GetColumnsViewModel GetOrderLineColumns()
    {
        var list = new GetColumnsViewModel
        {
            Title = "لیست محصولات",
            Classes = "group-box-orange",
            ActionType = "inline",
            HeaderType = "outline",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", IsPrimary = true, Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = false,
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
                    IsDtParameter = false, Width = 5
                },
                new()
                {
                    Id = "currencyId", Title = "ارز شناسه", Type = (int)SqlDbType.TinyInt, IsDtParameter = false,
                    Width = 5
                },
                new()
                {
                    Id = "rowNumber", IsPrimary = true, Title = "شماره سطر", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 4
                },
                new()
                {
                    Id = "itemTypeName", Title = "کالا/خدمت", Type = (int)SqlDbType.NVarChar, Size = 30,
                    IsDtParameter = true, IsFilterParameter = true, Width = 6
                },
                new()
                {
                    Id = "itemTypeId", Title = "کالا/خدمت", Type = (int)SqlDbType.NVarChar, Size = 30,
                    IsDtParameter = false, Width = 6
                },
                new()
                {
                    Id = "itemId", Title = "کد", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 12, InputType = "select",
                    Inputs = _ItemRepository.GetDropDown("", 1).Result, IsSelect2 = true
                },
                new()
                {
                    Id = "quantity", Title = "تعداد", Type = (int)SqlDbType.Int, Size = 100, IsDtParameter = true,
                    HasSumValue = true, Width = 5, InputType = "number",
                    Validations = new List<Validation> { new() { ValidationName = "data-parsley-max", Value1 = "50" } }
                },
                new()
                {
                    Id = "price", Title = "نرخ", Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true,
                    IsCommaSep = true, HasSumValue = true, Width = 5, InputType = "money", Validations =
                        new List<Validation>
                        {
                            new() { ValidationName = "required" },
                            new() { ValidationName = "data-parsley-min", Value1 = "1" },
                            new() { ValidationName = "data-parsley-max", Value1 = "9000000" }
                        },
                    MinValue = 0, MaxValue = 0
                },
                new()
                {
                    Id = "grossAmount", Title = "مبلغ", Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true,
                    IsCommaSep = true, Width = 7, InputType = "money", HasSumValue = true, HeaderReadOnly = true
                },
                new()
                {
                    Id = "discountAmount", Title = "تخفیف", Type = (int)SqlDbType.Int, Size = 100, IsCommaSep = true,
                    InputType = "money", HasSumValue = true, IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "netAmount", Title = "مبلغ پس از تخفیف", Type = (int)SqlDbType.Int, Size = 100,
                    IsCommaSep = true, InputType = "money", IsDtParameter = true, Width = 7, HasSumValue = true,
                    HeaderReadOnly = true
                },
                new()
                {
                    Id = "vatAmount", Title = "مبلغ مالیات بر ارزش افزوده", Type = (int)SqlDbType.Int, Size = 20,
                    IsDtParameter = true, HasSumValue = true, IsCommaSep = true, InputType = "money", Width = 5,
                    HeaderReadOnly = true
                },
                new()
                {
                    Id = "netAmountPlusVAT", Title = "مبلغ با ارزش افزوده", Type = (int)SqlDbType.Int, Size = 20,
                    IsDtParameter = true, IsCommaSep = true, Width = 7, InputType = "money", HasSumValue = true,
                    HeaderReadOnly = true
                },
                new()
                {
                    Id = "priceIncludingVAT", Title = "قیمت مصرف کننده", Type = (int)SqlDbType.Bit, Size = 11,
                    IsDtParameter = true, Width = 6, InputType = "checkbox", HeaderReadOnly = true
                },
                new()
                {
                    Id = "vatPer", Title = "نرخ مالیات برارزش افزوده", Type = (int)SqlDbType.Int, Size = 20, Width = 5,
                    IsDisplayItem = true
                },
                new()
                {
                    Id = "orderDate", Title = "تاریخ سفارش", Type = (int)SqlDbType.NVarChar, Size = 10, Width = 10,
                    IsDisplayItem = true
                },
                new()
                {
                    Id = "allowInvoiceDisc", Title = "allowInvoiceDisc", Type = (int)SqlDbType.Bit, Size = 11,
                    IsDtParameter = false, Width = 6, InputType = "checkbox", HeaderReadOnly = true
                },
                new()
                {
                    Id = "exchangeRate", Title = "نرخ تسعیر", Type = (int)SqlDbType.Int, Size = 11,
                    IsDtParameter = false, IsCommaSep = true, Width = 7, InputType = "money", HeaderReadOnly = true
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "edit", Title = "ویرایش", ClassName = "btn green_outline_1 ml-1", IconName = "fa fa-edit"
                },
                new()
                {
                    Name = "delete", Title = "حذف", ClassName = "btn maroon_outline ml-1", IconName = "fa fa-trash"
                },
                new()
                {
                    Name = "OrderDetail", Title = "تحویل", ClassName = "btn maroon_outline ml-1"
                    // IconName = "fa fa-list", IsDetailBtn = true,
                    //ListUrl = "/api/SM/SalesPersonOrderLineApi/getdeliverOrderpage",
                    //GetRecordUrl = "/api/SM/SalesPersonOrderLineApi/getDeliverOrderRecordByIds",
                    //InsUpUrl = "/api/SM/SalesPersonOrderLineApi/deliverOrderInsUp",
                    //DeleteUrl = "/api/SM/SalesPersonOrderLineApi/deleteDeliverOrder"
                },
                new()
                {
                    Name = "OrderDetail2", Title = "حمل", ClassName = "btn maroon_outline ml-1"
                    // IconName = "fa fa-list", IsDetailBtn = true,
                    //ListUrl = "/api/SM/SalesPersonOrderLineApi/getShipMentOrderpage",
                    //GetRecordUrl = "/api/SM/SalesPersonOrderLineApi/getShipMentOrderRecordByIds",
                    //InsUpUrl = "/api/SM/SalesPersonOrderLineApi/shipMentOrderInsUp",
                    //DeleteUrl = "/api/SM/SalesPersonOrderLineApi/deleteShipMentOrder"
                }
            }
        };

        return list;
    }

    public GetColumnsViewModel GetOrderLineHeaderColumns(int companyId)
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", IsPrimary = true, Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = false,
                    Width = 5
                },
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
                    Id = "currencyId", Title = "ارز شناسه", Type = (int)SqlDbType.TinyInt, IsDtParameter = false,
                    Width = 5
                },
                new()
                {
                    Id = "rowNumber", Title = "شماره سطر", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = false, IsFilterParameter = true, Width = 4, HeaderReadOnly = true
                },
                new()
                {
                    Id = "itemTypeName", Title = "نوع کالا/خدمت", Type = (int)SqlDbType.NVarChar, Size = 30,
                    IsDtParameter = true, Width = 2, InputType = "select",
                    Inputs = _WHRepository.ItemTypeIsItem_GetDropDown().Result
                },
                new()
                {
                    Id = "itemTypeId", Title = "کالا/خدمت", Type = (int)SqlDbType.NVarChar, Size = 30,
                    IsDtParameter = false, Width = 2
                },
                new()
                {
                    Id = "itemId", Title = "کد", Type = (int)SqlDbType.NVarChar, Size = 30, IsDtParameter = true,
                    Width = 2, IsFilterParameter = true, InputType = "select",
                    Inputs = _ItemRepository.GetDropDown("", companyId).Result, IsSelect2 = true
                },
                new()
                {
                    Id = "quantity", Title = "تعداد", Type = (int)SqlDbType.Int, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 2, InputType = "number",
                    Validations = new List<Validation>
                    {
                        new() { ValidationName = "data-parsley-range", Value1 = "1", Value2 = int.MaxValue.ToString() }
                    }
                },
                new()
                {
                    Id = "price", Title = "نرخ", Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true,
                    IsFilterParameter = true, IsCommaSep = true, Width = 2, InputType = "money", Validations =
                        new List<Validation>
                        {
                            new() { ValidationName = "required" },
                            new() { ValidationName = "data-parsley-min", Value1 = "1" },
                            new() { ValidationName = "data-parsley-max", Value1 = "9000000" }
                        },
                    MinValue = 0, MaxValue = 0
                },
                new()
                {
                    Id = "grossAmount", Title = "مبلغ", Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true,
                    IsFilterParameter = true, IsCommaSep = true, Width = 2, InputType = "money", HasSumValue = true,
                    HeaderReadOnly = true
                },
                new()
                {
                    Id = "vatPer", Title = "درصد ارزش افزوده", Type = (int)SqlDbType.Int, Size = 20,
                    IsFilterParameter = true, Width = 2, IsDisplayItem = true
                },
                new()
                {
                    Id = "orderDatePersian", Title = "تاریخ سفارش", IsPrimary = true, Type = (int)SqlDbType.VarChar,
                    Size = 10, IsDisplayItem = true, Width = 2, InputType = "datepersian",
                    InputMask = new InputMask { Mask = "'mask':'9999/99/99'" }
                },
                new()
                {
                    Id = "priceIncludingVAT", Title = "قیمت مصرف کننده", Type = (int)SqlDbType.Bit, Size = 11,
                    IsDtParameter = false, IsFilterParameter = true, Width = 1, InputType = "checkbox",
                    HeaderReadOnly = true
                },
                new()
                {
                    Id = "allowInvoiceDisc", Title = "allowInvoiceDisc", Type = (int)SqlDbType.Bit, Size = 11,
                    IsDtParameter = false, IsFilterParameter = false, Width = 1, InputType = "checkbox",
                    HeaderReadOnly = true
                },
                new()
                {
                    Id = "exchangeRate", Title = "نرخ تسعیر", Type = (int)SqlDbType.Int, Size = 11,
                    IsDtParameter = false, IsFilterParameter = true, IsCommaSep = true, Width = 2, InputType = "money",
                    HeaderReadOnly = true
                },
                new()
                {
                    Id = "discountAmount", Title = "تخفیف", Type = (int)SqlDbType.Int, Size = 100, IsCommaSep = true,
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

    public async Task<MyResultPage<SalesPersonOrderLineGetRecord>> GetRecordByIds(GetPersonOrderId model)
    {
        var result = new MyResultPage<SalesPersonOrderLineGetRecord>
        {
            Data = new SalesPersonOrderLineGetRecord()
        };
        using (var conn = Connection)
        {
            var sQuery = "[sm].[Spc_PersonOrderLine_GetRecord]";
            result.Data = await conn.QueryFirstOrDefaultAsync<SalesPersonOrderLineGetRecord>(sQuery, new
            {
                model.Id
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<MyResultStatus> Insert(SalesPersonOrderLineModel model)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "[sm].[Spc_PersonOrderLine_InsUpd]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                Opr = "Ins",
                model.Id,
                model.HeaderId,
                model.StageId,
                model.CurrencyId,
                model.OrderDate,
                model.RowNumber,
                ItemTypeId = model.ItemTypeName,
                model.ItemId,
                model.Quantity,
                model.Price,
                model.VATPer,
                model.PriceIncludingVAT,
                DiscountPer = model.DiscountPercent,
                model.DiscountAmount,
                model.AllowInvoiceDisc
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;

        return result;
    }

    public async Task<MyResultStatus> Update(SalesPersonOrderLineModel model)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "[sm].[Spc_PersonOrderLine_InsUpd]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                Opr = "Upd",
                model.Id,
                model.HeaderId,
                model.StageId,
                model.CurrencyId,
                model.OrderDate,
                model.RowNumber,
                ItemTypeId = model.ItemTypeName,
                model.ItemId,
                model.Quantity,
                model.Price,
                model.VATPer,
                model.PriceIncludingVAT,
                DiscountPer = model.DiscountPercent,
                model.DiscountAmount,
                model.AllowInvoiceDisc
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;

        return result;
    }

    public virtual async Task<MyResultStatus> DeleteOrderLine(string filter)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecordWithFilter";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(
                sQuery, new
                {
                    TableName = "pu.PurchaseOrderLine",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    #endregion

    #region DeliverOrder

    //public async Task<MyResultPage<List<DeliverOrderGetPage>>> GetDeliverOrderPage(List<TitleValue<string>> model,int companyId)
    //{
    //    var result = new MyResultPage<List<DeliverOrderGetPage>>
    //    {
    //        Data = new List<DeliverOrderGetPage>()
    //    };

    //    int p_rowNumber = Convert.ToInt32(model.Where(a => a.Title == "rownumber").FirstOrDefault().Value);
    //    int p_personOrderId = Convert.ToInt32(model.Where(a => a.Title == "headerid").FirstOrDefault().Value);
    //    int p_orderTypeId = Convert.ToInt32(model.Where(a => a.Title == "stageid").FirstOrDefault().Value);

    //    var parameters = new DynamicParameters();
    //    parameters.Add("PersonOrderId", p_personOrderId);
    //    parameters.Add("OrderTypeId", p_orderTypeId);
    //    parameters.Add("RowNumber", p_rowNumber);

    //    result.Columns = GetDeliverOrderLineColumns();

    //    using (IDbConnection conn = Connection)
    //    {
    //        string sQuery = "sm.Spc_DeliverOrder_GetPage";
    //        conn.Open();
    //        result.Data = (await conn.QueryAsync<DeliverOrderGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure)).ToList();
    //    }

    //    return result;
    //}

    public GetColumnsViewModel GetDeliverOrderLineColumns()
    {
        var list = new GetColumnsViewModel
        {
            Title = "جزییات تحویل",
            Classes = "group-box-orange",
            ActionType = "inline",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "headerId", IsPrimary = true, Title = "شناسه هدر", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = false, Width = 5
                },
                new()
                {
                    Id = "orderTypeId", IsPrimary = true, Title = "نوع سفارش", Type = (int)SqlDbType.NVarChar,
                    Size = 50, IsDtParameter = false, Width = 5
                },
                new()
                {
                    Id = "rowNumber", IsPrimary = true, Title = "شماره سطر", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = false, IsFilterParameter = true, Width = 5
                },
                new()
                {
                    Id = "requestedReceiptDatePersian", Title = "تاریخ درخواست", Type = (int)SqlDbType.NVarChar,
                    Size = 30, IsDtParameter = true, Width = 6, InputType = "datepersian",
                    InputMask = new InputMask { Mask = "'mask':'9999/99/99'" }
                },
                new()
                {
                    Id = "expectedReceiptDatePersian", Title = "تاریخ تحویل", Type = (int)SqlDbType.Int, Size = 100,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10, InputType = "datepersian",
                    InputMask = new InputMask { Mask = "'mask':'9999/99/99'" }
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "edit", Title = "ویرایش", ClassName = "btn green_outline_1 ml-1", IconName = "fa fa-edit"
                },
                new()
                {
                    Name = "delete", Title = "حذف", ClassName = "btn maroon_outline ml-1", IconName = "fa fa-trash"
                }
            }
        };

        return list;
    }

    public async Task<MyResultPage<DeliverOrderGetPage>> GetDeliverOrderRecordByIds(GetRecordByIds model)
    {
        var result = new MyResultPage<DeliverOrderGetPage>
        {
            Data = new DeliverOrderGetPage()
        };
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            result.Data = await conn.QueryFirstOrDefaultAsync<DeliverOrderGetPage>(sQuery, new
            {
                TableName = "sm.DeliverOrder",
                Filter =
                    $"PersonOrderId={model.HeaderID} AND OrderTypeID={model.OrderTypeID} AND RowNumber={model.RowNumber}"
            }, commandType: CommandType.StoredProcedure);
        }

        //result.Data.OrderDatePersian = result.Data.OrderDate != null ? result.Data.OrderDate.ToPersianDateStringNull() : "";
        return result;
    }

    public async Task<MyResultStatus> DeliverOrderSave(DeliverOrderGetPage model)
    {
        var result = new MyResultStatus();
        using (var conn = Connection)
        {
            var sQuery = "sm.Spc_DeliverOrder_InsUpd";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.Opr,
                model.OrderTypeId,
                PersonOrderId = model.HeaderId,
                model.RowNumber,
                model.RequestedReceiptDate,
                model.ExpectedReceiptDate
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public virtual async Task<MyResultQuery> DeleteDeliverOrder(string filter)
    {
        var result = new MyResultQuery();

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecordWithFilter";
            conn.Open();
            await conn.ExecuteAsync(
                sQuery, new
                {
                    TableName = "sm.DeliverOrder",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = true;
        return result;
    }

    #endregion

    #region ShipMentOrder

    //public async Task<MyResultPage<List<ShipMentOrderGetPage>>> GetShipMentOrderPage(List<TitleValue<string>> model,int comapnyId)
    //{
    //    var result = new MyResultPage<List<ShipMentOrderGetPage>>
    //    {
    //        Data = new List<ShipMentOrderGetPage>()
    //    };

    //    int p_rowNumber = Convert.ToInt32(model.Where(a => a.Title == "rownumber").FirstOrDefault().Value);
    //    int p_personOrderId = Convert.ToInt32(model.Where(a => a.Title == "headerid").FirstOrDefault().Value);
    //    int p_orderTypeId = Convert.ToInt32(model.Where(a => a.Title == "stageid").FirstOrDefault().Value);

    //    var parameters = new DynamicParameters();
    //    parameters.Add("PersonOrderId", p_personOrderId);
    //    parameters.Add("OrderTypeId", p_orderTypeId);
    //    parameters.Add("RowNumber", p_rowNumber);
    //    parameters.Add("CompanyId", comapnyId);

    //    result.Columns = GetShipMentOrderLineColumns(comapnyId);

    //    using (IDbConnection conn = Connection)
    //    {
    //        string sQuery = "sm.Spc_ShipMentOrder_GetPage";
    //        conn.Open();
    //        result.Data = (await conn.QueryAsync<ShipMentOrderGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure)).ToList();
    //    }

    //    return result;
    //}

    public GetColumnsViewModel GetShipMentOrderLineColumns(int companyId)
    {
        var list = new GetColumnsViewModel
        {
            Title = "جزییات حمل",
            Classes = "group-box-orange",
            ActionType = "inline",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "headerId", IsPrimary = true, Title = "شناسه هدر", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = false, Width = 5
                },
                new()
                {
                    Id = "orderTypeId", IsPrimary = true, Title = "نوع سفارش", Type = (int)SqlDbType.NVarChar,
                    Size = 50, IsDtParameter = false, Width = 5
                },
                new()
                {
                    Id = "rowNumber", IsPrimary = true, Title = "شماره سطر", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = false, IsFilterParameter = false, Width = 5
                },
                new()
                {
                    Id = "shipmentMethodId", Title = "نوع حمل", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 5, InputType = "select",
                    Inputs = _ShipmentMethodRepository.GetDropDown("sm").Result.ToList()
                },
                new()
                {
                    Id = "vendorId", Title = "تامین کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 5, InputType = "select",
                    Inputs = _VendorRepository.GetDropDown("", companyId).Result, IsSelect2 = true
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "edit", Title = "ویرایش", ClassName = "btn green_outline_1 ml-1", IconName = "fa fa-edit"
                },
                new()
                {
                    Name = "delete", Title = "حذف", ClassName = "btn maroon_outline ml-1", IconName = "fa fa-trash"
                }
            }
        };

        return list;
    }

    public async Task<MyResultPage<ShipMentOrderGetPage>> GetShipMentOrderRecordByIds(GetRecordByIds model)
    {
        var result = new MyResultPage<ShipMentOrderGetPage>
        {
            Data = new ShipMentOrderGetPage()
        };
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            result.Data = await conn.QueryFirstOrDefaultAsync<ShipMentOrderGetPage>(sQuery, new
            {
                TableName = "sm.ShipMentOrder",
                Filter =
                    $"PersonOrderId={model.HeaderID} AND OrderTypeID={model.OrderTypeID} AND RowNumber={model.RowNumber}"
            }, commandType: CommandType.StoredProcedure);
        }

        //result.Data.OrderDatePersian = result.Data.OrderDate != null ? result.Data.OrderDate.ToPersianDateStringNull() : "";
        return result;
    }

    public async Task<MyResultStatus> ShipMentOrderSave(ShipMentOrderGetPage model)
    {
        var result = new MyResultStatus();
        using (var conn = Connection)
        {
            var sQuery = "sm.Spc_ShipMentOrder_InsUpd";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                model.Opr,
                model.OrderTypeId,
                PersonOrderId = model.HeaderId,
                model.RowNumber,
                model.ShipmentMethodId,
                model.VendorId
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = true;
        return result;
    }

    public virtual async Task<MyResultQuery> DeleteShipMentOrder(string filter)
    {
        var result = new MyResultQuery();

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecordWithFilter";
            conn.Open();
            await conn.ExecuteAsync(
                sQuery, new
                {
                    TableName = "sm.ShipMentOrder",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = true;
        return result;
    }

    #endregion
}