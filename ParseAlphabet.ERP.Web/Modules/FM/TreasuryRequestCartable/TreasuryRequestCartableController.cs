using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FM.NewTreasury;
using ParsAlphabet.ERP.Application.Interfaces.FM.TreasuryRequestCartable;

namespace ParseAlphabet.ERP.Web.Modules.FM.TreasuryRequestCartable;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class TreasuryRequestCartableApiController : ControllerBase
{
    private readonly ITreasuryRequestCartableRepository _treasuryRequestCartableRepository;

    public TreasuryRequestCartableApiController(ITreasuryRequestCartableRepository treasuryRequestCartableRepository)
    {
        _treasuryRequestCartableRepository = treasuryRequestCartableRepository;
    }

    [HttpPost]
    [Route("getpagecartable")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<TreasuryCartableGetPage>>> GetPageTreasuryCartable(
        [FromBody] NewGetPageViewModel model)
    {
        if (model.Form_KeyValue[2]?.ToString() == "my")
            model.Form_KeyValue[3] = User.FindFirstValue("UserId");
        else
            model.Form_KeyValue[3] = 0;
        model.CompanyId = UserClaims.GetCompanyId();

        var userId = UserClaims.GetUserId();
        ;
        var roleId = UserClaims.GetRoleId();
        ;

        return await _treasuryRequestCartableRepository.TreasuryRequestCartableSectionGetPage(model, userId, roleId);
    }

    [HttpGet]
    [Route("treasuryrequestgroupsection/{stageClassId}/{byUser}")]
    [Authenticate(Operation.VIW, "")]
    public async Task<List<MyDropDownViewModel>> PostingGroupCartableSection(int stageClassId, string byUser)
    {
        var companyId = UserClaims.GetCompanyId();

        int? userId = null;

        if (byUser == "my")
            userId = UserClaims.GetUserId();
        ;

        var roleId = UserClaims.GetRoleId();
        ;


        return await _treasuryRequestCartableRepository.TreasuryRequestCartableSection(stageClassId, companyId, userId,
            roleId);
    }
}

[Route("FM")]
[Authorize]
public class TreasuryRequestCartableController : Controller
{
    [Route("[controller]/{stageId?}")]
    [HttpGet]
    [Authenticate(Operation.VIW, "")]
    public ActionResult Index(short? stageId)
    {
        return View(Views.FM.TreasuryRequestCartable.Index);
    }
}