using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WH.UnitCostCalculationLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.UnitCostCalculationLine;

namespace ParseAlphabet.ERP.Web.Modules.WH.UnitCostCalculationLine;

[Route("api/WH/[controller]")]
[ApiController]
[Authorize]
public class UnitCostCalculationLineApiController(UnitCostCalculationLineRepository unitCostCalculationLineRepository)
    : ControllerBase
{
    [HttpPost]
    [Route("display")]
    [Authenticate(Operation.VIW, "UnitCostCalculation")]
    public async Task<MyResultPage<List<UnitCostCalculationLineList>>> Display(
        [FromBody] UnitCostCalculationDirectPagingViewModel model)
    {
        var roleId = UserClaims.GetRoleId();
        ;
        return await unitCostCalculationLineRepository.Display(model, roleId);
    }

    [HttpPost]
    [Route("getlist")]
    public async Task<MyResultPage<List<UnitCostCalculationLineList>>> Getlist([FromBody] int id)
    {
        var roleId = UserClaims.GetRoleId();
        ;
        return await unitCostCalculationLineRepository.Getlist(id, roleId);
    }


    [HttpPost]
    [Route("getlinedetailpage")]
    [Authenticate(Operation.VIW, "UnitCostCalculation")]
    public async Task<MyResultPage<List<UnitCostCalculationLinegetpage>>> GetLineDetailPage(
        [FromBody] UnitCostCalculationLineViewModel model)
    {
        return await unitCostCalculationLineRepository.GetLineDetailPage(model);
    }


    [HttpPost]
    [Route("getaction")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetActionListByUnitCostCalculationLineId([FromBody] int id)
    {
        var roleId = UserClaims.GetRoleId();
        ;
        return await unitCostCalculationLineRepository.GetActionListByUnitCostCalculationLineId(id, roleId);
    }


    [HttpPost]
    [Route("updatestep")]
    public async Task<UnitCostCalculationLineDetailResultStatus> UpdateStep([FromBody] UpdateUnitCalculationStep model)
    {
        model.UserId = UserClaims.GetUserId();
        ;
        model.CompanyId = UserClaims.GetCompanyId();

        return await unitCostCalculationLineRepository.UpdateStep(model);
    }

    [HttpPost]
    [Route("validateupdatestep")]
    public async Task<UnitCostCalculationValidateResultStatus> ValidateUpdateStep(
        [FromBody] UpdateUnitCalculationStep model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await unitCostCalculationLineRepository.ValidateUpdateStep(model);
    }

    [HttpPost]
    [Route("getlastcostOfitem")]
    public async Task<MyResultPage<List<UnitCostCalculationNotLastConfirmHeaderViewModel>>>
        GetUnitCostCalculationGetLastCostOfItem([FromBody] LastconfirmheadeViewModel model)
    {
        return await unitCostCalculationLineRepository.GetUnitCostCalculationGetLastCostOfItem(model);
    }

    [HttpPost]
    [Route("updatepurchasedprice")]
    public async Task<UnitCostCalculationLineDetailResultStatus> UnitCostCalculationUpdatePurchasedPrice(
        [FromBody] UnitCostCalculationUpdatePurchasedPrice model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.UserId = UserClaims.GetUserId();
        ;
        return await unitCostCalculationLineRepository.UnitCostCalculationUpdatePurchasedPrice(model);
    }


    [HttpPost]
    [Route("updatelineprice")]
    public async Task<UnitCostCalculationLineDetailResultStatus> UnitCostCalculationUpdateLinePrice(
        [FromBody] UnitCostCalculationUpdatePurchasedPrice model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.UserId = UserClaims.GetUserId();
        ;
        return await unitCostCalculationLineRepository.UnitCostCalculationUpdateLinePrice(model);
    }

    [HttpPost]
    [Route("getunitcostcalculationlinedetailinfo")]
    public async Task<MyResultPage<List<UnitCostCalculationLineDetailInfo>>> GetUnitCostCalculationLineDetailInfo(
        [FromBody] UnitCostCalculationLineDetailViewModel model)
    {
        return await unitCostCalculationLineRepository.GetUnitCostCalculationLineDetailInfo(model);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "UnitCostCalculation")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] UnitCostCalculationLineViewModel model)
    {
        return await unitCostCalculationLineRepository.Csv(model);
    }

    [HttpPost]
    [Route("csvunitcostupdatestep")]
    [Authenticate(Operation.PRN, "UnitCostCalculation")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsvUnitCostUpdateStep([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = Convert.ToInt32(User.FindFirstValue("CompanyId"));
        return await unitCostCalculationLineRepository.ExportCsvUnitCostUpdateStep(model);
    }
}

[Route("WH")]
[Authorize]
public class UnitCostCalculationLineController : Controller
{
    [Route("[controller]/{id}/{fiscalyear}/{costingMethodId}")]
    [Authenticate(Operation.VIW, "UnitCostCalculation")]
    [HttpGet]
    public ActionResult Index(int id, string fiscalyear, byte costingMethodId)
    {
        return PartialView(Views.WH.UnitCostCalculationLine);
    }
}