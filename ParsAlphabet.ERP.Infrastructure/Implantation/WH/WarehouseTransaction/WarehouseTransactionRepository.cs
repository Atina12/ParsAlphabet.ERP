using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.WH.ItemTransactionLine;
using ParsAlphabet.ERP.Application.Dtos.WH.WarehouseTransaction;
using ParsAlphabet.ERP.Application.Dtos.WH.WarehouseTransactionLine;
using ParsAlphabet.ERP.Application.Dtos.WH.WBin;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYear;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.RoleWorkflowPermission;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.Stage;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageActionLog;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.WBin;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WH.WarehouseTransaction;

public class WarehouseTransactionRepository :
    BaseRepository<WarehouseTransactionModel, int, string>,
    IBaseRepository<WarehouseTransactionModel, int, string>
{
    private readonly BinRepository _binRepository;
    private readonly FiscalYearRepository _fiscalYearRepository;
    private readonly RoleWorklfowPermissionRepository _roleWorklfowPermissionRepository;
    private readonly StageActionLogRepository _stageActionLogRepository;
    private readonly StageActionRepository _stageActionRepository;

    private readonly StageRepository _stageRepository;

    public WarehouseTransactionRepository(IConfiguration config,
        StageActionLogRepository stageActionLogRepository,
        StageActionRepository stageActionRepository,
        FiscalYearRepository fiscalYearRepository,
        StageRepository stageRepository,
        BinRepository binRepository,
        RoleWorklfowPermissionRepository roleWorklfowPermissionRepository
    ) : base(config)
    {
        _stageActionLogRepository = stageActionLogRepository;
        _stageActionRepository = stageActionRepository;
        _fiscalYearRepository = fiscalYearRepository;
        _stageRepository = stageRepository;
        _binRepository = binRepository;
        _roleWorklfowPermissionRepository = roleWorklfowPermissionRepository;
    }


    public async Task<MyResultStatus> UpdateStep(UpdateAction model, OperationType operationType)
    {
        var validateResult = new List<string>();
        var updateStepMOdel = new UpdateAction
        {
            RequestActionId = model.RequestActionId,
            CompanyId = model.CompanyId,
            IdentityId = model.IdentityId,
            StageId = model.StageId,
            UserId = model.UserId,
            WorkflowCategoryId = 11,
            WorkflowId = model.WorkflowId,
            DocumentDate = model.DocumentDate,
            ParentWorkflowCategoryId = model.ParentWorkflowCategoryId
        };

        if (operationType == OperationType.Update)
            validateResult = await ValidateUpdateStep(updateStepMOdel, OperationType.Update);
        if (validateResult.ListHasRow())
        {
            var resultValidate = new MyResultStatus();
            resultValidate.Successfull = false;
            resultValidate.ValidationErrors = validateResult;
            return resultValidate;
        }

        var result = new MyResultStatus();
        result = await _stageActionLogRepository.StageActionLogInsert(updateStepMOdel);

        result.ValidationErrors.Add(result.StatusMessage);

        if (result.Successfull)
        {
            using (var conn = Connection)
            {
                var sQuery = "pb.Spc_Tables_UpdItem_Number";
                conn.Open();
                var updateitemTransaction = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
                {
                    TableName = "wh.ItemTransaction",
                    ColumnName = "ActionId",
                    Value = model.RequestActionId,
                    Filter = $"Id={model.IdentityId}"
                }, commandType: CommandType.StoredProcedure);
                conn.Close();
            }

            result.StatusMessage = "تغییرات با موفقیت انجام شد";
        }

        return result;
    }

    public async Task<List<string>> ValidateUpdateStep(UpdateAction model, OperationType operationType)
    {
        var error = new List<string>();

        if (model == null)
        {
            error.Add("درخواست معتبر نمی باشد");
            return error;
        }

        await Task.Run(async () =>
        {
            if (operationType == OperationType.Insert || operationType == OperationType.Update)
            {
                var itemTransactionLines = await GetItemTransactionLineByHeaderId(model.IdentityId);

                var action = new GetAction();
                action.StageId = model.StageId;
                action.ActionId = model.RequestActionId;
                action.WorkflowId = model.WorkflowId;
                var requestStageAction = await _stageActionRepository.GetAction(action);


                var currentActionId = await GetActionIdByIdentityId(model.IdentityId, 11);
                action.StageId = model.StageId;
                action.ActionId = currentActionId;
                action.WorkflowId = model.WorkflowId;
                var currentStageAction = await _stageActionRepository.GetAction(action);
                var expectedPriority = 0;

                if (currentStageAction.Priority < requestStageAction.Priority)
                    expectedPriority = currentStageAction.Priority + 1;
                else if (currentStageAction.Priority > requestStageAction.Priority)
                    expectedPriority = currentStageAction.Priority - 1;

                if (expectedPriority != 0 && expectedPriority != requestStageAction.Priority)
                    error.Add("گام درخواست شده معتبر نمی باشد");


                #region برگه جاری دارای لاین هست یا نیست

                if (itemTransactionLines.Count() == 0 && requestStageAction.IsLastConfirmHeader)
                    error.Add("برگه دارای سطر نمی باشد مجاز به تغییر گام نمی باشید");

                #endregion

                var itemTransactionStage = await _stageRepository.GetStageById(model.StageId);

                if (itemTransactionStage.InOut == 3)
                {
                    #region جمع قیمت سطرهای برگه جاری با inout=3 همخوانی دارد یا نه

                    if (itemTransactionLines.Any())
                    {
                        var SumItemTransactionLine =
                            Math.Abs(itemTransactionLines.Where(a => a.InOut == 1).Sum(a => a.Amount)) -
                            Math.Abs(itemTransactionLines.Where(a => a.InOut == 2).Sum(a => a.Amount));
                        var sd = Math.Abs(itemTransactionLines.Sum(a => a.Amount));
                        if (SumItemTransactionLine != 0)
                            error.Add("جمع سطرها همخوانی ندارد ، مجاز به تغییر گام نمی باشید");
                    }

                    #endregion
                }

                //#region برگه جاری دارای درخواست است => isRequest==1
                if (currentStageAction.IsRequest)
                {
                    #region آیا درخواست برگه جاری در وضعیت تایید نشده است

                    var requestList = await GetRequest(model.IdentityId, model.CompanyId);
                    var requestItm = await GetRequestItem(requestList.RequestId, requestList.ParentWorkflowCategoryId,
                        model.CompanyId);
                    var requestActionId =
                        await GetActionIdByIdentityId(requestList.RequestId, requestList.ParentWorkflowCategoryId);
                    action.StageId = requestItm != null ? requestItm.StageId : model.StageId;
                    action.ActionId = requestActionId;
                    action.WorkflowId = model.WorkflowId;
                    requestStageAction = await _stageActionRepository.GetAction(action);


                    if (!requestStageAction.IsLastConfirmHeader)
                        error.Add(
                            $"درخواست شماره {requestList.RequestId} در وضعیت تایید نشده است، مجاز به تغییر گام نمی باشید");

                    #endregion
                }
                //#endregion
                else
                {
                    #region برگه جاری مرجع است؟

                    if (!requestStageAction.IsLastConfirmHeader)
                    {
                        var target = await GetCurrentWarehouseAction(model.IdentityId, model.ParentWorkflowCategoryId,
                            model.CompanyId, 1);
                        target = target.Where(x => x.isLastConfirmHeader).ToList();
                        if (target != null)
                            if (target.Count > 0)
                            {
                                var stringIds = target.Select(x => x.Id).AsList();
                                error.Add(
                                    "شناسه های متصل به این درخواست در حالت تائید شده می باشد ، مجاز به تغییر گام نمی باشید :");
                                error.Add(string.Join(',', stringIds));
                            }
                    }

                    #endregion
                }


                #region بررسی وضعیت دوره مالی

                var resultCheckFiscalYear =
                    await _fiscalYearRepository.GetFicalYearStatusByDate(model.DocumentDate, model.CompanyId);

                if (!resultCheckFiscalYear.Successfull)
                    error.Add(resultCheckFiscalYear.StatusMessage);

                #endregion
            }
        });

        return error;
    }

    public async Task<List<StageActionGetRecord>> GetCurrentWarehouseAction(long id, byte ParentWorkflowCategoryId,
        int companyId, byte getType)
    {
        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_Get_ItemTransactionActionConfig]";
            conn.Open();

            var result = await conn.QueryAsync<StageActionGetRecord>(sQuery, new
            {
                identityId = id,
                ParentWorkflowCategoryId,
                CompanyId = companyId,
                GetType = getType
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result.AsList();
        }
    }

    public async Task<ItemTransactionGetRecord> GetRequestItem(int id, int workflowId, int companyId)
    {
        var TableName = "";
        switch (workflowId)
        {
            case 1:
                TableName = "pu.PurchaseOrder";
                break;
            case 11:
                TableName = "wh.ItemTransaction";
                break;
        }

        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetTable]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<ItemTransactionGetRecord>(sQuery, new
            {
                TableName,
                ColumnNameList =
                    "RequestId AS RequestId,stageId AS StageId, parentWorkflowCategoryId AS ParentWorkflowCategoryId",
                Filter = $"Id={id} AND companyId={companyId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<ItemTransactionRequestModel> GetRequest(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetTable]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<ItemTransactionRequestModel>(sQuery, new
            {
                TableName = "wh.ItemTransaction",
                ColumnNameList = "RequestId,ParentWorkflowCategoryId",
                Filter = $"Id={id} AND companyId={companyId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<byte> GetActionIdByIdentityId(int IdentityId, int workflowCategory)
    {
        var TableName = "";
        switch (workflowCategory)
        {
            case 1:
                TableName = "pu.PurchaseOrder";
                break;
            case 11:
                TableName = "wh.ItemTransaction";
                break;
        }

        using (var conn = Connection)
        {
            byte result = 0;
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            result = await conn.QueryFirstOrDefaultAsync<byte>(sQuery, new
            {
                TableName,
                ColumnName = "actionid",
                Filter = $"Id={IdentityId}",
                OrderBy = ""
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<List<WarehouseTransactionLineModel>> GetItemTransactionLineByHeaderId(long headerId)
    {
        var result = new List<WarehouseTransactionLineModel>();

        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetTable]";
            conn.Open();
            result.AddRange((await conn.QueryAsync<WarehouseTransactionLineModel>(sQuery, new
            {
                TableName = "wh.ItemTransactionLine",
                ColumnNameList = @"Id",
                Filter = $"HeaderId={headerId}"
            }, commandType: CommandType.StoredProcedure)).ToList());

            conn.Close();

            return result;
        }
    }

    public async Task<MyResultPage<ItemTransactionGetRecord>> GetRecordById(long id, int companyId)
    {
        var result = new MyResultPage<ItemTransactionGetRecord>
        {
            Data = new ItemTransactionGetRecord()
        };
        using (var conn = Connection)
        {
            var sQuery = "[WH].[Spc_ItemTransaction_GetRecord]";
            result.Data = await conn.QueryFirstOrDefaultAsync<ItemTransactionGetRecord>(sQuery, new
            {
                Id = id,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);
        }

        if (result.Data != null)
        {
            var getPersonOrderAction = new GetAction();
            getPersonOrderAction.CompanyId = companyId;
            getPersonOrderAction.StageId = result.Data.StageId;
            getPersonOrderAction.ActionId = result.Data.ActionId;
            getPersonOrderAction.WorkflowId = result.Data.WorkflowId;
            var stageStep = await _stageActionRepository.GetAction(getPersonOrderAction);
            if (stageStep != null)
            {
                result.Data.Priority = stageStep.Priority;
                result.Data.IsDataEntry = stageStep.IsDataEntry;
                result.Data.IsRequest = stageStep.IsRequest;
                if (result.Data.RequestId > 0)
                    result.Data.ParentTransactionDatePersian =
                        await GetTransactionDatePersian(result.Data.RequestId.Value, companyId);
            }

            result.Data.TransactionDatePersian = result.Data.TransactionDate != null
                ? result.Data.TransactionDate.ToPersianDateStringNull()
                : "";
        }

        return result;
    }

    public async Task<string> GetTransactionDatePersian(long id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<string>(sQuery, new
            {
                TableName = "wh.ItemTransaction",
                ColumnName = "FORMAT(DocumentDate,'yyyy/MM/dd','fa')",
                Filter = $"Id={id} AND CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<MyResultQuery> Delete(int id, int companyId, byte roleId)
    {
        var result = new MyResultQuery();
        var itemTransaction = await GetItemTransactionInfo(id, companyId);
        itemTransaction.CompanyId = companyId;


        var validationError = await ValidateDeleteStep(itemTransaction, roleId);

        if (validationError.Count > 0)
        {
            result.Successfull = false;
            result.ValidationErrors = validationError;
            return result;
        }


        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_ItemTransaction_Delete]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                ItemTransactionId = id
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status > 0;
        result.ValidationErrors = result.Successfull
            ? new List<string> { "عملیات حذف با موفقیت انجام شد" }
            : new List<string> { result.StatusMessage };
        return result;
    }


    public async Task<List<string>> ValidateDeleteStep(ItemTransactionViewModel model, byte roleId)
    {
        var error = new List<string>();

        if (model.Id == 0)
            error.Add("اطلاعات ورودی معتبر نمی باشد");
        else
            await Task.Run(async () =>
            {
                #region بررسی حذف با نقش و جریان کار و مرحله

                var hasPermission =
                    await _roleWorklfowPermissionRepository.CheckRoleWorkflowPermission(model.WorkflowId,
                        model.BranchId, model.StageId, model.ActionId, roleId);
                if (hasPermission == 0)
                {
                    var stage = await _stageRepository.GetName(model.StageId);
                    error.Add($"{stage} دسترسی ندارید ");
                }

                #endregion


                var getAction = new GetAction
                {
                    CompanyId = model.CompanyId,
                    StageId = model.StageId,
                    ActionId = model.ActionId,
                    WorkflowId = model.WorkflowId
                };

                var warehaouseStageAction = await _stageActionRepository.GetAction(getAction);

                if (!warehaouseStageAction.IsDeleteHeader)
                    error.Add("مجاز به حذف برگه در این مرحله و گام نمی باشید");

                if (warehaouseStageAction.UnitCostCalculationWarehouse)
                    error.Add($" امکان درج برای مرحله: {model.StageId}  و جریان کار : {model.WorkflowId}  را ندارید ");


                #region برگه جاری مرجع است؟

                if (model.StageClass == "1")
                {
                    var target = await GetCurrentWarehouseAction(model.Id, 11, model.CompanyId, 1);
                    if (target.ListHasRow())
                        if (target.Count > 0)
                        {
                            var stringIds = target.Select(x => x.Id).AsList();
                            error.Add("درخواست جاری برای اسناد انبار ذکر شده استفاده شده ، مجاز به حذف نمی باشید :");
                            error.Add(string.Join(',', stringIds));
                        }
                }

                #endregion

                #region بررسی وضعیت دوره مالی

                var resultCheckFiscalYear =
                    await _fiscalYearRepository.GetFicalYearStatusByDate(model.DocumentDate, model.CompanyId);

                if (!resultCheckFiscalYear.Successfull)
                    error.Add(resultCheckFiscalYear.StatusMessage);

                #endregion


                #region بررسی موجودی منفی برای پالت

                var checkNegativeInventory = false;
                var headerId = model.Id;
                var itemTransactionLine = await ItemTransactionLinesGetPage(headerId);


                for (var i = 0; i < itemTransactionLine.TotalRecordCount; i++)
                {
                    if (((model.Inout == 1 || model.Inout == 3) && itemTransactionLine.Data[i].InOut == 2) ||
                        ((model.Inout == 2 || model.Inout == 3) && itemTransactionLine.Data[i].InOut == 1))

                        checkNegativeInventory = true;

                    else
                        checkNegativeInventory = false;


                    if (checkNegativeInventory)
                    {
                        var bin = _binRepository.GetRecordById<BinGetRecord>(itemTransactionLine.Data[i].BinId ?? 0,
                            false, "wh");
                        if (bin.Result.NegativeInventory)
                        {
                            var NegativeInventoryModel = new WarehouseTransactionCheckNegativeInventory
                            {
                                WarehouseId = itemTransactionLine.Data[i].WarehouseId,
                                ItemId = itemTransactionLine.Data[i].ItemId,
                                ZoneId = itemTransactionLine.Data[i].ZoneId ?? 0,
                                BinId = itemTransactionLine.Data[i].BinId ?? 0,
                                UnitId = itemTransactionLine.Data[i].UnitId,
                                SubUnitId = itemTransactionLine.Data[i].SubUnitId,
                                InOut = itemTransactionLine.Data[i].InOut,
                                HeaderInOut = model.Inout,
                                AttributeIds = itemTransactionLine.Data[i].AttributeIds,
                                HeaderDocumentDate = model.DocumentDate,
                                Ratio = Convert.ToDecimal(itemTransactionLine.Data[i].Ratio),
                                HeaderId = model.Id,
                                Id = model.Id,
                                TotalQuantity = Convert.ToDecimal(itemTransactionLine.Data[i].TotalQuantity)
                            };

                            if (model.Inout == 2 && itemTransactionLine.Data[i].InOut == 1)
                                NegativeInventoryModel.HeaderDocumentDate =
                                    await GetMaxDocumentDateNegativeInventory(NegativeInventoryModel);

                            var Quntity = await WarehouseCheckNegativeInventory(NegativeInventoryModel);

                            //1: موجودی کمتر از صفر است
                            //2: مجموع تعداد کل انتخابی وتعداد منفی می شود  
                            if (Quntity < 0 ||
                                Quntity + Convert.ToDecimal(itemTransactionLine.Data[i].TotalQuantity) < 0 ||
                                Quntity == 0 ||
                                Quntity - Convert.ToDecimal(itemTransactionLine.Data[i].TotalQuantity) < 0)

                                error.Add(
                                    $"کنترل موجودی انبار:( {itemTransactionLine.Data[i].Warehouse} / بخش: {itemTransactionLine.Data[i].Zone} / پالت : {itemTransactionLine.Data[i].Bin}) مجوز موجودی منفی ندارید");
                        }
                    }
                }

                #endregion

                #region بررسی ریالی شدن انبار در تاریخ برگه

                var headerDocumentDatePersian = model.DocumentDate.ToPersianDateString("{0}/{1}/{2}");

                var fiscalYearLineId = await GetFiscalYearLineIdByPersianDate(headerDocumentDatePersian);
                if (fiscalYearLineId != null)
                {
                    var CheckLockModel = new CheckLockModel
                    {
                        BranchId = model.BranchId,
                        FiscalYearLineId = int.Parse(fiscalYearLineId)
                    };

                    var checkLockFiscalyear = await CheckLockFiscalYear(CheckLockModel);
                    if (checkLockFiscalyear) error.Add("انبار در این ماه ، ریالی شده است اجازه ی حذف را ندارید.");
                }

                #endregion
            });
        return error;
    }

    public async Task<MyResultStageStepConfigPage<List<ItemTransactionLines>>> ItemTransactionLinesGetPage(int headerId)

    {
        var result = new MyResultStageStepConfigPage<List<ItemTransactionLines>>
        {
            Data = new List<ItemTransactionLines>()
        };

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", 0);
        parameters.Add("PageRowsCount", 1000);
        parameters.Add("Id");
        parameters.Add("HeaderId", headerId);
        parameters.Add("ZoneId");
        parameters.Add("BinId");
        parameters.Add("ItemTypeId");
        parameters.Add("ItemId");

        parameters.Add("ItemCategoryId");
        parameters.Add("UnitId");
        parameters.Add("AttributeIds");

        parameters.Add("CreateUserId");
        using (var conn = Connection)
        {
            var sQuery = "c";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<ItemTransactionLines>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        result.Data = result.Data.OrderByDescending(trl => trl.CreateDateTime).ToList();
        return result;
    }

    public async Task<ItemTransactionViewModel> GetItemTransactionInfo(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<ItemTransactionViewModel>(sQuery, new
            {
                TableName = "wh.ItemTransaction",
                ColumnName = "Id,StageId,BranchId,ActionId,DocumentDate,WorkflowId,ParentWorkflowCategoryId,InOut",
                Filter = $"Id={id} AND CompanyId={companyId} "
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<List<string>> ValidateSaveItemTransaction(WarehouseTransactionModel model)
    {
        var error = new List<string>();

        if (model == null)
        {
            error.Add("مقادیر معتبر نمی باشد");
            return error;
        }

        await Task.Run(async () =>
        {
            #region UnitCostCalculationWarehouse بررسی فیلد

            var getAction = new GetAction();
            getAction.CompanyId = model.CompanyId;
            getAction.StageId = model.StageId;
            getAction.Priority = 1;
            getAction.WorkflowId = model.WorkflowId;
            var stageStep = await _stageActionRepository.GetAction(getAction);
            if (stageStep.UnitCostCalculationWarehouse)
                error.Add($"امکان درج برای مرحله : {model.StageId}   و جریان کار : {model.WorkflowId}  را ندارید ");

            #endregion

            #region بررسی وضعیت دوره مالی

            var resultCheckFiscalYear =
                await _fiscalYearRepository.GetFicalYearStatusByDate(model.TransactionDate, model.CompanyId);
            if (!resultCheckFiscalYear.Successfull)
                error.Add(resultCheckFiscalYear.StatusMessage);

            #endregion

            #region بررسی ریالی شدن انبار در تاریخ برگه

            var headerDocumentDatePersian = model.TransactionDate.ToPersianDateString("{0}/{1}/{2}");

            var fiscalYearLineId = await GetFiscalYearLineIdByPersianDate(headerDocumentDatePersian);
            if (fiscalYearLineId != null)
            {
                var CheckLockModel = new CheckLockModel
                {
                    BranchId = model.BranchId,
                    FiscalYearLineId = int.Parse(fiscalYearLineId)
                };

                var checkLockFiscalyear = await CheckLockFiscalYear(CheckLockModel);
                if (checkLockFiscalyear) error.Add("انبار در این ماه ، ریالی شده است اجازه ی ثبت ندارید.");
            }

            #endregion
        });
        return error;
    }

    public async Task<ItemTransactionResult> Insert(WarehouseTransactionModel model, byte roleId)
    {
        var validationError = await ValidateSaveItemTransaction(model);

        if (validationError.Count > 0)
            return new ItemTransactionResult
            {
                Status = -98,
                Successfull = false,
                ValidationErrors = validationError
            };


        var result = new ItemTransactionResult();

        var getAction = new GetAction();
        getAction.CompanyId = model.CompanyId;
        getAction.StageId = model.StageId;
        getAction.Priority = 1;
        getAction.WorkflowId = model.WorkflowId;
        var stageStep = await _stageActionRepository.GetAction(getAction);

        var hasPermission = await _roleWorklfowPermissionRepository.CheckRoleWorkflowPermission(model.WorkflowId,
            model.BranchId, model.StageId, stageStep.ActionId, roleId);

        if (hasPermission == 1)
        {
            using (var conn = Connection)
            {
                var sQuery = "[wh].[Spc_ItemTransaction_InsUpd]";
                conn.Open();
                var output = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
                {
                    model.Id,
                    model.RequestId,
                    model.TreasurySubjectId,
                    model.WorkflowId,
                    model.StageId,
                    model.BranchId,
                    model.WarehouseId,
                    model.TransactionDate,
                    model.DocumentTypeId,
                    model.AccountGLId,
                    model.AccountSGLId,
                    model.NoSeriesId,
                    model.AccountDetailId,
                    model.Inout,
                    model.ParentWorkflowCategoryId,
                    model.CreateUserId,
                    model.CreateDatetime,
                    Note = model.Note.ConvertArabicAlphabet(),
                    model.CompanyId,
                    BySystem = 0
                }, commandType: CommandType.StoredProcedure);
                conn.Close();

                result.Id = output.Id;
                result.Successfull = output.Status == 100;

                if (result.Successfull)
                {
                    var updateStepModel = new UpdateAction
                    {
                        RequestActionId = stageStep.ActionId,
                        WorkflowCategoryId = 11,
                        IdentityId = int.Parse(result.Id.ToString()),
                        StageId = model.StageId,
                        WorkflowId = model.WorkflowId,
                        CompanyId = model.CompanyId,
                        UserId = (int)model.CreateUserId
                    };
                    await UpdateStep(updateStepModel, OperationType.Insert);
                }
            }
        }
        else
        {
            result.Successfull = false;
            var stage = await _stageRepository.GetName(model.StageId);
            result.StatusMessage = $"{stage} دسترسی ندارید ";
        }

        return result;
    }

    public async Task<ItemTransactionResult> Update(WarehouseTransactionModel model)
    {
        var validationError = await ValidateSaveItemTransaction(model);

        if (validationError.Count > 0)
            return new ItemTransactionResult
            {
                Status = -98,
                Successfull = false,
                ValidationErrors = validationError
            };
        var result = new ItemTransactionResult();
        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_ItemTransaction_InsUpd]";
            conn.Open();
            var output = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                model.Id,
                model.RequestId,
                model.TreasurySubjectId,
                model.WorkflowId,
                model.StageId,
                model.BranchId,
                model.WarehouseId,
                model.TransactionDate,
                model.DocumentTypeId,
                model.AccountGLId,
                model.AccountSGLId,
                model.NoSeriesId,
                model.AccountDetailId,
                model.Inout,
                model.ParentWorkflowCategoryId,
                model.CreateUserId,
                model.CreateDatetime,
                Note = model.Note.ConvertArabicAlphabet(),
                model.CompanyId,
                BySystem = 0
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Id = output.Id;
            result.Successfull = output.Status == 100;
            result.StatusMessage =
                result.Successfull ? "عملیات با موفقیت انجام پذیرفت" : "مشکلی در انجام عملیات وجود دارد";
        }

        return result;
    }

    public async Task<int> WarehouseCheckNegativeInventory(WarehouseTransactionCheckNegativeInventory model)
    {
        using (var conn = Connection)
        {
            var sQuery = "wh.Spc_Warehouse_CheckNegativeInventory";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<int>(sQuery, new
            {
                model.WarehouseId,
                model.ItemId,
                model.ZoneId,
                model.BinId,
                model.UnitId,
                model.SubUnitId,
                model.Ratio,
                model.AttributeIds,
                DocumentDate = model.HeaderDocumentDate
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
            return result;
        }
    }

    public async Task<DateTime> GetMaxDocumentDateNegativeInventory(WarehouseTransactionCheckNegativeInventory model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_Get_MaxDocumentDate_NegativeInventory]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<DateTime>(sQuery, new
            {
                model.WarehouseId,
                model.ItemId,
                model.ZoneId,
                model.BinId,
                model.UnitId,
                SubUnitId = model.SubUnitId > 0 ? model.SubUnitId : null,
                model.Ratio,
                model.AttributeIds
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
            return result;
        }
    }

    public async Task<List<HeaderWarehouseTransactionPostingGroup>> GetHeaderWarehouseTransactionPostingGroup(
        HeaderWarehousePostingGroupModel model)
    {
        var headerList = new List<HeaderWarehouseTransactionPostingGroup>();

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_ItemTransactionHeader_PostingGroup_GetList]";
            conn.Open();
            headerList = (await conn.QueryAsync<HeaderWarehouseTransactionPostingGroup>(
                sQuery, new
                {
                    model.FromDate,
                    model.ToDate,
                    model.CompanyId
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return headerList;
    }

    public async Task<bool> CheckLockFiscalYear(CheckLockModel model)
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

    public async Task<string> GetFiscalYearLineIdByPersianDate(string PersianDate)
    {
        using (var conn = Connection)
        {
            var sQuery = "SELECT [gn].[Fnc_PersianDateToFiscalYearLineId](@PersianDate)";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<string>(sQuery, new
            {
                PersianDate
            });
            conn.Close();

            return result;
        }
    }
}