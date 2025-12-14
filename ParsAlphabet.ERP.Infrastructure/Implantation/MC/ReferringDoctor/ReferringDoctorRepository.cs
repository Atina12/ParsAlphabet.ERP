using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.MC.ReferringDoctor;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.ReferringDoctor;

public class ReferringDoctorRepository :
    BaseRepository<ReferringDoctorModel, int, string>,
    IBaseRepository<ReferringDoctorModel, int, string>
{
    public ReferringDoctorRepository(IConfiguration config)
        : base(config)
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
                    IsFilterParameter = true, FilterType = "number", Width = 8
                },
                new()
                {
                    Id = "fullName", Title = "نام و  تخلص", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, IsFilterParameter = true, Width = 15
                },
                new()
                {
                    Id = "gender", Title = "جنسیت", Type = (int)SqlDbType.VarChar, Size = 30, IsDtParameter = true,
                    Width = 5
                },
                new()
                {
                    Id = "msc", Title = "نظام پزشکی", Type = (int)SqlDbType.NVarChar, Size = 30, IsPersian = true,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "strnumber", Width = 8
                },
                new()
                {
                    Id = "speciality", Title = "تخصص", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 16, FilterType = "select2ajax",
                    FilterTypeApi = "Api/MC/SpecialityApi/getdropdown"
                },
                new()
                {
                    Id = "role", Title = "نقش", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "mobileNo", Title = "شماره موبایل", Type = (int)SqlDbType.VarChar, Size = 11,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "strnumber", Width = 6
                },
                new()
                {
                    Id = "phoneNo", Title = "تلفن ثابت", Type = (int)SqlDbType.VarChar, Size = 20, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "strnumber", Width = 6
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 5,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 17 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
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
                p.MSC,
                p.Speciality,
                p.Role,
                p.MobileNo,
                p.PhoneNo,
                p.Address
            };
        return result;
    }

    public async Task<MyResultPage<List<ReferringDoctorGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<ReferringDoctorGetPage>>();
        result.Data = new List<ReferringDoctorGetPage>();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("FullName",
            model.Filters.Any(x => x.Name == "fullName")
                ? model.Filters.FirstOrDefault(x => x.Name == "fullName").Value
                : null);
        parameters.Add("PhoneNo",
            model.Filters.Any(x => x.Name == "phoneNo")
                ? model.Filters.FirstOrDefault(x => x.Name == "phoneNo").Value
                : null);
        parameters.Add("MobileNo",
            model.Filters.Any(x => x.Name == "mobileNo")
                ? model.Filters.FirstOrDefault(x => x.Name == "mobileNo").Value
                : null);
        parameters.Add("MSC",
            model.Filters.Any(x => x.Name == "msc") ? model.Filters.FirstOrDefault(x => x.Name == "msc").Value : null);
        parameters.Add("SpecialityId",
            model.Filters.Any(x => x.Name == "speciality")
                ? model.Filters.FirstOrDefault(x => x.Name == "speciality").Value
                : null);

        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);


        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_ReferringDoctor_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<ReferringDoctorGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(string term, int companyId, byte? isActive)
    {
        if (string.IsNullOrEmpty(term))
            return null;

        var filter = string.Empty;

        if (term.Trim().Length != 0)
            filter =
                $" CompanyId={companyId} AND ( Id='{(short.TryParse(term, out _) ? term : "0")}' OR FullName Like N'%{term}%' OR MSC LIKE N'%{term}%' )";

        if (isActive != 2) filter += $" AND IsActive = {(isActive == 1 ? 1 : 0)} ";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    IsSecondLang = 0,
                    TableName = "mc.ReferringDoctor",
                    IdColumnName = "Id",
                    TitleColumnName = "FullName +' - '+ MSC",
                    IdList = "",
                    Filter = filter,
                    OrderBy = "Id Desc"
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<MyResultStatus> Insert(ReferringDoctorModel model)
    {
        var result = new MyResultStatus();

        if (!string.IsNullOrEmpty(model.MSC))
        {
            var msc = model.MSC.PadLeft(10, '0');
            model.MSC = msc;
        }

        var sQuery = "mc.Spc_ReferringDoctor_InsUpd";
        using (var conn = Connection)
        {
            conn.Open();
            result = await Connection.QueryFirstAsync<MyResultStatus>(sQuery, new
            {
                Opr = "Ins",
                Id = 0,
                FirstName = model.FirstName.ConvertArabicAlphabet(),
                LastName = model.LastName.ConvertArabicAlphabet(),
                model.GenderId,
                model.Address,
                model.PhoneNo,
                model.MobileNo,
                model.SpecialityId,
                model.RoleId,
                model.MSC,
                MscTypeId = model.MSC_TypeId,
                model.LocCityId,
                model.LocStateId,
                model.IsActive,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;

        return result;
    }

    public async Task<MyResultStatus> Update(ReferringDoctorModel model)
    {
        var result = new MyResultStatus();
        var sQuery = "mc.Spc_ReferringDoctor_InsUpd";

        using (var conn = Connection)
        {
            conn.Open();
            result = await Connection.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                Opr = "Upd",
                model.Id,
                FirstName = model.FirstName.ConvertArabicAlphabet(),
                LastName = model.LastName.ConvertArabicAlphabet(),
                model.GenderId,
                model.Address,
                model.PhoneNo,
                model.MobileNo,
                model.SpecialityId,
                model.RoleId,
                model.MSC,
                MSCTypeId = model.MSC_TypeId,
                model.LocCityId,
                model.LocStateId,
                model.IsActive,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultStatus> InsertFromAdmissionRefer(ReferringDoctorModel model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_ReferringDoctorRefer_Ins]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery,
                new
                {
                    model.FirstName,
                    model.LastName,
                    model.MSC,
                    model.MSC_TypeId,
                    model.RoleId,
                    model.CompanyId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = result.Status == 100;

            return result;
        }
    }

    public async Task<short> CheckExistReferringDoctor(string msc, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<short>(sQuery,
                new
                {
                    TableName = "mc.ReferringDoctor",
                    ColumnName = "Id",
                    Filter = $"MSC='{msc}' AND [CompanyId]={companyId}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }


    public async Task<MyDropDownViewModel> GetReferringDoctorMsc(int id, int CompanyId)
    {
        var sQuery = "pb.Spc_Tables_GetList";
        var result = new MyDropDownViewModel();
        using (var conn = Connection)
        {
            conn.Open();
            result = await Connection.QueryFirstOrDefaultAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.ReferringDoctor",
                    IdColumnName = "MSC_TypeId",
                    TitleColumnName = "MSC",
                    Filter = $"Id={id} AND CompanyId={CompanyId}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        return result;
    }
}