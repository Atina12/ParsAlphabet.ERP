using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.Prescription;
using ParsAlphabet.ERP.Application.Dtos.MC.PrescriptionTamin;
using ParsAlphabet.ERP.Application.Dtos.WF.StageActionOriginDestination;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces.MC;
using ParsAlphabet.ERP.Application.Interfaces.Redis;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.Stage;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageActionLog;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageActionOriginDestination;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.PrescriptionTamin;

public class PrescriptionTaminRepository :
    BaseRepository<PrescriptionTaminModel, int, string>,
    IBaseRepository<PrescriptionTaminModel, int, string>
{
    private readonly IAdmissionsRepository _admissionsRepository;
    private readonly ILoginRepository _loginRepository;
    private readonly IRedisService _redisService;
    private readonly StageActionLogRepository _stageActionLogRepository;
    private readonly StageActionOriginDestinationRepository _stageActionOriginDestinationRepository;
    private readonly StageActionRepository _stageActionRepository;
    private readonly StageRepository _stageRepository;


    public PrescriptionTaminRepository(IConfiguration config, IAdmissionsRepository admissionsRepository,
        IRedisService redisService
        , StageActionRepository stageActionRepository, StageActionLogRepository stageActionLogRepository
        , StageActionOriginDestinationRepository stageActionOriginDestinationRepository, StageRepository stageRepository
        , ILoginRepository loginRepository) : base(config)
    {
        _admissionsRepository = admissionsRepository;
        _redisService = redisService;
        _stageActionRepository = stageActionRepository;
        _stageActionLogRepository = stageActionLogRepository;
        _stageActionOriginDestinationRepository = stageActionOriginDestinationRepository;
        _stageRepository = stageRepository;
        _loginRepository = loginRepository;
    }


    public new GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "sendResultStatus", FieldValue = "0", Operator = "==" } },
            AnswerCondition = "color:#da1717",

            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه ثبت", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 5
                },

                new()
                {
                    Id = "admissionId", Title = "شناسه پذیرش", Type = (int)SqlDbType.Int, IsPrimary = true,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "number", Width = 5
                },

                new()
                {
                    Id = "admissionMasterId", Title = "شناسه پرونده", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 5
                },

                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true,
                    FilterType = "select2", FilterTypeApi = "/api/WF/WorkflowApi/getdropdown/0/10,14/9", Width = 8
                },

                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true,
                    FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageApi/getstagedropdownbyworkflowid/null/null/10,14/9/2/2", Width = 8
                },

                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true,
                    FilterType = "select2", FilterTypeApi = "/api/GN/BranchApi/getdropdown", Width = 6
                },

                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2ajax",
                    FilterTypeApi = "/api/MC/PatientApi/filter", Width = 7
                },

                new()
                {
                    Id = "patientNationalCode", Title = "نمبر تذکره مراجعه کننده", Type = (int)SqlDbType.NVarChar,
                    Size = 50, IsDtParameter = true, IsFilterParameter = true, FilterType = "select2ajax",
                    FilterTypeApi = "/api/MC/PatientApi/filter/3", Width = 6
                },

                new()
                {
                    Id = "attender", Title = "طبیب", Type = (int)SqlDbType.NVarChar, Size = 10, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/MC/AttenderApi/getdropdown/2", Width = 8
                },

                new()
                {
                    Id = "taminPrescriptionCategory", Title = "نوع نسخه", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/MC/PrescriptionTaminApi/taminprescriptiontypedropdown", Width = 6
                },

                new()
                {
                    Id = "expireDatePersian", Title = "تاریخ اعتبار", Type = (int)SqlDbType.VarChar, Size = 20,
                    IsDtParameter = true, FilterType = "doublepersiandate", IsFilterParameter = true, Width = 6
                },

                new()
                {
                    Id = "trackingCode", Title = "کد رهگیری", Type = (int)SqlDbType.VarChar, Size = 20,
                    IsDtParameter = true, FilterType = "number", IsFilterParameter = true, Width = 6
                },

                new()
                {
                    Id = "requestEPrescriptionId", Title = "شناسه الکترونیکی نسخه", Type = (int)SqlDbType.VarChar,
                    IsPrimary = true, IsDtParameter = true, IsFilterParameter = true, FilterType = "number", Width = 5
                },
                new() { Id = "sendResult", Title = "مجوز ارسال نسخه", Type = (int)SqlDbType.Bit, IsPrimary = true },
                new()
                {
                    Id = "sendResultName", Title = "وضعیت ارسال", Type = (int)SqlDbType.NVarChar, Size = 11,
                    IsDtParameter = true, Width = 5, Align = "center"
                },

                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ/زمان ثبت", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "doublepersiandate", Width = 6
                },

                new()
                {
                    Id = "createUser", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int, Size = 100,
                    IsDtParameter = true, IsFilterParameter = true, Width = 6,
                    FilterType = "select2", FilterTypeApi = "api/GN/UserApi/getdropdown/2/false/false"
                },

                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageActionApi/getdropdown/10,14/2/9", Width = 6
                },

                new() { Id = "taminPrescriptionCategoryId", Type = (int)SqlDbType.Int, IsPrimary = true },
                new() { Id = "workflowId", Type = (int)SqlDbType.Int, IsPrimary = true },
                new() { Id = "stageId", Type = (int)SqlDbType.Int, IsPrimary = true },
                new() { Id = "admissionWorkflowId", Type = (int)SqlDbType.Int, IsPrimary = true },
                new() { Id = "admissionStageId", Type = (int)SqlDbType.Int, IsPrimary = true },

                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 6 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "displayprescriptiontamin", Title = "نمایش", ClassName = "btn green_outline_1",
                    IconName = "far fa-file-alt"
                },
                new()
                {
                    Name = "printprescriptiontamin", Title = "چاپ", ClassName = "btn blue_1", IconName = "fa fa-print"
                },
                new()
                {
                    Name = "printPatientPrescriptionTamin", Title = "چاپ بیمه", ClassName = "btn blue_1",
                    IconName = "fa fa-print"
                },
                //new GetActionColumnViewModel{Name="editprescriptiontamin",Title="ویرایش",ClassName="",IconName="fa fa-edit color-green",Condition=new List<ConditionPageTable>(){ new ConditionPageTable { FieldName = "flg", FieldValue = "true", Operator = "==" }}},
                new()
                {
                    Name = "deleteprescriptiontamin", Title = "حذف", ClassName = "",
                    IconName = "fa fa-trash color-maroon",
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "flg", FieldValue = "true", Operator = "==" } }
                },
                new()
                {
                    Name = "sep1", Title = "", IsSeparator = true,
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "flg", FieldValue = "true", Operator = "==" } }
                },
                new()
                {
                    Name = "saveAndSendToWebService", Title = "ارسال", ClassName = "",
                    IconName = "fa fa-paper-plane color-blue",
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "flg", FieldValue = "true", Operator = "==" } }
                }
            }
        };

        return list;
    }

    public async Task<MyResultPage<List<PrescriptionTaminGetPage>>> GetPage(NewGetPrescriptionTaminPage model,
        int userId)
    {
        var result = new MyResultPage<List<PrescriptionTaminGetPage>>();

        result.Columns = GetColumns();


        var fromCreateDateMiladi = (DateTime?)null;
        var fromExpireDateMiladi = (DateTime?)null;
        var toCreateDateMiladi = (DateTime?)null;
        var toExpireDateMiladi = (DateTime?)null;
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

        if (model.Filters.Any(x => x.Name == "expireDatePersian"))
        {
            fromExpireDateMiladi = model.Filters.FirstOrDefault(x => x.Name == "expireDatePersian").Value.Split('-')[0]
                .ToMiladiDateTime();
            toExpireDateMiladi = model.Filters.FirstOrDefault(x => x.Name == "expireDatePersian").Value.Split('-')[1]
                .ToMiladiDateTime();
        }

        if (model.Filters.Any(x => x.Name == "patient"))
            patientId = model.Filters.FirstOrDefault(x => x.Name == "patient").Value.ToString();

        if (model.Filters.Any(x => x.Name == "patientNationalCode"))
            if (patientId == null)
                patientId = model.Filters.FirstOrDefault(x => x.Name == "patientNationalCode").Value.ToString();

        var parameters = new DynamicParameters();

        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);

        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("AdmissionId",
            model.Filters.Any(x => x.Name == "admissionId")
                ? model.Filters.FirstOrDefault(x => x.Name == "admissionId").Value
                : null);
        parameters.Add("AdmissionMasterId",
            model.Filters.Any(x => x.Name == "admissionMasterId")
                ? model.Filters.FirstOrDefault(x => x.Name == "admissionMasterId").Value
                : null);
        parameters.Add("BranchId",
            model.Filters.Any(x => x.Name == "branch")
                ? model.Filters.FirstOrDefault(x => x.Name == "branch").Value
                : null);
        parameters.Add("WorkflowId",
            model.Filters.Any(x => x.Name == "workflow")
                ? model.Filters.FirstOrDefault(x => x.Name == "workflow").Value
                : null);
        parameters.Add("StageId",
            model.Filters.Any(x => x.Name == "stage")
                ? model.Filters.FirstOrDefault(x => x.Name == "stage").Value
                : null);
        parameters.Add("ActionId",
            model.Filters.Any(x => x.Name == "actionIdName")
                ? model.Filters.FirstOrDefault(x => x.Name == "actionIdName").Value
                : null);
        parameters.Add("PatientId", patientId);
        parameters.Add("AttenderId",
            model.Filters.Any(x => x.Name == "attender")
                ? model.Filters.FirstOrDefault(x => x.Name == "attender").Value
                : null);
        parameters.Add("TaminPrescriptionCategoryId",
            model.Filters.Any(x => x.Name == "taminPrescriptionCategory")
                ? model.Filters.FirstOrDefault(x => x.Name == "taminPrescriptionCategory").Value
                : null);
        parameters.Add("ExpireDateFrom", fromExpireDateMiladi);
        parameters.Add("ExpireDateTo", toExpireDateMiladi);
        parameters.Add("RequestEPrescriptionId",
            model.Filters.Any(x => x.Name == "requestEPrescriptionId")
                ? model.Filters.FirstOrDefault(x => x.Name == "requestEPrescriptionId").Value
                : null);

        parameters.Add("TrackingCode",
            model.Filters.Any(x => x.Name == "trackingCode")
                ? model.Filters.FirstOrDefault(x => x.Name == "trackingCode").Value
                : null);

        parameters.Add("CreateDateTimeFrom", fromCreateDateMiladi);
        parameters.Add("CreateDateTimeTo", toCreateDateMiladi);

        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "PrescriptionTaminApi",
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
                    model.Filters.Any(x => x.Name == "createUser")
                        ? model.Filters.FirstOrDefault(x => x.Name == "createUser").Value
                        : null);
        }
        else
        {
            parameters.Add("CreateUserId", int.Parse(model.Form_KeyValue[1]?.ToString()));
        }

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_PrescriptionTamin_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<PrescriptionTaminGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<List<MyResultPrescriptionTamin>> SavePrescription(SavePrescriptionTamin model)
    {
        var result = new List<MyResultPrescriptionTamin>();

        var getAction = new GetAction();
        var stageAction = new ActionModel();

        if (model.OTPCode != null && model.OTPCode != "" && model.OTPCode != "0")
        {
            model.SendResult = 5;
            model.SendDateTime = null;
        }

        if (model.Prescriptions.Count > 0)
        {
            foreach (var prescription in model.Prescriptions)
            {
                //if (prescription.RequestEPrescriptionId == "0")
                //{
                if (prescription.Id == 0)
                {
                    getAction.CompanyId = model.CompanyId;
                    getAction.StageId = model.StageId;
                    getAction.WorkflowId = model.WorkflowId;
                    getAction.Priority = 1;
                    stageAction = await _stageActionRepository.GetAction(getAction);
                }

                if (prescription.TaminPrescriptionCategoryId != 16)
                    foreach (var item in prescription.Lines)
                    {
                        var prescriptionService =
                            await _admissionsRepository.GetTaminServicePrescription(item.ServiceId);

                        item.ServiceTypeId = prescriptionService.TaminPrescriptionTypeId;
                        item.ServiceCode = prescriptionService.WsCode;
                        item.ParaclinicTareffGroupId = prescriptionService.ParaclinicTareffCode;

                        if (prescription.TaminPrescriptionCategoryId != 12)
                        {
                            var TaminPrescriptionType = await GetTaminPrescriptionType(item.ServiceTypeId);
                            prescription.TaminPrescriptionCategoryId =
                                Convert.ToInt32(TaminPrescriptionType.TaminPrescriptionCategoryId);
                        }
                        else
                        {
                            prescription.TaminPrescriptionCategoryId = 6;
                        }

                        if (prescription.TaminPrescriptionCategoryId == 1)
                        {
                            item.DrugAmountCode = await _admissionsRepository.GetTaminDrugAmountCode(item.DrugAmountId);
                            item.DrugInstructionCode =
                                await _admissionsRepository.GetTaminDrugInstructionCode(item.DrugInstructionId);
                            item.DrugUsageCode = await _admissionsRepository.GetTaminDrugUsageCode(item.DrugUsageId);
                        }
                        else if (item.ServiceTypeId == "13")
                        {
                            item.PlanCode = await _admissionsRepository.GetTaminPlanCode(item.PlanId);
                        }
                    }
                else
                    prescription.TaminPrescriptionCategoryId = 3;


                var prescriptionHeader = new
                {
                    prescription.Id,
                    model.AdmissionServiceTaminId,
                    model.AttenderId,
                    model.PatientId,
                    model.PrescriptionDate,
                    model.Comment,
                    model.ExpireDate,
                    prescription.TaminPrescriptionCategoryId,
                    model.CreateUserId,
                    prescription.CreateDateTime,
                    model.StageId,
                    model.WorkflowId,
                    model.OTPCode,
                    model.SendResult,
                    model.SendDateTime,
                    model.CompanyId
                };

                if (prescription.TaminPrescriptionCategoryId == 3) prescription.Lines = null;

                using (var conn = Connection)
                {
                    var sQuery = "[mc].[Spc_TaminPrescription_InsUpd]";
                    conn.Open();

                    var saveResult = await conn.QueryFirstAsync<MyResultPrescriptionTamin>(sQuery, new
                    {
                        HeaderJson = JsonConvert.SerializeObject(prescriptionHeader),
                        LineJson = prescription.Lines == null ? null : JsonConvert.SerializeObject(prescription.Lines),
                        UserId = model.CreateUserId
                    }, commandType: CommandType.StoredProcedure);

                    conn.Close();

                    saveResult.DateTime = prescription.CreateDateTime;
                    saveResult.StatusMessage = saveResult.StatusMessage;
                    saveResult.Successfull = saveResult.Status == 100;

                    if (saveResult.Successfull)
                        if (prescription.Id == 0)
                        {
                            ///
                            var originWorkflowCategoryId =
                                await _stageRepository.GetWorkflowCategoryId(model.AdmissionTaminStageId);
                            var destinationWorkflowCategoryId =
                                await _stageRepository.GetWorkflowCategoryId(model.StageId);

                            var updateStepModel = new UpdateAction
                            {
                                RequestActionId = stageAction.ActionId,
                                WorkflowCategoryId = destinationWorkflowCategoryId,
                                IdentityId = saveResult.Id,
                                StageId = model.StageId,
                                WorkflowId = model.WorkflowId,
                                CompanyId = model.CompanyId,
                                UserId = model.CreateUserId
                            };

                            var resultLog = await _stageActionLogRepository.StageActionLogInsert(updateStepModel);

                            var updateResult = await UpdateLastAction(saveResult.Id, stageAction.ActionId);


                            var originModel = new StageActionOriginDestinationModel
                            {
                                OriginTransactionId = model.AdmissionServiceTaminId,
                                OriginWorkflowId = model.AdmissionTaminWorkflowId,
                                OriginStageId = model.AdmissionTaminStageId,
                                OriginWorkflowCategoryId = originWorkflowCategoryId,
                                DestinationTransactionId = saveResult.Id,
                                DestinationWorkflowId = model.WorkflowId,
                                DestinationStageId = model.StageId,
                                DestinationWorkflowCategoryId = destinationWorkflowCategoryId,
                                CreateUserId = model.CreateUserId
                            };

                            var addOriginResult = await _stageActionOriginDestinationRepository.Insert(originModel);
                            ///
                        }

                    result.Add(saveResult);
                }
                //}
                //else if (prescription.RequestEPrescriptionId != "0" && (prescription.PrescriptionTypeId == 16 || prescription.PrescriptionTypeId == 17))
                //{
                //    var ErorrResult = new MyResultStatus();
                //    ErorrResult.DateTime = DateTime.Now;
                //    ErorrResult.StatusMessage = "پس از ارسال نسخه ، نسخه های ویزیت و خدمات قابل ویرایش نمی باشند.";
                //    ErorrResult.Successfull = false;
                //    ErorrResult.Status = 500;


                //}
            }
        }
        else
        {
            var PrescriptionTypeId = 3;
            var CreateDateTime = DateTime.Now;
            var Id = 0;

            if (Id == 0)
            {
                getAction.CompanyId = model.CompanyId;
                getAction.StageId = model.StageId;
                getAction.WorkflowId = model.WorkflowId;
                getAction.Priority = 1;
                stageAction = await _stageActionRepository.GetAction(getAction);
            }

            var prescriptionHeader = new
            {
                Id,
                model.AdmissionServiceTaminId,
                model.AttenderId,
                model.PatientId,
                model.PrescriptionDate,
                model.Comment,
                model.ExpireDate,
                PrescriptionTypeId,
                model.CreateUserId,
                CreateDateTime,
                model.WorkflowId,
                model.StageId,
                model.OTPCode,
                model.SendResult,
                model.SendDateTime,
                model.CompanyId
            };


            using (var conn = Connection)
            {
                var sQuery = "[mc].[Spc_TaminPrescription_InsUpd]";
                conn.Open();

                var saveResult = await conn.QueryFirstAsync<MyResultPrescriptionTamin>(sQuery, new
                {
                    HeaderJson = JsonConvert.SerializeObject(prescriptionHeader),
                    LineJson = model.Prescriptions.Count == 0 ? null : model.Prescriptions,
                    UserId = model.CreateUserId
                }, commandType: CommandType.StoredProcedure);

                conn.Close();

                saveResult.DateTime = DateTime.Now;
                saveResult.StatusMessage = saveResult.StatusMessage;
                saveResult.Successfull = saveResult.Status == 100;

                if (saveResult.Successfull)
                    if (Id == 0)
                    {
                        ///
                        var updateStepModel = new UpdateAction
                        {
                            RequestActionId = stageAction.ActionId,
                            WorkflowCategoryId = 10,
                            IdentityId = saveResult.Id,
                            StageId = model.StageId,
                            WorkflowId = model.WorkflowId,
                            CompanyId = model.CompanyId,
                            UserId = model.CreateUserId
                        };

                        var resultLog = await _stageActionLogRepository.StageActionLogInsert(updateStepModel);

                        var updateResult = await UpdateLastAction(saveResult.Id, stageAction.ActionId);

                        var originModel = new StageActionOriginDestinationModel
                        {
                            OriginTransactionId = model.AdmissionServiceTaminId,
                            OriginWorkflowId = model.AdmissionTaminWorkflowId,
                            OriginStageId = model.AdmissionTaminStageId,
                            OriginWorkflowCategoryId = 10,
                            DestinationTransactionId = saveResult.Id,
                            DestinationWorkflowId = model.WorkflowId,
                            DestinationStageId = model.StageId,
                            DestinationWorkflowCategoryId = 10,
                            CreateUserId = model.CreateUserId
                        };

                        var addOriginResult = await _stageActionOriginDestinationRepository.Insert(originModel);
                        ///
                    }

                result.Add(saveResult);
            }
        }

        return result;
    }

    public async Task<MyResultStatus> UpdateLastAction(int id, byte lastActionId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_UpdItem_Number]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                TableName = "mc.PrescriptionTamin",
                ColumnName = "ActionId",
                Value = lastActionId,
                Filter = $"Id={id}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = result.Status == 100;

            return result;
        }
    }

    public async Task<TaminPrescriptionType> GetTaminPrescriptionType(string ServiceTypeId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            conn.Open();

            var result = await conn.QueryFirstAsync<TaminPrescriptionType>(sQuery,
                new
                {
                    IsSecondLang = false,
                    TableName = "mc.TaminPrescriptionType",
                    Filter = $"Id={ServiceTypeId}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> DrugUsageDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    IsSecondLang = false,
                    TableName = "mc.taminDrugUsage",
                    IdColumnName = "Id",
                    TitleColumnName = "Concept",
                    Filter = ""
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> DrugAmountDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    IsSecondLang = false,
                    TableName = "mc.taminDrugAmount",
                    IdColumnName = "Id",
                    TitleColumnName = "Summary+' '+LatinName+' - '+Concept",
                    Filter = ""
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> DrugInstructionDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    IsSecondLang = false,
                    TableName = "mc.taminDrugInstruction",
                    IdColumnName = "Id",
                    TitleColumnName = "Concept",
                    Filter = ""
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> OrganParentDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    IsSecondLang = false,
                    TableName = "mc.taminOrgan",
                    IdColumnName = "Id",
                    TitleColumnName = "Name",
                    Filter = "ParentId=0"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> PlanDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    IsSecondLang = false,
                    TableName = "mc.taminPlan",
                    IdColumnName = "Id",
                    TitleColumnName = "Name",
                    Filter = " ISNULL(IsActive,1)=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> IllnessDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    IsSecondLang = false,
                    TableName = "mc.taminIllness",
                    IdColumnName = "Id",
                    TitleColumnName = "Name",
                    Filter = ""
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> OrganDropDown(byte organId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    IsSecondLang = false,
                    TableName = "mc.taminOrgan",
                    IdColumnName = "Id",
                    TitleColumnName = "Name",
                    Filter = $"ParentId={organId}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> ParGrpCodeDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    IsSecondLang = false,
                    TableName = "mc.ParGrpCode",
                    IdColumnName = "Id",
                    TitleColumnName = "Name",
                    Filter = ""
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> TaminPrescriptionTypeDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    IsSecondLang = false,
                    TableName = "mc.TaminPrescriptionCategory",
                    IdColumnName = "Id",
                    TitleColumnName = "Name",
                    Filter = ""
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<ServicePrescriptionByType>> GetServicePrescriptionByType(GetPrescriptionSelect2 model)
    {
        string nameTerm = null;

        if (model.Term.IsNullOrEmptyOrWhiteSpace())
            return null;
        nameTerm = model.Term;

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_TaminServicePrescription_GetList]";

            conn.Open();

            var result = await conn.QueryAsync<ServicePrescriptionByType>(sQuery,
                new
                {
                    model.IsGeneric,
                    ServiceTypeId = model.ServiceType,
                    model.Term
                }, commandType: CommandType.StoredProcedure);

            conn.Close();

            var finalResult = from s in result
                select new ServicePrescriptionByType
                {
                    Id = s.Id,
                    Name = s.Code + " / " + s.Name,
                    Type = s.Type
                };

            return finalResult;
        }
    }

    public async Task<GetPrescriptionTamin> PrescriptionDisplay(int id, int headerPagination, int companyId)
    {
        var directPaging = headerPagination;
        var paginationParameters = new DynamicParameters();
        var prescriptionIdFromPagination = 0;
        if (directPaging > 0)
        {
            paginationParameters.Add("TableName", "mc.PrescriptionTamin");
            paginationParameters.Add("IdColumnName", "Id");
            paginationParameters.Add("IdColumnValue", id);
            paginationParameters.Add("Direction", directPaging);

            using (var conn = Connection)
            {
                var sQuery = "[pb].[Spc_Tables_NextPrev]";
                conn.Open();
                prescriptionIdFromPagination = await conn.ExecuteScalarAsync<int>(sQuery, paginationParameters,
                    commandType: CommandType.StoredProcedure);
            }
        }

        var prescriptionId = prescriptionIdFromPagination == 0 ? id : prescriptionIdFromPagination;

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_PrescriptionTamin_Display]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<GetPrescriptionTamin>(sQuery,
                new { PrescriptionId = prescriptionId }, commandType: CommandType.StoredProcedure);
            conn.Close();

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
                TableName = "mc.PrescriptionTamin",
                ColumnName = "Id",
                Filter = $"Id={id} AND CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result > 0;
        }
    }

    public async Task<PrescriptionTaminInfo_Mid> getPrescriptionTaminInfo(string id)
    {
        var result = new PrescriptionTaminInfo_Mid();

        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_PrescriptionTaminInfo_Mid";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<PrescriptionTaminInfo_Mid>(sQuery,
                new
                {
                    Id = id
                }, commandType: CommandType.StoredProcedure);

            conn.Close();
        }

        return result;
    }

    public async Task<List<MyResultStatus>> SavePrescriptionTaminEdit(long HeaderId, string jsonStr)
    {
        var result = new List<MyResultStatus>();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_PrescriptionTaminEdit_InsUpd]";
            conn.Open();

            var saveResult = await conn.QueryFirstAsync<MyResultStatus>(sQuery, new
            {
                HeaderId,
                JsonStr = jsonStr
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            saveResult.DateTime = DateTime.Now;
            saveResult.StatusMessage = saveResult.StatusMessage;
            saveResult.Successfull = saveResult.Status == 100;

            result.Add(saveResult);
        }

        return result;
    }

    public async Task<string> GetTaminPrescriptionEdit(string Id)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<string>(sQuery, new
            {
                TableName = "mc.PrescriptionTaminEdit",
                ColumnName = "JsonStr",
                Filter = $"HeaderId={Id}",
                OrderBy = " id desc"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public virtual async Task<MyResultStatus> Delete(GetDeletePrescriptionTamin model)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_PrescriptionTamin_Delete]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.Id,
                model.WorkflowId,
                model.StageId,
                model.AdmissionId,
                model.AdmissionWorkflowId,
                model.AdmissionStageId
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        result.ValidationErrors = result.Successfull
            ? new List<string> { "عملیات حذف با موفقیت انجام شد" }
            : new List<string> { "عملیات حذف با موفقیت انجام نشد" };
        return result;
    }

    public async Task<IEnumerable<PrintPatientPrescriptionTaminViewModel>> GetPatientPrescriptionTaminPrint(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_PrescreptionTamin_Print]";
            conn.Open();
            var result = await conn.QueryAsync<PrintPatientPrescriptionTaminViewModel>(sQuery,
                new
                {
                    Id = id
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }
}