using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos._History;
using ParsAlphabet.ERP.Application.Dtos.MC.Service;
using ParsAlphabet.ERP.Application.Interfaces.MC;
using ParsAlphabet.ERP.Infrastructure.Implantation._History;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.Service;

namespace ParseAlphabet.ERP.Web.Modules.MC.Service;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class ServiceApiController(
    ServiceRepository serviceRepository,
    IAdmissionsRepository admissionsRepository,
    HistoryRepository history,
    IHttpContextAccessor accessor)
    : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<ServiceGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await serviceRepository.GetPage(model);
    }

    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    [HttpGet]
    public async Task<ActionResult> ServiceReportExportCsv(string stringedModel)
    {
        var model = JsonConvert.DeserializeObject<NewGetPageViewModel>(stringedModel);
        model.CompanyId = UserClaims.GetCompanyId();
        var resultCsv = await serviceRepository.CSV(model);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "خدمات.csv" };
    }

    [HttpPost]
    [Route("sendcentralservice")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> SendCentralService([FromBody] int id)
    {
        var userId = Convert.ToInt16(User.FindFirstValue("UserId"));

        return await serviceRepository.SendCentralService(id, userId);
    }

    [HttpPost]
    [Route("getpageforinsurer")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<ServiceGetPage>>> GetPageForInsurer([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.Form_KeyValue[0] = "serviceinsurer";
        return await serviceRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getpageforitempricing")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<ServiceGetPage>>> GetPageForItemPricing([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await serviceRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<ServiceGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        var result = new MyResultPage<ServiceGetRecord>
        {
            Data = await serviceRepository.GetRecordById<ServiceGetRecord>(keyvalue, false, "mc")
        };
        if (result.Data.TerminologyId != null && result.Data.TerminologyId != 0)
            result.Data.TerminologyName = await admissionsRepository.GetThrRVUName(result.Data.TerminologyId.Value);

        if (result.Data.TaminTerminologyId != null && result.Data.TaminTerminologyId != 0)
            result.Data.TaminTerminologyName =
                await admissionsRepository.GetTaminServiceName(result.Data.TaminTerminologyId.Value);

        if (result.Data.CdtTerminologyId != null && result.Data.CdtTerminologyId != 0)
            result.Data.CdtTerminologyName =
                await admissionsRepository.GetThrCDTName(result.Data.CdtTerminologyId.Value);

        return result;
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return serviceRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] ServiceModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            var userId = UserClaims.GetUserId();
            ;
            model.CreateUserId = userId;
            model.CreateDateTime = DateTime.Now;
            MyClaim.Init(accessor);
            var ipAdrress = MyClaim.IpAddress;

            var userAgent = new UserAgent(Request.Headers["User-Agent"]);
            var historyModel = new HistoryModel
            {
                ControllerName = nameof(ServiceApiController),
                ActionName = nameof(Insert),
                Browser = userAgent.Browser.NameAndVersion,
                CompanyId = model.CompanyId,
                Description = $@"Id:{model.Id}
                                    _UserId:{userId}
                                    _Name:{model.Name}",
                UserId = userId,
                IpAddress = ipAdrress,
                OperatingSystem = userAgent.OS.NameAndVersion
            };

            var resultHistory = await history.Insert(historyModel);


            return await serviceRepository.Insert(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] ServiceModel model)
    {
        if (ModelState.IsValid)
        {
            var userId = UserClaims.GetUserId();
            ;
            model.CreateUserId = userId;
            model.CreateDateTime = DateTime.Now;
            model.CompanyId = UserClaims.GetCompanyId();

            MyClaim.Init(accessor);
            var ipAdrress = MyClaim.IpAddress;

            var userAgent = new UserAgent(Request.Headers["User-Agent"]);
            var historyModel = new HistoryModel
            {
                ControllerName = nameof(ServiceApiController),
                ActionName = nameof(Insert),
                Browser = userAgent.Browser.NameAndVersion,
                CompanyId = model.CompanyId,
                Description = $@"Id:{model.Id}
                                    _UserId:{userId}
                                    _Name:{model.Name}",
                UserId = userId,
                IpAddress = ipAdrress,
                OperatingSystem = userAgent.OS.NameAndVersion
            };


            return await serviceRepository.Update(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await serviceRepository.Delete(keyvalue, "mc", CompanyId);
    }

    [HttpGet]
    [Route("getdropdown/{isActive?}")]
    public async Task<List<MyDropDownViewModel>> GetDropDown(string? term, byte? isActive = 1)
    {
        var companyId = UserClaims.GetCompanyId();

        return await serviceRepository.GetDropDown(term, isActive, companyId);
    }


    [HttpPost]
    [Route("getservicename")]
    public async Task<string> GetServiceName([FromBody] int id)
    {
        return await serviceRepository.GetServiceName(id);
    }

    [HttpPost]
    [Route("getserviceprice")]
    public async Task<int> GetServicePrice([FromBody] int id)
    {
        return await serviceRepository.GetServicePrice(id);
    }

    [HttpPost]
    [Route("getnationalcode")]
    public async Task<bool> GetNationalCode([FromBody] CheckAttenderNationalCode model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await serviceRepository.GetNationalCode(model);
    }

    [HttpPost]
    [Route("getterminologyinfo")]
    public async Task<TerminologyInfoService> GetTerminologyInfoByServiceId([FromBody] int serviceId)
    {
        return await serviceRepository.GetTerminologyInfoByServiceId(serviceId);
    }


    [HttpPost]
    [Route("updatethirdpartyprice")]
    public async Task<int> UpdateThirdPartyPrice([FromBody] UpdateThirdPartyPrice model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await serviceRepository.UpdateThirdPartyPrice(model);
    }

    [HttpPost]
    [Route("getparameter")]
    public async Task<KParameter> GetKParameter([FromBody] int id)
    {
        return await serviceRepository.GetKParameter(id);
    }

    [HttpPost]
    [Route("getcdtparameter")]
    public async Task<CdtTermonologyParameter> GetCdtParameter([FromBody] int id)
    {
        return await serviceRepository.GetCdtParameter(id);
    }

    [HttpPost]
    [Route("checkexisttaminterminology")]
    public async Task<bool> CheckExistTaminTerminology([FromBody] MyDropDownViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await serviceRepository.CheckExistTaminTerminology(model);
    }

    [HttpPost]
    [Route("gettaminparameter")]
    public async Task<TaminTermonologyParameter> GetTaminParameter([FromBody] int id)
    {
        return await serviceRepository.GetTaminParameter(id);
    }

    [HttpPost]
    [Route("getserviceadmissionlist")]
    [Authenticate(Operation.VIW, "AdmissionReport")]
    public async Task<List<ServiceAdmissionDropDown>> GetServiceAdmissionDropdown(GetServiceAdmissionDropDown model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await serviceRepository.GetServiceAdmissionDropdown(model);
    }

    [HttpPost]
    [Route("getservicethirdparty")]
    public async Task<int> GetServiceThirdParty([FromBody] int identityId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await serviceRepository.GetServiceThirdParty(identityId, companyId);
    }
}

[Route("MC")]
[Authorize]
public class ServiceController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.MC.Service);
    }
}