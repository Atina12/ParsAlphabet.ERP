using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FM.TreasuryBondDesign;
using ParsAlphabet.ERP.Application.Interfaces.FM.TreasuryBondDesign;

namespace ParseAlphabet.ERP.Web.Modules.FM.TreasuryBondDesign;

[Route("api/FM/[controller]")]
[ApiController]
[Authorize]
public class TreasuryBondDesignApiController : ControllerBase
{
    private readonly ITreasuryBondDesignRepository _treasuryBondDesignRepository;

    public TreasuryBondDesignApiController(ITreasuryBondDesignRepository treasuryReportRepository)
    {
        _treasuryBondDesignRepository = treasuryReportRepository;
    }

    [HttpGet]
    [Authenticate(Operation.VIW, "")]
    [Route("getrecordbybankid/{bankId}")]
    public async Task<MyResultDataQuery<TreasuryBondDesignModel>> GetRecordByBankId([FromRoute] int bankId)
    {
        return await _treasuryBondDesignRepository.GetTreasuryBondDesignByBankId(bankId);
    }

    [HttpPost]
    [Route("bankduplicate")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> BankDuplicate([FromBody] BankDuplicate model)
    {
        return await _treasuryBondDesignRepository.BankDuplicate(model);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> Insert([FromBody] TreasuryBondDesignModel model)
    {
        if (ModelState.IsValid)
            return await _treasuryBondDesignRepository.InsertTreasuryBondDesign(model);
        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultStatus> Update([FromBody] TreasuryBondDesignModel model)
    {
        if (ModelState.IsValid)
            return await _treasuryBondDesignRepository.UpdateTreasuryBondDesign(model);
        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("delete/{bankId}")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultStatus> Delete([FromRoute] int bankId)
    {
        return await _treasuryBondDesignRepository.DeleteTreasuryBondDesign(bankId);
    }
}

[Route("FM")]
[Authorize]
public class TreasuryBondDesignController : Controller
{
    [Route("[controller]")]
    [HttpGet]
    public IActionResult Index()
    {
        return PartialView(Views.FM.TreasuryBondDesign);
    }
}