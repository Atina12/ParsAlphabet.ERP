using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.GN.CentralToken;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.CentralToken;

namespace ParseAlphabet.ERP.Web.Modules.GN.CentralToken;

[Route("api/WH/[controller]")]
[ApiController]
[Authorize]
public class CentralTokenApiController : ControllerBase
{
    private readonly IHttpContextAccessor _accessor;
    private readonly CentralTokenRepository _centralTokenRepository;

    public CentralTokenApiController(CentralTokenRepository CentralTokenRepository,
        IHttpContextAccessor accessor)
    {
        _centralTokenRepository = CentralTokenRepository;
        _accessor = accessor;
    }


    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    //public async Task<MyResultPage<ItemBarcodeGetRecord>> GetRecordById([FromBody] int keyvalue)
    //{
    //    var comapnyId = UserClaims.GetCompanyId();
    //    return await _centralTokenRepository.GetRecordById(keyvalue);

    //}
    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] CentralTokenModel model)
    {
        if (ModelState.IsValid)
        {
            MyClaim.Init(_accessor);
            var result = new MyResultQuery();
            result.ValidationErrors = new List<string>();
            result = await _centralTokenRepository.Insert(model, "wh");
            return result;
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] CentralTokenModel model)
    {
        if (ModelState.IsValid)
        {
            MyClaim.Init(_accessor);
            var result = new MyResultQuery();
            result.ValidationErrors = new List<string>();
            result = await _centralTokenRepository.Update(model, "wh");
            return result;
        }

        return ModelState.ToMyResultQuery<int>();
    }
}

[Route("WH")]
[Authorize]
public class CentralTokenController : Controller
{
    [Route("[controller]")]
    //[Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.WH.ItemBarcode);
    }
}