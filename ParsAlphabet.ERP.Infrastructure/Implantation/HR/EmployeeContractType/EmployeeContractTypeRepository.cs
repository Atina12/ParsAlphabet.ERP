using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.HR.EmployeeContractType;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.HR.EmployeeContractType;

public class EmployeeContractTypeRepository :
    BaseRepository<EmployeeContractTypeModel, int, string>,
    IBaseRepository<EmployeeContractTypeModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;

    public EmployeeContractTypeRepository(IConfiguration config, IHttpContextAccessor accessor)
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


    public async Task<MyResultPage<List<EmployeeContractTypeGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<EmployeeContractTypeGetPage>>
        {
            Data = new List<EmployeeContractTypeGetPage>()
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
        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "hr.Spc_EmployeeContractType_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<EmployeeContractTypeGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }


    public async Task<MyResultQuery> Insert(EmployeeContractTypeModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "hr.Spc_EmployeeContractType_InsUpd";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                Opr = "Ins",
                Id = 0,
                model.Name,
                model.IsActive,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            result.Successfull = true;
            return result;
        }
    }


    public async Task<MyResultQuery> Update(EmployeeContractTypeModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "hr.Spc_EmployeeContractType_InsUpd";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                Opr = "Upd",
                model.Id,
                model.Name,
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
                isActive = p.IsActive ? "فعال" : "غیرفعال"
            };

        return result;
    }
}