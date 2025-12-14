using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.MC.ServiceType;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.ServiceType;

public class ServiceTypeRepository :
    BaseRepository<ServiceTypeModel, int, string>,
    IBaseRepository<ServiceTypeModel, int, string>
{
    public ServiceTypeRepository(IConfiguration config)
        : base(config)
    {
    }

    public new GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                //CostCenterApi/getdropdown
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 8
                },
                new()
                {
                    Id = "name", Title = "نوع خدمت", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 15
                },
                new()
                {
                    Id = "nickName", Title = "عنوان اختصاری", Type = (int)SqlDbType.NVarChar, Size = 15,
                    IsDtParameter = true, IsFilterParameter = true, Width = 15
                },
                new()
                {
                    Id = "costCenter", Title = "مرکز هزینه", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, Width = 15, FilterType = "select2",
                    FilterTypeApi = "api/FM/CostCenterApi/getdropdown"
                },
                new()
                {
                    Id = "terminologyId", Title = "نمبر تذکره", Type = (int)SqlDbType.NVarChar, Size = 4,
                    IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "isDental", Title = "دندانپزشکی", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 6,
                    Align = "center"
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 6,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 27 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" }
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
                p.Name,
                p.NickName,
                p.CostCenter,
                p.TerminologyId,
                IsDental = p.IsDental ? "فعال" : "غیرفعال",
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };
        return result;
    }

    public async Task<MyResultPage<List<ServiceTypeGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<ServiceTypeGetPage>>();
        result.Data = new List<ServiceTypeGetPage>();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "name")
                ? model.Filters.FirstOrDefault(x => x.Name == "name").Value
                : null);
        parameters.Add("NickName",
            model.Filters.Any(x => x.Name == "nickName")
                ? model.Filters.FirstOrDefault(x => x.Name == "nickName").Value
                : null);
        parameters.Add("CostCenterId",
            model.Filters.Any(x => x.Name == "costCenter")
                ? model.Filters.FirstOrDefault(x => x.Name == "costCenter").Value
                : null);
        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_ServiceType_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<ServiceTypeGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }


        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(byte? isActive)
    {
        var filter = "";
        if (isActive != null && isActive != 2)
            filter += $"IsActive = {(isActive == 1 ? 1 : 0)}";
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "mc.ServiceType",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<string> GetName(short id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "mc.ServiceType",
                    ColumnName = "Name",
                    Filter = $"Id={id}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }
}