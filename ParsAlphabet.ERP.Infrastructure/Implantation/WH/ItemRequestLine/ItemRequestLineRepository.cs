using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.WF.StageStepConfig;
using ParsAlphabet.ERP.Application.Dtos.WH.Item;
using ParsAlphabet.ERP.Application.Dtos.WH.ItemRequestLine;
using ParsAlphabet.ERP.Application.Dtos.WH.WarehouseTransactionLine;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYear;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageFundItemType;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.Item;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.WarehouseTransaction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.WarehouseTransactionLine;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemRequestLine;

public class ItemRequestLineRepository :
    BaseRepository<ItemModel, int, string>,
    IBaseRepository<ItemModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;
    private readonly ICompanyRepository _companyRepository;
    private readonly FiscalYearRepository _fiscalYearRepository;
    private readonly ItemRepository _ItemRepository;
    private readonly ILoginRepository _loginRepository;
    private readonly StageActionRepository _stageActionRepository;
    private readonly StageFundItemTypeRepository _stageFundItemTypeRepository;
    private readonly WarehouseTransactionLineRepository _warehouseTransactionLineRepository;
    private readonly WarehouseTransactionRepository _warehouseTransactionRepository;

    public ItemRequestLineRepository(
        IConfiguration config,
        IHttpContextAccessor accessor,
        StageActionRepository stageActionRepository,
        ItemRepository ItemRepository,
        WarehouseTransactionLineRepository warehouseTransactionLineRepository,
        WarehouseTransactionRepository warehouseTransactionRepository,
        FiscalYearRepository fiscalYearRepository,
        ICompanyRepository companyRepository,
        StageFundItemTypeRepository stageFundItemTypeRepository,
        ILoginRepository loginRepository
    ) : base(config)
    {
        _accessor = accessor;
        _stageActionRepository = stageActionRepository;
        _ItemRepository = ItemRepository;
        _warehouseTransactionLineRepository = warehouseTransactionLineRepository;
        _warehouseTransactionRepository = warehouseTransactionRepository;
        _fiscalYearRepository = fiscalYearRepository;
        _companyRepository = companyRepository;
        _stageFundItemTypeRepository = stageFundItemTypeRepository;
        _loginRepository = loginRepository;
    }


    public GetColumnsViewModel GetHeaderColumns(short branchId)
    {
        var list = new GetColumnsViewModel
        {
            Title = "مشخصات درخواست انبار",
            Classes = "group-box-green",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", IsPrimary = true, Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 8
                },

                new() { Id = "createUserId", IsPrimary = true, Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int },


                new()
                {
                    Id = "transactionDatePersian", IsPrimary = true, Title = "تاریخ برگه", IsDtParameter = true,
                    Type = (int)SqlDbType.VarChar, Size = 10, Editable = true, InputOrder = 4, Width = 8,
                    InputType = "datepicker", InputMask = new InputMask { Mask = "'mask':'9999/99/99'" },
                    Validations = new List<FormPlate1.Validation>
                        { new() { ValidationName = "data-parsley-shamsidate" } },
                    IsFocus = true
                },

                new()
                {
                    Id = "no", Title = "شماره برگه", Type = (int)SqlDbType.Int, IsPrimary = true, IsDtParameter = true,
                    Width = 8
                },
                new() { Id = "branchId", Title = "شناسه شعبه", IsPrimary = true },

                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.TinyInt, IsPrimary = true,
                    IsDtParameter = true, Width = 15
                },


                new() { Id = "workflowId", Title = "جریان کار", IsPrimary = true },

                new() { Id = "workflow", Title = "جریان کار", IsPrimary = true, IsDtParameter = true, Width = 25 },
                new() { Id = "stageId", IsPrimary = true },

                new() { Id = "stageName", IsPrimary = true },

                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.TinyInt, IsDtParameter = true, Width = 25
                },

                new() { Id = "stageClassId", IsPrimary = true },
                new()
                {
                    Id = "inOutName", Title = "ماهیت حساب", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 12
                },

                new() { Id = "actionId", Title = "گام مرحله", IsPrimary = true },

                new()
                {
                    Id = "actionIdName", Title = "گام مرحله", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 12
                },

                new()
                {
                    Id = "note", Title = "توضیحات", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    Width = 17, Editable = true, IsNotFocusSelect = true, InputOrder = 5, IsFocus = true,
                    IsPrimary = true
                },

                new()
                {
                    Id = "createDateTime", Title = "تاریخ ثبت", InputType = "datepicker", Type = (int)SqlDbType.Date,
                    Size = 10, IsPrimary = true, InputMask = new InputMask { Mask = "'mask':'9999/99/99'" }
                },

                new() { Id = "isDataEntry", IsPrimary = true },

                new() { Id = "isQuantityWarehouse", IsPrimary = true },
                new() { Id = "transactionDate", IsPrimary = true },
                new() { Id = "inOut", IsPrimary = true }
            },

            Navigations = new List<NavigateToPage>
            {
                new()
                {
                    ColumnId = "requestId",
                    PageType = PageType.Mdal,
                    Url = "/WH/ItemRequestLine/display",
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

    public async Task<MyResultPage<ItemRequestLineDisplay>> Display(GetPageViewModel model, int userId, byte roleId)
    {
        var result = new MyResultPage<ItemRequestLineDisplay>
        {
            Data = new ItemRequestLineDisplay()
        };

        var directPaging = Convert.ToInt32(model.Form_KeyValue[2].ToString());
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
            paginationParameters.Add("RoleId", roleId);
            var filter = string.Empty;

            if (checkAccessViewAll.Successfull)
                filter =
                    "AND [wh].[ItemTransaction].StageId IN(SELECT Id FROM wf.Stage WHERE StageClassId=1 AND WorkflowCategoryId=11)";
            else
                filter =
                    $"AND [wh].[ItemTransaction].StageId IN(SELECT Id FROM wf.Stage WHERE StageClassId=1 AND WorkflowCategoryId=11) AND [wh].[ItemTransaction].CreateUserId={userId} ";

            if (model.Form_KeyValue[3]?.ToString() == "1")
                filter += " AND [wh].[ItemTransaction].BySystem=0";

            paginationParameters.Add("FilterParam", filter);


            paginationParameters.Add("Direction", directPaging);

            using (var conn = Connection)
            {
                var sQuery = "[pb].[Spc_Tables_NextPrev]";
                conn.Open();
                itemTransactionIdFromPagination = await conn.ExecuteScalarAsync<long>(sQuery, paginationParameters,
                    commandType: CommandType.StoredProcedure);
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
                (await conn.QueryAsync<ItemRequestLineDisplay>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).FirstOrDefault();
        }

        if (result.Data != null)
        {
            result.Data.IsPreviousStage =
                await _stageFundItemTypeRepository.GetHasStagePrevious(result.Data.StageId, result.Data.WorkflowId);

            var getItemTransactionAction = new GetAction();
            getItemTransactionAction.CompanyId = model.CompanyId;
            getItemTransactionAction.StageId = result.Data.StageId;
            getItemTransactionAction.ActionId = Convert.ToByte(result.Data.ActionId);
            getItemTransactionAction.WorkflowId = result.Data.WorkflowId;

            var stageAction = await _stageActionRepository.GetAction(getItemTransactionAction);

            if (stageAction != null)
            {
                result.Data.IsDataEntry = stageAction.IsDataEntry;
                result.Data.IsQuantityWarehouse = stageAction.IsQuantityWarehouse;
            }

            result.Data.JsonTransactionLineList = new MyResultStageStepConfigPage<List<ItemRequestLines>>();

            result.Data.JsonTransactionLineList.Columns = new GetStageStepConfigColumnsViewModel();
            result.Data.JsonTransactionLineList.Columns.HeaderType = "outline";
            result.Data.JsonTransactionLineList.Columns.Title = "لیست گردش";
            result.Data.JsonTransactionLineList.HeaderColumns = GetLineSimpleElement(model.CompanyId);

            result.Columns = GetHeaderColumns(result.Data.BranchId);
        }
        else
        {
            result.Columns = GetHeaderColumns(0);
        }

        return result;
    }

    public GetStageStepConfigColumnsViewModel GetLineSimpleElement(int companyId)
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
                    { new() { FieldId = "itemTypeId", TableName = "WH.ItemTransactionLine" } }
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
                    Inputs = _ItemRepository.GetDropDown("", 1).Result, IsSelect2 = true,
                    Validations = new List<FormPlate1.Validation> { new() { ValidationName = "required" } }
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
                    Id = "zoneId", Title = "بخش انبار", IsDtParameter = true, Width = 2, IsFocus = true,
                    InputType = "select",
                    Validations = new List<FormPlate1.Validation> { new() { ValidationName = "required" } },
                    IsSelect2 = true
                },
                new()
                {
                    Id = "binId", Title = "پالت انبار", IsDtParameter = true, Width = 2, IsFocus = true,
                    InputType = "select",
                    Validations = new List<FormPlate1.Validation> { new() { ValidationName = "required" } },
                    IsSelect2 = true
                },

                new()
                {
                    Id = "quantity", Title = "مقدار", IsPrimary = true, Type = (int)SqlDbType.Decimal, Size = 120,
                    IsDtParameter = true, Width = 2, IsCommaSep = true, InputType = "decimal",
                    Validations = new List<FormPlate1.Validation>
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
                    Id = "price", Title = "نرخ", IsCommaSep = true, Width = 2, InputType = "money", HasSumValue = false,
                    Type = (int)SqlDbType.Int, IsPersian = true, IsDtParameter = true,
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
                    Id = "amount", Title = "مبلغ", IsCommaSep = true, Width = 2, InputType = "money",
                    HasSumValue = true, Type = (int)SqlDbType.Int, IsDtParameter = true, HeaderReadOnly = true
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

    public async Task<GetStageStepConfigColumnsViewModel> GetSimpleColumns(short stageId, int workflowId)
    {
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
            new() { Id = "headerId", IsPrimary = true },
            new() { Id = "currencyId", Title = "ارز شناسه", Type = (int)SqlDbType.TinyInt },
            new()
            {
                Id = "itemType", Title = "نوع آیتم", IsDtParameter = true, IsFilterParameter = true, Width = 5,
                Order = true, FilterType = "select2", FilterTypeApi = ""
            },
            new()
            {
                Id = "item", Title = "آیتم", IsDtParameter = true, IsFilterParameter = true, Width = 10, Order = true,
                FilterType = "select2", FilterTypeApi = ""
            },
            new() { Id = "inOut", Title = "ورود/خروج" },
            new() { Id = "inOutName", Title = "ورود/خروج", IsDtParameter = true, Width = 5 },
            new()
            {
                Id = "categoryItemName", Title = "دسته بندی کالا", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                Width = 5, IsFilterParameter = true, FilterType = "select2", FilterTypeApi = ""
            },
            new()
            {
                Id = "attributeName", Title = "صفات کالا", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                Width = 7, PublicColumn = true, IsFilterParameter = true, FilterType = "select2", FilterTypeApi = ""
            },
            new()
            {
                Id = "unitNames", Title = "واحد شمارش", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 6,
                PublicColumn = true, IsFilterParameter = true, FilterType = "select2", FilterTypeApi = ""
            },
            new()
            {
                Id = "ratio", Title = "ضریب", Type = (int)SqlDbType.Decimal, IsDtParameter = true, Width = 4,
                PublicColumn = true, IsPrimary = true
            },
            new()
            {
                Id = "quantity", Title = "مقدار", Type = (int)SqlDbType.Decimal, Size = 100, PublicColumn = true,
                IsDtParameter = true, HasSumValue = true, Width = 6, InputType = "decimal",
                Validations = new List<FormPlate1.Validation>
                {
                    new() { ValidationName = "required" },
                    new() { ValidationName = "data-parsley-min", Value1 = "1" },
                    new() { ValidationName = "data-parsley-max", Value1 = "999999.999" }
                },
                InputMask = new InputMask { Mask = "'mask':'9{1,5}.9{1,3}'" }
            },
            new()
            {
                Id = "totalQuantity", Title = "مقدار کل", Type = (int)SqlDbType.Decimal, Size = 100,
                PublicColumn = true, IsDtParameter = true, HasSumValue = true, Width = 6, InputType = "decimal"
            },
            new()
            {
                Id = "price", Title = "نرخ", IsDtParameter = true, Width = 6, InputType = "money", IsCommaSep = true,
                MaxLength = 10
            },
            new()
            {
                Id = "displayAmount", Title = "مبلغ", Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true,
                IsCommaSep = true, Width = 6, InputType = "money", HasSumValue = true, Order = true
            },
            new()
            {
                Id = "createUser", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, PublicColumn = true,
                IsDtParameter = true, Width = 6
            },
            new()
            {
                Id = "createUserId", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int, PublicColumn = true,
                IsFilterParameter = true, FilterType = "select2",
                FilterTypeApi = "/api/GN/UserApi/getdropdown/2/false/false"
            },
            new()
            {
                Id = "createDateTimePersian", Title = "تاریخ و زمان ثبت", Type = (int)SqlDbType.VarChar,
                PublicColumn = true, IsDtParameter = true, Width = 5
            },
            new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 6 }
        };

        list.Buttons = new List<GetActionColumnViewModel>
        {
            new()
            {
                Name = "editItemRequset", Title = "ویرایش", ClassName = "btn green_outline_1 ml-1",
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


    public async Task<CSVViewModel<IEnumerable>> ItemRequestLineCSV(NewGetPageViewModel model, short stageId)
    {
        var list = await GetPage(model);
        var isQuantity = int.Parse(model.Form_KeyValue[6]?.ToString()) > 0 ? true : false;

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
                    p.CreateUserFullName,
                    p.CreateDateTimePersian
                };

        return result;
    }

    public async Task<MyResultPage<ItemRequestLineDisplay>> GetHeader(GetPageViewModel model)
    {
        var result = new MyResultPage<ItemRequestLineDisplay>
        {
            Data = new ItemRequestLineDisplay()
        };

        var parameters = new DynamicParameters();
        parameters.Add("ItemTransactionId", model.Form_KeyValue[0]?.ToString());
        parameters.Add("AmountOrQuantity", 0);
        result.Columns = GetHeaderColumns((short)model.CompanyId);

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_ItemTransaction_Display]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<ItemRequestLineDisplay>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).FirstOrDefault();
        }

        if (result.Data != null)
        {
            result.Data.IsPreviousStage =
                await _stageFundItemTypeRepository.GetHasStagePrevious(result.Data.StageId, result.Data.WorkflowId);

            var getPersonOrderAction = new GetAction();
            getPersonOrderAction.CompanyId = model.CompanyId;
            getPersonOrderAction.StageId = result.Data.StageId;
            getPersonOrderAction.ActionId = result.Data.ActionId;
            getPersonOrderAction.WorkflowId = result.Data.WorkflowId;

            var stageAction = await _stageActionRepository.GetAction(getPersonOrderAction);
            if (stageAction != null)
            {
                result.Data.IsDataEntry = stageAction.IsDataEntry;
                result.Data.IsQuantityWarehouse = stageAction.IsQuantityWarehouse;
            }
        }

        return result;
    }

    public async Task<MyResultStageStepConfigPage<List<ItemRequestLines>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultStageStepConfigPage<List<ItemRequestLines>>
        {
            Data = new List<ItemRequestLines>()
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

        MyClaim.Init(_accessor);
        var headerItem =
            await _warehouseTransactionRepository.GetRecordById(Convert.ToInt64(model.Form_KeyValue[0]?.ToString()),
                model.CompanyId);

        result.Columns = await GetSimpleColumns(headerItem.Data.StageId, headerItem.Data.WorkflowId);

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id", p_id);
        parameters.Add("HeaderId", Convert.ToInt64(model.Form_KeyValue[0]?.ToString()));
        parameters.Add("ZoneId", p_zoneId);
        parameters.Add("BinId", p_binId);
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
                (await conn.QueryAsync<ItemRequestLines>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
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

    public async Task<MyResultPage<ItemRequestLineGetRecord>> GetRecordByIds(GetItemRequestLineRecordByIds model,
        int companyId)
    {
        var result = new MyResultPage<ItemRequestLineGetRecord>
        {
            Data = new ItemRequestLineGetRecord()
        };

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_ItemTransactionLine_GetRecord]";
            result.Data = await conn.QueryFirstOrDefaultAsync<ItemRequestLineGetRecord>(sQuery, new
            {
                model.Id,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<ItemRequestLineResult> Save(WarehouseTransactionLineModel model)
    {
        model.Ratio = model.Ratio == 0 ? 1 : model.Ratio;
        var result = new ItemRequestLineResult();

        var validateResult = new List<string>();

        validateResult = await _warehouseTransactionLineRepository.ValidateSaveItemRequestLine(model);

        if (validateResult.ListHasRow())
        {
            var resultValidate = new ItemRequestLineResult();
            resultValidate.Successfull = false;
            resultValidate.ValidationErrors = validateResult;
            return resultValidate;
        }

        var getAction = new GetAction();
        getAction.CompanyId = model.CompanyId;
        getAction.StageId = model.StageId;
        getAction.Priority = 1;
        getAction.WorkflowId = model.WorkflowId;
        var stageAction = await _stageActionRepository.GetAction(getAction);
        model.ActionId = stageAction.ActionId;
        string ObjectPostingGroupJson = null;

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
                ObjectPostingGroupJson
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            result.Id = output;
            result.Successfull = result.Id > 0;
            result.Status = result.Successfull ? 100 : -100;
            result.StatusMessage = result.Status == 100 ? "عملیات با موفقیت انجام شد" : "انجام عملیات با مشکل مواجه شد";
        }

        return result;
    }

    public virtual async Task<MyResultStatus> DeleteItemRequestLine(DeleteRequestLineViewModel model, int companyId)
    {
        var result = new MyResultStatus();

        var validateResult = await ValidateDeleteItemTransactionLine(model, companyId);

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

    public async Task<List<string>> ValidateDeleteItemTransactionLine(DeleteRequestLineViewModel model,
        int companyId)
    {
        var error = new List<string>();

        if (model == null)
        {
            error.Add("درخواست معتبر نمی باشد");
            return error;
        }

        await Task.Run(async () =>
        {
            #region بررسی وضعیت دوره مالی

            var resultCheckFiscalYear =
                await _fiscalYearRepository.GetFicalYearStatusByDate(model.HeaderDocumentDate, companyId);
            if (!resultCheckFiscalYear.Successfull)
                error.Add(resultCheckFiscalYear.StatusMessage);

            #endregion


            #region برگه جاری مجوز حذف دارد؟

            var itemTransactionAction = new GetAction();

            var currentActionId = await GetActionIdByIdentityId(model.HeaderId);
            itemTransactionAction.StageId = model.StageId;
            itemTransactionAction.ActionId = currentActionId;
            itemTransactionAction.WorkflowId = model.WorkflowId;
            var currentTreasuryStageAct = await _stageActionRepository.GetAction(itemTransactionAction);

            if (!currentTreasuryStageAct.IsDeleteLine) error.Add("مجاز به حذف سطر در این گام نمی باشید");

            #endregion

            #region بررسی ریالی شدن انبار در تاریخ برگه

            var headerDocumentDatePersian = model.HeaderDocumentDate.ToPersianDateString("{0}/{1}/{2}");

            var fiscalYearLineId =
                await _warehouseTransactionRepository.GetFiscalYearLineIdByPersianDate(headerDocumentDatePersian);
            if (fiscalYearLineId != null)
            {
                var checkLockModel = new CheckLockViewModel
                {
                    BranchId = model.BranchId,
                    FiscalYearLineId = int.Parse(fiscalYearLineId)
                };

                var checkLockFiscalYear = await checkLockFiscalYearId(checkLockModel);
                if (checkLockFiscalYear) error.Add("انبار در این ماه ، ریالی شده است اجازه حذف را ندارید.");
            }

            #endregion
        });

        return error;
    }

    public async Task<bool> checkLockFiscalYearId(CheckLockViewModel model)
    {
        var sQuery = "[wh].[Spc_CheckUnitCostCalculation_CheckLock]";
        using (var conn = Connection)
        {
            conn.Open();
            var result = await Connection.QueryFirstOrDefaultAsync<bool>(sQuery,
                new
                {
                    model.FiscalYearLineId,
                    model.BranchId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
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
                TableName = "wh.ItemTransaction",
                IdColumnName = "ActionId",
                ColumnNameList = "ActionId,Id",
                Filter = $"Id={IdentityId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
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


    public async Task<bool> CheckExist(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "wh.ItemTransaction",
                ColumnName = "Id",
                Filter = $"Id={id} AND CompanyId={companyId} "
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result > 0;
        }
    }
}