using System.Collections;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.FM.CostCenterLine;
using ParsAlphabet.ERP.Application.Interfaces.FM.CostCenterLine;

namespace ParseAlphabet.ERP.Web.Modules.FM.CostCenterLine;

[Route("api/FM/[controller]")]
[ApiController]
public class CostCenterLineApiController : ControllerBase
{
    private readonly ICostCenterLineRepository _costCenterLineRepository;

    public CostCenterLineApiController(ICostCenterLineRepository costCenterLineRepository)
    {
        _costCenterLineRepository = costCenterLineRepository;
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetAssignParameters()
    {
        return _costCenterLineRepository.GetColumns();
    }


    [HttpPost]
    [Route("getfilteritems2")]
    public GetColumnsViewModel GetAssignParameters2()
    {
        return _costCenterLineRepository.GetColumns2();
    }

    [HttpPost]
    [Route("getcostcenterlinediassign")]
    [Authenticate(Operation.VIW, "CostCenter")]
    public async Task<MyResultPage<CostCenterDAssignList>> GetCostCenterLineDiAssign(
        [FromBody] NewGetPageViewModel pageViewModel)
    {
        pageViewModel.CompanyId = UserClaims.GetCompanyId();
        return await _costCenterLineRepository.GetCostCenterLineDiAssign(pageViewModel);
    }


    [HttpPost]
    [Route("deletebycostcenterid")]
    [Authenticate(Operation.DEL, "CostCenter")]
    public async Task<MyResultQuery> DeleteByCostCenterId([FromBody] int keyvalue)
    {
        return await _costCenterLineRepository.DeleteByCostCenterId(keyvalue);
    }


    [HttpPost]
    [Route("getcostcenterlineassign")]
    [Authenticate(Operation.VIW, "CostCenter")]
    public async Task<MyResultPage<CostCenterAssignList>> GetCostCenterLineAssign(
        [FromBody] NewGetPageViewModel pageViewModel)
    {
        pageViewModel.CompanyId = UserClaims.GetCompanyId();
        return await _costCenterLineRepository.GetCostCenterLineAssign(pageViewModel);
    }

    [HttpPost]
    [Route("costcenterlineassign")]
    [Authenticate(Operation.INS, "CostCenter")]
    public async Task<MyResultQuery> CostCenterLineAssign([FromBody] CostCenterLineAssign ViewModel)
    {
        ViewModel.CompanyId = UserClaims.GetCompanyId();
        return await _costCenterLineRepository.CostCenterLineAssign(ViewModel);
    }

    [HttpPost]
    [Route("costcenterlinediassign")]
    [Authenticate(Operation.DEL, "CostCenter")]
    public async Task<MyResultQuery> CostCenterLineDiAssign([FromBody] CostCenterLineAssign ViewModel)
    {
        ViewModel.CompanyId = UserClaims.GetCompanyId();
        return await _costCenterLineRepository.CostCenterLineDiAssign(ViewModel);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "CostCenter")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await _costCenterLineRepository.Csv(model);
    }
}

[Route("FM")]
public class CostCenterLineController : Controller
{
    [Route("[controller]/{Id}/{Name?}")]
    [HttpGet]
    [Authenticate(Operation.VIW, "CostCenter")]
    public ActionResult Index(int Id, string Name)
    {
        return PartialView(Views.FM.CostCenterLine);
    }
}