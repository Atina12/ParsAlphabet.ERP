using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.WF.Stage;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WF.Stage;

public class StageRepository : BaseRepository<StageModel, int, string>, IBaseRepository<StageModel, int, string>
{
    public readonly IHttpContextAccessor _accessor;

    public StageRepository(IConfiguration config, IHttpContextAccessor accessor) : base(config)
    {
        _accessor = accessor;
    }


    public GetColumnsViewModel StageGetColumns(long workFlowCategoryId)
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.BigInt, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 4
                },
                new()
                {
                    Id = "stageName", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = true, Width = 8
                },
                new()
                {
                    Id = "inoutName", Title = " دریافت/پرداخت", Type = (int)SqlDbType.NVarChar, IsPrimary = true,
                    IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "stageClass", Title = "کلاس مرحله", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WFApi/stageclassdropdown/" + workFlowCategoryId, Width = 6
                },
                new()
                {
                    Id = "documentType", Title = "نوع سند", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 6
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true,
                    IsFilterParameter = false, Size = 1, Align = "center", Width = 6
                }
            }
        };
        return list;
    }

    public async Task<MyResultPage<List<StageGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<StageGetPage>>
        {
            Data = new List<StageGetPage>()
        };

        var workFlowCategoryId = Convert.ToByte(model.Form_KeyValue[0]?.ToString());

        if (model.Filters == null) model.Filters = new List<FormKeyValue>();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("WorkFlowCategoryId", workFlowCategoryId);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("StageName",
            model.Filters.Any(x => x.Name == "stageName")
                ? model.Filters.FirstOrDefault(x => x.Name == "stageName").Value
                : null);
        parameters.Add("StageClass",
            model.Filters.Any(x => x.Name == "stageClass")
                ? model.Filters.FirstOrDefault(x => x.Name == "stageClass").Value
                : null);

        result.Columns = StageGetColumns(workFlowCategoryId);

        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_Stage_GetPage]";
            conn.Open();

            result.Data =
                (await conn.QueryAsync<StageGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<MemoryStream> CSV(NewGetPageViewModel model)
    {
        var workFlowCategoryId = Convert.ToByte(model.Form_KeyValue[0]?.ToString());

        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var Columns = string.Join(',',
            StageGetColumns(workFlowCategoryId).DataColumns.Where(x => x.IsDtParameter && x.Id != "action")
                .Select(z => z.Title));
        var getPage = await GetPage(model);

        var Rows = from p in getPage.Data
            select new
            {
                p.Id,
                p.StageName,
                p.InoutName,
                p.StageClass,
                p.DocumentType,
                p.Active
            };

        return csvStream = await csvGenerator.GenerateCsv(Rows, Columns.Split(',').ToList());
    }

    public async Task<StageDocumentType> GetStageDocumentType(int id)
    {
        var filter = $"Id={id} AND IsActive=1";

        var sQuery = "pb.Spc_Tables_GetTable";

        using (var conn = Connection)
        {
            conn.Open();

            var result = await Connection.QueryFirstOrDefaultAsync<StageDocumentType>(sQuery,
                new
                {
                    IsSecondLang = false,
                    TableName = "wf.Stage",
                    IdColumnName = "Id",
                    ColumnNameList =
                        "ISNULL(DocumentTypeId,0) Id,ISNULL((SELECT TOP 1 dt.Name FROM fm.DocumentType dt WHERE dt.Id=ISNULL(DocumentTypeId,0)),'') Name,StageClassId",
                    IdList = "",
                    Filter = filter,
                    OrderBy = ""
                }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetStageDropDownByWorkFlowId(string branchId, string workflowId,
        string workFlowCategoryId, string stageClassId, byte bySystem, byte isActive, byte roleId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_Stage_GetList_By_WorkflowId]";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    BranchId = branchId == "null" ? null : branchId,
                    WorkflowId = workflowId,
                    WorkFlowCategoryId = workFlowCategoryId,
                    IsActive = isActive,
                    BySystem = bySystem,
                    StageClassId = stageClassId,
                    RoleId = roleId
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> AdmissionStageGetDropDown(int workflowId, byte itemTypeId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_AdmissionStage_ByItemType]";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    ItemTypeId = itemTypeId,
                    WorkflowId = workflowId
                }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetStageDropDown(string workflowCategoryId, byte stageClassId,
        byte bySystem, byte isActive)
    {
        var filter = $"WorkflowCategoryId IN ({workflowCategoryId})";

        if (stageClassId != 0)
            filter += $" AND StageClassId={stageClassId}";

        if (bySystem != 2)
            filter += $" AND bySystem={bySystem}";

        if (isActive != 2)
            filter += $" AND isActive={isActive}";

        var sQuery = "pb.Spc_Tables_GetList";

        using (var conn = Connection)
        {
            conn.Open();

            var result = await Connection.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    IsSecondLang = false,
                    TableName = "wf.Stage",
                    IdColumnName = "Id",
                    TitleColumnName = "Name",
                    IdList = "",
                    Filter = filter,
                    OrderBy = ""
                }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<StageModel> GetStageById(int id)
    {
        var filter = $"Id={id}";

        var sQuery = "pb.Spc_Tables_GetTable";

        using (var conn = Connection)
        {
            conn.Open();

            var result = await Connection.QueryFirstOrDefaultAsync<StageModel>(sQuery,
                new
                {
                    IsSecondLang = false,
                    TableName = "wf.Stage",
                    IdColumnName = "Id",
                    ColumnNameList = "Id,Name,NameEng,ISNULL(InOut,0) InOut,StageClassId,IsActive",
                    IdList = "",
                    Filter = filter,
                    OrderBy = ""
                }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(string formName)
    {
        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_Stage_GetList_ByFormPlate]";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery, new { FormName = formName },
                commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetStageClassDropDown(short workflowCategoryId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_StageClass_GetList]";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new { WorkflowCategoryId = workflowCategoryId }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDownByWorkflowCategoryId(string workflowCategoryId,
        byte bySystem)
    {
        var sQuery = "pb.Spc_Tables_GetList";

        var filter = $"WorkflowCategoryId IN({workflowCategoryId}) AND IsActive=1";

        if (bySystem == 1)
            filter += " AND bySystem=1";
        else if (bySystem == 2)
            filter += " AND bySystem=0";


        using (var conn = Connection)
        {
            conn.Open();
            var result = await Connection.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "wf.Stage",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDownStageHasTreasurySubject()
    {
        var sQuery = "[fm].[Spc_TreasuryStage_IsTreasurySubject_Get]";
        MyClaim.Init(_accessor);
        using (var conn = Connection)
        {
            conn.Open();
            var result =
                await Connection.QueryAsync<MyDropDownViewModel>(sQuery, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<byte> GetPostingGroupType(int id)
    {
        var sQuery = "pb.Spc_Tables_GetItem";
        using (var conn = Connection)
        {
            conn.Open();
            var result = await Connection.ExecuteScalarAsync<byte>(sQuery,
                new
                {
                    TableName = "wf.Stage",
                    ColumnName = "PostingGroupTypeId",
                    Filter = $"Id={id}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<byte> GetInOut(int id)
    {
        var sQuery = "pb.Spc_Tables_GetItem";
        using (var conn = Connection)
        {
            conn.Open();
            var result = await Connection.ExecuteScalarAsync<byte>(sQuery,
                new
                {
                    TableName = "wf.Stage",
                    ColumnName = "InOut",
                    Filter = $"Id={id}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }


    public async Task<byte> GetStageClassId(long stageId)
    {
        if (stageId == 0)
            return 0;

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<byte>(sQuery,
                new
                {
                    TableName = "wf.Stage",
                    ColumnNameList = "StageClassId",
                    Filter = $"Id = {stageId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<bool> GetStageQuantity(long stageId)
    {
        if (stageId == 0)
            return false;

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<bool>(sQuery,
                new
                {
                    TableName = "wf.Stage",
                    ColumnNameList = "IsQuantity",
                    Filter = $"Id = {stageId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<byte> GetWorkflowCategoryId(long stageId)
    {
        if (stageId == 0)
            return 0;

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<byte>(sQuery,
                new
                {
                    TableName = "wf.Stage",
                    ColumnNameList = "WorkflowCategoryId",
                    Filter = $"Id = {stageId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<string> GetName(short stageId)
    {
        if (stageId == 0)
            return null;

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();

            var result = await conn.QueryFirstOrDefaultAsync<string>(sQuery,
                new
                {
                    TableName = "wf.Stage",
                    ColumnNameList = "Name",
                    Filter = $"Id = {stageId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetAllDropDowna()
    {
        var sQuery = "pb.Spc_Tables_GetList";
        using (var conn = Connection)
        {
            conn.Open();
            var result = await Connection.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "wf.Stage",
                    Filter = "IsActive=1"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }
}