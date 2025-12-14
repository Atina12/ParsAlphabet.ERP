using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.SM.SegmentLine;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.SM.SegmentLine;

public class SegmentLineRepository :
    BaseRepository<SegmentLineModel, int, string>,
    IBaseRepository<SegmentLineModel, int, string>
{
    public SegmentLineRepository(IConfiguration config) : base(config)
    {
    }

    public new GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            IsEditable = false,
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "personId", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.TinyInt,
                    IsDtParameter = true, IsFilterParameter = true, Width = 6
                },
                new()
                {
                    Id = "name", Title = "نام", IsPrimary = true, Type = (int)SqlDbType.NVarChar, Size = 101,
                    IsDtParameter = true, IsFilterParameter = true, Width = 20
                }
            }
        };

        return list;
    }

    public async Task<MyResultPage<SegmentLineGetPage>> GetSegmentLineDiAssign(GetPageViewModel model)
    {
        var result = new MyResultPage<SegmentLineGetPage>
        {
            Data = new SegmentLineGetPage()
        };

        int totalRecord, p_id = 0;
        var p_personName = "";

        switch (model.FieldItem)
        {
            case "personId":
                p_id = Convert.ToInt32(model.FieldValue);
                break;
            case "name":
                p_personName = model.FieldValue;
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id", model.Form_KeyValue[0]?.ToString());
        parameters.Add("PersonGroupType", model.Form_KeyValue[1]?.ToString());
        parameters.Add("PersonId", p_id);
        parameters.Add("PersonName", p_personName);
        parameters.Add("CompanyId", model.CompanyId);
        parameters.Add("TotalRecord", dbType: DbType.Int32, direction: ParameterDirection.Output);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "[sm].[Spc_SegmentLine_diAssign]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<SegmentLineGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).FirstOrDefault();
        }

        if (result.Data != null && (result.Data.PersonsdiAssign != "" || result.Data.PersonsdiAssign != null))
            result.Data.Assigns = JsonConvert.DeserializeObject<List<Persons>>(result.Data.PersonsdiAssign);
        totalRecord = parameters.Get<int>("TotalRecord");
        if (result.Data != null && result.Data.Assigns != null && model.PageRowsCount != 0)
        {
            result.TotalRecordCount = totalRecord;
            if (result.TotalRecordCount % model.PageRowsCount == 0)
                result.MaxPageCount = Convert.ToInt32(result.TotalRecordCount / model.PageRowsCount);
            else
                result.MaxPageCount = Convert.ToInt32(result.TotalRecordCount / model.PageRowsCount) + 1;

            result.PageStartRow = (model.PageNo - 1) * model.PageRowsCount + 1;
            result.PageEndRow = result.PageStartRow + result.Data.Assigns.Count - 1;
        }

        return result;
    }

    public async Task<MyResultPage<SegmentLineGetPage>> GetSegmentLineAssign(GetPageViewModel model)
    {
        var result = new MyResultPage<SegmentLineGetPage>
        {
            Data = new SegmentLineGetPage()
        };

        int totalRecord, p_id = 0;
        var p_personName = "";

        switch (model.FieldItem)
        {
            case "personId":
                p_id = Convert.ToInt32(model.FieldValue);
                break;
            case "name":
                p_personName = model.FieldValue;
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id", model.Form_KeyValue[0]?.ToString());
        parameters.Add("PersonGroupType", model.Form_KeyValue[1]?.ToString());
        parameters.Add("PersonId", p_id);
        parameters.Add("PersonName", p_personName);
        parameters.Add("CompanyId", model.CompanyId);
        parameters.Add("TotalRecord", dbType: DbType.Int32, direction: ParameterDirection.Output);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "[sm].[Spc_SegmentLine_Assign]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<SegmentLineGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).FirstOrDefault();
        }


        if (result.Data != null && (result.Data.PersonsAssign != "" || result.Data.PersonsAssign != null))
            result.Data.Assigns = JsonConvert.DeserializeObject<List<Persons>>(result.Data.PersonsAssign);

        totalRecord = parameters.Get<int>("TotalRecord");

        if (result.Data != null && result.Data.Assigns != null && model.PageRowsCount != 0)
        {
            result.TotalRecordCount = totalRecord;
            if (result.TotalRecordCount % model.PageRowsCount == 0)
                result.MaxPageCount = Convert.ToInt32(result.TotalRecordCount / model.PageRowsCount);
            else
                result.MaxPageCount = Convert.ToInt32(result.TotalRecordCount / model.PageRowsCount) + 1;

            result.PageStartRow = (model.PageNo - 1) * model.PageRowsCount + 1;
            result.PageEndRow = result.PageStartRow + result.Data.Assigns.Count - 1;
        }

        return result;
    }

    public async Task<MyResultQuery> SegmentLineAssign(SegmentLineAssign model)
    {
        var personIds = model.Assign.Select(a => a.Id).ToList();
        var result = new MyResultQuery();

        try
        {
            using (var conn = Connection)
            {
                var sQuery = "sm.Spc_SegmentLine_InsDel";
                conn.Open();
                result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
                {
                    Opr = "Ins",
                    model.Id,
                    PersonGroupType = model.PersonGroupTypeId,
                    PersonIds = string.Join(',', personIds)
                }, commandType: CommandType.StoredProcedure);
            }
        }
        catch (Exception)
        {
        }


        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultQuery> SegmentLineDiAssign(SegmentLineAssign model)
    {
        var personIds = model.Assign.Select(a => a.Id).ToList();
        var result = new MyResultQuery();
        try
        {
            using (var conn = Connection)
            {
                var sQuery = "sm.Spc_SegmentLine_InsDel";
                conn.Open();
                result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
                {
                    Opr = "Del",
                    model.Id,
                    PersonGroupType = model.PersonGroupTypeId,
                    PersonIds = string.Join(',', personIds)
                }, commandType: CommandType.StoredProcedure);
            }
        }
        catch (Exception)
        {
        }


        result.Successfull = result.Status == 100;
        return result;
    }
}