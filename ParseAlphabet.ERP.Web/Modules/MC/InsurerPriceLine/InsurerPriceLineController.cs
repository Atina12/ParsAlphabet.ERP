using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.InsurerPriceLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.InsurerPriceLine;

namespace ParseAlphabet.ERP.Web.Modules.MC.InsurerPriceLine;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class InsurerPriceLineApiController(InsurerPriceLineRepository insurerPriceLineRepository) : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "InsurerPrice")]
    public async Task<MyResultPage<List<InsurerPriceLineGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await insurerPriceLineRepository.GetPage(model);
    }

    [HttpPost]
    [Route("insurerpricesendhistorygetpage")]
    [Authenticate(Operation.VIW, "InsurerPrice")]
    public async Task<MyResultPage<List<InsurerPriceSendHistoryGetpage>>> GetPageInsurerPriceeSendHistory(
        [FromBody] NewGetPageViewModel pageViewModel)
    {
        return await insurerPriceLineRepository.GetPageInsurerPriceSendHistory(pageViewModel);
    }

    [HttpPost]
    [Route("sendcentralinsurerprice")]
    [Authenticate(Operation.INS, "InsurerPrice")]
    public async Task<MyResultStatus> SendCentralInsurerPrice([FromBody] string ids)
    {
        var userId = Convert.ToInt16(User.FindFirstValue("UserId"));

        return await insurerPriceLineRepository.SendToCentral(ids, userId);
    }

    [HttpGet]
    [Route("csv")]
    [Authenticate(Operation.VIW, "InsurerPrice")]
    public async Task<ActionResult> Csv(string modelStringify)
    {
        var model = new NewGetPageViewModel();
        model = JsonConvert.DeserializeObject<NewGetPageViewModel>(modelStringify);


        model.CompanyId = UserClaims.GetCompanyId();
        var resultCsv = await insurerPriceLineRepository.Csv(model);
        ;
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "قیمت گذاری بیمه.csv" };
    }


    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "InsurerPrice")]
    public async Task<InsurerPriceLineGetRecord> GetRecordById([FromBody] int id)
    {
        return await insurerPriceLineRepository.GetRecordById(id);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "InsurerPrice")]
    public async Task<MyResultStatus> Insert([FromBody] InsurerPriceLineModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.CreateUserId = UserClaims.GetUserId();
        ;
        return await insurerPriceLineRepository.Insert(model);
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "InsurerPrice")]
    public async Task<MyResultStatus> Update([FromBody] InsurerPriceLineModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.CreateUserId = UserClaims.GetUserId();
        ;
        return await insurerPriceLineRepository.Insert(model);
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "InsurerPrice")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var companyId = UserClaims.GetCompanyId();
        return await insurerPriceLineRepository.Delete(keyvalue, companyId);
    }

    [HttpPost]
    [Route("getserviceinsurercount/{itemTypeId}/{insurerId}/{insurerLineId?}")]
    public async Task<int> GetServiceInsurance(byte itemTypeId, int insurerId, int? insurerLineId)
    {
        return await insurerPriceLineRepository.GetServiceInsurerCount(itemTypeId, insurerId, insurerLineId);
    }


    [HttpGet]
    [Route("calculationmethodidgetlistbyinsurer/{insurerId}/{insurerLineId}/{itemTypeId}")]
    public async Task<List<MyDropDownViewModel>> CalculationMethodIdGetListByInsurer(int insurerId,
        short? insurerLineId, byte itemTypeId)
    {
        return await insurerPriceLineRepository.CalculationMethodIdGetListByInsurer(insurerId, insurerLineId,
            itemTypeId);
    }

    [HttpGet]
    [Route("getitemsinsurerprice/{insurerId}/{insurerLineId}/{itemTypeId}/{insurerPriceCalculationMethodId}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetItemsInsurerPrice(int insurerId, short? insurerLineId,
        byte itemTypeId, byte insurerPriceCalculationMethodId)
    {
        return await insurerPriceLineRepository.GetItemsInsurerPrice(insurerId, insurerLineId, itemTypeId,
            insurerPriceCalculationMethodId);
    }

    [HttpPost]
    [Route("getservicecountcalculationmethodlist")]
    public async Task<List<ServiceCountCalculationMethodViewModel>> GetServiceCountCalculationMethodList(
        CalculationMethodServiceCountViewModel model)
    {
        return await insurerPriceLineRepository.GetServiceCountCalculationMethodList(model);
    }

    [HttpGet]
    [Route("csvcalculationmethod")]
    [Authenticate(Operation.PRN, "InsurerPrice")]
    public async Task<ActionResult> CSVCalculationMethod(string modelStringify)
    {
        var pageViewModel = new NewGetCalculationMethodGetPage();
        pageViewModel = JsonConvert.DeserializeObject<NewGetCalculationMethodGetPage>(modelStringify);

        var resultCsv = await insurerPriceLineRepository.csvCalculationMethod(pageViewModel);

        var csvName = pageViewModel.ItemTypeId == 1 ? "لیست کالا" : "لیست خدمت";

        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = $"{csvName}.csv" };
    }
}

[Route("MC")]
[Authorize]
public class InsurerPriceLineController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "InsurerPrice")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.MC.InsurerPriceLine);
    }
}