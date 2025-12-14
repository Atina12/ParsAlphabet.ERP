using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.MC.VendorItemPriceLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.MC.VendorItemPriceLine;

namespace ParseAlphabet.ERP.Web.Modules.MC.VendorItemPriceLine;

[Route("api/MC/[controller]")]
[ApiController]
[Authorize]
public class VendorItemPriceLineApiController(VendorItemPriceLineRepository attenderServicePriceLineRepository)
    : ControllerBase
{
    [HttpPost]
    [Route("getfilterdiassign")]
    [Authenticate(Operation.VIW, "VendorItemPrice")]
    public GetColumnsViewModel GetFilterParametersDiAssign()
    {
        return attenderServicePriceLineRepository.GetColumnsDiAssign();
    }

    [HttpPost]
    [Route("getfilterassign")]
    [Authenticate(Operation.VIW, "VendorItemPrice")]
    public GetColumnsViewModel GetFilterParametersAssign()
    {
        return attenderServicePriceLineRepository.GetColumnsAssign();
    }

    [HttpPost]
    [Route("csvassign")]
    [Authenticate(Operation.VIW, "VendorItemPrice")]
    public async Task<CSVViewModel<IEnumerable>> CsvAssign([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        var vendorId = Convert.ToInt32(model.Form_KeyValue[0]);
        return await attenderServicePriceLineRepository.CsvAssign(model);
        ;
    }

    [HttpPost]
    [Route("getpagediassign")]
    [Authenticate(Operation.VIW, "VendorItemPrice")]
    public async Task<MyResultPage<VendorItemPriceDiAssignGetPage>> GetPageDiAssign(
        [FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await attenderServicePriceLineRepository.GetPageDiAssigns(model);
    }

    [HttpPost]
    [Route("getpageassign")]
    [Authenticate(Operation.VIW, "VendorItemPrice")]
    public async Task<MyResultPage<VendorItemPriceAssignGetPage>> GetPageAssign(
        [FromBody] NewGetPageViewModel pageViewModel)
    {
        pageViewModel.CompanyId = UserClaims.GetCompanyId();
        return await attenderServicePriceLineRepository.GetPageAssigns(pageViewModel);
    }

    [HttpPost]
    [Route("save")]
    [Authenticate(Operation.INS, "VendorItemPrice")]
    public async Task<MyResultStatus> Insert([FromBody] VendorItemPriceLineModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.CreateUserId = UserClaims.GetUserId();
        ;
        return await attenderServicePriceLineRepository.VendorItemPriceAssign(model);
    }

    [HttpPost]
    [Route("vendoritemlist")]
    public async Task<List<VendorItemList>> VendorItemList([FromBody] int vendorId)
    {
        return await attenderServicePriceLineRepository.VendorItemGetList(vendorId);
    }

    [Route("csvvendoritemlist/{vendorId}")]
    [Authenticate(Operation.PRN, "VendorItemPrice")]
    [HttpGet]
    public async Task<ActionResult> VendorItemReportExportCsv(int vendorId)
    {
        var resultCsv = await attenderServicePriceLineRepository.CSVVendorItemList(vendorId);
        return new FileStreamResult(resultCsv, "text/csv") { FileDownloadName = $"خدمات تامین کننده{vendorId}.csv" };
    }

    [HttpGet]
    [Route("getdropdown_contracttype")]
    public List<MyDropDownViewModel> GetDropDown_ContractType()
    {
        return attenderServicePriceLineRepository.GetDropDown_ContractType();
    }
}

[Route("MC")]
[Authorize]
public class VendorItemPriceLineController : Controller
{
    [Route("[controller]/{vendorId}/{vendorFullName}")]
    [Authenticate(Operation.VIW, "VendorItemPrice")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.MC.VendorItemPriceLine);
    }
}