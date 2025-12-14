using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Interfaces.Redis;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;

public class StageActionRepository :
    BaseRepository<StageActionModel, int, string>,
    IBaseRepository<StageActionModel, int, string>
{
    public readonly IHttpContextAccessor _accessor;
    private readonly IRedisService _redisService;

    public StageActionRepository(IConfiguration config, IRedisService redisService, IHttpContextAccessor accessor) :
        base(config)
    {
        _accessor = accessor;
        _redisService = redisService;
    }

    public GetColumnsViewModel StageActionGetColumns(bool isTreasury, bool isPurchase, bool isWarehouse)
    {
        var filterType = "";
        var stageFilterType = "";
        if (isTreasury)
        {
            filterType = "/api/WF/StageActionApi/getdropdown/6/2/null";
            stageFilterType = "/api/WF/StageApi/getdropdown/6/0/2/2";
        }
        else if (isPurchase)
        {
            filterType = "/api/WF/StageActionApi/getdropdown/1/2/null";
            stageFilterType = "/api/WF/StageApi/getdropdown/1/0/2/2";
        }
        else if (isWarehouse)
        {
            filterType = "/api/WF/StageActionApi/getdropdown/11/2/null";
            stageFilterType = "/api/WF/StageApi/getdropdown/11/0/2/2";
        }


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
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 10,
                    IsFilterParameter = true, FilterType = "select2", FilterTypeApi = stageFilterType
                },
                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2", FilterTypeApi = filterType, Width = 5
                },
                new()
                {
                    Id = "isRequest", Title = "درخواست", Type = (int)SqlDbType.Bit, IsDtParameter = true, Size = 1,
                    Align = "center", Width = 5
                },
                new()
                {
                    Id = "isDeleteHeader", Title = "حذف برگه", Type = (int)SqlDbType.Bit, IsDtParameter = true,
                    Size = 1, Align = "center", Width = 5
                },
                new()
                {
                    Id = "isDeleteLine", Title = "حذف سطر", Type = (int)SqlDbType.Bit, IsDtParameter = true, Size = 1,
                    Align = "center", Width = 5
                },
                new()
                {
                    Id = "isBalanceReviewed", Title = "بازنگری گردش", Type = (int)SqlDbType.Bit,
                    IsDtParameter = isPurchase, Size = 1, Align = "center", Width = 5
                }, //purchase
                new()
                {
                    Id = "isTreasurySubject", Title = "موضوع خزانه", Type = (int)SqlDbType.Bit,
                    IsDtParameter = isTreasury, Size = 1, Align = "center", Width = 5
                }, //treasury
                new()
                {
                    Id = "isMaxStePreviewed", Title = "بازنگری گردش", Type = (int)SqlDbType.Bit,
                    IsDtParameter = isTreasury, Size = 1, Align = "center", Width = 5
                }, //treasury
                new()
                {
                    Id = "isBank", Title = "انتخاب حساب بانکی", Type = (int)SqlDbType.Bit, IsDtParameter = isTreasury,
                    Size = 1, Align = "center", Width = 6
                }, //treasury
                new()
                {
                    Id = "isFiscalYear", Title = "isFiscal", Type = (int)SqlDbType.Bit, IsDtParameter = isTreasury,
                    Size = 1, Align = "center", Width = 5
                }, //treasury
                new()
                {
                    Id = "isoutboundmonthclosed", Title = "isoutboundmonthclosed", Type = (int)SqlDbType.Bit,
                    IsDtParameter = isWarehouse, Size = 1, Align = "center", Width = 6
                }, //warehouse
                new()
                {
                    Id = "isLastConfirmHeader", Title = "تائید برگه", Type = (int)SqlDbType.Bit, IsDtParameter = true,
                    Size = 1, Align = "center", Width = 5
                },
                new()
                {
                    Id = "isPostedGroup", Title = "ارتباط با حسابداری", Type = (int)SqlDbType.Bit, IsDtParameter = true,
                    Size = 1, Align = "center", Width = 5
                },
                new()
                {
                    Id = "isDataEntry", Title = "ورود اطلاعات", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 6
                },
                new() { Id = "priority", Title = "اولویت", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 4 },
                new() { Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 5 },
                new()
                {
                    Id = "workflow", Title = "گردش کار", Type = (int)SqlDbType.BigInt, IsDtParameter = true, Size = 1,
                    Align = "center", Width = 15
                }
            }
        };
        return list;
    }

    public async Task<MyResultPage<List<StageActionGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<StageActionGetPage>>
        {
            Data = new List<StageActionGetPage>()
        };

        long? p_WorkFlowCategoryId = Convert.ToInt32(model.Form_KeyValue[0]?.ToString());


        if (model.Filters == null) model.Filters = new List<FormKeyValue>();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("StageId",
            model.Filters.Any(x => x.Name == "stage")
                ? model.Filters.FirstOrDefault(x => x.Name == "stage").Value
                : null);
        parameters.Add("ActionId",
            model.Filters.Any(x => x.Name == "actionIdName")
                ? model.Filters.FirstOrDefault(x => x.Name == "actionIdName").Value
                : null);
        parameters.Add("workflowCategoryId", p_WorkFlowCategoryId);

        if (p_WorkFlowCategoryId == 1) //خرید
            result.Columns = StageActionGetColumns(false, true, false);
        else if (p_WorkFlowCategoryId == 11) // انبار
            result.Columns = StageActionGetColumns(false, false, true);
        else // خزانه
            result.Columns = StageActionGetColumns(true, false, false);

        using (var conn = Connection)
        {
            var sQuery = "wf.Spc_StageAction_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<StageActionGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).AsList();
        }

        return result;
    }

    public async Task<MemoryStream> CSV(NewGetPageViewModel model)
    {
        var workFlowCategoryId = Convert.ToInt32(model.Form_KeyValue[0]?.ToString());
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var columns = "";

        if (workFlowCategoryId == 1) //خرید
            columns = string.Join(',',
                StageActionGetColumns(false, true, false).DataColumns.Where(x => x.IsDtParameter && x.Id != "action")
                    .Select(z => z.Title));
        else if (workFlowCategoryId == 11) // انبار
            columns = string.Join(',',
                StageActionGetColumns(false, false, true).DataColumns.Where(x => x.IsDtParameter && x.Id != "action")
                    .Select(z => z.Title));
        else // خزانه
            columns = string.Join(',',
                StageActionGetColumns(true, false, false).DataColumns.Where(x => x.IsDtParameter && x.Id != "action")
                    .Select(z => z.Title));


        var getPage = await GetPage(model);

        if (workFlowCategoryId == 1)
        {
            var rows1 = from p in getPage.Data
                        select new
                        {
                            p.Id,
                            p.Stage,
                            p.ActionIdName,
                            IsRequest = p.IsRequest ? "دارد" : "ندارد",
                            IsDeleteHeader = p.IsDeleteHeader ? "دارد" : "ندارد",
                            IsDeleteLine = p.IsDeleteLine ? "دارد" : "ندارد",
                            isLastConfirmHeader = p.isLastConfirmHeader ? "دارد" : "ندارد",
                            IsPostedGroup = p.IsPostedGroup ? "دارد" : "ندارد",
                            IsdataEntry = p.IsDataEntry ? "بلی" : "خیر",
                            p.Priority,
                            IsActive = p.IsActive ? "فعال" : "غیرفعال",
                            p.WorkflowId
                        };
            return csvStream = await csvGenerator.GenerateCsv(rows1, columns.Split(',').ToList());
        }

        if (workFlowCategoryId == 6)
        {
            var rows2 = from p in getPage.Data
                        select new
                        {
                            p.Id,
                            p.Stage,
                            p.ActionIdName,
                            IsRequest = p.IsRequest ? "دارد" : "ندارد",
                            IsTreasurySubject = p.IsTreasurySubject ? "دارد" : "ندارد",
                            IsDeleteHeader = p.IsDeleteHeader ? "دارد" : "ندارد",
                            IsDeleteLine = p.IsDeleteLine ? "دارد" : "ندارد",
                            IsMaxStePreviewed = p.IsMaxStePreviewed ? "دارد" : "ندارد",
                            isLastConfirmHeader = p.isLastConfirmHeader ? "دارد" : "ندارد",
                            IsPostedGroup = p.IsPostedGroup ? "دارد" : "ندارد",
                            IsBank = p.IsBank ? "دارد" : "ندارد",
                            IsdataEntry = p.IsDataEntry ? "بلی" : "خیر",
                            p.Priority,
                            IsActive = p.IsActive ? "فعال" : "غیرفعال"
                        };
            return csvStream = await csvGenerator.GenerateCsv(rows2, columns.Split(',').ToList());
        }

        {
            var rows3 = from p in getPage.Data
                        select new
                        {
                            p.Id,
                            p.Stage,
                            p.ActionIdName,
                            IsRequest = p.IsRequest ? "دارد" : "ندارد",
                            IsDeleteHeader = p.IsDeleteHeader ? "دارد" : "ندارد",
                            IsDeleteLine = p.IsDeleteLine ? "دارد" : "ندارد",
                            Isoutboundmonthclosed = p.Isoutboundmonthclosed ? "دارد" : "ندارد",
                            isLastConfirmHeader = p.isLastConfirmHeader ? "دارد" : "ندارد",
                            IsPostedGroup = p.IsPostedGroup ? "دارد" : "ندارد",
                            IsdataEntry = p.IsDataEntry ? "بلی" : "خیر",
                            p.Priority
                        };
            return csvStream = await csvGenerator.GenerateCsv(rows3, columns.Split(',').ToList());
        }
    }

    public async Task<List<ActionModel>> GetStageActionWithParam(GetStageAction model)
    {
        var data = await GetDataStageAction();

        data = data.Where(s => s.CompanyId == model.CompanyId).AsList();

        if (model.StageId != 0)
            data = data.Where(s => s.StageId == model.StageId).AsList();

        if (model.WorkflowId != 0)
            data = data.Where(s => s.WorkflowId == model.WorkflowId).AsList();

        if (model.ActionId != 0)
            data = data.Where(s => s.ActionId == model.ActionId).AsList();

        if (model.Priority != 0)
            data = data.Where(s => s.Priority == model.Priority).AsList();

        return data;
    }

    public async Task<ActionModel> GetStageActionWithOutActionIdParam(GetStageAction model)
    {
        var data = await GetDataStageAction();

        data = data.Where(s => s.CompanyId == model.CompanyId).AsList();

        if (model.StageId != 0)
            data = data.Where(s => s.StageId == model.StageId).AsList();

        if (model.WorkflowId > 0)
            data = data.Where(s => s.WorkflowId == model.WorkflowId).ToList();


        data = data.Where(s => s.IsPostedGroup).AsList();

        var result = data.FirstOrDefault();
        return result;
    }

    public async Task<ActionModel> GetAction(GetAction model)
    {
        var stageAction = await GetStageAction();

        var result = new List<ActionModel>();

        result = stageAction.Where(s => s.StageId == model.StageId).ToList();

        if (model.WorkflowId > 0)
            result = result.Where(s => s.WorkflowId == model.WorkflowId).ToList();

        if (model.ActionId != 0)
            result = result.Where(s => s.ActionId == model.ActionId).ToList();
        else
            result = result.Where(s => s.Priority == model.Priority).ToList();

        return result.FirstOrDefault();
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetActionListByStageId
    (GetActionListByStageDto dto, byte roleId, int companyId)
    {
        var sQuery = "[wf].[Spc_Action_List_By_StageId]";

        using (var conn = Connection)
        {
            dto.BranchId = dto.BranchId == "null" ? "0" : dto.BranchId;
            short? branchId = short.Parse(dto.BranchId);
           
            conn.Open();
            var response = await Connection.QueryAsync<ActionDropDownViewModel>(sQuery, new
            {
                StageId = dto.StageId == "null" ? null : dto.StageId,
                WorkflowId = dto.WorkFlowId == "null" ? null : dto.WorkFlowId,
                CompanyId = companyId,
                IsActive = dto.IsActive,
                BySystem = dto.BySystem,
                RoleId = roleId,
                BranchId = branchId > 0 ? branchId : null,
                WorkflowCategoryId = dto.WorkFlowCategoryId == "null" ? null : dto.WorkFlowCategoryId,
                IncludePriority = dto.IncludePriority,
                StageClassId = dto.StageClassId == "null" ? null : dto.StageClassId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            var result = from a in response.AsList()
                         select new MyDropDownViewModel
                         {
                             Id = a.Id,
                             Name = dto.IncludePriority ? a.Name + $" : ({a.Priority})" : a.Name
                         };

            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(int companyId, string workflowCategoryId,
        byte isActive, string stageClassId, byte roleId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_Action_List_By_WorkflowCategoryId]";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    CompanyId = companyId,
                    WorkflowCategoryId = workflowCategoryId,
                    IsActive = isActive,
                    stageClassId = stageClassId == "null" ? null : stageClassId,
                    RoleId = roleId
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<List<ActionModel>> GetDataStageAction()
    {
        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_StageAction_List]";
            conn.Open();
            var result = await conn.QueryAsync<ActionModel>(sQuery, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result.AsList();
        }
    }

    public async Task<List<ActionModel>> GetStageAction()
    {
        var cache = new List<ActionModel>();

        try
        {
            cache = _redisService.GetData<List<ActionModel>>("cacheStageAction");

            if (cache.NotNull())
                return cache;

            cache = await GetDataStageAction();

            var expirationTime = DateTimeOffset.Now.AddHours(10.0);
            _redisService.SetData("cacheStageAction", cache, expirationTime);
        }
        catch (Exception)
        {
            cache = await GetDataStageAction();
        }

        return cache;
    }

    public async Task<ParentRequestStageActionLogicModel> GetParentRequestStageStepActionById(
        GetParentRequestLogicByWorkflowCategory model)
    {
        var sQuery = "[wf].[Spc_ParentRequest_GetLogic]";
        using (var conn = Connection)
        {
            conn.Open();
            var result = await Connection.QueryFirstOrDefaultAsync<ParentRequestStageActionLogicModel>(sQuery,
                new
                {
                    model.RequestId,
                    model.WorkflowCategoryId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }

    public async Task<int> GetActionId(GetActionViewModel model)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "wf.StageAction",
                    ColumnName = "ActionId",
                    Filter =
                        $" Priority <> 4 AND StageId='{model.StageId}' AND WorkflowId='{model.WorkflowId}' ORDER BY Id DESC"
                }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }


    public async Task<bool> GetMultipleSettlement(GetActionViewModel model)
    {
        var sQuery = "[wf].[Spc_MultipleSettlement_Get]";
        using (var conn = Connection)
        {
            conn.Open();
            var result = await Connection.QueryFirstOrDefaultAsync<bool>(sQuery,
                new
                {
                    model.WorkflowId,
                    model.StageId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result;
        }
    }


    public async Task<bool> GetStageActionGetNext(GetNextStageActionViewModel model)
    {
        var sQuery = "[wf].[Spc_StageAction_GetNext]";
        using (var conn = Connection)
        {
            conn.Open();
            var result = await Connection.QueryFirstOrDefaultAsync<int>(sQuery,
                new
                {
                    model.ActionId,
                    model.StageId,
                    model.WorkflowId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return result == 0 ? true : false;
        }
    }
}