using System.Data;
using System.Net;
using Dapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos._Setup;
using ParsAlphabet.ERP.Application.Dtos.MC.Admission;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionCartable;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionDiagnosis;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionMaster;
using ParsAlphabet.ERP.Application.Dtos.MC.Prescription;
using ParsAlphabet.ERP.Application.Dtos.NewDtos.AdmissionServiceRepositoryDto;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionMaster;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.Central;
using ParsAlphabet.ERP.Domain.Data;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.RoleWorkflowPermission;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionDiagnosis;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionMaster;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.Stage;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageActionLog;
using Sms = ParsAlphabet.ERP.Application.Common.Extensions.Sms;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.Admission;

public class AdmissionServiceRepository(
    IConfiguration config,
    AdmissionDiagnosisRepository admissionDiagnosisRepository,
    StageActionRepository stageActionRepository,
    StageActionLogRepository stageActionLogRepository,
    IAdmissionMasterRepository admissionMasterRepository,
    RoleWorklfowPermissionRepository roleWorklfowPermissionRepository,
    StageRepository stageRepository,
    ILoginRepository loginRepository,
    IAdmissionServiceCentral admissionServiceCentral,
    ERPContext context)
    :
        BaseRepository<AdmissionModel, int, string>(config),
        IBaseRepository<AdmissionModel, int, string>

