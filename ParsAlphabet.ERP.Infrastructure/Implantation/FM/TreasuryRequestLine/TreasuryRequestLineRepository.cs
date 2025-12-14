using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.WF.StageStepConfig;
using ParsAlphabet.ERP.Application.Interfaces._Login;
using ParsAlphabet.ERP.Application.Interfaces.FM.TreasuryRequest;
using ParsAlphabet.ERP.Application.Interfaces.FM.TreasuryRequestLine;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.TreasurySubject;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.FiscalYear;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.Stage;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.WF.StageFundItemType;
using GetAction = ParsAlphabet.ERP.Application.Dtos.WF.StageAction.GetAction;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.TreasuryRequestLine;

public class TreasuryRequestLineRepository : ITreasuryRequestLineRepository
{
    public readonly IHttpContextAccessor _accessor;
    private readonly ICompanyRepository _companyRepository;
    private readonly IConfiguration _config;
    private readonly FiscalYearRepository _fiscalYearRepository;
    private readonly ILoginRepository _loginRepository;
    private readonly StageActionRepository _stageActionRepository;
    private readonly StageFundItemTypeRepository _stageFundItemTypeRepository;
    private readonly StageRepository _stageRepository;
    private readonly ITreasuryRequestRepository _treasuryRequestRepository;
    private readonly TreasurySubjectRepository _treasurySubjectRepository;

