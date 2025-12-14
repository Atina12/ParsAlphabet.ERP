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
public class SalesPersonOrderLineApiController : ControllerBase
{
    private readonly ISalesPersonOrderLineRepository _SalesPersonOrderLineRepository;
    private readonly ISalesPersonOrderRepository _SalesPersonOrderRepository;

    public SalesPersonOrderLineApiController(ISalesPersonOrderLineRepository SalesPersonOrderLineRepository,
        ISalesPersonOrderRepository SalesPersonOrderRepository)
    {
        _SalesPersonOrderLineRepository = SalesPersonOrderLineRepository;
        _SalesPersonOrderRepository = SalesPersonOrderRepository;
    }

    #region personOrder

    //[HttpPost]
    //[Route("getpage")]
    //[Authenticate(Operation.VIW,"SalesPersonOrder")]
    //public async Task<MyResultPage<SalesPersonOrderLineGetPage>> GetPage([FromBody]GetPageViewModel model)
    //{
    //    model.CompanyId = int.Parse(User.FindFirstValue("CompanyId"));
    //    return await _SalesPersonOrderLineRepository.Display(model);
    //}

    [HttpPost]
    [Route("update")]
    [Authenticate(Operation.UPD, "SalesPersonOrder")]
    public async Task<MyResultQuery> Update([FromBody] SalesPersonOrderModel model)
    {
        var userid = Convert.ToInt32(User.FindFirstValue("UserId"));
        return await _SalesPersonOrderRepository.UpdateInLine(model);
    }

    #endregion

    #region orderLine

    [HttpPost]
    [Route("getorderlinepage")]
    [Authenticate(Operation.VIW, "SalesPersonOrder")]
    public async Task<MyResultPage<List<PersonOrderLine>>> GetOrderLinePage([FromBody] GetPageViewModel model)
    {
        model.CompanyId = int.Parse(User.FindFirstValue("CompanyId"));
        return await _SalesPersonOrderLineRepository.GetOrderLinePage(model);
    }

    [HttpPost]
    [Route("getrecordbyids")]
    [Authenticate(Operation.VIW, "SalesPersonOrder")]
    public async Task<MyResultPage<SalesPersonOrderLineGetRecord>> GetRecordByIds([FromBody] GetPersonOrderId model)
    {
        return await _SalesPersonOrderLineRepository.GetRecordByIds(model);
    }

    [HttpPost]
    [Route("insertOrderLine")]
    [Authenticate(Operation.INS, "SalesPersonOrder")]
    public async Task<MyResultStatus> InsertOrderLine([FromBody] SalesPersonOrderLineModel model)
    {
        if (ModelState.IsValid)
            return await _SalesPersonOrderLineRepository.Insert(model);
        return ModelState.ToMyResultStatus<int>();
    }

    [HttpPost]
    [Route("updateOrderLine")]
    [Authenticate(Operation.UPD, "SalesPersonOrder")]
    public async Task<MyResultStatus> UpdateOrderLine([FromBody] SalesPersonOrderLineModel model)
    {
        return await _SalesPersonOrderLineRepository.Update(model);
    }

    [HttpPost]
    [Route("deleteOrderLine")]
    [Authenticate(Operation.DEL, "SalesPersonOrder")]
    public async Task<MyResultStatus> DeleteOrderLine([FromBody] GetRecordByIds model)
    {
        return await _SalesPersonOrderLineRepository.DeleteOrderLine($"Id={model.Id}");
    }

    [HttpPost]
    [Route("getOrderLinePrice")]
    [Authenticate(Operation.VIW, "SalesPersonOrder")]
    public async Task<MyResultPage<List<PersonOrderLine>>> GetOrderLinePrice([FromBody] List<TitleValue<long>> model)
    {
        var CompanyId = int.Parse(User.FindFirstValue("CompanyId"));
        return await _SalesPersonOrderLineRepository.GetOrderLinePrice(model, CompanyId);
    }

    #endregion

    #region deliver

    [HttpPost]
    [Route("getdeliverOrderpage")]
    [Authenticate(Operation.VIW, "SalesPersonOrder")]
    public async Task<MyResultPage<List<DeliverOrderGetPage>>> GetDeliverOrderPage(
        [FromBody] List<TitleValue<string>> model)
    {
        var companyId = int.Parse(User.FindFirstValue("CompanyId"));
        return await _SalesPersonOrderLineRepository.GetDeliverOrderPage(model, companyId);
    }

