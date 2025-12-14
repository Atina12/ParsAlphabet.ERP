using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Interfaces.FA;

namespace ParseAlphabet.ERP.Web.Modules.FA;

[Route("api/[controller]")]
[ApiController]
public class FAApiController : ControllerBase
{
    private readonly IFARepository _FARepository;

    public FAApiController(IFARepository FARepository)
    {
        _FARepository = FARepository;
    }

    [HttpGet]
    [Route("classIdgetdropdown")]
    public async Task<List<MyDropDownViewModel>> ClassId_GetDropDown()
    {
        return await _FARepository.ClassId_GetDropDown();
    }
    //[HttpGet]
    //[Route("subclassidgetdropdown/{fixedAssetClassId}")]
    //public async Task<List<MyDropDownViewModel>> SubClassId_GetDropDown(short fixedAssetClassId)
    //{
    //    return await _FARepository.SubClassId_GetDropDown(fixedAssetClassId);
    //}

    [HttpGet]
    [Route("depreciationMethodgetdropdown")]
    public async Task<List<MyDropDownViewModel>> CommissionMethod_GetDropDown()
    {
        return await _FARepository.DepreciationMethod_GetDropDown();
    }
}