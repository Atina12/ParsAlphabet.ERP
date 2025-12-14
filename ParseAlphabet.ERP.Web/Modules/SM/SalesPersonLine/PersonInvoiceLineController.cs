using System.Collections;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ParsAlphabet.ERP.Application.Dtos.SM.SalesPerson;
using ParsAlphabet.ERP.Application.Dtos.SM.SalesPersonLine;
using ParsAlphabet.ERP.Application.Interfaces.SM.SalesPerson;
using ParsAlphabet.ERP.Application.Interfaces.SM.SalesPersonLine;

namespace ParseAlphabet.ERP.Web.Modules.SM.SalesPersonLine;

[Route("api/SM/[controller]")]
[ApiController]
[Authorize]
public class SalesPersonInvoiceLineApiController : ControllerBase
{
    private readonly IPersonInvoiceLineRepository _PersonInvoiceLineRepository;
    private readonly IPersonInvoiceRepository _PersonInvoiceRepository;

    public SalesPersonInvoiceLineApiController(IPersonInvoiceLineRepository PersonInvoiceLineRepository,
        IPersonInvoiceRepository PersonInvoiceRepository)
    {
        _PersonInvoiceLineRepository = PersonInvoiceLineRepository;
        _PersonInvoiceRepository = PersonInvoiceRepository;
    }

    [HttpPost]
    [Route("getpersonorderlist")]
    [Authenticate(Operation.VIW, "SalesPersonInvoice")]
    public async Task<MyResultPage<List<PersonOrderList>>> GetPersonOrderList([FromBody] GetPersonOrderList model)
    {
        // if (ModelState.IsValid)
        // {
        model.CompanyId = int.Parse(User.FindFirstValue("CompanyId"));
        return await _PersonInvoiceLineRepository.GetPersonOrderList(model);
        //  }
        //  else
        //  {
        // return ModelState.MyResultPage<List>();
        // }     
    }

    [HttpPost]
    [Route("getpersonorderline")]
    [Authenticate(Operation.VIW, "SalesPersonInvoice")]
    public async Task<MyResultPage<List<PersonOrderLineList>>> GetPersonOrderLine(
        [FromBody] GetPersonOrderLineList model)
    {
        // if (ModelState.IsValid)
        // {
        model.CompanyId = int.Parse(User.FindFirstValue("CompanyId"));
        return await _PersonInvoiceLineRepository.GetPersonOrderLineList(model);
        //  }
        //  else
        //  {
        // return ModelState.MyResultPage<List>();
        // }  
    }

    [HttpPost]
    [Route("allocatepersonorderline")]
    [Authenticate(Operation.VIW, "SalesPersonInvoice")]
    public async Task<MyResultQuery> AllocatePersonOrderLine([FromBody] AllocatePersonOrderLineList model)
    {
        // if (ModelState.IsValid)
        // {
        model.CompanyId = int.Parse(User.FindFirstValue("CompanyId"));
        return await _PersonInvoiceLineRepository.AllocatePersonOrderLine(model);
        //  }
        //  else
        //  {
        // return ModelState.MyResultPage<List>();
        // }  
    }

    #region personInvoice

