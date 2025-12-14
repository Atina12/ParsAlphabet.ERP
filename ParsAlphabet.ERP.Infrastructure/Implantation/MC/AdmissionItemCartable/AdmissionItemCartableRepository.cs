using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionCartable;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionItemCartable;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.RoleWorkflowPermission;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.Stage;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionItemCartable;

public class AdmissionItemCartableRepository :
    BaseRepository<AdmissionItemCartableGetPage, long, string>,
    IBaseRepository<AdmissionItemCartableGetPage, long, string>
{
    private readonly RoleWorklfowPermissionRepository _roleWorklfowPermissionRepository;
    private readonly StageActionRepository _stageActionRepository;
    private readonly StageRepository _stageRepository;

    public AdmissionItemCartableRepository(
        IConfiguration config,
        StageActionRepository stageActionRepository,
        RoleWorklfowPermissionRepository roleWorklfowPermissionRepository,
        StageRepository stageRepository
    ) : base(config)
    {
        _stageActionRepository = stageActionRepository;
        _roleWorklfowPermissionRepository = roleWorklfowPermissionRepository;
        _stageRepository = stageRepository;
    }

    public GetColumnsViewModel GetColumnsCartable()
    {
        var list = new GetColumnsViewModel
        {
            FixedColumn = true,
            ActionType = "inline",
            IsSelectable = true,
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "conflict", FieldValue = "true", Operator = "==" } },
            AnswerCondition = "color:#da1717",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsPrimary = true, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 7
                },
                new()
                {
                    Id = "admissionMasterId", Title = "شناسه پرونده", Type = (int)SqlDbType.Int, IsPrimary = true,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "number", Width = 7
                },
                new() { Id = "medicalRevenue", IsPrimary = true },
                new()
                {
                    Id = "branch", Title = "شعبه", IsPrimary = true, Type = (int)SqlDbType.SmallInt,
                    IsDtParameter = true, IsFilterParameter = true, Width = 9
                },
                new()
                {
                    Id = "workflow", Title = "جریان کار", IsPrimary = true, Type = (int)SqlDbType.SmallInt,
                    IsDtParameter = true, IsFilterParameter = true, Width = 13
                },
                new()
                {
                    Id = "stage", Title = "مرحله", IsPrimary = true, Type = (int)SqlDbType.SmallInt,
                    IsDtParameter = true, IsFilterParameter = true, Width = 11
                },
                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    IsFilterParameter = true, Width = 12
                },
                new()
                {
                    Id = "patientNationalCode", Title = "نمبر تذکره مراجعه کننده", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "strnumber", Width = 11
                },
                new()
                {
                    Id = "lineCount", Title = "تعداد آیتم", Type = (int)SqlDbType.NVarChar, Size = 20,
                    IsDtParameter = true, Width = 4
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 11 },

                new() { Id = "branchId", IsPrimary = true },
                new() { Id = "workflowId", IsPrimary = true },
                new() { Id = "stageId", IsPrimary = true },
                new() { Id = "admissionWorkflowCategoryId", IsPrimary = true }
            }
        };

        list.Buttons = new List<GetActionColumnViewModel>
        {
            new()
            {
                Name = "previousAction", Title = "گام قبلی", ClassName = "btn blue_outline_1",
                IconName = "fas fa-arrow-right"
            },
            new()
            {
                Name = "nextAction", Title = "گام بعدی", ClassName = "btn blue_outline_1",
                IconName = "fas fa-arrow-left"
            },
            new()
            {
                Name = "inbounditemlist", Title = "نمایش سفارش کالا", ClassName = "btn blue_outline_1",
                IconName = "fa fa-list"
            },
            new()
            {
                Name = "inboundItemprint", Title = "چاپ", ClassName = "btn blue_outline_2", IconName = "fa fa-print"
            }
        };

        return list;
    }

    public async Task<List<MyDropDownViewModel>> GetSectionCartable(NewGetPageViewModel model, byte roleId)
    {
        var fromWorkDayDate = model.Form_KeyValue[9]?.ToString().ToMiladiDateTime();
        var toWorkDayDate = model.Form_KeyValue[10]?.ToString().ToMiladiDateTime();

        var parameters = new DynamicParameters();
        parameters.Add("Id", model.Form_KeyValue[0]?.ToString() != null ? model.Form_KeyValue[0]?.ToString() : null);
        parameters.Add("AdmissionMasterId",
            model.Form_KeyValue[1]?.ToString() != null ? model.Form_KeyValue[1]?.ToString() : null);
        parameters.Add("StageId", model.Form_KeyValue[2] != null ? model.Form_KeyValue[2] : null);
        parameters.Add("WorkflowId",
            model.Form_KeyValue[3]?.ToString() != null ? model.Form_KeyValue[3]?.ToString() : null);
        parameters.Add("ContractTypeId",
            model.Form_KeyValue[4]?.ToString() != null ? model.Form_KeyValue[4]?.ToString() : null);
        parameters.Add("VendorId",
            model.Form_KeyValue[5]?.ToString() != null ? model.Form_KeyValue[5]?.ToString() : null);
        parameters.Add("PatientId",
            model.Form_KeyValue[6]?.ToString() != null ? model.Form_KeyValue[6]?.ToString() : null);
        parameters.Add("ItemId", model.Form_KeyValue[7]?.ToString() != null ? model.Form_KeyValue[7]?.ToString() : null);
        parameters.Add("BranchId",
            model.Form_KeyValue[8]?.ToString() != null ? model.Form_KeyValue[8]?.ToString() : null);
        parameters.Add("RoleId", roleId);
        parameters.Add("FromWorkDayDate", fromWorkDayDate);
        parameters.Add("ToWorkDayDate", toWorkDayDate);
        parameters.Add("IsSettled",
            model.Form_KeyValue[11]?.ToString() != null ? model.Form_KeyValue[11]?.ToString() : null);
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionItem_Cartable_Section]";
            conn.Open();
            var result =
                await conn.QueryAsync<MyDropDownViewModel>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure);
            conn.Close();

            return result.AsList();
        }
    }

    public async Task<MyResultPage<List<AdmissionItemCartableGetPage>>> GetCartable(NewGetPageViewModel model,
        byte roleId)
    {
        var result = new MyResultPage<List<AdmissionItemCartableGetPage>>
        {
            Data = new List<AdmissionItemCartableGetPage>()
        };

        var fromWorkDayDate = model.Form_KeyValue[9]?.ToString().ToMiladiDateTime();
        var toWorkDayDate = model.Form_KeyValue[10]?.ToString().ToMiladiDateTime();

        var parameters = new DynamicParameters();

        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id", model.Form_KeyValue[0]?.ToString() != null ? model.Form_KeyValue[0]?.ToString() : null);
        parameters.Add("AdmissionMasterId",
            model.Form_KeyValue[1]?.ToString() != null ? model.Form_KeyValue[1]?.ToString() : null);
        parameters.Add("StageId", model.Form_KeyValue[2] != null ? model.Form_KeyValue[2] : null);
        parameters.Add("WorkflowId",
            model.Form_KeyValue[3]?.ToString() != null ? model.Form_KeyValue[3]?.ToString() : null);
        parameters.Add("ContractTypeId",
            model.Form_KeyValue[4]?.ToString() != null ? model.Form_KeyValue[4]?.ToString() : null);
        parameters.Add("VendorId",
            model.Form_KeyValue[5]?.ToString() != null ? model.Form_KeyValue[5]?.ToString() : null);
        parameters.Add("PatientId",
            model.Form_KeyValue[6]?.ToString() != null ? model.Form_KeyValue[6]?.ToString() : null);
        parameters.Add("ItemId", model.Form_KeyValue[7]?.ToString() != null ? model.Form_KeyValue[7]?.ToString() : null);
        parameters.Add("BranchId",
            model.Form_KeyValue[8]?.ToString() != null ? model.Form_KeyValue[8]?.ToString() : null);
        parameters.Add("ActionId",
            model.Form_KeyValue[11]?.ToString() != null ? model.Form_KeyValue[11]?.ToString() : null);
        parameters.Add("RoleId", roleId);
        parameters.Add("FromWorkDayDate", fromWorkDayDate);
        parameters.Add("ToWorkDayDate", toWorkDayDate);
        parameters.Add("IsSettled",
            model.Form_KeyValue[12]?.ToString() != null ? model.Form_KeyValue[12]?.ToString() : null);


        result.Columns = GetColumnsCartable();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionItem_Cartable]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<AdmissionItemCartableGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<int> GetWorkListCount(GetAdmissionItemSectionCartable model, byte roleId)
    {
        var parameters = new DynamicParameters();

        parameters.Add("Id", model.Id);
        parameters.Add("AdmissionMasterId", model.AdmissionMasterId);
        parameters.Add("StageId", model.StageId);
        parameters.Add("WorkflowId", model.WorkflowId);
        parameters.Add("ActionId", model.ActionId);
        parameters.Add("ContractTypeId", model.ContractTypeId);
        parameters.Add("VendorId", model.VendorId);
        parameters.Add("PatientId", model.PatientId);
        parameters.Add("ItemId", model.ItemId);
        parameters.Add("BranchId", model.BranchId);
        parameters.Add("RoleId", roleId);
        parameters.Add("FromWorkDayDate", model.FromWorkDayDate);
        parameters.Add("ToWorkDayDate", model.ToWorkDayDate);
        parameters.Add("IsSettled", model.IsSettled);
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionItemAction_WorkList_Count]";
            conn.Open();

            var result =
                await conn.ExecuteScalarAsync<int>(sQuery, parameters, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<CheckValidationUpdateActionByPriority> CheckValidationUpdateToPreviousNextAction(
        GetPriorityWorkflowStageAction model, byte roleId)
    {
        var isActionListPermision = new List<MyDropDownViewModel>();

        var result = new CheckValidationUpdateActionByPriority();

        var getStageAction = new GetStageAction
        {
            WorkflowId = model.WorkflowId,
            StageId = model.StageId,
            ActionId = model.ActionId,
            CompanyId = model.CompanyId,
            Priority = 0
        };

        var currentStageAction =
            (await _stageActionRepository.GetStageActionWithParam(getStageAction)).FirstOrDefault();

        if (currentStageAction.NotNull() && !currentStageAction.BySystem)
        {
            var currentPriority = currentStageAction.Priority;
            byte requestedPriority = 0;

            if (model.Direction == Direction.Previous)
                requestedPriority = Convert.ToByte(currentPriority - 1);
            else
                requestedPriority = Convert.ToByte(currentPriority + 1);

            if (requestedPriority == 0)
                return new CheckValidationUpdateActionByPriority
                {
                    ActionList = null,
                    Status = -100,
                    Successfull = false,
                    StatusMessage = "گام درخواستی وجود ندارد"
                };

            var getRequestedStageAction = new GetStageAction
            {
                WorkflowId = model.WorkflowId,
                StageId = model.StageId,
                ActionId = 0,
                CompanyId = model.CompanyId,
                Priority = requestedPriority
            };

            var requestedStageAction = await _stageActionRepository.GetStageActionWithParam(getRequestedStageAction);

            if (!requestedStageAction.ListHasRow())
                return new CheckValidationUpdateActionByPriority
                {
                    ActionList = null,
                    Status = -100,
                    Successfull = false,
                    StatusMessage = "گام درخواستی وجود ندارد"
                };

            var actionList = (from a in requestedStageAction
                where !a.BySystem
                select new MyDropDownViewModel
                {
                    Id = a.ActionId,
                    Name = a.ActionName
                }).ToList();

            for (var g = 0; g < actionList.Count; g++)
            {
                var hasPermission = await _roleWorklfowPermissionRepository.CheckRoleWorkflowPermission(
                    model.WorkflowId, model.BranchId, model.StageId, Convert.ToByte(actionList[g].Id), roleId);

                if (hasPermission == 1)
                {
                    var list = actionList.Where(x => x.Id == actionList[g].Id).Select(x => new MyDropDownViewModel
                    {
                        Id = actionList[g].Id,
                        Name = actionList[g].Name,
                        CompanyId = actionList[g].CompanyId
                    }).ToList();


                    isActionListPermision.Add(new MyDropDownViewModel
                    {
                        Id = list[0].Id,
                        Name = list[0].Name
                    });
                }
            }


            if (isActionListPermision != null)
                return new CheckValidationUpdateActionByPriority
                {
                    ActionList = isActionListPermision,
                    Status = 100,
                    Successfull = true,
                    StatusMessage = "گام درخواستی وجود دارد"
                };

            var stage = await _stageRepository.GetName(model.StageId);

            return new CheckValidationUpdateActionByPriority
            {
                ActionList = null,
                Status = -100,
                Successfull = false,
                StatusMessage = $"{stage}:مجوز تغییر گام ندارید "
            };
        }

        return new CheckValidationUpdateActionByPriority
        {
            ActionList = null,
            Status = -100,
            Successfull = false,
            StatusMessage = "گام درخواستی معتبر نمی باشد"
        };
    }


    public async Task<List<CheckValidationUpdateActionByPriority>> CheckBulkValidationUpdateToPreviousNextAction(
        List<GetPriorityWorkflowStageAction> list, byte roleId)
    {
        var result = new List<CheckValidationUpdateActionByPriority>();


        var isActionListPermision = new List<MyDropDownViewModel>();


        var distinctList = list.Select(x => new GetPriorityWorkflowStageAction
        {
            BranchId = x.BranchId,
            WorkflowId = x.WorkflowId,
            StageId = x.StageId,
            ActionId = x.ActionId,
            CompanyId = x.CompanyId,
            Direction = x.Direction
        }).Distinct().ToList();


        if (!distinctList.ListHasRow())
            return new List<CheckValidationUpdateActionByPriority>
            {
                new()
                {
                    WorkflowId = 0,
                    StageId = 0,
                    ActionList = null,
                    Status = -100,
                    Successfull = false,
                    StatusMessage = "گام درخواستی وجود ندارد"
                }
            };


        for (var i = 0; i < distinctList.Count(); i++)
        {
            var model = new GetPriorityWorkflowStageAction();
            model = distinctList[i];

            var getStageAction = new GetStageAction
            {
                WorkflowId = model.WorkflowId,
                StageId = model.StageId,
                ActionId = model.ActionId,
                CompanyId = model.CompanyId,
                Priority = 0
            };

            var currentStageAction =
                (await _stageActionRepository.GetStageActionWithParam(getStageAction)).FirstOrDefault();


            if (currentStageAction.NotNull() && !currentStageAction.BySystem)
            {
                var currentPriority = currentStageAction.Priority;
                byte requestedPriority = 0;

                if (model.Direction == Direction.Previous)
                    requestedPriority = Convert.ToByte(currentPriority - 1);
                else
                    requestedPriority = Convert.ToByte(currentPriority + 1);

                if (requestedPriority == 0)
                {
                    result.Add(
                        new CheckValidationUpdateActionByPriority
                        {
                            WorkflowId = currentStageAction.WorkflowId,
                            WorkflowName = currentStageAction.WorkflowName,
                            StageId = currentStageAction.StageId,
                            StageName = currentStageAction.StageName,
                            ActionList = null,
                            Status = -100,
                            Successfull = false,
                            StatusMessage = "گام درخواستی وجود ندارد"
                        }
                    );
                }
                else
                {
                    var getRequestedStageAction = new GetStageAction
                    {
                        WorkflowId = model.WorkflowId,
                        StageId = model.StageId,
                        ActionId = 0,
                        CompanyId = model.CompanyId,
                        Priority = requestedPriority
                    };

                    var requestedStageAction =
                        await _stageActionRepository.GetStageActionWithParam(getRequestedStageAction);


                    if (!requestedStageAction.ListHasRow())
                    {
                        result.Add(
                            new CheckValidationUpdateActionByPriority
                            {
                                WorkflowId = model.WorkflowId,
                                WorkflowName = currentStageAction.WorkflowName,
                                StageId = model.StageId,
                                StageName = currentStageAction.StageName,
                                ActionList = null,
                                Status = -100,
                                Successfull = false,
                                StatusMessage = "گام درخواستی وجود ندارد"
                            }
                        );
                    }
                    else
                    {
                        var actionList = (from a in requestedStageAction
                            where !a.BySystem
                            select new MyDropDownViewModel
                            {
                                Id = a.ActionId,
                                Name = a.ActionName
                            }).ToList();


                        for (var k = 0; k < actionList.Count; k++)
                        {
                            var hasPermission = await _roleWorklfowPermissionRepository.CheckRoleWorkflowPermission(
                                model.WorkflowId, model.BranchId, model.StageId, Convert.ToByte(actionList[k].Id),
                                roleId);
                            if (hasPermission == 1)
                                isActionListPermision.Add(new MyDropDownViewModel
                                {
                                    Id = actionList[k].Id,
                                    Name = actionList[k].Name
                                });
                        }


                        result.Add(new CheckValidationUpdateActionByPriority
                        {
                            WorkflowId = model.WorkflowId,
                            WorkflowName = currentStageAction.WorkflowName,
                            BranchId = model.BranchId,
                            StageId = model.StageId,
                            StageName = currentStageAction.StageName,
                            ActionList = actionList,
                            Status = 100,
                            Successfull = true,
                            StatusMessage = "گام درخواستی وجود دارد"
                        });
                    }

                    if (result.ToList() == null)
                    {
                        var stage = await _stageRepository.GetName(model.StageId);

                        result.Add(new CheckValidationUpdateActionByPriority
                        {
                            WorkflowId = model.WorkflowId,
                            WorkflowName = currentStageAction.WorkflowName,
                            StageId = model.StageId,
                            StageName = currentStageAction.StageName,
                            ActionList = isActionListPermision.Count == 0 ? null : isActionListPermision,
                            Status = -100,
                            Successfull = false,
                            StatusMessage = $"{stage} مجوز تغییر گام ندارید "
                        });
                    }
                }
            }
            else
            {
                result.Add(
                    new CheckValidationUpdateActionByPriority
                    {
                        WorkflowId = model.WorkflowId,
                        WorkflowName = currentStageAction.WorkflowName,
                        StageId = model.StageId,
                        StageName = currentStageAction.StageName,
                        ActionList = null,
                        Status = -100,
                        Successfull = false,
                        StatusMessage = "گام جاری معتبر نمی باشد"
                    }
                );
            }
        }

        return result;
    }
}