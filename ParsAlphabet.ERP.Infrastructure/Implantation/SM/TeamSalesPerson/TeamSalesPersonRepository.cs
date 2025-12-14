using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.SM.TeamSalesPerson;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.SM.TeamSalesPerson;

public class TeamSalesPersonRepository :
    BaseRepository<TeamSalesPersonModel, int, string>,
    IBaseRepository<TeamSalesPersonModel, int, string>
{
    public TeamSalesPersonRepository(IConfiguration config) : base(config)
    {
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
                    Id = "employeeId", Title = "شناسه ", Type = (int)SqlDbType.TinyInt, IsDtParameter = true,
                    IsFilterParameter = true, Width = 6
                },
                new()
                {
                    Id = "employeeFullName", Title = "نام پرسنل", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, IsFilterParameter = true, Width = 15
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Editable = true,
                    Width = 7, InputType = "checkbox"
                }
            }
        };

        return list;
    }

    public async Task<MyResultPage<List<TeamSalesPersonGetPage>>> GetPage(GetPageViewModel model)
    {
        var result = new MyResultPage<List<TeamSalesPersonGetPage>>
        {
            Data = new List<TeamSalesPersonGetPage>()
        };

        var p_teamId = Convert.ToInt32(model.Form_KeyValue[0]?.ToString());

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("TeamId", p_teamId);
        parameters.Add("EmployeeId",
            model.Filters.Any(x => x.Name == "employeeId")
                ? model.Filters.FirstOrDefault(x => x.Name == "employeeId").Value
                : null);
        parameters.Add("EmployeeFullName",
            model.Filters.Any(x => x.Name == "employeeFullName")
                ? model.Filters.FirstOrDefault(x => x.Name == "employeeFullName").Value
                : null);
        parameters.Add("TeamName");
        parameters.Add("EmployeeNationalCode");
        parameters.Add("EmployeeMobileNo");
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "[sm].[Spc_TeamSalesPerson_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<TeamSalesPersonGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultPage<TeamSalesPersonGetRecord>> GetRecordById(int teamId, int employeeId)
    {
        var result = new MyResultPage<TeamSalesPersonGetRecord>
        {
            Data = new TeamSalesPersonGetRecord()
        };
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            conn.Open();
            result.Data = await conn.QueryFirstOrDefaultAsync<TeamSalesPersonGetRecord>(sQuery, new
            {
                TableName = "sm.TeamSalesPerson",
                Filter = $"teamId = {teamId} and employeeId={employeeId}"
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Data != null;
        return result;
    }

    public async Task<MyResultQuery> Insert(TeamSalesPersonModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "[sm].[Spc_TeamSalesPerson_InsUpd]";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                Opr = "Ins",
                model.TeamId,
                model.EmployeeId,
                model.IsActive
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = true;

        return result;
    }

    public async Task<MyResultQuery> Update(TeamSalesPersonModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "[sm].[Spc_TeamSalesPerson_InsUpd]";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                Opr = "Upd",
                model.TeamId,
                model.EmployeeId,
                model.IsActive
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = true;

        return result;
    }

    //public async Task<List<MyDropDownViewModel>> GetDropDown()
    //{
    //    using (IDbConnection conn = Connection)
    //    {
    //        string sQuery = "pb.Spc_Tables_GetList";
    //        conn.Open();

    //        var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
    //            new
    //            {
    //                TableName = "sm.TeamSalesPerson"
    //            }, commandType: CommandType.StoredProcedure)).ToList();
    //        return result;
    //    }
    //}
}