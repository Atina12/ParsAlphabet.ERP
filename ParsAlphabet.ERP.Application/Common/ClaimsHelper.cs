using Microsoft.AspNetCore.Http;

namespace ParsAlphabet.ERP.Application.Common;

public static class UserClaims
{
    private static IHttpContextAccessor _httpContextAccessor;

    public static void SetHttpContextAccessor(IHttpContextAccessor accessor)
    {
        _httpContextAccessor = accessor;
    }

    public static int GetUserId()
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst("UserId");
        if (userIdClaim != null && int.TryParse(userIdClaim.Value, out var userId))
            return userId;

        throw new Exception("UserId Can not be null");
    }

    public static byte GetRoleId()
    {
        var roleIdClaim = _httpContextAccessor.HttpContext?.User.FindFirst("RoleId");
        if (roleIdClaim != null && byte.TryParse(roleIdClaim.Value, out var roleId))
            return roleId;

        throw new Exception("RoleId Can not be null");
    }

    public static int GetCompanyId()
    {
        var httpContext = _httpContextAccessor.HttpContext;
        var companyIdClaim = httpContext?.User.FindFirst("CompanyId");
        if (companyIdClaim != null && int.TryParse(companyIdClaim.Value, out var companyId))
            return companyId;

        throw new Exception("CompanyId Can not be null");
    }
}