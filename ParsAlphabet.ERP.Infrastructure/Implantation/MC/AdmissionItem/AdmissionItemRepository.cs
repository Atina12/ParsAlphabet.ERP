using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.Admission;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionCounter;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionItem;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionMaster;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionCounter;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionMaster;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.RoleWorkflowPermission;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionMaster;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.Stage;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageActionLog;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionItem;

public class AdmissionItemRepository :
    BaseRepository<AdmissionItemModel, long, string>,
    IBaseRepository<AdmissionItemModel, long, string>
{
    private readonly IHttpContextAccessor _accessor;

    private readonly IAdmissionCounterRepository _admissionCashierRepository;
    private readonly IAdmissionMasterRepository _admissionMasterRepository;
    private readonly ILoginRepository _loginRepository;
    private readonly RoleWorklfowPermissionRepository _roleWorklfowPermissionRepository;
    private readonly StageActionLogRepository _stageActionLogRepository;
    private readonly StageActionRepository _stageActionRepository;
    private readonly StageRepository _stageRepository;


    public AdmissionItemRepository(
        IConfiguration config,
        IHttpContextAccessor accessor,
        IAdmissionCounterRepository admissionCashierRepository,
        StageActionLogRepository stageActionLogRepository,
        StageActionRepository stageActionRepository,
        IAdmissionMasterRepository admissionMasterRepository,
        RoleWorklfowPermissionRepository roleWorklfowPermissionRepository,
        StageRepository stageRepository,
        ILoginRepository loginRepository) : base(config)
    {
        _accessor = accessor;
        _admissionCashierRepository = admissionCashierRepository;
        _stageActionLogRepository = stageActionLogRepository;
        _stageActionRepository = stageActionRepository;
        _admissionMasterRepository = admissionMasterRepository;
        _roleWorklfowPermissionRepository = roleWorklfowPermissionRepository;
        _stageRepository = stageRepository;
        _loginRepository = loginRepository;
    }


    public new GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "conflict", FieldValue = "true", Operator = "==" } },
            AnswerCondition = "color:#da1717",
            FixedColumn = true,
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه ", Type = (int)SqlDbType.Int, IsPrimary = true, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 8
                },
                new()
                {
                    Id = "admissionMasterId", Title = "پرونده", Type = (int)SqlDbType.Int, IsPrimary = true,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "number", Width = 8
                },
                new() { Id = "admissionMasterWorkflowCategoryId", IsPrimary = true },
                new() { Id = "stageId", IsPrimary = true },
                new() { Id = "branchId", IsPrimary = true },
                new() { Id = "workflowId", IsPrimary = true },
                new() { Id = "actionId", IsPrimary = true },
                new() { Id = "medicalRevenue", IsPrimary = true },

                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/WorkflowApi/getdropdown/0/10/19", Width = 15
                },

                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true,
                    FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageApi/getstagedropdownbyworkflowid/null/null/10/19,30/2/2", Width = 15
                },

                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 10
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
                new()
                {
                    Id = "sumQty", Title = "تعداد", Type = (int)SqlDbType.Int, Size = 0, IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "netAmount", Title = " مبلغ سفارش کالا", Type = (int)SqlDbType.Money, Size = 00,
                    IsCommaSep = true, IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "cashAmount", Title = "مبلغ صندوق", Type = (int)SqlDbType.Money, Size = 00, IsCommaSep = true,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.VarChar, Size = 20,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "doublepersiandate", Width = 12
                },
                new()
                {
                    Id = "user", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 12, FilterType = "select2",
                    FilterTypeApi = "api/GN/UserApi/getdropdown/2/false/false"
                },
                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageActionApi/getdropdown/10/2/19", Width = 12
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 9 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "display", Title = "نمایش", ClassName = "btn green_outline_1", IconName = "far fa-file-alt"
                },
                new() { Name = "print", Title = "چاپ", ClassName = "btn gray_outline", IconName = "fa fa-print" },
                new()
                {
                    Name = "editAdmItem", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green",
                    Condition = new List<ConditionPageTable>
                    {
                        new() { FieldName = "medicalRevenue", FieldValue = "2", Operator = "!==" }
                    }
                },
                new() { Name = "sep1", Title = "", ClassName = "", IconName = "", IsSeparator = true },
                new()
                {
                    Name = "showStepLogsAdmissionItem", Title = "گام ها", ClassName = "",
                    IconName = "fas fa-history color-green"
                }
            }
        };

        return list;
    }

    public async Task<MyResultPage<List<AdmissionItemGetPage>>> GetPage(NewGetPageViewModel model, int userId,
        byte roleId)
    {
        var result = new MyResultPage<List<AdmissionItemGetPage>>
        {
            Data = new List<AdmissionItemGetPage>()
        };

        var fromCreateDateMiladi = (DateTime?)null;
        var toCreateDateMiladi = (DateTime?)null;
        string patientId = null;

        if (model.Filters.Any(x => x.Name == "createDateTimePersian"))
        {
            fromCreateDateMiladi =
                model.Filters.FirstOrDefault(x => x.Name == "createDateTimePersian").Value.Split('-')[0]
                    .ToMiladiDateTime();
            toCreateDateMiladi =
                model.Filters.FirstOrDefault(x => x.Name == "createDateTimePersian").Value.Split('-')[1]
                    .ToMiladiDateTime();
        }

        if (model.Filters.Any(x => x.Name == "patient"))
            patientId = model.Filters.FirstOrDefault(x => x.Name == "patient").Value.ToString();
        if (model.Filters.Any(x => x.Name == "patientNationalCode"))
            if (patientId == null)
                patientId = model.Filters.FirstOrDefault(x => x.Name == "patientNationalCode").Value.ToString();

        result.Columns = GetColumns();

        var parameters = new DynamicParameters();

        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("AdmissionMasterId",
            model.Filters.Any(x => x.Name == "admissionMasterId")
                ? model.Filters.FirstOrDefault(x => x.Name == "admissionMasterId").Value
                : null);
        parameters.Add("StageId",
            model.Filters.Any(x => x.Name == "stage")
                ? model.Filters.FirstOrDefault(x => x.Name == "stage").Value
                : null);
        parameters.Add("ActionId",
            model.Filters.Any(x => x.Name == "actionIdName")
                ? model.Filters.FirstOrDefault(x => x.Name == "actionIdName").Value
                : null);
        parameters.Add("WorkflowId",
            model.Filters.Any(x => x.Name == "workflow")
                ? model.Filters.FirstOrDefault(x => x.Name == "workflow").Value
                : null);
        parameters.Add("PatientId", patientId);
        parameters.Add("FromCreateDate", fromCreateDateMiladi);
        parameters.Add("ToCreateDate", toCreateDateMiladi);
        parameters.Add("RoleId", roleId);
        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);

        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "AdmissionItemApi",
            OprType = "VIWALL",
            UserId = userId
        };


        var checkAccessViewAll = await _loginRepository.GetAuthenticate(checkAuthenticate);


        if (int.Parse(model.Form_KeyValue[1]?.ToString()) == 0)
        {
            if (!checkAccessViewAll.Successfull)
                parameters.Add("CreateUserId", 0);
            else
                parameters.Add("CreateUserId",
                    model.Filters.Any(x => x.Name == "user")
                        ? model.Filters.FirstOrDefault(x => x.Name == "user").Value
                        : null);
        }
        else
        {
            if (checkAccessViewAll.Successfull)
            {
                if (int.Parse(model.Form_KeyValue[1]?.ToString()) != 0 && model.Filters.Any(x => x.Name == "user"))
                    parameters.Add("CreateUserId",
                        model.Filters.Any(x => x.Name == "user")
                            ? model.Filters.FirstOrDefault(x => x.Name == "user").Value
                            : null);

                else
                    parameters.Add("CreateUserId", int.Parse(model.Form_KeyValue[1]?.ToString()));
            }
            else
            {
                if (int.Parse(model.Form_KeyValue[1]?.ToString()) != 0 && model.Filters.Any(x => x.Name == "user"))
                    if (model.Filters.FirstOrDefault(x => x.Name == "user").Value == userId.ToString())
                        parameters.Add("CreateUserId", model.Filters.FirstOrDefault(x => x.Name == "user").Value);
                    else
                        parameters.Add("CreateUserId", 0);

                else
                    parameters.Add("CreateUserId", int.Parse(model.Form_KeyValue[1]?.ToString()));
            }
        }

        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_AdmissionSale_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<AdmissionItemGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }


        return result;
    }

    public async Task<AdmissionItemDisplay> Display(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_AdmissionSales_Display";
            conn.Open();

            var result = await conn.QuerySingleOrDefaultAsync<AdmissionItemDisplay>(sQuery, new
            {
                id
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<MyResultDataQuery<AdmissionResultQuery>> Insert(AdmissionItemModel model)
    {
        var result = new MyResultDataQuery<AdmissionResultQuery>
        {
            Data = new AdmissionResultQuery()
        };

        var validateResult = await Validate(model, OperationType.Insert);

        if (validateResult.Count > 0)
        {
            result.Successfull = false;
            result.ValidationErrors = validateResult;
            return result;
        }

        if (model.AdmissionPatientJSON.NotNull())
        {
            model.AdmissionPatientJSON.FirstName =
                model.AdmissionPatientJSON.FirstName.ConvertArabicAlphabet().RemoveDigits();
            model.AdmissionPatientJSON.LastName =
                model.AdmissionPatientJSON.LastName.ConvertArabicAlphabet().RemoveDigits();
            model.AdmissionPatientJSON.FatherFirstName =
                model.AdmissionPatientJSON.FatherFirstName.ConvertArabicAlphabet().RemoveDigits();
        }

        var masterModel = new AdmissionMasterModel();

        masterModel.Id = model.AdmissionMasterId;
        masterModel.AdmissionPatientJSON = model.AdmissionPatientJSON;
        masterModel.WorkflowId = model.AdmissionMasterWorkflowId;
        masterModel.StageId = model.AdmissionMasterStageId;
        masterModel.BranchId = model.BranchId;
        masterModel.CreateUserId = model.UserId;
        masterModel.CreateDateTime = model.CreateDateTime;

        var saveMasterResult = await _admissionMasterRepository.Save(masterModel);

        if (saveMasterResult.Successfull)
        {
            model.AdmissionMasterId = saveMasterResult.Id;
            model.PatientId = saveMasterResult.PatientId;
        }
        else
        {
            result = new MyResultDataQuery<AdmissionResultQuery>
            {
                Data = new AdmissionResultQuery { Id = 0, AdmissionMasterId = 0, Successfull = false, Status = -100 },
                ValidationErrors = saveMasterResult.ValidationErrors,
                Successfull = false
            };
            return result;
        }

        var getAction = new GetAction();
        var stageAction = new ActionModel();

        if (model.Id == 0)
        {
            getAction.CompanyId = model.CompanyId;
            getAction.StageId = model.StageId;
            getAction.WorkflowId = model.WorkflowId;
            getAction.Priority = 1;
            stageAction = await _stageActionRepository.GetAction(getAction);
        }

        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_AdmissionSales_InsUpd";
            conn.Open();

            result.Data = await conn.QueryFirstAsync<AdmissionResultQuery>(sQuery, new
            {
                model.Id,
                model.AdmissionMasterId,
                model.PatientId,
                model.CreateDateTime,
                model.UserId,
                model.BranchId,
                model.StageId,
                model.WorkflowId,
                model.MedicalSubjectId,
                model.BasicInsurerId,
                model.BasicInsurerLineId,
                model.CompInsurerId,
                model.CompInsurerLineId,
                model.ThirdPartyInsurerId,
                model.DiscountInsurerId,
                model.ReferralTypeId,

                AdmissionSaleLineList = JsonConvert.SerializeObject(model.AdmissionItemLineList),
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Data.DateTime = model.CreateDateTime;
            result.Message = result.Data.StatusMessage;

            result.Data.AdmissionMasterId = model.AdmissionMasterId;


            result.Successfull = result.Data.Status == 100;

            if (!result.Successfull)
            {
                result.ValidationErrors.Add(result.Message);
            }
            else
            {
                if (model.Id == 0)
                {
                    var updateStepMOdel = new UpdateAction
                    {
                        RequestActionId = stageAction.ActionId,
                        CompanyId = model.CompanyId,
                        IdentityId = result.Data.Id,
                        StageId = model.StageId,
                        UserId = model.UserId,
                        WorkflowCategoryId = stageAction.WorkflowCategoryId,
                        WorkflowId = model.WorkflowId
                    };

                    var resultStep = await UpdateStep(updateStepMOdel);
                    var updateResult =
                        await UpdateLastAction(model.AdmissionMasterId, result.Data.Id, stageAction.ActionId);
                }
            }
        }


        return result;
    }

    public async Task<MyResultStatus> UpdateStep(UpdateAction model)
    {
        var validateResult = new List<string>();

        var result = new MyResultStatus();
        result = await _stageActionLogRepository.StageActionLogInsert(model);
        result.ValidationErrors.Add(result.StatusMessage);

        return result;
    }

    public async Task<MyResultStatus> UpdateLastAction(int admissionMasterId, int id, byte lastActionId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_UpdItem_Number]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                TableName = "mc.AdmissionSale",
                ColumnName = "ActionId",
                Value = lastActionId,
                Filter = $"Id={id}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = result.Status == 100;


            if (result.Successfull)
            {
                var updateAmount =
                    await _admissionMasterRepository.UpdateAdmissionMasterAmount(admissionMasterId, true);
            }

            return result;
        }
    }

    public async Task<MyResultQuery> Delete(int keyvalue, int CompanyId)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecord";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                TableName = "mc.AdmissionMaster",
                RecordId = keyvalue,
                CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<CalculateItemPrice> CalculateItemPrice(GetCalculateItemPrice model)
    {
        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_AdmissionSales_CalPrice";

            conn.Open();

            var resultCal = await conn.QueryFirstOrDefaultAsync<CalculateItemPrice>(sQuery, new
            {
                model.ItemId,
                model.Qty,
                model.Price,
                model.BasicInsurerLineId,
                model.CompInsurerLineId,
                model.ThirdPartyId,
                model.DiscountInsurerId,
                model.MedicalSubjectId,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return resultCal;
        }
    }


    public async Task<IEnumerable<MyDropDownViewModel>> GetAdmissionSaleItem(GetAdmissionSaleItem model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionSaleLine_VendorItem]";

            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery, new
            {
                VendorId = model.VendorId > 0 ? model.VendorId : null,
                model.FromWorkDayDate,
                model.ToWorkDayDate
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<List<string>> Validate(AdmissionItemModel model, OperationType operationType)
    {
        var error = new List<string>();
        MyClaim.Init(_accessor);
        MyResultPage<AdmissionCounterGetRecord> cashierRepository =
            await _admissionCashierRepository.GetRecordByUserId(model.UserId, model.CompanyId);
        var cashier = cashierRepository.Data;

        await Task.Run(() =>
        {
            //  Price Required
            if (model.AdmissionItemLineList != null)
            {
                if (model.AdmissionItemLineList.Count > 0)
                {
                    var priceErrorList = model.AdmissionItemLineList.Where(c => c.BasicItemPrice == 0)
                        .Select(x => new { ErrorMessage = "کالا با شناسه " + x.ItemId + " نرخ ندارد" }).ToList();

                    foreach (var item in priceErrorList) error.Add(item.ErrorMessage);
                }
                else
                {
                    error.Add("برای مرجوع لطفا کالا را انتخاب نمایید");
                }
            }
            else
            {
                error.Add("برای مرجوع سفارش لطفا کالا را انتخاب نمایید");
            }

            //Discount Validate

            var netPrice = model.AdmissionItemLineList.Where(c => c.DiscountAmount > c.NetAmount).Select(x => x.ItemId)
                .ToList();

            if (netPrice.Count > 0) error.Add("تخفیف نمیتواند از قابل دریافت بیشتر باشد");
        });
        return error;
    }

    public async Task<byte> GetActionIdByIdentityId(int identityId)
    {
        using (var conn = Connection)
        {
            byte result = 0;
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            result = await conn.QueryFirstOrDefaultAsync<byte>(sQuery, new
            {
                TableName = "mc.AdmissionSale",
                ColumnName = "ActionId",
                Filter = $"Id={identityId}",
                OrderBy = ""
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<DateTime> GetCreateDate(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<DateTime>(sQuery,
                new
                {
                    TableName = "mc.AdmissionMaster",
                    ColumnName = "Cast(CreateDateTime AS DATE) CreateDate",
                    Filter = $"Id={id}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<short> GetBranchId(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<short>(sQuery,
                new
                {
                    TableName = "mc.AdmissionMaster",
                    ColumnName = "BranchId",
                    Filter = $"Id={id}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<List<AdmissionItemPrint>> GetAdmissionItemPrint(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionSales_Print]";
            conn.Open();
            var result = await conn.QueryAsync<AdmissionItemPrint>(sQuery,
                new
                {
                    Id = id,
                    CompanyId = companyId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result.ToList();
        }
    }

    public async Task<decimal> GetAdmissionAmount(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<decimal>(sQuery,
                new
                {
                    TableName = "mc.AdmissionSale",
                    ColumnName = "AdmissionAmount",
                    Filter = $"Id={id} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<List<string>> ValidationActionLogAdmissionItem(UpdateAction model, byte roleId,
        int admissionMasterId)
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

            var admissionItemModel = new AdmissionCheckPermissionViewModel
            {
                Id = model.IdentityId,
                RoleId = roleId,
                BranchId = model.BranchId,
                WorkflowId = model.WorkflowId,
                StageId = model.StageId,
                ActionId = model.RequestActionId,
                CompanyId = model.CompanyId
            };

            var validateAdmissionItemResult = await ValidateCheckAdmissionItemPermission(admissionItemModel);
            if (validateAdmissionItemResult != "")
                errors.Add("مجوز تغییر گام ندارید");

            #endregion


            var action = new GetAction();

            //قبلی Action  مقدار 
            action.StageId = model.StageId;
            action.ActionId = model.RequestActionId;
            action.WorkflowId = model.WorkflowId;
            var requestStageAction = await _stageActionRepository.GetAction(action);

            var currentActionId = await GetActionIdByIdentityId(model.IdentityId);
            action.StageId = model.StageId;
            action.ActionId = currentActionId;
            action.WorkflowId = model.WorkflowId;
            var currentStageAction = await _stageActionRepository.GetAction(action);
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

            if ((currentStageAction.MedicalRevenue == 2 && requestStageAction.MedicalRevenue == 3) ||
                (currentStageAction.MedicalRevenue == 3 && requestStageAction.MedicalRevenue == 2))
                errors.Add("امکان تغییر گام وجود ندارد");

            if (currentStageAction.MedicalRevenue == 1 && requestStageAction.MedicalRevenue == 3)
                if (!requestStageAction.AdmissionMasterSettlement)
                {
                    var admissionAmount = await GetAdmissionAmount(model.IdentityId, model.CompanyId);

                    var admissionMasterAmountModel =
                        await _admissionMasterRepository.GetAdmissionMasterAmounts(admissionMasterId);

                    //خالص درآمد
                    var netRevenueAmount = admissionAmount + admissionMasterAmountModel.Revenue3Amount -
                                           admissionMasterAmountModel.Revenue2Amount;

                    //جمع دریافت و پرداخت
                    var cashAmount = admissionMasterAmountModel.CashAmount;


                    var resultDifferenceRevenueCash = netRevenueAmount - cashAmount;


                    // cashAmount>=netRevenueAmount
                    if (resultDifferenceRevenueCash != 0)
                        errors.Add(
                            " امکان تغییر گام وجود ندارد .خالص قابل دریافت پرونده از جمع دریافت و پرداخت بزرگتر می باشد");
                }
        });

        return errors;
    }

    public async Task<string> ValidateCheckAdmissionItemPermission(AdmissionCheckPermissionViewModel model)
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
                stageAction = await _stageActionRepository.GetAction(getAction);
                actionId = stageAction.ActionId;
            }
            else
            {
                actionId = model.ActionId;
            }

            var permission = await _roleWorklfowPermissionRepository.CheckRoleWorkflowPermission(model.WorkflowId,
                model.BranchId, model.StageId, actionId, model.RoleId);

            if (permission != 1)
            {
                var stage = await _stageRepository.GetName(model.StageId);
                error = $"{stage} دسترسی ندارید ";
            }

            #endregion
        });

        return error;
    }

    public async Task<List<string>> ValidationDeleteAdmissionService(UpdateAction model, int admissionMasterId,
        byte roleId, short branchId)
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
                BranchId = branchId,
                WorkflowId = model.WorkflowId,
                StageId = model.StageId,
                ActionId = model.RequestActionId,
                CompanyId = model.CompanyId
            };
            var validateAdmissionResult = await ValidateCheckAdmissionItemPermission(admissionPermissionModel);
            if (validateAdmissionResult != "")
                errors.Add(validateAdmissionResult);

            #endregion


            var action = new GetAction();

            var currentActionId = await GetActionIdByIdentityId(model.IdentityId);
            action.StageId = model.StageId;
            action.ActionId = currentActionId;
            action.WorkflowId = model.WorkflowId;
            var currentStageAction = await _stageActionRepository.GetAction(action);

            if (currentStageAction.IsDeleteHeader && currentStageAction.MedicalRevenue != 3)
            {
                var admissionAmount = await GetAdmissionAmount(model.IdentityId, model.CompanyId);
                var admissionMasterAmountModel =
                    await _admissionMasterRepository.GetAdmissionMasterAmounts(admissionMasterId);

                if (admissionAmount != 0 && admissionMasterAmountModel.CashAmount != 0)
                    errors.Add("درخواست پذیرش دارای برگه دریافت/پرداخت می باشد مجاز به حذف نمی باشید");
            }
            else
            {
                errors.Add("مجاز به حذف برگه در مرحله و گام جاری نمی باشید");
            }
        });

        return errors;
    }

    public async Task<MyResultStatus> DeleteAdmissionItem(int admissionMasterId, int id, short branchId, byte roleId,
        int userId)
    {
        var getAction = await GetStageAction(id);


        var stageAction = new UpdateAction
        {
            IdentityId = id,
            BranchId = branchId,
            WorkflowId = getAction.WorkflowId,
            StageId = getAction.StageId,
            RequestActionId = getAction.ActionId
        };

        var validation = await ValidationDeleteAdmissionService(stageAction, admissionMasterId, roleId, branchId);


        if (validation.ListHasRow())
            return new MyResultStatus
            {
                Status = -100,
                StatusMessage = "",
                Successfull = false,
                ValidationErrors = validation
            };

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionItem_Del]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                Id = id,
                UserId = userId
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            result.Successfull = result.Status == 100;

            if (!result.Successfull)
                result.ValidationErrors = new List<string> { result.StatusMessage };

            return result;
        }
    }

    public async Task<Application.Dtos.MC.Admission.AdmissionStageAction> GetStageAction(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetTable]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<Application.Dtos.MC.Admission.AdmissionStageAction>(sQuery,
                new
                {
                    IsSecondLang = false,
                    TableName = "mc.AdmissionSale",
                    IdColumnName = "",
                    ColumnNameList = "WorkflowId,StageId,ActionId",
                    IdList = "",
                    Filter = $"Id={id}",
                    OrderBy = ""
                }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }
}