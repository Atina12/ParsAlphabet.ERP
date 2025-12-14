using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos.MC.ManageParaclinicTamin;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.MC.ManageParaclinicTamin;

public class ManageTaminTokenRepository :
    BaseRepository<TaminTokenViewModel, int, string>,
    IBaseRepository<TaminTokenViewModel, int, string>
{
    public ManageTaminTokenRepository(IConfiguration config) : base(config)
    {
    }

    public async Task Save(TaminTokenViewModel model)
    {
        var result = new MyResultQuery();
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_TaminToken_Ins]";
            conn.Open();
            await conn.ExecuteAsync(sQuery, new
            {
                model.TokenId,
                model.TokenType,
                model.TokenDateTime,
                model.CompanyId,
                model.ParaClinicTypeId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            result.Successfull = result.Status == 100;
        }
    }

    public async Task<string> GetToken(int companyId, byte tokenType)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_GetItem";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery, new
            {
                TableName = "mc.TaminToken",
                ColumnName = "TokenId",
                Filter = $"CompanyId={companyId} AND TokenType={tokenType}",
                OrderBy = "TokenDateTime DESC"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<string> GetTokenByParaClinicType(int companyId, string paraClinicTypeId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[mc].[Spc_TaminToken_Get]";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery, new
            {
                ParaClinicTypeId = paraClinicTypeId,
                CompanyId = companyId
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }

    public async Task<string> DeleteToken(byte tokenType, int companyId, string paraClinicTypeCode)
    {
        using (var conn = Connection)
        {
            var sQuery = "pb.Spc_Tables_DelRecordWithFilter";
            conn.Open();
            var result = await conn.ExecuteScalarAsync<string>(sQuery, new
            {
                TableName = "mc.TaminToken",
                Filter = $"TokenType={tokenType} AND CompanyId={companyId} AND ParaClinicTypeId={paraClinicTypeCode}"
            }, commandType: CommandType.StoredProcedure);
            conn.Close();

            return result;
        }
    }
}