    [HttpPost]
    [Route("getDeliverOrderRecordByIds")]
    [Authenticate(Operation.VIW, "SalesPersonOrder")]
    public async Task<MyResultPage<DeliverOrderGetPage>> GetDeliverOrderRecordByIds([FromBody] GetRecordByIds model)
    {
        return await _SalesPersonOrderLineRepository.GetDeliverOrderRecordByIds(model);
    }

    [HttpPost]
    [Route("deliverOrderInsUp")]
    [Authenticate(Operation.INS, "SalesPersonOrder")]
    public async Task<MyResultStatus> DeliverOrderInsUp([FromBody] DeliverOrderGetPage model)
    {
        return await _SalesPersonOrderLineRepository.DeliverOrderSave(model);
    }

    [HttpPost]
    [Route("deleteDeliverOrder")]
    [Authenticate(Operation.DEL, "SalesPersonOrder")]
    public async Task<MyResultQuery> DeleteDeliverOrder([FromBody] DeliverOrderGetPage model)
    {
        return await _SalesPersonOrderLineRepository.DeleteDeliverOrder(
            $"PersonOrderId={model.HeaderId} AND OrderTypeId={model.OrderTypeId} AND RowNumber={model.RowNumber}");
    }

    #endregion

    #region shipmentOrder

    [HttpPost]
    [Route("getShipMentOrderpage")]
    [Authenticate(Operation.VIW, "SalesPersonOrder")]
    public async Task<MyResultPage<List<ShipMentOrderGetPage>>> GetShipMentOrderPage(
        [FromBody] List<TitleValue<string>> model)
    {
        var companyId = int.Parse(User.FindFirstValue("CompanyId"));
        return await _SalesPersonOrderLineRepository.GetShipMentOrderPage(model, companyId);
    }

    [HttpPost]
    [Route("getShipMentOrderRecordByIds")]
    [Authenticate(Operation.VIW, "SalesPersonOrder")]
    public async Task<MyResultPage<ShipMentOrderGetPage>> GetShipMentOrderRecordByIds([FromBody] GetRecordByIds model)
    {
        return await _SalesPersonOrderLineRepository.GetShipMentOrderRecordByIds(model);
    }

    [HttpPost]
    [Route("shipMentOrderInsUp")]
    [Authenticate(Operation.INS, "SalesPersonOrder")]
    public async Task<MyResultStatus> ShipMentOrderInsUp([FromBody] ShipMentOrderGetPage model)
    {
        return await _SalesPersonOrderLineRepository.ShipMentOrderSave(model);
    }

    [HttpPost]
    [Route("deleteShipMentOrder")]
    [Authenticate(Operation.DEL, "SalesPersonOrder")]
    public async Task<MyResultQuery> DeleteShipMentOrder([FromBody] ShipMentOrderGetPage model)
    {
        return await _SalesPersonOrderLineRepository.DeleteShipMentOrder(
            $"PersonOrderId={model.HeaderId} AND OrderTypeId={model.OrderTypeId} AND RowNumber={model.RowNumber}");
    }

    #endregion

    #region other

    [HttpPost]
    [Route("getfilteritems")]
    public GetColumnsViewModel GetFilterParameters()
    {
        var companyId = Convert.ToInt32(User.FindFirstValue("CompanyId"));
        return _SalesPersonOrderLineRepository.GetHeaderColumns(companyId);
    }

    [HttpPost]
    [Route("getorderlinefilteritems")]
    public GetColumnsViewModel GetOrderLineFilterParameters()
    {
        return _SalesPersonOrderLineRepository.GetOrderLineColumns();
    }

    [HttpPost]
    [Route("csv")]
    [Authenticate(Operation.PRN, "")]
    public async Task<CSVViewModel<IEnumerable>> ExportCsv([FromBody] GetPageViewModel model)
    {
        return await _SalesPersonOrderLineRepository.Csv(model);
    }

    [HttpGet]
    [Route("getdropdown")]
    public async Task<List<MyDropDownViewModel>> GetDropDown()
    {
        var CompanyId = int.Parse(User.FindFirstValue("CompanyId"));
        return await _SalesPersonOrderLineRepository.GetDropDown(CompanyId);
    }

    #endregion
}

[Route("SM")]
[Authorize]
public class SalesPersonOrderLineController : Controller
{
    [Route("[controller]/{Id}/{stageId}/{CurrencyId}")]
    [HttpGet]
    public ActionResult Index(int Id, short stageId, int CurrencyId)
    {
        return PartialView(Views.SM.SalesPersonOrderLine);
    }
}