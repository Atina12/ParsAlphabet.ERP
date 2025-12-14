using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.SM.SalesPersonLine;
using ParsAlphabet.ERP.Application.Interfaces.CR;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Application.Interfaces.SM.SalesPersonLine;
using ParsAlphabet.ERP.Application.Interfaces.WH;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.Currency;
using ParsAlphabet.ERP.Infrastructure.Implantation.HR.Employee;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM.ReturnReason;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.Item;
using Validation = ParsAlphabet.ERP.Application.Dtos.FormPlate1.Validation;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.SM.SalesPersonLine;

public class PersonInvoiceLineRepository : IPersonInvoiceLineRepository
{
    private readonly ICompanyRepository _CompanyRepository;
    private readonly IConfiguration _config;
    private readonly ICRRepository _CRRepository;
    private readonly CurrencyRepository _CurrencyRepository;
    private readonly EmployeeRepository _EmployeeRepository;
    private readonly ItemRepository _ItemRepository;
    private readonly ReturnReasonRepository _ReturnReasonRepository;
    private readonly IWHRepository _WHRepository;

    public PersonInvoiceLineRepository(
        IConfiguration config,
        ICRRepository CRRepository,
        EmployeeRepository EmployeeRepository,
        CurrencyRepository CurrencyRepository,
        ReturnReasonRepository ReturnReasonRepository,
        ItemRepository ItemRepository,
        IWHRepository WHRepository,
        ICompanyRepository CompanyRepository)
    {
        _config = config;
        _CRRepository = CRRepository;
        _EmployeeRepository = EmployeeRepository;
        _CurrencyRepository = CurrencyRepository;
        _ReturnReasonRepository = ReturnReasonRepository;
        _ItemRepository = ItemRepository;
        _WHRepository = WHRepository;
        _CompanyRepository = CompanyRepository;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model)
    {
        model.PageNo = 0;
        model.PageRowsCount = 0;

        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                GetHeaderColumns(model.CompanyId).DataColumns.Where(x => x.IsDtParameter && x.Id != "action")
                    .Select(z => z.Title))
        };
        var getPage = await Display(model);
        //result.Rows = (from p in getPage.Data
        //               select new
        //               {
        //                   p.Id,
        //                   p.CurrencyName,
        //                   p.PersonGroupTypeName,
        //                   p.PersonId,
        //                   p.PersonName,
        //                   p.EmployeeId,
        //                   p.EmployeeName,
        //                   p.UserFullName,
        //                   p.OrderDatePersian,
        //                   p.CreateDatePersian
        //               });
        return result;
    }

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
                    Filter = $"CompanyId={CompanyId}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<MyResultPage<List<PersonOrderList>>> GetPersonOrderList(GetPersonOrderList model)
    {
        var result = new MyResultPage<List<PersonOrderList>>
        {
            Data = new List<PersonOrderList>()
        };

        var parameters = new DynamicParameters();
        parameters.Add("BranchId", model.BranchId);
        parameters.Add("CurrencyId", model.CurrencyId);
        parameters.Add("OrderTypeId", model.OrderTypeId);
        parameters.Add("PersonGroupTypeId", model.PersonGroupTypeId);
        parameters.Add("PersonId", model.PersonId);
        parameters.Add("OfficialInvoice", model.OfficialInvoice);
        parameters.Add("CompanyId", model.CompanyId);

        using (var conn = Connection)
        {
            var sQuery = "[sm].[Spc_PersonOrderHeader_GetList]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<PersonOrderList>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        return result;
    }

    public async Task<MyResultPage<List<PersonOrderLineList>>> GetPersonOrderLineList(GetPersonOrderLineList model)
    {
        var result = new MyResultPage<List<PersonOrderLineList>>
        {
            Data = new List<PersonOrderLineList>()
        };

        using (var conn = Connection)
        {
            var sQuery = "[sm].[Spc_PersonOrderLine_GetList]";
            conn.Open();
            result.Data = (await conn.QueryAsync<PersonOrderLineList>(sQuery, new
            {
                // PersonOrdersHeaderList = Convertor.ToDataTable(model.GetPersonOrderLines)
            }, commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultQuery> AllocatePersonOrderLine(AllocatePersonOrderLineList model)
    {
        var result = new MyResultQuery();

        using (var conn = Connection)
        {
            var sQuery = "[sm].[Spc_PersonInvoiceList_InsUpd]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                model.HeaderId,
                model.CompanyId
                // PersonOrdersLineList = Convertor.ToDataTable(model.AllocatePersonOrderLines)
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;

        return result;
    }

    #region PersonOrder

    public GetColumnsViewModel GetHeaderColumns(int CompanyId)
    {
        var list = new GetColumnsViewModel
        {
            Title = "مشخصات صورتحساب",
            Classes = "group-box-green",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "invoiceTypeId", Title = "نوع سفارش", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 2, Editable = false, InputType = "select",
                    Inputs = new List<MyDropDownViewModel>
                    {
                        new() { Id = 45, Name = "فروش" },
                        new() { Id = 46, Name = "برگشت از فروش" }
                    }
                },
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
                    Id = "personTypeId", Title = "نوع ذینفع", Type = (int)SqlDbType.NVarChar, Size = 30,
                    IsDtParameter = true, Width = 2, Editable = true, InputType = "select",
                    Inputs = _CRRepository.PersonGroupType_GetDropDown().Result, IsSelect2 = true, IsFocus = true
                },
                new()
                {
                    Id = "personId", Title = "ذینفع", Type = (int)SqlDbType.Int, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 3, Editable = true, InputType = "select",
                    Inputs = new List<MyDropDownViewModel>(), IsSelect2 = true
                },
                new()
                {
                    Id = "branchId", Title = "شماره شعبه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = false, Width = 2, Editable = false
                },
                new()
                {
                    Id = "invoiceId", Title = "شماره برگه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = false, Width = 2, Editable = false
                },
                new()
                {
                    Id = "invoiceDatePersian", Title = "تاریخ صورتحساب", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, Width = 2, Editable = true,
                    InputType = "datepersian", InputMask = new InputMask { Mask = "'mask':'9999/99/99'" }
                },
                new()
                {
                    Id = "employeeId", Title = "کارمند", Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true,
                    IsFilterParameter = false, Width = 3, Editable = true, InputType = "select",
                    Inputs = _EmployeeRepository.GetDropDown("", CompanyId).Result, IsSelect2 = true
                },
                new()
                {
                    Id = "returnReasonId", Title = "دلیل برگشت از فروش", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 2, Editable = true, InputType = "select",
                    Inputs = _ReturnReasonRepository.GetDropDown("sm", $"CompanyId={CompanyId}").Result.ToList()
                },
                new()
                {
                    Id = "note", Title = "توضیحات", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    Width = 4, Editable = true
                },
                new()
                {
                    Id = "officialInvoice", Title = "صورتحساب رسمی", Type = (int)SqlDbType.Bit, Size = 1,
                    IsDtParameter = true, Width = 2, Align = "center", Editable = false, IsFocus = true,
                    InputType = "checkbox"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 12 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "header_update", Title = "ویرایش", ClassName = "btn btn-success", IconName = "fa fa-edit"
                },
                new()
                {
                    Name = "allocatePersonOrder", Title = "تخصیص سفارش", ClassName = "btn btn-orange ml-1",
                    IconName = "fa fa-check"
                }
            }
        };

        return list;
    }

    public async Task<MyResultPage<PersonInvoiceLineGetPage>> Display(NewGetPageViewModel model)
    {
        var result = new MyResultPage<PersonInvoiceLineGetPage>
        {
            Data = new PersonInvoiceLineGetPage()
        };
        var parameters = new DynamicParameters();

        parameters.Add("Id", model.Form_KeyValue[0]?.ToString());
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetHeaderColumns(model.CompanyId);

        using (var conn = Connection)
        {
            var sQuery = "[sm].[Spc_PersonInvoice_Display]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<PersonInvoiceLineGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).FirstOrDefault();
        }

        if (!string.IsNullOrEmpty(result.Data.JsonInvoiceLine))
        {
            result.Data.JsonInvoiceLineList = new MyResultPage<List<InvoiceLines>>();
            result.Data.JsonInvoiceLineList.Data =
                JsonConvert.DeserializeObject<List<InvoiceLines>>(result.Data.JsonInvoiceLine);
            result.Data.JsonInvoiceLineList.Columns = GetInvoiceLineColumns(model.CompanyId);
            result.Data.JsonInvoiceLineList.HeaderColumns = GetInvoiceLineHeaderColumns(model.CompanyId);

            result.Data.JsonInvoiceLineList.CurrentPage = model.PageNo;
            result.Data.JsonInvoiceLineList.TotalRecordCount = result.Data.JsonInvoiceLineList.Data.Count();
            if (result.Data.JsonInvoiceLineList.TotalRecordCount % 15 == 0)
                result.Data.JsonInvoiceLineList.MaxPageCount =
                    Convert.ToInt32(result.Data.JsonInvoiceLineList.TotalRecordCount / 15);
            else
                result.Data.JsonInvoiceLineList.MaxPageCount =
                    Convert.ToInt32(result.Data.JsonInvoiceLineList.TotalRecordCount / 15) + 1;
            result.Data.JsonInvoiceLineList.PageStartRow = (model.PageNo - 1) * model.PageRowsCount + 1;
            result.Data.JsonInvoiceLineList.PageEndRow = result.Data.JsonInvoiceLineList.PageStartRow +
                result.Data.JsonInvoiceLineList.Data.Count - 1;
        }

        var defaultCompanyCurrency = _CompanyRepository.GetCompanyInfo().Result.DefaultCurrencyId;
        if (defaultCompanyCurrency != result.Data.CurrencyId && !string.IsNullOrEmpty(result.Data.JsonInvoiceLine))
        {
            var exchangeRate = result.Data.JsonInvoiceLineList.Columns.DataColumns.Where(a => a.Id == "exchangeRate")
                .FirstOrDefault();
            exchangeRate.IsDtParameter = true;
        }

        return result;
    }

    #endregion

    #region OrderLine

    public async Task<MyResultPage<List<InvoiceLines>>> GetInvoiceLinePage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<InvoiceLines>>
        {
            Data = new List<InvoiceLines>()
        };

        //int totalRecord = 0;
        var p_currencyId = Convert.ToInt32(model.Form_KeyValue[1]?.ToString());
        var p_rowNumber = 0;
        var p_itemId = 0;
        var p_itemName = "";
        var p_quantity = 0;
        var p_price = 0;
        var p_itemTypeName = "";
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

        var parameters = new DynamicParameters();
        parameters.Add("IsSecondLang", MyClaim.IsSecondLang);
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("HeaderId", model.Form_KeyValue[0]?.ToString());
        parameters.Add("RowNumber", p_rowNumber);
        parameters.Add("ItemTypeName", p_itemTypeName);
        parameters.Add("ItemName", p_itemName);
        parameters.Add("Quantity", p_quantity);
        parameters.Add("Price", p_price);
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetInvoiceLineColumns(model.CompanyId);
        result.HeaderColumns = GetInvoiceLineHeaderColumns(model.CompanyId);

        using (var conn = Connection)
        {
            var sQuery = "[sm].[Spc_PersonInvoiceLine_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<InvoiceLines>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        var defaultCompanyCurrency = _CompanyRepository.GetCompanyInfo().Result.DefaultCurrencyId;
        if (defaultCompanyCurrency != p_currencyId)
        {
            var exchangeRate = result.Columns.DataColumns.Where(a => a.Id == "exchangeRate").FirstOrDefault();
            exchangeRate.IsDtParameter = true;
        }


        return result;
    }

    //public async Task<MyResultPage<List<InvoiceLines>>> GetInvoiceLinePrice(List<TitleValue<long>> model, int CompanyId)
    //{
    //    var result = new MyResultPage<List<InvoiceLines>>
    //    {
    //        Data = new List<InvoiceLines>()
    //    };

    //    var p_itemId = Convert.ToInt32(model.Where(a => a.Title == "ItemId").FirstOrDefault().Value);
    //    var p_itemTypeId = Convert.ToInt32(model.Where(a => a.Title == "ItemTypeId").FirstOrDefault().Value);
    //    var p_invoiceTypeId = Convert.ToInt32(model.Where(a => a.Title == "InvoiceTypeId").FirstOrDefault().Value);
    //    var p_currencyId = Convert.ToInt32(model.Where(a => a.Title == "CurrencyId").FirstOrDefault().Value);
    //    var p_Quantity = Convert.ToInt32(model.Where(a => a.Title == "Quantity").FirstOrDefault().Value);
    //    var p_Price = Convert.ToDecimal(model.Where(a => a.Title == "Price").FirstOrDefault().Value);
    //    var p_DiscountAmount = Convert.ToInt32(model.Where(a => a.Title == "DiscountAmount").FirstOrDefault().Value);
    //    var p_TodayDate = DateTime.Now;

    //    var parameters = new DynamicParameters();

    //    parameters.Add("ItemId", p_itemId);
    //    parameters.Add("ItemTypeId", p_itemTypeId);
    //    parameters.Add("CurrencyId", p_currencyId);
    //    parameters.Add("InvoiceTypeId", p_invoiceTypeId);
    //    parameters.Add("Quantity", p_Quantity);
    //    parameters.Add("Price", p_Price);
    //    parameters.Add("DiscountAmount", p_DiscountAmount);
    //    parameters.Add("TodayDate", DateTime.Now);
    //    parameters.Add("CompanyId", CompanyId);

    //    result.Columns = GetInvoiceLineColumns(CompanyId);

    //    using (var conn = Connection)
    //    {
    //        var sQuery = "[sm].[Spc_PersonInvoiceLine_Prices]";
    //        conn.Open();
    //        result.Data =
    //            (await conn.QueryAsync<InvoiceLines>(sQuery, parameters, commandType: CommandType.StoredProcedure))
    //            .ToList();
    //    }

    //    return result;
    //}

    public GetColumnsViewModel GetInvoiceLineColumns(int CompanyId)
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
                    Id = "headerId", IsPrimary = true, Title = "شناسه هدر", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = false, Width = 5
                },
                new()
                {
                    Id = "invoiceTypeId", Title = "نوع سفارش", Type = (int)SqlDbType.TinyInt, IsDtParameter = false,
                    Width = 5
                },
                new()
                {
                    Id = "invoiceId", Title = "شناسه", Type = (int)SqlDbType.TinyInt, IsDtParameter = false, Width = 0
                },
                new()
                {
                    Id = "rowNumber", IsPrimary = true, Title = "شماره سطر", Type = (int)SqlDbType.SmallInt,
                    IsDtParameter = true, IsFilterParameter = true, Width = 4, HeaderReadOnly = true
                },
                new()
                {
                    Id = "itemTypeName", Title = "نوع آیتم", Type = (int)SqlDbType.NVarChar, Size = 30,
                    IsDtParameter = false, Width = 6, IsFilterParameter = true, InputType = "select",
                    Inputs = _WHRepository.ItemTypeIsItem_GetDropDown().Result
                },
                new()
                {
                    Id = "itemId", Title = "کد", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 12,
                    IsFilterParameter = true, InputType = "select",
                    Inputs = _ItemRepository.GetDropDown("", CompanyId).Result, IsSelect2 = true
                },
                new()
                {
                    Id = "itemName", Title = "نام آیتم", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsFilterParameter = true, IsDtParameter = false, Width = 6, InputType = "select",
                    Inputs = _WHRepository.ItemTypeIsItem_GetDropDown().Result
                },
                new()
                {
                    Id = "quantity", Title = "تعداد", Type = (int)SqlDbType.SmallInt, IsDtParameter = true,
                    IsFilterParameter = false, Width = 5, InputType = "number", HasSumValue = true,
                    Validations = new List<Validation> { new() { ValidationName = "data-parsley-max", Value1 = "50" } }
                },
                new()
                {
                    Id = "price", Title = "نرخ", Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true,
                    IsCommaSep = true, Width = 5, InputType = "money", Validations = new List<Validation>
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
                    IsFilterParameter = false, IsCommaSep = true, Width = 7, InputType = "money", HasSumValue = true,
                    HeaderReadOnly = true
                },
                new()
                {
                    Id = "exchangeRate", Title = "نرخ تسعیر", Type = (int)SqlDbType.Int, Size = 11,
                    IsDtParameter = false, IsFilterParameter = false, IsCommaSep = true, Width = 7, InputType = "money",
                    HeaderReadOnly = true
                },
                new()
                {
                    Id = "discAmount", Title = "تخفیف", Type = (int)SqlDbType.Int, IsCommaSep = true,
                    InputType = "money", IsDtParameter = true, Width = 7, HasSumValue = true
                },
                new()
                {
                    Id = "discPercent", Title = "درصد تخفیف", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsCommaSep = true, Width = 5, IsDisplayItem = true
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
                    IsDtParameter = true, IsCommaSep = true, InputType = "money", IsFilterParameter = false, Width = 5,
                    HeaderReadOnly = true, HasSumValue = true
                },
                new()
                {
                    Id = "vatPer", Title = "درصد ارزش افزوده", Type = (int)SqlDbType.Int, Size = 20,
                    IsFilterParameter = false, Width = 5, IsDisplayItem = true
                },
                new()
                {
                    Id = "netAmountPlusVAT", Title = "مبلغ با ارزش افزوده", Type = (int)SqlDbType.Int, Size = 20,
                    IsDtParameter = true, IsFilterParameter = false, IsCommaSep = true, Width = 7, InputType = "money",
                    HasSumValue = true, HeaderReadOnly = true
                },
                new()
                {
                    Id = "priceIncludingVAT", Title = "قیمت مصرف کننده", Type = (int)SqlDbType.Bit, Size = 11,
                    IsDtParameter = true, IsFilterParameter = false, Width = 6, InputType = "checkbox",
                    HeaderReadOnly = true
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

    public GetColumnsViewModel GetInvoiceLineHeaderColumns(int CompanyId)
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "headerId", IsPrimary = true, Title = "شناسه هدر", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = false, Width = 5
                },
                new()
                {
                    Id = "invoiceTypeId", Title = "نوع سفارش", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = false, Width = 5
                },
                new()
                {
                    Id = "invoiceId", Title = "شناسه", Type = (int)SqlDbType.TinyInt, IsDtParameter = false, Width = 0
                },
                new()
                {
                    Id = "rowNumber", IsPrimary = true, Title = "شماره سطر", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = false, IsFilterParameter = true, Width = 4, HeaderReadOnly = true
                },
                new()
                {
                    Id = "itemTypeName", Title = "نوع آیتم", Type = (int)SqlDbType.NVarChar, Size = 30,
                    IsDtParameter = true, Width = 2, InputType = "select",
                    Inputs = _WHRepository.ItemTypeIsItem_GetDropDown().Result
                },
                new()
                {
                    Id = "itemId", Title = "کد", Type = (int)SqlDbType.NVarChar, Size = 30, IsDtParameter = true,
                    Width = 3, IsFilterParameter = true, InputType = "select",
                    Inputs = _ItemRepository.GetDropDown("", CompanyId).Result, IsSelect2 = true
                },
                new()
                {
                    Id = "itemName", Title = "نام آیتم", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsFilterParameter = true, IsDtParameter = false, Width = 6, InputType = "select",
                    Inputs = _WHRepository.ItemTypeIsItem_GetDropDown().Result
                },
                new()
                {
                    Id = "quantity", Title = "تعداد", Type = (int)SqlDbType.Int, Size = 100, IsDtParameter = true,
                    IsFilterParameter = false, Width = 1, InputType = "number", HasSumValue = true,
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
                    IsFilterParameter = false, IsCommaSep = true, Width = 2, InputType = "money", HasSumValue = true,
                    HeaderReadOnly = true
                },
                new()
                {
                    Id = "exchangeRate", Title = "نرخ تسعیر", Type = (int)SqlDbType.Int, Size = 11,
                    IsDtParameter = false, IsFilterParameter = false, IsCommaSep = true, Width = 2, InputType = "money",
                    HeaderReadOnly = true
                },
                new()
                {
                    Id = "discAmount", Title = "تخفیف", Type = (int)SqlDbType.Int, Size = 100, IsCommaSep = true,
                    InputType = "money", IsDtParameter = true, Width = 2
                },
                new()
                {
                    Id = "discPercent", Title = "درصد تخفیف", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsCommaSep = true, Width = 2, IsDisplayItem = true
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
                    IsDtParameter = true, IsCommaSep = true, InputType = "money", IsFilterParameter = false, Width = 2,
                    HeaderReadOnly = true
                },
                new()
                {
                    Id = "vatPer", Title = "درصد ارزش افزوده", Type = (int)SqlDbType.Int, Size = 20,
                    IsFilterParameter = false, Width = 2, IsDisplayItem = true
                },
                new()
                {
                    Id = "netAmountPlusVAT", Title = "مبلغ با ارزش افزوده", Type = (int)SqlDbType.Int, Size = 20,
                    IsDtParameter = true, IsFilterParameter = false, IsCommaSep = true, Width = 2, InputType = "money",
                    HasSumValue = true, HeaderReadOnly = true
                },
                new()
                {
                    Id = "priceIncludingVAT", Title = "قیمت مصرف کننده", Type = (int)SqlDbType.Bit, Size = 11,
                    IsDtParameter = true, Width = 1, InputType = "checkbox", HeaderReadOnly = true
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "headerLineInsUp", Title = "افزودن", ClassName = "btn btn-light border-orange",
                    IconName = "fa fa-arrow-down"
                }
            }
        };

        return list;
    }

    public async Task<MyResultPage<PersonInvoiceLineGetRecord>> GetRecordByIds(GetPersonInvoiceLine model)
    {
        var result = new MyResultPage<PersonInvoiceLineGetRecord>
        {
            Data = new PersonInvoiceLineGetRecord()
        };
        using (var conn = Connection)
        {
            var sQuery = "[sm].[Spc_PersonInvoiceLine_GetRecord]";
            result.Data = await conn.QueryFirstOrDefaultAsync<PersonInvoiceLineGetRecord>(sQuery, new
            {
                Id = model.HeaderId,
                model.RowNumber
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<MyResultQuery> Insert(PersonInvoiceLineModel model)
    {
        var result = new MyResultQuery();

        if (model.DiscAmount == 0)
            model.DiscountPer = 0;
        using (var conn = Connection)
        {
            var sQuery = "[sm].[Spc_PersonInvoiceSalesLine_Ins]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Ins",
                Id = model.HeaderId,
                model.RowNumber,
                ItemTypeId = model.ItemTypeName,
                model.ItemId,
                model.Quantity,
                model.Price,
                model.VatPer,
                model.PriceIncludingVAT,
                model.ExchangeRate,
                model.DiscountPer,
                DiscountAmount = model.DiscAmount
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;

        return result;
    }

    public async Task<MyResultStatus> Update(PersonInvoiceLineModel model)
    {
        var result = new MyResultStatus();
        using (var conn = Connection)
        {
            var sQuery = "[sm].[Spc_PersonInvoiceSalesLine_Ins]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                Opr = "Upd",
                Id = model.HeaderId,
                model.RowNumber,
                ItemTypeId = model.ItemTypeName,
                model.ItemId,
                model.Quantity,
                model.Price,
                model.VatPer,
                model.PriceIncludingVAT,
                model.ExchangeRate,
                model.DiscountPer,
                DiscountAmount = model.DiscAmount
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public virtual async Task<MyResultStatus> DeleteInvoiceLine(string filter)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecordWithFilter";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(
                sQuery, new
                {
                    TableName = "sm.PersonInvoiceLine",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    #endregion
}