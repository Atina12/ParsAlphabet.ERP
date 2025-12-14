using System.Data;
using Dapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.GN.RoleBranchPermission;

namespace ParsAlphabet.ERP.Infrastructure.Implantation.GN.RoleBranchPermission;

public class RoleBranchPermissionRepository :
    BaseRepository<RoleBranchPermissionModel, int, string>,
    IBaseRepository<RoleBranchPermissionModel, int, string>
{
    public RoleBranchPermissionRepository(IConfiguration config)
        : base(config)
    {
    }


    public async Task<MyResultStatus> Save(RoleBranchPermissionModel model)
    {
        var result = new MyResultStatus();

        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_RoleBranchPermission_InsDel]";
            conn.Open();
            result = await conn.QueryFirstOrDefaultAsync<MyResultStatus>(sQuery, new
            {
                model.RoleId,
                BranchPermissionJson = JsonConvert.SerializeObject(model.BranchPermissionList),
                model.CreateUserId,
                model.CreateDateTime
            }, commandType: CommandType.StoredProcedure);
            conn.Close();
        }

        result.Successfull = result.Status == 100;


        return result;
    }


    public async Task<object> RoleBranchPermissionetList(byte RoleId)
    {
        using (var conn = Connection)
        {
            var sQuery = "[gn].[Spc_RoleBranchPermission_GetList]";
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