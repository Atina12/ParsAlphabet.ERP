using System.Data;
using System.Net;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.Central.ObjectModel.MedicalCare;
using ParsAlphabet.ERP.Application.Dtos.MC.Service;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.Central;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.SendHistory;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.Service;

public class ServiceRepository :
    BaseRepository<ServiceModel, int, string>,
    IBaseRepository<ServiceModel, int, string>
{
    private readonly IServiceServiceCentral _centralServiceService;
    private readonly IMapper _mapper;
    private readonly SendHistoryRepository _sendHistoryRepository;

    public ServiceRepository(IConfiguration config, IServiceServiceCentral centralServiceService
        , SendHistoryRepository sendHistoryRepository, IMapper mapper)
        : base(config)
    {
        _centralServiceService = centralServiceService;
        _sendHistoryRepository = sendHistoryRepository;
        _mapper = mapper;
    }

    public GetColumnsViewModel GetColumns(string formType)
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", FillType = "number", Width = 4, IsPrimary = true
                },
                new()
                {
                    Id = "name", Title = "نام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsPrimary = true, IsFilterParameter = true, Width = 19
                },
                new()
                {
                    Id = "attribute", Title = "نشانه", Type = (int)SqlDbType.VarChar, Size = 5, IsFilterParameter = true
                },
                new() { Id = "itemTypeId", IsPrimary = true },
                new() { Id = "serviceTypeId", IsPrimary = true },
                new() { Id = "onlineName", IsPrimary = true },
                new()
                {
                    Id = "serviceType", Title = "نوع خدمت ", Type = (int)SqlDbType.Int, Size = 50, IsDtParameter = true,
                    IsPrimary = true, IsFilterParameter = true, Width = 10, FilterType = "select2",
                    FilterTypeApi = "/api/MC/ServiceTypeApi/getdropdown"
                },
                new()
                {
                    Id = "terminologyId", Title = "نمبر تذکره RVU", Type = (int)SqlDbType.Int, Size = 0,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "number", Width = 8
                },
                new()
                {
                    Id = "cdtTerminologyId", Title = "نمبر تذکره CDT", Type = (int)SqlDbType.NVarChar, Size = 0,
                    IsDtParameter = true, IsFilterParameter = true, Width = 8
                },
                new()
                {
                    Id = "taminTerminologyId", Title = "نمبر تذکره تامین LOINC", Type = (int)SqlDbType.NVarChar, Size = 0,
                    IsDtParameter = true, IsFilterParameter = true, Width = 9
                },
                new()
                {
                    Id = "attribute", Title = "نشانه", Type = (int)SqlDbType.Int, Size = 0, IsDtParameter = true,
                    IsCommaSep = true, Width = 6
                },
                new()
                {
                    Id = "professionalCode", Title = "کد حرفه ای", Type = (int)SqlDbType.Decimal, IsDtParameter = true,
                    Align = "center", Width = 7
                },
                new()
                {
                    Id = "technicalCode", Title = "کد فنی", Type = (int)SqlDbType.Decimal, IsDtParameter = true,
                    Align = "center", Width = 7
                },
                new()
                {
                    Id = "anesthesiaBase", Title = "کد بیهوشی", Type = (int)SqlDbType.Decimal, IsDtParameter = true,
                    Align = "center", Width = 6
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 1, IsDtParameter = true,
                    Align = "center", Width = 6
                },
                new()
                {
                    Id = "sendResult", Title = "وضعیت ارسال", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 5
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 5 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" }
            }
        };

        if (formType == "service")
        {
            list.Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" },
                new() { Name = "sep1", IsSeparator = true },
                new() { Name = "sendToCentral", Title = "ارسال مرکزی", IconName = "fa fa-paper-plane color-blue" }
            };
        }
        else if (formType == "itempricing")
        {
            list.Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "basicPricing", Title = "تعرفه پایه", IconName = "fa fa-umbrella" },
                new() { Name = "compPricing", Title = "تعرفه تکمیلی", IconName = "fa fa-umbrella-plus" },
                new() { Name = "thirdpartyPricing", Title = "تعرفه طرف قرارداد", IconName = "fa fa-users-cog" },
                new() { Name = "discountPricing", Title = "تعرفه تخفیف", IconName = "fa fa-percent" },
                new() { Name = "sendToCentral", Title = "ارسال مرکزی", IconName = "fa fa-paper-plane color-blue" }
            };
        }
        else
        {
            list.ActionType = "inline";
            list.Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "insurer", Title = "تعرفه بیمه اجباری", ClassName = "btn blue_outline_2 ml-1",
                    IconName = "fa fa-umbrella"
                },
                new()
                {
                    Name = "compinsurer", Title = "تعرفه بیمه تکمیلی", ClassName = "btn blue_outline_2 ml-1",
                    IconName = "fa fa-umbrella-plus"
                },
                new()
                {
                    Name = "thirdparty", Title = "تعرفه طرف قرارداد", ClassName = "btn blue_outline_2 ml-1",
                    IconName = "fa fa-users-cog"
                }
            };
        }


        return list;
    }

    public async Task<MemoryStream> CSV(NewGetPageViewModel model)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var formType = model.Form_KeyValue[0]?.ToString();

        var Columns = string.Join(',',
            GetColumns(formType).DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title));
        var getPage = await GetPage(model);

        var Rows = from p in getPage.Data
            select new
            {
                p.Id,
                p.Name,
                p.ServiceType,
                p.TerminologyId,
                p.CdtTerminologyId,
                p.TaminTerminologyId,
                p.Attribute,
                p.ProfessionalCode,
                p.TechnicalCode,
                p.AnesthesiaBase,
                IsActive = p.IsActive ? "فعال" : "غیرفعال",
                SendResult = p.CentralId != 0 ? "ارسال شده" : "ارسال نشده"
            };

        return csvStream = await csvGenerator.GenerateCsv(Rows, Columns.Split(',').ToList());
    }


    public async Task<MyResultPage<List<ServiceGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<ServiceGetPage>>
        {
            Data = new List<ServiceGetPage>()
        };

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "name")
                ? model.Filters.FirstOrDefault(x => x.Name == "name").Value
                : null);
        parameters.Add("ServiceTypeId",
            model.Filters.Any(x => x.Name == "serviceType")
                ? model.Filters.FirstOrDefault(x => x.Name == "serviceType").Value
                : null);
        parameters.Add("Attribute",
            model.Filters.Any(x => x.Name == "attribute")
                ? model.Filters.FirstOrDefault(x => x.Name == "attribute").Value
                : null);
        parameters.Add("TerminologyId",
            model.Filters.Any(x => x.Name == "terminologyId")
                ? model.Filters.FirstOrDefault(x => x.Name == "terminologyId").Value
                : null);
        parameters.Add("TaminTerminologyId",
            model.Filters.Any(x => x.Name == "taminTerminologyId")
                ? model.Filters.FirstOrDefault(x => x.Name == "taminTerminologyId").Value
                : null);
        parameters.Add("CdtTerminologyId",
            model.Filters.Any(x => x.Name == "cdtTerminologyId")
                ? model.Filters.FirstOrDefault(x => x.Name == "cdtTerminologyId").Value
                : null);

        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);

        var formType = model.Form_KeyValue[0]?.ToString();

        result.Columns = GetColumns(formType);

        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_Service_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<ServiceGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(string term, byte? isActive, int companyId)
    {
        var filter = string.Empty;

        if (isActive != 2 && isActive != null)
            filter += $"IsActive = {(isActive.Value == 1 ? 1 : 0)} And ";

        filter +=
            $"CompanyId={companyId} AND ( Id='{(int.TryParse(term, out _) ? term : "0")}' OR Name Like N'%{term}%' ) ";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.Service",
                    TitleColumnName = "Short_Name",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<string> GetServiceName(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "mc.Service",
                    ColumnName = "Name",
                    Filter = $"Id={id}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<int> GetServicePrice(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "mc.Service",
                    ColumnName = "Price",
                    Filter = $"Id={id}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<KParameter> GetKParameter(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<KParameter>(sQuery,
                new
                {
                    TableName = "mc.thrRVU",
                    IdColumnName = "Id",
                    ColumnNameList =
                        "ISNULL(Code,0) Code, ISNULL(ProfessionalCode,0) ProfessionalCode,ISNULL(TechnicalCode,0) TechnicalCode,ISNULL(AnesthesiaBase,0) AnesthesiaBase",
                    IdList = "",
                    Filter = $"Id={id} AND IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<CdtTermonologyParameter> GetCdtParameter(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<CdtTermonologyParameter>(sQuery,
                new
                {
                    TableName = "mc.thrCDT",
                    IdColumnName = "Id",
                    ColumnNameList = "ISNULL(Code,0) Code,ISNULL(Description,'') Description ",
                    IdList = "",
                    Filter = $"Id={id} AND IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<bool> CheckExistTaminTerminology(MyDropDownViewModel model)
    {
        var result = 0;
        var filter = string.Empty;
        if (model.Id == 0)
            filter = $"TaminTerminologyId={model.Name} AND [CompanyId]={model.CompanyId}";
        else
            filter = $"TaminTerminologyId={model.Name} AND Id<>{model.Id} AND [CompanyId]={model.CompanyId}";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            result = await conn.ExecuteScalarAsync<short>(sQuery, new
            {
                TableName = "mc.Service",
                ColumnName = "Id",
                Filter = filter
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        return result == 0;
    }

    public async Task<TaminTermonologyParameter> GetTaminParameter(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<TaminTermonologyParameter>(sQuery,
                new
                {
                    TableName = "mc.taminService",
                    IdColumnName = "Id",
                    ColumnNameList =
                        "ISNULL(TAREF_CODE,'') TarefCode,ISNULL(GOVERNMENT_PRICE,0) GovermentPrice,ISNULL(FREE_PRICE,0) FreePrice,ISNULL(TECHPRICE,0) TechPrice,ISNULL(MAX_AGE,0) MaxAge,ISNULL(MIN_AGE,0) MinAge,ISNULL(AcceptableGender,'') AcceptableGender",
                    IdList = "",
                    Filter = $"Id={id} AND IsActive=1 "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<bool> GetNationalCode(CheckAttenderNationalCode model)
    {
        var filter = "";

        if (model.Id == 0)
            filter = $"CompanyId={model.CompanyId} AND NationalCode='{model.NationalCode}'";
        else
            filter = $"CompanyId={model.CompanyId} AND NationalCode='{model.NationalCode}' AND ( Id<>{model.Id})";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "mc.Service",
                    ColumnName = "NationalCode",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result == null ? true : false;
        }
    }

    public async Task<TerminologyInfoService> GetTerminologyInfoByServiceId(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "mc.[Spc_GetTerminologyInfo_Service]";
            conn.Open();

            var result = await conn.QuerySingleOrDefaultAsync<TerminologyInfoService>(sQuery,
                new { ServiceId = id }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<int> UpdateThirdPartyPrice(UpdateThirdPartyPrice model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_ServiceThirdPartyPrice_Upd]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                model.ThirdPartyId,
                model.Attribute,
                model.ServiceTypeId,
                model.PriceType,
                model.DiscountPer,
                model.LastModified,
                model.CompanyId,
                model.FromNationalCode,
                model.ToNationalCode,
                model.FromServiceId,
                model.ToServiceId,
                model.HasNationalCode,
                model.IsPreview
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<List<ServiceAdmissionDropDown>> GetServiceAdmissionDropdown(GetServiceAdmissionDropDown model)
    {
        var sQuery = "[mc].[Spc_Service_AdmissionService_GetList]";
        var result = new List<ServiceAdmissionDropDown>();
        using (var conn = Connection)
        {
            conn.Open();
            result = (await conn.QueryAsync<ServiceAdmissionDropDown>(sQuery,
                new
                {
                    model.FromReserveDate,
                    model.ToReserveDate,
                    model.CompanyId,
                    model.ServiceId,
                    model.ServiceCode,
                    model.ServiceName
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<List<ServiceTaminId>> GetTaminServiceId(List<string> taminCodeList)
    {
        var sQuery = "[mc].[Spc_TaminServiceId_GetList]";

        using (var conn = Connection)
        {
            conn.Open();
            var result = (await Connection.QueryAsync<ServiceTaminId>(sQuery,
                new
                {
                    TaminIdList = string.Join(',', taminCodeList)
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<int> GetServiceThirdParty(int identityId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();
            var result = await conn.QuerySingleOrDefaultAsync<int>(sQuery,
                new
                {
                    IsSecondLang = false,
                    TableName = "mc.Service_ThirdParty",
                    IdColumnName = "ServiceId",
                    ColumnNameList = "count(ServiceId)",
                    IdList = "",
                    Filter = $"ThirdPartyId={identityId}",
                    OrderBy = ""
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<MyResultQuery> Insert(ServiceModel model)
    {
        var result = new MyResultQuery();

        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_Service_InsUpd";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Ins",
                model.Id,
                CentralId = model.CentralId == 0 ? null : model.CentralId,
                model.Name,
                model.OnlineName,
                model.ServiceTypeId,
                model.CdtTerminologyId,
                model.TerminologyId,
                model.TaminTerminologyId,
                model.IsActive,
                model.PrintDescription,
                model.CreateUserId,
                model.CreateDateTime,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;

        if (!result.Successfull) result.ValidationErrors.Add(result.StatusMessage);
        return result;
    }

    public async Task<MyResultQuery> Update(ServiceModel model)
    {
        var result = new MyResultQuery();

        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_Service_InsUpd";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Upd",
                model.Id,
                CentralId = model.CentralId == 0 ? null : model.CentralId,
                model.Name,
                model.OnlineName,
                model.ServiceTypeId,
                model.CdtTerminologyId,
                model.TerminologyId,
                model.TaminTerminologyId,
                model.IsActive,
                model.PrintDescription,
                model.CreateUserId,
                model.CreateDateTime,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;

        if (!result.Successfull) result.ValidationErrors.Add(result.StatusMessage);
        return result;
    }

    public async Task<MyResultStatus> SendCentralService(int id, int userId)
    {
        var centralModel = new CentralService();
        var result = new MyResultStatus();
        var model = await _sendHistoryRepository.ServiceSendHistoryGetRecord(id);

        if (!model.NotNull())
            return new MyResultStatus
            {
                Successfull = false,
                StatusMessage = "موردی برای ارسال وجود ندارد"
            };

        centralModel = _mapper.Map<ServiceSendHistoryGetRecord, CentralService>(model);

        var sendResult = await _centralServiceService.ServiceCentral(centralModel);

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
                    StatusMessage = "error",
                    Status = -100,
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
}