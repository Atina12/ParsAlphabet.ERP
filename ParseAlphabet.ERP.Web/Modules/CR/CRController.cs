using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Interfaces.CR;

namespace ParseAlphabet.ERP.Web.Modules.CR;

[Route("api/[controller]")]
[ApiController]
public class CRApiController : ControllerBase
{
    private readonly ICRRepository _CRRepository;

    public CRApiController(ICRRepository CRRepository)
    {
        _CRRepository = CRRepository;
    }

    [HttpGet]
    [Route("personGroupType_GetDropDown")]
    public async Task<List<MyDropDownViewModel>> PersonGroupType_GetDropDown()
    {
        return await _CRRepository.PersonGroupType_GetDropDown();
    }

    [HttpGet]
    [Route("personGroup_GetDropDown/{personTypeId}")]
    public async Task<List<MyDropDownViewModel>> PersonGroup_GetDropDown(byte personTypeId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _CRRepository.PersonGroup_GetDropDown(personTypeId, companyId);
    }
}