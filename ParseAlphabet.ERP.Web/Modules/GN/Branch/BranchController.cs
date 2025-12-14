using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ParsAlphabet.ERP.Application.Dtos.GN.Branch;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.Branch;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.Company;

namespace ParseAlphabet.ERP.Web.Modules.GN.Branch;

[Route("api/GN/[controller]")]
[ApiController]
[Authorize]
public class BranchApiController : ControllerBase
{
    private readonly IHttpContextAccessor _accessor;
    private readonly BranchRepository _branchRepository;

    private readonly CompanyRepository _companyRepository;

    public BranchApiController(BranchRepository BranchRepository, CompanyRepository companyRepository
        , IHttpContextAccessor accessor
    )
    {
        _branchRepository = BranchRepository;
        _companyRepository = companyRepository;
        _accessor = accessor;
    }

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<BranchGetPage>>> GetPage([FromBody] NewGetPageViewModel pageViewModel)
    {
        pageViewModel.CompanyId = UserClaims.GetCompanyId();
        return await _branchRepository.GetPage(pageViewModel);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<BranchGetRecordModel>> GetRecordById([FromBody] int keyvalue)
    {
        return await _branchRepository.GetRecordById(keyvalue);
    }

    [HttpPost]
    [Route("sendcentralbranch")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> SendCentralBranch([FromBody] short id)
    {
        var userId = Convert.ToInt16(User.FindFirstValue("UserId"));

        return await _branchRepository.SendCentralBranch(id, userId);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultStatus> Insert([FromBody] BranchModel model)
    {
        var result = new MyResultStatus();
        model.CompanyId = UserClaims.GetCompanyId();
        model.CreateUserId = Convert.ToInt16(User.FindFirstValue("UserId"));

        var BranchCount = await _companyRepository.GetUBranchCount(model.CompanyId);
        var BranchActiveCount = await _branchRepository.GetBranchCount(model.CompanyId);

        if (model.Opr == "Ins")
            if (BranchActiveCount > BranchCount)
            {
                result.Successfull = false;
                result.StatusMessage = "مجاز به ثبت شعبه جدید نمی باشید";
                return result;
            }

        if (ModelState.IsValid)
        {
            MyClaim.Init(_accessor);
            model.IsSecondLang = MyClaim.IsSecondLang;
            model.CompanyId = UserClaims.GetCompanyId();
            return await _branchRepository.Insert(model);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultStatus> Update([FromBody] BranchModel model)
    {
        var result = new MyResultStatus();

        model.CompanyId = UserClaims.GetCompanyId();
        model.CreateUserId = Convert.ToInt16(User.FindFirstValue("UserId"));

        var BranchCount = await _companyRepository.GetUBranchCount(model.CompanyId);
        var BranchActiveCount = await _branchRepository.GetBranchCount(model.CompanyId);


        if (model.Opr == "Ins")
            if (BranchActiveCount > BranchCount)
            {
                result.Successfull = false;
                result.StatusMessage = "مجاز به ثبت شعبه جدید نمی باشید";
                return result;
            }

        if (ModelState.IsValid)
        {
            MyClaim.Init(_accessor);
            model.IsSecondLang = MyClaim.IsSecondLang;

            return await _branchRepository.Update(model);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var companyId = UserClaims.GetCompanyId();
        return await _branchRepository.Delete(keyvalue, companyId);
    }

    [HttpGet]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<ActionResult> ExportCsv(string stringedModel)
    {
        var model = JsonConvert.DeserializeObject<NewGetPageViewModel>(stringedModel);
        model.CompanyId = UserClaims.GetCompanyId();
        var resultCsv = await _branchRepository.CSV(model);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = "خدمات.csv" };
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<List<MyDropDownViewModel>> GetDropDown()
    {
        var CompanyId = UserClaims.GetCompanyId();

        return await _branchRepository.GetDropDown(CompanyId);
    }

    [HttpGet]
    [Route("getactivedropdown")]
    public async Task<List<MyDropDownViewModel>> GetActiveDropDown()
    {
        var CompanyId = UserClaims.GetCompanyId();

        return await _branchRepository.GetActiveBranchDropDown(CompanyId);
    }

    [HttpPost]
    [Route("getbranchlinelist")]
    public async Task<MyResultPage<List<BranchLineGetList>>> GetBranchLineList([FromBody] short id)
    {
        return await _branchRepository.GetBranchLineList(id);
    }

    [HttpGet]
    [Route("getbranchlinetypelist")]
    public async Task<List<MyDropDownViewModel>> GetBranchLineTypeList()
    {
        return await _branchRepository.GetBranchLineTypeList();
    }
}

[Route("GN")]
[Authorize]
public class BranchController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.GN.Branch);
    }
}