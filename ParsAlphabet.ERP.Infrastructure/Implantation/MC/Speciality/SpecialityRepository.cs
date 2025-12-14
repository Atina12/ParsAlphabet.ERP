using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.MC.Speciality;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.Speciality;

public class SpecialityRepository :
    BaseRepository<SpecialityModel, int, string>,
    IBaseRepository<SpecialityModel, int, string>
{
    public SpecialityRepository(IConfiguration config)
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
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.SmallInt, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 7
                },
                new()
                {
                    Id = "name", Title = "نام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 25
                },
                new()
                {
                    Id = "code", Title = "کد ", Type = (int)SqlDbType.Int, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 10
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 1, IsDtParameter = true,
                    Width = 5, Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 53 }
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
                p.Name,
                //p.ServiceCenterName,
                p.Code,
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };
        return result;
    }

    public async Task<MyResultPage<List<SpecialityGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<SpecialityGetPage>>
        {
            Data = new List<SpecialityGetPage>()
        };

        if (model.Filters == null) model.Filters = new List<FormKeyValue>();
        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "name")
                ? model.Filters.FirstOrDefault(x => x.Name == "name").Value
                : null);
        parameters.Add("Code",
            model.Filters.Any(x => x.Name == "code")
                ? model.Filters.FirstOrDefault(x => x.Name == "code").Value
                : null);
        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_Speciality_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<SpecialityGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
            conn.Close();
        }


        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(string term, byte? isActive, int companyId)
    {
        var filter = "";
        if (isActive != null && isActive != 2)
            filter += $"IsActive = {(isActive == 1 ? 1 : 0)} AND ";

        filter +=
            $"CompanyId={companyId} AND ( Id='{(int.TryParse(term, out _) ? term : "0")}' OR Name Like N'%{term}%' ) ";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.Speciality",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<string> GetSpecialityName(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "mc.Speciality",
                    ColumnName = "Name",
                    Filter = $"Id={id}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<short> GetThrSpecialityId(int code)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<short>(sQuery,
                new
                {
                    TableName = "mc.thrSPECIALTY",
                    ColumnName = "Id",
                    Filter = $"Id={code} "
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<short> GetSpecialityId(int terminologyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<short>(sQuery,
                new
                {
                    TableName = "mc.Speciality",
                    ColumnName = "Id",
                    Filter = $"TerminologyId={terminologyId}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }


    public async Task<bool> CheckTerminologyId(CheckExistSpeciality model)
    {
        var filter = $"TerminologyId='{model.TerminologyId}' AND CompanyId={model.CompanyId}";

        if (model.Id != 0)
            filter += $" AND Id<>{model.Id}";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "mc.Speciality",
                    ColumnName = "TerminologyId",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);

            return result == null ? true : false;
        }
    }
}