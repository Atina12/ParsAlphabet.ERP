using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.MC.ServiceItemPricing;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.ServiceItemPricing;

namespace ParseAlphabet.ERP.Web.Modules.MC.ServiceItemPricing;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class ServiceItemPricingApiController(ServiceItemPricingRepository serviceItemPricingRepository) : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<ServiceItemPricingGetPage>>> GetPage(
        [FromBody] NewGetServiceItemPricingGetPage pageViewModel)
    {
        pageViewModel.CompanyId = UserClaims.GetCompanyId();
        return await serviceItemPricingRepository.GetPage(pageViewModel);
    }

    [HttpGet]
    [Route("csv")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ActionResult> Csv(string modelStringify)
    {
        var pageViewModel = new NewGetServiceItemPricingGetPage();
        pageViewModel = JsonConvert.DeserializeObject<NewGetServiceItemPricingGetPage>(modelStringify);

        pageViewModel.CompanyId = UserClaims.GetCompanyId();
        var resultCsv = await serviceItemPricingRepository.Csv(pageViewModel);

        var csvName = "قیمت گذاری بیمه";

        if (pageViewModel.ItemTypeId == 1)
            csvName = $"{csvName}_کالا";
        else
            csvName = $"{csvName}_خدمت";

        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = $"{csvName}.csv" };
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<ServiceItemPricingGetRecord> GetRecordById([FromBody] int Id)
    {
        return await serviceItemPricingRepository.GetRecordById(Id);
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int id)
    {
        var companyId = UserClaims.GetCompanyId();
        return await serviceItemPricingRepository.Delete(id, companyId);
    }


    [HttpPost]
    [Route("save")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> Save([FromBody] ServiceItemPricingModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.CreateUserId = UserClaims.GetUserId();
            ;
            return await serviceItemPricingRepository.Save(model);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("updateserviceprice")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultStatus> UpdateServicePrice([FromBody] UpdateServicePriceUpd model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.UserId = UserClaims.GetUserId();
        ;
        return await serviceItemPricingRepository.UpdateServicePrice(model);
    }

    [HttpPost]
    [Route("updateinsurerprice")]
    [Authenticate(Operation.UPD, "InsurerPrice")]
    public async Task<MyResultStatus> UpdateInsurerPrice([FromBody] UpdateInsurerPrice model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.UserId = UserClaims.GetUserId();
        ;
        return await serviceItemPricingRepository.UpdateInsurerPrice(model);
    }

    [HttpPost]
    [Route("updateitemprice")]
    [Authenticate(Operation.UPD, "")]
    public async Task<int> UpdateItemPrice([FromBody] UpdateItemPrice model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.UserId = UserClaims.GetUserId();
        ;
        return await serviceItemPricingRepository.UpdateItemPrice(model);
    }

    [HttpPost]
    [Route("medicalitempriceduplicate")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> DuplicateMedicalItemPrice(MedicalItemPriceDuplicate model)
    {
        model.CreateUserId = UserClaims.GetUserId();
        ;

        return await serviceItemPricingRepository.DuplicateMedicalItemPrice(model);
    }

    [HttpPost]
    [Route("insuranceduplicate")]
    [Authenticate(Operation.INS, "InsurerPrice")]
    public async Task<MyResultStatus> DuplicateInsurance(InsuranceDuplicate model)
    {
        model.UserId = UserClaims.GetUserId();
        ;
        model.CompanyId = UserClaims.GetCompanyId();
        return await serviceItemPricingRepository.DuplicateInsurance(model);
    }

    [HttpPost]
    [Route("medicalitempricesendhistorygetpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<MedicalItemPriceSendHistoryGetpage>>> GetPageMedicalItemPriceSendHistory(
        NewGetPageViewModel pageViewModel)
    {
        return await serviceItemPricingRepository.GetPageMedicalItemPriceSendHistory(pageViewModel);
    }

    [HttpPost]
    [Route("sendcentralmedicalitemprice")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> SendCentralMedicalItemPrice([FromBody] string ids)
    {
        var userId = Convert.ToInt16(User.FindFirstValue("UserId"));

        return await serviceItemPricingRepository.SendToCentral(ids, userId);
    }

    [HttpGet]
    [Route("getdropdown/{itemTypeId}/{insurerTypeId}/{medicalSubjectId?}")]
    public async Task<List<MyDropDownViewModel>> GetDropDown(string? term, byte itemTypeId, byte insurerTypeId,
        byte? medicalSubjectId)
    {
        return await serviceItemPricingRepository.GetDropDown(term, itemTypeId, insurerTypeId, medicalSubjectId);
    }
}

[Route("MC")]
[Authorize]
public class ServiceItemPricingController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return View(Views.MC.ServiceItemPricing);
    }
}