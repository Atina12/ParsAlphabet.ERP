using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WH.UnitCostCalculation;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.UnitCostCalculation;
using Enum = ParsAlphabet.ERP.Application.Enums.Enum;

namespace ParseAlphabet.ERP.Web.Modules.WH.UnitCostCalculation;

[Route("api/WH/[controller]")]
[ApiController]
[Authorize]
public class UnitCostCalculationApiController(UnitCostCalculationRepository UnitCostCalculationRepository)
    : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<UnitCostCalculationGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await UnitCostCalculationRepository.GetPage(model, roleId);
    }


    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<UnitCostCalculationGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        var result = new MyResultPage<UnitCostCalculationGetRecord>
        {
            Data = await UnitCostCalculationRepository.GetRecordById<UnitCostCalculationGetRecord>(keyvalue, false,
                "wh")
        };

        return result;
    }


    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> Insert([FromBody] UnitCostCalculationViewModel model)
    {
        if (ModelState.IsValid)
        {
            model.CreateUserId = Convert.ToInt32(User.FindFirstValue("UserId"));
            var roleId = UserClaims.GetRoleId();
            ;
            return await UnitCostCalculationRepository.Insert(model, Enum.OperationType.Insert, roleId);
        }

        return ModelState.ToMyResultStatus<int>();
    }


    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultStatus> Update([FromBody] UnitCostCalculationViewModel model)
    {
        if (ModelState.IsValid)
        {
            model.CreateUserId = Convert.ToInt32(User.FindFirstValue("UserId"));
            var roleId = UserClaims.GetRoleId();
            ;
            return await UnitCostCalculationRepository.Insert(model, Enum.OperationType.Update, roleId);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("getUnitCostCalculationCountByfiscalYearId")]
    public async Task<int> ExistUnitCostCalculationByfiscalYearId([FromBody] int fiscalYearId)
    {
        return await UnitCostCalculationRepository.ExistUnitCostCalculationByfiscalYearId(fiscalYearId);
    }


    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var roleId = UserClaims.GetRoleId();
        ;
        return await UnitCostCalculationRepository.Csv(model, roleId);
    }
}

[Route("WH")]
[Authorize]
public class UnitCostCalculation : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.WH.UnitCostCalculation);
    }
}