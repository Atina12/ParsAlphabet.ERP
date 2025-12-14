using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionImagingTemplate;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionImagingTemplate;

public class AdmissionImagingTemplateRepository :
    BaseRepository<AdmissionImagingTemplateModel, int, string>,
    IBaseRepository<AdmissionImagingTemplateModel, int, string>
{
    public AdmissionImagingTemplateRepository(IConfiguration config) : base(config)
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
                    IsFilterParameter = true, FilterType = "number", Width = 5
                },
                new()
                {
                    Id = "subject", Title = "نام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 25
                },
                new()
                {
                    Id = "code", Title = "کد", Type = (int)SqlDbType.VarChar, Size = 30, IsDtParameter = true,
                    IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "attender", Title = "رادیولوژیست", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/MC/AttenderApi/getTemplateByAttender", Width = 15
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.VarChar, Size = 30,
                    IsDtParameter = true, Width = 5
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 60 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" }
            }
        };

        return list;
    }

    public async Task<MyResultPage<List<AdmissionImagingTemplateGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<AdmissionImagingTemplateGetPage>>
        {
            Data = new List<AdmissionImagingTemplateGetPage>()
        };


        var parameters = new DynamicParameters();

        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("AttenderId",
            model.Filters.Any(x => x.Name == "attender")
                ? model.Filters.FirstOrDefault(x => x.Name == "attender").Value
                : null);
        parameters.Add("Code",
            model.Filters.Any(x => x.Name == "code")
                ? model.Filters.FirstOrDefault(x => x.Name == "code").Value
                : null);
        parameters.Add("UserId", Convert.ToInt32(model.Form_KeyValue[0]?.ToString()));

        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);


        result.Columns = GetColumns();

        var sQuery = "[mc].[Spc_AdmissionImagingTemplate_GetPage]";

        using (var conn = Connection)
        {
            conn.Open();
            result.Data =
                (await Connection.QueryAsync<AdmissionImagingTemplateGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultStatus> Save(AdmissionImagingTemplateModel model)
    {
        var result = new MyResultStatus();

        var sQuery = "[mc].[Spc_AdmissionImagingTemplate_InsUpd]";
        using (var conn = Connection)
        {
            conn.Open();
            result = await Connection.QueryFirstAsync<MyResultStatus>(sQuery, new
            {
                model.Id,
                Code = model.Code.ConvertArabicAlphabet(),
                Subject = model.Subject.ConvertArabicAlphabet(),
                model.AttenderId,
                model.CreateDateTime,
                Template = model.Template.ConvertArabicAlphabet(),
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<AdmissionImagingTemplateGetRecord> GetRecordById(int id, int companyId)
    {
        var sQuery = "pb.Spc_Tables_GetRecord";
        using (var conn = Connection)
        {
            conn.Open();
            var result = await Connection.QueryFirstAsync<AdmissionImagingTemplateGetRecord>(sQuery, new
            {
                IsSecondLang = false,
                TableName = "mc.AdmissionImagingTemplate",
                Filter = $"Id={id} AND CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);
            ;
            conn.Close();
            return result;
        }
    }

    public async Task<MyResultQuery> Delete(int keyvalue, int CompanyId)
    {
        var result = new MyResultQuery();
        var sQuery = "pb.Spc_Tables_DelRecordWithFilter";
        using (var conn = Connection)
        {
            conn.Open();
            result = await Connection.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                TableName = "mc.AdmissionImagingTemplate",
                Filter = $"Id={keyvalue} AND CompanyId={CompanyId}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDownByUserId(int userId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionImagingTemplate_GetList]";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    UserId = userId,
                    CompanyId = companyId
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<string> GetTemplateById(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "mc.AdmissionImagingTemplate",
                    ColumnName = "Template",
                    Filter = $"Id={id} AND CompanyId={companyId}",
                    OrderBy = ""
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }
}