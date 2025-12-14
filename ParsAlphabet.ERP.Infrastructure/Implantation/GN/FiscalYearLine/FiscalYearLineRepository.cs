using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.GN.FiscalYearLine;
using ParsAlphabet.ERP.Application.Interfaces.GN.FiscalYearLine;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYearLine;

public class FiscalYearLineRepository : IFiscalYearLineRepository
{
    private readonly IConfiguration _config;

    public FiscalYearLineRepository(IConfiguration config)
    {
        _config = config;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            HasFilter = false,
            IsEditable = true,
            DataColumns = new List<DataColumnsViewModel>
            {
                new() { Id = "id", Title = "شناسه", Type = (int)SqlDbType.TinyInt, IsDtParameter = true, Width = 10 },
                new()
                {
                    Id = "monthId", Title = "ماه", Type = (int)SqlDbType.TinyInt, IsDtParameter = true, Width = 17
                },
                new()
                {
                    Id = "monthName", Title = "نام ماه", Type = (int)SqlDbType.TinyInt, IsDtParameter = true,
                    IsFilterParameter = true, Width = 17
                },
                new()
                {
                    Id = "startDatePersian", Title = "تاریخ شروع ", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, InputType = "datepersian", Editable = true, Width = 10,
                    InputMask = new InputMask { Mask = "'mask':'9999/99/99'" }
                },
                new()
                {
                    Id = "endDatePersian", Title = "تاریخ پایان", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, InputType = "datepersian", Editable = true, Width = 9,
                    InputMask = new InputMask { Mask = "'mask':'9999/99/99'" }
                },
                new()
                {
                    Id = "locked", Title = "بستن", Type = (int)SqlDbType.Bit, IsDtParameter = true, Editable = true,
                    Width = 7, InputType = "checkbox"
                }
            }
        };

        return list;
    }

    public async Task<MyResultPage<List<FiscalYearLineGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<FiscalYearLineGetPage>>();
        result.Data = new List<FiscalYearLineGetPage>();

        var p_headerId = Convert.ToInt32(model.Form_KeyValue[0]?.ToString());

        var parameters = new DynamicParameters();
        parameters.Add("HeaderId", p_headerId);
        parameters.Add("Name");

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_FiscalYearLine_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<FiscalYearLineGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultQuery> Insert(FiscalYearLineModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_FiscalYearLine_InsUpd";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Ins",
                model.Id,
                model.HeaderId,
                model.MonthId,
                model.StartDate,
                model.EndDate,
                model.Locked
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;

        return result;
    }

    public async Task<MyResultQuery> Update(FiscalYearLineModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_FiscalYearLine_InsUpd";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                Opr = "Upd",
                model.Id,
                model.HeaderId,
                model.MonthId,
                model.StartDate,
                model.EndDate,
                model.Locked
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;

        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "gn.FiscalYearLine"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<MyResultPage<FiscalYearLineGetRecord>> GetRecordBy_FiscalYearLine(byte headerId, byte monthId)
    {
        var result = new MyResultPage<FiscalYearLineGetRecord>
        {
            Data = new FiscalYearLineGetRecord()
        };

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            result.Data = await conn.QueryFirstOrDefaultAsync<FiscalYearLineGetRecord>(sQuery, new
            {
                TableName = "gn.FiscalYearLine",
                Filter = $"HeaderId={headerId} AND MonthId={monthId}"
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Data == null;
        return result;
    }

    public async Task<MyResultPage<FiscalYearLineGetRecord>> GetRecordById(int id)
    {
        var result = new MyResultPage<FiscalYearLineGetRecord>();
        result.Data = new FiscalYearLineGetRecord();
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            conn.Open();
            result.Data = await conn.QueryFirstOrDefaultAsync<FiscalYearLineGetRecord>(sQuery, new
            {
                TableName = "gn.FiscalYearLine",
                Filter = $"Id={id}"
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }
}