using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.WH.Item;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.WH.Item_Warehouse;

public class Item_WarehouseRepository :
    BaseRepository<ItemModel, int, string>,
    IBaseRepository<ItemModel, int, string>
{
    private readonly IHttpContextAccessor _accessor;

    public Item_WarehouseRepository(IConfiguration config,
        IHttpContextAccessor accessor)
        : base(config)
    {
        _accessor = accessor;
    }

    public async Task<List<MyDropDownViewModel>> GetDropDown(int warehouseId, byte itemTypeId, int userId,
        int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "wh.Spc_ItemWarehouse_Dropdown";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    WarehouseId = warehouseId,
                    ItemTypeId = itemTypeId,
                    UserId = userId,
                    CompanyId = companyId
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }
}