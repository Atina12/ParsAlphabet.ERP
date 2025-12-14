using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.MedicalShiftTimeSheet;

namespace ParseAlphabet.ERP.Web.Modules.MC.MedicalShiftTimeSheet;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class MedicalShiftTimeSheetApiController : Controller
{
    private readonly MedicalShiftTimeSheetRepository _attenderShiftTimeSheetRepository;

    public MedicalShiftTimeSheetApiController(MedicalShiftTimeSheetRepository attenderShiftTimeSheetRepository)
    {
        _attenderShiftTimeSheetRepository = attenderShiftTimeSheetRepository;
    }

    //[HttpPost]
    //[Route("save")]
    //public async Task<List<SaveResultMedicalShiftTimeSheet>> Insert([FromBody] MedicalShiftTimeSheetModel model)
    //{
    //    model.CreateUserId = UserClaims.GetUserId();;

    //    var result =  await _attenderShiftTimeSheetRepository.Save(model);

    //    return result;
    //}


    [HttpPost]
    [Route("medicalshifttimesheetchangelock")]
    public async Task<MyResultStatus> ChangeLockMedicalShiftTimeSheet([FromBody] int id)
    {
        return await _attenderShiftTimeSheetRepository.ChangeLockMedicalShiftTimeSheet(id);
    }

    [HttpPost]
    [Route("getItem")]
    public async Task<bool> GetItem([FromBody] int id)
    {
        return await _attenderShiftTimeSheetRepository.GetItem(id);
    }
}