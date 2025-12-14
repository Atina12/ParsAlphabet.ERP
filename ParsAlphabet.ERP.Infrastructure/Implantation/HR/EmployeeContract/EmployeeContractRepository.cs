using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.HR.EmployeeContract;
using ParsAlphabet.ERP.Application.Interfaces.HR.EmployeeContract;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.HR.EmployeeContract;

public class EmployeeContractRepository : IEmployeeContractRepository
{
    private readonly IConfiguration _config;

    public EmployeeContractRepository(IConfiguration config)
    {
        _config = config;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 5
                },
                // new DataColumnsViewModel { Id = "EmployeeName", Title = "نام و  تخلص پرسنل", Type = (int)SqlDbType.NVarChar, Size = 101,IsDtParameter = true,Width=25},
                new()
                {
                    Id = "EmployeeId", Title = "شناسه پرسنلی", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 5
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 5,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 25 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" }
            }
        };

        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(GetPageViewModel model)
    {
        model.PageNo = 0;
        model.PageRowsCount = 0;

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
                p.EmployeeId,
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };
        return result;
    }

    public async Task<MyResultPage<List<EmployeeContractGetPage>>> GetPage(GetPageViewModel model)
    {
        var result = new MyResultPage<List<EmployeeContractGetPage>>();
        result.Data = new List<EmployeeContractGetPage>();

        var totalRecord = 0;
        var p_id = 0;

        switch (model.FieldItem)
        {
            case "id":
                p_id = model.FieldValue != "" ? Convert.ToInt32(model.FieldValue) : 0;
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id", p_id);
        parameters.Add("EmployeeId", Convert.ToInt32(model.Form_KeyValue));
        parameters.Add("CompanyId", model.CompanyId);
        parameters.Add("TotalRecord", dbType: DbType.Int32, direction: ParameterDirection.Output);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "hr.Spc_EmployeeContract_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<EmployeeContractGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        totalRecord = parameters.Get<int>("TotalRecord");

        if (result.Data.Count != 0 && model.PageRowsCount != 0)
        {
            result.CurrentPage = model.PageNo;
            result.TotalRecordCount = totalRecord;
            if (result.TotalRecordCount % model.PageRowsCount == 0)
                result.MaxPageCount = Convert.ToInt32(result.TotalRecordCount / model.PageRowsCount);
            else
                result.MaxPageCount = Convert.ToInt32(result.TotalRecordCount / model.PageRowsCount) + 1;
            result.PageStartRow = (model.PageNo - 1) * model.PageRowsCount + 1;
            result.PageEndRow = result.PageStartRow + result.Data.Count - 1;
        }

        return result;
    }

    public async Task<MyResultPage<EmployeeContractGetRecord>> GetRecordById(int id)
    {
        var result = new MyResultPage<EmployeeContractGetRecord>
        {
            Data = new EmployeeContractGetRecord()
        };

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            result.Data = await conn.QueryFirstOrDefaultAsync<EmployeeContractGetRecord>(sQuery, new
            {
                TableName = "hr.EmployeeContract",
                Filter = $"Id={id}"
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<MyResultQuery> Insert(EmployeeContractModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "hr.Spc_EmployeeContract_InsUpd";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                Opr = "Ins",
                Id = 0,
                model.EmployeeId,
                model.StartDate,
                model.ExpDate,
                model.SCId,
                model.STaxId,
                model.WorkGroupId,
                model.IsActive,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = true;
        return result;
    }

    public async Task<MyResultQuery> Update(EmployeeContractModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "hr.Spc_EmployeeContract_InsUpd ";
            conn.Open();

            await conn.ExecuteAsync(sQuery, new
            {
                Opr = "Upd",
                model.Id,
                model.EmployeeId,
                model.StartDate,
                model.ExpDate,
                model.SCId,
                model.STaxId,
                model.WorkGroupId,
                model.IsActive,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = true;
        return result;
    }

    public async Task<MyResultQuery> Delete(int keyvalue)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecordWithFilter";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                TableName = "hr.EmployeeContract",
                RecordId = keyvalue
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }
}