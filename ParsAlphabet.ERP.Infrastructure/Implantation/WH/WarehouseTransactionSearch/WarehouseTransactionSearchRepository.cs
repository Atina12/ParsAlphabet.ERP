using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.WH.WarehouseTransaction;
using ParsAlphabet.ERP.Application.Dtos.WH.WarehouseTransactionSearch;
using ParsAlphabet.ERP.Application.Interfaces.GN.Company;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.Currency;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WH.WarehouseTransactionSearch;

public class WarehouseTransactionSearchRepository :
    BaseRepository<WarehouseTransactionModel, int, string>,
    IBaseRepository<WarehouseTransactionModel, int, string>
{
    private readonly ICompanyRepository _companyRepository;
    private readonly CurrencyRepository _currencyRepository;
    private readonly IMapper _mapper;

    public WarehouseTransactionSearchRepository(IConfiguration config, ICompanyRepository companyRepository,
        CurrencyRepository currencyRepository, IMapper mapper) : base(config)
    {
        _companyRepository = companyRepository;
        _currencyRepository = currencyRepository;
        _mapper = mapper;
    }

    public new GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            SumDynamic = false,
            RunButtonIndex = "stageId,warehouseId,zoneId,binId",
            ActionType = "inline",
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "stage", Title = "مرحله", Type = (int)SqlDbType.NVarChar, Size = 10, IsDtParameter = true,
                    Width = 15, IsPrimary = true
                },
                new()
                {
                    Id = "warehouse", Title = "انبار", Type = (int)SqlDbType.NVarChar, Size = 10, IsDtParameter = true,
                    Width = 15, IsPrimary = true
                },
                new()
                {
                    Id = "zone", Title = "بخش", Type = (int)SqlDbType.NVarChar, Size = 10, IsDtParameter = true,
                    Width = 15, IsPrimary = true
                },
                new()
                {
                    Id = "bin", Title = "پالت", Type = (int)SqlDbType.NVarChar, Size = 10, IsDtParameter = true,
                    Width = 15, IsPrimary = true
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 20 },
                new() { Id = "stageId", IsPrimary = true },
                new() { Id = "warehouseId", IsPrimary = true },
                new() { Id = "zoneId", IsPrimary = true },
                new() { Id = "binId", IsPrimary = true }
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
                    Id = "headerId", Title = "شناسه سربرگ", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = false, Width = 10
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ برگه", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = false, Width = 10
                },
                new()
                {
                    Id = "stage", Title = "نام مرحله", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsFilterParameter = false, Width = 15
                },
                new()
                {
                    Id = "unit", Title = "واحد اندازه گیری", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = false, Width = 10
                },
                new() { Id = "ratio", Title = "ضریب", Type = (int)SqlDbType.NVarChar, IsDtParameter = true, Width = 5 },
                new()
                {
                    Id = "quantityDebit", Title = "تعداد وارده", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "quantityCredit", Title = "تعداد صادره", Type = (int)SqlDbType.NVarChar, IsDtParameter = true,
                    Width = 10
                },
                new()
                {
                    Id = "actionIdName", Title = "گام", Type = (int)SqlDbType.VarChar, Size = 20, IsDtParameter = true,
                    Width = 10
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 20 },
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
                    Name = "displayWarehouse", Title = "نمایش", ClassName = "btn green_outline_1 waves-effect",
                    IconName = "far fa-file-excel"
                }
            }
        };
        return list;
    }

    public async Task<MyResultPage<List<GetWarehouseTransactionQuickSearch>>> GetWarehouseTransactionQuickSearch(
        WarehouseTransactionQuickSearch model, int roleId)
    {
        var result = new MyResultPage<List<GetWarehouseTransactionQuickSearch>>
        {
            Data = new List<GetWarehouseTransactionQuickSearch>()
        };
        DateTime? FromDate = null, ToDate = null;
        FromDate = model.FromDatePersian.ToMiladiDateTime();
        ToDate = model.ToDatePersian.ToMiladiDateTime();

        var parameters = new DynamicParameters();
        parameters.Add("pageNo", model.PageNo);
        parameters.Add("pageRowsCount", model.PageRowsCount);
        parameters.Add("FromDate", FromDate == null ? null : FromDate);
        parameters.Add("ToDate", ToDate == null ? null : ToDate);
        parameters.Add("ItemTypeId", model.ItemTypeId == null ? null : model.ItemTypeId);
        parameters.Add("WarehouseId", model.WarehouseId == null ? null : model.WarehouseId);
        parameters.Add("ZoneId", model.ZoneId == null ? null : model.ZoneId);
        parameters.Add("BinId", model.BinId == null ? null : model.BinId);
        parameters.Add("AttributeIds", model.AtrributeId == null ? null : model.AtrributeId);
        parameters.Add("RoleId", roleId);
        result.Columns = GetColumns();
        using (var conn = Connection)
        {
            var sQuery = "wh.Sps_WarehouseTransaction_QuickSearch";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<GetWarehouseTransactionQuickSearch>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
            conn.Close();
        }

        return result;
    }

    public async Task<MyResultPage<List<GetWarehouseTransactionQuickSearchType>>>
        GetWarehouseTransactionQuickSearchType(WarehouseTransactionQuickSearchtype model)
    {
        var result = new MyResultPage<List<GetWarehouseTransactionQuickSearchType>>
        {
            Data = new List<GetWarehouseTransactionQuickSearchType>()
        };

        result.Columns = GetColumnsQuickSearchType();
        using (var conn = Connection)
        {
            var sQuery = "wh.Sps_WarehouseTransaction_QuickSearchType";

            conn.Open();

            result.Data = (await conn.QueryAsync<GetWarehouseTransactionQuickSearchType>(sQuery, new
            {
                model.PageNo,
                model.PageRowsCount,
                model.StageId,
                model.WarehouseId,
                model.ZoneId,
                model.BinId
            }, commandType: CommandType.StoredProcedure)).ToList();

            conn.Close();
        }

        return result;
    }
}