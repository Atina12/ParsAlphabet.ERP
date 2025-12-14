using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.WH.UnitCostCalculation;
using ParsAlphabet.ERP.Application.Dtos.WH.UnitCostCalculationLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageActionLog;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WH.UnitCostCalculationLine;

public class UnitCostCalculationLineRepository :
    BaseRepository<UnitCostCalculationModel, int, string>,
    IBaseRepository<UnitCostCalculationModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;
    private readonly StageActionLogRepository _stageActionLogRepository;
    private readonly StageActionRepository _stageActionRepository;

    public UnitCostCalculationLineRepository(
        IConfiguration config,
        IHttpContextAccessor accessor,
        StageActionRepository stageActionRepository,
        StageActionLogRepository stageActionLogRepository
    ) : base(config)
    {
        _accessor = accessor;
        _stageActionRepository = stageActionRepository;
        _stageActionLogRepository = stageActionLogRepository;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(UnitCostCalculationLineViewModel model)
    {
        var unitCostCalculationLineDetail = await GetLineDetailPage(model);
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = "ماه ,تاریخ شروع , تاریخ پایان ,بستن دوره ی مالی ,گام,کاربر ثبت کننده,تاریخ ثبت"
        };

        result.Rows = from p in unitCostCalculationLineDetail.Data
            select new
            {
                p.Month,
                p.StartDatePersian,
                p.EndDatePersian,
                Closed = p.Locked == 1 ? "بسته" : "باز",
                p.Action,
                p.UserFullName,
                p.CreateDateTimePersian
            };

        return result;
    }

    public async Task<CSVViewModel<IEnumerable>> ExportCsvUnitCostUpdateStep(NewGetPageViewModel model)
    {
        var LastconfirmheadeViewModel = new LastconfirmheadeViewModel
        {
            FromDatePersian = model.Form_KeyValue[0]?.ToString(),
            ToDatePersian = model.Form_KeyValue[1]?.ToString(),
            IsCostOfItemInvoice = Convert.ToBoolean(model.Form_KeyValue[2]?.ToString()),
            Type = Convert.ToBoolean(model.Form_KeyValue[3]?.ToString())
        };
        var unitCostCalculationLineDetail = LastconfirmheadeViewModel.Type
            ? await GetCsvUnitCostUpdateStep(LastconfirmheadeViewModel)
            : await GetCsvUnitCost(LastconfirmheadeViewModel);

        var result = new CSVViewModel<IEnumerable>
        {
            Columns = LastconfirmheadeViewModel.Type
                ? "شناسه سفارش,مرحله,جریان کار,گام جاری,تاریخ برگه"
                : "شناسه انبار,مرحله,جریان کار,گام جاری,تاریخ برگه"
        };

        result.Rows = from p in unitCostCalculationLineDetail.Data
            select new
            {
                p.Id,
                p.Workflow,
                p.Stage,
                p.Action,
                p.DocumentDatePersian
            };

        return result;
    }

    public async Task<MyResultPage<List<UnitCostCalculationNotLastConfirmHeaderViewModel>>> GetCsvUnitCostUpdateStep(
        LastconfirmheadeViewModel model)
    {
        var result = new MyResultPage<List<UnitCostCalculationNotLastConfirmHeaderViewModel>>
        {
            Data = new List<UnitCostCalculationNotLastConfirmHeaderViewModel>()
        };

        using (var conn = Connection)
        {
            conn.Open();

            var parameterList = new DynamicParameters();
            parameterList.Add("FromDate", model.FromDatePersian.ToMiladiDateTime());
            parameterList.Add("ToDate", model.ToDatePersian.ToMiladiDateTime());

            //لیست اسناد انبار که درخواستش خرید هست که LastConfirmHeader=0 باشد
            var sQuery = "[wh].[Spc_ItemTransaction_NotCostOfItemInvoiced_GetList]";

            result.Data =
                (await conn.QueryAsync<UnitCostCalculationNotLastConfirmHeaderViewModel>(sQuery, parameterList,
                    commandType: CommandType.StoredProcedure)).ToList();

            conn.Close();
        }

        return result;
    }

    public async Task<MyResultPage<List<UnitCostCalculationNotLastConfirmHeaderViewModel>>> GetCsvUnitCost(
        LastconfirmheadeViewModel model)
    {
        var result = new MyResultPage<List<UnitCostCalculationNotLastConfirmHeaderViewModel>>
        {
            Data = new List<UnitCostCalculationNotLastConfirmHeaderViewModel>()
        };

        using (var conn = Connection)
        {
            conn.Open();
            var parameters = new DynamicParameters();
            parameters.Add("FromDate", model.FromDatePersian.ToMiladiDateTime());
            parameters.Add("ToDate", model.ToDatePersian.ToMiladiDateTime());
            parameters.Add("Type", model.IsCostOfItemInvoice ? 1 : 2);

            //بررسی لیست درخواست های سند و انبار
            var sQuery = "[wh].[Spc_ItemTransaction_NotLastConfirmHeader_GetList]";

            result.Data =
                (await conn.QueryAsync<UnitCostCalculationNotLastConfirmHeaderViewModel>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();

            conn.Close();
        }

        return result;
    }

    public async Task<MyResultPage<List<UnitCostCalculationLineList>>> Display(
        UnitCostCalculationDirectPagingViewModel model, byte roleId)
    {
        var result = new MyResultPage<List<UnitCostCalculationLineList>>
        {
            Data = new List<UnitCostCalculationLineList>()
        };

        var paginationParameters = new DynamicParameters();
        var unitCostCalculationIdFromPagination = 0;

        var parameters = new DynamicParameters();

        if (model.directPaging > 0)
        {
            paginationParameters.Add("TableName", "[wh].[UnitCostCalculation]");
            paginationParameters.Add("IdColumnName", "[wh].[UnitCostCalculation].Id");
            paginationParameters.Add("IdColumnValue", "[wh].[UnitCostCalculation]." + model.Id);
            paginationParameters.Add("FilterParam", "");
            paginationParameters.Add("Direction", model.directPaging);

            using (var conn = Connection)
            {
                var sQuery = "[pb].[Spc_Tables_NextPrev]";
                conn.Open();
                unitCostCalculationIdFromPagination = await conn.ExecuteScalarAsync<int>(sQuery, paginationParameters,
                    commandType: CommandType.StoredProcedure);
                conn.Close();
            }

            parameters.Add("UnitCostCalculationId",
                unitCostCalculationIdFromPagination == 0 ? model.Id : unitCostCalculationIdFromPagination);
        }
        else
        {
            parameters.Add("UnitCostCalculationId", model.Id);
        }


        parameters.Add("RoleId", roleId);

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_UnitCostCalculationLine_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<UnitCostCalculationLineList>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }


        return result;
    }

    public async Task<MyResultPage<List<UnitCostCalculationLineList>>> Getlist(int id, byte roleId)
    {
        var result = new MyResultPage<List<UnitCostCalculationLineList>>
        {
            Data = new List<UnitCostCalculationLineList>()
        };

        var parameters = new DynamicParameters();
        parameters.Add("UnitCostCalculationId", id);
        parameters.Add("RoleId", roleId);


        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_UnitCostCalculationLine_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<UnitCostCalculationLineList>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }


        return result;
    }


    public async Task<MyResultPage<List<UnitCostCalculationLinegetpage>>> GetLineDetailPage(
        UnitCostCalculationLineViewModel model)
    {
        var result = new MyResultPage<List<UnitCostCalculationLinegetpage>>
        {
            Data = new List<UnitCostCalculationLinegetpage>()
        };


        var parameters = new DynamicParameters();
        parameters.Add("PageNo", 0);
        parameters.Add("PageRowsCount", 50);
        parameters.Add("UnitCostCalculationLineId", model.Id);
        parameters.Add("BranchId", model.BranchId);
        parameters.Add("Id");


        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_UnitCostCalculationLineDetail_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<UnitCostCalculationLinegetpage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();

            conn.Close();
        }

        return result;
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetActionListByUnitCostCalculationLineId(int id, byte roleId)
    {
        var sQuery = "[wh].[Spc_UnitCostCalculationLine_GetAllActions]";

        using (var conn = Connection)
        {
            conn.Open();
            var result = await Connection.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    UnitCostCalculationId = id,
                    RoleId = roleId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<UnitCostCalculationLineDetailResultStatus> UpdateStep(UpdateUnitCalculationStep model)
    {
        var result = new UnitCostCalculationLineDetailResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_UpdItem_Number";
            conn.Open();
            var updateitemTransaction = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                TableName = "wh.UnitCostCalculationLineDetail",
                ColumnName = "ActionId",
                Value = model.RequestActionId,
                Filter = $"Id={model.IdentityId}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.StatusMessage = "تغییرات با موفقیت انجام شد";

        var updateStepMOdel = new UpdateAction
        {
            RequestActionId = model.RequestActionId,
            CompanyId = model.CompanyId,
            IdentityId = model.IdentityId,
            StageId = model.StageId,
            UserId = model.UserId,
            WorkflowCategoryId = 11,
            WorkflowId = model.WorkflowId
        };


        await _stageActionLogRepository.StageActionLogInsert(updateStepMOdel);

        result.Successfull = model.IdentityId > 0;
        result.Status = result.Successfull ? 100 : -100;
        result.ValidationErrors.Add(result.StatusMessage);


        return result;
    }


    public async Task<UnitCostCalculationValidateResultStatus> ValidateUpdateStep(UpdateUnitCalculationStep model)
    {
        var result = new UnitCostCalculationValidateResultStatus();

        var error = new List<string>();


        if (!model.NotNull())
            return new UnitCostCalculationValidateResultStatus
            {
                Successfull = false,
                ValidationErrors = new List<string> { "درخواست معتبر نمی باشد" }
            };
        await Task.Run(async () =>
        {
            #region آیا گام درخواستی، معتبر است یا نه

            //گام درخواستی
            var unitCostCalculationAction = new GetAction();
            unitCostCalculationAction.StageId = model.StageId;
            unitCostCalculationAction.ActionId = model.RequestActionId;
            unitCostCalculationAction.WorkflowId = model.WorkflowId;
            var requestStageAction = await _stageActionRepository.GetAction(unitCostCalculationAction);

            //گام جاری
            unitCostCalculationAction.StageId = model.StageId;
            unitCostCalculationAction.ActionId = model.CurrentActionId;
            unitCostCalculationAction.WorkflowId = model.WorkflowId;
            var currentStageAction = await _stageActionRepository.GetAction(unitCostCalculationAction);
            var expectedPriority = 0;

            if (currentStageAction.Priority < requestStageAction.Priority)
                expectedPriority = currentStageAction.Priority + 1;
            else if (currentStageAction.Priority > requestStageAction.Priority)
                expectedPriority = currentStageAction.Priority - 1;

            if (expectedPriority != 0 && expectedPriority != requestStageAction.Priority)
                error.Add("گام درخواست شده معتبر نمی باشد");

            #endregion


            //خطا وجود نداشت 
            if (error.Count > 0)
            {
                result.Successfull = false;
                result.ValidationErrors = error;
            }
            else
            {
                result.Successfull = true;
                result.CurrentPriority = currentStageAction.Priority;
                result.RequestPriority = requestStageAction.Priority;
                result.CostofItemOrdered = requestStageAction.CostofItemOrdered;
                result.CostofItemInvoiced = requestStageAction.CostofItemInvoiced;
                result.UnitCostCalculationWarehouse = requestStageAction.UnitCostCalculationWarehouse;
                result.ValidationErrors = null;
            }
        });

        return result;
    }


    public async Task<MyResultPage<List<UnitCostCalculationNotLastConfirmHeaderViewModel>>>
        GetUnitCostCalculationGetLastCostOfItem(LastconfirmheadeViewModel model)
    {
        var result = new MyResultPage<List<UnitCostCalculationNotLastConfirmHeaderViewModel>>
        {
            Data = new List<UnitCostCalculationNotLastConfirmHeaderViewModel>()
        };


        using (var conn = Connection)
        {
            var parameters = new DynamicParameters();
            parameters.Add("FromDate", model.FromDate);
            parameters.Add("ToDate", model.ToDate);
            parameters.Add("Type", model.IsCostOfItemInvoice ? 1 : 2);

            //بررسی لیست درخواست های سند و انبار
            var sQuery = "[wh].[Spc_ItemTransaction_NotLastConfirmHeader_GetList]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<UnitCostCalculationNotLastConfirmHeaderViewModel>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();

            if (model.IsCostOfItemInvoice)
            {
                var parameterList = new DynamicParameters();
                parameterList.Add("FromDate", model.FromDate);
                parameterList.Add("ToDate", model.ToDate);

                //لیست اسناد انبار که درخواستش خرید هست که LastConfirmHeader=0 باشد
                sQuery = "[wh].[Spc_ItemTransaction_NotCostOfItemInvoiced_GetList]";
                result.Data.AddRange((await conn.QueryAsync<UnitCostCalculationNotLastConfirmHeaderViewModel>(sQuery,
                    parameterList, commandType: CommandType.StoredProcedure)).ToList());
            }


            conn.Close();
        }

        return result;
    }

    public async Task<UnitCostCalculationLineDetailResultStatus> UnitCostCalculationUpdatePurchasedPrice(
        UnitCostCalculationUpdatePurchasedPrice model)
    {
        var result = new UnitCostCalculationLineDetailResultStatus();
        using (var conn = Connection)
        {
            var sQuery = model.IsReturn
                ? "[wh].[Spc_ItemTransactionLine_ReturnUpdatePurchasedPrice]"
                : "[wh].[Spc_ItemTransactionLine_UpdatePurchasedPrice]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<UnitCostCalculationLineDetailResultStatus>(sQuery,
                new
                {
                    model.FromDate,
                    model.ToDate,
                    model.BranchId,
                    model.UserId,
                    model.CompanyId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = result.Status == 100;
            return result;
        }
    }

    public async Task<UnitCostCalculationLineDetailResultStatus> UnitCostCalculationUpdateLinePrice(
        UnitCostCalculationUpdatePurchasedPrice model)
    {
        var result = new UnitCostCalculationLineDetailResultStatus();
        using (var conn = Connection)
        {
            if (model.IsReturn)
            {
                var sQuery = "[wh].[Spc_ItemTransactionLine_ReturnUpdateLinePrice]";
                conn.Open();
                result = await conn.QueryFirstOrDefaultAsync<UnitCostCalculationLineDetailResultStatus>(sQuery,
                    new
                    {
                        model.FromDate,
                        model.ToDate,
                        model.BranchId,
                        model.UserId,
                        model.CompanyId
                    }, commandType: CommandType.StoredProcedure);
                conn.Close();

                result.Successfull = result.Status == 100;
            }
            else
            {
                var sQuery = "[wh].[Spc_ItemTransactionLine_UpdateLinePrice]";
                conn.Open();
                result = await conn.QueryFirstOrDefaultAsync<UnitCostCalculationLineDetailResultStatus>(sQuery,
                    new
                    {
                        model.FromDate,
                        model.ToDate,
                        model.BranchId,
                        model.CostingMethodId,
                        model.UserId,
                        model.CompanyId
                    }, commandType: CommandType.StoredProcedure);
                conn.Close();

                result.Successfull = result.Status == 100;
            }
        }

        return result;
    }


    public async Task<MyResultPage<List<UnitCostCalculationLineDetailInfo>>> GetUnitCostCalculationLineDetailInfo(
        UnitCostCalculationLineDetailViewModel model)
    {
        var result = new MyResultPage<List<UnitCostCalculationLineDetailInfo>>
        {
            Data = new List<UnitCostCalculationLineDetailInfo>()
        };

        var getData = new MyResultPage<List<UnitCostCalculationLineDetailInfo>>
        {
            Data = new List<UnitCostCalculationLineDetailInfo>()
        };
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();

            result.Data = (await conn.QueryAsync<UnitCostCalculationLineDetailInfo>(sQuery,
                new
                {
                    IsSecondLang = false,
                    TableName = "wh.UnitCostCalculationLineDetail",
                    IdColumnName = "",
                    ColumnNameList = "Id,MonthId,ActionId",
                    IdList = "",
                    Filter = $"UnitCostCalculationLineId={model.Id}",
                    OrderBy = ""
                }, commandType: CommandType.StoredProcedure)).ToList();

            conn.Close();

            if (result.Data.Count() > 0)
            {
                if (model.MonthId == 1)
                    getData.Data = result.Data.Where(x => x.MonthId > model.MonthId && x.ActionId != 2).ToList();

                else if (model.MonthId == 12)
                    getData.Data = result.Data
                        .Where(x => x.MonthId < model.MonthId && (x.ActionId != 30 || x.ActionId != 4)).ToList();

                else
                    switch (model.RequestActionId)
                    {
                        case 2: //
                            getData.Data = result.Data.Where(x =>
                                x.MonthId < model.MonthId && x.ActionId != 30 && x.ActionId != 4).ToList();
                            getData.Data.AddRange(result.Data.Where(x => x.MonthId > model.MonthId && x.ActionId != 2)
                                .ToList());
                            break;

                        case 29: //
                            getData.Data = result.Data.Where(x =>
                                x.MonthId < model.MonthId && x.ActionId != 30 && x.ActionId != 4).ToList();
                            getData.Data.AddRange(result.Data.Where(x => x.MonthId > model.MonthId && x.ActionId != 2)
                                .ToList());
                            break;

                        case 30: //
                            getData.Data = result.Data.Where(x =>
                                x.MonthId < model.MonthId && x.ActionId != 30 && x.ActionId != 4).ToList();
                            getData.Data.AddRange(result.Data.Where(x => x.MonthId > model.MonthId && x.ActionId != 2)
                                .ToList());
                            break;

                        case 4: //
                            getData.Data = result.Data.Where(x =>
                                x.MonthId < model.MonthId && (x.ActionId == 2 || x.ActionId == 29)).ToList();
                            break;
                    }
            }

            result.Data = getData.Data;

            return result;
        }
    }
}