using System.Collections;
using System.Data;
using System.Web;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionImaging;
using ParsAlphabet.ERP.Application.Dtos.WF.StageActionOriginDestination;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces.Redis;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.RoleWorkflowPermission;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.Stage;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageActionLog;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageActionOriginDestination;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionImaging;

public class AdmissionImagingRepository :
    BaseRepository<AdmissionImagingModel, int, string>,
    IBaseRepository<AdmissionImagingModel, int, string>
{
    private readonly ILoginRepository _loginRepository;
    private readonly IRedisService _redisService;
    private readonly RoleWorklfowPermissionRepository _roleWorklfowPermissionRepository;
    private readonly StageActionLogRepository _stageActionLogRepository;
    private readonly StageActionOriginDestinationRepository _stageActionOriginDestinationRepository;
    private readonly StageActionRepository _stageActionRepository;
    private readonly StageRepository _stageRepository;

    public AdmissionImagingRepository(
        IConfiguration config,
        StageActionOriginDestinationRepository stageActionOriginDestinationRepository,
        StageActionRepository stageActionRepository,
        StageActionLogRepository stageActionLogRepository,
        IRedisService redisService,
        RoleWorklfowPermissionRepository roleWorklfowPermissionRepository,
        StageRepository stageRepository,
        ILoginRepository loginRepository) : base(config)
    {
        _redisService = redisService;
        _stageActionRepository = stageActionRepository;
        _stageActionLogRepository = stageActionLogRepository;
        _stageActionOriginDestinationRepository = stageActionOriginDestinationRepository;
        _roleWorklfowPermissionRepository = roleWorklfowPermissionRepository;
        _stageRepository = stageRepository;
        _loginRepository = loginRepository;
    }

    public GetColumnsViewModel GetColumnsAdmissionImaging()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsPrimary = true, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 4
                },
                new()
                {
                    Id = "admissionMasterId", Title = "شناسه پرونده", Type = (int)SqlDbType.Int, IsPrimary = true,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "number", Width = 6
                },
                new()
                {
                    Id = "admissionId", Title = "شناسه پذیرش", Type = (int)SqlDbType.Int, IsPrimary = true,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "number", Width = 6
                },
                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, IsPrimary = true,
                    IsDtParameter = true, IsFilterParameter = true,
                    FilterType = "select2", FilterTypeApi = "/api/WF/WorkflowApi/getdropdown/0/10,14/17,22", Width = 11
                },

                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, IsPrimary = true,
                    IsDtParameter = true, IsFilterParameter = true,
                    FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageApi/getstagedropdownbyworkflowid/null/null/10,14/10/2/2", Width = 11
                },

                new()
                {
                    Id = "attender", Title = "رادیولوژیست", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 9, FilterType = "select2",
                    FilterTypeApi = "/api/MC/AttenderApi/getdropdown/2"
                },
                new()
                {
                    Id = "referringDoctor", Title = "پزشک ارجاع دهنده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2ajax",
                    FilterTypeApi = "/api/MC/ReferringDoctorApi/getdropdown/2", Width = 7
                },
                new()
                {
                    Id = "prescriptionDatePersian", Title = "تاریخ نسخه", Type = (int)SqlDbType.VarChar, Size = 20,
                    IsDtParameter = true, FilterType = "doublepersiandate", IsFilterParameter = true, Width = 5
                },
                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 20,
                    IsDtParameter = true, IsFilterParameter = true, Width = 8
                },
                new()
                {
                    Id = "patientNationalCode", Title = "نمبر تذکره مراجعه کننده", Type = (int)SqlDbType.NVarChar,
                    Size = 20, IsDtParameter = true, IsFilterParameter = true, FilterType = "strnumber", Width = 7
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.VarChar, Size = 20,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "doublepersiandate", Width = 5
                },
                new()
                {
                    Id = "user", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, Size = 20,
                    IsDtParameter = true, IsFilterParameter = true, Width = 8
                },
                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.NVarChar, Size = 20, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageActionApi/getdropdown/10,14/2/10", Width = 8
                },
                new()
                {
                    Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, Size = 20, IsDtParameter = true,
                    Width = 5
                },

                new() { Id = "admissionWorkflowId", IsPrimary = true },
                new() { Id = "admissionStageId", IsPrimary = true },
                new() { Id = "workflowId", IsPrimary = true },
                new() { Id = "stageId", IsPrimary = true }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "displayAdmissionImaging", Title = "نمایش", ClassName = "btn green_outline_1",
                    IconName = "far fa-file-alt"
                },
                new()
                {
                    Name = "editAdmissionImaging", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green"
                },
                new()
                {
                    Name = "editAdmission", Title = "ویرایش پذیرش", ClassName = "btn green_outline_1",
                    IconName = "fa fa-edit color-green"
                },
                new()
                {
                    Name = "deleteAdmissionImaging", Title = "حذف", ClassName = "",
                    IconName = "fa fa-trash color-maroon"
                },
                new() { Name = "print", Title = "چاپ", ClassName = "btn blue_1", IconName = "fa fa-print" }
            }
        };

        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model, int userId, byte roleId)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                GetColumnsAdmissionImaging().DataColumns.Where(x => x.IsDtParameter && x.Id != "action")
                    .Select(z => z.Title))
        };

        var getPage = await GetPage(model, userId, roleId);
        result.Rows = from r in getPage.Data
            select new
            {
                r.Id,
                r.AdmissionMasterId,
                r.AdmissionId,
                r.Workflow,
                r.Stage,
                r.Attender,
                r.ReferringDoctor,
                r.PrescriptionDatePersian,
                r.Patient,
                r.PatientNationalCode,
                r.CreateDateTimePersian,
                r.User,
                r.ActionIdName
            };
        return result;
    }

    public async Task<MyResultPage<List<AdmissionImagingGetPage>>> GetPage(NewGetPageViewModel model, int userId,
        byte roleId)
    {
        var result = new MyResultPage<List<AdmissionImagingGetPage>>
        {
            Data = new List<AdmissionImagingGetPage>()
        };

        var fromCreateDateMiladi = (DateTime?)null;
        var toCreateDateMiladi = (DateTime?)null;

        var fromPrescriptionDateMiladi = (DateTime?)null;
        var toPrescriptionDateMiladi = (DateTime?)null;


        if (model.Filters.Any(x => x.Name == "createDateTimePersian"))
        {
            fromCreateDateMiladi =
                model.Filters.FirstOrDefault(x => x.Name == "createDateTimePersian").Value.Split('-')[0]
                    .ToMiladiDateTime();
            toCreateDateMiladi =
                model.Filters.FirstOrDefault(x => x.Name == "createDateTimePersian").Value.Split('-')[1]
                    .ToMiladiDateTime();
        }

        if (model.Filters.Any(x => x.Name == "prescriptionDatePersian"))
        {
            fromPrescriptionDateMiladi =
                model.Filters.FirstOrDefault(x => x.Name == "prescriptionDatePersian").Value.Split('-')[0]
                    .ToMiladiDateTime();
            toPrescriptionDateMiladi =
                model.Filters.FirstOrDefault(x => x.Name == "prescriptionDatePersian").Value.Split('-')[1]
                    .ToMiladiDateTime();
        }

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
        parameters.Add("PatientName",
            model.Filters.Any(x => x.Name == "patient")
                ? model.Filters.FirstOrDefault(x => x.Name == "patient").Value
                : null);
        parameters.Add("PatientNationalCode",
            model.Filters.Any(x => x.Name == "patientNationalCode")
                ? model.Filters.FirstOrDefault(x => x.Name == "patientNationalCode").Value
                : null);
        parameters.Add("FromCreateDate", fromCreateDateMiladi);
        parameters.Add("ToCreateDate", toCreateDateMiladi);
        parameters.Add("StageId",
            model.Filters.Any(x => x.Name == "stage")
                ? model.Filters.FirstOrDefault(x => x.Name == "stage").Value
                : null);
        parameters.Add("WorkflowId",
            model.Filters.Any(x => x.Name == "workflow")
                ? model.Filters.FirstOrDefault(x => x.Name == "workflow").Value
                : null);
        parameters.Add("ActionId",
            model.Filters.Any(x => x.Name == "actionIdName")
                ? model.Filters.FirstOrDefault(x => x.Name == "actionIdName").Value
                : null);
        parameters.Add("ReferringDoctorId",
            model.Filters.Any(x => x.Name == "referringDoctor")
                ? model.Filters.FirstOrDefault(x => x.Name == "referringDoctor").Value
                : null);
        parameters.Add("AttenderId",
            model.Filters.Any(x => x.Name == "attender")
                ? model.Filters.FirstOrDefault(x => x.Name == "attender").Value
                : null);
        parameters.Add("FromPrescriptionDate", fromPrescriptionDateMiladi);
        parameters.Add("ToPrescriptionDate", toPrescriptionDateMiladi);
        parameters.Add("RoleId", roleId);
        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);


        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "AdmissionImagingApi",
            OprType = "VIWALL",
            UserId = userId
        };


        var checkAccessViewAll = await _loginRepository.GetAuthenticate(checkAuthenticate);

        if (model.Form_KeyValue[1]?.ToString() == null)
        {
            if (!checkAccessViewAll.Successfull)
                parameters.Add("CreateUserId", 0);
            else
                parameters.Add("CreateUserId");

            parameters.Add("CreateUserFullName",
                model.Filters.Any(x => x.Name == "user")
                    ? model.Filters.FirstOrDefault(x => x.Name == "user").Value
                    : null);
        }

        else
        {
            parameters.Add("CreateUserId", model.Form_KeyValue[1]?.ToString());
            parameters.Add("CreateUserFullName");
        }

        result.Columns = GetColumnsAdmissionImaging();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionImaging_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<AdmissionImagingGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<string> ValidateCheckAdmissionImagingPermission(AdmissionImagingCheckPermissionViewModel model)
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

    public async Task<MyResultStatus> SaveAdmissionImaging(AdmissionImagingModel model)
    {
        var content = model.Content.ConvertArabicAlphabet();
        var encodeContent = HttpUtility.HtmlEncode(content);
        var result = new MyResultStatus();


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
            var sQuery = "[mc].[Spc_AdmissionImaging_InsUpd]";
            conn.Open();

            var resultSave = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.Id,
                model.BranchId,
                model.WorkflowId,
                model.StageId,
                model.AdmissionId,
                model.AttenderId,
                model.PatientId,
                TemplateIdJson = JsonConvert.SerializeObject(model.Templates),
                Content = encodeContent,
                model.BasicInsurerId,
                model.BasicInsurerLineId,
                model.CompInsurerId,
                model.CompInsurerLineId,
                model.ThirdPartyId,
                model.DiscountId,
                model.HID,
                model.BasicInsurerExpirationDate,
                model.BasicInsurerNo,
                model.CreateUserId,
                model.CreateDateTime,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            result.Successfull = resultSave.Status > 0;

            if (result.Successfull)
                if (model.Id == 0)
                {
                    var updateStepModel = new UpdateAction
                    {
                        RequestActionId = stageAction.ActionId,
                        WorkflowCategoryId = stageAction.WorkflowCategoryId,
                        IdentityId = resultSave.Id,
                        StageId = model.StageId,
                        WorkflowId = model.WorkflowId,
                        CompanyId = model.CompanyId,
                        UserId = model.CreateUserId
                    };

                    var resultLog = await _stageActionLogRepository.StageActionLogInsert(updateStepModel);

                    var updateResult = await UpdateLastAction(resultSave.Id, stageAction.ActionId);

                    var OriginWorkflowCategoryId = await _stageRepository.GetWorkflowCategoryId(model.AdmissionStageId);

                    var DestinationWorkflowCategoryId = await _stageRepository.GetWorkflowCategoryId(model.StageId);


                    var originModel = new StageActionOriginDestinationModel
                    {
                        OriginTransactionId = model.AdmissionId,
                        OriginWorkflowId = model.AdmissionWorkflowId,
                        OriginStageId = model.AdmissionStageId,
                        OriginWorkflowCategoryId = OriginWorkflowCategoryId,
                        DestinationTransactionId = resultSave.Id,
                        DestinationWorkflowId = model.WorkflowId,
                        DestinationStageId = model.StageId,
                        DestinationWorkflowCategoryId = DestinationWorkflowCategoryId,
                        CreateUserId = model.CreateUserId,
                        CreateDateTime = DateTime.Now
                    };

                    var addOriginResult = await _stageActionOriginDestinationRepository.Insert(originModel);
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
                TableName = "mc.AdmissionImaging",
                ColumnName = "ActionId",
                Value = lastActionId,
                Filter = $"Id={id}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = result.Status == 100;

            return result;
        }
    }

    public async Task<MyResultPage<AdmissionImagingGetRecord>> GetRecordById(int id, int headerPagination, int userId)
    {
        var directPaging = headerPagination;
        var paginationParameters = new DynamicParameters();
        var admissionImagingIdFromPagination = 0;

        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "AdmissionImagingApi",
            OprType = "VIWALL",
            UserId = userId
        };


        var checkAccessViewAll = await _loginRepository.GetAuthenticate(checkAuthenticate);

        if (directPaging > 0)
        {
            paginationParameters.Add("TableName", "mc.AdmissionImaging");
            paginationParameters.Add("IdColumnName", "Id");
            paginationParameters.Add("IdColumnValue", id);
            var filter = string.Empty;

            if (!checkAccessViewAll.Successfull)
                filter = $"AND CreateUserId={userId}";
            else
                filter = "";

            paginationParameters.Add("FilterParam", filter);

            paginationParameters.Add("Direction", directPaging);

            using (var conn = Connection)
            {
                var sQuery = "[pb].[Spc_Tables_NextPrev]";
                conn.Open();
                admissionImagingIdFromPagination = await conn.ExecuteScalarAsync<int>(sQuery, paginationParameters,
                    commandType: CommandType.StoredProcedure);
            }
        }

        var admissionImgeId = admissionImagingIdFromPagination == 0 ? id : admissionImagingIdFromPagination;

        var result = new MyResultPage<AdmissionImagingGetRecord>();
        result.Data = new AdmissionImagingGetRecord();
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionImaging_GetRecord]";
            conn.Open();
            result.Data = await conn.QueryFirstOrDefaultAsync<AdmissionImagingGetRecord>(sQuery, new
            {
                AdmissionImageId = admissionImgeId
            }, commandType: CommandType.StoredProcedure);
        }

        var decodeContent = new StringWriter();
        HttpUtility.HtmlDecode(result.Data.Content, decodeContent);
        var finalContent = decodeContent.ToString();
        result.Data.Content = finalContent;
        result.Data.Id = admissionImgeId;
        return result;
    }

    public async Task<MyResultQuery> Delete(AdmissionImagingDelete model)
    {
        var result = new MyResultQuery();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionImaging_Delete]";
            conn.Open();

            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                model.AdmissionId,
                model.AdmissionWorkflowId,
                model.AdmissionStageId,
                model.Id,
                model.WorkflowId,
                model.StageId
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
        }

        result.Successfull = result.Status == 100;

        return result;
    }

    public async Task<bool> CheckExist(int id, int companyId, int userId)
    {
        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "AdmissionImagingApi",
            OprType = "VIWALL",
            UserId = userId
        };


        var checkAccessViewAll = await _loginRepository.GetAuthenticate(checkAuthenticate);

        var filter = $"Id={id} AND CompanyId={companyId}";

        if (!checkAccessViewAll.Successfull)

            filter += $" AND CreateUserId={userId}";

        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "mc.AdmissionImaging",
                ColumnName = "Id",
                Filter = filter
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result > 0;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetDropDownAdmissionStage()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.admission_stage",
                    IdColumnName = "Pk_admission_stageId",
                    TitleColumnName = "stage_name",
                    Filter = "Pk_admission_stageId=52 or Pk_admission_stageId=67 or Pk_admission_stageId=65"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public int? GetCacheSelectedAttender(int userId)
    {
        int? cacheAttender = null;
        try
        {
            cacheAttender = _redisService.GetData<int?>($"cacheAttenderImagingSelected{userId}");

            if (cacheAttender.NotNull())
                return cacheAttender;
        }
        catch (Exception)
        {
            cacheAttender = null;
        }

        return cacheAttender;
    }

    public void SetCacheSelectedAttender(int userId, int attenderId)
    {
        int? cacheAttender = attenderId;
        try
        {
            var expirationTime = DateTimeOffset.Now.AddHours(10.0);
            _redisService.SetData($"cacheAttenderImagingSelected{userId}", attenderId, expirationTime);
        }
        catch (Exception)
        {
            cacheAttender = null;
        }
    }
}