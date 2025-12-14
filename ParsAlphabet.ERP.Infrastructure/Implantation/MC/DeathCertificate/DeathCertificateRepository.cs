using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.DeathCertificate;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces.MC.DeathCertificate1;
using ParsAlphabet.ERP.Application.Interfaces.MC.Prescription;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.DeathCertificate;

public class DeathCertificateRepository : IDeathCertificateRepository

{
    private readonly IConfiguration _config;
    private readonly ILoginRepository _loginRepository;
    private readonly IPrescriptionRepository _prescriptionRepository;

    public DeathCertificateRepository(IConfiguration config, IPrescriptionRepository prescriptionRepository,
        ILoginRepository loginRepository)
    {
        _config = config;
        _prescriptionRepository = prescriptionRepository;
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
                    IsFilterParameter = true, FilterType = "number", Width = 8
                },
                new()
                {
                    Id = "admissionId", Title = "شناسه پذیرش", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 5
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 20,
                    IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "patientFullName", Title = "نام و  تخلص", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 15
                },
                new()
                {
                    Id = "patientNationalCode", Title = "نمبر تذکره", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, FilterType = "strnumber", Width = 7
                },
                new()
                {
                    Id = "burialAttester", Title = "صادرکننده مجوز دفن", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "individualRegister", Title = "تایید کننده مجوز دفن", Type = (int)SqlDbType.NVarChar,
                    Size = 10, IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "deathDateTimePersian", Title = "تاریخ فوت", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "persiandate", Width = 5
                },
                new()
                {
                    Id = "sourceofDeathNotificationName", Title = "منبع تشخیص فوت", Type = (int)SqlDbType.Int,
                    IsDtParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/MC/DeathCertificateApi/getsourceofdeathnotificationdropdown", Width = 10
                },
                new()
                {
                    Id = "isCompSentName", Title = "وضعیت ارسال", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 6
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 20 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                //new GetActionColumnViewModel{Name="printDeath",Title="چاپ",ClassName="btn blue_1",IconName="fa fa-print"},
                new() { Name = "displayDeath", Title = "نمایش", ClassName = "", IconName = "far fa-file-alt" },
                new() { Name = "editDeath", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" }
                //new GetActionColumnViewModel{Name="sep1",Title="",ClassName="",IconName="", IsSeparator=true},
            }
        };

