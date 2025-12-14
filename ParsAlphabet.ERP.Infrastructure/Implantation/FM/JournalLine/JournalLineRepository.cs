using System.Collections;
using System.Data;
using System.Reflection;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.FM.JournalAction;
using ParsAlphabet.ERP.Application.Dtos.FM.JournalLine;
using ParsAlphabet.ERP.Application.Dtos.PU.Vendor;
using ParsAlphabet.ERP.Application.Dtos.SM.Customer;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces.FM;
using ParsAlphabet.ERP.Application.Interfaces.FM.JournalLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.AccountDetail;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.AccountGL;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.AccountSGL;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.BankAccount;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.DocumentType;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.Currency;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYear;
using ParsAlphabet.ERP.Infrastructure.Implantation.PU.Vendor;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM.Customer;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.JournalLine;

public class JournalLineRepository : IJournalLineRepository
{
    private readonly IHttpContextAccessor _accessor;
    private readonly AccountDetailRepository _accountDetailRepository;
    private readonly AccountGLRepository _accountGLRepository;
    private readonly AccountSGLRepository _accountSGLRepository;
    private readonly IConfiguration _config;
    private readonly CurrencyRepository _CurrencyRepository;
    private readonly CustomerRepository _customerRepository;
    private readonly DocumentTypeRepository _documentTypeRepository;
    private readonly IFinanceRepository _financeRepository;
    private readonly FiscalYearRepository _fiscalYearRepository;
    private readonly JournalActionRepository _journalActionRepository;
    private readonly ILoginRepository _loginRepository;
    private readonly VendorRepository _vendorRepository;

