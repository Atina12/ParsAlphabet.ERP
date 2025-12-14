using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.Central.ObjectModel.Public;
using ParsAlphabet.ERP.Application.Dtos.FM.NewTreasuryLine;
using ParsAlphabet.ERP.Application.Dtos.FM.PostingGroup;
using ParsAlphabet.ERP.Application.Dtos.WF.StageFundItemType;
using ParsAlphabet.ERP.Application.Dtos.WF.StageStepConfig;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces.FM.NewTreasury;
using ParsAlphabet.ERP.Application.Interfaces.FM.NewTreasuryLine;
using ParsAlphabet.ERP.Application.Interfaces.FM.PostingGroup;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.Bank;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.TreasurySubject;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYear;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.Stage;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageFundItemType;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageStepConfig;
using GetAction = ParsAlphabet.ERP.Application.Dtos.WF.StageAction.GetAction;
using Validation = ParsAlphabet.ERP.Application.Dtos.FormPlate1.Validation;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.NewTreasuryLine;

public class NewTreasuryLineRepository : INewTreasuryLineRepository
{
    private readonly IHttpContextAccessor _accessor;
    private readonly BankRepository _bankRepository;
    private readonly ICompanyRepository _companyRepository;
    private readonly IConfiguration _config;
    private readonly FiscalYearRepository _fiscalYearRepository;
    private readonly ILoginRepository _loginRepository;
    private readonly IMapper _mapper;
    private readonly INewTreasuryRepository _newTreasuryRepository;
    private readonly IPostingGroupRepository _postingGroupRepository;
    private readonly StageActionRepository _stageActionRepository;
    private readonly StageFundItemTypeRepository _stageFundItemTypeRepository;
    private readonly StageRepository _stageRepository;
    private readonly StageStepConfigRepository _stageStepConfigRepository;
    private readonly TreasurySubjectRepository _treasurySubjectRepository;

    public NewTreasuryLineRepository(
        IConfiguration config,
        IHttpContextAccessor accessor,
        StageActionRepository stageActionRepository,
        StageRepository stageRepository,
        TreasurySubjectRepository treasurySubjectRepository,
        BankRepository bankRepository,
        ICompanyRepository companyRepository,
        StageStepConfigRepository stageStepConfigRepository,
        IMapper mapper,
        IPostingGroupRepository postingGroupRepository,
        StageFundItemTypeRepository stageFundItemTypeRepository,
        INewTreasuryRepository newTreasuryRepository,
        FiscalYearRepository fiscalYearRepository,
        ILoginRepository loginRepository
    )
    {
        _accessor = accessor;
        _config = config;
        _stageActionRepository = stageActionRepository;
        _stageRepository = stageRepository;
        _treasurySubjectRepository = treasurySubjectRepository;
        _bankRepository = bankRepository;
        _companyRepository = companyRepository;
        _stageStepConfigRepository = stageStepConfigRepository;
        _mapper = mapper;
        _postingGroupRepository = postingGroupRepository;
        _stageFundItemTypeRepository = stageFundItemTypeRepository;
        _newTreasuryRepository = newTreasuryRepository;
        _fiscalYearRepository = fiscalYearRepository;
        _loginRepository = loginRepository;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public async Task<int> ExistTreasuryLine(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "fm.TreasuryLine",
                    ColumnName = "Count(*) as count",
                    Filter = $"HeaderId='{id}'"
                }, commandType: CommandType.StoredProcedure);

