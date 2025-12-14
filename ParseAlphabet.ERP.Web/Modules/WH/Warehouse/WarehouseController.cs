using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WH.Warehouse;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.Warehouse;

namespace ParseAlphabet.ERP.Web.Modules.WH.Warehouse;

[Route("api/WH/[controller]")]
[ApiController]
[Authorize]
public class WarehouseApiController(WarehouseRepository WarehouseRepository) : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<WarehouseGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();

        return await WarehouseRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<WarehouseGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        var result = new MyResultPage<WarehouseGetRecord>
        {
            Data = await WarehouseRepository.GetRecordById<WarehouseGetRecord>(keyvalue, false, "wh")
        };
        return result;
    }

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        return WarehouseRepository.GetColumns();
    }

    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] WarehouseModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();

            return await WarehouseRepository.Insert(model, "wh");
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] WarehouseModel model)
    {
        if (ModelState.IsValid)
        {
            model.CompanyId = UserClaims.GetCompanyId();

            return await WarehouseRepository.Update(model, "wh");
        }

        return ModelState.ToMyResultQuery<int>();
    }


    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int keyvalue)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await WarehouseRepository.Delete(keyvalue, "wh", CompanyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await WarehouseRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown/{branchId?}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDown(int? branchId)
    {
        var filterParam = branchId == null ? "" : $"BranchId = {branchId} AND ";
        var companyId = UserClaims.GetCompanyId();
        var res = await WarehouseRepository.GetDropDown("wh", filterParam + $"CompanyId={companyId} AND IsActive = 1");
        return res;
    }

    [HttpGet]
    [Route("getalldatadropdown/{branchId?}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetAllDataDropDown(int? branchId)
    {
        var filterParam = branchId == null ? "" : $"BranchId = {branchId} AND ";
        var companyId = UserClaims.GetCompanyId();
        var res = await WarehouseRepository.GetDropDown("wh", filterParam + $"CompanyId={companyId} AND IsActive=1");
        return res;
    }

    [HttpGet]
    [Route("getDropDownByUserId/{branchId?}")]
    public async Task<IEnumerable<MyDropDownViewModel>> GetDropDownByUserId(string branchId)
    {
        var userId = UserClaims.GetUserId();
        ;
        var res = await WarehouseRepository.GetDropDownByUserId(userId, branchId);
        return res;
    }
}

[Route("WH")]
[Authorize]
public class WarehouseController : Controller
{
    [Route("[controller]")]
    [Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.WH.Warehouse);
    }
}