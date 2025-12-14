using System.Collections;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.WH.ItemBarcode;
using ParsAlphabet.ERP.Infrastructure.Implantation.WH.ItemBarcode;

namespace ParseAlphabet.ERP.Web.Modules.WH.ItemBarcode;

[Route("api/WH/[controller]")]
[ApiController]
[Authorize]
public class ItemBarcodeApiController(
    ItemBarcodeRepository ItemBarcodeRepository,
    IHttpContextAccessor accessor)
    : ControllerBase
{
    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<List<ItemBarcodeGetPage>>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await ItemBarcodeRepository.GetPage(model);
    }

    [HttpPost]
    [Route("getrecordbyid")]
    [Authenticate(Operation.VIW, "")]
    public async Task<MyResultPage<ItemBarcodeGetRecord>> GetRecordById([FromBody] int keyvalue)
    {
        var comapnyId = UserClaims.GetCompanyId();
        return await ItemBarcodeRepository.GetRecordById(keyvalue);
    }


    [HttpPost]
    [Route("insert")]
    [Authenticate(Operation.INS, "")]
    public async Task<MyResultQuery> Insert([FromBody] ItemBarcodeModel model)
    {
        if (ModelState.IsValid)
        {
            var Exist = false;
            MyClaim.Init(accessor);
            if (model.Id == 0)
                Exist = await ItemBarcodeRepository.ExistBarcode(model.Barcode);
            else
                Exist = await ItemBarcodeRepository.ExistBarcodeEdit(model.Barcode, model.Id);
            if (!Exist)
            {
                var result = new MyResultQuery();
                result.Successfull = false;
                result.StatusMessage = "بارکد کالا تکراری می باشد";
                return result;
            }

            model.CreateUserId = UserClaims.GetUserId();
            ;

            model.CreateDateTime = DateTime.Now;
            return await ItemBarcodeRepository.Insert(model, "wh");
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "")]
    public async Task<MyResultQuery> Update([FromBody] ItemBarcodeModel model)
    {
        if (ModelState.IsValid)
        {
            MyClaim.Init(accessor);
            var result = new MyResultQuery();
            result.ValidationErrors = new List<string>();
            var validBarcode = await ItemBarcodeRepository.ValidationBarcode(model);
            if (validBarcode.ListHasRow())
            {
                result.Successfull = false;
                result.ValidationErrors = validBarcode;
            }
            else
            {
                result = await ItemBarcodeRepository.Update(model, "wh");
            }

            return result;
        }

        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("delete")]
    [Authenticate(Operation.DEL, "")]
    public async Task<MyResultQuery> Delete([FromBody] int id)
    {
        var CompanyId = UserClaims.GetCompanyId();
        return await ItemBarcodeRepository.Delete(id, "wh", CompanyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = UserClaims.GetCompanyId();
        return await ItemBarcodeRepository.Csv(model);
    }
}

[Route("WH")]
[Authorize]
public class ItemBarcodeController : Controller
{
    [Route("[controller]")]
    //[Authenticate(Operation.VIW, "")]
    [HttpGet]
    public ActionResult Index()
    {
        return PartialView(Views.WH.ItemBarcode);
    }
}