            conn.Close();
            return result;
        }
    }

    #region getColumn

    public GetColumnsViewModel GetTreasuryHeaderColumns(short stageId)
    {
        var list = new GetColumnsViewModel
        {
            Title = "مشخصات سند خزانه",
            Classes = "group-box-green",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", IsPrimary = true, Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 8
                },
                new()
                {
                    Id = "createUserId", IsPrimary = true, Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int,
                    Width = 4
                },
                new()
                {
                    Id = "requestNo", Title = "شناسه درخواست", Type = (int)SqlDbType.TinyInt, HasLink = true,
                    IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "headerTransactionDatePersian", IsPrimary = true, Title = "تاریخ برگه",
                    Type = (int)SqlDbType.VarChar, Size = 10, IsDtParameter = true,
                    Editable = true, InputOrder = 7, Width = 8, InputType = "datepicker",
                    Validations = new List<Validation> { new() { ValidationName = "data-parsley-shamsidate" } },
                    InputMask = new InputMask { Mask = "'mask':'9999/99/99'" }, IsFocus = true
                },
                new() { Id = "no", Title = "شماره برگه", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 8 },
                new()
                {
                    Id = "journalId", Title = "شناسه سند", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "branchId", Title = "شناسه شعبه", Type = (int)SqlDbType.TinyInt, Width = 5, IsPrimary = true
                },
                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.TinyInt, IsDtParameter = true, Width = 15
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
                new() { Id = "stageClassId", IsPrimary = true, Type = (int)SqlDbType.TinyInt },
                new()
                {
                    Id = "parentWorkflowCategory", Title = "دسته بندی درخواست", Type = (int)SqlDbType.NVarChar,
                    Size = 50, IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "requestRemainedAmountName", Title = "مانده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15, ClassName = "difference-input", IsCommaSep = true
                },
                new()
                {
                    Id = "isMultipleName", Title = "ارتباط یک به چند با درخواست", Type = (int)SqlDbType.NVarChar,
                    Size = 50, IsDtParameter = false, Width = 15, ClassName = "difference-input", IsCommaSep = true
                },
                new()
                {
                    Id = "treasurySubjectId", Title = "موضوع دریافت / پرداخت", Type = (int)SqlDbType.Int, Width = 12,
                    Editable = true, InputOrder = 1, InputType = "select", IsSelect2 = true,
                    Inputs =
                        _treasurySubjectRepository.GetTreasurySubjectByStageDropDown(stageId, 6, 2).Result.ToList(),
                    IsFocus = true, FillType = "back", IsPrimary = true
                },
                new()
                {
                    Id = "treasurySubject", Title = "موضوع دریافت پرداخت", IsPrimary = true,
                    Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true, Width = 20
                },
                new()
                {
                    Id = "accountGLId", Title = "کد کل", IsPrimary = true, Type = (int)SqlDbType.SmallInt,
                    Editable = true, InputOrder = 2, Width = 6, IsReadOnly = true
                },
                new()
                {
                    Id = "accountGL", Title = "حساب کل", IsPrimary = true, Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "accountSGLId", Title = "کد معین", IsPrimary = true, Type = (int)SqlDbType.TinyInt,
                    Editable = true, InputOrder = 3, Width = 6, IsReadOnly = true
                },
                new()
                {
                    Id = "accountSGL", Title = "حساب معین", IsPrimary = true, Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "noSeriesId", Title = " گروه تفضیل", IsPrimary = true, Type = (int)SqlDbType.Int, Size = 100,
                    InputOrder = 4, IsFilterParameter = true, Width = 6, Editable = true, IsFocus = true,
                    InputType = "select", FillType = "front", Inputs = new List<MyDropDownViewModel>(), IsSelect2 = true
                },
                new()
                {
                    Id = "accountDetailId", Title = " حساب تفضیل ", Type = (int)SqlDbType.SmallInt, Editable = true,
                    InputOrder = 5, Width = 6, InputType = "select", Inputs = null, IsSelect2 = true,
                    Select2Title = "accountDetailName", IsFocus = true, FillType = "front"
                },
                new()
                {
                    Id = "accountDetail", Title = " حساب تفضیل", IsPrimary = true, Type = (int)SqlDbType.NVarChar,
                    Size = 50, IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "documentTypeId", Title = "نوع سند", IsPrimary = true, Type = (int)SqlDbType.SmallInt,
                    Editable = true, InputOrder = 6, Width = 6, IsReadOnly = true
                },
                new()
                {
                    Id = "documentType", Title = "نوع سند", IsPrimary = true, Type = (int)SqlDbType.NVarChar, Size = 50,
                    Width = 6
                },

                new()
                {
                    Id = "actionId", Title = "گام مرحله", Type = (int)SqlDbType.NVarChar, Width = 6, IsPrimary = true
                },
                new()
                {
                    Id = "actionIdName", Title = "گام مرحله", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "note", Title = "توضیحات", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    Width = 20, Editable = true, IsNotFocusSelect = true, InputOrder = 8, IsFocus = true,
                    IsPrimary = true
                },

                new()
                {
                    Id = "treasuryFlowTypeId", Title = "دریافت پرداخت", Type = (int)SqlDbType.TinyInt, IsPrimary = true
                },
                new()
                {
                    Id = "createDateTime", Title = "تاریخ ثبت", Type = (int)SqlDbType.Date, Size = 10, IsPrimary = true,
                    InputMask = new InputMask { Mask = "'mask':''" }
                },
                new() { Id = "isDataEntry", IsPrimary = true },
                new() { Id = "currentInOut", IsPrimary = true },
                new() { Id = "isBank", IsPrimary = true },
                new() { Id = "isRequest", IsPrimary = true },
                new() { Id = "isPreviousStage", Title = "", IsPrimary = true },
                new() { Id = "accountDetailRequired", IsPrimary = true },
                new()
                {
                    Id = "requestId", Title = "درخواست", Editable = true, InputOrder = 2, InputType = "select",
                    IsSelect2 = true, Inputs = null,
                    FillType = "front", Type = (int)SqlDbType.TinyInt, Width = 12,
                    Validations = new List<Validation> { new() { ValidationName = "required" } }, IsPrimary = true
                },

                new() { Id = "stageId", Title = "مرحله", IsPrimary = true, Type = (int)SqlDbType.Int },
                new() { Id = "workflowId", IsPrimary = true, Type = (int)SqlDbType.Int },
                new() { Id = "isEqualToParentRequest", IsPrimary = true, Type = (int)SqlDbType.Int },
                new() { Id = "parentWorkflowCategoryId", IsPrimary = true, Type = (int)SqlDbType.Int },
                new() { Id = "parentDocumentDatePersian", IsPrimary = true, Type = (int)SqlDbType.Date }
            },

            Navigations = new List<NavigateToPage>
            {
                new()
                {
                    ColumnId = "requestId",
                    PageType = PageType.Mdal,
                    Url = "/FM/NewTreasuryLine/display",
                    Modal = new Modal
                    {
                        HeaderTitle = "نمایش اطلاعات درخواست",
                        ModalSize = "xxlg"
                    },
                    Parameters = new List<FormKeyValue>
                    {
                        new()
                        {
                            Name = "id"
                        },
                        new()
                        {
                            Name = "requestId",
                            Value = "0"
                        },
                        new()
                        {
                            Name = "isDefaultCurrency",
                            Value = "1"
                        },
                        new()
                        {
                            Name = "isShowMode",
                            Value = "1"
                        }
                    }
                }
            }
        };

        return list;
    }


    public GetStageStepConfigColumnsViewModel GetTreasuryLineSimpleElement(int companyId)
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
                    { new() { FieldId = "fundTypeId", TableName = "FM.TreasuryLine" } }
            },
            DataColumns = new List<DataStageStepConfigColumnsViewModel>
            {
                new() { Id = "id", IsPrimary = true, Title = "شناسه", Type = (int)SqlDbType.Int, Width = 2 },
                new()
                {
                    Id = "fundTypeId", Title = "نوع وجه", IsDtParameter = true, Width = 2, IsFocus = true,
                    InputType = "select", IsSelect2 = true
                },
                new()
                {
                    Id = "inOut", Title = "دریافت پرداخت", IsDtParameter = true, IsFilterParameter = true,
                    HeaderReadOnly = true, Width = 2, InputType = "select", IsSelect2 = true,
                    Validations = new List<Validation> { new() { ValidationName = "required" } },
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = "/api/WFApi/inout_getdropdown"
                    },
                    IsFocus = true
                },
                new()
                {
                    Id = "bankId", Title = "بانک", IsDtParameter = true, Width = 2, InputType = "select",
                    IsFocus = true, IsSelect2 = true,
                    Validations = new List<Validation> { new() { ValidationName = "required" } },
                    FillColumnInputSelectIds = new List<string> { "bankAccountId" },
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = "/api/FM/BankApi/getdropdownhasaccount"
                    }
                },
                new()
                {
                    Id = "bankAccountId", Title = "شماره حساب", IsDtParameter = true, InputType2 = "select",
                    Validations = new List<Validation> { new() { ValidationName = "required" } },
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = "/api/FM/BankAccountApi/getdropdown_bankId",
                        Parameters = new List<GetDataColumnParameterModel>
                        {
                            new()
                            {
                                Id = "bankId",
                                InlineType = false
                            }
                        }
                    },
                    IsSelect2 = true, Width = 2
                },
                new()
                {
                    Id = "bondAccountNo", Title = "شماره حساب چک", Width = 2, InputType = "number",
                    IsDtParameter = true, IsDetailItem = true,
                    Validations = new List<Validation> { new() { ValidationName = "required" } }
                },
                new()
                {
                    Id = "sayadNumber", Title = "شماره صیاد چک", Type = (int)SqlDbType.BigInt, Size = 50,
                    IsDtParameter = true, Width = 2, MaxLength = 20, InputType = "strnumber",
                    Validations = new List<Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-min", Value1 = "1" }
                    }
                },
                new()
                {
                    Id = "bondSerialNo", Title = "شماره سریال چک", Size = 50, MaxLength = 6, Width = 2,
                    IsDtParameter = true, InputType = "number", InputType1 = "number", InputType2 = "select",
                    Validations = new List<Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-min", Value1 = "1" }
                    },
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = ""
                    },
                    IsDetailItem = true
                },
                new()
                {
                    Id = "documentNo", Title = "شماره سند", IsDtParameter = true, MaxLength = 10, Width = 2,
                    InputType = "number", InputType1 = "number", InputType2 = "select",
                    Validations = new List<Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-min", Value1 = "1" }
                    },
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = ""
                    }
                },
                new()
                {
                    Id = "bondBranchNo", Title = "شماره شعبه چک", MaxLength = 8, Width = 2, IsDtParameter = true,
                    InputType = "number", IsDetailItem = true,
                    Validations = new List<Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-max", Value1 = "32767" }
                    }
                },
                new()
                {
                    Id = "bondBranchName", Title = "نام شعبه چک", Size = 50, MaxLength = 50, Width = 2,
                    IsDtParameter = true, IsDetailItem = true,
                    Validations = new List<Validation> { new() { ValidationName = "required" } }
                },
                new()
                {
                    Id = "bankIssuerId", Title = "بانک صادرکننده", IsDtParameter = true, Width = 2,
                    InputType = "select", IsFocus = true,
                    Validations = new List<Validation> { new() { ValidationName = "required" } },
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = "/api/FM/BankApi/getdropdownisactive"
                    }
                },
                new()
                {
                    Id = "bankAccountIssuer", Title = "شماره حساب بانکی صادرکننده", MaxLength = 40,
                    IsDtParameter = true, Size = 50, Width = 2, InputType = "number",
                    Validations = new List<Validation> { new() { ValidationName = "required" } }
                },
                new()
                {
                    Id = "bondIssuer", Title = "نام صادر کننده چک", IsDtParameter = true, Size = 50, MaxLength = 100,
                    Width = 2, IsDetailItem = true,
                    Validations = new List<Validation> { new() { ValidationName = "required" } }
                },
                new()
                {
                    Id = "bondDueDatePersian", Title = "تاریخ سررسید چک", IsDtParameter = true,
                    InputType = "datepicker", InputMask = new InputMask { Mask = "'mask':'9999/99/99'" },
                    Width = 2, IsDetailItem = true,
                    Validations = new List<Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-dateissamebonddue" }
                    }
                },

                new()
                {
                    Id = "transitNo", Title = "شناسه مرجع بانک", IsDtParameter = true, MaxLength = 18, Width = 2,
                    InputType = "number", Validations = new List<Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-max", Value1 = "999999999" },
                        new() { ValidationName = "data-parsley-maxlength", Value1 = "9" },
                        new() { ValidationName = "data-parsley-min", Value1 = "1" }
                    }
                },
                new()
                {
                    Id = "amount", Title = "مبلغ", Type = (int)SqlDbType.Decimal, Size = 11, IsDtParameter = true,
                    IsFilterParameter = false, IsCommaSep = true, Width = 2, InputType = "money", HasSumValue = true,
                    Order = true, MaxLength = 15, Validations = new List<Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-max", Value1 = "999999999999999.999" }
                    }
                },
                new()
                {
                    Id = "bondStep", Title = "مرحله چک", Size = 50, Width = 2, IsDetailItem = true,
                    Validations = new List<Validation> { new() { ValidationName = "required" } }
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

    public GetStageStepConfigColumnsViewModel GetTreasuryLineAdvanceElement(int companyId)
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
                    { new() { FieldId = "fundTypeId", TableName = "FM.TreasuryLine" } }
            },
            DataColumns = new List<DataStageStepConfigColumnsViewModel>
            {
                new() { Id = "id", IsPrimary = true, Title = "شناسه", Type = (int)SqlDbType.Int, Width = 2 },
                new()
                {
                    Id = "fundTypeId", Title = "نوع وجه", IsDtParameter = true, Width = 2, IsFocus = true,
                    InputType = "select", IsSelect2 = true
                },
                new()
                {
                    Id = "inOut", Title = "دریافت پرداخت", IsDtParameter = true, IsFilterParameter = true,
                    HeaderReadOnly = true, Width = 2, InputType = "select", IsSelect2 = true,
                    Validations = new List<Validation> { new() { ValidationName = "required" } },
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = "/api/WFApi/inout_getdropdown"
                    },
                    IsFocus = true
                },
                new()
                {
                    Id = "bankId", Title = "بانک", IsDtParameter = true, Width = 2, InputType = "select",
                    IsFocus = true, IsSelect2 = true,
                    Validations = new List<Validation> { new() { ValidationName = "required" } },
                    FillColumnInputSelectIds = new List<string> { "bankAccountId" },
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = "/api/FM/BankApi/getdropdownisactive"
                    }
                },
                new()
                {
                    Id = "bankAccountId", Title = "شماره حساب", IsDtParameter = true, InputType2 = "select",
                    Validations = new List<Validation> { new() { ValidationName = "required" } },
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = "/api/FM/BankAccountApi/getdropdown_bankId",
                        Parameters = new List<GetDataColumnParameterModel>
                        {
                            new()
                            {
                                Id = "bankId",
                                InlineType = false
                            }
                        }
                    },
                    IsSelect2 = true, Width = 2
                },
                new()
                {
                    Id = "bondAccountNo", Title = "شماره حساب چک", Width = 2, InputType = "number",
                    IsDtParameter = true, IsDetailItem = true,
                    Validations = new List<Validation> { new() { ValidationName = "required" } }
                },
                new()
                {
                    Id = "sayadNumber", Title = "شماره صیاد چک", Type = (int)SqlDbType.BigInt, Size = 50,
                    IsDtParameter = true, Width = 2, MaxLength = 20, InputType = "strnumber",
                    Validations = new List<Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-min", Value1 = "1" }
                    }
                },
                new()
                {
                    Id = "bondSerialNo", Title = "شماره سریال چک", Size = 50, Width = 2, IsDtParameter = true,
                    MaxLength = 6, InputType = "number", InputType1 = "number", InputType2 = "select",
                    Validations = new List<Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-min", Value1 = "1" }
                    },
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = ""
                    },
                    IsDetailItem = true
                },
                new()
                {
                    Id = "documentNo", Title = "شماره سند", IsDtParameter = true, Width = 2, MaxLength = 10,
                    InputType = "number", InputType1 = "number", InputType2 = "select",
                    Validations = new List<Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-min", Value1 = "1" }
                    },
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = ""
                    }
                },
                new()
                {
                    Id = "bondBranchNo", Title = "شماره شعبه چک", Width = 2, IsDtParameter = true, InputType = "number",
                    IsDetailItem = true, Validations = new List<Validation> { new() { ValidationName = "required" } }
                },
                new()
                {
                    Id = "bondBranchName", Title = "نام شعبه چک", Size = 50, Width = 2, IsDtParameter = true,
                    IsDetailItem = true, Validations = new List<Validation> { new() { ValidationName = "required" } }
                },
                new()
                {
                    Id = "bankIssuerId", Title = "بانک صادرکننده", IsDtParameter = true, Width = 2,
                    InputType = "select", IsFocus = true,
                    Validations = new List<Validation> { new() { ValidationName = "required" } },
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = "/api/FM/BankApi/getdropdownisactive"
                    }
                },
                new()
                {
                    Id = "bankAccountIssuer", Title = "شماره حساب بانکی صادرکننده", IsDtParameter = true, Size = 50,
                    Width = 2, InputType = "number",
                    Validations = new List<Validation> { new() { ValidationName = "required" } }
                },
                new()
                {
                    Id = "bondIssuer", Title = "نام صادر کننده چک", Size = 50, Width = 2, IsDetailItem = true,
                    IsDtParameter = true, Validations = new List<Validation> { new() { ValidationName = "required" } }
                },
                new()
                {
                    Id = "bondDueDatePersian", Title = "تاریخ سررسید چک", IsDtParameter = true,
                    InputType = "datepicker", InputMask = new InputMask { Mask = "'mask':'9999/99/99'" }, Width = 2,
                    IsDetailItem = true, Validations = new List<Validation> { new() { ValidationName = "required" } }
                },
                new()
                {
                    Id = "currencyId", Title = "نوع ارز", IsDtParameter = true, Width = 2, InputType = "select",
                    IsSelect2 = true, Validations = new List<Validation> { new() { ValidationName = "required" } },
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = "/api/GN/CurrencyApi/getdropdown"
                    }
                },
                new()
                {
                    Id = "exchangeRate", Title = "نرخ تسعیر", Size = 11, IsDtParameter = true, IsCommaSep = true,
                    Width = 2, InputType = "money",
                    Validations = new List<Validation> { new() { ValidationName = "required" } }
                },
                new()
                {
                    Id = "amount", Title = "مبلغ", Type = (int)SqlDbType.Decimal, Size = 11, IsDtParameter = true,
                    IsFilterParameter = false, IsCommaSep = true, Width = 2,
                    InputType = "money", HasSumValue = true, Order = true, MaxLength = 15, Validations =
                        new List<Validation>
                        {
                            new() { ValidationName = "required" },
                            new() { ValidationName = "data-parsley-max", Value1 = "999999999999999.999" }
                        }
                },
                new()
                {
                    Id = "amountExchange", Title = "مبلغ خارجی", Type = (int)SqlDbType.Int, Size = 11,
                    IsDtParameter = true, IsFilterParameter = false, IsCommaSep = true, HeaderReadOnly = true,
                    Width = 2,
                    InputType = "money", MaxLength = 15, HasSumValue = true,
                    Validations = new List<Validation> { new() { ValidationName = "required" } }
                },

                new()
                {
                    Id = "transitNo", Title = "شناسه مرجع بانک", IsDtParameter = true, Width = 2, InputType = "number",
                    Validations = new List<Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-max", Value1 = "999999999" },
                        new() { ValidationName = "data-parsley-min", Value1 = "1" },
                        new() { ValidationName = "data-parsley-maxlength", Value1 = "9" }
                    }
                },
                new() { Id = "bondStep", Title = "مرحله چک", Size = 50, Width = 2, IsDetailItem = true },
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

    public GetStageStepConfigColumnsViewModel GetRequestSimpleColumns(int companyId, byte fundTypeId)
    {
        var categoryColumn = FinanceTools.GetCategoryTreasuryReqColumn(fundTypeId);

        var list = new GetStageStepConfigColumnsViewModel
        {
            IsSelectable = true,
            IsEditable = true,
            Title = "لیست گردش",
            ActionType = "inline",
            HeaderType = "outline",
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "balanceAmount", FieldValue = "0", Operator = ">" } },
            AnswerCondition = "color:#da1717",
            DataColumns = new List<DataStageStepConfigColumnsViewModel>(),
            Buttons = null
        };

        // 1-9
        if (categoryColumn.Item1)
            list.DataColumns = new List<DataStageStepConfigColumnsViewModel>
            {
                new() { Id = "id", IsPrimary = true, Title = "شناسه", IsDtParameter = true, Width = 5, Order = true },
                new() { Id = "inOut", Title = "دریافت پرداخت", IsPrimary = true, IsDtParameter = true, Width = 5 },
                new()
                {
                    Id = "createUserFullName", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "createUserId", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int, Width = 8,
                    FilterType = "select2", FilterTypeApi = "api/GN/UserApi/getdropdown/2/false/false"
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ و زمان ثبت", Type = (int)SqlDbType.VarChar,
                    IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "balanceAmount", IsPrimary = true, Title = "مبلغ", MaxLength = 15, Type = (int)SqlDbType.Int,
                    Size = 11, IsDtParameter = true, IsCommaSep = true, Width = 4, InputType = "money",
                    HasSumValue = true, Order = true, IsReadOnly = true, Editable = true
                },
                new()
                {
                    Id = "amount", Title = "مبلغ درخواست", Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true,
                    IsCommaSep = true, Width = 4, InputType = "money", HasSumValue = true, Order = true
                },
                new() { Id = "fundTypeId", Title = "نوع وجه", IsPrimary = true, Order = true }
            };
        //4-5-2
        else if (categoryColumn.Item2)
            list.DataColumns = new List<DataStageStepConfigColumnsViewModel>
            {
                new() { Id = "id", IsPrimary = true, Title = "شناسه", IsDtParameter = true, Width = 5, Order = true },
                new() { Id = "inOut", Title = "دریافت پرداخت", IsPrimary = true, IsDtParameter = true, Width = 5 },
                new() { Id = "bankName", Title = "بانک", IsPrimary = true, IsDtParameter = true, Width = 7 },
                new()
                {
                    Id = "bankAccountName", Title = "شماره حساب بانک", IsPrimary = true, IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "documentNo", Title = "شماره سند", IsFilterParameter = true, IsDtParameter = true, Width = 5,
                    MaxLength = 10, InputType = "number", IsReadOnly = true, Editable = true
                },
                new()
                {
                    Id = "transitNo", Title = "شماره مرجع بانک", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 7, IsReadOnly = true, Editable = true
                },
                new()
                {
                    Id = "balanceAmount", Title = "مبلغ", MaxLength = 15, IsPrimary = true, Type = (int)SqlDbType.Int,
                    Size = 11, IsDtParameter = true, IsCommaSep = true, Width = 9, InputType = "money",
                    HasSumValue = true, Order = true, IsReadOnly = true, Editable = true
                },
                new()
                {
                    Id = "amount", Title = "مبلغ درخواست", Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true,
                    IsCommaSep = true, Width = 9, InputType = "money", HasSumValue = true, Order = true
                },
                new() { Id = "fundTypeId", Title = "نوع وجه", IsPrimary = true, Order = true },
                new()
                {
                    Id = "createUserFullName", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "createUserId", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int, Width = 8,
                    FilterType = "select2", FilterTypeApi = "api/GN/UserApi/getdropdown/2/false/false"
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ و زمان ثبت", Type = (int)SqlDbType.VarChar,
                    IsDtParameter = true, Width = 6
                },
                new() { Id = "bankAccountId", IsPrimary = true },
                new() { Id = "bankId", IsPrimary = true }
            };
        //3
        else if (categoryColumn.Item3)
            // زمان افزودن از درخواست برای چک دیگران مبانی زیر مورد نیاز می باشد
            list.DataColumns = new List<DataStageStepConfigColumnsViewModel>
            {
                new() { Id = "id", IsPrimary = true, Title = "شناسه", IsDtParameter = true, Width = 3, Order = true },
                new() { Id = "treasuryDetailId", IsPrimary = true },
                new() { Id = "inOut", Title = "دریافت پرداخت", IsPrimary = true, IsDtParameter = true, Width = 5 },
                new()
                {
                    Id = "bankIssuer", Title = "بانک صادرکننده", Type = (int)SqlDbType.NVarChar, Width = 5,
                    IsDtParameter = true
                },
                new()
                {
                    Id = "bankAccountIssuer", Title = "شماره حساب بانک صادرکننده", Type = (int)SqlDbType.NVarChar,
                    Width = 5, IsDtParameter = true
                },
                new()
                {
                    Id = "bondIssuer", Title = "صادر کننده چک", Type = (int)SqlDbType.NVarChar, Width = 8,
                    IsDtParameter = true
                },
                new()
                {
                    Id = "sayadNumber", Title = "شماره صیاد", IsDtParameter = true, Type = (int)SqlDbType.NVarChar,
                    MaxLength = 20, Width = 8
                },
                new()
                {
                    Id = "bondDueDatePersian", Title = "تاریخ سررسید چک", Type = (int)SqlDbType.VarChar,
                    IsDtParameter = true, Width = 8,
                    InputMask = new InputMask { Mask = "'mask':'9999/99/99'" },
                    IsDetailItem = true,
                    Validations = new List<Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-dateissamebonddue" }
                    }
                },
                new()
                {
                    Id = "documentNo", Title = "شماره سند", IsFilterParameter = true, IsDtParameter = true, Width = 5,
                    MaxLength = 10, InputType = "strnumber"
                },
                new()
                {
                    Id = "transitNo", Title = "شماره مرجع بانک", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 5
                },
                new()
                {
                    Id = "balanceAmount", Title = "مبلغ", MaxLength = 15, IsPrimary = true, Type = (int)SqlDbType.Int,
                    Size = 11, IsDtParameter = true, IsCommaSep = true, Width = 5, InputType = "money",
                    HasSumValue = true, Order = true, IsReadOnly = false, Editable = false
                },
                new()
                {
                    Id = "amount", Title = "مبلغ درخواست", IsPrimary = true, Type = (int)SqlDbType.Int, Size = 11,
                    IsDtParameter = true, IsCommaSep = true, Width = 5, InputType = "money", HasSumValue = true,
                    Order = true, IsReadOnly = false, Editable = false
                },
                new() { Id = "fundTypeId", Title = "نوع وجه", IsPrimary = true, Order = true },
                new()
                {
                    Id = "createUserFullName", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "createUserId", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int, Width = 7,
                    FilterType = "select2", FilterTypeApi = "api/GN/UserApi/getdropdown/2/false/false"
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ و زمان ثبت", Type = (int)SqlDbType.VarChar,
                    IsDtParameter = true, Width = 5
                },
                new() { Id = "bankAccountId", IsPrimary = true }
            };
        //6,7,8
        else if (categoryColumn.Item4)
            list.DataColumns = new List<DataStageStepConfigColumnsViewModel>
            {
                new() { Id = "id", IsPrimary = true, Title = "شناسه", IsDtParameter = true, Width = 3, Order = true },
                new() { Id = "treasuryDetailId", IsPrimary = true },
                new() { Id = "inOut", Title = "دریافت پرداخت", IsPrimary = true, IsDtParameter = true, Width = 5 },
                new()
                {
                    Id = "bankName", Title = "بانک", IsPrimary = true, IsDtParameter = true, IsFilterParameter = true,
                    Width = 7, FillType = "select2", FilterTypeApi = "/api/FM/BankApi/getdropdownhasaccount"
                },
                new()
                {
                    Id = "bankAccountName", Title = "شماره حساب بانک", IsPrimary = true, IsDtParameter = true,
                    IsFilterParameter = true, Width = 7, FillType = "select2",
                    FilterTypeApi = "/api/FM/BankAccountApi/getdropdown_bankId"
                },
                new()
                {
                    Id = "bondDueDatePersian", Title = "تاریخ سررسید چک", IsDtParameter = true,
                    InputType = "datepicker",
                    Type = (int)SqlDbType.VarChar, IsReadOnly = true, Editable = true,
                    InputMask = new InputMask { Mask = "'mask':'9999/99/99'" },
                    Width = 5, IsDetailItem = true,
                    Validations = new List<Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-dateissamebonddue" }
                    }
                },
                new()
                {
                    Id = "sayadNumber", Title = "شماره صیاد", IsDtParameter = true, Type = (int)SqlDbType.NVarChar,
                    Width = 8, MaxLength = 20, IsFilterParameter = true, InputType = "strnumber", IsReadOnly = true,
                    Editable = true
                },
                new()
                {
                    Id = "documentNo", Title = "شماره سند", IsFilterParameter = true, IsDtParameter = true, Width = 5,
                    MaxLength = 10, InputType = "number", IsReadOnly = true, Editable = true
                },
                new()
                {
                    Id = "bondSerialNo", Title = "سریال چک", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    MaxLength = 6, Width = 5, InputType = "strnumber", IsReadOnly = true, Editable = true
                },
                //new DataStageStepConfigColumnsViewModel { Id = "balanceAmount", IsPrimary = true, Title = "مبلغ",MaxLength=15, Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true, IsCommaSep = true, Width = 5, InputType = "money", HasSumValue = true, Order = true ,IsReadOnly=false, Editable=false},
                //new DataStageStepConfigColumnsViewModel { Id = "amount", IsPrimary = true, Title = "مبلغ درخواست",MaxLength=15, Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true,IsCommaSep = true, Width= 5,InputType = "money",HasSumValue=true, Order=true ,IsReadOnly=false, Editable=false },
                new()
                {
                    Id = "balanceAmount", IsPrimary = true, Title = "مبلغ", MaxLength = 15, Type = (int)SqlDbType.Int,
                    Size = 11, IsDtParameter = true, IsCommaSep = true, Width = 4, InputType = "money",
                    HasSumValue = true, Order = true, IsReadOnly = true, Editable = false
                },
                new()
                {
                    Id = "amount", IsPrimary = true, Title = "مبلغ درخواست", MaxLength = 15, Type = (int)SqlDbType.Int,
                    Size = 11, IsDtParameter = true, IsCommaSep = true, Width = 4, InputType = "money",
                    HasSumValue = true, Order = true, IsReadOnly = false, Editable = false
                },


                new() { Id = "fundTypeId", Title = "نوع وجه", IsPrimary = true, Order = true },
                new()
                {
                    Id = "createUserFullName", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "createUserId", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int, Width = 7,
                    FilterType = "select2", FilterTypeApi = "api/GN/UserApi/getdropdown/2/false/false"
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ و زمان ثبت", Type = (int)SqlDbType.VarChar,
                    IsDtParameter = true, Width = 5
                },
                new() { Id = "bankAccountId", IsPrimary = true },
                new() { Id = "bankId", IsPrimary = true }
            };
        return list;
    }

    public GetStageStepConfigColumnsViewModel GetRequestAdvanceColumns(int companyId, byte fundTypeId)
    {
        var categoryColumn = FinanceTools.GetCategoryTreasuryReqColumn(fundTypeId);

        var list = new GetStageStepConfigColumnsViewModel
        {
            IsSelectable = true,
            IsEditable = true,
            Title = "لیست گردش",
            ActionType = "inline",
            HeaderType = "outline",
            DataColumns = new List<DataStageStepConfigColumnsViewModel>(),
            Buttons = null
        };

        // 1-9
        if (categoryColumn.Item1)
            list.DataColumns = new List<DataStageStepConfigColumnsViewModel>
            {
                new()
                {
                    Id = "id", IsPrimary = true, Title = "شناسه", IsDtParameter = true, IsFilterParameter = true,
                    Width = 5, Order = true
                },
                new() { Id = "inOut", Title = "دریافت پرداخت", IsPrimary = true, IsDtParameter = true, Width = 5 },
                new()
                {
                    Id = "currencyId", Title = "نوع ارز", Type = (int)SqlDbType.TinyInt, Width = 6, IsSelect2 = true
                },
                new()
                {
                    Id = "currencyName", Title = "نوع ارز", Type = (int)SqlDbType.TinyInt, IsDtParameter = true,
                    Width = 6, IsSelect2 = true
                },
                new()
                {
                    Id = "exchangeRate", Title = "نرخ تسعیر", Type = (int)SqlDbType.Int, Size = 11,
                    IsDtParameter = true, IsCommaSep = true, Width = 6, InputType = "money", HasSumValue = true,
                    CalculateSum = false, HeaderReadOnly = true, Order = true
                },
                new()
                {
                    Id = "amount", Title = "مبلغ", MaxLength = 15, Type = (int)SqlDbType.Int, Size = 11,
                    IsDtParameter = true, IsCommaSep = true, Width = 6, InputType = "money", HasSumValue = true,
                    Order = true
                },
                new()
                {
                    Id = "amountExchange", Title = "مبلغ خارجی", Type = (int)SqlDbType.Int, Size = 11,
                    IsDtParameter = true, IsCommaSep = true, Width = 6, InputType = "money", HasSumValue = true,
                    CalculateSum = false, IsReadOnly = true, Order = true
                },
                new() { Id = "fundTypeId", Title = "نوع وجه", IsPrimary = true, Order = true }
            };
        //4-5-2
        else if (categoryColumn.Item2)
            list.DataColumns = new List<DataStageStepConfigColumnsViewModel>
            {
                new()
                {
                    Id = "id", IsPrimary = true, Title = "شناسه", IsDtParameter = true, IsFilterParameter = true,
                    Width = 5, Order = true
                },
                new() { Id = "inOut", Title = "دریافت پرداخت", IsPrimary = true, IsDtParameter = true, Width = 5 },
                new()
                {
                    Id = "bankName", Title = "بانک", Type = (int)SqlDbType.Int, Width = 5,
                    Inputs = _bankRepository.GetDropDown(companyId).Result.ToList(), IsSelect2 = true, IsFocus = true
                },
                new()
                {
                    Id = "bankId", Title = "بانک", IsDtParameter = true, Width = 5, InputType = "select2",
                    IsFocus = true, IsSelect2 = true,
                    FillColumnInputSelectIds = new List<string> { "bankAccountId" },
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = "/api/FM/BankApi/getdropdownisactive"
                    }
                },
                new() { Id = "bankAccountName", Title = "شماره حساب", Type = (int)SqlDbType.Int, Width = 8 },
                new()
                {
                    Id = "bankAccountId", Title = "شماره حساب", IsDtParameter = true, InputType2 = "select2",
                    IsSelect2 = true, Width = 8,
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = "/api/FM/BankAccountApi/getdropdown_bankId",
                        Parameters = new List<GetDataColumnParameterModel>
                        {
                            new()
                            {
                                Id = "bankId"
                            }
                        }
                    }
                },
                new()
                {
                    Id = "documentNo", Title = "شماره سند", IsFilterParameter = true, IsDtParameter = true, Width = 5,
                    MaxLength = 10, InputType = "number"
                },
                new()
                {
                    Id = "transitNo", Title = "شماره مرجع بانک", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 7
                },
                new()
                {
                    Id = "currencyId", Title = "نوع ارز", Type = (int)SqlDbType.TinyInt, Width = 6, IsSelect2 = true
                },
                new()
                {
                    Id = "currencyName", Title = "نوع ارز", Type = (int)SqlDbType.TinyInt, IsDtParameter = true,
                    Width = 6, IsSelect2 = true
                },
                new()
                {
                    Id = "exchangeRate", Title = "نرخ تسعیر", Type = (int)SqlDbType.Int, Size = 11,
                    IsDtParameter = true, IsCommaSep = true, Width = 6, InputType = "money", HasSumValue = true,
                    CalculateSum = false, HeaderReadOnly = true, Order = true
                },
                new()
                {
                    Id = "amount", Title = "مبلغ", MaxLength = 15, Type = (int)SqlDbType.Int, Size = 11,
                    IsDtParameter = true, IsCommaSep = true, Width = 6, InputType = "money", HasSumValue = true,
                    Order = true
                },
                new()
                {
                    Id = "amountExchange", Title = "مبلغ خارجی", Type = (int)SqlDbType.Int, Size = 11,
                    IsDtParameter = true, IsCommaSep = true, Width = 6, InputType = "money", HasSumValue = true,
                    IsReadOnly = true, CalculateSum = false, Order = true
                },
                new() { Id = "fundTypeId", Title = "نوع وجه", IsPrimary = true, Order = true },
                new()
                {
                    Id = "createUserFullName", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "createUserId", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int, IsFilterParameter = true,
                    Width = 8
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ و زمان ثبت", Type = (int)SqlDbType.VarChar,
                    IsDtParameter = true, Width = 8
                }
            };
        //3
        else if (categoryColumn.Item3)
            // زمان افزودن از درخواست برای چک دیگران مبانی زیر مرود نیاز می باشد
            list.DataColumns = new List<DataStageStepConfigColumnsViewModel>
            {
                new()
                {
                    Id = "id", IsPrimary = true, Title = "شناسه", IsDtParameter = true, IsFilterParameter = true,
                    Width = 5, Order = true
                },
                new() { Id = "treasuryDetailId", IsPrimary = true },

                new() { Id = "inOut", Title = "دریافت پرداخت", IsPrimary = true, IsDtParameter = true, Width = 6 },
                new()
                {
                    Id = "bankIssuer", Title = "بانک صادرکننده", Type = (int)SqlDbType.NVarChar, Width = 5,
                    IsDtParameter = true
                },
                new()
                {
                    Id = "bankAccountIssuer", Title = "شماره حساب بانک صادرکننده", Type = (int)SqlDbType.NVarChar,
                    Width = 5, IsDtParameter = true
                },
                new()
                {
                    Id = "bondIssuer", Title = "صادر کننده چک", Type = (int)SqlDbType.NVarChar, Width = 8,
                    IsDtParameter = true
                },
                //new DataStageStepConfigColumnsViewModel { Id = "bankName", Title = "بانک", IsDtParameter = true,Type = (int)SqlDbType.Int,Width=7, Inputs = _bankRepository.GetDropDown(companyId).Result.ToList(),IsSelect2=true,IsFocus=true},
                //new DataStageStepConfigColumnsViewModel { Id = "bankId", Title = "بانک", Width=7, InputType="select2", IsFocus=true,IsSelect2=true,
                //    FillColumnInputSelectIds=new List<string>{ "bankAccountId" },
                //    GetInputSelectConfig=new GetDataColumnConfig {
                //        FillUrl = "/api/FM/BankApi/getdropdown"
                //    }
                //},
                //new DataStageStepConfigColumnsViewModel { Id = "bankAccountName", Title = "شماره حساب", Type = (int)SqlDbType.Int,Width=10},
                //new DataStageStepConfigColumnsViewModel { Id = "bankAccountId", Title = "شماره حساب",IsDtParameter = true, InputType2="select2",IsSelect2=true,Width=10,
                //    GetInputSelectConfig = new GetDataColumnConfig
                //    {
                //        FillUrl = "/api/FM/BankAccountApi/getdropdown_bankId",
                //        Parameters = new List<GetDataColumnParameterModel>
                //        {
                //            new GetDataColumnParameterModel
                //            {
                //                Id = "bankId"
                //            }
                //        }
                //    }
                //},
                new()
                {
                    Id = "sayadNumber", Title = "شماره صیاد", IsDtParameter = true, Type = (int)SqlDbType.NVarChar,
                    MaxLength = 20, Width = 12
                },
                new()
                {
                    Id = "documentNo", Title = "شماره سند", IsFilterParameter = true, IsDtParameter = true, Width = 7,
                    MaxLength = 10, InputType = "strnumber"
                },
                new()
                {
                    Id = "transitNo", Title = "شماره مرجع بانک", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 5
                },
                new()
                {
                    Id = "currencyId", Title = "نوع ارز", Type = (int)SqlDbType.TinyInt, Width = 2, IsSelect2 = true
                },
                new()
                {
                    Id = "currencyName", Title = "نوع ارز", Type = (int)SqlDbType.TinyInt, IsDtParameter = true,
                    Width = 2, IsSelect2 = true
                },
                new()
                {
                    Id = "exchangeRate", Title = "نرخ تسعیر", Type = (int)SqlDbType.Int, Size = 11,
                    IsDtParameter = true, IsCommaSep = true, Width = 4, InputType = "money", HasSumValue = true,
                    CalculateSum = false, HeaderReadOnly = true, Order = true
                },
                new()
                {
                    Id = "amount", Title = "مبلغ", MaxLength = 15, Type = (int)SqlDbType.Int, Size = 11,
                    IsDtParameter = true, IsCommaSep = true, Width = 6, InputType = "money", HasSumValue = true,
                    Order = true
                },
                new()
                {
                    Id = "amountExchange", Title = "مبلغ خارجی", Type = (int)SqlDbType.Int, Size = 11,
                    IsDtParameter = true, IsCommaSep = true, Width = 6, InputType = "money", HasSumValue = true,
                    IsReadOnly = true, CalculateSum = false, Order = true
                },
                new() { Id = "fundTypeId", Title = "نوع وجه", IsPrimary = true, Order = true },
                new()
                {
                    Id = "createUserFullName", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "createUserId", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int, IsFilterParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ و زمان ثبت", Type = (int)SqlDbType.VarChar,
                    IsDtParameter = true, Width = 5
                }
            };
        //6,7,8
        else if (categoryColumn.Item4)
            list.DataColumns = new List<DataStageStepConfigColumnsViewModel>
            {
                new()
                {
                    Id = "id", IsPrimary = true, Title = "شناسه", IsDtParameter = true, IsFilterParameter = true,
                    Width = 3, Order = true
                },
                new() { Id = "treasuryDetailId", IsPrimary = true },
                new() { Id = "inOut", Title = "دریافت پرداخت", IsPrimary = true, IsDtParameter = true, Width = 6 },
                new() { Id = "bankName", Title = "بانک", Type = (int)SqlDbType.Int, Width = 7 },
                new()
                {
                    Id = "bankId", Title = "بانک", IsDtParameter = true, Width = 7, InputType = "select2",
                    IsFocus = true, IsSelect2 = true, Inputs = _bankRepository.GetDropDown(companyId).Result.ToList(),
                    FillColumnInputSelectIds = new List<string> { "bankAccountId" },
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = "/api/FM/BankApi/getdropdownisactive"
                    }
                },
                new() { Id = "bankAccountName", Title = "شماره حساب", Type = (int)SqlDbType.Int, Width = 10 },
                new()
                {
                    Id = "bankAccountId", Title = "شماره حساب", IsDtParameter = true, InputType2 = "select2",
                    IsSelect2 = true, Width = 10,
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = "/api/FM/BankAccountApi/getdropdown_bankId",
                        Parameters = new List<GetDataColumnParameterModel>
                        {
                            new()
                            {
                                Id = "bankId"
                            }
                        }
                    }
                },
                new()
                {
                    Id = "bondDueDatePersian", Title = "تاریخ سررسید چک", IsDtParameter = true,
                    InputType = "datepicker", InputMask = new InputMask { Mask = "'mask':'9999/99/99'" },
                    Width = 5, IsDetailItem = true,
                    Validations = new List<Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-dateissamebonddue" }
                    }
                },
                new()
                {
                    Id = "sayadNumber", Title = "شماره صیاد", IsDtParameter = true, Type = (int)SqlDbType.NVarChar,
                    Width = 10, MaxLength = 20, InputType = "strnumber"
                },
                new()
                {
                    Id = "documentNo", Title = "شماره سند", IsFilterParameter = true, IsDtParameter = true, Width = 6,
                    MaxLength = 10, InputType = "number"
                },
                new()
                {
                    Id = "bondSerialNo", Title = "سریال چک", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, MaxLength = 6, Width = 5, InputType = "strnumber"
                },
                new()
                {
                    Id = "currencyId", Title = "نوع ارز", Type = (int)SqlDbType.TinyInt, Width = 2, IsSelect2 = true
                },
                new()
                {
                    Id = "currencyName", Title = "نوع ارز", Type = (int)SqlDbType.TinyInt, IsDtParameter = true,
                    Width = 2, IsSelect2 = true
                },
                new()
                {
                    Id = "exchangeRate", Title = "نرخ تسعیر", Type = (int)SqlDbType.Int, Size = 11,
                    IsDtParameter = true, IsCommaSep = true, Width = 4, InputType = "money", HasSumValue = true,
                    CalculateSum = false, HeaderReadOnly = true, Order = true
                },
                new()
                {
                    Id = "amount", Title = "مبلغ", MaxLength = 15, Type = (int)SqlDbType.Int, Size = 11,
                    IsDtParameter = true, IsCommaSep = true, Width = 6, InputType = "money", HasSumValue = true,
                    Order = true
                },
                new()
                {
                    Id = "amountExchange", Title = "مبلغ خارجی", Type = (int)SqlDbType.Int, Size = 11,
                    IsDtParameter = true, IsCommaSep = true, Width = 6, InputType = "money", HasSumValue = true,
                    IsReadOnly = true, CalculateSum = false, Order = true
                },
                new() { Id = "fundTypeId", Title = "نوع وجه", IsPrimary = true, Order = true },
                new()
                {
                    Id = "createUserFullName", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "createUserId", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int, IsFilterParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ و زمان ثبت", Type = (int)SqlDbType.VarChar,
                    IsDtParameter = true, Width = 5
                }
            };
        return list;
    }

    public async Task<GetStageStepConfigColumnsViewModel> GetTreasuryLineByFundTypeSimpleColumns(short stageId,
        int workflowId)
    {
        var list = new GetStageStepConfigColumnsViewModel
        {
            Title = "لیست گردش",
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "currentInout", FieldValue = "2", Operator = "==" } },
            AnswerCondition = "color:#da1717",
            ElseAnswerCondition = "",
            ActionType = "inline",
            HeaderType = "outline",
            DataColumns = new List<DataStageStepConfigColumnsViewModel>(),
            Buttons = new List<GetActionColumnViewModel>()
        };

        list.DataColumns = new List<DataStageStepConfigColumnsViewModel>
        {
            new()
            {
                Id = "id", IsPrimary = true, Title = "شناسه", IsDtParameter = true, IsFilterParameter = true, Width = 6,
                Order = true, FilterType = "number"
            },
            new() { Id = "treasuryLineDetailId", Title = "شناسه چک", IsPrimary = true },
            new() { Id = "fundTypeId", IsPrimary = true },
            new()
            {
                Id = "fundType", Title = "نوع وجه", IsDtParameter = true, IsFilterParameter = true, Width = 5,
                Order = true, FilterType = "select2", FilterTypeApi = ""
            },
            new() { Id = "inOutName", Title = "دریافت/پرداخت", IsDtParameter = true, Width = 5 },
            new()
            {
                Id = "bank", Title = "بانک", IsDtParameter = true, IsFilterParameter = true, Width = 6,
                FilterType = "select2", FilterTypeApi = "/api/FM/BankApi/getdropdown"
            },
            new() { Id = "bankAccount", Title = "شماره حساب", IsDtParameter = true, Width = 11 },
            new()
            {
                Id = "checkIssuer", Title = "صادر کننده چک", Type = (int)SqlDbType.NVarChar, Width = 6,
                IsDtParameter = true
            },
            new()
            {
                Id = "checkDueDatePersian", Title = "تاریخ سررسید چک", Type = (int)SqlDbType.NVarChar, Size = 10,
                IsPrimary = true, Width = 5
            },
            new()
            {
                Id = "sayadNumber", Title = "شماره صیاد", IsDtParameter = true, Type = (int)SqlDbType.NVarChar,
                Width = 6, MaxLength = 20
            },
            new()
            {
                Id = "documentNo", Title = "شماره سند", IsDtParameter = true, IsFilterParameter = true, Width = 7,
                InputType = "number", MaxLength = 10, FilterType = "number"
            },
            new()
            {
                Id = "bondSerialNo", Title = "سریال چک", IsDtParameter = true, Width = 5, InputType = "number",
                MaxLength = 10
            },
            new() { Id = "accountDetail", Title = "حساب تفصیل", IsDtParameter = true, PublicColumn = true, Width = 15 },
            new()
            {
                Id = "displayAmount", Title = "مبلغ", MaxLength = 15, Type = (int)SqlDbType.Int, Size = 11,
                IsDtParameter = true, IsCommaSep = true, Width = 7, InputType = "money-decimal", HasSumValue = true,
                Order = true
            },
            new()
            {
                Id = "checkIssuer", Title = "بانک صادرکننده", Type = (int)SqlDbType.NVarChar, Width = 6,
                IsPrimary = true
            },
            new()
            {
                Id = "checkBankAccountIssuer", Title = "شماره حساب بانک صادرکننده", Type = (int)SqlDbType.NVarChar,
                Width = 6, IsPrimary = true
            },
            new()
            {
                Id = "transitNo", Title = "شماره مرجع بانک", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 7
            },
            new()
            {
                Id = "createUserFullName", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar,
                PublicColumn = true, IsDtParameter = true, Width = 6
            },
            new() { Id = "createUserId", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int, PublicColumn = true },
            new()
            {
                Id = "createDateTimePersian", Title = "تاریخ و زمان ثبت", Type = (int)SqlDbType.VarChar,
                PublicColumn = true, IsDtParameter = true, Width = 6
            },
            new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 6 }
        };

        list.Buttons = new List<GetActionColumnViewModel>
        {
            new() { Name = "edit", Title = "ویرایش", ClassName = "btn green_outline_1 ml-1", IconName = "fa fa-edit" },
            new() { Name = "delete", Title = "حذف", ClassName = "btn maroon_outline ml-1", IconName = "fa fa-trash" },
            new()
            {
                Name = "moreInfo", Title = "اطلاعات تکمیلی", ClassName = "btn blue_outline_1 ml-1",
                IconName = "fa fa-list",
                Condition = new List<ConditionPageTable>
                    { new() { FieldName = "fundTypeId", FieldValue = "3", Operator = "==" } }
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

    public async Task<GetStageStepConfigColumnsViewModel> GetTreasuryLineByFundTypeAdvanceColumns(short stageId,
        int workflowId)
    {
        var list = new GetStageStepConfigColumnsViewModel
        {
            Title = "لیست گردش",
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "currentInout", FieldValue = "2", Operator = "==" } },
            AnswerCondition = "color:#da1717",
            ElseAnswerCondition = "",
            ActionType = "inline",
            HeaderType = "outline",
            DataColumns = new List<DataStageStepConfigColumnsViewModel>(),
            Buttons = new List<GetActionColumnViewModel>()
        };


        list.DataColumns = new List<DataStageStepConfigColumnsViewModel>
        {
            new()
            {
                Id = "id", IsPrimary = true, Title = "شناسه", IsDtParameter = true, IsFilterParameter = true, Width = 6,
                Order = true, FilterType = "number"
            },
            new() { Id = "treasuryLineDetailId", Title = "شناسه چک", IsPrimary = true },
            new() { Id = "fundTypeId", IsPrimary = true },
            new()
            {
                Id = "fundType", Title = "نوع وجه", IsDtParameter = true, IsFilterParameter = true, Width = 5,
                Order = true, FilterType = "select2", FilterTypeApi = ""
            },
            new() { Id = "inOutName", Title = "دریافت/پرداخت", IsDtParameter = true, Width = 5 },
            new()
            {
                Id = "bank", Title = "بانک", IsDtParameter = true, IsFilterParameter = true, Width = 6,
                FilterType = "select2", FilterTypeApi = "/api/FM/BankApi/getdropdown"
            },
            new() { Id = "bankAccount", Title = "شماره حساب", IsDtParameter = true, Width = 11 },
            new()
            {
                Id = "checkIssuer", Title = "صادر کننده چک", Type = (int)SqlDbType.NVarChar, Width = 6,
                IsDtParameter = true
            },
            new()
            {
                Id = "checkDueDatePersian", Title = "تاریخ سررسید چک", Type = (int)SqlDbType.NVarChar, Size = 10,
                IsDtParameter = true, Width = 5
            },
            new()
            {
                Id = "sayadNumber", Title = "شماره صیاد", IsDtParameter = true, Type = (int)SqlDbType.NVarChar,
                Width = 6, MaxLength = 20
            },
            new()
            {
                Id = "documentNo", Title = "شماره سند", IsDtParameter = true, IsFilterParameter = true, Width = 7,
                InputType = "number", MaxLength = 10, FilterType = "number"
            },
            new()
            {
                Id = "bondSerialNo", Title = "سریال چک", IsDtParameter = true, Width = 5, InputType = "number",
                MaxLength = 10
            },
            new()
            {
                Id = "currency", Title = "نوع ارز", Type = (int)SqlDbType.TinyInt, PublicColumn = true,
                IsDtParameter = true, Width = 4, IsSelect2 = true
            },
            new()
            {
                Id = "exchangeRate", Title = "نرخ تسعیر", Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true,
                IsCommaSep = true, Width = 6, InputType = "money", HasSumValue = true, CalculateSum = false,
                HeaderReadOnly = true, Order = true
            },
            new() { Id = "accountDetail", Title = "حساب تفصیل", IsDtParameter = true, PublicColumn = true, Width = 15 },
            new()
            {
                Id = "displayAmount", Title = "مبلغ", MaxLength = 15, Type = (int)SqlDbType.Int, Size = 11,
                IsDtParameter = true, IsCommaSep = true, Width = 7, InputType = "money-decimal", HasSumValue = true,
                Order = true
            },
            new()
            {
                Id = "receivedAmount", Title = "مبلغ دریافتی", Type = (int)SqlDbType.Int, Size = 11,
                PublicColumn = true, IsDtParameter = true, IsCommaSep = true, Width = 7, InputType = "money",
                HasSumValue = true, Order = true
            },
            new()
            {
                Id = "checkIssuer", Title = "بانک صادرکننده", Type = (int)SqlDbType.NVarChar, Width = 6,
                IsDtParameter = true
            },
            new()
            {
                Id = "checkBankAccountIssuer", Title = "شماره حساب بانک صادرکننده", Type = (int)SqlDbType.NVarChar,
                Width = 6, IsDtParameter = true
            },
            new()
            {
                Id = "transitNo", Title = "شماره مرجع بانک", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 7
            },
            new()
            {
                Id = "createUserFullName", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar,
                PublicColumn = true, IsDtParameter = true, Width = 6
            },
            new() { Id = "createUserId", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int, PublicColumn = true },
            new()
            {
                Id = "createDateTimePersian", Title = "تاریخ و زمان ثبت", Type = (int)SqlDbType.VarChar,
                PublicColumn = true, IsDtParameter = true, Width = 6
            },
            new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 6 }
        };

        list.Buttons = new List<GetActionColumnViewModel>
        {
            new() { Name = "edit", Title = "ویرایش", ClassName = "btn green_outline_1 ml-1", IconName = "fa fa-edit" },
            new() { Name = "delete", Title = "حذف", ClassName = "btn maroon_outline ml-1", IconName = "fa fa-trash" },
            new()
            {
                Name = "moreInfo", Title = "اطلاعات تکمیلی", ClassName = "btn blue_outline_1 ml-1",
                IconName = "fa fa-list",
                Condition = new List<ConditionPageTable>
                    { new() { FieldName = "fundTypeId", FieldValue = "3", Operator = "==" } }
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

    #endregion

    #region getData => display,getPage,getRecord

    public async Task<MyResultPage<NewTreasuryLineDisplay>> Display(GetPageViewModel model, int userId, byte roleId)
    {
        var result = new MyResultPage<NewTreasuryLineDisplay>
        {
            Data = new NewTreasuryLineDisplay()
        };

        var directPaging = Convert.ToInt32(model.Form_KeyValue[2]?.ToString());
        var paginationParameters = new DynamicParameters();
        long treasuryIdFromPagination = 0;


        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "NewTreasuryApi",
            OprType = "VIWALL",
            UserId = userId
        };

        // check access VIWALL
        var checkAccessViewAll = await _loginRepository.GetAuthenticate(checkAuthenticate);


        if (directPaging > 0)
        {
            paginationParameters.Add("TableName", "[fm].[treasury]");
            paginationParameters.Add("IdColumnName", "[fm].[treasury].Id");
            paginationParameters.Add("IdColumnValue", Convert.ToInt32(model.Form_KeyValue[0]?.ToString()));
            paginationParameters.Add("RoleId", roleId);

            var filter = string.Empty;

            if (checkAccessViewAll.Successfull)
                filter =
                    " AND [fm].[treasury].stageId in (select s.Id from wf.Stage s WHERE s.WorkflowCategoryId=6 AND s.StageClassId=3)";
            else
                filter =
                    $" AND [fm].[treasury].stageId in (select s.Id from wf.Stage s WHERE s.WorkflowCategoryId=6 AND s.StageClassId=3) AND [fm].[treasury].CreateUserId={userId} ";


            if (model.Form_KeyValue[3]?.ToString() == "1")
                filter += " AND [fm].[treasury].CreateBySystem=0";

            paginationParameters.Add("FilterParam", filter);
            paginationParameters.Add("Direction", directPaging);

            using (var conn = Connection)
            {
                var sQuery = "[pb].[Spc_Tables_NextPrev]";
                conn.Open();
                treasuryIdFromPagination = await conn.ExecuteScalarAsync<long>(sQuery, paginationParameters,
                    commandType: CommandType.StoredProcedure);
            }
        }

        var treasuryId = treasuryIdFromPagination == 0
            ? long.Parse(model.Form_KeyValue[0]?.ToString())
            : treasuryIdFromPagination;
        var parameters = new DynamicParameters();
        var isDefaultCurrency = Convert.ToBoolean(Convert.ToInt32(model.Form_KeyValue[1]?.ToString()));

        parameters.Add("TreasuryId", treasuryId);
        parameters.Add("RequestId");
        parameters.Add("CreateUserId");
        parameters.Add("BranchId");
        parameters.Add("StageId");
        parameters.Add("FromTreasuryDate");
        parameters.Add("ToTreasuryDate");
        parameters.Add("CompanyId", model.CompanyId);
        parameters.Add("PageNo");
        parameters.Add("PageRowsCount");
        parameters.Add("ActionName");
        parameters.Add("TreasurySubject");
        parameters.Add("AccountDetail");
        parameters.Add("NoSeriesId");
        parameters.Add("WorkflowId");


        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_Treasury_Display]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<NewTreasuryLineDisplay>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).FirstOrDefault();
        }

        if (result.Data != null)
        {
            result.Data.IsPreviousStage =
                await _stageFundItemTypeRepository.GetHasStagePrevious(result.Data.StageId, result.Data.WorkflowId);

            if (result.Data.AccountDetailId > 0 && !string.IsNullOrEmpty(result.Data.AccountDetailName))
                result.Data.AccountDetailName = result.Data.AccountDetailName;

            var getTreasuryAction = new GetAction();
            getTreasuryAction.CompanyId = model.CompanyId;
            getTreasuryAction.StageId = result.Data.StageId;
            getTreasuryAction.ActionId = result.Data.ActionId;
            getTreasuryAction.WorkflowId = result.Data.WorkflowId;
            var stageAction = await _stageActionRepository.GetAction(getTreasuryAction);

            if (stageAction != null)
            {
                result.Data.IsDataEntry = stageAction.IsDataEntry;
                result.Data.IsBank = stageAction.IsBank;
                result.Data.IsRequest = stageAction.IsRequest;
                result.Data.IsTreasurySubject = stageAction.IsTreasurySubject;
                result.Data.IsEqualToParentRequest = result.Data.ParentWorkflowCategoryId == 6 ? true : false;
            }

            result.Data.JsonTreasuryLineList = new MyResultStageStepConfigPage<List<TreasuryLines>>();

            result.Data.JsonTreasuryLineList.Columns = new GetStageStepConfigColumnsViewModel();
            result.Data.JsonTreasuryLineList.Columns.HeaderType = "outline";
            result.Data.JsonTreasuryLineList.Columns.Title = "لیست گردش";

            if (!isDefaultCurrency)

                result.Data.JsonTreasuryLineList.HeaderColumns = GetTreasuryLineAdvanceElement(model.CompanyId);

            else
                result.Data.JsonTreasuryLineList.HeaderColumns = GetTreasuryLineSimpleElement(model.CompanyId);


            result.Columns = GetTreasuryHeaderColumns(result.Data.StageId);
        }
        else
        {
            result.Columns = GetTreasuryHeaderColumns(0);
        }

        return result;
    }

    public async Task<CSVViewModel<IEnumerable>> TreasuryLineCSV(NewGetPageViewModel model)
    {
        var treasury = await GetPage(model);
        var result = new CSVViewModel<IEnumerable>
        {
            Columns =
                "شناسه,نوع وجه,دریافت/پرداخت,بانک,شماره حساب,تاریخ سررسید چک,شماره صیاد,شماره سند,سریال چک,نوع ارز,نرخ تسعیر,حساب تفصیل,مبلغ,بانک صادرکننده,شماره حساب بانک  صادرکننده,شناسه مرجع بانک,کاربر ثبت کننده,تاریخ و زمان ثبت"
        };

        result.Rows = from p in treasury.Data
            select new
            {
                p.Id,
                p.FundType,
                p.InOutName,
                p.Bank,
                p.BankAccount,
                p.CheckDueDatePersian,
                p.SayadNumber,
                p.DocumentNo,
                p.BondSerialNo,
                p.Currency,
                p.ExchangeRate,
                p.AccountDetail,
                p.Amount,
                p.BankIssuer,
                p.CheckBankAccountIssuer,
                p.TransitNo,
                p.CreateUserFullName,
                p.CreateDateTimePersian
            };

        return result;
    }

    public async Task<MyResultPage<NewTreasuryLineDisplay>> GetHeader(GetPageViewModel model)
    {
        var result = new MyResultPage<NewTreasuryLineDisplay>
        {
            Data = new NewTreasuryLineDisplay()
        };


        var treasuryId = model.Form_KeyValue[0]?.ToString();
        var parameters = new DynamicParameters();

        parameters.Add("TreasuryId", treasuryId);
        parameters.Add("RequestId");
        parameters.Add("CreateUserId");
        parameters.Add("BranchId");
        parameters.Add("StageId");
        parameters.Add("FromTreasuryDate");
        parameters.Add("ToTreasuryDate");
        parameters.Add("CompanyId", model.CompanyId);
        parameters.Add("PageNo");
        parameters.Add("PageRowsCount");
        parameters.Add("ActionName");
        parameters.Add("TreasurySubject");
        parameters.Add("AccountDetail");
        parameters.Add("NoSeriesId");
        parameters.Add("WorkflowId");

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_Treasury_Display]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<NewTreasuryLineDisplay>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).FirstOrDefault();
        }

        if (result.Data != null)
        {
            if (result.Data.AccountDetailId > 0 && !string.IsNullOrEmpty(result.Data.AccountDetailName))
                result.Data.AccountDetailName = result.Data.AccountDetailName;


            var getTreasuryAction = new GetAction();
            getTreasuryAction.CompanyId = model.CompanyId;
            getTreasuryAction.StageId = result.Data.StageId;
            getTreasuryAction.ActionId = result.Data.ActionId;
            getTreasuryAction.WorkflowId = result.Data.WorkflowId;
            var stageAction = await _stageActionRepository.GetAction(getTreasuryAction);

            result.Data.IsPreviousStage =
                await _stageFundItemTypeRepository.GetHasStagePrevious(result.Data.StageId, result.Data.WorkflowId);

            result.Data.IsDataEntry = stageAction.IsDataEntry;
            result.Data.IsBank = stageAction.IsBank;
            result.Data.IsRequest = stageAction.IsRequest;
            result.Data.IsTreasurySubject = stageAction.IsTreasurySubject;
            result.Data.IsEqualToParentRequest = result.Data.ParentWorkflowCategoryId == 6 ? true : false;

            result.Columns = GetTreasuryHeaderColumns(result.Data.StageId);
        }
        else
        {
            result.Columns = GetTreasuryHeaderColumns(0);
        }


        return result;
    }

    public async Task<MyResultStageStepConfigPage<List<NewTreasuryLines>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultStageStepConfigPage<List<NewTreasuryLines>>
        {
            Data = new List<NewTreasuryLines>()
        };

        int? p_id = null, p_fundTypeId = null, p_bankId = null, p_documentNo = null;
        var isDefaultCurrency = Convert.ToBoolean(Convert.ToInt32(model.Form_KeyValue[1]?.ToString()));

        switch (model.FieldItem)
        {
            case "id":
                p_id = Convert.ToInt32(model.FieldValue);
                break;
            case "documentNo":
                p_documentNo = Convert.ToInt32(model.FieldValue);
                break;
            case "bank":
                p_bankId = Convert.ToInt32(model.FieldValue);
                break;
            case "fundType":
                p_fundTypeId = Convert.ToInt32(model.FieldValue);
                break;
        }

        MyClaim.Init(_accessor);

        var stageId = Convert.ToInt16(model.Form_KeyValue[4]?.ToString());
        var workflowId = Convert.ToInt32(model.Form_KeyValue[5]?.ToString());

        if (!isDefaultCurrency)
        {
            result.HeaderColumns = GetTreasuryLineAdvanceElement(model.CompanyId);
            result.Columns = await GetTreasuryLineByFundTypeAdvanceColumns(stageId, workflowId);
        }
        else
        {
            result.Columns = await GetTreasuryLineByFundTypeSimpleColumns(stageId, workflowId);
        }

        var parameters = new DynamicParameters();
        parameters.Add("HeaderId", Convert.ToInt64(model.Form_KeyValue[0]?.ToString()));
        parameters.Add("TreasuryLineId", p_id);
        parameters.Add("FundTypeId", p_fundTypeId);
        parameters.Add("BankId", p_bankId);
        parameters.Add("DocumentNo", p_documentNo);
        parameters.Add("IsDefaultCurrency", isDefaultCurrency);
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasuryLine_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<NewTreasuryLines>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        if (ExtentionMethod.ListHasRow(result.Data))
        {
            var columnsHasSum = result.Columns.DataColumns.Where(c => !c.CalculateSum).Select(v => v.Id).ToList();

            foreach (var item in columnsHasSum)
            {
                var col = result.Columns.DataColumns.Where(x => x.Id == item).SingleOrDefault();

                var sumTreasury = result.Data.Sum(s => decimal.Parse(GetPropValue(s, item).ToString()));
                col.SumValue = sumTreasury;
            }
        }

        if (model.SortModel != null && !string.IsNullOrEmpty(model.SortModel.ColId) &&
            !string.IsNullOrEmpty(model.SortModel.Sort))
        {
            var res = result.Data.AsQueryable();
            result.Data = res.OrderBy(model.SortModel).ToList();
        }
        else
        {
            result.Data = result.Data.OrderByDescending(trl => trl.CreateDateTime).ToList();
        }

        return result;
    }

    public async Task<NewTreasuryLineSum> GetTreasuryLineSum(NewGetPageViewModel model)
    {
        int? p_id = null, p_fundTypeId = null, p_bankId = null, p_documentNo = null;
        var isDefaultCurrency = Convert.ToBoolean(Convert.ToInt32(model.Form_KeyValue[1]?.ToString()));

        switch (model.FieldItem)
        {
            case "id":
                p_id = Convert.ToInt32(model.FieldValue);
                break;
            case "documentNo":
                p_documentNo = Convert.ToInt32(model.FieldValue);
                break;
            case "bank":
                p_bankId = Convert.ToInt32(model.FieldValue);
                break;
            case "fundType":
                p_fundTypeId = Convert.ToInt32(model.FieldValue);
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("HeaderId", Convert.ToInt64(model.Form_KeyValue[0]?.ToString()));
        parameters.Add("TreasuryLineId", p_id);
        parameters.Add("FundTypeId", p_fundTypeId);
        parameters.Add("BankId", p_bankId);
        parameters.Add("DocumentNo", p_documentNo);
        parameters.Add("IsDefaultCurrency", isDefaultCurrency);

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasuryLine_Sum]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<NewTreasuryLineSum>(sQuery, parameters,
                commandType: CommandType.StoredProcedure);

            return result;
        }
    }

    public async Task<MyResultPage<NewTreasuryLineGetReccord>> GetRecordById(GetTreasuryLine model)
    {
        var result = new MyResultPage<NewTreasuryLineGetReccord>
        {
            Data = new NewTreasuryLineGetReccord()
        };


        var parameters = new DynamicParameters();

        parameters.Add("TreasuryId");
        parameters.Add("FundTypeId", model.FundTypeId);
        parameters.Add("PageNo");
        parameters.Add("PageRowsCount");
        parameters.Add("IsDefaultCurrency", model.IsDefaultCurrency);

        if (model.FundTypeId == 1 || model.FundTypeId == 9)
        {
            parameters.Add("TreasuryCashId", model.Id);
            using (var conn = Connection)
            {
                var sQuery = "[fm].[Spc_TreasuryCash_SelectTreasuryCashByTreasuryId]";

                conn.Open();
                result.Data = await conn.QueryFirstOrDefaultAsync<NewTreasuryLineGetReccord>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure);
            }
        }
        else if (model.FundTypeId == 6 || model.FundTypeId == 3 || model.FundTypeId == 7 || model.FundTypeId == 8)
        {
            parameters.Add("TreasuryCheckId", model.Id);
            parameters.Add("BankId");
            parameters.Add("DocumentNo");

            using (var conn = Connection)
            {
                var sQuery = "[fm].[Spc_TreasuryCheck_SelectTreasuryCheckByTreasuryId]";
                conn.Open();
                result.Data = await conn.QueryFirstOrDefaultAsync<NewTreasuryLineGetReccord>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure);
            }
        }
        else if (model.FundTypeId == 2 || model.FundTypeId == 4 || model.FundTypeId == 5)
        {
            parameters.Add("TreasuryDraftId", model.Id);
            parameters.Add("BankId");
            parameters.Add("DocumentNo");

            using (var conn = Connection)
            {
                var sQuery = "[fm].[Spc_TreasuryDraft_SelectTreasuryDraftByTreasuryId]";
                conn.Open();
                result.Data = await conn.QueryFirstOrDefaultAsync<NewTreasuryLineGetReccord>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure);
            }
        }

        if (result.Data != null)
        {
            result.Data.AmountExchange = result.Data.Amount;
            result.Data.Amount = result.Data.AmountExchange / result.Data.ExchangeRate;
        }

        return result;
    }

    #endregion

    #region executeData => insert,update,delete

    public async Task<MyResultStatus> ValidationBeforeSave(NewTreasuryLineModel model, int companyId)
    {
        var result = new MyResultStatus();

        #region CheckreasuryLinePostingGroup

        var res = new MyResultPage<List<PostingGroupbyTypeLineModel>>
        {
            Data = new List<PostingGroupbyTypeLineModel>()
        };

        var postingGroupLine = new PostingGroupHeaderModel();
        var newTreasuryLinePostingGroup = new GetPostingGroup();

        newTreasuryLinePostingGroup.CompanyId = companyId;
        newTreasuryLinePostingGroup.FundTypeId = model.FundTypeId;
        newTreasuryLinePostingGroup.ItemTypeId = model.FundTypeId;
        newTreasuryLinePostingGroup.StageId = model.StageId;
        newTreasuryLinePostingGroup.ItemCategoryId = 0;


        if (model.BankAccountId > 0)
        {
            model.NoSeriesId = (byte)NoSeries.BankAccount;
            newTreasuryLinePostingGroup.HeaderId = (int)model.BankAccountId;
            newTreasuryLinePostingGroup.PostingGroupTypeId = PostingGroupType.BankAccount;
            newTreasuryLinePostingGroup.BranchId = 0; //ندارد Branch ,حساب بانکی 
            model.AccountDetailId = (int)model.BankAccountId;
        }

        else
        {
            model.NoSeriesId = (byte)NoSeries.Branch;
            newTreasuryLinePostingGroup.HeaderId = model.BranchId;
            newTreasuryLinePostingGroup.PostingGroupTypeId = PostingGroupType.Branch;
            newTreasuryLinePostingGroup.BranchId = Convert.ToInt16(model.BranchId);
            model.AccountDetailId = model.AccountDetailTreasuryId ?? 0;
        }

        res.Data = await _postingGroupRepository.GetPostingGroupByTypeLine(newTreasuryLinePostingGroup);


        var TreasuryPosting = res.Data;
        model.TreasuryPostingList = TreasuryPosting;

        if (res.Data.Count > 0)
        {
            if (model.BankAccountId > 0)
            {
                var amountPoint = Math.Truncate(model.Amount);
                if (res.Data.Any(x => x.PostingGroupTypeLineId == 25) && amountPoint == 0)
                {
                    var portinggrouptypeLineAmount = res.Data.FirstOrDefault(p => p.PostingGroupTypeLineId == 25);

                    res.Data.Remove(portinggrouptypeLineAmount);
                }

                var decimalAmountPoint = model.Amount - amountPoint;
                if (res.Data.Any(x => x.PostingGroupTypeLineId == 26) && decimalAmountPoint == 0)
                {
                    var portinggrouptypeLineDecimalAmount =
                        res.Data.FirstOrDefault(p => p.PostingGroupTypeLineId == 26);
                    res.Data.Remove(portinggrouptypeLineDecimalAmount);
                }
            }
            else
            {
                var amountPoint = Math.Truncate(model.Amount);
                if (res.Data.Any(x => x.PostingGroupTypeLineId == 27) && amountPoint == 0)
                {
                    var portinggrouptypeLineAmount = res.Data.FirstOrDefault(p => p.PostingGroupTypeLineId == 27);
                    res.Data.Remove(portinggrouptypeLineAmount);
                }

                var decimalAmountPoint = model.Amount - amountPoint;
                if (res.Data.Any(x => x.PostingGroupTypeLineId == 28) && decimalAmountPoint == 0)
                {
                    var portinggrouptypeLineDecimalAmount =
                        res.Data.FirstOrDefault(p => p.PostingGroupTypeLineId == 28);
                    res.Data.Remove(portinggrouptypeLineDecimalAmount);
                }
            }

            for (var i = 0; i < res.Data.Count; i++) res.Data[i].AccountDetailId = model.AccountDetailId;
        }


        var validateResult = new List<string>();

        validateResult = await ValidateSaveTreasuryLine(model, res.Data, OperationType.Insert, companyId);


        if (ExtentionMethod.ListHasRow(validateResult))
        {
            result.Successfull = false;
            result.ValidationErrors = validateResult;
            return result;
        }

        result.Successfull = true;
        result.Status = 100;

        #endregion

        return result;
    }


    public async Task<MyResultStatus> Save(NewTreasuryLineModel model, int companyId)
    {
        var result = new MyResultStatus();

        var bankReport =
            await _stageFundItemTypeRepository.GetStageBankReport(model.StageId, model.FundTypeId, model.InOut);

        var getTreasuryAction = new GetAction();
        getTreasuryAction.CompanyId = companyId;
        getTreasuryAction.StageId = model.StageId;
        getTreasuryAction.Priority = 1;
        getTreasuryAction.WorkflowId = model.WorkflowId;
        var stageAction = await _stageActionRepository.GetAction(getTreasuryAction);
        model.Actionid = stageAction.ActionId;
        var defaultCurrncyId = _companyRepository.GetDefaultCurrency(companyId).Result;


        if (model.FundTypeId == 1 || model.FundTypeId == 9 || model.FundTypeId == 4 || model.FundTypeId == 5 ||
            model.FundTypeId == 2)
        {
            using (var conn = Connection)
            {
                var sQuery = "[fm].[Spc_TreasuryLine_InsUpd]";
                conn.Open();
                var output = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
                {
                    CurrencyId = model.CurrencyId == null ? defaultCurrncyId : model.CurrencyId,
                    FinalAmount = model.AmountExchange == null ? model.Amount : model.AmountExchange,
                    ExchangeRate = model.CurrencyId == null ? 1 : model.ExchangeRate,
                    model.CreateUserId,
                    model.FundTypeId,
                    Step = 0,
                    model.InOut,
                    HeaderId = model.TreasuryId,
                    model.CreateDateTime,
                    BankAccountId = model.BankAccountId == null ? 0 : model.BankAccountId,
                    model.TransitNo,
                    ActionId = model.Actionid,
                    BankReport = bankReport,
                    model.BankId,
                    model.DocumentNo,
                    TreasuryLineDetailId = model.TreasuryDetailId,
                    model.Id,
                    ObjectPostingGroupJson = JsonConvert.SerializeObject(model.TreasuryPostingList)
                }, commandType: CommandType.StoredProcedure);
                conn.Close();

                result.Id = output.Id;
                result.Successfull = result.Id > 0;
                result.Status = result.Successfull ? 100 : -100;
                result.StatusMessage =
                    result.Status == 100 ? "عملیات با موفقیت انجام شد" : "انجام عملیات با مشکل مواجه شد";
            }
        }

        else if (model.FundTypeId == 3 || model.FundTypeId == 6 || model.FundTypeId == 7 || model.FundTypeId == 8)
        {
            if (model.Id == 0) //درج چک
            {
                if (await ExistCheck(model.SayadNumber, model.TreasuryId, model.StageId) == 0)
                {
                    var treasuryItem = await _newTreasuryRepository.GetRecordById(model.TreasuryId, companyId);

                    if (model.BondDueDate != null && model.BondDueDate < treasuryItem.Data.TransactionDate)
                    {
                        result.Successfull = false;
                        result.ValidationErrors.Add("تاریخ سررسید چک باید بزرگتر مساوی تاریخ برگه باشد");
                        return result;
                    }

                    var isPrevious =
                        await _stageFundItemTypeRepository.GetHasStagePrevious(model.StageId, model.WorkflowId);


                    if (!stageAction.IsRequest && isPrevious && model.Step > 1)
                    {
                        var accountGlSglDetail =
                            await GetTreasuryCheckByStepAndSayad(model.Step - 1, model.SayadNumber);
                        model.LastAccountGLId = accountGlSglDetail.AccountGLId;
                        model.LastAccountSGLId = accountGlSglDetail.AccountSGLId;
                        model.LastAccountDetailId = accountGlSglDetail.AccountDetailId;


                        model.TreasuryPostingList.Add(
                            new PostingGroupbyTypeLineModel
                            {
                                AccountGLId = accountGlSglDetail.AccountGLId,
                                AccountSGLId = accountGlSglDetail.AccountSGLId,
                                AccountDetailId = accountGlSglDetail.AccountDetailId,
                                PostingGroupTypeId = accountGlSglDetail.PostingGroupTypeId,
                                PostingGroupTypeLineId = accountGlSglDetail.PostingGroupTypeLineId,
                                WorkflowCategoryId = accountGlSglDetail.WorkflowCategoryId,
                                IsLast = true
                            }
                        );
                    }

                    var step = model.Step == 0 ? 1 : model.Step;

                    using (var conn = Connection)
                    {
                        var sQuery = "[fm].[Spc_TreasuryLine_InsUpd]";
                        conn.Open();
                        var output = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
                        {
                            CurrencyId = model.CurrencyId == null ? defaultCurrncyId : model.CurrencyId,
                            FinalAmount = model.AmountExchange == null ? model.Amount : model.AmountExchange,
                            ExchangeRate = model.CurrencyId == null ? 1 : model.ExchangeRate,
                            model.CreateUserId,
                            model.FundTypeId,
                            Step = step,
                            model.InOut,
                            HeaderId = model.TreasuryId,
                            model.CreateDateTime,
                            BankAccountId = model.BankAccountId == null ? 0 : model.BankAccountId,
                            model.TransitNo,
                            ActionId = model.Actionid,
                            BankReport = bankReport,
                            model.BankId,
                            model.DocumentNo,
                            TreasuryLineDetailId = model.TreasuryDetailId,
                            model.Id,
                            ObjectPostingGroupJson = JsonConvert.SerializeObject(model.TreasuryPostingList)
                        }, commandType: CommandType.StoredProcedure);
                        conn.Close();

                        result.Id = output.Id;
                        result.Successfull = result.Id > 0;


                        if (result.Successfull)
                        {
                            // check ExistSayad Prevent Insert
                            var outputDetail = await ExistCheckInfo(0, model.SayadNumber, model.BankIssuerId,
                                model.BondSerialNo, model.DocumentNo);
                            if (!(outputDetail > 0))
                            {
                                var queryDetail = "[fm].[Spc_TreasuryLineDetail_InsUpd]";
                                conn.Open();
                                outputDetail = await conn.ExecuteScalarAsync<long>(queryDetail, new
                                {
                                    model.SayadNumber,
                                    CheckSerial = model.BondSerialNo,
                                    CheckNumber = model.DocumentNo,
                                    CheckBranChNo = model.BondBranchNo,
                                    CheckBranchName = model.BondBranchName,
                                    CheckDueDate = model.BondDueDate,
                                    CheckIssuer = model.BondIssuer,
                                    CheckBankIssuerId = model.BankIssuerId,
                                    CheckBankAccountIssuer = model.BankAccountIssuer,
                                    CheckLastStep = 1,
                                    model.CreateDateTime,
                                    UserId = model.CreateUserId,
                                    Id = model.CheckDetailId
                                }, commandType: CommandType.StoredProcedure);
                                conn.Close();
                            }
                            else
                            {
                                using (var cnn = Connection)
                                {
                                    var sQueryUpdate = "pb.Spc_Tables_UpdItem_Number";
                                    cnn.Open();
                                    var updateCheckLastStep = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(
                                        sQueryUpdate, new
                                        {
                                            TableName = "fm.TreasuryLineDetail",
                                            ColumnName = "CheckLastStep",
                                            Value = step,
                                            Filter = $"id={outputDetail}"
                                        }, commandType: CommandType.StoredProcedure);
                                    cnn.Close();
                                }
                            }

                            result.Id = (int)outputDetail;
                            result.Successfull = result.Id > 0;
                            result.Status = result.Successfull ? 100 : -100;
                            result.StatusMessage = result.Status == 100
                                ? "عملیات با موفقیت انجام شد"
                                : "انجام عملیات با مشکل مواجه شد";

                            await UpdateTreasuryCheck_CheckDetailIdentity(output.Id, outputDetail);
                        }
                    }
                }
                else
                {
                    result.Successfull = false;

                    result.StatusMessage = "شماره صیاد چک در سیستم موجود می باشد ، مجاز به ثبت نمی باشید";
                }
            }
            else //ویرایش چک
            {
                var treasuryItem = await _newTreasuryRepository.GetRecordById(model.TreasuryId, companyId);

                if (model.BondDueDate != null && model.BondDueDate < treasuryItem.Data.TransactionDate)
                {
                    result.Successfull = false;
                    result.StatusMessage = "تاریخ سررسید چک باید بزرگتر مساوی تاریخ برگه باشد";
                    return result;
                }


                using (var conn = Connection)
                {
                    var sQuery = "[fm].[Spc_TreasuryLine_InsUpd]";
                    conn.Open();
                    var output = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
                    {
                        CurrencyId = model.CurrencyId == null ? defaultCurrncyId : model.CurrencyId,
                        FinalAmount = model.AmountExchange == null ? model.Amount : model.AmountExchange,
                        ExchangeRate = model.CurrencyId == null ? 1 : model.ExchangeRate,
                        model.CreateUserId,
                        model.FundTypeId,
                        Step = 0,
                        model.InOut,
                        HeaderId = model.TreasuryId,
                        model.CreateDateTime,
                        BankAccountId = model.BankAccountId == null ? 0 : model.BankAccountId,
                        model.TransitNo,
                        ActionId = model.Actionid,
                        BankReport = bankReport,
                        model.BankId,
                        model.DocumentNo,
                        TreasuryLineDetailId = model.TreasuryDetailId,
                        model.NoSeriesId,
                        model.Id,
                        ObjectPostingGroupJson = JsonConvert.SerializeObject(model.TreasuryPostingList)
                    }, commandType: CommandType.StoredProcedure);
                    conn.Close();

                    result.Successfull = output.Status == 100;
                    result.Status = result.Successfull ? 100 : -100;
                    result.StatusMessage = "عملیات با موفقیت انجام شد";

                    if (string.IsNullOrEmpty(model.SayadNumber))
                        return result;

                    var checkDetailId = await ExistCheckInfo(model.CheckDetailId, model.SayadNumber, model.BankIssuerId,
                        model.BondSerialNo, model.DocumentNo);

                    if (checkDetailId > 0)
                    {
                        result.Id = 0;
                        result.Successfull = result.Id > 0;
                        result.Status = result.Successfull ? 100 : -100;
                        result.StatusMessage =
                            $"شماره صیاد در چک با شناسه {checkDetailId} قبلا به ثبت رسیده ، مجاز به ثبت نمی باشید";
                        return result;
                    }

                    var queryDetail = "[fm].[Spc_TreasuryLineDetail_InsUpd]";
                    conn.Open();

                    var outputDetail = await conn.ExecuteScalarAsync<int>(queryDetail, new
                    {
                        model.SayadNumber,
                        CheckSerial = model.BondSerialNo,
                        CheckNumber = model.DocumentNo,
                        CheckBranChNo = model.BondBranchNo,
                        CheckBranchName = model.BondBranchName,
                        CheckDueDate = model.BondDueDate,
                        CheckIssuer = model.BondIssuer,
                        CheckBankIssuerId = model.BankIssuerId,
                        CheckBankAccountIssuer = model.BankAccountIssuer,
                        CheckLastStep = 1,
                        model.CreateDateTime,
                        UserId = model.CreateUserId,
                        Id = model.CheckDetailId
                    }, commandType: CommandType.StoredProcedure);
                    conn.Close();

                    result.Id = outputDetail;
                    result.Successfull = result.Id > 0;
                    result.Status = result.Successfull ? 100 : -100;
                    result.StatusMessage = result.Status == 100
                        ? "عملیات با موفقیت انجام شد"
                        : "انجام عملیات با مشکل مواجه شد";
                }
            }
        }

        return result;
    }


    public async Task<bool> UpdateTreasuryCheck_CheckDetailIdentity(int checkId, long checkDetailId)
    {
        var filter = $"Id={checkId}";

        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_UpdItem_Number]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                TableName = "fm.TreasuryLine",
                ColumnName = "TreasuryLineDetailId",
                Value = checkDetailId,
                Filter = filter
            }, commandType: CommandType.StoredProcedure);

            return result == null ? true : false;
        }
    }

    public async Task<MyResultStatus> Delete(GetTreasuryLine model, int companyId)
    {
        var result = new MyResultStatus();
        var validateResult = await ValidateDeleteTreasuryLine(model, companyId);

        if (ExtentionMethod.ListHasRow(validateResult))
        {
            result.Successfull = false;
            result.ValidationErrors = validateResult;
            return result;
        }

        var output = 0;

        var sQuery = "fm.Spc_TreasuryLine_Delete";
        using (var conn = Connection)
        {
            conn.Open();
            output = await conn.QueryFirstOrDefaultAsync<int>(
                sQuery, new
                {
                    model.Id
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = output > 0;
        result.Status = result.Successfull ? 100 : -100;
        result.StatusMessage = !result.Successfull ? "عملیات حذف با مشکل مواجه شد" : "";

        return result;
    }

    public async Task<List<string>> ValidateDeleteTreasuryLine(GetTreasuryLine model, int companyId)
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

            var treasuryAction = new GetAction();

            var currentActionId = await GetActionIdByIdentityId(model.TreasuryId);
            treasuryAction.StageId = model.StageId;
            treasuryAction.ActionId = currentActionId.ActionId;
            treasuryAction.WorkflowId = currentActionId.WorkflowId;
            var currentTreasuryStageAct = await _stageActionRepository.GetAction(treasuryAction);

            if (!currentTreasuryStageAct.IsDeleteLine) error.Add("مجاز به حذف سطر در این گام نمی باشید");

            #endregion

            #region برگه جاری مرجع است؟

            var targetId = await GetTargetId(model.TreasuryId, companyId);
            if (targetId > 0) error.Add("برگه جاری مرجع می باشد، مجاز به حذف نمی باشید");

            #endregion

            #region آیا شماره چک در گردش هست یا نه

            if (currentTreasuryStageAct.IsMaxStepReviewed)
                if (model.FundTypeId == 3 || model.FundTypeId == 6 || model.FundTypeId == 7 || model.FundTypeId == 8)
                {
                    var treasuryCheck = await GetTreasuryCheckWithMaxStep(model.Id);
                    if (treasuryCheck != null)
                    {
                        if (treasuryCheck.MaxStep > treasuryCheck.Step)
                            error.Add(
                                $"شماره چک {treasuryCheck.SayadNumber} دارای گردش می باشد، مجاز به حذف نمی باشید");
                        else if (treasuryCheck.MaxStep < treasuryCheck.Step)
                            error.Add("خطا در حذف اطلاعات، به مدیر سیستم اطلاعات دهید");
                    }
                }

            #endregion

            #region بررسی وضعیت دوره مالی

            var treasury = _newTreasuryRepository.GetRecordById(model.TreasuryId, companyId).Result.Data;
            var resultCheckFiscalYear =
                await _fiscalYearRepository.GetFicalYearStatusByDate(treasury.TransactionDate, companyId);
            if (!resultCheckFiscalYear.Successfull)
                error.Add(resultCheckFiscalYear.StatusMessage);

            #endregion
        });

        return error;
    }


    public async Task<RequestActionDetail> GetRequestActionDetail(int ParentId, int ParentWorkFlowCategoryId,
        int CompanyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[wf].[SPC_MidSystem_RequestProperties]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<RequestActionDetail>(sQuery, new
            {
                ObjectId = ParentId,
                WorkflowCategoryId = ParentWorkFlowCategoryId,
                CompanyId
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
            return result;
        }
    }

    public async Task<List<string>> ValidateSaveTreasuryLine(NewTreasuryLineModel model,
        List<PostingGroupbyTypeLineModel> data, OperationType operationType, int companyId)

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
                if (data.Count == 0)
                {
                    error.Add("کدینگ حسابداری تعریف نشده است ");
                }
                else
                {
                    var headerId = 0;
                    headerId = model.BankAccountId > 0
                        ? (int)PostingGroupType.BankAccount
                        : (int)PostingGroupType.Branch;
                    var postLine = await _postingGroupRepository.GetAllDataDropDown(headerId);

                    var Amount = Math.Truncate(model.Amount);
                    var decimalAmountPoint = model.Amount - Math.Truncate(model.Amount);


                    for (var j = 0; j < postLine.Count; j++)
                    {
                        var strError = "";
                        strError = $"برای {model.BankAccountId} کدینگ حسابداری تعریف نشده است";

                        var PostingGroup = data.FirstOrDefault(x => x.PostingGroupTypeLineId == postLine[j].Id);
                        var PostingGroupFlg = PostingGroup != null ? true : false;

                        if (PostingGroupFlg)
                        {
                            switch (postLine[j].Id)
                            {
                                case 25: //   مبلغ -صحیح 
                                case 27:
                                    if (Amount == 0)
                                        error.Add($"{postLine[j].Name} : برای حساب بانکی  مبلغ را تعیین نمایید! ");

                                    if (Amount > 0 && (PostingGroup.AccountGLId == 0 || PostingGroup.AccountSGLId == 0))
                                        error.Add(strError);

                                    break;
                                case 26: //  مبلغ - اعشار 
                                case 28:
                                    if (decimalAmountPoint > 0 &&
                                        (PostingGroup.AccountGLId == 0 || PostingGroup.AccountSGLId == 0))
                                        error.Add(strError);

                                    break;
                            }
                        }
                        else
                        {
                            if ((postLine[j].Id == 25 || postLine[j].Id == 27) && Amount > 0) //  بهای خرید -صحیح 
                                error.Add(strError);

                            if ((postLine[j].Id == 26 || postLine[j].Id == 28) &&
                                decimalAmountPoint > 0) //  بهای خرید - اعشار 
                                error.Add(strError);
                        }
                    }
                }


                #region بررسی وضعیت  برگه درخواست

                if (model.ParentId > 0)
                {
                    var requestActionDetail = new RequestActionDetail();
                    requestActionDetail =
                        GetRequestActionDetail(model.ParentId, model.ParentWorkFlowCategoryId, companyId).Result;
                    if (!requestActionDetail.IsLastConfirmHeader) error.Add("برگه درخواست تایید نشده است");
                }

                #endregion

                #region بررسی وضعیت دوره مالی

                var treasury = _newTreasuryRepository.GetRecordById(model.TreasuryId, companyId).Result.Data;

                var resultCheckFiscalYear =
                    await _fiscalYearRepository.GetFicalYearStatusByDate(treasury.TransactionDate, companyId);
                if (!resultCheckFiscalYear.Successfull)
                    error.Add(resultCheckFiscalYear.StatusMessage);

                #endregion
            }
        });

        return error;
    }

    #endregion

    #region request Region

    #region getRequests

    public async Task<MyResultStageStepConfigPage<Application.Dtos.FM.NewTreasuryLine.TreasuryRequest>>
        GetTreasuryLineRequest(GetPageViewModel model,
            int companyId)
    {
        var result = new MyResultStageStepConfigPage<Application.Dtos.FM.NewTreasuryLine.TreasuryRequest>
        {
            Data = new Application.Dtos.FM.NewTreasuryLine.TreasuryRequest
            {
                Columns = new List<GetStageStepConfigColumnsViewModel>()
            }
        };

        int? parentId = Convert.ToInt32(model.Form_KeyValue[0]?.ToString());

        var fundTypeId = byte.Parse(model.Form_KeyValue[1]?.ToString());

        var fundTypeCat1 = "1,9".Split(",");
        var fundTypeCat2 = "4,5,2".Split(",");
        var fundTypeCat3 = "3,6,7,8".Split(",");

        var isDefaultCurrency = Convert.ToBoolean(Convert.ToInt32(model.Form_KeyValue[2]?.ToString()));
        var stageId = Convert.ToInt16(model.Form_KeyValue[3]?.ToString());
        var listType = Convert.ToInt16(model.Form_KeyValue[4]?.ToString());
        var branchId = Convert.ToInt16(model.Form_KeyValue[5]?.ToString());
        var treasuryId = Convert.ToInt64(model.Form_KeyValue[6]?.ToString());
        var workflowId = Convert.ToInt64(model.Form_KeyValue[7]?.ToString());
        MyClaim.Init(_accessor);

        if (isDefaultCurrency)
        {
            result.Columns = GetRequestSimpleColumns(companyId, fundTypeId);
            result.Columns.DataColumns = result.Columns.DataColumns
                .Where(a => a.Id != "currencyId" && a.Id != "currencyName" && a.Id != "exchangeRate").ToList();
        }
        else
        {
            result.Columns = GetRequestAdvanceColumns(companyId, fundTypeId);
        }


        int? p_documentNo = null, p_bankNo = null;
        string p_accountNo = null, p_sayadNumber = null;
        switch (model.FieldItem)
        {
            case "documentNo":
                p_documentNo = Convert.ToInt32(model.FieldValue);
                break;
            case "bankAccountName":
                p_accountNo = model.FieldValue;
                break;
            case "bankName":
                p_bankNo = Convert.ToInt32(model.FieldValue);
                break;
            case "sayadNumber":
                p_sayadNumber = model.FieldValue;
                break;
        }


        var parameters = new DynamicParameters();
        var sQuery = string.Empty;

        var type = fundTypeCat1.Contains(fundTypeId.ToString()) ? 1 :
            fundTypeCat2.Contains(fundTypeId.ToString()) ? 2 : 3;
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("BranchId", branchId);
        parameters.Add("CompanyId", companyId);
        parameters.Add("FundTypeId", fundTypeId);
        parameters.Add("RequestId", parentId == 0 ? null : parentId);
        parameters.Add("HeaderId", treasuryId);
        parameters.Add("IsDefaultCurrency", isDefaultCurrency);

        using (var conn = Connection)
        {
            conn.Open();
            switch (type)
            {
                case 1:

                    sQuery = "[fm].[Spc_Treasury_TreasuryCashLineByStageId]";
                    var cashRequests =
                        (await conn.QueryAsync(sQuery, parameters, commandType: CommandType.StoredProcedure)).Select
                        (n => new NewRequestTreasuryCash(
                            n.TreasuryCashId,
                            n.CashFundTypeid,
                            n.CashCurrencyId,
                            n.CashCurrencyName,
                            n.CashInout,
                            n.CashCreateUserId,
                            n.CashCreateDateTime,
                            n.CashCreateUserFullName,
                            n.RequestAmount,
                            n.Amount,
                            n.ExchangeRate))
                        .ToList();
                    if (cashRequests.Count() > 0)
                    {
                        result.Data.Requests = new List<NewRequestTreasuryLines>();
                        foreach (var item in cashRequests)
                            result.Data.Requests.Add(_mapper.Map<NewRequestTreasuryLines>(item));
                    }

                    break;
                case 2:

                    parameters.Add("BankId", p_bankNo);
                    parameters.Add("DocumentNo", p_documentNo);
                    parameters.Add("AccountNo", p_accountNo);

                    sQuery = "[fm].[Spc_Treasury_TreasuryDraftLineByStageId]";
                    var draftRequests =
                        (await conn.QueryAsync(sQuery, parameters, commandType: CommandType.StoredProcedure)).Select
                        (n => new NewRequestTreasuryDraft(
                            n.TreasuryDraftId,
                            n.DraftFundTypeid,
                            n.DraftCurrencyId,
                            n.DraftCurrencyName,
                            n.DraftCurrentInout,
                            n.DraftCreateUserId,
                            n.DraftCreateDateTime,
                            n.DraftCreateUserFullName,
                            n.DraftBankId,
                            n.DraftBankName,
                            n.DraftBankAccountId,
                            n.DraftBankAccountNo,
                            n.RequestAmount,
                            n.Amount,
                            n.ExchangeRate))
                        .ToList();
                    if (draftRequests.Count() > 0)
                    {
                        result.Data.Requests = new List<NewRequestTreasuryLines>();
                        foreach (var item in draftRequests)
                            result.Data.Requests.Add(_mapper.Map<NewRequestTreasuryLines>(item));
                    }

                    break;
                case 3:

                    parameters.Add("BankId", p_bankNo);
                    parameters.Add("DocumentNo", p_documentNo);
                    parameters.Add("AccountNo", p_accountNo);
                    parameters.Add("SayadNumber", p_sayadNumber);

                    sQuery = "[fm].[Spc_Treasury_TreasuryCheckLineByStageId]";
                    var chk = await conn.QueryAsync(sQuery, parameters, commandType: CommandType.StoredProcedure);
                    var checkRequests =
                        (await conn.QueryAsync(sQuery, parameters, commandType: CommandType.StoredProcedure)).Select
                        (n => new NewRequestTreasuryCheck(
                            n.TreasuryId,
                            n.TreasuryDate,
                            n.AccountDetailId,
                            n.AccountDetailName,
                            n.TreasuryCheckId,
                            n.TreasuryCheckDetailId,
                            n.CheckFundTypeId,
                            n.CheckBankId,
                            n.CheckBankName,
                            n.CheckBankAccountId,
                            n.CheckBankAccountName,
                            n.CheckCheckSerial,
                            n.CheckCheckNumber,
                            n.CheckBankAccountIssuer,
                            n.CheckBranchNo,
                            n.CheckBranchName,
                            n.BondIssuer,
                            n.CheckDueDate,
                            n.CheckCurrencyId,
                            n.CheckCurrencyName,
                            n.ExchangeRate,
                            n.IssuerBankName,
                            n.IssuerBankId,
                            n.CheckCreateUserId,
                            n.CheckBranchId,
                            n.CheckCreateUserFullName,
                            n.CheckCreateDateTime,
                            n.CheckInout,
                            n.SayadNumber,
                            n.RequestAmount,
                            n.Amount
                        )).ToList();
                    if (checkRequests.Count() > 0)
                    {
                        result.Data.Requests = new List<NewRequestTreasuryLines>();
                        foreach (var item in checkRequests)
                            result.Data.Requests.Add(_mapper.Map<NewRequestTreasuryLines>(item));
                    }

                    break;
            }

            conn.Close();
        }

        if (ExtentionMethod.ListHasRow(result.Data.Requests))
        {
            var fundTypes = result.Data.Requests.Select(f => f.FundTypeId).Distinct().ToList();

            if (ExtentionMethod.ListHasRow(fundTypes))
            {
                var stageStepConfigColumns = new List<GetStageStepConfigColumnsViewModel>();

                for (var y = 0; y < fundTypes.Count; y++)
                {
                    var stageStepConfigColumn = new GetStageStepConfigColumnsViewModel();
                    var fundtype = fundTypes[y];

                    var stageSteConfig = await _stageStepConfigRepository.GetStageStepFieldTables("");

                    stageSteConfig.Data.HeaderFields[0].FieldValue = stageId.ToString();
                    stageSteConfig.Data.HeaderFields[1].FieldValue = workflowId.ToString();
                    stageSteConfig.Data.LineFields.FirstOrDefault().FieldValue = fundtype.ToString();

                    var newColumns = new GetStageStepConfigColumnsViewModel();
                    newColumns.DataColumns = new List<DataStageStepConfigColumnsViewModel>();
                    newColumns.StageStepConfig = stageSteConfig.Data;
                    foreach (var item in result.Columns.DataColumns)
                    {
                        var itm = _mapper.Map<DataStageStepConfigColumnsViewModel>(item);
                        newColumns.DataColumns.Add(itm);
                    }

                    var resultConfig = await _stageStepConfigRepository.GetStageStepConfigColumn(newColumns, true);

                    // جهت تفکیک فیلدهای چک داخل مدال با حالت DataEntry
                    foreach (var item in resultConfig.Data.Where(x =>
                                 x.Id == "inOut" || x.Id == "BondBranchNo" || x.Id == "BondBranchName" ||
                                 x.Id == "BondAccountNo" ||
                                 x.Id == "BondSerialNo" || x.Id == "BondDueDatePersian" || x.Id == "BondIssuer" ||
                                 x.Id == "BondStep" || x.Id == "BankIssuerName" || x.Id == "BankIssuerId" ||
                                 x.Id == "BankAccountIssuer"))
                        if (item.Id == "inOut")
                            item.Editable = false;
                        else
                            item.Id = "detail" + item.Id;

                    if (stageId == 60 || stageId == 61 || stageId == 62 || stageId == 37 || stageId == 36)
                        foreach (var item in resultConfig.Data)
                            item.Editable = false;

                    if (isDefaultCurrency)
                        resultConfig.Data = resultConfig.Data.Where(a =>
                            a.Id != "currencyId" && a.Id != "currencyName" && a.Id != "exchangeRate").ToList();

                    stageStepConfigColumn.DataColumns = new List<DataStageStepConfigColumnsViewModel>();
                    foreach (var item in resultConfig.Data)
                    {
                        var itm = _mapper.Map<DataStageStepConfigColumnsViewModel>(item);
                        stageStepConfigColumn.DataColumns.Add(itm);
                    }

                    stageStepConfigColumn.IdentityId = fundtype;
                    stageStepConfigColumn.IdentityType = 10;

                    result.Data.Columns.Add(stageStepConfigColumn);
                }
            }
        }


        return result;
    }

    #endregion

    #region insertRequests

    public async Task<MyResultStatus> InsertPreviousStageLinests(List<TreasuryLineGetRecord> modelList, int companyId,
        int createUserId, bool isDefaultCurrency)
    {
        var result = new MyResultStatus();
        result.ValidationErrors = new List<string>();
        var validBeforeSave = true;
        var resultErrors = new List<MyResultStatus>();
        var validationErrors = new MyResultDataQuery<MyResultStatus>();


        var stageId = modelList.Select(x => x.StageId).Distinct().SingleOrDefault();

        var fundItemTypeIdList = await _stageFundItemTypeRepository.GetFundItemTypeId(stageId);

        var fundItemTypeIdModel = modelList.Select(x => x.FundTypeId).Distinct().ToList();

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


        var newTreasuryLineItem = new NewTreasuryLineModel();

        var newTreasuryLineItemList = new List<NewTreasuryLineModel>();
        foreach (var item in modelList)
        {
            var getRecoedModel = new GetTreasuryLine
            {
                Id = item.Id, CompanyId = companyId, FundTypeId = item.FundTypeId, IsDefaultCurrency = isDefaultCurrency
            };
            var getRecordItem = await GetRecordById(getRecoedModel);

            newTreasuryLineItem = _mapper.Map<NewTreasuryLineModel>(getRecordItem.Data);

            var modelstage = new GetStageFundItemTypeInOut
            {
                FundItemTypeId = newTreasuryLineItem.FundTypeId,
                StageId = item.StageId
            };

            var inout = Convert.ToByte(await _stageFundItemTypeRepository.GetInOutId(modelstage));
            if (inout == 0)
            {
                result.Successfull = false;
                result.Status = -100;
                result.StatusMessage =
                    $"نوع آیتم انتخابی درخواست با شناسه های : ({item.FundTypeId}) داخل برگه ی مقصد وجود ندارد";
                result.ValidationErrors.Add(result.StatusMessage);
                return result;
            }

            newTreasuryLineItem.InOut = inout == 3 ? item.InOut : inout;

            newTreasuryLineItem.Id = 0;
            newTreasuryLineItem.ParentId = item.ParentId;
            newTreasuryLineItem.StageId = item.StageId;
            newTreasuryLineItem.CreateUserId = createUserId;
            newTreasuryLineItem.CreateDateTime = DateTime.Now;
            newTreasuryLineItem.TreasuryId = Convert.ToInt32(item.HeaderId);
            newTreasuryLineItem.Amount = item.Amount;
            newTreasuryLineItem.AmountExchange = item.AmountExchange;
            newTreasuryLineItem.ParentWorkFlowCategoryId = item.ParentWorkflowCategoryId;
            newTreasuryLineItem.BankAccountId = item.BankAccountId;
            newTreasuryLineItem.WorkflowId = item.WorkflowId;
            long previousTreasuryId = 0;
            if (item.FundTypeId == 1 || item.FundTypeId == 9 || item.FundTypeId == 4 || item.FundTypeId == 5)
            {
                if (newTreasuryLineItem.CurrencyId == 1)
                {
                    newTreasuryLineItem.ExchangeRate = 1;
                    newTreasuryLineItem.AmountExchange = item.Amount != 0 ? item.Amount : newTreasuryLineItem.Amount;
                    newTreasuryLineItem.Amount = item.Amount != 0 ? item.Amount : newTreasuryLineItem.Amount;
                }
                else
                {
                    newTreasuryLineItem.ExchangeRate =
                        item.ExchangeRate != 0 ? item.ExchangeRate : newTreasuryLineItem.ExchangeRate;
                    newTreasuryLineItem.Amount = item.Amount != 0 ? item.Amount : newTreasuryLineItem.Amount;
                    newTreasuryLineItem.AmountExchange = item.AmountExchange != null
                        ? item.AmountExchange
                        : newTreasuryLineItem.ExchangeRate * newTreasuryLineItem.Amount;
                }
            }

            if (item.FundTypeId == 4 || item.FundTypeId == 5)
            {
                using (var conn = Connection)
                {
                    var sQuery = "pb.Spc_Tables_GetItem";
                    conn.Open();

                    previousTreasuryId = await conn.ExecuteScalarAsync<long>(sQuery, new
                    {
                        TableName = "fm.TreasuryLine",
                        ColumnName = "[HeaderId]",
                        Filter = $"Id='{item.Id}'",
                        OrderBy = ""
                    }, commandType: CommandType.StoredProcedure);

                    conn.Close();
                }

                newTreasuryLineItem.DocumentNo = item.DocumentNo != null ? item.DocumentNo.Value : 0;
                newTreasuryLineItem.BankAccountId =
                    item.BankAccountId != 0 ? item.BankAccountId : newTreasuryLineItem.BankAccountId;
                newTreasuryLineItem.BankId = item.BankId != 0 ? item.BankId : newTreasuryLineItem.BankId;
            }

            if (item.FundTypeId == 3 || item.FundTypeId == 6 || item.FundTypeId == 7 || item.FundTypeId == 8)
            {
                using (var conn = Connection)
                {
                    var sQuery = "pb.Spc_Tables_GetItem";
                    conn.Open();

                    previousTreasuryId = await conn.ExecuteScalarAsync<long>(sQuery, new
                    {
                        TableName = "fm.TreasuryLine",
                        ColumnName = "[HeaderId]",
                        Filter = $"Id='{item.Id}'",
                        OrderBy = ""
                    }, commandType: CommandType.StoredProcedure);

                    conn.Close();
                }

                newTreasuryLineItem.BankId = item.BankId;
                newTreasuryLineItem.BankAccountId = item.BankAccountId != null
                    ? item.BankAccountId
                    : newTreasuryLineItem.BankAccountId;
                newTreasuryLineItem.SayadNumber =
                    item.SayadNumber != null ? item.SayadNumber : newTreasuryLineItem.SayadNumber;
                newTreasuryLineItem.DocumentNo =
                    item.DocumentNo != null ? item.DocumentNo.Value : newTreasuryLineItem.DocumentNo;
                newTreasuryLineItem.BondSerialNo = string.IsNullOrEmpty(item.BondSerialNo)
                    ? newTreasuryLineItem.BondSerialNo
                    : long.Parse(item.BondSerialNo);

                newTreasuryLineItem.Amount = item.Amount != 0 ? item.Amount : newTreasuryLineItem.Amount;
                newTreasuryLineItem.BondDueDatePersian = !string.IsNullOrEmpty(item.BondDueDatePersian)
                    ? item.BondDueDatePersian
                    : newTreasuryLineItem.BondDueDatePersian;


                var checkExist = await TreasuryCheckExist(newTreasuryLineItem);
                if (checkExist > 0)
                    validBeforeSave = false;
                else
                    newTreasuryLineItem.Step++;
            }

            var requestIsBank = await TreasuryRequestGetIsBank(previousTreasuryId);

            var getTreasuryAction = new GetAction();
            getTreasuryAction.CompanyId = companyId;
            getTreasuryAction.StageId = item.StageId;
            var currentActionId = await GetActionIdByIdentityId(Convert.ToInt32(item.HeaderId));
            getTreasuryAction.ActionId = currentActionId.ActionId;
            getTreasuryAction.WorkflowId = item.WorkflowId;
            var stageAction = await _stageActionRepository.GetAction(getTreasuryAction);

            if (requestIsBank == 1 && !stageAction.IsBank) newTreasuryLineItem.BankAccountId = null;

            #region CheckreasuryLinePostingGroup

            var postingGroupLine = new PostingGroupHeaderModel();
            var newTreasuryLinePostingGroup = new GetPostingGroup();

            newTreasuryLinePostingGroup.CompanyId = companyId;
            newTreasuryLinePostingGroup.FundTypeId = newTreasuryLineItem.FundTypeId;
            newTreasuryLinePostingGroup.ItemTypeId = newTreasuryLineItem.FundTypeId;
            newTreasuryLinePostingGroup.StageId = newTreasuryLineItem.StageId;
            newTreasuryLinePostingGroup.ItemCategoryId = 0;


            if (item.BankAccountId > 0)
            {
                newTreasuryLineItem.NoSeriesId = (byte)NoSeries.BankAccount;
                newTreasuryLinePostingGroup.HeaderId = (int)newTreasuryLineItem.BankAccountId;
                newTreasuryLinePostingGroup.PostingGroupTypeId = PostingGroupType.BankAccount;
                newTreasuryLinePostingGroup.BranchId = 0; //ندارد Branch حساب بانکی 
                newTreasuryLineItem.AccountDetailId = (int)newTreasuryLineItem.BankAccountId;
            }

            else
            {
                newTreasuryLineItem.NoSeriesId = (byte)NoSeries.Branch;
                newTreasuryLinePostingGroup.HeaderId = newTreasuryLineItem.BranchId;
                newTreasuryLinePostingGroup.PostingGroupTypeId = PostingGroupType.Branch;
                newTreasuryLinePostingGroup.BranchId = Convert.ToInt16(newTreasuryLineItem.BranchId);
                newTreasuryLineItem.AccountDetailId = newTreasuryLineItem.AccountDetailTreasuryId ?? 0;
            }


            var res = new MyResultPage<List<PostingGroupbyTypeLineModel>>
            {
                Data = new List<PostingGroupbyTypeLineModel>()
            };


            res.Data = await _postingGroupRepository.GetPostingGroupByTypeLine(newTreasuryLinePostingGroup);

            for (var d = 0; d < res.Data.Count(); d++)
            {
                res.Data[d].AccountDetailId = newTreasuryLineItem.AccountDetailId;
                res.Data[d].NoSeriesId = newTreasuryLineItem.NoSeriesId;
            }

            var TreasuryPosting = res.Data;
            newTreasuryLineItem.TreasuryPostingList = TreasuryPosting;

            if (res.Data.Count > 0)
            {
                if (newTreasuryLineItem.BankAccountId > 0)
                {
                    var amountPoint = Math.Truncate(newTreasuryLineItem.Amount);
                    if (res.Data.Any(x => x.PostingGroupTypeLineId == 25) && amountPoint == 0)
                    {
                        var portinggrouptypeLineAmount = res.Data.FirstOrDefault(p => p.PostingGroupTypeLineId == 25);
                        res.Data.Remove(portinggrouptypeLineAmount);
                    }

                    var decimalAmountPoint = newTreasuryLineItem.Amount - amountPoint;
                    if (res.Data.Any(x => x.PostingGroupTypeLineId == 26) && decimalAmountPoint == 0)
                    {
                        var portinggrouptypeLineDecimalAmount =
                            res.Data.FirstOrDefault(p => p.PostingGroupTypeLineId == 26);
                        res.Data.Remove(portinggrouptypeLineDecimalAmount);
                    }
                }
                else
                {
                    var amountPoint = Math.Truncate(newTreasuryLineItem.Amount);
                    if (res.Data.Any(x => x.PostingGroupTypeLineId == 27) && amountPoint == 0)
                    {
                        var portinggrouptypeLineAmount = res.Data.FirstOrDefault(p => p.PostingGroupTypeLineId == 27);
                        res.Data.Remove(portinggrouptypeLineAmount);
                    }

                    var decimalAmountPoint = newTreasuryLineItem.Amount - amountPoint;
                    if (res.Data.Any(x => x.PostingGroupTypeLineId == 28) && decimalAmountPoint == 0)
                    {
                        var portinggrouptypeLineDecimalAmount =
                            res.Data.FirstOrDefault(p => p.PostingGroupTypeLineId == 28);
                        res.Data.Remove(portinggrouptypeLineDecimalAmount);
                    }
                }


                var validateResult = new List<string>();

                validateResult =
                    await ValidateSaveTreasuryLine(newTreasuryLineItem, res.Data, OperationType.Insert, companyId);


                if (validateResult.Count > 0)
                {
                    var resultQuery = new MyResultStatus
                    {
                        ValidationErrors = validateResult
                    };

                    validationErrors = new MyResultDataQuery<MyResultStatus>
                    {
                        Successfull = false,
                        Data = resultQuery,
                        ValidationErrors = validateResult
                    };
                    result.ValidationErrors.Add(string.Join("-", validationErrors.ValidationErrors));
                    result.Successfull = validationErrors.Successfull;
                }
                else
                {
                    newTreasuryLineItemList.Add(newTreasuryLineItem);
                }
            }
            else
            {
                result.ValidationErrors.Add(
                    string.Join("-", "در مرحله و نوع وجه انتخابی کدینگ حسابداری تعریف نشده است"));
                result.Successfull = false;
            }

            #endregion
        }

        if (result.ValidationErrors.Count > 0 || !validBeforeSave)
            return result;


        for (var i = 0; i < newTreasuryLineItemList.Count; i++)
        {
            result = await Save(newTreasuryLineItemList[i], companyId);

            if (!result.Successfull)
            {
                result.ValidationErrors.Add(result.StatusMessage);
                return result;
            }
        }


        if (result.ValidationErrors.Count == 0)
            result.StatusMessage = "عملیات با موفقیت انجام شد";


        return result;
    }

    #endregion

    #endregion

    #region lateralFunctions Region

    public async Task<int> TreasuryRequestGetIsBank(long requestId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasuryRequest_Get_IsBank]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                RequestId = requestId
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<int> ExistCheck(string sayadNumber, int treasuryId, short stageId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasuryCheck_ExistSayadNumber]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                SayadNumber = sayadNumber,
                StageId = stageId,
                TreasuryId = treasuryId
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<long> ExistCheckInfo(long checkIdentityId, string sayadNumber, long BankIssuerId,
        long BondSerialNo, long DocumentNo)
    {
        var filter = string.Empty;

        if (checkIdentityId == 0)
            filter =
                $"SayadNumber='{sayadNumber}'  OR (CheckBankIssuerId ='{BankIssuerId}' AND CheckSerial ='{BondSerialNo}' AND CheckNumber ='{DocumentNo}')";
        else
            filter =
                $"SayadNumber='{sayadNumber}' AND id<> {checkIdentityId} OR (CheckBankIssuerId ='{BankIssuerId}' AND CheckSerial ='{BondSerialNo}' AND CheckNumber ='{DocumentNo}')";


        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<long>(sQuery, new
            {
                TableName = "fm.TreasuryLineDetail",
                ColumnName = "id",
                Filter = $"SayadNumber='{sayadNumber}'",
                OrderBy = ""
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }


    public async Task<GetActionByWorkflow> GetActionIdByIdentityId(int IdentityId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetTable]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<GetActionByWorkflow>(sQuery, new
            {
                TableName = "fm.treasury",
                ColumnNameList = "actionid AS ActionId,Id AS TreasuryId, workflowId AS WorkflowId",
                Filter = $"Id={IdentityId}"
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
                TableName = "fm.treasury",
                ColumnName = "Id",
                Filter = $"RequestId={id} AND companyId={companyId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<NewTreasuryLines> GetTreasuryCheckBankInfo(int treasuryId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<NewTreasuryLines>(sQuery, new
            {
                TableName = "fm.TreasuryLine",
                ColumnName = "BankAccountId,BankId",
                Filter = $"HeaderId={treasuryId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<PostingGroupbyTypeLineModel> GetTreasuryCheckByStepAndSayad(int step, string sayadNumber)
    {
        var result = new PostingGroupbyTypeLineModel();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_Get_TreasuryCheckByStepAndSayadNumber]";
            conn.Open();

            result = await conn.QueryFirstOrDefaultAsync<PostingGroupbyTypeLineModel>(sQuery, new
            {
                Step = step,
                SayadNumber = sayadNumber
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<NewTreasuryLines> GetTreasuryCheckWithMaxStep(int id)
    {
        var result = new NewTreasuryLines();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasuryCheck_MaxStep_Get]";
            conn.Open();

            result = await conn.QueryFirstOrDefaultAsync<NewTreasuryLines>(sQuery, new
            {
                TreasuryCheckId = id
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
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


    public async Task<int> TreasuryCheckExist(NewTreasuryLineModel model)
    {
        var resultCheckExist = 0;
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasuryCheck_ExistCheck]";
            resultCheckExist = await conn.QueryFirstOrDefaultAsync<int>(sQuery, new
            {
                model.SayadNumber,
                model.Step,
                model.StageId
            }, commandType: CommandType.StoredProcedure);
        }

        return resultCheckExist;
    }


    public async Task<List<TreasuryLinePostingGroup>> GetTreasuryLineListForPost(List<ID> treasuryIds, int companyId,
        int typeId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasuryLine_PostingGroup_GetList]";
            conn.Open();

            var result = (await conn.QueryAsync<TreasuryLinePostingGroup>(sQuery,
                new
                {
                    IdsJSON = JsonConvert.SerializeObject(treasuryIds),
                    CompanyId = companyId,
                    TypeId = typeId
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    #endregion
}