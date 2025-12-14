using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.HR.StandardTimeSheetHoliday;
using ParsAlphabet.ERP.Infrastructure.Implantation.HR.StandardTimeSheetHoliday;

namespace ParseAlphabet.ERP.Web.Modules.HR.StandardTimeSheetHoliday;

[Route("api/HR/[controller]")]
[ApiController]
[Authorize]
public class StandardTimeSheetHolidayApiController : ControllerBase
{
    private readonly StandardTimeSheetHolidayRepository _standardTimeSheetHolidayRepository;

    public StandardTimeSheetHolidayApiController(
        StandardTimeSheetHolidayRepository employeeStandardTimeSheetLineRepository)
    {
        _standardTimeSheetHolidayRepository = employeeStandardTimeSheetLineRepository;
    }

    [HttpGet]
    [Route("gettimesheetholidays/{standardTimeSheetId}/{monthId}")]
    [Authenticate(Operation.VIW, "StandardTimeSheet")]
    public async Task<List<StandardTimeSheetHolidayGetPage>> GetStandardWorkingHourLinePage(int standardTimeSheetId,
        string monthId)
    {
        return await _standardTimeSheetHolidayRepository.GetStandardTimeSheetHolidayPage(standardTimeSheetId, monthId);
    }

    [HttpPost]
    [Route("savestandardtimesheetholiday")]
    [Authenticate(Operation.INS, "StandardTimeSheet")]
    public async Task<MyResultStatus> InsertEmployeeStandardTimeSheetLine(
        [FromBody] StandardTimeSheetHolidayModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.CreateUserId = UserClaims.GetUserId();
        ;

        var resultSave = await _standardTimeSheetHolidayRepository.Save(model);

        if (model.Id == 0)
        {
            resultSave.CreateUserFullName = User.FindFirstValue("FullName");
            resultSave.UserId = UserClaims.GetUserId();
            ;
        }

        return resultSave;
    }
}