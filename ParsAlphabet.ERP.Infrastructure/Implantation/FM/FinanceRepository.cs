using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.FM;
using ParsAlphabet.ERP.Application.Interfaces.FM;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.FM;

public class FinanceRepository : IFinanceRepository
{
    private readonly IHttpContextAccessor _accessor;
    private readonly IConfiguration _config;

    public FinanceRepository(IConfiguration config, IHttpContextAccessor accessor)
    {
        _config = config;
        _accessor = accessor;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public async Task<IEnumerable<MyDropDownViewModel>> FundType_GetDropDown(string filterType)
    {
        var filter = string.Empty;

        switch (filterType)
        {
            case "adm":
                filter = " IsActiveAdm=1";
                break;
            case "Treasury":
                filter = " IsActiveTreasury=1";
                break;
            case "treasurysearch":
                filter = " Id NOT IN(1,9)";
                break;
        }

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fm.FundType",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> FundType_Adm_GetDropDown(bool isOpenAcc)
    {
        var filter = string.Empty;

        if (isOpenAcc)
            filter = "Id=1 OR Id=2";
        else
            filter = "Id=1 OR Id=2 OR Id=9";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fm.FundType",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> VatArea_GetDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fm.VatArea"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> IncomeBalanceType_GetDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fm.IncomeBalanceType"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> CostDriverType_GetDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fm.CostDriverType"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<byte> GetCostDriverTypeId(int driverId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<byte>(sQuery,
                new
                {
                    TableName = "fm.CostDriver",
                    ColumnName = "DriverTypeId",
                    Filter = $"Id={driverId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<byte> FundTypeInputMethod(int fundTypeId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<byte>(sQuery,
                new
                {
                    TableName = "fm.FundType",
                    ColumnName = "BankAccountInputMethod",
                    Filter = $"Id={fundTypeId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<byte> GetNoSeriesIdAccountDetail(int accountDetailId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<byte>(sQuery,
                new
                {
                    TableName = "fm.AccountDetail",
                    ColumnName = "NoSeriesId",
                    Filter = $"Id={accountDetailId} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public byte GetNoSeriesIdAccountDetailSync(int accountDetailId, int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[pb].[Spc_Tables_GetItem]";
            conn.Open();
            var result = conn.ExecuteScalar<byte>(sQuery,
                new
                {
                    TableName = "fm.AccountDetail",
                    ColumnName = "NoSeriesId",
                    Filter = $"Id={accountDetailId} AND CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<string> CostDriver_GetName(int id)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery,
                new
                {
                    TableName = "fm.CostDriver",
                    ColumnName = "Name",
                    Filter = $"Id={id}"
                }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> CostDriver_GetDropDown(byte driverTypeId)
    {
        var filter = string.Empty;

        if (driverTypeId != 0)
            filter = $"DriverTypeId={driverTypeId}";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fm.CostDriver",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> CostCategory_GetDropDown(int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fm.CostCategory",
                    Filter = $"CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> CostObject_GetDropDown(byte driverTypeId)
    {
        var filter = string.Empty;

        if (driverTypeId != 0)
            filter = $"DriverTypeId={driverTypeId}";


        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fm.CostObject",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> CostEntityType_GetDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fm.CostEntityType"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> BankAccountCategory_GetDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fm.BankAccountCategory"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> CostObject_GetDropDown(int entityTypeId = 0)
    {
        var filter = string.Empty;

        if (entityTypeId == 1)
            filter = "IsActiveEmployee=1";
        else if (entityTypeId == 2)
            filter = "IsActiveFixedAsset=1";
        else if (entityTypeId == 3)
            filter = "IsActiveAttender=1";

        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fm.CostObject",
                    Filter = filter
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> FundTypeAdm_GetDropDown(GetFundTypeAdm model)
    {
        using (var conn = Connection)
        {
            var sQuery = "mc.Spc_FundTypeAdm_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    model.SaleTypeId,
                    model.InOut
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> FundTypeAdmActive_GetDropDown()
    {
        using (var conn = Connection)
        {
            MyClaim.Init(_accessor);
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    TableName = "fm.FundType",
                    idColumnName = "Id",
                    TitleColumnName = "Name",
                    IdList = "",
                    Filter = "IsActiveAdm=1",
                    OrderBy = ""
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> AccountDetail_GetDropDown(int companyId)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fm.AccountDetail",
                    Filter = $"CompanyId={companyId}"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> CashFlowCategory_GetDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();
            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fm.CashFlowCategory"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> AccountNatureType_GetDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "fm.AccountNatureType"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }
}