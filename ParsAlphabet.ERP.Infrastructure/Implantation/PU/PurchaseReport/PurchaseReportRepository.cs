using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseReport;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.PU.PurchaseReport;

public class PurchaseReportRepository(IConfiguration reportConfig) :
    BaseRepository<PurchaseReportDetailModel, int, string>(reportConfig),
    IBaseRepository<PurchaseReportDetailModel, int, string>
{
    private readonly IConfiguration _reportConfig = reportConfig;

    public new IDbConnection Connection => new SqlConnection(_reportConfig.GetConnectionString("DefaultConnection"));

    public GetColumnsViewModel PurchaseOrderSearchReportGetColumns()
    {
        var list = new GetColumnsViewModel
        {
            SumDynamic = true,
            GetSumApi = "/api/PU/PurchaseReportApi/purchasereportpreviewsum",
            HasRowNumber = true,
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "grossAmount", FieldValue = "0", Operator = "<" } },
            AnswerCondition = "color:#da1717",
            DataColumns = new List<DataColumnsViewModel>
            {
                new() { Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 5 },
                new()
                {
                    Id = "requestId", Title = "شناسه مرجع", Type = (int)SqlDbType.Int, Size = 10, IsDtParameter = true,
                    Width = 7
                },
                new()
                {
                    Id = "branch", Title = "شعبه", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "workflow", Title = "جریان کار", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 14
                },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 14
                },
                new()
                {
                    Id = "createDatePersian", Title = "تاریخ ثبت سربرگ", Type = (int)SqlDbType.DateTime, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "itemType", Title = "نوع آیتم", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 12
                },
                new()
                {
                    Id = "item", Title = "آیتم", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 37
                },
                new()
                {
                    Id = "attributeName", Title = "صفت", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "unit", Title = "واحد شمارش", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "quantity", Title = "تعداد ", Type = (int)SqlDbType.Decimal, Size = 100, IsDtParameter = true,
                    Width = 7, HasSumValue = true, InputType = "decimal"
                },
                new()
                {
                    Id = "ratio", Title = "ضریب", Type = (int)SqlDbType.Decimal, Size = 100, IsDtParameter = true,
                    Width = 7, InputType = "decimal"
                },
                new()
                {
                    Id = "totalQuantity", Title = "تعداد کل", Type = (int)SqlDbType.Decimal, Size = 100,
                    IsDtParameter = true, Width = 7, HasSumValue = true, InputType = "decimal"
                },
                new()
                {
                    Id = "price", Title = "نرخ", Type = (int)SqlDbType.Decimal, Size = 100, IsDtParameter = true,
                    Width = 7, IsCommaSep = true, InputType = "decimal"
                },
                new()
                {
                    Id = "grossAmount", Title = "مبلغ نا خالص", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    IsPersian = true, IsDtParameter = true, Width = 13, HasSumValue = true
                },
                new()
                {
                    Id = "discountAmount", Title = "مبلغ تخفیف", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    IsDtParameter = true, Width = 13, HasSumValue = true
                },
                new()
                {
                    Id = "netAmount", Title = "مبلغ پس از تخفیف", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    IsPersian = true, IsDtParameter = true, Width = 13, HasSumValue = true
                },
                new()
                {
                    Id = "vatAmount", Title = "مبلغ مالیات بر ارزش افزوده", Type = (int)SqlDbType.Money,
                    IsCommaSep = true, Size = 100, IsDtParameter = true, Width = 15, HasSumValue = true
                },
                new()
                {
                    Id = "netAmountPlusVat", Title = "مبلغ با احتساب ارزش افزوده", Type = (int)SqlDbType.Money,
                    IsCommaSep = true, Size = 10, IsDtParameter = true, Width = 15, HasSumValue = true
                },
                new()
                {
                    Id = "action", Title = "گام", Type = (int)SqlDbType.NVarChar, Size = 10, IsDtParameter = true,
                    Width = 12
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت پابرگ", Type = (int)SqlDbType.DateTime, Size = 10,
                    IsDtParameter = true, Width = 12
                },
                new()
                {
                    Id = "createUser", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsDtParameter = true, Width = 18
                },

                new()
                {
                    Id = "totalAvgGrossAmount", Title = "نرخ میانگین ناخالص", Type = (int)SqlDbType.Money,
                    IsCommaSep = true, IsPersian = true, IsDtParameter = true, Width = 13
                },
                new()
                {
                    Id = "totalAvgDiscountAmount", Title = "نرخ میانگین تخفیف", Type = (int)SqlDbType.Money,
                    IsCommaSep = true, IsPersian = true, IsDtParameter = true, Width = 13
                },
                new()
                {
                    Id = "totalAvgNetAmount", Title = "نرخ میانگین خالص پس از تخفیف", Type = (int)SqlDbType.Money,
                    IsCommaSep = true, IsPersian = true, IsDtParameter = true, Width = 13
                },
                new()
                {
                    Id = "totalAvgVATAmount", Title = "نرخ میانگین مالیات بر ارزش افزوده", Type = (int)SqlDbType.Money,
                    IsCommaSep = true, IsPersian = true, IsDtParameter = true, Width = 13
                },
                new()
                {
                    Id = "totalAvgFinalAmount", Title = "نرخ میانگین خالص با احتساب مالیات",
                    Type = (int)SqlDbType.Money, IsCommaSep = true, IsPersian = true, IsDtParameter = true, Width = 13
                }
            }
        };

        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(GetPurchaseOrderSearchReport model, byte roleId)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                PurchaseOrderSearchReportGetColumns().DataColumns.Where(x => x.IsDtParameter).Select(z => z.Title))
        };
        var getPage = await PurchaseOrderReportPreview(model, roleId);
        result.Rows = from p in getPage.Data
            select new
            {
                p.Id,
                p.RequestId,
                p.Branch,
                p.Workflow,
                p.Stage,
                p.CreateDatePersian,
                p.ItemType,
                p.Item,
                p.AttributeName,
                p.Unit,
                p.Quantity,
                p.Ratio,
                p.TotalQuantity,
                p.Price,
                p.GrossAmount,
                p.DiscountAmount,
                p.NetAmount,
                p.VatAmount,
                p.NetAmountPlusVat,
                p.Action,
                p.CreateDateTimePersian,
                p.CreateUser,
                p.TotalAvgGrossAmount,
                p.TotalAvgDiscountAmount,
                p.TotalAvgNetAmount,
                p.TotalAvgVATAmount,
                p.TotalAvgFinalAmount
            };
        return result;
    }


    public async Task<ReportViewModel<List<PurchaseReportPreviewModel>>> PurchaseOrderReportPreview(
        GetPurchaseOrderSearchReport model, byte roleId)
    {
        var result = new ReportViewModel<List<PurchaseReportPreviewModel>>
        {
            Data = new List<PurchaseReportPreviewModel>()
        };

        using (var conn = Connection)
        {
            var sQuery = "[pu].[Spc_PurchaseOrder_ReportPreview]";
            conn.Open();
            result.Data = (await conn.QueryAsync<PurchaseReportPreviewModel>(sQuery, new
            {
                model.PageNo,
                model.PageRowsCount,
                model.FromCreateDate,
                model.ToCreateDate,
                model.StageId,
                model.ActionId,
                model.BranchId,
                model.CurrencyId,
                model.CreateUserId,
                model.ItemTypeId,
                model.ItemId,
                model.UnitId,
                model.AttributeIds,
                model.CompanyId,
                model.WorkflowId,
                model.PersonGroupId,
                model.NoSeriesId,
                model.AccountDetailId,
                RoleId = roleId
            }, commandType: CommandType.StoredProcedure)).ToList();
            result.Columns = PurchaseOrderSearchReportGetColumns();
            return result;
        }
    }


    public async Task<SumPurchaseReportPreview> SumPurchaseOrderReportPreview(GetPurchaseOrderSearchReport model,
        byte roleId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pu].[Spc_PurchaseOrder_ReportPreview_Sum]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<SumPurchaseReportPreview>(sQuery, new
            {
                model.FromCreateDate,
                model.ToCreateDate,
                model.StageId,
                model.ActionId,
                model.BranchId,
                model.CurrencyId,
                model.CreateUserId,
                model.ItemTypeId,
                model.ItemId,
                model.UnitId,
                model.AttributeIds,
                model.CompanyId,
                model.WorkflowId,
                model.PersonGroupId,
                model.NoSeriesId,
                model.AccountDetailId,
                RoleId = roleId
            }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }
}