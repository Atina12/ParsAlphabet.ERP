using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.Prescription;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces.MC.Prescription;
using ParsAlphabet.ERP.Application.Interfaces.Redis;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionDiagnosis;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.Prescription;

public class PrescriptionRepository : IPrescriptionRepository
{
    private readonly AdmissionDiagnosisRepository _admissionDiagnosisRepository;
    private readonly IConfiguration _config;
    private readonly ILoginRepository _loginRepository;
    private readonly IRedisService _redisService;

    public PrescriptionRepository(IConfiguration config, IRedisService redisService,
        AdmissionDiagnosisRepository admissionDiagnosisRepository, ILoginRepository loginRepository)
    {
        _admissionDiagnosisRepository = admissionDiagnosisRepository;
        _config = config;
        _redisService = redisService;
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
                    IsFilterParameter = true, FilterType = "number", Width = 7
                },
                new() { Id = "prescriptionTypeId", Type = (int)SqlDbType.Int },
                new()
                {
                    Id = "prescriptionDateTimePersian", Title = "تاریخ/زمان ثبت", Type = (int)SqlDbType.NVarChar,
                    Size = 10, IsDtParameter = true, IsFilterParameter = true, FilterType = "persiandate", Width = 9
                },
                new()
                {
                    Id = "prescriptionType", Title = "نوع نسخه", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 9
                },
                new()
                {
                    Id = "expiryDatePersian", Title = "تاریخ اعتبار", Type = (int)SqlDbType.VarChar,
                    IsDtParameter = true, Width = 9
                },
                new()
                {
                    Id = "admissionId", Title = "شناسه پذیرش", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 7
                },
                new()
                {
                    Id = "prescriptionHID", Title = "شناسه شباد", Type = (int)SqlDbType.VarChar, IsDtParameter = true,
                    Width = 8
                },
                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 8
                },
                new()
                {
                    Id = "attenderId", Title = "طبیب", Type = (int)SqlDbType.Int, Size = 10, IsDtParameter = false,
                    Width = 7
                },
                new()
                {
                    Id = "attender", Title = "طبیب", Type = (int)SqlDbType.NVarChar, Size = 10, IsDtParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "user", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, Width = 7
                },
                new()
                {
                    Id = "hidUpdateDateTimePersian", Title = "تاریخ بروزرسانی شباد", Type = (int)SqlDbType.VarChar,
                    IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "hidType", Title = "نوع شناسه شباد", Type = (int)SqlDbType.NVarChar, Size = 15,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "sent", Title = "ارسال به سپاس", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 7
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 7 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "displayprescription", Title = "نمایش", ClassName = "btn green_outline_1",
                    IconName = "far fa-file-alt"
                },
                new()
                {
                    Name = "printprescription", Title = "چاپ", ClassName = "btn blue_1", IconName = "fa fa-print",
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "prescriptionTypeId", FieldValue = "1", Operator = "==" } }
                },
                new()
                {
                    Name = "editprescription", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green"
                }
            }
        };

        return list;
    }

    public GetColumnsViewModel SendPrescriptionColumns()
    {
        var list = new GetColumnsViewModel
        {
            IsSelectable = true,
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه ثبت", Type = (int)SqlDbType.Int, IsPrimary = true, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 5
                },
                new()
                {
                    Id = "prescriptionDateTimePersian", Title = "تاریخ/زمان ثبت", Type = (int)SqlDbType.NVarChar,
                    Size = 10, IsDtParameter = true, IsFilterParameter = true, FilterType = "persiandate", Width = 5
                },
                new()
                {
                    Id = "prescriptionType", Title = "نوع نسخه", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "expiryDatePersian", Title = "تاریخ اعتبار", Type = (int)SqlDbType.VarChar,
                    IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "admissionId", Title = "شناسه پذیرش", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 6
                },
                new()
                {
                    Id = "prescriptionHID", Title = "شناسه شباد", Type = (int)SqlDbType.VarChar, IsDtParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 8
                },
                new()
                {
                    Id = "attender", Title = "طبیب", Type = (int)SqlDbType.NVarChar, Size = 10, IsDtParameter = true,
                    Width = 7, IsFilterParameter = true
                },
                new()
                {
                    Id = "hidUpdateDateTimePersian", Title = "تاریخ بروزرسانی شباد", Type = (int)SqlDbType.VarChar,
                    IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "hidType", Title = "نوع شناسه شباد", Type = (int)SqlDbType.NVarChar, Size = 15,
                    IsDtParameter = true, Width = 7
                },
                //new DataColumnsViewModel { Id = "sent", Title = "وضعیت بروز رسانی شباد", Type = (int)SqlDbType.Bit,IsDtParameter = true, Width=5},
                new()
                {
                    Id = "updateHID", Title = "مجوز بروز رسانی شباد", Type = (int)SqlDbType.Bit, IsPrimary = true,
                    IsDtParameter = false, Width = 6
                },
                new()
                {
                    Id = "updateHIDResultName", Title = "وضعیت بروز رسانی شباد", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 6, Align = "center"
                },
                new()
                {
                    Id = "sendPrescription", Title = "مجوز ارسال به سپاس", Type = (int)SqlDbType.Bit, IsPrimary = true,
                    IsDtParameter = false, Width = 6
                },
                new()
                {
                    Id = "sendPrescriptionResultName", Title = "وضعیت ارسال به سپاس", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 6, Align = "center"
                }
            }
        };

        return list;
    }

    public async Task<MyResultPage<List<PrescriptionGetPage>>> GetPage(NewGetPrescriptionPage model, int userId)
    {
        var result = new MyResultPage<List<PrescriptionGetPage>>();


        var prescriptionDateMiladi = (DateTime?)null;


        if (model.Filters.Any(x => x.Name == "prescriptionDateTimePersian"))
            prescriptionDateMiladi =
                model.Filters.FirstOrDefault(x => x.Name == "prescriptionDateTimePersian").Value.Split('-')[0]
                    .ToMiladiDateTime();

        result.Columns = GetColumns();

        var parameters = new DynamicParameters();

        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("PrescriptionDate", prescriptionDateMiladi);
        parameters.Add("AdmissionId",
            model.Filters.Any(x => x.Name == "admissionId")
                ? model.Filters.FirstOrDefault(x => x.Name == "admissionId").Value
                : null);
        parameters.Add("PatientFullName",
            model.Filters.Any(x => x.Name == "patient")
                ? model.Filters.FirstOrDefault(x => x.Name == "patient").Value
                : null);
        parameters.Add("AttenderId", model.AttenderId);

        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);


        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "PrescriptionApi",
            OprType = "VIWALL",
            UserId = userId
        };


        var checkAccessViewAll = await _loginRepository.GetAuthenticate(checkAuthenticate);
     
        if (model.Form_KeyValue[0]?.ToString() == "0")
        {
            if (!checkAccessViewAll.Successfull)
                parameters.Add("CreateUserId", 0);
            else
                parameters.Add("CreateUserId");

            parameters.Add("UserFullName",
                model.Filters.Any(x => x.Name == "user")
                    ? model.Filters.FirstOrDefault(x => x.Name == "user").Value
                    : null);
        }

        else
        {
            parameters.Add("CreateUserId", int.Parse(model.Form_KeyValue[1]?.ToString()));
            parameters.Add("UserFullName");
        }


        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Prescription_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<PrescriptionGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultPage<List<SendPrescriptionGetPage>>> SendPrescriptionGetPage(GetPrescriptionPage model)
    {
        var result = new MyResultPage<List<SendPrescriptionGetPage>>();

        int? p_id = 0, p_admissionId = 0, p_attenderId = 0;
        string patient_fullName = "", p_createDate = "";

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
            case "attender":
                p_attenderId = Convert.ToInt32(model.FieldValue);
                break;
            case "prescriptionDateTimePersian":
                p_createDate = model.FieldValue;
                break;
        }

        result.Columns = SendPrescriptionColumns();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id", p_id == 0 ? null : p_id);
        parameters.Add("PrescriptionDate", p_createDate == "" ? null : p_createDate);
        parameters.Add("AdmissionId", p_admissionId == 0 ? null : p_admissionId);
        parameters.Add("AttenderId", p_attenderId == 0 ? null : p_attenderId);
        parameters.Add("PatientFullName", patient_fullName == "" ? null : patient_fullName);
        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_SendPrescription_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<SendPrescriptionGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<GetPrescriptionByAdmissionId> GetPrescriptionById(int id, int headerPagination, int companyId)
    {
        var directPaging = headerPagination;
        var paginationParameters = new DynamicParameters();
        long prescriptionIdFromPagination = 0;
        if (directPaging > 0)
        {
            paginationParameters.Add("TableName", "mc.Prescription");
            paginationParameters.Add("IdColumnName", "Id");
            paginationParameters.Add("IdColumnValue", id);
            paginationParameters.Add("Direction", directPaging);

            using (var conn = Connection)
            {
                var sQuery = "[pb].[Spc_Tables_NextPrev]";
                conn.Open();
                prescriptionIdFromPagination = await conn.ExecuteScalarAsync<long>(sQuery, paginationParameters,
                    commandType: CommandType.StoredProcedure);
            }
        }

        var prescriptionId = prescriptionIdFromPagination == 0 ? id : (int)prescriptionIdFromPagination;

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Get_Prescription]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<GetPrescriptionByAdmissionId>(sQuery,
                new { PrescriptionId = prescriptionId, CompanyId = companyId },
                commandType: CommandType.StoredProcedure);
            conn.Close();
            result.Id = prescriptionId;
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
                TableName = "mc.Prescription",
                ColumnName = "Id",
                Filter = $"Id={id} AND CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result > 0;
        }
    }

    public async Task<Tuple<MyResultStatus, MyResultStatus, MyResultStatus, MyResultStatus>> SavePrescription(
        GetPrescription model)
    {
        var resultDrug = new MyResultStatus();
        var resultImage = new MyResultStatus();
        var resultLab = new MyResultStatus();
        var tupleDiagnosis = new MyResultStatus();

        if (model.PrescriptionDrugLineList != null)
            if (model.PrescriptionDrugLineList.Count > 0)
                resultDrug = await InsertDrugPrescription(model);

        if (model.PrescriptionImageLineList != null)
            if (model.PrescriptionImageLineList.Count > 0)
                resultImage = await InsertImagePrescription(model);

        if (model.PrescriptionLabLineList != null)
            if (model.PrescriptionLabLineList.Count > 0)
                resultLab = await InsertLabPrescription(model);

        if (model.PrescriptionDiagnoses.ListHasRow())
            tupleDiagnosis =
                await _admissionDiagnosisRepository.SaveDiagnosis(DateTime.Now, model.AdmissionId,
                    model.PrescriptionDiagnoses);


        var tuple = new Tuple<MyResultStatus, MyResultStatus, MyResultStatus, MyResultStatus>(resultDrug, resultImage,
            resultLab, tupleDiagnosis);

        if ((tuple.Item1.Successfull || tuple.Item2.Successfull || tuple.Item3.Successfull) &&
            model.FromPrescriptionId != 0)
            await UpdatePrescriptionIsCompSent(model.FromPrescriptionId, false);

        return tuple;
    }

    public async Task<MyResultStatus> UpdatePrescriptionComposition(ResultSendPrescription model)
    {
        var result = new MyResultStatus();

        var isCompSend = !string.IsNullOrEmpty(model.CompositionUID) && !string.IsNullOrEmpty(model.MessageUID) &&
                         !string.IsNullOrEmpty(model.PatientUID);

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_PrescriptionCompositionUID]";
            conn.Open();

            result = await conn.QueryFirstAsync<MyResultStatus>(sQuery, new
            {
                model.PrescriptionId,
                model.PatientUID,
                model.CompositionUID,
                model.MessageUID,
                IsCompSent = isCompSend,
                SendPrescriptionResult =
                    isCompSend ? AdmissionSendStatusResult.SuccsessFull : AdmissionSendStatusResult.Error,
                SendPrescriptionDateTime = isCompSend ? DateTime.Now : (DateTime?)null
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            result.StatusMessage = result.StatusMessage;

            if (result.Status == 0)
            {
                result.Successfull = true;
            }
            else
            {
                result.Status = -100;
                result.Successfull = false;
            }

            return result;
        }
    }

    public async Task<int> GetIdByAdmissionId(int admissionId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "mc.Prescription",
                ColumnName = "Id",
                Filter = $"AdmissionId={admissionId}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<byte> GetPrescriptionTypeById(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<byte>(sQuery, new
            {
                TableName = "mc.Prescription",
                ColumnName = "PrescriptionTypeId",
                Filter = $"Id={id}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<int> GetAdmissionIdById(int id, int CompanyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "mc.Prescription",
                ColumnName = "AdmissionId",
                Filter = $"Id={id} AND CompanyId={CompanyId}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<bool> CheckSent(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "mc.Prescription",
                ColumnName = "ISNULL(Id,0)",
                Filter = $"Id={id} AND IsCompSent=1"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result != 0;
        }
    }

    public async Task<bool> CheckHid(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "mc.Prescription",
                ColumnName = "ISNULL(Id,0)",
                Filter = $"Id={id} AND ISNULL(HID,'')<>''"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result != 0;
        }
    }

    public async Task<MyResultStatus> UpdatePrescriptionHid(UpdatePrescriptionHID model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_PrescriptionHid_Upd]";

            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.Id,
                model.HID,
                model.HIDOnline,
                UpdateHIDDateTime = string.IsNullOrEmpty(model.HID) ? (DateTime?)null : model.UpdateHIDDateTime,
                UpdateHIDResult = string.IsNullOrEmpty(model.HID)
                    ? AdmissionSendStatusResult.Error
                    : AdmissionSendStatusResult.SuccsessFull
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> ProductId(string term)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrERX",
                    Filter =
                        $"Code='{(int.TryParse(term, out _) ? term : "0")}' OR Name Like '%{term}%' AND ISNULL(IsActive,1)=1 "
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> AsNeedId(string term)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrSNOMEDCT",
                    IdColumnName = "Id",
                    TitleColumnName = "ISNULL(Name,'')+' '+ISNULL(Description,'')",
                    Filter =
                        $"Code='{(long.TryParse(term, out _) ? term : "0")}' OR Name Like N'%{term}%' OR Description Like N'%{term}%' AND ISNULL(IsActive,1)=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> DosageUnitId(string term)
    {
        //میلی گرم-MilliGram [SI Mass Units]
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrUCUM",
                    TitleColumnName = "ISNULL(Name,'') + ISNULL(Description,'')",
                    Filter =
                        $"IsDosage=1 AND (Id='{(byte.TryParse(term, out _) ? term : "0")}' OR Name Like N'%{term}%' OR Description Like N'%{term}%') AND ISNULL(IsActive,1)=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> DrugTotalNumberUnitId(string term)
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
                    Filter =
                        $"IsTotalNumber=1 AND (Id='{(byte.TryParse(term, out _) ? term : "0")}' OR Name Like N'%{term}%' OR Description Like N'%{term}%') AND ISNULL(IsActive,1)=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }


    public async Task<IEnumerable<MyDropDownViewModel>> FrequencyId(string term)
    {

        //SELECT TOP 50 Id, Code, Name, Description, IsFrequency, IsActive
        //    FROM mc.thrSNOMEDCT
        //WHERE IsFrequency = 1
        //AND ISNULL(IsActive,1)= 1
        //AND(Name LIKE N'%Two to three times a week (qualifier value)%' OR Description LIKE N'%typ%');


        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrSNOMEDCT",
                    IdColumnName = "Id",
                    TitleColumnName = "ISNULL(Name,'')+' '+ISNULL(Description,'')",
                    Filter =
                        $"IsFrequency=1 AND (Code='{(long.TryParse(term, out _) ? term : "0")}' OR Name Like N'%{term}%' OR Description Like N'%{term}%') AND ISNULL(IsActive,1)=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> IntentId(string term)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrSNOMEDCT",
                    IdColumnName = "Id",
                    TitleColumnName = "ISNULL(Name,'')+' '+ISNULL(Description,'')",
                    Filter =
                        $"IsIntent=1 AND (Code='{(long.TryParse(term, out _) ? term : "0")}' OR Name Like N'%{term}%' OR Description Like N'%{term}%') AND ISNULL(IsActive,1)=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> RouteId(string term)
    {
        //Administration of drug or medicament via otic route (procedure)
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrSNOMEDCT",
                    IdColumnName = "Id",
                    TitleColumnName = "ISNULL(Name,'')+' '+ISNULL(Description,'')",
                    Filter =
                        $"IsRoute=1 AND (Code='{(long.TryParse(term, out _) ? term : "0")}' OR Name Like N'%{term}%' OR Description Like N'%{term}%') AND ISNULL(IsActive,1)=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> MethodId(string term)
    {
        //Finding of pulse taking by auscultation (finding)
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrSNOMEDCT",
                    IdColumnName = "Id",
                    TitleColumnName = "ISNULL(Name,'')+' '+ISNULL(Description,'')",
                    Filter =
                        $"IsMethod=1 AND (Code='{(long.TryParse(term, out _) ? term : "0")}' OR Name Like N'%{term}%' OR Description Like N'%{term}%' ) AND ISNULL(IsActive,1)=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> PriorityId(string term)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrSNOMEDCT",
                    IdColumnName = "Id",
                    TitleColumnName = "ISNULL(Name,'')+' '+ISNULL(Description,'')",
                    Filter =
                        $"IsPriorityPrescription=1 AND (Code='{(long.TryParse(term, out _) ? term : "0")}' OR Name Like N'%{term}%' OR Description Like N'%{term}%' ) AND ISNULL(IsActive,1)=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> PrescriptionPriorityId(string term)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrSNOMEDCT",
                    IdColumnName = "Id",
                    TitleColumnName = "ISNULL(Name,'')+' '+ISNULL(Description,'')",
                    Filter =
                        $"IsPriorityPrescription=1 AND (Code='{(long.TryParse(term, out _) ? term : "0")}' OR Name Like N'%{term}%' OR Description Like N'%{term}%' ) AND ISNULL(IsActive,1)=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }


    public async Task<IEnumerable<MyDropDownViewModel>> ReasonId(string term)
    {
        //Falling, lying or running before or into moving object, undetermined intent ,Street and highway,While engaged in other specified activities
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
                    Filter =
                        $"Code='{(int.TryParse(term, out _) ? term : "0")}' OR Value Like N'%{term}%' AND ISNULL(IsActive,1)=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> BodySiteId(string term)
    {
        //Structure of dorsal surface of toe (body structure)
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrSNOMEDCT",
                    IdColumnName = "Id",
                    TitleColumnName = "ISNULL(Name,'')+' '+ISNULL(Description,'')",
                    Filter =
                        $"IsBodySite=1 AND (Code='{(long.TryParse(term, out _) ? term : "0")}' OR Name Like N'%{term}%' OR Description Like N'%{term}%' ) AND ISNULL(IsActive,1)=1"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> RoleId(string term)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrSNOMEDCT",
                    IdColumnName = "Id",
                    TitleColumnName = "ISNULL(Name,'')+' '+ISNULL(Description,'')",
                    Filter =
                        $"IsRole=1 AND (Code='{(long.TryParse(term, out _) ? term : "0")}' OR Name Like N'%{term}%' OR Description Like N'%{term}%' ) AND ISNULL(IsActive,1)=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> ImageServiceId(string term)
    {
        if (string.IsNullOrEmpty(term.Trim()))
            return null;

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrLNC",
                    IdColumnName = "Id",
                    TitleColumnName = "ISNULL(Code,'')+ ' - ' + ISNULL(Name,'')+' '+ISNULL(Description,'')",
                    Filter =
                        $"Code='{term}' OR Name Like N'%{term}%' OR Description Like N'%{term}%' AND ISNULL(IsActive,1)=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> LabServiceId(string term)
    {
        if (string.IsNullOrEmpty(term))
            return null;

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrLNC",
                    IdColumnName = "Id",
                    TitleColumnName = "ISNULL(Code,'')+ ' - ' + ISNULL(Name,'')+' '+ISNULL(Description,'')",
                    Filter =
                        $"Code='{term}' OR Name Like N'%{term}%' OR Description Like N'%{term}%' AND ISNULL(IsActive,1)=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> ImageDetailServiceId(string term)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrSNOMEDCT",
                    IdColumnName = "Id",
                    TitleColumnName = "ISNULL(Name,'')+' '+ISNULL(Description,'')",
                    Filter =
                        $"IsImageServiceDetail=1 AND (Code='{(long.TryParse(term, out _) ? term : "0")}' OR Name Like N'%{term}%' OR Description Like N'%{term}%' ) AND ISNULL(IsActive,1)=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> DiagnosisStatusId()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrDiagnosisStatus",
                    Filter = "  ISNULL(IsActive,1)=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> ServerityId()
    {
        var cacheItem = new List<MyDropDownViewModel>();

        try
        {
            cacheItem = _redisService.GetData<List<MyDropDownViewModel>>("ServerityIdCIS");

            if (cacheItem.NotNull())
                return cacheItem;

            cacheItem = await GetDataServerityId();

            var expirationTime = DateTimeOffset.Now.AddHours(10.0);
            _redisService.SetData("ServerityIdCIS", cacheItem, expirationTime);
        }
        catch (Exception)
        {
            cacheItem = await GetDataServerityId();
        }

        return cacheItem;
    }

    public async Task<IEnumerable<MyDropDownViewModel>> DiagnosisReasonId(string term)
    {
        if (string.IsNullOrEmpty(term))
            return null;

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrICD",
                    IdColumnName = "Id",
                    TitleColumnName = "Value +' - '+Code",
                    Filter = $" Code LIKE N'%{term}%' OR Value LIKE N'%{term}%' AND ISNULL(IsActive,1)=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> ReasonForEncounterId(string term)
    {
        if (string.IsNullOrEmpty(term))
            return null;

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrICPC2P",
                    IdColumnName = "Id",
                    TitleColumnName = "Name +' - '+Code+ ' - '+CAST(Id AS VARCHAR)",
                    Filter = $" Code LIKE N'%{term}%' OR NAME LIKE N'%{term}%' AND ISNULL(IsActive,1)=1 "
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
                    Filter = "IsLaterality=1 AND ISNULL(IsActive,1)=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<DrugItemDropDown> GetPrescriptionItemInfo(string tableName, string idColumnName,
        string titleColumnName, string filter)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<DrugItemDropDown>(sQuery,
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

    public async Task<IEnumerable<MyDropDownViewModel>> SpecimenTissueTypeId()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrSNOMEDCT",
                    TitleColumnName = "ISNULL(Name,'')",
                    Filter = "IsSpecimenType=1 AND ISNULL(IsActive,1)=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> PrescriptionTypeDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    IsSecondLang = false,
                    TableName = "mc.PrescriptionType",
                    IdColumnName = "Id",
                    TitleColumnName = "Name",
                    Filter = ""
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    private async Task<MyResultStatus> InsertDrugPrescription(GetPrescription model)
    {
        try
        {
            var result = new MyResultStatus();

            using (var conn = Connection)
            {
                var sQuery = "[mc].[Spc_PrescriptionDrug_InsUpd]";
                conn.Open();

                result = await conn.QueryFirstAsync<MyResultStatus>(sQuery, new
                {
                    Id = model.PrescriptionDrugId,
                    model.CreateDateTime,
                    model.CreateUserId,
                    model.ExpiryDate,
                    model.AdmissionId,
                    model.RepeatCount,
                    model.ReasonEncounter,
                    model.CompanyId,
                    model.StageId,
                    model.WorkflowId,
                    PrescriptionDrugLineJSON = JsonConvert.SerializeObject(model.PrescriptionDrugLineList),
                    PrescriptionDrugLineDetailJSON = JsonConvert.SerializeObject(model.PrescriptionDrugLineDetailList),
                }, commandType: CommandType.StoredProcedure);
                conn.Close();
                result.DateTime = model.CreateDateTime;
                result.StatusMessage = result.StatusMessage;

                result.Successfull = result.Status == 0;

                return result;
            }
        }
        catch (Exception e)
        {

            throw;
        }
    }

    private async Task<MyResultStatus> InsertImagePrescription(GetPrescription model)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_PrescriptionImage_InsUpd]";
            conn.Open();

            result = await conn.QueryFirstAsync<MyResultStatus>(sQuery, new
            {
                Opr = model.PrescriptionImageId == 0 ? "Ins" : "Upd",
                Id = model.PrescriptionImageId,
                model.CreateDateTime,
                model.CreateUserId,
                model.AdmissionId,
                model.ExpiryDate,
                model.RepeatCount,
                model.ReasonEncounter,
                model.PriorityId,
                model.Note,
                PrescriptionImageLineJSON = JsonConvert.SerializeObject(model.PrescriptionImageLineList),
                PrescriptionImageLineDetailJSON = JsonConvert.SerializeObject(model.PrescriptionImageLineDetailList),
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            result.DateTime = model.CreateDateTime;
            result.StatusMessage = result.StatusMessage;
            result.Successfull = result.Status == 0;
            return result;
        }
    }

    private async Task<MyResultStatus> InsertLabPrescription(GetPrescription model)
    {
        var result = new MyResultStatus();


        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_PrescriptionLab_InsUpd]";
            conn.Open();

            result = await conn.QueryFirstAsync<MyResultStatus>(sQuery, new
            {
                Opr = model.PrescriptionLabId == 0 ? "Ins" : "Upd",
                Id = model.PrescriptionLabId,
                model.CreateDateTime,
                model.CreateUserId,
                model.AdmissionId,
                model.ExpiryDate,
                model.RepeatCount,
                model.ReasonEncounter,
                model.PriorityId,
                model.Note,
                model.IntentId,
                model.SpecimenTissueTypeId,
                model.AdequacyForTestingId,
                model.CollectionDateTime,
                model.SpecimenIdentifier,
                model.CollectionProcedureId,
                PrescriptionLabLineJSON = JsonConvert.SerializeObject(model.PrescriptionLabLineList),
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            result.DateTime = model.CreateDateTime;
            result.StatusMessage = result.StatusMessage;

            result.Successfull = result.Status == 0;

            return result;
        }
    }

    public async Task<bool> UpdatePrescriptionIsCompSent(int id, bool sent)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_PrescriptionSent_Upd]";
            conn.Open();

            await conn.ExecuteAsync(sQuery, new
            {
                Id = id,
                IsCompSent = sent
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return true;
        }
    }


    public async Task<List<MyDropDownViewModel>> GetDataServerityId()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrORDINALTERM",
                    Filter = "  ISNULL(IsActive,1)=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result.AsList();
        }
    }
}

//public GetColumnsViewModel GetColumns()
//{
//    GetColumnsViewModel list = new GetColumnsViewModel()
//    {
//        DataColumns = new List<DataColumnsViewModel>()
//                {
//                    new DataColumnsViewModel { Id = "id", Title = "شناسه ثبت", Type = (int)SqlDbType.Int, IsDtParameter = true, IsFilterParameter = true, FilterType="number", Width=5},

//                    new DataColumnsViewModel { Id = "admissionId", Title = "شناسه پذیرش", Type = (int)SqlDbType.Int,IsDtParameter = true, IsFilterParameter = true, FilterType="number", Width=5},

//                    new DataColumnsViewModel { Id = "admissionMasterId", Title = "شناسه پرونده", Type = (int)SqlDbType.Int,IsDtParameter = true, IsFilterParameter = true, FilterType="number", Width=5},

//                    new DataColumnsViewModel { Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size=50, IsDtParameter = true,IsFilterParameter = true,
//                        FilterType="select2",FilterTypeApi="/api/WF/WorkflowApi/getdropdown/0/10/9", Width=8},

//                    new DataColumnsViewModel { Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size=50, IsDtParameter = true,IsFilterParameter = true,
//                        FilterType="select2",FilterTypeApi="/api/WF/StageApi/getstagedropdownbyworkflowid/null/null/10/9/2/2",Width=8},

//                    new DataColumnsViewModel { Id = "branch", Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true, IsFilterParameter = true,
//                        FilterType="select2",FilterTypeApi="/api/GN/BranchApi/getdropdown", Width=6},

//                    new DataColumnsViewModel { Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true, IsFilterParameter = true,FilterType="select2ajax", FilterTypeApi="/api/MC/PatientApi/filter", Width=7},

//                    new DataColumnsViewModel { Id = "patientNationalCode", Title = "نمبر تذکره مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true, IsFilterParameter = true,FilterType="select2ajax", FilterTypeApi="/api/MC/PatientApi/filter/3", Width=6},

//                    new DataColumnsViewModel { Id = "attender", Title = "طبیب", Type = (int)SqlDbType.NVarChar, Size = 10, IsDtParameter = true,IsFilterParameter = true,FilterType="select2", FilterTypeApi="/api/MC/AttenderApi/getdropdown/2", Width=8},

//                    new DataColumnsViewModel { Id = "prescriptionType", Title = "نوع نسخه", Type = (int)SqlDbType.NVarChar, Size=50, IsDtParameter = true,IsFilterParameter = true,FilterType="select2", FilterTypeApi="/api/MC/PrescriptionApi/prescriptiontypedropdown", Width=6},

//                    new DataColumnsViewModel { Id = "expireDatePersian", Title = "تاریخ اعتبار", Type = (int)SqlDbType.VarChar, Size = 20, IsDtParameter = true,FilterType="doublepersiandate", IsFilterParameter = true, Width=6},

//                    new DataColumnsViewModel { Id = "prescriptionHID", Title = "شناسه شباد", Type = (int)SqlDbType.VarChar,IsDtParameter = true, Width=8},

//                    new DataColumnsViewModel { Id = "prescriptionDateTimePersian", Title = "تاریخ/زمان ثبت", Type = (int)SqlDbType.NVarChar, Size=10, IsDtParameter = true,IsFilterParameter = true, FilterType="doublepersiandate", Width=9},

//                    new DataColumnsViewModel { Id = "user", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int, Size = 100, IsDtParameter = true,IsFilterParameter = true ,Width=6,
//                        FilterType = "select2", FilterTypeApi="api/GN/UserApi/getdropdown/2/false/false"},

//                    new DataColumnsViewModel { Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.NVarChar, Size=50, IsDtParameter = true, IsFilterParameter = true,FilterType="select2", FilterTypeApi="/api/WF/StageActionApi/getdropdown/10/2/9", Width=6},

//                    new DataColumnsViewModel { Id = "prescriptionTypeId", Type = (int)SqlDbType.Int, IsPrimary=true},

//                    new DataColumnsViewModel { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width=7}
//                },
//        Buttons = new List<GetActionColumnViewModel>()
//                {
//                    new GetActionColumnViewModel{Name="displayprescription",Title="نمایش",ClassName="btn green_outline_1",IconName="far fa-file-alt"},
//                    new GetActionColumnViewModel{Name="printprescription",Title="چاپ",ClassName="btn blue_1",IconName="fa fa-print",Condition=new List<ConditionPageTable>(){new ConditionPageTable {FieldName="prescriptionTypeId",FieldValue="1",Operator="==" }} },
//                    new GetActionColumnViewModel{Name="editprescription",Title="ویرایش",ClassName="",IconName="fa fa-edit color-green"}
//                }
//    };

//    return list;
//}

//public async Task<MyResultPage<List<PrescriptionGetPage>>> GetPage(NewGetPrescriptionPage model, int userId)
//{
//    MyResultPage<List<PrescriptionGetPage>> result = new MyResultPage<List<PrescriptionGetPage>>();

//    var fromCreateDateMiladi = (DateTime?)null;
//    var fromExpireDateMiladi = (DateTime?)null;
//    var toCreateDateMiladi = (DateTime?)null;
//    var toExpireDateMiladi = (DateTime?)null;
//    string patientId = null;

//    if (model.Filters.Any(x => x.Name == "prescriptionDateTimePersian"))
//    {
//        fromCreateDateMiladi = model.Filters.FirstOrDefault(x => x.Name == "prescriptionDateTimePersian").Value.Split('-')[0].ToMiladiDateTime();
//        toCreateDateMiladi = model.Filters.FirstOrDefault(x => x.Name == "prescriptionDateTimePersian").Value.Split('-')[1].ToMiladiDateTime();
//    }

//    if (model.Filters.Any(x => x.Name == "expireDatePersian"))
//    {
//        fromExpireDateMiladi = model.Filters.FirstOrDefault(x => x.Name == "expireDatePersian").Value.Split('-')[0].ToMiladiDateTime();
//        toExpireDateMiladi = model.Filters.FirstOrDefault(x => x.Name == "expireDatePersian").Value.Split('-')[1].ToMiladiDateTime();
//    }

//    if (model.Filters.Any(x => x.Name == "patient"))
//        patientId = model.Filters.FirstOrDefault(x => x.Name == "patient").Value.ToString();

//    if (model.Filters.Any(x => x.Name == "patientNationalCode"))
//        if (patientId == null) patientId = model.Filters.FirstOrDefault(x => x.Name == "patientNationalCode").Value.ToString();

//    result.Columns = GetColumns();

//    DynamicParameters parameters = new DynamicParameters();

//    parameters.Add("PageNo", model.PageNo);
//    parameters.Add("PageRowsCount", model.PageRowsCount);
//    parameters.Add("Id", model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
//    parameters.Add("AdmissionId", model.Filters.Any(x => x.Name == "admissionId") ? model.Filters.FirstOrDefault(x => x.Name == "admissionId").Value : null);
//    parameters.Add("AdmissionMasterId", model.Filters.Any(x => x.Name == "admissionMasterId") ? model.Filters.FirstOrDefault(x => x.Name == "admissionMasterId").Value : null);
//    parameters.Add("BranchId", model.Filters.Any(x => x.Name == "branch") ? model.Filters.FirstOrDefault(x => x.Name == "branch").Value : null);
//    parameters.Add("WorkflowId", model.Filters.Any(x => x.Name == "workflow") ? model.Filters.FirstOrDefault(x => x.Name == "workflow").Value : null);
//    parameters.Add("StageId", model.Filters.Any(x => x.Name == "stage") ? model.Filters.FirstOrDefault(x => x.Name == "stage").Value : null);
//    parameters.Add("ActionId", model.Filters.Any(x => x.Name == "actionIdName") ? model.Filters.FirstOrDefault(x => x.Name == "actionIdName").Value : null);
//    parameters.Add("PatientId", patientId);
//    parameters.Add("AttenderId", model.Filters.Any(x => x.Name == "attender") ? model.Filters.FirstOrDefault(x => x.Name == "attender").Value : null);
//    parameters.Add("PrescriptionTypeId", model.Filters.Any(x => x.Name == "prescriptionType") ? model.Filters.FirstOrDefault(x => x.Name == "prescriptionType").Value : null);
//    parameters.Add("ExpireDateFrom", fromExpireDateMiladi);
//    parameters.Add("ExpireDateTo", toExpireDateMiladi);
//    parameters.Add("HID", model.Filters.Any(x => x.Name == "prescriptionHID") ? model.Filters.FirstOrDefault(x => x.Name == "prescriptionHID").Value : null);
//    parameters.Add("CreateDateTimeFrom", fromCreateDateMiladi);
//    parameters.Add("CreateDateTimeTo", toCreateDateMiladi);

//    CheckAuthenticateViewModel checkAuthenticate = new CheckAuthenticateViewModel()
//    {
//        ControllerName = "PrescriptionApi",
//        OprType = "VIWALL",
//        UserId = userId
//    };

//    var checkAccessViewAll = await _loginRepository.GetAuthenticate(checkAuthenticate);

//    if (int.Parse(model.Form_KeyValue[1]?.ToString().ToString()) == 0)
//    {
//        if (!checkAccessViewAll.Successfull)
//            parameters.Add("CreateUserId", 0);
//        else
//            parameters.Add("CreateUserId", model.Filters.Any(x => x.Name == "user") ? model.Filters.FirstOrDefault(x => x.Name == "user").Value : null);

//    }

//    else
//        parameters.Add("CreateUserId", int.Parse(model.Form_KeyValue[1]?.ToString().ToString()));

//    using (IDbConnection conn = Connection)
//    {
//        string sQuery = "[mc].[Spc_Prescription_GetPage]";
//        conn.Open();
//        result.Data = (await conn.QueryAsync<PrescriptionGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure)).ToList();
//        conn.Close();
//    }

//    return result;
//}