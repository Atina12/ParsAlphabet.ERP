using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FM.Journal;
using ParsAlphabet.ERP.Application.Dtos.FM.JournalAction;
using ParsAlphabet.ERP.Infrastructure.Implantation.FM.BankAccount;

namespace ParseAlphabet.ERP.Web.Modules.FM.JournalAction;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class JournalActionApiController : ControllerBase
{
    private readonly JournalActionRepository _journalActionRepository;

    public JournalActionApiController(JournalActionRepository journalActionRepository)
    {
        _journalActionRepository = journalActionRepository;
    }

    [HttpPost]
    [Route("getjournalaction")]
    public async Task<JournalActionModel> GetJournalAction(GetJournalAction model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _journalActionRepository.GetJournalAction(model);
    }

    [HttpPost]
    [Route("GetJournalStageActionByJournal")]
    public async Task<JournalActionLogicModel> GetJournalActionByJournal([FromBody] int journalId)
    {
        return await _journalActionRepository.GetJournalActionByJournal(journalId);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<List<MyDropDownViewModel>> GetDropDown()
    {
        return await _journalActionRepository.GetDropDown();
    }
}