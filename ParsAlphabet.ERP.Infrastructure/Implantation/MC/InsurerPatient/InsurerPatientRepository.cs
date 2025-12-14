using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.MC.InsurerPatient;
using ParsAlphabet.ERP.Application.Dtos.MC.Patient;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.User;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.InsurerPatient;

public class InsurerPatientRepository :
    BaseRepository<InsurerPatientModel, int, string>,
    IBaseRepository<InsurerPatientModel, int, string>
{
    private readonly UserRepository _userRepository;

    public InsurerPatientRepository(IConfiguration config, UserRepository userRepository)
        : base(config)
    {
        _userRepository = userRepository;
    }

    public new GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            IsEditable = true,
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "patientId", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 6, IsPrimary = true
                },
                new()
                {
                    Id = "fullName", Title = "نام و  تخلص", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "nationalCode", Title = "نمبر تذکره", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, IsFilterParameter = true, FilterMinimumLength = 4, FilterType = "strnumber",
                    Width = 8
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 1, IsDtParameter = true,
                    Width = 10, Align = "center", Editable = true, InputType = "checkbox"
                },
                new()
                {
                    Id = "createUserFullName", Title = "کاربر ", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 8
                },

                new() { Id = "id", IsPrimary = true }
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
                p.PatientId,
                p.FullName,
                p.NationalCode
            };
        return result;
    }

    public async Task<MyResultQuery> Save(InsurerPatientModel model)
    {
        model.CreateDateTime = DateTime.Now;

        var result = new MyResultQuery();


        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_InsurerPatient_Save";
            conn.Open();
            var output = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.InsurerId,
                model.CreateUserId,
                model.InsurerTypeId,
                model.PatientId,
                model.IsActive,
                model.CreateDateTime
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Id = output == null ? 0 : output.Id;
            result.Successfull = true;
        }

        return result;
    }

    public async Task<MyResultPage<List<InsurerPatientGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<InsurerPatientGetPage>>();
        result.Data = new List<InsurerPatientGetPage>();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("InsurerId",
            model.Form_KeyValue.Length == 3 ? Convert.ToInt32(model.Form_KeyValue[2]?.ToString()) : 0);
        parameters.Add("PatientFullName",
            model.Filters.Any(x => x.Name == "fullName")
                ? model.Filters.FirstOrDefault(x => x.Name == "fullName").Value
                : null);
        parameters.Add("PatientId",
            model.Filters.Any(x => x.Name == "patientId")
                ? model.Filters.FirstOrDefault(x => x.Name == "patientId").Value
                : null);
        parameters.Add("nationalCode",
            model.Filters.Any(x => x.Name == "nationalCode")
                ? model.Filters.FirstOrDefault(x => x.Name == "nationalCode").Value
                : null);
        parameters.Add("SelectedPatient", Convert.ToInt32(model.Form_KeyValue[1]?.ToString()) == 1);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_InsurerPatient_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<InsurerPatientGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
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

    public async Task<IEnumerable<MyDropDownViewModel>> PatientFilter(string term)
    {
        int? id = null;
        string nationalCode = null;
        string fullName = null;

        if (term.IsNullOrEmptyOrWhiteSpace())
            return null;

        term = term.Trim();

        if (!term.IsNullOrEmptyOrWhiteSpace())
        {
            if (term.All(char.IsDigit))
            {
                id = int.Parse(term);
                nationalCode = term;
            }
            else
            {
                fullName = term.ConvertArabicAlphabet();
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

    public async Task<InsurerPatientGetRecord> GetRecordById(int id)
    {
        using (var conn = Connection)
        {
            conn.Open();
            var sQuery = "pb.Spc_Tables_GetRecord";
            var result = await conn.QueryFirstOrDefaultAsync<InsurerPatientGetRecord>(sQuery, new
            {
                IsSecondLang = false,
                TableName = "mc.InsurerPatient",
                Filter = $"Id={id}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            if (result != null) result.CreateUserFullName = await _userRepository.GetUserFullName(result.CreateUserId);
            return result;
        }
    }
}