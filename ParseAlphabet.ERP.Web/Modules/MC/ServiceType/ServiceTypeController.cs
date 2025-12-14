using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.ServiceType;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.ServiceType;

namespace ParseAlphabet.ERP.Web.Modules.MC.ServiceType;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class ServiceTypeApiController(ServiceTypeRepository ServiceTypeRepository) : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<ServiceTypeGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        return await ServiceTypeRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return ServiceTypeRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] ServiceTypeModel model)
    {
        if (ModelState.IsValid)
            return await ServiceTypeRepository.Insert(model, "mc");
        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] ServiceTypeModel model)
    {
        if (ModelState.IsValid)
            return await ServiceTypeRepository.Update(model, "mc");
        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<ServiceTypeGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        var result = new MyResultPage<ServiceTypeGetRecord>
        {
            Data = await ServiceTypeRepository.GetRecordById<ServiceTypeGetRecord>(keyvalue, false, "mc")
        };
        return result;
    }


    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        return await ServiceTypeRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown/{isActive?}")]
    public async Task<List<MyDropDownViewModel>> GetDropDown(byte? isActive = 1)
    {
        return await ServiceTypeRepository.GetDropDown(isActive);
    }
}

[Route("MC")]
[Authorize]
public class ServiceTypeController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.MC.ServiceType);
    }
}