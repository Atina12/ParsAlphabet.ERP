using ParsAlphabet.ERP.Application.Dtos.GN.Currency;

namespace ParsAlphabet.ERP.Application.Interfaces.GN.Currency;

public interface ICurrencyRepository
{
    Task<MyResultPage<CurrencyGetRecord>> GetRecordById(int id);
    Task<MyResultQuery> Delete(int keyvalue);
    GetColumnsViewModel GetColumns();
    Task<List<MyDropDownViewModel>> GetDropDown();
}