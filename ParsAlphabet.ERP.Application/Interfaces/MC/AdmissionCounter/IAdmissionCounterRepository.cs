using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionCounter;

namespace ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionCounter;

public interface IAdmissionCounterRepository
{
    Task<MyResultPage<List<AdmissionCounterGetPage>>> GetPage(NewGetPageViewModel model);
    Task<MyResultPage<AdmissionCounterGetRecord>> GetRecordById(short id, int companyId);
    Task<MyResultPage<AdmissionCounterGetRecord>> GetRecordByUserId(int id, int companyId);
    Task<MyResultQuery> Insert(AdmissionCounterModel model);
    Task<MyResultQuery> Update(AdmissionCounterModel model);
    Task<MyResultQuery> Delete(int keyvalue, int companyId);
    GetColumnsViewModel GetColumns();
    Task<CSVViewModel<IEnumerable>> Csv(NewGetPageViewModel model);
    Task<bool> CheckExistCashier(MyDropDownViewModel model);
    Task<bool> CheckExistCounterUser(MyDropDownViewModel model);
    Task<IEnumerable<MyDropDownViewModel>> GetDropDown(int companyId);
    Task<IEnumerable<AdmissionCounterPosDropDown>> AdmissionCounterPosGetDropDown(int userId);
    Task<short> GetBranchIdByUserId(int id, int companyId);
}