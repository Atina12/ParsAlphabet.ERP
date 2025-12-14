using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.PU.Vendor;
using ParsAlphabet.ERP.Infrastructure.Implantation.PU.Vendor;

namespace ParseAlphabet.ERP.Web.Modules.PU.Vendor;

[Route("api/PU/[controller]")]
[ApiController]
[Authorize]
public class VendorApiController(VendorRepository VendorRepository) : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<VendorGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await VendorRepository.GetPage(model);
    }

    [HttpPost]
    [Route("vendoritemcommission")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<VendorGetPage>>> VendorItemGetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await VendorRepository.GetPage(model, "vendorItemCommission");
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<VendorGetRecordForm>> GetRecordById([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await VendorRepository.GetRecordById(keyvalue, CompanyId);
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return VendorRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] SaveVendor model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await VendorRepository.Insert(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] SaveVendor model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            return await VendorRepository.Update(model);
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int id)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await VendorRepository.Delete(id, CompanyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await VendorRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<List<MyDropDownViewModel>> GetDropDown(string? term)
    {
        var companyId = UserClaims.GetCompanyId();
        return await VendorRepository.GetDropDown(term, companyId);
    }

    [HttpGet]
    [Route("getalldatadropdown")]
    public async Task<List<MyDropDownViewModel>> GetAllDataDropDown(string? term)
    {
        var companyId = UserClaims.GetCompanyId();
        return await VendorRepository.GetAllDataDropDown(term, companyId);
    }

    [HttpGet]
    [Route("getdropdownbygroupid/{groupIds}")]
    public async Task<List<MyDropDownViewModel>> GetDropDownByGroupId(string groupIds)
    {
        var companyId = UserClaims.GetCompanyId();
        return await VendorRepository.GetDropDownByGroupId(groupIds);
    }

    [HttpGet]
    [Route("vendorAccountDetailDropdown")]
    public async Task<List<MyDropDownViewModel>> VendorAccountDetailDropdown()
    {
        var companyId = UserClaims.GetCompanyId();
        return await VendorRepository.VendorAccountDetailGetDropDown(companyId);
    }


    [HttpPost]
    [Route("getnationalcode")]
    public async Task<bool> GetNationalCode([FromBody] MyDropDownViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await VendorRepository.ExistNationalCode(model);
    }

    [HttpGet]
    [Route("getenablevat/{accountDetailId}")]
    public async Task<string> GetAccountDetailVat(int accountDetailId)
    {
        var companyId = UserClaims.GetCompanyId();
        return await VendorRepository.GetaccountDetailEnableVat(accountDetailId, companyId);
    }
}

[Route("PU")]
[Authorize]
public class VendorController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.PU.Vendor);
    }
}