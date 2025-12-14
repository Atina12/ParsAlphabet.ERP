using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.FM.TreasuryReport;
using ParsAlphabet.ERP.Application.Interfaces.FM.TreasuryReport;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.TreasuryReport;

public class TreasuryReportRepository : ITreasuryReportRepository
{
    private readonly IConfiguration _reportConfig;

    public TreasuryReportRepository(IConfiguration reportConfig)
    {
        _reportConfig = reportConfig;
    }

    public IDbConnection Connection => new SqlConnection(_reportConfig.GetConnectionString("DefaultConnection"));

    public GetColumnsViewModel TreasuryFundingReportGetColumns()
    {
        var list = new GetColumnsViewModel
        {
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "currentInOut", FieldValue = "2", Operator = "==" } },
            AnswerCondition = "color:#da1717",
            ElseAnswerCondition = "",
            SumDynamic = true,
            GetSumApi = "/api/FM/TreasuryReportApi/reptreasuryfundsum",
            DataColumns = new List<DataColumnsViewModel>
            {
                new() { Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 5 },
                new() { Id = "requestId", IsPrimary = true },
                new() { Id = "stageId", IsPrimary = true },
                new() { Id = "workflowId", IsPrimary = true },
                new() { Id = "stageClassId", IsPrimary = true },
                new()
                {
                    Id = "treasuryId", Title = "شناسه سربرگ", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 6, HasLink = true
                },
                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 20
                },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 20
                },
                new()
                {
                    Id = "treasuryDateTimePersian", Title = "تاریخ برگه", Type = (int)SqlDbType.Int,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "fundType", Title = "نوع وجه", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "inOutIdName", Title = "دریافت/پرداخت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "treasurySubject", Title = "موضوع دریافت پرداخت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 8
                },
                new()
                {
                    Id = "documentNo", Title = "شماره سند", Type = (int)SqlDbType.NVarChar, Size = 120,
                    IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "bondSerialNo", Title = "سریال چک", Type = (int)SqlDbType.NVarChar, Size = 120,
                    IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "bank", Title = "بانک", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "bankAccount", Title = "حساب بانکی", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "currency", Title = "ارز", Type = (int)SqlDbType.Int, IsPersian = true, IsDtParameter = true,
                    Width = 5, IsCommaSep = true
                },
                new()
                {
                    Id = "accountDetail", Title = "حساب تفصیل", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "exchangeRate", Title = "نرخ تسعیر", Type = (int)SqlDbType.Int, HasSumValue = false,
                    IsCommaSep = true, IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "amountReceive", Title = "مبلغ دریافت ", Type = (int)SqlDbType.Money, HasSumValue = true,
                    IsCommaSep = true, IsDtParameter = true, Width = 9
                },
                new()
                {
                    Id = "amountPay", Title = "مبلغ پرداخت ", Type = (int)SqlDbType.Money, HasSumValue = true,
                    IsCommaSep = true, IsDtParameter = true, Width = 9
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "user", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "action", Title = "گام", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 8
                },
                new()
                {
                    Id = "description", Title = "توضیحات", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 12
                }
            }
        };

        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> TreasuryFundingReportCsv(GetTreasurySearchReport model, byte roleId)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                TreasuryFundingReportGetColumns().DataColumns.Where(a => a.IsDtParameter).Select(z => z.Title))
        };
        var getPage = await TreasuryFundingReportPreview(model, roleId);
        result.Rows = from p in getPage.Data
            select new
            {
                p.Id,
                p.TreasuryId,
                p.Workflow,
                p.Stage,
                p.TreasuryDateTimePersian,
                p.FundType,
                p.InOutIdName,
                p.TreasurySubject,
                p.Branch,
                p.DocumentNo,
                p.BondSerialNo,
                p.Bank,
                p.BankAccount,
                p.Currency,
                p.AccountDetail,
                p.ExchangeRate,
                p.AmountReceive,
                p.AmountPay,
                p.CreateDateTimePersian,
                p.User,
                p.Action,
                p.Description
            };
        return result;
    }

    public async Task<ReportViewModel<List<TreasurySearchReport>>> TreasuryFundingReportPreview(
        GetTreasurySearchReport model, byte roleId)
    {
        var result = new ReportViewModel<List<TreasurySearchReport>>
        {
            Data = new List<TreasurySearchReport>()
        };

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spr_TreasuryFunding_Report]";
            conn.Open();
            result.Data = (await conn.QueryAsync<TreasurySearchReport>(sQuery, new
            {
                model.PageNo,
                model.PageRowsCount,
                model.StageId,
                model.BranchId,
                model.WorkflowId,
                model.CurrencyId,
                model.TreasurySubjectId,
                model.ActionId,
                model.CreateUserId,
                model.FundTypeId,
                model.BankId,
                model.LastStep,
                model.InOut,
                model.CashFlowCategoryId,
                model.NoSeriesId,
                model.AccountDetailId,
                model.FromTreasuryDate,
                model.ToTreasuryDate,
                RoleId = roleId,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure)).ToList();
            result.Columns = TreasuryFundingReportGetColumns();
            conn.Close();
            return result;
        }
    }

    public async Task<TreasurySumReport> TreasuryServiceFundSumTotal(GetTreasurySearchReport model, byte roleId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spr_TreasuryFunding_Report_Sum]";
            conn.Open();

            var total = await conn.QueryFirstOrDefaultAsync<TreasurySumReport>(sQuery,
                new
                {
                    model.StageId,
                    model.BranchId,
                    model.WorkflowId,
                    model.CurrencyId,
                    model.TreasurySubjectId,
                    model.ActionId,
                    model.CreateUserId,
                    model.FundTypeId,
                    model.BankId,
                    model.LastStep,
                    model.InOut,
                    model.CashFlowCategoryId,
                    model.NoSeriesId,
                    model.AccountDetailId,
                    model.FromTreasuryDate,
                    model.ToTreasuryDate,
                    RoleId = roleId,
                    model.CompanyId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return total;
        }
    }

    public GetColumnsViewModel TreasuryBankAccountReportGetColumns()
    {
        var list = new GetColumnsViewModel
        {
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "currentInOut", FieldValue = "2", Operator = "==" } },
            AnswerCondition = "color:#da1717",
            ElseAnswerCondition = "",
            SumDynamic = true,
            GetSumApi = "/api/FM/TreasuryReportApi/treasurysumreportpreview",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, Size = 10, IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "requestId", Title = "شناسه مرجع", IsPrimary = true, Type = (int)SqlDbType.Int, Size = 10,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 20
                },
                new()
                {
                    Id = "stage", Title = "مرحله", IsPrimary = true, Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 15
                },
                new() { Id = "stageId", IsPrimary = true },
                new() { Id = "workflowId", IsPrimary = true },
                new() { Id = "stageClassId", IsPrimary = true },
                new()
                {
                    Id = "treasuryId", Title = "شناسه سربرگ", Type = (int)SqlDbType.Int, Size = 20,
                    IsDtParameter = true, Width = 7, HasLink = true
                },
                new()
                {
                    Id = "treasuryDatePersian", Title = "تاریخ برگه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "fundType", Title = "وجه", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 6
                },
                new()
                {
                    Id = "inOutIdName", Title = "دریافت/پرداخت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 5
                },
                new()
                {
                    Id = "bank", Title = "بانک", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 9
                },
                new()
                {
                    Id = "bankAccount", Title = "حساب بانکی", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "currency", Title = "ارز", Type = (int)SqlDbType.Int, IsPersian = true, IsDtParameter = true,
                    Width = 8, IsCommaSep = true
                },
                new()
                {
                    Id = "bondSerialNo", Title = "سریال سند بانکی", Type = (int)SqlDbType.NVarChar, Size = 120,
                    IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "documentNo", Title = "شماره سند بانکی", Type = (int)SqlDbType.Int, IsCommaSep = false,
                    IsPersian = true, IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "transitNo", Title = "شناسه مرجع", Type = (int)SqlDbType.Int, IsCommaSep = false,
                    IsPersian = true, IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "exchangeRate", Title = "نرخ تسعیر", Type = (int)SqlDbType.Int, HasSumValue = true,
                    IsCommaSep = true, IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "amountReceive", Title = "مبلغ دریافت ", Type = (int)SqlDbType.Money, HasSumValue = true,
                    IsCommaSep = true, IsDtParameter = true, Width = 9
                },
                new()
                {
                    Id = "amountPay", Title = "مبلغ پرداخت ", Type = (int)SqlDbType.Money, HasSumValue = true,
                    IsCommaSep = true, IsDtParameter = true, Width = 9
                },
                new()
                {
                    Id = "sayadNumber", Title = "شماره صیاد", Type = (int)SqlDbType.Decimal, IsDtParameter = true,
                    Width = 6
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "actionName", Title = "گام", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "description", Title = "توضیحات", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 12
                }
            }
        };

        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> TreasuryBankAcoountRepportCSV(GetTreasuryBankAccountReport model,
        byte roleId)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                TreasuryBankAccountReportGetColumns().DataColumns.Where(x => x.IsDtParameter && x.Id != "action")
                    .Select(z => z.Title))
        };
        var getPage = await TreasurySearchBankAccountReportPreview(model, roleId);
        result.Rows = from p in getPage.Data
            select new
            {
                p.Id,
                p.RequestId,
                p.Workflow,
                p.Stage,
                p.TreasuryId,
                p.TreasuryDatePersian,
                p.FundType,
                p.InOutIdName,
                p.Branch,
                p.Bank,
                p.BankAccount,
                p.Currency,
                p.BondSerialNo,
                p.DocumentNo,
                p.TransitNo,
                p.ExchangeRate,
                p.AmountReceive,
                p.AmountPay,
                p.SayadNumber,
                p.CreateDateTimePersian,
                p.ActionName,
                p.Description
            };
        return result;
    }

    public async Task<ReportViewModel<List<TreasuryBankAccountReports>>> TreasurySearchBankAccountReportPreview(
        GetTreasuryBankAccountReport model, byte roleId)
    {
        var result = new ReportViewModel<List<TreasuryBankAccountReports>>
        {
            Data = new List<TreasuryBankAccountReports>()
        };

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spr_Treasury_BankAccount_Report]";
            conn.Open();
            result.Data = (await conn.QueryAsync<TreasuryBankAccountReports>(sQuery, new
            {
                model.PageNo,
                model.PageRowsCount,
                model.BranchId,
                model.WorkflowId,
                model.BankId,
                model.BankAccountId,
                model.CurrencyId,
                model.FundTypeId,
                model.StageId,
                model.ActionId,
                model.FromTreasuryDate,
                model.ToTreasuryDate,
                RoleId = roleId,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure)).ToList();
            result.Columns = TreasuryBankAccountReportGetColumns();
            return result;
        }
    }


    public async Task<TreasuryBankAccountReportSum> TreasuryServiceBankAccountSumTotal(
        GetTreasuryBankAccountReport model, byte roleId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spr_Treasury_BankAccount_Report_Sum]";

            conn.Open();

            var total = await conn.QueryFirstOrDefaultAsync<TreasuryBankAccountReportSum>(sQuery,
                new
                {
                    model.BranchId,
                    model.WorkflowId,
                    model.BankId,
                    model.BankAccountId,
                    model.CurrencyId,
                    model.FundTypeId,
                    model.StageId,
                    model.ActionId,
                    model.FromTreasuryDate,
                    model.ToTreasuryDate,
                    RoleId = roleId,
                    model.CompanyId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();
            return total;
        }
    }
}