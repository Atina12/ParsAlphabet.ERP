using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.SM.SaleOrder;
using ParsAlphabet.ERP.Application.Interfaces.SM.SaleOrder;

namespace ParseAlphabet.ERP.Web.Modules.SM.SaleOrder;

[Route("api/SM/[controller]")]
[ApiController]
[Authorize]
public class SaleOrderApiController(ISaleOrderRepository SaleRepository) : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "SaleOrder")]
    public async Task<MyResultPage<List<SaleOrderGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = Convert.ToInt32(User.FindFirstValue("CompanyId"));
        if (model.Form_KeyValue[0]?.ToString() == "myadm")
            model.Form_KeyValue[1] = User.FindFirstValue("UserId");

        return await SaleRepository.GetPage(model);
    }


    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "SaleOrder")]
    public async Task<MyResultPage<SaleOrderGetRecord>> GetRecordById([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await SaleRepository.GetRecordById(id, companyId);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "SaleOrder")]
    public async Task<MyResultQuery> Insert([FromBody] SaleOrderModel model)
    {
        if (ModelState.IsValid)
        {
            model.UserId = Convert.ToInt16(User.FindFirstValue("UserId"));
            model.CompanyId = Convert.ToInt32(User.FindFirstValue("CompanyId"));
            return await SaleRepository.Insert(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "SaleOrder")]
    public async Task<MyResultStatus> Update([FromBody] SaleOrderModel model)
    {
        if (ModelState.IsValid)
        {
            model.UserId = Convert.ToInt16(User.FindFirstValue("UserId"));
            model.CompanyId = Convert.ToInt32(User.FindFirstValue("CompanyId"));
            return await SaleRepository.Update(model);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "SaleOrder")]
    public async Task<MyResultStatus> Delete([FromBody] int keyvalue)
    {
        var companyId = UserClaims.GetCompanyId();
        return await SaleRepository.Delete(keyvalue, companyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "SaleOrder")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = Convert.ToInt32(User.FindFirstValue("CompanyId"));
        if (model.Form_KeyValue[0]?.ToString() == "myadm")
            model.Form_KeyValue[1] = User.FindFirstValue("UserId");

        return await SaleRepository.Csv(model);
    }


    [HttpPost]
    [Route("checkexist")]
    public async Task<bool> SaleOrderCheckExist([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await SaleRepository.CheckExist(id, companyId);
    }
}

[Route("SM")]
[Authorize]
public class SaleOrderController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "SaleOrder")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.SM.SaleOrder);
    }
}