        return list;
    }

    public GetColumnsViewModel GetColumnsDeathCertificateSend()
    {
        var list = new GetColumnsViewModel
        {
            IsSelectable = true,
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه ثبت", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", IsPrimary = true, Width = 5
                },
                new()
                {
                    Id = "admissionId", Title = "شناسه پذیرش", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 5
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 20,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "persiandate", Width = 10
                },
                //new DataColumnsViewModel { Id = "lifeCycleName", Title = "وضعیت ارسال پرونده", Type = (int)SqlDbType.Int,IsDtParameter = true, IsFilterParameter = true, Width=9},
                //new DataColumnsViewModel { Id = "admissionId", Title = "شناسه پذیرش", Type = (int)SqlDbType.VarChar,IsDtParameter = true, Width=5},
                new()
                {
                    Id = "patientFullName", Title = "نام و  تخلص", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "patientNationalCode", Title = "نمبر تذکره", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = false, Width = 10
                },
                new()
                {
                    Id = "burialAttester", Title = "صادرکننده مجوز دفن", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "individualRegister", Title = "تایید کننده مجوز دفن", Type = (int)SqlDbType.NVarChar,
                    Size = 10, IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "deathDateTimePersian", Title = "تاریخ فوت", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "deathCertificate", Title = "مجوز ارسال", Type = (int)SqlDbType.Bit, IsDtParameter = false,
                    Width = 10, IsPrimary = true
                },
                new()
                {
                    Id = "sentResultName", Title = "وضعیت ارسال", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = false, Width = 10, Align = "center"
                } //,
                //new DataColumnsViewModel { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width=9,Align="center"}
            }
        };

        return list;
    }

    public async Task<MyResultPage<List<DeathCertificateGetPage>>> GetPage(NewGetPageViewModel model, int userId)
    {
        var result = new MyResultPage<List<DeathCertificateGetPage>>();

        var deathDateMiladi = (DateTime?)null;

        if (model.Filters.Any(x => x.Name == "deathDateTimePersian"))
            deathDateMiladi = model.Filters.FirstOrDefault(x => x.Name == "deathDateTimePersian").Value.Split('-')[0]
                .ToMiladiDateTime();

        result.Columns = GetColumns();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("AdmissionId",
            model.Filters.Any(x => x.Name == "admissionId")
                ? model.Filters.FirstOrDefault(x => x.Name == "admissionId").Value
                : null);
        parameters.Add("DeathDate", deathDateMiladi);
        parameters.Add("PatientFullName",
            model.Filters.Any(x => x.Name == "patientFullName")
                ? model.Filters.FirstOrDefault(x => x.Name == "patientFullName").Value
                : null);
        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);

        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "DeathCertificateApi",
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
            var sQuery = "[mc].[Spc_DeathCertificate_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<DeathCertificateGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultPage<List<DeathCertificateSendGetPage>>> DeathCertificateSend_GetPage(
        GetPageViewModel model)
    {
        var result = new MyResultPage<List<DeathCertificateSendGetPage>>();

        int? p_id = 0, p_admissionId = 0;
        string patient_fullName = "", p_createDatePersian = "";

        switch (model.FieldItem)
        {
            case "id":
                p_id = Convert.ToInt32(model.FieldValue);
                break;
            case "admissionId":
                p_admissionId = Convert.ToInt32(model.FieldValue);
                break;
            case "fullName":
                patient_fullName = model.FieldValue;
                break;
            case "createDateTimePersian":
                p_createDatePersian = model.FieldValue;
                break;
        }

        result.Columns = GetColumnsDeathCertificateSend();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id", p_id == 0 ? null : p_id);
        parameters.Add("AdmissionId", p_admissionId == 0 ? null : p_admissionId);
        parameters.Add("DeathDateTimePersian", p_createDatePersian == "" ? null : p_createDatePersian);
        parameters.Add("PatientFullName", patient_fullName == "" ? null : patient_fullName);
        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_DeathCertificateSend_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<DeathCertificateSendGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }


    public async Task<MyResultStatus> SaveDeathCertificate(Application.Dtos.MC.DeathCertificate.DeathCertificate model)
    {
        var result = new MyResultStatus();


        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_DeathCertificate_InsUpd]";
            conn.Open();


            result = await conn.QueryFirstAsync<MyResultStatus>(sQuery, new
            {
                model.Opr,
                model.Id,
                model.AdmissionId,
                model.FirstName,
                model.LastName,
                model.GenderId,
                model.NationalId,
                model.BirthDate,
                model.CompanyId,
                model.BurialAttesterId,
                model.IndividualRegisterId,
                model.IssueDate,
                model.SerialNumber,
                CreateDateTime = DateTime.Now,
                model.CreateUserId,
                model.RelatedHID,
                model.Comment,
                model.HouseholdHeadNationalCode,
                model.DeathDateTime,
                model.DeathLocationId,
                model.CountryId,
                model.CountryDivisionEstateId,
                model.CountryDivisionCityId,
                model.SourceOfNotificationId,
                DeathCauseJSON = JsonConvert.SerializeObject(model.DeathCauseLines),
                DeathInfantDeliveryJSON = JsonConvert.SerializeObject(model.DeathInfantDeliveryLines)
                // MedicalHisotryLineJSON = JsonConvert.SerializeObject(model.DeathMedicalHistoryLines),
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = result.Status == 0;
        }


        return result;
    }


    public async Task<GetDeathCertificate> GetDeathCertificate(int deathId, int headerPagination)
    {
        var directPaging = headerPagination;
        var paginationParameters = new DynamicParameters();
        long deathnIdFromPagination = 0;
        if (directPaging > 0)
        {
            paginationParameters.Add("TableName", "mc.DeathCertificate");
            paginationParameters.Add("IdColumnName", "Id");
            paginationParameters.Add("IdColumnValue", deathId);
            paginationParameters.Add("Direction", directPaging);

            using (var conn = Connection)
            {
                var sQuery = "[pb].[Spc_Tables_NextPrev]";
                conn.Open();
                deathnIdFromPagination = await conn.ExecuteScalarAsync<long>(sQuery, paginationParameters,
                    commandType: CommandType.StoredProcedure);
            }
        }

        var deathCertificateId = deathnIdFromPagination == 0 ? deathId : (int)deathnIdFromPagination;

        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_DeathCertificate_Get";
            conn.Open();
            var result = await conn.QueryFirstAsync<GetDeathCertificate>(sQuery,
                new
                {
                    DeathId = deathCertificateId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            result.Id = deathCertificateId;
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
                TableName = "mc.DeathCertificate",
                ColumnName = "Id",
                //Filter = $"Id={id} AND company_Id={companyId}"
                Filter = $"Id={id}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result > 0;
        }
    }


    public async Task<IEnumerable<MyDropDownViewModel>> GetDurationDeath()
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
                    Filter = "IsTimeTaken = 1"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetDeathCauseStatus()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrDeathCauseStatus",
                    TitleColumnName = "Name"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetDeliveryAgent()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.AttenderRole",
                    IdColumnName = "Id",
                    TitleColumnName = "Name"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetDeliveryLocation()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.[thrDeathLocation]",
                    IdColumnName = "Id",
                    TitleColumnName = "Name"
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
                    TitleColumnName = "ISNULL(Code,'')+'-'+ISNULL(Value,'') ",
                    Filter = $"Code='{term}' OR Value Like N'%{term}%'"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetCountryDivisions(string term)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrCountryDivision",
                    IdColumnName = "Id",
                    TitleColumnName = "ISNULL(Code,'')+'-'+ISNULL(Name,'') ",
                    Filter = $"Code='{term}' OR Name Like N'%{term}%'"
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


    public async Task<IEnumerable<MyDropDownViewModel>> GetCauseId(string term)
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
                    TitleColumnName = "ISNULL(Code,'') + '-' + ISNULL(Value,'') ",
                    Filter = $"Code='{term}' OR Value Like N'%{term}%'"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }


    public async Task<int> GetDeathCertificateAdmissionId(int deathId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();
            var result = await conn.QueryFirstAsync<int>(sQuery,
                new
                {
                    TableName = "mc.DeathCertificate",
                    ColumnName = "AdmissionId",
                    Filter = $"Id={deathId}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }


    public async Task<DeathCertificateItemDropDown> GetDeathItemInfo(string tableName, string idColumnName,
        string titleColumnName, string filter)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<DeathCertificateItemDropDown>(sQuery,
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


    public async Task<IEnumerable<MyDropDownViewModel>> GetInfantWeight()
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
                    Filter = "IsInfantWeight=1"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }


    public async Task<IEnumerable<MyDropDownViewModel>> GetSourceofDeathNotification()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "[mc].[thrSourceofDeathNotification]",
                    TitleColumnName = "ISNULL(Name,'')",
                    Filter = "ISNULL(Name,'')<>''"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetDeathLocationId()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrDeathLocation",
                    TitleColumnName = "ISNULL(Name,'')"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<MyResultQuery> UpdateDeathWcfUpdate(int Id, string compositionUID, string messageUID,
        string patientUID, bool serviceResult, int userId)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_DeathCertificateSend_Upd";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                Id,
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
}