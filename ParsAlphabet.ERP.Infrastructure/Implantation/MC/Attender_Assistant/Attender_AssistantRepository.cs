using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.MC.Attender_Assistant;
using ParsAlphabet.ERP.Application.Interfaces.MC.Attender_Assistant;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.Attender_Assistant;

public class Attender_AssistantRepository : IAttender_AssistantRepository
{
    private readonly IConfiguration _config;

    public Attender_AssistantRepository(IConfiguration config)
    {
        _config = config;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public GetColumnsViewModel GetColumns(string formType)
    {
        if (formType == "attenderassistant")
        {
            var list = new GetColumnsViewModel
            {
                IsEditable = true,
                DataColumns = new List<DataColumnsViewModel>
                {
                    new()
                    {
                        Id = "id", Title = "شناسه", IsPrimary = true, Type = (int)SqlDbType.Int, Size = 0,
                        IsFilterParameter = true, IsDtParameter = true, Width = 6
                    },
                    new()
                    {
                        Id = "fullName", Title = "نام", Type = (int)SqlDbType.NVarChar, Size = 100,
                        IsDtParameter = true, IsFilterParameter = true, Width = 30
                    },
                    new()
                    {
                        Id = "nationalCode", Title = "نمبر تذکره", Type = (int)SqlDbType.VarChar, Size = 10,
                        IsDtParameter = true, Width = 11
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
        else
        {
            var list = new GetColumnsViewModel
            {
                IsEditable = true,
                DataColumns = new List<DataColumnsViewModel>
                {
                    new()
                    {
                        Id = "attender", Title = "طبیب", Type = (int)SqlDbType.NVarChar, Size = 100,
                        IsDtParameter = true, IsFilterParameter = true, Width = 30
                    },
                    new()
                    {
                        Id = "department", Title = "دپارتمان", Type = (int)SqlDbType.NVarChar, Size = 0,
                        IsDtParameter = true, IsFilterParameter = true, Width = 20
                    },
                    new()
                    {
                        Id = "speciality", Title = "تخصص", Type = (int)SqlDbType.NVarChar, Size = 0,
                        IsDtParameter = true, IsFilterParameter = true, Width = 20
                    },
                    new()
                    {
                        Id = "attenderIsActive", Title = "وضعیت طبیب", Type = (int)SqlDbType.Bit, Size = 1,
                        IsDtParameter = true, Width = 10, Align = "center"
                    },
                    new()
                    {
                        Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, Size = 1, IsDtParameter = true,
                        Width = 10, Align = "center", Editable = true, InputType = "checkbox"
                    },
                    new() { Id = "id", IsPrimary = true }
                }
            };

            return list;
        }
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model, string formType)
    {
        model.PageNo = 0;
        model.PageRowsCount = 0;

        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                GetColumns(formType).DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
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

    public async Task<MyResultPage<List<AttenderAssistantGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<AttenderAssistantGetPage>>
        {
            Data = new List<AttenderAssistantGetPage>()
        };

        int? p_id = null;
        string p_name = null, p_roleName = null;

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
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "fullName")
                ? model.Filters.FirstOrDefault(x => x.Name == "fullName").Value
                : null);
        parameters.Add("RoleName",
            model.Filters.Any(x => x.Name == "roleName")
                ? model.Filters.FirstOrDefault(x => x.Name == "roleName").Value
                : null);
        parameters.Add("SelectedAssistant", Convert.ToInt32(model.Form_KeyValue[1]?.ToString()) == 1);
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumns("attenderassistant");

        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_AttenderAssistant_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<AttenderAssistantGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultPage<List<AssistantAttenderGetPage>>> GetPageAssistant(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<AssistantAttenderGetPage>>
        {
            Data = new List<AssistantAttenderGetPage>()
        };

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("KeyId", int.Parse(model.Form_KeyValue[0]?.ToString()));
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "attender")
                ? model.Filters.FirstOrDefault(x => x.Name == "attender").Value
                : null);
        parameters.Add("DepartmentName",
            model.Filters.Any(x => x.Name == "department")
                ? model.Filters.FirstOrDefault(x => x.Name == "department").Value
                : null);
        parameters.Add("SpecialityName",
            model.Filters.Any(x => x.Name == "speciality")
                ? model.Filters.FirstOrDefault(x => x.Name == "speciality").Value
                : null);
        parameters.Add("SelectedAssistant", Convert.ToInt32(model.Form_KeyValue[1]?.ToString()) == 1);
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumns("assistantattender");

        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_AssistantAttender_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<AssistantAttenderGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultPage<Attender_AssistantGetRecord>> GetRecordBy_Attender_Assistant(
        Get_Attender_Assistant model)
    {
        var result = new MyResultPage<Attender_AssistantGetRecord>
        {
            Data = new Attender_AssistantGetRecord()
        };

        using (var conn = Connection)
        {
            conn.Open();
            var sQuery = "pb.Spc_Tables_GetRecord";
            result.Data = await conn.QueryFirstOrDefaultAsync<Attender_AssistantGetRecord>(sQuery, new
            {
                TableName = "mc.AttenderAssistant",
                Filter = $"AttenderId={model.AttenderId} AND UserId={model.UserId} AND CompanyId={model.CompanyId}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultQuery> Save(Attender_AssistantModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_AttenderAssistant_Save";
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

    public async Task<List<MyDropDownViewModel>> GetDropDown(int userid, int CompanyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_GetAttender_ByAssistant]";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    UserId = userid,
                    CompanyId
                },
                commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }


    public async Task<List<MyDropDownViewModel>> GetAttenderIsParaClinic(int userid, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_GetAttenderIsParaClinic_ByAssistant]";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    UserId = userid,
                    CompanyId = companyId
                },
                commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<int>> NewGetAttendersByUserId(int userId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();
            var result = await conn.QueryAsync<int>(sQuery, new
            {
                TableName = "[mc].[AttenderAssistant]",
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