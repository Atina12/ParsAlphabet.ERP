using System.Collections;
using System.Data;
using System.Net;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.Central.ObjectModel.MedicalCare;
using ParsAlphabet.ERP.Application.Dtos.MC.Attender;
using ParsAlphabet.ERP.Application.Interfaces.Redis;
using ParsAlphabet.ERP.Application.Interfaces.WebServices.Central;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.SendHistory;
using ParsAlphabet.ERP.Infrastructure.Implantation.HR.OrganizationalDepartment;
using ParsAlphabet.ERP.Infrastructure.Implantation.PB;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.Attender;

public class AttenderRepository :
    BaseRepository<AttenderModel, int, string>,
    IBaseRepository<AttenderModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;
    private readonly IAttenderServiceCentral _centralAttenderService;
    private readonly ManageRedisRepository _manageRedisRepository;
    private readonly IMapper _mapper;
    private readonly OrganizationalDepartmentRepository _organizationalDepartmentRepository;
    private readonly IRedisService _redisService;
    private readonly SendHistoryRepository _sendHistoryRepository;

    public AttenderRepository(IRedisService redisService, IConfiguration config,
        IHttpContextAccessor accessor,
        OrganizationalDepartmentRepository organizationalDepartmentRepository,
        ManageRedisRepository manageRedisRepository,
        IAttenderServiceCentral centralAttenderService,
        SendHistoryRepository sendHistoryRepository,
        IMapper mapper
    ) : base(config)
    {
        _accessor = accessor;
        _redisService = redisService;
        _organizationalDepartmentRepository = organizationalDepartmentRepository;
        _manageRedisRepository = manageRedisRepository;
        _centralAttenderService = centralAttenderService;
        _sendHistoryRepository = sendHistoryRepository;
        _mapper = mapper;
    }

    public GetColumnsViewModel GetColumns(string formType = "attender")
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 4
                },
                new()
                {
                    Id = "fullName", Title = "نام طبیب", IsPrimary = true, Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10
                },
                new() { Id = "departmentId", IsPrimary = true },
                new()
                {
                    Id = "gender", Title = "جنسیت", Type = (int)SqlDbType.VarChar, Size = 30, IsDtParameter = true,
                    IsFilterParameter = true, Width = 4, FilterType = "select2static",
                    FilterItems = new List<MyDropDownViewModel2>
                    {
                        new() { Id = "0", Name = "انتخاب کنید..." }, new() { Id = "1", Name = "مرد" },
                        new() { Id = "2", Name = "زن" }
                    }
                },

                new()
                {
                    Id = "fatherName", Title = "نام پدر", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, Width = 4
                },
                new()
                {
                    Id = "birthDatePersian", Title = "تاریخ تولد", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "nationalCode", Title = "نمبر تذکره", IsPrimary = true, Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "department", IsPrimary = true, Title = "دپارتمان", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 6, FilterType = "select2",
                    FilterTypeApi = "Api/HR/OrganizationalDepartmentApi/getdropdown"
                },
                new()
                {
                    Id = "speciality", Title = "تخصص", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 12, FilterType = "select2ajax",
                    FilterTypeApi = "Api/MC/SpecialityApi/getdropdown"
                },
                new()
                {
                    Id = "msc", Title = "نظام پزشکی", Type = (int)SqlDbType.NVarChar, Size = 10, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "strnumber", Width = 5
                },
                new()
                {
                    Id = "mscExpDatePersian", Title = "اعتبار نظام پزشکی", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "mobileNo", Title = "شماره موبایل", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "strnumber", Width = 6
                },
                new()
                {
                    Id = "phoneNo", Title = "شماره تلفن", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "strnumber", Width = 6
                },
                new() { Id = "attenderTaxPer", Title = "مالیات", IsDtParameter = true, Width = 5, Align = "center" },
                new()
                {
                    Id = "acceptableParaClinic", Title = "نسخه پیچی پاراکلینیک", Type = (int)SqlDbType.Bit,
                    IsDtParameter = true, Width = 5, Align = "center"
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 5,
                    Align = "center"
                },
                new()
                {
                    Id = "isDetail", Title = "تفصیل", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 3,
                    Align = "center"
                },
                new()
                {
                    Id = "sendResult", Title = "وضعیت ارسال", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 5
                },
                new()
                {
                    Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    FixedColumn = true, Width = 5
                }
            }
        };

        if (formType == "attender")
        {
            list.Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", IconName = "fa fa-edit color-green" },
                new() { Name = "delete", Title = "حذف", IconName = "fa fa-trash color-maroon" },
                new() { Name = "sep1", IsSeparator = true },
                new() { Name = "sendToCentral", Title = "ارسال مرکزی", IconName = "fa fa-paper-plane color-blue" },
                new() { Name = "accountDetail", Title = "ایجاد تفصیل", IconName = "fas fa-plus color-blue" }
            };
        }
        else if (formType == "attenderassistant")
        {
            list.ActionType = "inline";
            list.Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "assistant", Title = "دستیار سکرتر ", ClassName = "btn blue_outline_2 ml-1",
                    IconName = "fa fa-stethoscope"
                }
            };
        }
        else if (formType == "attendershift")
        {
            list.ActionType = "inline";
            list.Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "setShift", Title = "تخصیص شیفت", ClassName = "btn blue_outline_2 ml-1",
                    IconName = "fa fa-stethoscope"
                }
            };
        }
        else if (formType == "attendertimesheet")
        {
            list.ActionType = "inline";
            list.Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "attenderTimeSheetAssign", Title = "تخصیص  شیفت", ClassName = "btn blue_outline_1",
                    IconName = "fa fa-list"
                }
            };
        }
        else
        {
            list.Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "attenderServiceList", Title = "نمایش خدمات", IconName = "fa fa-list" },
                new() { Name = "commissionservice", Title = "تخصیص خدمات", IconName = "fa fa-stethoscope" },
                new() { Name = "sep1", IsSeparator = true },
                new() { Name = "sendToCentral", Title = "ارسال مرکزی", IconName = "fa fa-paper-plane color-blue" }
            };
        }

        return list;
    }


    public async Task<MyResultPage<List<AttenderGetPage>>> GetPage(NewGetPageViewModel model, string formType)
    {
        var result = new MyResultPage<List<AttenderGetPage>>
        {
            Data = new List<AttenderGetPage>()
        };

        MyClaim.Init(_accessor);

        var parameters = new DynamicParameters();

        parameters.Add("IsSecondLang", MyClaim.IsSecondLang);
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("FullName",
            model.Filters.Any(x => x.Name == "fullName")
                ? model.Filters.FirstOrDefault(x => x.Name == "fullName").Value
                : null);
        parameters.Add("GenderId",
            model.Filters.Any(x => x.Name == "gender")
                ? model.Filters.FirstOrDefault(x => x.Name == "gender").Value
                : null);
        parameters.Add("MSC",
            model.Filters.Any(x => x.Name == "msc") ? model.Filters.FirstOrDefault(x => x.Name == "msc").Value : null);
        parameters.Add("FatherName",
            model.Filters.Any(x => x.Name == "fatherName")
                ? model.Filters.FirstOrDefault(x => x.Name == "fatherName").Value
                : null);
        parameters.Add("MobileNo",
            model.Filters.Any(x => x.Name == "mobileNo")
                ? model.Filters.FirstOrDefault(x => x.Name == "mobileNo").Value
                : null);
        parameters.Add("PhoneNo",
            model.Filters.Any(x => x.Name == "phoneNo")
                ? model.Filters.FirstOrDefault(x => x.Name == "phoneNo").Value
                : null);
        parameters.Add("SpecialityId",
            model.Filters.Any(x => x.Name == "speciality")
                ? model.Filters.FirstOrDefault(x => x.Name == "speciality").Value
                : null);
        parameters.Add("DepartmentId",
            model.Filters.Any(x => x.Name == "department")
                ? model.Filters.FirstOrDefault(x => x.Name == "department").Value
                : null);

        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);


        result.Columns = GetColumns(formType);

        var sQuery = "mc.Spc_Attender_GetPage";

        using (var conn = Connection)
        {
            conn.Open();
            result.Data =
                (await Connection.QueryAsync<AttenderGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public GetColumnsViewModel GetAdmissionAttenderScheduleColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "attender", Title = "نام طبیب", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "msc", Title = "نظام پزشکی", Type = (int)SqlDbType.VarChar, Size = 30, IsDtParameter = true,
                    IsFilterParameter = true, Width = 5
                },
                new() { Id = "departmentId", IsPrimary = true },
                new()
                {
                    Id = "department", Title = "دپارتمان", Type = (int)SqlDbType.NVarChar, Size = 20,
                    IsDtParameter = true, Width = 10, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/HR/OrganizationalDepartmentApi/getdropdown"
                },
                new()
                {
                    Id = "specialityName", Title = "تخصص", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, Width = 12
                },
                new()
                {
                    Id = "shiftName", Title = "شیفت کاری", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, HasDetail = true, Width = 10, IsFilterParameter = true
                },
                new()
                {
                    Id = "startTime", Title = "زمان شروع", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, HasDetail = true, Width = 5
                },
                new()
                {
                    Id = "endTime", Title = "زمان پایان", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, HasDetail = true, Width = 5
                },
                new()
                {
                    Id = "numberOnlineAppointment", Title = "تعداد نوبت آنلاین", Type = (int)SqlDbType.VarChar,
                    Size = 10, IsDtParameter = true, HasDetail = true, Width = 5
                },
                new()
                {
                    Id = "numberOfflineAppointment", Title = "تعداد نوبت آفلاین", Type = (int)SqlDbType.NVarChar,
                    Size = 50, IsDtParameter = true, HasDetail = true, Width = 5
                },
                new()
                {
                    Id = "requestAdmission", Title = "درخواست پذیرش", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, HasDetail = true, Width = 6
                },
                new()
                {
                    Id = "returnAdmission", Title = "درخواست مرجوع پذیرش", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, HasDetail = true, Width = 6
                },
                new()
                {
                    Id = "enterToRoom", Title = "ورود به اتاق", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, HasDetail = true, Width = 5
                },
                new()
                {
                    Id = "remain", Title = "نوبت آزاد", Type = (int)SqlDbType.NVarChar, Size = 10, IsDtParameter = true,
                    HasDetail = true, Width = 5
                }
            }
        };

        return list;
    }

    public async Task<MyResultPage<List<AdmissionAttenderScheduleGetPage>>> GetAdmissionAttenderSchedulePage(
        NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<AdmissionAttenderScheduleGetPage>>
        {
            Data = new List<AdmissionAttenderScheduleGetPage>()
        };

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("ReserveDate", model.Form_KeyValue[0]?.ToString());
        parameters.Add("DepartmentId",
            model.Filters.Any(x => x.Name == "department")
                ? model.Filters.FirstOrDefault(x => x.Name == "department").Value
                : null);
        parameters.Add("ShiftName",
            model.Filters.Any(x => x.Name == "shiftName")
                ? model.Filters.FirstOrDefault(x => x.Name == "shiftName").Value
                : null);
        parameters.Add("AttenderId",
            model.Filters.Any(x => x.Name == "attenderId")
                ? model.Filters.FirstOrDefault(x => x.Name == "attenderId").Value
                : null);
        parameters.Add("AttenderName",
            model.Filters.Any(x => x.Name == "attenderName")
                ? model.Filters.FirstOrDefault(x => x.Name == "attenderName").Value
                : null);
        parameters.Add("MSC",
            model.Filters.Any(x => x.Name == "msc") ? model.Filters.FirstOrDefault(x => x.Name == "msc").Value : null);
        parameters.Add("SpecialityName",
            model.Filters.Any(x => x.Name == "specialityName")
                ? model.Filters.FirstOrDefault(x => x.Name == "specialityName").Value
                : null);

        result.Columns = GetAdmissionAttenderScheduleColumns();

        var sQuery = "mc.Spc_Admission_AttenderSchedule_GetPage";

        using (var conn = Connection)
        {
            conn.Open();
            var resultScheduleBlock =
                await Connection.QueryAsync<AdmissionAttenderScheduleGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Data = resultScheduleBlock.AsList();
        }

        return result;
    }

    public GetColumnsViewModel GetCsvColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 4
                },
                new()
                {
                    Id = "fullName", Title = "نام طبیب", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsFilterParameter = true, IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "gender", Title = "جنسیت", Type = (int)SqlDbType.VarChar, Size = 30, IsDtParameter = true,
                    Width = 4
                },
                new()
                {
                    Id = "fatherName", Title = "نام پدر", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, Width = 5
                },
                new()
                {
                    Id = "birthDatePersian", Title = "تاریخ تولد", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "mobileNo", Title = "شماره موبایل", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, Width = 6
                },
                new()
                {
                    Id = "phoneNo", Title = "شماره تلفن", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, Width = 6
                },
                new()
                {
                    Id = "idNumber", Title = "شماره شناسنامه", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, Width = 5
                },
                new()
                {
                    Id = "nationalCode", Title = "نمبر تذکره", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, Width = 5
                },
                new()
                {
                    Id = "serviceCenter", Title = "دپارتمان", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 6
                },
                new()
                {
                    Id = "speciality", Title = "تخصص", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 6
                },
                new()
                {
                    Id = "role", Title = "نقش", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 6
                },
                new()
                {
                    Id = "msc", Title = "نظام پزشکی", Type = (int)SqlDbType.NVarChar, Size = 10, IsDtParameter = true,
                    IsFilterParameter = true, Width = 5
                },
                new()
                {
                    Id = "mscTypeName", Title = "نوع نظام پزشکی", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "msC_ExpDatePersian", Title = "اعتبار نظام پزشکی", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 6
                },
                new() { Id = "attenderTaxPer", Title = "مالیات", IsDtParameter = true, Width = 5, Align = "center" },
                new()
                {
                    Id = "locStateName", Title = "ولایت", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 5, Align = "center"
                },
                new()
                {
                    Id = "locCityName", Title = "شهر", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 5,
                    Align = "center"
                },
                new()
                {
                    Id = "Address", Title = "آدرس", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 5,
                    Align = "center"
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 5,
                    Align = "center"
                },
                new()
                {
                    Id = "isDetail", Title = "تفصیل", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 5,
                    Align = "center"
                },
                new()
                {
                    Id = "acceptableParaClinic", Title = "نسخه پیچی", Type = (int)SqlDbType.Bit, IsDtParameter = true,
                    Width = 5, Align = "center"
                }
            }
        };

        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model, string formType)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                GetCsvColumns().DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };

        var getPage = await GetPage(model, formType);
        result.Rows = from p in getPage.Data
            select new
            {
                p.Id,
                p.FullName,
                p.Gender,
                p.FatherName,
                p.BirthDatePersian,
                p.MobileNo,
                p.PhoneNo,
                p.IdNumber,
                p.NationalCode,
                p.Department,
                p.Speciality,
                p.Role,
                p.MSC,
                p.MSCTypeName,
                p.MscExpDatePersian,
                p.AttenderTaxPer,
                p.LocStateName,
                p.LocCityName,
                p.Address,
                IsActive = p.IsActive ? "فعال" : "غیرفعال",
                IsDetail = p.IsDetail ? "دارد" : "ندارد",
                AcceptableParaClinic = p.AcceptableParaClinic ? "دارد" : "ندارد",
                SendResult = p.CentralId != 0 ? "ارسال شده" : "ارسال نشده"
            };
        return result;
    }

    public async Task<MyResultStatus> Insert(AttenderModel model)
    {
        try
        {
            var result = new MyResultStatus();

            #region accountDetailAttenderList

            var accountDetailViewModel = new
            {
                model.IdNumber,
                NationalCode = model.NationalCode != null ? model.NationalCode : "",
                model.DepartmentId,
                ServiceCenterName = model.DepartmentId > 0
                    ? await _organizationalDepartmentRepository.GetDepartmentName(model.DepartmentId)
                    : ""
            };

            #endregion

            var sQuery = "mc.Spc_Attender_InsUpd";
            using (var conn = Connection)
            {
                conn.Open();
                result = await Connection.QueryFirstAsync<MyResultStatus>(sQuery, new
                {
                    Opr = "Ins",
                    Id = 0,
                    CentralId = model.CentralId == 0 ? null : model.CentralId,
                    FirstName = model.FirstName.ConvertArabicAlphabet(),
                    LastName = model.LastName.ConvertArabicAlphabet(),
                    model.GenderId,
                    model.NationalCode,
                    model.MSC,
                   // MSCTypeId = model.MSC_TypeId,
                    model.MSC_ExpDate,
                    model.DepartmentId,
                    model.AttenderTaxPer,
                    model.SpecialityId,
                    model.RoleId,
                    model.IsActive,
                    FatherName = model.FatherName.ConvertArabicAlphabet(),
                    model.MobileNo,
                    model.PhoneNo,
                    model.IdNumber,
                    model.BirthDate,
                    model.Address,
                    model.LocCityId,
                    model.LocStateId,
                    model.CompanyId,
                    model.PrescriptionTypeId,
                    AccetableParaclinicType = model.AcceptableParaclinic,
                    model.ContractType,
                    AccountDetailAttender = JsonConvert.SerializeObject(accountDetailViewModel),
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
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public async Task<MyResultStatus> Update(AttenderModel model)
    {
        var result = new MyResultStatus();

        #region accountDetailAttenderList

        var FullName = model.FirstName + " " + model.LastName;
        var accountDetailViewModel = new
        {
            model.IdNumber,
            FullName = FullName != "" || FullName != null ? FullName : "",
            NationalCode = model.NationalCode != null ? model.NationalCode : "",
            model.DepartmentId,
            ServiceCenterName = model.DepartmentId > 0
                ? await _organizationalDepartmentRepository.GetDepartmentName(model.DepartmentId)
                : ""
        };

        #endregion

        var sQuery = "mc.Spc_Attender_InsUpd";
        using (var conn = Connection)
        {
            conn.Open();
            result = await Connection.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                Opr = "Upd",
                model.Id,
                CentralId = model.CentralId == 0 ? null : model.CentralId,
                FirstName = model.FirstName.ConvertArabicAlphabet(),
                LastName = model.LastName.ConvertArabicAlphabet(),
                model.GenderId,
                model.NationalCode,
                model.MSC,
                MSCTypeId = model.MSC_TypeId,
                model.MSC_ExpDate,
                model.DepartmentId,
                model.AttenderTaxPer,
                model.SpecialityId,
                model.RoleId,
                model.IsActive,
                FatherName = model.FatherName.ConvertArabicAlphabet(),
                model.MobileNo,
                model.PhoneNo,
                model.IdNumber,
                model.BirthDate,
                model.Address,
                model.LocCityId,
                model.LocStateId,
                model.CompanyId,
                model.PrescriptionTypeId,
                AccetableParaclinicType = model.AcceptableParaclinic,
                model.ContractType,
                AccountDetailAttender = JsonConvert.SerializeObject(accountDetailViewModel),
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

    public async Task<MyResultStatus> SendCentralAttender(int id, int userId)
    {
        var centralModel = new CentralAttender();
        var result = new MyResultStatus();
        var model = await _sendHistoryRepository.AttenderSendHistoryGetRecord(id);

        if (!model.NotNull())
            return new MyResultStatus
            {
                Successfull = false,
                StatusMessage = "موردی برای ارسال وجود ندارد"
            };

        centralModel = _mapper.Map<AttenderSendHistoryGetRecord, CentralAttender>(model);


        var sendResult = await _centralAttenderService.AttenderCentral(centralModel);

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

    public async Task<MyResultQuery> Delete(int keyvalue, int companyId)
    {
        var result = await Delete(keyvalue, "mc", companyId);
        if (result.Successfull)
        {
            await _manageRedisRepository.UpDatedropDownCacheByType(DropDownCache.Attender);
            await _manageRedisRepository.UpDatedropDownCacheByType(DropDownCache.AttenderParaClinic);
        }

        return result;
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(string term, int companyId, byte? isActive)
    {
        var filter = "";
        if (isActive != 2)
            filter += $"IsActive = {(isActive == 1 ? 1 : 0)} AND ";

        var sQuery = "pb.Spc_Tables_GetList";
        using (var conn = Connection)
        {
            conn.Open();
            var result = await Connection.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.Attender",
                    TitleColumnName = "FullName+' / '+ ISNULL(MSC,'')",
                    Filter = filter +
                             $"CompanyId={companyId} AND ( Id='{(int.TryParse(term, out _) ? term : "0")}' OR FullName Like N'%{term.ConvertArabicAlphabet()}%' )",
                    OrderBy = "FullName"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetAttenderBookingDropDown(short branchId)
    {
        var cacheAttender = new List<AttenderDropDownList>();

        var result = new List<MyDropDownViewModel>();

        try
        {
            var cacheName = GetDropDownCacheName(DropDownCache.Attender);
            cacheAttender = _redisService.GetData<List<AttenderDropDownList>>(cacheName);

            if (cacheAttender.NotNull())
            {
                result = cacheAttender.Where(a => a.BranchId == branchId).Select(x => new MyDropDownViewModel
                {
                    Id = x.Id,
                    Name = x.Name
                }).ToList();

                return result;
            }

            cacheAttender = await GetDataAttenderAdmissionServiceBooking(DropDownCache.Attender);

            var expirationTime = DateTimeOffset.Now.AddHours(10.0);
            _redisService.SetData(cacheName, cacheAttender, expirationTime);
        }
        catch (Exception)
        {
            cacheAttender = await GetDataAttenderAdmissionServiceBooking(DropDownCache.Attender);
        }

        result = cacheAttender?.Where(a => a.BranchId == branchId).Select(x => new MyDropDownViewModel
        {
            Id = x.Id,
            Name = x.Name
        }).ToList();

        return result;
    }

    public async Task<List<AttenderDropDownList>> GetDataAttenderAdmissionServiceBooking(DropDownCache dropDownCache)
    {
        var sQuery = "[mc].[Spc_DropDownCache_GetList]";
        using (var conn = Connection)
        {
            conn.Open();
            var result = await Connection.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    DropDownCache = dropDownCache,
                    CurrentDate = DateTime.Now
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            var list = JsonConvert.DeserializeObject<List<AttenderDropDownList>>(result);

            return list;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetAttenderBookingParaClinicDropDown(short branchId)
    {
        var cacheAttender = new List<AttenderDropDownList>();
        var cacheName = GetDropDownCacheName(DropDownCache.AttenderParaClinic);
        var result = new List<MyDropDownViewModel>();

        try
        {
            cacheAttender = _redisService.GetData<List<AttenderDropDownList>>(cacheName);

            if (cacheAttender.NotNull())
            {
                result = cacheAttender.Where(a => a.BranchId == branchId).Select(x => new MyDropDownViewModel
                {
                    Id = x.Id,
                    Name = x.Name
                }).ToList();

                return result;
            }

            var expirationTime = DateTimeOffset.Now.AddHours(10.0);
            cacheAttender = await GetDataAttenderAdmissionServiceBooking(DropDownCache.AttenderParaClinic);
            _redisService.SetData(cacheName, cacheAttender, expirationTime);
        }
        catch (Exception)
        {
            cacheAttender = await GetDataAttenderAdmissionServiceBooking(DropDownCache.AttenderParaClinic);
        }

        result = cacheAttender.Where(a => a.BranchId == branchId).Select(x => new MyDropDownViewModel
        {
            Id = x.Id,
            Name = x.Name
        }).ToList();

        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetAttenderList(string ids, int CompanyId)
    {
        if (string.IsNullOrEmpty(ids))
        {
            var list = new List<MyDropDownViewModel>();
            return list;
        }

        var idList = ids.Split(',').Select(short.Parse).ToArray();
        var sQuery = "pb.Spc_Tables_GetList";
        var result = new List<MyDropDownViewModel>();
        using (var conn = Connection)
        {
            conn.Open();
            result = (await Connection.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.Attender",
                    TitleColumnName = "FullName",
                    Filter = $"CompanyId={CompanyId} AND Id IN  ({string.Join(',', idList)})"
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetAttenderListByDepartmentIds(string departmentIds)
    {
        var filter = "0";
        if (string.IsNullOrEmpty(departmentIds))
        {
            var list = new List<MyDropDownViewModel>();
            return list;
        }

        if (departmentIds != "null")
        {
            var departmentIdList = departmentIds.Split(',').Select(short.Parse).ToArray();
            filter = string.Join(',', departmentIdList);
        }


        var sQuery = "pb.Spc_Tables_GetList";
        var result = new List<MyDropDownViewModel>();
        using (var conn = Connection)
        {
            conn.Open();
            result = (await Connection.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.Attender",
                    TitleColumnName = "FullName",
                    Filter = $" DepartmentId IN  ({filter})"
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<bool> GetNationalCode(CheckAttenderNationalCode model)
    {
        var filter = "";
        var result = "";
        if (model.Id == 0)
            filter = $"NationalCode='{model.NationalCode}' AND CompanyId={model.CompanyId}";
        else
            filter = $"NationalCode='{model.NationalCode}' AND ( Id<>{model.Id}) AND CompanyId={model.CompanyId}";

        var sQuery = "pb.Spc_Tables_GetItem";
        using (var conn = Connection)
        {
            conn.Open();
            result = await Connection.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "mc.Attender",
                    ColumnName = "NationalCode",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        return result == null ? true : false;
    }

    public async Task<MyDropDownViewModel> GetAttenderMsc(int id, int CompanyId)
    {
        var sQuery = "pb.Spc_Tables_GetList";
        using var conn = Connection;
        conn.Open();
        var result = await Connection.QueryFirstOrDefaultAsync<MyDropDownViewModel>(sQuery,
            new
            {
                TableName = "mc.Attender",
                IdColumnName = "MSC_TypeId",
                TitleColumnName = "MSC",
                Filter = $"Id={id} AND CompanyId={CompanyId}"
            }, commandType: CommandType.StoredProcedure);
        conn.Close();

        return result;
    }

    public async Task<List<AttenderAdmissionDropDown>> GetAttenderAdmissionDropdown(GetAttenderAdmissionDropDown model)
    {
        var sQuery = "[mc].[Spc_Attender_AdmissionService_GetList]";
        var result = new List<AttenderAdmissionDropDown>();
        using (var conn = Connection)
        {
            conn.Open();
            result = (await Connection.QueryAsync<AttenderAdmissionDropDown>(sQuery,
                new
                {
                    model.FromReserveDate,
                    model.ToReserveDate,
                    model.CompanyId,
                    model.AttenderId,
                    model.AttenderName,
                    model.MSC
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDownPrescriptionType()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            MyClaim.Init(_accessor);

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    TableName = "mc.PrescriptionType"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetDropDownAttenderByAcceptableParaclinic(int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.Attender",
                    IdColumnName = "Id",
                    TitleColumnName = "FullName+' / '+ISNULL(MSC,'')",
                    Filter = $"AcceptableParaclinic = 1 AND CompanyId={companyId} AND IsActive=1"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<AttenderViewModel> GetAttenderId(GetAttenderViewModel model)
    {
        var result = new AttenderViewModel();
        var parameters = new DynamicParameters();
        var filter = string.Empty;

        var attenderId = 0;
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_NextPrev]";
            conn.Open();

            if (model.directPaging > 0)
            {
                parameters.Add("TableName", "mc.Attender");
                parameters.Add("IdColumnName", "Id");
                parameters.Add("IdColumnValue", model.AttenderId);
                parameters.Add("FilterParam", filter);
                parameters.Add("Direction", model.directPaging);
                attenderId =
                    await conn.ExecuteScalarAsync<int>(sQuery, parameters, commandType: CommandType.StoredProcedure);
            }

            var filterAttenderId = model.directPaging > 0 ? attenderId : model.AttenderId;


            if (filterAttenderId > 0)
            {
                var sQuery1 = "[mc].[Spc_AttenderDepartment_GeRecord]";
                result = await conn.QueryFirstOrDefaultAsync<AttenderViewModel>(sQuery1,
                    new
                    {
                        AttenderId = filterAttenderId
                    }, commandType: CommandType.StoredProcedure);

                conn.Close();
            }
        }

        return result;
    }
}