using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.Cashier;

namespace ParseAlphabet.ERP.Web.Utility.Filter;

public class CashStandAuthenticateAttribute : TypeFilterAttribute
{
    public CashStandAuthenticateAttribute() : base(typeof(CashStandAuthenticateFilter))
    {
    }
}

public class CashStandAuthenticateFilter : ActionFilterAttribute, IActionFilter
{
    private readonly IHttpContextAccessor _accessor;
    private readonly CashierRepository _cashierRepository;

    public CashStandAuthenticateFilter(CashierRepository cashierRepository, IHttpContextAccessor accessor)
    {
        _cashierRepository = cashierRepository;
        _accessor = accessor;
    }

    public override void OnActionExecuting(ActionExecutingContext filterContext)
    {
        var modelState = filterContext.ModelState;

        foreach (var modelValue in modelState.Values) modelValue.Errors.Clear();

        MyClaim.Init(_accessor);
        var ip = MyClaim.IpAddress;
        var cashierId = _cashierRepository.GetCashierIdByIp(ip);

        if (cashierId == 0) filterContext.Result = new RedirectResult("/AdmissionCashStand/BadRequest");
    }
}