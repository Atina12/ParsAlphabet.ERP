using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.WF;
using ParsAlphabet.ERP.Application.Interfaces.WF;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WF;

public class WFRepository : IWFRepository
{
    private readonly IHttpContextAccessor _accessor;
    private readonly IConfiguration _config;

    public WFRepository(IConfiguration config,
        IHttpContextAccessor accessor)
    {
        _config = config;
        _accessor = accessor;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public List<MyDropDownViewModel> InOut_GetDropDown()
    {
        return new List<MyDropDownViewModel>
        {
            new() { Id = 1, Name = "دریافت" },
            new() { Id = 2, Name = "پرداخت" }
        };
    }

    public async Task<List<MyDropDownViewModel>> StageClassDropDown(byte workflowCategoryId)
    {
        using (var conn = Connection)
        {
            MyClaim.Init(_accessor);
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    TableName = "wf.StageClass",
                    Filter =
                        $" Id IN (SELECT StageClassId FROM wf.Stage WHERE WorkflowCategoryId IN({workflowCategoryId}) )"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> WorkFlowCategory_GetDropDown()
    {
        using (var conn = Connection)
        {
            MyClaim.Init(_accessor);
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    TableName = "wf.WorkflowCategory"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> StageFundType_GetDropDown(short stageId)
    {
        using (var conn = Connection)
        {
            MyClaim.Init(_accessor);
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    TableName = "wf.StageFundItemType",
                    IdColumnName = "FundItemTypeId",
                    ColumnNameList = "FundItemTypeId Id,(SELECT Name FROM fm.FundType WHERE Id=FundItemTypeId) Name",
                    IdList = "",
                    Filter = $"StageId={stageId}",
                    OrderBy = "FundItemTypeId"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<MyResultPage<TreasurySubjectStage>> GetTreasurySubjectStage(short stageId)
    {
        var result = new MyResultPage<TreasurySubjectStage>();
        using (var conn = Connection)
        {
            MyClaim.Init(_accessor);
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();

            result.Data = await conn.QueryFirstOrDefaultAsync<TreasurySubjectStage>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    TableName = "wf.StageStep",
                    Filter = $"StageId={stageId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<MyResultPage<int>> CheckStageHasPreviousId(short stageId)
    {
        var result = new MyResultPage<int>();
        using (var conn = Connection)
        {
            MyClaim.Init(_accessor);
            var sQuery = @"select COUNT(sftp.StageFundTypeId) from wf.StageFundTypePrevious sftp
                                  INNER JOIN wf.StageFundType sft ON sftp.StageFundTypeId=sft.Id
                                  WHERE StageId=@StageId";
            conn.Open();

            var exist = await conn.ExecuteScalarAsync<bool>(sQuery,
                new
                {
                    StageId = stageId
                });

            result.Data = exist ? 1 : 0;

            return result;
        }
    }

    public async Task<MyResultPage<HeaderBalanceRemaining>> HeaderBalance(GetHeaderBalanceRemainingViewModel model)
    {
        var result = new MyResultPage<HeaderBalanceRemaining>();
        using (var conn = Connection)
        {
            var sQuery = "[wf].[SPC_MidSystem_HeaderBalanceByRequestId]";
            conn.Open();

            result.Data =
                await conn.QueryFirstOrDefaultAsync<HeaderBalanceRemaining>(sQuery, model,
                    commandType: CommandType.StoredProcedure);

            conn.Close();

            result.Data.Status = result.Data.Amount != 0 ? -100 : 100;
            result.Data.Successfull = result.Data.Status == 100 ? result.Successfull : false;
            result.Data.StatusMessage = !result.Data.Successfull
                ? "شناسه  فوق دارای مانده است  ، امکان تغییر گام را ندارید"
                : "";
            return result;
        }
    }

    public async Task<List<PostGroupLineFooter>> GetPostGroupLineFooter(PostGroupFooterModel model, int companyId)
    {
        var result = new List<PostGroupLineFooter>();

        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_ObjectDocumentLine_Footer]";
            result = (await conn.QueryAsync<PostGroupLineFooter>(sQuery, new
            {
                ObjectDocumentLineId = model.Id,
                model.WorkflowCategoryId,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }
}