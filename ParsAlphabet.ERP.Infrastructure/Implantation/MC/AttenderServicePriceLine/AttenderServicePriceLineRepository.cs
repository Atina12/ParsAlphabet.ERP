using System.Collections;
using System.Data;
using System.Net;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.Central.ObjectModel.MedicalCare;
using ParsAlphabet.ERP.Application.Dtos.MC.AttenderMarginBracket;
using ParsAlphabet.ERP.Application.Dtos.MC.AttenderServicePriceLine;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.Central;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.SendHistory;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Attender;
using ParsAlphabet.ERP.Infrastructure.Implantation.PB;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.AttenderServicePriceLine;

public class AttenderServicePriceLineRepository :
    BaseRepository<AttenderServicePriceLineModel, int, string>,
    IBaseRepository<AttenderServicePriceLineModel, int, string>
{
    private readonly AttenderRepository _attenderRepository;
    private readonly IAttenderServiceServiceCentral _centralAttenderServiceService;
    private readonly ManageRedisRepository _manageRedisRepository;
    private readonly IMapper _mapper;
    private readonly SendHistoryRepository _sendHistoryRepository;

    public AttenderServicePriceLineRepository(IConfiguration config, AttenderRepository attenderRepository
        , ManageRedisRepository manageRedisRepository
        , IAttenderServiceServiceCentral centralAttenderServiceService
        , SendHistoryRepository sendHistoryRepository
        , IMapper mapper)
        : base(config)
    {
        _attenderRepository = attenderRepository;
        _manageRedisRepository = manageRedisRepository;
        _centralAttenderServiceService = centralAttenderServiceService;
        _sendHistoryRepository = sendHistoryRepository;
        _mapper = mapper;
    }

    public GetColumnsViewModel GetColumnsDiAssign()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new() { Id = "serviceId", Title = "شناسه", Type = (int)SqlDbType.Int, Width = 6, IsPrimary = true },
                new()
                {
                    Id = "serviceId", Title = "شناسه خدمت", Type = (int)SqlDbType.NVarChar, Width = 9,
                    IsDtParameter = true, IsFilterParameter = true, IsPrimary = true
                },
                new()
                {
                    Id = "serviceName", Title = "نام خدمت", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, IsFilterParameter = true, Width = 24
                },
                new() { Id = "serviceTypeId", IsPrimary = true },
                new()
                {
                    Id = "serviceType", Title = "نوع خدمت ", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsPrimary = true, IsFilterParameter = true, Width = 10,
                    FilterType = "select2", FilterTypeApi = "/api/MC/ServiceTypeApi/getdropdown"
                },
                new() { Id = "medicalSubjectId", IsPrimary = true },
                new()
                {
                    Id = "medicalSubject", Title = "موضوع درمان", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true,
                    FilterType = "select2", FilterTypeApi = "/api/AdmissionsApi/medicalsubject_getdropdown", Width = 20
                }
            }
        };

        return list;
    }

    public GetColumnsViewModel GetColumnsAssign()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "attenderServicePriceId", Title = "شناسه", Type = (int)SqlDbType.Int, Width = 5,
                    IsPrimary = true
                },
                new()
                {
                    Id = "serviceId", Title = "شناسه خدمت", Type = (int)SqlDbType.Int, Width = 9, IsDtParameter = true,
                    IsPrimary = true, IsFilterParameter = true
                },
                new()
                {
                    Id = "serviceName", Title = "نام خدمت", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, IsFilterParameter = true, Width = 18, IsPrimary = true
                },
                new() { Id = "serviceTypeId", IsPrimary = true },
                new()
                {
                    Id = "serviceType", Title = "نوع خدمت ", Type = (int)SqlDbType.Int, Size = 50, IsDtParameter = true,
                    IsPrimary = true, IsFilterParameter = true, Width = 14, FilterType = "select2",
                    FilterTypeApi = "/api/MC/ServiceTypeApi/getdropdown"
                },
                new() { Id = "attenderMarginBracketId", IsPrimary = true },
                new()
                {
                    Id = "attenderMarginBracket", Title = "نوع کمیسیون", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 18
                },
                new() { Id = "medicalSubjectId", IsPrimary = true },
                new()
                {
                    Id = "medicalSubject", Title = "موضوع درمان", IsPrimary = true, Type = (int)SqlDbType.NVarChar,
                    Size = 50, IsDtParameter = true, IsFilterParameter = true,
                    FilterType = "select2", FilterTypeApi = "/api/AdmissionsApi/medicalsubject_getdropdown", Width = 18
                },
                new()
                {
                    Id = "createUser", Title = " کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 8
                }
            }
        };

        return list;
    }

    public GetColumnsViewModel GetColumnsAttenderServiceSendHistoryGetpage()
    {
        var list = new GetColumnsViewModel
        {
            IsSelectable = true,
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, Width = 10, IsDtParameter = true,
                    IsPrimary = true
                },
                new() { Id = "sendHistoryId", IsPrimary = true },
                new()
                {
                    Id = "attender", Title = "طبیب", Type = (int)SqlDbType.NVarChar, Size = 10, IsPrimary = true,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "service", Title = "خدمت", Type = (int)SqlDbType.NVarChar, Size = 30, IsDtParameter = true,
                    Width = 25
                },
                new()
                {
                    Id = "medicalSubject", Title = "موضوع درمان", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "createUser", Title = "کاربر ثبت کننده لاگ", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت لاگ", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "sendUser", Title = "کاربر ارسال کننده", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "sendDateTimePersian", Title = "تاریخ ارسال", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 10
                }
            }
        };

        return list;
    }

    public async Task<MyResultPage<AttenderServicePriceDiAssignGetPage>> GetPageDiAssigns(NewGetPageViewModel model)
    {
        var result = new MyResultPage<AttenderServicePriceDiAssignGetPage>
        {
            Data = new AttenderServicePriceDiAssignGetPage()
        };

        var p_attenderId = Convert.ToInt32(model.Form_KeyValue[0]?.ToString());

        int?
            p_serviceId = null,
            p_medicalsubjectId = null,
            p_serviceTypeId = null;

        string
            p_serviceName = null;

        switch (model.FieldItem)
        {
            case "serviceName":
                p_serviceName = model.FieldValue;
                break;
            case "serviceId":
                p_serviceId = Convert.ToInt32(model.FieldValue);
                break;
            case "serviceType":
                p_serviceTypeId = Convert.ToInt32(model.FieldValue);
                break;
            case "medicalSubject":
                p_medicalsubjectId = Convert.ToInt32(model.FieldValue);
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("AttenderId", p_attenderId);
        parameters.Add("ServiceId", p_serviceId);
        parameters.Add("ServiceName", p_serviceName);
        parameters.Add("ServiceTypeId", p_serviceTypeId);
        parameters.Add("MedicalSubjectId", p_medicalsubjectId);
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumnsDiAssign();
        var resultDiAssign = new List<AttenderServicePriceDiAssignList>();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AttenderServicePrice_DiAssign]";
            conn.Open();
            resultDiAssign =
                (await conn.QueryAsync<AttenderServicePriceDiAssignList>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        result.Data.Assigns = resultDiAssign;
        return result;
    }

    public async Task<MyResultPage<AttenderServicePriceAssignGetPage>> GetPageAssigns(NewGetPageViewModel model)
    {
        var result = new MyResultPage<AttenderServicePriceAssignGetPage>
        {
            Data = new AttenderServicePriceAssignGetPage()
        };

        var p_attenderId = Convert.ToInt32(model.Form_KeyValue[0]?.ToString());

        int?
            p_serviceId = null,
            p_medicalsubjectId = null,
            p_serviceTypeId = null;
        string
            p_serviceName = null;

        switch (model.FieldItem)
        {
            case "serviceName":
                p_serviceName = model.FieldValue;
                break;
            case "serviceId":
                p_serviceId = Convert.ToInt32(model.FieldValue);
                break;
            case "serviceType":
                p_serviceTypeId = Convert.ToInt32(model.FieldValue);
                break;
            case "medicalSubject":
                p_medicalsubjectId = Convert.ToInt32(model.FieldValue);
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("AttenderId", p_attenderId);
        parameters.Add("ServiceId", p_serviceId);
        parameters.Add("ServiceName", p_serviceName);
        parameters.Add("ServiceTypeId", p_serviceTypeId);
        parameters.Add("MedicalSubjectId", p_medicalsubjectId);
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumnsAssign();
        var resultAssign = new List<AttenderServicePriceAssignList>();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AttenderServicePrice_Assign]";
            conn.Open();
            resultAssign =
                (await conn.QueryAsync<AttenderServicePriceAssignList>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        result.Data.Assigns = resultAssign;
        return result;
    }

    public async Task<MyResultPage<List<AttenderServiceSendHistoryGetpage>>> GetPageAttenderServiceSendHistory(
        NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<AttenderServiceSendHistoryGetpage>>();

        result.Data = new List<AttenderServiceSendHistoryGetpage>();

        var p_attenderId = Convert.ToInt32(model.Form_KeyValue[1]?.ToString());
        var p_isSent = Convert.ToBoolean(model.Form_KeyValue[2]?.ToString());


        var parameters = new DynamicParameters();
        parameters.Add("AttenderId", p_attenderId);
        parameters.Add("IsSent", p_isSent);
        result.Columns = GetColumnsAttenderServiceSendHistoryGetpage();

        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_SendHistory_GetPage_AttenderService]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<AttenderServiceSendHistoryGetpage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultStatus> SendCentralAttenderService(int id, int userId)
    {
        var centralModel = new CentralAttenderService();
        var result = new MyResultStatus();

        var model = await _sendHistoryRepository.AttenderServiceSendHistoryGetRecord(id);

        if (!model.NotNull())
            return new MyResultStatus
            {
                Successfull = false,
                Status = -100,
                StatusMessage = "موردی برای ارسال وجود ندارد"
            };
        centralModel = _mapper.Map<AttenderServiceSendHistoryGetRecord, CentralAttenderService>(model);

        var sendResult = await _centralAttenderServiceService.AttenderServiceCentral(centralModel);

        if (sendResult.HttpStatus == HttpStatusCode.Unauthorized
            || sendResult.HttpStatus == HttpStatusCode.BadRequest
            || sendResult.HttpStatus == HttpStatusCode.InternalServerError)
            return new MyResultStatus
            {
                Successfull = false,
                Status = -100,
                StatusMessage = "درخواست شما به درستی انجام نشد ، مجدد تلاش فرمایید"
            };

        if (sendResult.HttpStatus == HttpStatusCode.NotAcceptable)
        {
            if (sendResult.ValidationErrors.ListHasRow())
                return new MyResultStatus
                {
                    Successfull = false,
                    ValidationErrors = sendResult.ValidationErrors
                };
        }
        else if (sendResult.HttpStatus == HttpStatusCode.OK && sendResult.Data != null)
        {
            if (sendResult.Data.Status == 100)
            {
                var updSendHistory =
                    await _sendHistoryRepository.Update(model.SendHistoryId, sendResult.Data.Id.ToString(), userId);

                return new MyResultStatus
                {
                    Successfull = updSendHistory.Successfull,
                    StatusMessage = updSendHistory.StatusMessage
                };
            }
        }

        return result;
    }


    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                GetColumnsAssign().DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };
        var getPage = await GetPageAssigns(model);
        result.Rows = from p in getPage.Data.Assigns
            select new
            {
                p.ServiceId,
                p.ServiceName,
                p.ServiceType,
                p.AttenderMarginBracket,
                p.MedicalSubject,
                p.CreateUser,
                p.CreateDateTimePersian
            };
        return result;
    }

    public async Task<MyResultQuery> AttenderServicePriceAssign(AttenderServicePriceLineModel model)
    {
        var result = new MyResultQuery();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AttenderServicePrice_Save]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Ins",
                ServiceAndSubjectIds = JsonConvert.SerializeObject(model.Assign),
                model.AttenderId,
                model.AttenderMarginBracketId,
                model.CompanyId,
                model.CreateUserId,
                model.CreateDateTime
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;

        if (result.Successfull)
        {
            await _manageRedisRepository.UpDatedropDownCacheByType(DropDownCache.Attender);
            await _manageRedisRepository.UpDatedropDownCacheByType(DropDownCache.AttenderParaClinic);
        }


        return result;
    }

    public async Task<MyResultQuery> AttenderServicePriceDiAssign(AttenderServicePriceLineModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AttenderServicePrice_Save]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Del",
                ServiceAndSubjectIds = JsonConvert.SerializeObject(model.Assign),
                model.AttenderId,
                model.AttenderMarginBracketId,
                model.CompanyId,
                model.CreateUserId,
                model.CreateDateTime
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;

        if (result.Successfull)
        {
            await _manageRedisRepository.UpDatedropDownCacheByType(DropDownCache.Attender);
            await _manageRedisRepository.UpDatedropDownCacheByType(DropDownCache.AttenderParaClinic);
        }

        return result;
    }

    public async Task<int> AttenderDuplicate(AttenderDuplicate model)
    {
        var sQuery = "[mc].[Spc_AttenderService_Duplicate]";
        var result = 0;
        using (var conn = Connection)
        {
            conn.Open();
            result = await Connection.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    model.FromAttenderId,
                    model.ToAttenderId,
                    model.FromServiceIds,
                    model.FromMedicalSubjectId,
                    model.FromAttenderMarginBracketId,
                    model.CreateUserId,
                    model.IsPreview
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        if (!model.IsPreview && result > 0)
        {
            await _manageRedisRepository.UpDatedropDownCacheByType(DropDownCache.Attender);
            await _manageRedisRepository.UpDatedropDownCacheByType(DropDownCache.AttenderParaClinic);
        }


        return result;
    }

    public async Task<List<AttenderServiceList>> AttenderServiceGetList(int attenderId)
    {
        var sQuery = "[mc].[Spc_AttenderService_GetList]";
        using (var conn = Connection)
        {
            conn.Open();
            var result = await Connection.QueryAsync<AttenderServiceList>(sQuery,
                new
                {
                    AttenderId = attenderId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result.AsList();
        }
    }

    public async Task<MemoryStream> CSVAttenderServiceList(int attenderId)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var Columns = "حق الزحمهطبیب,موضوع درمان,خدمت";
        var getPage = await AttenderServiceGetList(attenderId);

        var Rows = from p in getPage
            select new
            {
                AttenderMarginBracket =
                    $"{p.AttenderMarginBracket} / مبنای حق الزحمه: {p.PriceTypeName} ({p.AttenderCommissionValueName}) -  ({p.MinAmountTitle} - {p.MaxAmountTitle}) ",
                p.MedicalSubject,
                p.Service
            };

        return csvStream = await csvGenerator.GenerateCsv(Rows, Columns.Split(',').ToList());
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(int attederId, int CompanyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_Attender_Service_GetListByAttender";
            conn.Open();
            var result = await conn.QueryAsync<ServiceByAttender>(sQuery,
                new
                {
                    AttenderId = attederId,
                    CompanyId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            var query = from a in result
                select new MyDropDownViewModel
                {
                    Id = a.ServiceId,
                    Name = a.RvuCode.ConvertNullToInt() + " / " + a.CdtCode.ConvertNullToEmpty() + " / " +
                           a.TaminCode.ConvertNullToEmpty() + " / " + a.Name
                };

            return query;
        }
    }


    public async Task<IEnumerable<MyDropDownViewModel>> GetPropertiesDropdown(int attenderid, byte? medicalsubjectid,
        int? attendermarginbracketid, byte type)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AttenderServicePrice_GetProperties]";

            if (type != 2)
            {
                conn.Open();
                var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                    new
                    {
                        AttenderId = attenderid,
                        MedicalSubjectId = medicalsubjectid,
                        AttenderMarginBracketId = attendermarginbracketid,
                        Type = type
                    }, commandType: CommandType.StoredProcedure);
                conn.Close();
                return result;
            }
            else
            {
                conn.Open();
                var result = (await conn.QueryAsync<AttenderMarginBracketDropDown>(sQuery,
                    new
                    {
                        AttenderId = attenderid,
                        MedicalSubjectId = medicalsubjectid,
                        AttenderMarginBracketId = attendermarginbracketid,
                        Type = type
                    }, commandType: CommandType.StoredProcedure)).ToList();

                var finalResult = (from p in result
                    select new MyDropDownViewModel
                    {
                        Id = p.Id,
                        Name = p.PriceTypeId > 0
                            ? p.Name + $"/ مبنای حق الزحمه: {p.PriceTypeName} " +
                              $"({p.AttenderCommissionValueName}) -  ({p.MinAmountTitle} - {p.MaxAmountTitle})"
                            : p.Name
                    }).ToList();
                conn.Close();
                return finalResult;
            }
        }
    }
}