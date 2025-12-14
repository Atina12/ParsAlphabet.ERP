using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.FM.Report;
using ParsAlphabet.ERP.Application.Interfaces.FM.Report;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM.Report;

public class JournalReportRepository : IJournalReportRepository
{
    private readonly IConfiguration _reportConfig;

    public JournalReportRepository(IConfiguration reportConfig)
    {
        _reportConfig = reportConfig;
    }

    public IDbConnection Connection => new SqlConnection(_reportConfig.GetConnectionString("DefaultConnection"));

    public GetColumnsViewModel JournalSearchReportGetColumns()
    {
        var list = new GetColumnsViewModel
        {
            SumDynamic = true,
            GetSumApi = "/api/FM/JournalReportApi/repjournalsearchpreviewsum",
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "amount", FieldValue = "0", Operator = "<" } },
            AnswerCondition = "color:#da1717",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "journalId", Title = "شناسه سند", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "documentDatePersian", Title = "تاریخ سند", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "documentNo", Title = "شماره سند", Type = (int)SqlDbType.VarChar, IsDtParameter = true,
                    Width = 8
                },
                new()
                {
                    Id = "accountGL", Title = "کل", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 15
                },
                new()
                {
                    Id = "accountSGL", Title = "معین", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 15
                },
                new()
                {
                    Id = "accountDetail", Title = "تفصیل", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "description", Title = "شرح", Type = (int)SqlDbType.NVarChar, Size = 120, IsDtParameter = true,
                    Width = 30
                },
                new()
                {
                    Id = "documentType", Title = "نوع سند", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "currency", Title = "نوع ارز", Type = (int)SqlDbType.NVarChar, Size = 50, IsPersian = true,
                    IsDtParameter = true, Width = 9
                },
                new()
                {
                    Id = "exchangeRate", Title = "نرخ تسعیرارز", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    IsPersian = true, IsDtParameter = true, Width = 8, HasSumValue = true
                },
                new()
                {
                    Id = "amountDebit", Title = "بدهکار", Type = (int)SqlDbType.Int, IsCommaSep = true,
                    IsDtParameter = true, Width = 12, HasSumValue = true
                },
                new()
                {
                    Id = "amountCredit", Title = "بستانکار", Type = (int)SqlDbType.Int, IsPersian = true,
                    IsDtParameter = true, Width = 12, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "createUser", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, Size = 100,
                    IsDtParameter = true, Width = 12
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 12
                },
                new()
                {
                    Id = "bySystem", Title = "سیستمی", IsPrimary = true, Type = (int)SqlDbType.Bit, Size = 1,
                    IsDtParameter = true, Align = "center", Width = 6
                },
                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.Float, Size = 10, IsDtParameter = true,
                    Width = 12
                }
            }
        };

        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> JournalSearchReportCsv(GetJournalSearchReport model)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                JournalSearchReportGetColumns().DataColumns.Where(x => x.IsDtParameter && x.Id != "action")
                    .Select(z => z.Title))
        };
        var getPage = await JournalSearchReportPreview(model);
        result.Rows = from p in getPage.Data
            select new
            {
                p.JournalId,
                p.DocumentDatePersian,
                p.DocumentNo,
                p.AccountGL,
                p.AccountSGL,
                p.AccountDetail,
                p.Description,
                p.DocumentType,
                p.Currency,
                p.ExchangeRate,
                p.AmountDebit,
                p.AmountCredit,
                p.CreateUser,
                p.CreateDateTimePersian,
                BySystem = p.BySystem ? "بلی" : "خیر",
                p.ActionIdName
            };
        return result;
    }

    public async Task<ReportViewModel<List<JournalSearchReport>>> JournalSearchReportPreview(
        GetJournalSearchReport model)
    {
        var result = new ReportViewModel<List<JournalSearchReport>>
        {
            Data = new List<JournalSearchReport>()
        };

        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spr_AccountJournal_Search]";
            conn.Open();
            result.Data = (await conn.QueryAsync<JournalSearchReport>(sQuery, new
            {
                model.PageNo,
                model.PageRowsCount,
                model.CompanyId,
                model.BranchId,
                model.DocumentTypeId,
                model.CurrencyId,
                model.ActionId,
                model.CreateUserId,
                model.Description,
                model.FromAccountGLId,
                model.ToAccountGLId,
                model.FromAccountSGLId,
                model.ToAccountSGLId,
                model.FromAccountDetailId,
                model.ToAccountDetailId,
                model.FromDocumentNo,
                model.ToDocumentNo,
                model.FromJournalId,
                model.ToJournalId,
                model.FromDocumentDate,
                model.ToDocumentDate,
                model.FromAmountDebit,
                model.ToAmountDebit,
                model.FromAmountCredit,
                model.ToAmountCredit,
                BySystem = model.BySystem == -1 ? null : model.BySystem,
                model.RoleId
            }, commandType: CommandType.StoredProcedure)).ToList();
            result.Columns = JournalSearchReportGetColumns();
            return result;
        }
    }

    public async Task<JournalSearchReportSum> JournalSearchReportPreviewSum(GetJournalSearchReport model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spr_AccountJournal_Search_Sum]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<JournalSearchReportSum>(sQuery, new
            {
                model.CompanyId,
                model.BranchId,
                model.DocumentTypeId,
                model.CurrencyId,
                model.ActionId,
                model.CreateUserId,
                model.Description,
                model.FromAccountGLId,
                model.ToAccountGLId,
                model.FromAccountSGLId,
                model.ToAccountSGLId,
                model.FromAccountDetailId,
                model.ToAccountDetailId,
                model.FromDocumentNo,
                model.ToDocumentNo,
                model.FromJournalId,
                model.ToJournalId,
                model.FromDocumentDate,
                model.ToDocumentDate,
                model.FromAmountDebit,
                model.ToAmountDebit,
                model.FromAmountCredit,
                model.ToAmountCredit,
                BySystem = model.BySystem == -1 ? null : model.BySystem,
                model.RoleId
            }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public GetColumnsViewModel LevelGlGetColumns(bool displayRemaining)
    {
        var list = new GetColumnsViewModel
        {
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "amountRemaining", FieldValue = "0", Operator = "<" } },
            AnswerCondition = "color:#da1717",
            SumDynamic = true,
            GetSumApi = "/api/FM/JournalReportApi/repjournaltrialpreviewsum",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "accountGLId", Title = "کد کل", Type = (int)SqlDbType.Int, IsPrimary = true,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "accountGLName", Title = "نام کل", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, Width = 23
                },
                new()
                {
                    Id = "amountDebitOpening", Title = "افتتاحیه - مبلغ بدهکار", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = false, Width = 15, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "amountCreditOpening", Title = "افتتاحیه - مبلغ بستانکار", Type = (int)SqlDbType.Int,
                    Size = 50, IsDtParameter = false, Width = 15, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "debitRemaining", Title = "مانده از قبل - مبلغ بدهکار", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = displayRemaining, Width = 15, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "creditRemaining", Title = "مانده از قبل - مبلغ بستانکار", Type = (int)SqlDbType.Int,
                    Size = 50, IsDtParameter = displayRemaining, Width = 15, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "amountDebit", Title = "مبلغ بدهکار", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = true, Width = 15, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "amountCredit", Title = "مبلغ بستانکار", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = true, Width = 15, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "amountRemaining", Title = "مبلغ مانده حساب", Type = (int)SqlDbType.Money, Size = 50,
                    IsDtParameter = true, Width = 15, IsCommaSep = true, HasSumValue = true
                }
            }
        };

        return list;
    }

    public GetColumnsViewModel LevelSGlGetColumns(bool displayRemaining, bool displayCsv)
    {
        var list = new GetColumnsViewModel
        {
            //newAmountRemaining 
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "amountRemaining", FieldValue = "0", Operator = "<" } },
            AnswerCondition = "color:#da1717",
            SumDynamic = true,
            GetSumApi = "/api/FM/JournalReportApi/repjournaltrialpreviewsum",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "accountGL", Title = "کل", Type = (int)SqlDbType.Int, IsPrimary = true,
                    IsDtParameter = displayCsv, Width = 7
                },
                new()
                {
                    Id = "accountSGLId", Title = "کد معین", Type = (int)SqlDbType.Int, IsPrimary = true,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "accountSGLName", Title = "نام معین", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "amountDebitOpening", Title = "افتتاحیه - مبلغ بدهکار", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = false, Width = 15, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "amountCreditOpening", Title = "افتتاحیه - مبلغ بستانکار", Type = (int)SqlDbType.Int,
                    Size = 50, IsDtParameter = false, Width = 15, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "debitRemaining", Title = "مانده از قبل - مبلغ بدهکار", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = displayRemaining, Width = 15, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "creditRemaining", Title = "مانده از قبل - مبلغ بستانکار", Type = (int)SqlDbType.Int,
                    Size = 50, IsDtParameter = displayRemaining, Width = 15, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "amountDebit", Title = "مبلغ بدهکار", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = true, Width = 15, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "amountCredit", Title = "مبلغ بستانکار", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = true, Width = 15, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "amountRemaining", Title = "مبلغ مانده حساب", Type = (int)SqlDbType.Money, Size = 50,
                    IsDtParameter = true, Width = 15, IsCommaSep = true, HasSumValue = true
                }
            }
        };

        return list;
    }

    public GetColumnsViewModel LevelAccountDetailGetColumns(bool displayRemaining, bool displayCsv)
    {
        var list = new GetColumnsViewModel
        {
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "newAmountRemaining", FieldValue = "0", Operator = "<" } },
            AnswerCondition = "color:#da1717",
            SumDynamic = true,
            GetSumApi = "/api/FM/JournalReportApi/repjournaltrialpreviewsum",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "accountGL", Title = "کل", Type = (int)SqlDbType.Int, IsPrimary = true,
                    IsDtParameter = displayCsv, Width = 7
                },
                new()
                {
                    Id = "accountSGL", Title = "معین", Type = (int)SqlDbType.Int, IsPrimary = true,
                    IsDtParameter = displayCsv, Width = 7
                },

                new()
                {
                    Id = "noSeriesId", Title = "گروه تفصیل", Type = (int)SqlDbType.Int, IsPrimary = true,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "noSeriesName", Title = "نام تفصیل", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, Width = 13
                },

                new()
                {
                    Id = "accountDetailId", Title = "کد تفصیل", Type = (int)SqlDbType.Int, IsPrimary = true,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "accountDetailName", Title = "نام تفصیل", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, Width = 12
                },
                new()
                {
                    Id = "amountDebitOpening", Title = "افتتاحیه - مبلغ بدهکار", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = false, Width = 15, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "amountCreditOpening", Title = "افتتاحیه - مبلغ بستانکار", Type = (int)SqlDbType.Int,
                    Size = 50, IsDtParameter = false, Width = 15, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "debitRemaining", Title = "مانده از قبل - مبلغ بدهکار", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = displayRemaining, Width = 15, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "creditRemaining", Title = "مانده از قبل - مبلغ بستانکار", Type = (int)SqlDbType.Int,
                    Size = 50, IsDtParameter = displayRemaining, Width = 15, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "amountDebit", Title = "مبلغ بدهکار", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = true, Width = 15, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "amountCredit", Title = "مبلغ بستانکار", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = true, Width = 15, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "amountRemaining", Title = "مبلغ مانده حساب", Type = (int)SqlDbType.Money, Size = 50,
                    IsDtParameter = true, Width = 15, IsCommaSep = true, HasSumValue = true
                }
            }
        };

        return list;
    }

    public Tuple<DateTime?, DateTime?> GenerateDateRange(DateTime fromDate2)
    {
        //var fromDateMiladi2 = fromDatePersian2.ToMiladiDateTime().Value;
        //var toDateMiladi2 = toDatePersian2.ToMiladiDateTime();

        var firstDayOfYear = PersianDateTime.GetFirstDayOfCurrentYear(fromDate2);

        var fromDate1 = firstDayOfYear.ToMiladiDateTime();
        DateTime? toDate1 = fromDate2.AddDays(-1);

        if (fromDate2 <= fromDate1)
        {
            fromDate1 = null;
            toDate1 = null;
        }

        return new Tuple<DateTime?, DateTime?>(fromDate1, toDate1);
    }

    public async Task<ReportViewModel<List<JournalDetailReport>>> JournalDetailReportPreview(
        GetJournaltrialSearchReport model, bool displayCsv = false)
    {
        var result = new ReportViewModel<List<JournalDetailReport>>
        {
            Data = new List<JournalDetailReport>()
        };

        var fromDate = model.FromDocumentDate.Value;

        var dateRange = GenerateDateRange(fromDate);

        if ((model.TrialBalanceType == "14" || model.TrialBalanceType == "15" || model.TrialBalanceType == "16") &&
            model.AffectedCreditSum == -1 && model.AffectedDebitSum == -1 && model.AffectedRemainingSum == -1 &&
            displayCsv == false)
            if (dateRange.Item1 != null)
            {
                model.FromDocumentDate1 = dateRange.Item1;
                model.ToDocumentDate1 = dateRange.Item2;
            }

        var displayRemaining = false;

        if (model.TrialBalanceType == "11" || model.TrialBalanceType == "12" || model.TrialBalanceType == "13")
            if (dateRange.Item1 != null)
            {
                model.FromDocumentDate1 = dateRange.Item1;
                model.ToDocumentDate1 = dateRange.Item2;

                displayRemaining = true;
            }

        using (var conn = Connection)
        {
            var newModel = Convertor.ToMappedModel(model);
            var sQuery = "[fm].[Spr_Journal_Note_TrialBalance_ReportPreview]";
            switch (model.ReportType)
            {
                case ReportType.LevelGl:
                case ReportType.NoteGl:
                    switch (model.MainReportType)
                    {
                        case MainReportType.Level:
                            result.Columns = LevelGlGetColumns(displayRemaining);
                            break;
                        default:
                            result.Columns = NoteDetialReportGetColumns(displayCsv, ReportType.LevelGl);
                            break;
                    }

                    break;
                case ReportType.LevelSgl:
                case ReportType.NoteSgl:
                    switch (model.MainReportType)
                    {
                        case MainReportType.Level:
                            result.Columns = LevelSGlGetColumns(displayRemaining, displayCsv);
                            break;
                        default:
                            result.Columns = NoteDetialReportGetColumns(displayCsv, ReportType.LevelSgl);
                            break;
                    }

                    break;
                default:
                    switch (model.MainReportType)
                    {
                        case MainReportType.Level:
                            result.Columns = LevelAccountDetailGetColumns(displayRemaining, displayCsv);
                            break;
                        default:
                            result.Columns = NoteDetialReportGetColumns(displayCsv, ReportType.LevelAccountDetail);
                            break;
                    }

                    break;
            }

            if (model.ColumnType == 0)
            {
                result.Columns.DataColumns.Where(a => a.Id == "amountDebitOpening").FirstOrDefault().IsDtParameter =
                    true;
                result.Columns.DataColumns.Where(a => a.Id == "amountCreditOpening").FirstOrDefault().IsDtParameter =
                    true;
            }
            else
            {
                result.Columns.DataColumns.Where(a => a.Id == "amountDebitOpening").FirstOrDefault().IsDtParameter =
                    false;
                result.Columns.DataColumns.Where(a => a.Id == "amountCreditOpening").FirstOrDefault().IsDtParameter =
                    false;
            }

            long remainAmount = 0;

            if ((model.TrialBalanceType == "14" || model.TrialBalanceType == "15" || model.TrialBalanceType == "16") &&
                model.AffectedCreditSum != -1 && model.AffectedDebitSum != -1 && model.AffectedRemainingSum != -1)
                remainAmount = model.AffectedRemainingSum;

            conn.Open();
            var trialBalanceResult =
                (await conn.QueryAsync<JournalDetailReport>(sQuery, newModel, commandType: CommandType.StoredProcedure))
                .ToList();
            conn.Close();

            result.Data.AddRange(trialBalanceResult);


            if (result.Data != null)
            {
                var resultLength = result.Data.Count();

                for (var i = 0; i < resultLength; i++)
                    if (model.MainReportType == MainReportType.Note)
                    {
                        remainAmount = result.Data[i].AmountDebit + result.Data[i].AmountDebitOpening -
                            (result.Data[i].AmountCredit + result.Data[i].AmountCreditOpening) + remainAmount;
                        result.Data[i].AmountRemaining = remainAmount;
                    }
                    else
                    {
                        var debit = result.Data[i].AmountDebit + result.Data[i].DebitRemaining;
                        var credit = result.Data[i].AmountCredit + result.Data[i].CreditRemaining;
                        remainAmount = debit - credit;
                        result.Data[i].AmountRemaining = remainAmount;
                    }
            }

            return result;
        }
    }

    public async Task<JournalSearchReportSum> JournalTrialSearchReportPreviewSum(GetJournaltrialSearchReport model)
    {
        var result = new JournalSearchReportSum();

        var fromDate = model.FromDocumentDate.Value;

        var dateRange = GenerateDateRange(fromDate);

        if (dateRange.Item1 != null)
        {
            model.FromDocumentDate1 = dateRange.Item1;
            model.ToDocumentDate1 = dateRange.Item2;

            //var summaryRecord = await GetDataJournalTrialBalanceSum(model);

            //model.FromDocumentDate = fromDate;
            //model.ToDocumentDate = toDate;

            //if (model.TrialBalanceType == "11" || model.TrialBalanceType == "12" || model.TrialBalanceType == "13")
            //{
            //	result.DebitRemaining = summaryRecord.AmountDebit;
            //	result.CreditRemaining = summaryRecord.AmountCredit;
            //}
            //else if (model.TrialBalanceType == "14")
            //{
            //	result.AmountCredit = summaryRecord.AmountCredit;
            //	result.AmountDebit = summaryRecord.AmountDebit;
            //	result.ExchangeRate = summaryRecord.ExchangeRate;
            //	result.AmountDebitOpening = summaryRecord.AmountDebitOpening;
            //	result.AmountCreditOpening = summaryRecord.AmountCreditOpening;

            //	result.AmountRemaining = Math.Abs(summaryRecord.AmountDebit - summaryRecord.AmountCredit);

            //}
        }

        var summaryRecord1 = await GetDataJournalTrialBalanceSum(model);

        result.DebitRemaining = summaryRecord1.DebitRemaining;
        result.CreditRemaining = summaryRecord1.CreditRemaining;

        result.AmountCredit += summaryRecord1.AmountCredit;
        result.AmountDebit += summaryRecord1.AmountDebit;
        result.ExchangeRate += summaryRecord1.ExchangeRate;
        result.AmountDebitOpening += summaryRecord1.AmountDebitOpening;
        result.AmountCreditOpening += summaryRecord1.AmountCreditOpening;
        result.AmountRemaining = Math.Abs(result.AmountDebit) + Math.Abs(result.AmountDebitOpening) -
                                 (Math.Abs(result.AmountCredit) + Math.Abs(result.AmountCreditOpening));

        return result;
    }


    /// <summary>
    ///     لیست کل ها در ساختار درختی
    /// </summary>
    public async Task<List<GetJournalHeaderTreeViewModel>> GetJournalTrialReportJsonForTree(GetJournalTreeReport model)
    {
        var result = new List<GetJournalHeaderTreeViewModel>();
        using (var conn = Connection)
        {
            var newModel = Convertor.ToMappedModel(model);
            var sQuery = "fm.Spr_LevelSGLId_HeaderReportPreview";
            conn.Open();
            var list = (await conn.QueryAsync<GetJournalHeaderTreeViewModel>(sQuery, newModel,
                commandType: CommandType.StoredProcedure)).ToList();

            foreach (var item in list)
                if (item.Id != 0)
                {
                    var itm = new GetJournalHeaderTreeViewModel
                    {
                        Id = item.Id,
                        Name = item.Name,
                        Children = await GetAccountSglByGlId(model, item.Id)
                    };
                    itm.Level = 1;
                    itm.ChildCount = ((model.MainReportType == MainReportType.Level &&
                                       model.ReportType >= ReportType.LevelAccountDetail)
                                      ||
                                      (model.MainReportType == MainReportType.Note &&
                                       model.ReportType > ReportType.NoteGl)
                        ) && itm.Children != null
                            ? itm.Children.Count
                            : 0;


                    result.Add(itm);
                }

            return result;
        }
    }

    public async Task<MemoryStream> LevelGlCsv(GetJournaltrialSearchReport model)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var getPage = await JournalDetailReportPreview(model);

        var dataColumns = getPage.Columns;

        if (model.ColumnType == 0)
        {
            dataColumns.DataColumns.Where(a => a.Id == "amountDebitOpening").FirstOrDefault().IsDtParameter = true;
            dataColumns.DataColumns.Where(a => a.Id == "amountCreditOpening").FirstOrDefault().IsDtParameter = true;
        }
        else
        {
            dataColumns.DataColumns.Where(a => a.Id == "amountDebitOpening").FirstOrDefault().IsDtParameter = false;
            dataColumns.DataColumns.Where(a => a.Id == "amountCreditOpening").FirstOrDefault().IsDtParameter = false;
        }

        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                dataColumns.DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };


        var dateRange = GenerateDateRange(model.FromDocumentDate.Value);

        if (dateRange.Item1 != null)
        {
            if (model.ColumnType == 0)
                result.Rows = from p in getPage.Data
                    select new
                    {
                        p.AccountGLId,
                        p.AccountGLName,
                        p.AmountDebitOpening,
                        p.AmountCreditOpening,
                        p.DebitRemaining,
                        p.CreditRemaining,
                        p.AmountDebit,
                        p.AmountCredit,
                        p.AmountRemaining
                    };
            else
                result.Rows = from p in getPage.Data
                    select new
                    {
                        p.AccountGLId,
                        p.AccountGLName,
                        p.DebitRemaining,
                        p.CreditRemaining,
                        p.AmountDebit,
                        p.AmountCredit,
                        p.AmountRemaining
                    };
        }
        else
        {
            if (model.ColumnType == 0)
                result.Rows = from p in getPage.Data
                    select new
                    {
                        p.AccountGLId,
                        p.AccountGLName,
                        p.AmountDebitOpening,
                        p.AmountCreditOpening,
                        p.AmountDebit,
                        p.AmountCredit,
                        p.AmountRemaining
                    };
            else
                result.Rows = from p in getPage.Data
                    select new
                    {
                        p.AccountGLId,
                        p.AccountGLName,
                        p.AmountDebit,
                        p.AmountCredit,
                        p.AmountRemaining
                    };
        }

        var columns = dataColumns.DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title)
            .ToList();

        csvStream = await csvGenerator.GenerateCsv(result.Rows, columns);

        return csvStream;
    }

    public async Task<MemoryStream> LevelSglCsv(GetJournaltrialSearchReport model)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var getPage = await JournalDetailReportPreview(model, true);
        var dataColumns = getPage.Columns;

        if (model.ColumnType == 0)
        {
            dataColumns.DataColumns.Where(a => a.Id == "amountDebitOpening").FirstOrDefault().IsDtParameter = true;
            dataColumns.DataColumns.Where(a => a.Id == "amountCreditOpening").FirstOrDefault().IsDtParameter = true;
        }
        else
        {
            dataColumns.DataColumns.Where(a => a.Id == "amountDebitOpening").FirstOrDefault().IsDtParameter = false;
            dataColumns.DataColumns.Where(a => a.Id == "amountCreditOpening").FirstOrDefault().IsDtParameter = false;
        }

        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                dataColumns.DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };

        var dateRange = GenerateDateRange(model.FromDocumentDate.Value);

        if (dateRange.Item1 != null)
        {
            if (model.ColumnType == 0)
                result.Rows = from p in getPage.Data
                    select new
                    {
                        p.AccountGL,
                        p.AccountSGLId,
                        p.AccountSGLName,
                        p.AmountDebitOpening,
                        p.AmountCreditOpening,
                        p.DebitRemaining,
                        p.CreditRemaining,
                        p.AmountDebit,
                        p.AmountCredit,
                        p.AmountRemaining
                    };
            else
                result.Rows = from p in getPage.Data
                    select new
                    {
                        p.AccountGL,
                        p.AccountSGLId,
                        p.AccountSGLName,
                        p.DebitRemaining,
                        p.CreditRemaining,
                        p.AmountDebit,
                        p.AmountCredit,
                        p.AmountRemaining
                    };
        }
        else
        {
            if (model.ColumnType == 0)
                result.Rows = from p in getPage.Data
                    select new
                    {
                        p.AccountGL,
                        p.AccountSGLId,
                        p.AccountSGLName,
                        p.AmountDebitOpening,
                        p.AmountCreditOpening,
                        p.AmountDebit,
                        p.AmountCredit,
                        p.AmountRemaining
                    };
            else
                result.Rows = from p in getPage.Data
                    select new
                    {
                        p.AccountGL,
                        p.AccountSGLId,
                        p.AccountSGLName,
                        p.AmountDebit,
                        p.AmountCredit,
                        p.AmountRemaining
                    };
        }

        var columns = dataColumns.DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title)
            .ToList();

        csvStream = await csvGenerator.GenerateCsv(result.Rows, columns);

        return csvStream;
    }

    public async Task<MemoryStream> LevelAccountDetailCsv(GetJournaltrialSearchReport model)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var getPage = await JournalDetailReportPreview(model, true);
        var dataColumns = getPage.Columns;

        if (model.ColumnType == 0)
        {
            dataColumns.DataColumns.Where(a => a.Id == "amountDebitOpening").FirstOrDefault().IsDtParameter = true;
            dataColumns.DataColumns.Where(a => a.Id == "amountCreditOpening").FirstOrDefault().IsDtParameter = true;
        }
        else
        {
            dataColumns.DataColumns.Where(a => a.Id == "amountDebitOpening").FirstOrDefault().IsDtParameter = false;
            dataColumns.DataColumns.Where(a => a.Id == "amountCreditOpening").FirstOrDefault().IsDtParameter = false;
        }

        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                dataColumns.DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };


        var dateRange = GenerateDateRange(model.FromDocumentDate.Value);

        if (dateRange.Item1 != null)
        {
            if (model.ColumnType == 0)
                result.Rows = from p in getPage.Data
                    select new
                    {
                        p.AccountGL,
                        p.AccountSGL,
                        p.NoSeriesId,
                        p.NoSeriesName,
                        p.AccountDetailId,
                        p.AccountDetailName,
                        p.AmountDebitOpening,
                        p.AmountCreditOpening,
                        p.DebitRemaining,
                        p.CreditRemaining,
                        p.AmountDebit,
                        p.AmountCredit,
                        p.AmountRemaining
                    };
            else
                result.Rows = from p in getPage.Data
                    select new
                    {
                        p.AccountGL,
                        p.AccountSGL,
                        p.NoSeriesId,
                        p.NoSeriesName,
                        p.AccountDetailId,
                        p.AccountDetailName,
                        p.DebitRemaining,
                        p.CreditRemaining,
                        p.AmountDebit,
                        p.AmountCredit,
                        p.AmountRemaining
                    };
        }
        else
        {
            if (model.ColumnType == 0)
                result.Rows = from p in getPage.Data
                    select new
                    {
                        p.AccountGL,
                        p.AccountSGL,
                        p.NoSeriesId,
                        p.NoSeriesName,
                        p.AccountDetailId,
                        p.AccountDetailName,
                        p.AmountDebitOpening,
                        p.AmountCreditOpening,
                        p.DebitRemaining,
                        p.CreditRemaining,
                        p.AmountDebit,
                        p.AmountCredit,
                        p.AmountRemaining
                    };
            else
                result.Rows = from p in getPage.Data
                    select new
                    {
                        p.AccountGL,
                        p.AccountSGL,
                        p.NoSeriesId,
                        p.NoSeriesName,
                        p.AccountDetailId,
                        p.AccountDetailName,
                        p.DebitRemaining,
                        p.CreditRemaining,
                        p.AmountDebit,
                        p.AmountCredit,
                        p.AmountRemaining
                    };
        }

        var columns = dataColumns.DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title)
            .ToList();
        csvStream = await csvGenerator.GenerateCsv(result.Rows, columns);

        return csvStream;
    }

    public async Task<MemoryStream> NoteGlCsv(GetJournaltrialSearchReport model)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var getPage = await JournalDetailReportPreview(model, true);
        var dataColumns = getPage.Columns;

        if (model.ColumnType == 0)
        {
            dataColumns.DataColumns.Where(a => a.Id == "amountDebitOpening").FirstOrDefault().IsDtParameter = true;
            dataColumns.DataColumns.Where(a => a.Id == "amountCreditOpening").FirstOrDefault().IsDtParameter = true;
        }
        else
        {
            dataColumns.DataColumns.Where(a => a.Id == "amountDebitOpening").FirstOrDefault().IsDtParameter = false;
            dataColumns.DataColumns.Where(a => a.Id == "amountCreditOpening").FirstOrDefault().IsDtParameter = false;
        }

        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                dataColumns.DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };


        if (model.ColumnType == 0)
            result.Rows = from p in getPage.Data
                select new
                {
                    p.AccountGLId,
                    p.AccountGLName,
                    p.DocumentDatePersian,
                    p.journalId,
                    p.DocumentNo,
                    p.Description,
                    p.CurrencyIdName,
                    p.AmountDebitOpening,
                    p.AmountCreditOpening,
                    p.AmountDebit,
                    p.AmountCredit,
                    p.AmountRemaining
                };
        else
            result.Rows = from p in getPage.Data
                select new
                {
                    p.AccountGLId,
                    p.AccountGLName,
                    p.DocumentDatePersian,
                    p.journalId,
                    p.DocumentNo,
                    p.Description,
                    p.CurrencyIdName,
                    p.AmountDebit,
                    p.AmountCredit,
                    p.AmountRemaining
                };

        var columns = dataColumns.DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title)
            .ToList();
        csvStream = await csvGenerator.GenerateCsv(result.Rows, columns);

        return csvStream;
    }

    public async Task<MemoryStream> NoteSglCsv(GetJournaltrialSearchReport model)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var getPage = await JournalDetailReportPreview(model, true);

        var dataColumns = getPage.Columns;
        if (model.ColumnType == 0)
        {
            dataColumns.DataColumns.Where(a => a.Id == "amountDebitOpening").FirstOrDefault().IsDtParameter = true;
            dataColumns.DataColumns.Where(a => a.Id == "amountCreditOpening").FirstOrDefault().IsDtParameter = true;
        }
        else
        {
            dataColumns.DataColumns.Where(a => a.Id == "amountDebitOpening").FirstOrDefault().IsDtParameter = false;
            dataColumns.DataColumns.Where(a => a.Id == "amountCreditOpening").FirstOrDefault().IsDtParameter = false;
        }

        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                dataColumns.DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };

        var columns = dataColumns.DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title)
            .ToList();


        if (model.ColumnType == 0)
            result.Rows = from p in getPage.Data
                select new
                {
                    p.AccountGL,
                    p.AccountSGLId,
                    p.AccountSGLName,
                    p.DocumentDatePersian,
                    p.journalId,
                    p.DocumentNo,
                    p.Description,
                    p.CurrencyIdName,
                    p.AmountDebitOpening,
                    p.AmountCreditOpening,
                    p.AmountDebit,
                    p.AmountCredit,
                    p.AmountRemaining
                    //p.ActionIdName
                };
        else
            result.Rows = from p in getPage.Data
                select new
                {
                    p.AccountGL,
                    p.AccountSGLId,
                    p.AccountSGLName,
                    p.DocumentDatePersian,
                    p.journalId,
                    p.DocumentNo,
                    p.Description,
                    p.CurrencyIdName,
                    p.AmountDebit,
                    p.AmountCredit,
                    p.AmountRemaining
                    //p.ActionIdName
                };

        csvStream = await csvGenerator.GenerateCsv(result.Rows, columns);

        return csvStream;
    }

    public async Task<MemoryStream> NoteAccountDetailCsv(GetJournaltrialSearchReport model)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var getPage = await JournalDetailReportPreview(model, true);
        var dataColumns = getPage.Columns;

        if (model.ColumnType == 0)
        {
            dataColumns.DataColumns.Where(a => a.Id == "amountDebitOpening").FirstOrDefault().IsDtParameter = true;
            dataColumns.DataColumns.Where(a => a.Id == "amountCreditOpening").FirstOrDefault().IsDtParameter = true;
        }
        else
        {
            dataColumns.DataColumns.Where(a => a.Id == "amountDebitOpening").FirstOrDefault().IsDtParameter = false;
            dataColumns.DataColumns.Where(a => a.Id == "amountCreditOpening").FirstOrDefault().IsDtParameter = false;
        }

        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                dataColumns.DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };

        if (model.ColumnType == 0)
            result.Rows = from p in getPage.Data
                select new
                {
                    p.AccountGL,
                    p.AccountSGL,
                    p.NoSeries,
                    p.AccountDetailId,
                    p.AccountDetailName,
                    p.DocumentDatePersian,
                    p.journalId,
                    p.DocumentNo,
                    p.Description,
                    p.CurrencyIdName,
                    p.AmountDebitOpening,
                    p.AmountCreditOpening,
                    p.AmountDebit,
                    p.AmountCredit,
                    p.AmountRemaining,
                    p.JournalNature
                };
        else
            result.Rows = from p in getPage.Data
                select new
                {
                    p.AccountGL,
                    p.AccountSGL,
                    p.NoSeries,
                    p.AccountDetailId,
                    p.AccountDetailName,
                    p.DocumentDatePersian,
                    p.journalId,
                    p.DocumentNo,
                    p.Description,
                    p.CurrencyIdName,
                    p.AmountDebit,
                    p.AmountCredit,
                    p.AmountRemaining,
                    p.JournalNature
                    //p.ActionIdName
                };

        var columns = dataColumns.DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title)
            .ToList();

        csvStream = await csvGenerator.GenerateCsv(result.Rows, columns);


        return csvStream;
    }

    public async Task<MemoryStream> NoteNewsPaperCsv(GetJournaltrialSearchReport model)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();


        var getPage = await JournalDetailReportPreview(model, true);

        var dataColumns = getPage.Columns;
        if (model.ColumnType == 0)
        {
            dataColumns.DataColumns.Where(a => a.Id == "amountDebitOpening").FirstOrDefault().IsDtParameter = true;
            dataColumns.DataColumns.Where(a => a.Id == "amountCreditOpening").FirstOrDefault().IsDtParameter = true;
        }
        else
        {
            dataColumns.DataColumns.Where(a => a.Id == "amountDebitOpening").FirstOrDefault().IsDtParameter = false;
            dataColumns.DataColumns.Where(a => a.Id == "amountCreditOpening").FirstOrDefault().IsDtParameter = false;
        }

        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                dataColumns.DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };

        if (model.ColumnType == 0)
            result.Rows = from p in getPage.Data
                select new
                {
                    p.DocumentDatePersian,
                    p.journalId,
                    p.DocumentNo,
                    p.Description,
                    p.CurrencyIdName,
                    p.AmountDebitOpening,
                    p.AmountCreditOpening,
                    p.AmountDebit,
                    p.AmountCredit,
                    p.AmountRemaining
                    //p.ActionIdName
                };
        else
            result.Rows = from p in getPage.Data
                select new
                {
                    p.DocumentDatePersian,
                    p.journalId,
                    p.DocumentNo,
                    p.Description,
                    p.CurrencyIdName,
                    p.AmountDebit,
                    p.AmountCredit,
                    p.AmountRemaining
                    //p.ActionIdName
                };


        var columns = dataColumns.DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title)
            .ToList();

        csvStream = await csvGenerator.GenerateCsv(result.Rows, columns);


        return csvStream;
    }

    public GetColumnsViewModel NoteDetialReportGetColumns(bool displayCsv, ReportType type)
    {
        var list = new GetColumnsViewModel
        {
            //newAmountRemaining
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "amountRemaining", FieldValue = "0", Operator = "<" } },
            AnswerCondition = "color:#da1717",
            SumDynamic = true,
            GetSumApi = "/api/FM/JournalReportApi/repjournaltrialpreviewsum",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "documentDatePersian", Title = "تاریخ سند", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "journalId", Title = "شناسه سند", Type = (int)SqlDbType.VarChar, Size = 10, HasLink = true,
                    IsPrimary = true, IsDtParameter = true, Width = 10
                },

                new() { Id = "accountGLId", IsPrimary = true },
                new() { Id = "accountSGLId", IsPrimary = true },
                new() { Id = "accountDetailId", IsPrimary = true },

                new()
                {
                    Id = "documentNo", Title = "شماره سند", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "description", Title = "شرح سند", Type = (int)SqlDbType.VarChar, Size = 10,
                    IsDtParameter = true, Width = 38
                },
                new()
                {
                    Id = "currencyIdName", Title = "نوع ارز", Type = (int)SqlDbType.VarChar, IsDtParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "amountDebitOpening", Title = "افتتاحیه - مبلغ بدهکار", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = false, Width = 15, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "amountCreditOpening", Title = "افتتاحیه - مبلغ بستانکار", Type = (int)SqlDbType.Int,
                    Size = 50, IsDtParameter = false, Width = 15, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "amountDebit", Title = "مبلغ بدهکار", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = true, Width = 15, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "amountCredit", Title = "مبلغ بستانکار", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = true, Width = 15, IsCommaSep = true, HasSumValue = true
                },
                new()
                {
                    Id = "amountRemaining", Title = "مبلغ مانده حساب", Type = (int)SqlDbType.Money, Size = 50,
                    IsDtParameter = true, Width = 15, IsCommaSep = true, HasSumValue = true
                }
            }
        };

        if (displayCsv)
        {
            if (type == ReportType.LevelGl)
            {
                list.DataColumns.Insert(0,
                    new DataColumnsViewModel
                    {
                        Id = "accountGLId", Title = "کد کل", Type = (int)SqlDbType.Int, IsPrimary = true,
                        IsDtParameter = true, Width = 7
                    });
                list.DataColumns.Insert(1,
                    new DataColumnsViewModel
                    {
                        Id = "accountGLName", Title = "نام کل", Type = (int)SqlDbType.Int, IsPrimary = true,
                        IsDtParameter = true, Width = 7
                    });
            }
            else if (type == ReportType.LevelSgl)
            {
                list.DataColumns.Insert(0,
                    new DataColumnsViewModel
                    {
                        Id = "accountGL", Title = "کل", Type = (int)SqlDbType.Int, IsPrimary = true,
                        IsDtParameter = true, Width = 7
                    });
                list.DataColumns.Insert(1,
                    new DataColumnsViewModel
                    {
                        Id = "accountSGLId", Title = "کد معین", Type = (int)SqlDbType.Int, IsPrimary = true,
                        IsDtParameter = true, Width = 7
                    });
                list.DataColumns.Insert(2,
                    new DataColumnsViewModel
                    {
                        Id = "accountSGLName", Title = "نام معین", Type = (int)SqlDbType.VarChar, Size = 10,
                        IsDtParameter = true, Width = 15
                    });
            }
            else if (type == ReportType.LevelAccountDetail)
            {
                list.DataColumns.Insert(0,
                    new DataColumnsViewModel
                    {
                        Id = "accountGL", Title = "کل", Type = (int)SqlDbType.Int, IsPrimary = true,
                        IsDtParameter = true, Width = 7
                    });
                list.DataColumns.Insert(1,
                    new DataColumnsViewModel
                    {
                        Id = "accountSGL", Title = "معین", Type = (int)SqlDbType.Int, IsPrimary = true,
                        IsDtParameter = true, Width = 7
                    });
                list.DataColumns.Insert(2,
                    new DataColumnsViewModel
                    {
                        Id = "noSeries", Title = "گروه تفصیل", Type = (int)SqlDbType.Int, IsPrimary = true,
                        IsDtParameter = true, Width = 7
                    });
                list.DataColumns.Insert(3,
                    new DataColumnsViewModel
                    {
                        Id = "accountDetailId", Title = "کد تفصیل", Type = (int)SqlDbType.Int, IsPrimary = true,
                        IsDtParameter = true, Width = 7
                    });
                list.DataColumns.Insert(4,
                    new DataColumnsViewModel
                    {
                        Id = "accountDetailName", Title = "نام تفصیل", Type = (int)SqlDbType.VarChar, Size = 10,
                        IsDtParameter = true, Width = 12
                    });
            }
        }

        return list;
    }

    public async Task<JournalSearchReportSum> GetDataJournalTrialBalanceSum(GetJournaltrialSearchReport model)
    {
        using (var conn = Connection)
        {
            var sQuery = "[fm].[Spr_Journal_Note_TrialBalance_ReportPreview_Sum]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<JournalSearchReportSum>(sQuery, new
            {
                model.CompanyId,
                model.BranchId,
                model.DocumentTypeId,
                model.CurrencyId,
                model.ActionId,
                model.CreateUserId,
                model.FromDocumentDate,
                model.ToDocumentDate,
                model.FromDocumentDate1,
                model.ToDocumentDate1,
                model.FromJournalId,
                model.ToJournalId,
                model.FromDocumentNo,
                model.ToDocumentNo,
                model.FromAccountGLId,
                model.ToAccountGLId,
                model.FromAccountSGLId,
                model.ToAccountSGLId,
                model.FromAccountDetailId,
                model.ToAccountDetailId,
                model.OpeningJournal,
                model.EndingJournal,
                model.TemporaryJournal,
                model.ColumnType,
                model.TrialBalanceType,
                model.RoleId
            }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    /// <summary>
    ///     لیست معین ها در ساختار درختی
    /// </summary>
    public async Task<List<GetJournalHeaderTreeViewModel>> GetAccountSglByGlId(GetJournalTreeReport model, int glId)
    {
        var list = new List<GetJournalHeaderTreeViewModel>();
        var result = new List<GetJournalHeaderTreeViewModel>();
        using (var conn = Connection)
        {
            var newModel = new GetJournalTreeReport
            {
                BranchId = model.BranchId,
                CompanyId = model.CompanyId,
                CreateUserId = model.CreateUserId,
                CurrencyId = model.CurrencyId,
                DocumentTypeId = model.DocumentTypeId,
                EndingJournal = model.EndingJournal,
                FromAccountDetailId = model.FromAccountDetailId,
                FromAccountGLId = glId,
                ToAccountGLId = glId,
                FromAccountSGLId = model.FromAccountSGLId,
                FromDocumentDate = model.FromDocumentDate,
                FromDocumentNo = model.FromDocumentNo,
                FromJournalId = model.FromJournalId,
                OpeningJournal = model.OpeningJournal,
                ActionId = model.ActionId,
                TemporaryJournal = model.TemporaryJournal,
                ToAccountDetailId = model.ToAccountDetailId,
                ToAccountSGLId = model.ToAccountSGLId,
                ToDocumentDate = model.ToDocumentDate,
                ToDocumentNo = model.ToDocumentNo,
                ToJournalId = model.ToJournalId
            };
            var newModelMap = Convertor.ToMappedModel(newModel);
            var sQuery = "fm.Spr_LevelDetail_HeaderReportPreview";
            conn.Open();
            list = (await conn.QueryAsync<GetJournalHeaderTreeViewModel>(sQuery, newModelMap,
                commandType: CommandType.StoredProcedure)).ToList();
            foreach (var item in list)
                if (item.Id != 0)
                {
                    var itm = new GetJournalHeaderTreeViewModel
                    {
                        Id = item.Id,
                        Name = item.Name,
                        Children = model.MainReportType == MainReportType.Note
                            ? await GetAccountDetalBySglId(newModel, item.Id)
                            : null
                    };
                    itm.Level = 2;
                    itm.ChildCount =
                        model.ReportType == ReportType.NoteAccountDetail &&
                        model.MainReportType == MainReportType.Note && itm.Children != null
                            ? itm.Children.Count
                            : 0;
                    result.Add(itm);
                }
        }

        return result;
    }

    /// <summary>
    ///     لیست تفصیل ها در ساختار درختی
    /// </summary>
    public async Task<List<GetJournalHeaderTreeViewModel>> GetAccountDetalBySglId(GetJournalTreeReport model, int sglId)
    {
        var list = new List<GetJournalHeaderTreeViewModel>();
        var result = new List<GetJournalHeaderTreeViewModel>();
        using (var conn = Connection)
        {
            var newModel = new GetJournalTreeReport
            {
                BranchId = model.BranchId,
                CompanyId = model.CompanyId,
                CreateUserId = model.CreateUserId,
                CurrencyId = model.CurrencyId,
                DocumentTypeId = model.DocumentTypeId,
                EndingJournal = model.EndingJournal,
                FromAccountDetailId = model.FromAccountDetailId,
                FromAccountGLId = model.FromAccountGLId,
                ToAccountGLId = model.ToAccountGLId,
                FromAccountSGLId = sglId,
                ToAccountSGLId = sglId,
                FromDocumentDate = model.FromDocumentDate,
                FromDocumentNo = model.FromDocumentNo,
                FromJournalId = model.FromJournalId,
                OpeningJournal = model.OpeningJournal,
                ActionId = model.ActionId,
                TemporaryJournal = model.TemporaryJournal,
                ToAccountDetailId = model.ToAccountDetailId,
                ToDocumentDate = model.ToDocumentDate,
                ToDocumentNo = model.ToDocumentNo,
                ToJournalId = model.ToJournalId
            };

            newModel.FromAccountSGLId = sglId;
            newModel.ToAccountSGLId = sglId;

            var newModelMap = Convertor.ToMappedModel(newModel);
            var sQuery = "fm.Spr_NoteDetail_HeaderReportPreview";
            conn.Open();
            list = (await conn.QueryAsync<GetJournalHeaderTreeViewModel>(sQuery, newModelMap,
                commandType: CommandType.StoredProcedure)).ToList();
            foreach (var item in list)
            {
                var itm = new GetJournalHeaderTreeViewModel
                {
                    Id = item.Id,
                    Name = item.Name
                };
                itm.Level = 3;
                itm.ChildCount = 0;
                result.Add(itm);
            }
        }

        return result;
    }
}