using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Interfaces.SM;

namespace ParseAlphabet.ERP.Web.Modules.SM;

[Route("api/[controller]")]
[ApiController]
public class SMApiController : ControllerBase
{
    private readonly ISMRepository _sMRepository;

    public SMApiController(ISMRepository sMRepository)
    {
        _sMRepository = sMRepository;
    }

    [HttpGet]
    [Route("commissionBasegetdropdown")]
    public async Task<List<MyDropDownViewModel>> CommissionBase_GetDropDown()
    {
        return await _sMRepository.CommissionBase_GetDropDown();
    }

    [HttpGet]
    [Route("personstagedropdown")]
    public async Task<List<MyDropDownViewModel>> StageList()
    {
        return await _sMRepository.PersonStageDropDown();
    }

    [HttpGet]
    [Route("commissionMethodgetdropdown")]
    public async Task<List<MyDropDownViewModel>> CommissionMethod_GetDropDown()
    {
        return await _sMRepository.CommissionMethod_GetDropDown();
    }

    [HttpGet]
    [Route("contracttypegetdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> ContractType_GetDropDown()
    {
        return await _sMRepository.ContractType_GetDropDown();
    }

    [HttpGet]
    [Route("pricetypegetdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> PriceType_GetDropDown()
    {
        return await _sMRepository.PriceType_GetDropDown();
    }
}