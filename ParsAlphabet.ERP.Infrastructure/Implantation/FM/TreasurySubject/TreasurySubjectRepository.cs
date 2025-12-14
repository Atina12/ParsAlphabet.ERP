using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.FM.TreasurySubject;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.TreasurySubject;

public class TreasurySubjectRepository :
    BaseRepository<TreasurySubjectModel, int, string>,
    IBaseRepository<TreasurySubjectModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;

    public TreasurySubjectRepository(IConfiguration config, IHttpContextAccessor accessor)
        : base(config)
    {
        _accessor = accessor;
    }

    public new GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, Width = 8, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number"
                },
                new()
                {
                    Id = "treasurySubjectName", Title = "موضوع خزانه", Type = (int)SqlDbType.NVarChar, Size = 100,
                    Width = 20, IsDtParameter = true, IsFilterParameter = true
                },
                new()
                {
                    Id = "cashFlowCategoryName", Title = "طبقه بندی گردش وجوه", Type = (int)SqlDbType.NVarChar,
                    Size = 50, Width = 15, IsDtParameter = true, IsFilterParameter = true
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 6,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 51 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "gettreasurysubject", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green"
                },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" }
            }
        };

        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model)
    {
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
                p.TreasurySubjectName,
                p.CashFlowCategoryName,
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };
        return result;
    }

    public async Task<MyResultPage<List<TreasurySubjectGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<TreasurySubjectGetPage>>();
        result.Data = new List<TreasurySubjectGetPage>();

        MyClaim.Init(_accessor);

        if (model.Filters == null) model.Filters = new List<FormKeyValue>();

        var parameters = new DynamicParameters();
        parameters.Add("IsSecondLang", MyClaim.IsSecondLang);
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "treasurySubjectName")
                ? model.Filters.FirstOrDefault(x => x.Name == "treasurySubjectName").Value
                : null);
        parameters.Add("CashFlowCategoryName",
            model.Filters.Any(x => x.Name == "cashFlowCategoryName")
                ? model.Filters.FirstOrDefault(x => x.Name == "cashFlowCategoryName").Value
                : null);

        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);


        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasurySubject_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<TreasurySubjectGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<TreasurySubjectGetRecord> GetRecordTreasurySubject(short id)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasurySubject_GetRecord]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<TreasurySubjectGetRecord>(sQuery, new
            {
                TreasurySubjectId = id
            }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<string> GetAccountDetailName(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "fm.AccountDetail",
                    ColumnName = "Name",
                    Filter = $"Id={id}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<byte> GetCashFlowCategoryId(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<byte>(sQuery,
                new
                {
                    TableName = "fm.TreasurySubject",
                    ColumnName = "CashFlowCategoryId",
                    Filter = $"Id={id} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<short> GetStageId(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<short>(sQuery,
                new
                {
                    TableName = "fm.TreasurySubject",
                    ColumnName = "ISNULL(StageId,0)",
                    Filter = $"Id={id} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<TreasurySubjectAccountGLSGL> GetAccountGLSGLInfo(GetTreasurySubjectGLSGL model, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasurySubject_AccountGLSGL_Info]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<TreasurySubjectAccountGLSGL>(sQuery,
                new
                {
                    TreasurySubjectId = model.Id,
                    model.BranchId,
                    model.StageId,
                    CompanyId = companyId
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<MyResultStatus> Save(TreasurySubjectModel model)
    {
        var result = new MyResultStatus();
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasurySubject_InsUpd]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.Opr,
                model.IsSecondLang,
                model.Id,
                model.Name,
                model.CashFlowCategoryId,
                model.IsActive,
                model.CompanyId,
                StageIds = JsonConvert.SerializeObject(model.StageIdList)
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public virtual async Task<MyResultQuery> DeleteByTreasurySubjectId(int id)
    {
        var result = new MyResultQuery();

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecordWithFilter";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery,
                new { TableName = "fm.TreasurySubjectLine", Filter = $"TreasurySubjectId = {id}" },
                commandType: CommandType.StoredProcedure);
            result.ValidationErrors = new List<string>();
            conn.Close();
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetTreasurySubjectByStageDropDown(short stageId,
        byte WorkflowCategoryId, byte StageClassId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasurySubject_ByStage_GetList]";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    StageId = stageId,
                    WorkflowCategoryId,
                    StageClassId
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }
}