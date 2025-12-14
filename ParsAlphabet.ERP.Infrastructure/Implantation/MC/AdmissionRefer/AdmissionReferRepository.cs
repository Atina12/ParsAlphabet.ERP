using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionRefer;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionWebService;
using ParsAlphabet.ERP.Application.Interfaces._ErrorLog;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces._Setup;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Application.Interfaces.MC;
using ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionRefer;
using ParsAlphabet.ERP.Infrastructure.Implantation._Login;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Admission;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionDiagnosis;
using ParsAlphabet.WebService.Api.Model.CIS;
using ParseAlphabet.ERP.Web.WebServices.CIS;
using static ParseAlphabet.ERP.Web.WebServices.CIS.BindingCisApiServices;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionRefer;

public class AdmissionReferRepository : IAdmissionReferRepository
{
    private readonly IConfiguration _config;
    private readonly ILoginRepository _loginRepository;
    private readonly IHttpContextAccessor _accessor;
    private readonly AdmissionServiceRepository _admissionRepository;
    private readonly IAdmissionsRepository _admissionsRepository;
    private readonly IHttpClientFactory _clientFactory;
    private readonly ICompanyRepository _companyRepository;
    private readonly IConfiguration _configuration;
    private readonly IErrorLogRepository _errorLogRepository;
    private readonly ISetupRepository _setupRepository;

