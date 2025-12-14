using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.MC.ServiceType;

namespace ParsAlphabet.ERP.Application.Interfaces.MC.ServiceType;

public interface IServiceTypeRepository
{
    Task<MyResultPage<List<ServiceTypeGetPage>>> GetPage(GetPageViewModel model);
    Task<MyResultPage<ServiceTypeGetRecord>> GetRecordById(int id);
    Task<MyResultQuery> Insert(ServiceTypeModel model);
    Task<MyResultQuery> Update(ServiceTypeModel model);
    Task<MyResultQuery> Delete(int keyvalue);
    GetColumnsViewModel GetColumns();
    Task<CSVViewModel<IEnumerable>> Csv(GetPageViewModel model);
    Task<List<MyDropDownViewModel>> GetDropDown();
    Task<string> GetName(short id);
}