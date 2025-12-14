using System.Collections;
using System.Data;
using System.Net;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.Central.ObjectModel.MedicalCare;
using ParsAlphabet.Central.ObjectModel.Public;
using ParsAlphabet.Central.ObjectModel.Requests;
using ParsAlphabet.ERP.Application.Dtos.GN.SendHistory;
using ParsAlphabet.ERP.Application.Dtos.MC;
using ParsAlphabet.ERP.Application.Dtos.MC.AttenderTimeSheetLine;
using ParsAlphabet.ERP.Application.Dtos.MC.MedicalShiftTimeSheet;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Application.Interfaces.MC;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.Central;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYear;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.SendHistory;
using ParsAlphabet.ERP.Infrastructure.Implantation.PB;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.AttenderTimeSheetLine;

public class AttenderTimeSheetLineRepository :
    BaseRepository<AttenderTimeSheetLineModel, int, string>,
    IBaseRepository<AttenderTimeSheetLineModel, int, string>
{
    private readonly IAdmissionsRepository _admissionsRepository;
    private readonly IAttenderScheduleBlockServiceCentral _attenderScheduleBlockServiceCentral;
    private readonly ICentralTokenService _centralTokenService;
    private readonly ICompanyRepository _companyRepository;
    private readonly FiscalYearRepository _fiscalYearRepository;
    private readonly ManageRedisRepository _manageRedisRepository;

    private readonly IMapper _mapper;
    private readonly SendHistoryRepository _sendHistoryRepository;
    public int timeOut = 60;

    public AttenderTimeSheetLineRepository(IConfiguration _config,
        ManageRedisRepository manageRedisRepository,
        FiscalYearRepository fiscalYearRepository,
        IAttenderScheduleBlockServiceCentral attenderScheduleBlockServiceCentral,
        SendHistoryRepository sendHistoryRepository,
        IAdmissionsRepository admissionsRepository,
        ICompanyRepository companyRepository,
        IMapper mapper,
        ICentralTokenService centralTokenService
    ) : base(_config)
    {
        _manageRedisRepository = manageRedisRepository;
        _fiscalYearRepository = fiscalYearRepository;
        _attenderScheduleBlockServiceCentral = attenderScheduleBlockServiceCentral;
        _sendHistoryRepository = sendHistoryRepository;
        _admissionsRepository = admissionsRepository;
        _companyRepository = companyRepository;
        _mapper = mapper;
        _centralTokenService = centralTokenService;
    }


    public async Task<bool> CheckExistAttenderId(ExistAttenderViewModel model)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "mc.Attender",
                    ColumnName = "id",
                    Filter = $"id='{model.Id}'"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result > 0 ? true : false;
        }
    }

    public async Task<bool> CheckExistAttenderTimeSheet(AttenderTimeSheetLineViewModel model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AttenderTimeSheet_CheckExist]";
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    model.AttenderId,
                    model.WorkDayDate,
                    model.StartTime,
                    model.EndTime
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result > 0 ? true : false;
        }
    }

    public GetColumnsViewModel GetColumns(int? FiscalYearId, short? BranchId, int? DepartmenId)
    {
        var list = new GetColumnsViewModel
        {
            ActionType = "inline",
            Classes = "group-box-orange",
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "attenderTimeSheetId", FieldValue = "0", Operator = "==" } },
            AnswerCondition = "color:#da1717",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "workDayDatePersian", Title = "تاریخ", Type = (int)SqlDbType.NVarChar, Width = 10,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "doublepersiandate", IsPrimary = true
                },
                new()
                {
                    Id = "department", Title = "دپارتمان", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 12, IsPrimary = true
                },
                new()
                {
                    Id = "shift", Title = "شیفت کاری", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsPrimary = true, IsFilterParameter = true, Width = 13, FilterType = "select2",
                    FilterTypeApi =
                        $"/api/MC/MedicalTimeShiftApi/getdropdown_getshiftlist/{FiscalYearId}/{BranchId}/{DepartmenId}"
                },
                new()
                {
                    Id = "time", Title = "زمان", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    Width = 12, IsPrimary = true
                },
                new()
                {
                    Id = "numberOffline", Title = "حضوری", Type = (int)SqlDbType.NVarChar, IsPrimary = true, Size = 100,
                    IsDtParameter = true, IsFilterParameter = true, Width = 12, FilterType = "select2",
                    FilterTypeApi = "/api/MC/AttenderTimeSheetLineApi/getdropDown_offlinebookingunlimit"
                },
                new()
                {
                    Id = "numberOnline", Title = "غیرحضوری", Type = (int)SqlDbType.NVarChar, IsPrimary = true,
                    Size = 100, IsDtParameter = true, IsFilterParameter = true, Width = 12, FilterType = "select2",
                    FilterTypeApi = "/api/MC/AttenderTimeSheetLineApi/getdropDown_onlinebookingunlimit"
                },
                new()
                {
                    Id = "createUser", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 12
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 12
                },
                new() { Id = "isOfflineBookingUnlimit", IsPrimary = true },
                new() { Id = "isOnlineBookingUnlimit", IsPrimary = true },
                new() { Id = "departmentId", IsPrimary = true },
                new() { Id = "departmentTimeShiftId", IsPrimary = true },

                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 7 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "displayDetailMedicalTimeShift", Title = "نمایش", ClassName = "btn blue_outline_1",
                    IconName = "far fa-file-alt"
                }
            }
        };

        return list;
    }

    public async Task<MyResultPage<List<DetailListMedicalTimeShiftViewModel>>> GetDetailMedicalTimeShift(
        DetailMedicalTimeShiftViewModel model)
    {
        var result = new MyResultPage<List<DetailListMedicalTimeShiftViewModel>>();

        int? departmentTimeShiftId = null;
        if (model.Form_KeyValue[6]?.ToString() != null)
            departmentTimeShiftId = Convert.ToInt32(model.Form_KeyValue[6]?.ToString());

        DateTime? fromworkDayDate = null;
        DateTime? toworkDayDate = null;

        if (!string.IsNullOrWhiteSpace(model.Form_KeyValue[7]?.ToString()))
            fromworkDayDate = model.Form_KeyValue[7]?.ToString().Split(' ')[1].ToMiladiDateTime();

        if (!string.IsNullOrWhiteSpace(model.Form_KeyValue[8]?.ToString()))
            toworkDayDate = model.Form_KeyValue[8]?.ToString().Split(' ')[1].ToMiladiDateTime();

        if (model.Filters != null)
        {
            if (model.Filters.Any(x => x.Name == "workDayDatePersian"))
            {
                fromworkDayDate = model.Filters.FirstOrDefault(x => x.Name == "workDayDatePersian").Value.Split('-')[0]
                    .ToMiladiDateTime();
                toworkDayDate = model.Filters.FirstOrDefault(x => x.Name == "workDayDatePersian").Value.Split('-')[1]
                    .ToMiladiDateTime();
            }

            if (model.Filters.Any(x => x.Name == "shift"))
                departmentTimeShiftId = Convert.ToInt32(model.Filters.FirstOrDefault(x => x.Name == "shift").Value);
        }


        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("AttenderId", model.Form_KeyValue[0]?.ToString());
        parameters.Add("FiscalYearId",
            model.Form_KeyValue[1]?.ToString() != null ? model.Form_KeyValue[1]?.ToString() : null);
        parameters.Add("BranchId", model.Form_KeyValue[2] != null ? model.Form_KeyValue[2]?.ToString() : null);
        parameters.Add("MonthId", model.Form_KeyValue[3]?.ToString() != null ? model.Form_KeyValue[3]?.ToString() : null);
        parameters.Add("DayInWeek",
            model.Form_KeyValue[4]?.ToString() != null ? model.Form_KeyValue[4]?.ToString() : null);
        parameters.Add("FromWorkDayDate", fromworkDayDate);
        parameters.Add("ToWorkDayDate", toworkDayDate);
        parameters.Add("DepartmentTimeShiftId", departmentTimeShiftId);
        parameters.Add("IsOfflineBookingUnlimit",
            model.Filters != null
                ? model.Filters.Any(x => x.Name == "numberOffline")
                    ? model.Filters.FirstOrDefault(x => x.Name == "numberOffline").Value
                    : null
                : null);
        parameters.Add("IsOnlineBookingUnlimit",
            model.Filters != null
                ? model.Filters.Any(x => x.Name == "numberOnline")
                    ? model.Filters.FirstOrDefault(x => x.Name == "numberOnline").Value
                    : null
                : null);

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AttenderTimeSheet_GetDayList]";

            int? FiscalYearId = null;
            short? BranchId = null;
            int? DepartmenId = null;

            if (model.Form_KeyValue[1]?.ToString() != null)
                FiscalYearId = Convert.ToInt32(model.Form_KeyValue[1]?.ToString());

            if (model.Form_KeyValue[2] != null)
                BranchId = Convert.ToInt16(model.Form_KeyValue[2]?.ToString());

            if (model.Form_KeyValue[5]?.ToString() != null)
                DepartmenId = Convert.ToInt32(model.Form_KeyValue[5]?.ToString());

            result.Columns = GetColumns(FiscalYearId, BranchId, DepartmenId);

            conn.Open();
            result.Data =
                (await conn.QueryAsync<DetailListMedicalTimeShiftViewModel>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultDataStatus<List<ConvertAttenderScheduleBlockFromCentral>>> DeleteV1(
        AttenderTimeSheetSaveViewModel model)
    {
        var resultFinal = new MyResultDataStatus<List<ConvertAttenderScheduleBlockFromCentral>>
        {
            Data = new List<ConvertAttenderScheduleBlockFromCentral>()
        };

        var sendResult = new HttpResult<ResultQuery>();

        var validationError = new List<string>();
        validationError = await Validate(model, OperationType.Delete);


        if (ExtentionMethod.ListHasRow(validationError))
        {
            resultFinal.Successfull = false;
            resultFinal.Status = -100;
            resultFinal.ValidationErrors = validationError;

            return resultFinal;
        }

        #region Central

        if (model.Opr == "Del")
        {
            // لیست centralId ها
            var resultCentralListBulkDelete = await GetCentralIdList(model);

            if (resultCentralListBulkDelete.Data.Any(x => ExtentionMethod.NotNull(x.CentralId)))
            {
                var centralIdList = resultCentralListBulkDelete.Data.Where(x => ExtentionMethod.NotNull(x.CentralId))
                    .Select(x => x.CentralId);

                var centralIds = string.Join(',', centralIdList);

                var resultDeleteCentral = await _attenderScheduleBlockServiceCentral.Delete(centralIds);

                if (ExtentionMethod.NotNull(resultDeleteCentral))
                {
                    // field send - token / node
                    if (resultDeleteCentral.HttpStatus == HttpStatusCode.Unauthorized ||
                        resultDeleteCentral.HttpStatus == HttpStatusCode.BadRequest ||
                        resultDeleteCentral.HttpStatus == HttpStatusCode.InternalServerError)
                        return new MyResultDataStatus<List<ConvertAttenderScheduleBlockFromCentral>>
                        {
                            Successfull = false,
                            Status = -101,
                            StatusMessage = "درخواست شما به درستی انجام نشد ، مجدد تلاش فرمایید"
                        };
                    // field send - validation
                    if (resultDeleteCentral.HttpStatus == HttpStatusCode.NotAcceptable)
                    {
                        // field send - has patient for selected shift / block /
                        if (resultDeleteCentral.Data.IENumerableHasRow())
                        {
                            var patientList = new List<ResultValidateAttenderScheduleBlock>();
                            patientList = resultDeleteCentral.Data.ToList();

                            var patientListMapped =
                                await _admissionsRepository.ConvertAttenderScheduleBlockFromCentral(patientList);

                            // map to erp
                            return new MyResultDataStatus<List<ConvertAttenderScheduleBlockFromCentral>>
                            {
                                Successfull = false,
                                StatusMessage =
                                    "امکان ثبت تغییرات نمی باشد ، نوبت آنلاین رزرو شده برای این شیفت درمانی به ثبت رسیده است",
                                Status = -102,
                                Data = patientListMapped
                            };
                        }

                        if (ExtentionMethod.ListHasRow(resultDeleteCentral.ValidationErrors))
                            return new MyResultDataStatus<List<ConvertAttenderScheduleBlockFromCentral>>
                            {
                                Successfull = false,
                                StatusMessage = "error",
                                Status = -103,
                                Data = null,
                                ValidationErrors = resultDeleteCentral.ValidationErrors
                            };
                    }
                    //*****
                    else if (resultDeleteCentral.HttpStatus == HttpStatusCode.OK)
                    {
                        var logModel =
                            (from s in resultCentralListBulkDelete.Data.Where(x => ExtentionMethod.NotNull(x.CentralId))
                                select new SendHistoryViewModel
                                {
                                    Id = null,
                                    CentralId = s.CentralId.ToString(),
                                    ObjectId = s.Id.ToString()
                                }).ToList();


                        var modelSendHistory = new SendHistoryBulkInsert
                        {
                            SendObjectTypeId = Enums.SendObjectType.AttenderScheduleBlock,
                            SendUserId = model.CreateUserId,
                            ObjectHistoryList = logModel
                        };


                        var resultBulkInsert = await _sendHistoryRepository.InsertBulk(modelSendHistory);
                    }
                }
            }
        }

        #endregion

        var updateResult = new MyResultDataStatus<List<AttenderScheduleBlockSaveResult>>
        {
            Data = new List<AttenderScheduleBlockSaveResult>()
        };

        var sQuery = "[mc].[Spc_AttenderTimeSheet_Save]";

        using (var conn = Connection)
        {
            conn.Open();
            updateResult.Data = (await Connection.QueryAsync<AttenderScheduleBlockSaveResult>(sQuery, new
            {
                model.Opr,
                model.Id,
                model.DepartmentTimeShiftId,
                model.IsOfflineBookingUnlimit,
                model.NumberOnLineAppointment,
                model.NumberOffLineAppointment,
                model.AppointmentDistributionTypeId,
                model.WorkDayDate,
                model.AttenderId,
                model.CreateUserId,
                model.CreateDateTime
            }, commandTimeout: timeOut, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        if (updateResult.Data.Any(x => x.Status == -100))
        {
            resultFinal.Status = -104;
            resultFinal.Successfull = false;
            resultFinal.StatusMessage = "عملیات ثبت با خطا مواجه شد";
            resultFinal.Data = null;
        }
        else if (updateResult.Data.Any(x => x.Status == 100))
        {
            resultFinal.Status = 100;
            resultFinal.Successfull = true;
            resultFinal.StatusMessage = "عملیات با موفقیت انجام شد";
            resultFinal.Data = null;
        }


        await _manageRedisRepository.UpDatedropDownCacheByType(DropDownCache.Attender);
        await _manageRedisRepository.UpDatedropDownCacheByType(DropDownCache.AttenderParaClinic);


        return resultFinal;
    }

    public async Task<AttenderTimeSheetLineSaveResult<List<ConvertAttenderScheduleBlockFromCentral>>> SaveV1(
        AttenderTimeSheetSaveViewModel model)
    {
        var finalResult = new AttenderTimeSheetLineSaveResult<List<ConvertAttenderScheduleBlockFromCentral>>();

        var validationError = new List<string>();

        validationError = await Validate(model, model.Id > 0 ? OperationType.Update : OperationType.Insert);

        if (ExtentionMethod.ListHasRow(validationError))
            return new AttenderTimeSheetLineSaveResult<List<ConvertAttenderScheduleBlockFromCentral>>
            {
                Successfull = false,
                Status = -100,
                ValidationErrors = validationError
            };

        if (model.Opr == "Upd" && model.Id > 0)
        {
            var resultCentralListBulkDelete = await GetCentralIdList(model);

            if (resultCentralListBulkDelete.Data.Any(x => ExtentionMethod.NotNull(x.CentralId)))
            {
                var centralIdList = resultCentralListBulkDelete.Data.Where(x => ExtentionMethod.NotNull(x.CentralId))
                    .Select(x => x.CentralId);

                var centralIds = string.Join(',', centralIdList);

                var resultDeleteCentral = await _attenderScheduleBlockServiceCentral.Delete(centralIds);

                if (ExtentionMethod.NotNull(resultDeleteCentral))
                {
                    // field send - token / node
                    if (resultDeleteCentral.HttpStatus == HttpStatusCode.Unauthorized ||
                        resultDeleteCentral.HttpStatus == HttpStatusCode.BadRequest ||
                        resultDeleteCentral.HttpStatus == HttpStatusCode.InternalServerError)
                        return new AttenderTimeSheetLineSaveResult<List<ConvertAttenderScheduleBlockFromCentral>>
                        {
                            Successfull = false,
                            Status = -101,
                            StatusMessage = "درخواست شما به درستی انجام نشد ، مجدد تلاش فرمایید"
                        };
                    // field send - validation
                    if (resultDeleteCentral.HttpStatus == HttpStatusCode.NotAcceptable)
                    {
                        // field send - has patient for selected shift / block /
                        if (resultDeleteCentral.Data.IENumerableHasRow())
                        {
                            var patientList = new List<ResultValidateAttenderScheduleBlock>();
                            patientList = resultDeleteCentral.Data.ToList();

                            var patientListMapped =
                                await _admissionsRepository.ConvertAttenderScheduleBlockFromCentral(patientList);

                            // map to erp
                            return new AttenderTimeSheetLineSaveResult<List<ConvertAttenderScheduleBlockFromCentral>>
                            {
                                Successfull = false,
                                StatusMessage =
                                    "امکان ثبت تغییرات نمی باشد ، نوبت آنلاین رزرو شده برای این شیفت درمانی به ثبت رسیده است",
                                Status = -102,
                                Data = patientListMapped
                            };
                        }

                        if (ExtentionMethod.ListHasRow(resultDeleteCentral.ValidationErrors))
                            return new AttenderTimeSheetLineSaveResult<List<ConvertAttenderScheduleBlockFromCentral>>
                            {
                                Successfull = false,
                                StatusMessage = "error",
                                Status = -103,
                                Data = null,
                                ValidationErrors = resultDeleteCentral.ValidationErrors
                            };
                    }
                    //*****
                    else if (resultDeleteCentral.HttpStatus == HttpStatusCode.OK)
                    {
                        var logModel =
                            (from s in resultCentralListBulkDelete.Data.Where(x => ExtentionMethod.NotNull(x.CentralId))
                                select new SendHistoryViewModel
                                {
                                    Id = null,
                                    CentralId = s.CentralId.ToString(),
                                    ObjectId = s.Id.ToString()
                                }).ToList();


                        var modelSendHistory = new SendHistoryBulkInsert
                        {
                            SendObjectTypeId = Enums.SendObjectType.AttenderScheduleBlock,
                            SendUserId = model.CreateUserId,
                            ObjectHistoryList = logModel
                        };


                        var resultBulkInsert = await _sendHistoryRepository.InsertBulk(modelSendHistory);
                    }
                }
            }
        }
        else if (model.NumberOnLineAppointment != 0)
        {
            var tokenModel = await _centralTokenService.GetTokenModel();

            var token = await _centralTokenService.GetToken(tokenModel);

            if (!string.IsNullOrEmpty(token.Token))
            {
                var checkToken = await _centralTokenService.CheckToken(token.Token);

                if (!checkToken)
                {
                    await _centralTokenService.DeleteToken(token.Id);


                    return new AttenderTimeSheetLineSaveResult<List<ConvertAttenderScheduleBlockFromCentral>>
                    {
                        Successfull = false,
                        Status = -100,
                        ValidationErrors = new List<string> { "درخواست شما به درستی انجام نشد ، مجدد تلاش فرمایید" }
                    };
                }
            }
        }

        var updateResult = new List<AttenderScheduleBlockSaveResult>();

        var sQuery = "[mc].[Spc_AttenderTimeSheet_Save]";

        using (var conn = Connection)
        {
            conn.Open();
            updateResult = (await Connection.QueryAsync<AttenderScheduleBlockSaveResult>(sQuery, new
            {
                model.Opr,
                model.Id,
                model.DepartmentTimeShiftId,
                model.IsOfflineBookingUnlimit,
                model.NumberOnLineAppointment,
                model.NumberOffLineAppointment,
                model.AppointmentDistributionTypeId,
                model.WorkDayDate,
                model.AttenderId,
                model.CreateUserId,
                model.CreateDateTime
            }, commandTimeout: timeOut, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        if (updateResult.Any(x => x.Status == -100))
            return new AttenderTimeSheetLineSaveResult<List<ConvertAttenderScheduleBlockFromCentral>>
            {
                Successfull = false,
                Status = -104,
                StatusMessage = "عملیات ثبت با خطا مواجه شد ، شرح خطا به جدول لاگ ارسال شد",
                Id = 0
            };

        #region Central

        await _manageRedisRepository.UpDatedropDownCacheByType(DropDownCache.Attender);
        await _manageRedisRepository.UpDatedropDownCacheByType(DropDownCache.AttenderParaClinic);

        if (updateResult.Any(x => !ExtentionMethod.NotNull(x.SendHistoryId) || x.SendHistoryId == Guid.Empty))
            return new AttenderTimeSheetLineSaveResult<List<ConvertAttenderScheduleBlockFromCentral>>
            {
                Successfull = true,
                Status = 100,
                StatusMessage = "عملیات ثبت با موفقیت انجام شد"
            };

        var blockIds = updateResult.Select(z => z.AttenderScheduleBlockId.Value);

        var blockList = await _sendHistoryRepository.ScheduleBlockSendHistoryGetList(blockIds);

        if (ExtentionMethod.ListHasRow(blockList))
        {
            var companyId = await _companyRepository.GetCompanyCentralId();

            var mapModelScheduleBlockCentral =
                _mapper.Map<List<AttenderScheduleBlockSendHistoryGetList>, List<AttenderScheduleModel>>(blockList);

            var resultInsertCentral =
                await _attenderScheduleBlockServiceCentral.Save(mapModelScheduleBlockCentral, companyId);


            if (resultInsertCentral.HttpStatus == HttpStatusCode.Unauthorized ||
                resultInsertCentral.HttpStatus == HttpStatusCode.BadRequest ||
                resultInsertCentral.HttpStatus == HttpStatusCode.InternalServerError)
                return new AttenderTimeSheetLineSaveResult<List<ConvertAttenderScheduleBlockFromCentral>>
                {
                    Successfull = true,
                    Status = 101,
                    StatusMessage = "عملیات ثبت دیتابیس با موفقیت انجام شد ، ثبت سنترال با خطا واجه شد"
                    //CentralSuccessfull = false,
                    //CentralStatus = -100,
                    //CentralStatusMessage = "ارسال به درستی انجام نشد ، مجدد تلاش فرمایید"
                };
            // validation error
            if (resultInsertCentral.HttpStatus == HttpStatusCode.NotAcceptable &&
                ExtentionMethod.ListHasRow(resultInsertCentral.ValidationErrors))
                return new AttenderTimeSheetLineSaveResult<List<ConvertAttenderScheduleBlockFromCentral>>
                {
                    Successfull = true,
                    StatusMessage = "عملیات ثبت دیتابیس با موفقیت انجام شد ، ثبت سنترال با خطا واجه شد",
                    Status = 102,
                    ValidationErrors = resultInsertCentral.ValidationErrors,

                    CentralSuccessfull = false,
                    CentralStatusMessage = "error",
                    CentralStatus = -100,
                    CentralValidationErrors = null
                };

            var modelScheduleBlockUpdateHistory = (from s in resultInsertCentral.Data
                join m in updateResult on s.LocalId equals m.AttenderScheduleBlockId
                select new SendHistoryViewModel
                {
                    Id = m.SendHistoryId,
                    CentralId = s.CentralId.ToString(),
                    ObjectId = s.LocalId.ToString()
                }).ToList();

            var updBulkSendHistory =
                await _sendHistoryRepository.UpdateBulk(modelScheduleBlockUpdateHistory, 3, model.CreateUserId);

            return new AttenderTimeSheetLineSaveResult<List<ConvertAttenderScheduleBlockFromCentral>>
            {
                Status = 100,
                Successfull = true,
                StatusMessage = "عملیات ثبت با موفقیت انجام شد",

                CentralSuccessfull = true,
                CentralStatusMessage = "عملیات ثبت با موفقیت انجام شد",
                CentralStatus = 100,
                CentralValidationErrors = null
            };
        }

        return new AttenderTimeSheetLineSaveResult<List<ConvertAttenderScheduleBlockFromCentral>>
        {
            Status = 100,
            Successfull = true,
            StatusMessage = "عملیات ثبت با موفقیت انجام شد"
        };

        #endregion
    }

    public async Task<MyResultPage<List<MedicalTimeShiftDisplay>>> GetCentralIdList(
        AttenderTimeSheetSaveViewModel model)
    {
        var newGetPageView = new NewGetPageViewModel();
        newGetPageView.PageNo = null;
        newGetPageView.PageRowsCount = null;

        int? attenderTimeSheetId = null;

        if (model.Id > 0)
            attenderTimeSheetId = model.Id;

        newGetPageView.Form_KeyValue = new object[]
        {
            attenderTimeSheetId,
            null,
            null,
            null,
            null,
            null,
            null,
            model.DayInWeek,
            null,
            model.WorkDayDate,
            null,
            null,
            null,
            "attenderTimeSheet"
        };

        //IsOnline Condition

        newGetPageView.Filters = new List<FormKeyValue> { new() { Name = "appointmentTypeName", Value = "1" } };

        return await _admissionsRepository.DisplayScheduleBlock(newGetPageView);
    }

    public async Task<MyResultPage<List<MedicalTimeShiftDisplay>>> GetCentralIdListForDuplicate(
        AttenderTimeSheetDuplicateViewModel model)
    {
        var newGetPageView = new NewGetPageViewModel();
        newGetPageView.PageNo = null;
        newGetPageView.PageRowsCount = null;

        var currentTime = DateTime.Now.ToString("HH:mm:ss");

        newGetPageView.Form_KeyValue = new object[]
        {
            null,
            null,
            null,
            null,
            model.ToAttenderIds,
            model.FiscalYearId,
            model.BranchId,
            null,
            null,
            model.FromWorkDayDate,
            model.ToWorkDayDate,
            model.DepartmentId,
            currentTime,
            "attenderTimeSheet"
        };

        //IsOnline Condition
        newGetPageView.Filters = new List<FormKeyValue> { new() { Name = "appointmentTypeName", Value = "1" } };

        return await _admissionsRepository.DisplayScheduleBlock(newGetPageView);
    }

    public GetColumnsViewModel GetColumnsAttenderTimeSheetGetPage()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    FilterType = "number", Width = 5
                },
                new()
                {
                    Id = "workDayDatePersian", Title = "تاریخ", IsPrimary = true, Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 7, IsFilterParameter = true, FilterType = "doublepersiandate"
                },
                new()
                {
                    Id = "dayName", Title = "روزهفته", IsPrimary = true, Type = (int)SqlDbType.Int,
                    IsDtParameter = true, Width = 7, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/PB/PublicApi/getdropdowndays"
                },
                new()
                {
                    Id = "shift", Title = "شیفت کاری", IsPrimary = true, Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, FilterType = "number", Width = 7
                },
                new()
                {
                    Id = "numberOfflineAppointment", Title = "تعداد حضوری", IsPrimary = true, Type = (int)SqlDbType.Int,
                    IsDtParameter = true, FilterType = "number", Width = 7
                },
                new()
                {
                    Id = "numberOnlineAppointment", Title = "تعداد غیرحضوری", IsPrimary = true,
                    Type = (int)SqlDbType.Int, IsDtParameter = true, FilterType = "number", Width = 7
                },
                new()
                {
                    Id = "startTime", Title = "زمان شروع", IsPrimary = true, Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, FilterType = "number", Width = 7
                },
                new()
                {
                    Id = "endTime", Title = "زمان پایان", IsPrimary = true, Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, FilterType = "number", Width = 7
                },
                new()
                {
                    Id = "createUser", Title = "کاربر ثبت کننده", IsPrimary = true, Type = (int)SqlDbType.Int,
                    IsDtParameter = true, FilterType = "number", Width = 7
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", IsPrimary = true, Type = (int)SqlDbType.Int,
                    IsDtParameter = true, FilterType = "number", Width = 7
                }
            }
        };

        return list;
    }

    public async Task<MyResultPage<List<AttenderTimeSheetGetPage>>> GetPageAttenderTimeSheet(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<AttenderTimeSheetGetPage>>();
        var FromWorkDayDate = model.Form_KeyValue[4]?.ToString().ToMiladiDateTime();
        var ToWorkDayDate = model.Form_KeyValue[5]?.ToString().ToMiladiDateTime();
        if (model.Filters.Any(x => x.Name == "workDayDatePersian"))
        {
            FromWorkDayDate = model.Filters.FirstOrDefault(x => x.Name == "workDayDatePersian").Value.Split('-')[0]
                .ToMiladiDateTime();
            ToWorkDayDate = model.Filters.FirstOrDefault(x => x.Name == "workDayDatePersian").Value.Split('-')[1]
                .ToMiladiDateTime();
        }

        var isConvertToByte = byte.TryParse(model.Form_KeyValue[3]?.ToString(), out var DayInWeekShamsi);
        if (isConvertToByte)
            throw new Exception("خطای سیستمی");
        byte? DayInWeek = null;
        if (model.Filters.Any(x => x.Name == "dayName"))
            DayInWeek = DayOfWeekToMiladi(Convert.ToByte(model.Filters.FirstOrDefault(x => x.Name == "dayName").Value));

        DayInWeekShamsi = (byte)(DayInWeek != null ? DayInWeek : DayInWeekShamsi);

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AttenderTimeSheet_GetPage]";

            var parameters = new DynamicParameters();
            parameters.Add("PageNo", model.PageNo);
            parameters.Add("PageRowsCount", model.PageRowsCount);
            parameters.Add("FiscalYearId", model.Form_KeyValue[0]?.ToString());
            parameters.Add("BranchId", model.Form_KeyValue[1]?.ToString());
            parameters.Add("AttenderId", model.Form_KeyValue[2]?.ToString());
            parameters.Add("DayInWeek", DayInWeekShamsi);
            parameters.Add("FromWorkDayDate", FromWorkDayDate);
            parameters.Add("ToWorkDayDate", ToWorkDayDate);
            conn.Open();
            result.Columns = GetColumnsAttenderTimeSheetGetPage();

            result.Data =
                (await conn.QueryAsync<AttenderTimeSheetGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();

            conn.Close();
        }

        return result;
    }

    public async Task<List<string>> Validate(AttenderTimeSheetSaveViewModel model, OperationType operationType)
    {
        var error = new List<string>();

        if (model == null)
        {
            error.Add("موردی برای ارسال وجود ندارد");
            return error;
        }

        if (operationType == OperationType.Insert)
        {
            #region بررسی تکراری بودن


            var checkModel = new AttenderTimeSheetLineViewModel
            {
                AttenderId = model.AttenderId,
                WorkDayDate = model.WorkDayDate,
                StartTime = TimeSpan.Parse(model.StartTime),
                EndTime = TimeSpan.Parse(model.EndTime),
            };

            var workDayDate = DateTime.Parse($"{Convert.ToDateTime(model.WorkDayDate.Value).ToShortDateString()}");
            var currentDate = DateTime.Parse($"{Convert.ToDateTime(DateTime.Now.Date).ToShortDateString()}");


            if (model.WorkDayDate.HasValue && workDayDate < currentDate)
                error.Add("روز انتخابی گذشته ،مجاز به ثبت نمی باشید");

            var check = await CheckExistAttenderTimeSheet(checkModel);
            if (check)
                error.Add("تکراری است قبلا ثبت شده است");

            #endregion
        }

        #region بررسی وضعیت دوره مالی

        var resultCheckFiscalYear =
            await _fiscalYearRepository.GetFicalYearStatusByDate(model.WorkDayDate, model.CompanyId);
        if (!resultCheckFiscalYear.Successfull)
            error.Add(resultCheckFiscalYear.StatusMessage);

        //string month1 = "";
        //string month2 = "";
        //if (resultCheckFiscalYear.ListHasRow())
        //{

        //	for (int i = 0; i < resultCheckFiscalYear.Count; i++)
        //	{
        //		if (resultCheckFiscalYear[i].Status == -102)
        //		{
        //			month1 +=GetMonthWithOutId(resultCheckFiscalYear[i].MonthId) + " , ";
        //		}
        //		if (resultCheckFiscalYear[i].Status == -103)
        //		{
        //			month2 +=GetMonthWithOutId(resultCheckFiscalYear[i].MonthId) + " , ";
        //		}

        //	}
        //	if (month1 != "")
        //		error.Add($" ماه های ذکر شده تعریف نشده است : {month1.Remove(month1.Length - 2)}  ");


        //	if (month2 != "")
        //		error.Add($"  ماه های ذکر شده بسته می باشد : {month2.Remove(month2.Length - 2)}  ");


        //}

        #endregion

        return error;
    }

    public async Task<AttenderTimeSheetLineSaveResult<List<ConvertAttenderScheduleBlockFromCentral>>> InsertDuplicate(
        AttenderTimeSheetDuplicateViewModel model)
    {
        var result = new AttenderTimeSheetLineSaveResult<List<ConvertAttenderScheduleBlockFromCentral>>();


        var resultCentralListBulkDelete = await GetCentralIdListForDuplicate(model);

        if (resultCentralListBulkDelete.Data.Any(x => ExtentionMethod.NotNull(x.CentralId)))
        {
            var centralIdList = resultCentralListBulkDelete.Data.Where(x => ExtentionMethod.NotNull(x.CentralId))
                .Select(x => x.CentralId);

            var centralIds = string.Join(',', centralIdList);

            var resultDeleteCentral = await _attenderScheduleBlockServiceCentral.Delete(centralIds);

            if (ExtentionMethod.NotNull(resultDeleteCentral))
            {
                // field send - token / node
                if (resultDeleteCentral.HttpStatus == HttpStatusCode.Unauthorized ||
                    resultDeleteCentral.HttpStatus == HttpStatusCode.BadRequest ||
                    resultDeleteCentral.HttpStatus == HttpStatusCode.InternalServerError)
                    return new AttenderTimeSheetLineSaveResult<List<ConvertAttenderScheduleBlockFromCentral>>
                    {
                        Successfull = false,
                        Status = -101,
                        StatusMessage = "درخواست شما به درستی انجام نشد ، مجدد تلاش فرمایید"
                    };
                // field send - validation
                if (resultDeleteCentral.HttpStatus == HttpStatusCode.NotAcceptable)
                {
                    // field send - has patient for selected shift / block /
                    if (resultDeleteCentral.Data.IENumerableHasRow())
                    {
                        var patientList = new List<ResultValidateAttenderScheduleBlock>();
                        patientList = resultDeleteCentral.Data.ToList();

                        var patientListMapped =
                            await _admissionsRepository.ConvertAttenderScheduleBlockFromCentral(patientList);

                        // map to erp
                        return new AttenderTimeSheetLineSaveResult<List<ConvertAttenderScheduleBlockFromCentral>>
                        {
                            Successfull = false,
                            StatusMessage =
                                "امکان ثبت تغییرات نمی باشد ، نوبت آنلاین رزرو شده برای این شیفت درمانی به ثبت رسیده است",
                            Status = -102,
                            Data = patientListMapped
                        };
                    }

                    if (ExtentionMethod.ListHasRow(resultDeleteCentral.ValidationErrors))
                        return new AttenderTimeSheetLineSaveResult<List<ConvertAttenderScheduleBlockFromCentral>>
                        {
                            Successfull = false,
                            StatusMessage = "error",
                            Status = -103,
                            Data = null,
                            ValidationErrors = resultDeleteCentral.ValidationErrors
                        };
                }
                //*****
                else if (resultDeleteCentral.HttpStatus == HttpStatusCode.OK)
                {
                    var logModel =
                        (from s in resultCentralListBulkDelete.Data.Where(x => ExtentionMethod.NotNull(x.CentralId))
                            select new SendHistoryViewModel
                            {
                                Id = null,
                                CentralId = s.CentralId.ToString(),
                                ObjectId = s.Id.ToString()
                            }).ToList();


                    var modelSendHistory = new SendHistoryBulkInsert
                    {
                        SendObjectTypeId = Enums.SendObjectType.AttenderScheduleBlock,
                        SendUserId = model.CreateUserId,
                        ObjectHistoryList = logModel
                    };


                    var resultBulkInsert = await _sendHistoryRepository.InsertBulk(modelSendHistory);
                }
            }
        }

        var sQuery = "[mc].[Spc_AttenderTimeSheet_Duplicate]";

        using (var conn = Connection)
        {
            conn.Open();
            var resultData = await Connection.QueryAsync<AttenderScheduleBlockSaveResult>(sQuery, new
            {
                model.FiscalYearId,
                model.BranchId,
                model.FromAttenderId,
                model.ToAttenderIds,
                model.Type,
                model.FromWorkDayDate,
                model.ToWorkDayDate,
                model.CreateUserId,
                model.CreateDateTime
            }, commandTimeout: 180, commandType: CommandType.StoredProcedure);
            conn.Close();
            result.Successfull = result.Status == 100;

            if (resultData.Any(x => x.Status == -100))
                return new AttenderTimeSheetLineSaveResult<List<ConvertAttenderScheduleBlockFromCentral>>
                {
                    Successfull = false,
                    Status = -104,
                    StatusMessage = "عملیات ثبت با خطا مواجه شد ، شرح خطا به جدول لاگ ارسال شد",
                    Id = 0
                };

            await _manageRedisRepository.UpDatedropDownCacheByType(DropDownCache.Attender);
            await _manageRedisRepository.UpDatedropDownCacheByType(DropDownCache.AttenderParaClinic);

            if (resultData.Any(x => !ExtentionMethod.NotNull(x.SendHistoryId) || x.SendHistoryId == Guid.Empty))
                return new AttenderTimeSheetLineSaveResult<List<ConvertAttenderScheduleBlockFromCentral>>
                {
                    Successfull = true,
                    Status = 100,
                    StatusMessage = "عملیات ثبت با موفقیت انجام شد"
                };

            var blockIds = resultData.Select(z => z.AttenderScheduleBlockId.Value);

            var blockList = await _sendHistoryRepository.ScheduleBlockSendHistoryGetList(blockIds);

            if (ExtentionMethod.ListHasRow(blockList))
            {
                var companyId = await _companyRepository.GetCompanyCentralId();

                var mapModelScheduleBlockCentral =
                    _mapper.Map<List<AttenderScheduleBlockSendHistoryGetList>, List<AttenderScheduleModel>>(blockList);

                var resultInsertCentral =
                    await _attenderScheduleBlockServiceCentral.Save(mapModelScheduleBlockCentral, companyId);


                if (resultInsertCentral.HttpStatus == HttpStatusCode.Unauthorized ||
                    resultInsertCentral.HttpStatus == HttpStatusCode.BadRequest ||
                    resultInsertCentral.HttpStatus == HttpStatusCode.InternalServerError)
                    return new AttenderTimeSheetLineSaveResult<List<ConvertAttenderScheduleBlockFromCentral>>
                    {
                        Successfull = true,
                        Status = 101,
                        StatusMessage = "عملیات ثبت دیتابیس با موفقیت انجام شد ، ثبت سنترال با خطا واجه شد"
                    };
                // validation error
                if (resultInsertCentral.HttpStatus == HttpStatusCode.NotAcceptable &&
                    ExtentionMethod.ListHasRow(resultInsertCentral.ValidationErrors))
                    return new AttenderTimeSheetLineSaveResult<List<ConvertAttenderScheduleBlockFromCentral>>
                    {
                        Successfull = true,
                        StatusMessage = "عملیات ثبت دیتابیس با موفقیت انجام شد ، ثبت سنترال با خطا واجه شد",
                        Status = 102,
                        ValidationErrors = resultInsertCentral.ValidationErrors,

                        CentralSuccessfull = false,
                        CentralStatusMessage = "error",
                        CentralStatus = -100,
                        CentralValidationErrors = null
                    };

                var modelScheduleBlockUpdateHistory = (from s in resultInsertCentral.Data
                    join m in resultData on s.LocalId equals m.AttenderScheduleBlockId
                    select new SendHistoryViewModel
                    {
                        Id = m.SendHistoryId,
                        CentralId = s.CentralId.ToString(),
                        ObjectId = s.LocalId.ToString()
                    }).ToList();

                var updBulkSendHistory =
                    await _sendHistoryRepository.UpdateBulk(modelScheduleBlockUpdateHistory, 3, model.CreateUserId);

                return new AttenderTimeSheetLineSaveResult<List<ConvertAttenderScheduleBlockFromCentral>>
                {
                    Status = 100,
                    Successfull = true,
                    StatusMessage = "عملیات ثبت با موفقیت انجام شد",

                    CentralSuccessfull = true,
                    CentralStatusMessage = "عملیات ثبت با موفقیت انجام شد",
                    CentralStatus = 100,
                    CentralValidationErrors = null
                };
            }

            return new AttenderTimeSheetLineSaveResult<List<ConvertAttenderScheduleBlockFromCentral>>
            {
                Status = 100,
                Successfull = true,
                StatusMessage = "عملیات ثبت با موفقیت انجام شد"
            };
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> AttenderTimeSheetGetProperties(AttenderTimeSheetGetPropertiesDto dto)
    {
        var fromWorkDayDate = dto.FromWorkDayDatePersian != "null" ? dto.FromWorkDayDatePersian.ToMiladiDateTime() : null;
        var toWorkDayDate = dto.ToWorkDayDatePersian != "null" ? dto.ToWorkDayDatePersian.ToMiladiDateTime() : null;
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AttenderTimeSheet_GetProperties]";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    FiscalYearId = dto.FiscalYearId == "null" ? null : dto.FiscalYearId,
                    BranchId = dto.BranchId == "null" ? null : dto.BranchId,
                    DepartmentId = dto.DepartmentId == "null" ? null : dto.DepartmentId,
                    FromWorkDayDate = fromWorkDayDate,
                    ToWorkDayDate = toWorkDayDate,
                    FiscalYearClosed = dto.Isclosed,
                    Type = dto.Type
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }
    public async Task<MemoryStream> ExportCsvGetAttenderTimeSheetLine(NewGetPageViewModel model)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var getPage = await GetPageAttenderTimeSheet(model);
        var dataColumns = getPage.Columns;


        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                GetColumnsAttenderTimeSheetGetPage().DataColumns.Where(x => x.IsDtParameter).Select(z => z.Title))
        };


        result.Rows = from p in getPage.Data
            select new
            {
                p.Id,
                p.WorkDayDatePersian,
                p.DayName,
                p.ShiftName,
                p.NumberOfflineAppointment,
                p.NumberOnlineAppointment,
                p.StartTime,
                p.EndTime,
                p.CreateUser,
                p.CreateDateTimePersian
            };

        var columns = dataColumns.DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title)
            .ToList();

        csvStream = await csvGenerator.GenerateCsv(result.Rows, columns);

        return csvStream;
    }

    public async Task<int> GetDepartmentTimeShiftId(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "mc.MedicalTimeShift",
                    ColumnName = "DepartmentTimeShiftId",
                    Filter = $"id='{id}'"
                }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetAttenderTimeShiftList(GetAttenderTimeShift model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AttenderTimeSheet_GetShiftList]";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    model.AttenderId,
                    model.CurrentDate,
                    model.CurrentTime,
                    model.BranchId,
                    model.IsOnline
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public List<MyDropDownViewModel> AppointmentType_GetDropdown()
    {
        return new List<MyDropDownViewModel>
        {
            new() { Id = 1, Name = "آنلاین" },
            new() { Id = 2, Name = "حضوری" }
        };
    }

    public async Task<List<PresenceDaysViewModel>> GetPresenceDays(PresenceDaysModel model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AttenderTimeSheet_GetPresenceDays]";
            conn.Open();
            var result = await Connection.QueryAsync<PresenceDaysViewModel>(sQuery, new
            {
                model.AttenderId,
                model.BranchId,
                model.WorkDayDate
            }, commandType: CommandType.StoredProcedure);
            conn.Close();


            return result.ToList();
        }
    }


    public async Task<MyResultPage<List<AttenderTimeSheetGetList>>> GetListAttenderTimeSheet(
        AttenderTimeSheetViewModel model)
    {
        var result = new MyResultPage<List<AttenderTimeSheetGetList>>();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AttenderTimeSheet_GetList]";

            var parameters = new DynamicParameters();
            parameters.Add("FiscalYearId", model.FiscalYearId);
            parameters.Add("MonthId", model.MonthId);
            parameters.Add("DayInWeek", model.DayInWeek);
            parameters.Add("BranchId", model.BranchId);
            parameters.Add("AttenderId", model.AttenderId);

            conn.Open();

            result.Data =
                (await conn.QueryAsync<AttenderTimeSheetGetList>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();

            conn.Close();
        }

        return result;
    }

    public async Task<IEnumerable<AttenderTimeShiftGetGroupDetailViewModel>> MedicalTimeShiftGetGroupedDetail(
        AttenderShiftdDetailViewModel model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_DepartmentTimeShift_GetGroupedDetail]";

            var parameters = new DynamicParameters();
            parameters.Add("AttenderId", model.AttenderId);
            parameters.Add("FiscalYearId", model.FiscalYearId);
            parameters.Add("BranchId", model.BranchId);

            conn.Open();

            var result = await conn.QueryAsync<AttenderTimeShiftGetGroupDetailViewModel>(sQuery, parameters,
                commandType: CommandType.StoredProcedure);

            conn.Close();

            result = result.OrderBy(x => x.DayId);

            return result;
        }
    }

    public List<MyDropDownViewModel> GetDropDown_OfflineBookingUnLimit()
    {
        return new List<MyDropDownViewModel>
        {
            new() { Id = 1, Name = "غیرفعال" },
            new() { Id = 2, Name = "نامحدود" },
            new() { Id = 3, Name = "محدود" }
        };
    }

    public List<MyDropDownViewModel> GetDropDown_OnlineBookingUnLimit()
    {
        return new List<MyDropDownViewModel>
        {
            new() { Id = 1, Name = "غیرفعال" },
            new() { Id = 2, Name = "محدود" }
        };
    }

    public async Task<List<MyDropDownViewModel2>> GetDropdownDepartmentWorkDayList(int departmentTimeShiftId,
        byte monthId, byte dayInWeek, int? id, int attenderId)
    {
        var result = new List<MyDropDownViewModel2>();
        var currentDateTime = DateTime.Now.Date;

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_DepartmentTimeShift_GetWorkDayList]";
            var parameters = new DynamicParameters();
            parameters.Add("Id", id);
            parameters.Add("AttenderId", attenderId);
            parameters.Add("DepartmentTimeShiftId", departmentTimeShiftId);
            parameters.Add("MonthId", monthId);
            parameters.Add("DayInWeek", dayInWeek);
            parameters.Add("CurrentDate", currentDateTime);

            conn.Open();
            var returnResult =
                (await conn.QueryAsync<AttenderWorkDayListViewModel>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();


            result = returnResult.Select((x, i) =>
                new MyDropDownViewModel2
                {
                    Id = x.WorkDayDatePersian,
                    Name = x.WorkDayDatePersian + " / " + x.StartTime + " - " + x.EndTime
                }).ToList();


            conn.Close();
        }

        return result;
    }
}