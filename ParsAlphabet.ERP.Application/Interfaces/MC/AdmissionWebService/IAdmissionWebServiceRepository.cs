using System.Collections;
using ParsAlphabet.ERP.Application.Dtos.MC.AdmissionWebService;
using ServiceStack;

namespace ParsAlphabet.ERP.Application.Interfaces.MC.AdmissionWebService;

public interface IAdmissionWebServiceRepository
{
    GetColumnsViewModel GetColumnSale();
    GetColumnsViewModel GetColumnReturn();
    Task<CSVViewModel<IEnumerable>> Csv(int AdmissionId, int CompanyId);
    Task<MyResultPage<List<AdmissionReimbursment>>> GetPage(GetPageViewModel model, int SaleTypeId);
    Task<List<Service>> GetAdmissionServiceLineWcf(int Id, int CompanyId);
    Task<List<ServiceLines>> GetAdmissionServiceLines(int AdmissionId, int CompanyId);
    Task<MyResultQuery> UpdateAdmissionServiceHidUpdate(int admissionServiceId, bool resultServise, int userId);
    Task<MyResultQuery> SaveEliminateHid(int admissionServiceId, bool resultServise, int userId);

    Task<List<ServiceByCode>> GetAdmissionServiceByCode(string RuvCodes, int CompanyId);

    //Task<MyResultQuery> SaveInsurerReimbursement(GetInsurerReimbursement_Result model, bool resultServise, int admissionServiceId, int userId);
    //Task<MyResultQuery> SavePatientBill(SavePatientBill_Result model, bool resultServise, int admissionServiceId, int userId);
    Task UpdateResultSavePatientBill(int admissionId, byte saveBillResult);
}