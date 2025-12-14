using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.FM.PostingGroup;
using ParsAlphabet.ERP.Application.Dtos.WF.StageFundItemType;
using ParsAlphabet.ERP.Application.Dtos.WF.StageStepConfig;
using ParsAlphabet.ERP.Application.Dtos.WH.ItemTransactionLine;
using ParsAlphabet.ERP.Application.Dtos.WH.WarehouseTransaction;
using ParsAlphabet.ERP.Application.Dtos.WH.WarehouseTransactionLine;
using ParsAlphabet.ERP.Application.Dtos.WH.WBin;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces.FM.PostingGroup;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.CostCenter;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYear;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.Stage;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageFundItemType;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageStepConfig;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.Warehouse;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.WarehouseTransaction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.WBin;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.Zone;
using Validation = ParsAlphabet.ERP.Application.Dtos.FormPlate1.Validation;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemTransactionLine;

public class ItemTransactionLineRepository :
    BaseRepository<WarehouseTransactionModel, int, string>,
    IBaseRepository<WarehouseTransactionModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;
    private readonly BinRepository _binRepository;
    private readonly ICompanyRepository _companyRepository;
    private readonly CostCenterRepository _costCenterRepository;
    private readonly FiscalYearRepository _fiscalYearRepository;
    private readonly ILoginRepository _loginRepository;
    private readonly IMapper _mapper;
    private readonly IPostingGroupRepository _postingGroupRepository;
    private readonly StageActionRepository _stageActionRepository;
    private readonly StageFundItemTypeRepository _stageFundItemTypeRepository;
    private readonly StageRepository _stageRepository;
    private readonly StageStepConfigRepository _stageStepConfigRepository;
    private readonly WarehouseRepository _warehouseRepository;
    private readonly WarehouseTransactionRepository _warehouseTransactionRepository;
    private readonly ZoneRepository _zoneRepository;

    public ItemTransactionLineRepository(
        IConfiguration config,
        IHttpContextAccessor accessor,
        StageActionRepository stageActionRepository,
        StageRepository stageRepository,
        StageStepConfigRepository stageStepConfigRepository,
        IMapper mapper,
        IPostingGroupRepository postingGroupRepository,
        WarehouseTransactionRepository warehouseTransactionRepository,
        CostCenterRepository costCenterRepository,
        FiscalYearRepository fiscalYearRepository,
        BinRepository binRepository,
        ZoneRepository zoneRepository,
        WarehouseRepository warehouseRepository,
        ICompanyRepository companyRepository,
        StageFundItemTypeRepository stageFundItemTypeRepository,
        ILoginRepository loginRepository
    ) : base(config)
    {
        _accessor = accessor;
        _stageActionRepository = stageActionRepository;
        _stageRepository = stageRepository;
        _stageStepConfigRepository = stageStepConfigRepository;
        _mapper = mapper;
        _postingGroupRepository = postingGroupRepository;
        _warehouseTransactionRepository = warehouseTransactionRepository;
        _costCenterRepository = costCenterRepository;
        _fiscalYearRepository = fiscalYearRepository;
        _binRepository = binRepository;
        _zoneRepository = zoneRepository;
        _warehouseRepository = warehouseRepository;
        _companyRepository = companyRepository;
        _stageFundItemTypeRepository = stageFundItemTypeRepository;
        _loginRepository = loginRepository;
    }


    public GetColumnsViewModel GetHeaderColumns()
    {
        var list = new GetColumnsViewModel
        {
            Title = "مشخصات سند انبار",
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
                    Id = "transactionDatePersian", IsPrimary = true, Title = "تاریخ برگه",
                    Type = (int)SqlDbType.VarChar, Size = 8, IsDtParameter = true, Editable = true, InputOrder = 4,
                    Width = 6, InputType = "datepicker", InputMask = new InputMask { Mask = "'mask':'9999/99/99'" },
                    IsFocus = true,
                    Validations = new List<Validation> { new() { ValidationName = "data-parsley-shamsidate" } }
                },
                new() { Id = "no", Title = "شماره برگه", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 8 },
                new()
                {
                    Id = "journalId", Title = "شناسه سند ", IsPrimary = true, Type = (int)SqlDbType.Int,
                    IsDtParameter = true, IsFilterParameter = false, FilterType = "number", Width = 8
                },
                new()
                {
                    Id = "requestId", Title = "درخواست", Editable = true, InputOrder = 1, InputType = "select",
                    IsSelect2 = true,
                    Inputs = null, FillType = "front", Type = (int)SqlDbType.TinyInt, Width = 12,
                    Validations = new List<Validation> { new() { ValidationName = "required" } }, IsPrimary = true
                },
                new()
                {
                    Id = "requestNo", Title = "شناسه درخواست", Type = (int)SqlDbType.TinyInt, HasLink = true,
                    IsDtParameter = true, Width = 8
                },
                new() { Id = "createUserId", IsPrimary = true, Title = "کاربر ثبت کننده" },
                new() { Id = "branchId", Title = "شناسه شعبه", Type = (int)SqlDbType.TinyInt, IsPrimary = true },
                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.TinyInt, IsDtParameter = true,
                    IsPrimary = true, Width = 15
                },

                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15
                },
                new() { Id = "stageId", Title = "شناسه مرحله", IsPrimary = true },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.TinyInt, IsDtParameter = true, Width = 15
                },
                new() { Id = "stageName", IsPrimary = true },
                new()
                {
                    Id = "parentWorkflowCategory", Title = "دسته بندی درخواست", Type = (int)SqlDbType.NVarChar,
                    IsPrimary = true, Size = 50, IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "requestRemainedAmountName", Title = "مانده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 8, ClassName = "difference-input", IsCommaSep = true
                },
                new()
                {
                    Id = "isMultipleName", Title = "ارتباط یک به چند با درخواست", Type = (int)SqlDbType.NVarChar,
                    Size = 50, IsDtParameter = false, Width = 17, ClassName = "difference-input", IsCommaSep = true
                },
                new()
                {
                    Id = "inOutName", Title = "ماهیت حساب", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 12
                },
                new() { Id = "stageClassId", IsPrimary = true, Type = (int)SqlDbType.TinyInt },
                new() { Id = "isRequest", IsPrimary = true, Type = (int)SqlDbType.TinyInt },
                new() { Id = "accountGLId", Title = "کد کل", IsPrimary = true, Type = (int)SqlDbType.SmallInt },
                new()
                {
                    Id = "accountGL", Title = "کد کل", IsPrimary = true, Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "accountSGLId", Title = "کد معین", IsPrimary = true, Type = (int)SqlDbType.TinyInt,
                    IsReadOnly = true
                },
                new()
                {
                    Id = "accountSGL", Title = "کد معین", IsPrimary = true, Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15
                },
                new() { Id = "noSeriesName", Title = "گروه تفصیل", IsPrimary = true },
                new()
                {
                    Id = "accountDetailId", Title = "حساب تفصیل", IsPrimary = true, Type = (int)SqlDbType.SmallInt,
                    Editable = true, InputOrder = 3, Width = 6, InputType = "select", Inputs = null, IsSelect2 = true,
                    Select2Title = "accountDetailName", IsFocus = true, FillType = "front"
                },
                new()
                {
                    Id = "accountDetail", Title = "حساب تفصیل", IsPrimary = true, Type = (int)SqlDbType.NVarChar,
                    Size = 50, IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "documentTypeId", Title = "نوع سند", IsPrimary = true, Type = (int)SqlDbType.SmallInt,
                    IsReadOnly = true
                },
                new()
                {
                    Id = "documentType", Title = "نوع سند", IsPrimary = true, Type = (int)SqlDbType.NVarChar, Size = 50
                },
                new()
                {
                    Id = "warehouse", Title = "انبار", IsPrimary = true, Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15
                },
                new() { Id = "actionId", Title = "گام مرحله", Type = (int)SqlDbType.NVarChar, IsPrimary = true },
                new()
                {
                    Id = "actionIdName", Title = "گام مرحله", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 12
                },
                new()
                {
                    Id = "note", Title = "توضیحات", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    Width = 12, IsNotFocusSelect = true, InputOrder = 5, IsFocus = true, IsPrimary = true
                },

                new()
                {
                    Id = "createDateTime", Title = "تاریخ ثبت", Type = (int)SqlDbType.Date, Size = 10, IsPrimary = true,
                    InputMask = new InputMask { Mask = "'mask':'9999/99/99'" }
                },
                new() { Id = "isDataEntry", IsPrimary = true },
                new() { Id = "warehouseId", IsPrimary = true },
                new() { Id = "workflowId", IsPrimary = true },
                new() { Id = "isEqualToParentRequest", IsPrimary = true },
                new() { Id = "parentWorkflowCategoryId", IsPrimary = true },
                new() { Id = "inOut", IsPrimary = true },
                new() { Id = "transactionDate", IsPrimary = true },
                new() { Id = "noSeriesId", IsPrimary = true },
                new() { Id = "isPreviousStage", Title = "", IsPrimary = true },
                new() { Id = "stageClassId", IsPrimary = true }
            },

            Navigations = new List<NavigateToPage>
            {
                new()
                {
                    ColumnId = "requestId",
                    PageType = PageType.Mdal,
                    Url = "/WH/ItemTransactionLine/display",
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

    public async Task<MyResultPage<ItemTransactionLineDisplay>> GetHeader(GetPageViewModel model)
    {
        var result = new MyResultPage<ItemTransactionLineDisplay>
        {
            Data = new ItemTransactionLineDisplay()
        };

        var parameters = new DynamicParameters();
        parameters.Add("ItemTransactionId", model.Form_KeyValue[0]?.ToString());
        parameters.Add("AmountOrQuantity", 0);
        result.Columns = GetHeaderColumns();

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_ItemTransaction_Display]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<ItemTransactionLineDisplay>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).FirstOrDefault();
        }

        if (result.Data != null)
        {
            result.Data.IsPreviousStage =
                await _stageFundItemTypeRepository.GetHasStagePrevious(result.Data.StageId, result.Data.WorkflowId);

            var getItemTransactionAction = new GetAction();
            getItemTransactionAction.CompanyId = model.CompanyId;
            getItemTransactionAction.StageId = result.Data.StageId;
            getItemTransactionAction.ActionId = result.Data.ActionId;
            getItemTransactionAction.WorkflowId = result.Data.WorkflowId;

            var stageAction = await _stageActionRepository.GetAction(getItemTransactionAction);
            if (stageAction != null)
            {
                result.Data.IsDataEntry = Convert.ToInt32(stageAction.IsDataEntry);
                result.Data.IsRequest = stageAction.IsRequest;
                result.Data.IsEqualToParentRequest = result.Data.ParentWorkflowCategoryId == 11 ? true : false;
            }
        }

        return result;
    }

    public async Task<GetStageStepConfigColumnsViewModel> GetLineSimpleElement(int companyId, short stageId,
        int workflowId)
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
                    { new() { FieldId = "itemTypeId", TableName = "wh.ItemTransactionLine" } }
            },
            DataColumns = new List<DataStageStepConfigColumnsViewModel>
            {
                new() { Id = "id", IsPrimary = true, Title = "شناسه", Type = (int)SqlDbType.Int, Width = 2 },
                new()
                {
                    Id = "itemTypeId", Title = "نوع آیتم", IsDtParameter = true, Width = 2, IsFocus = true,
                    InputType = "select", IsSelect2 = true
                },
                new()
                {
                    Id = "itemId", Title = "آیتم", IsDtParameter = true, Width = 4, InputType = "select",
                    Validations = new List<Validation> { new() { ValidationName = "required" } }, IsSelect2 = true
                },
                new()
                {
                    Id = "categoryItemId", Title = "دسته بندی کالا", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 2
                },
                new()
                {
                    Id = "attributeIds", Title = "صفات کالا", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 4, InputType = "select", IsSelect2 = true, IsFocus = true,
                    Validations = new List<Validation>
                    {
                        new() { ValidationName = "required" }
                    }
                },
                new()
                {
                    Id = "subUnitId", Title = "واحد شمارش", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 2, InputType = "select", IsSelect2 = true, IsFocus = true,
                    Validations = new List<Validation>
                    {
                        new() { ValidationName = "required" }
                    }
                },
                new()
                {
                    Id = "zoneId", Title = "بخش انبار", IsDtParameter = true, Width = 2, InputType = "select",
                    Validations = new List<Validation> { new() { ValidationName = "required" } }, IsSelect2 = true
                },
                new()
                {
                    Id = "binId", Title = "پالت انبار", IsDtParameter = true, Width = 2, InputType = "select",
                    Validations = new List<Validation> { new() { ValidationName = "required" } }, IsSelect2 = true
                },
                new()
                {
                    Id = "quantity", Title = "مقدار", IsPrimary = true, Type = (int)SqlDbType.Int, Size = 120,
                    IsDtParameter = true, Width = 2, IsCommaSep = true, InputType = "decimal",
                    Validations = new List<Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-min", Value1 = "1" },
                        new() { ValidationName = "data-parsley-max", Value1 = "99999.999" }
                    },
                    MaxLength = 9, InputMask = new InputMask { Mask = "'mask':'9{1,5}.9{1,3}'" }
                },
                new()
                {
                    Id = "totalQuantity", Title = "مقدار کل", Type = (int)SqlDbType.Int, Size = 100,
                    IsDtParameter = true, Width = 2, MaxLength = 9, HeaderReadOnly = true
                },
                new()
                {
                    Id = "inOut", Title = "ورود خروج", IsDtParameter = true, Width = 2, InputType = "select",
                    IsSelect2 = true,
                    Validations = new List<Validation> { new() { ValidationName = "required" } },
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = "api/WH/ItemTransactionLineApi/inout_getdropdown"
                    }
                },
                new()
                {
                    Id = "price", Title = "نرخ", IsCommaSep = true, Width = 2, InputType = "money", HasSumValue = false,
                    Type = (int)SqlDbType.Decimal,
                    IsPersian = true, IsDtParameter = true,
                    Validations = new List<Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-min", Value1 = "1" },
                        new() { ValidationName = "data-parsley-max", Value1 = "999999999999" }
                    },
                    MaxLength = 15
                },
                new()
                {
                    Id = "amount", Title = "مبلغ", IsCommaSep = true, Width = 2, InputType = "money",
                    HasSumValue = true, Type = (int)SqlDbType.Decimal, IsDtParameter = true, HeaderReadOnly = true
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

    public async Task<GetStageStepConfigColumnsViewModel> GetRequestSimpleColumns(int companyId, short stageId,
        int workflowId, byte itemTypeId)
    {
        var list = new GetStageStepConfigColumnsViewModel
        {
            Title = "لیست گردش",
            IsSelectable = true,
            Classes = "group-box-orange",
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "quantity", FieldValue = "0", Operator = "<" } },
            AnswerCondition = "color:#da1717",
            ActionType = "inline",
            HeaderType = "outline",
            DataColumns = new List<DataStageStepConfigColumnsViewModel>
            {
                new() { Id = "id", IsPrimary = true, Title = "شناسه", IsDtParameter = true, Width = 6, Order = true },
                new() { Id = "stageId", IsPrimary = true },
                new() { Id = "itemTypeId", IsPrimary = true },
                new() { Id = "itemType", Title = "نوع آیتم", IsDtParameter = true, Width = 5, Order = true },
                new()
                {
                    Id = "itemId", Title = "آیتم", IsPrimary = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "api/WH/ItemApi/getalldatadropdown"
                },
                new() { Id = "item", Title = "آیتم", IsDtParameter = true, Width = 5, Order = true },
                new() { Id = "inOut", Title = "ورود/خروج", IsPrimary = true },
                new() { Id = "inOutName", Title = "ورود/خروج", IsDtParameter = true, Width = 5 },
                new()
                {
                    Id = "categoryItemName", Title = "دسته بندی کالا", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 5, FilterType = "select2",
                    FilterTypeApi = $"api/WH/ItemCategoryApi/getdropdownbytype/{itemTypeId}"
                },
                new()
                {
                    Id = "attributeName", Title = "صفات کالا", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 9, PublicColumn = true, FilterType = "select2",
                    FilterTypeApi = "api/WH/ItemAttributeApi/attributeitem_getdropdown/null"
                },
                new()
                {
                    Id = "unitNames", Title = "واحد شمارش", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 6, PublicColumn = true, FilterType = "select2",
                    FilterTypeApi = "api/WH/ItemUnitApi/getdropdown"
                },
                new()
                {
                    Id = "inOutName", Title = "ماهیت حساب", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 4
                },
                new()
                {
                    Id = "zone", Title = "بخش انبار", IsDtParameter = true, Type = (int)SqlDbType.NVarChar,
                    IsFilterParameter = true, Width = 6, InputType = "number", FilterType = "select2",
                    FilterTypeApi = "/api/WH/ZoneApi/getalldatadropdown", MaxLength = 20
                },
                new()
                {
                    Id = "bin", Title = "پالت انبار", IsDtParameter = true, IsFilterParameter = true, Width = 6,
                    InputType = "number", FilterType = "select2", FilterTypeApi = "/api/WH/WBinApi/getdropdown",
                    MaxLength = 10
                },
                new()
                {
                    Id = "ratio", Title = "ضریب", Type = (int)SqlDbType.Decimal, IsDtParameter = true, Width = 4,
                    PublicColumn = true, IsPrimary = true
                },

                new()
                {
                    Id = "requestQuantity", Title = "تعداد درخواست ", Type = (int)SqlDbType.Decimal,
                    IsDtParameter = true, Width = 5, PublicColumn = true
                },


                new()
                {
                    Id = "quantity", Title = "تعداد", Type = (int)SqlDbType.Decimal, Size = 30, IsPrimary = true,
                    IsDtParameter = true,
                    IsReadOnly = false, Editable = true, HasSumValue = true, Width = 6, IsCommaSep = true,
                    MaxLength = 9, InputType = "decimal", PublicColumn = true,
                    InputMask = new InputMask { Mask = "'mask':'9{1,5}.9{1,3}'" }
                },


                new()
                {
                    Id = "totalQuantity", Title = "تعداد کل", Type = (int)SqlDbType.Decimal, Size = 30,
                    IsPrimary = true, IsDtParameter = true, Width = 5,
                    HasSumValue = true, IsReadOnly = false, Editable = false, PublicColumn = true
                },


                new()
                {
                    Id = "price", Title = "نرخ", Type = (int)SqlDbType.Decimal, Size = 11, PublicColumn = true,
                    HasSumValue = false, Width = 5,
                    IsReadOnly = true, Editable = true, InputType = "money", MaxLength = 15, IsCommaSep = true,
                    Validations = new List<Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-min", Value1 = "1" },
                        new() { ValidationName = "data-parsley-max", Value1 = "999999999999" }
                    }
                },


                new()
                {
                    Id = "amount", Title = "مبلغ", IsPrimary = true, Type = (int)SqlDbType.Int, Size = 11,
                    PublicColumn = true, IsCommaSep = true, Width = 6,
                    IsReadOnly = true, Editable = true, InputType = "money", HasSumValue = true
                },

                new()
                {
                    Id = "isQuantity", IsPrimary = true, Title = "قابل ویرایش", Type = (int)SqlDbType.Int, Width = 5
                },
                new() { Id = "categoryId", IsPrimary = true },
                new() { Id = "attributeIds", IsPrimary = true },
                new() { Id = "unitId", IsPrimary = true },
                new() { Id = "subUnitId", IsPrimary = true },
                new() { Id = "zoneId", IsPrimary = true },
                new() { Id = "binId", IsPrimary = true },
                new() { Id = "currencyId", IsPrimary = true }
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

    public async Task<GetStageStepConfigColumnsViewModel> GetSimpleColumns(short stageId, int workflowId, int isQuntity)
    {
        var isShowprice = isQuntity == 1 ? true : false;

        var list = new GetStageStepConfigColumnsViewModel
        {
            Title = "لیست گردش",
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "inOut", FieldValue = "2", Operator = "==" } },
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
                Id = "id", IsPrimary = true, Title = "شناسه", IsDtParameter = true, IsFilterParameter = true, Width = 5,
                Order = true, FilterType = "number"
            },
            new()
            {
                Id = "itemType", Title = "نوع آیتم", IsDtParameter = true, IsFilterParameter = true, Width = 6,
                Order = true, FilterType = "select2", FilterTypeApi = ""
            },
            new()
            {
                Id = "item", Title = "آیتم", IsDtParameter = true, IsFilterParameter = true, Width = 10, Order = true,
                FilterType = "select2", FilterTypeApi = ""
            },
            new() { Id = "inOut", Title = "ورود/خروج" },
            new()
            {
                Id = "categoryItemName", Title = "دسته بندی کالا", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                Width = 10, FilterType = "select2", FilterTypeApi = ""
            },
            new()
            {
                Id = "attributeName", Title = "صفات کالا", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                Width = 9, PublicColumn = true, FilterType = "select2", FilterTypeApi = ""
            },
            new()
            {
                Id = "unitNames", Title = "واحد شمارش", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 6,
                PublicColumn = true, FilterType = "select2", FilterTypeApi = ""
            },
            new()
            {
                Id = "zone", Title = "بخش انبار", IsDtParameter = true, Type = (int)SqlDbType.NVarChar,
                IsFilterParameter = true, Width = 6, InputType = "number", FilterType = "select2", FilterTypeApi = "",
                MaxLength = 20
            },
            new()
            {
                Id = "bin", Title = "پالت انبار", IsDtParameter = true, IsFilterParameter = true, Width = 6,
                InputType = "number", FilterType = "select2", FilterTypeApi = "", MaxLength = 10
            },
            new()
            {
                Id = "ratio", Title = "ضریب", Type = (int)SqlDbType.Decimal, IsDtParameter = true, Width = 3,
                PublicColumn = true, IsPrimary = true
            },
            new()
            {
                Id = "quantity", Title = "مقدار ", Type = (int)SqlDbType.Decimal, Size = 100, PublicColumn = true,
                IsDtParameter = true, HasSumValue = true, Width = 5, InputType = "decimal",
                Validations = new List<Validation>
                {
                    new() { ValidationName = "data-parsley-min", Value1 = "1" },
                    new() { ValidationName = "data-parsley-max", Value1 = "99999.999" }
                },
                MaxLength = 9, InputMask = new InputMask { Mask = "'mask':'9{1,5}.9{1,3}'" }
            },
            new()
            {
                Id = "totalQuantity", Title = "مقدار کل", Type = (int)SqlDbType.Decimal, Size = 100,
                PublicColumn = true, IsDtParameter = true, HasSumValue = true, Width = 5, InputType = "money"
            },

            new()
            {
                Id = "price", Title = "نرخ", Type = (int)SqlDbType.Int, Size = 100, PublicColumn = true,
                IsDtParameter = isShowprice, IsCommaSep = true, Width = 5, InputType = "money"
            },
            new()
            {
                Id = "amount", Title = "مبلغ کل", Type = (int)SqlDbType.Int, Size = 100, PublicColumn = true,
                IsDtParameter = isShowprice, IsCommaSep = true, HasSumValue = true, Width = 5, InputType = "decimal"
            },

            new()
            {
                Id = "createUser", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, PublicColumn = true,
                IsDtParameter = true, Width = 6
            },
            new()
            {
                Id = "createUserId", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int, PublicColumn = true,
                IsFilterParameter = true, InputType = "number", FilterType = "select2",
                FilterTypeApi = "/api/GN/UserApi/getdropdown/2/false/false"
            },
            new()
            {
                Id = "createDateTimePersian", Title = "تاریخ و زمان ثبت", Type = (int)SqlDbType.VarChar,
                PublicColumn = true, IsDtParameter = true, Width = 5
            },
            new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 8 }
        };

        list.Buttons = new List<GetActionColumnViewModel>
        {
            new()
            {
                Name = "editItemTransaction", Title = "ویرایش", ClassName = "btn green_outline_1 ml-1",
                IconName = "fa fa-edit"
            },
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

    public async Task<CSVViewModel<IEnumerable>> ItemTransactionLineCSV(NewGetPageViewModel model, short stageId)
    {
        var list = await GetPage(model);
        var isQuantity = await _stageRepository.GetStageQuantity(stageId);

        var result = new CSVViewModel<IEnumerable>
        {
            Columns = isQuantity
                ? "شناسه,نوع آیتم,آیتم,ورود/خروج,مقدار,بخش انبار,پالت انبار,کاربر ثبت کننده,تاریخ و زمان ثبت"
                : "شناسه,نوع آیتم,آیتم,ورود/خروج,مقدار, نرخ, مبلغ,بخش انبار,پالت انبار,کاربر ثبت کننده,تاریخ و زمان ثبت"
        };

        if (isQuantity)
            result.Rows = from p in list.Data
                select new
                {
                    p.Id,
                    p.ItemType,
                    p.Item,
                    p.InOutName,
                    p.Quantity,
                    p.Zone,
                    p.Bin,
                    p.CreateUserFullName,
                    p.CreateDateTimePersian
                };
        else
            result.Rows = from p in list.Data
                select new
                {
                    p.Id,
                    p.ItemType,
                    p.Item,
                    p.InOutName,
                    p.Quantity,
                    p.Price,
                    p.Amount,
                    p.Zone,
                    p.Bin,
                    p.CreateUserFullName,
                    p.CreateDateTimePersian
                };

        return result;
    }

    public async Task<MyResultStageStepConfigPage<List<ItemTransactionLines>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultStageStepConfigPage<List<ItemTransactionLines>>
        {
            Data = new List<ItemTransactionLines>()
        };


        int? p_id = null, p_zoneId = null, p_binId = null, p_itemId = null, p_itemTypeId = null, p_createUserId = null;


        int? p_itemCategoryId = null, p_unitId = null;
        string p_attributeIds = null;

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
            case "categoryItemName":
                p_itemCategoryId = Convert.ToInt32(model.FieldValue);
                break;
            case "unitNames":
                p_unitId = Convert.ToInt32(model.FieldValue);
                break;
            case "attributeName":
                p_attributeIds = model.FieldValue;
                break;
            case "createUserId":
                p_createUserId = Convert.ToInt32(model.FieldValue);
                break;
        }


        var headerItem =
            await _warehouseTransactionRepository.GetRecordById(Convert.ToInt64(model.Form_KeyValue[0]?.ToString()),
                model.CompanyId);


        var isQuntity = Convert.ToInt32(model.Form_KeyValue[6]?.ToString());


        result.Columns = await GetSimpleColumns(headerItem.Data.StageId, headerItem.Data.WorkflowId, isQuntity);

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id", p_id);
        parameters.Add("HeaderId", Convert.ToInt64(model.Form_KeyValue[0]?.ToString()));
        parameters.Add("ItemTypeId", p_itemTypeId);
        parameters.Add("ItemId", p_itemId);
        parameters.Add("ItemCategoryId", p_itemCategoryId);
        parameters.Add("UnitId", p_unitId);
        parameters.Add("AttributeIds", p_attributeIds);
        parameters.Add("CreateUserId", p_createUserId);
        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_ItemTransactionLine_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<ItemTransactionLines>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        if (result.Data.ListHasRow())
        {
            var columnsHasSum = result.Columns.DataColumns.Where(c => !c.CalculateSum).Select(v => v.Id).ToList();

            foreach (var item in columnsHasSum)
            {
                var col = result.Columns.DataColumns.Where(x => x.Id == item).SingleOrDefault();

                var sumItemTransaction = result.Data.Sum(s => decimal.Parse(GetPropValue(s, item).ToString()));
                col.SumValue = sumItemTransaction;
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

    public async Task<MyResultStatus> ValidationBeforeSave(WarehouseTransactionLineModel model,
        OperationType operationType)
    {
        var result = new MyResultStatus();


        var res = new MyResultPage<List<PostingGroupbyTypeLineModel>>
        {
            Data = new List<PostingGroupbyTypeLineModel>()
        };

        var getPostingGroupModel = new GetPostingGroup
        {
            StageId = model.StageId,
            ItemCategoryId = Convert.ToInt16(model.CategoryId),
            ItemTypeId = model.ItemTypeId,
            PostingGroupTypeId = PostingGroupType.BranchWahouse,
            BranchId = Convert.ToInt16(model.BranchId),
            HeaderId = 0
        };

        res.Data = await _postingGroupRepository.GetPostingGroupByTypeLine(getPostingGroupModel);
        if (res.Data.Count > 0)
            for (var d = 0; d < res.Data.Count(); d++)
            {
                //  هم چک شود stageClass  علاوه بر چک شدن نوع کد  کل دایمی باید  
                if (res.Data[d].IncomeBalanceId == (byte)IncomeBalance.Permenant && (
                        model.StageClassId == (byte)StageClassType.Form ||
                        model.StageClassId == (byte)StageClassType.PurchaceOrder ||
                        model.StageClassId == (byte)StageClassType.FormOthersUsWith ||
                        model.StageClassId == (byte)StageClassType.FormOthersUsWith)
                   )

                {
                    var headerId =
                        await _costCenterRepository.GetHeaderId(model.StageId, model.ItemId, model.ItemTypeId);
                    if (headerId == 0)
                    {
                        result.Successfull = false;
                        result.Status = -100;
                        result.Id = model.Rownumber;
                        result.StatusMessage = string.Format("{0}{1}{2}{3}{4}", "  ( برای کالا  :  ", model.ItemId,
                            "  با دسته بندی  ", model.CategoryId, " تفضیل تعریف نشده است ) ");

                        return result;
                    }

                    res.Data[d].AccountDetailId = headerId;
                    res.Data[d].NoSeriesId = (byte)NoSeries.CostCenter; //مرکزهزینه
                }


                res.Data[d].IsLast = false;
            }

        var ItemTransactionPosting = res.Data;
        model.ItemTransactionPostingGroup = ItemTransactionPosting;

        var getAction = new GetStageAction();
        getAction.CompanyId = model.CompanyId;
        getAction.StageId = model.StageId;
        getAction.WorkflowId = model.WorkflowId;

        var stageAction = await _stageActionRepository.GetStageActionWithParam(getAction);
        var IsQuantityWarehouse = false;

        if (stageAction != null)
        {
            IsQuantityWarehouse = stageAction.Any(s => s.IsQuantityWarehouse);
            model.ActionId = stageAction.FirstOrDefault(s => s.Priority == 1).ActionId;
        }

        if (!IsQuantityWarehouse && res.Data.Count > 0)
        {
            var amountPoint = Math.Truncate(model.Amount);
            if (res.Data.Any(x => x.PostingGroupTypeLineId == 29) && amountPoint == 0)
            {
                var portinggrouptypeLineAmount = res.Data.FirstOrDefault(p => p.PostingGroupTypeLineId == 29);
                res.Data.Remove(portinggrouptypeLineAmount);
            }

            var decimalAmountPoint = model.Amount - amountPoint;
            if (res.Data.Any(x => x.PostingGroupTypeLineId == 30) && decimalAmountPoint == 0)
            {
                var portinggrouptypeLineDecimalAmount = res.Data.FirstOrDefault(p => p.PostingGroupTypeLineId == 30);
                res.Data.Remove(portinggrouptypeLineDecimalAmount);
            }
        }


        var insertprevious = false;
        var validateResult = new List<string>();
        validateResult =
            await ValidationCheckTransactionPostingGroup(model, res.Data, operationType, IsQuantityWarehouse,
                insertprevious);
        if (validateResult.ListHasRow())
        {
            var resultValidate = new MyResultStatus();
            resultValidate.Successfull = false;
            resultValidate.ValidationErrors = validateResult;
            return resultValidate;
        }

        result.Successfull = true;
        result.Status = 100;
        return result;
    }

    public async Task<MyResultStatus> Save(WarehouseTransactionLineModel model)
    {
        var result = new MyResultStatus();
        model.Ratio = model.Ratio == 0 ? 1 : model.Ratio;
        byte? defaultCurrncyId = _companyRepository.GetDefaultCurrency(model.CompanyId).Result;

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_ItemTransactionLine_InsUpd]";
            conn.Open();
            var output = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                model.Id,
                model.HeaderId,
                model.CurrencyId,
                model.ZoneId,
                model.BinId,
                model.ItemTypeId,
                model.ItemId,
                model.InOut,
                model.Quantity,
                model.Price,
                model.Amount,
                model.CreateUserId,
                model.CreateDateTime,
                UnitId = model.UnitId == 0 ? null : model.UnitId,
                SubUnitId = model.IdSubUnit == 0 ? null : model.SubUnitId,
                model.Ratio,
                model.TotalQuantity,
                model.AttributeIds,
                ExchangeRate = defaultCurrncyId == model.CurrencyId ? 1 : model.ExchangeRate,
                ObjectPostingGroupJson = JsonConvert.SerializeObject(model.ItemTransactionPostingGroup)
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            result.Id = output;
            result.Successfull = result.Id > 0;
            result.Status = result.Successfull ? 100 : -100;
            result.StatusMessage = result.Status == 100 ? "عملیات با موفقیت انجام شد" : "انجام عملیات با مشکل مواجه شد";
        }

        return result;
    }

    public async Task<List<string>> ValidationCheckTransactionPostingGroup(WarehouseTransactionLineModel model,
        List<PostingGroupbyTypeLineModel> data, OperationType operationType, bool IsQuantityWarehouse,
        bool insertprevious)
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
                #region بررسی تکراری نبودن آیتم

                var existItem = await ExistByItemId(model, operationType);
                if (existItem != null && existItem.ItemId > 0)
                {
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

                #endregion

                #region بررسی موجودی منفی برای پالت

                var checkNegativeInventory = false;

                if (((model.HeaderInOut == 1 || model.HeaderInOut == 3) && model.InOut == 2) ||
                    ((model.HeaderInOut == 2 || model.HeaderInOut == 3) && model.InOut == 1 &&
                     operationType == OperationType.Update))
                    checkNegativeInventory = true;
                else
                    checkNegativeInventory = false;


                if (checkNegativeInventory)
                {
                    var bin = _binRepository.GetRecordById<BinGetRecord>(model.BinId, false, "wh");
                    if (bin.Result.NegativeInventory)
                    {
                        var NegativeInventoryModel = new WarehouseTransactionCheckNegativeInventory
                        {
                            WarehouseId = model.WarehouseId,
                            ItemId = model.ItemId,
                            ZoneId = model.ZoneId,
                            BinId = model.BinId,
                            UnitId = model.UnitId,
                            SubUnitId = model.SubUnitId > 0 ? model.SubUnitId : null,
                            InOut = model.InOut,
                            HeaderInOut = model.HeaderInOut,
                            AttributeIds = model.AttributeIds,
                            HeaderDocumentDate = model.HeaderDocumentDate,
                            Ratio = model.Ratio,
                            HeaderId = model.HeaderId,
                            Id = model.Id,
                            TotalQuantity = model.TotalQuantity
                        };

                        if (model.HeaderInOut == 2 && model.InOut == 1 && operationType == OperationType.Update)
                            NegativeInventoryModel.HeaderDocumentDate = _warehouseTransactionRepository
                                .GetMaxDocumentDateNegativeInventory(NegativeInventoryModel).Result;

                        var Quntity = _warehouseTransactionRepository
                            .WarehouseCheckNegativeInventory(NegativeInventoryModel).Result;

                        //1: موجودی کمتر از صفر است
                        //2: مجموع تعداد کل انتخابی وتعداد منفی می شود  
                        if (Quntity < 0 || Quntity + model.TotalQuantity < 0 || Quntity == 0 ||
                            Quntity - model.TotalQuantity < 0)
                        {
                            var warehouseName = _warehouseRepository.GetName(model.WarehouseId ?? 0).Result;
                            var warehouse = IdAndTitle(model.WarehouseId, warehouseName);

                            var zonName = _zoneRepository.GetName(model.ZoneId).Result;
                            var zon = IdAndTitle(model.ZoneId, zonName);

                            var binName = IdAndTitle(model.BinId, bin.Result.Name);

                            if (insertprevious) // ثبت از افزودن از درخواست
                            {
                                error.Add(string.Join(",", "3"));
                                error.Add(
                                    $"کنترل موجودی انبار:( {warehouse} / بخش: {zon} / پالت : {binName}) مجوز موجودی منفی ندارید");
                            }
                            else
                            {
                                error.Add(
                                    $"کنترل موجودی انبار:( {warehouse} / بخش: {zon} / پالت : {binName}) مجوز موجودی منفی ندارید");
                            }
                        }
                    }
                }

                #endregion

                #region بررسی وضعیت دوره مالی

                var resultCheckFiscalYear =
                    await _fiscalYearRepository.GetFicalYearStatusByDate(model.HeaderDocumentDate, model.CompanyId);

                if (!resultCheckFiscalYear.Successfull)
                    error.Add(resultCheckFiscalYear.StatusMessage);

                #endregion

                #region بررسی کدینگ

                if (data.Count == 0 && IsQuantityWarehouse)
                {
                    error.Add(
                        $" برای کالا{model.ItemId} با دسته بندی {model.CategoryId} کدینگ حسابداری تعریف نشده است ");
                }
                else
                {
                    if (data.Count > 0)
                    {
                        var postLine =
                            await _postingGroupRepository.GetAllDataDropDown((int)PostingGroupType.BranchWahouse);

                        var Amount = Math.Truncate(model.Amount);
                        var decimalAmountPoint = model.Amount - Math.Truncate(model.Amount);
                        var flgError = false;
                        var flgErrorAcountDetaile = false;

                        var strError = string.Format("{0}{1}{2}{3}{4}", " : ( برای کالا  :  ", model.ItemId,
                            "  با دسته بندی  ", model.CategoryId, " کدینگ حسابداری تعریف نشده است ) ");

                        var strErrorAcountDetaile = string.Format("{0}{1}{2}{3}{4}", " ( برای کالا  :  ", model.ItemId,
                            "  با دسته بندی  ", model.CategoryId, " تفضیل تعریف نشده است ) ");

                        for (var j = 0; j < postLine.Count; j++)
                        {
                            var PostingGroup = data.FirstOrDefault(x => x.PostingGroupTypeLineId == postLine[j].Id);
                            var PostingGroupFlg = PostingGroup != null ? true : false;

                            if (PostingGroupFlg)
                            {
                                switch (postLine[j].Id)
                                {
                                    case 29: //  مبلغ -صحیح 
                                        if (!IsQuantityWarehouse)
                                        {
                                            if (Amount == 0)
                                                error.Add($"{postLine[j].Name} : برای کالا  مبلغ را تعیین نمایید! ");

                                            if (Amount > 0 && (PostingGroup.AccountGLId == 0 ||
                                                               PostingGroup.AccountSGLId == 0))
                                                flgError = true;

                                            if (PostingGroup.AccountDetailId == 0 || PostingGroup.NoSeriesId == 0)
                                                flgErrorAcountDetaile = true;
                                        }

                                        break;

                                    case 30: //  مبلغ - اعشار 
                                        if (!IsQuantityWarehouse)
                                        {
                                            if (decimalAmountPoint > 0 && (PostingGroup.AccountGLId == 0 ||
                                                                           PostingGroup.AccountSGLId == 0))
                                                flgError = true;

                                            if (PostingGroup.AccountDetailId == 0 || PostingGroup.NoSeriesId == 0)
                                                flgErrorAcountDetaile = true;
                                        }

                                        break;
                                }
                            }
                            else
                            {
                                if (postLine[j].Id == 29 && Amount > 0) //  مبلغ -صحیح 
                                    flgError = true;

                                if (postLine[j].Id == 30 && decimalAmountPoint > 0) //  مبلغ - اعشار
                                    flgError = true;
                            }
                        }

                        if (flgError)
                            error.Add(strError);

                        if (flgErrorAcountDetaile)
                            error.Add(strErrorAcountDetaile);
                    }
                }

                #endregion
            }
        });

        return error;
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

    public async Task<MyResultStatus> Delete(GetWarehouseTransactionLine model)
    {
        var result = new MyResultStatus();
        var validateResult = await ValidateDeleteItemTransactionLine(model);

        if (validateResult.ListHasRow())
        {
            result.Successfull = false;
            result.ValidationErrors = validateResult;
            return result;
        }

        var sQuery = "";
        var output = 0;
        sQuery = "[wh].[Spc_ItemTransactionLine_Delete]";
        using (var conn = Connection)
        {
            conn.Open();
            output = await conn.QueryFirstOrDefaultAsync<int>(
                sQuery, new
                {
                    ItemTransactionLineId = model.Id,
                    model.HeaderId
                }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = output > 0;
        result.Status = result.Successfull ? 100 : -100;
        result.StatusMessage = !result.Successfull ? "عملیات حذف با مشکل مواجه شد" : "";
        return result;
    }

    public async Task<List<string>> ValidateDeleteItemTransactionLine(GetWarehouseTransactionLine model)
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

            var currentActionId = await GetActionIdByIdentityId(model.HeaderId);
            treasuryAction.StageId = model.StageId;
            treasuryAction.ActionId = currentActionId;
            treasuryAction.WorkflowId = model.WorkflowId;
            var currentTreasuryStageAct = await _stageActionRepository.GetAction(treasuryAction);

            if (!currentTreasuryStageAct.IsDeleteLine) error.Add("مجاز به حذف سطر در این گام نمی باشید");

            #endregion

            var itemTransactionLineRecord = await GetRecordByIds(model.Id, model.CompanyId);

            #region بررسی موجودی منفی برای پالت

            if (model.StageClassId == 3 || model.StageClassId == 4 || model.StageClassId == 8)
            {
                var checkNegativeInventory = false;

                if (((model.HeaderInOut == 1 || model.HeaderInOut == 3) && model.InOut == 2) ||
                    ((model.HeaderInOut == 2 || model.HeaderInOut == 3) && model.InOut == 1))
                    checkNegativeInventory = true;
                else
                    checkNegativeInventory = false;

                if (checkNegativeInventory)
                {
                    var bin = _binRepository.GetRecordById<BinGetRecord>(itemTransactionLineRecord.Data.BinId, false,
                        "wh");
                    if (bin.Result.NegativeInventory)
                    {
                        var NegativeInventoryModel = new WarehouseTransactionCheckNegativeInventory
                        {
                            WarehouseId = model.WarehouseId,
                            ItemId = itemTransactionLineRecord.Data.ItemId,
                            ZoneId = itemTransactionLineRecord.Data.ZoneId,
                            BinId = itemTransactionLineRecord.Data.BinId,
                            UnitId = model.UnitId,
                            SubUnitId = itemTransactionLineRecord.Data.IdSubUnit > 0
                                ? itemTransactionLineRecord.Data.IdSubUnit
                                : null,
                            Ratio = Convert.ToDecimal(itemTransactionLineRecord.Data.Ratio),
                            AttributeIds = itemTransactionLineRecord.Data.AttributeIds,
                            HeaderDocumentDate = model.HeaderDocumentDate
                        };

                        if (model.HeaderInOut == 2 && model.InOut == 1)
                            model.HeaderDocumentDate =
                                await _warehouseTransactionRepository.GetMaxDocumentDateNegativeInventory(
                                    NegativeInventoryModel);

                        var Quntity =
                            await _warehouseTransactionRepository.WarehouseCheckNegativeInventory(
                                NegativeInventoryModel);

                        //1: موجودی کمتر از صفر است
                        //2: مجموع تعداد کل انتخابی وتعداد منفی می شود 

                        if (Quntity < 0 || Quntity + model.TotalQuantity < 0 || Quntity == 0 ||
                            Quntity - model.TotalQuantity < 0)
                            error.Add(
                                $"کنترل موجودی انبار:( {itemTransactionLineRecord.Data.Warehouse} / بخش: {itemTransactionLineRecord.Data.ZoneIdName} / پالت : {itemTransactionLineRecord.Data.BinIdName}) مجوز موجودی منفی ندارید");
                    }
                }
            }

            #endregion

            #region بررسی وضعیت دوره مالی

            var resultCheckFiscalYear =
                await _fiscalYearRepository.GetFicalYearStatusByDate(model.HeaderDocumentDate, model.CompanyId);

            if (!resultCheckFiscalYear.Successfull)
                error.Add(resultCheckFiscalYear.StatusMessage);

            #endregion

            #region بررسی ریالی شدن انبار در تاریخ برگه

            var headerDocumentDatePersian = model.HeaderDocumentDate.ToPersianDateString("{0}/{1}/{2}");

            var fiscalYearLineId =
                await _warehouseTransactionRepository.GetFiscalYearLineIdByPersianDate(headerDocumentDatePersian);
            if (fiscalYearLineId != null)
            {
                var CheckLockModel = new CheckLockModel
                {
                    BranchId = itemTransactionLineRecord.Data.BranchId,
                    FiscalYearLineId = int.Parse(fiscalYearLineId)
                };

                var checkLockFiscalYear = _warehouseTransactionRepository.CheckLockFiscalYear(CheckLockModel);
                if (checkLockFiscalYear.Result) error.Add("انبار در این ماه ، ریالی شده است اجازه حذف را ندارید.");
            }

            #endregion
        });

        return error;
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
                TableName = "wh.ItemTransaction",
                IdColumnName = "ActionId",
                ColumnNameList = "ActionId,Id",
                Filter = $"Id={IdentityId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<MyResultStageStepConfigPage<List<ItemTransactionRequest>>> GetItemTransactionLineRequest(
        GetPageViewModel model, int companyId)
    {
        int? requestId = Convert.ToInt32(model.Form_KeyValue[0]?.ToString());
        var itemTypeId = byte.Parse(model.Form_KeyValue[1]?.ToString());
        var isDefaultCurrency = Convert.ToBoolean(Convert.ToInt32(model.Form_KeyValue[2]));
        var stageId = Convert.ToInt16(model.Form_KeyValue[3]?.ToString());
        var workflowId = Convert.ToInt32(model.Form_KeyValue[7]?.ToString());
        var parentworkFlowcategoryId = Convert.ToInt32(model.Form_KeyValue[8]?.ToString());
        var warehouseId = Convert.ToInt32(model.Form_KeyValue[9]?.ToString());
        var result = new MyResultStageStepConfigPage<List<ItemTransactionRequest>>
        {
            Data = new List<ItemTransactionRequest>()
        };


        var parameters = new DynamicParameters();
        var sQuery = string.Empty;

        int? p_zoneId = null, p_binId = null, p_itemId = null, p_itemCategoryId = null, p_unitId = null;
        string p_attributeIds = null;
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
                p_attributeIds = model.FieldValue;
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
        parameters.Add("AttributeIds", p_attributeIds);
        parameters.Add("ZoneId", p_zoneId);
        parameters.Add("BinId", p_binId);
        parameters.Add("ParentWorkflowCategoryId", parentworkFlowcategoryId);

        result.Columns = await GetRequestSimpleColumns(companyId, stageId, workflowId, itemTypeId);
        result.Columns.IsEditable = true;
        result.Columns.IsSelectable = true;


        using (var conn = Connection)
        {
            conn.Open();
            sQuery = "[wh].[Spc_ItemTransaction_RequestLineByStageId]";
            result.Data =
                (await conn.QueryAsync<ItemTransactionRequest>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        if (result.Data.ListHasRow())
        {
            var itemTypes = result.Data.Select(f => f.ItemTypeId).Distinct().ToList();
            result.Columns.IsQuantity = result.Data[0].IsQuantity;
            var itemTypeIds = new List<ID>();
            foreach (var itm in itemTypes) itemTypeIds.Add(new ID { Id = itm });

            if (itemTypes.ListHasRow())
            {
                var stageStepConfigColumns = new List<GetStageStepConfigColumnsViewModel>();

                for (var y = 0; y < itemTypes.Count; y++)
                {
                    var stageStepConfigColumn = new GetStageStepConfigColumnsViewModel();
                    var itemType = itemTypes[y];

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
                            { new() { FieldId = "itemTypeId", TableName = "wh.ItemTransactionLine" } }
                    };

                    stageSteConfig.Data.HeaderFields[0].FieldValue = stageId.ToString();
                    stageSteConfig.Data.HeaderFields[1].FieldValue = workflowId.ToString();
                    stageSteConfig.Data.LineFields.FirstOrDefault().FieldValue = itemType.ToString();

                    var newColumns = new GetStageStepConfigColumnsViewModel();
                    newColumns.DataColumns = new List<DataStageStepConfigColumnsViewModel>();
                    newColumns.StageStepConfig = stageSteConfig.Data;
                    foreach (var item in result.Columns.DataColumns)
                    {
                        var itm = _mapper.Map<DataStageStepConfigColumnsViewModel>(item);
                        newColumns.DataColumns.Add(itm);
                    }

                    var resultConfig = await _stageStepConfigRepository.GetStageStepConfigColumn(newColumns, true);


                    stageStepConfigColumn.DataColumns = new List<DataStageStepConfigColumnsViewModel>();
                    foreach (var item in resultConfig.Data)
                    {
                        var itm = _mapper.Map<DataStageStepConfigColumnsViewModel>(item);
                        stageStepConfigColumn.DataColumns.Add(itm);
                    }

                    stageStepConfigColumn.IdentityId = itemType;
                    stageStepConfigColumn.IsEditable = true;
                    stageStepConfigColumn.IsSelectable = true;
                    result.Columns.DataColumns = stageStepConfigColumn.DataColumns;
                    result.Columns.IsQuantity = result.Data[0].IsQuantity;

                    result.Columns.DataColumns.Where(x => x.Id == "totalQuantity").FirstOrDefault().Editable = false;
                }
            }
        }


        return result;
    }

    public async Task<MyResultStatus> InsertPreviousStageLinests(List<WarehouseTransactionLineGetReccord> modelList,
        int companyId, int createUserId, bool isDefaultCurrency)
    {
        var result = new MyResultStatus();
        result.ValidationErrors = new List<string>();
        var error = new List<string>();

        var resultErrors = new List<MyResultStatus>();

        var itemTransactionLineItemList = new List<WarehouseTransactionLineModel>();
        var validateResult = new List<string>();
        var validationErrors = new MyResultDataQuery<MyResultStatus>();


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


        foreach (var item in modelList)
        {
            var itemTransactionLineItem = new WarehouseTransactionLineModel();

            if (item.WorkflowCategoryId == 11)
            {
                var getRecordItem = await GetRecordByIds(item.Id, companyId);
                itemTransactionLineItem = _mapper.Map<WarehouseTransactionLineModel>(getRecordItem.Data);
                itemTransactionLineItem.UnitId =
                    itemTransactionLineItem.UnitId > 0 ? itemTransactionLineItem.UnitId : null;
                itemTransactionLineItem.SubUnitId =
                    itemTransactionLineItem.SubUnitId > 0 ? itemTransactionLineItem.SubUnitId : null;
            }
            else
            {
                itemTransactionLineItem.ZoneId = item.ZoneId;
                itemTransactionLineItem.BinId = item.BinId;
                itemTransactionLineItem.AttributeIds = item.AttributeIds;
                itemTransactionLineItem.UnitId = item.UnitId > 0 ? item.UnitId : null;
                itemTransactionLineItem.SubUnitId = item.SubUnitId > 0 ? item.SubUnitId : null;
                itemTransactionLineItem.IdSubUnit = item.IdSubUnit > 0 ? item.IdSubUnit : null;
            }


            itemTransactionLineItem.Id = 0;
            itemTransactionLineItem.Rownumber = item.Id;
            itemTransactionLineItem.CurrencyId = item.CurrencyId;
            itemTransactionLineItem.StageId = item.StageId;
            itemTransactionLineItem.CompanyId = companyId;
            itemTransactionLineItem.CreateUserId = createUserId;
            itemTransactionLineItem.CreateDateTime = DateTime.Now;
            itemTransactionLineItem.HeaderId = item.HeaderId;
            itemTransactionLineItem.CategoryId = item.CategoryId;
            itemTransactionLineItem.BranchId = item.BranchId;
            itemTransactionLineItem.Amount = item.Amount != 0 ? item.Amount : itemTransactionLineItem.Amount;
            itemTransactionLineItem.Quantity = item.Quantity != 0 ? item.Quantity : itemTransactionLineItem.Quantity;
            itemTransactionLineItem.TotalQuantity = item.TotalQuantity;
            itemTransactionLineItem.Price = item.Price != 0 ? item.Price : itemTransactionLineItem.Price;
            itemTransactionLineItem.WarehouseId = item.WarehouseId;
            itemTransactionLineItem.IsQuantity = item.IsQuantity;
            itemTransactionLineItem.WorkflowCategoryId = item.WorkflowCategoryId;

            itemTransactionLineItem.ItemTypeId =
                item.ItemTypeId > 0 ? item.ItemTypeId : itemTransactionLineItem.ItemTypeId;
            itemTransactionLineItem.ItemId = item.ItemId > 0 ? item.ItemId : itemTransactionLineItem.ItemId;
            itemTransactionLineItem.HeaderAccountDetailId = item.HeaderAccountDetailId;
            itemTransactionLineItem.HeaderNoSeriesId = item.HeaderNoseriesId;
            itemTransactionLineItem.HeaderInOut = item.HeaderInOut;
            itemTransactionLineItem.HeaderDocumentDate = item.HeaderDocumentDate;
            itemTransactionLineItem.Ratio = item.Ratio;


            var modelstage = new GetStageFundItemTypeInOut
            {
                FundItemTypeId = itemTransactionLineItem.ItemTypeId,
                StageId = item.StageId
            };

            var inout = Convert.ToByte(await _stageFundItemTypeRepository.GetInOutId(modelstage));
            if (inout == 0)
            {
                result.Successfull = false;
                result.Status = -100;
                result.StatusMessage =
                    $"نوع آیتم انتخابی درخواست با شناسه های : ({item.ItemTypeId}) داخل برگه ی مقصد وجود ندارد";
                result.ValidationErrors.Add(result.StatusMessage);
                return result;
            }

            itemTransactionLineItem.InOut = inout == 3 ? item.InOut : inout;


            #region CheckTransactionPostingGroup

            var res = new MyResultPage<List<PostingGroupbyTypeLineModel>>
            {
                Data = new List<PostingGroupbyTypeLineModel>()
            };

            var getPostingGroupModel = new GetPostingGroup
            {
                StageId = item.StageId,
                ItemCategoryId = Convert.ToInt16(item.CategoryId),
                ItemTypeId = item.ItemTypeId,
                PostingGroupTypeId = PostingGroupType.BranchWahouse,
                BranchId = Convert.ToInt16(item.BranchId),
                HeaderId = 0
            };

            res.Data = await _postingGroupRepository.GetPostingGroupByTypeLine(getPostingGroupModel);


            for (var d = 0; d < res.Data.Count(); d++)
            {
                //  هم چک شود stageClass  علاوه بر چک شدن نوع کد  کل دایمی باید  
                if (res.Data[d].IncomeBalanceId == (byte)IncomeBalance.Permenant &&
                    (item.StageClassId == (byte)StageClassType.Form ||
                     item.StageClassId == (byte)StageClassType.PurchaceOrder ||
                     item.StageClassId == (byte)StageClassType.FormOthersUsWith ||
                     item.StageClassId == (byte)StageClassType.FormOthersUsWith)
                   )
                {
                    if (itemTransactionLineItem.HeaderAccountDetailId == 0)
                    {
                        res.Data[d].AccountDetailId = 0;
                        res.Data[d].NoSeriesId = 0;
                    }
                    else
                    {
                        res.Data[d].AccountDetailId = itemTransactionLineItem.HeaderAccountDetailId;
                        res.Data[d].NoSeriesId = itemTransactionLineItem.HeaderNoSeriesId;
                    }
                }
                else
                {
                    var costCenterId =
                        await _costCenterRepository.GetHeaderId(item.StageId, item.ItemId, item.ItemTypeId);
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

                res.Data[d].CategoryId = item.CategoryId;
                res.Data[d].IsLast = false;
            }


            if (item.WorkflowCategoryId == 1) // درخواست خرید بود
            {
                var postingGroupLastAcountmodel = new GetPostingGroupLastAcount
                {
                    ObjectId = item.RequestId,
                    WorkflowCategoryId = item.WorkflowCategoryId
                };

                var postingGroupLastAcountList =
                    await _postingGroupRepository.GetPostingGroupLastAcountLine(postingGroupLastAcountmodel);

                postingGroupLastAcountList =
                    postingGroupLastAcountList.Where(x => x.ItemCategoryId == item.CategoryId).ToList();

                if (postingGroupLastAcountList.ListHasRow())
                    for (var i = 0; i < postingGroupLastAcountList.Count; i++)
                    {
                        var postingList = new PostingGroupbyTypeLineModel();
                        postingList.AccountGLId = postingGroupLastAcountList[i].AccountGLId;
                        postingList.AccountSGLId = postingGroupLastAcountList[i].AccountSGLId;
                        postingList.AccountDetailId = postingGroupLastAcountList[i].AccountDetailId;
                        postingList.NoSeriesId = postingGroupLastAcountList[i].NoSeriesId;
                        postingList.PostingGroupTypeId = postingGroupLastAcountList[i].PostingGroupTypeId;
                        postingList.PostingGroupTypeLineId = postingGroupLastAcountList[i].PostingGroupTypeLineId;
                        postingList.CategoryId = item.CategoryId;
                        postingList.IsLast = true;
                        res.Data.Add(postingList);
                    }
            }

            itemTransactionLineItem.ItemTransactionPostingGroup = res.Data;


            var getAction = new GetStageAction();
            getAction.CompanyId = companyId;
            getAction.StageId = item.StageId;
            getAction.WorkflowId = item.WorkflowId;

            var stageAction = await _stageActionRepository.GetStageActionWithParam(getAction);
            var IsQuantityWarehouse = false;

            if (stageAction != null)
                IsQuantityWarehouse = stageAction.Any(s => s.IsQuantityWarehouse);

            if (!IsQuantityWarehouse)
            {
                var amountPoint = Math.Truncate(item.Amount);
                if (res.Data.Any(x => x.PostingGroupTypeLineId == 29) && amountPoint == 0)
                {
                    var portinggrouptypeLineAmount = res.Data.FirstOrDefault(p => p.PostingGroupTypeLineId == 29);
                    res.Data.Remove(portinggrouptypeLineAmount);
                }

                var decimalAmountPoint = item.Amount - amountPoint;
                if (res.Data.Any(x => x.PostingGroupTypeLineId == 30) && decimalAmountPoint == 0)
                {
                    var portinggrouptypeLineDecimalAmount =
                        res.Data.FirstOrDefault(p => p.PostingGroupTypeLineId == 30);
                    res.Data.Remove(portinggrouptypeLineDecimalAmount);
                }
            }

            var insertprevious = true;

            validateResult = await ValidationCheckTransactionPostingGroup(itemTransactionLineItem, res.Data,
                OperationType.Insert, IsQuantityWarehouse, insertprevious);

            if (validateResult.ListHasRow())
            {
                result.Successfull = false;
                result.Status = -100;

                for (var i = 0; i < validateResult.Count; i++) result.ValidationErrors.Add(validateResult[i]);
            }
            else
            {
                itemTransactionLineItemList.Add(itemTransactionLineItem);
            }

            #endregion
        }

        if (result.ValidationErrors.Count > 0)
            return result;

        for (var i = 0; i < itemTransactionLineItemList.Count; i++)
        {
            result = await Save(itemTransactionLineItemList[i]);

            if (!result.Successfull) return result;
        }


        if (result.ValidationErrors.Count == 0)
            result.StatusMessage = "عملیات با موفقیت انجام شد";


        return result;
    }

    public List<MyDropDownViewModel> InOut_GetDropDown()
    {
        return new List<MyDropDownViewModel>
        {
            new() { Id = 1, Name = "ورود" },
            new() { Id = 2, Name = "خروج" },
            new() { Id = 3, Name = "هر دو" }
        };
    }

    public async Task<MyResultPage<ItemTransactionLineDisplay>> Display(GetPageViewModel model, int userId, byte roleId)
    {
        var result = new MyResultPage<ItemTransactionLineDisplay>
        {
            Data = new ItemTransactionLineDisplay()
        };

        var directPaging = Convert.ToInt32(model.Form_KeyValue[2]);
        var paginationParameters = new DynamicParameters();
        long itemTransactionIdFromPagination = 0;

        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "ItemRequestApi",
            OprType = "VIWALL",
            UserId = userId
        };


        // check access VIWALL
        var checkAccessViewAll = await _loginRepository.GetAuthenticate(checkAuthenticate);

        if (directPaging > 0)
        {
            paginationParameters.Add("TableName", "[wh].[ItemTransaction]");
            paginationParameters.Add("IdColumnName", "[wh].[ItemTransaction].Id");
            paginationParameters.Add("IdColumnValue", Convert.ToInt32(model.Form_KeyValue[0]?.ToString()));

            var filter = string.Empty;
            if (checkAccessViewAll.Successfull)
                filter =
                    "AND [wh].[ItemTransaction].StageId IN(SELECT Id FROM wf.Stage WHERE StageClassId IN(3,4,8,11,14,15,16) AND WorkflowCategoryId=11)";
            else
                filter =
                    $"AND [wh].[ItemTransaction].StageId IN(SELECT Id FROM wf.Stage WHERE StageClassId IN(3,4,8,11,14,15,16) AND WorkflowCategoryId=11) AND [wh].[ItemTransaction].CreateUserId={userId} ";

            if (model.Form_KeyValue[3]?.ToString() == "1")
                filter += " AND [wh].[ItemTransaction].BySystem=0";

            paginationParameters.Add("FilterParam", filter);
            paginationParameters.Add("Direction", directPaging);
            paginationParameters.Add("RoleId", roleId);

            using (var conn = Connection)
            {
                var sQuery = "[pb].[Spc_Tables_NextPrev]";
                conn.Open();
                itemTransactionIdFromPagination = await conn.ExecuteScalarAsync<long>(sQuery, paginationParameters,
                    commandType: CommandType.StoredProcedure);
                conn.Close();
            }
        }

        var itemTransactionId = itemTransactionIdFromPagination == 0
            ? long.Parse(model.Form_KeyValue[0]?.ToString())
            : itemTransactionIdFromPagination;
        var parameters = new DynamicParameters();

        parameters.Add("ItemTransactionId", itemTransactionId);
        parameters.Add("AmountOrQuantity", 0);

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_ItemTransaction_Display]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<ItemTransactionLineDisplay>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).FirstOrDefault();
            conn.Close();
        }

        if (result.Data != null)
        {
            result.Data.IsPreviousStage =
                await _stageFundItemTypeRepository.GetHasStagePrevious(result.Data.StageId, result.Data.WorkflowId);

            if (result.Data.AccountDetailId > 0 && !string.IsNullOrEmpty(result.Data.AccountDetailName))
                result.Data.AccountDetailName = result.Data.AccountDetailName;

            var getItemTransactionAction = new GetAction();
            getItemTransactionAction.CompanyId = model.CompanyId;
            getItemTransactionAction.StageId = result.Data.StageId;
            getItemTransactionAction.ActionId = Convert.ToByte(result.Data.ActionId);
            getItemTransactionAction.WorkflowId = result.Data.WorkflowId;
            var stageAction = await _stageActionRepository.GetAction(getItemTransactionAction);

            if (stageAction != null)
            {
                result.Data.IsDataEntry = Convert.ToInt32(stageAction.IsDataEntry);
                result.Data.IsRequest = stageAction.IsRequest;
                result.Data.IsEqualToParentRequest = result.Data.ParentWorkflowCategoryId == 11 ? true : false;
            }

            result.Data.JsonTransactionLineList = new MyResultStageStepConfigPage<List<ItemTransactionLines>>();

            result.Data.JsonTransactionLineList.Columns = new GetStageStepConfigColumnsViewModel();
            result.Data.JsonTransactionLineList.Columns.HeaderType = "outline";
            result.Data.JsonTransactionLineList.Columns.Title = "لیست گردش";


            result.Data.JsonTransactionLineList.HeaderColumns =
                await GetLineSimpleElement(model.CompanyId, result.Data.StageId, result.Data.WorkflowId);

            result.Columns = GetHeaderColumns();
        }
        else
        {
            result.Columns = GetHeaderColumns();
        }

        return result;
    }

    public async Task<MyResultPage<ItemTransactionLineGetRecord>> GetRecordByIds(int id, int companyId)
    {
        var result = new MyResultPage<ItemTransactionLineGetRecord>
        {
            Data = new ItemTransactionLineGetRecord()
        };

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_ItemTransactionLine_GetRecord]";
            result.Data = await conn.QueryFirstOrDefaultAsync<ItemTransactionLineGetRecord>(sQuery, new
            {
                Id = id,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<MyResultPage<ItemTransactionLineGetRecord>> GetItemTransactionLineLineFooter(int id,
        int companyId)
    {
        var result = new MyResultPage<ItemTransactionLineGetRecord>
        {
            Data = new ItemTransactionLineGetRecord()
        };

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_ItemTransactionLine_GetRecord]";
            result.Data = await conn.QueryFirstOrDefaultAsync<ItemTransactionLineGetRecord>(sQuery, new
            {
                id,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<int> ExistItemTransactionLine(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "wh.ItemTransactionLine",
                    ColumnName = "Count(*) as count",
                    Filter = $"HeaderId='{id}'"
                }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }
}