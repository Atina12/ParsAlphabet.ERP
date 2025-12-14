using System.Collections;
using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.VendorItemPriceLine;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.VendorItemPriceLine;

public class VendorItemPriceLineRepository :
    BaseRepository<VendorItemPriceLineModel, int, string>,
    IBaseRepository<VendorItemPriceLineModel, int, string>
{
    public VendorItemPriceLineRepository(IConfiguration config) : base(config)
    {
    }

    public GetColumnsViewModel GetColumnsDiAssign()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "itemId", Title = "شناسه کالا", IsPrimary = true, IsFilterParameter = true,
                    Type = (int)SqlDbType.Int
                },
                new()
                {
                    Id = "item", Title = "کالا", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    Width = 27, IsFilterParameter = true
                },
                new()
                {
                    Id = "contractType", Title = "نوع قرارداد فعلی", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = true
                },
                new()
                {
                    Id = "vendor", Title = "تامین کننده فعلی", Type = (int)SqlDbType.Int, Size = 50,
                    IsDtParameter = true
                }
            }
        };

        return list;
    }

    public GetColumnsViewModel GetColumnsAssign()
    {
        var list = new GetColumnsViewModel
        {
            DataColumns = new List<DataColumnsViewModel>
            {
                new()
                {
                    Id = "vendorItemPriceId", Title = "شناسه", Type = (int)SqlDbType.Int, Width = 5, IsPrimary = true
                },
                new()
                {
                    Id = "itemId", Title = "شناسه کالا", IsPrimary = true, IsFilterParameter = true,
                    Type = (int)SqlDbType.Int
                },
                new()
                {
                    Id = "item", Title = "کالا", Type = (int)SqlDbType.NVarChar, Size = 100, IsDtParameter = true,
                    IsFilterParameter = true, Width = 18, IsPrimary = true
                },

                new()
                {
                    Id = "contractTypeId", Title = "نوع قرارداد", Type = (int)SqlDbType.NVarChar,
                    IsFilterParameter = true, FilterType = "select2",
                    FilterTypeApi = "/api/MC/VendorItemPriceLineApi/getdropdown_contracttype", Width = 7
                },

                new()
                {
                    Id = "contractType", Title = "نوع قرارداد", IsPrimary = true, Type = (int)SqlDbType.NVarChar,
                    Size = 50, IsDtParameter = true, Width = 18
                },
                new() { Id = "priceTypeId", Title = "مبنای محاسبه", IsPrimary = true },
                new()
                {
                    Id = "priceType", Title = "مبنای محاسبه", IsPrimary = true, Type = (int)SqlDbType.NVarChar,
                    Size = 50, IsDtParameter = true, Width = 18
                },
                new()
                {
                    Id = "commissionValue", Title = "کمیسیون", IsPrimary = true, Type = (int)SqlDbType.Decimal,
                    Size = 50, IsDtParameter = true, Width = 13
                },

                new()
                {
                    Id = "createUser", Title = " کاربر ثبت کننده", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 10
                },
                new()
                {
                    Id = "createDateTimePersian", Title = "تاریخ ثبت", Type = (int)SqlDbType.NVarChar, Size = 50,
                    IsDtParameter = true, Width = 8
                }
            }
        };

        return list;
    }


    public async Task<CSVViewModel<IEnumerable>> CsvAssign(NewGetPageViewModel model)
    {
        var column = new GetColumnsViewModel();
        column = GetColumnsAssign();
        var result = new CSVViewModel<IEnumerable>
        {
            Columns = string.Join(',',
                column.DataColumns.Where(x => x.IsDtParameter && x.Id != "action").Select(z => z.Title))
        };
        var getPage = await GetPageAssigns(model);
        result.Rows = from p in getPage.Data.Assigns
            select new
            {
                p.Item,
                p.ContractType,
                p.PriceType,
                p.CommissionValue,
                p.CreateUser,
                p.CreateDateTimePersian
            };

        return result;
    }

    public async Task<MyResultPage<VendorItemPriceDiAssignGetPage>> GetPageDiAssigns(NewGetPageViewModel model)
    {
        var result = new MyResultPage<VendorItemPriceDiAssignGetPage>
        {
            Data = new VendorItemPriceDiAssignGetPage()
        };

        var vendorId = Convert.ToInt32(model.Form_KeyValue[0]?.ToString());

        int? itemId = null;
        var p_itemName = "";
        switch (model.FieldItem)
        {
            case "item":
                p_itemName = model.FieldValue;
                break;
            case "itemId":
                itemId = Convert.ToInt32(model.FieldValue);
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("ItemId", itemId);
        parameters.Add("ItemName", p_itemName);
        parameters.Add("VendorId", vendorId);
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumnsDiAssign();
        var resultDiAssign = new List<VendorItemPriceDiAssignList>();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_VendorItemPrice_DiAssign]";
            conn.Open();
            resultDiAssign =
                (await conn.QueryAsync<VendorItemPriceDiAssignList>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).ToList();
        }

        result.Data.Assigns = resultDiAssign;
        return result;
    }

    public async Task<MyResultPage<VendorItemPriceAssignGetPage>> GetPageAssigns(NewGetPageViewModel model)
    {
        var result = new MyResultPage<VendorItemPriceAssignGetPage>
        {
            Data = new VendorItemPriceAssignGetPage()
        };

        var vendorId = Convert.ToInt32(model.Form_KeyValue[0]?.ToString());

        int?
            contractTypeId = null,
            itemId = null,
            priceTypeId = null;
        var p_itemName = "";
        switch (model.FieldItem)
        {
            case "contractTypeId":
                contractTypeId = Convert.ToInt32(model.FieldValue);
                break;
            case "priceTypeId":
                priceTypeId = Convert.ToInt32(model.FieldValue);
                break;
            case "item":
                p_itemName = model.FieldValue;
                break;
            case "itemId":
                itemId = Convert.ToInt32(model.FieldValue);
                break;
        }

        var parameters = new DynamicParameters();
        parameters.Add("PageNo", model.PageNo);
        parameters.Add("PageRowsCount", model.PageRowsCount);
        parameters.Add("ContractTypeId", contractTypeId);
        parameters.Add("VendorId", vendorId);
        parameters.Add("PriceTypeId", priceTypeId);
        parameters.Add("ItemId", itemId);
        parameters.Add("ItemName", p_itemName);
        parameters.Add("CompanyId", model.CompanyId);

        result.Columns = GetColumnsAssign();
        var resultAssign = new List<VendorItemPriceAssignList>();

        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_VendorItemPrice_Assign]";
            conn.Open();
            resultAssign =
                (await conn.QueryAsync<VendorItemPriceAssignList>(sQuery, parameters,
                    commandType: CommandType.StoredProcedure)).AsList();
        }

        result.Data.Assigns = resultAssign;
        return result;
    }

    public async Task<MyResultStatus> VendorItemPriceAssign(VendorItemPriceLineModel model)
    {
        if (model.Opr == "Ins")
        {
            var itemIds = model.Assign.Select(x => x.ItemId).AsList();

            var checkExistItem = await CheckExistVendorItem(itemIds);
            if (checkExistItem.ListHasRow())
            {
                var existItem = checkExistItem.Select(x => x.ItemId).AsList();

                return new MyResultStatus
                {
                    Successfull = false,
                    Status = -101,
                    StatusMessage = $"شناسه کالاهای {string.Join(',', existItem)} قبلا تخصیص داده شده"
                };
            }
        }


        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_VendorItemPrice_Save]";
            conn.Open();
            var result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.Opr,
                ItemIds = JsonConvert.SerializeObject(model.Assign),
                model.ContractTypeId,
                model.VendorId,
                model.PriceTypeId,
                model.CommisionValue,
                model.CompanyId,
                model.CreateUserId,
                model.CreateDateTime
            }, commandType: CommandType.StoredProcedure);

            conn.Close();

            result.Successfull = result.Status == 100;
            return result;
        }
    }

    public async Task<List<CheckExistVendorItemPrice>> CheckExistVendorItem(List<int> itemIds)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_CheckExist_VendorItemPrice]";
            conn.Open();
            var result = await conn.QueryAsync<CheckExistVendorItemPrice>(sQuery, new
            {
                ItemIds = string.Join(',', itemIds)
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result.AsList();
        }
    }


    public async Task<List<VendorItemList>> VendorItemGetList(int vendorId)
    {
        var sQuery = "[mc].[Spc_VendorItem_GetList]";
        using (var conn = Connection)
        {
            conn.Open();
            var result = await Connection.QueryAsync<VendorItemList>(sQuery,
                new
                {
                    VendorId = vendorId
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result.AsList();
        }
    }

    public async Task<MemoryStream> CSVVendorItemList(int vendorId)
    {
        var csvGenerator = new Csv();
        var csvStream = new MemoryStream();

        var Columns = "حق الزحمهتامین کننده,آیتم";
        var getPage = await VendorItemGetList(vendorId);

        var Rows = from p in getPage
            select new
            {
                CommissionVendor =
                    $"{p.ContractType} / مبنای حق الزحمه: {p.PriceTypeName} ({p.VendorCommissionValueName})",
                p.Item
            };

        return csvStream = await csvGenerator.GenerateCsv(Rows, Columns.Split(',').ToList());
    }


    public List<MyDropDownViewModel> GetDropDown_ContractType()
    {
        return new List<MyDropDownViewModel>
        {
            new() { Id = 2, Name = "امانی" },
            new() { Id = 3, Name = "کمیسیونی " }
        };
    }
}