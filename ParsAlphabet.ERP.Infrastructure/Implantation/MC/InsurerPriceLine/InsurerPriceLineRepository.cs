using System.Data;
using System.Net;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.Central.ObjectModel.MedicalCare.InsurerPrice;
using ParsAlphabet.ERP.Application.Dtos.GN.SendHistory;
using ParsAlphabet.ERP.Application.Dtos.MC.InsurerPriceLine;
using ParsAlphabet.ERP.Application.Interfaces.MC;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.Central;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.SendHistory;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.User;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.InsurerPriceLine;

public class InsurerPriceLineRepository :
    BaseRepository<InsurerPriceLineModel, int, string>,
    IBaseRepository<InsurerPriceLineModel, int, string>
{
    private readonly IAdmissionsRepository _admissionsRepository;
    private readonly IInsurerPriceServiceCentral _insurerPriceServiceCentral;
    private readonly IMapper _mapper;
    private readonly SendHistoryRepository _sendHistoryRepository;
    private readonly UserRepository _userRepository;

    public InsurerPriceLineRepository(IConfiguration config, IAdmissionsRepository admissionsRepository
        , IInsurerPriceServiceCentral insurerPriceServiceCentral, UserRepository userRepository
        , SendHistoryRepository sendHistoryRepository, IMapper mapper) : base(config)
    {
        _admissionsRepository = admissionsRepository;
        _userRepository = userRepository;
        _insurerPriceServiceCentral = insurerPriceServiceCentral;
        _sendHistoryRepository = sendHistoryRepository;
        _mapper = mapper;
    }

    public GetColumnsViewModel GetColumns(byte itemTypeId, byte insurerTypeId)
    {
        var list = new GetColumnsViewModel
        {
            IsEditable = true,
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "insurerPriceId", Title = "شناسه", Type = (int)SqlDbType.Int, Size = 50, FilterType = "number",
                    IsDtParameter = true, Width = 8, IsPrimary = true
                },
                new() { Id = "insurerId", IsPrimary = true },
                new() { Id = "insurerLineId", IsPrimary = true },
                new() { Id = "itemId", IsPrimary = true },
                new()
                {
                    Id = "insurer", Title = "بیمه", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = $"/api/MC/InsuranceApi/getinsurerlistbytype/{insurerTypeId}", Width = 11,
                    IsPrimary = true
                },
                new()
                {
                    Id = "insurerLine", Title = "صندوق", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = insurerTypeId == 1 || insurerTypeId == 2, IsFilterParameter = true, Width = 13,
                    IsPrimary = true
                },
                new() { Id = "medicalItemPriceId", IsPrimary = true },
                new() { Id = "insurerPriceCalculationMethod", IsPrimary = true },
                new()
                {
                    Id = "insurerPriceCalculationMethodId", Title = "نوع محاسبه", Type = (int)SqlDbType.TinyInt,
                    Size = 50, IsPrimary = true, IsDtParameter = true, IsFilterParameter = true,
                    FilterType = "select2",
                    FilterTypeApi = $"/api/AdmissionsApi/calculationmethod_getdropdown/{itemTypeId}/{insurerTypeId}",
                    Width = 18,
                    Inputs = _admissionsRepository.CalculationMethodDropDown(itemTypeId, insurerTypeId).Result.ToList(),
                    Editable = true, IsSelect2 = true, InputType = "select2"
                },

                new()
                {
                    Id = "insurerPrice", Title = "تعرفه بیمه", Type = (int)SqlDbType.Decimal, Size = 50,
                    Editable = true, IsDtParameter = true, Width = 11, InputType = "money", MaxLength = 11
                },
                new()
                {
                    Id = "insurerSharePer", Title = "سهم بیمه (درصد)", Type = (int)SqlDbType.Decimal, Size = 50,
                    Editable = true, IsDtParameter = true, Width = 10, InputType = "money", MaxLength = 3
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 4,
                    Align = "center"
                },
                new()
                {
                    Id = "createUser", Title = " کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 11
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 14
                }
            }
        };


        return list;
    }

    public GetColumnsViewModel GetColumnsInsurerPriceSendHistoryGetpage()
    {
        var list = new GetColumnsViewModel
        {
            IsSelectable = true,
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, Width = 10, IsPrimary = true,
                    IsDtParameter = true
                },
                new() { Id = "sendHistoryId", IsPrimary = true },
                new() { Id = "itemId", IsPrimary = true },
                new()
                {
                    Id = "item", Title = "خدمت", Type = (int)SqlDbType.NVarChar, Size = 30, IsDtParameter = true,
                    Width = 20
                },
                new()
                {
                    Id = "insurerPrice", Title = "تعرفه", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, IsCommaSep = true, Width = 15
                },
                new()
                {
                    Id = "insurerSharePer", Title = "درصد بیمه", Type = (int)SqlDbType.NVarChar, Size = 10,
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

    public async Task<MemoryStream> Csv(NewGetPageViewModel model)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var itemTypeId = Convert.ToByte(model.Form_KeyValue[0]?.ToString());
        var insurerTypeId = Convert.ToByte(model.Form_KeyValue[1]?.ToString());

        var Columns = string.Join(',',
            GetColumns(itemTypeId, insurerTypeId).DataColumns.Where(x => x.IsDtParameter && x.Id != "action")
                .Select(z => z.Title));
        var getPage = await GetPage(model);

        getPage.Data = getPage.Data.Where(ip => ip.InsurerPriceId != 0).ToList();

        var Rows = from p in getPage.Data
            select new
            {
                p.InsurerPriceId,
                p.Insurer,
                p.InsurerLine,
                p.InsurerPriceCalculationMethodId,
                p.InsurerPrice,
                p.InsurerSharePer,
                p.CreateUser,
                p.CreateDateTimePersian
            };

        return csvStream = await csvGenerator.GenerateCsv(Rows, Columns.Split(',').ToList());
    }

    public async Task<MyResultPage<List<InsurerPriceLineGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<InsurerPriceLineGetPage>>
        {
            Data = new List<InsurerPriceLineGetPage>()
        };
        int? insurerLineId = null;
        var itemTypeId = Convert.ToByte(model.Form_KeyValue[0]?.ToString());
        var insurerTypeId = Convert.ToByte(model.Form_KeyValue[1]?.ToString());
        var medicalItemPriceId = Convert.ToInt32(model.Form_KeyValue[2]?.ToString());

        if (model.Form_KeyValue.Length > 3)
            if (model.Form_KeyValue[3]?.ToString() != null)
                insurerLineId = Convert.ToInt16(model.Form_KeyValue[3]?.ToString());

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("MedicalItemPriceId", medicalItemPriceId);
        parameters.Add("InsurerTypeId", insurerTypeId);
        parameters.Add("InsurerId",
            model.Filters.Any(x => x.Name == "insurer")
                ? model.Filters.FirstOrDefault(x => x.Name == "insurer").Value
                : null);
        parameters.Add("InsurerLineName",
            model.Filters.Any(x => x.Name == "insurerLine")
                ? model.Filters.FirstOrDefault(x => x.Name == "insurerLine").Value
                : null);
        parameters.Add("MedicalCalculatiomMethodId",
            model.Filters.Any(x => x.Name == "insurerPriceCalculationMethodId")
                ? model.Filters.FirstOrDefault(x => x.Name == "insurerPriceCalculationMethodId").Value
                : null);
        parameters.Add("CompanyId", model.CompanyId);


        result.Columns = GetColumns(itemTypeId, insurerTypeId);


        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_InsurerPrice_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<InsurerPriceLineGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultPage<List<InsurerPriceSendHistoryGetpage>>> GetPageInsurerPriceSendHistory(
        NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<InsurerPriceSendHistoryGetpage>>();

        int? p_insurerId = Convert.ToInt32(model.Form_KeyValue[1]?.ToString());
        int? p_insurerLineId = Convert.ToInt32(model.Form_KeyValue[2]?.ToString());
        var p_serviceId = Convert.ToInt32(model.Form_KeyValue[3]?.ToString());

        var p_isSent = Convert.ToBoolean(model.Form_KeyValue[4]?.ToString());

        var parameters = new DynamicParameters();
        parameters.Add("ServiceId", p_serviceId);
        parameters.Add("InsurerId", p_insurerId == 0 ? null : p_insurerId);
        parameters.Add("InsurerLineId", p_insurerLineId == 0 ? null : p_insurerLineId);
        parameters.Add("IsSent", p_isSent);
        result = await _sendHistoryRepository.InsurerPriceSendHistoryGetPage(parameters);
        result.Columns = GetColumnsInsurerPriceSendHistoryGetpage();

        return result;
    }

    public async Task<InsurerPriceLineGetRecord> GetRecordById(int Id)
    {
        using (var conn = Connection)
        {
            conn.Open();
            var sQuery = "pb.Spc_Tables_GetRecord";
            var result = await conn.QueryFirstOrDefaultAsync<InsurerPriceLineGetRecord>(sQuery, new
            {
                TableName = "mc.InsurerPrice",
                Filter = $"Id={Id}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.InsurerPriceCalculationMethodName =
                await _admissionsRepository.CalculationMethodName(result.InsurerPriceCalculationMethodId);
            result.CreateUserFullName = await _userRepository.GetUserFullName(result.CreateUserId);

            return result;
        }
    }

    public async Task<MyResultStatus> Insert(InsurerPriceLineModel model)
    {
        var finalResult = new MyResultStatus();
        var result = new ResultSaveInsurerPrice();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_InsurerPrice_InsUpd]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<ResultSaveInsurerPrice>(sQuery, new
            {
                model.Opr,
                model.Id,
                model.InsurerId,
                model.InsurerLineId,
                model.MedicalItemPriceId,
                model.InsurerPriceCalculationMethodId,
                model.InsurerPrice,
                model.InsurerSharePer,
                model.CompanyId,
                model.CreateUserId,
                model.CreateDateTime
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = result.Status == 100;

            result.DateTime = model.CreateDateTime;
            result.CreateUserFullName = await _userRepository.GetUserFullName(model.CreateUserId);
            if (result.Successfull && result.SendHistoryId.NotNull() && result.SendHistoryId != Guid.Empty)
            {
                finalResult = await SendCentralInsurerPrice(result.Id.ToString(), model.CreateUserId);
                finalResult.Id = result.Id;
                return finalResult;
            }

            return result;
        }
    }

    public async Task<MyResultQuery> Delete(int id, int companyId)
    {
        var centralIds = await GetInsurerPriceCentral(id, null, null, null, null, null, null, null);

        if (centralIds.Data.Any(x => x.CentralId.NotNull() && x.CentralId > 0))
        {
            var centralIdList = centralIds.Data.Where(x => x.CentralId.NotNull() && x.CentralId > 0).Select(a =>
                new CentralInsurerPriceModel
                {
                    CentralId = a.CentralId,
                    InsurerPrice = 0,
                    InsurerSharePer = 0
                }).ToList();


            var sendResult = await _insurerPriceServiceCentral.InsurerPriceCentral(centralIdList[0]);

            if (sendResult.HttpStatus == HttpStatusCode.Unauthorized
                || sendResult.HttpStatus == HttpStatusCode.BadRequest
                || sendResult.HttpStatus == HttpStatusCode.InternalServerError)
                return new MyResultQuery
                {
                    Successfull = false,
                    Status = (int)HttpStatusCode.Unauthorized,
                    StatusMessage = " درخواست شما به درستی انجام نشد ، مجدد تلاش فرمایید"
                };
            if (sendResult.HttpStatus == HttpStatusCode.NotAcceptable)
                if (sendResult.ValidationErrors.ListHasRow())
                    return new MyResultQuery
                    {
                        Successfull = false,
                        StatusMessage = "error",
                        Status = -100,
                        ValidationErrors = sendResult.ValidationErrors
                    };
        }

        var result = new MyResultQuery();

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecordWithFilter";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                TableName = "mc.InsurerPrice",
                Filter = $"Id = {id} AND CompanyId = {companyId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
        }

        result.Successfull = result.Status == 100;

        return result;
    }

    public async Task<int> GetServiceInsurerCount(byte itemTypeId, int insurerId, int? insurerLineId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_InsurerPrice_Count]";
            conn.Open();
            var result = await conn.QuerySingleOrDefaultAsync<int>(sQuery,
                new
                {
                    ItemTypeId = itemTypeId,
                    InsurerId = insurerId,
                    InsurerLineId = insurerLineId
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> CalculationMethodIdGetListByInsurer(int insurerId,
        short? insurerLineId, byte itemTypeId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_InsurerPriceCalculationMethod_GetListByInsurer]";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    InsurerId = insurerId,
                    InsurerLineId = insurerLineId,
                    ItemTypeId = itemTypeId
                }, commandType: CommandType.StoredProcedure)).ToList();

            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetItemsInsurerPrice(int insurerId, short? insurerLineId,
        byte itemTypeId, byte insurerPriceCalculationMethodId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_InsurerPrice_GetItems]";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    InsurerId = insurerId,
                    InsurerLineId = insurerLineId,
                    ItemTypeId = itemTypeId,
                    InsurerPriceCalculationMethodId = insurerPriceCalculationMethodId
                }, commandType: CommandType.StoredProcedure)).ToList();

            conn.Close();
            return result;
        }
    }

    public async Task<List<ServiceCountCalculationMethodViewModel>> GetServiceCountCalculationMethodList(
        CalculationMethodServiceCountViewModel model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_InsurerPriceCalculationMethod_GetServiceCount]";
            conn.Open();
            var result = (await conn.QueryAsync<ServiceCountCalculationMethodViewModel>(sQuery,
                new
                {
                    model.InsurerId,
                    model.InsurerLineId,
                    model.ItemTypeId,
                    model.InsurerPriceCalculationMethodId
                }, commandType: CommandType.StoredProcedure)).ToList();

            conn.Close();
            return result;
        }
    }


    public GetColumnsViewModel GetCalculationMethodColumns()
    {
        var list = new GetColumnsViewModel
        {
            IsEditable = true,
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "item", Title = "آیتم", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 11
                },
                new()
                {
                    Id = "insurer", Title = "بیمه", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 11
                },
                new()
                {
                    Id = "insurerLine", Title = "صندوق بیمه", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 11
                },
                new()
                {
                    Id = "insurerType", Title = "نوع بیمه", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 11
                },
                new()
                {
                    Id = "insurerPriceCalculationMethod", Title = "روش محاسبه", Type = (int)SqlDbType.NVarChar,
                    Size = 50, IsDtParameter = true, Width = 11
                },
                new()
                {
                    Id = "beginPrice", Title = "تعرفه پایه", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 11
                },
                new()
                {
                    Id = "insurerPrice", Title = "تعرفه بیمه", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 11
                },
                new()
                {
                    Id = "insurerSharePer", Title = "درصد پوشش", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 11
                },
                new()
                {
                    Id = "createUser", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 11
                }
            }
        };


        return list;
    }

    public async Task<MyResultPage<List<CalculationMethodGetPage>>> GetCalculationMethod(
        NewGetCalculationMethodGetPage model)
    {
        var result = new MyResultPage<List<CalculationMethodGetPage>>
        {
            Data = new List<CalculationMethodGetPage>()
        };


        var parameters = new DynamicParameters();
        parameters.Add("InsurerId", model.InsurerId);
        parameters.Add("InsurerLineId", model.InsurerLineId > 0 ? model.InsurerLineId : null);
        parameters.Add("ItemTypeId", model.ItemTypeId);
        parameters.Add("InsurerPriceCalculationMethodId", model.InsurerPriceCalculationMethodId);
        parameters.Add("InsurerSharePer", model.InsurerSharePer);


        result.Columns = GetCalculationMethodColumns();


        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_InsurerLinePrice_GetItems]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<CalculationMethodGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<MemoryStream> csvCalculationMethod(NewGetCalculationMethodGetPage model)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var Columns = string.Join(',', GetCalculationMethodColumns().DataColumns.Select(z => z.Title));
        var getPage = await GetCalculationMethod(model);


        var Rows = from p in getPage.Data
            select new
            {
                p.Item,
                p.Insurer,
                p.InsurerLine,
                p.InsurerType,
                p.InsurerPriceCalculationMethod,
                p.BeginPrice,
                p.InsurerPrice,
                p.InsurerSharePer,
                p.CreateUser
            };

        return csvStream = await csvGenerator.GenerateCsv(Rows, Columns.Split(',').ToList());
    }

    public async Task<MyResultPage<List<InsurerPriceGetCentral>>> GetInsurerPriceCentral(int? id, int? itemId,
        int? fromInsurerId, int? fromInsurerLineId
        , byte? fromInsurerPriceCalculationMethodId, string fromInsurerSharePer, int? toInsurerId, int? toInsurerLineId)
    {
        var result = new MyResultPage<List<InsurerPriceGetCentral>>();
        using (var conn = Connection)
        {
            conn.Open();
            var sQuery = "[mc].[Spc_InsurerPrice_GetCentral]";
            result.Data = (await conn.QueryAsync<InsurerPriceGetCentral>(sQuery, new
            {
                Id = id,
                ItemId = itemId,
                FromInsurerId = fromInsurerId,
                FromInsurerLineId = fromInsurerLineId,
                FromInsurerPriceCalculationMethodId = fromInsurerPriceCalculationMethodId,
                FromInsurerSharePer = fromInsurerSharePer,
                ToInsurerId = toInsurerId,
                ToInsurerLineId = toInsurerLineId
            }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();

            return result;
        }
    }

    public async Task<MyResultStatus> InsurerPriceSendBulk(List<CentralInsurerPriceModel> model,
        List<InsurerPriceSendHistoryGetList> sendHistoryModel, int userId, int affectedRows)
    {
        var result = new MyResultStatus();

        var sendResult = await _insurerPriceServiceCentral.InsurerPriceBulkCentral(model, OperationType.Insert);

        if (sendResult.HttpStatus == HttpStatusCode.Unauthorized
            || sendResult.HttpStatus == HttpStatusCode.BadRequest
            || sendResult.HttpStatus == HttpStatusCode.InternalServerError)
        {
            result.Successfull = false;
            result.Status = -101;
            result.StatusMessage = " ارسال انجام نشد ، مجدد تلاش فرمایید";
        }
        else if (sendResult.HttpStatus == HttpStatusCode.NotAcceptable)
        {
            if (sendResult.ValidationErrors.ListHasRow())
            {
                result.Successfull = false;
                result.StatusMessage = "error";
                result.Status = -102;
                result.ValidationErrors = sendResult.ValidationErrors;
            }
        }
        else if (sendResult.HttpStatus == HttpStatusCode.OK && sendResult.Data != null)
        {
            var updBulkSendHistory = await SendHistoryBulkUpd(sendHistoryModel, sendResult.Data, userId);

            result.Status = updBulkSendHistory.Status;
            result.Successfull = updBulkSendHistory.Status == 100 ? true : false;
            result.StatusMessage = updBulkSendHistory.StatusMessage;
            result.AffectedRows = affectedRows;
        }

        return result;
    }

    public async Task<MyResultStatus> SendToCentral(string ids, int userId)
    {
        if (ids.Split(",").Length > 2)
            return await SendBulkCentralInsurPrice(ids, userId);
        return await SendCentralInsurerPrice(ids, userId);
    }

    public async Task<MyResultStatus> SendHistoryBulkUpd(List<InsurerPriceSendHistoryGetList> model,
        List<ResultBulkSaveInsurerPrice> sendResult, int userId)
    {
        var logModel = (from s in model
            join m in sendResult on s.LocalId equals m.LocalId
            select new SendHistoryViewModel
            {
                Id = s.SendHistoryId,
                CentralId = m.CentralId.ToString(),
                ObjectId = s.LocalId.ToString()
            }).ToList();

        return await _sendHistoryRepository.UpdateBulk(logModel, 10, userId);
    }

    public async Task<MyResultStatus> SendBulkCentralInsurPrice(string ids, int userId)
    {
        var result = new MyResultStatus();
        var error = new List<string>();
        var centralModel = new List<CentralInsurerPriceModel>();

        var model = await _sendHistoryRepository.InsurerPriceSendHistoryGetList(ids);

        if (!model.ListHasRow())
            return new MyResultStatus
            {
                Successfull = false,
                StatusMessage = "موردی برای ارسال وجود ندارد",
                Status = -100
            };

        centralModel = _mapper.Map<List<InsurerPriceSendHistoryGetList>, List<CentralInsurerPriceModel>>(model);

        result = await InsurerPriceSendBulk(centralModel, model, userId, 0);

        return result;
    }

    public async Task<MyResultStatus> SendCentralInsurerPrice(string id, int userId)
    {
        var centralModel = new CentralInsurerPriceModel();
        var result = new MyResultStatus();

        var model = await _sendHistoryRepository.InsurerPriceSendHistoryGetList(id);

        if (!model.ListHasRow())
            return new MyResultStatus
            {
                Successfull = false,
                StatusMessage = "موردی برای ارسال وجود ندارد",
                Status = -101
            };

        centralModel = _mapper.Map<InsurerPriceSendHistoryGetList, CentralInsurerPriceModel>(model[0]);

        var sendResult = await _insurerPriceServiceCentral.InsurerPriceCentral(centralModel);

        if (sendResult.HttpStatus == HttpStatusCode.Unauthorized
            || sendResult.HttpStatus == HttpStatusCode.BadRequest
            || sendResult.HttpStatus == HttpStatusCode.InternalServerError)
            return new MyResultStatus
            {
                Successfull = false,
                Status = (int)HttpStatusCode.Unauthorized,
                StatusMessage = " ارسال انجام نشد ، مجدد تلاش فرمایید"
            };

        if (sendResult.HttpStatus == HttpStatusCode.NotAcceptable)
        {
            if (sendResult.ValidationErrors.ListHasRow())
                return new MyResultStatus
                {
                    Successfull = false,
                    StatusMessage = "error",
                    Status = -102,
                    ValidationErrors = sendResult.ValidationErrors
                };
        }

        else if (sendResult.HttpStatus == HttpStatusCode.OK && sendResult.Data != null)
        {
            if (sendResult.Data.Status == 100)
            {
                var updSendHistory =
                    await _sendHistoryRepository.Update(model[0].SendHistoryId, sendResult.Data.Id.ToString(), userId);

                return new MyResultStatus
                {
                    Successfull = updSendHistory.Successfull,
                    ValidationErrors = null,
                    StatusMessage = updSendHistory.StatusMessage
                };
            }
        }

        return result;
    }
}