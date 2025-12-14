using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.MC.AttenderPrescription;

namespace ParsAlphabet.ERP.Application.Interfaces.MC.AttenderPrescription;

public interface IAttenderPrescriptionRepository
{
    GetColumnsViewModel GetColumns();
    Task<CSVViewModel<IEnumerable>> Csv(GetPageViewModel model);
    Task<MyResultPage<List<AttenderPrescriptionGetPage>>> GetPage(GetPageViewModel model);
    Task<MyResultPage<AttenderPrescriptionGetRecord>> GetRecordBy_AttenderPrescription(Get_AttenderPrescription model);
    Task<MyResultQuery> Save(AttenderPrescriptionModel model);
    Task<List<MyDropDownViewModel>> GetDropDown(int userid, int CompanyId);
    Task<List<short>> GetAttenderIdByUserId(int userid, int CompanyId);
}