    [HttpPost]
    [Route("getpage")]
    [Authenticate(Operation.VIW, "SalesPersonInvoice")]
    public async Task<MyResultPage<PersonInvoiceLineGetPage>> GetPage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = int.Parse(User.FindFirstValue("CompanyId"));
        return await _PersonInvoiceLineRepository.Display(model);
    }

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "SalesPersonInvoice")]
    public async Task<MyResultQuery> Update([FromBody] PersonInvoiceModel model)
    {
        var userid = Convert.ToInt32(User.FindFirstValue("UserId"));
        model.CompanyId = int.Parse(User.FindFirstValue("CompanyId"));
        return await _PersonInvoiceRepository.UpdateInLine(model, userid);
    }

    #endregion

    #region InvoiceLine

    [HttpPost]
    [Route("getinvoicelinepage")]
    [Authenticate(Operation.VIW, "SalesPersonInvoice")]
    public async Task<MyResultPage<List<InvoiceLines>>> GetInvoiceLinePage([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = int.Parse(User.FindFirstValue("CompanyId"));

        return await _PersonInvoiceLineRepository.GetInvoiceLinePage(model);
    }

    [HttpPost]
    [Route("getrecordbyids")]
    [Authenticate(Operation.VIW, "SalesPersonInvoice")]
    public async Task<MyResultPage<PersonInvoiceLineGetRecord>> GetRecordById([FromBody] GetPersonInvoiceLine model)
    {
        return await _PersonInvoiceLineRepository.GetRecordByIds(model);
    }

    [HttpPost]
    [Route("insertInvoiceLine")]
    [Authenticate(Operation.INS, "SalesPersonInvoice")]
    public async Task<MyResultQuery> InsertInvoiceLine([FromBody] PersonInvoiceLineModel model)
    {
        if (ModelState.IsValid)
            return await _PersonInvoiceLineRepository.Insert(model);
        return ModelState.ToMyResultQuery<int>();
    }

    [HttpPost]
    [Route("updateInvoiceLine")]
    [Authenticate(Operation.UPD, "SalesPersonInvoice")]
    public async Task<MyResultStatus> UpdateInvoiceLine([FromBody] PersonInvoiceLineModel model)
    {
        var userid = Convert.ToInt32(User.FindFirstValue("UserId"));
        model.CompanyId = int.Parse(User.FindFirstValue("CompanyId"));
        return await _PersonInvoiceLineRepository.Update(model);
    }

    [HttpPost]
    [Route("deleteInvoiceLine")]
    [Authenticate(Operation.DEL, "SalesPersonInvoice")]
    public async Task<MyResultStatus> DeleteInvoiceLine([FromBody] PersonInvoiceLineModel model)
    {
        return await _PersonInvoiceLineRepository.DeleteInvoiceLine(
            $"HeaderId={model.HeaderId} AND RowNumber={model.RowNumber}");
    }

    [HttpPost]
    [Route("getInvoiceLinePrice")]
    [Authenticate(Operation.VIW, "SalesPersonInvoice")]
    public async Task<MyResultPage<List<InvoiceLines>>> GetInvoiceLinePrice([FromBody] List<TitleValue<long>> model)
    {
        var CompanyId = int.Parse(User.FindFirstValue("CompanyId"));
        return await _PersonInvoiceLineRepository.GetInvoiceLinePrice(model, CompanyId);
    }

    #endregion

    #region other

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        var companyId = Convert.ToInt32(User.FindFirstValue("CompanyId"));
        return _PersonInvoiceLineRepository.GetHeaderColumns(companyId);
    }

    [HttpPost]
    [Route("getfilterlinefilteritems")]
    public GetColumnsViewModel GetInvoiceLineFilterParameters()
    {
        var companyId = Convert.ToInt32(User.FindFirstValue("CompanyId"));
        return _PersonInvoiceLineRepository.GetInvoiceLineColumns(companyId);
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] NewGetPageViewModel model)
    {
        model.CompanyId = int.Parse(User.FindFirstValue("CompanyId"));
        return await _PersonInvoiceLineRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<List<MyDropDownViewModel>> GetDropDown()
    {
        var CompanyId = int.Parse(User.FindFirstValue("CompanyId"));
        return await _PersonInvoiceLineRepository.GetDropDown(CompanyId);
    }

    #endregion
}

[Route("SM")]
[Authorize]
public class SalesPersonInvoiceLineController : Controller
{
    [Route("[controller]/{Id}/{CurrencyId}")]
    [HttpGet]
    public ActionResult Index(int Id, int CurrencyId)
    {
        return PartialView(Views.SM.PersonInvoiceLine);
    }
}