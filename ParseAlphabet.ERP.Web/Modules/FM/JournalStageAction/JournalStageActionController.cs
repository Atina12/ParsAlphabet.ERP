using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.JournalStageAction;

namespace ParseAlphabet.ERP.Web.Modules.FM.JournalStageAction;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class JournalStageActionApiController : ControllerBase
{
    private readonly JournalStageActionRepository _journalStageActionRepository;

    public JournalStageActionApiController(JournalStageActionRepository journalStageActionRepository)
    {
        _journalStageActionRepository = journalStageActionRepository;
    }

    [HttpGet]
    [Route("list/{stageId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetList(short stageId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _journalStageActionRepository.GetActionListByStageId(stageId, companyId);
    }
}