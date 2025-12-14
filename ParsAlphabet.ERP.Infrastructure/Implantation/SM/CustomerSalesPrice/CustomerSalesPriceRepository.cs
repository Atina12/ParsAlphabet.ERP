using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.SM.CustomerSalesPrice;
using ParsAlphabet.ERP.Infrastructure.Implantation.FA.FixedAsset;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.Item;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.SM.CustomerSalesPrice;

public class CustomerSalesPriceRepository :
    BaseRepository<CustomerSalesPriceModel, int, string>,
    IBaseRepository<CustomerSalesPriceModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;

    private readonly FixedAssetRepository _fixedAssetRepository;
    private readonly ItemRepository _itemRepository;

    public CustomerSalesPriceRepository(IConfiguration config, ItemRepository itemRepository,
        IHttpContextAccessor accessor, FixedAssetRepository fixedAssetRepository)
        : base(config)
    {
        _itemRepository = itemRepository;
        _fixedAssetRepository = fixedAssetRepository;
        _accessor = accessor;
    }

    public new GetColumnsViewModel GetColumns()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, FilterType = "number", Width = 4
                },
                new() { Id = "itemTypeId", Title = "نوع آیتم", Type = (int)SqlDbType.SmallInt, Width = 4 },
                new()
                {
                    Id = "itemType", Title = "نوع آیتم", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 6
                },
                new()
                {
                    Id = "itemId", Title = "کد آیتم", Type = (int)SqlDbType.SmallInt, IsFilterParameter = true,
                    FilterType = "select2", FilterTypeApi = "/api/WH/ItemApi/getalldatadropdown", Width = 4
                },
                new()
                {
                    Id = "item", Title = "نام آیتم", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 15
                },
                new()
                {
                    Id = "category", Title = "دسته بندی", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "currency", Title = "نام ارز", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    Width = 3
                },
                new()
                {
                    Id = "pricingModelId", Title = "مدل قیمت گذاری", Type = (int)SqlDbType.SmallInt,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/GNapi/pricingmodlgetdropdown", Width = 4
                },
                new()
                {
                    Id = "pricingModel", Title = "مدل قیمت گذاری", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsFilterParameter = false, Width = 5
                },
                new()
                {
                    Id = "minPrice", Title = "حداقل نرخ فروش ", Type = (int)SqlDbType.Decimal, IsDtParameter = true,
                    Width = 7, IsCommaSep = true
                },
                new()
                {
                    Id = "maxPrice", Title = "حداکثر نرخ فروش ", Type = (int)SqlDbType.Decimal, IsDtParameter = true,
                    Width = 7, IsCommaSep = true
                },
                new()
                {
                    Id = "contractTypeName", Title = "نوع قرارداد", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 5
                },
                new()
                {
                    Id = "contractTypeId", Title = "نوع قرارداد", IsPrimary = true, Type = (int)SqlDbType.NVarChar,
                    Size = 50, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/SMApi/contracttypegetdropdown"
                },
                new()
                {
                    Id = "priceTypeName", Title = "مبنای محاسبه", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 4
                },
                new()
                {
                    Id = "comissionPrice", Title = "نرخ حق الزحمه", Type = (int)SqlDbType.Money, IsDtParameter = true,
                    Width = 4, IsCommaSep = true
                },
                new()
                {
                    Id = "vendorId", Title = "تامین کننده", Type = (int)SqlDbType.SmallInt, IsFilterParameter = true,
                    FilterType = "select2", FilterTypeApi = "/api/PU/VendorApi/getalldatadropdown", Width = 4
                },
                new()
                {
                    Id = "vendor", Title = "تامین کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "allowInvoiceDisc", Title = "مجوز تخفیف در فاکتور", Type = (int)SqlDbType.Bit,
                    IsDtParameter = true, Align = "center", Width = 7
                },
                new()
                {
                    Id = "priceIncludingVAT", Title = "قیمت مصرف کننده", Type = (int)SqlDbType.Bit,
                    IsDtParameter = true, Width = 6, Align = "center"
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 3,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 5 }
            },
            Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "getrecord", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "deleterecord", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" }
            }
        };

        return list;
    }

    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model)
    {
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                GetColumns().DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };
        var getPage = await GetPage(model);
        result.Rows = from p in getPage.Data
            select new
            {
                p.Id,
                p.ItemType,
                p.Item,
                p.Category,
                p.Currency,
                p.PricingModel,
                p.MinPrice,
                p.MaxPrice,
                p.ContractTypeName,
                p.PriceTypeName,
                p.ComissionPrice,
                p.Vendor,
                AllowInvoiceDisc = p.AllowInvoiceDisc ? "دارد" : "ندارد",
                PriceIncludingVAT = p.PriceIncludingVAT ? "دارد" : "ندارد",
                IsActive = p.IsActive ? "فعال" : "غیرفعال"
            };
        return result;
    }

    public async Task<MyResultPage<List<CustomerSalesPriceGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<CustomerSalesPriceGetPage>>
        {
            Data = new List<CustomerSalesPriceGetPage>()
        };

        int? p_contractTypeId = null, p_itemId = null, p_vendorId = null, p_pricingModelId = null, p_id = null;

        switch (model.FieldItem)
        {
            case "id":
                p_id = Convert.ToInt32(model.FieldValue);
                break;
            case "itemId":
                p_itemId = Convert.ToInt32(model.FieldValue);
                break;
            case "pricingModelId":
                p_pricingModelId = Convert.ToInt32(model.FieldValue);
                break;
            case "contractTypeId":
                p_contractTypeId = Convert.ToInt32(model.FieldValue);
                break;
            case "vendorId":
                p_vendorId = Convert.ToInt32(model.FieldValue);
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id", p_id);
        parameters.Add("ItemId", p_itemId);
        parameters.Add("ContractTypeId", p_contractTypeId);
        parameters.Add("VendorId", p_vendorId);
        parameters.Add("PricingModelId", p_pricingModelId);
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumns();

        using (var conn = Connection)
        {
            var sQuery = "sm.Spc_CustomerSalesPrice_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<CustomerSalesPriceGetPage>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        return result;
    }

    public async Task<MyResultPage<CustomerSalesPriceGetRecord>> GetRecordById(int id, int companyId)
    {
        var result = new MyResultPage<CustomerSalesPriceGetRecord>
        {
            Data = new CustomerSalesPriceGetRecord()
        };
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetRecord";
            result.Data = await conn.QueryFirstOrDefaultAsync<CustomerSalesPriceGetRecord>(sQuery, new
            {
                TableName = "sm.CustomerSalesPrice",
                Filter = $"Id={id} AND CompanyId={companyId}"
            }, commandType: CommandType.StoredProcedure);
        }

        if (result.Data != null)
        {
            result.Data.ItemName = await _itemRepository.GetItemName(result.Data.ItemId, companyId);
            result.Data.CustomerSalesPriceDetail = await CustomerSalesPriceDetailList(id);
        }

        return result;
    }

    public async Task<MyResultQuery> Save(CustomerSalesPriceModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "[sm].[Spc_CustomerSalesPrice_InsUpd]";
            conn.Open();
            MyClaim.Init(_accessor);
            result = await conn.QueryFirstOrDefaultAsync<MyResultQuery>(sQuery, new
            {
                model.Opr,
                model.Id,
                model.ItemTypeId,
                model.ItemId,
                model.CurrencyId,
                model.PricingModelId,
                model.MinPrice,
                model.MaxPrice,
                model.AllowInvoiceDisc,
                model.PriceIncludingVAT,
                model.IsActive,
                model.CompanyId,
                model.ContractTypeId,
                model.PriceTypeId,
                model.ComissionPrice,
                model.VendorId,
                CustomerSalesPriceDetail = JsonConvert.SerializeObject(model.CustomerSalesPriceDetail)
            }, commandType: CommandType.StoredProcedure);
        }

        result.Successfull = result.Status == 100;
        return result;
    }

    public async Task<List<MyDropDownViewModel>> ItemSaleList(byte type, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_ItemSale_GetList]";
            conn.Open();
            MyClaim.Init(_accessor);

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    CompanyId = companyId,
                    Type = type
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<ID>> CustomerSalesPriceDetailList(int headerId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();
            MyClaim.Init(_accessor);

            var result = (await conn.QueryAsync<ID>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    TableName = "sm.CustomerSalesPriceDetail",
                    IdColumnName = "HeaderId",
                    ColumnNameList = "CustomerGroupId AS Id",
                    IdList = "",
                    Filter = $"HeaderId = ${headerId}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<bool> ExistItemId(GetCustomerSalesPriceItemId model)
    {
        var filter = "";

        if (model.CurrencyId == 0)
            filter = $"ItemId={model.ItemId} AND ItemTypeId={model.ItemTypeId} AND CompanyId={model.CompanyId}";
        else
            filter =
                $"ItemId={model.ItemId} AND ItemTypeId={model.ItemTypeId} AND ( CurrencyId<>{model.CurrencyId}) AND CompanyId={model.CompanyId}";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "sm.CustomerSalesPrice",
                    ColumnName = "ItemId",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);

            return result == null ? true : false;
        }
    }

    public async Task<int> GetId(int itemId, byte itemTypeId, int companyId)
    {
        var filter = $"ItemId={itemId} AND ItemTypeId={itemTypeId} AND CompanyId={companyId}";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "sm.CustomerSalesPrice",
                    ColumnName = "Id",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> GetCustomerGroupBySalesPriceId(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_CustomerGroup_GetList_BySalesPrice]";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    Id = id,
                    CompanyId = companyId
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<byte> GetPricingModelId(int itemId, byte itemTypeId, int companyId)
    {
        var filter = $"ItemId={itemId} AND ItemTypeId={itemTypeId} AND CompanyId={companyId}";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<byte>(sQuery,
                new
                {
                    TableName = "sm.CustomerSalesPrice",
                    ColumnName = "PricingModelId",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);

            return result;
        }
    }
}