{
    private readonly ILoginRepository _loginRepository = loginRepository;

    public new GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            ConditionOn = "row",
            FixedColumn = true,
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "conflict", FieldValue = "true", Operator = "==" } },
            AnswerCondition = "color:#da1717",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه ", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 8
                },
                new()
                {
                    Id = "admissionMasterId", Title = "پرونده", IsPrimary = true, Type = (int)SqlDbType.Int,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "number", Width = 8
                },
                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/WorkflowApi/getdropdown/0/10/17,22", Width = 15
                },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageApi/getstagedropdownbyworkflowid/null/null/10/17,22,28/2/2",
                    Width = 15
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
                    Id = "attender", Title = "طبیب", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/MC/AttenderApi/getdropdown/2", Width = 12
                },
                new()
                {
                    Id = "reserveDatePersian", Title = "تاریخ رزرو نوبت", Type = (int)SqlDbType.VarChar, Size = 20,
                    IsDtParameter = true, FilterType = "doublepersiandate", IsFilterParameter = true, Width = 12
                },
                new()
                {
                    Id = "reserveShift", Title = "شیفت کاری", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, Width = 13
                },
                new()
                {
                    Id = "admissionNo", Title = "نوبت", Type = (int)SqlDbType.Int, Size = 10, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "admissionAmount", Title = "مبلغ پذیرش", Type = (int)SqlDbType.Money, Size = 10,
                    IsPersian = true, IsCommaSep = true, IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "cashAmount", Title = "مبلغ صندوق", Type = (int)SqlDbType.Money, Size = 10, IsPersian = true,
                    IsCommaSep = true, IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.VarChar, Size = 20,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "doublepersiandate", Width = 12
                },
                new()
                {
                    Id = "user", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.VarChar, Size = 100,
                    IsDtParameter = true, IsFilterParameter = true, Width = 12, FilterType = "select2",
                    FilterTypeApi = "api/GN/UserApi/getdropdown/2/false/false"
                },
                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageActionApi/getdropdown/10/2/17,22", Width = 12
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 9 },
                new() { Id = "stageId", IsPrimary = true },
                new() { Id = "admissionMasterWorkflowCategoryId", IsPrimary = true },
                new() { Id = "branchId", IsPrimary = true },
                new() { Id = "workflowId", IsPrimary = true },
                new() { Id = "actionId", IsPrimary = true },
                new() { Id = "medicalRevenue", IsPrimary = true },
                new() { Id = "patientId", IsPrimary = true },
                new() { Id = "centralId", IsPrimary = true }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "display", Title = "نمایش", ClassName = "btn green_outline_1", IconName = "far fa-file-alt"
                },
                new() { Name = "print", Title = "چاپ", ClassName = "btn blue_1", IconName = "fa fa-print" },
                new()
                {
                    Name = "editAdm", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green", Condition =
                        new List<ConditionPageTable>
                        {
                            new() { FieldName = "medicalRevenue", FieldValue = "2", Operator = "!=" }
                        }
                },
                new() { Name = "sep1", Title = "", ClassName = "", IconName = "", IsSeparator = true },
                new()
                {
                    Name = "admissionActionList", Title = "گام ها", ClassName = "", IconName = "fas fa-cash-register"
                }
                //new GetActionColumnViewModel{Name="verifyhid",Title="استعلام شناسه شباد",ClassName="",IconName="fa fa-id-card color-blue"}
            }
        };

        return list;
    }

    public GetColumnsViewModel GetPatientReservedListColumns()
    {
        var list = new GetColumnsViewModel
        {
            ActionType = "inline",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "admissionId", Title = "شناسه پذیرش", Type = (int)SqlDbType.Int, IsPrimary = true,
                    IsDtParameter = true, IsFilterParameter = true, Width = 12
                },
                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 16
                },
                new()
                {
                    Id = "patientNationalCode", Title = "نمبر تذکره", Type = (int)SqlDbType.NVarChar, Size = 13,
                    IsDtParameter = true, Width = 12
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, FilterType = "strnumber", Width = 12
                },
                new()
                {
                    Id = "reserveDatePersian", Title = "تاریخ رزرو نوبت ", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsPrimary = true, IsDtParameter = true, Width = 12
                },
                new()
                {
                    Id = "reserveTime", Title = "زمان رزرو  ", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsPrimary = true, IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "reserveNo", Title = "شماره رزرو", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    IsPrimary = true, Width = 8
                },
                new()
                {
                    Id = "reserveShiftId", Title = "شماره شیفت", Type = (int)SqlDbType.NVarChar, IsPrimary = true,
                    IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "reserveShiftName", Title = "نام شیفت", Type = (int)SqlDbType.NVarChar, IsPrimary = true,
                    IsDtParameter = true, Width = 12
                },
                new() { Id = "attenderScheduleBlockId", IsPrimary = true }
            }
        };

        return list;
    }

    public GetColumnsViewModel GetPatientMovelistColumns()
    {
        var list = new GetColumnsViewModel
        {
            ActionType = "inline",
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "hasPatient", FieldValue = "true", Operator = "==" } },
            AnswerCondition = "color:#da1717",
            DataColumns = new List<DataColumnsViewModel>
            {
                new() { Id = "attenderScheduleBlockId", Title = "شناسه نوبت", IsPrimary = true },
                new()
                {
                    Id = "shift", Title = "شیفت", Type = (int)SqlDbType.Int, IsPrimary = true, IsDtParameter = true,
                    IsFilterParameter = true, Width = 9
                },
                new()
                {
                    Id = "appointmentDatePersian", Title = "تاریخ نوبت", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, FilterType = "strnumber", Width = 9
                },
                new()
                {
                    Id = "dayName", Title = "روزهفته", Type = (int)SqlDbType.Int, IsPrimary = true,
                    IsDtParameter = true, IsFilterParameter = true, Width = 9
                },
                new()
                {
                    Id = "startTime", Title = "زمان شروع", Type = (int)SqlDbType.Int, IsPrimary = true,
                    IsDtParameter = true, IsFilterParameter = true, Width = 9
                },
                new()
                {
                    Id = "endTime", Title = "زمان پایان", Type = (int)SqlDbType.Int, IsPrimary = true,
                    IsDtParameter = true, IsFilterParameter = true, Width = 9
                },
                new()
                {
                    Id = "reserveNo", Title = "شماره رزرو", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    IsPrimary = true, Width = 9
                },
                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 9
                },
                new()
                {
                    Id = "nationalCode", Title = "نمبر تذکره", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 9
                },
                new()
                {
                    Id = "admissionId", Title = "شناسه پذیرش", Type = (int)SqlDbType.Int, IsPrimary = true,
                    IsDtParameter = true, IsFilterParameter = true, Width = 9
                },
                new()
                {
                    Id = "admissionDatePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, FilterType = "strnumber", Width = 9
                },
                new() { Id = "hasPatient", IsPrimary = true },
                new() { Id = "dayInWeek", IsPrimary = true }
            }
        };

        return list;
    }

    public GetColumnsViewModel GetPatientReservedMoveListColumns()
    {
        var list = new GetColumnsViewModel
        {
            ActionType = "inline",
            IsSelectable = true,
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "admissionId", Title = "شناسه پذیرش", Type = (int)SqlDbType.Int, IsPrimary = true,
                    IsDtParameter = true, IsFilterParameter = true, Width = 12
                },
                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 16
                },
                new()
                {
                    Id = "patientNationalCode", Title = "نمبر تذکره", Type = (int)SqlDbType.NVarChar, Size = 13,
                    IsDtParameter = true, Width = 12
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, FilterType = "strnumber", Width = 12
                },
                new()
                {
                    Id = "reserveDatePersian", Title = "تاریخ رزرو نوبت ", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsPrimary = true, IsDtParameter = true, Width = 12
                },
                new()
                {
                    Id = "reserveTime", Title = "زمان رزرو  ", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsPrimary = true, IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "reserveNo", Title = "شماره رزرو", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    IsPrimary = true, Width = 8
                },
                new()
                {
                    Id = "reserveShiftId", Title = "شماره شیفت", Type = (int)SqlDbType.NVarChar, IsPrimary = true,
                    IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "reserveShiftName", Title = "نام شیفت", Type = (int)SqlDbType.NVarChar, IsPrimary = true,
                    IsDtParameter = true, Width = 12
                },
                new() { Id = "attenderScheduleBlockId", IsPrimary = true }
            }
        };

        return list;
    }




    public GetColumnsViewModel GetColumnsSearchInbound()
    {
        var list = new GetColumnsViewModel
        {
            ActionType = "inline",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "admissionId", Title = "شناسه", Type = (int)SqlDbType.Int, IsPrimary = true,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "number", Width = 5,
                    Condition = "admissionTypeId"
                },

                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 20,
                    IsDtParameter = true, IsFilterParameter = true, Width = 12
                },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 20, IsDtParameter = true,
                    IsFilterParameter = true, Width = 12
                },

                new()
                {
                    Id = "patientFullName", Title = "مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 20,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "patientNationalCode", Title = "نمبر تذکره مراجعه کننده", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "strnumber", Width = 10
                },
                new()
                {
                    Id = "basicInsurerName", Title = "بیمه پایه", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "doublepersiandate", Width = 6
                },
                new()
                {
                    Id = "basicInsurerLineName", Title = "صندوق بیمه", Type = (int)SqlDbType.VarChar, Size = 20,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "compInsurerName", Title = "بیمه تکمیلی", Type = (int)SqlDbType.NVarChar, Size = 20,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "compInsurerLineName", Title = "صندوق بیمه تکمیلی", Type = (int)SqlDbType.NVarChar, Size = 20,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "basicInsurerExpirationDatePersian", Title = "تاریخ انقضاء دفترچه",
                    Type = (int)SqlDbType.Money, Size = 10, IsCommaSep = true, IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "attenderFullName", Title = "طبیب", Type = (int)SqlDbType.NVarChar, Size = 20,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 5 },

                new() { Id = "stageId", IsPrimary = true },
                new() { Id = "workflowCategoryId", IsPrimary = true },
                new() { Id = "workflowId", IsPrimary = true },
                new() { Id = "branchId", IsPrimary = true },
                new() { Id = "actionId", IsPrimary = true },
                new() { Id = "patientId", IsPrimary = true }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "setAdmissionInfo", Title = "انتخاب", ClassName = "btn blue_outline_2 ml-1",
                    IconName = "fa fa-check"
                }
            }
        };

        return list;
    }

    public async Task<MyResultPage<List<AdmissionGetPage>>> GetPage(NewGetPageViewModel model, int userId, byte roleId)
    {
        var result = new MyResultPage<List<AdmissionGetPage>>
        {
            Data = new List<AdmissionGetPage>()
        };

        var fromReserveDateMiladi = (DateTime?)null;
        var toReserveDateMiladi = (DateTime?)null;

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

        if (model.Filters.Any(x => x.Name == "reserveDatePersian"))
        {
            fromReserveDateMiladi =
                model.Filters.FirstOrDefault(x => x.Name == "reserveDatePersian").Value.Split('-')[0]
                    .ToMiladiDateTime();
            toReserveDateMiladi = model.Filters.FirstOrDefault(x => x.Name == "reserveDatePersian").Value.Split('-')[1]
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
        parameters.Add("AttenderId",
            model.Filters.Any(x => x.Name == "attender")
                ? model.Filters.FirstOrDefault(x => x.Name == "attender").Value
                : null);
        parameters.Add("FromCreateDate", fromCreateDateMiladi);
        parameters.Add("ToCreateDate", toCreateDateMiladi);
        parameters.Add("FromReserveDate", fromReserveDateMiladi);
        parameters.Add("ToReserveDate", toReserveDateMiladi);
        parameters.Add("RoleId", roleId);

        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);


        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "AdmissionApi",
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


        result.Columns = GetColumns();

        using var conn = Connection;
        var sQuery = "[mc].[Spc_AdmissionService_GetPage]";
        conn.Open();
        result.Data =
            (await conn.QueryAsync<AdmissionGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
            .ToList();
        conn.Close();

        return result;
    }



    //#region Admission GetPage

    //private AdmissionGetPageFilter ConvertToNewFilter(List<FormKeyValue> oldFilters, int userId, byte roleId, byte companyId)
    //{
    //    var newFilter = new AdmissionGetPageFilter
    //    {
    //        CompanyId = companyId,
    //        RoleId = roleId // اضافه کردن RoleId به فیلتر
    //    };

    //    foreach (var filter in oldFilters)
    //    {
    //        switch (filter.Name.ToLower())
    //        {
    //            case "id":
    //                if (int.TryParse(filter.Value, out int id))
    //                    newFilter.Id = id;
    //                break;

    //            case "admissionmasterid":
    //                if (int.TryParse(filter.Value, out int admissionMasterId))
    //                    newFilter.AdmissionMasterId = admissionMasterId;
    //                break;

    //            case "patient":
    //            case "patientnationalcode":
    //                if (int.TryParse(filter.Value, out int patientId))
    //                    newFilter.PatientId = patientId;
    //                break;

    //            case "attender":
    //                if (int.TryParse(filter.Value, out int attenderId))
    //                    newFilter.AttenderId = attenderId;
    //                break;

    //            case "stage":
    //                if (short.TryParse(filter.Value, out short stageId))
    //                    newFilter.StageId = stageId;
    //                break;

    //            case "actionidname":
    //                if (byte.TryParse(filter.Value, out byte actionId))
    //                    newFilter.ActionId = actionId;
    //                break;

    //            case "workflow":
    //                if (int.TryParse(filter.Value, out int workflowId))
    //                    newFilter.WorkflowId = workflowId;
    //                break;

    //            case "user":
    //                if (int.TryParse(filter.Value, out int createUserId))
    //                    newFilter.CreateUserId = createUserId;
    //                break;

    //            case "createdatetimepersian":
    //                var createDates = filter.Value.Split('-');
    //                if (createDates.Length == 2)
    //                {
    //                    newFilter.FromCreateDate = createDates[0].ToMiladiDateTime();
    //                    newFilter.ToCreateDate = createDates[1].ToMiladiDateTime();
    //                }
    //                break;

    //            case "reservedatepersian":
    //                var reserveDates = filter.Value.Split('-');
    //                if (reserveDates.Length == 2)
    //                {
    //                    newFilter.FromReserveDate = reserveDates[0].ToMiladiDateTime();
    //                    newFilter.ToReserveDate = reserveDates[1].ToMiladiDateTime();
    //                }
    //                break;
    //        }
    //    }

    //    return newFilter;
    //}


    //public async Task<MyResultPage<List<AdmissionGetPage>>> GetPageLegacyAsync(
    //NewGetPageViewModel model,
    //int userId,
    //byte roleId,
    //byte companyId)
    //{
    //    // تبدیل فیلترهای قدیمی به جدید
    //    var newFilter = ConvertToNewFilter(model.Filters, userId, roleId, companyId);

    //    // ایجاد درخواست جدید
    //    var newRequest = new AdmissionGetPageRequest
    //    {
    //        PageNo = model.PageNo,
    //        PageRowsCount = model.PageRowsCount,
    //        Filters = newFilter
    //    };

    //    // فراخوانی متد جدید
    //    return await GetPageAsync(newRequest, userId, roleId);
    //}

    //public async Task<MyResultPage<List<AdmissionGetPage>>> GetPageAsync(
    //    AdmissionGetPageRequest request,
    //    int userId,
    //    byte roleId)
    //{
    //    try
    //    {
    //        context.Database.SetCommandTimeout(180); // 180 ثانیه

    //        var result = new MyResultPage<List<AdmissionGetPage>>
    //        {
    //            Data = new List<AdmissionGetPage>()
    //        };



    //        // 🔹 CashAmount رو جدا گروه‌بندی می‌کنیم
    //        var cashQuery =
    //            from ac in context.AdmissionCashes
    //            group ac by ac.AdmissionMasterId into g
    //            select new
    //            {
    //                AdmissionMasterId = g.Key,
    //                CashAmount = g.Sum(x => x.CashAmount)
    //            };

    //        // 🔹 اصل کوئری
    //        var query =
    //            from ads in context.AdmissionServices
    //            join am in context.AdmissionMasters on ads.AdmissionMasterId equals am.Id
    //            join sm in context.Stages on am.StageId equals sm.Id
    //            join s in context.Stages on ads.StageId equals s.Id into stageJoin
    //            from s in stageJoin.DefaultIfEmpty()
    //            join a in context.Actions on ads.ActionId equals a.Id into actionJoin
    //            from a in actionJoin.DefaultIfEmpty()
    //            join w in context.Workflows on ads.WorkflowId equals w.Id into workflowJoin
    //            from w in workflowJoin.DefaultIfEmpty()
    //            join att in context.Attenders on ads.AttenderId equals att.Id into attJoin
    //            from att in attJoin.DefaultIfEmpty()
    //            join b in context.Branches on ads.BranchId equals b.Id into branchJoin
    //            from b in branchJoin.DefaultIfEmpty()
    //            join u in context.Users on ads.CreateUserId equals u.Id into userJoin
    //            from u in userJoin.DefaultIfEmpty()
    //            join pat in context.Patients on ads.PatientId equals pat.Id into patJoin
    //            from pat in patJoin.DefaultIfEmpty()
    //            join dts in context.DepartmentTimeShifts on ads.ReserveShiftId equals dts.Id into dtsJoin
    //            from dts in dtsJoin.DefaultIfEmpty()
    //            join cash in cashQuery on am.Id equals cash.AdmissionMasterId into cashJoin
    //            from cash in cashJoin.DefaultIfEmpty()
    //            where sm.WorkflowCategoryId == 10
    //            select new
    //            {
    //                ads,
    //                AdmissionMasterWorkflowCategoryId = sm.WorkflowCategoryId,
    //                AttenderName = att.FullName,
    //                BranchName = b.Name,
    //                StageName = s.Name,
    //                ActionName = a.Name,
    //                WorkflowName = w.Name,
    //                PatientFullName = pat.FullName,
    //                PatientNationalCode = pat.NationalCode,
    //                ReserveShiftName = dts.ShiftName,
    //                CreateUserFullName = u.FullName,
    //                CashAmount = cash.CashAmount
    //            };

    //        // 📌 فیلترها
    //        var f = request.Filters;

    //        if (f.Id.HasValue)
    //            query = query.Where(x => x.ads.Id == f.Id.Value);

    //        if (f.AdmissionMasterId.HasValue)
    //            query = query.Where(x => x.ads.AdmissionMasterId == f.AdmissionMasterId.Value);

    //        if (f.PatientId.HasValue)
    //            query = query.Where(x => x.ads.PatientId == f.PatientId.Value);

    //        if (f.AttenderId.HasValue)
    //            query = query.Where(x => x.ads.AttenderId == f.AttenderId.Value);

    //        if (f.StageId.HasValue)
    //            query = query.Where(x => x.ads.StageId == f.StageId.Value);

    //        if (f.ActionId.HasValue)
    //            query = query.Where(x => x.ads.ActionId == f.ActionId.Value);

    //        if (f.WorkflowId.HasValue)
    //            query = query.Where(x => x.ads.WorkflowId == f.WorkflowId.Value);

    //        if (f.FromCreateDate.HasValue && f.ToCreateDate.HasValue)
    //            query = query.Where(x =>
    //                x.ads.CreateDateTime >= f.FromCreateDate.Value &&
    //                x.ads.CreateDateTime <= f.ToCreateDate.Value);

    //        if (f.CreateUserId.HasValue)
    //            query = query.Where(x => x.ads.CreateUserId == f.CreateUserId.Value);

    //        if (f.RoleId.HasValue)
    //        {
    //            var roleIdVal = f.RoleId.Value;
    //            query = query.Where(x =>
    //                context.RoleWorkflowPermissions
    //                    .Any(rwp =>
    //                        rwp.BranchId == x.ads.BranchId &&
    //                        rwp.WorkflowId == x.ads.WorkflowId &&
    //                        rwp.StageId == x.ads.StageId &&
    //                        rwp.ActionId == x.ads.ActionId &&
    //                        rwp.RoleId == roleIdVal
    //                    )
    //            );
    //        }

    //        // 📌 صفحه‌بندی
    //        var pagedQuery = await query
    //            .OrderByDescending(x => x.ads.Id)
    //            .Skip(request.PageNo ?? 0)
    //            .Take(request.PageRowsCount ?? 50)
    //            .AsNoTracking()
    //            .ToListAsync();

    //        result.Columns = GetColumns();

    //        // 📌 اجرا
    //        result.Data = pagedQuery.Select(x => new AdmissionGetPage
    //        {
    //            Id = x.ads.Id,
    //            CentralId = x.ads.CentralId,
    //            AdmissionMasterId = x.ads.AdmissionMasterId,
    //            AdmissionMasterWorkflowCategoryId = x.AdmissionMasterWorkflowCategoryId,
    //            AttenderId = x.ads.AttenderId,
    //            AttenderName = x.AttenderName,
    //            BranchId = x.ads.BranchId,
    //            BranchName = x.BranchName,
    //            StageId = x.ads.StageId,
    //            StageName = x.StageName,
    //            ActionId = x.ads.ActionId,
    //            ActionName = x.ActionName,
    //            WorkflowId = x.ads.WorkflowId,
    //            WorkflowName = x.WorkflowName,
    //            CreateDateTime = x.ads.CreateDateTime,
    //            PatientId = x.ads.PatientId,
    //            PatientFullName = x.PatientFullName,
    //            PatientNationalCode = x.PatientNationalCode,
    //            ReserveShiftId = x.ads.ReserveShiftId,
    //            ReserveShiftName = x.ReserveShiftName,
    //            AdmissionNo = x.ads.AdmissionNo,
    //            ReserveDate = x.ads.ReserveDate,
    //            ReserveNo = x.ads.ReserveNo,
    //            CreateUserId = x.ads.CreateUserId,
    //            CreateUserFullName = x.CreateUserFullName,
    //            CashAmount = x.CashAmount ?? 0
    //        }).ToList();

    //        return result;
    //    }
    //    catch (Exception e)
    //    {
    //        Console.WriteLine(e);
    //        throw;
    //    }
    //}



    //#endregion

    public async Task<AdmissionDisplay> AdmissionDisplay(int id, int companyId)
    {
        try
        {
            using (var conn = Connection)
            {
                var sQuery = "mc.Spc_AdmissionService_Display";
                conn.Open();

                var result = await conn.QuerySingleOrDefaultAsync<AdmissionDisplay>(sQuery, new
                {
                    id,
                    companyId
                }, commandType: CommandType.StoredProcedure);
                conn.Close();

                return result;
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public async Task<CalAdmissionPrice> CalAdmissionPrice(GetCalAdmissionPrice model)
    {
        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_AdmissionService_CalPrice";
            conn.Open();
            var result =
                await conn.QueryFirstOrDefaultAsync<CalAdmissionPrice>(sQuery, model,
                    commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<MyResultDataQuery<AdmissionResultQuery>> Insert(AdmissionModel model, bool updateAdmission)
    {
        var result = new MyResultDataQuery<AdmissionResultQuery>
        {
            Data = new AdmissionResultQuery()
        };

        if (model.AdmissionPatient.NotNull())
        {
            model.AdmissionPatient.FirstName = model.AdmissionPatient.FirstName.ConvertArabicAlphabet().RemoveDigits();
            model.AdmissionPatient.LastName = model.AdmissionPatient.LastName.ConvertArabicAlphabet().RemoveDigits();
            model.AdmissionPatient.FatherFirstName =
                model.AdmissionPatient.FatherFirstName.ConvertArabicAlphabet().RemoveDigits();
        }

        var masterModel = new AdmissionMasterModel();

        masterModel.Id = model.AdmissionMasterId;
        masterModel.AdmissionPatientJSON = model.AdmissionPatient;
        masterModel.WorkflowId = model.AdmissionMasterWorkflowId;
        masterModel.StageId = model.AdmissionMasterStageId;
        masterModel.BranchId = model.BranchId;
        masterModel.CreateUserId = model.CreateUserId;
        masterModel.CreateDateTime = model.CreateDateTime;

        var saveMasterResult = await admissionMasterRepository.Save(masterModel);

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

        //model.PatientId = model.AdmissionPatient.Id;

        var getAction = new GetAction();
        var stageAction = new ActionModel();

        if (model.Id == 0)
        {
            getAction.CompanyId = model.CompanyId;
            getAction.StageId = model.StageId;
            getAction.WorkflowId = model.WorkflowId;
            getAction.Priority = 1;
            stageAction = await stageActionRepository.GetAction(getAction);
        }
        else
        {
            if (updateAdmission)
            {
                var actionId = await GetLastActionId(model.Id);
                getAction.CompanyId = model.CompanyId;
                getAction.StageId = model.StageId;
                getAction.WorkflowId = model.WorkflowId;
                getAction.ActionId = actionId;
                stageAction = await stageActionRepository.GetAction(getAction);
                if (stageAction.MedicalRevenue == 3)
                    return new MyResultDataQuery<AdmissionResultQuery>
                    {
                        Data = new AdmissionResultQuery
                        {
                            Id = model.Id, AdmissionMasterId = model.AdmissionMasterId, Status = -100,
                            Successfull = false
                        },
                        Successfull = false,
                        ValidationErrors = new List<string> { "امکان ویرایش پذیرش وجود ندارد" }
                    };
            }
        }

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionService_InsUpd]";

            conn.Open();

            result.Data = await conn.QueryFirstAsync<AdmissionResultQuery>(sQuery, new
            {
                model.Id,
                model.CentralId,
                model.AdmissionMasterId,
                model.PatientId,
                model.StageId,
                model.WorkflowId,
                model.BookingTypeId,
                model.MedicalSubjectId,
                model.BasicInsurerId,
                model.BasicInsurerLineId,
                model.BasicInsurerNo,
                model.BasicInsurerBookletPageNo,
                model.BasicInsurerExpirationDate,
                model.CompInsurerId,
                model.CompInsurerLineId,
                model.ThirdPartyInsurerId,
                model.DiscountInsurerId,
                model.AttenderId,
                model.AttenderScheduleBlockId,
                model.ReserveShiftId,
                model.ReserveNo,
                model.ReserveDate,
                model.ReserveTime,
                model.ReferringDoctorId,
                model.BranchId,
                model.CompanyId,
                model.CreateUserId,
                model.CreateDateTime,
                AdmissionServiceLineJSON = JsonConvert.SerializeObject(model.AdmissionLineServiceList),
                ExtraPropertyJSON = JsonConvert.SerializeObject(model.AdmissionExtraPropertyList)
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            result.Data.DateTime = model.CreateDateTime;
            result.Message = result.Data.StatusMessage;

            result.Successfull = result.Data.Status == 100;
            result.Data.AdmissionMasterId = model.AdmissionMasterId;

            if (result.Successfull)
            {
                result.Data.StatusMessage = "پذیرش با موفقیت ثبت شد";

                if (model.AdmissionDiagnosisList.ListHasRow())
                {
                    var resultDiagnosisSave = await admissionDiagnosisRepository.SaveDiagnosis(model.CreateDateTime,
                        result.Data.Id, model.AdmissionDiagnosisList);
                    if (resultDiagnosisSave.Successfull)
                        result.Data.StatusMessage = "پذیرش و تشخیص اولیه با موفقیت ثبت شد";
                }
                else
                {
                    var resultDiagnosisDelete = await admissionDiagnosisRepository.DeleteDiagnosisList(result.Data.Id);
                    if (resultDiagnosisDelete.Successfull)
                        result.Data.StatusMessage = "پذیرش با موفقیت ثبت شد";
                }

                if (model.Id == 0)
                {
                    var stageActionModel = new UpdateAction
                    {
                        RequestActionId = stageAction.ActionId,
                        WorkflowCategoryId = stageAction.WorkflowCategoryId,
                        IdentityId = result.Data.Id,
                        StageId = model.StageId,
                        WorkflowId = model.WorkflowId,
                        CompanyId = model.CompanyId,
                        UserId = model.CreateUserId
                    };
                    var resultLog = await stageActionLogRepository.StageActionLogInsert(stageActionModel);

                    var updateResult = await UpdateLastAction(model.AdmissionMasterId, result.Data.Id, 0,
                        stageAction.ActionId, model.PatientId, model.CreateUserId, model.CreateDateTime);
                }
            }
            else
            {
                result.ValidationErrors.Add(result.Message);
            }
        }


        return result;
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

    public async Task<MyResultDataQuery<MyResultStatus>> InsertAdmissionCashLine(AdmissionCashLineModel model)
    {
        var result = new MyResultDataQuery<MyResultStatus>
        {
            Data = new MyResultStatus()
        };

        result.ValidationErrors = new List<string>();

        if (model.Id == 0)
        {
            var validateResult = ValidateCashLine(model);
            if (validateResult.Count > 0)
            {
                var resultQuery = new MyResultStatus
                {
                    ValidationErrors = validateResult
                };

                return new MyResultDataQuery<MyResultStatus>
                {
                    Successfull = false,
                    Data = resultQuery
                };
            }
        }

        var getAction = new GetAction();
        var stageAction = new ActionModel();
        if (model.Id == 0)
        {
            getAction.CompanyId = model.CompanyId;
            getAction.StageId = model.StageId;
            getAction.WorkflowId = model.WorkflowId;
            getAction.Priority = 1;
            stageAction = await stageActionRepository.GetAction(getAction);
        }

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionCash_InsUpd]";
            conn.Open();

            result.Data = await conn.QueryFirstAsync<MyResultStatus>(sQuery, new
            {
                model.Id,
                model.AdmissionMasterId,
                model.StageId,
                model.WorkflowId,
                model.CreateDateTime,
                model.CreateUserId,
                model.BranchId,
                CashLineJSON = JsonConvert.SerializeObject(model.AdmissionLineCashList),
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            result.Message = result.Data.StatusMessage;

            result.Successfull = result.Data.Status == 100;


            if (result.Successfull)
            {
                if (model.Id == 0)
                {
                    var updateStepModel = new UpdateAction
                    {
                        RequestActionId = stageAction.ActionId,
                        WorkflowCategoryId = stageAction.WorkflowCategoryId,
                        IdentityId = result.Data.Id,
                        StageId = model.StageId,
                        WorkflowId = model.WorkflowId,
                        CompanyId = model.CompanyId,
                        UserId = model.CreateUserId
                    };

                    var resultLog = await stageActionLogRepository.StageActionLogInsert(updateStepModel);

                    var updateResult = await UpdateCashLastAction(result.Data.Id, stageAction.ActionId);
                }
            }
            else
            {
                result.ValidationErrors.Add(result.Data.StatusMessage);
            }
        }


        return result;
    }

    public async Task<MyResultStatus> UpdateLastAction(int admissionMasterId, int id, byte currentActionId,
        byte lastActionId, int patientId, int userId, DateTime releaseDateTime)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_UpdItem_Number]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                TableName = "mc.AdmissionService",
                ColumnName = "ActionId",
                Value = lastActionId,
                Filter = $"Id={id}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = result.Status == 100;

            var admissionStageAction = await GetStageAction(id);

            var getStageAction = new GetAction
            {
                WorkflowId = admissionStageAction.WorkflowId,
                StageId = admissionStageAction.StageId,
                ActionId = admissionStageAction.ActionId
            };

            var stageAction = await stageActionRepository.GetAction(getStageAction);


            if (stageAction.MedicalRevenue == 2)
            {
                var releaseScheduleBlockResult = await AttenderScheduleBlockRelease(id, userId, releaseDateTime);


                var centralId = await GetCentralId(id);

                if (centralId > 0)
                {
                    var patientInfo = await GetPatientInfo(id);
                    var sendSms = Sms.SendSMS(patientInfo.MobileNo,
                        $"بیمار محترم آقای/خانم  {patientInfo.PatientFullName} {Environment.NewLine} نوبت شما به شماره پیگیری {patientInfo.TrackingCode}  در تاریخ {patientInfo.ReturnDateTimePersian} با موفقیت مرجوع گردید {Environment.NewLine} سیستم نوبت دهی وبسلا.");
                }
            }

            if (result.Successfull)
            {
                var currentActionModel = new GetAction
                {
                    WorkflowId = admissionStageAction.WorkflowId,
                    StageId = admissionStageAction.StageId,
                    ActionId = currentActionId
                };
                var currentStageAction = await stageActionRepository.GetAction(currentActionModel);

                if (currentStageAction != null)
                    //تغییر گام از مرجوع به درخواست پذیرش 
                    if (currentStageAction.MedicalRevenue == 2 && stageAction.MedicalRevenue == 1)
                    {
                        var releaseScheduleBlockResult =
                            await AttenderScheduleBlockReserve(id, patientId, userId, releaseDateTime);
                    }

                var updateAmount =
                    await admissionMasterRepository.UpdateAdmissionMasterAmount(admissionMasterId, true);
            }

            return result;
        }
    }

    public async Task<List<string>> AdmissionServiceReturnCentral(int admissionCentralId, int admissionId
        , byte currentActionId, byte lastActionId)
    {
        var result = new List<string>();

        var admissionStageAction = await GetStageAction(admissionId);

        var currentActionModel = new GetAction
        {
            WorkflowId = admissionStageAction.WorkflowId,
            StageId = admissionStageAction.StageId,
            ActionId = currentActionId
        };

        var currentStageAction = await stageActionRepository.GetAction(currentActionModel);

        var getStageAction = new GetAction
        {
            WorkflowId = admissionStageAction.WorkflowId,
            StageId = admissionStageAction.StageId,
            ActionId = lastActionId
        };

        var requestStageAction = await stageActionRepository.GetAction(getStageAction);

        if (currentStageAction.NotNull() && requestStageAction.NotNull())
            // تغییر گام از درخواست پذیرش به مرجوع
            if (currentStageAction.MedicalRevenue == 1 && requestStageAction.MedicalRevenue == 2)
                // ابتدا چک می شود آیا پذیرش آنلاین هست یا خیر
                // در صورتی که پذیرش انلاین باشد ، سمت سنترال مرجوع صورت میگیرد  
                if (await CheckAdmissionServiceIsOnline(admissionId))
                {
                    var resultReturnCentral = await admissionServiceCentral.AdmissionSrviceReturn(admissionCentralId);

                    if (resultReturnCentral.HttpStatus == HttpStatusCode.Unauthorized
                        || resultReturnCentral.HttpStatus == HttpStatusCode.BadRequest
                        || resultReturnCentral.HttpStatus == HttpStatusCode.InternalServerError)
                    {
                        result.Add(" ارسال انجام نشد ، مجدد تلاش فرمایید");
                    }
                    else if (resultReturnCentral.HttpStatus == HttpStatusCode.NotAcceptable)
                    {
                        var validationError = resultReturnCentral.ValidationErrors;

                        result = validationError;
                    }
                }

        return result;
    }

    public async Task<MyResultStatus> UpdateReferringDoctorInfo(UpdateReferringDoctorInfo model)
    {
        if (model.PrescriptionDatePersian == "" || model.ReferringDoctorId == 0)
            return new MyResultStatus
            {
                Status = -100,
                StatusMessage = "اطلاعات ارسالی معتبر نمی باشد",
                Successfull = false
            };

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionService_ReferringDoctorInfo_Upd]";

            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.AdmissionServiceId,
                model.ReferringDoctorId,
                model.PrescriptionDate,
                model.UserId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = result.Status == 100;

            return result;
        }
    }

    public async Task<MyResultStatus> UpdateCashLastAction(int id, byte lastActionId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_UpdItem_Number]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                TableName = "mc.AdmissionCash",
                ColumnName = "ActionId",
                Value = lastActionId,
                Filter = $"Id={id}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = result.Status == 100;

            return result;
        }
    }

    public async Task<GeneratedReserve> GetSchduleBlockAutoReserve(GetGeneratedReserve model)
    {
        var currentDate = DateTime.Now;
      
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AttenderScheduleBlock_GetAutoReserve]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<GeneratedReserve>(sQuery, new
            {
                model.AttenderId,
                model.DepartmentTimeShiftId,
                CurrentDate =currentDate,
               CurrentTime=currentDate.ToString("HH:mm:ss"),
                model.IsOnline
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public List<AttenderWeekSchedule> GetAttenderSchedule(GetAttenderWeekSchedule model)
    {
        var shDate = new ShamsiDateTime();
        shDate.Init();

        var basedate_sh = PersianDateTime.ShamsiToMiladi(model.BaseDate);

        var startDate = shDate.MiladiDateTime.AddDays(-shDate.DayOfWeek);

        if (model.FuncType == "before")
            startDate = Convert.ToDateTime(basedate_sh).AddDays(-8);
        else if (model.FuncType == "next") startDate = Convert.ToDateTime(basedate_sh);


        var modelList = new List<AttenderWeekSchedule>();
        DateTime newDate;

        for (byte i = 1; i <= 7; i++)
        {
            var model1 = new AttenderWeekSchedule
            {
                WeekDay = i,
                WeekDayName = PersianDateTime.DayOfWeekName(i)
            };
            newDate = startDate.AddDays(i);
            if (newDate.Year == shDate.MiladiDateTime.Year && newDate.Month == shDate.MiladiDateTime.Month &&
                newDate.Day == shDate.MiladiDateTime.Day) model1.IsToday = true;

            model1.ShamsiDate = PersianDateTime.GetShamsiDate(newDate.ToShortDateString());
            model1.IsActive = newDate.Date >= shDate.MiladiDateTime.Date;

            modelList.Add(model1);
        }


        return modelList;
    }

    public async Task<List<ReserveItem>> GetAttenderReserveList(GetReservedItem model)
    {
        var list = new List<ReserveItem>();

        using (var conn = Connection)
        {
            string sQuery;
            sQuery = "[mc].[Spc_AttenderScheduleBlock_GetListForAdmission]";
            conn.Open();
            list = (await conn.QueryAsync<ReserveItem>(sQuery, new
            {
                model.AttenderId,
                model.DepartmentTimeShiftId,
                model.BranchId,
                model.AppointmentDate,
                model.IsOnline
            }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return list ?? null;
    }

    public async Task<List<AdmissionServiceLineGetList>> AdmissionServiceLineGetList(int id, int companyId)
    {
        using (var conn = Connection)
        {
            string sQuery;
            sQuery = "[mc].[Spc_AdmissionServiceLine_GetList]";
            conn.Open();
            var list = (await conn.QueryAsync<AdmissionServiceLineGetList>(sQuery,
                new { AdmissionId = id, CompanyId = companyId }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();

            return list ?? null;
        }
    }

    public List<string> ValidateCashLine(AdmissionCashLineModel model)
    {
        var error = new List<string>();


        if (model.AdmissionLineCashList != null)
            if (model.AdmissionLineCashList.Count > 0)
                if (model.AdmissionLineCashList.Any(x =>
                        ((x.FundTypeId >= 10 && x.FundTypeId <= 13) || x.FundTypeId == 16) && x.DetailAccountId == 0))
                    error.Add("تفصیل مشخص نشده");


        return error;
    }

    public async Task<byte> GetLastActionId(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<byte>(sQuery,
                new
                {
                    TableName = "mc.AdmissionService",
                    ColumnName = "ActionId",
                    Filter = $"Id={id}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<AdmissionSearch> GetAdmission(GetAdmissionSearch model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Admission_Search]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<AdmissionSearch>(sQuery,
                new
                {
                    model.StageId,
                    model.ActionId,
                    model.WorkflowId,
                    model.Id,
                    CreateDate = model.CreateDatePersian == "" ? null : model.CreateDatePersian,
                    PatientFullName = model.PatientFullName.ConvertArabicAlphabet(),
                    model.PatientNationalCode,
                    model.AttenderId,
                    model.CompanyId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<MyResultPage<List<SearchAdmission>>> SearchAdmissionInbound(GetSearchAdmission model, byte roleId)
    {
        var result = new MyResultPage<List<SearchAdmission>>
        {
            Data = new List<SearchAdmission>()
        };

        result.Columns = GetColumnsSearchInbound();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionService_Search]";
            conn.Open();
            var data = await conn.QueryAsync<SearchAdmission>(sQuery,
                new
                {
                    model.PageNo,
                    model.PageRowsCount,
                    model.Id,
                    model.WorkflowId,
                    model.StageId,
                    ActionId = 5, // ورود به اتاق
                    model.ReserveDate,
                    model.CreateDate,
                    model.PatientFullName,
                    model.PatientNationalCode,
                    model.UserId,
                    RoleId = roleId,
                    model.AttenderId,
                    HeaderTableName = "mc.PrescriptionTamin",
                    model.CompanyId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Data = data.AsList();
            return result;
        }
    }

    public async Task<HidInfo> GetHidInfo(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Admission_HIDInfo]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<HidInfo>(sQuery,
                new
                {
                    Id = id
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<List<AdmissionDiagnosisLineList>> GetAdmissionDiagnosis(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Admission_DiagnosisList]";
            conn.Open();
            var result = await conn.QueryAsync<AdmissionDiagnosisLineList>(sQuery,
                new
                {
                    AdmissionId = id
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result.ToList();
        }
    }

    public async Task<DateTime> GetCreateDate(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionService_GetCreateDate]";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<DateTime>(sQuery,
                new
                {
                    Id = id
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<short> GetBranchId(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionService_GetBranch]";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<short>(sQuery,
                new
                {
                    Id = id
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<AdmissionServiceGetReserveDate> GetReserveDateScheduleBlock(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionService_GetReserveDateTime]";

            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<AdmissionServiceGetReserveDate>(sQuery,
                new
                {
                    Id = id
                }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }


    public async Task<int> AdmissionService_CheckRevenue(int id, int worflowId, short stageId)
    {
        using (var conn = Connection)
        {
            var query = "[mc].[Spc_AdmissionService_CheckRevenue]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<int>(query,
                new
                {
                    OriginTransactionId = id,
                    OriginWorkflowId = worflowId,
                    OriginStageId = stageId
                }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<decimal> GetAdmissionAmount(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<decimal>(sQuery,
                new
                {
                    TableName = "mc.AdmissionService",
                    ColumnName = "AdmissionAmount",
                    Filter = $"Id={id}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<int> GetCentralId(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_AdmissionService_GetCentralId";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    Id = id
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }


    public async Task<MyResultStatus> SetAttenderScheduleBlockRelease(Guid attenderScheduleBlockId, int releaseUserId,
        DateTime releaseDateTime)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AttenderScheduleBlock_Release]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                AttenderScheduleBlockId = attenderScheduleBlockId,
                ReleaseUserId = releaseUserId,
                ReleaseDateTime = releaseDateTime
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = result.Status == 100;

            return result;
        }
    }

    public async Task<MyResultStatus> SetAttenderScheduleBlockReserve(int admissionId, int patientId,
        Guid attenderScheduleBlockId, int reserveUserId, DateTime reserveDateTime)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AttenderScheduleBlock_Reserve]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                AdmissionId = admissionId,
                PatientId = patientId,
                AttenderScheduleBlockId = attenderScheduleBlockId,
                ReserveUserId = reserveUserId,
                ReserveDateTime = reserveDateTime
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = result.Status == 100;

            return result;
        }
    }

    public async Task<MyResultStatus> AttenderScheduleBlockRelease(int admissionId, int releaseUserId,
        DateTime releaseDateTime)
    {
        var reserveScheduleBlockDateTime = await GetReserveDateScheduleBlock(admissionId);

        var SetAttenderScheduleBlockReleaseResult =
            await SetAttenderScheduleBlockRelease(reserveScheduleBlockDateTime.AttenderScheduleBlockId, releaseUserId,
                releaseDateTime);

        return SetAttenderScheduleBlockReleaseResult;
    }

    public async Task<MyResultStatus> AttenderScheduleBlockReserve(int admissionServiceId, int patientId,
        int releaseUserId, DateTime releaseDateTime)
    {
        var reserveScheduleBlockDateTime = await GetReserveDateScheduleBlock(admissionServiceId);

        var SetAttenderScheduleBlockReserveResult = await SetAttenderScheduleBlockReserve(admissionServiceId, patientId,
            reserveScheduleBlockDateTime.AttenderScheduleBlockId, releaseUserId, releaseDateTime);

        return SetAttenderScheduleBlockReserveResult;
    }

    public async Task<DataChartAdmission> GetAdmissionChart(GetChartAdmission model)
    {
        var data = new DataChartAdmission();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spr_ChartAdmission]";
            conn.Open();
            var result = await conn.QueryAsync<ChartAdmission>(sQuery,
                new
                {
                    model.CompanyId,
                    model.Type,
                    model.Date
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            data.ChartList = result.ToList();

            data.MaxAmount = data.ChartList.Count > 0 ? result.Max(s => s.SalesAmount) + 200000000 : 0;
            return data;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetDetailAccountByAdmissionId(int id, byte fundTypeId, int companyId)
    {
        var sQuery = "[mc].[Spc_DetailAccount_ByAdmissionMasterId]";
        var result = new List<MyDropDownViewModel>();
        using (var conn = Connection)
        {
            conn.Open();
            result = (await Connection.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    AdmissionMasterId = id,
                    FundTypeId = fundTypeId,
                    CompanyId = companyId
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<List<GetAdmissionReservedList>> GetAdmissionReservedList(int patientId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Patient_AdmissionReserve_GetList]";
            conn.Open();
            var result = await conn.QueryAsync<GetAdmissionReservedList>(sQuery, new
            {
                PatientId = patientId,
                ReserveDate = DateTime.Now
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result.ToList();
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetServiceListByAdmissionAttender(int attenderId,
        string fromWorkDayDatePersian, string toWorkDayDatePersian, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionServiceLine_AttenderService]";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    AttenderId = attenderId,
                    FromWorkDayDate = fromWorkDayDatePersian.ToMiladiDateTime(),
                    ToWorkDayDate = toWorkDayDatePersian.ToMiladiDateTime(),
                    CompanyId = companyId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<object> GetAdmissionInsurerThirdPartyStateGetList_V1(
        GetAdmissionFilterByInsurerThirdPartyState model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionService_Insurer_ThirdParty_State_GetList_V1]";
            conn.Open();

            var result = await conn.QueryFirstAsync<GetAdmissionDropDownListByDate>(sQuery,
                new
                {
                    model.Type,
                    model.BasicInsurerIds,
                    model.CompInsurerIds,
                    model.FromReserveDate,
                    model.ToReserveDate,
                    model.CompanyId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            if (model.Type == 8)
            {
                var query = new
                {
                    result.BasicInsurerList,
                    result.CompInsurerList,
                    result.ThirdPartyList,
                    result.DiscountList,
                    result.AttenderList,
                    result.ServiceList,
                    result.ServiceTypeList,
                    result.DepartmentList,
                    result.SpecialityList,
                    result.ReferringDoctorList,
                    result.StageList,
                    result.WorkflowList,
                    result.ActionList
                };
                return query;
            }

            if (model.Type == 2)
            {
                var query = new
                {
                    result.BasicInsurerLineList
                };
                return query;
            }

            if (model.Type == 3)
            {
                var query = new
                {
                    result.CompInsurerLineList
                };
                return query;
            }

            return null;
        }
    }

    public async Task<List<AggregationPrintAdmission>> GetAggregationPrintAdmission(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Admission_Print_Compress]";
            conn.Open();
            var result = await conn.QueryAsync<AggregationPrintAdmission>(sQuery,
                new
                {
                    Id = id
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result.AsList();
        }
    }

    public async Task<List<PrintAdmission>> GetSeparationPrintAdmission(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Admission_Print]";
            conn.Open();
            var result = await conn.QueryAsync<PrintAdmission>(sQuery,
                new
                {
                    Id = id
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result.ToList();
        }
    }

    public async Task<StandPrintAdmission> GetStandPrintAdmission(string AdmissionMasterId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Admission_Print_Stand]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<StandPrintAdmission>(sQuery,
                new
                {
                    AdmissionMasterId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<MyResultPage<List<PatientReservedList>>> GetPatientReservedList(NewGetPageViewModel model,
        byte roleId)
    {
        var result = new MyResultPage<List<PatientReservedList>>
        {
            Data = new List<PatientReservedList>()
        };
        result.Columns = model.Form_KeyValue[5]?.ToString() == "Replace"
            ? GetPatientReservedListColumns()
            : GetPatientReservedMoveListColumns();

        using (var conn = Connection)
        {
            conn.Open();
            int? patientId = null;

            if (model.Form_KeyValue[1]?.ToString() != null)
                patientId = int.Parse(model.Form_KeyValue[1]?.ToString());


            var sQuery = "[mc].[Spc_Patient_ReservedList]";
            result.Data = (await conn.QueryAsync<PatientReservedList>(sQuery, new
            {
                model.PageNo,
                model.PageRowsCount,
                PatientId = patientId,
                AttenderId = model.Form_KeyValue[0]?.ToString(),
                RoleId = roleId,
                FromReserveDate = model.Form_KeyValue[2]?.ToString().ToMiladiDateTime(),
                ToReserveDate = model.Form_KeyValue[3]?.ToString().ToMiladiDateTime(),
                CurrentDate = DateTime.Now,
                IsOnline = model.Form_KeyValue[4]?.ToString(),
                model.CompanyId
            }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();

            return result;
        }
    }

    public async Task<MyResultPage<List<PatientMovelist>>> GetPatientMovelist(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<PatientMovelist>>
        {
            Data = new List<PatientMovelist>()
        };

        int? DepartmentTimeShiftId = null;

        byte? DayInWeek = null;
        if (model.Form_KeyValue[7]?.ToString() != null)
            DayInWeek = DayOfWeekToMiladi(Convert.ToByte(model.Form_KeyValue[7]?.ToString()));

        result.Columns = GetPatientMovelistColumns();

        using (var conn = Connection)
        {
            conn.Open();

            var sQuery = "[mc].[Spc_AttenderScheduleBlock_GetPageForMove]";
            result.Data = (await conn.QueryAsync<PatientMovelist>(sQuery, new
            {
                model.PageNo,
                model.PageRowsCount,
                DepartmentTimeShiftId,
                AttenderId = model.Form_KeyValue[0]?.ToString(),
                FromAppointmentDate = model.Form_KeyValue[2]?.ToString().ToMiladiDateTime(),
                ToAppointmentDate = model.Form_KeyValue[3]?.ToString().ToMiladiDateTime(),
                StartTime = model.Form_KeyValue[5]?.ToString(),
                EndTime = model.Form_KeyValue[6]?.ToString(),
                DayInWeek,
                BranchId = model.Form_KeyValue[1]?.ToString(),
                IsOnline = model.Form_KeyValue[4]?.ToString()
            }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();

            return result;
        }
    }

    public async Task<MyResultStatus> UpdateReserveDatePatient(PatientReservedDateModel model)
    {
        var result = new MyResultStatus();


        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AttenderScheduleBlock_Replace]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.FromAttenderScheduleBlockId,
                model.ToAttenderScheduleBlockId,
                model.ReserveUserId,
                model.ReserveDateTime
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;

        return result;
    }

    public async Task<MyResultStatus> UpdateReserveMovePatient(PatientReservedMoveModel model)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AttenderScheduleBlock_Move]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.FromAttenderScheduleBlockIds,
                FromWorkDayDate = model.FromWorkDayDate.ToMiladiDateTime(),
                ToWorkDayDate = model.ToWorkDayDate.ToMiladiDateTime(),
                DepartmentTimeShiftId = model.DepartmentTimeShiftId > 0 ? model.DepartmentTimeShiftId : null,
                model.AttenderId,
                model.StartTime,
                model.ReserveUserId,
                model.ReserveDateTime,
                model.IsOnline
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;

        return result;
    }

    public async Task<List<string>> Validate(PatientReservedShiftModel model)
    {
        var error = new List<string>();

        if (model == null)
        {
            error.Add("درخواست معتبر نمی باشد");
            return error;
        }

        await Task.Run(async () =>
        {
            var resultCheckAttenderScheduleBlockShiftValidation = await CheckAttenderScheduleBlockShift(model);

            if (!resultCheckAttenderScheduleBlockShiftValidation.Successfull)
                error.Add(resultCheckAttenderScheduleBlockShiftValidation.StatusMessage);
        });

        return error;
    }

    public async Task<MyResultStatus> CheckAttenderScheduleBlockShift(PatientReservedShiftModel model)
    {
        var result = new MyResultStatus();
        TimeSpan? DestinationTime = null;
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AttenderScheduleBlock_ShiftValidation]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.FromAttenderScheduleBlockIds,
                DestinationTime,
                model.ShiftNo
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;

        return result;
    }

    public async Task<MyResultQuery> UpdateReserveShiftPatient(PatientReservedShiftModel model)
    {
        var result = new MyResultQuery();
        var validationError = await Validate(model);

        if (validationError.Count > 0)
            return new MyResultQuery
            {
                Status = -98,
                Successfull = false,
                StatusMessage = validationError[0],
                ValidationErrors = validationError
            };

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AttenderScheduleBlock_Shift]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                model.FromAttenderScheduleBlockIds,
                model.ReserveUserId,
                model.ReserveDateTime,
                model.ShiftNo
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;


        return result;
    }

    public async Task<List<string>> ValidationActionLogAdmissionService(UpdateAction model, byte roleId,
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


            // تغییر گام از مرجوع به درخواست پذیرش
            if (currentStageAction.MedicalRevenue == 2 && requestStageAction.MedicalRevenue == 1)
            {
                var reserveScheduleBlockDateTime = await GetReserveDateScheduleBlock(model.IdentityId);
                var validateScheduleBlockAvailabilityResult =
                    await ScheduleBlockCheckAvailability(reserveScheduleBlockDateTime.AttenderScheduleBlockId);

                if (!validateScheduleBlockAvailabilityResult)
                    errors.Add("نوبت این  پذیرش  قابل استفاده نمی باشد");
            }

            if ((currentStageAction.MedicalRevenue == 2 && requestStageAction.MedicalRevenue == 3) ||
                (currentStageAction.MedicalRevenue == 3 && requestStageAction.MedicalRevenue == 2))
                errors.Add("امکان تغییر گام وجود ندارد");

            if (currentStageAction.MedicalRevenue == 1 && requestStageAction.MedicalRevenue == 3)
                if (!requestStageAction.AdmissionMasterSettlement)
                {
                    var admissionAmount = await GetAdmissionAmount(model.IdentityId);

                    var admissionMasterAmountModel =
                        await admissionMasterRepository.GetAdmissionMasterAmounts(admissionMasterId);

                    //خالص درآمد
                    var netRevenueAmount = admissionAmount + admissionMasterAmountModel.Revenue3Amount -
                                           admissionMasterAmountModel.Revenue2Amount;

                    //جمع دریافت و پرداخت
                    var cashAmount = admissionMasterAmountModel.CashAmount;


                    var resultDifferenceRevenueCash = netRevenueAmount - cashAmount;


                    if (resultDifferenceRevenueCash != 0)
                        errors.Add(
                            " امکان تغییر گام وجود ندارد .خالص قابل دریافت پرونده از جمع دریافت و پرداخت بزرگتر می باشد");
                }

            if (requestStageAction.MedicalRevenue == 3)
            {
                var reserveScheduleBlockDateTime = await GetReserveDateScheduleBlock(model.IdentityId);

                var admissionReserveDateTime =
                    DateTime.Parse(
                        $"{Convert.ToDateTime(reserveScheduleBlockDateTime.ReserveDate).ToShortDateString()}");

                var currentDateTime = DateTime.Parse($"{DateTime.Now.ToShortDateString()}");

                if (admissionReserveDateTime > currentDateTime)
                    errors.Add("ورود به اتاق برای تاریخ های بزرگتر از امروز مجاز نمی باشد");
            }


            if (currentStageAction.MedicalRevenue == 3)

            {
                var checkRevenue =
                    await AdmissionService_CheckRevenue(model.IdentityId, model.WorkflowId, model.StageId);
                if (checkRevenue > 0)
                    errors.Add("مجاز به تغییر گام نمی باشید ،درخواست معتبر نیست");
            }
        });

        return errors;
    }

    public async Task<bool> ScheduleBlockCheckAvailability(Guid attenderScheduleBlockId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AttenderScheduleBlock_CheckAvailability]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<bool>(sQuery, new
            {
                AttenderScheduleBlockId = attenderScheduleBlockId
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
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            result = await conn.QueryFirstOrDefaultAsync<byte>(sQuery, new
            {
                TableName = "mc.AdmissionService",
                ColumnName = "actionid",
                Filter = $"Id={IdentityId}",
                OrderBy = ""
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
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
            var validateAdmissionResult = await ValidateCheckAdmissionPermission(admissionPermissionModel);
            if (validateAdmissionResult != "")
                errors.Add(validateAdmissionResult);

            #endregion


            var action = new GetAction();

            var currentActionId = await GetActionIdByIdentityId(model.IdentityId);
            action.StageId = model.StageId;
            action.ActionId = currentActionId;
            action.WorkflowId = model.WorkflowId;
            var currentStageAction = await stageActionRepository.GetAction(action);

            if (currentStageAction.IsDeleteHeader && currentStageAction.MedicalRevenue != 3)
            {
                var admissionAmount = await GetAdmissionAmount(model.IdentityId);

                var admissionMasterAmountModel =
                    await admissionMasterRepository.GetAdmissionMasterAmounts(admissionMasterId);

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

    public async Task<MyResultStatus> DeleteAdmissionService(int admissionMasterId, int id, short branchId, byte roleId,
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
            var sQuery = "[mc].[Spc_AdmissionService_Del]";
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
                    TableName = "mc.AdmissionService",
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

    private async Task<bool> CheckAdmissionServiceIsOnline(int admissionId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionService_CheckOnline]";

            conn.Open();

            var result = await conn.ExecuteScalarAsync<bool>(sQuery, new
            {
                Id = admissionId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<AdmissionPatientInfo> GetPatientInfo(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionService_GetPatientInfo]";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<AdmissionPatientInfo>(sQuery, new
            {
                Id = id
            }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }
}