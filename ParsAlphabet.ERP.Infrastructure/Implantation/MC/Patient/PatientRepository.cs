using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.Patient;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.Patient;

public class PatientRepository :
    BaseRepository<PatientModel, int, string>,
    IBaseRepository<PatientModel, int, string>
{
    public PatientRepository(IConfiguration config) : base(config)
    {
    }

    public new GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 5
                },
                new()
                {
                    Id = "fullName", Title = "نام و  تخلص", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, IsFilterParameter = true, Width = 15
                },
                new()
                {
                    Id = "gender", Title = "جنسیت", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "countryName", Title = "تابعیت", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 7
                },
                new()
                {
                    Id = "nationalCode", Title = "نمبر تذکره", Type = (int)SqlDbType.VarChar, Size = 13,
                    IsDtParameter = true, IsFilterParameter = true, FilterMinimumLength = 4, FilterType = "strnumber",
                    Width = 7
                },
                new()
                {
                    Id = "birthDatePersian", Title = "تاریخ تولد", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "mobileNo", Title = "موبایل", Type = (int)SqlDbType.VarChar, Size = 11, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "strnumber", Width = 5
                },
                new()
                {
                    Id = "isDetail", Title = "تفصیل", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 5,
                    Align = "center"
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 1, IsDtParameter = true,
                    Align = "center", Width = 5
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 }
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
                p.CountryName,
                p.NationalCode,
                p.MobileNo,
                IsDetail = p.IsDetail ? "دارد" : "ندارد",
                IsActive = p.IsActive ? "فعال" : "غیر فعال"
            };
        return result;
    }

    public async Task<MyResultPage<List<PatientGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<PatientGetPage>>();
        result.Data = new List<PatientGetPage>();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("fullName",
            model.Filters.Any(x => x.Name == "fullName")
                ? model.Filters.FirstOrDefault(x => x.Name == "fullName").Value
                : null);
        parameters.Add("mobileNo",
            model.Filters.Any(x => x.Name == "mobileNo")
                ? model.Filters.FirstOrDefault(x => x.Name == "mobileNo").Value
                : null);
        parameters.Add("nationalCode",
            model.Filters.Any(x => x.Name == "nationalCode")
                ? model.Filters.FirstOrDefault(x => x.Name == "nationalCode").Value
                : null);
        parameters.Add("countryName",
            model.Filters.Any(x => x.Name == "countryName")
                ? model.Filters.FirstOrDefault(x => x.Name == "countryName").Value
                : null);

        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);


        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_Patient_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<PatientGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<PatientGetRecord> GetRecordByNationalCode(GetPatientNationalCode model)
    {
        using (var conn = Connection)
        {
            conn.Open();
            var sQuery = "mc.Spc_Patient_GetByNationalCode";
            var result = await conn.QueryFirstOrDefaultAsync<PatientGetRecord>(sQuery, new
            {
                model.NationalCode
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<List<PatientSearchService>> SearchPatientService(GetPatientSearchService model)
    {
        using (var conn = Connection)
        {
            conn.Open();
            var sQuery = "[mc].[Spc_Patient_AdmissionService_Search]";
            var result = (await conn.QueryAsync<PatientSearchService>(sQuery, new
            {
                model.PatientFullName,
                model.PatientNationalCode,
                model.MobileNo,
                model.InsurNo,
                model.InsurerLineId,
                model.CompInsurerLineId,
                model.ThirdPartyInsurerId,
                model.DiscountInsurerId,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();

            if (model.IncludeUnknown == 2)
                return result.Where(x => x.PatientReferralTypeId != 2).ToList();


            return result;
        }
    }

    public async Task<IEnumerable<PatientSearchService>> SearchPatientInsurer(int patientId, int companyId)
    {
        using (var conn = Connection)
        {
            conn.Open();
            var sQuery = "[mc].[Spc_Patient_Insurer_Search]";
            var result = await conn.QueryAsync<PatientSearchService>(sQuery,
                new
                {
                    PatientId = patientId,
                    CompanyId = companyId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            var list = from l in result
                orderby l.BasicInsurerId descending,
                    l.BasicInsurerLineId descending,
                    l.CompInsurerId descending,
                    l.CompInsurerLineId descending,
                    l.ThirdPartyInsurerId descending,
                    l.DiscountInsurerId descending
                select l;

            return list;
        }
    }

    public async Task<List<PatientSearchSale>> SearchPatientSale(GetPatientSearch model)
    {
        using (var conn = Connection)
        {
            conn.Open();
            var sQuery = "[mc].[Spc_Patient_AdmissionItem_Search]";
            var result = (await conn.QueryAsync<PatientSearchSale>(sQuery,
                new
                {
                    model.PatientFullName,
                    model.PatientNationalCode,
                    model.MobileNo,
                    model.InsurerLineId,
                    model.CompInsurerLineId,
                    model.ThirdPartyInsurerId,
                    model.DiscountInsurerId,
                    model.CompanyId,
                    model.IncludeUnknown
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(string term, int companyId, byte? isActive)
    {
        var filter = "1=1 ";

        if (isActive != 2)
            filter += $"AND IsActive = {(isActive == 1 ? 1 : 0)} ";

        if (term != null)
            if (term.Trim().Length != 0)
            {
                if (int.TryParse(term, out _))
                {
                    filter += $"AND CompanyId={companyId} AND Id={term} ";
                }
                else
                {
                    var patientName = term.Replace(" ", "+");

                    patientName = patientName.ConvertArabicAlphabet();

                    filter += $"AND CompanyId={companyId} And FullName LIKE N'%{patientName}%' ";
                }
            }

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.Patient",
                    TitleColumnName = "FullName",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> PatientFilter(string term, byte? type)
    {
        int? id = null;
        string nationalCode = null;
        string fullName = null;

        if (term.IsNullOrEmptyOrWhiteSpace())
            return null;

        term = term.Trim();

        if (type == 1)
        {
            if (!term.All(char.IsDigit))
                fullName = term.ConvertArabicAlphabet();
            else
                return null;
        }
        else if (type == 2)
        {
            if (!term.All(char.IsDigit))
            {
                fullName = term.ConvertArabicAlphabet();
            }
            else
            {
                if (int.TryParse(term, out _))
                    id = int.Parse(term);

                nationalCode = term;
            }
        }
        else
        {
            if (term.All(char.IsDigit))
            {
                if (int.TryParse(term, out _))
                    id = int.Parse(term);

                nationalCode = term;
            }
            else
            {
                return null;
            }
        }

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Patient_Search]";
            conn.Open();

            var result = await conn.QueryAsync<PatientFilter>(sQuery,
                new
                {
                    Id = id,
                    FullName = fullName,
                    NationalCode = nationalCode
                }, commandType: CommandType.StoredProcedure);
            conn.Close();


            var query = from p in result.AsQueryable()
                select new MyDropDownViewModel
                {
                    Id = p.Id,
                    Name = p.NationalCode.ConvertNullToEmpty() + " / " + p.FullName
                };

            return query;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDownWithNationalCode(string term, int companyId)
    {
        var filter = string.Empty;

        if (term != null)
            if (term.Trim().Length != 0)
                filter =
                    $" CompanyId={companyId} AND ( Id='{(int.TryParse(term, out _) ? term : "0")}' OR NationalCode='{(term.All(char.IsDigit) ? term : "0")}' OR FullName Like N'%{term}%' )";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.Patient",
                    ColumnNameList =
                        "Id,CASE WHEN ISNULL(NationalCode,'')='' THEN FullName ELSE ISNULL(NationalCode,'')+' - '+ FullName END Name",
                    Filter = filter,
                    OrderBy = "FullName ASC"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<MyResultPage<PatientGetRecord>> GetRecordById(int id, int CompanyId)
    {
        using (var conn = Connection)
        {
            conn.Open();
            var sQuery = "pb.Spc_Tables_GetRecord";
            var data = await conn.QueryFirstOrDefaultAsync<PatientGetRecord>(sQuery, new
            {
                IsSecondLang = false,
                TableName = "mc.Patient",
                Filter = $"Id={id} AND CompanyId={CompanyId}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();


            #region ویرایش تفضیل :accountDetailPatientList

            var accountDetailViewModel = new
            {
                IdNumber = data.IdCardNumber,
                JobTitle = data.JobTitle != "" || data.JobTitle != null ? data.JobTitle : "",
                NationalCode = data.NationalCode != null ? data.NationalCode : "",
                FullName = data.FullName != "" || data.FullName != null ? data.FullName : ""
            };
            data.JsonAccountDetailList = JsonConvert.SerializeObject(accountDetailViewModel);

            #endregion

            return data.ToMyResultPage();
        }
    }

    public async Task<bool> ExistNationalCode(GetPatientNationalCode model)
    {
        var filter = "IsActive = 1 AND ";

        if (model.Id == 0)
            filter = $"NationalCode='{model.NationalCode}' AND CompanyId={model.CompanyId}";
        else
            filter = $"NationalCode='{model.NationalCode}' AND (Id<>{model.Id}) AND CompanyId={model.CompanyId}";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "mc.Patient",
                    ColumnName = "NationalCode",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return string.IsNullOrEmpty(result);
        }
    }

    //public async Task<MyResultStatus> InsertPatient(AdmissionPatient model)
    //{
    //    using (IDbConnection conn = Connection)
    //    {

    //        model.FirstName = model.FirstName.ConvertArabicAlphabet().RemoveDigits();
    //        model.LastName = model.LastName.ConvertArabicAlphabet().RemoveDigits();
    //        model.FatherFirstName = model.FatherFirstName.ConvertArabicAlphabet().RemoveDigits();

    //        string sQuery = "[mc].[Spc_PatientAdmission_InsUpd]";
    //        conn.Open();
    //        var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
    //        {
    //            AdmissionPatientJSON = JsonConvert.SerializeObject(model),
    //            model.CompanyId,
    //        }, commandType: CommandType.StoredProcedure);

    //        conn.Close();

    //        result.Successfull = result.Status == 100;

    //        if (result.Successfull)
    //            result.StatusMessage = " مراجعه کننده با موفقیت ثبت شد";
    //        else
    //        {
    //            if (result.Status == -1)
    //                result.StatusMessage = "محدوده تفصیل تعریف نشده";
    //            else if (result.Status == -2)
    //                result.StatusMessage = "این شناسه قبلا ثبت شده";
    //            else if (result.Status == -3)
    //                result.StatusMessage = "امکان ثبت شناسه به صورت دستی وجود ندارد";
    //            else if (result.Status == -4)
    //                result.StatusMessage = "این نمبر تذکره قبلا ثبت شده";
    //            else
    //                result.StatusMessage = "ثبت مراجعه کننده با خطا مواجه شد";

    //            result.ValidationErrors.Add(result.StatusMessage);
    //        }

    //        return result;
    //    }

    //}
}