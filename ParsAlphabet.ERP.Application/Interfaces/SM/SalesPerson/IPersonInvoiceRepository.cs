using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.SM.SalesPerson;

namespace ParsAlphabet.ERP.Application.Interfaces.SM.SalesPerson;

public interface IPersonInvoiceRepository
{
    Task<MyResultPage<List<PersonInvoiceGetPage>>> GetPage(GetPageViewModel model);
    Task<MyResultPage<PersonInvoiceGetRecord>> GetRecordById(int id);
    Task<MyResultQuery> Insert(PersonInvoiceModel model, int UserId);
    Task<MyResultQuery> Update(PersonInvoiceModel model, int UserId);
    Task<MyResultQuery> UpdateInLine(PersonInvoiceModel model, int UserId);
    Task<MyResultStatus> Delete(string Filter, int CompanyId);

    GetColumnsViewModel GetColumns();

    //GetColumnsViewModel AllocationColumns();
    Task<CSVViewModel<IEnumerable>> Csv(GetPageViewModel model);
    //Task<List<MyDropDownViewModel>> GetDropDown();
}