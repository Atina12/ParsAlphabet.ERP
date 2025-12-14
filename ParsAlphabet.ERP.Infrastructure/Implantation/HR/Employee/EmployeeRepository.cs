using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.HR.Employee;
using ParsAlphabet.ERP.Application.Interfaces.Redis;
using ParsAlphabet.ERP.Infrastructure.Implantation.CR.PersonGroup;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.HR.Employee;

public class EmployeeRepository :
    BaseRepository<EmployeeModel, int, string>,
    IBaseRepository<EmployeeModel, int, string>
{
    private readonly PersonGroupRepository _personGroupRepository;
    private readonly IRedisService _redisService;

    public EmployeeRepository(IConfiguration config, IRedisService redisService
        , PersonGroupRepository personGroupRepository)
        : base(config)
    {
        _personGroupRepository = personGroupRepository;
        _redisService = redisService;
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
                    Id = "fullName", Title = "نام و  تخلص", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, IsFilterParameter = true, Width = 15
                },
                new()
                {
                    Id = "gender", Title = "جنسیت", Type = (int)SqlDbType.TinyInt, IsDtParameter = true,
                    IsFilterParameter = false, Width = 4
                },
                new()
                {
                    Id = "employeeGroup", Title = "گروه پرسنل", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = false, Width = 7
                },
                new()
                {
                    Id = "maritalStatusName", Title = "وضعیت تاهل", Type = (int)SqlDbType.TinyInt, IsDtParameter = true,
                    Width = 6
                },
                new()
                {
                    Id = "fatherFirstName", Title = "نام پدر", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "nationalCode", Title = "نمبر تذکره", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "mobileNo", Title = "موبایل", Type = (int)SqlDbType.VarChar, Size = 11, IsDtParameter = true,
                    IsFilterParameter = true, Width = 6
                },
                new()
                {
                    Id = "insurNo", Title = "شماره بیمه", Type = (int)SqlDbType.VarChar, Size = 16,
                    IsDtParameter = true, IsFilterParameter = true, Width = 7
                },
                new()
                {
                    Id = "insurerName", Title = "بیمه گر", Type = (int)SqlDbType.NVarChar, Size = 16,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 6,
                    Align = "center"
                },
                new()
                {
                    Id = "isDetail", Title = "تفصیل", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 5,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 13 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new()
                {
                    Name = "accountDetail", Title = "ایجاد تفصیل", ClassName = "", IconName = "fas fa-plus color-blue"
                },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" }
            }
        };

        return list;
    }

    public GetColumnsViewModel AllocationColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 5
                },
                new()
                {
                    Id = "name", Title = "نام ", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 10
                }
            }
        };

        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                GetColumns().DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };
        var getPage = await GetPage(model);
        result.Rows = from p in getPage.Data
            select new
            {
                p.Id,
                p.FullName,
                p.Gender,
                p.EmployeeGroup,
                p.MaritalStatusName,
                p.FatherFirstName,
                p.NationalCode,
                p.MobileNo,
                p.InsurNo,
                p.InsurerName,
                IsActive = p.IsActive ? "فعال" : "غیرفعال",
                IsDetail = p.IsDetail ? "دارد" : "ندارد"
            };
        return result;
    }

    public async Task<MyResultPage<List<EmployeeGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<EmployeeGetPage>>
        {
            Data = new List<EmployeeGetPage>()
        };


        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("fullName",
            model.Filters.Any(x => x.Name == "fullName")
                ? model.Filters.FirstOrDefault(x => x.Name == "fullName").Value
                : null);

        parameters.Add("nationalCode",
            model.Filters.Any(x => x.Name == "nationalCode")
                ? model.Filters.FirstOrDefault(x => x.Name == "nationalCode").Value
                : null);

        parameters.Add("mobileNo",
            model.Filters.Any(x => x.Name == "mobileNo")
                ? model.Filters.FirstOrDefault(x => x.Name == "mobileNo").Value
                : null);

        parameters.Add("insurNo",
            model.Filters.Any(x => x.Name == "insurNo")
                ? model.Filters.FirstOrDefault(x => x.Name == "insurNo").Value
                : null);


        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "hr.Spc_Employee_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<EmployeeGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        return result;
    }

    public async Task<MyResultPage<EmployeeGetRecordForm>> GetRecordById(int id, int companyId)
    {
        var result = new MyResultPage<EmployeeGetRecordForm>();
        result.Data = new EmployeeGetRecordForm();
        var employee = new EmployeeGetRecord();

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            conn.Open();
            employee = await conn.QueryFirstOrDefaultAsync<EmployeeGetRecord>(sQuery, new
            {
                TableName = "hr.Employee",
                Filter = $"Id={id} AND CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);
        }

        result.Data.Id = employee.Id;
        result.Data.MaritalStatusIdEm = employee.MaritalStatusId;
        result.Data.FirstNameEm = employee.FirstName;
        result.Data.FatherFirstNameEm = employee.FatherFirstName;
        result.Data.LastNameEm = employee.LastName;
        result.Data.GenderIdEm = employee.GenderId;
        result.Data.NationalCodeEm = employee.NationalCode;
        result.Data.LocCountryIdEm = employee.LocCountryId;
        result.Data.LocStateIdEm = employee.LocStateId;
        result.Data.LocCityIdEm = employee.LocCityId;
        result.Data.PostalCodeEm = employee.PostalCode;
        result.Data.AddressEm = employee.Address;
        result.Data.PhoneNoEm = employee.PhoneNo;
        result.Data.MobileNoEm = employee.MobileNo;
        result.Data.EmailEm = employee.Email;
        result.Data.IdDateEm = employee.IdDate;
        result.Data.IsActiveEm = employee.IsActive;
        result.Data.InsurNoEm = employee.InsurNo;
        result.Data.InsurerIdEm = employee.InsurerId;
        result.Data.PersonGroupId = employee.PersonGroupId;

        #region accountDetailEmployeeList

        var accountDetailViewModel = new
        {
            FullName = employee.FullName != "" || employee.FullName != null ? employee.FullName : "",
            NationalCode = employee.NationalCode != null ? employee.NationalCode : "",
            employee.PersonGroupId,
            PersonGroupName = employee.PersonGroupId > 0
                ? await _personGroupRepository.PersonGroup_GetName(employee.PersonGroupId)
                : ""
        };
        result.Data.JsonAccountDetailList = JsonConvert.SerializeObject(accountDetailViewModel);

        #endregion

        return result;
    }

    public async Task<MyResultQuery> Insert(SaveEmployee model)
    {
        var result = new MyResultQuery();


        #region accountDetailEmployeeList

        var FullName = model.FirstNameEm + "" + model.LastNameEm;
        var accountDetailViewModel = new
        {
            FullName = FullName != "" || FullName != null ? FullName : "",
            NationalCode = model.NationalCodeEm != null ? model.NationalCodeEm : "",
            model.PersonGroupId,
            PersonGroupName = model.PersonGroupId > 0
                ? await _personGroupRepository.PersonGroup_GetName(model.PersonGroupId)
                : ""
        };

        #endregion

        using (var conn = Connection)
        {
            var sQuery = "hr.Spc_Employee_InsUpd";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Ins",
                Id = 0,
                MaritalStatusId = model.MaritalStatusIdEm,
                FatherFirstName = model.FatherFirstNameEm,
                FirstName = model.FirstNameEm,
                LastName = model.LastNameEm,
                GenderId = model.GenderIdEm,
                NationalCode = model.NationalCodeEm,
                LocCountryId = model.LocCountryIdEm,
                LocStateId = model.LocStateIdEm,
                LocCityId = model.LocCityIdEm,
                PostalCode = model.PostalCodeEm,
                Address = model.AddressEm,
                PhoneNo = model.PhoneNoEm,
                MobileNo = model.MobileNoEm,
                Email = model.EmailEm,
                IdDate = model.IdDateEm,
                IsActive = model.IsActiveEm,
                model.PersonGroupId,
                model.CompanyId,
                InsurNo = model.InsurNoEm,
                InsurerId = model.InsurerIdEm,
                AccountDetailEmployeeJson = JsonConvert.SerializeObject(accountDetailViewModel)
            }, commandType: CommandType.StoredProcedure);
        }


        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultQuery> Update(SaveEmployee model)
    {
        var result = new MyResultQuery();

        #region accountDetailEmployeeList

        var FullName = model.FirstNameEm + "" + model.LastNameEm;
        var accountDetailViewModel = new
        {
            FullName = FullName != "" || FullName != null ? FullName : "",
            NationalCode = model.NationalCodeEm != null ? model.NationalCodeEm : "",
            model.PersonGroupId,
            PersonGroupName = model.PersonGroupId > 0
                ? await _personGroupRepository.PersonGroup_GetName(model.PersonGroupId)
                : ""
        };

        #endregion

        using (var conn = Connection)
        {
            var sQuery = "hr.Spc_Employee_InsUpd";
            conn.Open();

            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Upd",
                model.Id,
                MaritalStatusId = model.MaritalStatusIdEm,
                FatherFirstName = model.FatherFirstNameEm,
                FirstName = model.FirstNameEm,
                LastName = model.LastNameEm,
                GenderId = model.GenderIdEm,
                NationalCode = model.NationalCodeEm,
                LocCountryId = model.LocCountryIdEm,
                LocStateId = model.LocStateIdEm,
                LocCityId = model.LocCityIdEm,
                PostalCode = model.PostalCodeEm,
                Address = model.AddressEm,
                PhoneNo = model.PhoneNoEm,
                MobileNo = model.MobileNoEm,
                Email = model.EmailEm,
                IdDate = model.IdDateEm,
                IsActive = model.IsActiveEm,
                model.PersonGroupId,
                model.CompanyId,
                InsurNo = model.InsurNoEm,
                InsurerId = model.InsurerIdEm,
                AccountDetailEmployeeJson = JsonConvert.SerializeObject(accountDetailViewModel)
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultQuery> Delete(int keyvalue, int companyId)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecord";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                TableName = "hr.Employee",
                RecordId = keyvalue,
                Filter = $"CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(string term, int companyId)
    {
        var filter = string.Empty;

        if (term != null && term.Trim().Length != 0)
            filter =
                $" CompanyId={companyId} AND (Id='{(int.TryParse(term, out _) ? term : "0")}' OR FullName Like N'%{term.ConvertArabicAlphabet()}%') AND IsActive = 1";
        else
            filter = $" CompanyId={companyId} AND IsActive = 1 ";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "hr.Employee",
                    IdColumnName = "",
                    TitleColumnName = "FullName",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetAllDataDropDown(string term, int companyId)
    {
        var filter = string.Empty;

        if (term != null && term.Trim().Length != 0)
            filter =
                $" CompanyId={companyId} AND (Id='{(int.TryParse(term, out _) ? term : "0")}' OR FullName Like N'%{term.ConvertArabicAlphabet()}%')";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "hr.Employee",
                    IdColumnName = "",
                    TitleColumnName = "FullName",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetDropDownByGroupId(string groupIds)
    {
        var filter = string.Empty;

        if (!groupIds.IsNullOrEmptyOrWhiteSpace() && groupIds != "null")
            filter = $"PersonGroupId IN({groupIds})";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "hr.Employee",
                    IdColumnName = "",
                    TitleColumnName = "FullName",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<string> GetEmployeeName(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "hr.Employee",
                    ColumnName = "FullName",
                    Filter = $"Id={id} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<bool> ExistNationalCode(MyDropDownViewModel model)
    {
        var filter = "";

        if (model.Id == 0)
            filter = $"NationalCode='{model.Name}' AND CompanyId={model.CompanyId}";
        else
            filter = $"NationalCode='{model.Name}' AND (Id<>{model.Id}) AND CompanyId={model.CompanyId}";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "hr.Employee",
                    ColumnName = "NationalCode",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);

            return string.IsNullOrEmpty(result);
        }
    }

    public async Task<List<MyDropDownViewModel>> EducationLevel_GetDropDown()
    {
        var cache = new List<MyDropDownViewModel>();

        try
        {
            cache = _redisService.GetData<List<MyDropDownViewModel>>("EducationLevelCIS");

            if (cache.ListHasRow())
                return cache;

            cache = await GetDataEducationLevelDropDown();

            var expirationTime = DateTimeOffset.Now.AddHours(10.0);
            _redisService.SetData("EducationLevelCIS", cache, expirationTime);
        }
        catch (Exception)
        {
            cache = await GetDataEducationLevelDropDown();
        }

        return cache;
    }

    public async Task<List<MyDropDownViewModel>> GetDataEducationLevelDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "hr.EducationLevel"
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }
}