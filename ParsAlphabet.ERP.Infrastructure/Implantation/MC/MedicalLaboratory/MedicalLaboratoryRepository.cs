using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.MedicalLaboratory;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces.MC.MedicalLaboratory;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.MedicalLaboratory;

public class MedicalLaboratoryRepository : IMedicalLaboratoryRepository
{
    private readonly IConfiguration _config;
    private readonly ILoginRepository _loginRepository;

    public MedicalLaboratoryRepository(IConfiguration config, ILoginRepository loginRepository)
    {
        _config = config;
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
                    Id = "medicalLaboratoryDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar,
                    Size = 20, IsDtParameter = true, IsFilterParameter = true, Width = 8
                },
                new()
                {
                    Id = "admissionId", Title = "شناسه پذیرش", Type = (int)SqlDbType.VarChar, IsDtParameter = true,
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
                    IsFilterParameter = true, FilterType = "select2ajax",
                    FilterTypeApi = "/api/MC/AttenderApi/getdropdown/2", Width = 15
                },
                new()
                {
                    Id = "isCompSentName", Title = "وضعیت ارسال", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "sentDateTimePersian", Title = "آخرین زمان ارسال", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 6
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 24 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "displayMedicalLaboratory", Title = "نمایش ", ClassName = "", IconName = "far fa-file-alt"
                },
                new()
                {
                    Name = "editMedicalLaboratory", Title = "جواب آزمایش", ClassName = "",
                    IconName = "fa fa-edit color-green"
                }
            }
        };

        return list;
    }

    public GetColumnsViewModel GetColumnsMedicalLaboratorySend()
    {
        var list = new GetColumnsViewModel
        {
            IsSelectable = true,
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه ثبت", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, IsPrimary = true, Width = 7
                },
                new()
                {
                    Id = "admissionId", Title = "شناسه پذیرش", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, Width = 9
                },
                new()
                {
                    Id = "medicalLaboratoryDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar,
                    Size = 10, IsDtParameter = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, Width = 15
                },
                new()
                {
                    Id = "patientNationalCode", Title = "نمبر تذکره مراجعه کننده", Type = (int)SqlDbType.NVarChar,
                    Size = 10, IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "referringDoctor", Title = "پزشک ارجاع دهنده", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "admissionMedicalLaboratory", Title = "مجوز ارسال", Type = (int)SqlDbType.Bit,
                    IsDtParameter = false, Width = 10, IsPrimary = true
                },
                new()
                {
                    Id = "sentDateTimePersian", Title = "آخرین زمان ارسال", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "sentResultName", Title = "وضعیت ارسال", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10, Align = "center"
                } //,
            }
        };

        return list;
    }

    public async Task<MyResultPage<List<MedicalLaboratoryGetPage>>> GetPage(NewGetPageViewModel model, int userId)
    {
        var result = new MyResultPage<List<MedicalLaboratoryGetPage>>();

        var createDateMiladi = (DateTime?)null;

        if (model.Filters.Any(x => x.Name == "createDateTimePersian"))
            createDateMiladi = model.Filters.FirstOrDefault(x => x.Name == "createDateTimePersian").Value.Split('-')[0]
                .ToMiladiDateTime();

        result.Columns = GetColumns();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("MedicalLaboratoryDate", createDateMiladi != null ? createDateMiladi : null);
        parameters.Add("AdmissionId",
            model.Filters.Any(x => x.Name == "admissionId")
                ? model.Filters.FirstOrDefault(x => x.Name == "admissionId").Value
                : null);
        parameters.Add("AttenderId",
            model.Filters.Any(x => x.Name == "attender")
                ? model.Filters.FirstOrDefault(x => x.Name == "attender").Value
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
            ControllerName = "MedicalLaboratoryApi",
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
            var sQuery = "[mc].[Spc_MedicalLaboratory_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<MedicalLaboratoryGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultPage<List<MedicalLaboratorySendGetPage>>> MedicalLaboratorySend_GetPage(
        GetPageViewModel model)
    {
        var result = new MyResultPage<List<MedicalLaboratorySendGetPage>>();

        int p_id = 0, p_admissionId = 0;
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
            case "medicalLaboratoryDateTimePersian":
                p_createDatePersian = model.FieldValue;
                break;
        }

        result.Columns = GetColumnsMedicalLaboratorySend();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id", p_id);
        parameters.Add("MedicalLaboratoryDateTimePersian", p_createDatePersian);
        parameters.Add("AdmissionId", p_admissionId);
        parameters.Add("PatientFullName", patient_fullName);
        parameters.Add("AttenderFullName", attender_fullName);
        parameters.Add("CompanyId", model.CompanyId);

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_MedicalLaboratorySend_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<MedicalLaboratorySendGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }


    public async Task<MyResultStatus> SaveMedicalLaboratory(
        Application.Dtos.MC.MedicalLaboratory.MedicalLaboratory model)
    {
        var resultMedicalLaboratory = new MyResultStatus();

        using (var conn = Connection)
        {
            #region save medicalLaboratory

            conn.Open();
            var sQuery = "[mc].[Spc_MedicalLaboratory_InsUpd]";
            resultMedicalLaboratory = await conn.QueryFirstAsync<MyResultStatus>(sQuery, new
            {
                model.Opr,
                model.Id,
                model.AdmissionId,
                model.CompanyId,
                model.ReferringDoctorId,
                ReferringDoctorMscId = "",
                CreateDateTime = DateTime.Now,
                model.CreateUserId,
                RelatedHID = model.RelatedHID == null ? "" : model.RelatedHID,
                AbuseHistoryLineJSON = JsonConvert.SerializeObject(model.MedicalLaboratoryAbuseHistoryLineList)
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            resultMedicalLaboratory.Successfull = resultMedicalLaboratory.Status == 100;

            #endregion

            #region save medicalDiagnosis

            if (resultMedicalLaboratory.Successfull)
            {
                var saveDiagnosisResult = await SaveMedicalLaboratoryDiagnosis(
                    model.MedicalLaboratoryDiagnosises.Where(a => !a.IsRemoved).ToList(), resultMedicalLaboratory.Id);
                if (!saveDiagnosisResult.Successfull)
                    resultMedicalLaboratory = saveDiagnosisResult;
            }

            #endregion save medicalDiagnosis

            #region save MedicalLaboratoryRequest

            if (resultMedicalLaboratory.Successfull)
                foreach (var requestItem in model.MedicalLaboratoryRequests)
                    if (requestItem.IsRemoved && !requestItem.IsAdded)
                    {
                        #region delete medicalLaboratoryRequest

                        var deleteRequestResult =
                            await DeleteMedicalLaboratoryDetails("mc.MedicalLaboratoryRequest", requestItem.Id);
                        if (deleteRequestResult.Successfull)
                        {
                            var requestMethods = requestItem.MedicalLaboratoryRequestMethods != null
                                ? requestItem.MedicalLaboratoryRequestMethods
                                : new List<MedicalLaboratoryRequestMethod>();
                            ;
                            if (requestMethods.Any())
                                foreach (var requestMethod in requestMethods)
                                {
                                    var deleteRequestMethod =
                                        await DeleteMedicalLaboratoryDetails("mc.MedicalLaboratoryRequestMethod",
                                            requestMethod.Id);
                                    if (deleteRequestMethod.Successfull)
                                    {
                                        var resultItems = requestMethod.MedicalLaboratoryResults != null
                                            ? requestMethod.MedicalLaboratoryResults
                                            : new List<MedicalLaboratoryResult>();
                                        if (resultItems.Any())
                                            foreach (var resultItem in resultItems)
                                            {
                                                var deleteResultItem =
                                                    await DeleteMedicalLaboratoryDetails("mc.MedicalLaboratoryResult",
                                                        resultItem.Id);
                                                if (deleteResultItem.Successfull)
                                                {
                                                    var referenceItems = resultItem.MedicalLaboratoryReferences != null
                                                        ? resultItem.MedicalLaboratoryReferences
                                                        : new List<
                                                            MedicalLaboratoryReference>();
                                                    if (referenceItems.Any())
                                                        foreach (var referenceItem in referenceItems)
                                                        {
                                                            var deleteReferenceItem =
                                                                await DeleteMedicalLaboratoryDetails(
                                                                    "mc.MedicalLaboratoryReference", referenceItem.Id);
                                                        }
                                                }
                                            }
                                    }
                                }
                        }

                        #endregion delete medicalLaboratoryRequest
                    }
                    else
                    {
                        requestItem.MedicalLaboratoryId = resultMedicalLaboratory.Id;
                        var newRequestItem = await SaveMedicalLaboratoryRequest(requestItem, model.Pathology);
                        newRequestItem.Successfull = newRequestItem.Status == 100;

                        #region save medicalLaboratoryRequestMethod

                        if (newRequestItem.Successfull && requestItem.MedicalLaboratoryRequestMethods != null)
                            foreach (var requestMethodItem in requestItem.MedicalLaboratoryRequestMethods)
                                if (requestMethodItem.IsRemoved && !requestMethodItem.IsAdded)
                                {
                                    #region delete medicalLaboratoryRequestMethod

                                    var deleteRequestMethod =
                                        await DeleteMedicalLaboratoryDetails("mc.MedicalLaboratoryRequestMethod",
                                            requestMethodItem.Id);
                                    if (deleteRequestMethod.Successfull)
                                    {
                                        var resultItems = requestMethodItem.MedicalLaboratoryResults != null
                                            ? requestMethodItem.MedicalLaboratoryResults.Where(a => a.IsRemoved)
                                                .ToList()
                                            : new List<MedicalLaboratoryResult>();
                                        if (resultItems.Any())
                                            foreach (var resultItem in resultItems)
                                            {
                                                var deleteResultItem =
                                                    await DeleteMedicalLaboratoryDetails("mc.MedicalLaboratoryResult",
                                                        resultItem.Id);
                                                if (deleteResultItem.Successfull)
                                                {
                                                    var referenceItems = resultItem.MedicalLaboratoryReferences != null
                                                        ? resultItem.MedicalLaboratoryReferences.Where(a => a.IsRemoved)
                                                            .ToList()
                                                        : new List<
                                                            MedicalLaboratoryReference>();
                                                    if (referenceItems.Any())
                                                        foreach (var referenceItem in referenceItems)
                                                        {
                                                            var deleteReferenceItem =
                                                                await DeleteMedicalLaboratoryDetails(
                                                                    "mc.MedicalLaboratoryReference", referenceItem.Id);
                                                        }
                                                }
                                            }
                                    }

                                    #endregion delete medicalLaboratoryRequestMethod
                                }
                                else
                                {
                                    requestMethodItem.MedicalLaboratoryRequestId = newRequestItem.Id;
                                    var newRequestMethodItem =
                                        await SaveMedicalLaboratoryRequestMethod(requestMethodItem);
                                    newRequestMethodItem.Successfull = newRequestMethodItem.Status == 100;

                                    #region save medicalLaboratoryResult

                                    if (newRequestMethodItem.Successfull &&
                                        requestMethodItem.MedicalLaboratoryResults != null)
                                        foreach (var requestResultItem in requestMethodItem.MedicalLaboratoryResults)
                                        {
                                            if (requestResultItem.IsRemoved && !requestResultItem.IsAdded)
                                            {
                                                #region delete medicalLaboratoryResult

                                                var deleteResultItem =
                                                    await DeleteMedicalLaboratoryDetails("mc.MedicalLaboratoryResult",
                                                        requestResultItem.Id);
                                                if (deleteResultItem.Successfull)
                                                {
                                                    var referenceItems =
                                                        requestResultItem.MedicalLaboratoryReferences != null
                                                            ? requestResultItem.MedicalLaboratoryReferences
                                                            : new List<
                                                                MedicalLaboratoryReference>();
                                                    if (referenceItems.Any())
                                                        foreach (var referenceItem in referenceItems)
                                                        {
                                                            var deleteReferenceItem =
                                                                await DeleteMedicalLaboratoryDetails(
                                                                    "mc.MedicalLaboratoryReference", referenceItem.Id);
                                                        }
                                                }

                                                #endregion delete medicalLaboratoryResult
                                            }
                                            else
                                            {
                                                requestResultItem.MedicalLaboratoryRequestMethodId =
                                                    newRequestMethodItem.Id;
                                                var newResultItem =
                                                    await SaveMedicalLaboratoryResult(requestResultItem);
                                                newResultItem.Successfull = newResultItem.Status == 100;

                                                #region save medicalLaboratoryReference

                                                if (newResultItem.Successfull &&
                                                    requestResultItem.MedicalLaboratoryReferences != null)
                                                    foreach (var requestRederenceItem in requestResultItem
                                                                 .MedicalLaboratoryReferences)
                                                        if (requestRederenceItem.IsRemoved &&
                                                            !requestRederenceItem.IsAdded)
                                                        {
                                                            #region delete medicalLaboratoryReference

                                                            var deleteReferenceItem =
                                                                await DeleteMedicalLaboratoryDetails(
                                                                    "mc.MedicalLaboratoryReference",
                                                                    requestRederenceItem.Id);

                                                            #endregion delete medicalLaboratoryReference
                                                        }
                                                        else
                                                        {
                                                            requestRederenceItem.MedicalLaboratoryResultId =
                                                                newResultItem.Id;
                                                            var newReferenceItem =
                                                                await SaveMedicalLaboratoryReference(
                                                                    requestRederenceItem);
                                                            newReferenceItem.Successfull =
                                                                newReferenceItem.Status == 100;
                                                            if (!newReferenceItem.Successfull)
                                                                resultMedicalLaboratory = newReferenceItem;
                                                        }
                                                else
                                                    resultMedicalLaboratory = newResultItem;
                                            }

                                            #endregion save medicalLaboratoryReference
                                        }
                                    else
                                        resultMedicalLaboratory = newRequestMethodItem;

                                    #endregion save medicalLaboratoryResult
                                }
                        else
                            resultMedicalLaboratory = newRequestItem;

                        #endregion save medicalLaboratoryRequestMethod
                    }

            #endregion save MedicalLaboratoryRequest
        }

        if (resultMedicalLaboratory.Successfull)
            resultMedicalLaboratory.StatusMessage = "عملیات با موفقیت انجام شد";
        else
            resultMedicalLaboratory.StatusMessage = "مشکلی در انجام عملیات وجود دارد";

        return resultMedicalLaboratory;
    }

    public async Task<IEnumerable<MyDropDownViewModel>> CodedTypeId(string term)
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
                        $"Id='{(long.TryParse(term, out _) ? term : "0")}' OR Name Like N'%{term}%' OR Description Like N'%{term}%' AND IsActive=1 "
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
                    TitleColumnName = "ISNULL(Code,'')+' - '+ISNULL(Name,'')",
                    Filter = " IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> SpecimenTypeId()
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
                    Filter = "IsSpecimenType=1 AND IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> CollectionProcedureId()
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
                    Filter = "IsCollectionProcedure=1 AND IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> SnomedctMethodId(string term)
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
                    TitleColumnName = "ISNULL(Name,'') + '-' + ISNULL(Code,'') ",
                    Filter =
                        $"IsLabMethod=1 AND (Code='{(int.TryParse(term, out _) ? term : "0")}' OR Name Like N'%{term}%') AND IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> LaboratoryPanelId(string term)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrLNC",
                    IdColumnName = "Id",
                    TitleColumnName = "ISNULL(Name,'') + '-' + ISNULL(Code,'')",
                    Filter = $"PanelCode IS NULL AND Code Like '%{term}%' OR Name Like N'%{term}%' AND IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> ResultStatusId()
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
                    Filter = "IsResultStatus=1 AND IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> TestNameId(string term)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrLNC",
                    IdColumnName = "Id",
                    TitleColumnName = "ISNULL(Name,'') + '-' + ISNULL(Code,'')",
                    Filter = $"Code Like '%{term}%' OR Name Like N'%{term}%' AND IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> TestPanelId(string term)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrLNC",
                    IdColumnName = "Id",
                    TitleColumnName = "ISNULL(Name,'') + '-' + ISNULL(Code,'')",
                    Filter = $"Code Like '%{term}%' OR Name Like N'%{term}%' AND IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> TestResultId(string term)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrORDINALTERM",
                    Filter = $"Id='{(int.TryParse(term, out _) ? term : "0")}' OR Name Like N'%{term}%' AND IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> AgeRangeId()
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
                    Filter = "IsAgeRange=1 AND IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GestationAgeRangeId()
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
                    Filter = "IsGestationAgeRange=1 AND IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> HormonalPhaseId()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrSNOMEDCT",
                    TitleColumnName = "ISNULL(Name,'') + '-'  + ISNULL(Code,'') ",
                    Filter = "IsHormonalPhase=1 AND IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> ReferenceStatusId()
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
                    Filter = "IsReferenceStatus=1 AND IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> SpeciesId()
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
                    Filter = "IsSpecies=1 AND IsActive=1 "
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
                    TableName = "mc.thrORDINALTERM",
                    Filter = $"Id='{(int.TryParse(term, out _) ? term : "0")}' OR Name Like N'%{term}%' AND IsActive=1 "
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
                    TitleColumnName = "ISNULL(Value,'') + '-' + ISNULL(Code,'') ",
                    Filter = $"Code Like '%{term}%' OR Value Like N'%{term}%' AND IsActive=1 "
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
                    IdColumnName = "Id",
                    TitleColumnName = "ISNULL(Name,'')",
                    Filter = " IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> SpecimenAdequacyId()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrSpecimenAdequacy",
                    TitleColumnName = "ISNULL(Name,'')",
                    Filter = "IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> TestResultTypeId()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrProporation",
                    TitleColumnName = "ISNULL(Name,'')",
                    Filter = " IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<GetMedicalLaboratory> GetMedicalLaboratory(int MedicalLaboratoryId, int headerPagination)
    {
        var directPaging = headerPagination;
        var paginationParameters = new DynamicParameters();
        long labIdFromPagination = 0;
        if (directPaging > 0)
        {
            paginationParameters.Add("TableName", "mc.MedicalLaboratory");
            paginationParameters.Add("IdColumnName", "Id");
            paginationParameters.Add("IdColumnValue", MedicalLaboratoryId);
            paginationParameters.Add("Direction", directPaging);

            using (var conn = Connection)
            {
                var sQuery = "[pb].[Spc_Tables_NextPrev]";
                conn.Open();
                labIdFromPagination = await conn.ExecuteScalarAsync<long>(sQuery, paginationParameters,
                    commandType: CommandType.StoredProcedure);
            }
        }

        var labId = labIdFromPagination == 0 ? MedicalLaboratoryId : (int)labIdFromPagination;

        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_MedicalLaboratory_Get";
            conn.Open();
            var result = await conn.QueryFirstAsync<GetMedicalLaboratory>(sQuery,
                new
                {
                    MedicalLaboratoryId = labId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            result.Id = labId;
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
                TableName = "mc.MedicalLaboratory",
                ColumnName = "Id",
                Filter = $"Id={id} AND CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result > 0;
        }
    }


    public async Task<IEnumerable<MyDropDownViewModel>> TestResultUnitId(string term)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrICDO3",
                    TitleColumnName = "ISNULL(Name,'') + ISNULL(Code,'')",
                    Filter =
                        $"Code='{(int.TryParse(term, out _) ? term : "0")}' OR Name Like N'%{term}%' AND IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> TestResultUnitId_ResultType(string term)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.thrUCUM",
                    TitleColumnName = "ISNULL(Name,'')",
                    Filter = $"Description Like N'%{term}%' OR Name Like N'%{term}%' AND IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> TopographyLaterality()
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
                    Filter = " IsLaterality=1 AND IsActive=1  "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<int> GetMedicalLaboratoryAdmissionId(int medicalLaboratoryId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();
            var result = await conn.QueryFirstAsync<int>(sQuery,
                new
                {
                    TableName = "mc.MedicalLaboratory",
                    ColumnName = "AdmissionId",
                    Filter = $"Id={medicalLaboratoryId}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<MedicalLaboratoryItemDropDown> GetMedicalLaboratoryItemInfo(string tableName, string idColumnName,
        string titleColumnName, string filter)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<MedicalLaboratoryItemDropDown>(sQuery,
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

    public async Task<MyResultQuery> UpdateMedicalLaboratoryWcfUpdate(int MedicalLaboratoryId, string compositionUID,
        string messageUID, string patientUID, bool serviceResult, int userId)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_MedicalLaboratorySend_Upd";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                Id = MedicalLaboratoryId,
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

    public async Task<MyResultStatus> DeleteMedicalLaboratoryDetails(string tableName, int Id)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecordWithFilter";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(
                sQuery, new
                {
                    TableName = tableName,
                    Filter = $"Id={Id}"
                }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultStatus> SaveMedicalLaboratoryDiagnosis(
        List<MedicalLaboratoryDiagnosis> model, int medicalLaboratoryId)
    {
        var resultMedicalLaboratoryRequest = new MyResultStatus();

        var sQuery = "[mc].[Spc_MedicalLaboratoryDiagnosis_InsUpd]";
        using (var conn = Connection)
        {
            conn.Open();
            resultMedicalLaboratoryRequest = await conn.QueryFirstAsync<MyResultStatus>(sQuery, new
            {
                medicalLaboratoryId,
                CreateDateTime = DateTime.Now,
                DiagnosisJSON = JsonConvert.SerializeObject(model)
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        resultMedicalLaboratoryRequest.Successfull = resultMedicalLaboratoryRequest.Status == 100;

        return resultMedicalLaboratoryRequest;
    }

    public async Task<MyResultStatus> SaveMedicalLaboratoryRequest(
        MedicalLaboratoryRequest model,
        List<Pathology> pathology)
    {
        var resultMedicalLaboratoryRequest = new MyResultStatus();

        var sQuery = "[mc].[Spc_MedicalLaboratoryRequest_InsUpd]";
        using (var conn = Connection)
        {
            conn.Open();
            resultMedicalLaboratoryRequest = await conn.QueryFirstAsync<MyResultStatus>(sQuery, new
            {
                model.Opr,
                model.Id,
                model.MedicalLaboratoryId,
                model.SpecimenCode,
                model.SpecimenDateTime,
                model.SpecimenTypeId,
                model.AdequacyForTestingId,
                model.CollectionProcedureId,
                model.SpecimenIdentifier,
                model.SpecimenTissueTypeId,
                MedicalLaboratoryPathologyJSON = pathology != null ? JsonConvert.SerializeObject(pathology) : null,
                MedicalLaboratoryPathologyLineJSON = pathology != null
                    ? pathology.Count > 0 ? JsonConvert.SerializeObject(pathology[0].PathologyDiagnosis) : null
                    : null
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        resultMedicalLaboratoryRequest.Successfull = resultMedicalLaboratoryRequest.Status == 100;

        return resultMedicalLaboratoryRequest;
    }

    public async Task<MyResultStatus> SaveMedicalLaboratoryRequestMethod(
        MedicalLaboratoryRequestMethod model)
    {
        var resultMedicalLaboratoryRequest = new MyResultStatus();

        var sQuery = "[mc].[Spc_MedicalLaboratoryRequestMethod_InsUpd]";
        using (var conn = Connection)
        {
            conn.Open();
            resultMedicalLaboratoryRequest = await conn.QueryFirstAsync<MyResultStatus>(sQuery, new
            {
                model.Opr,
                model.Id,
                model.MedicalLaboratoryRequestId,
                model.MethodId,
                model.MethodDescription,
                model.ResultDateTime,
                model.ProcessDateTime,
                model.ReceiptDateTime,
                model.LaboratoryPanelId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        resultMedicalLaboratoryRequest.Successfull = resultMedicalLaboratoryRequest.Status == 100;

        return resultMedicalLaboratoryRequest;
    }

    public async Task<MyResultStatus> SaveMedicalLaboratoryResult(
        MedicalLaboratoryResult model)
    {
        var resultMedicalLaboratoryRequest = new MyResultStatus();

        var sQuery = "[mc].[Spc_MedicalLaboratoryResult_InsUpd]";
        using (var conn = Connection)
        {
            conn.Open();
            resultMedicalLaboratoryRequest = await conn.QueryFirstAsync<MyResultStatus>(sQuery, new
            {
                model.Opr,
                model.Id,
                model.MedicalLaboratoryRequestMethodId,
                model.ResultStatusId,
                model.StatusId,
                model.TestNameId,
                model.TestPanelId,
                model.TestSequence,
                model.Comment,
                model.ResultType,
                model.ResultTypeDetail
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        resultMedicalLaboratoryRequest.Successfull = resultMedicalLaboratoryRequest.Status == 100;

        return resultMedicalLaboratoryRequest;
    }

    public async Task<MyResultStatus> SaveMedicalLaboratoryReference(
        MedicalLaboratoryReference model)
    {
        var resultMedicalLaboratoryRequest = new MyResultStatus();

        var sQuery = "[mc].[Spc_MedicalLaboratoryReference_InsUpd]";
        using (var conn = Connection)
        {
            conn.Open();
            resultMedicalLaboratoryRequest = await conn.QueryFirstAsync<MyResultStatus>(sQuery, new
            {
                model.Opr,
                model.Id,
                model.MedicalLaboratoryResultId,
                model.AgeRangeId,
                model.Condition,
                model.Description,
                model.GenderId,
                model.GestationAgeRangeId,
                model.HighRangeDescriptive,
                model.LowRangeDescriptive,
                model.HormonalPhaseId,
                model.ReferenceStatusId,
                model.SpeciesId,
                model.SubSpeciesId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        resultMedicalLaboratoryRequest.Successfull = resultMedicalLaboratoryRequest.Status == 100;

        return resultMedicalLaboratoryRequest;
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
                    Filter = $"Code={code} AND IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }
}