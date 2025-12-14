using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.HealthIDOrder;
using ParsAlphabet.ERP.Application.Interfaces._ErrorLog;
using ParsAlphabet.ERP.Application.Interfaces._Setup;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.HealthIDOrder;

namespace ParseAlphabet.ERP.Web.Modules.MC.HealthIDOrder;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class HealthIDOrderApiController : ControllerBase
{
    private readonly HealthIDOrderRepository _healthIDOrderRepository;

    public HealthIDOrderApiController(HealthIDOrderRepository HealthIDOrderRepository,
        IErrorLogRepository errorLogRepository, IHttpContextAccessor accessor,
        IConfiguration configuration, ISetupRepository setupRepository)
    {
        _healthIDOrderRepository = HealthIDOrderRepository;
       
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<HealthIDOrderGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _healthIDOrderRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getpagehealthId")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<GetHealthId>>> GetPageHealthId([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _healthIDOrderRepository.GetPageHealthId(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<HealthIDOrderGetRecord>> GetRecordById([FromBody] short keyvalue)
    {
        return new MyResultPage<HealthIDOrderGetRecord>
        {
            Data = await _healthIDOrderRepository.GetRecordById<HealthIDOrderGetRecord>(keyvalue, false, "mc")
        };
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return _healthIDOrderRepository.GetColumns();
    }

    [HttpPost]
    [Route("getfilterhealthitems")]
    public GetColumnsViewModel GetFilterHealthIdParameters()
    {
        return _healthIDOrderRepository.GetColumnsHealthId();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] HealthIDOrderModel model)
    {
        if (ModelState.IsValid)
        {
            var companyId = UserClaims.GetCompanyId();

            model.CompanyId = companyId;

            return await _healthIDOrderRepository.Insert(model, "mc");
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] HealthIDOrderModel model)
    {
        if (ModelState.IsValid)
        {
            var companyId = UserClaims.GetCompanyId();
            model.CompanyId = companyId;

            return await _healthIDOrderRepository.Update(model, "mc");
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] short keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await _healthIDOrderRepository.Delete(keyvalue, "mc", CompanyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _healthIDOrderRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown()
    {
        var companyId = UserClaims.GetCompanyId();
        return await _healthIDOrderRepository.GetDropDown("mc", $"CompanyId={companyId} ");
    }

    [HttpPost]
    [Route("gethid")]
    [Authenticate(Operation.VIW, "Admission")]
    public async Task<string> GetHID([FromBody] byte insurerId)
    {
        return await _healthIDOrderRepository.GetHid(insurerId);
    }

    [HttpPost]
    [Route("deleteexpiredhid")]
    [Authenticate(Operation.DEL, "Admission")]
    public async Task<MyResultStatus> DeleteExpiredHealthID([FromBody] byte insurerId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _healthIDOrderRepository.DeleteExpiredHID(insurerId, companyId);
    }

    [HttpPost]
    [Route("generatebatchhid")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> GeneratBatchHID([FromBody] byte insurerId)
    {
        var result = new MyResultStatus();
        // با استفاده از ای جدی تعداد را دریافت کرده
        var companyId = UserClaims.GetCompanyId();
        var count = await _healthIDOrderRepository.GetCountGenerateBatchHID(insurerId, companyId);

        if (count == 0)
        {
            result.Successfull = false;
            result.StatusMessage = "در حال حاضر نیاز به درخواست نمیباشد";
            return result;
        }

        //var insurer = new Insurer()
        //{
        //    Id = insurerId.ToString(),
        //    Name = ""
        //};
        //var keyA3 = new WCF_SEPAS(_errorLogRepository, _accessor, _configuration, _setupRepository);

        //var resultGenerate = await keyA3.GenerateBatchHID(insurer, count);

        ////int CompanyId = UserClaims.GetCompanyId();

        //if (resultGenerate.Status == 100)
        //{
        //    var ModelGenerateBatchHID = new GenerateBatchHID
        //    {
        //        InsurerId = insurerId,
        //        ValidDatePersian = resultGenerate.Data.ValidDate,
        //        HIDList = resultGenerate.Data.Id.ToList().Select(s => new HIDList { HID = s }).ToList(),
        //        CompanyId = companyId
        //    };

        //    var resultInsert = await _healthIDOrderRepository.InsertGeneratedBatchHID(ModelGenerateBatchHID);

        //    result.Successfull = true;
        //    result.StatusMessage = resultGenerate.StatusMessage;
        //    return result;
        //}

        //result.Successfull = false;
        //result.StatusMessage = resultGenerate.StatusMessage;
        throw new Exception();
        return result;
    }
}

[Route("MC")]
[Authorize]
public class HealthIDOrderController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return View(Views.MC.HealthIDOrder);
    }
}