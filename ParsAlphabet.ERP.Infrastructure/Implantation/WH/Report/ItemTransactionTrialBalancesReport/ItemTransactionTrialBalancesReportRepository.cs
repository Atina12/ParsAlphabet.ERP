using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.WH.Report.ItemTransactionTrialBalancesReport;
using ParsAlphabet.ERP.Application.Interfaces.WF.Report.ItemTransactionTrialBalancesReport;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WH.Report.ItemTransactionTrialBalancesReport;

public class ItemTransactionTrialBalancesReportRepository : IItemTransactionTrialBalancesReportRepository
{
    private readonly IConfiguration _reportConfig;

    public ItemTransactionTrialBalancesReportRepository(IConfiguration reportConfig)
    {
        _reportConfig = reportConfig;
    }

    public IDbConnection Connection => new SqlConnection(_reportConfig.GetConnectionString("DefaultConnection"));

    public Tuple<DateTime?, DateTime?> GenerateDateRange(DateTime fromDate2)
    {
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

    public async Task<List<GetItemTransactionTrialBalanceHeaderTreeViewModel>>
        GetItemTransactionTrialBalanceReportJsonForTree(GetItemTransactionTrialBalancesReport model, byte roleId)
    {
        var result = new List<GetItemTransactionTrialBalanceHeaderTreeViewModel>();
        using (var conn = Connection)
        {
            var sQuery = "wh.Spr_ItemTransaction_LevelReportPreview";
            conn.Open();


            var list = (await conn.QueryAsync<GetItemTransactionTrialBalanceHeaderTreeViewModel>(sQuery, new
            {
                model.BranchId,
                model.ItemCategoryId,
                model.WorkflowId,
                model.StageId,
                model.ActionId,
                CreateUserId = model.HeaderCreateUserId > 0 ? model.HeaderCreateUserId : null,
                RoleId = roleId,
                ItemId = model.ItemIds,
                model.ItemTypeId,
                AttributeId = model.AttributeIdList != "" ? model.AttributeIdList : null,
                UnitId = model.UnitIds,
                SubUnitId = model.SubUnitIds,
                model.FromDocumentDate,
                model.ToDocumentDate,
                model.WarehouseId,
                model.ZoneId,
                model.BinId,
                Type = model.ReportType,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure)).ToList();


            var distinctListWarehouse = list.Where(x => x.WarehouseId != 0)
                .Select(w => new { w.WarehouseId, w.WareHouseName }).Distinct().ToList()
                .OrderByDescending(o => o.WarehouseId);

            foreach (var item in distinctListWarehouse)
            {
                var itm = new GetItemTransactionTrialBalanceHeaderTreeViewModel
                {
                    Id = item.WarehouseId,
                    Name = item.WareHouseName,
                    Children = GetBinZoneByWarhouseId(list, (byte)model.ReportType)
                };

                itm.Level = 0;
                itm.ChildCount = itm.Children != null ? itm.Children.Count : 0;


                result.Add(itm);
            }

            return result;
        }
    }

    public async Task<MemoryStream> ItemTransactionTrialBalancesReportCsv(GetItemTransactionTrialBalancesReport model,
        byte roleId)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var getPage = await ItemTransactionTrialBalancesReportPreview(model, roleId, true);
        var dataColumns = getPage.Columns;

        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                dataColumns.DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };

        var dateRange = GenerateDateRange(model.FromDocumentDate.Value);

        switch (model.ReportType)
        {
            case ReportItemTransactionTrialBalanceType.LevelWarhouse:
                if (model.ColumnType == 0)
                {
                    if (dateRange.Item1 != null)
                        result.Rows = from p in getPage.Data
                            select new
                            {
                                p.Warehouse,
                                p.Stage,
                                p.Item,
                                p.Attribute,
                                p.Unit,
                                p.AccountDetail,
                                p.QuantityBegining,
                                p.QuantityRemaining,
                                p.QuantityDebit,
                                p.QuantityCredit,
                                p.AmountRemain
                            };

                    else
                        result.Rows = from p in getPage.Data
                            select new
                            {
                                p.Warehouse,
                                p.Stage,
                                p.Item,
                                p.Attribute,
                                p.Unit,
                                p.AccountDetail,
                                p.QuantityBegining,
                                p.QuantityDebit,
                                p.QuantityCredit,
                                p.AmountRemain
                            };
                }

                else
                {
                    if (dateRange.Item1 != null)
                        result.Rows = from p in getPage.Data
                            select new
                            {
                                p.Warehouse,
                                p.Stage,
                                p.Item,
                                p.Attribute,
                                p.Unit,
                                p.AccountDetail,
                                p.QuantityBegining,
                                p.QuantityRemaining,
                                p.QuantityDebit,
                                p.QuantityCredit,
                                p.AmountBegining,
                                p.AmountRemaining,
                                p.AmountDebit,
                                p.AmountCredit,
                                p.AmountRemain
                            };

                    else
                        result.Rows = from p in getPage.Data
                            select new
                            {
                                p.Warehouse,
                                p.Stage,
                                p.Item,
                                p.Attribute,
                                p.Unit,
                                p.AccountDetail,
                                p.QuantityBegining,
                                p.QuantityDebit,
                                p.QuantityCredit,
                                p.AmountBegining,
                                p.AmountDebit,
                                p.AmountCredit,
                                p.AmountRemain
                            };
                }

                break;
            case ReportItemTransactionTrialBalanceType.LevelWarhouseZone:

                if (model.ColumnType == 0)
                {
                    if (dateRange.Item1 != null)
                        result.Rows = from p in getPage.Data
                            select new
                            {
                                p.Warehouse,
                                p.Zone,
                                p.Stage,
                                p.Item,
                                p.Attribute,
                                p.Unit,
                                p.AccountDetail,
                                p.QuantityBegining,
                                p.QuantityRemaining,
                                p.QuantityDebit,
                                p.QuantityCredit,
                                p.AmountRemain
                            };

                    else
                        result.Rows = from p in getPage.Data
                            select new
                            {
                                p.Warehouse,
                                p.Zone,
                                p.Stage,
                                p.Item,
                                p.Attribute,
                                p.Unit,
                                p.AccountDetail,
                                p.QuantityBegining,
                                p.QuantityDebit,
                                p.QuantityCredit,
                                p.AmountRemain
                            };
                }
                else
                {
                    if (dateRange.Item1 != null)
                        result.Rows = from p in getPage.Data
                            select new
                            {
                                p.Warehouse,
                                p.Zone,
                                p.Stage,
                                p.Item,
                                p.Attribute,
                                p.Unit,
                                p.AccountDetail,
                                p.QuantityBegining,
                                p.QuantityRemaining,
                                p.QuantityDebit,
                                p.QuantityCredit,
                                p.AmountBegining,
                                p.AmountRemaining,
                                p.AmountDebit,
                                p.AmountCredit,
                                p.AmountRemain
                            };

                    else
                        result.Rows = from p in getPage.Data
                            select new
                            {
                                p.Warehouse,
                                p.Zone,
                                p.Stage,
                                p.Item,
                                p.Attribute,
                                p.Unit,
                                p.AccountDetail,
                                p.QuantityBegining,
                                p.QuantityDebit,
                                p.QuantityCredit,
                                p.AmountBegining,
                                p.AmountDebit,
                                p.AmountCredit,
                                p.AmountRemain
                            };
                }

                break;
            case ReportItemTransactionTrialBalanceType.LevelWarhouseZoneBin:

                if (model.ColumnType == 0)
                {
                    if (dateRange.Item1 != null)
                        result.Rows = from p in getPage.Data
                            select new
                            {
                                p.Warehouse,
                                p.Zone,
                                p.Bin,
                                p.Stage,
                                p.Item,
                                p.Attribute,
                                p.Unit,
                                p.AccountDetail,
                                p.QuantityBegining,
                                p.QuantityRemaining,
                                p.QuantityDebit,
                                p.QuantityCredit,
                                p.AmountRemain
                            };

                    else
                        result.Rows = from p in getPage.Data
                            select new
                            {
                                p.Warehouse,
                                p.Zone,
                                p.Bin,
                                p.Stage,
                                p.Item,
                                p.Attribute,
                                p.Unit,
                                p.AccountDetail,
                                p.QuantityBegining,
                                p.QuantityDebit,
                                p.QuantityCredit,
                                p.AmountRemain
                            };
                }
                else
                {
                    if (dateRange.Item1 != null)
                        result.Rows = from p in getPage.Data
                            select new
                            {
                                p.Warehouse,
                                p.Zone,
                                p.Bin,
                                p.Stage,
                                p.Item,
                                p.Attribute,
                                p.Unit,
                                p.AccountDetail,
                                p.QuantityBegining,
                                p.QuantityRemaining,
                                p.QuantityDebit,
                                p.QuantityCredit,
                                p.AmountBegining,
                                p.AmountRemaining,
                                p.AmountDebit,
                                p.AmountCredit,
                                p.AmountRemain
                            };

                    else
                        result.Rows = from p in getPage.Data
                            select new
                            {
                                p.Warehouse,
                                p.Zone,
                                p.Bin,
                                p.Stage,
                                p.Item,
                                p.Attribute,
                                p.Unit,
                                p.AccountDetail,
                                p.QuantityBegining,
                                p.QuantityDebit,
                                p.QuantityCredit,
                                p.AmountBegining,
                                p.AmountDebit,
                                p.AmountCredit,
                                p.AmountRemain
                            };
                }

                break;
            case ReportItemTransactionTrialBalanceType.NoteWarhouse:
                if (model.ColumnType == 0)
                {
                    if (dateRange.Item1 != null)
                        result.Rows = from p in getPage.Data
                            select new
                            {
                                p.Warehouse,
                                p.Stage,
                                p.Item,
                                p.Attribute,
                                p.Description,
                                p.Unit,
                                p.AccountDetail,
                                p.QuantityBegining,
                                p.QuantityRemaining,
                                p.QuantityDebit,
                                p.QuantityCredit,
                                p.AmountRemain
                            };
                    else
                        result.Rows = from p in getPage.Data
                            select new
                            {
                                p.Warehouse,
                                p.Stage,
                                p.Item,
                                p.Attribute,
                                p.Description,
                                p.Unit,
                                p.AccountDetail,
                                p.QuantityDebit,
                                p.QuantityCredit,
                                p.AmountRemain
                            };
                }
                else
                {
                    if (dateRange.Item1 != null)
                        result.Rows = from p in getPage.Data
                            select new
                            {
                                p.Warehouse,
                                p.Stage,
                                p.Item,
                                p.Attribute,
                                p.Description,
                                p.Unit,
                                p.AccountDetail,
                                p.QuantityBegining,
                                p.QuantityDebit,
                                p.QuantityCredit,
                                p.AmountBegining,
                                p.AmountDebit,
                                p.AmountCredit,
                                p.AmountRemain
                            };
                    else
                        result.Rows = from p in getPage.Data
                            select new
                            {
                                p.Warehouse,
                                p.Stage,
                                p.Item,
                                p.Attribute,
                                p.Description,
                                p.Unit,
                                p.AccountDetail,
                                p.QuantityBegining,
                                p.QuantityDebit,
                                p.QuantityCredit,
                                p.AmountDebit,
                                p.AmountCredit,
                                p.AmountRemain
                            };
                }

                break;

            case ReportItemTransactionTrialBalanceType.NoteWarhouseZone:
                if (model.ColumnType == 0)
                {
                    if (dateRange.Item1 != null)
                        result.Rows = from p in getPage.Data
                            select new
                            {
                                p.Warehouse,
                                p.Zone,
                                p.Stage,
                                p.Item,
                                p.Attribute,
                                p.Description,
                                p.Unit,
                                p.AccountDetail,
                                p.QuantityBegining,
                                p.QuantityDebit,
                                p.QuantityCredit,
                                p.AmountRemain
                            };
                    else
                        result.Rows = from p in getPage.Data
                            select new
                            {
                                p.Warehouse,
                                p.Zone,
                                p.Stage,
                                p.Item,
                                p.Attribute,
                                p.Description,
                                p.Unit,
                                p.AccountDetail,
                                p.QuantityDebit,
                                p.QuantityCredit,
                                p.AmountRemain
                            };
                }
                else
                {
                    if (dateRange.Item1 != null)
                        result.Rows = from p in getPage.Data
                            select new
                            {
                                p.Warehouse,
                                p.Zone,
                                p.Stage,
                                p.Item,
                                p.Attribute,
                                p.Description,
                                p.Unit,
                                p.AccountDetail,
                                p.QuantityBegining,
                                p.QuantityDebit,
                                p.QuantityCredit,
                                p.AmountBegining,
                                p.AmountDebit,
                                p.AmountCredit,
                                p.AmountRemain
                            };
                    else
                        result.Rows = from p in getPage.Data
                            select new
                            {
                                p.Warehouse,
                                p.Zone,
                                p.Stage,
                                p.Item,
                                p.Attribute,
                                p.Description,
                                p.Unit,
                                p.AccountDetail,
                                p.QuantityBegining,
                                p.QuantityDebit,
                                p.QuantityCredit,
                                p.AmountDebit,
                                p.AmountCredit,
                                p.AmountRemain
                            };
                }

                break;
            case ReportItemTransactionTrialBalanceType.NoteWarhouseZoneBin:
                if (model.ColumnType == 0)
                {
                    if (dateRange.Item1 != null)
                        result.Rows = from p in getPage.Data
                            select new
                            {
                                p.Warehouse,
                                p.Zone,
                                p.Bin,
                                p.Stage,
                                p.Item,
                                p.Attribute,
                                p.Description,
                                p.Unit,
                                p.AccountDetail,
                                p.QuantityBegining,
                                p.QuantityDebit,
                                p.QuantityCredit,
                                p.AmountRemain
                            };
                    else
                        result.Rows = from p in getPage.Data
                            select new
                            {
                                p.Warehouse,
                                p.Zone,
                                p.Bin,
                                p.Stage,
                                p.Item,
                                p.Attribute,
                                p.Description,
                                p.Unit,
                                p.AccountDetail,
                                p.QuantityDebit,
                                p.QuantityCredit,
                                p.AmountRemain
                            };
                }
                else
                {
                    if (dateRange.Item1 != null)
                        result.Rows = from p in getPage.Data
                            select new
                            {
                                p.Warehouse,
                                p.Zone,
                                p.Bin,
                                p.Stage,
                                p.Item,
                                p.Attribute,
                                p.Description,
                                p.Unit,
                                p.AccountDetail,
                                p.QuantityBegining,
                                p.QuantityDebit,
                                p.QuantityCredit,
                                p.AmountBegining,
                                p.AmountDebit,
                                p.AmountCredit,
                                p.AmountRemain
                            };
                    else
                        result.Rows = from p in getPage.Data
                            select new
                            {
                                p.Warehouse,
                                p.Zone,
                                p.Bin,
                                p.Stage,
                                p.Item,
                                p.Attribute,
                                p.Description,
                                p.Unit,
                                p.AccountDetail,
                                p.QuantityBegining,
                                p.QuantityDebit,
                                p.QuantityCredit,
                                p.AmountDebit,
                                p.AmountCredit,
                                p.AmountRemain
                            };
                }

                break;
        }

        var columns = dataColumns.DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title)
            .ToList();

