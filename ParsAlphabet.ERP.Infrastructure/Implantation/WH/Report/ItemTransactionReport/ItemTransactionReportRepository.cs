using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.WH.Report.ItemTransactionReport;
using ParsAlphabet.ERP.Application.Interfaces.WF.Report.ItemTransactionReport;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WH.Report.ItemTransactionReport;

public class ItemTransactionReportRepository : IItemTransactionReportRepository
{
    private readonly IConfiguration _reportConfig;

    public ItemTransactionReportRepository(IConfiguration reportConfig)
    {
        _reportConfig = reportConfig;
    }

    public IDbConnection Connection => new SqlConnection(_reportConfig.GetConnectionString("DefaultConnection"));


    public GetColumnsViewModel ItemTransactionReportGetColumns()
    {
        var list = new GetColumnsViewModel
        {
            SumDynamic = true,
            GetSumApi = "/api/WH/ItemTransactionReportApi/repitemtransactionpreviewsum",

            DataColumns = new List<DataColumnsViewModel>
            {
                new() { Id = "id", Title = "شناسه برگه", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 5 },
                new()
                {
                    Id = "requestId", Title = "شناسه مرجع", Type = (int)SqlDbType.Int, Size = 10, IsDtParameter = true,
                    Width = 6
                },
                new()
                {
                    Id = "itemTransactionLineId", Title = "شناسه پابرگ", Type = (int)SqlDbType.Int,
                    IsDtParameter = true, Width = 7
                },
                new()
                {
                    Id = "documentDatePersian", Title = "تاریخ  برگه", Type = (int)SqlDbType.DateTime, Size = 50,
                    IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "warehouse", Title = "انبار", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 14
                },
                new()
                {
                    Id = "zone", Title = "بخش", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 12
                },
                new()
                {
                    Id = "bin", Title = "پالت", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 20
                },
                new()
                {
                    Id = "workflow", Title = "گردش کار", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 20
                },
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 25
                },
                new()
                {
                    Id = "item", Title = "آیتم ", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "attribute", Title = "صفت", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 18
                },
                new()
                {
                    Id = "unit", Title = "واحد اندازه گیری(اصلی)", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 12
                },
                new()
                {
                    Id = "accountDetail", Title = "تفضیل", Type = (int)SqlDbType.NVarChar, IsPersian = true,
                    IsDtParameter = true, Width = 20
                },
                new()
                {
                    Id = "debitQuantity", Title = "تعداد وارده", Type = (int)SqlDbType.Int, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "debitAmount", Title = "مبلغ وارده", Type = (int)SqlDbType.Int, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = true, Width = 8
                },
                new()
                {
                    Id = "creditQuantity", Title = "تعداد صادره", Type = (int)SqlDbType.Int, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "creditAmount", Title = "مبلغ صادره", Type = (int)SqlDbType.Int, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = true, Width = 8
                },
                new() { Id = "bySystem", Title = "سیستمی", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 7 },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ و زمان ثبت سربرگ", Type = (int)SqlDbType.DateTime,
                    IsDtParameter = true, Width = 12
                },
                new()
                {
                    Id = "itemTransactionCreateUser", Title = "کاربر ثبت کننده سربرگ", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = true, Width = 12
                },
                new()
                {
                    Id = "itemTransactionLineCreateUser", Title = "کاربر ثبت کننده پابرگ",
                    Type = (int)SqlDbType.NVarChar, Size = 10, IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "actions", Title = "گام", Type = (int)SqlDbType.NVarChar, Size = 10, IsDtParameter = true,
                    Width = 12
                }
            }
        };

        return list;
    }

    public async Task<ReportViewModel<List<ItemTransactioneReportPreviewModel>>> ItemTransactionReportPreview(
        GetItemTransactionReport model, byte roleId)
    {
        var result = new ReportViewModel<List<ItemTransactioneReportPreviewModel>>
        {
            Data = new List<ItemTransactioneReportPreviewModel>()
        };

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spr_ItemTransaction_ReportPreview]";
            conn.Open();
            result.Data = (await conn.QueryAsync<ItemTransactioneReportPreviewModel>(sQuery, new
            {
                model.PageNo,
                model.PageRowsCount,
                model.BranchId,
                RoleId = roleId,
                model.WarehouseId,
                model.ZoneId,
                model.BinId,
                model.ItemCategoryId,
                model.WorkflowId,
                model.StageId,
                model.ActionId,
                model.HeaderCreateUserId,
                model.ItemTypeId,
                model.ItemIds,
                AttributeIdsJson = model.AttributeIdList.ListHasRow()
                    ? JsonConvert.SerializeObject(model.AttributeIdList)
                    : null,
                UnitId = model.UnitIds,
                model.FromDocumentDate,
                model.ToDocumentDate,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure)).ToList();
            result.Columns = ItemTransactionReportGetColumns();
            conn.Close();
            return result;
        }
    }

    public async Task<ItemtransactionReportSum> ItemTransactionReportPreviewSum(GetItemTransactionReport model,
        byte roleId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spr_ItemTransaction_ReportPreviewSum]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<ItemtransactionReportSum>(sQuery, new
            {
                model.BranchId,
                RoleId = roleId,
                model.WarehouseId,
                model.ZoneId,
                model.BinId,
                model.ItemCategoryId,
                model.WorkflowId,
                model.StageId,
                model.ActionId,
                model.HeaderCreateUserId,
                model.ItemTypeId,
                model.ItemIds,
                AttributeIdsJson = model.AttributeIdList.ListHasRow()
                    ? JsonConvert.SerializeObject(model.AttributeIdList)
                    : null,
                model.UnitIds,
                model.FromDocumentDate,
                model.ToDocumentDate,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }


    public async Task<MemoryStream> ItemTransactionReportCsv(GetItemTransactionReport model, byte roleId)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var Columns = ItemTransactionReportGetColumns().DataColumns.Where(x => x.IsDtParameter && x.Id != "action")
            .Select(z => z.Title).ToList();

        var getPage = await ItemTransactionReportPreview(model, roleId);

        var Rows = from p in getPage.Data
            select new
            {
                p.Id,
                p.RequestId,
                p.ItemTransactionLineId,
                p.DocumentDatePersian,
                p.Warehouse,
                p.Zone,
                p.Bin,
                p.Workflow,
                p.Stage,
                p.Item,
                p.AttributeIds,
                p.Unit,
                p.AccountDetail,
                p.DebitQuantity,
                p.DebitAmount,
                p.CreditQuantity,
                p.CreditAmount,
                BySystem = p.BySystem ? "بلی" : "خیر",
                p.CreateDateTimePersian,
                p.ItemTransactionCreateUser,
                p.ItemTransactionLineCreateUserFullName,
                p.Actions
            };
        return csvStream = await csvGenerator.GenerateCsv(Rows, Columns);
    }
}