    public JournalLineRepository(
        IConfiguration config, IHttpContextAccessor accessor, CurrencyRepository CurrencyRepository,
        DocumentTypeRepository documentTypeRepository, AccountGLRepository AccountGLRepository,
        AccountSGLRepository AccountSGLRepository, AccountDetailRepository AccountDetailRepository,
        IFinanceRepository financeRepository,
        VendorRepository vendorRepository,
        CustomerRepository customerRepository,
        JournalActionRepository journalActionRepository,
        FiscalYearRepository fiscalYearRepository,
        ILoginRepository loginRepository
    )
    {
        _config = config;
        _accessor = accessor;
        _CurrencyRepository = CurrencyRepository;
        _documentTypeRepository = documentTypeRepository;
        _accountGLRepository = AccountGLRepository;
        _accountSGLRepository = AccountSGLRepository;
        _accountDetailRepository = AccountDetailRepository;
        _financeRepository = financeRepository;
        _vendorRepository = vendorRepository;
        _customerRepository = customerRepository;
        _journalActionRepository = journalActionRepository;
        _fiscalYearRepository = fiscalYearRepository;
        _loginRepository = loginRepository;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public GetColumnsViewModel GetHeaderColumns(int companyId)
    {
        var list = new GetColumnsViewModel
        {
            Title = "مشخصات سند",
            Classes = "group-box-green",

            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    InputType = "number", Width = 6
                },
                new()
                {
                    Id = "branchName", Title = "شعبه", Type = (int)SqlDbType.TinyInt, IsDtParameter = true, Width = 10,
                    IsSelect2 = true, InputType = ""
                },
                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "workflowId", Title = "جریان کار", Type = (int)SqlDbType.TinyInt, Width = 2, IsPrimary = true
                },
                new()
                {
                    Id = "documentTypeId", Title = "نوع سند", IsPrimary = true, Type = (int)SqlDbType.TinyInt,
                    Editable = true, InputType = "select", IsSelect2 = true,
                    Inputs = _documentTypeRepository.GetDropDown(0).Result.ToList(), IsFocus = true, Width = 6,
                    FillType = "back"
                },
                new()
                {
                    Id = "documentTypeName", Title = "نوع سند", Type = (int)SqlDbType.TinyInt, IsDtParameter = true,
                    Width = 10, IsFilterParameter = true
                },
                new()
                {
                    Id = "headerDocumentDatePersian", Title = "تاریخ سند", Type = (int)SqlDbType.Date,
                    IsDtParameter = true, Width = 10, Editable = true, IsFocus = true, IsPrimary = true,
                    InputType = "datepersian", InputMask = new InputMask { Mask = "'mask':'9999/99/99'" }
                },
                new()
                {
                    Id = "documentNo", Title = "شماره سند", Type = (int)SqlDbType.SmallInt, IsDtParameter = true,
                    IsPrimary = true, Width = 10, InputType = "number", Editable = true
                },
                new()
                {
                    Id = "createUserFullName", Title = "کابر ایجاد کننده", Type = (int)SqlDbType.SmallInt,
                    IsDtParameter = true, Width = 10, InputType = ""
                },
                new() { Id = "bySystem", Title = "data_bySystem", IsPrimary = true },
                new()
                {
                    Id = "bySystemName", Title = "سند سیستمی", Type = (int)SqlDbType.Bit, IsDtParameter = true,
                    IsPrimary = true, Width = 10, Align = "center"
                },
                new()
                {
                    Id = "status", Title = "گام مرحله", Type = (int)SqlDbType.TinyInt, Width = 4, IsPrimary = true
                },
                new()
                {
                    Id = "statusName", Title = "گام مرحله", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10, IsFilterParameter = true
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = false, Width = 4 }
            }
        };

        return list;
    }

    public GetColumnsViewModel GetJournalLineImportExcelColumns()
    {
        var list = new GetColumnsViewModel
        {
            HasRowNumber = true,
            IsEditable = true,
            IsSelectable = true,
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "accountGLId", Title = "کل", Type = (int)SqlDbType.Int, IsDtParameter = true, Editable = true,
                    MaxLength = 4,
                    SearchPlugin = new SearchPlugin
                    {
                        SearchUrl = "/api/FM/AccountGLApi/accountGLDropDownByUser",
                        SelectColumn = "id",
                        Column = new List<SearchPluginColumn>
                        {
                            new()
                            {
                                Id = "id",
                                Name = "شناسه",
                                IsFilterParameter = true
                            },
                            new()
                            {
                                Id = "name",
                                Name = "نام",
                                IsFilterParameter = true
                            }
                        }
                    },
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-selectvalzero" },
                        new() { ValidationName = "data-parsley-min", Value1 = "1" },
                        new() { ValidationName = "data-parsley-max", Value1 = decimal.MaxValue.ToString() }
                    },
                    Width = 7, IsFocus = true, InputType = "searchplugin", IsFilterParameter = true
                },
                new()
                {
                    Id = "accountSGLId", Title = "معین", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Editable = true, MaxLength = 6,
                    SearchPlugin = new SearchPlugin
                    {
                        SearchUrl = "/api/FM/AccountSGLApi/accountSGLDropDownByUser",
                        SelectColumn = "id",
                        ModelItems = new List<string>
                        {
                            "accountGLId"
                        },
                        Column = new List<SearchPluginColumn>
                        {
                            new()
                            {
                                Id = "id",
                                Name = "شناسه",
                                IsFilterParameter = true
                            },
                            new()
                            {
                                Id = "name",
                                Name = "نام",
                                IsFilterParameter = true
                            }
                        }
                    },
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-selectvalzero" },
                        new() { ValidationName = "data-parsley-min", Value1 = "1" },
                        new() { ValidationName = "data-parsley-max", Value1 = decimal.MaxValue.ToString() }
                    },
                    Width = 7, IsFocus = true, InputType = "searchplugin", IsFilterParameter = true
                },
                new()
                {
                    Id = "accountDetailId", Title = "تفضیل", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Editable = true, MaxLength = 9,
                    SearchPlugin = new SearchPlugin
                    {
                        SearchUrl = "/api/FM/AccountDetailApi/searchold",
                        SelectColumn = "id",
                        ModelItems = new List<string>
                        {
                            "accountGLId",
                            "accountSGLId"
                        },
                        Column = new List<SearchPluginColumn>
                        {
                            new()
                            {
                                Id = "id",
                                Name = "شناسه",
                                IsFilterParameter = true
                            },
                            new()
                            {
                                Id = "name",
                                Name = "نام",
                                IsFilterParameter = true
                            }
                        }
                    },
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "data-parsley-max", Value1 = decimal.MaxValue.ToString() }
                    },
                    Width = 7, IsFocus = true, InputType = "searchplugin", IsFilterParameter = true
                },
                new()
                {
                    Id = "description", Title = "شرح سند", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Editable = true, MaxLength = 500,
                    SearchPlugin = new SearchPlugin
                    {
                        SearchUrl = "/api/FM/JournalDescriptionApi/searchold",
                        SelectColumn = "name",
                        Column = new List<SearchPluginColumn>
                        {
                            new()
                            {
                                Id = "id",
                                Name = "شناسه",
                                IsFilterParameter = true
                            },
                            new()
                            {
                                Id = "name",
                                Name = "نام",
                                IsFilterParameter = true
                            }
                        }
                    },
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "required" }
                    },
                    Width = 40, IsFocus = true, InputType = "searchplugin", IsFilterParameter = true
                },
                new()
                {
                    Id = "currencyId", Title = "ارز", Type = (int)SqlDbType.Int, IsDtParameter = true, Editable = true,
                    SearchPlugin = new SearchPlugin
                    {
                        SearchUrl = "/api/GN/CurrencyApi/search",
                        SelectColumn = "id",
                        Column = new List<SearchPluginColumn>
                        {
                            new()
                            {
                                Id = "id",
                                Name = "شناسه",
                                IsFilterParameter = true
                            },
                            new()
                            {
                                Id = "name",
                                Name = "نام",
                                IsFilterParameter = true
                            }
                        }
                    },
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "data-parsley-min", Value1 = "1" },
                        new() { ValidationName = "data-parsley-max", Value1 = int.MaxValue.ToString() },
                        new() { ValidationName = "required" }
                    },
                    Width = 7, IsFocus = true, InputType = "searchplugin", IsFilterParameter = true
                },
                new()
                {
                    Id = "exchangeRate", Title = "نرخ تسعیر", Type = (int)SqlDbType.Decimal, IsDtParameter = true,
                    Editable = true, Order = true,
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "data-parsley-min", Value1 = "1" },
                        new() { ValidationName = "data-parsley-max", Value1 = decimal.MaxValue.ToString() },
                        new() { ValidationName = "required" }, new() { ValidationName = "data-parsley-selectvalzero" }
                    },
                    Width = 7, HasSumValue = true, InputType = "money", MaxLength = 9, IsCommaSep = true
                },
                new()
                {
                    Id = "amountDebit", Title = "بدهکار", Type = (int)SqlDbType.Decimal, IsDtParameter = true,
                    Editable = true, Order = true,
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "data-parsley-max", Value1 = decimal.MaxValue.ToString() },
                        new() { ValidationName = "data-parsley-bothprices" },
                        new() { ValidationName = "data-parsley-reqprices" }
                    },
                    Width = 10, HasSumValue = true, InputType = "money", MaxLength = 16, IsCommaSep = true
                },
                new()
                {
                    Id = "amountCredit", Title = "بستانکار", Type = (int)SqlDbType.Decimal, IsDtParameter = true,
                    Editable = true, Order = true,
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "data-parsley-max", Value1 = decimal.MaxValue.ToString() },
                        new() { ValidationName = "data-parsley-bothprices" },
                        new() { ValidationName = "data-parsley-reqprices" }
                    },
                    Width = 10, HasSumValue = true, InputType = "money", MaxLength = 16, IsCommaSep = true
                },
                new()
                {
                    Id = "index", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = false,
                    InputType = "number"
                }
            }
        };

        return list;
    }


    public GetColumnsViewModel GetJournalLineSimpleColumns()
    {
        var list = new GetColumnsViewModel
        {
            Title = "لیست گردش",
            Classes = "group-box-orange",
            ActionType = "inline",
            HeaderType = "inline",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", IsPrimary = true, Title = "شناسه", Type = (int)SqlDbType.TinyInt, IsDtParameter = false,
                    HasLink = true, Order = true, Width = 8, DefaultReadOnly = true
                },

                new()
                {
                    Id = "accountGLId", Title = "کل", Type = (int)SqlDbType.Int, IsDtParameter = true, Order = true,
                    Width = 8, IsFocus = true, InputType = "number", MaxLength = 3, IsFilterParameter = true,
                    FilterType = "number", HeaderReadOnly = true
                },
                new()
                {
                    Id = "accountSGLId", Title = "معین", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 8,
                    InputType = "number", MaxLength = 3, IsFilterParameter = true, FilterType = "number",
                    HeaderReadOnly = true
                },
                new()
                {
                    Id = "accountDetailId", Title = "تفصیل", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 8,
                    InputType = "number", MaxLength = 9, IsFilterParameter = true, FilterType = "number",
                    HeaderReadOnly = true
                },

                new()
                {
                    Id = "description", Title = "شرح سند", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 38, MaxLength = 500, HeaderReadOnly = true
                },
                new()
                {
                    Id = "amountDebit", Title = "بدهکار", Type = (int)SqlDbType.Decimal, IsDtParameter = true,
                    Order = true, Width = 10, HasSumValue = true, InputType = "money", IsCommaSep = true,
                    HeaderReadOnly = true
                },
                new()
                {
                    Id = "amountCredit", Title = "بستانکار", Type = (int)SqlDbType.Decimal, IsDtParameter = true,
                    Order = true, Width = 10, HasSumValue = true, InputType = "money", IsCommaSep = true,
                    HeaderReadOnly = true
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 },
                new() { Id = "accountGLName", Title = "کل", IsDisplayItem = true },
                new() { Id = "accountSGLName", Title = "معین", IsDisplayItem = true },
                new() { Id = "accountDetailName", Title = "تفصیل", IsDisplayItem = true },
                new() { Id = "nationalCode", Title = "کد / شناسه ملی", IsDisplayItem = true },
                new() { Id = "jobTitle", Title = "عنوان شغلی", IsDisplayItem = true },
                new() { Id = "noSeriesName", Title = "گروه تفصیل", IsDisplayItem = true },
                new() { Id = "agentFullName", Title = "نام نماینده", IsDisplayItem = true },
                new() { Id = "brand", Title = "نام تجاری", IsDisplayItem = true },
                new() { Id = "idNumber", Title = "شماره ثبت", IsDisplayItem = true },
                new() { Id = "createDateTimePersian", Title = "تاریخ زمان ثبت", IsDisplayItem = true },
                new()
                {
                    Id = "userFullName", Title = "کاربر ثبت کننده", IsDisplayItem = true, IsFilterParameter = true
                },
                new() { Id = "vatIncludeStr", Title = "مشمول ارزش افزوده", IsDisplayItem = true }
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
                    Name = "journalTrialBalance", Title = "ارجاع به گزارش تراز", ClassName = "btn blue_outline_1 ml-1",
                    IconName = "fa fa-file"
                }
                //new GetActionColumnViewModel{Name="subSystemNone",Title="ارجاع به زیر سیستم",ClassName="btn blue_outline_2 ml-1",IconName="fa fa-file"},
            }
        };


        return list;
    }

    public GetColumnsViewModel GetJournalLineAdvanceColumns()
    {
        var list = new GetColumnsViewModel
        {
            Title = "لیست گردش",
            Classes = "group-box-orange",
            ActionType = "inline",
            HeaderType = "inline",
            Order = true,
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", IsPrimary = true, Title = "شناسه", Type = (int)SqlDbType.TinyInt, Order = true,
                    IsDtParameter = false, Width = 6, DefaultReadOnly = true
                },

                new()
                {
                    Id = "accountGLId", Title = "کل", Type = (int)SqlDbType.TinyInt, IsDtParameter = true, Order = true,
                    Width = 8, IsFocus = true, InputType = "number", IsFilterParameter = true, HeaderReadOnly = true
                },
                new()
                {
                    Id = "accountSGLId", Title = "معین", Type = (int)SqlDbType.SmallInt, IsDtParameter = true,
                    Width = 8, InputType = "number", IsFilterParameter = true, HeaderReadOnly = true
                },
                new()
                {
                    Id = "accountDetailId", Title = "تفصیل", Type = (int)SqlDbType.TinyInt, IsDtParameter = true,
                    Width = 8, InputType = "number", IsFilterParameter = true, HeaderReadOnly = true
                },
                new()
                {
                    Id = "description", Title = "شرح سند", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 20, MaxLength = 500, HeaderReadOnly = true
                },
                new()
                {
                    Id = "currency", InputId = "currencyId", Title = "نوع ارز", Type = (int)SqlDbType.TinyInt,
                    IsDtParameter = true, Width = 7, InputType = "select",
                    Inputs = _CurrencyRepository.GetDropDown("IsActive = 1").Result.ToList(), IsSelect2 = true,
                    HeaderReadOnly = true
                },
                new()
                {
                    Id = "exchangeRate", Title = "نرخ تسعیر ارز", Type = (int)SqlDbType.Decimal, IsDtParameter = true,
                    Width = 8, MaxLength = 100, InputType = "money", IsCommaSep = true, HeaderReadOnly = true
                },
                new()
                {
                    Id = "amountDebit", Title = "بدهکار", Type = (int)SqlDbType.Decimal, IsDtParameter = true,
                    Order = true, Width = 8, HasSumValue = true, InputType = "money", IsCommaSep = true,
                    HeaderReadOnly = true
                },
                new()
                {
                    Id = "amountCredit", Title = "بستانکار", Type = (int)SqlDbType.Decimal, IsDtParameter = true,
                    Order = true, Width = 8, HasSumValue = true, InputType = "money", IsCommaSep = true,
                    HeaderReadOnly = true
                },

                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 },

                new() { Id = "accountGLName", Title = "کل", IsDisplayItem = true },
                new() { Id = "accountSGLName", Title = "معین", IsDisplayItem = true },
                new() { Id = "accountDetailName", Title = "تفصیل", IsDisplayItem = true },
                new() { Id = "costTypeName", Title = "نوع هزینه", IsDisplayItem = true },
                new() { Id = "costObjectName", Title = "موضوع هزینه", IsDisplayItem = true },
                new() { Id = "costDriverName", Title = "محرک هزینه", IsDisplayItem = true },
                new() { Id = "nationalCode", Title = "کد / شناسه ملی", IsDisplayItem = true },
                new() { Id = "jobTitle", Title = "عنوان شغلی", IsDisplayItem = true },
                new() { Id = "noSeriesName", Title = "گروه تفصیل", IsDisplayItem = true },
                new() { Id = "agentFullName", Title = "نام نماینده", IsDisplayItem = true },
                new() { Id = "brand", Title = "نام تجاری", IsDisplayItem = true },
                new() { Id = "idNumber", Title = "شماره ثبت", IsDisplayItem = true },
                new() { Id = "createDateTimePersian", Title = "تاریخ زمان ثبت", IsDisplayItem = true },
                new()
                {
                    Id = "userFullName", Title = "کاربر ثبت کننده", IsDisplayItem = true, IsFilterParameter = true
                },
                new() { Id = "vatIncludeStr", Title = "مشمول ارزش افزوده", IsDisplayItem = true },
                new() { Id = "vatEnableStr", Title = "اعتبار ارزش افزوده", IsDisplayItem = true }
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
                    Name = "journalTrialBalance", Title = "ارجاع به گزارش تراز", ClassName = "btn blue_outline_1 ml-1",
                    IconName = "fa fa-file"
                }
            }
        };


        return list;
    }

    public async Task<MyResultPage<JournalLineGetPage>> Display(GetPageViewModel model, int userId)
    {
        var result = new MyResultPage<JournalLineGetPage>
        {
            Data = new JournalLineGetPage()
        };
        var formType = Convert.ToInt32(model.Form_KeyValue[1]?.ToString());
        var directPaging = Convert.ToInt32(model.Form_KeyValue[3]?.ToString());
        var paginationParameters = new DynamicParameters();
        long JournalId = 0;
        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "JournalLineApi",
            OprType = "VIWALL",
            UserId = userId
        };


        // check access VIWALL
        var checkAccessViewAll = await _loginRepository.GetAuthenticate(checkAuthenticate);

        if (directPaging > 0)
        {
            paginationParameters.Add("TableName", "fm.Journal");
            paginationParameters.Add("IdColumnName", "fm.Journal.Id");
            paginationParameters.Add("IdColumnValue", model.Form_KeyValue[0]?.ToString());

            var filter = string.Empty;


            if (!checkAccessViewAll.Successfull)
                filter = $"AND fm.Journal.CreateUserId={userId}";
            else
                filter = "";

            if (model.Form_KeyValue[2]?.ToString() == "1")
                filter += " AND fm.Journal.BySystem=0";


            paginationParameters.Add("FilterParam", filter);

            paginationParameters.Add("Direction", directPaging);


            using (var conn = Connection)
            {
                var sQuery = "[pb].[Spc_Tables_NextPrev]";
                conn.Open();
                JournalId = await conn.ExecuteScalarAsync<long>(sQuery, paginationParameters,
                    commandType: CommandType.StoredProcedure);
            }
        }

        var parameters = new DynamicParameters();
        parameters.Add("JournalId", JournalId == 0 ? model.Form_KeyValue[0]?.ToString() : JournalId);

        parameters.Add("IsDefaultCurrency", formType == 1 ? true : false);
        result.Columns = GetHeaderColumns(model.CompanyId);

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_Journal_Display]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<JournalLineGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).FirstOrDefault();
        }


        if (result.Data != null && !string.IsNullOrEmpty(result.Data.JsonJournalLine))
        {
            result.Data.JsonJournalLineList = new MyResultPage<List<JournalLines>>();
            result.Data.JsonJournalLineList.Data =
                JsonConvert.DeserializeObject<List<JournalLines>>(result.Data.JsonJournalLine);


            result.Data.JsonJournalLineList.CurrentPage = model.PageNo;
            result.Data.JsonJournalLineList.TotalRecordCount = result.Data.JournalLineTotalRecord;
            if (result.Data.JsonJournalLineList.TotalRecordCount % 15 == 0)
                result.Data.JsonJournalLineList.MaxPageCount =
                    Convert.ToInt32(result.Data.JsonJournalLineList.TotalRecordCount / 15);
            else
                result.Data.JsonJournalLineList.MaxPageCount =
                    Convert.ToInt32(result.Data.JsonJournalLineList.TotalRecordCount / 15) + 1;
            result.Data.JsonJournalLineList.PageStartRow = (model.PageNo - 1) * model.PageRowsCount + 1;
            result.Data.JsonJournalLineList.PageEndRow = result.Data.JsonJournalLineList.PageStartRow +
                result.Data.JsonJournalLineList.TotalRecordCount - 1;
        }
        else if (result.Data == null)
        {
            result.Data = new JournalLineGetPage();
        }

        if (formType == 2)
        {
            if (result.Data.JsonJournalLineList != null)
            {
                result.Data.JsonJournalLineList.Columns = GetJournalLineAdvanceColumns();
            }
            else
            {
                result.Data.JsonJournalLineList = new MyResultPage<List<JournalLines>>();
                result.Data.JsonJournalLineList.Columns = GetJournalLineAdvanceColumns();
            }
        }
        else
        {
            if (result.Data.JsonJournalLineList != null)
            {
                result.Data.JsonJournalLineList.Columns = GetJournalLineSimpleColumns();
            }
            else
            {
                result.Data.JsonJournalLineList = new MyResultPage<List<JournalLines>>();
                result.Data.JsonJournalLineList.Columns = GetJournalLineSimpleColumns();
            }
        }

        return result;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(GetPageViewModel model)
    {
        var id = Convert.ToInt32(model.Form_KeyValue[0]?.ToString());
        var formType = Convert.ToInt32(model.Form_KeyValue[1]?.ToString());

        var column = new GetColumnsViewModel();

        if (formType == 1)
            column = GetJournalLineDisplaySimpleColumns();
        else
            column = GetJournalLineDisplayAdvanceColumns();


        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                column.DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_JournalLine_Csv]";
            conn.Open();
            var lines = await conn.QueryAsync<JournalLines>(sQuery, new { JournalId = id, model.CompanyId },
                commandType: CommandType.StoredProcedure);

            if (formType == 1)
                result.Rows = from p in lines
                    select new
                    {
                        p.AccountGLId,
                        p.AccountSGLId,
                        p.AccountDetailId,
                        p.Description,
                        p.CurrencyId,
                        p.ExchangeRate,
                        p.AmountDebit,
                        p.AmountCredit
                    };
            else
                result.Rows = from p in lines
                    select new
                    {
                        p.AccountGLId,
                        p.AccountSGLId,
                        p.AccountDetailId,
                        p.Description,
                        p.CurrencyId,
                        p.ExchangeRate,
                        p.AmountDebit,
                        p.AmountCredit,
                        p.Amount
                    };
        }

        return result;
    }

    public async Task<MyResultPage<JournalLineGetPage>> DisplayHeader(GetPageViewModel model)
    {
        var result = new MyResultPage<JournalLineGetPage>
        {
            Data = new JournalLineGetPage()
        };
        var formType = Convert.ToInt32(model.Form_KeyValue[1]?.ToString());
        var directPaging = Convert.ToInt32(model.Form_KeyValue[2]?.ToString());
        var paginationParameters = new DynamicParameters();
        long JournalId = 0;

        var parameters = new DynamicParameters();
        parameters.Add("JournalId", JournalId == 0 ? model.Form_KeyValue[0]?.ToString() : JournalId);
        parameters.Add("IsDefaultCurrency", formType == 1 ? true : false);
        result.Columns = GetHeaderColumns(model.CompanyId);

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_JournalHeader_Display]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<JournalLineGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).FirstOrDefault();
        }

        return result;
    }

    public async Task<MyResultPage<List<JournalLines>>> GetJournalLinePage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<JournalLines>>
        {
            Data = new List<JournalLines>()
        };

        int journalId = Convert.ToInt32(model.Form_KeyValue[0]?.ToString()),
            formType = Convert.ToInt32(model.Form_KeyValue[1]?.ToString());

        string accountGLId = null, accountDetailId = null, userFullName = null, accountSGLId = null;

        switch (model.FieldItem)
        {
            case "accountGLId":
                accountGLId = model.FieldValue;
                break;
            case "accountSGLId":
                accountSGLId = model.FieldValue;
                break;
            case "accountDetailId":
                accountDetailId = model.FieldValue;
                break;
            case "userFullName":
                userFullName = model.FieldValue;
                break;
        }

        MyClaim.Init(_accessor);

        var parameters = new DynamicParameters();

        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("JournalId", journalId);
        parameters.Add("AccountGLId", accountGLId);
        parameters.Add("AccountSGLId", accountSGLId);
        parameters.Add("AccountDetailId", accountDetailId);
        parameters.Add("IsDefaultCurrency", formType == 1 ? true : false);
        parameters.Add("CreateUserName", userFullName);
        parameters.Add("CompanyId", model.CompanyId);

        if (formType == 2)
            result.Columns = GetJournalLineAdvanceColumns();
        else
            result.Columns = GetJournalLineSimpleColumns();

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_JournalLine_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<JournalLines>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        if (model.SortModel != null && !string.IsNullOrEmpty(model.SortModel.ColId) &&
            !string.IsNullOrEmpty(model.SortModel.Sort))
        {
            var res = result.Data.AsQueryable();
            result.Data = res.OrderBy(model.SortModel).ToList();
        }

        return result;
    }

    public async Task<JournalLineSum> GetJournalLineSum(NewGetPageViewModel model)
    {
        int journalId = Convert.ToInt32(model.Form_KeyValue[0]?.ToString()),
            formType = Convert.ToInt32(model.Form_KeyValue[1]?.ToString());

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_JournalLine_Sum]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<JournalLineSum>(sQuery,
                new
                {
                    JournalId = journalId,
                    IsDefaultCurrency = formType
                }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }

    public async Task<MyResultPage<JournalLineGetRecord>> GetRecordByIds(int id)
    {
        var result = new MyResultPage<JournalLineGetRecord>
        {
            Data = new JournalLineGetRecord()
        };
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            result.Data = await conn.QueryFirstOrDefaultAsync<JournalLineGetRecord>(sQuery, new
            {
                TableName = "fm.JournalLine",
                Filter = $"Id=${id}"
            }, commandType: CommandType.StoredProcedure);

            if (result != null)
                if (result.Data != null)
                {
                    if (result.Data.NatureTypeId == Convert.ToByte(AccountNatureTypes.Debit))
                    {
                        result.Data.AmountDebit = result.Data.Amount;
                        if (result.Data.ExchangeRate > 0)
                            result.Data.Amount = result.Data.Amount / result.Data.ExchangeRate;
                    }
                    else if (result.Data.NatureTypeId == Convert.ToByte(AccountNatureTypes.Credit))
                    {
                        result.Data.AmountCredit = result.Data.Amount;
                        if (result.Data.ExchangeRate > 0)
                            result.Data.Amount = result.Data.Amount / result.Data.ExchangeRate;
                    }
                }
        }

        return result;
    }

    public async Task<JournalLineFooter> GetJournalLineFooter(int companyId,int? id=null)
    {
        var result = new JournalLineFooter();

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_JournalLine_Footer]";
            result = await conn.QueryFirstOrDefaultAsync<JournalLineFooter>(sQuery, new
            {
                JournalLineId = id,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<MyResultQuery> Insert(JournalLineSingleSave model)
    {
        var resultValidation = await ValidateInsert(model);

        if (resultValidation.ListHasRow())
            return new MyResultQuery
            {
                Successfull = false,
                ValidationErrors = resultValidation
            };

        if (model.AmountCredit > 0)
        {
            model.NatureTypeId = Convert.ToByte(AccountNatureTypes.Credit);
            model.Amount = model.AmountCredit;
        }
        else if (model.AmountDebit > 0)
        {
            model.NatureTypeId = Convert.ToByte(AccountNatureTypes.Debit);
            model.Amount = model.AmountDebit;
        }

        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_JournalLine_InsUpd]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                model.Opr,
                model.Id,
                model.HeaderId,
                model.CurrencyId,
                model.AccountGLId,
                model.AccountSGLId,
                model.NoSeriesId,
                model.AccountDetailId,
                Description = model.Description.ConvertArabicAlphabet(),
                model.Amount,
                ExchangeRate = model.ExchangeRate == 0 ? 1 : model.ExchangeRate,
                model.NatureTypeId,
                model.CreateUserId,
                model.CreateDateTime,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultQuery> Update(JournalLineSingleSave model)
    {
        var resultValidation = await ValidateInsert(model);

        if (resultValidation.ListHasRow())
            return new MyResultQuery
            {
                Successfull = false,
                ValidationErrors = resultValidation
            };

        if (model.AmountCredit > 0)
        {
            model.NatureTypeId = Convert.ToByte(AccountNatureTypes.Credit);
            model.Amount = model.AmountCredit;
        }
        else if (model.AmountDebit > 0)
        {
            model.NatureTypeId = Convert.ToByte(AccountNatureTypes.Debit);
            model.Amount = model.AmountDebit;
        }

        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_JournalLine_InsUpd]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                model.Opr,
                model.Id,
                model.HeaderId,
                model.CurrencyId,
                model.AccountGLId,
                model.AccountSGLId,
                model.NoSeriesId,
                model.AccountDetailId,
                Description = model.Description.ConvertArabicAlphabet(),
                model.Amount,
                ExchangeRate = model.ExchangeRate == 0 ? 1 : model.ExchangeRate,
                model.NatureTypeId,
                model.CreateUserId,
                model.CreateDateTime,
                model.CompanyId,
                model.ModifiedUserId,
                model.ModifiedDateTime
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public virtual async Task<MyResultStatus> DeleteJournalLine(GetJournalLine model, int companyId, int userId)
    {
        var result = new MyResultStatus();

        var validateResult = await ValidateDeleteJournalLine(model, companyId);

        if (validateResult.ListHasRow())
        {
            result.Successfull = false;
            result.ValidationErrors = validateResult;
            return result;
        }

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecordWithFilter";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(
                sQuery, new
                {
                    TableName = "fm.JournalLine",
                    Filter = $"Id={model.Id}"
                }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        result.StatusMessage = !result.Successfull ? "عملیات حذف با مشکل مواجه شد" : "";


        #region ویرایش مبالغ هدر سند حسابداری با حذف لاین ها

        if (result.Status == 100)
            await GetAmountJornalLineAfterDelete(model.HeaderId, companyId);

        #endregion

        return result;
    }

    public async Task UpdateAmountCreditDebit(int journalId, int companyId, decimal amountDebit, decimal amountCredit)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_JournalAmountDebitCredit_Upd]";
            conn.Open();

            await conn.ExecuteAsync(sQuery, new
            {
                JournalId = journalId,
                CompanyId = companyId,
                AmountDebit = amountDebit,
                AmountCredit = amountCredit
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
        }
    }


    public async Task<List<int>> GetIdentitiesJournal(GetJournalPostGroup model)
    {
        var result = new List<int>();
        if (model.FromDatePersian != null || model.ToDatePersian != null)
            result = await ItemTransactionHasPostedGroup(model);
        else
            result = await HasPostedGroup(model);

        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetAccountDetail(GetAccountDetail model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_AccountDetail_ByNoSeries_GetList]";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    model.AccountGLId,
                    model.AccountSGLId
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<JournalPostGroupResultStatus>> PostGroupJournal(AddDocumentPostingGroup model)
    {
        var resultInsert = new List<JournalPostGroupResultStatus>();

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_Journal_PostingGroup_InsUpd]";


            if (!model.NotNull())
                return new List<JournalPostGroupResultStatus>
                {
                    new() { Status = -90, StatusMessage = "سطری جهت ثبت گروهی وجود ندارد" }
                };

            var modelLength = model.Journals.Count();

            for (var d = 0; d < modelLength; d++)
            {
                var doc = model.Journals[d];
                conn.Open();
                var resultPosted = await conn.QueryFirstOrDefaultAsync<JournalPostGroupResultStatus>(sQuery,
                    new
                    {
                        Opr = "INS",
                        model.UserId,
                        doc.LineJson,
                        model.CompanyId
                    }, commandType: CommandType.StoredProcedure);
                conn.Close();

                resultPosted.Successfull = resultPosted.Status == 100;

                if (!resultPosted.Successfull)
                {
                    if (model.Journals[d].Doc.IdentityType == IdentityTypePostingGroup.Treasury)

                        resultPosted.StatusMessage =
                            $"برگه خزانه شناسه {resultPosted.IdentityId} - مرحله {resultPosted.StageId}";

                    else if (model.Journals[d].Doc.IdentityType == IdentityTypePostingGroup.Purchase)

                        resultPosted.StatusMessage =
                            $"برگه خرید شناسه {resultPosted.IdentityId} - مرحله {resultPosted.StageId}";

                    else if (model.Journals[d].Doc.IdentityType == IdentityTypePostingGroup.Stock)

                        resultPosted.StatusMessage =
                            $"برگه انبار شناسه {resultPosted.IdentityId} - مرحله {resultPosted.StageId}";
                }

                resultInsert.Add(resultPosted);
            }

            return resultInsert;
        }
    }

    public async Task<MyResultStatus> UndoJournalPostGroupLine(List<GetJournalPostGroup> model)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "fm.Spc_Journal_PostingGroup_Undo";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(
                sQuery, new
                {
                    DocumentJSON = JsonConvert.SerializeObject(model)
                }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    #region Add Bulk

    public async Task<MyResultDataQuery<MyResultStatus>> ImportExcellJournalLine(ExcelJournalLineModel model,
        int userId, int currencyId, int companyId)
    {
        var result = new MyResultDataQuery<MyResultStatus>
        {
            Data = new MyResultStatus()
        };


        var validateResult = await ValidateImportExcell(model.HeaderId, model.JournalLines, userId, companyId);

        var resultQuery = new MyResultStatus
        {
            ValidationErrors = validateResult
        };

        if (validateResult.Count > 0)
            return new MyResultDataQuery<MyResultStatus>
            {
                Successfull = false,
                Data = resultQuery
            };


        var journalLine = CastBulkJournalLine(model.JournalLines, model.HeaderId, userId, companyId);

        BulkInsertJournalLine(journalLine);

        var journalId = journalLine[0].HeaderId;
        var amountDebit = journalLine.Where(j => j.NatureTypeId == (byte)AccountNatureTypes.Debit).Sum(x => x.Amount);
        var amountCredit = journalLine.Where(j => j.NatureTypeId == (byte)AccountNatureTypes.Credit).Sum(x => x.Amount);

        await UpdateAmountCreditDebit(journalId, companyId, amountDebit, amountCredit);

        return result;
    }

    #endregion

    public bool BulkInsertJournalLine(List<JournalLineModel> model)
    {
        var dt = new DataTable(typeof(JournalLineModel).Name);

        var props = typeof(JournalLineModel).GetProperties(BindingFlags.Public | BindingFlags.Instance);

        for (var i = 0; i < props.Length; i++)
        {
            var type = props[i].PropertyType.IsGenericType &&
                       props[i].PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>)
                ? Nullable.GetUnderlyingType(props[i].PropertyType)
                : props[i].PropertyType;
            dt.Columns.Add(props[i].Name, type);
        }

        for (var j = 0; j < model.Count; j++)
        {
            var values = new object[props.Length];
            for (var l = 0; l < props.Length; l++)
                values[l] = props[l].GetValue(model[j], null);

            dt.Rows.Add(values);
        }

        using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
        {
            connection.Open();

            using (var sqlBulkCopy = new SqlBulkCopy(connection))
            {
                sqlBulkCopy.ColumnMappings.Add("HeaderId", "HeaderId");
                sqlBulkCopy.ColumnMappings.Add("RowNumber", "RowNumber");
                sqlBulkCopy.ColumnMappings.Add("AccountGLId", "AccountGLId");
                sqlBulkCopy.ColumnMappings.Add("AccountSGLId", "AccountSGLId");
                sqlBulkCopy.ColumnMappings.Add("NoSeriesId", "NoSeriesId");
                sqlBulkCopy.ColumnMappings.Add("AccountDetailId", "AccountDetailId");
                sqlBulkCopy.ColumnMappings.Add("Description", "Description");
                sqlBulkCopy.ColumnMappings.Add("Amount", "Amount");
                sqlBulkCopy.ColumnMappings.Add("ExchangeRate", "ExchangeRate");
                sqlBulkCopy.ColumnMappings.Add("NatureTypeId", "NatureTypeId");
                sqlBulkCopy.ColumnMappings.Add("CreateUserId", "CreateUserId");
                sqlBulkCopy.ColumnMappings.Add("CreateDateTime", "CreateDateTime");
                sqlBulkCopy.ColumnMappings.Add("ModifiedDateTime", "ModifiedDateTime");
                sqlBulkCopy.ColumnMappings.Add("ModifiedUserId", "ModifiedUserId");
                sqlBulkCopy.ColumnMappings.Add("CurrencyId", "CurrencyId");
                sqlBulkCopy.DestinationTableName = "fm.JournalLine";
                sqlBulkCopy.WriteToServer(dt);
            }

            connection.Close();
        }

        return true;
    }

    public GetColumnsViewModel GetJournalLineDisplaySimpleColumns()
    {
        var list = new GetColumnsViewModel
        {
            Title = "لیست گردش",
            Classes = "group-box-orange",
            ActionType = "inline",
            HeaderType = "inline",
            DataColumns = new List<DataColumnsViewModel>
            {
                //  new DataColumnsViewModel { Id = "id",IsPrimary = true,Title = "شناسه", Type = (int)SqlDbType.TinyInt,IsDtParameter = true,HasLink=true,Order=true,Width=6,HeaderReadOnly=true},
                new()
                {
                    Id = "accountGLId", Title = "کل", Type = (int)SqlDbType.Int, IsDtParameter = true, Order = true,
                    Width = 6, IsFocus = true, InputType = "number", MaxLength = 3, IsFilterParameter = true
                },
                new()
                {
                    Id = "accountSGLId", Title = "معین", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 6,
                    InputType = "number", MaxLength = 3, IsFilterParameter = true
                },
                new()
                {
                    Id = "accountDetailId", Title = "تفصیل", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 6,
                    InputType = "number", MaxLength = 9, IsFilterParameter = true
                },
                new()
                {
                    Id = "description", Title = "شرح سند", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 20, MaxLength = 500
                },
                new()
                {
                    Id = "currencyId", Title = "ارز", Type = (int)SqlDbType.TinyInt, IsDtParameter = true, Width = 5,
                    InputType = "select", Inputs = _CurrencyRepository.GetDropDown("IsActive = 1").Result.ToList(),
                    IsSelect2 = true
                },
                new()
                {
                    Id = "exchangeRate", Title = "نرخ تسعیر ارز", Type = (int)SqlDbType.Decimal, IsDtParameter = true,
                    Width = 5, MaxLength = 100, InputType = "money", IsCommaSep = true
                },
                new()
                {
                    Id = "amountDebit", Title = "بدهکار", Type = (int)SqlDbType.Decimal, IsDtParameter = true,
                    Order = true, Width = 10, HasSumValue = true, InputType = "money", IsCommaSep = true
                },
                new()
                {
                    Id = "amountCredit", Title = "بستانکار", Type = (int)SqlDbType.Decimal, IsDtParameter = true,
                    Order = true, Width = 10, HasSumValue = true, InputType = "money", IsCommaSep = true
                }
            }
        };


        return list;
    }

    public GetColumnsViewModel GetJournalLineDisplayAdvanceColumns()
    {
        var list = new GetColumnsViewModel
        {
            Title = "لیست گردش",
            Classes = "group-box-orange",
            ActionType = "inline",
            HeaderType = "inline",
            Order = true,
            DataColumns = new List<DataColumnsViewModel>
            {
                // new DataColumnsViewModel { Id = "id",IsPrimary = true,Title = "شناسه", Type = (int)SqlDbType.TinyInt,Order=true,IsDtParameter=true,Width=8,HeaderReadOnly=true},

                new()
                {
                    Id = "accountGLId", Title = "کل", Type = (int)SqlDbType.TinyInt, IsDtParameter = true, Order = true,
                    Width = 6, IsFocus = true, InputType = "number", IsFilterParameter = true
                },
                new()
                {
                    Id = "accountSGLId", Title = "معین", Type = (int)SqlDbType.SmallInt, IsDtParameter = true,
                    Width = 6, InputType = "number", IsFilterParameter = true
                },
                new()
                {
                    Id = "accountDetailId", Title = "تفصیل", Type = (int)SqlDbType.TinyInt, IsDtParameter = true,
                    Width = 6, InputType = "number", IsFilterParameter = true
                },
                new()
                {
                    Id = "description", Title = "شرح سند", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 17, MaxLength = 500
                },
                new()
                {
                    Id = "currencyId", Title = "ارز", Type = (int)SqlDbType.TinyInt, IsDtParameter = true, Width = 5,
                    InputType = "select", Inputs = _CurrencyRepository.GetDropDown("IsActive = 1").Result.ToList(),
                    IsSelect2 = true
                },
                new()
                {
                    Id = "exchangeRate", Title = "نرخ تسعیر ارز", Type = (int)SqlDbType.Decimal, IsDtParameter = true,
                    Width = 5, MaxLength = 100, InputType = "money", IsCommaSep = true
                },
                new()
                {
                    Id = "amountDebit", Title = "بدهکار", Type = (int)SqlDbType.Decimal, IsDtParameter = true,
                    Order = true, Width = 7, HasSumValue = true, InputType = "money", IsCommaSep = true
                },
                new()
                {
                    Id = "amountCredit", Title = "بستانکار", Type = (int)SqlDbType.Decimal, IsDtParameter = true,
                    Order = true, Width = 7, HasSumValue = true, InputType = "money", IsCommaSep = true
                },
                new()
                {
                    Id = "amount", Title = "مبلغ ارزی", Type = (int)SqlDbType.Decimal, IsDtParameter = true, Width = 7,
                    HasSumValue = true, InputType = "money", IsCommaSep = true, HeaderReadOnly = true
                }
            }
        };


        return list;
    }

    public async Task GetAmountJornalLineAfterDelete(int HeaderId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetTable]";
            conn.Open();

            var res = await conn.QueryAsync<GetJournalLineSum>(sQuery, new
            {
                TableName = "fm.journalline",
                IdColumnName = "Id",
                ColumnNameList = "NatureTypeId,Amount",
                Filter = $"HeaderId={HeaderId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            var amountDebit = res.Where(j => j.NatureTypeId == (byte)AccountNatureTypes.Debit).Sum(x => x.Amount);
            var amountCredit = res.Where(j => j.NatureTypeId == (byte)AccountNatureTypes.Credit).Sum(x => x.Amount);

            await UpdateAmountCreditDebit(HeaderId, companyId, amountDebit, amountCredit);
        }
    }

    public async Task<List<string>> ValidateDeleteJournalLine(GetJournalLine model, int companyId)
    {
        var error = new List<string>();

        if (model == null)
        {
            error.Add("درخواست معتبر نمی باشد");
            return error;
        }

        await Task.Run(async () =>
        {
            var currentActionId = await GetActionIdByIdentityId(model.HeaderId);

            #region برگه جاری مجوز حذف دارد؟

            var getTreasuryAction = new GetJournalAction
            {
                CompanyId = companyId,
                StageId = model.StageId,
                WorkflowId = model.WorkflowId,
                ActionId = currentActionId
            };

            var journalStageAction = await _journalActionRepository.GetJournalAction(getTreasuryAction);

            if (!journalStageAction.IsDeleteLine) error.Add("مجاز به حذف سطر در این گام نمی باشید");

            #endregion

            #region بررسی وضعیت دوره مالی

            var journal = GetJournalInfo(model.HeaderId, companyId);
            var date = journal.Result;
            var resultCheckFiscalYear = await _fiscalYearRepository.GetFicalYearStatusByDate(date, companyId);

            if (!resultCheckFiscalYear.Successfull)
                error.Add(resultCheckFiscalYear.StatusMessage);

            #endregion
        });

        return error;
    }

    public async Task<DateTime> GetJournalInfo(int Id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<DateTime>(
                sQuery, new
                {
                    TableName = "fm.Journal",
                    ColumnName = "DocumentDate",
                    Filter = $"Id={Id} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }


    public async Task<byte> GetActionIdByIdentityId(int IdentityId)
    {
        using (var conn = Connection)
        {
            byte result = 0;
            var sQuery = "[pb].[Spc_Tables_GetTable]";
            conn.Open();

            result = await conn.QueryFirstOrDefaultAsync<byte>(sQuery, new
            {
                TableName = "fm.Journal",
                IdColumnName = "ActionId",
                ColumnNameList = "ActionId",
                Filter = $"Id={IdentityId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }


    public async Task<List<int>> HasPostedGroup(GetJournalPostGroup model)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.QueryAsync<int>(
                sQuery, new
                {
                    TableName = "fm.JournalPostedGroup",
                    ColumnName = "JournalLineId",
                    Filter = $"IdentityId={model.IdentityId} AND StageId={model.StageId}"
                }, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }
    }

    public async Task<List<int>> ItemTransactionHasPostedGroup(GetJournalPostGroup model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_ItemTransactionPosingGroup]";
            conn.Open();
            var result = await conn.QueryAsync<int>(
                sQuery, new
                {
                    model.FromDate,
                    model.ToDate
                }, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }
    }

    public async Task<bool> CheckExistJournalLine(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "fm.JournalLine",
                ColumnName = "Id",
                Filter = $"HeaderId={id}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result > 0;
        }
    }


    public List<JournalLineModel> CastBulkJournalLine(List<JournalLineSingleSave> model, int headerId, int userId,
        int companyId)
    {
        var query = model.Select((r, i) => new JournalLineModel
        {
            AccountDetailId = r.AccountDetailId,
            AccountGLId = r.AccountGLId,
            AccountSGLId = r.AccountSGLId,
            Amount = r.AmountCredit > 0 ? r.AmountCredit : r.AmountDebit,
            CompanyId = r.CompanyId,
            CreateDateTime = r.CreateDateTime,
            CreateUserId = userId,
            CurrencyId = r.CurrencyId,
            Description = r.Description.ConvertArabicAlphabet(),
            ExchangeRate = r.ExchangeRate == 0 ? 1 : r.ExchangeRate,
            HeaderId = headerId,
            ModifiedDateTime = r.ModifiedDateTime,
            ModifiedUserId = r.ModifiedUserId,
            NatureTypeId = r.AmountCredit > 0 ? (byte)AccountNatureTypes.Credit : (byte)AccountNatureTypes.Debit,
            NoSeriesId = _financeRepository.GetNoSeriesIdAccountDetailSync(r.AccountDetailId, companyId),
            RowNumber = i + 1
        }).ToList();

        return query;
    }

    public async Task<List<string>> ValidateImportExcell(int journalId, List<JournalLineSingleSave> model, int userId,
        int companyId)
    {
        var error = new List<string>();

        if (!model.ListHasRow())
        {
            error.Add("موردی برای ثبت وجود ندارد");
            return error;
        }

        if (journalId == 0)
        {
            error.Add($"شناسه سند حسابداری ({journalId}) معتبر نمی باشد");
            return error;
        }

        if (await CheckExistJournalLine(journalId))
        {
            error.Add("برگه دارای سطر می باشد مجاز به ایمپورت اکسل نمی باشید");
            return error;
        }

        var accountGLIdModel = model.Select(x => x.AccountGLId).Distinct().ToList();
        var accountGlIdDbActive = await _accountGLRepository.GetAll();
        var accountGLExceptList = accountGLIdModel.Except(accountGlIdDbActive);


        var accountSGLIdModel = model.Select(x => x.AccountSGLId).Distinct().ToList();
        var accountSGlIdDbActive = await _accountSGLRepository.GetAll();
        var accountSGLExceptList = accountSGLIdModel.Except(accountSGlIdDbActive);


        var accountDetailIdModel =
            model.Where(x => x.AccountDetailId != 0).Select(x => x.AccountDetailId).Distinct().ToList();
        var accountDetailIdDb = await _accountDetailRepository.GetAll(true);
        var accountDetailExceptList = accountDetailIdModel.Except(accountDetailIdDb);

        //کل هایی که وجود ندارد
        if (accountGLExceptList.Count() > 0)
            error.Add((accountGLExceptList.Count() == 1 ? " کد کل " : " کدهای کل ") +
                      string.Join(",", accountGLExceptList) + " معتبر نمی باشد");

        //معین هایی که وجود ندارد
        if (accountSGLExceptList.Count() > 0)
            error.Add((accountSGLExceptList.Count() == 1 ? " کد معین " : " کدهای معین ") +
                      string.Join(",", accountSGLExceptList) + " معتبر نمی باشد ");

        //تفصیل هایی که وجود ندارد

        if (accountDetailExceptList.Count() > 0)
            error.Add((accountDetailExceptList.Count() == 1 ? " کد تفصیل " : " کدهای تفصیل ") +
                      string.Join(",", accountDetailExceptList) + " معتبر نمی باشد ");

        var distinctModel = model.Select(a => new { a.AccountGLId, a.AccountSGLId, a.AccountDetailId }).Distinct()
            .ToList();

        var strcheckSGLRequired = "";
        var strCheckAccessGLSGL = "";
        var strCheckGLSGLAccountDetail = "";

        var listNotRequiredAccountDetail = new List<GetAccountDetail>();
        var listRequiredAccountDetail = new List<GetAccountDetail>();
        var listNotAccess = new List<GetAccountDetail>();

        for (var i = 0; i < distinctModel.Count; i++)
        {
            //بررسی عدم دسترسی کاربر به کل و معین
            var tempUserAccountSGl = await _accountSGLRepository.GetAllUserAccountSGLs(distinctModel[i].AccountGLId,
                distinctModel[i].AccountSGLId, null, userId, companyId);

            if (tempUserAccountSGl.Count == 0)
            {
                listNotAccess.Add(new GetAccountDetail
                {
                    AccountGLId = distinctModel[i].AccountGLId, AccountSGLId = distinctModel[i].AccountSGLId,
                    AccountDetailId = distinctModel[i].AccountDetailId
                });
                strCheckAccessGLSGL +=
                    $"کل : {distinctModel[i].AccountGLId} و معین : {distinctModel[i].AccountSGLId}/  ";
            }

            var accountDetailRequired =
                await _accountSGLRepository.GetAccountDetailRequired(distinctModel[i].AccountSGLId,
                    distinctModel[i].AccountGLId, companyId);

            if (accountDetailRequired == "3" && distinctModel[i].AccountDetailId != 0)
            {
                listNotRequiredAccountDetail.Add(new GetAccountDetail
                {
                    AccountGLId = distinctModel[i].AccountGLId, AccountSGLId = distinctModel[i].AccountSGLId,
                    AccountDetailId = distinctModel[i].AccountDetailId
                });
                strcheckSGLRequired +=
                    $" کد کل : {distinctModel[i].AccountGLId} و معین : {distinctModel[i].AccountSGLId}/ ";
            }
        }

        var allowedList = distinctModel.Select(x => new GetAccountDetail
                { AccountGLId = x.AccountGLId, AccountSGLId = x.AccountSGLId, AccountDetailId = x.AccountDetailId })
            .Except(listNotAccess);
        allowedList =
            allowedList.Select(x => new GetAccountDetail
                    { AccountGLId = x.AccountGLId, AccountSGLId = x.AccountSGLId, AccountDetailId = x.AccountDetailId })
                .Except(listNotRequiredAccountDetail);

        allowedList = allowedList.Where(a => a.AccountDetailId != 0).ToList();

        var resultExcept = await _accountSGLRepository.GetExceptGLSGLNoSeries(allowedList);


        for (var e = 0; e < resultExcept.Count; e++)
        {
            var item = resultExcept[e];
            strCheckGLSGLAccountDetail +=
                $"کد کل : {item.AccountGLId} و کد معین : {item.AccountSGLId} و تفصیل : {item.AccountDetailId} /";
        }


        if (!string.IsNullOrEmpty(strCheckAccessGLSGL))
            error.Add($"کاربر به کدهای مقابل دسترسی ندارد: {strCheckAccessGLSGL}");

        if (!string.IsNullOrEmpty(strcheckSGLRequired))
            error.Add($"تنظیمات تفضیل *ندارد* می باشد:{strcheckSGLRequired}");

        if (!string.IsNullOrEmpty(strCheckGLSGLAccountDetail))
            error.Add($"گروه تفصیل و مقادیر تفصیل معتبر نمی باشد:{strCheckGLSGLAccountDetail}");


        return error;
    }

    public async Task<List<string>> ValidateInsert(JournalLineSingleSave model)
    {
        var errors = new List<string>();

        await Task.Run(async () =>
        {
            if (model.NoSeriesId == 102 || model.NoSeriesId == 103)
            {
                var vendor = new MyResultPage<VendorGetRecordForm>();
                var customer = new MyResultPage<CustomerGetRecordForm>();
                if (model.AccountDetailId != 0)
                {
                    if (model.NoSeriesId == 102)
                    {
                        vendor = await _vendorRepository.GetRecordById(model.AccountDetailId, model.CompanyId);

                        if (vendor.Data.VATIncludeVe.Value && !vendor.Data.VATEnableVe.Value)
                            errors.Add("تامین کننده ، اعتبار ارزش افزوده ندارد ، مجاز به ثبت نمی باشید");
                    }
                    else if (model.NoSeriesId == 103)
                    {
                        customer = await _customerRepository.GetRecordById(model.AccountDetailId, model.CompanyId);

                        if (customer.Data.VATIncludeCu.Value && !customer.Data.VATEnableCu.Value)
                            errors.Add("مشتری ، اعتبار ارزش افزوده ندارد ، مجاز به ثبت نمی باشید");
                    }
                }
            }

            #region بررسی وضعیت دوره مالی

            var journal = GetJournalInfo(model.HeaderId, model.CompanyId);
            var date = journal.Result;
            var resultCheckFiscalYear = await _fiscalYearRepository.GetFicalYearStatusByDate(date, model.CompanyId);

            if (!resultCheckFiscalYear.Successfull)
                errors.Add(resultCheckFiscalYear.StatusMessage);

            #endregion
        });

        return errors;
    }
}