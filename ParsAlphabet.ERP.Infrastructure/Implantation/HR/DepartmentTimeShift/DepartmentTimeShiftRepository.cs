using System.Data;
using System.Net;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.Central.ObjectModel.MedicalCare;
using ParsAlphabet.Central.ObjectModel.Public;
using ParsAlphabet.Central.ObjectModel.Requests;
using ParsAlphabet.ERP.Application.Dtos.GN.SendHistory;
using ParsAlphabet.ERP.Application.Dtos.HR.DepartmentTimeShift;
using ParsAlphabet.ERP.Application.Dtos.MC;
using ParsAlphabet.ERP.Application.Dtos.MC.AttenderTimeSheetLine;
using ParsAlphabet.ERP.Application.Dtos.MC.MedicalShiftTimeSheet;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Application.Interfaces.MC;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.Central;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYear;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.SendHistory;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.HR.DepartmentTimeShift;

public class DepartmentTimeShiftRepository :
    BaseRepository<DepartmentTimeShiftModel, int, string>,
    IBaseRepository<DepartmentTimeShiftModel, int, string>
{
    private readonly IAdmissionsRepository _admissionsRepository;
    private readonly IAttenderScheduleBlockServiceCentral _attenderScheduleBlockServiceCentral;
    private readonly ICompanyRepository _companyRepository;

    private readonly FiscalYearRepository _fiscalYearRepository;
    private readonly SendHistoryRepository _sendHistoryRepository;

    public DepartmentTimeShiftRepository(IConfiguration config, FiscalYearRepository fiscalYearRepository,
        IAdmissionsRepository admissionsRepository,
        IAttenderScheduleBlockServiceCentral attenderScheduleBlockServiceCentral,
        SendHistoryRepository sendHistoryRepository,
        ICompanyRepository companyRepository) : base(config)
    {
        _fiscalYearRepository = fiscalYearRepository;
        _admissionsRepository = admissionsRepository;
        _attenderScheduleBlockServiceCentral = attenderScheduleBlockServiceCentral;
        _sendHistoryRepository = sendHistoryRepository;
        _companyRepository = companyRepository;
    }

    public new GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 6, FilterType = "number"
                },
                new()
                {
                    Id = "fiscalYear", Title = "سال مالی", Type = (int)SqlDbType.TinyInt, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/GN/FiscalYearApi/getdropdown", Width = 10
                },
                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.TinyInt, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2", FilterTypeApi = "/api/GN/BranchApi/getdropdown",
                    Width = 10
                },
                new()
                {
                    Id = "department", IsPrimary = true, Title = "دپارتمان", Type = (int)SqlDbType.TinyInt,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/HR/OrganizationalDepartmentApi/getdropdown/2", Width = 15
                },
                new()
                {
                    Id = "shiftName", IsPrimary = true, Title = "نام شیفت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.VarChar, Size = 20,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "doublepersiandate", Width = 12
                },
                new()
                {
                    Id = "createUser", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.VarChar, Size = 16,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/GN/UserApi/getdropdown/2", Width = 16
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 13 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "displayDepartmentTimeShift", Title = "نمایش", ClassName = "", IconName = "far fa-file-alt"
                },
                new() { Name = "sep1", IsSeparator = true },
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" },
                new() { Name = "sep1", IsSeparator = true },
                new()
                {
                    Name = "addDayInWeek", Title = "افزودن روز کاری", ClassName = "",
                    IconName = "fas fa-plus color-blue"
                }
            }
        };

        return list;
    }

    public GetColumnsViewModel LineGetColumns()
    {
        var list = new GetColumnsViewModel
        {
            IsEditable = true,
            ActionType = "inline",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 10
                },
                new() { Id = "dayInWeek", IsPrimary = true },
                new()
                {
                    Id = "dayName", Title = "روز هفته", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 30
                },
                new()
                {
                    Id = "startTime", Title = "زمان شروع", Type = (int)SqlDbType.Decimal, Size = 0,
                    IsDtParameter = true, Editable = true, InputType = "time",
                    InputMask = new InputMask { Mask = "'mask':'99:99'" }, MaxLength = 5, Width = 25
                },
                new()
                {
                    Id = "endTime", Title = "زمان پایان", Type = (int)SqlDbType.Decimal, Size = 0, IsDtParameter = true,
                    Editable = true, InputType = "time", InputMask = new InputMask { Mask = "'mask':'99:99'" },
                    MaxLength = 5, Width = 25
                },
                new()
                {
                    Id = "isLock", IsPrimary = true, Title = "انتشاریافته", Type = (int)SqlDbType.Bit,
                    IsDtParameter = true, Width = 5, Align = "center"
                },
                new()
                {
                    Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    FixedColumn = true, Width = 5
                }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "departmentTimeShiftLineChangeLock", Title = "انتشار/عدم انتشار",
                    ClassName = "btn blue_outline_1", IconName = "fa fa-check"
                }
            }
        };

        return list;
    }

    public async Task<MemoryStream> CSV(NewGetPageViewModel model)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var Columns = string.Join(',',
            GetColumns().DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title));
        var getPage = await GetPage(model);

        var Rows = from p in getPage.Data
            select new
            {
                p.Id,
                p.FiscalYear,
                p.Branch,
                p.Department,
                p.ShiftName,
                p.CreateDateTimePersian,
                p.CreateUser
            };

        return csvStream = await csvGenerator.GenerateCsv(Rows, Columns.Split(',').ToList());
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(int departmentId)
    {
        var filter = departmentId > 0 ? $" DepartmentId={departmentId} " : "";
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "hr.DepartmentTimeShift",
                    TitleColumnName = "ShiftName",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<MyResultPage<List<DepartmentTimeShiftGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<DepartmentTimeShiftGetPage>>
        {
            Data = new List<DepartmentTimeShiftGetPage>()
        };

        var fromCreateDateMiladi = (DateTime?)null;
        var toCreateDateMiladi = (DateTime?)null;

        if (model.Filters.Any(x => x.Name == "createDateTimePersian"))
        {
            fromCreateDateMiladi =
                model.Filters.FirstOrDefault(x => x.Name == "createDateTimePersian").Value.Split('-')[0]
                    .ToMiladiDateTime();
            toCreateDateMiladi =
                model.Filters.FirstOrDefault(x => x.Name == "createDateTimePersian").Value.Split('-')[1]
                    .ToMiladiDateTime();
        }


        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("FiscalYearId",
            model.Filters.Any(x => x.Name == "fiscalYear")
                ? model.Filters.FirstOrDefault(x => x.Name == "fiscalYear").Value
                : null);
        parameters.Add("BranchId",
            model.Filters.Any(x => x.Name == "branch")
                ? model.Filters.FirstOrDefault(x => x.Name == "branch").Value
                : null);
        parameters.Add("DepartmentId",
            model.Filters.Any(x => x.Name == "department")
                ? model.Filters.FirstOrDefault(x => x.Name == "department").Value
                : null);
        parameters.Add("ShiftName",
            model.Filters.Any(x => x.Name == "shiftName")
                ? model.Filters.FirstOrDefault(x => x.Name == "shiftName").Value
                : null);
        parameters.Add("FromCreateDate", fromCreateDateMiladi);
        parameters.Add("ToCreateDate", toCreateDateMiladi);
        parameters.Add("CreateUserId",
            model.Filters.Any(x => x.Name == "createUser")
                ? model.Filters.FirstOrDefault(x => x.Name == "createUser").Value
                : null);


        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "[hr].[Spc_DepartmentTimeShift_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<DepartmentTimeShiftGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultPage<List<DepartmentTimeShiftLineGetRecord>>> LineGetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<DepartmentTimeShiftLineGetRecord>>
        {
            Data = new List<DepartmentTimeShiftLineGetRecord>()
        };

        var parameters = new DynamicParameters();

        parameters.Add("HeaderId", model.Form_KeyValue[0]?.ToString());


        result.Columns = LineGetColumns();

        using (var conn = Connection)
        {
            var sQuery = "[hr].[Spc_DepartmentTimeShiftLine_GetList]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<DepartmentTimeShiftLineGetRecord>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<List<DepartmentTimeShiftGetRecord>> GetRecordById(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "[hr].[Spc_DepartmentTimeShift_GetRecord]";
            var result = await conn.QueryAsync<DepartmentTimeShiftGetRecord>(sQuery, new
            {
                Id = id
            }, commandType: CommandType.StoredProcedure);

            return result.AsList();
        }
    }

    public async Task<MyResultStatus> Insert(DepartmentTimeShiftModel model)
    {
        var resultValidation = Validation(model, Enums.OperationType.Insert);

        if (Extensions.ListHasRow(resultValidation))
            return new MyResultStatus
            {
                Successfull = false,
                Status = -100,
                ValidationErrors = resultValidation
            };

        using (var conn = Connection)
        {
            var sQuery = "[hr].[Spc_DepartmentTimeShift_InsUpd]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                Id = 0,
                model.FiscalYearId,
                model.BranchId,
                model.DepartmentId,
                model.ShiftName,
                model.Description,
                model.CreateUserId,
                model.CreateDateTime
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = result.Status == 100;
            return result;
        }
    }

    public async Task<MyResultStatus> Update(DepartmentTimeShiftModel model)
    {
        var result = new MyResultStatus();
        //var updCentral = new HttpResult<ResultQuery>();


        if (!Extensions.NotNull(model))
            return new MyResultStatus
            {
                Successfull = false,
                Status = -100,
                StatusMessage = "مقادیر ورودی معتبر نمی باشد"
            };

        var resultValidation = Validation(model, Enums.OperationType.Update);

        if (Extensions.ListHasRow(resultValidation))
            return new MyResultStatus
            {
                Successfull = false,
                Status = -100,
                ValidationErrors = resultValidation
            };


        //var isOnlineShift = await CheckDepartmentTimeShiftIsOnline(model.Id);
        //if (isOnlineShift)
        //{

        //	var centralModel = new List<UpdateShiftNameInputModel>();
        //	UpdateShiftNameInputModel updShiftNameInputModel = new UpdateShiftNameInputModel();

        //	updShiftNameInputModel.ShiftName = model.ShiftName;
        //	updShiftNameInputModel.MedicalTimeShiftId = model.MedicalShiftId;
        //	centralModel.Add(updShiftNameInputModel);
        //	var companyId = await _companyRepository.GetCompanyCentralId();
        //	updCentral = await _attenderScheduleBlockServiceCentral.UpdateShiftName(centralModel, companyId);

        //	if (updCentral.NotNull())
        //	{
        //		if (updCentral.HttpStatus == HttpStatusCode.Unauthorized ||
        //				updCentral.HttpStatus == HttpStatusCode.BadRequest ||
        //				updCentral.HttpStatus == HttpStatusCode.InternalServerError)
        //		{
        //			return new MyResultStatus()
        //			{
        //				Successfull = false,
        //				Status = (int)HttpStatusCode.Unauthorized,
        //				StatusMessage = "درخواست شما به درستی انجام نشد ، مجدد تلاش فرمایید"
        //			};
        //		}
        //		else if (updCentral.HttpStatus == HttpStatusCode.NotAcceptable)
        //		{
        //			if (updCentral.ValidationErrors.ListHasRow())
        //			{
        //				return new MyResultStatus()
        //				{
        //					Successfull = false,
        //					StatusMessage = "error",
        //					Status = -100,
        //					ValidationErrors = updCentral.ValidationErrors
        //				};
        //			}
        //		}

        //	}

        //}
        //if (!isOnlineShift || (isOnlineShift && updCentral.HttpStatus == HttpStatusCode.OK && updCentral.Successfull))
        //{

        using (var conn = Connection)
        {
            var sQuery = "[hr].[Spc_DepartmentTimeShift_InsUpd]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.Id,
                model.FiscalYearId,
                model.BranchId,
                model.DepartmentId,
                model.ShiftName,
                model.Description,
                CreateUserId = model.ModifiedUserId,
                model.CreateDateTime
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = result.Status == 100;
        }
        //}


        return result;
    }

    public List<string> Validation(DepartmentTimeShiftModel model, Enums.OperationType operationType)
    {
        var errors = new List<string>();

        return errors;
    }

    public async Task<IEnumerable<MyDropDownViewModel>> DepartmentTimeShiftGetProperties(short? fiscalYearId,
        short? branchId, string departmentId, byte type, byte? isclose)
    {
        using (var conn = Connection)
        {
            var sQuery = "[hr].[Spc_DepartmentTimeShift_GetProperties]";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    FiscalYearId = type == 1 && fiscalYearId == 0 ? null : fiscalYearId,
                    BranchId = type == 1 || (type == 2 && branchId == 0) ? null : branchId,
                    DepartmentId = departmentId != "null" ? departmentId : null,
                    FiscalYearClosed = isclose,
                    Type = type
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }


    public async Task<MyResultStatus> InsertDuplicate(DepartmentTimeShiftDuplicateViewModel model)
    {
        var validationError = await _fiscalYearRepository.ValidateIsClosedFiscalYearId(model.FromFiscalYearId);

        if (validationError.Count > 0)
            return new MyResultStatus
            {
                Status = -98,
                Successfull = false,
                ValidationErrors = validationError
            };
        var result = new MyResultStatus();
        var sQuery = "[hr].[Spc_DepartmentTimeShift_Duplicate]";


        using (var conn = Connection)
        {
            conn.Open();
            result = await Connection.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.FromFiscalYearId,
                model.FromBranchId,
                model.FromDepartmentId,
                model.FromId,
                ToDepartmentTimeshiftJson = JsonConvert.SerializeObject(model.ToDepartmentTimeshiftModel),
                model.Type,
                model.CreateUserId,
                model.CreateDateTime
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            result.Successfull = result.Status == 100;
            return result;
        }
    }

    public async Task<MyResultStatus> DeleteDuplicate(int id)
    {
        var result = new MyResultStatus();
        var sQuery = "[hr].[Spc_DepartmentTimeShift_Delete]";


        using (var conn = Connection)
        {
            conn.Open();
            result = await Connection.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                Id = id
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            result.Successfull = result.Status == 100;
            return result;
        }
    }

    public async Task<MyResultStatus> InsertLine(DepartmentTimeShiftLineModel model)
    {
        var result = new MyResultStatus();
        var insertLineResult = new MyResultDataStatus<List<AttenderScheduleBlockSaveResult>>();

        if (!Extensions.NotNull(model))
            return new MyResultStatus
            {
                Successfull = false,
                Status = -100,
                StatusMessage = "مقادیر ورودی معتبر نمی باشد"
            };

        using (var conn = Connection)
        {
            var sQuery = "[hr].[Spc_DepartmentTimeShiftLine_InsUpd]";
            conn.Open();
            insertLineResult.Data = (await conn.QueryAsync<AttenderScheduleBlockSaveResult>(sQuery, new
            {
                model.Id,
                DepartmentTimeShiftId = model.HeaderId,
                StartTime=TimeSpan.Parse(model.StartTime),
                EndTime=TimeSpan.Parse(model.EndTime),
                model.DayInWeek,
                model.CreateUserId,
                model.CreateDateTime,
                model.CurrentDateTime
            }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        if (insertLineResult.Data.Any(x => x.Status == -100))
            return new MyResultStatus
            {
                Successfull = false,
                Status = -100,
                StatusMessage = "عملیات ثبت با خطا مواجه شد ، شرح خطا به جدول لاگ ارسال شد",
                Id = 0
            };

        if (insertLineResult.Data.Any(x =>
                x.Status == 100 && (!Extensions.NotNull(x.SendHistoryId) || x.SendHistoryId == Guid.Empty)))
            return new MyResultStatus
            {
                Successfull = true,
                Status = 100,
                StatusMessage = "عملیات ثبت با موفقیت انجام شد",
                Id = insertLineResult.Data.First().Id
            };

        if (model.Id > 0 && insertLineResult.Data.Any(x =>
                x.Status == 100 && Extensions.NotNull(x.SendHistoryId) && x.SendHistoryId != Guid.Empty))
        {
            var updateModel =
                (from s in insertLineResult.Data.Where(x => x.CentralId != null && x.CentralId != Guid.Empty)
                    select new UpdateRangeTimeScheduleBlock
                    {
                        CentralId = s.CentralId.Value,
                        StartTime =TimeSpan.Parse(model.StartTime),
                        EndTime =TimeSpan.Parse(model.EndTime)
                    }).ToList();

            if (Extensions.ListHasRow(updateModel))
            {
                var companyId = await _companyRepository.GetCompanyCentralId();

                var updateCentralResult =
                    await _attenderScheduleBlockServiceCentral.UpdateRangeTime(updateModel, companyId);

                if (updateCentralResult != null)
                {
                    if (updateCentralResult.HttpStatus == HttpStatusCode.Unauthorized ||
                        updateCentralResult.HttpStatus == HttpStatusCode.BadRequest ||
                        updateCentralResult.HttpStatus == HttpStatusCode.InternalServerError)
                        return new MyResultStatus
                        {
                            Successfull = false,
                            Status = (int)HttpStatusCode.Unauthorized,
                            StatusMessage = " عملیات ثبت انجام شد ولی ارسال ناموفق بود ، مجدد تلاش فرمایید"
                        };

                    if (updateCentralResult.HttpStatus == HttpStatusCode.NotAcceptable)
                    {
                        var validationError = updateCentralResult.ValidationErrors;

                        return new MyResultStatus
                        {
                            Successfull = false,
                            Status = (int)HttpStatusCode.NotAcceptable,
                            ValidationErrors = validationError
                        };
                    }

                    if (updateCentralResult.ValidationErrors == null &&
                        updateCentralResult.HttpStatus == HttpStatusCode.OK && updateCentralResult.Successfull)
                    {
                        await SendHistoryBulkUpd(insertLineResult.Data, model.CreateUserId);
                        result.Successfull = updateCentralResult.Successfull;
                        result.StatusMessage = updateCentralResult.StatusMessage;
                    }
                }
            }
            else
            {
                return new MyResultStatus
                {
                    Successfull = true,
                    Status = 100,
                    StatusMessage = "عملیات ثبت با موفقیت انجام شد",
                    Id = model.Id
                };
            }
        }

        return result;
    }

    //public async Task<MyResultDataStatus<List<ResultValidateAttenderScheduleBlock>>> DeleteLine(DepartmentTimeShiftLineDelModel model)
    //{
    //    var result = new MyResultDataStatus<List<ResultValidateAttenderScheduleBlock>>();

    //    var deleteLineResult = new MyResultDataStatus<List<DepartmentTimeShiftResult>>();
    //    var validationErr = new List<string>();
    //    var deleteCentralResult = new HttpResult<IEnumerable<ResultValidateAttenderScheduleBlock>>();

    //    if (!model.NotNull())
    //    {
    //        return new MyResultDataStatus<List<ResultValidateAttenderScheduleBlock>>()
    //        {
    //            Successfull = false,
    //            Status = -100,
    //            StatusMessage = "درخواست نامعتبر می باشد",
    //            Data = null
    //        };
    //    }

    //    var resultCentralList = await GetCentralIdList(model);
    //    string onlineDeleteIdList = resultCentralList.Data.ListHasRow() ? string.Join(',', resultCentralList.Data.Where(x => x.IsOnline && x.CentralId != null && x.CentralId != Guid.Empty).Select(z => z.CentralId)) : "";

    //    if (!onlineDeleteIdList.IsNullOrEmptyOrWhiteSpace())
    //    {
    //        deleteCentralResult = await _attenderScheduleBlockServiceCentral.Delete(onlineDeleteIdList);

    //        if (deleteCentralResult.HttpStatus == HttpStatusCode.Unauthorized)
    //        {
    //            validationErr.Add(" ارسال انجام نشد ، مجدد تلاش فرمایید");

    //            return new MyResultDataStatus<List<ResultValidateAttenderScheduleBlock>>()
    //            {
    //                Successfull = false,
    //                Status = (int)HttpStatusCode.Unauthorized,
    //                ValidationErrors = validationErr,
    //                Data = null
    //            };
    //        }
    //        else if (deleteCentralResult.HttpStatus == HttpStatusCode.NotAcceptable && deleteCentralResult.Data.Count() > 0)
    //        {
    //            var patientList = new List<ResultValidateAttenderScheduleBlock>();
    //            patientList = deleteCentralResult.Data.ToList();

    //            validationErr.Add(" نوبت دارای مراجعه کننده می باشد و امکان حذف وجود ندارد ");

    //            return new MyResultDataStatus<List<ResultValidateAttenderScheduleBlock>>()
    //            {
    //                Successfull = false,
    //                Status = (int)HttpStatusCode.NotAcceptable,
    //                ValidationErrors = validationErr,
    //                Data = patientList
    //            };
    //        }
    //        else if (deleteCentralResult.HttpStatus == HttpStatusCode.NotAcceptable && deleteCentralResult.Data == null
    //            && deleteCentralResult.ValidationErrors.Count > 0)
    //        {
    //            return new MyResultDataStatus<List<ResultValidateAttenderScheduleBlock>>()
    //            {
    //                Successfull = false,
    //                Status = (int)HttpStatusCode.NotAcceptable,
    //                ValidationErrors = deleteCentralResult.ValidationErrors,
    //                Data = null
    //            };
    //        }
    //    }

    //    string sQuery = "[hr].[Spc_DepartmentTimeShiftLine_Del]";

    //    using (IDbConnection conn = Connection)
    //    {
    //        conn.Open();
    //        deleteLineResult.Data = (await Connection.QueryAsync<DepartmentTimeShiftResult>(sQuery, new
    //        {
    //            model.Id,
    //            model.UserId,
    //            CurrentDateTime = DateTime.Now
    //        }, commandType: CommandType.StoredProcedure)).ToList();
    //        conn.Close();
    //    }

    //    if (deleteLineResult.Data.Any(x => x.Status == -100))
    //    {
    //        return new MyResultDataStatus<List<ResultValidateAttenderScheduleBlock>>()
    //        {
    //            Successfull = false,
    //            Status = -100,
    //            StatusMessage = "عملیات ثبت با خطا مواجه شد ، شرح خطا به جدول لاگ ارسال شد",
    //            Id = 0,
    //            Data = null
    //        };
    //    }

    //    else if (deleteLineResult.Data.Any(x => x.Status == 100 && !x.SendHistoryId.NotNull()))
    //    {
    //        return new MyResultDataStatus<List<ResultValidateAttenderScheduleBlock>>()
    //        {
    //            Successfull = true,
    //            Status = 100,
    //            StatusMessage = "عملیات ثبت با موفقیت انجام شد",
    //            Data = null
    //        };
    //    }

    //    if (deleteLineResult.Successfull && (deleteCentralResult != null && deleteCentralResult.ValidationErrors == null && deleteCentralResult.HttpStatus == HttpStatusCode.OK))
    //    {
    //        await SendHistoryBulkUpd(deleteLineResult.Data, model.UserId);
    //    }

    //    return result;

    //}

    public async Task<MyResultDataStatus<List<ConvertAttenderScheduleBlockFromCentral>>> DeleteLineV1(
        DepartmentTimeShiftLineDelModel model)
    {
        var resultFinal = new MyResultDataStatus<List<ConvertAttenderScheduleBlockFromCentral>>();

        if (!Extensions.NotNull(model))
            return new MyResultDataStatus<List<ConvertAttenderScheduleBlockFromCentral>>
            {
                Successfull = false,
                Status = -100,
                StatusMessage = "مقادیر ورودی معتبر نمی باشد",
                Data = null
            };


        if (await CheckDepartmentTimeShiftLineIsOnline(model.Id))
        {
            // لیست centralId ها
            var resultCentralListBulkDelete = await GetCentralIdList(model);

            if (resultCentralListBulkDelete.Data.Any(x => Extensions.NotNull(x.CentralId)))
            {
                var centralIdList = resultCentralListBulkDelete.Data.Where(x => Extensions.NotNull(x.CentralId))
                    .Select(x => x.CentralId);

                var centralIds = string.Join(',', centralIdList);

                var resultDeleteCentral = await _attenderScheduleBlockServiceCentral.Delete(centralIds);

                if (Extensions.NotNull(resultDeleteCentral))
                {
                    // field send - token / node
                    if (resultDeleteCentral.HttpStatus == HttpStatusCode.Unauthorized ||
                        resultDeleteCentral.HttpStatus == HttpStatusCode.BadRequest ||
                        resultDeleteCentral.HttpStatus == HttpStatusCode.InternalServerError)
                        return new MyResultDataStatus<List<ConvertAttenderScheduleBlockFromCentral>>
                        {
                            Successfull = false,
                            Status = -100,
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

                            // map to erp
                            var patientListMapped =
                                await _admissionsRepository.ConvertAttenderScheduleBlockFromCentral(patientList);

                            return new MyResultDataStatus<List<ConvertAttenderScheduleBlockFromCentral>>
                            {
                                Successfull = false,
                                StatusMessage =
                                    "امکان ثبت تغییرات نمی باشد ، نوبت آنلاین رزرو شده برای این شیفت درمانی به ثبت رسیده است",
                                Status = -100,
                                Data = patientListMapped
                            };
                        }

                        if (Extensions.ListHasRow(resultDeleteCentral.ValidationErrors))
                            return new MyResultDataStatus<List<ConvertAttenderScheduleBlockFromCentral>>
                            {
                                Successfull = false,
                                StatusMessage = "error",
                                Status = -100,
                                Data = null,
                                ValidationErrors = resultDeleteCentral.ValidationErrors
                            };
                    }
                    //*****
                    else if (resultDeleteCentral.HttpStatus == HttpStatusCode.OK)
                    {
                        var logModel = (from s in resultCentralListBulkDelete.Data
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

        var sQuery = "[hr].[Spc_DepartmentTimeShiftLine_Del]";

        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            conn.Open();
            result = await Connection.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.Id,
                model.UserId,
                CurrentDateTime = DateTime.Now
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = result.Status == 100;
        }


        resultFinal.Status = result.Status;
        resultFinal.Successfull = result.Successfull;
        resultFinal.StatusMessage = result.StatusMessage;
        resultFinal.Data = null;

        return resultFinal;
    }

    public async Task<MyResultPage<List<MedicalTimeShiftDisplay>>> GetCentralIdList(
        DepartmentTimeShiftLineDelModel model)
    {
        var newGetPageView = new NewGetPageViewModel();

        newGetPageView.PageNo = null;
        newGetPageView.PageRowsCount = null;

        newGetPageView.Form_KeyValue = new object[]
        {
            null,
            null,
            null,
            model.DepartmentShiftId,
            null,
            null,
            null,
            model.DayInWeek,
            null,
            DateTime.Parse(model.FromAppointmentDate),
            DateTime.Parse(model.ToAppointmentDate),
            null,
            model.FromTime,
            model.FormType
        };

        newGetPageView.Filters = new List<FormKeyValue> { new() { Name = "appointmentTypeName", Value = "1" } };

        return await _admissionsRepository.DisplayScheduleBlock(newGetPageView);
    }

    public async Task SendHistoryBulkUpd(List<AttenderScheduleBlockSaveResult> model, int userId)
    {
        var logModel = (from s in model
            select new SendHistoryViewModel
            {
                Id = s.SendHistoryId,
                CentralId = s.CentralId.ToString(),
                ObjectId = s.AttenderScheduleBlockId.ToString()
            }).ToList();

        await _sendHistoryRepository.UpdateBulk(logModel, 3, userId);
    }

    public async Task<MyResultPage<DepartmentTimeShiftLineGetRecord>> GetRecordLineById(int id)
    {
        var result = new MyResultPage<DepartmentTimeShiftLineGetRecord>
        {
            Data = new DepartmentTimeShiftLineGetRecord()
        };
        using (var conn = Connection)
        {
            var sQuery = "[hr].[Spc_DepartmentTimeShiftLine_GetRecord]";
            result.Data = await conn.QueryFirstOrDefaultAsync<DepartmentTimeShiftLineGetRecord>(sQuery, new
            {
                Id = id
            }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }

    public async Task<MyResultStatus> ChangeLockDepartmentTimeShiftLine(DepartmentTimeShiftLineDelModel model)
    {
        var result = new MyResultStatus();
        var updCentral = new HttpResult<ResultQuery>();

        if (!Extensions.NotNull(model))
            return new MyResultStatus
            {
                Successfull = false,
                Status = -100,
                StatusMessage = "مقادیر ورودی معتبر نمی باشد"
            };

        var isOnlineShift = await CheckDepartmentTimeShiftLineIsOnline(model.Id);
        if (isOnlineShift)
        {
            var resultCentralListBulkUpd = await GetCentralIdList(model);

            if (resultCentralListBulkUpd.Data.Any(x => Extensions.NotNull(x.CentralId)))
            {
                var centralIdList = resultCentralListBulkUpd.Data.Where(x => Extensions.NotNull(x.CentralId))
                    .Select(x => x.CentralId);

                var centralIds = string.Join(',', centralIdList);
                var centralModel = new ChangeLockScheduleBlock();
                centralModel.CentralIds = centralIds;
                centralModel.Locked = !model.IsLock??false;
                centralModel.LockDateTime = DateTime.Now;

                await _attenderScheduleBlockServiceCentral.ChangeLock(centralModel);

                if (updCentral.HttpStatus == HttpStatusCode.Unauthorized ||
                    updCentral.HttpStatus == HttpStatusCode.BadRequest ||
                    updCentral.HttpStatus == HttpStatusCode.InternalServerError)
                    return new MyResultStatus
                    {
                        Successfull = false,
                        Status = (int)HttpStatusCode.Unauthorized,
                        StatusMessage = "درخواست شما به درستی انجام نشد ، مجدد تلاش فرمایید"
                    };
                if (updCentral.HttpStatus == HttpStatusCode.NotAcceptable)
                    if (Extensions.ListHasRow(updCentral.ValidationErrors))
                        return new MyResultStatus
                        {
                            Successfull = false,
                            StatusMessage = "error",
                            Status = -100,
                            ValidationErrors = updCentral.ValidationErrors
                        };
            }
        }

        using (var conn = Connection)
        {
            var sQuery = "[hr].[Spc_DepartmentTimeShiftLine_ChangeLock]";
            conn.Open();
            result = await Connection.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.Id
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            result.Successfull = result.Status == 100;
            return result;
        }
    }

    private async Task<bool> CheckDepartmentTimeShiftLineIsOnline(int departmentTimeShiftLineId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AttenderScheduleBlock_CheckExistOnline_ByDepartmentTimeShiftLine]";

            conn.Open();

            var result = await conn.ExecuteScalarAsync<bool>(sQuery, new
            {
                DepartmentTimeShiftLineId = departmentTimeShiftLineId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    private async Task<bool> CheckDepartmentTimeShiftIsOnline(int departmentTimeShiftId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AttenderScheduleBlock_CheckExistOnline_ByDepartmentTimeShift]";

            conn.Open();

            var result = await conn.ExecuteScalarAsync<bool>(sQuery, new
            {
                DepartmentTimeShiftId = departmentTimeShiftId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }


    public async Task<IEnumerable<MyDropDownViewModel>> GetDropdownDepartmentShiftList(int DepartmentShiftId,
        int FiscalYearId, short BranchId, byte DayInWeek)
    {
        var result = new List<MyDropDownViewModel>();
        using (var conn = Connection)
        {
            var sQuery = "[hr].[Spc_DepartmentTimeShift_GetShiftList]";

            var parameters = new DynamicParameters();
            parameters.Add("DepartmentId", DepartmentShiftId);
            parameters.Add("FiscalYearId", FiscalYearId);
            parameters.Add("BranchId", BranchId);
            parameters.Add("DayInWeek", DayInWeek);

            conn.Open();
            result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery, parameters,
                commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }
}