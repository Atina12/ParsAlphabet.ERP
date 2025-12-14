using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.CR.PersonGroup;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.CR.PersonGroup;

public class PersonGroupRepository :
    BaseRepository<PersonGroupModel, int, string>,
    IBaseRepository<PersonGroupModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;

    public PersonGroupRepository(IConfiguration config, IHttpContextAccessor accessor)
        : base(config)
    {
        _accessor = accessor;
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
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };
        return result;
    }

    public async Task<MyResultPage<List<PersonGroupGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<PersonGroupGetPage>>
        {
            Data = new List<PersonGroupGetPage>()
        };

        var personTypeId = Convert.ToInt32(model.Form_KeyValue[0]?.ToString());
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
        parameters.Add("PersonTypeId", personTypeId);
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "cr.Spc_PersonGroup_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<PersonGroupGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }


    public async Task<MyResultQuery> Insert(PersonGroupModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "cr.Spc_PersonGroup_InsUpd";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                MyClaim.IsSecondLang,
                Id = 0,
                model.Name,
                PersonGroupTypeId = model.PersonTypeId,
                model.CompanyId,
                model.IsActive
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = true;
        return result;
    }

    public async Task<MyResultQuery> Update(PersonGroupModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "cr.Spc_PersonGroup_InsUpd ";
            conn.Open();

            await conn.ExecuteAsync(sQuery, new
            {
                MyClaim.IsSecondLang,
                model.Id,
                model.Name,
                PersonGroupTypeId = model.PersonTypeId,
                model.CompanyId,
                model.IsActive
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = true;
        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDownByPersonType(byte type, int companyId, byte? isActive)
    {
        var filter = "";
        if (isActive != 2)
            filter += $"IsActive = {isActive} AND ";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "cr.PersonGroup",
                    Filter = filter + $"PersonTypeId={type} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<string> PersonGroup_GetName(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "cr.PersonGroup",
                    ColumnName = "Name",
                    Filter = $"Id={id}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }


    public async Task<MyResultStatus> Delete(int keyvalue, int companyId)
    {
        var result = new MyResultStatus();
        using (var conn = Connection)
        {
            var sQuery = "[cr].[Spc_PersonGroup_Delete]";
            conn.Open();

            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                Id = keyvalue,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
        }

        result.Successfull = result.Status == 100 ? true : false;
        return result;
    }
}