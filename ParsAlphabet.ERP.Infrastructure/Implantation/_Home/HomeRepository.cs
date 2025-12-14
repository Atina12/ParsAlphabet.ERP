using System.Data;
using Microsoft.Extensions.Configuration;
using ParsAlphabet.ERP.Application.Dtos._Home;
using ParsAlphabet.ERP.Application.Interfaces._Home;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.Role;
using ParsAlphabet.ERP.Infrastructure.Implantation.PB;

namespace ParsAlphabet.ERP.Infrastructure.Implantation._Home;

public class HomeRepository : IHomeRepository
{
    private readonly IConfiguration _config;
    private readonly ManageRedisRepository _manageRedisRepository;

    private readonly RoleRepository _roleRepository;

    public HomeRepository(IConfiguration config, RoleRepository roleRepository,
        ManageRedisRepository manageRedisRepository)
    {
        _config = config;

        _roleRepository = roleRepository;
        _manageRedisRepository = manageRedisRepository;
    }

    public IDbConnection Connection => new SqlConnection(_config.GetConnectionString("DefaultConnection"));

    public async Task<List<Navigation>> GetNavigationByUserId(int userId, string language)
    {
        var cacheNavigation = new List<Navigation>();
        var roleId = await _roleRepository.GetRoleId(userId);

        return await _manageRedisRepository.Get_UpdateCacheNavigation(roleId);
    }
}