using System.Collections;
using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.WH.Item;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WH.Item;

public class ItemRepository :
    BaseRepository<ItemModel, int, string>,
    IBaseRepository<ItemModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;

    public ItemRepository(IConfiguration config, IHttpContextAccessor accessor)
        : base(config)
    {
        _accessor = accessor;
    }

    public GetColumnsViewModel GetColumns(string formType)
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "id", Title = "شناسه", Type = (int)SqlDbType.Int, IsDtParameter = true,
                    IsFilterParameter = true, Width = 4, FilterType = "number", IsPrimary = true
                },
                new()
                {
                    Id = "itemType", Title = "نوع", Type = (int)SqlDbType.TinyInt, IsDtParameter = formType == "",
                    IsPrimary = true, Width = 5, IsFilterParameter = formType == "", FilterType = "select2",
                    FilterTypeApi = "/api/WHApi/itemtypedropdown"
                },
                new()
                {
                    Id = "name", Title = "نام ", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    IsPrimary = true, IsFilterParameter = true, Width = 10
                },
                new()
                {
                    Id = "unit", Title = "واحد شمارش", Type = (int)SqlDbType.NVarChar, Size = 50, IsDtParameter = true,
                    IsPrimary = true, Width = 4
                },
                new()
                {
                    Id = "category", Title = "دسته بندی ", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, IsPrimary = true, IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/WH/ItemCategoryApi/getalldatadropdownbytype/0", Width = 8
                },
                new()
                {
                    Id = "exclusiveSupplier", Title = "تامین کننده انحصاری", Type = (int)SqlDbType.Bit,
                    IsDtParameter = true, Width = 3, Align = "center"
                },
                new()
                {
                    Id = "vatPercent", Title = "مالیات بر ارزش افزوده فروش", Type = (int)SqlDbType.Decimal,
                    IsDtParameter = true, Width = 3, Align = "center"
                },
                new()
                {
                    Id = "barcodeMandatory", Title = "الزام بارکد", Type = (int)SqlDbType.Bit, IsDtParameter = true,
                    Width = 4, Align = "center"
                },
                new()
                {
                    Id = "priceIncludingVat", Title = "قیمت مصرف کننده", Type = (int)SqlDbType.Bit,
                    IsDtParameter = formType == "", Width = 3, Align = "center"
                },
                new()
                {
                    Id = "subscriptionDate", Title = "تاریخ اشتراک", Type = (int)SqlDbType.VarChar,
                    IsDtParameter = formType == "", Width = 7, Align = "center"
                },
                //  new DataColumnsViewModel { Id = "subscriptionToDateTimePersian", Title = "تاریخ پایان اشتراک", Type = (int)SqlDbType.VarChar, IsDtParameter = formType == "",Width=4,Align="center"},
                new()
                {
                    Id = "unlimited", Title = "اشتراک نامحدود", Type = (int)SqlDbType.Bit,
                    IsDtParameter = formType == "", Width = 4, Align = "center"
                },
                new()
                {
                    Id = "payrollTax", Title = "کسور مالیات تکلیفی", Type = (int)SqlDbType.NVarChar,
                    IsDtParameter = formType == "", Width = 8, Align = "center"
                },
                new()
                {
                    Id = "isActive", Title = "وضعیت", Type = (int)SqlDbType.Bit, IsDtParameter = true, Width = 3,
                    Align = "center"
                },
                new() { Id = "action", Title = "عملیات", Type = (int)SqlDbType.Int, IsDtParameter = true, Width = 8 },

                new() { Id = "unitId", IsPrimary = true },
                new() { Id = "categoryId", IsPrimary = true },
                new() { Id = "itemTypeId", IsPrimary = true }
            }
        };


        if (formType == "")
            list.Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "edit", Title = "ویرایش", ClassName = "", IconName = "fa fa-edit color-green" },
                new() { Name = "delete", Title = "حذف", ClassName = "", IconName = "fa fa-trash color-maroon" }
            };
        else if (formType == "itempricing")
            list.Buttons = new List<GetActionColumnViewModel>
            {
                new() { Name = "basicPricing", Title = "تعرفه پایه", IconName = "fa fa-umbrella" },
                new() { Name = "compPricing", Title = "تعرفه تکمیلی", IconName = "fa fa-umbrella-plus" },
                new() { Name = "thirdpartyPricing", Title = "تعرفه طرف قرارداد", IconName = "fa fa-users-cog" },
                new() { Name = "discountPricing", Title = "تعرفه تخفیف", IconName = "fa fa-percent" }
            };


        return list;
    }


    public async Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model)
    {
        var formType = model.Form_KeyValue[0]?.ToString();

        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                GetColumns(formType).DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };
        var getPage = await GetPage(model);


        if (formType == "")
        {
            result.Rows = from p in getPage.Data
                select new
                {
                    p.Id,
                    p.ItemType,
                    p.Name,
                    p.Unit,
                    p.Category,
                    ExclusiveSupplier = p.ExclusiveSupplier ? "دارد" : "ندارد",
                    p.VatPercent,
                    BarcoedeMandatory = p.BarcodeMandatory ? "دارد" : "ندارد",
                    PriceIncludingVat = p.PriceIncludingVat ? "دارد" : "ندارد",
                    p.SubscriptionDate,
                    Unlimited = p.Unlimited ? "بلی" : "خیر",
                    //p.PayrollTax,                                 
                    IsActive = p.IsActive ? "فعال" : "غیرفعال"
                };
            return result;
        }

        {
            result.Rows = from p in getPage.Data
                select new
                {
                    p.Id,
                    p.Name,
                    p.Unit,
                    p.Category,
                    BarcoedeMandatory = p.BarcodeMandatory ? "دارد" : "ندارد",
                    IsActive = p.IsActive ? "فعال" : "غیرفعال",
                    ExclusiveSupplier = p.ExclusiveSupplier ? "دارد" : "ندارد"
                };
            return result;
        }
    }

    public async Task<MemoryStream> CSV(NewGetPageViewModel model)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var formType = model.Form_KeyValue[0]?.ToString();

        var Columns = string.Join(',',
            GetColumns(formType).DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title));
        var getPage = await GetPage(model);

        if (formType == "")
        {
            var rows = from p in getPage.Data
                select new
                {
                    p.Id,
                    p.ItemType,
                    p.Name,
                    p.Unit,
                    p.Category,
                    ExclusiveSupplier = p.ExclusiveSupplier ? "دارد" : "ندارد",
                    p.VatPercent,
                    BarcoedeMandatory = p.BarcodeMandatory ? "دارد" : "ندارد",
                    PriceIncludingVat = p.PriceIncludingVat ? "دارد" : "ندارد",
                    p.SubscriptionDate,
                    Unlimited = p.Unlimited ? "بلی" : "خیر",
                    p.PayrollTax,
                    IsActive = p.IsActive ? "فعال" : "غیرفعال"
                };

            return csvStream = await csvGenerator.GenerateCsv(rows, Columns.Split(',').ToList());
        }

        {
            var rows1 = from p in getPage.Data
                select new
                {
                    p.Id,
                    p.Name,
                    p.Unit,
                    p.Category,
                    ExclusiveSupplier = p.ExclusiveSupplier ? "دارد" : "ندارد",
                    p.VatPercent,
                    BarcoedeMandatory = p.BarcodeMandatory ? "دارد" : "ندارد",
                    IsActive = p.IsActive ? "فعال" : "غیرفعال"
                };

            return csvStream = await csvGenerator.GenerateCsv(rows1, Columns.Split(',').ToList());
        }
    }

    public async Task<MyResultPage<List<ItemGetPage>>> GetPage(NewGetPageViewModel model)
    {
        var result = new MyResultPage<List<ItemGetPage>>
        {
            Data = new List<ItemGetPage>()
        };

        var formType = model.Form_KeyValue[0]?.ToString();

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("Id",
            model.Filters.Any(x => x.Name == "id") ? model.Filters.FirstOrDefault(x => x.Name == "id").Value : null);
        parameters.Add("Name",
            model.Filters.Any(x => x.Name == "name")
                ? model.Filters.FirstOrDefault(x => x.Name == "name").Value
                : null);
        parameters.Add("ItemTypeId",
            model.Filters.Any(x => x.Name == "itemType")
                ? model.Filters.FirstOrDefault(x => x.Name == "itemType").Value
                : null);
        parameters.Add("CategoryId",
            model.Filters.Any(x => x.Name == "category")
                ? model.Filters.FirstOrDefault(x => x.Name == "category").Value
                : null);

        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumns(formType);

        using (var conn = Connection)
        {
            var sQuery = "wh.Spc_Item_GetPage";
            conn.Open();
            result.Data =
                (await conn.QueryAsync<ItemGetPage>(sQuery, parameters, commandType: CommandType.StoredProcedure))
                .ToList();
        }

        return result;
    }

    public async Task<MyResultPage<ItemGetRecord>> GetRecordByIds(int id, int companyId)
    {
        var result = new MyResultPage<ItemGetRecord>
        {
            Data = new ItemGetRecord()
        };

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_Item_GetRecord]";
            result.Data = await conn.QueryFirstOrDefaultAsync<ItemGetRecord>(sQuery, new
            {
                Id = id,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(string term, int companyId)
    {
        var filter = string.Empty;

        if (term.Trim().Length != 0)
            filter =
                $" CompanyId={companyId} AND Id='{(int.TryParse(term, out _) ? term : "0")}' OR Name Like N'%{term}%' AND IsActive = 1";
        else
            filter = "IsActive = 1";
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "wh.Item",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }


    public async Task<List<MyDropDownViewModel>> GetDropDownWhitItemTypeId(int itemTypeId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "wh.Item",
                    Filter = $" ItemTypeId={itemTypeId} AND CompanyId={companyId} AND IsActive=1"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetDropDownItemWhitItemTypeId(string term, int itemTypeId,
        int companyId)
    {
        var filter = string.Empty;


        filter +=
            $"ItemTypeId={itemTypeId}  AND CompanyId={companyId} AND ( Id='{(int.TryParse(term, out _) ? term : "0")}' OR Name Like N'%{term}%' ) ";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "wh.Item",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetDropDownWithCategoryId(string categoryid, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "wh.Item",
                    Filter = $"  CategoryId in ({categoryid}) AND CompanyId={companyId} AND IsActive=1"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> GetAllDataDropDown(string term, int companyId)
    {
        var filter = string.Empty;

        if (term.Trim().Length != 0)
            filter =
                $" CompanyId={companyId} AND Id='{(int.TryParse(term, out _) ? term : "0")}' OR Name Like N'%{term}%'";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "wh.Item",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> ItemSaleGetDropDown(int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_CustomerSalePriceItem_GetList]";
            conn.Open();

            MyClaim.Init(_accessor);

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    CompanyId = companyId
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<string> GetItemName(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "wh.Item",
                    ColumnName = "Name",
                    Filter = $"Id={id} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<int> GetItemCategoryId(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<int>(sQuery,
                new
                {
                    TableName = "wh.Item",
                    ColumnName = "CategoryId",
                    Filter = $"Id={id} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<byte> GetItemType(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<byte>(sQuery,
                new
                {
                    TableName = "wh.Item",
                    ColumnName = "ItemTypeId",
                    Filter = $"Id={id} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<MyResultPage<ItemVatInfo>> GetItemVat(int id, int itemTypeId, int companyId)
    {
        var result = new MyResultPage<ItemVatInfo>();

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_Item_VatInfo]";
            conn.Open();
            result.Data = await conn.QueryFirstOrDefaultAsync<ItemVatInfo>(sQuery, new
            {
                Id = id,
                ItemTypeId = itemTypeId,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);
        }

        return result;
    }


    public async Task<MyResultStatus> InsertItem(ItemViewModel model)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "[wh].[Spc_Item_InsUpd]";
            conn.Open();

            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                Opr = model.Id == 0 ? "Ins" : "Upd",
                model.Id,
                model.ItemTypeId,
                model.Name,
                model.CategoryId,
                model.UnitId,
                model.VATEnable,
                model.VATId,
                model.PriceIncludingVat,
                model.BarcodeMandatory,
                model.IsActive,
                model.CompanyId,
                model.SubscriptionFromDate,
                model.SubscriptionToDate,
                model.Unlimited,
                ItemUnitList = model.ItemUnitDetail.ListHasRow()
                    ? JsonConvert.SerializeObject(model.ItemUnitDetail)
                    : null,
                model.PayrollTaxId,
                model.ExclusiveSupplier
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = result.Status == 100 ? true : false;
        }

        return result;
    }

    public async Task<ItemInfo> GetCategory(int id, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetTable";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<ItemInfo>(sQuery,
                new
                {
                    IsSecondLang = false,
                    TableName = "wh.Item",
                    IdColumnName = "Id",
                    ColumnNameList =
                        "UnitId,CategoryId,(SELECT Name FROM wh.ItemCategory where Id=CategoryId) CategoryName",
                    IdList = "",
                    OrderBy = "",
                    Filter = $"Id={id} and CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }
}