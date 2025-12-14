using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WH.Item_WarehouseLine;
using ParsAlphabet.ERP.Infrastructure.Implantation.GN.User;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.Item_WarehouseLine;

namespace ParseAlphabet.ERP.Web.Modules.WH.Item_WarehouseLine;

[Route("api/WH/[controller]")]
[ApiController]
[Authorize]
public class Item_WarehouseLineApiController(
    Item_WarehouseLineRepository UserWarehouseRepository,
    UserRepository UserRepository)
    : ControllerBase
{
    private readonly UserRepository _UserRepository = UserRepository;


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
    [Authenticate(Operation.VIW, "Item_Warehouse")]
    public async Task<MyResultPage<WarehouseItemLineAssignList>> GetPageDiAssign([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await UserWarehouseRepository.GetPageDiAssigns(model);
    }

    [HttpPost]
    [Route("getPageAssign")]
    [Authenticate(Operation.VIW, "Item_Warehouse")]
    public async Task<MyResultPage<WarehouseItemLineAssignList>> GetPageAssign(
        [FromBody] NewGetPageViewModel pageViewModel)
    {
        pageViewModel.CompanyId = UserClaims.GetCompanyId();
        return await UserWarehouseRepository.GetPageAssign(pageViewModel);
    }


    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "Item_Warehouse")]
    public async Task<MyResultPage<WarehouseItemLineGetRecord>> GetRecordBy_VendorUsers(
        [FromBody] Get_WarehouseItemLine model)
    {
        return await UserWarehouseRepository.GetRecordById(model.WarehouseId ?? 0, model.ItemId ?? 0);
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "Item_Warehouse")]
    public async Task<MyResultStatus> Insert([FromBody] WarehouseItemLineAssign model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();
            model.CreateUserId = UserClaims.GetUserId();
            ;
            return await UserWarehouseRepository.WarehouseItemAssign(model);
        }

        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "Item_Warehouse")]
    public async Task<MyResultQuery> Delete([FromBody] WarehouseItemLineAssign model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        model.CreateUserId = UserClaims.GetUserId();
        ;
        return await UserWarehouseRepository.WarehouseItemDiAssign(model);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "Item_Warehouse")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await UserWarehouseRepository.Csv(model);
    }
}

[Route("WH")]
[Authorize]
public class Item_WarehouseLineController : Controller
{
    [Route("[controller]/{Id}/{Name?}")]
    [HttpGet]
    [Authenticate(Operation.VIW, "Item_Warehouse")]
    public ActionResult Index(int Id, string Name)
    {
        return PartialView(Views.WH.Item_WarehouseLine);
    }
}