        csvStream = await csvGenerator.GenerateCsv(result.Rows, columns);

        return csvStream;
    }

    public async Task<ReportViewModel<List<ItemTransactionTrialBalancesReportPreviewModel>>>
        ItemTransactionTrialBalancesReportPreview(GetItemTransactionTrialBalancesReport model, byte roleId,
            bool displayCsv = false)
    {
        var result = new ReportViewModel<List<ItemTransactionTrialBalancesReportPreviewModel>>
        {
            Data = new List<ItemTransactionTrialBalancesReportPreviewModel>()
        };

        var fromDate = model.FromDocumentDate.Value;

        var dateRange = GenerateDateRange(fromDate);

        var displayRemaining = false;

        if (dateRange.Item1 != null)
        {
            model.FromDocumentDate1 = dateRange.Item1;
            model.ToDocumentDate1 = dateRange.Item2;

            displayRemaining = true;
        }

        var isQuntity = model.ColumnType == 0 ? true : false;


        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spr_ItemTransaction_ItemReportPreview]";

            switch (model.ReportType)
            {
                case ReportItemTransactionTrialBalanceType.LevelWarhouse:
                    result.Columns = LevelWarhouseGetColumns(displayRemaining, isQuntity);
                    break;

                case ReportItemTransactionTrialBalanceType.LevelWarhouseZone:
                    result.Columns = LevelZoneGetColumns(displayRemaining, isQuntity);
                    break;

                case ReportItemTransactionTrialBalanceType.LevelWarhouseZoneBin:
                    result.Columns = LevelBinGetColumns(displayRemaining, isQuntity);
                    break;

                case ReportItemTransactionTrialBalanceType.NoteWarhouse:
                    result.Columns = NoteWarhouseColumns(displayRemaining, isQuntity);
                    break;

                case ReportItemTransactionTrialBalanceType.NoteWarhouseZone:
                    result.Columns = NoteZoneColumns(displayRemaining, isQuntity);
                    break;

                case ReportItemTransactionTrialBalanceType.NoteWarhouseZoneBin:
                    result.Columns = NoteBinColumns(displayRemaining, isQuntity);
                    break;

                default:
                    result.Columns = LevelWarhouseGetColumns(displayRemaining, isQuntity);
                    break;
            }

            conn.Open();

            var trialBalanceResult = (await conn.QueryAsync<ItemTransactionTrialBalancesReportPreviewModel>(sQuery, new
            {
                model.PageNo,
                model.PageRowsCount,
                model.BranchId,
                model.ItemCategoryId,
                model.WorkflowId,
                model.StageId,
                model.ActionId,
                CreateUserId = model.HeaderCreateUserId,
                model.ItemTypeId,
                AttributeId = model.AttributeIdList != "" ? model.AttributeIdList : null,
                UnitId = model.UnitIds,
                SubUnitId = model.SubUnitIds,
                model.FromDocumentDate,
                model.ToDocumentDate,
                model.FromDocumentDate1,
                model.ToDocumentDate1,
                model.WarehouseId,
                model.ZoneId,
                model.BinId,
                ItemId = model.ItemIds,
                Type = model.ReportType,
                AmountOrQuantity = model.ColumnType,
                RoleId = roleId,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure)).ToList();

            conn.Close();

            result.Data.AddRange(trialBalanceResult);

            decimal remainAmount = 0;

            if (model.ColumnType == 0)
            {
                if (model.AffectedQuantityBeginingSum != -1 && model.AffectedQuantityCreditSum != -1 &&
                    model.AffectedQuantityDebitSum != -1 && model.AffectedQuantityRemainingSum != -1 &&
                    model.AffectedAmountRemainSum != -1 && displayCsv == false)
                    remainAmount = model.AffectedAmountRemainSum;
            }
            else
            {
                if (model.AffectedAmountBeginingSum != -1 && model.AffectedAmountCreditSum != -1 &&
                    model.AffectedAmountDebitSum != -1 && model.AffectedAmountRemainingSum != -1 &&
                    model.AffectedAmountRemainSum != -1 && displayCsv == false)
                    remainAmount = model.AffectedAmountRemainSum;
            }


            if (result.Data != null)
            {
                var resultLength = result.Data.Count();

                for (var i = 0; i < resultLength; i++)
                    if (model.ColumnType == 0)
                    {
                        remainAmount = result.Data[i].QuantityBegining + result.Data[i].QuantityRemaining +
                                       (result.Data[i].QuantityDebit - result.Data[i].QuantityCredit) + remainAmount;
                        result.Data[i].AmountRemain = remainAmount;
                        result.Data[i].Description = result.Data[i].IsRemaining == 1
                            ? "مانده از قبل"
                            : result.Data[i].No + "_" + result.Data[i].DocumentDatePersian + "_" +
                              result.Data[i].ItemCategory + "_" + result.Data[i].AccountDetail;
                    }
                    else
                    {
                        remainAmount = result.Data[i].AmountBegining + result.Data[i].AmountRemaining +
                                       (result.Data[i].AmountDebit - result.Data[i].AmountCredit) + remainAmount;
                        result.Data[i].AmountRemain = remainAmount;
                        result.Data[i].Description = result.Data[i].IsRemaining == 1
                            ? "مانده از قبل"
                            : result.Data[i].No + "_" + result.Data[i].DocumentDatePersian + "_" +
                              result.Data[i].ItemCategory + "_" + result.Data[i].AccountDetail;
                    }
            }

            conn.Close();

            return result;
        }
    }

    public async Task<ItemTransactionReportSum> ItemTransactionTrialBalancesReportSum(
        GetItemTransactionTrialBalancesReport model, byte roleId)
    {
        var result = new ItemTransactionReportSum();

        var fromDate = model.FromDocumentDate.Value;

        var dateRange = GenerateDateRange(fromDate);

        if (dateRange.Item1 != null)
        {
            model.FromDocumentDate1 = dateRange.Item1;
            model.ToDocumentDate1 = dateRange.Item2;
        }

        var summaryRecord1 = await GetDataItemTransactionTrialBalanceSum(model, roleId);

        if (model.ColumnType == 0) //تعدادی
        {
            result.QuantityBegining += summaryRecord1.QuantityBegining;

            result.QuantityCredit += summaryRecord1.QuantityCredit;

            result.QuantityDebit += summaryRecord1.QuantityDebit;

            result.QuantityRemaining += summaryRecord1.QuantityRemaining;

            result.AmountRemain = result.QuantityBegining + result.QuantityRemaining + result.QuantityDebit -
                                  result.QuantityCredit;
        }
        else // ریالی
        {
            result.QuantityBegining += summaryRecord1.QuantityBegining;

            result.QuantityCredit += summaryRecord1.QuantityCredit;

            result.QuantityDebit += summaryRecord1.QuantityDebit;

            result.QuantityRemaining += summaryRecord1.QuantityRemaining;

            result.AmountBegining += summaryRecord1.AmountBegining;

            result.AmountCredit += summaryRecord1.AmountCredit;

            result.AmountDebit += summaryRecord1.AmountDebit;

            result.AmountRemaining += summaryRecord1.AmountRemaining;

            result.AmountRemain = result.AmountBegining + result.AmountRemaining +
                                  (result.AmountDebit - result.AmountCredit);
        }


        return result;
    }

    public GetColumnsViewModel LevelWarhouseGetColumns(bool displayRemaining, bool isQuntity)
    {
        var list = new GetColumnsViewModel
        {
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "inOut", FieldValue = "2", Operator = "==" } },
            AnswerCondition = "color:#da1717",
            ElseAnswerCondition = "",
            SumDynamic = true,
            GetSumApi = "/api/WH/ItemTransactionTrialBalancesReportApi/repitemtransactiontrialbalancesum",

            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "warehouse", Title = "انبار", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 9
                },

                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 14
                },

                new()
                {
                    Id = "item", Title = "آیتم ", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 10
                },

                new()
                {
                    Id = "attribute", Title = "صفت", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 13
                },

                new()
                {
                    Id = "unit", Title = "واحد اندازه گیری", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 7
                },

                new()
                {
                    Id = "accountDetail", Title = "تفضیل", Type = (int)SqlDbType.NVarChar, IsPersian = true,
                    IsDtParameter = true, Width = 14
                },


                new()
                {
                    Id = "quantityBegining", Title = "تعداد اول دوره", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = true, Width = 7, IsCommaSep = true, HasSumValue = true
                },

                new()
                {
                    Id = "quantityRemaining", Title = " تعداد مانده از قبل", Type = (int)SqlDbType.Int,
                    IsCommaSep = true, HasSumValue = true && displayRemaining, IsDtParameter = true && displayRemaining,
                    Width = 8
                },

                new()
                {
                    Id = "quantityDebit", Title = "تعداد وارده ", Type = (int)SqlDbType.Int, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = true, Width = 6
                },

                new()
                {
                    Id = "quantityCredit", Title = "تعداد صادره", Type = (int)SqlDbType.Int, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = true, Width = 6
                },


                new()
                {
                    Id = "amountBegining", Title = "مبلغ اول دوره", Type = (int)SqlDbType.Money, Size = 50,
                    IsDtParameter = !isQuntity, Width = 8, IsCommaSep = true, HasSumValue = !isQuntity
                },

                new()
                {
                    Id = "amountRemaining", Title = "مبلغ مانده از قبل", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = !isQuntity && displayRemaining, IsDtParameter = !isQuntity && displayRemaining,
                    Width = 8
                },

                new()
                {
                    Id = "amountDebit", Title = "مبلغ وارده", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = !isQuntity, IsDtParameter = !isQuntity, Width = 6
                },

                new()
                {
                    Id = "amountCredit", Title = "مبلغ صادره", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = !isQuntity, IsDtParameter = !isQuntity, Width = 6
                },

                new()
                {
                    Id = "amountRemain", Title = "تعداد مانده", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = isQuntity, Width = 5
                },
                new()
                {
                    Id = "amountRemain", Title = "مبلغ مانده", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = !isQuntity, Width = 5
                },

                new() { Id = "inOut", IsPrimary = true }
            }
        };

        return list;
    }

    public GetColumnsViewModel LevelZoneGetColumns(bool displayRemaining, bool isQuntity)
    {
        var list = new GetColumnsViewModel
        {
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "inOut", FieldValue = "2", Operator = "==" } },
            AnswerCondition = "color:#da1717",
            ElseAnswerCondition = "",
            SumDynamic = true,
            GetSumApi = "/api/WH/ItemTransactionTrialBalancesReportApi/repitemtransactiontrialbalancesum",

            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "warehouse", Title = "انبار", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 9
                },

                new()
                {
                    Id = "zone", Title = "بخش", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 5
                },

                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 15
                },

                new() { Id = "item", Title = "آیتم ", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 9 },

                new()
                {
                    Id = "attribute", Title = "صفت", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 14
                },

                new()
                {
                    Id = "unit", Title = "واحد اندازه گیری", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 6
                },

                new()
                {
                    Id = "accountDetail", Title = "تفضیل", Type = (int)SqlDbType.NVarChar, IsPersian = true,
                    IsDtParameter = true, Width = 14
                },


                new()
                {
                    Id = "quantityBegining", Title = " تعداد اول دوره", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = true, Width = 6, IsCommaSep = true, HasSumValue = true
                },

                new()
                {
                    Id = "quantityRemaining", Title = "تعداد مانده از قبل", Type = (int)SqlDbType.Int,
                    IsCommaSep = true, HasSumValue = true && displayRemaining, IsDtParameter = true && displayRemaining,
                    Width = 8
                },

                new()
                {
                    Id = "quantityDebit", Title = "تعداد وارده", Type = (int)SqlDbType.Int, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = true, Width = 5
                },

                new()
                {
                    Id = "quantityCredit", Title = "تعداد صادره", Type = (int)SqlDbType.Int, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = true, Width = 5
                },


                new()
                {
                    Id = "amountBegining", Title = "مبلغ اول دوره", Type = (int)SqlDbType.Money, Size = 50,
                    IsDtParameter = !isQuntity, Width = 6, IsCommaSep = true, HasSumValue = !isQuntity
                },

                new()
                {
                    Id = "amountRemaining", Title = "مبلغ مانده از قبل", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = !isQuntity && displayRemaining, IsDtParameter = !isQuntity && displayRemaining,
                    Width = 8
                },

                new()
                {
                    Id = "amountDebit", Title = "مبلغ وارده", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = !isQuntity, Width = 5
                },

                new()
                {
                    Id = "amountCredit", Title = "مبلغ صادره", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = !isQuntity, Width = 5
                },


                new()
                {
                    Id = "amountRemain", Title = "تعداد مانده", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = isQuntity, Width = 5
                },
                new()
                {
                    Id = "amountRemain", Title = "مبلغ مانده", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = !isQuntity, Width = 5
                },

                new() { Id = "inOut", IsPrimary = true }
            }
        };

        return list;
    }

    public GetColumnsViewModel LevelBinGetColumns(bool displayRemaining, bool isQuntity)
    {
        var list = new GetColumnsViewModel
        {
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "inOut", FieldValue = "2", Operator = "==" } },
            AnswerCondition = "color:#da1717",
            ElseAnswerCondition = "",
            SumDynamic = true,
            GetSumApi = "/api/WH/ItemTransactionTrialBalancesReportApi/repitemtransactiontrialbalancesum",

            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "warehouse", Title = "انبار", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 9
                },

                new()
                {
                    Id = "zone", Title = "بخش", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 6
                },

                new()
                {
                    Id = "bin", Title = "پالت", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 8
                },

                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 16
                },

                new()
                {
                    Id = "item", Title = "آیتم ", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 10
                },

                new()
                {
                    Id = "attribute", Title = "صفت", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 14
                },

                new()
                {
                    Id = "unit", Title = "واحد اندازه گیری", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 6
                },

                new()
                {
                    Id = "accountDetail", Title = "تفضیل", Type = (int)SqlDbType.NVarChar, IsPersian = true,
                    IsDtParameter = true, Width = 16
                },

                new()
                {
                    Id = "quantityBegining", Title = " تعداد اول دوره", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = true, Width = 6, IsCommaSep = true, HasSumValue = true
                },

                new()
                {
                    Id = "quantityRemaining", Title = "تعداد مانده از قبل", Type = (int)SqlDbType.Int,
                    IsCommaSep = true, HasSumValue = true && displayRemaining, IsDtParameter = true && displayRemaining,
                    Width = 8
                },

                new()
                {
                    Id = "quantityDebit", Title = "تعداد وارده", Type = (int)SqlDbType.Int, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = true, Width = 5
                },

                new()
                {
                    Id = "quantityCredit", Title = "تعداد صادره", Type = (int)SqlDbType.Int, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = true, Width = 5
                },

                new()
                {
                    Id = "amountBegining", Title = "مبلغ اول دوره", Type = (int)SqlDbType.Money, Size = 50,
                    IsDtParameter = !isQuntity, Width = 8, IsCommaSep = true, HasSumValue = !isQuntity
                },

                new()
                {
                    Id = "amountRemaining", Title = "مبلغ مانده از قبل", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = !isQuntity && displayRemaining, IsDtParameter = !isQuntity && displayRemaining,
                    Width = 8
                },

                new()
                {
                    Id = "amountDebit", Title = "مبلغ وارده", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = !isQuntity, IsDtParameter = !isQuntity, Width = 5
                },

                new()
                {
                    Id = "amountCredit", Title = "مبلغ صادره", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = !isQuntity, IsDtParameter = !isQuntity, Width = 5
                },


                new()
                {
                    Id = "amountRemain", Title = "تعداد مانده", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = isQuntity, Width = 5
                },
                new()
                {
                    Id = "amountRemain", Title = "مبلغ مانده", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = !isQuntity, Width = 5
                },


                new() { Id = "inOut", IsPrimary = true }
            }
        };

        return list;
    }

    public GetColumnsViewModel NoteWarhouseColumns(bool displayRemaining, bool isQuntity)
    {
        var list = new GetColumnsViewModel
        {
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "inOut", FieldValue = "2", Operator = "==" } },
            AnswerCondition = "color:#da1717",
            ElseAnswerCondition = "",
            SumDynamic = true,
            GetSumApi = "/api/WH/ItemTransactionTrialBalancesReportApi/repitemtransactiontrialbalancesum",

            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "warehouse", Title = "انبار", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 14
                },

                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 14
                },

                new() { Id = "item", Title = "آیتم ", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 8 },

                new()
                {
                    Id = "attribute", Title = "صفت", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 9
                },

                new()
                {
                    Id = "description", Title = "شرح", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 10
                },

                new()
                {
                    Id = "unit", Title = "واحد اندازه گیری", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 5
                },

                new()
                {
                    Id = "accountDetail", Title = "تفضیل", Type = (int)SqlDbType.NVarChar, IsPersian = true,
                    IsDtParameter = true, Width = 8
                },

                new()
                {
                    Id = "quantityBegining", Title = " تعداد اول دوره", Type = (int)SqlDbType.Int, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = true, Width = 8
                },

                new()
                {
                    Id = "quantityDebit", Title = "تعداد وارده", Type = (int)SqlDbType.Int, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = true, Width = 8
                },

                new()
                {
                    Id = "quantityCredit", Title = "تعداد صادره", Type = (int)SqlDbType.Int, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = true, Width = 8
                },

                new()
                {
                    Id = "amountBegining", Title = "مبلغ اول دوره", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = !isQuntity, IsDtParameter = !isQuntity, Width = 8
                },

                new()
                {
                    Id = "amountDebit", Title = "مبلغ وارده", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = !isQuntity, IsDtParameter = !isQuntity, Width = 8
                },

                new()
                {
                    Id = "amountCredit", Title = "مبلغ صادره", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = !isQuntity, IsDtParameter = !isQuntity, Width = 8
                },

                new()
                {
                    Id = "amountRemain", Title = "تعداد مانده", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = isQuntity, Width = 8
                },

                new()
                {
                    Id = "amountRemain", Title = "مبلغ مانده", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = !isQuntity, Width = 8
                },

                new() { Id = "inOut", IsPrimary = true }
            }
        };

        return list;
    }

    public GetColumnsViewModel NoteZoneColumns(bool displayRemaining, bool isQuntity)
    {
        var list = new GetColumnsViewModel
        {
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "inOut", FieldValue = "2", Operator = "==" } },
            AnswerCondition = "color:#da1717",
            ElseAnswerCondition = "",
            SumDynamic = true,
            GetSumApi = "/api/WH/ItemTransactionTrialBalancesReportApi/repitemtransactiontrialbalancesum",

            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "warehouse", Title = "انبار", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 10
                },

                new()
                {
                    Id = "zone", Title = "بخش", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 7
                },

                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 14
                },

                new()
                {
                    Id = "item", Title = "آیتم ", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 10
                },

                new()
                {
                    Id = "attribute", Title = "صفت", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 14
                },

                new()
                {
                    Id = "description", Title = " شرح", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 10
                },

                new()
                {
                    Id = "unit", Title = "واحد اندازه گیری", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 6
                },

                new()
                {
                    Id = "accountDetail", Title = "تفضیل", Type = (int)SqlDbType.NVarChar, IsPersian = true,
                    IsDtParameter = true, Width = 14
                },

                new()
                {
                    Id = "quantityBegining", Title = "تعداد اول دوره", Type = (int)SqlDbType.Int, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = true, Width = 6
                },

                new()
                {
                    Id = "quantityDebit", Title = "تعداد وارده", Type = (int)SqlDbType.Int, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = true, Width = 5
                },

                new()
                {
                    Id = "quantityCredit", Title = "تعداد صادره", Type = (int)SqlDbType.Int, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = true, Width = 5
                },

                new()
                {
                    Id = "amountBegining", Title = "مبلغ اول دوره", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = !isQuntity, IsDtParameter = !isQuntity, Width = 5
                },

                new()
                {
                    Id = "amountDebit", Title = "مبلغ وارده", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = !isQuntity, IsDtParameter = !isQuntity, Width = 5
                },

                new()
                {
                    Id = "amountCredit", Title = "مبلغ صادره", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = !isQuntity, IsDtParameter = !isQuntity, Width = 8
                },

                new()
                {
                    Id = "amountRemain", Title = "تعداد مانده", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = isQuntity, Width = 5
                },
                new()
                {
                    Id = "amountRemain", Title = "مبلغ مانده", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = !isQuntity, Width = 5
                },

                new() { Id = "inOut", IsPrimary = true }
            }
        };

        return list;
    }

    public GetColumnsViewModel NoteBinColumns(bool displayRemaining, bool isQuntity)
    {
        var list = new GetColumnsViewModel
        {
            ConditionOn = "row",
            Condition = new List<ConditionPageTable>
                { new() { FieldName = "inOut", FieldValue = "2", Operator = "==" } },
            AnswerCondition = "color:#da1717",
            ElseAnswerCondition = "",
            SumDynamic = true,
            GetSumApi = "/api/WH/ItemTransactionTrialBalancesReportApi/repitemtransactiontrialbalancesum",

            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "warehouse", Title = "انبار", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 8
                },

                new()
                {
                    Id = "zone", Title = "بخش", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 7
                },

                new()
                {
                    Id = "bin", Title = "پالت", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 7
                },

                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 10
                },

                new() { Id = "item", Title = "آیتم ", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 8 },

                new()
                {
                    Id = "attribute", Title = "صفت", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 14
                },

                new()
                {
                    Id = "description", Title = "شرح", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 10
                },

                new()
                {
                    Id = "unit", Title = "واحد اندازه گیری", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 6
                },

                new()
                {
                    Id = "accountDetail", Title = "تفضیل", Type = (int)SqlDbType.NVarChar, IsPersian = true,
                    IsDtParameter = true, Width = 14
                },

                new()
                {
                    Id = "quantityBegining", Title = "تعداد اول دوره", Type = (int)SqlDbType.Int, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = true, Width = 7
                },

                new()
                {
                    Id = "quantityDebit", Title = "تعداد وارده", Type = (int)SqlDbType.Int, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = true, Width = 5
                },

                new()
                {
                    Id = "quantityCredit", Title = "تعداد صادره", Type = (int)SqlDbType.Int, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = true, Width = 5
                },

                new()
                {
                    Id = "amountBegining", Title = "مبلغ اول دوره", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = !isQuntity, IsDtParameter = !isQuntity, Width = 7
                },

                new()
                {
                    Id = "amountDebit", Title = "مبلغ وارده", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = !isQuntity, IsDtParameter = !isQuntity, Width = 6
                },

                new()
                {
                    Id = "amountCredit", Title = "مبلغ صادره", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = !isQuntity, IsDtParameter = !isQuntity, Width = 6
                },

                new()
                {
                    Id = "amountRemain", Title = "تعداد مانده", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = isQuntity, Width = 4
                },

                new()
                {
                    Id = "amountRemain", Title = "مبلغ مانده", Type = (int)SqlDbType.Money, IsCommaSep = true,
                    HasSumValue = true, IsDtParameter = !isQuntity, Width = 4
                },

                new() { Id = "inOut", IsPrimary = true }
            }
        };

        return list;
    }

    //<summary>
    //لیست بخش ها در ساختار درختی
    // </summary>
    public List<GetItemTransactionTrialBalanceHeaderTreeViewModel> GetBinZoneByWarhouseId(
        List<GetItemTransactionTrialBalanceHeaderTreeViewModel> list, int reportType)
    {
        var result = new List<GetItemTransactionTrialBalanceHeaderTreeViewModel>();
        using (var conn = Connection)
        {
            if (reportType == (byte)ReportItemTransactionTrialBalanceType.NoteWarhouse)
            {
                var distinctListZone = list.Where(x => x.ItemId != 0)
                    .Select(w => new { w.ItemId, w.ItemName, w.Attribute, w.Unit }).Distinct().ToList()
                    .OrderByDescending(o => o.ItemId);

                foreach (var item in distinctListZone)
                {
                    var itm = new GetItemTransactionTrialBalanceHeaderTreeViewModel
                    {
                        Id = item.ItemId,
                        Name = item.ItemName + '/' + (item.Attribute != "-" ? item.Attribute.Split('-')[1] + '/' : "") +
                               item.Unit.Split('-')[1],
                        AttributeIds = item.Attribute != "" ? item.Attribute.Split('-')[0] : "0",
                        UnitId = item.Unit != "" ? int.Parse(item.Unit.Split('-')[0]) : 0,
                        Children = GetBinByZoneId(list, item.ItemId, reportType)
                    };

                    itm.Level = 1;
                    itm.ChildCount = itm.Children != null ? itm.Children.Count : 0;

                    result.Add(itm);
                }
            }
            else
            {
                var distinctListZone = list.Where(x => x.ZoneId != 0).Select(w => new { w.ZoneId, w.ZoneName })
                    .Distinct().ToList().OrderByDescending(o => o.ZoneId);

                foreach (var item in distinctListZone)
                {
                    var itm = new GetItemTransactionTrialBalanceHeaderTreeViewModel
                    {
                        Id = item.ZoneId,
                        Name = item.ZoneName,
                        ZoneId = item.ZoneId,
                        Children = GetBinByZoneId(list, item.ZoneId, reportType)
                    };

                    itm.Level = 1;
                    itm.ChildCount = itm.Children != null ? itm.Children.Count : 0;
                    result.Add(itm);
                }
            }
        }

        return result;
    }

    //<summary>
    //لیست پالت ها در ساختار درختی
    // </summary>
    public List<GetItemTransactionTrialBalanceHeaderTreeViewModel> GetBinByZoneId(
        List<GetItemTransactionTrialBalanceHeaderTreeViewModel> list, int parentId, int reportType)
    {
        var result = new List<GetItemTransactionTrialBalanceHeaderTreeViewModel>();
        using (var conn = Connection)
        {
            if (reportType == (byte)ReportItemTransactionTrialBalanceType.NoteWarhouseZone)
            {
                var distinctListBin = list.Where(x => x.ItemId != 0 && x.ZoneId == parentId)
                    .Select(w => new { w.ItemId, w.ItemName, w.Attribute, w.Unit }).Distinct().ToList()
                    .OrderByDescending(o => parentId);
                foreach (var item in distinctListBin)
                {
                    var itm = new GetItemTransactionTrialBalanceHeaderTreeViewModel
                    {
                        Id = item.ItemId,
                        Name = item.ItemName + '/' + (item.Attribute != "-" ? item.Attribute.Split('-')[1] + '/' : "") +
                               item.Unit.Split('-')[1],
                        AttributeIds = item.Attribute != "-" ? item.Attribute.Split('-')[0] : "0",
                        UnitId = item.Unit != "" ? int.Parse(item.Unit.Split('-')[0]) : 0
                    };

                    itm.Level = 2;
                    itm.ChildCount = itm.Children != null ? itm.Children.Count : 0;
                    result.Add(itm);
                }
            }
            else if (reportType == (byte)ReportItemTransactionTrialBalanceType.NoteWarhouseZoneBin)
            {
                var distinctListBin = list.Where(x => x.BinId != 0 && x.ZoneId == parentId)
                    .Select(w => new { w.BinId, w.BinName }).Distinct().ToList().OrderByDescending(o => parentId);
                foreach (var item in distinctListBin)
                {
                    var itm = new GetItemTransactionTrialBalanceHeaderTreeViewModel
                    {
                        Id = item.BinId,
                        Name = item.BinName,
                        Children = GetItemByBinId(list, parentId, item.BinId)
                    };

                    itm.Level = 2;
                    itm.ChildCount = itm.Children != null ? itm.Children.Count : 0;
                    result.Add(itm);
                }
            }
            else
            {
                var distinctListBin = list.Where(x => x.BinId != 0 && x.ZoneId == parentId)
                    .Select(w => new { w.BinId, w.BinName }).Distinct().ToList().OrderByDescending(o => parentId);
                foreach (var item in distinctListBin)
                {
                    var itm = new GetItemTransactionTrialBalanceHeaderTreeViewModel
                    {
                        Id = item.BinId,
                        Name = item.BinName
                    };

                    itm.Level = 2;
                    itm.ChildCount = 0;
                    result.Add(itm);
                }
            }
        }

        return result;
    }

    //<summary>
    //لیست کالاها در ساختار درختی
    // </summary>
    public List<GetItemTransactionTrialBalanceHeaderTreeViewModel> GetItemByBinId(
        List<GetItemTransactionTrialBalanceHeaderTreeViewModel> list, int parentId, int binId)
    {
        var result = new List<GetItemTransactionTrialBalanceHeaderTreeViewModel>();
        using (var conn = Connection)
        {
            var distinctListBin = list.Where(x =>
                    x.ItemId != 0 && (binId > 0 ? x.BinId == binId : true) &&
                    (parentId > 0 ? x.ZoneId == parentId : true))
                .Select(w => new { w.ItemId, w.ItemName, w.Attribute, w.Unit }).Distinct().ToList()
                .OrderByDescending(o => o.ItemId);
            foreach (var item in distinctListBin)
            {
                var itm = new GetItemTransactionTrialBalanceHeaderTreeViewModel
                {
                    Id = item.ItemId,
                    Name = item.ItemName + '/' + (item.Attribute != "-" ? item.Attribute.Split('-')[1] + '/' : "") +
                           item.Unit.Split('-')[1],
                    AttributeIds = item.Attribute != "" ? item.Attribute.Split('-')[0] : "0",
                    UnitId = item.Unit != "" ? int.Parse(item.Unit.Split('-')[0]) : 0
                };

                itm.Level = 3;
                itm.ChildCount = 0;
                result.Add(itm);
            }
        }

        return result;
    }

    public async Task<ItemTransactionReportSum> GetDataItemTransactionTrialBalanceSum(
        GetItemTransactionTrialBalancesReport model, byte roleId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spr_ItemTransaction_ItemReportPreview_Sum]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<ItemTransactionReportSum>(sQuery, new
            {
                model.BranchId,
                model.ItemCategoryId,
                model.WorkflowId,
                model.StageId,
                model.ActionId,
                CreateUserId = model.HeaderCreateUserId,
                model.ItemTypeId,
                AttributeId = model.AttributeIdList != "" ? model.AttributeIdList : null,
                UnitId = model.UnitIds,
                SubUnitId = model.SubUnitIds,
                model.FromDocumentDate,
                model.ToDocumentDate,
                model.FromDocumentDate1,
                model.ToDocumentDate1,
                model.WarehouseId,
                model.ZoneId,
                model.BinId,
                ItemId = model.ItemIds,
                Type = model.ReportType,
                AmountOrQuantity = model.ColumnType,
                RoleId = roleId,
                model.CompanyId
            }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }
}