using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.MC.AttenderPrescription;
using ParsAlphabet.ERP.Application.Interfaces.MC.AttenderPrescription;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.AttenderPrescription;

public class AttenderPrescriptionRepository : IAttenderPrescriptionRepository
{
    private readonly IHttpContextAccessor _accessor;
    private readonly IConfiguration _config;

    public AttenderPrescriptionRepository(IConfiguration config, IHttpContextAccessor accessor)
    {
        _config = config;
        _accessor = accessor;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            IsEditable = true,
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, Size = 0, IsFilterParameter = true,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "nationalCode", Title = "نمبر تذکره", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, Width = 11
                },
                new()
                {
                    Id = "fullName", Title = "نام", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 30
                },
                new() { Id = "roleId", Title = "شناسه نقش", Type = (int)SqlDbType.Int, Size = 0, Width = 10 },
                new()
                {
                    Id = "roleName", Title = "نام نقش", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsFilterParameter = true, IsDtParameter = true, Width = 33
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
                p.NationalCode,
                p.FullName,
                p.RoleId,
                p.RoleName,
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };
        return result;
    }

    public async Task<MyResultPage<List<AttenderPrescriptionGetPage>>> GetPage(GetPageViewModel model)
    {
        var result = new MyResultPage<List<AttenderPrescriptionGetPage>>
        {
            Data = new List<AttenderPrescriptionGetPage>()
        };

        var totalRecord = 0;
        var p_id = 0;
        string p_name = "", p_roleName = "";

        switch (model.FieldItem)
        {
            case "id":
                p_id = Convert.ToInt32(model.FieldValue);
                break;
            case "fullName":
                p_name = model.FieldValue;
                break;
            case "roleName":
                p_roleName = model.FieldValue;
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("KeyId", int.Parse(model.Form_KeyValue[0]?.ToString()));
        parameters.Add("Id", p_id);
        parameters.Add("Name", p_name);
        parameters.Add("RoleName", p_roleName);
        parameters.Add("SelectedAttender", Convert.ToInt32(model.Form_KeyValue[1]?.ToString()) == 1);
        parameters.Add("TotalRecord", dbType: DbType.Int32, direction: ParameterDirection.Output);
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_AttenderPrescription_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<AttenderPrescriptionGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
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

    public async Task<MyResultPage<AttenderPrescriptionGetRecord>> GetRecordBy_AttenderPrescription(
        Get_AttenderPrescription model)
    {
        var result = new MyResultPage<AttenderPrescriptionGetRecord>
        {
            Data = new AttenderPrescriptionGetRecord()
        };

        using (var conn = Connection)
        {
            conn.Open();
            var sQuery = "pb.Spc_Tables_GetRecord";
            result.Data = await conn.QueryFirstOrDefaultAsync<AttenderPrescriptionGetRecord>(sQuery, new
            {
                TableName = "mc.AttenderAssistant",
                Filter = $"AttenderId={model.AttenderId} AND UserId={model.UserId} AND CompanyId={model.CompanyId}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultQuery> Save(AttenderPrescriptionModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_AttenderPrescription_Save";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                model.AttenderId,
                model.UserId,
                model.IsActive,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = true;
        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(int userId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_GetAttender_ByAssistantPrescription]";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    UserId = userId,
                    CompanyId = companyId
                },
                commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<short>> GetAttenderIdByUserId(int userId, int companyId)
    {
        MyClaim.Init(_accessor);
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();
            var result = await conn.QueryAsync<short>(sQuery, new
            {
                MyClaim.IsSecondLang,
                TableName = "mc.AttenderAssistant",
                IdColumnName = "UserId",
                ColumnNameList = "AttenderId",
                IdList = "",
                Filter = $"UserId={userId} AND CompanyId={companyId}",
                OrderBy = ""
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result.ToList();
        }
    }
}