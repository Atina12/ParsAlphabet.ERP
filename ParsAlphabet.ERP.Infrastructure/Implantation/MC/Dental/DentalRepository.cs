using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionWebService;
using ParsAlphabet.ERP.Application.Dtos.MC.Dental;
using ParsAlphabet.ERP.Application.Interfaces._ErrorLog;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces._Setup;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Application.Interfaces.MC;
using ParsAlphabet.ERP.Application.Interfaces.MC.Dental;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Admission;
using ParseAlphabet.ERP.Web.WebServices.CIS;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.Dental;

public class DentalRepository
    (
        IAdmissionsRepository admissionsRepository,
        AdmissionServiceRepository admissionRepository,
        IErrorLogRepository errorLogRepository,
        IHttpContextAccessor accessor,
        IConfiguration configuration,
        ISetupRepository setupRepository,
        ICompanyRepository companyRepository,
        IHttpClientFactory clientFactory,
        IConfiguration config,
        ILoginRepository loginRepository) : IDentalRepository
{

    public IDbConnection Connection => new SqlConnection(config.GetConnectionString("DefaultConnection"));

    public GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه ثبت", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 8
                },
                new()
                {
                    Id = "dentalDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 20,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "persiandate", Width = 8
                },
                //new DataColumnsViewModel { Id = "lifeCycleName", Title = "وضعیت ارسال پرونده", Type = (int)SqlDbType.Int,IsDtParameter = true, IsFilterParameter = true, Width=9},
                new()
                {
                    Id = "admissionId", Title = "شناسه پذیرش", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 8
                },
                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 15
                },
                new()
                {
                    Id = "attender", Title = "طبیب", Type = (int)SqlDbType.NVarChar, Size = 10, IsDtParameter = true,
                    IsFilterParameter = true, Width = 15
                },
                new()
                {
                    Id = "isCompSentName", Title = "وضعیت ارسال", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 6
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 40 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                //new GetActionColumnViewModel{Name="printDental",Title="چاپ",ClassName="btn blue_1",IconName="fa fa-print"},
                new()
                {
                    Name = "displayDental", Title = "نمایش", ClassName = "btn green_outline_1",
                    IconName = "far fa-file-alt"
                },
                new() { Name = "editDental", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" }
                //new GetActionColumnViewModel{Name="sep1",Title="",ClassName="",IconName="", IsSeparator=true},
            }
        };

        return list;
    }

    public GetColumnsViewModel GetColumnsDentalSend()
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
                    Id = "dentalDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 10,
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
                    Size = 10, IsDtParameter = true, IsFilterParameter = false, FilterType = "strnumber", Width = 10
                },
                new()
                {
                    Id = "referringDoctor", Title = "پزشک ارجاع دهنده", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "admissionDental", Title = "مجوز ارسال", Type = (int)SqlDbType.Bit, IsDtParameter = false,
                    Width = 10, IsPrimary = true
                },
                new()
                {
                    Id = "sentResultName", Title = "وضعیت ارسال", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10, Align = "center"
                } //,
                //new DataColumnsViewModel { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width=9,Align="center"}
            }
            //,s
            //Buttons = new List<GetActionColumnViewModel>()
            //{
            //    new GetActionColumnViewModel{Name="activeReferallId",Title="دریافت شناسه ارحاع بر اساس نمبر تذکره",ClassName="btn green_outline_1",IconName="far fa-file-alt"},
            //}
        };

        return list;
    }


    public async Task<MyResultPage<List<DentalGetPage>>> GetPage(NewGetPageViewModel model, int userId)
    {
        var result = new MyResultPage<List<DentalGetPage>>();

        var dentalDateMiladi = (DateTime?)null;
        var tyeOfAttender = false;
        string attnderStr = null, attenderNum = null;

        if (model.Filters.Any(x => x.Name == "dentalDateTimePersian"))
            dentalDateMiladi = model.Filters.FirstOrDefault(x => x.Name == "dentalDateTimePersian").Value.Split('-')[0]
                .ToMiladiDateTime();

        if (model.Filters.Any(x => x.Name == "attender"))
        {
            tyeOfAttender = model.Filters.FirstOrDefault(x => x.Name == "attender").Value.All(char.IsDigit);
            if (tyeOfAttender)
                attenderNum = model.Filters.FirstOrDefault(x => x.Name == "attender").Value;
            else
                attnderStr = model.Filters.FirstOrDefault(x => x.Name == "attender").Value;
        }

        result.Columns = GetColumns();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("DentalDate", dentalDateMiladi);
        parameters.Add("AdmissionId",
            model.Filters.Any(x => x.Name == "admissionId")
                ? model.Filters.FirstOrDefault(x => x.Name == "admissionId").Value
                : null);
        parameters.Add("AttenderId", attenderNum);
        parameters.Add("PatientFullName",
            model.Filters.Any(x => x.Name == "patient")
                ? model.Filters.FirstOrDefault(x => x.Name == "patient").Value
                : null);
        parameters.Add("AttenderFullName", attnderStr);
        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);


        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "DentalApi",
            OprType = "VIWALL",
            UserId = userId
        };

        var checkAccessViewAll = await loginRepository.GetAuthenticate(checkAuthenticate);

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
            var sQuery = "[mc].[Spc_AdmissionDental_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<DentalGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultPage<List<DentalSendGetPage>>> DentalSend_GetPage(GetPageViewModel model)
    {
        var result = new MyResultPage<List<DentalSendGetPage>>();

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
            case "dentalDateTimePersian":
                p_createDatePersian = model.FieldValue;
                break;
        }

        result.Columns = GetColumnsDentalSend();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id", p_id == 0 ? null : p_id);
        parameters.Add("DentalDateTimePersian", p_createDatePersian == "" ? null : p_createDatePersian);
        parameters.Add("AdmissionId", p_admissionId == 0 ? null : p_admissionId);
        parameters.Add("PatientFullName", patient_fullName == "" ? null : patient_fullName);
        parameters.Add("AttenderFullName", attender_fullName == "" ? null : attender_fullName);
        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionSendDental_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<DentalSendGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<bool> CheckExist(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                TableName = "mc.AdmissionDental",
                ColumnName = "Id",
                Filter = $"Id={id} AND CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result > 0;
        }
    }

    public async Task<GetDental> GetAdmissionDental(int admissionDentalId, int headerPagination)
    {
        var directPaging = headerPagination;
        var paginationParameters = new DynamicParameters();
        long dentalIdFromPagination = 0;
        if (directPaging > 0)
        {
            paginationParameters.Add("TableName", "mc.AdmissionDental");
            paginationParameters.Add("IdColumnName", "Id");
            paginationParameters.Add("IdColumnValue", admissionDentalId);
            paginationParameters.Add("Direction", directPaging);

            using (var conn = Connection)
            {
                var sQuery = "[pb].[Spc_Tables_NextPrev]";
                conn.Open();
                dentalIdFromPagination = await conn.ExecuteScalarAsync<long>(sQuery, paginationParameters,
                    commandType: CommandType.StoredProcedure);
            }
        }

        var dentalId = dentalIdFromPagination == 0 ? admissionDentalId : (int)dentalIdFromPagination;

        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_AdmissionDental_Get";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<GetDental>(sQuery,
                new
                {
                    DentalId = dentalId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            if (result != null)
                result.Id = dentalId;
            return result;
        }
    }

    public async Task<MyResultStatus> SaveDental(AdmissionDental model)
    {
        var result = new MyResultStatus();
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionDental_InsUpd]";
            conn.Open();

            result = await conn.QueryFirstAsync<MyResultStatus>(sQuery, new
            {
                model.Opr,
                model.Id,
                model.AdmissionId,
                model.LifeCycleStateId,
                model.CompanyId,
                model.IsQueriable,
                model.ReferringDoctorId,
                CreateDateTime = DateTime.Now,
                model.CreateUserId,
                model.RelatedHID,
                //AbuseHistoryLineJSON =  JsonConvert.SerializeObject(model.AdmissionDentalAbuseHistoryLines),
                //DrugHistoryLineJSON =  JsonConvert.SerializeObject(model.AdmissionDentalDrugHistoryLines),
                //DrugOrderedLineJSON =  JsonConvert.SerializeObject(model.AdmissionDentalDrugOrderedLines),
                //FamilyHisotryLineJSON =  JsonConvert.SerializeObject(model.AdmissionDentalFamilyHisotryLines),
                //MedicalHisotryLineJSON =  JsonConvert.SerializeObject(model.AdmissionDentalMedicalHistoryLines),
                AdverseReactionLineJSON = JsonConvert.SerializeObject(model.AdmissionDentalAdverseReactionLines),
                AdmissionDentalDiagnosisLineJSON = JsonConvert.SerializeObject(model.AdmissionDentalDiagnosisLines),
                AdmissionDentalToothLineJSON = JsonConvert.SerializeObject(model.AdmissionDentalToothLines),
                AdmissionDentalToothLineDetailJSON = JsonConvert.SerializeObject(model.AdmissionDentalToothLineDetails),
                AdmissionDentalTreatmentLineDetailJSON =
                    JsonConvert.SerializeObject(model.AdmissionDentalTreatmentLineDetails)
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = result.Status == 0;
        }

        //if (model.AdmissionDentalDiagnosisLines != null)
        //    if (model.AdmissionDentalDiagnosisLines.Count > 0)
        //        await _admissionDiagnosisRepository.SaveDiagnosis(DateTime.Now, model.AdmissionId, model.AdmissionDentalDiagnosisLines);


        return result;
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
                    TableName = "mc.thrICD",
                    IdColumnName = "Id",
                    TitleColumnName = "Value ",
                    Filter = $"Code='{(int.TryParse(term, out _) ? term : "0")}' OR Value Like N'%{term}%'"
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
                    TableName = "mc.thrICDFa",
                    IdColumnName = "Id",
                    TitleColumnName = "Value",
                    Filter = $"Code='{(int.TryParse(term, out _) ? term : "0")}' OR Value Like N'%{term}%'"
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
                    TableName = "mc.thrFDOIR",
                    Filter =
                        $"Id='{(short.TryParse(term, out _) ? term : "0")}' OR Code='{(short.TryParse(term, out _) ? term : "0")}' OR Name Like N'%{term}%'"
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
                    TableName = "mc.thrFDOIR",
                    Filter =
                        $"Id='{(short.TryParse(term, out _) ? term : "0")}' OR Code='{(short.TryParse(term, out _) ? term : "0")}' OR Name Like N'%{term}%'"
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
                    TitleColumnName = "ISNULL(Code,'')+'-'+ISNULL(Value,'')",
                    Filter = $"Code='{term}' OR Value Like N'%{term}%'"
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

    public async Task<IEnumerable<MyDropDownViewModel>> ServiceTypeId()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.ServiceType",
                    Filter = "IsDental=1 AND IsActive = 1"
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
                    TableName = "mc.thrICDFa",
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

    public async Task<IEnumerable<MyDropDownViewModel>> DiagnosisReasonId(string term)
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
                    TitleColumnName = "Value ",
                    Filter = $"Code='{(byte.TryParse(term, out _) ? term : "0")}' OR Value Like N'%{term}%'"
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


    public async Task<int> GetDentalAdmissionId(int admissionDentalId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();
            var result = await conn.QueryFirstAsync<int>(sQuery,
                new
                {
                    TableName = "mc.AdmissionDental",
                    ColumnName = "AdmissionId",
                    Filter = $"Id={admissionDentalId}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }


    public async Task<DentalItemDropDown> GetDentalItemInfo(string tableName, string idColumnName,
        string titleColumnName, string filter)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<DentalItemDropDown>(sQuery,
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

    public async Task<IEnumerable<MyDropDownViewModel>> GetToothName(string term)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrFDI",
                    TitleColumnName = "ISNULL(Name,'')"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetToothPart(string term)
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
                    Filter = "IsToothPart=1"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetToothSegment(string term)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrADA",
                    TitleColumnName = "ISNULL(Code,'')"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetTreatmentService(int? admissionId)
    {
        using (var conn = Connection)
        {
            var sQuery = @"SELECT c.id Id,  ISNULL(c.Code,'')+' - '+ISNULL(c.Name,'') Name
                                  FROM mc.AdmissionServiceLine sl
                                  INNER JOIN mc.AdmissionService ad on ad.id = sl.HeaderId
                                  INNER JOIN  mc.Service s on s.id = sl.ServiceId
                                  INNER  JOIN mc.thrCDT c on c.Id = s.CdtTerminologyId
                                   WHERE  ad.id=@admissionId";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    admissionId
                },
                commandType: CommandType.Text);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetTreatmentServiceCountUnit()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrServiceCountUnit",
                    TitleColumnName = "ISNULL(Description,'')"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<MyResultQuery> UpdateDentalWcfUpdate(int admissionDentalId, string compositionUID,
        string messageUID, string patientUID, bool serviceResult, int userId, string dentalId)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_AdmissionDentalSend_Upd";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                Id = admissionDentalId,
                DentalId = dentalId,
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

    public async Task<IEnumerable<MyDropDownViewModel>> ReasonId(string term)
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

    public async Task<MyResultDataQuery<List<Cis_Result>>> SaveDentalCaseRecord(List<int> dentalIds)
    {
        // var keyA3 = new WCF_SENA(_errorLogRepository, _accessor, _configuration, _setupRepository);
        var keyA3 = new CisApiServices(errorLogRepository, accessor, configuration, clientFactory);
        var result = new MyResultDataQuery<List<Cis_Result>>();
        result.Data = new List<Cis_Result>();
        var keyA3Binding = new BindingCisApiServices.BindingDentalModel_MedicalSepas(companyRepository, setupRepository,
            this, admissionsRepository);
        var userId = UserClaims.GetUserId();
        ;

        foreach (var AdmissionId in dentalIds)
        {
            var admissionBinded = await keyA3Binding.SendDentalBinding_MedicalSepas(AdmissionId);
            var resultSendDental = await keyA3.SaveDentalCase(admissionBinded);
            if (resultSendDental.Data != null)
                await UpdateDentalWcfUpdate(AdmissionId,
                    resultSendDental.Data.CompositionUID, resultSendDental.Data.MessageUID,
                    resultSendDental.Data.patientUID, resultSendDental.Successfull, userId,
                    admissionBinded.Admission.HID);

            if (!string.IsNullOrEmpty(resultSendDental.Data.ErrorMessage))
            {
                result.Data.Add(new Cis_Result
                {
                    Id = AdmissionId,
                    AdmissionHid = admissionBinded.Admission.HID,
                    ErrorMessage = resultSendDental.Data.ErrorMessage
                });
                result.Successfull = resultSendDental.Successfull;
            }
            else if (string.IsNullOrEmpty(resultSendDental.Data.CompositionUID) ||
                     string.IsNullOrEmpty(resultSendDental.Data.MessageUID) ||
                     string.IsNullOrEmpty(resultSendDental.Data.patientUID))
            {
                var isNullCount = 0;
                var errorMessage = "";

                if (string.IsNullOrEmpty(resultSendDental.Data.CompositionUID))
                {
                    isNullCount += 1;
                    if (errorMessage != "")
                        errorMessage += ", CompositionUID";
                    else
                        errorMessage += "CompositionUID";
                }

                if (string.IsNullOrEmpty(resultSendDental.Data.MessageUID))
                {
                    isNullCount += 1;
                    if (errorMessage != "")
                        errorMessage += ", MessageUID";
                    else
                        errorMessage += "MessageUID";
                }

                if (string.IsNullOrEmpty(resultSendDental.Data.patientUID))
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
                    Id = AdmissionId,
                    AdmissionHid = admissionBinded.Admission.HID,
                    ErrorMessage = errorMessage
                });
                result.Successfull = false;
            }
        }

        return result;
    }

}