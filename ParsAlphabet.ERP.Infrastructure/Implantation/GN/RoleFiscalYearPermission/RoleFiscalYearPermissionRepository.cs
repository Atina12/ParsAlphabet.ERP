using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.GN.RoleFiscalYearPermission;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.GN.RoleFiscalYearPermission;

public class RoleFiscalYearPermissionRepository :
    BaseRepository<RoleFiscalYearPermissionModel, int, string>,
    IBaseRepository<RoleFiscalYearPermissionModel, int, string>
{
    public RoleFiscalYearPermissionRepository(IConfiguration config)
        : base(config)
    {
    }


    public async Task<MyResultStatus> Save(RoleFiscalYearPermissionModel model)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_RoleFiscalYearPermission_InsDel]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.RoleId,
                FiscalYearPermissionJson = JsonConvert.SerializeObject(model.FiscalYearPermissionList),
                model.CreateUserId,
                model.CreateDateTime
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;


        return result;
    }


    public async Task<object> RoleFiscalYearPermissionetList(byte RoleId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_RoleFiscalYearPermission_GetList]";
            conn.Open();

            var result = await conn.QueryAsync<object>(sQuery,
                new
                {
                    RoleId
                }, commandType: CommandType.StoredProcedure);

            return result.ToList();
        }
    }
}