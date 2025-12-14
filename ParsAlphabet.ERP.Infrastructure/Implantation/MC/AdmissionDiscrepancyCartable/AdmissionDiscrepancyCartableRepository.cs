using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionDiscrepancyCartable;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageActionOriginDestination;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionDiscrepancyCartable;

public class AdmissionDiscrepancyCartableRepository :
    BaseRepository<AdmissionDiscrepancySummaryViewModel1, long, string>,
    IBaseRepository<AdmissionDiscrepancySummaryViewModel1, long, string>
{
    private readonly StageActionOriginDestinationRepository _stageActionOriginDestinationRepository;

    public AdmissionDiscrepancyCartableRepository(
        IConfiguration config,
        StageActionOriginDestinationRepository stageActionOriginDestinationRepository
    ) : base(config)
    {
        _stageActionOriginDestinationRepository = stageActionOriginDestinationRepository;
    }

    public async Task<MyResultPage<IEnumerable<AdmissionDiscrepancyCashFundTypeSummaryViewModel4>>>
        GetAdmissionDiscrepancy4(GetAdmissionDiscrepancy model, byte roleId)
    {
        var result = new MyResultPage<IEnumerable<AdmissionDiscrepancyCashFundTypeSummaryViewModel4>>
        {
            Data = new List<AdmissionDiscrepancyCashFundTypeSummaryViewModel4>()
        };

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Cartable_AdmissionDiscrepancy_CashAmount_4]";
            conn.Open();

            result.Data = await conn.QueryAsync<AdmissionDiscrepancyCashFundTypeSummaryViewModel4>(sQuery, new
            {
                model.CreateDate,
                model.CreateUserId,
                model.WorkflowId,
                model.StageId,
                model.ActionId
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
        }

        return result;
    }

    #region AdmissionDiscrepancy1

    public GetColumnsViewModel GetColumnsAdmissionDiscrepancy1()
    {
        var list = new GetColumnsViewModel
        {
            ActionType = "inline",
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "isAdmissionCash", FieldValue = "false", Operator = "==" } },
            AnswerCondition = "color:#da1717",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 12
                },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 12
                },
                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 12
                },

                new()
                {
                    Id = "admissionCount", Title = "تعداد درخواست", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "sumQty", Title = "تعداد خدمت", Type = (int)SqlDbType.Int, Size = 10, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "sumAmount", Title = "سهم مراجعه کننده", Type = (int)SqlDbType.Money, IsDtParameter = true,
                    Width = 12
                },
                new()
                {
                    Id = "cashCreateUser", Title = "کاربر ثبت دریافت/پرداخت", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 12
                },
                new()
                {
                    Id = "admissionCreateUser", Title = "کاربر ثبت درخواست", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 12
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 8 },

                new() { Id = "workflowId", IsPrimary = true },
                new() { Id = "stageId", IsPrimary = true },
                new() { Id = "actionId", IsPrimary = true }
            }
        };

        list.Buttons = new List<GetActionColumnViewModel>
        {
            new()
            {
                Name = "selectCurrentWorkflowStageAction", Title = "انتخاب سطر", ClassName = "btn blue_outline_1",
                IconName = "fas fa-check"
            }
        };

        return list;
    }

    /// <summary>
    ///     with model
    /// </summary>
    /// <param name="model"></param>
    /// <param name="roleId"></param>
    /// <returns></returns>
    public async Task<MyResultPage<IEnumerable<AdmissionDiscrepancySummaryViewModel1>>> GetAdmissionDiscrepancy1(
        GetAdmissionDiscrepancy model, byte roleId)
    {
        var result = new MyResultPage<IEnumerable<AdmissionDiscrepancySummaryViewModel1>>
        {
            Data = new List<AdmissionDiscrepancySummaryViewModel1>(),
            Columns = GetColumnsAdmissionDiscrepancy1()
        };

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Cartable_AdmissionDiscrepancy_Summary_1]";
            conn.Open();

            result.Data = await conn.QueryAsync<AdmissionDiscrepancySummaryViewModel1>(sQuery, new
            {
                CreateDate = "2024-03-25",
                model.CreateUserId
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
        }

        return result;
    }

    #endregion

    #region AdmissionDiscrepancy2

    public async Task<GetColumnsViewModel> GetColumnsAdmissionDiscrepancy2(int workflowId, short stageId)
    {
        var workflowStage = await _stageActionOriginDestinationRepository.GetWorkflowStage(workflowId, stageId);


        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "admissionId", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 7
                },
                new()
                {
                    Id = "admissionMasterId", Title = "پرونده", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 8
                },
                new()
                {
                    Id = "reserveDateTimePersian", Title = "تاریخ و زمان رزرو", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "doublepersiandate", Width = 15
                },

                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2ajax", FilterTypeApi = "/api/MC/PatientApi/filter",
                    Width = 15
                },
                new()
                {
                    Id = "patientNationalCode", Title = "نمبر تذکره مراجعه کننده", Type = (int)SqlDbType.Int,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2ajax",
                    FilterTypeApi = "/api/MC/PatientApi/filter/3", Width = 15
                },
                new()
                {
                    Id = "vendorAttender", Title = workflowStage.AdmissionTypeId == 1 ? "تامین کننده" : "طبیب",
                    Type = (int)SqlDbType.Int, IsDtParameter = true, IsFilterParameter = true,
                    FilterType = "select2",
                    FilterTypeApi = workflowStage.AdmissionTypeId == 1
                        ? "/api/MC/AttenderApi/getdropdown/2"
                        : "/api/PU/VendorApi/getdropdown",
                    Width = 12
                },

                new()
                {
                    Id = "sumPayAmount", Title = "سهم مراجعه کننده", Type = (int)SqlDbType.Money, IsDtParameter = true,
                    Width = 8
                },

                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ و زمان ثبت", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "doublepersiandate", Width = 10
                },
                new()
                {
                    Id = "firstActionCreateUser", Title = "کاربر ثبت", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "api/GN/UserApi/getdropdown/2/false/false", Width = 10
                }
            }
        };

        return list;
    }

    public async Task<MyResultPage<IEnumerable<AdmissionDiscrepancyDetailViewModel2>>> GetAdmissionDiscrepancy2(
        GetAdmissionDiscrepancy model, byte roleId)
    {
        var result = new MyResultPage<IEnumerable<AdmissionDiscrepancyDetailViewModel2>>
        {
            Data = new List<AdmissionDiscrepancyDetailViewModel2>(),
            Columns = await GetColumnsAdmissionDiscrepancy2(model.WorkflowId ?? 0, (short)model.StageId)
        };

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Cartable_AdmissionDiscrepancy_Detail_2]";
            var parameters = new DynamicParameters();
            parameters.Add("PageNo", model.PageNo);
            parameters.Add("PageRowsCount", model.PageRowsCount);
            parameters.Add("CreateDate", model.CreateDate);
            parameters.Add("CreateUserId", model.CreateUserId);
            parameters.Add("WorkflowId", model.WorkflowId);
            parameters.Add("StageId", model.StageId);
            parameters.Add("ActionId", model.ActionId);
            parameters.Add("AdmissionMasterId",
                model.Filters.Any(x => x.Name == "admissionMasterId")
                    ? model.Filters.FirstOrDefault(x => x.Name == "admissionMasterId")?.Value
                    : null);
            parameters.Add("AdmissionId",
                model.Filters.Any(x => x.Name == "admissionId")
                    ? model.Filters.FirstOrDefault(x => x.Name == "admissionId")?.Value
                    : null);
            parameters.Add("PatientId",
                model.Filters.Any(x => x.Name == "patientId")
                    ? model.Filters.FirstOrDefault(x => x.Name == "patientId")?.Value
                    : null);
            parameters.Add("AttenderVendorId",
                model.Filters.Any(x => x.Name == "attenderVendorId")
                    ? model.Filters.FirstOrDefault(x => x.Name == "attenderVendorId")?.Value
                    : null);
            conn.Open();
            result.Data = await conn.QueryAsync<AdmissionDiscrepancyDetailViewModel2>(sQuery, parameters,
                commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultPage<IEnumerable<SumGetAdmissionDiscrepancy>>> SumGetAdmissionDiscrepancy2(
        GetAdmissionDiscrepancy model, byte roleId)
    {
        var result = new MyResultPage<IEnumerable<SumGetAdmissionDiscrepancy>>
        {
            Data = new List<SumGetAdmissionDiscrepancy>(),
            Columns = GetColumnsAdmissionDiscrepancy1()
        };
        using (var conn = Connection)
        {
            const string sQuery = "[mc].[Spc_Cartable_AdmissionDiscrepancy_Detail_Sum_2]";
            conn.Open();

            result.Data = await conn.QueryAsync<SumGetAdmissionDiscrepancy>(sQuery, new
            {
                model.CreateDate,
                model.CreateUserId,
                model.WorkflowId,
                model.StageId,
                model.ActionId,
                model.AdmissionMasterId,
                model.AdmissionId,
                model.PatientId,
                model.AttenderVendorId
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
        }

        return result;
    }

    public async Task<MemoryStream> AdmissionDiscrepancy2Csv(GetAdmissionDiscrepancy model, byte roleId)
    {
        var csvGenerator = new Csv();

        var getColumns2 = await GetColumnsAdmissionDiscrepancy2(model.WorkflowId ?? 0, (short)model.StageId);
        var columns1 = getColumns2.DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title)
            .ToList();

        var getPage = await GetAdmissionDiscrepancy2(model, roleId);
        var rowsAdmissionService = (from p in getPage.Data
            select new
            {
                p.AdmissionId,
                p.AdmissionMasterId,
                p.ReserveDateTimePersian,
                p.Patient,
                p.PatientNationalCode,
                p.VendorAttenderFullName,
                p.SumPayAmount,
                p.CreateDateTimePersian,
                p.FirstActionCreateUserFullName
            }).ToList();

        var csvStream = await csvGenerator.GenerateCsv(rowsAdmissionService, columns1);
        return csvStream;
    }

    #endregion

    #region AdmissionDiscrepancy3

    public async Task<GetColumnsViewModel> GetColumnsAdmissionDiscrepancy3(int workflowId, short stageId)
    {
        var workflowStage = await _stageActionOriginDestinationRepository.GetWorkflowStage(workflowId, stageId);


        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "admissionId", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 10
                },
                new()
                {
                    Id = "admissionMasterId", Title = "پرونده", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 10
                },
                new()
                {
                    Id = "admissionCashId", Title = "پرونده", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 10
                },
                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2ajax", FilterTypeApi = "/api/MC/PatientApi/filter",
                    Width = 15
                },
                new()
                {
                    Id = "patientNationalCode", Title = "نمبر تذکره مراجعه کننده", Type = (int)SqlDbType.Int,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "select2ajax",
                    FilterTypeApi = "/api/MC/PatientApi/filter/3", Width = 20
                },


                new()
                {
                    Id = "sumAmount", Title = "مبلغ", Type = (int)SqlDbType.Money, IsDtParameter = true, Width = 10
                },

                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت صندوق", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "doublepersiandate", Width = 10
                },
                new()
                {
                    Id = "createUser", Title = "کاربر ثبت", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "api/GN/UserApi/getdropdown/2/false/false", Width = 15
                }
            }
        };

        return list;
    }

    public async Task<MyResultPage<IEnumerable<AdmissionDiscrepancyCashDetailViewModel3>>> GetAdmissionDiscrepancy3(
        GetAdmissionDiscrepancy model, byte roleId)
    {
        var result = new MyResultPage<IEnumerable<AdmissionDiscrepancyCashDetailViewModel3>>
        {
            Data = new List<AdmissionDiscrepancyCashDetailViewModel3>(),
            Columns = await GetColumnsAdmissionDiscrepancy3(model.WorkflowId ?? 0, (short)model.StageId)
        };


        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Cartable_AdmissionDiscrepancy_CashDetail_3]";
            var parameters = new DynamicParameters();
            parameters.Add("PageNo", model.PageNo);
            parameters.Add("PageRowsCount", model.PageRowsCount);
            parameters.Add("CreateDate", model.CreateDate);
            parameters.Add("CreateUserId", model.CreateUserId);
            parameters.Add("WorkflowId", model.WorkflowId);
            parameters.Add("StageId", model.StageId);
            parameters.Add("ActionId", model.ActionId);
            parameters.Add("AdmissionMasterId",
                model.Filters.Any(x => x.Name == "admissionMasterId")
                    ? model.Filters.FirstOrDefault(x => x.Name == "admissionMasterId")?.Value
                    : null);
            parameters.Add("AdmissionCashId",
                model.Filters.Any(x => x.Name == "admissionCashId")
                    ? model.Filters.FirstOrDefault(x => x.Name == "admissionCashId")?.Value
                    : null);
            parameters.Add("AdmissionId",
                model.Filters.Any(x => x.Name == "admissionId")
                    ? model.Filters.FirstOrDefault(x => x.Name == "admissionId")?.Value
                    : null);
            parameters.Add("PatientId",
                model.Filters.Any(x => x.Name == "patientId")
                    ? model.Filters.FirstOrDefault(x => x.Name == "patientId")?.Value
                    : null);

            parameters.Add("CashCreateUserId",
                model.Filters.Any(x => x.Name == "cashCreateUserId")
                    ? model.Filters.FirstOrDefault(x => x.Name == "cashCreateUserId")?.Value
                    : null);

            conn.Open();
            result.Data = await conn.QueryAsync<AdmissionDiscrepancyCashDetailViewModel3>(sQuery, parameters,
                commandType: CommandType.StoredProcedure);
            conn.Close();
        }


        return result;
    }

    public async Task<MyResultPage<IEnumerable<SumGetAdmissionDiscrepancy>>> SumGetAdmissionDiscrepancy3(
        GetAdmissionDiscrepancy model, byte roleId)
    {
        var result = new MyResultPage<IEnumerable<SumGetAdmissionDiscrepancy>>
        {
            Data = new List<SumGetAdmissionDiscrepancy>(),
            Columns = GetColumnsAdmissionDiscrepancy1()
        };
        using (var conn = Connection)
        {
            const string sQuery = "[mc].[Spc_Cartable_AdmissionDiscrepancy_CashDetail_Sum_3]";
            conn.Open();

            result.Data = await conn.QueryAsync<SumGetAdmissionDiscrepancy>(sQuery, new
            {
                model.CreateDate,
                model.CreateUserId,
                model.WorkflowId,
                model.StageId,
                model.ActionId,
                model.AdmissionMasterId,
                model.AdmissionId,
                model.PatientId,
                model.CashCreateUserId
            }, commandType: CommandType.StoredProcedure);

            conn.Close();
        }

        return result;
    }

    public async Task<MemoryStream> AdmissionDiscrepancy3Csv(GetAdmissionDiscrepancy model, byte roleId)
    {
        var csvGenerator = new Csv();

        var getColumns2 = await GetColumnsAdmissionDiscrepancy2(model.WorkflowId ?? 0, (short)model.StageId);
        var columns1 = getColumns2.DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title)
            .ToList();

        var getPage = await GetAdmissionDiscrepancy3(model, roleId);
        var rowsAdmissionService = (from p in getPage.Data
            select new
            {
                p.AdmissionId,
                p.AdmissionMasterId,
                p.AdmissionCashId,
                p.Patient,
                p.PatientNationalCode,
                p.SumAmount,
                p.CreateDateTimePersian,
                p.CreateUser
            }).ToList();

        var csvStream = await csvGenerator.GenerateCsv(rowsAdmissionService, columns1);
        return csvStream;
    }

    #endregion
}