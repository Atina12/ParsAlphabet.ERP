using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.HR.StandardTimeSheetPerMonth;
using ParsAlphabet.ERP.Infrastructure.Implantation.HR.StandardTimeSheetPerMonth;

namespace ParseAlphabet.ERP.Web.Modules.HR.StandardTimeSheetPerMonth;

[Route("api/HR/[controller]")]
[ApiController]
[Authorize]
public class StandardTimeSheetPerMonthApiController : ControllerBase
{
    private readonly StandardTimeSheetPerMonthRepository _standardTimeSheetPerMonthRepository;

    public StandardTimeSheetPerMonthApiController(
        StandardTimeSheetPerMonthRepository standardTimeSheetPerMonthRepository)
    {
        _standardTimeSheetPerMonthRepository = standardTimeSheetPerMonthRepository;
    }


    [HttpPost]
    [Route("savestandardtimesheetpermonth")]
    [Authenticate(Operation.INS, "StandardTimeSheet")]
    public async Task<MyResultStatus> InsertStandardTimeSheetPerMonth([FromBody] StandardTimeSheetPerMonthModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.CreateUserId = UserClaims.GetUserId();
        ;

        var resultSave = await _standardTimeSheetPerMonthRepository.Save(model);
        resultSave.CreateUserFullName = User.FindFirstValue("FullName");

        return resultSave;
    }

    [HttpGet]
    [Route("getstandardtimesheetpermonth/{id}/{monthId?}")]
    [Authenticate(Operation.VIW, "StandardTimeSheet")]
    public async Task<List<StandardTimeSheetPerMonthGetRecord>> StandardTimeSheetPerMonthGetRecord(int id,
        byte? monthId = null)
    {
        return await _standardTimeSheetPerMonthRepository.GetStandardTimeSheetPerMonth(id, monthId);
    }
}