using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.Admission;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionCash;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionMaster;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces.MC;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionMaster;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.RoleWorkflowPermission;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.Stage;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageActionLog;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionMaster;

public class AdmissionMasterRepository(
    IConfiguration config,
    StageActionRepository stageActionRepository,
    StageActionLogRepository stageActionLogRepository,
    RoleWorklfowPermissionRepository roleWorklfowPermissionRepository,
    StageRepository stageRepository,
    ILoginRepository loginRepository
   
    )
    :
        BaseRepository<AdmissionMasterModel, int, string>(config),
        IBaseRepository<AdmissionMasterModel, int, string>, IAdmissionMasterRepository
{

    public new GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه ", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 8
                },
                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/WorkflowApi/getdropdown/null/14/26", Width = 15
                },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageApi/getdropdown/14/26/2/2", Width = 15
                },
                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2ajax",
                    FilterTypeApi = "/api/MC/PatientApi/filter", Width = 13
                },
                new()
                {
                    Id = "patientNationalCode", Title = "نمبر تذکره مراجعه کننده", Type = (int)SqlDbType.NVarChar,
                    Size = 50, IsDtParameter = true, IsFilterParameter = true, FilterType = "select2ajax",
                    FilterTypeApi = "/api/MC/PatientApi/filter/3", Width = 13
                },
                new() { Id = "stageId", IsPrimary = true },
                new() { Id = "admissionMasterWorkflowCategoryId", IsPrimary = true },
                new() { Id = "branchId", IsPrimary = true },
                new() { Id = "workflowId", IsPrimary = true },
                new() { Id = "actionId", IsPrimary = true },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.VarChar, Size = 20,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "doublepersiandate", Width = 12
                },
                new()
                {
                    Id = "user", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 12, FilterType = "select2",
                    FilterTypeApi = "api/GN/UserApi/getdropdown/2/false"
                },

                new()
                {
                    Id = "masterAmount", Title = "مبلغ پرونده", Type = (int)SqlDbType.Money, Size = 10,
                    IsPersian = true, IsCommaSep = true, IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "cashAmount", Title = "مبلغ صندوق", Type = (int)SqlDbType.Money, Size = 10, IsPersian = true,
                    IsCommaSep = true, IsDtParameter = true, Width = 10
                },

                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageActionApi/getdropdown/14/2/26", Width = 112
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 9 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "display", Title = "نمایش", ClassName = "btn green_outline_1", IconName = "far fa-file-alt"
                },
                new()
                {
                    Name = "admissionMasterBillPatientPrint", Title = "چاپ", ClassName = "btn blue_1",
                    IconName = "fa fa-print"
                },
                new() { Name = "editMaster", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "sep1", Title = "", ClassName = "", IconName = "", IsSeparator = true },
                new()
                {
                    Name = "admissionActionList", Title = "گام ها", ClassName = "", IconName = "fas fa-cash-register"
                }
            }
        };

        return list;
    }

    public async Task<MyResultPage<List<AdmissionMasterGetPage>>> GetPage(NewGetPageViewModel model, int userId)
    {
        var result = new MyResultPage<List<AdmissionMasterGetPage>>
        {
            Data = new List<AdmissionMasterGetPage>()
        };

        var fromDateMiladi = (DateTime?)null;
        var toDateMiladi = (DateTime?)null;
        int? patientId = null;

        if (model.Filters.Any(x => x.Name == "createDateTimePersian"))
        {
            fromDateMiladi = model.Filters.FirstOrDefault(x => x.Name == "createDateTimePersian").Value.Split('-')[0]
                .ToMiladiDateTime();
            toDateMiladi = model.Filters.FirstOrDefault(x => x.Name == "createDateTimePersian").Value.Split('-')[1]
                .ToMiladiDateTime();
        }


        if (model.Filters.Any(x => x.Name == "patient"))
            patientId = int.Parse(model.Filters.FirstOrDefault(x => x.Name == "patient").Value);
        if (model.Filters.Any(x => x.Name == "patientNationalCode"))
            if (patientId == null)
                patientId = int.Parse(model.Filters.FirstOrDefault(x => x.Name == "patientNationalCode").Value);


        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("BranchId",
            model.Filters.Any(x => x.Name == "branch")
                ? model.Filters.FirstOrDefault(x => x.Name == "branch").Value
                : null);
        parameters.Add("PatientId", patientId);

        parameters.Add("FromCreateDateTime", fromDateMiladi);
        parameters.Add("ToCreateDateTime", toDateMiladi);
        parameters.Add("ActionId",
            model.Filters.Any(x => x.Name == "actionIdName")
                ? model.Filters.FirstOrDefault(x => x.Name == "actionIdName").Value
                : null);
        parameters.Add("StageId",
            model.Filters.Any(x => x.Name == "stage")
                ? model.Filters.FirstOrDefault(x => x.Name == "stage").Value
                : null);
        parameters.Add("WorkflowId",
            model.Filters.Any(x => x.Name == "workflow")
                ? model.Filters.FirstOrDefault(x => x.Name == "workflow").Value
                : null);

        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "AdmissionMaster",
            OprType = "VIWALL",
            UserId = userId
        };


        var checkAccessViewAll = await loginRepository.GetAuthenticate(checkAuthenticate);
        int? parameterUserId = 0;

        if (int.Parse(model.Form_KeyValue[1]?.ToString()) == 0)
        {
            if (!checkAccessViewAll.Successfull)
                parameterUserId = 0;
            else
                parameterUserId = model.Filters.Any(x => x.Name == "user")
                    ? int.Parse(model.Filters.FirstOrDefault(x => x.Name == "user").Value)
                    : null;
        }
        else
        {
            if (checkAccessViewAll.Successfull)
            {
                {
                    if (int.Parse(model.Form_KeyValue[1]?.ToString()) != 0 && model.Filters.Any(x => x.Name == "user"))
                        parameterUserId = model.Filters.Any(x => x.Name == "user")
                            ? int.Parse(model.Filters.FirstOrDefault(x => x.Name == "user").Value)
                            : null;

                    else
                        parameterUserId = int.Parse(model.Form_KeyValue[1]?.ToString());
                }
            }
            else
            {
                if (int.Parse(model.Form_KeyValue[1]?.ToString()) != 0 && model.Filters.Any(x => x.Name == "user"))
                    parameterUserId = 0;

                else
                    parameterUserId = int.Parse(model.Form_KeyValue[1]?.ToString());
            }
        }

        parameters.Add("CreateUserId", parameterUserId);


        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "mc.[Spc_AdmissionMaster_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<AdmissionMasterGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<List<AdmissionMasterGetAdmission>> GetMasterAdmissions(int admissionMasterId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionMaster_GetAdmissions]";
            conn.Open();

            var result = await conn.QueryAsync<AdmissionMasterGetAdmission>(sQuery, new
            {
                AdmissionMasterId = admissionMasterId
            }, commandType: CommandType.StoredProcedure);

            conn.Close();


            result = result.AsList().OrderByDescending(a => a.CreateDateTime);

            return result.AsList();
        }
    }

    public async Task<string> ValidateCheckAdmissionMasterPermission(AdmissionCheckPermissionViewModel model)
    {
        var error = "";

        if (model == null)
        {
            error = "درخواست معتبر نمی باشد";
            return error;
        }

        await Task.Run(async () =>
        {
            #region

            byte actionId = 0;

            if (model.Id == 0)
            {
                var getAction = new GetAction();
                var stageAction = new ActionModel();
                getAction.CompanyId = model.CompanyId;
                getAction.StageId = model.StageId;
                getAction.WorkflowId = model.WorkflowId;
                getAction.Priority = 1;
                stageAction = await stageActionRepository.GetAction(getAction);
                actionId = stageAction.ActionId;
            }
            else
            {
                actionId = model.ActionId;
            }

            var permission = await roleWorklfowPermissionRepository.CheckRoleWorkflowPermission(model.WorkflowId,
                model.BranchId, model.StageId, actionId, model.RoleId);

            if (permission != 1)
            {
                var stage = await stageRepository.GetName(model.StageId);
                error = $" {stage} دسترسی ندارید ";
            }

            #endregion
        });

        return error;
    }

    public async Task<AdmissionResultQuery> Save(AdmissionMasterModel model)
    {
        var result = new AdmissionResultQuery();
        result.ValidationErrors = new List<string>();
        var getAction = new GetAction();

        getAction.CompanyId = model.CompanyId;
        getAction.StageId = model.StageId;
        getAction.WorkflowId = model.WorkflowId;
        getAction.Priority = 1;
        var stageAction = await stageActionRepository.GetAction(getAction);

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionMaster_InsUpd]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<AdmissionResultQuery>(sQuery, new
            {
                model.Id,
                AdmissionPatientJSON = JsonConvert.SerializeObject(model.AdmissionPatientJSON),
                model.BranchId,
                model.WorkflowId,
                model.StageId,
                model.CreateDateTime,
                model.CreateUserId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;

        if (result.Successfull)
        {
            if (model.Id == 0)
            {
                var updateStepModel = new UpdateAction
                {
                    RequestActionId = stageAction.ActionId,
                    WorkflowCategoryId = stageAction.WorkflowCategoryId,
                    IdentityId = result.Id,
                    StageId = model.StageId,
                    WorkflowId = model.WorkflowId,
                    CompanyId = model.CompanyId,
                    UserId = model.CreateUserId
                };


                await stageActionLogRepository.StageActionLogInsert(updateStepModel);

                 await UpdateLastActionMaster(result.Id, stageAction.ActionId);
            }
        }
        else
        {
            result.ValidationErrors = new List<string>
            {
                result.StatusMessage
            };
        }

        return result;
    }

    public async Task<MyResultStatus> UpdateLastActionMaster(int id, byte lastActionId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_UpdItem_Number]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                TableName = "mc.AdmissionMaster",
                ColumnName = "ActionId",
                Value = lastActionId,
                Filter = $"Id={id}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = result.Status == 100;

            return result;
        }
    }

    public async Task<List<AdmissionCashByAdmissionMaster>> GetAdmissionCashByMaster(int admissionMasterId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionCash_ByAdmissionMaster]";
            conn.Open();

            var result = await conn.QueryAsync<AdmissionCashByAdmissionMaster>(sQuery, new
            {
                AdmissionMasterId = admissionMasterId
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
            return result.AsList();
        }
    }

    public async Task<MyResultStatus> UpdateAdmissionMasterAmount(int admissionMasterId, bool output)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionMasterAmount_Upd]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                id = admissionMasterId,
                Output = output
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = result.Status == 100;

            return result;
        }
    }

    public async Task<decimal> GetAdmissionMasterBalance(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionCash_CheckBalance]";

            conn.Open();

            var result = await conn.ExecuteScalarAsync<decimal>(sQuery, new
            {
                AdmissionMasterId = id
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<byte> GetAdmissionMasterActionId(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";

            conn.Open();

            var result = await conn.ExecuteScalarAsync<byte>(sQuery, new
            {
                TableName = "mc.AdmissionMaster",
                ColumnName = "ActionId",
                Filter = $"Id={id}",
                OrderBy = ""
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<AdmissionMasterPayAmount> GetAdmissionMasterAmounts(int admissionMasterId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionMaster_Amounts]";

            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<AdmissionMasterPayAmount>(sQuery, new
            {
                AdmissionMasterId = admissionMasterId
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<byte> GetActionIdByIdentityId(int admissionMasterId)
    {
        using (var conn = Connection)
        {
            byte result = 0;
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            result = await conn.QueryFirstOrDefaultAsync<byte>(sQuery, new
            {
                TableName = "mc.AdmissionMaster",
                ColumnName = "actionid",
                Filter = $"Id={admissionMasterId}",
                OrderBy = ""
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<List<string>> ValidationActionLogAdmissionMaster(UpdateAction model, byte roleId)
    {
        var errors = new List<string>();

        if (model == null)
        {
            errors.Add("درخواست معتبر نمی باشد");
            return errors;
        }

        await Task.Run(async () =>
        {
            #region بررسی دسترسی گام

            var admissionPermissionModel = new AdmissionCheckPermissionViewModel
            {
                Id = model.IdentityId,
                RoleId = roleId,
                BranchId = model.BranchId,
                WorkflowId = model.WorkflowId,
                StageId = model.StageId,
                ActionId = model.RequestActionId,
                CompanyId = model.CompanyId
            };
            var validateAdmissionResult = await ValidateCheckAdmissionPermission(admissionPermissionModel);
            if (validateAdmissionResult != "")
                errors.Add("مجوز تغییر گام ندارید");

            #endregion

            var action = new GetAction();

            //قبلی Action  مقدار 
            action.StageId = model.StageId;
            action.ActionId = model.RequestActionId;
            action.WorkflowId = model.WorkflowId;
            var requestStageAction = await stageActionRepository.GetAction(action);

            var currentActionId = await GetActionIdByIdentityId(model.IdentityId);
            action.StageId = model.StageId;
            action.ActionId = currentActionId;
            action.WorkflowId = model.WorkflowId;
            var currentStageAction = await stageActionRepository.GetAction(action);
            var expectedPriority = 0;

            if (requestStageAction != null)
            {
                //Action مقایسه دو 
                if (currentStageAction.Priority < requestStageAction.Priority)
                    expectedPriority = currentStageAction.Priority + 1;
                else if (currentStageAction.Priority > requestStageAction.Priority)
                    expectedPriority = currentStageAction.Priority - 1;

                if (expectedPriority != 0 && expectedPriority != requestStageAction.Priority)
                    errors.Add("گام درخواست شده معتبر نمی باشد");
            }

            if (currentStageAction.MedicalRevenue == 1 && requestStageAction.MedicalRevenue == 3)
            {
                var checkRequestMedicalRevenue = await CheckValidation(model.IdentityId, true);

                if (checkRequestMedicalRevenue)
                    errors.Add("برخی از درخواست های پرونده انتخابی تسویه نشده است ، مجاز به تغییر گام نمی باشید");

                if (!requestStageAction.AdmissionMasterSettlement)
                {
                    var remainAmount = await GetAdmissionMasterBalance(model.IdentityId);

                    if (remainAmount != 0) errors.Add("پرونده دارای مانده می باشد ، مجاز به تغییر گام نمی باشید");
                }
            }
        });

        return errors;
    }

    public async Task<string> ValidateCheckAdmissionPermission(AdmissionCheckPermissionViewModel model)
    {
        var error = "";

        if (model == null)
        {
            error = "درخواست معتبر نمی باشد";
            return error;
        }

        await Task.Run(async () =>
        {
            #region

            byte actionId = 0;

            if (model.Id == 0)
            {
                var getAction = new GetAction();
                var stageAction = new ActionModel();
                getAction.CompanyId = model.CompanyId;
                getAction.StageId = model.StageId;
                getAction.WorkflowId = model.WorkflowId;
                getAction.Priority = 1;
                stageAction = await stageActionRepository.GetAction(getAction);
                actionId = stageAction.ActionId;
            }
            else
            {
                actionId = model.ActionId;
            }

            var permission = await roleWorklfowPermissionRepository.CheckRoleWorkflowPermission(model.WorkflowId,
                model.BranchId, model.StageId, actionId, model.RoleId);

            if (permission != 1)
            {
                var stage = await stageRepository.GetName(model.StageId);
                error = $"{stage} دسترسی ندارید ";
            }

            #endregion
        });

        return error;
    }

    public async Task<ActionModel> GetAdmissionMasterStageAction(int admissionMasterId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionMaster_StageAction]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<ActionModel>(sQuery, new
            {
                AdmissionMasterId = admissionMasterId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<List<string>> AdmissionMasterCashValidation(int admissionMasterId, decimal newCashAmount)
    {
        var errors = new List<string>();

        var admissionMasterStageAction = await GetAdmissionMasterStageAction(admissionMasterId);

        if (admissionMasterStageAction.MedicalRevenue == 3)
            if (!admissionMasterStageAction.AdmissionMasterSettlement)
            {
                var remainAmount = await GetAdmissionMasterBalance(admissionMasterId);

                if (newCashAmount < 0)
                    remainAmount += Math.Abs(newCashAmount);
                else
                    remainAmount -= newCashAmount;

                if (remainAmount != 0) errors.Add("پرونده دارای مانده می باشد ، مجاز به ثبت نمی باشید");
            }

        return errors;
    }

    private async Task<bool> CheckValidation(int? id, bool isMaster)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionMaster_GetSettlement]";
            conn.Open();
            var result = await conn.QueryAsync<AdmissionCashDetailInfo>(sQuery, new
            {
                Id = id
            }, commandType: CommandType.StoredProcedure);

            conn.Close();


            if (isMaster && result.Any(x => x.Type != 1 && x.MedicalRevenue == 1)) return true;

            return result.Any(x =>
                x.AdmissionMasterSettlement == 0 && x.MedicalRevenue != 1 &&
                (x.WorkflowCategoryId == 14 || x.WorkflowCategoryId == 10));
        }
    }

}