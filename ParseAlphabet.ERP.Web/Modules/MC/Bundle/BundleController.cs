using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.Bundle;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Bundle;

namespace ParseAlphabet.ERP.Web.Modules.MC.Bundle;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class BundleApiController(BundleRepository bundleRepository) : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<BundelGetPage>>> GetPage([FromBody] NewGetPageViewModel pageViewModel)
    {
        return await bundleRepository.GetPage(pageViewModel);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<BundelGetRecord>> GetRecordById([FromBody] int id)
    {
        return await bundleRepository.GetRecordById(id);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> Insert([FromBody] BundleViewModel model)
    {
        if (ModelState.IsValid)
        {
            model.CreateUserId = UserClaims.GetUserId();
            ;
            return await bundleRepository.Insert(model);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultStatus> Delete([FromBody] int keyvalue)
    {
        return await bundleRepository.Delete(keyvalue);
    }


    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        return await bundleRepository.Csv(model);
    }
}

[Route("MC")]
[Authorize]
public class BundleController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.MC.Bundle);
    }
}