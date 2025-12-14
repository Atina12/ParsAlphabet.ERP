using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.WF.StageFundItemType;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageFundItemType;

public class StageFundItemTypeRepository :
    BaseRepository<StageFundItemTypeModel, int, string>,
    IBaseRepository<StageFundItemTypeModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;

    public StageFundItemTypeRepository(IConfiguration config, IHttpContextAccessor accessor)
        : base(config)
    {
        _accessor = accessor;
    }

    public GetColumnsViewModel StageFundItemTypeGetColumns(short? p_WorkFlowCategoryId)
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.BigInt, IsDtParameter = true,
                    IsFilterParameter = false, Width = 8
                },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageApi/getdropdown/" + p_WorkFlowCategoryId + "/0/2/2", Width = 15
                },
                new() { Id = "stageId", Title = "مرحله", Type = (int)SqlDbType.BigInt, IsPrimary = true },
                new()
                {
                    Id = "fundItemTypeId", Title = p_WorkFlowCategoryId == 1 ? "نوع آیتم" : "نوع وجه", IsPrimary = true
                },
                new()
                {
                    Id = "fundTypeId", Title = "نوع وجه", Type = (int)SqlDbType.Int, IsFilterParameter = false,
                    Width = 6
                },
                new()
                {
                    Id = "fundTypeIdName", Title = p_WorkFlowCategoryId == 1 ? "نوع آیتم" : "نوع وجه",
                    Type = (int)SqlDbType.NVarChar, IsDtParameter = true, IsFilterParameter = true,
                    FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageFundItemTypeApi/stagefunditemtype_getdropdown/null/" +
                                    p_WorkFlowCategoryId + "",
                    Width = 10
                },
                new()
                {
                    Id = "postingGroupType", Title = "نوع ارتباط با حسابداری", Type = (int)SqlDbType.Int,
                    IsDtParameter = true, IsFilterParameter = false, Width = 10
                },
                new()
                {
                    Id = "fundItemTypeIdName", Title = "نوع وجه/گردش برگه", Type = (int)SqlDbType.Int,
                    IsDtParameter = true, IsFilterParameter = false, Width = 10
                },
                new()
                {
                    Id = "inOutIdName", Title = "دریافت/پرداخت", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2", FilterTypeApi = "/api/WFApi/inout_getdropdown",
                    Width = 8
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Align = "center",
                    Width = 6
                },
                new()
                {
                    Id = "workflowId", Title = "workflowId", Type = (int)SqlDbType.BigInt, IsFilterParameter = false,
                    Width = 4
                }
                //new DataColumnsViewModel { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width=9}
            }
        };
        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model)
    {
        var workFlowCategoryId = Convert.ToInt16(model.Form_KeyValue[0]?.ToString());
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                StageFundItemTypeGetColumns(workFlowCategoryId).DataColumns
                    .Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };
        var getPage = await GetPage(model);
        result.Rows = from p in getPage.Data
            select new
            {
                p.Id,
                p.stage,
                p.FundTypeIdName,
                p.PostingGroupType,
                p.FundItemTypeIdName,
                p.InOutIdName,
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };
        return result;
    }

    public async Task<MyResultPage<List<StageFundItemTypeGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<StageFundItemTypeGetPage>>
        {
            Data = new List<StageFundItemTypeGetPage>()
        };

        var p_WorkFlowCategoryId = Convert.ToInt16(model.Form_KeyValue[0]?.ToString());

        if (model.Filters == null) model.Filters = new List<FormKeyValue>();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("StageId",
            model.Filters.Any(x => x.Name == "stage")
                ? model.Filters.FirstOrDefault(x => x.Name == "stage").Value
                : null);
        parameters.Add("FundItemTypeId",
            model.Filters.Any(x => x.Name == "fundTypeIdName")
                ? model.Filters.FirstOrDefault(x => x.Name == "fundTypeIdName").Value
                : null);
        parameters.Add("InOut",
            model.Filters.Any(x => x.Name == "inOutIdName")
                ? model.Filters.FirstOrDefault(x => x.Name == "inOutIdName").Value
                : null);
        parameters.Add("workflowId",
            model.Filters.Any(x => x.Name == "workflowId")
                ? model.Filters.FirstOrDefault(x => x.Name == "workflowId").Value
                : null);
        parameters.Add("WorkflowCategoryId", p_WorkFlowCategoryId);


        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_StageFundItemType_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<StageFundItemTypeGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        result.Columns = StageFundItemTypeGetColumns(p_WorkFlowCategoryId);

        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetFundTypeListByStageIdAndWorkFlowCategoryId(string stageId,
        short? workFlowCategoryId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_StageFundItemType_GetList]";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery, new
            {
                StageId = stageId == "null" ? null : stageId,
                WorkFlowCategoryId = workFlowCategoryId ?? 0
            }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<List<StageFundItemTypeDropDown>> GetPreviousStageFundItemTypeListByStageId(int workflowId,
        short stageId, byte actionId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_Stage_PreviousFundType_List]";
            conn.Open();

            var result = (await conn.QueryAsync<StageFundItemTypeDropDown>(sQuery,
                new
                {
                    WorkflowId = workflowId,
                    StageId = stageId,
                    ActionId = actionId
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }

    public async Task<bool> GetHasStagePrevious(short stageId, int workflowId)
    {
        using (var conn = Connection)
        {
            MyClaim.Init(_accessor);
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<int>(sQuery,
                new
                {
                    TableName = "wf.StageAction",
                    ColumnName = "Id",
                    Filter = $"StageId={stageId} AND WorkflowId={workflowId} AND ISNULL(PreviousStageActionId,'')<>''",
                    OrderBy = ""
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result > 0;
        }
    }

    public async Task<byte> GetInOutId(GetStageFundItemTypeInOut model)
    {
        using (var conn = Connection)
        {
            MyClaim.Init(_accessor);
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();

            var result = (await conn.QueryAsync<byte>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    TableName = "wf.StageFundItemType",
                    ColumnNameList = "DISTINCT(InOut) InOut",
                    Filter = $"StageId={model.StageId} AND FundItemTypeId={model.FundItemTypeId}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result.Count() == 1 ? result.FirstOrDefault() : (byte)3;
        }
    }


    public async Task<List<byte>> GetFundItemTypeId(short stageId)
    {
        using (var conn = Connection)
        {
            MyClaim.Init(_accessor);
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();

            var result = (await conn.QueryAsync<byte>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    TableName = "wf.StageFundItemType",
                    ColumnNameList = "DISTINCT(FundItemTypeId) FundItemTypeId",
                    Filter = $"StageId={stageId}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
            return result;
        }
    }


    public async Task<Application.Dtos.WF.StageFundItemType.StageFundItemType> GetId(short stageId, int fundTypeId,
        int InOut = 0)
    {
        var filter = $"StageId={stageId} AND FundItemTypeId={fundTypeId}";
        if (InOut > 0)
            filter += $" AND InOut = {InOut}";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<Application.Dtos.WF.StageFundItemType.StageFundItemType>(
                sQuery,
                new
                {
                    IsSecondLang = false,
                    TableName = "wf.StageFundItemType",
                    IdColumnName = "Id",
                    ColumnNameList = "Id,FundItemType",
                    IdList = "",
                    Filter = filter,
                    OrderBy = ""
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<int> GetStageBankReport(long stageId, int fundTypeId, int inOut)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<int?>(sQuery,
                new
                {
                    TableName = "wf.StageFundItemType",
                    ColumnNameList = "BankReport",
                    Filter = $"StageId={stageId} AND FundItemTypeId = {fundTypeId} AND InOut = {inOut}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result == null ? 0 : result.Value;
        }
    }


    public async Task<bool> GetHasStageFundItemType(short stageId)
    {
        using (var conn = Connection)
        {
            MyClaim.Init(_accessor);
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<int>(sQuery,
                new
                {
                    TableName = "wf.StageFundItemType",
                    ColumnName = "Count(Id) Count",
                    Filter = $"StageId={stageId}",
                    OrderBy = ""
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result > 0;
        }
    }
}