    public TreasuryRequestLineRepository(
        IConfiguration config,
        IHttpContextAccessor accessor,
        ICompanyRepository companyRepository,
        StageFundItemTypeRepository stageFundItemTypeRepository,
        TreasurySubjectRepository treasurySubjectRepository,
        FiscalYearRepository fiscalYearRepository,
        StageActionRepository stageActionRepository,
        ITreasuryRequestRepository treasuryRequestRepository,
        StageRepository stageRepository,
        ILoginRepository loginRepository
    )
    {
        _accessor = accessor;
        _config = config;
        _companyRepository = companyRepository;
        _stageFundItemTypeRepository = stageFundItemTypeRepository;
        _treasurySubjectRepository = treasurySubjectRepository;
        _fiscalYearRepository = fiscalYearRepository;
        _stageActionRepository = stageActionRepository;
        _treasuryRequestRepository = treasuryRequestRepository;
        _stageRepository = stageRepository;
        _loginRepository = loginRepository;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));


    public async Task<MyResultPage<TreasuryRequestLineDisplay>> Display(GetPageViewModel model, int userId, byte roleId)

    {
        var result = new MyResultPage<TreasuryRequestLineDisplay>
        {
            Data = new TreasuryRequestLineDisplay()
        };

        var directPaging = Convert.ToInt32(model.Form_KeyValue[2]?.ToString());
        var paginationParameters = new DynamicParameters();
        long treasuryIdFromPagination = 0;
        var checkAuthenticate = new CheckAuthenticateViewModel
        {
            ControllerName = "TreasuryRequestApi",
            OprType = "VIWALL",
            UserId = userId
        };


        // check access VIWALL
        var checkAccessViewAll = await _loginRepository.GetAuthenticate(checkAuthenticate);


        if (directPaging > 0)
        {
            paginationParameters.Add("TableName", "[fm].[treasury]");
            paginationParameters.Add("IdColumnName", "[fm].[treasury].Id");
            paginationParameters.Add("IdColumnValue", Convert.ToInt32(model.Form_KeyValue[0]?.ToString()));
            paginationParameters.Add("RoleId", roleId);

            var filter = string.Empty;
            if (checkAccessViewAll.Successfull)
                filter =
                    " AND [fm].[treasury].stageId in (select s.Id from wf.Stage s WHERE s.WorkflowCategoryId=6 AND s.StageClassId=1)";
            else
                filter =
                    $" AND [fm].[treasury].stageId in (select s.Id from wf.Stage s WHERE s.WorkflowCategoryId=6 AND s.StageClassId=1) AND [fm].[treasury].CreateUserId={userId} ";

            if (model.Form_KeyValue[3]?.ToString() == "1")
                filter += " AND [fm].[treasury].CreateBySystem = 0";

            paginationParameters.Add("FilterParam", filter);
            paginationParameters.Add("Direction", directPaging);

            using (var conn = Connection)
            {
                var sQuery = "[pb].[Spc_Tables_NextPrev]";
                conn.Open();
                treasuryIdFromPagination = await conn.ExecuteScalarAsync<long>(sQuery, paginationParameters,
                    commandType: CommandType.StoredProcedure);
            }
        }

        var treasuryId = treasuryIdFromPagination == 0
            ? long.Parse(model.Form_KeyValue[0]?.ToString())
            : treasuryIdFromPagination;
        var parameters = new DynamicParameters();
        var isDefaultCurrency = Convert.ToBoolean(Convert.ToInt32(model.Form_KeyValue[1]?.ToString()));

        parameters.Add("TreasuryId", treasuryId);
        parameters.Add("CompanyId", model.CompanyId);
        parameters.Add("PageNo");
        parameters.Add("PageRowsCount");
        parameters.Add("BranchId");
        parameters.Add("StageId");
        parameters.Add("FromTreasuryDate");
        parameters.Add("ToTreasuryDate");
        parameters.Add("RoleId", roleId);
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasuryRequest_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<TreasuryRequestLineDisplay>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).FirstOrDefault();
        }

        if (result.Data != null)
        {
            result.Data.IsPreviousStage =
                await _stageFundItemTypeRepository.GetHasStagePrevious(result.Data.StageId, result.Data.WorkflowId);


            var getTreasuryAction = new GetAction();
            getTreasuryAction.CompanyId = model.CompanyId;
            getTreasuryAction.StageId = result.Data.StageId;
            getTreasuryAction.ActionId = result.Data.ActionId;
            getTreasuryAction.WorkflowId = result.Data.WorkflowId;

            var stageAction = await _stageActionRepository.GetAction(getTreasuryAction);
            if (stageAction != null)
            {
                result.Data.IsDataEntry = stageAction.IsDataEntry;
                result.Data.IsBank = stageAction.IsBank;
                result.Data.IsTreasurySubject = stageAction.IsTreasurySubject;
            }

            result.Data.JsonTreasuryRequestLineList =
                new MyResultStageStepConfigPage<List<Application.Dtos.FM.TreasuryRequestLine.TreasuryRequestLine>>();

            result.Data.JsonTreasuryRequestLineList.Columns = new GetStageStepConfigColumnsViewModel();
            result.Data.JsonTreasuryRequestLineList.Columns.HeaderType = "outline";
            result.Data.JsonTreasuryRequestLineList.Columns.Title = "لیست گردش";

            if (!isDefaultCurrency)
            {
                result.Data.JsonTreasuryRequestLineList.HeaderColumns =
                    GetTreasuryRequestLineAdvanceElement(model.CompanyId);
            }
            else
            {
                var stageId = result.Data.StageId.ToString();
                short workFlowCategoryId = 6;
                result.Data.JsonTreasuryRequestLineList.HeaderColumns =
                    GetTreasuryRequestLineSimpleElement(stageId, workFlowCategoryId);
            }

            result.Columns = GetTreasuryRequestHeaderColumns(result.Data.StageId);
        }
        else
        {
            result.Columns = GetTreasuryRequestHeaderColumns(0);
        }

        return result;
    }

    public async Task<MyResultPage<TreasuryRequestLineDisplay>> GetHeader(GetPageViewModel model, byte roleId)
    {
        var result = new MyResultPage<TreasuryRequestLineDisplay>
        {
            Data = new TreasuryRequestLineDisplay()
        };


        var treasuryId = model.Form_KeyValue[0]?.ToString();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo");
        parameters.Add("PageRowsCount");
        parameters.Add("TreasuryId", treasuryId);
        parameters.Add("BranchId");
        parameters.Add("WorkflowId");
        parameters.Add("StageId");
        parameters.Add("FromTreasuryDate");
        parameters.Add("ToTreasuryDate");
        parameters.Add("TreasurySubject");
        parameters.Add("AccountDetail");
        parameters.Add("NoSeriesId");
        parameters.Add("CreateUserId");
        parameters.Add("ActionId");
        parameters.Add("CompanyId", model.CompanyId);
        parameters.Add("RoleId", roleId);

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasuryRequest_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<TreasuryRequestLineDisplay>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).FirstOrDefault();
        }

        if (result.Data != null)
        {
            if (result.Data.AccountDetailId > 0 && !string.IsNullOrEmpty(result.Data.AccountDetailName))
                result.Data.AccountDetailName = result.Data.AccountDetailName;


            var getTreasuryAction = new GetAction();
            getTreasuryAction.CompanyId = model.CompanyId;
            getTreasuryAction.StageId = result.Data.StageId;
            getTreasuryAction.ActionId = result.Data.ActionId;
            getTreasuryAction.WorkflowId = result.Data.WorkflowId;

            var stageAction = await _stageActionRepository.GetAction(getTreasuryAction);

            result.Data.IsPreviousStage =
                await _stageFundItemTypeRepository.GetHasStagePrevious(result.Data.StageId, result.Data.WorkflowId);

            result.Data.IsDataEntry = stageAction.IsDataEntry;
            result.Data.IsBank = stageAction.IsBank;
            result.Data.IsTreasurySubject = stageAction.IsTreasurySubject;

            result.Columns = GetTreasuryRequestHeaderColumns(result.Data.StageId);
        }
        else
        {
            result.Columns = GetTreasuryRequestHeaderColumns(0);
        }

        return result;
    }

    public async Task<MyResultStageStepConfigPage<List<Application.Dtos.FM.TreasuryRequestLine.TreasuryRequestLine>>>
        GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultStageStepConfigPage<List<Application.Dtos.FM.TreasuryRequestLine.TreasuryRequestLine>>
        {
            Data = new List<Application.Dtos.FM.TreasuryRequestLine.TreasuryRequestLine>()
        };

        int? p_id = null, p_fundTypeId = null, p_bankId = null, p_documentNo = null;
        var isDefaultCurrency = Convert.ToBoolean(Convert.ToInt32(model.Form_KeyValue[1]?.ToString()));

        switch (model.FieldItem)
        {
            case "id":
                p_id = Convert.ToInt32(model.FieldValue);
                break;
            case "documentNo":
                p_documentNo = Convert.ToInt32(model.FieldValue);
                break;
            case "bank":
                p_bankId = Convert.ToInt32(model.FieldValue);
                break;
            case "fundType":
                p_fundTypeId = Convert.ToInt32(model.FieldValue);
                break;
        }


        var stageId = Convert.ToInt16(model.Form_KeyValue[4]?.ToString());
        var workflowId = Convert.ToInt32(model.Form_KeyValue[5]?.ToString());
        if (!isDefaultCurrency)
        {
            result.HeaderColumns = GetTreasuryRequestLineAdvanceElement(model.CompanyId);
            result.Columns = await GetTreasuryRequestLineByFundTypeAdvanceColumns(stageId, workflowId);
        }
        else
        {
            result.Columns = await GetTreasuryRequestLineByFundTypeSimpleColumns(stageId, workflowId);
        }

        var parameters = new DynamicParameters();
        parameters.Add("HeaderId", Convert.ToInt64(model.Form_KeyValue[0]?.ToString()));
        parameters.Add("TreasuryLineId", p_id);
        parameters.Add("FundTypeId", p_fundTypeId);
        parameters.Add("BankId", p_bankId);
        parameters.Add("DocumentNo", p_documentNo);
        parameters.Add("IsDefaultCurrency", isDefaultCurrency);
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasuryRequestLine_GetPage]";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<Application.Dtos.FM.TreasuryRequestLine.TreasuryRequestLine>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        if (result.Data.ListHasRow())
        {
            var columnsHasSum = result.Columns.DataColumns.Where(c => !c.CalculateSum).Select(v => v.Id).ToList();

            foreach (var item in columnsHasSum)
            {
                var col = result.Columns.DataColumns.Where(x => x.Id == item).SingleOrDefault();

                var sumTreasury = result.Data.Sum(s => decimal.Parse(GetPropValue(s, item).ToString()));
                col.SumValue = sumTreasury;
            }
        }

        if (model.SortModel != null && !string.IsNullOrEmpty(model.SortModel.ColId) &&
            !string.IsNullOrEmpty(model.SortModel.Sort))
        {
            var res = result.Data.AsQueryable();
            result.Data = res.OrderBy(model.SortModel).ToList();
        }
        else
        {
            result.Data = result.Data.OrderByDescending(trl => trl.CreateDateTime).ToList();
        }

        return result;
    }

    public async Task<TreasuryRequestLineSum> GetTreasuryRequestLineSum(NewGetPageViewModel model)
    {
        int? p_id = null, p_fundTypeId = null, p_bankId = null, p_documentNo = null;
        var isDefaultCurrency = Convert.ToBoolean(Convert.ToInt32(model.Form_KeyValue[1]?.ToString()));

        switch (model.FieldItem)
        {
            case "id":
                p_id = Convert.ToInt32(model.FieldValue);
                break;
            case "documentNo":
                p_documentNo = Convert.ToInt32(model.FieldValue);
                break;
            case "bank":
                p_bankId = Convert.ToInt32(model.FieldValue);
                break;
            case "fundType":
                p_fundTypeId = Convert.ToInt32(model.FieldValue);
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("HeaderId", Convert.ToInt64(model.Form_KeyValue[0]?.ToString()));
        parameters.Add("TreasuryLineId", p_id);
        parameters.Add("FundTypeId", p_fundTypeId);
        parameters.Add("BankId", p_bankId);
        parameters.Add("DocumentNo", p_documentNo);
        parameters.Add("IsDefaultCurrency", isDefaultCurrency);

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasuryRequestLine_Sum]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<TreasuryRequestLineSum>(sQuery, parameters,
                commandType: CommandType.StoredProcedure);

            return result;
        }
    }

    public async Task<TreasuryRequestLineResult> Save(TreasuryRequestLineModel model, byte roleId)
    {
        var result = new TreasuryRequestLineResult();

        var validateResult = await ValidateSaveTreasuryRequestLine(model.TreasuryId, model.CompanyId, model.FundTypeId,
            model.BondDueDate, roleId);

        if (validateResult.ListHasRow())
        {
            result.Successfull = false;
            result.ValidationErrors = validateResult;
            return result;
        }

        var bankReport =
            await _stageFundItemTypeRepository.GetStageBankReport(model.StageId, model.FundTypeId, model.InOut);
        var defaultCurrncyId = _companyRepository.GetDefaultCurrency(model.CompanyId).Result;
        var Step = model.Step;
        ;

        if (model.Id == 0)
        {
            var getTreasuryAction = new GetAction();
            getTreasuryAction.CompanyId = model.CompanyId;
            getTreasuryAction.StageId = model.StageId;
            getTreasuryAction.Priority = 1;
            getTreasuryAction.WorkflowId = model.WorkflowId;
            var stageAction = await _stageActionRepository.GetAction(getTreasuryAction);
            model.Actionid = stageAction.ActionId;

            var stageClassId = await _stageRepository.GetStageClassId(model.StageId);
            Step = model.Step == 0 ? 1 : model.Step;

            if (stageClassId == 1 && (model.FundTypeId == 6 || model.FundTypeId == 8))
                Step = 0;
        }
        else
        {
            model.LastStage = 0;
            model.Actionid = 0;
            Step = 0;
        }


        // 1:نقدی
        //4:فیش
        //5:حواله
        //6: اوراق صادره
        //8: چک صادره
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spc_TreasuryRequestLine_InsUpd]";
            conn.Open();
            var output = await conn.ExecuteScalarAsync<int>(sQuery, new
            {
                CurrencyId = model.CurrencyId == null ? defaultCurrncyId : model.CurrencyId,
                FinalAmount = model.AmountExchange == null ? model.Amount : model.AmountExchange,
                ExchangeRate = model.CurrencyId == null ? 1 : model.ExchangeRate,
                model.CreateUserId,
                model.FundTypeId,
                Step,
                model.InOut,
                HeaderId = model.TreasuryId,
                model.CreateDateTime,
                BankAccountId = model.BankAccountId == null ? 0 : model.BankAccountId,
                model.TransitNo,
                ActionId = model.Actionid,
                BankReport = bankReport,
                model.BankId,
                model.DocumentNo,
                TreasuryLineDetailId = model.TreasuryDetailId,
                model.Id
            }, commandType: CommandType.StoredProcedure);

            result.Successfull = output > 0;
            result.Status = result.Successfull ? 100 : -100;
            result.StatusMessage = "عملیات با موفقیت انجام پذیرفت";
        }


        return result;
    }

    public async Task<MyResultPage<TreasuryRequestLineGetReccord>> GetRecordById(GetTreasuryRequestLine model)

    {
        var result = new MyResultPage<TreasuryRequestLineGetReccord>
        {
            Data = new TreasuryRequestLineGetReccord()
        };


        var parameters = new DynamicParameters();

        parameters.Add("TreasuryId");
        parameters.Add("FundTypeId", model.FundTypeId);
        parameters.Add("PageNo");
        parameters.Add("PageRowsCount");
        parameters.Add("IsDefaultCurrency", model.IsDefaultCurrency);

        //1: نقدی
        if (model.FundTypeId == 1)
        {
            parameters.Add("TreasuryCashId", model.Id);
            using (var conn = Connection)
            {
                var sQuery = "[fm].[Spc_TreasuryCash_SelectTreasuryRequestCashByTreasuryId]";
                conn.Open();
                result.Data = await conn.QueryFirstOrDefaultAsync<TreasuryRequestLineGetReccord>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure);
            }
        }
        //6: اوراق صادره
        //8: چک صادره
        else if (model.FundTypeId == 6 || model.FundTypeId == 8)
        {
            parameters.Add("TreasuryCheckId", model.Id);
            parameters.Add("BankId");

            using (var conn = Connection)
            {
                var sQuery = "[fm].[Spc_TreasuryCheck_SelectTreasuryRequestCheckByTreasuryId]";
                conn.Open();
                result.Data = await conn.QueryFirstOrDefaultAsync<TreasuryRequestLineGetReccord>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure);
            }
        }
        //4:فیش
        //5:حواله
        else if (model.FundTypeId == 4 || model.FundTypeId == 5)
        {
            parameters.Add("TreasuryDraftId", model.Id);
            parameters.Add("BankId");

            using (var conn = Connection)
            {
                var sQuery = "[fm].[Spc_TreasuryDraft_SelectTreasuryRequestDraftByTreasuryId]";
                conn.Open();
                result.Data = await conn.QueryFirstOrDefaultAsync<TreasuryRequestLineGetReccord>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure);
            }
        }

        if (result.Data != null)
        {
            result.Data.AmountExchange = result.Data.Amount;
            result.Data.Amount = result.Data.AmountExchange / result.Data.ExchangeRate;
        }

        return result;
    }

    public async Task<MyResultStatus> Delete(GetTreasuryRequestLine model, int companyId, byte roleId)
    {
        var result = new MyResultStatus();
        var validateResult = await ValidateDeleteTreasuryRequestLine(model, companyId, roleId);

        if (validateResult.ListHasRow())
        {
            result.Successfull = false;
            result.ValidationErrors = validateResult;
            return result;
        }

        var output = 0;
        var sQuery = "[fm].[Spc_TreasuryLine_Delete]";
        using (var conn = Connection)
        {
            conn.Open();
            output = await conn.QueryFirstOrDefaultAsync<int>(
                sQuery, new
                {
                    model.Id
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }


        result.Successfull = output > 0;
        result.Status = result.Successfull ? 100 : -100;
        result.StatusMessage = !result.Successfull ? "عملیات حذف با مشکل مواجه شد" : "";

        return result;
    }

    public async Task<CSVViewModel<IEnumerable>> TreasuryRequestLineCSV(NewGetPageViewModel model)
    {
        var treasury = await GetPage(model);
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = "شناسه,نوع وجه,دریافت/پرداخت,بانک,شماره حساب,مبلغ,کاربر ثبت کننده,تاریخ و زمان ثبت"
        };


        result.Rows = from p in treasury.Data
            select new
            {
                p.Id,
                p.FundType,
                p.InOutName,
                p.Bank,
                p.BankAccount,
                p.DisplayAmount,
                p.CreateUserFullName,
                p.CreateDateTimePersian
            };

        return result;
    }

    public GetColumnsViewModel GetTreasuryRequestHeaderColumns(short stageId)
    {
        var list = new GetColumnsViewModel
        {
            Title = "مشخصات درخواست خزانه",
            Classes = "group-box-green",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", IsPrimary = true, Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 8
                },
                new()
                {
                    Id = "createUserId", IsPrimary = true, Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int,
                    Width = 5
                },

                new()
                {
                    Id = "headerTransactionDatePersian", IsPrimary = true, Title = "تاریخ برگه",
                    Type = (int)SqlDbType.VarChar, Size = 10, IsDtParameter = true,
                    Editable = true, InputOrder = 7, Width = 8, InputType = "datepicker",
                    Validations = new List<FormPlate1.Validation>
                        { new() { ValidationName = "data-parsley-shamsidate" } },
                    InputMask = new InputMask { Mask = "'mask':'9999/99/99'" }, IsFocus = true
                },
                new() { Id = "no", Title = "شماره برگه", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 8 },
                new()
                {
                    Id = "branchId", Title = "شناسه شعبه", Type = (int)SqlDbType.TinyInt, Width = 5, IsPrimary = true
                },
                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.TinyInt, IsDtParameter = true, Width = 20
                },

                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 20
                },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 20
                },
                new() { Id = "stageClassId", IsPrimary = true, Type = (int)SqlDbType.TinyInt },

                new()
                {
                    Id = "treasurySubjectId", Title = "موضوع دریافت / پرداخت", Type = (int)SqlDbType.Int, Width = 12,
                    Editable = true, InputOrder = 1, IsReadOnly = true, InputType = "select",
                    IsSelect2 = true,
                    Inputs =
                        _treasurySubjectRepository.GetTreasurySubjectByStageDropDown(stageId, 6, 1).Result.ToList(),
                    IsFocus = true, FillType = "back", IsPrimary = true
                },
                new()
                {
                    Id = "treasurySubject", Title = "موضوع دریافت پرداخت", IsPrimary = true,
                    Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true, Width = 20
                },

                new()
                {
                    Id = "accountGLId", Title = "کد کل", Type = (int)SqlDbType.SmallInt, Width = 6, Editable = true,
                    InputOrder = 2, IsReadOnly = true, InputType = "select",
                    IsSelect2 = true, Select2Title = "accountGLName", FillType = "back", IsPrimary = true
                },
                new()
                {
                    Id = "accountGL", Title = "حساب کل", IsPrimary = true, Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 20
                },


                new()
                {
                    Id = "accountSGLId", Title = "کد معین", Type = (int)SqlDbType.SmallInt, Width = 6, Editable = true,
                    InputOrder = 3, IsReadOnly = true, InputType = "select",
                    Inputs = null, IsSelect2 = true, Select2Title = "accountSGLName", FillType = "back",
                    IsPrimary = true
                },
                new()
                {
                    Id = "accountSG", Title = "حساب معین", IsPrimary = true, Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 20
                },

                new()
                {
                    Id = "accountDetailId", Title = "حساب تفصیل", Type = (int)SqlDbType.SmallInt, Width = 6,
                    Editable = true, InputOrder = 5, IsReadOnly = true, InputType = "select",
                    Inputs = null, IsSelect2 = true, Select2Title = "accountDetailName", FillType = "back",
                    IsPrimary = true
                },
                new()
                {
                    Id = "accountDetail", Title = "حساب تفصیل", IsPrimary = true, Type = (int)SqlDbType.NVarChar,
                    Size = 50, IsDtParameter = true, Width = 20
                },

                new()
                {
                    Id = "actionId", Title = "گام مرحله", Type = (int)SqlDbType.NVarChar, Width = 4, IsPrimary = true
                },
                new()
                {
                    Id = "actionIdName", Title = "گام مرحله", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "note", Title = "توضیحات", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    Width = 20, Editable = true, IsNotFocusSelect = true, InputOrder = 8, IsFocus = true,
                    IsPrimary = true
                },
                new()
                {
                    Id = "treasuryFlowTypeId", Title = "دریافت پرداخت", Type = (int)SqlDbType.TinyInt, IsPrimary = true
                },
                new()
                {
                    Id = "createDateTime", Title = "تاریخ ثبت", Type = (int)SqlDbType.Date, Size = 10, IsPrimary = true,
                    InputMask = new InputMask { Mask = "'mask':''" }
                },
                new() { Id = "isDataEntry", IsPrimary = true },
                new() { Id = "currentInOut", IsPrimary = true },
                new() { Id = "isBank", IsPrimary = true },
                new() { Id = "isRequest", IsPrimary = true },
                new() { Id = "isPreviousStage", Title = "", IsPrimary = true },
                new() { Id = "accountDetailRequired", IsPrimary = true },
                new() { Id = "stageId", Title = "مرحله", IsPrimary = true, Type = (int)SqlDbType.Int, Width = 10 },
                new() { Id = "workflowId", IsPrimary = true, Type = (int)SqlDbType.Int },
                new() { Id = "noSeriesId", IsPrimary = true, Type = (int)SqlDbType.SmallInt }
            },

            Navigations = new List<NavigateToPage>
            {
                new()
                {
                    ColumnId = "requestId",
                    PageType = PageType.Mdal,
                    Url = "/FM/TreasuryRequestLine/display",
                    Modal = new Modal
                    {
                        HeaderTitle = "نمایش اطلاعات درخواست",
                        ModalSize = "xxlg"
                    },
                    Parameters = new List<FormKeyValue>
                    {
                        new()
                        {
                            Name = "id"
                        },
                        new()
                        {
                            Name = "requestId",
                            Value = "0"
                        },
                        new()
                        {
                            Name = "isDefaultCurrency",
                            Value = "1"
                        },
                        new()
                        {
                            Name = "isShowMode",
                            Value = "1"
                        }
                    }
                }
            }
        };

        return list;
    }

    public GetStageStepConfigColumnsViewModel GetTreasuryRequestLineSimpleElement(string stageId, short workflowId)
    {
        var fundTypeList = _stageFundItemTypeRepository
            .GetFundTypeListByStageIdAndWorkFlowCategoryId(stageId, workflowId).Result;
        var firstFundType = fundTypeList.FirstOrDefault().Id;


        var list = new GetStageStepConfigColumnsViewModel
        {
            HasStageStepConfig = true,
            StageStepConfig = new StageStepConfigModel
            {
                HeaderFields = new List<StageStepHeaderColumn>
                {
                    new()
                    {
                        FieldId = "stageId"
                    },
                    new()
                    {
                        FieldId = "workFlowId"
                    }
                },
                LineFields = new List<StageStepLineColumn>
                    { new() { FieldId = "fundTypeId", TableName = "FM.TreasuryLine" } }
            },
            DataColumns = new List<DataStageStepConfigColumnsViewModel>
            {
                new() { Id = "id", IsPrimary = true, Title = "شناسه", Type = (int)SqlDbType.Int, Width = 2 },
                new()
                {
                    Id = "stageId", IsPrimary = true, Title = "شناسه", Type = (int)SqlDbType.SmallInt,
                    IsDtParameter = false, Width = 5
                },
                new()
                {
                    Id = "workflowId", IsPrimary = true, Title = "جریان کار", Type = (int)SqlDbType.Int,
                    IsDtParameter = false, Width = 5
                },
                new()
                {
                    Id = "fundTypeId", Title = "نوع وجه", IsDtParameter = true, Width = 2, IsFocus = true,
                    InputType = "select", IsSelect2 = true, Inputs = fundTypeList
                },
                new()
                {
                    Id = "inOut", Title = "دریافت/پرداخت", IsDtParameter = true, IsFilterParameter = true,
                    HeaderReadOnly = true, Width = 2, InputType = "select", IsSelect2 = true,
                    Validations = new List<FormPlate1.Validation> { new() { ValidationName = "required" } },
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = "/api/WFApi/inout_getdropdown"
                    },
                    IsFocus = true
                },
                new()
                {
                    Id = "bankId", Title = "بانک", IsDtParameter = true, Width = 2, Order = true, InputType = "select",
                    IsFocus = true, IsSelect2 = true,
                    Validations = new List<FormPlate1.Validation> { new() { ValidationName = "required" } },
                    FillColumnInputSelectIds = new List<string> { "bankAccountId" },
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = "/api/FM/BankApi/getdropdownhasaccount"
                    }
                },

                new()
                {
                    Id = "bankAccountId", Title = "شماره حساب", IsDtParameter = true, Order = true,
                    InputType2 = "select",
                    Validations = new List<FormPlate1.Validation> { new() { ValidationName = "required" } },
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = "/api/FM/BankAccountApi/getdropdown_bankId",
                        Parameters = new List<GetDataColumnParameterModel>
                        {
                            new()
                            {
                                Id = "bankId",
                                InlineType = false
                            }
                        }
                    },
                    IsSelect2 = true, Width = 2
                },


                new()
                {
                    Id = "amount", Title = "مبلغ", Type = (int)SqlDbType.Decimal, Size = 11, IsDtParameter = true,
                    IsFilterParameter = false, IsCommaSep = true,
                    Width = 2, InputType = "money", HasSumValue = true, Order = true, MaxLength = 19,
                    Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-max", Value1 = "999999999999999.999" }
                    }
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "headerLineInsUp", Title = "افزودن", ClassName = "btn btn-light border-orange",
                    IconName = "fa fa-arrow-down"
                }
            }
        };

        return list;
    }

    public GetStageStepConfigColumnsViewModel GetTreasuryRequestLineAdvanceElement(int companyId)
    {
        var list = new GetStageStepConfigColumnsViewModel
        {
            HasStageStepConfig = true,
            StageStepConfig = new StageStepConfigModel
            {
                HeaderFields = new List<StageStepHeaderColumn>
                {
                    new()
                    {
                        FieldId = "stageId"
                    },
                    new()
                    {
                        FieldId = "workFlowId"
                    }
                },
                LineFields = new List<StageStepLineColumn>
                    { new() { FieldId = "fundTypeId", TableName = "FM.TreasuryLine" } }
            },
            DataColumns = new List<DataStageStepConfigColumnsViewModel>
            {
                new() { Id = "id", IsPrimary = true, Title = "شناسه", Type = (int)SqlDbType.Int, Width = 2 },
                new()
                {
                    Id = "stageId", IsPrimary = true, Title = "شناسه", Type = (int)SqlDbType.SmallInt,
                    IsDtParameter = false, Width = 5
                },
                new()
                {
                    Id = "workflowId", IsPrimary = true, Title = "جریان کار", Type = (int)SqlDbType.Int,
                    IsDtParameter = false, Width = 5
                },

                new()
                {
                    Id = "fundTypeId", Title = "نوع وجه", IsDtParameter = true, Width = 2, IsFocus = true,
                    InputType = "select", IsSelect2 = true
                },
                new()
                {
                    Id = "inOut", Title = "دریافت پرداخت", IsDtParameter = true, IsFilterParameter = true,
                    HeaderReadOnly = true, Width = 2, InputType = "select", IsSelect2 = true,
                    Validations = new List<FormPlate1.Validation> { new() { ValidationName = "required" } },
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = "/api/WFApi/inout_getdropdown"
                    },
                    IsFocus = true
                },
                new()
                {
                    Id = "bankId", Title = "بانک", IsDtParameter = true, Width = 2, InputType = "select",
                    IsFocus = true, IsSelect2 = true,
                    Validations = new List<FormPlate1.Validation> { new() { ValidationName = "required" } },
                    FillColumnInputSelectIds = new List<string> { "bankAccountId" },
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = "/api/FM/BankApi/getdropdownisactive"
                    }
                },
                new()
                {
                    Id = "bankAccountId", Title = "شماره حساب", IsDtParameter = true, InputType2 = "select",
                    Validations = new List<FormPlate1.Validation> { new() { ValidationName = "required" } },
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = "/api/FM/BankAccountApi/getdropdown_bankId",
                        Parameters = new List<GetDataColumnParameterModel>
                        {
                            new()
                            {
                                Id = "bankId",
                                InlineType = false
                            }
                        }
                    },
                    IsSelect2 = true, Width = 2
                },
                new()
                {
                    Id = "currencyId", Title = "نوع ارز", IsDtParameter = true, Width = 2, InputType = "select",
                    IsSelect2 = true,
                    Validations = new List<FormPlate1.Validation> { new() { ValidationName = "required" } },
                    GetInputSelectConfig = new GetDataColumnConfig
                    {
                        FillUrl = "/api/GN/CurrencyApi/getdropdown"
                    }
                },
                new()
                {
                    Id = "exchangeRate", Title = "نرخ تسعیر", Size = 11, IsDtParameter = true, IsCommaSep = true,
                    Width = 2, InputType = "money",
                    Validations = new List<FormPlate1.Validation> { new() { ValidationName = "required" } }
                },

                new()
                {
                    Id = "amount", Title = "مبلغ", Type = (int)SqlDbType.Decimal, Size = 11, IsDtParameter = true,
                    IsFilterParameter = false, IsCommaSep = true, Width = 2, InputType = "money", HasSumValue = true,
                    Order = true, MaxLength = 19, Validations = new List<FormPlate1.Validation>
                    {
                        new() { ValidationName = "required" },
                        new() { ValidationName = "data-parsley-max", Value1 = "999999999999999.999" }
                    }
                },
                //,Validations=new List<FormPlate1.Validation>{ new FormPlate1.Validation { ValidationName="required"} } },
                new()
                {
                    Id = "amountExchange", Title = "مبلغ خارجی", Type = (int)SqlDbType.Int, Size = 11,
                    IsDtParameter = true, IsFilterParameter = false, IsCommaSep = true, HeaderReadOnly = true,
                    Width = 2, InputType = "money", HasSumValue = true,
                    Validations = new List<FormPlate1.Validation> { new() { ValidationName = "required" } }
                },

                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 10 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "headerLineInsUp", Title = "افزودن", ClassName = "btn btn-light border-orange",
                    IconName = "fa fa-arrow-down"
                }
            }
        };

        return list;
    }

    public async Task<GetStageStepConfigColumnsViewModel> GetTreasuryRequestLineByFundTypeSimpleColumns(short stageId,
        int workflowId)
    {
        var list = new GetStageStepConfigColumnsViewModel
        {
            Title = "لیست گردش",
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "currentInout", FieldValue = "2", Operator = "==" } },
            AnswerCondition = "color:#da1717",
            ElseAnswerCondition = "",
            ActionType = "inline",
            HeaderType = "outline",
            DataColumns = new List<DataStageStepConfigColumnsViewModel>(),
            Buttons = new List<GetActionColumnViewModel>()
        };

        list.DataColumns = new List<DataStageStepConfigColumnsViewModel>
        {
            new()
            {
                Id = "id", IsPrimary = true, Title = "شناسه", IsDtParameter = true, IsFilterParameter = true, Width = 6,
                Order = true, FilterType = "number"
            },
            new() { Id = "checkDetailId", Title = "شناسه چک", IsPrimary = true },
            new() { Id = "fundTypeId", IsPrimary = true },
            new()
            {
                Id = "fundType", Title = "نوع وجه", IsDtParameter = true, IsFilterParameter = true, Width = 5,
                Order = true, FilterType = "select2", FilterTypeApi = ""
            },
            new() { Id = "inOutName", Title = "دریافت/پرداخت", IsDtParameter = true, Width = 5 },
            new()
            {
                Id = "bank", Title = "بانک", IsDtParameter = true, IsFilterParameter = true, Width = 6,
                FilterType = "select2", FilterTypeApi = "/api/FM/BankApi/getdropdown"
            },
            new() { Id = "bankAccount", Title = "شماره حساب", IsDtParameter = true, Width = 6 },
            new()
            {
                Id = "displayAmount", Title = "مبلغ", Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true,
                IsCommaSep = true, Width = 7, InputType = "money", HasSumValue = true, Order = true, MaxLength = 15
            },
            new()
            {
                Id = "createUserFullName", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar,
                PublicColumn = true, IsDtParameter = true, Width = 6
            },
            new() { Id = "createUserId", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int, PublicColumn = true },
            new()
            {
                Id = "createDateTimePersian", Title = "تاریخ و زمان ثبت", Type = (int)SqlDbType.VarChar,
                PublicColumn = true, IsDtParameter = true, Width = 11
            },
            new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 6 }
        };

        list.Buttons = new List<GetActionColumnViewModel>
        {
            new() { Name = "edit", Title = "ویرایش", ClassName = "btn green_outline_1 ml-1", IconName = "fa fa-edit" },
            new() { Name = "delete", Title = "حذف", ClassName = "btn maroon_outline ml-1", IconName = "fa fa-trash" },
            new()
            {
                Name = "moreInfo", Title = "اطلاعات تکمیلی", ClassName = "btn blue_outline_1 ml-1",
                IconName = "fa fa-list",
                Condition = new List<ConditionPageTable>
                    { new() { FieldName = "fundTypeId", FieldValue = "3", Operator = "==" } }
            }
        };


        #region getStageStepConfig

        var config = new List<StageStepConfigGetColumn>();
        var stageStepParameters = new DynamicParameters();
        stageStepParameters.Add("StageId", stageId);
        stageStepParameters.Add("WorkflowId", workflowId);
        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_StageStepConfig_GetColumn]";
            conn.Open();
            config = (await conn.QueryAsync<StageStepConfigGetColumn>(sQuery, stageStepParameters,
                commandType: CommandType.StoredProcedure)).ToList();
        }

        list.DataColumns.ForEach(item =>
        {
            if (!config.Where(a => a.Name.ToLower() == item.Id.ToLower() || a.AliasName.ToLower() == item.Id.ToLower())
                    .Any() && item.Id != "action" && !item.IsPrimary && !item.PublicColumn)
                item.IsDtParameter = false;
        });


        list.DataColumns.ColumnWidthNormalization();

        #endregion

        return list;
    }

    public async Task<GetStageStepConfigColumnsViewModel> GetTreasuryRequestLineByFundTypeAdvanceColumns(short stageId,
        int workflowId)
    {
        var list = new GetStageStepConfigColumnsViewModel
        {
            Title = "لیست گردش",
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "currentInout", FieldValue = "2", Operator = "==" } },
            AnswerCondition = "color:#da1717",
            ElseAnswerCondition = "",
            ActionType = "inline",
            HeaderType = "outline",
            DataColumns = new List<DataStageStepConfigColumnsViewModel>(),
            Buttons = new List<GetActionColumnViewModel>()
        };


        list.DataColumns = new List<DataStageStepConfigColumnsViewModel>
        {
            new()
            {
                Id = "id", IsPrimary = true, Title = "شناسه", IsDtParameter = true, IsFilterParameter = true, Width = 6,
                Order = true, FilterType = "number"
            },
            new() { Id = "checkDetailId", Title = "شناسه چک", IsPrimary = true },
            new() { Id = "fundTypeId", IsPrimary = true },
            new()
            {
                Id = "fundType", Title = "نوع وجه", IsDtParameter = true, IsFilterParameter = true, Width = 5,
                Order = true, FilterType = "select2", FilterTypeApi = ""
            },
            new() { Id = "inOut", Title = "دریافت/پرداخت", IsDtParameter = true, Width = 5 },
            new()
            {
                Id = "bank", Title = "بانک", IsDtParameter = true, IsFilterParameter = true, Width = 6,
                FilterType = "select2", FilterTypeApi = "/api/FM/BankApi/getdropdown"
            },
            new() { Id = "bankAccount", Title = "شماره حساب", IsDtParameter = true, Width = 6 },
            new()
            {
                Id = "displayAmount", Title = "مبلغ", Type = (int)SqlDbType.Int, Size = 11, IsDtParameter = true,
                IsCommaSep = true, Width = 7, InputType = "money", MaxLength = 19, HasSumValue = true, Order = true
            },
            new()
            {
                Id = "createUserFullName", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar,
                PublicColumn = true, IsDtParameter = true, Width = 6
            },
            new() { Id = "createUserId", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.Int, PublicColumn = true },
            new()
            {
                Id = "createDateTimePersian", Title = "تاریخ و زمان ثبت", Type = (int)SqlDbType.VarChar,
                PublicColumn = true, IsDtParameter = true, Width = 11
            },
            new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 6 }
        };

        list.Buttons = new List<GetActionColumnViewModel>
        {
            new() { Name = "edit", Title = "ویرایش", ClassName = "btn green_outline_1 ml-1", IconName = "fa fa-edit" },
            new() { Name = "delete", Title = "حذف", ClassName = "btn maroon_outline ml-1", IconName = "fa fa-trash" },
            new()
            {
                Name = "moreInfo", Title = "اطلاعات تکمیلی", ClassName = "btn blue_outline_1 ml-1",
                IconName = "fa fa-list",
                Condition = new List<ConditionPageTable>
                    { new() { FieldName = "fundTypeId", FieldValue = "3", Operator = "==" } }
            }
        };

        #region getStageStepConfig

        var config = new List<StageStepConfigGetColumn>();
        var stageStepParameters = new DynamicParameters();
        stageStepParameters.Add("StageId", stageId);
        stageStepParameters.Add("WorkflowId", workflowId);
        using (var conn = Connection)
        {
            var sQuery = "[wf].[Spc_StageStepConfig_GetColumn]";
            conn.Open();
            config = (await conn.QueryAsync<StageStepConfigGetColumn>(sQuery, stageStepParameters,
                commandType: CommandType.StoredProcedure)).ToList();
        }

        list.DataColumns.ForEach(item =>
        {
            if (!config.Where(a => a.Name.ToLower() == item.Id.ToLower() || a.AliasName.ToLower() == item.Id.ToLower())
                    .Any() && item.Id != "action" && !item.IsPrimary && !item.PublicColumn)
                item.IsDtParameter = false;
        });

        #endregion

        list.DataColumns.ColumnWidthNormalization();
        return list;
    }

    public async Task<List<string>> ValidateSaveTreasuryRequestLine(int TreasuryId, int CompanyId, byte FundTypeId,
        DateTime? BondDueDate, byte roleId)
    {
        var error = new List<string>();
        var treasury = await _treasuryRequestRepository.GetRecordById(TreasuryId, CompanyId, roleId);

        await Task.Run(async () =>
        {
            //6: اوراق صادره
            //8: چک صادره
            if (FundTypeId == 6 || FundTypeId == 8)
                if (BondDueDate != null && BondDueDate < treasury.Data.TransactionDate)
                    error.Add("تاریخ سررسید چک باید بزرگتر مساوی تاریخ برگه باشد");

            #region بررسی وضعیت دوره مالی

            var resultCheckFiscalYear =
                await _fiscalYearRepository.GetFicalYearStatusByDate(treasury.Data.TransactionDate, CompanyId);
            if (!resultCheckFiscalYear.Successfull)
                error.Add(resultCheckFiscalYear.StatusMessage);

            #endregion
        });
        return error;
    }

    public async Task<List<string>> ValidateDeleteTreasuryRequestLine(GetTreasuryRequestLine model, int companyId,
        byte roleId)
    {
        var error = new List<string>();

        if (model == null)
        {
            error.Add("درخواست معتبر نمی باشد");
            return error;
        }

        await Task.Run(async () =>
        {
            #region برگه جاری مجوز حذف دارد؟

            var treasuryAction = new GetAction();

            var currentActionId = await GetActionIdByIdentityId(model.TreasuryId);
            treasuryAction.StageId = model.StageId;
            treasuryAction.ActionId = currentActionId;
            treasuryAction.WorkflowId = model.WorkflowId;
            var currentTreasuryStageAct = await _stageActionRepository.GetAction(treasuryAction);

            if (!currentTreasuryStageAct.IsDeleteLine) error.Add("مجاز به حذف سطر در این گام نمی باشید");

            #endregion

            #region بررسی وضعیت دوره مالی

            var treasury = await _treasuryRequestRepository.GetRecordById(model.TreasuryId, companyId, roleId);

            var resultCheckFiscalYear =
                await _fiscalYearRepository.GetFicalYearStatusByDate(treasury.Data.TransactionDate, companyId);

            if (!resultCheckFiscalYear.Successfull)
                error.Add(resultCheckFiscalYear.StatusMessage);

            #endregion
        });

        return error;
    }

    public async Task<byte> GetActionIdByIdentityId(int IdentityId)
    {
        using (var conn = Connection)
        {
            byte result = 0;
            var sQuery = "[pb].[Spc_Tables_GetTable]";
            conn.Open();

            result = await conn.QueryFirstOrDefaultAsync<byte>(sQuery, new
            {
                TableName = "fm.treasury",
                IdColumnName = "actionid",
                ColumnNameList = "actionid,Id",
                Filter =
                    $"Id={IdentityId}  AND stageId in (SELECT Id FROM wf.Stage s WHERE s.WorkflowCategoryId=6 AND s.StageClassId=1 AND s.IsActive=1)"
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            return result;
        }
    }
}