    public AdmissionReferRepository(
     
        IAdmissionsRepository admissionsRepository,
        AdmissionServiceRepository admissionRepository,
        IErrorLogRepository errorLogRepository,
        IHttpContextAccessor accessor,
        IConfiguration configuration,
        ISetupRepository setupRepository,
        ICompanyRepository companyRepository,
        IHttpClientFactory clientFactory,
         AdmissionDiagnosisRepository admissionDiagnosisRepository,
        ILoginRepository loginRepository)
    {
        _setupRepository = setupRepository;
        _errorLogRepository = errorLogRepository;
        _accessor = accessor;
        _configuration = configuration;
     
        _admissionsRepository = admissionsRepository;
        _admissionRepository = admissionRepository;
        //_attenderPrescriptionRepository = attenderPrescriptionRepository;
        _companyRepository = companyRepository;
        _clientFactory = clientFactory;
    
        _loginRepository = loginRepository;
    }
  
    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه ثبت", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 5
                },
                new()
                {
                    Id = "admissionReferType", Title = "نوع ارسال", Type = (int)SqlDbType.NVarChar, IsPrimary = true,
                    Size = 10, IsDtParameter = true, Width = 12
                },
                new()
                {
                    Id = "referredDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "persiandate", Width = 12
                },
                new()
                {
                    Id = "referredType", Title = "نوع ارجاع", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 12
                },
                new()
                {
                    Id = "referredReasonName", Title = "دلیل ارجاع", Type = (int)SqlDbType.VarChar,
                    IsDtParameter = true, Width = 9
                },
                new()
                {
                    Id = "admissionId", Title = "شناسه پذیرش", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 10, IsFilterParameter = true, FilterType = "number"
                },
                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "attender", Title = "طبیب", Type = (int)SqlDbType.NVarChar, Size = 10, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "isCompSentName", Title = "وضعیت ارسال", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 10
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "displayrefer", Title = "نمایش", ClassName = "btn green_outline_1",
                    IconName = "far fa-file-alt"
                },
                //new GetActionColumnViewModel{Name="printrefer",Title="چاپ",ClassName="btn blue_1",IconName="fa fa-print"},
                new() { Name = "editrefer", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" }
                //new GetActionColumnViewModel{Name="sep1",Title="",ClassName="",IconName="", IsSeparator=true},
            }
        };

        return list;
    }

    public GetColumnsViewModel GetColumnsReferredSend()
    {
        var list = new GetColumnsViewModel
        {
            IsSelectable = true,
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه ثبت", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", IsPrimary = true, Width = 7
                },
                new()
                {
                    Id = "admissionId", Title = "شناسه پذیرش", Type = (int)SqlDbType.Int, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "number", Width = 9
                },
                new()
                {
                    Id = "hid", Title = "شناسه شباد", Type = (int)SqlDbType.VarChar, Size = 11, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "referDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "persiandate", Width = 10
                },
                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, Width = 15
                },
                new()
                {
                    Id = "patientNationalCode", Title = "نمبر تذکره مراجعه کننده", Type = (int)SqlDbType.NVarChar,
                    Size = 10, IsDtParameter = true, FilterType = "strnumber", Width = 10
                },
                new()
                {
                    Id = "referringDoctor", Title = "پزشک ارجاع دهنده", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "referredReasonName", Title = "دلیل ارجاع", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "referredType", Title = "نوع ارجاع", Type = (int)SqlDbType.VarChar, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "admissionRefer", Title = "مجوز ارسال", Type = (int)SqlDbType.Bit, IsDtParameter = false,
                    Width = 10, IsPrimary = true
                },
                new()
                {
                    Id = "sentResultName", Title = "وضعیت ارسال", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10, Align = "center"
                },
                new()
                {
                    Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 9,
                    Align = "center"
                }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "activeReferallId", Title = "دریافت شناسه ارحاع بر اساس نمبر تذکره",
                    ClassName = "btn green_outline_1", IconName = "far fa-file-alt"
                }
            }
        };

        return list;
    }

    public GetColumnsViewModel GetColumnFeedBackSend()
    {
        var list = new GetColumnsViewModel
        {
            IsSelectable = true,
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه ثبت", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, IsPrimary = true, Width = 10
                },
                new()
                {
                    Id = "admissionId", Title = "شناسه پذیرش", Type = (int)SqlDbType.Int, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "hid", Title = "شناسه شباد", Type = (int)SqlDbType.VarChar, Size = 11, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "referDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, Width = 15
                },
                new()
                {
                    Id = "patientNationalCode", Title = "نمبر تذکره مراجعه کننده", Type = (int)SqlDbType.NVarChar,
                    Size = 10, IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "referringDoctor", Title = "پزشک ارجاع دهنده", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "referredReasonName", Title = "دلیل ارجاع", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "referredType", Title = "نوع ارجاع", Type = (int)SqlDbType.VarChar, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "admissionFeedback", Title = "مجوز دریافت بازخورد", Type = (int)SqlDbType.Bit,
                    IsDtParameter = false, Width = 10, IsPrimary = true
                },
                new()
                {
                    Id = "getResultName", Title = "وضعیت دریافت بازخورد", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10, Align = "center"
                }
            }
            //Buttons = new List<GetActionColumnViewModel>()
            //{
            //    new GetActionColumnViewModel{Name="displaysendfeedback",Title="نمایش بازخورد",ClassName="btn green_outline_1",IconName="far fa-file-alt", Condition=new ConditionPageTable(){FieldName="",FieldValue="",Operator="" } },
            //}
        };

        return list;
    }

    public async Task<MyResultPage<List<AdmissionReferGetPage>>> GetPage(NewGetPageViewModel model, int userId)
    {
        var result = new MyResultPage<List<AdmissionReferGetPage>>();


        var referDateMiladi = (DateTime?)null;

        if (model.Filters.Any(x => x.Name == "referredDateTimePersian"))
            referDateMiladi = model.Filters.FirstOrDefault(x => x.Name == "referredDateTimePersian").Value.Split('-')[0]
                .ToMiladiDateTime();
        result.Columns = GetColumns();
        var dt = referDateMiladi.ToString().Split(" ")[0];
        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("ReferDate", referDateMiladi);
        parameters.Add("AdmissionId",
            model.Filters.Any(x => x.Name == "admissionId")
                ? model.Filters.FirstOrDefault(x => x.Name == "admissionId").Value
                : null);
        parameters.Add("PatientFullName",
            model.Filters.Any(x => x.Name == "patient")
                ? model.Filters.FirstOrDefault(x => x.Name == "patient").Value
                : null);
        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);


        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "AdmissionReferApi",
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
        }
        else
        {
            parameters.Add("CreateUserId", int.Parse(model.Form_KeyValue[1]?.ToString()));
        }


        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionRefer_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<AdmissionReferGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    //public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model)
    //{
    //    CSVViewModel<IEnumerable> result = new CSVViewModel<IEnumerable>
    //    {
    //        Columns = string.Join(',', GetColumns().DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
    //    };

    //    MyResultPage<List<AdmissionReferGetPage>> getPage = await GetPage(model);
    //    result.Rows = (from r in getPage.Data
    //                   select new
    //                   {
    //                       r.Id,
    //                       r.AdmissionReferTypeName,
    //                       r.ReferredDateTimePersian,
    //                       r.ReferredTypeName,
    //                       r.ReferredReasonName,
    //                       r.AdmissionId,
    //                       r.PatientFullName,
    //                       r.AttenderFullName,
    //                       r.IsCompSentName

    //                   });
    //    return result;
    //}

    public async Task<bool> CheckExist(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "mc.AdmissionRefer",
                ColumnName = "Id",
                Filter = $"Id={id} AND CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result > 0;
        }
    }
    //public async Task<MyResultStatus> SaveAdmissionRefer(AdmissionRefer model)
    //{
    //    var result = new MyResultStatus();

    //    var followUps = new List<FollowUp>();
    //    followUps.Add(new FollowUp
    //    {
    //        NextEncounterDateTime = model.FollowUpDateTime,
    //        NextEncounter = model.FollowUpNextEncounter,
    //        NextEncounterUnitId = model.FollowUpNextEncounterUnitId,
    //        NextEncounterType = model.FollowUpNextEncounterType,
    //        Description = model.FollowUpDescription
    //    });
    //    using (IDbConnection conn = Connection)
    //    {
    //        string sQuery = "[mc].[Spc_AdmissionRefer_InsUpd]";
    //        conn.Open();

    //        result = await conn.QueryFirstAsync<MyResultStatus>(sQuery, new
    //        {
    //            model.Opr,
    //            model.Id,
    //            model.AdmissionId,
    //            model.AdmissionReferTypeId,
    //            model.LifeCycleStateId,
    //            model.CompanyId,
    //            model.IsQueriable,
    //            model.ReferredReasonId,
    //            model.ReferredTypeId,
    //            model.ReferredDescription,
    //            model.ReferringDoctorId,
    //            model.AdmitingDoctorId,
    //            model.AdmitingDoctorSpecialityId,
    //            model.AdmitingDoctorMscId,
    //            CreateDateTime = model.ReferredDateTime,
    //            model.CreateUserId,
    //            model.ReferralId,
    //            model.RelatedHID,
    //            FollowUpJSON = JsonConvert.SerializeObject(followUps),
    //            AbuseHistoryLineJSON = JsonConvert.SerializeObject(model.AdmissionReferAbuseHistoryLines),
    //            BloodPressureLineJSON = model.AdmissionReferBloodPressureLines != null ? JsonConvert.SerializeObject(model.AdmissionReferBloodPressureLines) : null,
    //            CareActionLineJSON = JsonConvert.SerializeObject(model.AdmissionReferCareActionLines),
    //            ClinicFindingLineJSON = JsonConvert.SerializeObject(model.AdmissionReferClinicFindingLines),
    //            DrugHistoryLineJSON = JsonConvert.SerializeObject(model.AdmissionReferDrugHistoryLines),
    //            DrugOrderedLineJSON = JsonConvert.SerializeObject(model.AdmissionReferDrugOrderedLines),
    //            FamilyHisotryLineJSON = JsonConvert.SerializeObject(model.AdmissionReferalFamilyHisotryLines),
    //            HeightWeightLineJSON = model.AdmissionReferHeightWeightLines != null ? JsonConvert.SerializeObject(model.AdmissionReferHeightWeightLines) : null,
    //            MedicalHisotryLineJSON = JsonConvert.SerializeObject(model.AdmissionReferMedicalHistoryLines),
    //            PulseLineJSON = model.AdmissionReferPulseLines != null ? JsonConvert.SerializeObject(model.AdmissionReferPulseLines) : null,
    //            VitalSignsLineJSON = model.AdmissionReferVitalSignsLines != null ? JsonConvert.SerializeObject(model.AdmissionReferVitalSignsLines) : null,
    //            WaistHipLineJSON = model.AdmissionReferWaistHipLines != null ? JsonConvert.SerializeObject(model.AdmissionReferWaistHipLines) : null,
    //            AdverseReactionLineJSON = JsonConvert.SerializeObject(model.AdmissionReferAdverseReactionLines)

    //        }, commandType: CommandType.StoredProcedure);
    //        conn.Close();

    //        result.Successfull = result.Status == 0;
    //    }

    //    if (model.AdmissionReferDiagnosisLines != null)
    //        if (model.AdmissionReferDiagnosisLines.Count > 0)
    //            await _admissionDiagnosisRepository.SaveDiagnosis(DateTime.Now, model.AdmissionId, model.AdmissionReferDiagnosisLines);


    //    return result;

    //}

    //public async Task<MyResultStatus> SaveAdmissionFeedback(AdmissionRefer model)
    //{
    //    var result = new MyResultStatus();

    //    var followUps = new List<FollowUp>();
    //    followUps.Add(new FollowUp
    //    {
    //        NextEncounterDateTime = model.FollowUpDateTime,
    //        NextEncounter = model.FollowUpNextEncounter,
    //        NextEncounterUnitId = model.FollowUpNextEncounterUnitId,
    //        NextEncounterType = model.FollowUpNextEncounterType,
    //        Description = model.FollowUpDescription
    //    });

    //    using (IDbConnection conn = Connection)
    //    {
    //        string sQuery = "[mc].[Spc_AdmissionFeedBack_InsUpd]";
    //        conn.Open();

    //        result = await conn.QueryFirstAsync<MyResultStatus>(sQuery, new
    //        {
    //            model.Opr,
    //            model.Id,
    //            model.AdmissionId,
    //            model.AdmissionReferTypeId,
    //            model.LifeCycleStateId,
    //            model.CompanyId,
    //            model.IsQueriable,
    //            model.ReferringDoctorId,
    //            CreateDateTime = DateTime.Now,
    //            model.CreateUserId,
    //            model.ReferralId,
    //            model.RelatedHID,
    //            model.ReferringDoctorFirstName,
    //            model.ReferringDoctorLastName,
    //            model.ReferringDoctorSpecialityCode,
    //            model.ReferringDoctorRoleCode,
    //            model.ReferringDoctorMsc,
    //            model.ReferringDoctorMscTypeId,
    //            FollowUpJSON = JsonConvert.SerializeObject(followUps),
    //            AbuseHistoryLineJSON = JsonConvert.SerializeObject(model.AdmissionReferAbuseHistoryLines),
    //            CareActionLineJSON = JsonConvert.SerializeObject(model.AdmissionReferCareActionLines),
    //            ClinicFindingLineJSON = JsonConvert.SerializeObject(model.AdmissionReferClinicFindingLines),
    //            DrugHistoryLineJSON = JsonConvert.SerializeObject(model.AdmissionReferDrugHistoryLines),
    //            DrugOrderedLineJSON = JsonConvert.SerializeObject(model.AdmissionReferDrugOrderedLines),
    //            FamilyHisotryLineJSON = JsonConvert.SerializeObject(model.AdmissionReferalFamilyHisotryLines),
    //            MedicalHisotryLineJSON = JsonConvert.SerializeObject(model.AdmissionReferMedicalHistoryLines)
    //        }, commandType: CommandType.StoredProcedure);
    //        conn.Close();
    //        result.Successfull = result.Status == 0;
    //    }

    //    if (model.AdmissionReferDiagnosisLines != null)
    //        if (model.AdmissionReferDiagnosisLines.Count > 0)
    //            await _admissionDiagnosisRepository.SaveDiagnosis(DateTime.Now, model.AdmissionId, model.AdmissionReferDiagnosisLines);


    //    return result;

    //}

    public async Task<MyResultPage<List<AdmissionReferSendGetPage>>> AdmissionReferSend_GetPage(GetPageViewModel model)
    {
        var result = new MyResultPage<List<AdmissionReferSendGetPage>>();

        int? p_id = 0, p_admissionId = 0;
        string patient_fullName = "", attender_fullName = "", p_createDatePersian = "";

        switch (model.FieldItem)
        {
            case "id":
                p_id = Convert.ToInt32(model.FieldValue);
                break;
            case "admissionId":
                p_admissionId = Convert.ToInt32(model.FieldValue);
                break;
            case "patient":
                patient_fullName = model.FieldValue;
                break;
            case "referringDoctorFullName":
                attender_fullName = model.FieldValue;
                break;
            case "referDateTimePersian":
                p_createDatePersian = model.FieldValue;
                break;
        }

        result.Columns = GetColumnsReferredSend();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id", p_id == 0 ? null : p_id);
        parameters.Add("ReferDateTimePersian", p_createDatePersian == "" ? null : p_createDatePersian);
        parameters.Add("AdmissionId", p_admissionId == 0 ? null : p_admissionId);
        parameters.Add("PatientFullName", patient_fullName == "" ? null : patient_fullName);
        parameters.Add("AttenderFullName", attender_fullName == "" ? null : attender_fullName);
        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionSendRefer_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<AdmissionReferSendGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }


        return result;
    }

    public async Task<MyResultPage<List<AdmissionReferSendFeedBackPage>>> AdmissionReferSendFeedBack_GetPage(
        GetPageViewModel model)
    {
        var result = new MyResultPage<List<AdmissionReferSendFeedBackPage>>();

        int? p_id = 0, p_admissionId = 0;
        string patient_fullName = "", attender_fullName = "", p_createDatePersian = "";

        switch (model.FieldItem)
        {
            case "id":
                p_id = Convert.ToInt32(model.FieldValue);
                break;
            case "admissionId":
                p_admissionId = Convert.ToInt32(model.FieldValue);
                break;
            case "patient":
                patient_fullName = model.FieldValue;
                break;
            case "referringDoctor":
                attender_fullName = model.FieldValue;
                break;
            case "referDateTimePersian":
                p_createDatePersian = model.FieldValue;
                break;
        }

        result.Columns = GetColumnFeedBackSend();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id", p_id == 0 ? null : p_id);
        parameters.Add("ReferDateTimePersian", p_createDatePersian == "" ? null : p_createDatePersian);
        parameters.Add("AdmissionId", p_admissionId == 0 ? null : p_admissionId);
        parameters.Add("PatientFullName", patient_fullName == "" ? null : patient_fullName);
        parameters.Add("AttenderFullName", attender_fullName == "" ? null : attender_fullName);
        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);


        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionSendFeedback_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<AdmissionReferSendFeedBackPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }


    public async Task<IEnumerable<MyDropDownViewModel>> GetThrFollowUpPlaneType()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrFollowupPlanType",
                    TitleColumnName = "ISNULL(Name,'')"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> LifeCycleStateId()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrLifeCycle",
                    TitleColumnName = "ISNULL(Code,'')+' - '+ISNULL(Name,'')"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> ReferredReasonId()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrREFERREDREASON"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> ReferredTypeId()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrReferredType"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> AbuseDurationUnitId()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrUCUM",
                    TitleColumnName = "ISNULL(Name,'') + ISNULL(Description,'')",
                    Filter = "IsAbuseDuration=1"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> SubstanceTypeId()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrSNOMEDCT",
                    TitleColumnName = "ISNULL(Name,'')+' '+ISNULL(Description,'')",
                    Filter = "IsAbuse=1"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> AmountOfAbuseUnitId()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrUCUM",
                    TitleColumnName = "ISNULL(Name,'') + ISNULL(Description,'')",
                    Filter = "IsAbuseAmount=1"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> ReactionId(string term)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrSNOMEDCT",
                    TitleColumnName = "ISNULL(Name,'')+' - '+ISNULL(Description,'')",
                    Filter = "IsReaction=1"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> ReactionCategoryId(string term)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrSNOMEDCT",
                    TitleColumnName = "ISNULL(Name,'')+' '+ISNULL(Description,'')",
                    Filter = "IsReactionCategory=1"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> DiagnosisSeverityId()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrORDINALTERM"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> CausativeAgentId(string term)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrERX",
                    Filter = $"Code='{(int.TryParse(term, out _) ? term : "0")}' OR Name Like '%{term}%'"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> CausativeAgentCategoryId(string term)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrSNOMEDCT",
                    TitleColumnName = "ISNULL(Name,'')+' '+ISNULL(Description,'')",
                    Filter = "IsCausativeAgentCategory=1"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> ConditionId(string term)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrICD",
                    IdColumnName = "Id",
                    TitleColumnName = "Value",
                    Filter = $"Code='{(int.TryParse(term, out _) ? term : "0")}' OR Value Like N'%{term}%'"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> RelatedPersonId()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrRELATEDPERSON"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> PositionId()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrSNOMEDCT",
                    TitleColumnName = "ISNULL(Name,'')+' - '+ISNULL(Description,'')",
                    Filter = "IsBloodPressure=1"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> ActionNameId(string term)
    {
        var filter = $"Code='{(int.TryParse(term, out _) ? term : "0")}' OR Name Like N'%{term}%'";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrRVU",
                    TitleColumnName = "ISNULL(Name,'')+' - '+CAST(ISNULL(Code,0) AS VARCHAR(10))",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> TimeTakenUnitId()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrUCUM",
                    TitleColumnName = "ISNULL(Name,'') + ISNULL(Description,'')",
                    Filter = "IsTimeTaken=1"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> OnSetDurationToPresentUnitId_Clinical()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrUCUM",
                    TitleColumnName = "ISNULL(Name,'') + ISNULL(Description,'')",
                    Filter = "Is_Clinical_OnsetDurationToPresent=1"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> Finding(string term)

    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrICD",
                    IdColumnName = "Id",
                    TitleColumnName = "Value",
                    Filter = $"Code='{term}' OR Value Like N'%{term}%'"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> SeverityId(string term)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrORDINALTERM"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> ErxId(string term)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrERX",
                    Filter = $"Code='{(int.TryParse(term, out _) ? term : "0")}' OR Name Like '%{term}%'"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetPulseCharacter()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrSNOMEDCT",
                    TitleColumnName = "ISNULL(Name,'')+ ' - ' +ISNULL(Description,'')",
                    Filter = "IsCharacter=1"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetLocationOfMeasurment()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrSNOMEDCT",
                    TitleColumnName = "ISNULL(Name,'')+ ' - ' +ISNULL(Description,'')",
                    Filter = "IsLocationOfMeasurment=1"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetPulseRegularity()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrSNOMEDCT",
                    TitleColumnName = "ISNULL(Name,'')+ ' - ' +ISNULL(Description,'')",
                    Filter = "IsRegularity=1"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetPulseVolume()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrSNOMEDCT",
                    TitleColumnName = "ISNULL(Name,'')+ ' - ' +ISNULL(Description,'')",
                    Filter = "IsVolume=1"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetTemperatureLocation()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrSNOMEDCT",
                    TitleColumnName = "ISNULL(Name,'')+ ' - ' +ISNULL(Description,'')",
                    Filter = "IsTemperatureLocation=1"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> RouteId(string term)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrSNOMEDCT",
                    TitleColumnName = "ISNULL(Name,'')+' - '+ISNULL(Description,'')",
                    Filter = "IsRoute=1"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> DosageUnitId(string term)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrUCUM",
                    TitleColumnName = "ISNULL(Name,'')+' - '+ ISNULL(Description,'')",
                    Filter = "IsDosage=1"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> FrequencyId()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrSNOMEDCT",
                    TitleColumnName = "ISNULL(Name,'')+' - '+ISNULL(Description,'')",
                    Filter = "IsFrequency=1"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> LongTermUnitId()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrUCUM",
                    TitleColumnName = "ISNULL(Name,'')+' - ' + ISNULL(Description,'')",
                    Filter = "IsLongTerm=1"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> OnsetDurationToPresentUnitId_MedicalHistory()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrUCUM",
                    TitleColumnName = "ISNULL(Name,'')+' - ' + ISNULL(Description,'')",
                    Filter = "Is_PMH_OnsetDurationToPresent=1"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> MethodId(string term)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrSNOMEDCT",
                    TitleColumnName = "ISNULL(Name,'')+' - '+ISNULL(Description,'')",
                    Filter = "IsMethod=1"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> LateralityId()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrSNOMEDCT",
                    TitleColumnName = "ISNULL(Name,'')+' - '+ISNULL(Description,'')",
                    Filter = "IsLaterality=1"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<GetAdmissionRefer> GetAdmissionRefer(int admissionReferId)
    {
        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_AdmissionRefer_Get";
            conn.Open();
            var result = await conn.QueryFirstAsync<GetAdmissionRefer>(sQuery,
                new
                {
                    AdmissionReferId = admissionReferId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            result.Id = admissionReferId;
            return result;
        }
    }

    public async Task<int> GetNextAdmissionReferId(int admissionReferId, int headerPagination)
    {
        var directPaging = headerPagination;
        var paginationParameters = new DynamicParameters();
        long admissionreferIdFromPagination = 0;
        if (directPaging > 0)
        {
            paginationParameters.Add("TableName", "mc.AdmissionRefer");
            paginationParameters.Add("IdColumnName", "Id");
            paginationParameters.Add("IdColumnValue", admissionReferId);
            paginationParameters.Add("Direction", directPaging);

            using (var conn = Connection)
            {
                var sQuery = "[pb].[Spc_Tables_NextPrev]";
                conn.Open();
                admissionreferIdFromPagination = await conn.ExecuteScalarAsync<long>(sQuery, paginationParameters,
                    commandType: CommandType.StoredProcedure);
            }
        }

        var admissionRefer =
            admissionreferIdFromPagination == 0 ? admissionReferId : (int)admissionreferIdFromPagination;
        return admissionRefer;
    }

    public async Task<GetAdmissionFeedback> GetAdmissionFeedback(int admissionFeedbackId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionFeedback_Get]";
            conn.Open();
            var result = await conn.QueryFirstAsync<GetAdmissionFeedback>(sQuery,
                new
                {
                    AdmissionReferId = admissionFeedbackId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            result.Id = admissionFeedbackId;
            return result;
        }
    }

    public async Task<byte> GetAdmissionReferType(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();
            var result = await conn.QueryFirstAsync<byte>(sQuery,
                new
                {
                    TableName = "mc.AdmissionRefer",
                    ColumnName = "AdmissionReferTypeId",
                    Filter = $"Id={id}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<int> GetReferAdmissionId(int admissionReferId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();
            var result = await conn.QueryFirstAsync<int>(sQuery,
                new
                {
                    TableName = "mc.AdmissionRefer",
                    ColumnName = "AdmissionId",
                    Filter = $"Id={admissionReferId}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<MyResultQuery> UpdateAdmissionReferWcfUpdate(int admissionReferId, string compositionUID,
        string messageUID, string patientUID, bool serviceResult, int userId, string referralId)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_AdmissionReferSend_Upd";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                Id = admissionReferId,
                ReferralId = referralId,
                CompositionUID = compositionUID ?? "",
                MessageUID = messageUID ?? "",
                patientUID = patientUID ?? "",
                SentDateTime = DateTime.Now,
                ResultSent =
                    serviceResult && !string.IsNullOrEmpty(compositionUID) && !string.IsNullOrEmpty(messageUID) &&
                    !string.IsNullOrEmpty(patientUID)
                        ? AdmissionSendStatusResult.SuccsessFull
                        : AdmissionSendStatusResult.Error,
                UserId = userId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = true;
        return result;
    }

    public async Task<AdmissionReferItemDropDown> GetAdmissionReferItemInfo(string tableName, string idColumnName,
        string titleColumnName, string filter)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<AdmissionReferItemDropDown>(sQuery,
                new
                {
                    TableName = tableName,
                    IdColumnName = idColumnName,
                    TitleColumnName = titleColumnName,
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<int> GetLifeCycleStateId(string code)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "mc.thrLifeCycle",
                    TitleColumnName = "Id",
                    Filter = $"Code={code}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }


    public async Task<MyResultDataQuery<List<ReferPatientRecord_Result>>> SendReferralPatientRecord(
           List<int> referIds)
    {
        //   var keyA3 = new WCF_SENA(_errorLogRepository, _accessor, _configuration, _setupRepository);
        var keyA3 = new CisApiServices(_errorLogRepository, _accessor, _configuration, _clientFactory);
        var result = new MyResultDataQuery<List<ReferPatientRecord_Result>>();
        result.Data = new List<ReferPatientRecord_Result>();
        var keyA3Binding = new BindingReferralModel_MedicalSepas(_companyRepository, _setupRepository,
            this, _admissionsRepository);
        var userId = UserClaims.GetUserId();
        ;

        foreach (var AdmissionId in referIds)
        {
            var admissionBinded = await keyA3Binding.AdmissionSendReferralBinding_MedicalSepas(AdmissionId);
            //  var resultSendReferall = await keyA3.SendReferralPatientRecord(admissionBinded);

            var res = await keyA3.SendReferralPatientRecord(admissionBinded);

            if (res.Data.CompositionUID != null && res.Data.patientUID != null && res.Data.MessageUID != null)
                await UpdateAdmissionReferWcfUpdate(AdmissionId, res.Data.CompositionUID,
                    res.Data.MessageUID, res.Data.patientUID, res.Successfull, userId, admissionBinded.Admission.HID);

            if (!string.IsNullOrEmpty(res.Data.ErrorMessage))
            {
                result.Data.Add(new ReferPatientRecord_Result
                {
                    // Id = AdmissionId,
                    // AdmissionHid = admissionBinded.admission.HID,
                    ErrorMessage = res.Data.ErrorMessage
                });
                result.Successfull = res.Successfull;
            }
            else if (string.IsNullOrEmpty(res.Data.CompositionUID) || string.IsNullOrEmpty(res.Data.MessageUID) ||
                     string.IsNullOrEmpty(res.Data.patientUID))
            {
                var isNullCount = 0;
                var errorMessage = "";

                if (string.IsNullOrEmpty(res.Data.CompositionUID))
                {
                    isNullCount += 1;
                    if (errorMessage != "")
                        errorMessage += ", CompositionUID";
                    else
                        errorMessage += "CompositionUID";
                }

                if (string.IsNullOrEmpty(res.Data.MessageUID))
                {
                    isNullCount += 1;
                    if (errorMessage != "")
                        errorMessage += ", MessageUID";
                    else
                        errorMessage += "MessageUID";
                }

                if (string.IsNullOrEmpty(res.Data.patientUID))
                {
                    isNullCount += 1;
                    if (errorMessage != "")
                        errorMessage += ", patientUID";
                    else
                        errorMessage += "patientUID";
                }

                if (isNullCount == 1)
                    errorMessage = "شناسه " + errorMessage;
                else
                    errorMessage = "شناسه های " + errorMessage;

                result.Data.Add(new ReferPatientRecord_Result
                {
                    // Id = AdmissionId,
                    //  AdmissionHid = admissionBinded.admission.HID,
                    ErrorMessage = errorMessage
                });
                result.Successfull = false;
            }
        }

        return result;
    }
    public async Task<MyResultDataQuery<List<Cis_Result>>> SendFeedBackPatientRecord(List<int> referIds)
    {
        var keyA3 = new CisApiServices(_errorLogRepository, _accessor, _configuration, _clientFactory);
        var result = new MyResultDataQuery<List<Cis_Result>>();
        result.Data = new List<Cis_Result>();
        var keyA3Binding = new BindingReferralModel_MedicalSepas(_companyRepository, _setupRepository,
            this, _admissionsRepository);
        var userId = UserClaims.GetUserId();
        ;

        foreach (var referId in referIds)
        {
            var admissionBinded = await keyA3Binding.SendFeedbackPatientRecordBinding_Medical(referId);
            if (!string.IsNullOrEmpty(admissionBinded.Attender.Id))
            {
                var resultSendFeedBack = await keyA3.SendFeedbackPatientRecord(admissionBinded);

                if (resultSendFeedBack.Data != null)
                    await UpdateAdmissionReferWcfUpdate(referId,
                        resultSendFeedBack.Data.CompositionUID, resultSendFeedBack.Data.MessageUID,
                        resultSendFeedBack.Data.patientUID, resultSendFeedBack.Successfull, userId,
                        admissionBinded.Admission.HID);

                if (!string.IsNullOrEmpty(resultSendFeedBack.Data.ErrorMessage))
                {
                    result.Data.Add(new Cis_Result
                    {
                        Id = referId,
                        AdmissionHid = admissionBinded.Admission.HID,
                        ErrorMessage = resultSendFeedBack.Data.ErrorMessage
                    });
                    result.Successfull = resultSendFeedBack.Successfull;
                }
                else if (string.IsNullOrEmpty(resultSendFeedBack.Data.CompositionUID) ||
                         string.IsNullOrEmpty(resultSendFeedBack.Data.MessageUID) ||
                         string.IsNullOrEmpty(resultSendFeedBack.Data.patientUID))
                {
                    var isNullCount = 0;
                    var errorMessage = "";

                    if (string.IsNullOrEmpty(resultSendFeedBack.Data.CompositionUID))
                    {
                        isNullCount += 1;
                        if (errorMessage != "")
                            errorMessage += ", CompositionUID";
                        else
                            errorMessage += "CompositionUID";
                    }

                    if (string.IsNullOrEmpty(resultSendFeedBack.Data.MessageUID))
                    {
                        isNullCount += 1;
                        if (errorMessage != "")
                            errorMessage += ", MessageUID";
                        else
                            errorMessage += "MessageUID";
                    }

                    if (string.IsNullOrEmpty(resultSendFeedBack.Data.patientUID))
                    {
                        isNullCount += 1;
                        if (errorMessage != "")
                            errorMessage += ", patientUID";
                        else
                            errorMessage += "patientUID";
                    }

                    if (isNullCount == 1)
                        errorMessage = "شناسه " + errorMessage;
                    else
                        errorMessage = "شناسه های " + errorMessage;

                    result.Data.Add(new Cis_Result
                    {
                        Id = referId,
                        AdmissionHid = admissionBinded.Admission.HID,
                        ErrorMessage = errorMessage
                    });
                    result.Successfull = false;
                }
            }
            else
            {
                result.Data.Add(new Cis_Result
                {
                    Id = referId,
                    AdmissionHid = admissionBinded.Admission.HID,
                    ErrorMessage = "شماره نظام پزشکی خالی است"
                });
                result.Successfull = false;
            }
        }

        return result;
    }

    public async Task<MyResultDataStatus<GetFeedbackPatientRecord_Result>> GetFeedbackPatientRecord(
      int referId)
    {
        var keyA3 = new CisApiServices(_errorLogRepository, _accessor, _configuration, _clientFactory);
        var result = new MyResultDataStatus<GetFeedbackPatientRecord_Result>();

        //foreach (var referId in referIds)
        //{
        var admissionId = await GetReferAdmissionId(referId);
        var userId = UserClaims.GetUserId();
        ;

        var hidInfo = await _admissionRepository.GetHidInfo(admissionId);

        var hid = new HID
        {
            Id = hidInfo.Hid,
            AssignerCode = hidInfo.BasicInsurerCode == "1" || hidInfo.BasicInsurerCode == "2"
                ? hidInfo.BasicInsurerCode
                : "3"
        };

        result = await keyA3.GetFeedbackPatientRecord(hid);

        // result.Data.RelatedHID = "19957EWD7J"; //hidInfo.Hid;

        #region Comment

        //var feedback = result.Data;

        //if (result.Data != null)
        //{
        //    var fed = new AdmissionRefer();

        //    fed.AdmissionId = admissionId;

        //    var lifeCycleInfo = await _admissionReferRepository.GetAdmissionReferItemInfo("mc.thrLifeCycle", "Id", "Name", $"Code=${feedback.VersionLifecycleState.StatusCode}");
        //    fed.RelatedReferId = referId;
        //    fed.LifeCycleStateId = lifeCycleInfo.Id;
        //    fed.AdmissionReferTypeId = 4;
        //    fed.IsQueriable = feedback.ISQueriable.Value;

        //    var referredReasonInfo = await _admissionReferRepository.GetAdmissionReferItemInfo("mc.thrREFERREDREASON", "Id", "Name", $"Id=${feedback.ReferralInfo.ReferredReason.Code}");
        //    fed.ReferredReasonId = byte.Parse(referredReasonInfo.Id.ToString());


        //    var referredTypeInfo = await _admissionReferRepository.GetAdmissionReferItemInfo("mc.thrReferredType", "Id", "Name", $"Id=${feedback.ReferralInfo.ReferredType.Code}");
        //    fed.ReferredTypeId = byte.Parse(referredTypeInfo.Id.ToString());

        //    fed.ReferredDescription = feedback.ReferralInfo.Description;
        //    var referringDoctorId = await _referringDoctorRepository.CheckExistReferringDoctor(feedback.ReferringComp.MscTypeId.ToString());
        //    if (referringDoctorId == 0)
        //    {
        //        var roleInfo = await _admissionReferRepository.GetAdmissionReferItemInfo("mc.AttenderRole", "Id", "Name", $"Code=${feedback.ReferringComp.Role.Id}");
        //        var specialityInfo = await _admissionReferRepository.GetAdmissionReferItemInfo("mc.Speciality", "Id", "Name", $"Code=${feedback.ReferringComp.Role.Id}");

        //        var referringDoctor = new ReferringDoctorModel()
        //        {
        //            FirstName = feedback.ReferringComp.FirstName,
        //            LastName = feedback.ReferringComp.LastName,
        //            MSC = feedback.ReferringComp.Id.ToString(),
        //            MSCTypeId = feedback.ReferringComp.MscTypeId,
        //            RoleId = byte.Parse(roleInfo.Id.ToString()),
        //            SpecialityId = short.Parse(specialityInfo.Id.ToString())
        //        };

        //        referringDoctorId = await _referringDoctorRepository.InsertFromAdmissionRefer(referringDoctor);
        //    }

        //    fed.ReferringDoctorId = referringDoctorId;

        //    fed.CreateUserId = userId;

        //    for (byte i = 0; i < feedback.AbuseHistoryList.Length; i++)
        //    {
        //        var abuse = feedback.AbuseHistoryList[i];
        //        var abuseHistory = new Model.MC.AdmissionRefer.AdmissionReferAbuseHistoryLineList();

        //        var abuseDurationUnitInfo = await _admissionReferRepository.GetAdmissionReferItemInfo("mc.thrUCUM", "Id", "Name", $"IsAbuseDuration=1 AND Name={abuse.AbuseDuration.Unit}");
        //        var amountOfAbuseUnitInfo = await _admissionReferRepository.GetAdmissionReferItemInfo("mc.thrUCUM", "Id", "Name", $"IsAbuseAmount=1 AND Name={abuse.AmountOfAbuse.Unit}");
        //        var substanceTypeInfo = await _admissionReferRepository.GetAdmissionReferItemInfo("mc.thrSNOMEDCT", "Id", "Name", $"IsAbuse=1 AND Code={abuse.SubstanceType.Code}");

        //        abuseHistory.AbuseDuration = abuse.AbuseDuration.Magnitude.Value;
        //        abuseHistory.AbuseDurationUnitId = short.Parse(abuseDurationUnitInfo.Id.ToString());
        //        abuseHistory.AmountOfAbuseDosage = abuse.AmountOfAbuse.Magnitude.Value;
        //        abuseHistory.AmountOfAbuseUnitId = short.Parse(amountOfAbuseUnitInfo.Id.ToString());
        //        abuseHistory.StartDatePersian = abuse.StartDate;
        //        abuseHistory.QuitDatePersian = abuse.QuitDate;
        //        abuseHistory.RowNumber = i;
        //        abuseHistory.SubstanceTypeId = short.Parse(substanceTypeInfo.Id.ToString());

        //        fed.AdmissionReferAbuseHistoryLines.Add(abuseHistory);
        //    }

        //    for (byte f = 0; f < feedback.FamilyHistoryList.Length; f++)
        //    {
        //        var family = feedback.FamilyHistoryList[f];
        //        var familyHistory = new Model.MC.AdmissionRefer.AdmissionReferalFamilyHisotryLineList();

        //        var conditionInfo = await _admissionReferRepository.GetAdmissionReferItemInfo("mc.thrICD", "Id", "Value", $"Code={family.Condition.Code}");
        //        var relatedPersonInfo = await _admissionReferRepository.GetAdmissionReferItemInfo("mc.thrRELATEDPERSON", "Id", "Name", $"Code={family.RelatedPerson.Code}");


        //        familyHistory.ConditionId = conditionInfo.Id;
        //        familyHistory.Description = family.Description;
        //        familyHistory.IsCauseofDeath = family.IsCauseofDeath.Value;
        //        familyHistory.RelatedPersonId = short.Parse(relatedPersonInfo.Id.ToString());
        //        familyHistory.RowNumber = f;

        //        fed.AdmissionReferalFamilyHisotryLines.Add(familyHistory);
        //    }

        //    for (byte c = 0; c < feedback.CareActionList.Length; c++)
        //    {
        //        var care = feedback.CareActionList[c];
        //        var careAction = new Model.MC.AdmissionRefer.AdmissionReferCareActionLineList();

        //        var actionNameInfo = await _admissionReferRepository.GetAdmissionReferItemInfo("mc.thrRVU", "Id", "Name", $"Code={care.ActionName.Code}");
        //        var timeTakenUnitInfo = await _admissionReferRepository.GetAdmissionReferItemInfo("mc.thrUCUM", "Id", "Name", $"IsTimeTaken=1 AND Name={care.TimeTaken.Unit}");


        //        careAction.ActionDescription = care.ActionDescription;
        //        careAction.ActionNameId = short.Parse(actionNameInfo.Id.ToString());
        //        careAction.EndDateTimePersian = care.EndDate + " " + care.EndTime;
        //        careAction.StartDateTimePersian = care.StartDate + " " + care.StartTime;
        //        careAction.RowNumber = c;
        //        careAction.TimeTaken = care.TimeTaken.Magnitude.Value;
        //        careAction.TimeTakenUnitId = short.Parse(timeTakenUnitInfo.Id.ToString());

        //        fed.AdmissionReferCareActionLines.Add(careAction);
        //    }

        //    for (byte l = 0; l < feedback.ClinicFindingList.Length; l++)
        //    {
        //        var clinic = feedback.ClinicFindingList[l];
        //        var clinicFinding = new Model.MC.AdmissionRefer.AdmissionReferClinicFindingLineList();

        //        var findingInfo = await _admissionReferRepository.GetAdmissionReferItemInfo("mc.thrICD", "Id", "Value", $"Code={clinic.Finding.Code}");
        //        var onsetDurationUnitInfo = await _admissionReferRepository.GetAdmissionReferItemInfo("mc.thrUCUM", "Id", "Name", $"Is_Clinical_OnsetDurationToPresent=1 AND Name={clinic.OnsetDurationToPresent.Unit}");
        //        var severityInfo = await _admissionReferRepository.GetAdmissionReferItemInfo("mc.thrORDINALTERM", "Id", "Name", $"Id={clinic.Severity.SeverityCode}");


        //        clinicFinding.AgeOfOnset = clinic.AgeOfOnset.Magnitude.Value;
        //        clinicFinding.Description = clinic.Description;
        //        clinicFinding.FindingId = findingInfo.Id;
        //        clinicFinding.NillSignificant = clinic.NillSignificant.Value;
        //        clinicFinding.OnsetDateTimePersian = clinic.DateofOnset + " " + clinic.TimeofOnset;
        //        clinicFinding.OnsetDurationToPresent = clinic.OnsetDurationToPresent.Magnitude.Value;
        //        clinicFinding.OnsetDurationToPresentUnitId = short.Parse(onsetDurationUnitInfo.Id.ToString());
        //        clinicFinding.RowNumber = l;
        //        clinicFinding.SeverityId = short.Parse(severityInfo.Id.ToString());

        //        fed.AdmissionReferClinicFindingLines.Add(clinicFinding);
        //    }

        //    for (byte d = 0; d < feedback.DrugHistoryList.Length; d++)
        //    {
        //        var drug = feedback.DrugHistoryList[d];
        //        var drugHistory = new Model.MC.AdmissionRefer.AdmissionReferDrugHistoryLineList();

        //        var medicationInfo = await _admissionReferRepository.GetAdmissionReferItemInfo("mc.thrFDOIR", "Id", "Name", $"Code={drug.Medication.Code}");
        //        var routeInfo = await _admissionReferRepository.GetAdmissionReferItemInfo("mc.thrSNOMEDCT", "Id", "Name", $"IsRoute=1 AND Code={drug.RouteOfAdministartion.Code}");

        //        drugHistory.RowNumber = d;
        //        drugHistory.MedicationId = short.Parse(medicationInfo.Id.ToString());
        //        drugHistory.RouteId = short.Parse(routeInfo.Id.ToString());

        //        fed.AdmissionReferDrugHistoryLines.Add(drugHistory);
        //    }

        //    for (byte o = 0; o < feedback.DrugOrderedList.Length; o++)
        //    {
        //        var ord = feedback.DrugOrderedList[o];
        //        var order = new Model.MC.AdmissionRefer.AdmissionReferDrugOrderedLineList();

        //        var dosageUnitInfo = await _admissionReferRepository.GetAdmissionReferItemInfo("mc.thrUCUM", "Id", "Name", $"IsDosage=1 AND Name={ord.Dosage.Unit}");
        //        var frequencyInfo = await _admissionReferRepository.GetAdmissionReferItemInfo("mc.thrSNOMEDCT", "Id", "Name", $"IsFrequency=1 AND Code={ord.Frequency.Code}");
        //        var longTermUnitInfo = await _admissionReferRepository.GetAdmissionReferItemInfo("mc.thrUCUM", "Id", "Name", $"IsLongTerm=1 AND Name={ord.LongTerm.Unit}");
        //        var productInfo = await _admissionReferRepository.GetAdmissionReferItemInfo("mc.thrERX", "Id", "Name", $"Code={ord.DrugProduct.Code}");
        //        var routeInfo = await _admissionReferRepository.GetAdmissionReferItemInfo("mc.thrSNOMEDCT", "Id", "Name", $"IsRoute=1 AND Code={ord.Route.Code}");

        //        order.AdministrationDateTimePersian = ord.AdministrationDate + " " + ord.AdministrationTime;
        //        order.Description = ord.Description;
        //        order.Dosage = ord.Dosage.Magnitude.Value;
        //        order.DosageUnitId = short.Parse(dosageUnitInfo.Id.ToString());
        //        order.DrugGenericName = ord.DrugGenericName;
        //        order.FrequencyId = short.Parse(frequencyInfo.Id.ToString());
        //        order.LongTerm = ord.LongTerm.Magnitude.Value;
        //        order.LongTermUnitId = short.Parse(longTermUnitInfo.Id.ToString());
        //        order.ProductId = short.Parse(productInfo.Id.ToString());
        //        order.RouteId = short.Parse(routeInfo.Id.ToString());
        //        order.RowNumber = o;

        //        fed.AdmissionReferDrugOrderedLines.Add(order);
        //    }

        //    for (byte m = 0; m < feedback.MedicalHistoryList.Length; m++)
        //    {
        //        var med = feedback.MedicalHistoryList[m];
        //        var medical = new Model.MC.AdmissionRefer.AdmissionReferMedicalHistoryLineList();

        //        var conditionInfo = await _admissionReferRepository.GetAdmissionReferItemInfo("mc.thrICD", "Id", "Value", $"Code={med.Condition.Code}");
        //        var onsetDurationUnitInfo = await _admissionReferRepository.GetAdmissionReferItemInfo("mc.thrUCUM", "Id", "Name", $"Is_PMH_OnsetDurationToPresent=1 AND Name={med.OnsetDurationToPresent.Unit}");


        //        medical.ConditionId = short.Parse(conditionInfo.Id.ToString());
        //        medical.DateOfOnsetPersian = med.DateofOnset;
        //        medical.Description = med.Description;
        //        medical.OnsetDurationToPresent = med.OnsetDurationToPresent.Magnitude.Value;
        //        medical.OnsetDurationToPresentUnitId = short.Parse(onsetDurationUnitInfo.Id.ToString());
        //        medical.RowNumber = m;

        //        fed.AdmissionReferMedicalHistoryLines.Add(medical);
        //    }

        //    for (byte h = 0; h < feedback.PhysicalExam.HeightWeightList.Length; h++)
        //    {
        //        var hw = feedback.PhysicalExam.HeightWeightList[h];
        //        var hwl = new Model.MC.AdmissionRefer.AdmissionReferHeightWeightLineList();

        //        hwl.RowNumber = h;
        //        hwl.ObservationDateTimePersian = hw.ObservationDate + " " + hw.ObservationTime;
        //        hwl.Height = hw.Height.Magnitude.Value;
        //        hwl.Weight = hw.Weight.Magnitude.Value;

        //        fed.AdmissionReferHeightWeightLines.Add(hwl);
        //    }

        //    for (byte p = 0; p < feedback.PhysicalExam.BloodPressureList.Length; p++)
        //    {
        //        var bl = feedback.PhysicalExam.BloodPressureList[p];
        //        var blood = new Model.MC.AdmissionRefer.AdmissionReferBloodPressureLineList();

        //        var positionInfo = await _admissionReferRepository.GetAdmissionReferItemInfo("mc.thrSNOMEDCT", "Id", "Name", $"IsBloodPressure=1 AND Code={bl.Position.Code}");

        //        blood.DiastolicBP = bl.DiastolicBP.Magnitude.Value;
        //        blood.PositionId = short.Parse(positionInfo.Id.ToString());
        //        blood.SystolicBP = bl.SystolicBP.Magnitude.Value;
        //        blood.RowNumber = p;
        //        blood.ObservationDateTimePersian = bl.ObservationDate + " " + bl.ObservationTime;

        //        fed.AdmissionReferBloodPressureLines.Add(blood);
        //    }

        //    for (byte u = 0; u < feedback.PhysicalExam.PulseList.Length; u++)
        //    {
        //        var pl = feedback.PhysicalExam.PulseList[u];
        //        var pulse = new Model.MC.AdmissionRefer.AdmissionReferPulseLineList();

        //        var methodInfo = await _admissionReferRepository.GetAdmissionReferItemInfo("mc.thrSNOMEDCT", "Id", "Name", $"IsMethod=1 AND Code={pl.Method.Code}");
        //        var positionInfo = await _admissionReferRepository.GetAdmissionReferItemInfo("mc.thrSNOMEDCT", "Id", "Name", $"IsBloodPressure=1 AND Code={pl.Position.Code}");

        //        pulse.ClinicalDescription = pl.ClinicalDescription;
        //        pulse.RowNumber = u;
        //        pulse.IsPulsePresent = pl.IsPulsePresent.Value;
        //        pulse.MethodId = short.Parse(methodInfo.Id.ToString());
        //        pulse.PositionId = short.Parse(positionInfo.Id.ToString());
        //        pulse.PulseRate = pl.PulseRate.Magnitude.Value;
        //        pulse.ObservationDateTimePersian = pl.ObservationDate + " " + pl.ObservationTime;
        //    }

        //    for (byte v = 0; v < feedback.PhysicalExam.VitalSignsList.Length; v++)
        //    {
        //        var vt = feedback.PhysicalExam.VitalSignsList[v];
        //        var vital = new Model.MC.AdmissionRefer.AdmissionReferVitalSignsLineList();

        //        vital.PulseRate = vt.PulseRate.Magnitude.Value;
        //        vital.RowNumber = v;
        //        vital.RespiratoryRate = vt.RespiratoryRate.Magnitude.Value;
        //        vital.ObservationDateTimePersian = vt.ObservationDate + " " + vt.ObservationTime;
        //        vital.Temperature = vt.Temperature.Magnitude.Value;

        //        fed.AdmissionReferVitalSignsLines.Add(vital);
        //    }

        //    for (byte w = 0; w < feedback.PhysicalExam.WaistHipsList.Length; w++)
        //    {
        //        var ws = feedback.PhysicalExam.WaistHipsList[w];
        //        var waist = new Model.MC.AdmissionRefer.AdmissionReferWaistHipLineList();

        //        waist.HipCircumference = ws.HipCircumference.Magnitude.Value;
        //        waist.WaistCircumference = ws.WaistCircumference.Magnitude.Value;
        //        waist.ObservationDateTimePersian = ws.ObservationDate + " " + ws.ObservationTime;
        //        waist.RowNumber = w;

        //        fed.AdmissionReferWaistHipLines.Add(waist);
        //    }

        //    var resultAddRefer = await _admissionReferRepository.SaveAdmissionRefer(fed);
        //}
        //}

        #endregion

        return result;
    }

    public async Task<MyResultDataStatus<GetReferralPatientRecord_Result>> GetReferPatientRecord(
      string referralId)
    {
        var keyA3 = new CisApiServices(_errorLogRepository, _accessor, _configuration, _clientFactory);
        var result = new MyResultDataStatus<GetReferralPatientRecord_Result>();

        var assignerCode = string.Empty;
        var insurerCode = string.Empty;
        var hid = string.Empty;

        if (referralId.StartsWith("Z"))
        {
            if (referralId.Length == 11)
                assignerCode = referralId.Substring(1, 1);
            else
                assignerCode = referralId.Substring(1, 2);
            hid = referralId;
        }
        else
        {
            if (referralId.Length == 11)
                assignerCode = referralId.Substring(0, 2);
            else
                assignerCode = referralId.Substring(0, 1);
            hid = referralId;
        }


        if (assignerCode == "1")
            insurerCode = "1";
        else if (assignerCode == "2")
            insurerCode = "2";
        else
            insurerCode = "3";

        var hidInfo = new HID
        {
            Id = hid,
            AssignerCode = insurerCode
        };


        result = await keyA3.GetReferralPatientRecord(hidInfo);

        return result;
    }


}