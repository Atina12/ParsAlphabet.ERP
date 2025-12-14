using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.MC.ServiceCenter;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.ServiceCenter;

public class ServiceCenterRepository :
    BaseRepository<ServiceCenterModel, int, string>,
    IBaseRepository<ServiceCenterModel, int, string>
{
    public ServiceCenterRepository(IConfiguration config) : base(config)
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
                    Id = "departmentNameId", Title = "دپارتمان", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 35, FilterType = "select2",
                    FilterTypeApi = "/api/HR/OrganizationalDepartmentApi/getdropdown"
                },
                new() { Id = "unit", Title = "واحد", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 5 },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 5,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 52 }
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
        model.PageNo = null;
        model.PageRowsCount = null;

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
                p.DepartmentNameId,
                p.Unit,
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };
        return result;
    }

    public async Task<MyResultPage<List<ServiceCenterGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<ServiceCenterGetPage>>
        {
            Data = new List<ServiceCenterGetPage>()
        };

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("DepartmentId",
            model.Filters.Any(x => x.Name == "departmentNameId")
                ? model.Filters.FirstOrDefault(x => x.Name == "departmentNameId").Value
                : null);

        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);


        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_ServiceCenter_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<ServiceCenterGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(int companyId, byte isActive)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_ServiceCenter_GetList]";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    CompanyId = companyId,
                    IsActive = isActive
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }
}