using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.HR.OrganizationalDepartment;
using ParsAlphabet.ERP.Application.Interfaces.Redis;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.HR.OrganizationalDepartment;

public class OrganizationalDepartmentRepository :
    BaseRepository<OrganizationalDepartmentModel, int, string>,
    IBaseRepository<OrganizationalDepartmentModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;
    private readonly IRedisService _redisService;

    public OrganizationalDepartmentRepository(IConfiguration config, IHttpContextAccessor accessor,
        IRedisService redisService)
        : base(config)
    {
        _accessor = accessor;
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
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 8, FilterType = "number"
                },
                new()
                {
                    Id = "name", Title = "نام ", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 15
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 6,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 71 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" }
            }
        };
        return list;
    }

    public async Task<MyResultPage<List<OrganizationalDepartmentGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<OrganizationalDepartmentGetPage>>
        {
            Data = new List<OrganizationalDepartmentGetPage>()
        };


        MyClaim.Init(_accessor);

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "name")
                ? model.Filters.FirstOrDefault(x => x.Name == "name").Value
                : null);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "hr.Spc_OrganizationalDepartment_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<OrganizationalDepartmentGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<List<MyDropDownViewModel>> OrganizationalDepartment_GetDropDown(byte? isActive)
    {
        var cacheOrganizationalDepartment = new List<OrganizationalDepartmentDropDown>();
        var dropDownList = new List<MyDropDownViewModel>();


        try
        {
            cacheOrganizationalDepartment =
                _redisService.GetData<List<OrganizationalDepartmentDropDown>>("OrganizationalDepartment");
            if (cacheOrganizationalDepartment.ListHasRow())
            {
                dropDownList = (from d in cacheOrganizationalDepartment
                    where isActive == 2 || d.IsActive == (isActive == 1)
                    select new MyDropDownViewModel
                    {
                        Id = d.Id,
                        Name = d.Name
                    }).AsList();

                return dropDownList;
            }

            cacheOrganizationalDepartment = await GetDataOrganizationalDepartmentDropDown();

            var expirationTime = DateTimeOffset.Now.AddHours(10.0);
            _redisService.SetData("OrganizationalDepartment", cacheOrganizationalDepartment, expirationTime);
        }
        catch (Exception)
        {
            cacheOrganizationalDepartment = await GetDataOrganizationalDepartmentDropDown();
        }

        dropDownList = (from d in cacheOrganizationalDepartment
            where isActive == 2 || d.IsActive == (isActive == 1)
            select new MyDropDownViewModel
            {
                Id = d.Id,
                Name = d.Name
            }).AsList();

        return dropDownList;
    }

    public async Task<List<OrganizationalDepartmentDropDown>> GetDataOrganizationalDepartmentDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();
            var result = (await conn.QueryAsync<OrganizationalDepartmentDropDown>(sQuery,
                new
                {
                    IsSecondLang = false,
                    TableName = "hr.OrganizationalDepartment",
                    IdColumnName = "Id",
                    ColumnNameList = "*",
                    IdList = "",
                    Filter = "",
                    OrderBy = ""
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<MyResultQuery> Insert(OrganizationalDepartmentModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "hr.Spc_OrganizationalDepartment_InsUpd";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                Opr = "Ins",
                Id = 0,
                model.Name,
                // model.NameEng,
                model.IsActive,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            result.Successfull = true;
            return result;
        }
    }


    public async Task<MyResultQuery> Update(OrganizationalDepartmentModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "hr.Spc_OrganizationalDepartment_InsUpd";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                Opr = "Upd",
                model.Id,
                model.Name,
                //model.NameEng,
                model.IsActive,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            result.Successfull = true;
            return result;
        }
    }


    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                GetColumns().DataColumns
                    .Where(x => x.IsDtParameter && x.Id != "action")
                    .Select(z => z.Title))
        };

        var getPage = await GetPage(model);
        result.Rows = from p in getPage.Data
            select new
            {
                p.Id,
                p.Name,
                //p.NameEng,
                isActive = p.IsActive ? "فعال" : "غیرفعال"
            };

        return result;
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(int companyId)
    {
        var sQuery = "pb.Spc_Tables_GetList";
        using (var conn = Connection)
        {
            conn.Open();
            var result = await Connection.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "hr.OrganizationalDepartment",
                    Filter = $"CompanyId={companyId}",
                    OrderBy = "Name"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result.ToList().OrderBy(x => x.Id);
        }
    }

    public async Task<string> GetDepartmentName(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "hr.OrganizationalDepartment",
                    ColumnName = "Name",
                    Filter = $"Id={id}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }
}