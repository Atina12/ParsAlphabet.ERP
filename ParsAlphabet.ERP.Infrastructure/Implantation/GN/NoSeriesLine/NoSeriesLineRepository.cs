using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.GN.NoSeriesLine;
using ParsAlphabet.ERP.Application.Interfaces.GN.NoSeriesLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.Stage;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.GN.NoSeriesLine;

public class NoSeriesLineRepository : INoSeriesLineRepository
{
    private readonly IHttpContextAccessor _accessor;
    private readonly IConfiguration _config;
    private readonly StageRepository _stageRepository;

    public NoSeriesLineRepository(IConfiguration config,
        IHttpContextAccessor accessor,
        StageRepository stageRepository)
    {
        _config = config;
        _accessor = accessor;
        _stageRepository = stageRepository;
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
                    Id = "id", Title = "شماره سطر", Type = (int)SqlDbType.TinyInt, Width = 6, IsDtParameter = true,
                    FilterType = "number"
                },
                new()
                {
                    Id = "headerId", Title = "شناسه", Type = (int)SqlDbType.TinyInt, Width = 6, IsDtParameter = false
                },
                new()
                {
                    Id = "seriesName", Title = "گروه تفصیل", Type = (int)SqlDbType.NVarChar, Size = 50, Width = 7,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/GN/NoSeriesLineApi/getdropdown_noseries"
                },
                new()
                {
                    Id = "startNo", Title = "نقطه شروع", Type = (int)SqlDbType.Int, Size = 16, Width = 13,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "number"
                },
                new()
                {
                    Id = "endNo", Title = "نقطه پایان", Type = (int)SqlDbType.Int, Size = 50, Width = 7,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "number"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 9 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "editNoSeriesLine", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green"
                },
                new()
                {
                    Name = "deleteNoSeriesLine", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon"
                }
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
                p.HeaderId,
                p.SeriesName,
                p.StartNo,
                p.EndNo
            };
        return result;
    }

    public async Task<MyResultPage<List<NoSeriesLineGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<NoSeriesLineGetPage>>
        {
            Data = new List<NoSeriesLineGetPage>()
        };

        var p_headerId = Convert.ToInt32(model.Form_KeyValue[0]?.ToString());


        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("HeaderId",
            model.Filters.Any(x => x.Name == "seriesName")
                ? model.Filters.FirstOrDefault(x => x.Name == "seriesName").Value
                : null);
        parameters.Add("StartNo",
            model.Filters.Any(x => x.Name == "startNo")
                ? model.Filters.FirstOrDefault(x => x.Name == "startNo").Value
                : null);
        parameters.Add("EndNo",
            model.Filters.Any(x => x.Name == "endNo")
                ? model.Filters.FirstOrDefault(x => x.Name == "endNo").Value
                : null);
        parameters.Add("CompanyId", model.CompanyId);
        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_NoSeriesLine_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<NoSeriesLineGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultPage<NoSeriesLineGetRecord>> GetRecordById(int lineNo, int HeaderId, int companyId)
    {
        var result = new MyResultPage<NoSeriesLineGetRecord>();
        result.Data = new NoSeriesLineGetRecord();
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();
            result.Data = await conn.QueryFirstOrDefaultAsync<NoSeriesLineGetRecord>(sQuery, new
            {
                MyClaim.IsSecondLang,
                TableName = "gn.NoSeriesLine",
                IdColumnName = "",
                ColumnNameList = "HeaderId,[LineNo],StartNo,EndNo",
                IdList = "",
                Filter = $"[LineNo]={lineNo} AND HeaderId = {HeaderId} AND CompanyId={companyId}",
                OrderBy = ""
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<MyResultQuery> Insert(NoSeriesLineModel model)
    {
        var result = new MyResultQuery();
        var validationError = await Validate(model);
        if (validationError.Count > 0)
            return new MyResultQuery
            {
                Status = -100,
                Successfull = false,
                ValidationErrors = validationError
            };


        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_NoSeriesLine_InsUpd]";
            conn.Open();
            result = await conn.QueryFirstAsync<MyResultQuery>(sQuery, new
            {
                model.Opr,
                Id = model.LineNo,
                model.HeaderId,
                model.StartNo,
                model.EndNo,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
        }

        result.StatusMessage = result.StatusMessage;

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultQuery> Update(NoSeriesLineModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_NoSeriesLine_InsUpd]";
            conn.Open();
            result = await conn.QueryFirstAsync<MyResultQuery>(sQuery, new
            {
                model.Opr,
                Id = model.LineNo,
                model.HeaderId,
                model.StartNo,
                model.EndNo,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
        }

        result.StatusMessage = result.StatusMessage;

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<MyResultQuery> Delete(int lineNo, int HeaderId, int companyId)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "gn.Spc_NoSeriesLine_Delete";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                HeaderId,
                LineNo = lineNo,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDownNoSeries(int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_NoSeries_GetList]";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    companyId
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetDropDownNoSeriesByWorkflowId(int workflowCategoryId,
        int accountGlId, int accountSGLId)
    {
        var filter = "1=1";

        switch (workflowCategoryId)
        {
            case 1:
                filter = "Purchase = 1";
                break;

            case 3:
                filter = "Sale = 1";
                break;

            case 6:
                filter = "Treasury = 1";
                break;

            case 7:
                filter = "FixedAsset = 1";
                break;

            case 11:
                filter = "Warehouse = 1";
                break;
        }

        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_NoSeries_ByWorkflowId_GetList]";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    AccountGLId = accountGlId,
                    AccountSGLId = accountSGLId,
                    filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetDropDownByGlSgl(int accountGlId, int accountSGLId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetList]";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    IsSecondLang = 0,
                    TableName = "gn.NoSeries",
                    IdColumnName = "",
                    TitleColumnName = "",
                    Filter =
                        $"Id IN(SELECT  NoSeriesId FROM fm.AccountSGLNoSeries WHERE AccountGLId={accountGlId} AND AccountSGLId={accountSGLId})"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetDropDownBankAccount(short bankId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_BankAccount_GetList]";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    bankId,
                    companyId
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetDropDownByBankCategoryId(short bankCategoryId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetList]";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    IsSecondLang = 0,
                    TableName = "fm.BankAccount",
                    IdColumnName = "id",
                    TitleColumnName = "Name",
                    //IdList = null,
                    Filter = $"BankAccountCategoryId={bankCategoryId}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<short> GetBankId(short id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<short>(sQuery,
                new
                {
                    TableName = "fm.BankAccount",
                    ColumnName = "BankId",
                    Filter = $"Id={id} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<string> GetAccountName(short id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "fm.BankAccount",
                    ColumnName = "Name",
                    Filter = $"Id={id} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<int> GetNoSeriesId(string tableName, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "gn.NoSeries",
                    ColumnName = "Id",
                    Filter = $"TableName='{tableName}' AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetDropDownByNextStage(byte workflowCategoryId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_NoSeriesNextStage_GetList]";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    WorkflowCategoryId = workflowCategoryId
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetNextStageActionNoseries(short previousStageId, short branchId)
    {
        var workflowCategoryId = await _stageRepository.GetWorkflowCategoryId(previousStageId);
        var filter = "1=1";
        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_NextStage_NoSeries_List]";
            switch (workflowCategoryId)
            {
                case 1:
                    filter = "nsans.Purchase = 1";
                    break;

                case 3:
                    filter = "nsans.Sale = 1";
                    break;

                case 6:
                    filter = "nsans.Treasury = 1";
                    break;

                case 7:
                    filter = "nsans.FixedAsset = 1";
                    break;

                case 11:
                    filter = "nsans.Warehouse = 1";
                    break;
            }

            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery, new
            {
                PreviousStageId = previousStageId,
                BranchId = branchId,
                Filter = filter
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result.AsList();
        }
    }

    public async Task<bool> CheckNoSeriesLineRang(int StartNo, int EndNo, int CompanyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[GN].[Spc_CheckNoSeriesLine_Rang]";
            conn.Open();

            var result = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                StartNo,
                EndNo,
                CompanyId
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result > 0;
        }
    }

    public async Task<List<string>> Validate(NoSeriesLineModel model)
    {
        var error = new List<string>();

        if (model == null)
        {
            error.Add("درخواست معتبر نمی باشد");
            return error;
        }

        await Task.Run(async () =>
        {
            var resultCheckFiscalYear = await CheckNoSeriesLineRang(model.StartNo, model.EndNo, model.CompanyId);

            if (resultCheckFiscalYear) error.Add("نقطه ی شروع و پایان محدوده ی  وارد شده وجود دارد");
        });

        return error;
    }
}