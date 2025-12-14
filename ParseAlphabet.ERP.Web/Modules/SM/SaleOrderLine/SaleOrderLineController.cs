using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.SM.SaleOrderLine;
using ParsAlphabet.ERP.Application.Interfaces.SM.SaleOrderLine;

namespace ParseAlphabet.ERP.Web.Modules.SM.SaleOrderLine;

[Route("api/SM/[controller]")]
[ApiController]
[Authorize]
public class SaleOrderLineApiController(ISaleOrderLineRepository saleOrderLineRepository) : ControllerBase
{
    [HttpPost]
    [Route("display")]
    [Authenticate(Operation.VIW, "SaleOrder")]
    public async Task<MyResultPage<SaleOrderLineGetpage>> Display([FromBody] GetPageViewModel model)
    {
        return await saleOrderLineRepository.Display(model);
    }

    [HttpPost]
    [Route("getsaleorderlinepage")]
    [Authenticate(Operation.VIW, "SaleOrder")]
    public async Task<MyResultStageStepConfigPage<List<SaleOrderLines>>> GetSaleOrderLinePage(
        [FromBody] NewGetPageViewModel model)
    {
        return await saleOrderLineRepository.GetSaleOrderLinePage(model);
    }

    [HttpPost]
    [Route("getrecordbyids")]
    [Authenticate(Operation.VIW, "SaleOrder")]
    public async Task<MyResultPage<SaleOrderLineGetRecord>> GetRecordByIds([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await saleOrderLineRepository.GetRecordByIds(id, companyId);
    }

    [HttpPost]
    [Route("insertOrderLine")]
    [Authenticate(Operation.INS, "SaleOrder")]
    public async Task<MyResultStatus> InsertOrderLine([FromBody] SaleOrderLineModel model)
    {
        if (ModelState.IsValid)
        {
            model.CreateUserId = UserClaims.GetUserId();
            ;
            model.CurrencyId = model.CurrencyId == 0
                ? byte.Parse(User.FindFirstValue("DefaultCurrencyId"))
                : model.CurrencyId;
            var companyId = UserClaims.GetCompanyId();
            return await saleOrderLineRepository.Insert(model, companyId);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("updateorderLine")]
    [Authenticate(Operation.UPD, "SaleOrder")]
    public async Task<MyResultStatus> UpdateOrderLine([FromBody] SaleOrderLineModel model)
    {
        if (ModelState.IsValid)
        {
            var companyId = UserClaims.GetCompanyId();
            model.CurrencyId = model.CurrencyId == 0
                ? byte.Parse(User.FindFirstValue("DefaultCurrencyId"))
                : model.CurrencyId;
            model.CreateUserId = UserClaims.GetUserId();
            ;
            return await saleOrderLineRepository.Update(model, companyId);
        }

        return ModelState.ToMyResultStatus<int>();
    }


    [HttpPost]
    [Route("deleteOrderLine")]
    [Authenticate(Operation.DEL, "SaleOrder")]
    public async Task<MyResultStatus> DeleteOrderLine([FromBody] SaleOrderLineModel model)
    {
        var companyId = UserClaims.GetCompanyId();
        return await saleOrderLineRepository.DeleteOrderLine(model, companyId);
    }


    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "SaleOrder")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        return await saleOrderLineRepository.Csv(model);
    }


    [HttpPost]
    [Route("getheader")]
    [Authenticate(Operation.VIW, "SaleOrder")]
    public async Task<MyResultPage<SaleOrderLineGetpage>> GetHeader([FromBody] GetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await saleOrderLineRepository.GetHeader(model);
    }

    [HttpGet]
    [Route("getsaleorderLineQuantity/{id}")]
    public async Task<bool> GetOrderLineCount(int id)
    {
        return await saleOrderLineRepository.GetOrderLineCount(id);
    }
}

[Route("SM")]
[Authorize]
public class SaleOrderLineController : Controller
{
    [Route("[controller]/{id}/{isDefaultCurrency}")]
    [Authenticate(Operation.VIW, "SaleOrder")]
    [HttpGet]
    public ActionResult Index(int id, int isDefaultCurrency)
    {
        return PartialView(Views.SM.SaleOrderLine);
    }

    [Route("[controller]/display/{id}/{isDefaultCurrency}/{stageId}")]
    [Authenticate(Operation.VIW, "SaleOrder")]
    [HttpGet]
    public ActionResult Display(int id, int isDefaultCurrency, short stageId)
    {
        return PartialView(Views.SM.SaleOrderDisplay);
    }
}