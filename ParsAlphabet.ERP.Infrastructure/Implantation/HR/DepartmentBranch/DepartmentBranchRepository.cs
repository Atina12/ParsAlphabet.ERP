using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.HR.DepartmentBranch;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.HR.DepartmentBranch;

public class DepartmentBranchRepository(IConfiguration config) :
    BaseRepository<DepartmentBranchModel, int, string>(config),
    IBaseRepository<DepartmentBranchModel, int, string>
{
    public GetColumnsViewModel GetColumns(string formType)
    {
        if (formType == "branchdepartment")
        {
            var list = new GetColumnsViewModel
            {
                IsEditable = true,
                DataColumns = new List<DataColumnsViewModel>
                {
                    new()
                    {
                        Id = "departmentId", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, Size = 0,
                        IsFilterParameter = true, IsDtParameter = true, Width = 6
                    },
                    new()
                    {
                        Id = "departmentName", Title = "نام", Type = (int)SqlDbType.NVarChar, Size = 100,
                        IsDtParameter = true, IsFilterParameter = true, Width = 30
                    },
                    new()
                    {
                        Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 1, IsDtParameter = true,
                        Width = 10, Align = "center", Editable = true, InputType = "checkbox"
                    }
                }
            };

            return list;
        }
        else
        {
            var list = new GetColumnsViewModel
            {
                IsEditable = true,
                DataColumns = new List<DataColumnsViewModel>
                {
                    new()
                    {
                        Id = "branchId", Title = "طبیب", Type = (int)SqlDbType.NVarChar, Size = 100, IsPrimary = true,
                        IsDtParameter = true, IsFilterParameter = true, Width = 30
                    },
                    new()
                    {
                        Id = "branchName", Title = "دپارتمان", Type = (int)SqlDbType.NVarChar, Size = 0,
                        IsDtParameter = true, IsFilterParameter = true, Width = 20
                    },
                    new()
                    {
                        Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 1, IsDtParameter = true,
                        Width = 10, Align = "center", Editable = true, InputType = "checkbox"
                    }
                }
            };

            return list;
        }
    }

    public async Task<MyResultPage<List<DepartmentBranchGetPage>>> BranchDepartmentGetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<DepartmentBranchGetPage>>
        {
            Data = new List<DepartmentBranchGetPage>()
        };


        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("BranchId", int.Parse(model.Form_KeyValue[0]?.ToString()));
        parameters.Add("DepartmentId",
            model.Filters.Any(x => x.Name == "departmentId")
                ? model.Filters.FirstOrDefault(x => x.Name == "departmentId").Value
                : null);
        parameters.Add("DepartmentName",
            model.Filters.Any(x => x.Name == "departmentName")
                ? model.Filters.FirstOrDefault(x => x.Name == "departmentName").Value
                : null);
        parameters.Add("SelectedAssistant", Convert.ToInt32(model.Form_KeyValue[1]?.ToString()) == 1);

        result.Columns = GetColumns("branchdepartment");

        using (var conn = Connection)
        {
            var sQuery = "[hr].[Spc_BranchDepartment_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<DepartmentBranchGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultPage<List<DepartmentBranchGetPage>>> DepartmentBranchGetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<DepartmentBranchGetPage>>
        {
            Data = new List<DepartmentBranchGetPage>()
        };


        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("DepartmentId", int.Parse(model.Form_KeyValue[0]?.ToString()));
        parameters.Add("SelectedAssistant", Convert.ToInt32(model.Form_KeyValue[1]?.ToString()) == 1);

        result.Columns = GetColumns("departmentbranch");

        using (var conn = Connection)
        {
            var sQuery = "[hr].[Spc_DepartmentBranch_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<DepartmentBranchGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }
}