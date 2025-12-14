using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using ParsAlphabet.ERP.Application.Dtos._Login;
using ParsAlphabet.ERP.Application.Interfaces._Login;

namespace ParseAlphabet.ERP.Web.Utility.Filter;

public class AuthenticateAttribute : TypeFilterAttribute
{
    public AuthenticateAttribute(string opration, string controllerName) : base(typeof(AuthorizeFilter))
    {
        Arguments = new object[] { opration, controllerName };
    }
}

public class AuthorizeFilter : IAuthorizationFilter
{
    private readonly ILoginRepository _LoginRepository;
    private readonly string _opration;
    private string _controllerName;

    public AuthorizeFilter(string operation, string controllerName, ILoginRepository LoginRepository)
    {
        _opration = operation;
        _controllerName = controllerName;
        _LoginRepository = LoginRepository;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        if (_opration == "")
        {
            context.Result = new UnauthorizedResult();
        }
        else
        {
            if (context.HttpContext.User.FindFirstValue("UserId") == null)
            {
                //var msg= new HttpResponseMessage(HttpStatusCode.Unauthorized) { ReasonPhrase = "Oops!!!" };
                context.Result = new ChallengeResult(CookieAuthenticationDefaults.AuthenticationScheme);
            }
            else
            {
                if (_opration != "PUB")
                {
                    var userId = short.Parse(context.HttpContext.User.FindFirstValue("UserId"));

                    if (_controllerName == "")
                        _controllerName = context.RouteData.Values["controller"].ToString();


                    var checkAuthenticate = new CheckAuthenticateViewModel
                        { UserId = userId, ControllerName = _controllerName, OprType = _opration };
                    var access = _LoginRepository.GetAuthenticate(checkAuthenticate).Result;

                    if (!access.Successfull)
                        context.Result = new ForbidResult();
                }
            }
        }
    }
}