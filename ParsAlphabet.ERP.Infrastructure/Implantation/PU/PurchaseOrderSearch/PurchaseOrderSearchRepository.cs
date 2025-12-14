using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseOrder;
using ParsAlphabet.ERP.Application.Dtos.PU.PurchaseOrderSearch;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.PU.PurchaseOrderSearch;

public class PurchaseOrderSearchRepository :
    BaseRepository<PurchaseOrderModel, int, string>,
    IBaseRepository<PurchaseOrderModel, int, string>
{
    public PurchaseOrderSearchRepository(IConfiguration config) : base(config)
    {
    }

    public new GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            SumDynamic = false,
            RunButtonIndex = "id",
            ActionType = "inline",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", IsPrimary = true, Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    Width = 5
                },
                new()
                {
                    Id = "purchaseOrderId", IsPrimary = true, Title = "شناسه سربرگ", Type = (int)SqlDbType.Int,
                    IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "itemType", Title = "نوع آیتم", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "amount", Title = "مبلغ", Type = (int)SqlDbType.Money, Size = 10, HasSumValue = false,
                    IsCommaSep = true, IsDtParameter = true, Width = 15
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت ", Type = (int)SqlDbType.NVarChar, Size = 10,
                    IsCommaSep = true, IsDtParameter = true, Width = 10
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 55 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "selection", Title = "انتخاب", ClassName = "btn blue_outline_1", IconName = "fas fa-check"
                }
            }
        };
        return list;
    }

    public GetColumnsViewModel GetColumnsQuickSearchType()
    {
        var list = new GetColumnsViewModel
        {
            RunButtonIndex = "headerId,requestId,stageId,stageClassId,workflowId",
            ActionType = "inline",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "stageName", Title = "نام مرحله", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = false, Width = 12
                },
                new()
                {
                    Id = "requestId", Title = "شناسه مرجع", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = false, Width = 6
                },
                new()
                {
                    Id = "accountGL", Title = "کل", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "accountSGL", Title = "معین", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "noseries", Title = "گروه تفضیل ", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 6
                },
                new()
                {
                    Id = "accountDetail", Title = "تفصیل", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 6
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.VarChar, Size = 20,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "createUser", Title = "کاربر ثبت کننده", Type = (int)SqlDbType.VarChar, Size = 20,
                    IsDtParameter = true, Width = 9
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 45 },
                new() { Id = "id", IsPrimary = true },
                new() { Id = "headerId", IsPrimary = true },
                new() { Id = "stageId", IsPrimary = true },
                new() { Id = "stageClassId", IsPrimary = true },
                new() { Id = "workflowId", IsPrimary = true }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new()
                {
                    Name = "displayPurchase", Title = "نمایش", ClassName = "btn green_outline_1 waves-effect",
                    IconName = "far fa-file-excel"
                }
            }
        };
        return list;
    }

    public async Task<MyResultPage<List<GetPurchaseOrderQuickSearch>>> GetPurchaseOrderQuickSearch(
        PurchaseOrderQuickSearch model, int roleId)
    {
        var result = new MyResultPage<List<GetPurchaseOrderQuickSearch>>
        {
            Data = new List<GetPurchaseOrderQuickSearch>()
        };
        DateTime? FromDate = null, ToDate = null;
        FromDate = model.FromDatePersian.ToMiladiDateTime();
        ToDate = model.ToDatePersian.ToMiladiDateTime();

        var parameters = new DynamicParameters();
        parameters.Add("pageNo", model.PageNo);
        parameters.Add("pageRowsCount", model.PageRowsCount);
        parameters.Add("FromDate", FromDate == null ? null : FromDate);
        parameters.Add("Todate", ToDate == null ? null : ToDate);
        parameters.Add("ItemTypeId", model.ItemTypeId == null ? null : model.ItemTypeId);
        parameters.Add("FromAmount", model.FromPrice == null ? null : model.FromPrice);
        parameters.Add("ToAmount", model.ToPrice == null ? null : model.ToPrice);
        parameters.Add("RoleId", roleId);

        result.Columns = GetColumns();
        using (var conn = Connection)
        {
            var sQuery = "pu.Sps_PurchaseOrder_QuickSearch";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<GetPurchaseOrderQuickSearch>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultPage<List<GetPurchaseOrderQuickSearchType>>> GetPurchaseOrderQuickSearchType(
        PurchaseOrderQuickSearchtype model)
    {
        var result = new MyResultPage<List<GetPurchaseOrderQuickSearchType>>
        {
            Data = new List<GetPurchaseOrderQuickSearchType>()
        };

        result.Columns = GetColumnsQuickSearchType();
        using (var conn = Connection)
        {
            var sQuery = "pu.Sps_PurchaseOrder_QuickSearchType";
            conn.Open();
            result.Data = (await conn.QueryAsync<GetPurchaseOrderQuickSearchType>(sQuery, new
            {
                model.PageNo,
                model.PageRowsCount,
                model.Id
            }, commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }
}