using System.Data;
using System.Net;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.Central.ObjectModel.MedicalCare;
using ParsAlphabet.Central.ObjectModel.MedicalCare.InsurerPrice;
using ParsAlphabet.ERP.Application.Dtos.GN.SendHistory;
using ParsAlphabet.ERP.Application.Dtos.MC.InsurerPriceLine;
using ParsAlphabet.ERP.Application.Dtos.MC.ServiceItemPricing;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.Central;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.SendHistory;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.User;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.InsurerPriceLine;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.ServiceItemPricing;

public class ServiceItemPricingRepository :
    BaseRepository<ServiceItemPricingModel, int, string>,
    IBaseRepository<ServiceItemPricingModel, int, string>
{
    private readonly InsurerPriceLineRepository _insurerPriceLineRepository;
    private readonly IInsurerPriceServiceCentral _insurerPriceServiceCentral;
    private readonly IMapper _mapper;
    private readonly IMedicalItemPriceServiceCentral _medicalItemPriceServiceCentral;
    private readonly SendHistoryRepository _sendHistoryRepository;
    private readonly UserRepository _userRepository;

    public ServiceItemPricingRepository(
        IConfiguration config,
        UserRepository userRepository,
        IMapper mapper,
        IMedicalItemPriceServiceCentral medicalItemPriceServiceCentral,
        IInsurerPriceServiceCentral insurerPriceServiceCentral,
        InsurerPriceLineRepository insurerPriceLineRepository,
        SendHistoryRepository sendHistoryRepository) : base(config)
    {
        _userRepository = userRepository;
        _mapper = mapper;
        _medicalItemPriceServiceCentral = medicalItemPriceServiceCentral;
        _insurerPriceServiceCentral = insurerPriceServiceCentral;
        _insurerPriceLineRepository = insurerPriceLineRepository;
        _sendHistoryRepository = sendHistoryRepository;
    }

    public GetColumnsViewModel GetColumns(byte? itemTypeId, byte? insurerTypeId, string formType)
    {
        var list = new GetColumnsViewModel();
        if (formType == "insurerprice")
        {
            if (itemTypeId == 2) // خدمات
                list = new GetColumnsViewModel
                {
                    IsEditable = true,
                    DataColumns = new List<DataColumnsViewModel>
                    {
                        new()
                        {
                            Id = "medicalItemPriceId", Title = "شناسه", Type = (int)SqlDbType.Int, Size = 50,
                            IsDtParameter = true, Width = 10, IsPrimary = true
                        },
                        new()
                        {
                            Id = "item", IsPrimary = true, Title = "آیتم", Type = (int)SqlDbType.NVarChar, Size = 50,
                            IsDtParameter = true, IsFilterParameter = true, Width = 20
                        },
                        new() { Id = "itemId", IsPrimary = true },
                        new() { Id = "insurerTypeId", IsPrimary = true },
                        new() { Id = "insurerType", IsPrimary = true },
                        new() { Id = "itemTypeId", IsPrimary = true },
                        new() { Id = "itemType", IsPrimary = true },
                        new() { Id = "medicalSubjectId", IsPrimary = true },
                        new()
                        {
                            Id = "medicalSubject", Title = "موضوع درمان", Type = (int)SqlDbType.NVarChar, Size = 50,
                            IsDtParameter = true, IsFilterParameter = true, Width = 20
                        },
                        new()
                        {
                            Id = "beginPrice", IsPrimary = true, Title = "تعرفه ", Type = (int)SqlDbType.Decimal,
                            Size = 0, IsCommaSep = true, IsDtParameter = true, Width = 10
                        },
                        new()
                        {
                            Id = "createUser", Title = " کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                            IsDtParameter = true, Width = 10
                        },
                        new()
                        {
                            Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar,
                            Size = 50, IsDtParameter = true, Width = 13
                        },
                        new()
                        {
                            Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 13
                        }
                    },
                    ActionType = "inline",
                    Buttons = new List<GetActionColumnViewModel>
                    {
                        new()
                        {
                            Name = "insurerline", Title = "لیست صندوق ها", ClassName = "btn blue_outline_2 ml-1",
                            IconName = "fa fa-umbrella"
                        },
                        new()
                        {
                            Name = "sendToCentral", Title = "ارسال مرکزی", IconName = "fa fa-paper-plane color-blue",
                            Condition = new List<ConditionPageTable>
                            {
                                new() { FieldName = "insurerTypeId", FieldValue = "1", Operator = "==" },
                                new() { FieldName = "medicalSubjectId", FieldValue = "1", Operator = "!=" },
                                new() { FieldName = "medicalSubjectId", FieldValue = "3", Operator = "!=" }
                            }
                        }
                    }
                };
            else
                list = new GetColumnsViewModel
                {
                    IsEditable = true,
                    DataColumns = new List<DataColumnsViewModel>
                    {
                        new()
                        {
                            Id = "medicalItemPriceId", Title = "شناسه", Type = (int)SqlDbType.Int, Size = 50,
                            IsDtParameter = true, Width = 10, IsPrimary = true
                        },
                        new()
                        {
                            Id = "item", Title = "آیتم", Type = (int)SqlDbType.NVarChar, Size = 50,
                            IsDtParameter = true, IsFilterParameter = true, Width = 20
                        },
                        new() { Id = "insurerTypeId", IsPrimary = true },
                        new() { Id = "insurerType", IsPrimary = true },
                        new() { Id = "itemTypeId", IsPrimary = true },
                        new() { Id = "itemType", IsPrimary = true },
                        new() { Id = "medicalSubjectId", IsPrimary = true },
                        new()
                        {
                            Id = "medicalSubject", Title = "موضوع درمان", Type = (int)SqlDbType.NVarChar, Size = 50,
                            IsDtParameter = true, IsFilterParameter = true, Width = 20
                        },
                        new() { Id = "pricingModelId", IsPrimary = true },
                        new()
                        {
                            Id = "pricingModeName", Title = "مبنای تعرفه", Type = (int)SqlDbType.TinyInt, Size = 0,
                            IsDtParameter = true, Width = 12, IsPrimary = true
                        },
                        new()
                        {
                            Id = "beginPrice", Title = "تعرفه اول", IsPrimary = true, Type = (int)SqlDbType.Decimal,
                            Size = 0, IsCommaSep = true, IsDtParameter = true, Width = 10
                        },
                        new()
                        {
                            Id = "endPrice", Title = "تعرفه دوم", IsPrimary = true, Type = (int)SqlDbType.Decimal,
                            Size = 0, IsCommaSep = true, IsDtParameter = true, Width = 10
                        },
                        new()
                        {
                            Id = "createUser", Title = " کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                            IsDtParameter = true, Width = 10
                        },
                        new()
                        {
                            Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar,
                            Size = 50, IsDtParameter = true, Width = 13
                        },
                        new()
                        {
                            Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 13
                        }
                    },
                    ActionType = "inline",
                    Buttons = new List<GetActionColumnViewModel>
                    {
                        new()
                        {
                            Name = "insurerline", Title = "لیست صندوق ها", ClassName = "btn blue_outline_2 ml-1",
                            IconName = "fa fa-umbrella"
                        }
                    }
                };
        }
        else
        {
            if (itemTypeId == 1) // کالا
                list = new GetColumnsViewModel
                {
                    IsEditable = true,
                    DataColumns = new List<DataColumnsViewModel>
                    {
                        new()
                        {
                            Id = "medicalItemPriceId", Title = "شناسه", Type = (int)SqlDbType.Int, Size = 50,
                            IsDtParameter = true, Width = 7, IsPrimary = true
                        },
                        new() { Id = "medicalSubjectId", IsPrimary = true },
                        new()
                        {
                            Id = "medicalSubject", Title = "موضوع درمان", Type = (int)SqlDbType.NVarChar, Size = 50,
                            IsDtParameter = true, IsFilterParameter = true,
                            FilterType = "select2", FilterTypeApi = "/api/AdmissionsApi/medicalsubject_getdropdown",
                            Width = 20
                        },

                        new()
                        {
                            Id = "pricingModelId", Title = "مبنای تعرفه", Type = (int)SqlDbType.TinyInt, Size = 0,
                            IsDtParameter = itemTypeId == 1 && insurerTypeId == 1, Editable = true,
                            InputType = "select", Width = 20,
                            Inputs = new List<MyDropDownViewModel>
                            {
                                new() { Name = "نرخ ثابت", Id = 1 },
                                new() { Name = "محدوده نرخ", Id = 2 }
                            }
                        },
                        new()
                        {
                            Id = "beginPrice", Title = "تعرفه اول", Type = (int)SqlDbType.Decimal, Size = 0,
                            IsCommaSep = true, IsDtParameter = true, Editable = true, InputType = "money",
                            MaxLength = 11, Width = itemTypeId == 2 ? 15 : 17
                        },
                        new()
                        {
                            Id = "endPrice", Title = "تعرفه دوم", Type = (int)SqlDbType.Decimal, Size = 0,
                            IsDtParameter = itemTypeId == 1 && insurerTypeId == 1, Editable = true, InputType = "money",
                            MaxLength = 11, Width = 17
                        },
                        new()
                        {
                            Id = "createUser", Title = " کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                            IsDtParameter = true, Width = itemTypeId == 2 ? 14 : 13
                        },
                        new()
                        {
                            Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar,
                            Size = 50, IsDtParameter = true, Width = itemTypeId == 2 ? 17 : 17
                        }
                    }
                };
            else
                list = new GetColumnsViewModel
                {
                    IsEditable = true,
                    DataColumns = new List<DataColumnsViewModel>
                    {
                        new()
                        {
                            Id = "medicalItemPriceId", Title = "شناسه", Type = (int)SqlDbType.Int, Size = 50,
                            IsDtParameter = true, Width = 10, IsPrimary = true
                        },
                        new() { Id = "medicalSubjectId", IsPrimary = true },
                        new()
                        {
                            Id = "medicalSubject", Title = "موضوع درمان", Type = (int)SqlDbType.NVarChar, Size = 50,
                            IsDtParameter = true, IsFilterParameter = true,
                            FilterType = "select2", FilterTypeApi = "/api/AdmissionsApi/medicalsubject_getdropdown",
                            Width = 20
                        },
                        new()
                        {
                            Id = "beginPrice", Title = "تعرفه اول", Type = (int)SqlDbType.Decimal, Size = 0,
                            IsCommaSep = true, IsDtParameter = true, Editable = true, InputType = "money",
                            MaxLength = 11, Width = itemTypeId == 2 ? 10 : 12
                        },
                        new()
                        {
                            Id = "createUser", Title = " کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                            IsDtParameter = true, Width = itemTypeId == 2 ? 10 : 14
                        },
                        new()
                        {
                            Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar,
                            Size = 50, IsDtParameter = true, Width = itemTypeId == 2 ? 13 : 19
                        }
                    }
                };
        }


        return list;
    }

    public GetColumnsViewModel GetColumnsMedicalItemPriceSendHistoryGetpage()
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
                new() { Id = "medicalSubjectId", IsPrimary = true },
                new()
                {
                    Id = "item", Title = "خدمت", Type = (int)SqlDbType.NVarChar, Size = 30, IsDtParameter = true,
                    Width = 20
                },
                new()
                {
                    Id = "medicalSubject", Title = "موضوع درمان", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "beginPrice", Title = "نرخ", Type = (int)SqlDbType.NVarChar, Size = 10, IsDtParameter = true,
                    IsCommaSep = true, Width = 15
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

    public async Task<MemoryStream> Csv(NewGetServiceItemPricingGetPage model)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();
        var formType = model.Form_KeyValue[0]?.ToString();

        var Columns = string.Join(',',
            GetColumns(model.ItemTypeId, model.InsurerTypeId, formType).DataColumns
                .Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title));
        var getPage = await GetPage(model);

        if (model.ItemTypeId == 2)
        {
            var Rows = from p in getPage.Data
                select new
                {
                    p.MedicalItemPriceId,
                    p.Item,
                    p.MedicalSubject,
                    p.BeginPrice,
                    p.CreateDateTimePersian
                };

            return csvStream = await csvGenerator.GenerateCsv(Rows, Columns.Split(',').ToList());
        }
        else
        {
            var Rows = from p in getPage.Data
                select new
                {
                    p.MedicalItemPriceId,
                    p.MedicalSubject,
                    p.PricingModelId,
                    p.BeginPrice,
                    p.EndPrice,
                    p.CreateUser,
                    p.CreateDateTimePersian
                };

            return csvStream = await csvGenerator.GenerateCsv(Rows, Columns.Split(',').ToList());
        }
    }

    public async Task<MyResultPage<List<ServiceItemPricingGetPage>>> GetPage(NewGetServiceItemPricingGetPage model)
    {
        var result = new MyResultPage<List<ServiceItemPricingGetPage>>
        {
            Data = new List<ServiceItemPricingGetPage>()
        };

        var formType = model.Form_KeyValue[0]?.ToString();

        short p_id = 0;
        var p_insuranceName = "";

        int? p_medicalsubjectId = null;

        if (formType == "insurerprice")
            p_medicalsubjectId = model.MedicalSubjectId;
        else
            p_medicalsubjectId = Convert.ToInt32(model.Filters.Any(x => x.Name == "medicalSubject")
                ? model.Filters.FirstOrDefault(x => x.Name == "medicalSubject").Value
                : null);


        p_medicalsubjectId = p_medicalsubjectId == 0 ? null : p_medicalsubjectId;

        switch (model.FieldItem)
        {
            case "id":
                p_id = Convert.ToInt16(model.FieldValue);
                break;
            case "insurerName":
                p_insuranceName = model.FieldValue;
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("ItemId", model.ItemId);
        parameters.Add("ItemTypeId", model.ItemTypeId);
        parameters.Add("InsurerTypeId", model.InsurerTypeId);
        parameters.Add("MedicalSubjectId", p_medicalsubjectId);
        parameters.Add("MedicalItemPriceId", model.MedicalItemPriceId);
        parameters.Add("CompanyId", model.CompanyId);
        parameters.Add("IncludeAll", model.IncludeAll);


        result.Columns = GetColumns(model.ItemTypeId, model.InsurerTypeId, formType);

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_MedicalItemPrice_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<ServiceItemPricingGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultPage<List<MedicalItemPriceSendHistoryGetpage>>> GetPageMedicalItemPriceSendHistory(
        NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<MedicalItemPriceSendHistoryGetpage>>();

        var p_serviceId = Convert.ToInt32(model.Form_KeyValue[1]?.ToString());
        int? p_medicalsubjectId = null;
        var p_isSent = Convert.ToBoolean(model.Form_KeyValue[2]?.ToString());

        var parameters = new DynamicParameters();
        parameters.Add("ServiceId", p_serviceId);
        parameters.Add("MedicalSubjectId", p_medicalsubjectId);
        parameters.Add("IsSent", p_isSent);
        result = await _sendHistoryRepository.ServiceItemPriceSendHistoryGetPage(parameters);
        result.Columns = GetColumnsMedicalItemPriceSendHistoryGetpage();

        return result;
    }

    public async Task<MyResultStatus> SendToCentral(string ids, int userId)
    {
        if (ids.Split(",").Length > 2)
            return await SendBulkCentralMedicalItemPrice(ids, userId);
        return await SendCentralMedicalItemPrice(ids, userId);
    }

    public async Task<MyResultStatus> SendCentralMedicalItemPrice(string id, int userId)
    {
        var centralModel = new CentralMedicalItemPrice();
        var result = new MyResultStatus();

        var model = await _sendHistoryRepository.ServiceItemPriceSendHistoryGetList(id);

        if (!model.ListHasRow())
            return new MyResultStatus
            {
                Successfull = false,
                StatusMessage = "موردی برای ارسال وجود ندارد",
                Status = -101
            };

        centralModel = _mapper.Map<ServiceItemPriceSendHistoryGetList, CentralMedicalItemPrice>(model[0]);

        var sendResult = await _medicalItemPriceServiceCentral.MedicalItemPriceCentral(centralModel);

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

    public async Task<MyResultStatus> SendBulkCentralMedicalItemPrice(string ids, int userId)
    {
        var result = new MyResultStatus();
        var error = new List<string>();
        var centralModel = new List<CentralMedicalItemPrice>();

        var model = await _sendHistoryRepository.ServiceItemPriceSendHistoryGetList(ids);

        if (!model.ListHasRow())
            return new MyResultStatus
            {
                Successfull = false,
                StatusMessage = "موردی برای ارسال وجود ندارد",
                Status = -100
            };

        centralModel = _mapper.Map<List<ServiceItemPriceSendHistoryGetList>, List<CentralMedicalItemPrice>>(model);

        var sendResult = await _medicalItemPriceServiceCentral.MedicalItemPriceBulkCentral(centralModel);

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
                    Status = -100,
                    ValidationErrors = sendResult.ValidationErrors
                };
        }
        else if (sendResult.HttpStatus == HttpStatusCode.OK && sendResult.Data != null)
        {
            var updBulkSendHistory = await SendHistoryBulkUpd(model, sendResult.Data, userId);
            return new MyResultStatus
            {
                Status = updBulkSendHistory.Status,
                Successfull = updBulkSendHistory.Status == 100 ? true : false,
                StatusMessage = updBulkSendHistory.StatusMessage
            };
        }

        return result;
    }


    public async Task<MyResultStatus> SendHistoryBulkUpd(List<ServiceItemPriceSendHistoryGetList> model,
        List<ResultBulkSaveMedicalItemPrice> sendResult, int userId)
    {
        var logModel = (from s in model
            join m in sendResult on s.LocalId equals m.LocalId
            select new SendHistoryViewModel
            {
                Id = s.SendHistoryId,
                CentralId = m.CentralId.ToString(),
                ObjectId = s.LocalId.ToString()
            }).ToList();

        return await _sendHistoryRepository.UpdateBulk(logModel, 8, userId);
    }


    public async Task<ServiceItemPricingGetRecord> GetRecordById(int Id)
    {
        using (var conn = Connection)
        {
            conn.Open();
            var sQuery = "pb.Spc_Tables_GetRecord";
            var result = await conn.QueryFirstOrDefaultAsync<ServiceItemPricingGetRecord>(sQuery, new
            {
                TableName = "mc.MedicalItemPrice",
                Filter = $"Id={Id}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.CreateUserFullName = await _userRepository.GetUserFullName(result.CreateUserId);

            return result;
        }
    }

    public async Task<MyResultStatus> Save(ServiceItemPricingModel model)
    {
        var finalResult = new MyResultStatus();
        var result = new ResultSaveMedicalItemPrice();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_MedicalItemPrice_InsUpd]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<ResultSaveMedicalItemPrice>(sQuery, new
            {
                model.Id,
                model.ItemId,
                model.ItemTypeId,
                model.InsurerTypeId,
                model.MedicalSubjectId,
                model.PricingModelId,
                model.BeginPrice,
                model.EndPrice,
                model.CreateUserId,
                model.CreateDateTime,
                model.IsActive,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            result.Successfull = result.Status == 100;
            result.DateTime = model.CreateDateTime;

            if (result.Successfull && result.SendHistoryId.NotNull() && result.SendHistoryId != Guid.Empty)
            {
                finalResult = await SendCentralMedicalItemPrice(result.Id.ToString(), model.CreateUserId);
                finalResult.Id = result.Id;
                return finalResult;
            }

            return result;
        }
    }


    public async Task<MyResultQuery> Delete(int id, int companyId)
    {
        var medicalItemPriceRecord = await GetRecordById(id);

        if (medicalItemPriceRecord.NotNull())
        {
            var validation = await Validation(medicalItemPriceRecord);

            if (validation.ListHasRow())
                return new MyResultQuery
                {
                    Successfull = false,
                    Status = -100,
                    ValidationErrors = validation
                };
        }

        var centralIds =
            await GetMedicalItemPriceCentral(id, null, null, null, null, null, null, null, null, null, null);

        if (centralIds.Data.Any(x => x.CentralId.NotNull() && x.CentralId > 0))
        {
            var centralIdList = centralIds.Data.Where(x => x.CentralId.NotNull() && x.CentralId > 0).Select(a =>
                new MedicalItemPriceGetCentral
                {
                    CentralId = a.CentralId,
                    ItemId = a.ItemId,
                    MedicalSubjectId = a.MedicalSubjectId
                }).ToList();

            var CentralMedicalItemPriceModel = new CentralMedicalItemPrice();
            CentralMedicalItemPriceModel.CentralId = centralIdList.FirstOrDefault().CentralId;
            CentralMedicalItemPriceModel.BeginPrice = 0;
            CentralMedicalItemPriceModel.ItemId = centralIdList.FirstOrDefault().ItemId;
            CentralMedicalItemPriceModel.MedicalSubjectId = centralIdList.FirstOrDefault().MedicalSubjectId;
            CentralMedicalItemPriceModel.CompanyId = centralIdList.FirstOrDefault().CompanyId;

            var sendResult =
                await _medicalItemPriceServiceCentral.MedicalItemPriceCentral(CentralMedicalItemPriceModel);

            if (sendResult.NotNull())
            {
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
        }

        var result = new MyResultQuery();

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecordWithFilter";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                TableName = "mc.MedicalItemPrice",
                Filter = $"Id = {id} AND CompanyId = {companyId}"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
        }

        result.Successfull = result.Status == 100;

        if (!result.Successfull) result.ValidationErrors.Add(result.StatusMessage);

        return result;
    }

    public async Task<MyResultPage<List<MedicalItemPriceGetCentral>>> GetMedicalItemPriceCentral(int? id, int? itemId,
        byte? medicalSubjectId, byte? insurerTypeId
        , string attribute, int? serviceTypeId, bool? hasNationalCode, int? fromNationalCode, int? toNationalCode,
        int? fromServiceId, int? toServiceId)
    {
        var result = new MyResultPage<List<MedicalItemPriceGetCentral>>();
        using (var conn = Connection)
        {
            conn.Open();
            var sQuery = "[mc].[Spc_MedicalItemPrice_GetCentral]";
            result.Data = (await conn.QueryAsync<MedicalItemPriceGetCentral>(sQuery, new
            {
                Id = id,
                ItemId = itemId,
                MedicalSubjectId = medicalSubjectId,
                InsurerTypeId = insurerTypeId,
                Attribute = attribute,
                ServiceTypeId = serviceTypeId,
                HasNationalCode = hasNationalCode,
                FromNationalCode = fromNationalCode,
                ToNationalCode = toNationalCode,
                FromServiceId = fromServiceId,
                ToServiceId = toServiceId
            }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();

            return result;
        }
    }

    public async Task<List<string>> Validation(ServiceItemPricingGetRecord model)
    {
        var checkExist = false;
        var errors = new List<string>();
        var item = new List<int?> { model.ItemId };

        if (model.ItemTypeId == 1)
        {
            var checkExistVendorItem = await CheckExistVendorItemPrice(item);

            if (checkExistVendorItem.NotNull())
            {
                var vendrId = checkExistVendorItem.Data.Select(x => x.VendorId);
                errors.Add($"کالا به تامین کننده {vendrId}تخصیص داده شده ، مجاز به حذف تعرفه نمی باشید");
            }
        }
        else
        {
            var validationModel = new ValidationModel
            {
                MedicalItemPriceId = model.Id,
                ItemId = model.ItemId,
                MedicalSubjectId = model.MedicalSubjectId,
                InsurerTypeId = model.InsureTyperId
            };

            var checkExistAttender = await CheckExistMedicalItemPrice(validationModel);

            if (checkExistAttender.NotNull() && checkExistAttender.Data.Count > 0)
            {
                var attendrId = checkExistAttender.Data.Select(x => x.AttenderId);
                var srviceId = checkExistAttender.Data.Select(x => x.ServiceId);
                errors.Add(
                    $"خدمت {srviceId} به طبیب با شناسه {attendrId}تخصیص داده شده ، مجاز به حذف تعرفه نمی باشید");
            }

            validationModel = new ValidationModel
            {
                MedicalItemPriceId = model.Id,
                ItemId = null,
                MedicalSubjectId = null,
                InsurerTypeId = null
            };
            var checkExistInsurer = await CheckExistInsurePrice(validationModel);

            if (checkExistInsurer.NotNull() && checkExistInsurer.Data.Count > 0)
            {
                var insureId = checkExistInsurer.Data.Select(x => x.InsurerId);
                var insurelinId = checkExistInsurer.Data.Select(x => x.InsurerLineId);

                errors.Add(
                    $"آیتم به بیمه  با شناسه {insureId}و صندوق {insurelinId} تخصیص داده  شده ، مجاز به حذف تعرفه نمی باشید ");
            }
        }

        return errors;
    }

    public async Task<List<string>> ValidationBulks(ValidationModel model)
    {
        var checkExist = false;
        var errors = new List<string>();

        if (model.ItemTypeId == 1) // کالا
        {
            var item = new List<int?> { model.ItemId };

            var checkExistVendorItem = await CheckExistVendorItemPrice(item);

            if (checkExistVendorItem.NotNull() && checkExistVendorItem.Data.Count > 0)
            {
                var vendrId = checkExistVendorItem.Data.Select(x => x.VendorId).Distinct().AsList();
                var itmId = checkExistVendorItem.Data.Select(x => x.ItemId).Distinct().AsList();
                errors.Add(
                    $"کالاهای {string.Join(',', itmId)}  به تامین کننده با شناسه  {string.Join(',', vendrId)}تخصیص داده شده ، مجاز به حذف تعرفه نمی باشید");
            }
        }
        else // خدمات
        {
            //var validationModel = new ValidationModel()
            //{
            //    MedicalItemPriceId = null,
            //    ItemId = model.ItemId,
            //    MedicalSubjectId = model.MedicalSubjectId,
            //    InsurerTypeId = model.InsurerTypeId
            //};
            var checkExistAttender = await CheckExistMedicalItemPrice(model);

            if (checkExistAttender.NotNull() &&
                checkExistAttender.Data.Count > 0) // در صورتی که خدمت به طبیب تخصیص داده شده باشد 
            {
                var attendrIds = checkExistAttender.Data.Select(x => x.AttenderId).Distinct().AsList();
                var itmIds = checkExistAttender.Data.Select(x => x.ServiceId).Distinct().AsList();
                errors.Add(
                    $"خدمت های{string.Join(',', itmIds)} به طبیب با شناسه های {string.Join(',', attendrIds)}تخصیص داده شده ، مجاز به حذف تعرفه نمی باشید");
            }

            //null, model.ItemId, model.MedicalSubjectId, model.InsurerTypeId
            var checkExistInsurer = await CheckExistInsurePrice(model);

            if (checkExistInsurer.NotNull() &&
                checkExistInsurer.Data.Count > 0) // در صورتی که خدمت به بیمه تخصیص داده شده باشد 
            {
                var insureId = checkExistInsurer.Data.Where(x => x.InsurerId.NotNull()).Select(x => x.InsurerId)
                    .Distinct().AsList();
                var insurelinId = checkExistInsurer.Data.Where(x => x.InsurerLineId.NotNull())
                    .Select(x => x.InsurerLineId).Distinct().AsList();
                var medcalitmPricId = checkExistInsurer.Data.Where(x => x.MedicalItemPriceId.NotNull())
                    .Select(x => x.MedicalItemPriceId).Distinct().AsList();

                errors.Add(
                    $"آیتم های {string.Join(',', medcalitmPricId)} به بیمه  با شناسه {string.Join(',', insureId)}و صندوق {string.Join(',', insurelinId)} تخصیص داده  شده ، مجاز به حذف تعرفه نمی باشید ");
            }
        }

        return errors;
    }

    public async Task<MyResultPage<List<ResultValidateInsurerPriceMedicalItemPrice>>> CheckExistInsurePrice(
        ValidationModel model)
    {
        var result = new MyResultPage<List<ResultValidateInsurerPriceMedicalItemPrice>>
        {
            Data = new List<ResultValidateInsurerPriceMedicalItemPrice>()
        };
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_MedicalItemPrice_CheckInsurerPrice]";
            conn.Open();
            result.Data = (await conn.QueryAsync<ResultValidateInsurerPriceMedicalItemPrice>(sQuery, new
            {
                model.MedicalItemPriceId,
                model.ItemId,
                model.MedicalSubjectId,
                model.InsurerTypeId,
                model.Attribute,
                model.ServiceTypeId,
                model.HasNationalCode,
                model.FromNationalCode,
                model.ToNationalCode,
                model.FromServiceId,
                model.ToServiceId
            }, commandType: CommandType.StoredProcedure)).ToList();

            conn.Close();

            return result;
        }
    }

    public async Task<MyResultPage<List<ResultValidateAttenderServiceMedicalItemPrice>>> CheckExistMedicalItemPrice(
        ValidationModel model)
    {
        var result = new MyResultPage<List<ResultValidateAttenderServiceMedicalItemPrice>>
        {
            Data = new List<ResultValidateAttenderServiceMedicalItemPrice>()
        };
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_MedicalItemPrice_CheckAttenderService]";
            conn.Open();
            result.Data = (await conn.QueryAsync<ResultValidateAttenderServiceMedicalItemPrice>(sQuery, new
            {
                model.MedicalItemPriceId,
                model.ItemId,
                model.MedicalSubjectId,
                model.InsurerTypeId,
                model.Attribute,
                model.ServiceTypeId,
                model.HasNationalCode,
                model.FromNationalCode,
                model.ToNationalCode,
                model.FromServiceId,
                model.ToServiceId
            }, commandType: CommandType.StoredProcedure)).ToList();

            conn.Close();

            return result;
        }
    }

    public async Task<MyResultPage<List<ResultValidateVendorItemMedicalItemPrice>>> CheckExistVendorItemPrice(
        List<int?> itemIds)
    {
        var result = new MyResultPage<List<ResultValidateVendorItemMedicalItemPrice>>
        {
            Data = new List<ResultValidateVendorItemMedicalItemPrice>()
        };
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Item_CheckVendorItemPrice]";
            conn.Open();
            result.Data = (await conn.QueryAsync<ResultValidateVendorItemMedicalItemPrice>(sQuery, new
            {
                ItemIds = string.Join(',', itemIds)
            }, commandType: CommandType.StoredProcedure)).ToList();

            conn.Close();

            return result;
        }
    }


    public async Task<MyResultStatus> UpdateServicePrice(UpdateServicePriceUpd model)
    {
        var finalResult = new MyResultStatus();

        if (model.IncludeAll)
        {
            var validationResult = new List<string>();
            var validationModel = new ValidationModel
            {
                MedicalItemPriceId = null,
                ItemId = null,
                MedicalSubjectId = model.MedicalSubjectId,
                InsurerTypeId = model.InsurerTypeId,
                Attribute = model.Attribute,
                ServiceTypeId = model.ServiceTypeId,
                HasNationalCode = model.HasNationalCode,
                FromNationalCode = model.FromNationalCode,
                ToNationalCode = model.ToNationalCode,
                FromServiceId = model.FromServiceId,
                ToServiceId = model.ToServiceId
            };

            validationResult = await ValidationBulks(validationModel);

            if (validationResult.ListHasRow())
                return new MyResultStatus
                {
                    Successfull = false,
                    Status = -104,
                    ValidationErrors = validationResult
                };
        }

        if (!model.IsPreview && model.IncludeAll)
        {
            //  حذف سمت سنترال

            var centralIds = await GetMedicalItemPriceCentral(null, null, model.MedicalSubjectId, model.InsurerTypeId,
                model.Attribute, model.ServiceTypeId
                , model.HasNationalCode, model.FromNationalCode, model.ToNationalCode, model.FromServiceId,
                model.ToServiceId);

            if (centralIds.Data.Any(x => x.CentralId.NotNull() && x.CentralId > 0))
            {
                var centralModel = new List<CentralMedicalItemPrice>();

                var centralIdList = centralIds.Data.Where(x => x.CentralId.NotNull() && x.CentralId > 0).Select(a =>
                    new MedicalItemPriceGetCentral
                    {
                        CentralId = a.CentralId,
                        ItemId = a.ItemId,
                        MedicalSubjectId = a.MedicalSubjectId,
                        BeginPrice = 0,
                        CompanyId = a.CompanyId
                    }).ToList();

                centralModel =
                    _mapper.Map<List<MedicalItemPriceGetCentral>, List<CentralMedicalItemPrice>>(centralIdList);

                var sendResult = await _medicalItemPriceServiceCentral.MedicalItemPriceBulkCentral(centralModel);

                if (sendResult.HttpStatus == HttpStatusCode.Unauthorized
                    || sendResult.HttpStatus == HttpStatusCode.BadRequest
                    || sendResult.HttpStatus == HttpStatusCode.InternalServerError)
                    return new MyResultStatus
                    {
                        Successfull = false,
                        Status = -101,
                        StatusMessage = " درخواست شما به درستی انجام نشد ، مجدد تلاش فرمایید"
                    };
                if (sendResult.HttpStatus == HttpStatusCode.NotAcceptable)
                    if (sendResult.ValidationErrors.ListHasRow())
                        return new MyResultStatus
                        {
                            Successfull = false,
                            StatusMessage = "error",
                            Status = -102,
                            ValidationErrors = sendResult.ValidationErrors
                        };
            }
        }

        var affectdRows = 0;
        var result = new MyResultDataStatus<List<ResultUpdateServicePrice>>
        {
            Data = new List<ResultUpdateServicePrice>()
        };

        using (var conn = Connection)
        {
            var sQuery = "mc.[Spc_ServicePrice_Upd]";
            conn.Open();

            result.Data = (await conn.QueryAsync<ResultUpdateServicePrice>(sQuery, new
            {
                model.ServiceTypeId,
                model.MedicalSubjectId,
                model.InsurerTypeId,
                model.Attribute,
                model.ProfessionalPrice,
                model.TechnicalPrice,
                model.AnesthesiaPrice,
                model.CompPrice,
                model.HasNationalCode,
                model.FromNationalCode,
                model.ToNationalCode,
                model.FromServiceId,
                model.ToServiceId,
                model.CompanyId,
                model.IsPreview,
                model.IncludeAll,
                model.UserId,
                ModifyDateTime = DateTime.Now
            }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();

            finalResult.Successfull = result.Data.Any(x => x.Status == 100);
            finalResult.Status = finalResult.Successfull ? 100 : -100;
            finalResult.AffectedRows =
                affectdRows = finalResult.Successfull ? result.Data.Select(x => x.AffectedRows).First() : 0;
            finalResult.StatusMessage =
                finalResult.Successfull ? "عملیات با موفقیت انجام شد" : "عملیات با خطا مواجه شد";

            //return result;
        }

        if (result.Data.Any(x => x.Status == 100 && x.MedicalItemPriceId.NotNull()) && !model.IsPreview)
        {
            var ids = string.Join(',', result.Data.Select(x => x.MedicalItemPriceId));
            var centralDuplicateModel = new List<CentralMedicalItemPrice>();

            var dupliactemodel = await _sendHistoryRepository.ServiceItemPriceSendHistoryGetList(ids);

            if (!dupliactemodel.ListHasRow())
                return new MyResultStatus
                {
                    Successfull = false,
                    StatusMessage = "ارسال به مرکزی انجام نشد",
                    Status = -103
                };

            centralDuplicateModel =
                _mapper.Map<List<ServiceItemPriceSendHistoryGetList>, List<CentralMedicalItemPrice>>(dupliactemodel);
            finalResult =
                await MedicalItemPriceSendBulkCentral(centralDuplicateModel, dupliactemodel, model.UserId, affectdRows);
        }

        return finalResult;
    }


    public async Task<MyResultStatus> UpdateInsurerPrice(UpdateInsurerPrice model)
    {
        var finalResult = new MyResultStatus();
        var result = new MyResultDataStatus<List<ResultUpdateInsurerPrice>>
        {
            Data = new List<ResultUpdateInsurerPrice>()
        };
        var affectdRows = 0;

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_ServiceInsurerPrice_Upd]";
            conn.Open();

            result.Data = (await conn.QueryAsync<ResultUpdateInsurerPrice>(sQuery, new
            {
                model.InsurerTypeId,
                model.InsurerId,
                model.InsurerLineId,
                model.Attribute,
                model.ServiceTypeId,
                model.FromNationalCode,
                model.ToNationalCode,
                model.InsurerPriceCalculationMethodId,
                model.ProfessionalPrice,
                model.TechnicalPrice,
                model.AnesthesiaPrice,
                model.CompPrice,
                model.HasNationalCode,
                model.SharePer,
                model.FromServiceId,
                model.ToServiceId,
                model.CompanyId,
                model.IsPreview,
                model.UserId,
                ModifyDateTime = DateTime.Now
            }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            finalResult.Successfull = result.Data.Any(x => x.Status == 100);
            finalResult.Status = finalResult.Successfull ? 100 : -100;
            finalResult.AffectedRows =
                affectdRows = finalResult.Successfull ? result.Data.Select(x => x.AffectedRows).First() : 0;
            finalResult.StatusMessage =
                finalResult.Successfull ? "عملیات با موفقیت انجام شد" : "عملیات با خطا مواجه شد";
        }

        if (result.Data.Any(x => x.Status == 100 && x.InsurerPriceId.NotNull() && x.InsurerPriceId != 0) &&
            !model.IsPreview)
        {
            var ids = string.Join(',', result.Data.Select(x => x.InsurerPriceId));
            var centralModel = new List<CentralInsurerPriceModel>();

            var updateCentralmodel = await _sendHistoryRepository.InsurerPriceSendHistoryGetList(ids);

            if (!updateCentralmodel.ListHasRow())
                return new MyResultStatus
                {
                    Successfull = false,
                    StatusMessage = "ارسال به مرکزی انجام نشد",
                    Status = -103
                };

            centralModel =
                _mapper.Map<List<InsurerPriceSendHistoryGetList>, List<CentralInsurerPriceModel>>(updateCentralmodel);
            finalResult =
                await _insurerPriceLineRepository.InsurerPriceSendBulk(centralModel, updateCentralmodel, model.UserId,
                    affectdRows);
        }

        return finalResult;
    }

    public async Task<int> UpdateItemPrice(UpdateItemPrice model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_ItemPrice_Upd]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                model.FromItemId,
                model.ToItemId,
                model.MedicalSubjectId,
                model.InsurerTypeId,
                model.ItemCategoryId,
                model.PricingModelId,
                model.BeginPrice,
                model.EndPrice,
                model.CompanyId,
                model.IsPreview,
                model.IncludeAll,
                model.UserId,
                ModifyDateTime = DateTime.Now
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<MyResultStatus> DuplicateInsurance(InsuranceDuplicate model)
    {
        var affectdRows = 0;
        var finalResult = new MyResultStatus();
        //  در صورتی که در حالت نمایش نباشد و خدمت باشد ابتدا سمت سنترال حذف صورت میگیرد
        if (!model.IsPreview && model.ItemTypeId == 2)
        {
            var centralInsurerId = model.OperationType == 2 ? model.FromInsurerId : model.ToInsurerId;
            var centralInsurerLineId = model.OperationType == 2 ? model.FromInsurerLineId : model.ToInsurerLineId;

            var centralIds = await _insurerPriceLineRepository.GetInsurerPriceCentral(null, model.ItemId,
                centralInsurerId, centralInsurerLineId, model.FromInsurerPriceCalculationMethodId, null, null, null);

            if (centralIds.Data.Any(x => x.CentralId.NotNull() && x.CentralId > 0))
            {
                var centralModel = new List<CentralInsurerPriceModel>();

                var centralIdList = centralIds.Data.Where(x => x.CentralId.NotNull() && x.CentralId > 0).Select(a =>
                    new InsurerPriceGetCentral
                    {
                        CentralId = a.CentralId,
                        InsurerPrice = 0,
                        InsurerSharePer = 0
                    }).ToList();

                centralModel = _mapper.Map<List<InsurerPriceGetCentral>, List<CentralInsurerPriceModel>>(centralIdList);

                var sendResult =
                    await _insurerPriceServiceCentral.InsurerPriceBulkCentral(centralModel, OperationType.Delete);

                if (sendResult.HttpStatus == HttpStatusCode.Unauthorized
                    || sendResult.HttpStatus == HttpStatusCode.BadRequest
                    || sendResult.HttpStatus == HttpStatusCode.InternalServerError)
                    return new MyResultStatus
                    {
                        Successfull = false,
                        Status = -101,
                        StatusMessage = " درخواست شما به درستی انجام نشد ، مجدد تلاش فرمایید"
                    };
                if (sendResult.HttpStatus == HttpStatusCode.NotAcceptable)
                    if (sendResult.ValidationErrors.ListHasRow())
                        return new MyResultStatus
                        {
                            Successfull = false,
                            StatusMessage = "error",
                            Status = -102,
                            ValidationErrors = sendResult.ValidationErrors
                        };
            }
        }

        var result = new MyResultDataStatus<List<ResultDuplicateInsurerPrice>>
        {
            Data = new List<ResultDuplicateInsurerPrice>()
        };

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_InsurerLinePrice_Duplicate]";
            conn.Open();

            result.Data = (await conn.QueryAsync<ResultDuplicateInsurerPrice>(sQuery, new
            {
                model.OperationType,
                model.ItemId,
                model.ItemTypeId,
                model.FromInsurerId,
                model.FromInsurerLineId,
                model.FromInsurerPriceCalculationMethodId,
                FromInsurerSharePer = model.FromInsurerSharePer != "" ? model.FromInsurerSharePer : null,
                model.ToInsurerId,
                ToInsurerLineId = model.ToInsurerLineId > 0 ? model.ToInsurerLineId : null,
                model.ToInsurerSharePer,
                model.UserId,
                model.IsPreview,
                model.CreateDateTime
            }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            finalResult.Successfull = result.Data.Any(x => x.Status == 100);
            finalResult.Status = result.Data.Any(x => x.Status == 100) ? 100 : -100;
            finalResult.AffectedRows =
                affectdRows = finalResult.Successfull ? result.Data.Select(x => x.AffectedRows).First() : 0;
            finalResult.StatusMessage = result.Data.Any(x => x.Status == 100)
                ? "عملیات با موفقیت انجام شد"
                : "عملیات با خطا مواجه شد";
        }

        // در صورتی که نوع عملیات ، درج باشد و حالت غیر نمایش باشد و نوع آیتم خدمت باشد   
        // به سنترال هم ارسال میشود
        if (result.Data.Any(x => x.Status == 100) && model.OperationType == 1 && !model.IsPreview &&
            model.ItemTypeId == 2)
        {
            var ids = string.Join(',',
                result.Data.Where(x => x.InsurerPriceId.NotNull() && x.InsurerPriceId != 0)
                    .Select(x => x.InsurerPriceId));
            var centralDuplicateModel = new List<CentralInsurerPriceModel>();

            if (ids != "" && ids.NotNull())
            {
                var dupliactemodel = await _sendHistoryRepository.InsurerPriceSendHistoryGetList(ids);

                if (!dupliactemodel.ListHasRow())
                    return new MyResultStatus
                    {
                        Successfull = false,
                        StatusMessage = "سمت مرکزی ارسال انجام نشد",
                        Status = -103
                    };

                centralDuplicateModel =
                    _mapper.Map<List<InsurerPriceSendHistoryGetList>, List<CentralInsurerPriceModel>>(dupliactemodel);
                finalResult = await _insurerPriceLineRepository.InsurerPriceSendBulk(centralDuplicateModel,
                    dupliactemodel, model.UserId, affectdRows);
            }
        }

        return finalResult;
    }

    public async Task<MyResultStatus> DuplicateMedicalItemPrice(MedicalItemPriceDuplicate model)
    {
        var validationResult = new List<string>();

        var validationModel = new ValidationModel
        {
            MedicalItemPriceId = null,
            ItemId = model.ItemId,
            MedicalSubjectId = model.OperationType == 1 ? model.ToMedicalSubjectId : model.FromMedicalSubjectId,
            InsurerTypeId = model.OperationType == 1 ? model.ToInsurerTypeId : model.FromInsurerTypeId,
            ItemTypeId = model.ItemTypeId,
            Attribute = null,
            ServiceTypeId = null,
            HasNationalCode = null,
            FromNationalCode = null,
            ToNationalCode = null,
            FromServiceId = null,
            ToServiceId = null
        };
        validationResult = await ValidationBulks(validationModel);


        if (validationResult.ListHasRow())
            return new MyResultStatus
            {
                Successfull = false,
                Status = -104,
                ValidationErrors = validationResult
            };
        //}


        var finalResult = new MyResultStatus();
        //  در صورتی که عملیات حذف باشد و در حالت نمایش نباشد و خدمت باشد ابتدا سمت سنترال حذف صورت میگیرد
        if (!model.IsPreview && model.ItemTypeId == 2)
        {
            byte? centralMedicalSubject =
                model.OperationType == 2 ? model.FromMedicalSubjectId : model.ToMedicalSubjectId;
            byte? centralInsurerTypeId = model.OperationType == 2 ? model.FromInsurerTypeId : model.ToInsurerTypeId;

            var centralIds = await GetMedicalItemPriceCentral(null, model.ItemId, centralMedicalSubject,
                centralInsurerTypeId, null, null, null, null, null, null, null);

            if (centralIds.Data.Any(x => x.CentralId.NotNull() && x.CentralId > 0))
            {
                var centralModel = new List<CentralMedicalItemPrice>();

                var centralIdList = centralIds.Data.Where(x => x.CentralId.NotNull() && x.CentralId > 0).Select(a =>
                    new MedicalItemPriceGetCentral
                    {
                        CentralId = a.CentralId,
                        ItemId = a.ItemId,
                        MedicalSubjectId = a.MedicalSubjectId,
                        BeginPrice = 0,
                        CompanyId = a.CompanyId
                    }).ToList();

                centralModel =
                    _mapper.Map<List<MedicalItemPriceGetCentral>, List<CentralMedicalItemPrice>>(centralIdList);

                var sendResult = await _medicalItemPriceServiceCentral.MedicalItemPriceBulkCentral(centralModel);

                if (sendResult.HttpStatus == HttpStatusCode.Unauthorized
                    || sendResult.HttpStatus == HttpStatusCode.BadRequest
                    || sendResult.HttpStatus == HttpStatusCode.InternalServerError)
                    return new MyResultStatus
                    {
                        Successfull = false,
                        Status = -101,
                        StatusMessage = " درخواست شما به درستی انجام نشد ، مجدد تلاش فرمایید"
                    };
                if (sendResult.HttpStatus == HttpStatusCode.NotAcceptable)
                    if (sendResult.ValidationErrors.ListHasRow())
                        return new MyResultStatus
                        {
                            Successfull = false,
                            StatusMessage = "error",
                            Status = -102,
                            ValidationErrors = sendResult.ValidationErrors
                        };
            }
        }

        var affectdRows = 0;
        var result = new MyResultDataStatus<List<ResultDuplicateMedicalItemPrice>>
        {
            Data = new List<ResultDuplicateMedicalItemPrice>()
        };
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_MedicalItemPrice_Duplicate]";
            conn.Open();

            result.Data = (await conn.QueryAsync<ResultDuplicateMedicalItemPrice>(sQuery, new
            {
                model.OperationType,
                model.ItemId,
                model.ItemTypeId,
                model.FromInsurerTypeId,
                model.FromMedicalSubjectId,
                model.ToInsurerTypeId,
                model.ToMedicalSubjectId,
                model.CreateUserId,
                model.CreateDateTime,
                model.IsPreview
            }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();

            finalResult.Successfull = result.Data.Any(x => x.Status == 100);
            finalResult.Status = result.Data.Any(x => x.Status == 100) ? 100 : -100;
            finalResult.AffectedRows =
                affectdRows = finalResult.Successfull ? result.Data.Select(x => x.AffectedRows).First() : 0;
            finalResult.StatusMessage = result.Data.Any(x => x.Status == 100)
                ? "عملیات با موفقیت انجام شد"
                : "عملیات با خطا مواجه شد";
        }

        // در صورتی که نوع عملیات ، درج باشد و حالت غیر نمایش باشد و نوع آیتم خدمت باشد   
        // به سنترال هم ارسال میشود
        if (result.Data.Any(x => x.Status == 100) && model.OperationType == 1 && !model.IsPreview &&
            model.ItemTypeId == 2)
        {
            var ids = string.Join(',',
                result.Data.Where(x => x.MedicalItemPriceId.NotNull()).Select(x => x.MedicalItemPriceId));
            var centralDuplicateModel = new List<CentralMedicalItemPrice>();

            var dupliactemodel = await _sendHistoryRepository.ServiceItemPriceSendHistoryGetList(ids);

            if (!dupliactemodel.ListHasRow())
                return new MyResultStatus
                {
                    Successfull = false,
                    StatusMessage = "سمت مرکزی ارسال انجام نشد",
                    Status = -103
                };

            centralDuplicateModel =
                _mapper.Map<List<ServiceItemPriceSendHistoryGetList>, List<CentralMedicalItemPrice>>(dupliactemodel);
            finalResult = await MedicalItemPriceSendBulkCentral(centralDuplicateModel, dupliactemodel,
                model.CreateUserId, affectdRows);
        }

        return finalResult;
    }

    public async Task<MyResultStatus> MedicalItemPriceSendBulkCentral(List<CentralMedicalItemPrice> model,
        List<ServiceItemPriceSendHistoryGetList> sendHistoryModel, int userId, int affectedRows)
    {
        var result = new MyResultStatus();

        var sendResult = await _medicalItemPriceServiceCentral.MedicalItemPriceBulkCentral(model);

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

    public async Task<List<MyDropDownViewModel>> GetDropDown(string term, byte itemTypeId, byte insurerTypeId,
        byte? medicalSubjectId)
    {
        var itemId = 0;
        var itemName = "";

        if (int.TryParse(term, out _))
            itemId = int.Parse(term);
        else
            itemName = term;

        if (term.IsNullOrEmptyOrWhiteSpace()) return null;

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_MedicalItemPrice_GetList]";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    ItemTypeId = itemTypeId,
                    InsurerTypeId = insurerTypeId,
                    MedicalSubjectId = medicalSubjectId,
                    ItemId = itemId,
                    ItemName = itemName
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }
}