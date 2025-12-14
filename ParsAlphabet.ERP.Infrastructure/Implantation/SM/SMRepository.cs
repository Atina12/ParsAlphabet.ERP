using System.Data;
using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Interfaces.SM;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.SM;

public class SMRepository : ISMRepository
{
    private readonly IHttpContextAccessor _accessor;
    private readonly IConfiguration _config;

    public SMRepository(IConfiguration config,
        IHttpContextAccessor accessor)
    {
        _config = config;
        _accessor = accessor;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public async Task<List<MyDropDownViewModel>> CommissionBase_GetDropDown()
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
                    TableName = "sm.CommissionBase"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> PersonStageDropDown()
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = (await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    TableName = "wf.Stage",
                    IdColumnName = "Id",
                    TitleColumnName = "Name",
                    Filter =
                        "IsActive=1 AND (NameEng LIKE '%Purchase Invoice%' OR NameEng LIKE '%Sales Invoice%' OR NameEng LIKE '%Purchase Return Invoice%' OR NameEng LIKE '%Sales Return Invoice%')"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<List<MyDropDownViewModel>> CommissionMethod_GetDropDown()
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
                    TableName = "sm.CommissionMethod"
                }, commandType: CommandType.StoredProcedure)).ToList();
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> ContractType_GetDropDown()
    {
        using (var conn = Connection)
        {
            MyClaim.Init(_accessor);
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    TableName = "sm.CustomerContractType"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }

    public async Task<IEnumerable<MyDropDownViewModel>> PriceType_GetDropDown()
    {
        using (var conn = Connection)
        {
            MyClaim.Init(_accessor);
            var sQuery = "pb.Spc_Tables_GetList";
            conn.Open();

            var result = await conn.QueryAsync<MyDropDownViewModel>(sQuery,
                new
                {
                    MyClaim.IsSecondLang,
                    TableName = "gn.PriceType"
                }, commandType: CommandType.StoredProcedure);
            return result;
        }
    }
}