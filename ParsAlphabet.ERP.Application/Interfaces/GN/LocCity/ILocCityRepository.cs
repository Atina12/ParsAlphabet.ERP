using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.GN.LocCity;

namespace ParsAlphabet.ERP.Application.Interfaces.GN.LocCity;

public interface ILocCityRepository
{
    Task<MyResultPage<List<LocCityGetPage>>> GetPage(GetPageViewModel model);
    Task<MyResultPage<LocCityGetRecord>> GetRecordById(int id);
    Task<MyResultQuery> Insert(LocCityModel model);
    Task<MyResultQuery> Update(LocCityModel model);
    Task<MyResultQuery> Delete(int keyvalue);
    GetColumnsViewModel GetColumns();
    Task<CSVViewModel<IEnumerable>> Csv(GetPageViewModel model);
    Task<List<MyDropDownViewModel>> GetDropDown(short stateId);
    Task<short> GetStateId(short stateId);
}