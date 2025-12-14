using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.SM.ShipmentMethod;
using ParsAlphabet.ERP.Infrastructure.Implantation.SM.ShipmentMethod;

namespace ParseAlphabet.ERP.Web.Modules.SM.ShipmentMethod;

[Route("api/SM/[controller]")]
[ApiController]
[Authorize]
public class ShipmentMethodApiController(
    ShipmentMethodRepository ShipmentMethodRepository,
    IHttpContextAccessor accessor)
    : ControllerBase
{
    private readonly IHttpContextAccessor _accessor = accessor;

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<ShipmentMethodGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        return await ShipmentMethodRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<ShipmentMethodGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        var result = new MyResultPage<ShipmentMethodGetRecord>
        {
            Data = await ShipmentMethodRepository.GetRecordById<ShipmentMethodGetRecord>(keyvalue, false, "sm")
        };
        return result;
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return ShipmentMethodRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] ShipmentMethodModel model)
    {
        if (ModelState.IsValid)
        {
            model.TableName = "sm.ShipmentMethod";
            model.IsSecondLang = MyClaim.IsSecondLang;
            model.CompanyId = UserClaims.GetCompanyId();
            return await ShipmentMethodRepository.Insert(model, "pb", true);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] ShipmentMethodModel model)
    {
        if (ModelState.IsValid)
        {
            model.TableName = "sm.ShipmentMethod";
            model.IsSecondLang = MyClaim.IsSecondLang;
            model.CompanyId = UserClaims.GetCompanyId();
            return await ShipmentMethodRepository.Update(model, "pb", true);
        }

        return ModelState.ToMyResultQuery<int>();
    }


    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await ShipmentMethodRepository.Delete(keyvalue, "sm", CompanyId);
    }

    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    [HttpGet]
    public async Task<ActionResult> Csv(string stringedModel)
    {
        var model = JsonConvert.DeserializeObject<NewGetPageViewModel>(stringedModel);
        model.CompanyId = UserClaims.GetCompanyId();
        var resultCsv = await ShipmentMethodRepository.CSV(model);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "روش حمل.csv" };
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown()
    {
        return await ShipmentMethodRepository.GetDropDown("sm");
    }
}

[Route("SM")]
[Authorize]
public class ShipmentMethodController : Controller
{
    [Route("[controller]")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.SM.ShipmentMethod);
    }
}