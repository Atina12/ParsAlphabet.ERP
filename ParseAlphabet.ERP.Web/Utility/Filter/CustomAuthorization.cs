using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Primitives;

[AttributeUsage(AttributeTargets.Class)]
public class CustomAuthorization : Attribute, IAuthorizationFilter
{
    /// <summary>
    ///     This will Authorize User
    /// </summary>
    /// <returns></returns>
    public void OnAuthorization(AuthorizationFilterContext filterContext)
    {
        if (filterContext != null)
        {
            StringValues authTokens;
            filterContext.HttpContext.Request.Headers.TryGetValue("Authorization", out authTokens);

            var _token = authTokens.FirstOrDefault();

            if (_token != null)
            {
                var authToken = _token;
                if (authToken != null)
                {
                    if (IsValidToken(authToken))
                        return;
                    filterContext.Result = new JsonResult("NotAuthorized")
                    {
                        Value = new
                        {
                            Status = "Error",
                            Message = "Invalid Token"
                        }
                    };
                }
            }
            else
            {
                filterContext.Result = new JsonResult("Please Provide authToken")
                {
                    Value = new
                    {
                        Status = "Error",
                        Message = "Please Provide authToken"
                    }
                };
            }
        }
    }


    public bool IsValidToken(string authToken)
    {
        //validate Token here  
        return true;
    }
}