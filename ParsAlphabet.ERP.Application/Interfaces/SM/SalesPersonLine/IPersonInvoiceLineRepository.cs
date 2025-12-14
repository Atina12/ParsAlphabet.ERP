using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.SM.SalesPersonLine;

namespace ParsAlphabet.ERP.Application.Interfaces.SM.SalesPersonLine;

public interface IPersonInvoiceLineRepository
{
    GetColumnsViewModel GetHeaderColumns(int CompanyId);
    GetColumnsViewModel GetInvoiceLineColumns(int CompanyId);

    Task<MyResultPage<PersonInvoiceLineGetPage>> Display(NewGetPageViewModel model);
    Task<MyResultPage<List<InvoiceLines>>> GetInvoiceLinePage(NewGetPageViewModel model);

    Task<MyResultPage<PersonInvoiceLineGetRecord>> GetRecordByIds(GetPersonInvoiceLine model);

    // Task<MyResultPage<List<InvoiceLines>>> GetInvoiceLinePrice(List<TitleValue<long>> model, int CompanyId);
    Task<MyResultQuery> Insert(PersonInvoiceLineModel model);
    Task<MyResultStatus> Update(PersonInvoiceLineModel model);
    Task<MyResultStatus> DeleteInvoiceLine(string Filter);
    Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model);
    Task<List<MyDropDownViewModel>> GetDropDown(int CompanyId);
    Task<MyResultPage<List<PersonOrderList>>> GetPersonOrderList(GetPersonOrderList model);
    Task<MyResultPage<List<PersonOrderLineList>>> GetPersonOrderLineList(GetPersonOrderLineList model);
    Task<MyResultQuery> AllocatePersonOrderLine(AllocatePersonOrderLineList model);
}