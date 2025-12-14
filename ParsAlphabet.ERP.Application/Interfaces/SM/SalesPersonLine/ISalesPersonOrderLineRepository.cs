using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.SM.SalesPersonLine;

namespace ParsAlphabet.ERP.Application.Interfaces.SM.SalesPersonLine;

public interface ISalesPersonOrderLineRepository
{
    GetColumnsViewModel GetHeaderColumns(int CompanyId);
    GetColumnsViewModel GetOrderLineColumns();

    Task<MyResultPage<List<PersonOrderLine>>> GetOrderLinePage(GetPageViewModel model);

    Task<MyResultPage<SalesPersonOrderLineGetRecord>> GetRecordByIds(GetPersonOrderId model);
    // Task<MyResultPage<List<PersonOrderLine>>> GetOrderLinePrice(List<TitleValue<long>> model,int CompanyId);

    Task<MyResultStatus> Insert(SalesPersonOrderLineModel model);
    Task<MyResultStatus> Update(SalesPersonOrderLineModel model);
    Task<MyResultStatus> DeleteOrderLine(string filter);

    // Task<MyResultPage<List<DeliverOrderGetPage>>> GetDeliverOrderPage(List<TitleValue<string>> model, int companyId);
    Task<MyResultPage<DeliverOrderGetPage>> GetDeliverOrderRecordByIds(GetRecordByIds model);
    Task<MyResultStatus> DeliverOrderSave(DeliverOrderGetPage model);
    Task<MyResultQuery> DeleteDeliverOrder(string Filter);

    //  Task<MyResultPage<List<ShipMentOrderGetPage>>> GetShipMentOrderPage(List<TitleValue<string>> model, int companyId);
    Task<MyResultPage<ShipMentOrderGetPage>> GetShipMentOrderRecordByIds(GetRecordByIds model);
    Task<MyResultStatus> ShipMentOrderSave(ShipMentOrderGetPage model);
    Task<MyResultQuery> DeleteShipMentOrder(string Filter);

    Task<CSVViewModel<IEnumerable>> Csv(GetPageViewModel model);
    Task<List<MyDropDownViewModel>> GetDropDown(int CompanyId);
}