using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ParsAlphabet.ERP.Application.Common;

public class CheckRequestAttribute : ActionFilterAttribute
{
    //

    public override void OnActionExecuting(ActionExecutingContext context)
    {
        if (!IsAjax.CheckAjax(context.HttpContext)) context.Result = new RedirectResult("/Invalid");
    }
}