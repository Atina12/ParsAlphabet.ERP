using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.MC.Admission;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionCash;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.RoleWorkflowPermission;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.Stage;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.AdmissionCash;

public class AdmissionCashRepository :
    BaseRepository<AdmissionCashPayment, long, string>,
    IBaseRepository<AdmissionCashPayment, long, string>
{
    private readonly ILoginRepository _loginRepository;
    private readonly RoleWorklfowPermissionRepository _roleWorklfowPermissionRepository;
    private readonly StageActionRepository _stageActionRepository;
    private readonly StageRepository _stageRepository;

    public AdmissionCashRepository(IConfiguration config,
        ILoginRepository loginRepository,
        RoleWorklfowPermissionRepository roleWorklfowPermissionRepository,
        StageActionRepository stageActionRepository,
        StageRepository stageRepository
    ) : base(config)
    {
        _roleWorklfowPermissionRepository = roleWorklfowPermissionRepository;
        _stageActionRepository = stageActionRepository;
        _stageRepository = stageRepository;
        _loginRepository = loginRepository;
    }

    public new GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            FixedColumn = true,
            //ConditionOn = "row",
            //Condition = new List<ConditionPageTable>() { new ConditionPageTable { FieldName = "admissionSaleTypeId", FieldValue = "2", Operator = "==" } },
            //AnswerCondition = "color:#da1717",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 8
                },
                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 20, IsDtParameter = true,
                    IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 20,
                    IsDtParameter = true, IsFilterParameter = true,
                    FilterType = "select2", FilterTypeApi = "/api/WF/WorkflowApi/getdropdown/0/10,14/17,19,22,20",
                    Width = 15
                },

                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 20, IsDtParameter = true,
                    IsFilterParameter = true, Width = 15,
                    FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageApi/getstagedropdownbyworkflowid/null/null/10,14/20/2/2"
                },


                new()
                {
                    Id = "admissionMasterId", Title = "شناسه پرونده", Type = (int)SqlDbType.Int, IsPrimary = true,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "number", Width = 8
                },
                new()
                {
                    Id = "patient", Title = "نام مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 20,
                    IsDtParameter = true, IsFilterParameter = true, Width = 13
                },
                new()
                {
                    Id = "patientNationalCode", Title = "نمبر تذکره مراجعه کننده", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "strnumber", Width = 13
                },
                new()
                {
                    Id = "sumMasterAmount", Title = "مبلغ پرونده", Type = (int)SqlDbType.Money, Size = 10,
                    IsCommaSep = true, IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "sumCashAmount", Title = "مبلغ پرداخت شده", Type = (int)SqlDbType.Money, Size = 50,
                    IsCommaSep = true, IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "doublepersiandate", Width = 12
                },
                new()
                {
                    Id = "user", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.VarChar, Size = 20,
                    IsDtParameter = true, IsFilterParameter = true, Width = 12
                },
                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.NVarChar, Size = 20, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WF/StageActionApi/getdropdown/10,14/2/20", Width = 12
                },
                new() { Id = "action", Title = "عملیات", IsDtParameter = true, Width = 9 },

                new() { Id = "workflowId", IsPrimary = true },
                new() { Id = "stageId", IsPrimary = true },
                new() { Id = "actionId", IsPrimary = true }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "displayAdmissionCash", Title = "نمایش", ClassName = "btn green_outline_1",
                    IconName = "far fa-file-alt"
                },
                new()
                {
                    Name = "editAdmissionCash", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green"
                }
            }
        };

        return list;
    }

    public GetColumnsViewModel GetColumnsReadyPaymentList()
    {
        var list = new GetColumnsViewModel
        {
            ActionType = "inline",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه پرونده", Type = (int)SqlDbType.Int, IsPrimary = true,
                    IsDtParameter = true, IsFilterParameter = true, FilterType = "number", Width = 7
                },
                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 20, IsDtParameter = true,
                    IsPrimary = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 20,
                    IsDtParameter = true, IsPrimary = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 20, IsDtParameter = true,
                    IsPrimary = true, IsFilterParameter = true, Width = 11
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsPrimary = true, IsDtParameter = true, IsFilterParameter = true, FilterType = "doublepersiandate",
                    Width = 6
                },
                new()
                {
                    Id = "user", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.VarChar, Size = 20, IsPrimary = true,
                    IsDtParameter = true, IsFilterParameter = true, Width = 8
                },
                new()
                {
                    Id = "patientNationalCode", Title = "نمبر تذکره مراجعه کننده", Type = (int)SqlDbType.NVarChar,
                    IsPrimary = true, IsDtParameter = true, IsFilterParameter = true, FilterType = "strnumber",
                    Width = 8
                },
                new()
                {
                    Id = "patient", Title = "مراجعه کننده", Type = (int)SqlDbType.NVarChar, Size = 20, IsPrimary = true,
                    IsDtParameter = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "sumRequestAmount", Title = "قابل دریافت/پرداخت", Type = (int)SqlDbType.Money,
                    IsPrimary = true, Size = 10, IsCommaSep = true, IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "sumCashAmount", Title = "مبلغ پرداخت شده", Type = (int)SqlDbType.Money, Size = 50,
                    IsCommaSep = true, IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "remainingAmount", Title = "مبلغ مانده", Type = (int)SqlDbType.Money, Size = 50,
                    IsCommaSep = true, IsDtParameter = true, Width = 8
                },
                new() { Id = "actionId", IsPrimary = true },
                new() { Id = "workflowCategoryId", IsPrimary = true },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 6 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "selectRequest", Title = "انتخاب", ClassName = "btn blue_outline_2 ml-1",
                    IconName = "fa fa-check"
                }
            }
        };

        return list;
    }

    public async Task<MyResultPage<List<AdmissionCashGetPage>>> GetPage(NewGetPageViewModel model, int userId,
        byte roleId)
    {
        MyResultPage<List<AdmissionCashGetPage>> result = new()
        {
            Data = new List<AdmissionCashGetPage>()
        };

        var fromCreateDateMiladi = (DateTime?)null;
        var toCreateDateMiladi = (DateTime?)null;

        if (model.Filters.Any(x => x.Name == "createDateTimePersian"))
        {
            fromCreateDateMiladi =
                model.Filters.FirstOrDefault(x => x.Name == "createDateTimePersian").Value.Split('-')[0]
                    .ToMiladiDateTime();
            toCreateDateMiladi =
                model.Filters.FirstOrDefault(x => x.Name == "createDateTimePersian").Value.Split('-')[1]
                    .ToMiladiDateTime();
        }

        result.Columns = GetColumns();

        var parameters = new DynamicParameters();

        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("AdmissionMasterId",
            model.Filters.Any(x => x.Name == "admissionMasterId")
                ? model.Filters.FirstOrDefault(x => x.Name == "admissionMasterId").Value
                : null);
        parameters.Add("StageId",
            model.Filters.Any(x => x.Name == "stage")
                ? model.Filters.FirstOrDefault(x => x.Name == "stage").Value
                : null);
        parameters.Add("WorkflowId",
            model.Filters.Any(x => x.Name == "workflow")
                ? model.Filters.FirstOrDefault(x => x.Name == "workflow").Value
                : null);
        parameters.Add("ActionId",
            model.Filters.Any(x => x.Name == "actionIdName")
                ? model.Filters.FirstOrDefault(x => x.Name == "actionIdName").Value
                : null);
        parameters.Add("Patient",
            model.Filters.Any(x => x.Name == "patient")
                ? model.Filters.FirstOrDefault(x => x.Name == "patient").Value
                : null);
        parameters.Add("PatientNationalCode",
            model.Filters.Any(x => x.Name == "patientNationalCode")
                ? model.Filters.FirstOrDefault(x => x.Name == "patientNationalCode").Value
                : null);

        parameters.Add("Branch",
            model.Filters.Any(x => x.Name == "branch")
                ? model.Filters.FirstOrDefault(x => x.Name == "branch").Value
                : null);
        parameters.Add("FromCreateDate", fromCreateDateMiladi);
        parameters.Add("ToCreateDate", toCreateDateMiladi);
        parameters.Add("RoleId", roleId);

        if (model.CompanyId == 0)
            parameters.Add("CompanyId");
        else
            parameters.Add("CompanyId", model.CompanyId);


        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "AdmissionCashApi",
            OprType = "VIWALL",
            UserId = userId
        };


        var checkAccessViewAll = await _loginRepository.GetAuthenticate(checkAuthenticate);


        if (int.Parse(model.Form_KeyValue[1]?.ToString()) == 0)
        {
            if (!checkAccessViewAll.Successfull)
                parameters.Add("CreateUserId", 0);
            else
                parameters.Add("CreateUserId");

            parameters.Add("UserFullName",
                model.Filters.Any(x => x.Name == "user")
                    ? model.Filters.FirstOrDefault(x => x.Name == "user").Value
                    : null);
        }
        else
        {
            parameters.Add("CreateUserId", int.Parse(model.Form_KeyValue[1]?.ToString()));
            parameters.Add("UserFullName");
        }

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionCash_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<AdmissionCashGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultDataQuery<AdmissionReuestAndPayment>> AdmissionCashDisplay(int AdmissionCashId,
        int userId)
    {
        var result = new MyResultDataQuery<AdmissionReuestAndPayment>();
        using (var conn = Connection)
        {
            conn.Open();

            var sQueryReq = "mc.Spc_AdmissionCash_Display";
            var requests = (await conn.QueryAsync<AdmissionCashRequest>(sQueryReq, new
            {
                Id = AdmissionCashId
            }, commandType: CommandType.StoredProcedure)).ToList();

            var sQueryPay = "mc.Spc_AdmissionCashLine_Display";

            var payments = (await conn.QueryAsync<AdmissionCashPayment>(sQueryPay, new
            {
                Id = AdmissionCashId
            }, commandType: CommandType.StoredProcedure)).ToList();

            conn.Close();

            result.Successfull = true;
            result.Data = new AdmissionReuestAndPayment();
            result.Data.Requests = requests;
            result.Data.Payments = SetIsAccess(payments, userId);
        }

        return result;
    }

    public async Task<MyResultPage<List<AdmissionCashRequest>>> AdmissionCashSearch(
        AdmissionCashRequestSearchModel model, byte roleId)
    {
        var result = new MyResultPage<List<AdmissionCashRequest>>();
        result.Columns = GetColumnsReadyPaymentList();

        using (var conn = Connection)
        {
            conn.Open();

            var sQueryReq = "[mc].[Spc_Admission_ReadyForPaymentList]";
            result.Data = (await conn.QueryAsync<AdmissionCashRequest>(sQueryReq, new
            {
                model.PageNo,
                model.PageRowsCount,
                model.AdmissionMasterId,
                model.StageId,
                model.WorkflowId,
                model.PatientNationalCode,
                model.PatientFullName,
                RoleId = roleId
            }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();

            result.Successfull = true;
            return result;
        }
    }


    public async Task<IEnumerable<AdmissionCashGrouByFundType>> GetAdmissionCashGroupByFundType(
        GetAdmissionCashGrouByFundType model)
    {
        using var conn = Connection;
        var sQuery = "[mc].[Spc_AdmissionCashGroupByFundType]";
        conn.Open();
        var result = await conn.QueryAsync<AdmissionCashGrouByFundType>(sQuery,
            new
            {
                model.CreateDate,
                model.UserId
            }, commandType: CommandType.StoredProcedure);
        conn.Close();

        return result;
    }


    public async Task<CSVViewModel<IEnumerable>> ExportCashSummeryUserCsv(GetAdmissionCashGrouByFundType model)
    {
        var getPage = await GetAdmissionCashGroupByFundType(model);
        var result = new CSVViewModel<IEnumerable>
        {
            Columns =
                "جریان کار,مرحله,نقدی,کارتخوان,فیش,حساب باز,حساب باز - کسر و اضافه صندوق پرسنل,حساب باز - خدمات اعتباری بیمار,حساب باز  -حق الزحمهطبیب,حساب باز - مساعده پرسنل,حساب باز - مددکاری,حساب باز - مابه تفاوت بیمه,حساب باز - خدمات اعتباری طبیب "
        };
        result.Rows = from p in getPage
            select new
            {
                p.Workflow,
                p.Stage,
                p.Cash,
                p.Pos,
                p.BankReceipt,
                p.AccountReceivable,
                p.AccountReceivableEmployeeDeductionAndAddition,
                p.AccountReceivablePatientCredit,
                p.AccountReceivableAttenderCommission,
                p.AccountReceivableEmployeeCredit,
                p.AccountReceivableCharityCredit,
                p.AccountReceivableInsurerCredit,
                p.AccountReceivableAttenderCredit
            };
        return result;
    }

    public async Task<AdmissionPaymentCashInfo> GetAdmissionPaymentCashInfo(GetAdmissionPaymentCashInfo model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_Admission_CashPayment_Info]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<AdmissionPaymentCashInfo>(sQuery,
                new
                {
                    model.AdmissionId,
                    model.AdmissionWorkflowId,
                    model.AdmissionStageId,
                    model.AdmissionActionId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }


    public List<AdmissionCashPayment> SetIsAccess(List<AdmissionCashPayment> list, int userId)
    {
        foreach (var item in list) item.IsAccess = item.UserId == userId;

        return list;
    }

    public async Task<List<DetailAdmissionCash>> GetDetailAdmissionCash(DetailCash model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_AdmissionCashLine_GetDetail]";
            conn.Open();
            var result = await conn.QueryAsync<DetailAdmissionCash>(sQuery, new
            {
                model.CashId,
                model.RowNumber
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result.ToList();
        }
    }

    public async Task<string> ValidateCashLinePermission(AdmissionCheckPermissionViewModel model)
    {
        var error = "";

        if (model == null)
        {
            error = "درخواست معتبر نمی باشد";
            return error;
        }

        await Task.Run(async () =>
        {
            #region

            byte actionId = 0;

            if (model.Id == 0)
            {
                var getAction = new GetAction();
                var stageAction = new ActionModel();
                getAction.CompanyId = model.CompanyId;
                getAction.StageId = model.StageId;
                getAction.WorkflowId = model.WorkflowId;
                getAction.Priority = 1;
                stageAction = await _stageActionRepository.GetAction(getAction);
                actionId = stageAction.ActionId;
            }
            else
            {
                actionId = model.ActionId;
            }

            var permission = await _roleWorklfowPermissionRepository.CheckRoleWorkflowPermission(model.WorkflowId,
                model.BranchId, model.StageId, actionId, model.RoleId);

            if (permission != 1)
            {
                var stage = await _stageRepository.GetName(model.StageId);
                error = $" {stage} دسترسی ندارید";
            }

            #endregion
        });

        return error;
    }
}