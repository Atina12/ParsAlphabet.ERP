using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.MC.Service;
using ParsAlphabet.ERP.Application.Dtos.MC.Speciality;

namespace ParsAlphabet.ERP.Application.Interfaces.MC.Speciality;

public interface ISpecialityRepository
{
    GetColumnsViewModel GetColumns();
    Task<CSVViewModel<IEnumerable>> Csv(GetPageViewModel model);
    Task<MyResultPage<List<ServiceGetPage>>> GetPage(GetPageViewModel model);
    Task<MyResultPage<ServiceGetRecord>> GetRecordById(int id);
    Task<MyResultQuery> Insert(SpecialityModel model);
    Task<MyResultQuery> Update(SpecialityModel model);
    Task<MyResultStatus> Delete(int keyvalue);
    Task<List<MyDropDownViewModel>> GetDropDown(string term);
    Task<string> GetServiceName(int id);
    Task<int> GetServicePrice(int id);
    Task<bool> GetNationalCode(CheckAttenderNationalCode model);
    Task<string> GetSpecialityName(int id);
    Task<short> GetThrSpecialityId(int code);
    Task<short> GetSpecialityId(int terminologyId);
}