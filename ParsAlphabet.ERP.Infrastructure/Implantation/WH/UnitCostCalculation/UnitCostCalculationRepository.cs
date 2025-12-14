using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.WH.UnitCostCalculation;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.Branch;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.RoleWorkflowPermission;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.Stage;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WH.UnitCostCalculation;

public class UnitCostCalculationRepository :
    BaseRepository<UnitCostCalculationModel, int, string>,
    IBaseRepository<UnitCostCalculationModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;
    private readonly BranchRepository _branchRepository;
    private readonly RoleWorklfowPermissionRepository _roleWorklfowPermissionRepository;
    private readonly StageActionRepository _stageActionRepository;
    private readonly StageRepository _stageRepository;

    public UnitCostCalculationRepository(IConfiguration config,
        IHttpContextAccessor accessor,
        StageActionRepository stageActionRepository,
        RoleWorklfowPermissionRepository roleWorklfowPermissionRepository,
        StageRepository stageRepository,
        BranchRepository branchRepository)
        : base(config)
    {
        _accessor = accessor;
        _stageActionRepository = stageActionRepository;
        _roleWorklfowPermissionRepository = roleWorklfowPermissionRepository;
        _stageRepository = stageRepository;
        _branchRepository = branchRepository;
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
                    IsFilterParameter = true, Width = 6, FilterType = "number", IsPrimary = true
                },

                new()
                {
                    Id = "fiscalYearId", Title = "سال مالی", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsFilterParameter = false, FilterType = "select2",
                    FilterTypeApi = "/api/GN/FiscalYearApi/getdropdown", Width = 12
                },

                new()
                {
                    Id = "fiscalYear", Title = "سال مالی", Type = (int)SqlDbType.NVarChar, Size = 50, Width = 12,
                    IsDtParameter = true, IsPrimary = true
                },

                new()
                {
                    Id = "costingMethodId", Title = "روش هزینه یابی", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsFilterParameter = false, FilterType = "select2",
                    FilterTypeApi = "/api/WHApi/costingMethod_getdropdown", Width = 5
                },

                new()
                {
                    Id = "costingMethod", Title = "روش هزینه یابی", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 12, IsPrimary = true
                },

                new()
                {
                    Id = "userFullName", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.VarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = false, Width = 12
                },

                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 12
                },

                new()
                {
                    Id = "closed", Title = "وشعیت سال مالی", Type = (int)SqlDbType.Bit, IsDtParameter = true,
                    Editable = false, Width = 7
                },

                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "sep1", Title = "", IsSeparator = true },
                new()
                {
                    Name = "detailSimple", Title = "تخصیص متغیر ", ClassName = "", IconName = "fa fa-list color-green",
                    Condition = new List<ConditionPageTable>
                        { new() { FieldName = "closed", FieldValue = "true", Operator = "!=" } }
                }
            }
        };

        return list;
    }


    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model, byte roleId)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                GetColumns().DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };
        var getPage = await GetPage(model, roleId);
        result.Rows = from p in getPage.Data
            select new
            {
                p.Id,
                p.FiscalYear,
                p.CostingMethod,
                p.UserFullName,
                p.CreateDateTimePersian,
                Closed = p.Closed == 1 ? "بسته" : "باز"
            };
        return result;
    }

    public async Task<MyResultPage<List<UnitCostCalculationGetPage>>> GetPage(NewGetPageViewModel model, byte roleId)
    {
        var result = new MyResultPage<List<UnitCostCalculationGetPage>>
        {
            Data = new List<UnitCostCalculationGetPage>()
        };


        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("RoleId", roleId);
        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_UnitCostCalculation_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<UnitCostCalculationGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultStatus> Insert(UnitCostCalculationViewModel model, OperationType operationType,
        byte roleId)
    {
        var validateResult = new List<string>();
        validateResult = await Validate(model, operationType, roleId);

        if (validateResult.ListHasRow())
        {
            var resultValidate = new MyResultStatus();
            resultValidate.Successfull = false;
            resultValidate.ValidationErrors = validateResult;
            return resultValidate;
        }

        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_UnitCostCalculationHeaderLineDetail_InsUpd]";
            conn.Open();

            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                Id = model.Id == 0 ? null : model.Id,
                model.FiscalYearId,
                model.CostingMethodId,
                model.CreateUserId,
                model.CreateDateTime
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = result.Status == 100;
        }

        return result;
    }


    public async Task<List<string>> Validate(UnitCostCalculationViewModel model, OperationType operationType,
        byte roleId)

    {
        var error = new List<string>();
        if (model == null)
        {
            error.Add(string.Join(",", 0));
            error.Add("درخواست معتبر نمی باشد");
            return error;
        }

        await Task.Run(async () =>
        {
            if (operationType == OperationType.Insert)
            {
                #region بررسی تکراری نبودن

                var existItem = await ExistUnitCostCalculationByfiscalYearId(model.FiscalYearId);
                if (existItem > 0)
                    error.Add(
                        $" سال مالی با شناسه ی :  {model.FiscalYearId} قبلا ثبت شده است، مجاز به ثبت تکراری نیستید");

                #endregion
            }

            var branchList = await GetBranchWhitfiscalYearId(model.FiscalYearId);

            var workflowId = 180;
            short stageId = 212;
            byte actionId = 2;
            for (var i = 0; i < branchList.Count; i++)
            {
                var permission =
                    await _roleWorklfowPermissionRepository.CheckRoleWorkflowPermission(workflowId, branchList[i],
                        stageId, actionId, roleId);
                if (permission != 1)
                {
                    var stage = await _stageRepository.GetName(stageId);
                    var branch = await _branchRepository.GetName(branchList[i]);
                    error.Add($"{stage}, {branch} دسترسی ندارید ");
                }
            }
        });
        return error;
    }

    public async Task<int> ExistUnitCostCalculationByfiscalYearId(int fiscalYearId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "wh.UnitCostCalculation",
                    ColumnName = "Count(*) as count",
                    Filter = $"fiscalYearId='{fiscalYearId}'"
                }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }

    public async Task<List<short>> GetBranchWhitfiscalYearId(int fiscalYearId)
    {
        var result = new List<short>();
        using (var conn = Connection)
        {
            var sQuery = @"SELECT BranchId
								  FROM wh.ItemTransaction it
	                              INNER JOIN gn.FiscalYear fy ON it.DocumentDate BETWEEN fy.StartDate AND fy.EndDate
	                              WHERE fy.Id=@fiscalYearId
	                              GROUP BY it.BranchId";
            conn.Open();

            result = (await conn.QueryAsync<short>(sQuery,
                new
                {
                    fiscalYearId
                }, commandType: CommandType.Text)).ToList();

            conn.Close();
        }

        return result.ToList();
    }

    //public async Task<list<int>> GetBranchWhitfiscalYearId(int fiscalYearId)
    //{
    //	var result = new list<int>();
    //	using (IDbConnection conn = Connection)
    //	{
    //		string sQuery = @"select COUNT(sftp.StageFundTypeId) from wf.StageFundTypePrevious sftp
    //                                INNER JOIN wf.StageFundType sft ON sftp.StageFundTypeId=sft.Id
    //                                WHERE StageId=@StageId";
    //		conn.Open();

    //		var exist = await conn.ExecuteScalarAsync<bool>(sQuery,
    //			new
    //			{
    //				StageId = stageId
    //			});

    //		result.Data = exist ? 1 : 0;

    //		return result;
    //	}
    //}
}