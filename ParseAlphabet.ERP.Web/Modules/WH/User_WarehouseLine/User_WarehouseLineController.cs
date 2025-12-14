using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WH.User_WarehouseLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.User_WarehouseLine;

namespace ParseAlphabet.ERP.Web.Modules.WH.User_WarehouseLine;

[Route("api/WH/[controller]")]
[ApiController]
[Authorize]
public class User_WarehouseLineApiController(User_WarehouseLineRepository UserWarehouseRepository) : ControllerBase
{
    [HttpPost]
    [Route("getfilterusersdiassign")]
    public GetColumnsViewModel GetFilterParametersDiAssign()
    {
        return UserWarehouseRepository.GetColumnsDiAssign();
    }

    [HttpPost]
    [Route("getfilterusersassign")]
    public GetColumnsViewModel GetFilterParametersAssign()
    {
        return UserWarehouseRepository.GetColumnsAssign();
    }

    [HttpPost]
    [Route("getPageDiAssign")]
    [Authenticate(Operation.VIW, "User_Warehouse")]
    public async Task<MyResultPage<WarehouseUserLineAssignList>> GetPageDiAssign([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await UserWarehouseRepository.GetPageDiAssigns(model);
    }

    [HttpPost]
    [Route("getPageAssign")]
    [Authenticate(Operation.VIW, "User_Warehouse")]
    public async Task<MyResultPage<WarehouseUserLineAssignList>> GetPageAssign(
        [FromBody] NewGetPageViewModel pageViewModel)
    {
        pageViewModel.CompanyId = UserClaims.GetCompanyId();
        return await UserWarehouseRepository.GetPageAssign(pageViewModel);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "User_Warehouse")]
    public async Task<MyResultPage<WarehouseUserLineGetRecord>> GetRecordBy_VendorUsers(
        [FromBody] Get_WarehouseUserLine model)
    {
        return await UserWarehouseRepository.GetRecordById(model.WarehouseId, model.UserId);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "User_Warehouse")]
    public async Task<MyResultQuery> Insert([FromBody] WarehouseUserLineAssign model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await UserWarehouseRepository.WarehouseUserAssign(model);
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "User_Warehouse")]
    public async Task<MyResultQuery> Delete([FromBody] WarehouseUserLineAssign model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await UserWarehouseRepository.WarehouseUserDiAssign(model);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "User_Warehouse")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await UserWarehouseRepository.Csv(model);
    }
}

[Route("WH")]
[Authorize]
public class User_WarehouseLineController : Controller
{
    [Route("[controller]/{Id}/{Name?}")]
    [HttpGet]
    [Authenticate(Operation.VIW, "User_Warehouse")]
    public ActionResult Index(int Id, string Name)
    {
        return PartialView(Views.WH.User_WarehouseLine);
    }
}